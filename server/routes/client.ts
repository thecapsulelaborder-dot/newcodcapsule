import express from "express";
import bcrypt from "bcrypt";
import { eq, and, ne, desc } from "drizzle-orm";
import { db } from "../../src/db/index.ts";
import { clientAccounts, submissions } from "../../src/db/schema.ts";

const router = express.Router();

router.post("/auth/update-phone", async (req, res) => {
  try {
    const { email, phone } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required." });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const cleanPhone = phone ? phone.trim() : null;

    if (cleanPhone) {
      const [existingPhone] = await db.select().from(clientAccounts).where(and(eq(clientAccounts.phone, cleanPhone), ne(clientAccounts.email, normalizedEmail))).limit(1);
      if (existingPhone) {
        return res.status(400).json({ success: false, error: "This phone number is already linked to another account." });
      }
    }

    const [updated] = await db.update(clientAccounts).set({ phone: cleanPhone }).where(eq(clientAccounts.email, normalizedEmail)).returning();
    if (!updated) {
      return res.status(404).json({ success: false, error: "Account not found." });
    }

    res.json({ 
      success: true, 
      user: { 
        name: updated.name, 
        email: updated.email, 
        phone: updated.phone || "",
        role: updated.role, 
        partnerDiscount: Number(updated.partnerDiscount) || 0, 
        partnerClients: updated.partnerClients || [] 
      } 
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/auth/update-subclients", async (req, res) => {
  try {
    const { email, partnerClients } = req.body;
    if (!email || !Array.isArray(partnerClients)) {
      return res.status(400).json({ success: false, error: "Invalid inputs." });
    }
    const normalizedEmail = email.trim().toLowerCase();
    await db.update(clientAccounts).set({ partnerClients }).where(eq(clientAccounts.email, normalizedEmail));

    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/update-profile", async (req, res) => {
  try {
    const { email, name, company, phone, legalDetails, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required." });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const [user] = await db.select().from(clientAccounts).where(eq(clientAccounts.email, normalizedEmail)).limit(1);
    if (!user) {
      return res.status(404).json({ success: false, error: "User account not found." });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (company !== undefined) updateData.company = company;
    if (phone !== undefined) updateData.phone = phone;
    if (legalDetails !== undefined) updateData.legalDetails = legalDetails;
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 12);
    }

    const [updated] = await db.update(clientAccounts).set(updateData).where(eq(clientAccounts.email, normalizedEmail)).returning();

    res.json({
      success: true,
      user: {
        name: updated.name,
        email: updated.email,
        phone: updated.phone || "",
        company: updated.company || "",
        legalDetails: updated.legalDetails || "",
        role: updated.role,
        partnerDiscount: Number(updated.partnerDiscount) || 0,
        partnerClients: updated.partnerClients || []
      }
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/save-calculation", async (req, res) => {
  try {
    const { email, name, categoryId, calcResult, customInputs } = req.body;
    if (!email || !name || !categoryId || !calcResult) {
      return res.status(400).json({ success: false, error: "All field arguments are required." });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const [user] = await db.select().from(clientAccounts).where(eq(clientAccounts.email, normalizedEmail)).limit(1);
    if (!user) {
      return res.status(404).json({ success: false, error: "User account not found." });
    }

    const currentConfigs = user.savedConfigs || [];
    const newCalc = {
      id: "calc_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now(),
      name,
      categoryId,
      calcResult,
      customInputs: customInputs || {},
      createdAt: new Date().toISOString()
    };

    const updatedConfigs = [...currentConfigs, newCalc];
    await db.update(clientAccounts).set({ savedConfigs: updatedConfigs }).where(eq(clientAccounts.email, normalizedEmail));

    res.json({ success: true, savedConfigs: updatedConfigs });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get("/saved-calculations", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required." });
    }
    const normalizedEmail = (email as string).trim().toLowerCase();
    const [user] = await db.select().from(clientAccounts).where(eq(clientAccounts.email, normalizedEmail)).limit(1);
    if (!user) {
      return res.status(404).json({ success: false, error: "User account not found." });
    }

    res.json({ success: true, savedConfigs: user.savedConfigs || [] });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/delete-calculation", async (req, res) => {
  try {
    const { email, id } = req.body;
    if (!email || !id) {
      return res.status(400).json({ success: false, error: "Email and calculation ID are required." });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const [user] = await db.select().from(clientAccounts).where(eq(clientAccounts.email, normalizedEmail)).limit(1);
    if (!user) {
      return res.status(404).json({ success: false, error: "User account not found." });
    }

    const currentConfigs = user.savedConfigs || [];
    const updatedConfigs = currentConfigs.filter((c: any) => c.id !== id);
    await db.update(clientAccounts).set({ savedConfigs: updatedConfigs }).where(eq(clientAccounts.email, normalizedEmail));

    res.json({ success: true, savedConfigs: updatedConfigs });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get("/shared-calculation/:id", async (req, res) => {
  try {
    const calcId = req.params.id;
    const allUsers = await db.select().from(clientAccounts);
    let foundCalc: any = null;

    for (const u of allUsers) {
      const configs = u.savedConfigs || [];
      const match = configs.find((c: any) => c.id === calcId);
      if (match) {
        foundCalc = match;
        break;
      }
    }

    if (!foundCalc) {
      return res.status(404).json({ success: false, error: "Shared calculation not found." });
    }

    res.json({ success: true, calculation: foundCalc });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const { email, role } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required." });
    }
    const normalizedEmail = (email as string).trim().toLowerCase();

    const [client] = await db.select().from(clientAccounts).where(eq(clientAccounts.email, normalizedEmail)).limit(1);
    const clientPhone = client?.phone ? client.phone.trim() : "";

    const matchPhones = (p1: string, p2: string) => {
      if (!p1 || !p2) return false;
      const c1 = p1.replace(/\D/g, "");
      const c2 = p2.replace(/\D/g, "");
      if (c1.length < 8 || c2.length < 8) return false;
      return c1.slice(-8) === c2.slice(-8);
    };

    let orderList: any[] = [];
    if (role === "Partner") {
      const subClientEmails = (client?.partnerClients || []).map((sc: any) => sc.email?.trim().toLowerCase()).filter(Boolean);
      const subClientPhones = (client?.partnerClients || []).map((sc: any) => sc.phone?.trim()).filter(Boolean);
      
      const allEmails = [normalizedEmail, ...subClientEmails];
      const result = await db.select().from(submissions).orderBy(desc(submissions.ts));
      orderList = result.filter(o => {
        const checkEmail = (o.customerEmail || "").trim().toLowerCase();
        if (allEmails.includes(checkEmail)) return true;
        
        const checkPhone = o.customerPhone || "";
        if (clientPhone && matchPhones(clientPhone, checkPhone)) return true;
        for (const sp of subClientPhones) {
          if (matchPhones(sp, checkPhone)) return true;
        }
        return false;
      });
    } else {
      const result = await db.select().from(submissions).orderBy(desc(submissions.ts));
      orderList = result.filter(o => {
        const checkEmail = (o.customerEmail || "").trim().toLowerCase();
        if (checkEmail === normalizedEmail) return true;
        
        const checkPhone = o.customerPhone || "";
        if (clientPhone && matchPhones(clientPhone, checkPhone)) return true;
        return false;
      });
    }

    // LIST PAGINATION IMPLEMENTATION
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const paginatedList = orderList.slice(offset, offset + limit);

    res.json({ 
      success: true, 
      orders: paginatedList,
      pagination: {
        total: orderList.length,
        page,
        limit,
        pages: Math.ceil(orderList.length / limit)
      }
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
