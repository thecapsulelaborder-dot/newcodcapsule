import crypto from "crypto";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { db } from "./db/index.ts";
import {
  categories,
  products,
  productItems,
  dimensions,
  finishes,
  papers,
  printingMethods,
  submissions,
  configurations
} from "./db/schema.ts";
import { eq } from "drizzle-orm";
import { 
  Category, 
  Product, 
  Dimension, 
  Finish, 
  PricingRules, 
  Tier, 
  PaperType, 
  ContactSettings, 
  DiscountCode, 
  OrderSubmission,
  PrintingMethod,
  BagRibbonHandle,
  AISettings,
  PaymentMethod,
  FeaturedProduct
} from "./types";

export interface DatabaseSchema {
  categories: Category[];
  products: Product[];
  dimensions: Dimension[];
  finishes: Finish[];
  pricingRules: PricingRules;
  decorativeBagsPricingRules: PricingRules;
  papers: PaperType[];
  printingMethods?: PrintingMethod[];
  contactSettings: ContactSettings;
  tiers: Tier[];
  submissions: OrderSubmission[];
  adminUsername: string; // admin username
  adminPinHash: string; // sha256 of PIN
  adminPasswordHash: string; // sha256 of admin password
  discountCodes?: DiscountCode[];
  siteTexts?: Record<string, string>;
  bagRibbonHandles?: BagRibbonHandle[];
  featuredProducts?: FeaturedProduct[];
  aiSettings?: AISettings;
  paymentMethods?: PaymentMethod[];
  contactMessages?: any[];
}

export async function readDB(forceFresh = false): Promise<DatabaseSchema> {
  const dbCategories = await db.select().from(categories);
  const dbProducts = await db.select().from(products);
  const dbProductItems = await db.select().from(productItems);
  const dbDimensions = await db.select().from(dimensions);
  const dbFinishes = await db.select().from(finishes);
  const dbPapers = await db.select().from(papers);
  const dbPrintingMethods = await db.select().from(printingMethods);
  const dbSubmissions = await db.select().from(submissions);
  const dbConfigs = await db.select().from(configurations);

  const configMap: Record<string, any> = {};
  for (const c of dbConfigs) {
    configMap[c.key] = c.value;
  }

  // Fallback / dynamic seeding of featuredProducts from capsule_database.json
  if (!configMap["featuredProducts"] || !Array.isArray(configMap["featuredProducts"]) || configMap["featuredProducts"].length === 0) {
    try {
      const dbPath = path.join(process.cwd(), "capsule_database.json");
      if (fs.existsSync(dbPath)) {
        const fileContent = fs.readFileSync(dbPath, "utf-8");
        const jsonDb = JSON.parse(fileContent);
        if (jsonDb && Array.isArray(jsonDb.featuredProducts) && jsonDb.featuredProducts.length > 0) {
          configMap["featuredProducts"] = jsonDb.featuredProducts;
          // Dynamically insert into configurations table
          await db.insert(configurations).values({
            key: "featuredProducts",
            value: jsonDb.featuredProducts
          }).onConflictDoUpdate({
            target: configurations.key,
            set: { value: jsonDb.featuredProducts }
          });
          console.log(`[SEED] Dynamically restored ${jsonDb.featuredProducts.length} featuredProducts into PostgreSQL configurations table.`);
        }
      }
    } catch (err: any) {
      console.error("[SEED_WARNING] Failed fallback loading for featuredProducts:", err.message);
    }
  }

  const productsWithItems = dbProducts.map(p => ({
    id: p.id,
    categoryId: p.categoryId,
    name: p.name,
    desc: p.desc || undefined,
    waText: p.waText || undefined,
    orderNote: p.orderNote || undefined,
    active: p.active,
    materialTags: p.materialTags || [],
    finishingTags: p.finishingTags || [],
    purposeTags: p.purposeTags || [],
    collectionTags: p.collectionTags || [],
    isEco: p.isEco ?? false,
    isNew: p.isNew ?? false,
    isHit: p.isHit ?? false,
    templateType: p.templateType || 'on_demand',
    items: dbProductItems.filter(i => i.productId === p.id).map(i => ({
      id: i.id,
      name: i.name,
      price: i.price,
      unit: i.unit
    }))
  }));

  const adminCreds = configMap["adminCredentials"] || {
    adminUsername: "admin",
    adminPinHash: "d931a74fe3bb28deee7f370e404c97740113e325b75c41335fe7798fbbbb67cc",
    adminPasswordHash: "da16e5260cccb9ab8f1a238ec3f2cbced1ca5f6132ead48ae098dfd975e53a5b"
  };

  if (adminCreds.adminPasswordHash === "da16e5260cccb9ab8f1a238ec3f2cbced1ca5f6132ead48ae098dfd975e53a5b" || !adminCreds.adminPasswordHash.startsWith("$2")) {
    adminCreds.adminPasswordHash = await bcrypt.hash("admin", 12);
  }

  return {
    categories: dbCategories.map(c => ({
      id: c.id,
      name: c.name,
      nameRu: c.nameRu || undefined,
      nameEn: c.nameEn || undefined,
      navLabel: c.navLabel || undefined,
      active: c.active,
      heroTitle: c.heroTitle || undefined,
      heroDesc: c.heroDesc || undefined,
      heroBadge: c.heroBadge || undefined,
      heroSmall: c.heroSmall || undefined,
      ruleChips: c.ruleChips || undefined,
      minQty: c.minQty,
      qtyPresets: (c.qtyPresets as number[]) || undefined,
      icon: c.icon || undefined,
      sortOrder: c.sortOrder,
      status: c.status
    })),
    products: productsWithItems,
    dimensions: dbDimensions.map(d => ({
      id: d.id,
      dim: d.dim,
      w: d.w,
      h: d.h,
      d: d.d,
      active: d.active,
      categoryId: d.categoryId,
      directPriceOverride: d.directPriceOverride || undefined,
      priceMultiplier: d.priceMultiplier || undefined
    })),
    finishes: dbFinishes.map(f => ({
      key: f.key,
      label: f.label,
      icon: f.icon,
      price: f.price,
      active: f.active,
      categoryId: f.categoryId
    })),
    papers: dbPapers.map(p => ({
      id: p.id,
      name: p.name,
      gsm: p.gsm,
      pricePerSqm: p.pricePerSqm,
      active: p.active,
      assignedProducts: p.assignedProducts as string[]
    })),
    printingMethods: dbPrintingMethods.map(pm => ({
      id: pm.id,
      name: pm.name,
      active: pm.active,
      minQty: pm.minQty,
      setupCost: pm.setupCost,
      pricePerUnit: pm.pricePerUnit,
      priceMultiplier: pm.priceMultiplier,
      minW: pm.minW || undefined,
      maxW: pm.maxW || undefined,
      minH: pm.minH || undefined,
      maxH: pm.maxH || undefined,
      minD: pm.minD || undefined,
      maxD: pm.maxD || undefined,
      allowedCategories: pm.allowedCategories as string[],
      allowedMaterials: (pm.allowedMaterials as string[]) || undefined,
      warningMessage: pm.warningMessage || undefined,
      productionDays: pm.productionDays || undefined
    })),
    submissions: dbSubmissions.map(s => ({
      id: s.id,
      ts: s.ts,
      type: s.type,
      customerName: s.customerName,
      customerPhone: s.customerPhone,
      details: s.details,
      totalPrice: s.totalPrice
    })),
    pricingRules: configMap["pricingRules"] || {},
    decorativeBagsPricingRules: configMap["decorativeBagsPricingRules"] || {},
    contactSettings: configMap["contactSettings"] || { whatsapp: "37499218090", email: "order@capsule.am" },
    tiers: configMap["tiers"] || [],
    discountCodes: configMap["discountCodes"] || [],
    siteTexts: configMap["siteTexts"] || {},
    bagRibbonHandles: configMap["bagRibbonHandles"] || [],
    featuredProducts: configMap["featuredProducts"] || [],
    aiSettings: configMap["aiSettings"] || {},
    paymentMethods: configMap["paymentMethods"] || [],
    contactMessages: configMap["contactMessages"] || [],
    adminUsername: adminCreds.adminUsername,
    adminPinHash: adminCreds.adminPinHash,
    adminPasswordHash: adminCreds.adminPasswordHash
  };
}

