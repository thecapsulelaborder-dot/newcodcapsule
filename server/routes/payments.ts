import express from "express";
import { eq } from "drizzle-orm";
import { db } from "../../src/db/index.ts";
import { submissions, notificationLogs } from "../../src/db/schema.ts";

const router = express.Router();

router.post("/create-invoice", async (req, res) => {
  try {
    const { submissionId, paymentMethod } = req.body;
    if (!submissionId || !paymentMethod) {
      return res.status(400).json({ success: false, error: "Submission ID and payment method required." });
    }

    const [order] = await db.select().from(submissions).where(eq(submissions.id, submissionId)).limit(1);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found." });
    }

    // Update paymentStatus to indicate transit
    await db.update(submissions).set({ paymentStatus: "частично оплачено" }).where(eq(submissions.id, submissionId));

    res.json({
      success: true,
      paymentUrl: `https://simulated-payment-gateway.am/pay?id=${order.id}&method=${paymentMethod}&amount=${order.totalPrice}`,
      orderDetails: {
        id: order.id,
        totalPrice: order.totalPrice,
        paymentMethod
      }
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/callback", async (req, res) => {
  try {
    const { submissionId, status } = req.body;
    if (!submissionId) {
      return res.status(400).json({ success: false, error: "Submission ID required." });
    }

    if (status === "success") {
      await db.update(submissions).set({ 
        paymentStatus: "оплачено", 
        status: "В производстве",
        statusHistory: [
          { status: "Новый", ts: new Date(Date.now() - 5 * 60 * 1000).toISOString(), manager: "System" },
          { status: "В производстве", ts: new Date().toISOString(), manager: "Payment Gateway Callback" }
        ]
      }).where(eq(submissions.id, submissionId));

      // Create log of WhatsApp & Email notification triggers
      const [order] = await db.select().from(submissions).where(eq(submissions.id, submissionId)).limit(1);
      if (order) {
        await db.insert(notificationLogs).values({
          channel: "whatsapp",
          event: "payment_received",
          recipient: order.customerPhone,
          messageText: `Capsule Concept: Վճարումը հաջողությամբ ստացվել է #${order.id} պատվերի համար։ Կարգավիճակ՝ «Արտադրության մեջ է»: Tracking code: ${order.trackingCode}`,
          status: "sent"
        });
        if (order.customerEmail) {
          await db.insert(notificationLogs).values({
            channel: "email",
            event: "payment_received",
            recipient: order.customerEmail,
            messageText: `Capsule Concept Invoice: Payment successfully received for your order #${order.id}. Current Status: In Production.`,
            status: "sent"
          });
        }
      }
    } else {
      await db.update(submissions).set({ paymentStatus: "не оплачено" }).where(eq(submissions.id, submissionId));
    }

    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
