import express from "express";
import { desc } from "drizzle-orm";
import { db } from "../../src/db/index.ts";
import { readDB } from "../../src/db.ts";
import { whatsappLogs } from "../../src/db/schema.ts";

const router = express.Router();

// Helper to validate administrator token
const authenticateAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).json({ success: false, error: "Authorization header is missing" });
    return;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ success: false, error: "Bearer token is missing" });
    return;
  }

  const dbConfig = await readDB();
  const expectedToken = Buffer.from(`${dbConfig.adminUsername}:${dbConfig.adminPasswordHash}`).toString("base64");
  if (token === expectedToken) {
    (req as any).currentUser = {
      id: 0,
      uid: "system_admin",
      email: "info@capsule.am",
      role: "Super Admin",
      createdAt: new Date()
    };
    return next();
  }
  res.status(403).json({ success: false, error: "Invalid admin session token or role verification failed" });
};

router.get("/logs", authenticateAdmin, async (req, res) => {
  try {
    const logs = await db.select().from(whatsappLogs).orderBy(desc(whatsappLogs.sentAt));
    res.json({ success: true, logs });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/logs", authenticateAdmin, async (req, res) => {
  try {
    const { customerPhone, messageText, status, manager } = req.body;
    if (!customerPhone || !messageText) {
      return res.status(400).json({ success: false, error: "Customer phone and message body are required" });
    }

    const [newLog] = await db.insert(whatsappLogs).values({
      customerPhone,
      messageText,
      status: status || "Sent",
      manager: manager || "System API"
    }).returning();

    res.json({ success: true, log: newLog });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
