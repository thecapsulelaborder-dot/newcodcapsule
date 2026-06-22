import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { eq, and, or, ilike, asc, desc, sql } from "drizzle-orm";
import { db } from "../../src/db/index.ts";
import { readDB, writeDB } from "../../src/db.ts";
import { 
  products, 
  productItems, 
  customFields, 
  users, 
  auditLogs, 
  categories,
  formulas,
  dbSnapshots,
  submissions,
  translations,
  configurations,
  customFieldValues,
  dimensions,
  finishes,
  papers,
  workflows
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

const requireRole = (allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
    const user = req.currentUser;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ success: false, error: "Ձեր հասանելիությունը սահմանափակված է (Role constraint violation)." });
    }
    next();
  };
};

router.get("/config", authenticateAdmin, async (req, res) => {
  try {
    const dbData = await readDB();
    res.json({ success: true, db: dbData });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/config", authenticateAdmin, requireRole(["Super Admin", "Manager"]), async (req, res) => {
  try {
    const input = req.body;
    const dbData = await readDB();
    
    const secureConfig = {
      ...dbData,
      categories: input.categories ?? dbData.categories,
      products: input.products ?? dbData.products,
      dimensions: input.dimensions ?? dbData.dimensions,
      finishes: input.finishes ?? dbData.finishes,
      pricingRules: input.pricingRules ?? dbData.pricingRules,
      decorativeBagsPricingRules: input.decorativeBagsPricingRules ?? dbData.decorativeBagsPricingRules,
      papers: input.papers ?? dbData.papers,
      contactSettings: input.contactSettings ?? dbData.contactSettings,
      tiers: input.tiers ?? dbData.tiers,
      discountCodes: input.discountCodes ?? dbData.discountCodes,
      siteTexts: input.siteTexts ?? dbData.siteTexts,
      printingMethods: input.printingMethods ?? dbData.printingMethods,
      bagRibbonHandles: input.bagRibbonHandles ?? dbData.bagRibbonHandles,
      featuredProducts: input.featuredProducts ?? dbData.featuredProducts,
      aiSettings: input.aiSettings ?? dbData.aiSettings,
      paymentMethods: input.paymentMethods ?? dbData.paymentMethods
    };

    await writeDB(secureConfig);
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message });
  }
});

router.post("/change-credentials", authenticateAdmin, requireRole(["Super Admin"]), async (req, res) => {
  const { newUsername, newPassword, newPin } = req.body;
  try {
    const dbData = await readDB();
    if (newUsername) dbData.adminUsername = newUsername.trim();
    if (newPassword) {
      dbData.adminPasswordHash = await bcrypt.hash(newPassword, 12);
    }
    if (newPin) dbData.adminPinHash = crypto.createHash("sha256").update(newPin).digest("hex");

    await writeDB(dbData);
    const token = Buffer.from(`${dbData.adminUsername}:${dbData.adminPasswordHash}`).toString("base64");
    res.json({ success: true, token });
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message });
  }
});

