import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { runMigrationAndSeed } from "./src/db/migrateAndSeed.ts";

// Import modular sub-routers
import calculateRouter from "./server/routes/calculate.ts";
import authRouter from "./server/routes/auth.ts";
import clientRouter from "./server/routes/client.ts";
import trackingRouter from "./server/routes/tracking.ts";
import paymentsRouter from "./server/routes/payments.ts";
import aiRouter from "./server/routes/ai.ts";
import crmRouter from "./server/routes/crm.ts";
import whatsappRouter from "./server/routes/whatsapp.ts";
import invoicesRouter from "./server/routes/invoices.ts";
import adminRouter from "./server/routes/admin.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Run initial migrations and seed schemas automatically on boot
  try {
    await runMigrationAndSeed();
    console.log("💾 Database and schema migration and seeding complete.");
  } catch (err) {
    console.warn("⚠️ Migration warning:", err);
  }

  // Set up Express JSON and raw body parsing middleware
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Register modular APIs
  app.use("/api/calculate", calculateRouter);
  app.use("/api", calculateRouter); // Fallback public routes support
  app.use("/api", authRouter);       // Registration, verification, login
  app.use("/api/auth", authRouter);  // Fallback support for ClientCabinet.tsx /api/auth pathing
  app.use("/api/client", clientRouter);
  app.use("/api", clientRouter);     // Backward compatibility on cabinet routes
  app.use("/api", trackingRouter);   // Public tracking, alert controls and reviews
  app.use("/api/payments", paymentsRouter);
  app.use("/api", aiRouter);         // Voice dictation, assistant chatbot logic
  app.use("/api/admin", crmRouter);  // CRM Card metrics and orders
  app.use("/api/admin/whatsapp", whatsappRouter);
  app.use("/api", invoicesRouter);   // PDFs billing invoices and public summary check
  app.use("/api/admin", adminRouter); // Configs, change credentials, snapshots, custom lists

  // Static Frontend assets development vs. production mode reverse proxy
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`🚀 Premium Packaging full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
