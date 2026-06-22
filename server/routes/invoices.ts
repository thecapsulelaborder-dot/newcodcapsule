import express from "express";
import { eq } from "drizzle-orm";
import { db } from "../../src/db/index.ts";
import { readDB, writeDB } from "../../src/db.ts";
import { submissions, customers } from "../../src/db/schema.ts";

const router = Router();

function Router() {
  return express.Router();
}

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

router.get("/submissions", authenticateAdmin, async (req, res) => {
  try {
    const list = await db.select().from(submissions);

    // PAGINATION IMPLEMENTATION
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const paginatedSubmissions = list.slice(offset, offset + limit);

    res.json({ 
      success: true, 
      submissions: paginatedSubmissions,
      pagination: {
        total: list.length,
        page,
        limit,
        pages: Math.ceil(list.length / limit)
      }
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.delete("/submissions", authenticateAdmin, async (req, res) => {
  try {
    const dbData = await readDB();
    dbData.submissions = [];
    await writeDB(dbData);
    await db.delete(submissions);
    res.json({ success: true, message: "Cleared all order historical logs" });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get("/tracking/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [order] = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);

    if (!order) {
      return res.status(404).json({ success: false, error: "No order matched this tracking code." });
    }

    const [crmProfile] = await db.select().from(customers).where(eq(customers.phone, order.customerPhone)).limit(1);

    res.json({
      success: true,
      order: {
        id: order.id,
        trackingCode: order.trackingCode,
        ts: order.ts,
        status: order.status,
        managerComment: order.managerComment || "",
        type: order.type,
        qty: order.qty,
        totalPrice: order.totalPrice,
        statusHistory: order.statusHistory || [],
        manager: order.manager || "Unassigned",
        isVip: crmProfile?.isVip || false,
        crmComments: crmProfile?.comments || ""
      }
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get("/submissions/:id/invoice-pdf", async (req, res) => {
  try {
    const orderId = req.params.id;
    const [order] = await db.select().from(submissions).where(eq(submissions.id, orderId)).limit(1);
    if (!order) {
      return res.status(404).send("Order not found");
    }

    const formattedDate = new Date(order.ts).toLocaleDateString("hy-AM", { year: "numeric", month: "long", day: "numeric" });
    const dueDays = order.productionDays || 7;
    const dueDate = new Date(new Date(order.ts).getTime() + dueDays * 24 * 60 * 60 * 1000).toLocaleDateString("hy-AM", { year: "numeric", month: "long", day: "numeric" });

    res.send(`
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice #${order.id}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @media print {
            body { background: white; color: black; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body class="bg-gray-50 text-gray-800 p-8">
        <div class="max-w-4xl mx-auto bg-white p-8 border border-gray-200 rounded shadow-sm">
          <div class="flex justify-between items-start border-b border-gray-100 pb-6 mb-6">
            <div>
              <h1 class="text-3xl font-extrabold text-[#E85D24]">CAPSULE CONCEPT</h1>
              <p class="text-sm text-gray-500 mt-1">Yerevan, Armenia • order@capsule.am</p>
              <p class="text-sm text-gray-500">Tel: +374 99 218 090</p>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold uppercase tracking-wide bg-orange-100 text-[#E85D24] px-2.5 py-1 rounded-full">${order.paymentStatus || 'не оплачено'}</span>
              <h2 class="text-xl font-bold mt-3 text-gray-700">INVOICE & QUOTE</h2>
              <p class="text-sm text-gray-500 mt-1">Order Ref: <strong>${order.id}</strong></p>
              <p class="text-sm text-gray-500">Track Code: <strong>${order.trackingCode || 'N/A'}</strong></p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 class="font-bold text-gray-400 uppercase tracking-wider text-xs mb-2">Billed To</h3>
              <p class="font-bold text-gray-900">${order.customerName}</p>
              <p class="text-sm text-gray-600 mt-1">Phone: ${order.customerPhone}</p>
              ${order.customerEmail ? `<p class="text-sm text-gray-600">Email: ${order.customerEmail}</p>` : ""}
            </div>
            <div class="text-right">
              <h3 class="font-bold text-gray-400 uppercase tracking-wider text-xs mb-2">Invoice Details</h3>
              <p class="text-sm text-gray-600">Date Issued: <strong class="text-gray-900">${formattedDate}</strong></p>
              <p class="text-sm text-gray-600">Estimated Ready: <strong class="text-gray-900">${order.estimatedCompletionDate || dueDate}</strong></p>
              <p class="text-sm text-gray-600">Method: <strong class="text-gray-900">IDram & Telcell Transfer</strong></p>
            </div>
          </div>

          <table class="w-full text-left border-collapse mb-8">
            <thead>
              <tr class="bg-gray-100 text-gray-700 text-xs uppercase font-bold border-b border-gray-200">
                <th class="py-3 px-4">Product Category & Specification</th>
                <th class="py-3 px-4 text-center">Qty</th>
                <th class="py-3 px-4 text-right">Unit Price</th>
                <th class="py-3 px-4 text-right">Total Price</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-100 text-sm">
                <td class="py-4 px-4">
                  <p class="font-bold text-gray-900 uppercase">${order.type}</p>
                  <p class="text-xs text-gray-500 mt-1 whitespace-pre-line">${order.details}</p>
                </td>
                <td class="py-4 px-4 text-center font-semibold text-gray-900">${order.qty || 1}</td>
                <td class="py-4 px-4 text-right font-semibold text-gray-600">${Math.round(order.totalPrice / (order.qty || 1))} AMD</td>
                <td class="py-4 px-4 text-right font-bold text-gray-900">${order.totalPrice} AMD</td>
              </tr>
            </tbody>
          </table>

          <div class="flex justify-between items-start pt-4 border-t border-gray-100">
            <div class="text-xs text-gray-400 max-w-sm">
              <p><strong>Note:</strong> Pricing calculations are in Armenian Drams (AMD) inclusive of all processing, material handling, and customization setups. Standard delivery is free inside Yerevan.</p>
            </div>
            <div class="text-right w-64 bg-gray-50 p-4 rounded border border-gray-100">
              <div class="flex justify-between text-sm text-gray-600 mb-1">
                <span>Subtotal:</span>
                <span>${order.totalPrice} AMD</span>
              </div>
              <div class="flex justify-between text-sm text-gray-600 mb-2 pb-2 border-b border-gray-200">
                <span>Tax & Fees:</span>
                <span>0 AMD</span>
              </div>
              <div class="flex justify-between text-lg font-extrabold text-gray-900">
                <span>GRAND TOTAL:</span>
                <span class="text-[#E85D24]">${order.totalPrice} AMD</span>
              </div>
            </div>
          </div>

          <div class="no-print mt-10 pt-6 border-t border-gray-100 flex justify-end gap-3">
            <button onclick="window.print()" class="px-5 py-2 bg-[#E85D24] hover:bg-[#d04c1a] text-white font-semibold rounded text-sm transition-colors cursor-pointer">Print / Save PDF</button>
            <button onclick="window.close()" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded text-sm transition-colors cursor-pointer">Close</button>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (e: any) {
    res.status(500).send("Failed to load invoice pdf");
  }
});

export default router;
