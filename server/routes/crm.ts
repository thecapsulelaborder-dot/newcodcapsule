import express from "express";
import { eq, desc, and } from "drizzle-orm";
import { db } from "../../src/db/index.ts";
import { readDB, writeDB } from "../../src/db.ts";
import { 
  submissions, 
  customers, 
  orderFiles, 
  workflows, 
  notificationLogs 
} from "../../src/db/schema.ts";

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

// CRM and Order Profile Helpers
async function findOrCreateCustomer(phone: string, name: string) {
  try {
    const cleanedPhone = phone.trim();
    if (!cleanedPhone) return;
    const [existing] = await db.select().from(customers).where(eq(customers.phone, cleanedPhone)).limit(1);
    if (!existing) {
      await db.insert(customers).values({
        phone: cleanedPhone,
        name: name.trim() || "Customer",
        comments: "Customer registered via portal submission",
        isVip: false
      });
      console.log(`👤 Customer CRM Profile created automatically for ${name} (${cleanedPhone})`);
    }
  } catch (err: any) {
    console.warn("Failed to check/create customer profile:", err.message);
  }
}

async function executeWorkflowsForEvent(triggerEvent: string, payload: any) {
  try {
    const activeWfs = await db.select().from(workflows).where(eq(workflows.active, true));
    const matching = activeWfs.filter(w => w.triggerEvent === triggerEvent);
    console.log(`⚙️ Automated Workflow pipeline triggered on "${triggerEvent}". Found ${matching.length} matching rules.`);

    for (const wf of matching) {
      for (const action of wf.actions) {
        if (!action.active) continue;

        let formattedMsg = action.config?.message || action.config?.body || "";
        Object.keys(payload).forEach(key => {
          const val = payload[key] !== null ? String(payload[key]) : "";
          formattedMsg = formattedMsg.replace(new RegExp(`{${key}}`, "g"), val);
        });

        if (action.actionType === "send_whatsapp") {
          await db.insert(notificationLogs).values({
            channel: "whatsapp",
            event: triggerEvent,
            recipient: payload.customerPhone || payload.phone || "",
            messageText: formattedMsg,
            status: "sent"
          });
        } else if (action.actionType === "send_email" && payload.customerEmail) {
          await db.insert(notificationLogs).values({
            channel: "email",
            event: triggerEvent,
            recipient: payload.customerEmail,
            messageText: formattedMsg,
            status: "sent"
          });
        }
      }
    }
  } catch (err: any) {
    console.error("Workflow trigger failure:", err);
  }
}