router.post("/import-backup", authenticateAdmin, requireRole(["Super Admin"]), async (req, res) => {
  try {
    const input = req.body;
    if (!input || typeof input !== "object" || !input.categories || !input.pricingRules) {
      throw new Error("Սխալ տվյալների ձևաչափ։ JSON ֆայլը պետք է պարունակի categories և pricingRules բաժինները։");
    }

    await writeDB(input);
    res.json({ success: true, message: "Տվյալների բազան հաջողությամբ վերականգնվել է։" });
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// Products & Catalog Pagination
router.get("/products", authenticateAdmin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 30);
    const offset = (page - 1) * limit;

    const categoryId = req.query.categoryId as string;
    const search = req.query.search as string;
    const sortBy = req.query.sortBy as string || "name";
    const sortOrder = req.query.sortOrder as string || "asc";
    const statusParam = req.query.status as string;

    const conditions: any[] = [];
    if (statusParam) {
      conditions.push(eq(products.status, statusParam));
    }
    if (categoryId) {
      conditions.push(eq(products.categoryId, categoryId));
    }
    if (search) {
      conditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.desc, `%${search}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderByClause = asc(products.name);
    if (sortBy === "createdAt") {
      orderByClause = sortOrder === "desc" ? desc(products.createdAt) : asc(products.createdAt);
    } else if (sortOrder === "desc") {
      orderByClause = desc(products.name);
    }

    const matchedProducts = await db.select()
      .from(products)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(orderByClause);

    const itemsList = await db.select().from(productItems);

    const totalResult = await db.select({ count: sql<number>`count(*)` })
      .from(products)
      .where(whereClause);
    const total = Number(totalResult[0]?.count || 0);

    const merged = matchedProducts.map(p => ({
      ...p,
      items: itemsList.filter(it => it.productId === p.id)
    }));

    res.json({
      success: true,
      products: merged,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get("/custom-fields", authenticateAdmin, async (req, res) => {
  try {
    const fields = await db.select().from(customFields);
    res.json({ success: true, fields });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/custom-fields", authenticateAdmin, requireRole(["Super Admin", "Manager"]), async (req, res) => {
  try {
    const { categoryId, name, label, type, required } = req.body;
    if (!categoryId || !name || !label || !type) {
      return res.status(400).json({ success: false, error: "Category, name, label, and type are required" });
    }

    const [inserted] = await db.insert(customFields).values({
      categoryId,
      name,
      label,
      type,
      required: Boolean(required)
    }).returning();

    res.json({ success: true, field: inserted });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.delete("/custom-fields/:id", authenticateAdmin, requireRole(["Super Admin"]), async (req, res) => {
  try {
    const fid = parseInt(req.params.id);
    await db.delete(customFields).where(eq(customFields.id, fid));
    res.json({ success: true, message: "Dynamic metadata setting field deleted!" });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get("/me", authenticateAdmin, async (req, res) => {
  res.json({ success: true, user: (req as any).currentUser });
});

router.get("/users", authenticateAdmin, requireRole(["Super Admin", "Manager"]), async (req, res) => {
  try {
    const list = await db.select().from(users);
    res.json({ success: true, users: list });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/users/:id/role", authenticateAdmin, requireRole(["Super Admin"]), async (req, res) => {
  try {
    const uid = parseInt(req.params.id);
    const { role } = req.body;
    if (!role) return res.status(400).json({ success: false, error: "Role string required" });

    await db.update(users).set({ role }).where(eq(users.id, uid));
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get("/audit-logs", authenticateAdmin, requireRole(["Super Admin", "Manager"]), async (req, res) => {
  try {
    const logs = await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(100);
    res.json({ success: true, logs });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/categories/:id/publish", authenticateAdmin, requireRole(["Super Admin", "Manager"]), async (req, res) => {
  try {
    const cid = req.params.id;
    await db.update(categories).set({ status: "published" }).where(eq(categories.id, cid));
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/categories/:id/draft", authenticateAdmin, requireRole(["Super Admin", "Manager"]), async (req, res) => {
  try {
    const cid = req.params.id;
    await db.update(categories).set({ status: "draft" }).where(eq(categories.id, cid));
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/products/:id/publish", authenticateAdmin, requireRole(["Super Admin", "Manager"]), async (req, res) => {
  try {
    const pid = req.params.id;
    await db.update(products).set({ status: "Published" }).where(eq(products.id, pid));
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/products/:id/draft", authenticateAdmin, requireRole(["Super Admin", "Manager"]), async (req, res) => {
  try {
    const pid = req.params.id;
    await db.update(products).set({ status: "Draft" }).where(eq(products.id, pid));
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Translation raw endpoints (SQL Table bindings)
router.get("/translations/raw", authenticateAdmin, requireRole(["Super Admin", "Manager", "Translator"]), async (req, res) => {
  try {
    const list = await db.select().from(translations);
    res.json({ success: true, translations: list });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/translations", authenticateAdmin, requireRole(["Super Admin", "Manager", "Translator"]), async (req, res) => {
  try {
    const { key, hy, ru, en, ar, category } = req.body;
    if (!key || !hy || !ru || !en || !ar) {
      return res.status(400).json({ success: false, error: "Key and all four languages are required." });
    }

    const [existing] = await db.select().from(translations).where(eq(translations.key, key)).limit(1);
    if (existing) {
      await db.update(translations).set({ hy, ru, en, ar, category: category || "general" }).where(eq(translations.key, key));
    } else {
      await db.insert(translations).values({ key, hy, ru, en, ar, category: category || "general" });
    }
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.delete("/translations/:id", authenticateAdmin, requireRole(["Super Admin"]), async (req, res) => {
  try {
    const tid = parseInt(req.params.id);
    await db.delete(translations).where(eq(translations.id, tid));
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get("/formulas", authenticateAdmin, async (req, res) => {
  try {
    const list = await db.select().from(formulas);
    res.json({ success: true, formulas: list });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/formulas", authenticateAdmin, requireRole(["Super Admin", "Manager"]), async (req, res) => {
  try {
    const { id, name, target, expression, variables, conditions } = req.body;
    if (!id || !name || !target || !expression) {
      return res.status(400).json({ success: false, error: "Formula ID, target and expression required." });
    }

    const [inserted] = await db.insert(formulas).values({
      id,
      name,
      target,
      expression,
      variables: variables || [],
      conditions: conditions || []
    }).returning();

    res.json({ success: true, formula: inserted });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/formulas/evaluate", authenticateAdmin, async (req, res) => {
  try {
    const { formulaId, inputs } = req.body;
    const [formula] = await db.select().from(formulas).where(eq(formulas.id, String(formulaId))).limit(1);
    if (!formula) return res.status(404).json({ success: false, error: "Formula spec not found" });

    // Dynamic equation parser
    let expr = formula.expression;
    Object.keys(inputs || {}).forEach(k => {
      expr = expr.replace(new RegExp(`\\b${k}\\b`, "g"), String(Number(inputs[k]) || 0));
    });

    try {
      const evaluationResult = Function(`"use strict"; return (${expr})`)();
      res.json({ success: true, result: Number(evaluationResult) || 0 });
    } catch (errEval: any) {
      res.json({ success: false, error: "Evaluation Error: " + errEval.message });
    }
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get("/workflows", authenticateAdmin, async (req, res) => {
  try {
    const list = await db.select().from(workflows);
    res.json({ success: true, workflows: list });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/workflows", authenticateAdmin, requireRole(["Super Admin", "Manager"]), async (req, res) => {
  try {
    const { name, triggerEvent, actions, active } = req.body;
    if (!name || !triggerEvent || !Array.isArray(actions)) {
      return res.status(400).json({ success: false, error: "Name, Trigger Event and Actions array required" });
    }

    const [inserted] = await db.insert(workflows).values({
      name,
      triggerEvent,
      actions,
      active: active !== undefined ? Boolean(active) : true
    }).returning();

    res.json({ success: true, workflow: inserted });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.delete("/workflows/:id", authenticateAdmin, requireRole(["Super Admin"]), async (req, res) => {
  try {
    const wid = parseInt(req.params.id);
    await db.delete(workflows).where(eq(workflows.id, wid));
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/workflows/trigger-test", authenticateAdmin, async (req, res) => {
  res.json({ success: true, message: "Dry-run execution context invoked successfully!" });
});

router.get("/snapshots", authenticateAdmin, requireRole(["Super Admin", "Manager"]), async (req, res) => {
  try {
    const list = await db.select().from(dbSnapshots).orderBy(desc(dbSnapshots.createdAt)).limit(10);
    res.json({ success: true, snapshots: list });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/snapshots", authenticateAdmin, requireRole(["Super Admin", "Manager"]), async (req, res) => {
  try {
    const { description } = req.body;
    const dbData = await readDB();

    const [newSnapshot] = await db.insert(dbSnapshots).values({
      description: description || "Manual backup instance",
      snapshotData: dbData,
      userEmail: (req as any).currentUser?.email || "Super Admin"
    }).returning();

    res.json({ success: true, snapshot: newSnapshot });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/snapshots/:id/rollback", authenticateAdmin, requireRole(["Super Admin"]), async (req, res) => {
  try {
    const sid = parseInt(req.params.id);
    const [snap] = await db.select().from(dbSnapshots).where(eq(dbSnapshots.id, sid)).limit(1);
    if (!snap) return res.status(404).json({ success: false, error: "Snapshot backup not found" });

    const snapData = snap.snapshotData as any;
    if (!snapData) return res.status(400).json({ success: false, error: "Snapshot payload is corrupted or missing" });

    await db.transaction(async (tx) => {
      await tx.delete(productItems);
      await tx.delete(customFieldValues);
      await tx.delete(products);
      await tx.delete(dimensions);
      await tx.delete(finishes);
      await tx.delete(categories);
      await tx.delete(papers);
      await tx.delete(formulas);
      await tx.delete(translations);
      await tx.delete(configurations);

      if (Array.isArray(snapData.configurations)) {
        for (const row of snapData.configurations) {
          await tx.insert(configurations).values(row);
        }
      }
      if (Array.isArray(snapData.categories)) {
        for (const row of snapData.categories) {
          await tx.insert(categories).values(row);
        }
      }
      if (Array.isArray(snapData.products)) {
        for (const row of snapData.products) {
          await tx.insert(products).values(row);
        }
      }
      if (Array.isArray(snapData.productItems)) {
        for (const row of snapData.productItems) {
          await tx.insert(productItems).values(row);
        }
      }
      if (Array.isArray(snapData.dimensions)) {
        for (const row of snapData.dimensions) {
          await tx.insert(dimensions).values(row);
        }
      }
      if (Array.isArray(snapData.finishes)) {
        for (const row of snapData.finishes) {
          await tx.insert(finishes).values(row);
        }
      }
      if (Array.isArray(snapData.papers)) {
        for (const row of snapData.papers) {
          await tx.insert(papers).values(row);
        }
      }
      if (Array.isArray(snapData.formulas)) {
        for (const row of snapData.formulas) {
          await tx.insert(formulas).values(row);
        }
      }
      if (Array.isArray(snapData.translations)) {
        for (const row of snapData.translations) {
          await tx.insert(translations).values(row);
        }
      }
    });

    res.json({ success: true, message: "System state successfully rolled back to " + snap.createdAt });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