export async function writeDB(data: DatabaseSchema): Promise<void> {
  await db.transaction(async (tx) => {
    // 1. Categories
    if (data.categories) {
      await tx.delete(categories);
      for (const cat of data.categories) {
        await tx.insert(categories).values({
          id: cat.id,
          name: cat.name,
          nameRu: cat.nameRu || null,
          nameEn: cat.nameEn || null,
          navLabel: cat.navLabel || null,
          active: cat.active !== false,
          heroTitle: cat.heroTitle || null,
          heroDesc: cat.heroDesc || null,
          heroBadge: cat.heroBadge || null,
          heroSmall: cat.heroSmall || null,
          ruleChips: cat.ruleChips || null,
          minQty: typeof cat.minQty === "number" ? cat.minQty : 100,
          qtyPresets: cat.qtyPresets || null,
          icon: cat.icon || null,
          sortOrder: typeof cat.sortOrder === "number" ? cat.sortOrder : 0,
          status: cat.status || "published"
        });
      }
    }

    // 2. Products and items
    if (data.products) {
      await tx.delete(productItems);
      await tx.delete(products);
      for (const prod of data.products) {
        await tx.insert(products).values({
          id: prod.id,
          categoryId: prod.categoryId,
          name: prod.name,
          desc: prod.desc || null,
          waText: prod.waText || null,
          orderNote: prod.orderNote || null,
          active: prod.active !== false,
          status: "published",
          materialTags: prod.materialTags || [],
          finishingTags: prod.finishingTags || [],
          purposeTags: prod.purposeTags || [],
          collectionTags: prod.collectionTags || [],
          isEco: prod.isEco ?? false,
          isNew: prod.isNew ?? false,
          isHit: prod.isHit ?? false,
          templateType: prod.templateType || 'on_demand'
        });

        if (Array.isArray(prod.items)) {
          for (const item of prod.items) {
            await tx.insert(productItems).values({
              id: item.id,
              productId: prod.id,
              name: item.name,
              price: Number(item.price) || 0,
              unit: item.unit || "հատ",
              active: true
            });
          }
        }
      }
    }

    // 3. Dimensions
    if (data.dimensions) {
      await tx.delete(dimensions);
      for (const dim of data.dimensions) {
        await tx.insert(dimensions).values({
          id: dim.id,
          dim: dim.dim,
          w: Number(dim.w) || 0,
          h: Number(dim.h) || 0,
          d: Number(dim.d) || 0,
          active: dim.active !== false,
          categoryId: dim.categoryId,
          directPriceOverride: dim.directPriceOverride != null ? Number(dim.directPriceOverride) : null,
          priceMultiplier: dim.priceMultiplier != null ? Number(dim.priceMultiplier) : null
        });
      }
    }

    // 4. Finishes
    if (data.finishes) {
      await tx.delete(finishes);
      for (const fin of data.finishes) {
        await tx.insert(finishes).values({
          key: fin.key,
          label: fin.label,
          icon: fin.icon,
          price: Number(fin.price) || 0,
          active: fin.active !== false,
          categoryId: fin.categoryId
        });
      }
    }

    // 5. Papers
    if (data.papers) {
      await tx.delete(papers);
      for (const pap of data.papers) {
        await tx.insert(papers).values({
          id: pap.id,
          name: pap.name,
          gsm: Number(pap.gsm) || 0,
          pricePerSqm: Number(pap.pricePerSqm) || 0,
          active: pap.active !== false,
          assignedProducts: pap.assignedProducts || []
        });
      }
    }

    // 6. Printing Methods
    if (data.printingMethods) {
      await tx.delete(printingMethods);
      for (const pm of data.printingMethods) {
        await tx.insert(printingMethods).values({
          id: pm.id,
          name: pm.name,
          active: pm.active !== false,
          minQty: Number(pm.minQty) || 50,
          setupCost: Number(pm.setupCost) || 0,
          pricePerUnit: Number(pm.pricePerUnit) || 0,
          priceMultiplier: Number(pm.priceMultiplier) || 1.0,
          minW: pm.minW != null ? Number(pm.minW) : null,
          maxW: pm.maxW != null ? Number(pm.maxW) : null,
          minH: pm.minH != null ? Number(pm.minH) : null,
          maxH: pm.maxH != null ? Number(pm.maxH) : null,
          minD: pm.minD != null ? Number(pm.minD) : null,
          maxD: pm.maxD != null ? Number(pm.maxD) : null,
          allowedCategories: pm.allowedCategories || [],
          allowedMaterials: pm.allowedMaterials || null,
          warningMessage: pm.warningMessage || null,
          productionDays: pm.productionDays != null ? Number(pm.productionDays) : 5
        });
      }
    }

    // 7. Submissions
    if (data.submissions) {
      await tx.delete(submissions);
      for (const sub of data.submissions) {
        await tx.insert(submissions).values({
          id: sub.id,
          ts: String(sub.ts),
          type: sub.type,
          customerName: sub.customerName || "N/A",
          customerPhone: sub.customerPhone || "N/A",
          details: sub.details || "",
          totalPrice: Number(sub.totalPrice) || 0
        });
      }
    }

    // 8. Key-Value configurations
    const configsToSave = [
      { key: "pricingRules", value: data.pricingRules || {} },
      { key: "decorativeBagsPricingRules", value: data.decorativeBagsPricingRules || {} },
      { key: "contactSettings", value: data.contactSettings || {} },
      { key: "tiers", value: data.tiers || [] },
      { key: "discountCodes", value: data.discountCodes || [] },
      { key: "siteTexts", value: data.siteTexts || {} },
      { key: "bagRibbonHandles", value: data.bagRibbonHandles || [] },
      { key: "featuredProducts", value: data.featuredProducts || [] },
      { key: "aiSettings", value: data.aiSettings || {} },
      { key: "paymentMethods", value: data.paymentMethods || [] },
      { key: "contactMessages", value: data.contactMessages || [] },
      { key: "adminCredentials", value: {
          adminUsername: data.adminUsername || "admin",
          adminPinHash: data.adminPinHash || "",
          adminPasswordHash: data.adminPasswordHash || ""
        }
      }
    ];

    for (const conf of configsToSave) {
      await tx.insert(configurations).values({
        key: conf.key,
        value: conf.value
      }).onConflictDoUpdate({
        target: configurations.key,
        set: { value: conf.value }
      });
    }
  });
}

export function hashPIN(pin: string): string {
  return crypto.createHash("sha256").update(pin).digest("hex");
}