// 1. GET ALL ORDERS WITH ADVANCED SEARCH, SORTING, FILTERS, AND PAGINATION
router.get("/orders", authenticateAdmin, async (req, res) => {
  try {
    const { search, status, manager, source, sortBy, sortOrder } = req.query;
    let results = await db.select().from(submissions);

    // Filter & Search
    if (search) {
      const s = String(search).toLowerCase();
      results = results.filter(r => 
        r.id.toLowerCase().includes(s) ||
        r.customerName.toLowerCase().includes(s) ||
        r.customerPhone.toLowerCase().includes(s) ||
        (r.customerEmail && r.customerEmail.toLowerCase().includes(s)) ||
        r.details.toLowerCase().includes(s) ||
        (r.manager && r.manager.toLowerCase().includes(s))
      );
    }

    if (status && status !== "all") {
      results = results.filter(r => r.status === status);
    }
    if (manager && manager !== "all") {
      results = results.filter(r => r.manager === manager);
    }
    if (source && source !== "all") {
      results = results.filter(r => r.source === source);
    }

    // Sorting
    const order = sortOrder === "asc" ? 1 : -1;
    if (sortBy === "totalPrice") {
      results.sort((a, b) => (a.totalPrice - b.totalPrice) * order);
    } else if (sortBy === "id") {
      results.sort((a, b) => a.id.localeCompare(b.id) * order);
    } else if (sortBy === "customerName") {
      results.sort((a, b) => a.customerName.localeCompare(b.customerName) * order);
    } else {
      results.sort((a, b) => {
        const tA = new Date(a.ts).getTime();
        const tB = new Date(b.ts).getTime();
        return (tA - tB) * order;
      });
    }

    // PAGINATION IMPLEMENTATION
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const paginatedOrders = results.slice(offset, offset + limit);

    res.json({ 
      success: true, 
      orders: paginatedOrders,
      pagination: {
        total: results.length,
        page,
        limit,
        pages: Math.ceil(results.length / limit)
      }
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 2. REGISTER NEW ORDER MANUALLY
router.post("/orders", authenticateAdmin, async (req, res) => {
  try {
    const input = req.body;
    
    // Simulate seq fallback generator
    let trackNum = Math.floor(Math.random() * 900000) + 100000;
    const trackingCode = `A${trackNum}`;
    const orderId = trackingCode;

    const newOrder = {
      id: orderId,
      ts: new Date().toISOString(),
      type: input.type || "custom",
      customerName: input.customerName || "Customer",
      customerPhone: input.customerPhone || "N/A",
      customerWhatsapp: input.customerWhatsapp || input.customerPhone || "",
      customerEmail: input.customerEmail || "",
      status: input.status || "Новый",
      manager: input.manager || "Unassigned",
      source: input.source || "Website",
      qty: Number(input.qty) || 1,
      details: input.details || "Custom order registered",
      totalPrice: Number(input.totalPrice) || 0,
      itemsList: input.itemsList || [{ name: input.type || "Custom Product", desc: input.details || "", price: Number(input.totalPrice) || 0, qty: Number(input.qty) || 1 }],
      managerComment: input.managerComment || "",
      invoiceCurrency: input.invoiceCurrency || "AMD",
      invoiceAmount: Number(input.invoiceAmount) || Number(input.totalPrice) || 0,
      pdfUrl: "",
      invoiceUrl: "",
      statusHistory: [{ status: input.status || "Новый", ts: new Date().toISOString(), manager: input.manager || "System" }],
      trackingCode: trackingCode
    };

    await db.insert(submissions).values(newOrder);
    await findOrCreateCustomer(newOrder.customerPhone, newOrder.customerName);
    await executeWorkflowsForEvent("on_submission", newOrder);

    res.json({ success: true, order: newOrder });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 3. UPDATE SUBMISSION STATUS / CHANNELS / MILESTONES
router.post("/orders/:id/update", authenticateAdmin, async (req, res) => {
  try {
    const oid = req.params.id;
    const input = req.body;
    const managerUser = (req as any).currentUser?.email || "Manager";

    const [existing] = await db.select().from(submissions).where(eq(submissions.id, oid)).limit(1);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    const updatedData: any = {};
    if (input.status && input.status !== existing.status) {
      updatedData.status = input.status;
      const history = existing.statusHistory as any[] || [];
      history.push({
        status: input.status,
        ts: new Date().toISOString(),
        manager: managerUser
      });
      updatedData.statusHistory = history;
    }

    if (input.manager !== undefined) updatedData.manager = input.manager;
    if (input.managerComment !== undefined) updatedData.managerComment = input.managerComment;
    if (input.managerPhone !== undefined) updatedData.managerPhone = input.managerPhone;
    if (input.estimatedCompletionDate !== undefined) {
      updatedData.estimatedCompletionDate = input.estimatedCompletionDate;
      updatedData.estimatedCompletionUpdatedAt = new Date().toISOString();
    }
    if (input.productionDays !== undefined) updatedData.productionDays = Number(input.productionDays);
    if (input.expectedReadyTs !== undefined) updatedData.expectedReadyTs = input.expectedReadyTs;
    if (input.paymentStatus !== undefined) updatedData.paymentStatus = input.paymentStatus;
    if (input.totalPrice !== undefined) updatedData.totalPrice = Number(input.totalPrice);
    if (input.artworkStatus !== undefined) updatedData.artworkStatus = input.artworkStatus;
    if (input.artworkComment !== undefined) updatedData.artworkComment = input.artworkComment;
    if (input.artworkUrl !== undefined) updatedData.artworkUrl = input.artworkUrl;

    const [updated] = await db.update(submissions).set(updatedData).where(eq(submissions.id, oid)).returning();

    // Trigger state change workflow automation
    if (input.status && input.status !== existing.status) {
      await executeWorkflowsForEvent("on_status_change", updated);
    }

    res.json({ success: true, order: updated });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 4. ADD SPECIFICATION FILE REFERENCE
router.post("/orders/:id/files", authenticateAdmin, async (req, res) => {
  try {
    const submissionId = req.params.id;
    const { fileName, fileUrl, fileType } = req.body;

    if (!fileName || !fileUrl || !fileType) {
      return res.status(400).json({ success: false, error: "Missing file descriptors (fileName, fileUrl, fileType)" });
    }

    const [newFile] = await db.insert(orderFiles).values({
      submissionId,
      fileName,
      fileUrl,
      fileType
    }).returning();

    return res.json({ success: true, file: newFile });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 5. REMOVE SPECIFICATION ATTACHMENT
router.delete("/orders/files/:fileId", authenticateAdmin, async (req, res) => {
  try {
    const fileId = parseInt(req.params.fileId);
    await db.delete(orderFiles).where(eq(orderFiles.id, fileId));
    return res.json({ success: true, message: "Associated file deleted successfully!" });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6. CRM CUSTOMER ANALYTICS LISTING WITH PAGINATION
router.get("/crm", authenticateAdmin, async (req, res) => {
  try {
    const crmProfiles = await db.select().from(customers);
    const allSubmissions = await db.select().from(submissions);

    const customerStats: Record<string, { count: number, totalSpend: number, lastOrderTs: string, firstOrderName: string }> = {};

    for (const order of allSubmissions) {
      const phone = order.customerPhone.trim();
      if (!phone) continue;

      if (!customerStats[phone]) {
        customerStats[phone] = {
          count: 0,
          totalSpend: 0,
          lastOrderTs: "",
          firstOrderName: order.customerName
        };
      }

      customerStats[phone].count += 1;
      customerStats[phone].totalSpend += order.totalPrice || 0;

      const orderDateStr = order.ts;
      if (!customerStats[phone].lastOrderTs || new Date(orderDateStr).getTime() > new Date(customerStats[phone].lastOrderTs).getTime()) {
        customerStats[phone].lastOrderTs = orderDateStr;
      }
    }

    const mergedCRM: any[] = [];
    const accountedPhones = new Set<string>();

    for (const prof of crmProfiles) {
      const phone = prof.phone.trim();
      accountedPhones.add(phone);

      const stats = customerStats[phone] || { count: 0, totalSpend: 0, lastOrderTs: "", firstOrderName: prof.name };
      mergedCRM.push({
        phone,
        name: prof.name || stats.firstOrderName || "Unknown Client",
        comments: prof.comments || "No comments cataloged",
        isVip: prof.isVip,
        ordersCount: stats.count,
        totalSpend: stats.totalSpend,
        lastOrderDate: stats.lastOrderTs,
        avgCheck: stats.count > 0 ? (stats.totalSpend / stats.count) : 0
      });
    }

    for (const phone of Object.keys(customerStats)) {
      if (!accountedPhones.has(phone)) {
        const stats = customerStats[phone];
        mergedCRM.push({
          phone,
          name: stats.firstOrderName || "Unknown Client",
          comments: "No comments cataloged",
          isVip: false,
          ordersCount: stats.count,
          totalSpend: stats.totalSpend,
          lastOrderDate: stats.lastOrderTs,
          avgCheck: stats.totalSpend / stats.count
        });
      }
    }

    // PAGINATION IMPLEMENTATION
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const paginatedCRM = mergedCRM.slice(offset, offset + limit);

    res.json({ 
      success: true, 
      customers: paginatedCRM,
      pagination: {
        total: mergedCRM.length,
        page,
        limit,
        pages: Math.ceil(mergedCRM.length / limit)
      }
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 7. EDIT CRM CLIENT DETAILS OR COMMENTS
router.post("/crm/update", authenticateAdmin, async (req, res) => {
  try {
    const { phone, name, comments, isVip } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: "Phone identifier is required" });
    }

    const cleanedPhone = phone.trim();
    const [existing] = await db.select().from(customers).where(eq(customers.phone, cleanedPhone)).limit(1);

    if (existing) {
      await db.update(customers).set({
        name: name ? name.trim() : existing.name,
        comments: comments !== undefined ? comments : existing.comments,
        isVip: isVip !== undefined ? Boolean(isVip) : existing.isVip,
        updatedAt: new Date()
      }).where(eq(customers.phone, cleanedPhone));
    } else {
      await db.insert(customers).values({
        phone: cleanedPhone,
        name: name ? name.trim() : "Custom CRM Client",
        comments: comments || "",
        isVip: Boolean(isVip)
      });
    }

    res.json({ success: true, message: "CRM Card updated!" });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
