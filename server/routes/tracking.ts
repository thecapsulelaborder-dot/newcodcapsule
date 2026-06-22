import express from "express";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../../src/db/index.ts";
import { readDB, writeDB } from "../../src/db.ts";
import { 
  submissions, 
  orderFiles, 
  customerReviews, 
  notificationPreferences, 
  auditLogs 
} from "../../src/db/schema.ts";

const router = express.Router();

// Local cache for security rate limits and public expiring tokens
const trackingAttempts = new Map<string, { count: number; lastAttempt: number }>();
const trackingTokens = new Map<string, { submissionId: string; expiresAt: number }>();

// GET helper to validate administrator token
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

router.post("/track-order", async (req, res) => {
  try {
    const clientIp = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1") as string;
    const attempt = trackingAttempts.get(clientIp) || { count: 0, lastAttempt: 0 };
    const now = Date.now();

    // Expire attempts after 5 minutes
    if (attempt.count >= 8 && now - attempt.lastAttempt < 5 * 60 * 1000) {
      await db.insert(auditLogs).values({
        userId: "anonymous",
        userEmail: "customer-portal",
        action: "TRACK_SECURITY_BLOCKED",
        tableName: "submissions",
        recordId: "REPEATED_ATTEMPTS",
        newValue: { ip: clientIp, attemptCount: attempt.count }
      });
      return res.status(429).json({
        success: false,
        error: "Too many tracking attempts (Anti-Bruteforce active). Please wait 5 minutes."
      });
    }

    const { trackingCode, phone, trackingToken } = req.body;
    let found: any = null;

    // 1. Authenticate with Expiring Public Token if provided
    if (trackingToken) {
      const tokenData = trackingTokens.get(trackingToken);
      if (tokenData && tokenData.expiresAt > now) {
        const [sub] = await db.select().from(submissions).where(eq(submissions.id, tokenData.submissionId)).limit(1);
        if (sub) {
          found = sub;
        }
      }
    }

    // 2. Authenticate with Code + Phone (and handle verification limits) or just Code
    if (!found) {
      if (!trackingCode) {
        return res.status(400).json({ success: false, error: "Tracking code is required." });
      }

      const allSubs = await db.select().from(submissions);

      if (phone && phone.trim() !== "") {
        const cleanInputPhone = phone.trim().replace(/[^0-9]/g, "");

        found = allSubs.find(sub => {
          const codeMatches = (sub.trackingCode && sub.trackingCode.trim().toUpperCase() === trackingCode.trim().toUpperCase()) ||
                              (sub.id && sub.id.trim().toUpperCase() === trackingCode.trim().toUpperCase()) ||
                              (sub.id && sub.id.trim().toUpperCase().endsWith(trackingCode.trim().toUpperCase()));
          if (!codeMatches) return false;

          const cleanSubPhone = (sub.customerPhone || "").trim().replace(/[^0-9]/g, "");
          if (!cleanSubPhone || cleanSubPhone.length < 4) return true; // Bypass phone validation if order phone isn't recorded or not standard
          return cleanSubPhone.endsWith(cleanInputPhone) || cleanInputPhone.endsWith(cleanSubPhone);
        });
      } 
      
      // If not found with phone filter, fallback to matching by ID or Tracking Code alone
      if (!found) {
        found = allSubs.find(sub => {
          return (sub.trackingCode && sub.trackingCode.trim().toUpperCase() === trackingCode.trim().toUpperCase()) ||
                 (sub.id && sub.id.trim().toUpperCase() === trackingCode.trim().toUpperCase()) ||
                 (sub.id && sub.id.trim().toUpperCase().endsWith(trackingCode.trim().toUpperCase()));
        });
      }

      if (!found) {
        // Increment brute-force attempts
        trackingAttempts.set(clientIp, { count: attempt.count + 1, lastAttempt: now });

        await db.insert(auditLogs).values({
          userId: "anonymous",
          userEmail: "customer-portal",
          action: "TRACK_LOOKUP_FAILED",
          tableName: "submissions",
          recordId: trackingCode || "UNKNOWN",
          newValue: { ip: clientIp, attemptInput: { trackingCode, phoneSuffix: phone?.slice(-4) } }
        });

        return res.json({ success: false, error: "Order not found. Please verify your Tracking Code." });
      }

      // Reset failed attempts on successful match
      trackingAttempts.set(clientIp, { count: 0, lastAttempt: now });
    }

    // Generate a new Expiring Public Token (valid for 1 Hour)
    const newToken = "cc_token_" + crypto.randomBytes(24).toString("hex");
    trackingTokens.set(newToken, {
      submissionId: found.id,
      expiresAt: now + (60 * 60 * 1000) // 1 Hour lifespan
    });

    // Write secure audit logs for tracking view
    await db.insert(auditLogs).values({
      userId: "customer",
      userEmail: found.customerEmail || "customer@portal",
      action: "TRACK_LOOKUP_SUCCESS",
      tableName: "submissions",
      recordId: found.id,
      newValue: { ip: clientIp, trackingCode: found.trackingCode }
    });

    // Retrieve files associated with this order from PostgreSQL
    const files = await db.select().from(orderFiles).where(eq(orderFiles.submissionId, found.id));

    // Retrieve reviews associated with this order from PostgreSQL
    const [review] = await db.select().from(customerReviews).where(eq(customerReviews.submissionId, found.id)).limit(1);

    // Retrieve notification preferences
    let [prefs] = await db.select().from(notificationPreferences).where(eq(notificationPreferences.submissionId, found.id)).limit(1);
    if (!prefs) {
      // Insert default layout
      const [newPrefs] = await db.insert(notificationPreferences).values({
        submissionId: found.id,
        whatsapp: false,
        email: false,
        telegram: false
      }).returning();
      prefs = newPrefs;
    }

    return res.json({
      success: true,
      trackingToken: newToken,
      tokenExpiresAt: now + (60 * 60 * 1000),
      order: {
        id: found.id,
        trackingCode: found.trackingCode,
        ts: found.ts,
        status: found.status,
        managerComment: found.managerComment || "",
        type: found.type,
        qty: found.qty,
        totalPrice: found.totalPrice,
        statusHistory: found.statusHistory || [],
        manager: found.manager || "Unassigned",
        expectedReadyTs: found.expectedReadyTs || "",
        estimatedCompletionDate: found.estimatedCompletionDate || found.expectedReadyTs || "",
        estimatedCompletionUpdatedAt: found.estimatedCompletionUpdatedAt || "",
        productionDays: found.productionDays || 5,
        managerPhone: found.managerPhone || "",
        artworkStatus: found.artworkStatus || "нет макета",
        artworkComment: found.artworkComment || "",
        artworkUrl: found.artworkUrl || "",
        files: files || [],
        review: review || null,
        notificationPreferences: prefs || { whatsapp: false, email: false, telegram: false }
      }
    });
  } catch (err: any) {
    console.error("Tracking order failed:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Notifications preference update
router.post("/track-order/notifications", async (req, res) => {
  try {
    const { trackingCode, phone, whatsapp, email, telegram } = req.body;
    const allSubs = await db.select().from(submissions);
    const cleanInputPhone = phone.trim().replace(/[^0-9]/g, "");

    const found = allSubs.find(sub => {
      const codeMatches = sub.trackingCode && sub.trackingCode.trim().toUpperCase() === trackingCode.trim().toUpperCase();
      if (!codeMatches) return false;
      const cleanSubPhone = (sub.customerPhone || "").trim().replace(/[^0-9]/g, "");
      return cleanSubPhone.endsWith(cleanInputPhone) || cleanInputPhone.endsWith(cleanSubPhone);
    });

    if (!found) {
      return res.status(401).json({ success: false, error: "Unauthorized preference modification requested." });
    }

    const [existing] = await db.select().from(notificationPreferences).where(eq(notificationPreferences.submissionId, found.id)).limit(1);

    if (existing) {
      await db.update(notificationPreferences).set({
        whatsapp: !!whatsapp,
        email: !!email,
        telegram: !!telegram
      }).where(eq(notificationPreferences.submissionId, found.id));
    } else {
      await db.insert(notificationPreferences).values({
        submissionId: found.id,
        whatsapp: !!whatsapp,
        email: !!email,
        telegram: !!telegram
      });
    }

    return res.json({ success: true, message: "Omnichannel alerts settings updated on database!" });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Star Rating & Satisfaction feedback review
router.post("/track-order/review", async (req, res) => {
  try {
    const { trackingCode, phone, rating, comment } = req.body;
    const allSubs = await db.select().from(submissions);
    const cleanInputPhone = phone.trim().replace(/[^0-9]/g, "");

    const found = allSubs.find(sub => {
      const codeMatches = sub.trackingCode && sub.trackingCode.trim().toUpperCase() === trackingCode.trim().toUpperCase();
      if (!codeMatches) return false;
      const cleanSubPhone = (sub.customerPhone || "").trim().replace(/[^0-9]/g, "");
      return cleanSubPhone.endsWith(cleanInputPhone) || cleanInputPhone.endsWith(cleanSubPhone);
    });

    if (!found) {
      return res.status(401).json({ success: false, error: "Unauthorized review submission requested." });
    }

    const ratingNum = Math.min(Math.max(1, parseInt(rating) || 5), 5);

    await db.insert(customerReviews).values({
      submissionId: found.id,
      rating: ratingNum,
      comment: comment || ""
    });

    await db.insert(auditLogs).values({
      userId: "customer",
      userEmail: found.customerEmail || "customer@portal",
      action: "CUSTOMER_REVIEW_SUBMITTED",
      tableName: "customer_reviews",
      recordId: found.id,
      newValue: { rating: ratingNum, comment }
    });

    return res.json({ success: true, message: "We appreciate your feedback! Saved beautifully to PostgreSQL." });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Artwork Proofing Approval / Revision Actions
router.post("/track-order/artwork-action", async (req, res) => {
  try {
    const { trackingCode, phone, action, comment } = req.body;
    const allSubs = await db.select().from(submissions);
    const cleanInputPhone = phone.trim().replace(/[^0-9]/g, "");

    const found = allSubs.find(sub => {
      const codeMatches = sub.trackingCode && sub.trackingCode.trim().toUpperCase() === trackingCode.trim().toUpperCase();
      if (!codeMatches) return false;
      const cleanSubPhone = (sub.customerPhone || "").trim().replace(/[^0-9]/g, "");
      return cleanSubPhone.endsWith(cleanInputPhone) || cleanInputPhone.endsWith(cleanSubPhone);
    });

    if (!found) {
      return res.status(401).json({ success: false, error: "Unauthorized proofing response." });
    }

    const newArtworkStatus = action === "approve" ? "утвержден" : "на доработке";
    const userFriendlyStatusText = action === "approve" ? "Макет утвержден клиентом" : "Макет отправлен на доработку";

    // Append status history
    let history = found.statusHistory as any[] || [];
    history.push({
      status: userFriendlyStatusText,
      ts: new Date().toISOString(),
      manager: "Customer"
    });

    await db.update(submissions).set({
      artworkStatus: newArtworkStatus,
      artworkComment: comment || "",
      statusHistory: history
    }).where(eq(submissions.id, found.id));

    await db.insert(auditLogs).values({
      userId: "customer",
      userEmail: found.customerEmail || "customer@portal",
      action: "CUSTOMER_ARTWORK_PROOF_" + action.toUpperCase(),
      tableName: "submissions",
      recordId: found.id,
      newValue: { artworkStatus: newArtworkStatus, comment }
    });

    return res.json({ success: true, artworkStatus: newArtworkStatus, statusHistory: history, message: "Response registered in PostgreSQL!" });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Contact Support Submission
router.post("/contact-message", async (req, res) => {
  try {
    const input = req.body;
    const dbData = await readDB();

    const newMessage = {
      id: "msg_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      name: input.name || "Anonymous",
      contact: input.contact || "Unspecified",
      message: input.message || "",
      ts: new Date().toISOString()
    };

    if (!dbData.contactMessages) dbData.contactMessages = [];
    dbData.contactMessages.unshift(newMessage);

    await writeDB(dbData);
    res.json({ success: true, message: newMessage });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get("/contact-messages", authenticateAdmin, async (req, res) => {
  try {
    const dbData = await readDB();
    res.json({ success: true, messages: dbData.contactMessages || [] });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
