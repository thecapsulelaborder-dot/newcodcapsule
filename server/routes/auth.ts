import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../../src/db/index.ts";
import { readDB } from "../../src/db.ts";
import { clientAccounts } from "../../src/db/schema.ts";

const router = express.Router();

router.post("/client/register", async (req, res) => {
  try {
    const { name, company, email, password, role, phone } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: "Please fill all required fields." });
    }
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check duplicate
    const [existing] = await db.select().from(clientAccounts).where(eq(clientAccounts.email, normalizedEmail)).limit(1);
    if (existing) {
      return res.status(400).json({ success: false, error: "This email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [newAccount] = await db.insert(clientAccounts).values({
      name,
      company: company || "",
      email: normalizedEmail,
      phone: phone ? phone.trim() : null,
      passwordHash,
      role: role || "Client",
      partnerDiscount: role === "Partner" ? 15.0 : 0.0,
      partnerClients: [],
      authProvider: "email"
    }).returning();

    res.json({ 
      success: true, 
      user: { 
        name: newAccount.name, 
        email: newAccount.email, 
        phone: newAccount.phone || "",
        company: newAccount.company || "",
        legalDetails: newAccount.legalDetails || "",
        role: newAccount.role, 
        partnerDiscount: newAccount.partnerDiscount, 
        partnerClients: newAccount.partnerClients 
      } 
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/client/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Please enter email and password." });
    }
    const normalizedEmail = email.trim().toLowerCase();

    const [existing] = await db.select().from(clientAccounts).where(eq(clientAccounts.email, normalizedEmail)).limit(1);
    if (!existing) {
      return res.status(400).json({ success: false, error: "Invalid email or password." });
    }

    let isMatch = false;
    if (existing.passwordHash.startsWith("$2b$") || existing.passwordHash.startsWith("$2a$")) {
      isMatch = await bcrypt.compare(password, existing.passwordHash);
    } else {
      // Fallback or legacy SHA-256 upgrade
      const oldHash = crypto.createHash("sha256").update(password).digest("hex");
      if (existing.passwordHash === oldHash) {
        isMatch = true;
        // Automigrate to secure bcrypt representation
        try {
          const newBcryptHash = await bcrypt.hash(password, 12);
          await db.update(clientAccounts).set({ passwordHash: newBcryptHash }).where(eq(clientAccounts.id, existing.id));
        } catch (migrateErr) {
          console.error("Failed to migrate client legacy SHA-256 hash:", migrateErr);
        }
      }
    }

    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Invalid email or password." });
    }

    res.json({ 
      success: true, 
      user: { 
        name: existing.name, 
        email: existing.email, 
        phone: existing.phone || "",
        company: existing.company || "",
        legalDetails: existing.legalDetails || "",
        role: existing.role, 
        partnerDiscount: Number(existing.partnerDiscount) || 0, 
        partnerClients: existing.partnerClients || [] 
      } 
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/client/google", async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: "Google email is required." });
    }
    const normalizedEmail = email.trim().toLowerCase();

    let [existing] = await db.select().from(clientAccounts).where(eq(clientAccounts.email, normalizedEmail)).limit(1);
    if (!existing) {
      // Automatically register Google user as Client
      [existing] = await db.insert(clientAccounts).values({
        name: name || email.split("@")[0],
        email: normalizedEmail,
        role: "Client",
        partnerDiscount: 0.0,
        partnerClients: [],
        authProvider: "google"
      }).returning();
    }

    res.json({ 
      success: true, 
      user: { 
        name: existing.name, 
        email: existing.email, 
        phone: existing.phone || "",
        company: existing.company || "",
        legalDetails: existing.legalDetails || "",
        role: existing.role, 
        partnerDiscount: Number(existing.partnerDiscount) || 0, 
        partnerClients: existing.partnerClients || [] 
      } 
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/client/recover-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required." });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const [existing] = await db.select().from(clientAccounts).where(eq(clientAccounts.email, normalizedEmail)).limit(1);
    if (!existing) {
      return res.status(400).json({ success: false, error: "No account found with this email." });
    }

    const tempOtp = "CCS-" + Math.floor(1000 + Math.random() * 9000);
    await db.update(clientAccounts).set({ otpCode: tempOtp, otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000) }).where(eq(clientAccounts.id, existing.id));

    console.log(`[SIMULATED RECOVERY EMAIL SENT TO ${normalizedEmail}] Reset Code is: ${tempOtp}`);
    res.json({ success: true, simulatedOtp: tempOtp });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/client/reset-password", async (req, res) => {
  try {
    const { email, otpCode, newPassword } = req.body;
    if (!email || !otpCode || !newPassword) {
      return res.status(400).json({ success: false, error: "All arguments are required." });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const [existing] = await db.select().from(clientAccounts).where(eq(clientAccounts.email, normalizedEmail)).limit(1);
    if (!existing || existing.otpCode !== otpCode) {
      return res.status(400).json({ success: false, error: "Invalid password reset code." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await db.update(clientAccounts).set({ passwordHash, otpCode: null }).where(eq(clientAccounts.id, existing.id));

    res.json({ success: true, message: "Your password has been reset successfully." });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const dbData = await readDB();
    if (!username || !password) {
      res.status(400).json({ success: false, error: "Username and password are required" });
      return;
    }
    
    const isMatch = username.trim() === dbData.adminUsername && (await bcrypt.compare(password, dbData.adminPasswordHash));
    if (isMatch) {
      const token = Buffer.from(`${dbData.adminUsername}:${dbData.adminPasswordHash}`).toString("base64");
      res.json({ success: true, token });
    } else {
      res.status(403).json({ success: false, error: "Սխալ օգտանուն կամ գաղտնաբառ։" });
    }
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
