import { readDB } from "./db";
import { PricingRules, DiscountCode } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// SAFE PACKAGING CALCULATOR UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
export function safeNormalizeNumber(val: any, fallback = 0): number {
  if (val === undefined || val === null) return fallback;
  const num = Number(val);
  return isNaN(num) || !isFinite(num) ? fallback : num;
}

export function safeQty(qty: any, fallbackMin = 1): number {
  const q = safeNormalizeNumber(qty, fallbackMin);
  return Math.max(fallbackMin, q);
}

export function safeDimensions(val: any, fallback = 2, min = 2, max = 300): number {
  const d = safeNormalizeNumber(val, fallback);
  return Math.max(min, Math.min(max, d));
}

export function safeDivide(numerator: number, denominator: number, fallback = 0): number {
  const num = safeNormalizeNumber(numerator, 0);
  const den = safeNormalizeNumber(denominator, 0);
  if (den === 0) return fallback;
  const res = num / den;
  return isFinite(res) ? res : fallback;
}

// ─────────────────────────────────────────────────────────────────────────────
// SHEET LAYOUT ENGINE  (70×100 cm press sheet)
// ─────────────────────────────────────────────────────────────────────────────
const SHEET_W = 70; // cm
const SHEET_H = 100; // cm
const WASTE_FACTOR = 1.20; // +20 % waste
const MARGIN_GAP = 0.3; // 3 mm gutter between items

/**
 * How many items fit in one orientation?
 */
function fitsInSheet(itemW: number, itemH: number): number {
  if (itemW <= 0 || itemH <= 0) return 0;
  const cols = Math.floor(safeDivide(SHEET_W, itemW + MARGIN_GAP, 0));
  const rows = Math.floor(safeDivide(SHEET_H, itemH + MARGIN_GAP, 0));
  return cols * rows;
}

/**
 * Returns sheet layout calculation including proper orientation and waste margins.
 * Handles large items by calculating multiple sheets per item.
 */
function calculateLayout(flatW: number, flatH: number, qty: number): { perSheet: number; sheetsPerItem: number; totalSheets: number } {
  const normal = fitsInSheet(flatW, flatH);
  const rotated = fitsInSheet(flatH, flatW);
  let perSheet = Math.max(normal, rotated);
  let sheetsPerItem = 1.0;
  
  if (perSheet <= 0) {
    perSheet = 1;
    const areaRatio = safeDivide(flatW * flatH, SHEET_W * SHEET_H, 0);
    sheetsPerItem = Math.ceil(areaRatio);
  }
  
  // Calculate sheets with 20% waste factor safely
  const totalSheets = Math.ceil(safeDivide(qty, perSheet, 1) * sheetsPerItem * WASTE_FACTOR);
  return {
    perSheet,
    sheetsPerItem,
    totalSheets: Math.max(1, totalSheets)
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Bag flat-cut area in m² (paper area needed per bag) */
export function getArea(w: number, h: number, d: number): number {
  // Standard paper-bag net (unfolded flat area)
  const flatW = 2 * w + 2 * d + 4; // +4 cm for glue flap
  const flatH = h + d / 2 + 8;     // +8 cm for top fold & bottom patch
  return safeDivide(flatW * flatH, 10000, 0);   // cm² → m²
}

/** Scale factor relative to a "standard" A4-ish size (0.338 m²) */
export function getScale(w: number, h: number, d: number): number {
  const area = getArea(w, h, d);
  return Math.max(0.55, Math.min(2.5, safeDivide(area, 0.338, 1)));
}

/** Round up to nearest 10 AMD */
function roundAMD(value: number): number {
  return Math.ceil(value / 10) * 10;
}

/** Find tier multiplier (discount) for a given quantity */
function getTierMult(qty: number, tiers: { qty: number; mult: number }[]): number {
  const sorted = [...tiers].sort((a, b) => b.qty - a.qty);
  for (const t of sorted) {
    if (qty >= t.qty) return t.mult;
  }
  return 1.0;
}

/** Get base markup multiplier based on database rules */
function getBaseMultiplier(rules: any): number {
  if (rules && rules.profitMarginPercent !== undefined && rules.profitMarginPercent !== null) {
    return 1 + (Number(rules.profitMarginPercent) / 100);
  }
  const markup = rules && rules.markup !== undefined ? rules.markup : 1.4;
  const margin = rules && rules.margin !== undefined ? rules.margin : 1.2;
  const disc = rules && rules.disc !== undefined ? rules.disc : 1.0;
  return markup * margin * disc;
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

export interface CalculationInput {
  productKey: string;      // "bags" | "boxes"
  paperId?: string;        // dynamic paper selection
  w?: number;
  h?: number;
  d?: number;
  sizeIndex?: number;      // standard size index
  gsm: number;             // fallback gsm
  lamination: "matte" | "gloss" | "none" | string;
  handle: string;          // "cord" | "ribbon" | "silk_ribbon" | "cotton" | "none"
  ribbonWidthPrice?: number;
  colors: number;          // 1 | 2 | 4
  sides: number;           // 1 | 2
  method: "auto" | "digital" | "offset" | string;
  design: "ready" | "help";
  finishes: string[];
  qty: number;
  appliedDiscountCode?: string;
}

export interface CalculationResult {
  success: boolean;
  unitCost: number;           // production cost per item (AMD)
  unitPrice: number;          // selling price per item (AMD)
  totalPrice: number;         // total order price (AMD)
  profit: number;             // total profit (AMD)
  profitPercentage: number;   // profit % rounded to 1 decimal
  savings: number;            // savings vs base tier (AMD)
  quantityDiscount: number;   // savings/discount due to quantity
  discountAmount: number;     // promo code discount
  isCustom: boolean;
  dimensionsText: string;
  qty: number;
  designFeeApplied: number;
  printingMethodUsed: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// BAGS & DECORATIVE BAGS CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────

export async function calculateBagsPrice(input: CalculationInput): Promise<CalculationResult> {
  const db = await readDB();

  // ── Category & minimum quantity ──────────────────────────────────────────
  const categoryId = input.productKey || "bags";
  const category = db.categories.find(c => c.id === categoryId);
  const minRequiredQty = category ? category.minQty : 300;
  const qty = Number(input.qty) || minRequiredQty;

  if (qty < minRequiredQty) {
    throw new Error(`Նվազագույն պատվերն այս կատեգորիայի համար ${minRequiredQty} հատ է։`);
  }

  // ── Pricing rules (category-specific) ────────────────────────────────────
  const rules = db.pricingRules;

  // ── Dimensions ───────────────────────────────────────────────────────────
  let w = 0, h = 0, d = 0;
  let isCustom = true;
  let dimensionsText = "";
  let directPriceOverride: number | undefined = undefined;
  let sizeMultiplier: number | undefined = undefined;

  const categoryDimensions = db.dimensions.filter(
    dim => dim.categoryId === categoryId && dim.active
  );

  if (input.sizeIndex !== undefined && input.sizeIndex !== null && input.sizeIndex >= 0) {
    const szModel = categoryDimensions[input.sizeIndex];
    if (szModel) {
      w = szModel.w; h = szModel.h; d = szModel.d;
      isCustom = false;
      dimensionsText = szModel.dim;
      directPriceOverride = szModel.directPriceOverride;
      sizeMultiplier = szModel.priceMultiplier;
    }
  }

  if (isCustom) {
    w = Number(input.w);
    h = Number(input.h);
    d = Number(input.d) || 0;
    
    // Clean fallback to prevent NaN crashes on standard-to-custom size changes or missing inputs
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      const fallbackDim = categoryDimensions[0] || { w: 20, h: 25, d: 8, dim: "20×25×8" };
      w = fallbackDim.w;
      h = fallbackDim.h;
      d = fallbackDim.d;
      isCustom = false;
      dimensionsText = fallbackDim.dim;
      directPriceOverride = (fallbackDim as any).directPriceOverride;
      sizeMultiplier = (fallbackDim as any).priceMultiplier;
    } else {
      // Clamp inputs to safe limits to prevent validation crashes during typing
      w = Math.max(2, Math.min(300, w));
      h = Math.max(2, Math.min(300, h));
      d = Math.max(0, Math.min(150, d));
      dimensionsText = `${w}×${h}×${d}`;
    }
  }

  if (isNaN(w) || isNaN(h) || w < 2 || h < 2 || w > 300 || h > 300 || d < 0 || d > 150) {
    throw new Error("Տրված չափսերը սխալ են կամ դուրս սահմաններից (սկսած 2 սմ-ից)։");
  }

  // ── Paper price ──────────────────────────────────────────────────────────
  let paperPrice = rules.pp210 || 300;
  if (input.paperId) {
    const sp = db.papers.find(p => p.id === input.paperId && p.active);
    if (sp) paperPrice = sp.pricePerSqm;
  } else {
    const matched = db.papers.find(
      p => p.gsm === input.gsm && p.assignedProducts.includes(categoryId) && p.active
    );
    paperPrice = matched
      ? matched.pricePerSqm
      : (input.gsm === 210 ? (rules.pp210 || 300) : (rules.pp300 || 400));
  }

  // ── Printing method ──────────────────────────────────────────────────────
  const printingMethods = db.printingMethods || [];
  let selectedMethod = printingMethods.find(m => m.id === input.method && m.active);

  if (!selectedMethod || input.method === "auto") {
    const defaultId = qty >= 300 ? "offset" : "digital";

    const isCompatible = (m: any) => {
      if (!m || !m.active) return false;
      const allowedCats = m.allowedCategories || [];
      if (allowedCats.length && !allowedCats.includes(categoryId) && !allowedCats.includes("all")) return false;
      if (m.minW && w < m.minW) return false;
      if (m.maxW && w > m.maxW) return false;
      if (m.minH && h < m.minH) return false;
      if (m.maxH && h > m.maxH) return false;
      return true;
    };

    const preferredCandidate = printingMethods.find(m => m.id === defaultId && m.active);
    if (preferredCandidate && isCompatible(preferredCandidate)) {
      selectedMethod = preferredCandidate;
    } else {
      const compatibleMethods = printingMethods.filter((m: any) => m.active && isCompatible(m));
      if (compatibleMethods.length > 0) {
        const preferred = qty >= 300 
          ? compatibleMethods.find((m: any) => m.id === "offset") 
          : compatibleMethods.find((m: any) => m.id === "digital");
        selectedMethod = preferred || compatibleMethods[0];
      } else {
        selectedMethod = preferredCandidate || printingMethods.find(m => m.active && m.allowedCategories?.includes(categoryId));
      }
    }
  }

  // Validate method constraints
  if (selectedMethod) {
    if (qty < selectedMethod.minQty) {
      throw new Error(selectedMethod.warningMessage || `${selectedMethod.name}ի համար նվազագույն քանակը ${selectedMethod.minQty} հատ է։`);
    }
    if (selectedMethod.allowedCategories?.length && !selectedMethod.allowedCategories.includes(categoryId)) {
      throw new Error("Տվյալ տպագրությունը հասանելի չէ այս ապրանքատեսակի համար։");
    }
    if (selectedMethod.maxW && w > selectedMethod.maxW) throw new Error(`${selectedMethod.name}-ի համար առավելագույն լայնությունը ${selectedMethod.maxW} սմ է։`);
    if (selectedMethod.minW && w < selectedMethod.minW) throw new Error(`${selectedMethod.name}-ի համար նվազագույն լայնությունը ${selectedMethod.minW} սմ է։`);
    if (selectedMethod.maxH && h > selectedMethod.maxH) throw new Error(`${selectedMethod.name}-ի համար առավելագույն բարձրությունը ${selectedMethod.maxH} սմ է։`);
    if (selectedMethod.minH && h < selectedMethod.minH) throw new Error(`${selectedMethod.name}-ի համար նվազագույն բարձրությունը ${selectedMethod.minH} սմ է։`);
  }

  // ── SHEET LAYOUT CALCULATION ─────────────────────────────────────────────
  const flatW = 2 * w + 2 * d + 4;          // bag flat width  (cm)
  const flatH = h + d / 2 + 8;              // bag flat height (cm)
  
  const layout = calculateLayout(flatW, flatH, qty);
  const totalSheets = layout.totalSheets;
  
  // Paper cost calculation - To ensure every single centimeter counts and every size (preset or custom)
  // gets its own highly precise, logical, and continuous price, we base the paper cost 100% on the exact 
  // physical flat area of the bag (flatW * flatH) in square meters multiplied by the paper price and a waste factor.
  const flatAreaSqm = (flatW * flatH) / 10000;
  const paperCostPerItem = flatAreaSqm * paperPrice * WASTE_FACTOR;

  // ── OTHER PRODUCTION COSTS ────────────────────────────────────────────────
  // 1. Setup / pre-press cost
  const setupCost = selectedMethod ? selectedMethod.setupCost : (rules.fixed || 500);
  const setupCostPerItem = safeDivide(setupCost, qty, 0);

  // 2. Lamination per item
  let laminationCostPerItem = 0;
  if (input.lamination !== "none") {
    if (input.lamination === "soft_touch") {
      laminationCostPerItem = (rules.lam || 60) * 1.5;
    } else if (input.lamination === "gloss") {
      laminationCostPerItem = (rules.lam || 60) * 0.9;
    } else {
      laminationCostPerItem = (rules.lam || 60); // matte
    }
  }

  // 3. Handle cost per item
  let handleCostPerItem = 0;
  if (input.handle === "ribbon") {
    handleCostPerItem = Number(input.ribbonWidthPrice) || 75;
  } else if (input.handle === "silk_ribbon" || input.handle === "cotton") {
    handleCostPerItem = (rules.cord || 80) * 1.5;
  } else if (input.handle === "none") {
    handleCostPerItem = 0;
  } else {
    handleCostPerItem = rules.cord || 80;
  }

  // 4. Print cost per item
  let printCostPerItem = 0;
  if (selectedMethod) {
    const scale = getScale(w, h, d);
    const colMult = input.colors === 5 ? 3.0 : input.colors === 4 ? 2.2 : (input.colors || 1);
    printCostPerItem = selectedMethod.pricePerUnit * scale * colMult * selectedMethod.priceMultiplier;
    if (input.sides === 2) printCostPerItem *= 1.65;
  } else {
    const scale = getScale(w, h, d);
    if (input.colors === 2) printCostPerItem += (rules.c2 || 40) * scale;
    if (input.colors === 4) printCostPerItem += (rules.c4 || 80) * scale;
    if (input.colors === 5) printCostPerItem += ((rules.c4 || 80) + (rules.c2 || 40)) * scale;
    if (input.sides === 2) printCostPerItem += (rules.s2 || 50) * scale;
  }

  // 5. Post-press finishes per item
  let finishCostPerItem = 0;
  if (input.finishes && Array.isArray(input.finishes)) {
    input.finishes.forEach(fKey => {
      const fin = db.finishes.find(f => f.key === fKey && f.active);
      if (fin) finishCostPerItem += fin.price;
    });
  }

  // 6. Manual folding and assembly cost
  const assemblyCostPerItem = 65;

  // ── Total PRODUCTION COST per item (sebestoimost) excluding finishes ──────
  const costPerItemWithoutFinishes =
    paperCostPerItem +
    setupCostPerItem +
    laminationCostPerItem +
    handleCostPerItem +
    printCostPerItem +
    assemblyCostPerItem;

  const effectiveCostPerItemWithoutFinishes = Math.max(120, costPerItemWithoutFinishes);
  const effectiveCostPerItem = effectiveCostPerItemWithoutFinishes + finishCostPerItem;

  // ── Tier margin multiplier ────────────────────────────────────────────────
  const baseMultiplier = getBaseMultiplier(rules);
  const tierMult = getTierMult(qty, db.tiers);

  // Profit margin multiplier adjusts dynamically down to respect scale but stays above cost
  const marginMultiplier = 1 + (baseMultiplier - 1) * tierMult;

  // Final selling price per item
  let unitPrice = Math.ceil((effectiveCostPerItemWithoutFinishes * marginMultiplier) / 10) * 10;
  
  // Base price (without bulk tier discount)
  let unitPriceBase = Math.ceil((effectiveCostPerItemWithoutFinishes * baseMultiplier) / 10) * 10;

  // Apply Dimension Direct Price Override and Price Multiplier if present
  if (directPriceOverride && directPriceOverride > 0) {
    unitPriceBase = directPriceOverride;
    unitPrice = Math.ceil((directPriceOverride * tierMult) / 10) * 10;
  }
  if (sizeMultiplier && sizeMultiplier > 0) {
    unitPrice = Math.ceil((unitPrice * sizeMultiplier) / 10) * 10;
    unitPriceBase = Math.ceil((unitPriceBase * sizeMultiplier) / 10) * 10;
  }

  // Add finishes flatly (kept completely fixed without secondary rounding distortion)
  unitPrice += finishCostPerItem;
  unitPriceBase += finishCostPerItem;

  // ── Design assistance flat fee ────────────────────────────────────────────
  let designFeeApplied = 0;
  if (input.design === "help") {
    designFeeApplied = rules.desfee || 15000;
  }

  // ── Totals ────────────────────────────────────────────────────────────────
  let totalPrice = unitPrice * qty + designFeeApplied;
  const quantityDiscount = Math.max(0, (unitPriceBase - unitPrice) * qty);

  // ── Coupon Promo apply ─────────────────────────────────────────────────────
  let discountAmount = 0;
  if (input.appliedDiscountCode && db.discountCodes) {
    const dcObj = db.discountCodes.find(
      code => code.code.toUpperCase() === input.appliedDiscountCode!.toUpperCase() && code.active
    );
    if (dcObj) {
      if (dcObj.type === "percentage") {
        discountAmount = Math.round(totalPrice * (dcObj.value / 100));
      } else {
        discountAmount = dcObj.value;
      }
      totalPrice = Math.max(0, totalPrice - discountAmount);
    }
  }

  // Profit and margin percentage calculations
  const profitAMD = totalPrice - (effectiveCostPerItem * qty);
  const profitPct = Math.round(safeDivide(profitAMD, totalPrice, 0) * 1000) / 10;

  return {
    success: true,
    unitCost: Math.ceil(effectiveCostPerItem / 10) * 10,
    unitPrice,
    totalPrice,
    profit: Math.ceil(profitAMD / 10) * 10,
    profitPercentage: profitPct,
    savings: quantityDiscount,
    quantityDiscount,
    discountAmount,
    isCustom,
    dimensionsText,
    qty,
    designFeeApplied,
    printingMethodUsed: selectedMethod ? selectedMethod.name : "Օֆսեթ"
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BOXES CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────

export async function calculateBoxesPrice(input: {
  productKey: string;
  itemId?: string;
  paperId?: string;
  method?: string;
  w?: number;
  h?: number;
  d?: number;
  qty: number;
  lamination?: "matte" | "gloss" | "none" | string;
  colors?: number;
  sides?: number;
  finishes?: string[];
  materialType?: string;
  boxStyle?: string;
  appliedDiscountCode?: string;
  wallThickness?: number;
}): Promise<{
  success: boolean;
  unitCost: number;
  unitPrice: number;
  totalPrice: number;
  profit: number;
  profitPercentage: number;
  quantityDiscount: number;
  discountAmount: number;
  isCustom: boolean;
  dimensionsText: string;
  qty: number;
  itemName: string;
  materialType: string;
  lamination: string;
  colors: number;
  printingMethodUsed?: string;
  wallThickness?: number;
}> {
  const db = await readDB();
  const rules = db.pricingRules;

  // ── Dimensions ───────────────────────────────────────────────────────────
  let w = 0, h = 0, d = 0;
  let isCustom = true;
  let itemName = "Անհատական Տուփ";
  let presetPricePerUnit = 0;

  if (input.itemId && input.itemId !== "custom") {
    const boxesProduct = db.products.find(p => p.id === "boxes_items");
    const item = boxesProduct?.items.find(it => it.id === input.itemId);
    if (item) {
      itemName = item.name;
      const match = item.name.match(/(\d+)[x\u00d7](\d+)[x\u00d7](\d+)/i);
      if (match) {
        w = parseInt(match[1], 10);
        h = parseInt(match[2], 10);
        d = parseInt(match[3], 10);
      } else { w = 15; h = 10; d = 5; }
      presetPricePerUnit = item.price;
      isCustom = false;
    }
  }

  if (isCustom) {
    let rawW = Number(input.w);
    let rawH = Number(input.h);
    let rawD = Number(input.d);

    if (isNaN(rawW) || isNaN(rawH) || rawW <= 0 || rawH <= 0) {
      w = 15;
      h = 10;
      d = 5;
    } else {
      w = Math.max(2, Math.min(300, rawW));
      h = Math.max(2, Math.min(300, rawH));
      d = Math.max(0.5, Math.min(150, isNaN(rawD) ? 5 : rawD));
    }
    itemName = `Անհատական Տուփ ${w}×${h}×${d} սմ`;
  }

  if (isNaN(w) || isNaN(h) || isNaN(d) || w < 2 || h < 2 || d < 0.5) {
    throw new Error("Տուփի չափսերը սխալ են (սկսած 2 սմ-ից, բարձրությունը սկսած 0.5 սմ-ից)։");
  }

  // ── Category minimum ─────────────────────────────────────────────────────
  const boxesCategory = db.categories.find(c => c.id === "boxes");
  const minRequiredQty = boxesCategory ? boxesCategory.minQty : 30;
  const qty = Number(input.qty) || minRequiredQty;
  if (qty < minRequiredQty) {
    throw new Error(`Նվազագույն պատվերը տուփերի համար ${minRequiredQty} հատ է։`);
  }

  // ── Material / paper ──────────────────────────────────────────────────────
  let selectedPaper: any = null;
  if (input.paperId) {
    selectedPaper = db.papers.find(p => p.id === input.paperId && p.active);
  } else {
    const legacyMap: Record<string, string> = {
      cardboard: "box_cardboard",
      kraft: "box_kraft",
      rigid: "box_rigid",
      duplex: "box_duplex"
    };
    const mapped = legacyMap[input.materialType || "cardboard"] || "box_cardboard";
    selectedPaper = db.papers.find(p => p.id === mapped && p.active);
  }

  const style = input.boxStyle || "shoulder_lid";

  const paperPrice = selectedPaper ? selectedPaper.pricePerSqm : rules.pp300;
  const isBoxRigid =
    selectedPaper?.id === "box_rigid" ||
    selectedPaper?.name?.toLowerCase().includes("rigid") ||
    input.materialType === "rigid" ||
    style === "magnetic_flap" ||
    style === "shoulder_neck"; // Both Magnetic flap and Shoulder Neck boxes are always high-end rigid structures!

  let displayMaterialName = "cardboard";
  if (selectedPaper) {
    if (isBoxRigid) displayMaterialName = "rigid";
    else if (selectedPaper.id === "box_kraft") displayMaterialName = "kraft";
    else if (selectedPaper.id === "box_duplex") displayMaterialName = "duplex";
  } else {
    displayMaterialName = input.materialType || "cardboard";
  }

  // ── Dimension laws according to box style or rigidity ──────────────────
  if (style === "shoulder_lid") {
    if (d < 3.5) {
      throw new Error("Կափարիչով պրեմիում (Rigid Lid) տուփի նվազագույն բարձրությունը (H) պետք է լինի 3.5 սմ։");
    }
    if (w < 8 || h < 8) {
      throw new Error("Կափարիչով պրեմիում տուփի երկարությունը և լայնությունը պետք է լինեն առնվազն 8 սմ։");
    }
    if (d > Math.min(w, h) * 1.5) {
      throw new Error("Կափարիչով պրեմիում տուփի բարձրությունը չի կարող լինել ավելին քան երկարության և լայնության 1.5-պատիկը՝ համաչափությունն ապահովելու համար։");
    }
  } else if (style === "sleeve_drawer") {
    if (d < 3.0) {
      throw new Error("Սահող դարակով (Sleeve Drawer) տուփի նվազագույն բարձրությունը (H) պետք է լինի 3.0 սմ։");
    }
    if (w < 8 || h < 8) {
      throw new Error("Սահող դարակով տուփի երկարությունը և լայնությունը պետք է լինեն առնվազն 8 սմ։");
    }
    if (d > Math.min(w, h) * 0.6) {
      throw new Error("Սահող դարակով տուփի բարձրությունը չի կարող լինել ավելին քան երկարության կամ լայնության 60%-ը՝ դարակի սահուն և համաչափ տեսքն ապահովելու համար։");
    }
  } else if (style === "magnetic_flap") {
    if (d < 3.0) {
      throw new Error("Մագնիսական կափարիչով (Magnetic Flap) տուփի նվազագույն բարձրությունը (H) պետք է լինի 3.0 սմ։");
    }
    if (w < 10 || h < 10) {
      throw new Error("Մագնիսական կափարիչով տուփի երկարությունը և լայնությունը պետք է լինեն առնվազն 10 սմ՝ ճիշտ ծալումն ապահովելու համար։");
    }
    if (d > Math.min(w, h) * 0.65) {
      throw new Error("Մագնիսական կափարիչով տուփի բարձրությունը չի կարող գերազանցել երկարության կամ լայնության 65%-ը՝ գրքի տիպի ճիշտ ծալումն արտացոլելու համար։");
    }
  } else if (style === "shoulder_neck") {
    if (d < 3.0) {
      throw new Error("Ուսիկով պրեմիում (Shoulder Neck) տուփի նվազագույն բարձրությունը (H) պետք է լինի 3.0 սմ։");
    }
    if (w < 8 || h < 8) {
      throw new Error("Ուսիկով պրեմիում տուփի երկարությունը և լայնությունը պետք է լինեն առնվազն 8 սմ։");
    }
    if (d > Math.min(w, h) * 1.5) {
      throw new Error("Ուսիկով պրեմիում տուփի բարձրությունը չի կարող լինել ավելին քան երկարության և լայնության 1.5-պատիկը՝ համաչափությունն ապահովելու համար։");
    }
  }

  if (isBoxRigid || selectedPaper?.id === "box_rigid") {
    if (d < 3.0) {
      throw new Error("Կոշտ ստվարաթղթով (Rigid) տուփերի նվազագույն բարձրությունը (H) պետք է լինի 3.0 սմ։");
    }
  }

  // ── Printing method ──────────────────────────────────────────────────────
  const printingMethods = db.printingMethods || [];
  let selectedMethod = printingMethods.find(m => m.id === input.method && m.active);

  if (!selectedMethod || input.method === "auto") {
    const defaultId = qty >= 300 ? "offset" : "digital";

    const isCompatible = (m: any) => {
      if (!m || !m.active) return false;
      const allowedCats = m.allowedCategories || [];
      if (allowedCats.length && !allowedCats.includes("boxes") && !allowedCats.includes("all")) return false;
      if (m.minW && w < m.minW) return false;
      if (m.maxW && w > m.maxW) return false;
      if (m.minH && h < m.minH) return false;
      if (m.maxH && h > m.maxH) return false;
      return true;
    };

    const preferredCandidate = printingMethods.find(m => m.id === defaultId && m.active);
    if (preferredCandidate && isCompatible(preferredCandidate)) {
      selectedMethod = preferredCandidate;
    } else {
      const compatibleMethods = printingMethods.filter((m: any) => m.active && isCompatible(m));
      if (compatibleMethods.length > 0) {
        const preferred = qty >= 300 
          ? compatibleMethods.find((m: any) => m.id === "offset") 
          : compatibleMethods.find((m: any) => m.id === "digital");
        selectedMethod = preferred || compatibleMethods[0];
      } else {
        selectedMethod = preferredCandidate || printingMethods.find(m => m.active && m.allowedCategories?.includes("boxes"));
      }
    }
  }

  if (selectedMethod) {
    if (qty < selectedMethod.minQty) {
      throw new Error(selectedMethod.warningMessage || `${selectedMethod.name}ի համար նվազագույն քանակը ${selectedMethod.minQty} հատ է։`);
    }
    if (selectedMethod.allowedCategories?.length && !selectedMethod.allowedCategories.includes("boxes")) {
      throw new Error("Տվյալ տպագրությունը հասանելի չէ տուփերի համար։");
    }
    if (selectedMethod.maxW && w > selectedMethod.maxW) throw new Error(`${selectedMethod.name}-ի համար առավելագույն լայնությունը ${selectedMethod.maxW} սմ է։`);
    if (selectedMethod.minW && w < selectedMethod.minW) throw new Error(`${selectedMethod.name}-ի համար նվազագույն լայնությունը ${selectedMethod.minW} սմ է։`);
    if (selectedMethod.maxH && h > selectedMethod.maxH) throw new Error(`${selectedMethod.name}-ի համար առավելագույն բարձրությունը ${selectedMethod.maxH} սմ է։`);
    if (selectedMethod.minH && h < selectedMethod.minH) throw new Error(`${selectedMethod.name}-ի համար նվազագույն բարձրությունը ${selectedMethod.minH} սմ է։`);
  }

  // ── Box flat (unfolded) dimensions ────────────────────────────────────────
  const flatW = 2 * (w + d) + 4;
  const flatH = 2 * h + 2 * d + 4;

  // ── SHEET LAYOUT CALCULATION ─────────────────────────────────────────────
  const layout = calculateLayout(flatW, flatH, qty);
  const totalSheets = layout.totalSheets;
  
  // Paper/material cost calculation - To ensure every single centimeter counts and every size (preset or custom)
  // gets its own highly precise, logical, and continuous price, we base the paper cost 100% on the exact
  // physical flat area of the folding box (flatW * flatH) in square meters multiplied by the paper price and a waste factor.
  const flatAreaSqm = (flatW * flatH) / 10000;
  const paperCostPerItem = flatAreaSqm * paperPrice * WASTE_FACTOR;

  // ── OTHER PRODUCTION COSTS ────────────────────────────────────────────────
  // 1. Setup / pre-press cost
  const setupCost = selectedMethod ? selectedMethod.setupCost : (rules.fixed || 500) * 1.5;
  const setupCostPerItem = safeDivide(setupCost, qty, 0);

  // 2. Lamination
  let laminationCostPerItem = 0;
  if (input.lamination && input.lamination !== "none") {
    if (input.lamination === "soft_touch") {
      laminationCostPerItem = (rules.lam || 60) * 1.5;
    } else if (input.lamination === "gloss") {
      laminationCostPerItem = (rules.lam || 60) * 0.9;
    } else {
      laminationCostPerItem = (rules.lam || 60); // matte
    }
  }

  // 3. Print cost
  let printCostPerItem = 0;
  const colorsVal = input.colors || 1;
  const boxAreaM2 = (flatW * flatH) / 10000;
  const scale = Math.max(0.6, Math.min(2.5, boxAreaM2 / 0.25));

  if (selectedMethod) {
    const colMult = colorsVal === 5 ? 3.0 : colorsVal === 4 ? 2.2 : colorsVal;
    printCostPerItem = selectedMethod.pricePerUnit * scale * colMult * selectedMethod.priceMultiplier;
    if ((input.sides || 1) === 2) printCostPerItem *= 1.65;
  } else {
    if (colorsVal === 2) printCostPerItem = (rules.c2 || 40) * 1.2;
    if (colorsVal === 4) printCostPerItem = (rules.c4 || 80) * 1.2;
    if (colorsVal === 5) printCostPerItem = ((rules.c4 || 80) + (rules.c2 || 40)) * 1.2;
  }

  // 5. Post-press finishes
  let finishCostPerItem = 0;
  if (input.finishes && Array.isArray(input.finishes)) {
    input.finishes.forEach(fKey => {
      const fin = db.finishes.find(f => f.key === fKey && f.active);
      if (fin) finishCostPerItem += fin.price;
    });
  }

  let thicknessSurcharge = 0;
  const wallThickness = isBoxRigid 
    ? (input.wallThickness !== undefined ? Number(input.wallThickness) : 2.0)
    : (rules.box_wall_thickness_standard !== undefined ? Number(rules.box_wall_thickness_standard) : 0.5);

  if (isBoxRigid) {
    if (wallThickness === 1.5) {
      thicknessSurcharge = rules.box_thick_surcharge_1_5 !== undefined ? Number(rules.box_thick_surcharge_1_5) : -30;
    } else if (wallThickness === 2.0) {
      thicknessSurcharge = rules.box_thick_surcharge_2_0 !== undefined ? Number(rules.box_thick_surcharge_2_0) : 0;
    } else if (wallThickness === 2.5) {
      thicknessSurcharge = rules.box_thick_surcharge_2_5 !== undefined ? Number(rules.box_thick_surcharge_2_5) : 80;
    } else if (wallThickness === 3.0) {
      thicknessSurcharge = rules.box_thick_surcharge_3_0 !== undefined ? Number(rules.box_thick_surcharge_3_0) : 160;
    }
  }

  // 6. Assembly / die-cut handling
  let assemblyCostPerItem = isBoxRigid ? 250 : 80;
  const baseAssemblyFolding = rules.box_assembly_cost_folding !== undefined ? Number(rules.box_assembly_cost_folding) : 80;
  const baseAssemblyRigid = rules.box_assembly_cost_rigid !== undefined ? Number(rules.box_assembly_cost_rigid) : 250;
  const surchargeMagnetic = rules.box_surcharge_magnetic !== undefined ? Number(rules.box_surcharge_magnetic) : 200;
  const surchargeShoulderNeck = rules.box_surcharge_shoulder_neck !== undefined ? Number(rules.box_surcharge_shoulder_neck) : 100;

  assemblyCostPerItem = isBoxRigid ? baseAssemblyRigid : baseAssemblyFolding;
  if (style === "magnetic_flap") {
    assemblyCostPerItem += surchargeMagnetic;
  } else if (style === "shoulder_neck") {
    assemblyCostPerItem += surchargeShoulderNeck;
  }

  // ── Total PRODUCTION COST per item (sebestoimost) excluding finishes ──────
  const costPerItemWithoutFinishes =
    paperCostPerItem +
    setupCostPerItem +
    laminationCostPerItem +
    printCostPerItem +
    assemblyCostPerItem +
    thicknessSurcharge;

  const minCostFloor = isBoxRigid ? 350 : 120;
  const effectiveCostPerItemWithoutFinishes = Math.max(minCostFloor, costPerItemWithoutFinishes);
  
  // Adjust cost per item for preset products to respect pricing logic and guarantee profit margin
  const finalEffectiveCostWithoutFinishes = (!isCustom && presetPricePerUnit > 0)
    ? Math.min(presetPricePerUnit * 0.65, effectiveCostPerItemWithoutFinishes)
    : effectiveCostPerItemWithoutFinishes;

  const finalEffectiveCost = finalEffectiveCostWithoutFinishes + finishCostPerItem;

  // ── Selling price ─────────────────────────────────────────────────────────
  const baseMultiplier = getBaseMultiplier(rules);
  const tierMult = getTierMult(qty, db.tiers);

  // Dynamic profit slide avoiding dips below cost
  const marginMultiplier = 1 + (baseMultiplier - 1) * tierMult;

  let unitPrice: number;
  let unitPriceBase = finalEffectiveCostWithoutFinishes * baseMultiplier;

  if (!isCustom && presetPricePerUnit > 0) {
    // Preset items: use preset base price with tier discount
    unitPriceBase = presetPricePerUnit;
    unitPrice = presetPricePerUnit * tierMult;
  } else {
    unitPrice = finalEffectiveCostWithoutFinishes * marginMultiplier;
  }

  // Minimum selling price floor
  const minSellFolding = rules.box_min_sell_folding !== undefined ? Number(rules.box_min_sell_folding) : 200;
  const minSellRigid = rules.box_min_sell_rigid !== undefined ? Number(rules.box_min_sell_rigid) : 600;
  const minSellMagnetic = rules.box_min_sell_magnetic !== undefined ? Number(rules.box_min_sell_magnetic) : 900;
  const minSellShoulderNeck = rules.box_min_sell_shoulder_neck !== undefined ? Number(rules.box_min_sell_shoulder_neck) : 850;

  const minSellFloor = style === "magnetic_flap" ? minSellMagnetic : (style === "shoulder_neck" ? minSellShoulderNeck : (isBoxRigid ? minSellRigid : minSellFolding));
  unitPrice = Math.max(minSellFloor, unitPrice);

  // Ceil to nearest 10 AMD before finishes
  unitPrice = Math.ceil(unitPrice / 10) * 10;
  unitPriceBase = Math.ceil(unitPriceBase / 10) * 10;

  // Add the finish price flat/fixed directly to the unit selling prices (without secondary rounding distortion)
  unitPrice += finishCostPerItem;
  unitPriceBase += finishCostPerItem;

  let totalPrice = unitPrice * qty;
  const quantityDiscount = Math.max(0, (unitPriceBase - unitPrice) * qty);

  // ── Promo coupon discount ─────────────────────────────────────────────────
  let discountAmount = 0;
  if (input.appliedDiscountCode && db.discountCodes) {
    const dcObj = db.discountCodes.find(
      code => code.code.toUpperCase() === input.appliedDiscountCode!.toUpperCase() && code.active
    );
    if (dcObj) {
      if (dcObj.type === "percentage") {
        discountAmount = Math.round(totalPrice * (dcObj.value / 100));
      } else {
        discountAmount = dcObj.value;
      }
      totalPrice = Math.max(0, totalPrice - discountAmount);
    }
  }

  // Profit and profitPercentage
  const profitAMD = totalPrice - finalEffectiveCost * qty;
  const profitPct = Math.round(safeDivide(profitAMD, totalPrice, 0) * 1000) / 10;

  return {
    success: true,
    unitCost: Math.ceil(finalEffectiveCost / 10) * 10,
    unitPrice,
    totalPrice,
    profit: Math.ceil(profitAMD / 10) * 10,
    profitPercentage: profitPct,
    quantityDiscount,
    discountAmount,
    isCustom,
    dimensionsText: `${w}×${h}×${d}`,
    qty,
    itemName,
    materialType: displayMaterialName,
    lamination: String(input.lamination || "matte"),
    colors: colorsVal,
    printingMethodUsed: selectedMethod ? selectedMethod.name : "Օֆսեթ",
    wallThickness
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ADDITIONAL DEDICATED CALCULATORS (Ribbons, Stickers, Gift Cards, Business Cards)
// ─────────────────────────────────────────────────────────────────────────────

export interface RibbonInput {
  productKey: "ribbons";
  width: string; // "2", "2.5", "3", "4"
  ribbonType: "satin" | "reps";
  printColor: "foil_gold" | "foil_silver" | "screen_1";
  meters: number;
  appliedDiscountCode?: string;
}

export async function calculateRibbonsPrice(input: RibbonInput): Promise<any> {
  const db = await readDB();
  const rules = db.pricingRules;

  const meters = Math.max(1, Number(input.meters) || 100);
  const width = String(input.width || "2");
  const type = input.ribbonType || "satin";
  const printColor = input.printColor || "foil_gold";

  // Base material price per meter
  let basePricePerMeter = 80;
  if (width === "2") {
    basePricePerMeter = rules.ribbon_satin_base_2cm || 80;
  } else if (width === "2.5") {
    basePricePerMeter = rules.ribbon_satin_base_2_5cm || 100;
  } else if (width === "3") {
    basePricePerMeter = rules.ribbon_satin_base_3cm || 130;
  } else if (width === "4") {
    basePricePerMeter = rules.ribbon_satin_base_4cm || 150;
  }

  // Surcharge if Reps style
  if (type === "reps") {
    basePricePerMeter = basePricePerMeter * (rules.ribbon_reps_mult || 1.4);
  }

  // Setup fee once per run
  const setupFee = rules.ribbon_setup || 6000;

  // Print fee per meter
  let printFeePerMeter = rules.ribbon_foil_per_meter || 25;
  if (printColor === "screen_1") {
    printFeePerMeter = rules.ribbon_screen_per_meter || 15;
  }

  // Core production cost
  const ribbonCost = meters * basePricePerMeter;
  const printingCost = meters * printFeePerMeter;
  const rawCost = ribbonCost + setupFee + printingCost;

  const baseMult = getBaseMultiplier(rules);
  let initialSellingPrice = rawCost * baseMult;

  // High meter discount scale
  let qtyDiscountPct = 0;
  if (meters >= 500) {
    qtyDiscountPct = 25;
  } else if (meters >= 300) {
    qtyDiscountPct = 15;
  } else if (meters >= 150) {
    qtyDiscountPct = 8;
  }

  let finalSellingPrice = initialSellingPrice * (1 - qtyDiscountPct / 100);

  // Round values
  const unitPrice = Math.ceil((finalSellingPrice / meters) / 5) * 5;
  const unitPriceBase = Math.ceil((initialSellingPrice / meters) / 5) * 5;

  let totalPrice = unitPrice * meters;
  const quantityDiscount = Math.max(0, (unitPriceBase - unitPrice) * meters);

  // Coupon promo check
  let discountAmount = 0;
  if (input.appliedDiscountCode && db.discountCodes) {
    const dcObj = db.discountCodes.find(
      code => code.code.toUpperCase() === input.appliedDiscountCode!.toUpperCase() && code.active
    );
    if (dcObj) {
      if (dcObj.type === "percentage") {
        discountAmount = Math.round(totalPrice * (dcObj.value / 100));
      } else {
        discountAmount = dcObj.value;
      }
      totalPrice = Math.max(0, totalPrice - discountAmount);
    }
  }

  const profitAMD = totalPrice - rawCost;
  const profitPct = totalPrice > 0 ? Math.round((profitAMD / totalPrice) * 1000) / 10 : 0;

  return {
    success: true,
    unitCost: Math.ceil((rawCost / meters) / 5) * 5,
    unitPrice,
    totalPrice,
    profit: Math.ceil(profitAMD / 10) * 10,
    profitPercentage: profitPct,
    quantityDiscount,
    discountAmount,
    qty: meters,
    width,
    type,
    printColor,
    dimensionsText: `${width} սմ`,
    itemName: `${type === "satin" ? "Սատինե" : "Ռեպսե"} ժապավեն լոգոտիպով`,
    materialType: `${type === "satin" ? "Սատին (Satin)" : "Ռեպս (Reps)"}`,
    breakdown: {
      ribbonCost,
      setupFee,
      printingCost
    }
  };
}

export interface StickerInput {
  productKey: "stickers";
  shape: "circle" | "rectangle" | "contour";
  width: string;
  height: string;
  material: "paper_gloss" | "paper_matte" | "vinyl_white" | "vinyl_transparent";
  qty: number;
  appliedDiscountCode?: string;
}

export async function calculateStickersPrice(input: StickerInput): Promise<any> {
  const db = await readDB();
  const rules = db.pricingRules;

  const qty = Math.max(1, Number(input.qty) || 300);
  const shape = input.shape || "circle";
  const rawW = parseFloat(input.width);
  const rawH = parseFloat(input.height);
  const w = Math.max(1, Math.min(100, isNaN(rawW) || rawW <= 0 ? 4 : rawW));
  const h = Math.max(1, Math.min(100, isNaN(rawH) || rawH <= 0 ? 4 : rawH));
  const material = input.material || "vinyl_white";

  // Base unit cost per item depending on material selection
  let baseUnitCost = 15;
  if (material === "paper_gloss") {
    baseUnitCost = rules.sticker_paper_gloss || 10;
  } else if (material === "paper_matte") {
    baseUnitCost = rules.sticker_paper_matte || 12;
  } else if (material === "vinyl_white") {
    baseUnitCost = rules.sticker_vinyl_white || 18;
  } else if (material === "vinyl_transparent") {
    baseUnitCost = rules.sticker_vinyl_transparent || 20;
  }

  // Adjust cost depending on size relative to A6 or base 16cm² area
  const area = w * h;
  const sizeFactor = Math.max(0.6, Math.min(3.5, area / 16));
  let finalItemCost = baseUnitCost * sizeFactor;

  // Contour shape takes more complex setup fee
  let setupFee = 0;
  if (shape === "contour") {
    setupFee = rules.sticker_contour_setup || 3000;
  }

  const rawCost = (finalItemCost * qty) + setupFee;

  const baseMult = getBaseMultiplier(rules);
  let initialSellingPrice = rawCost * baseMult;

  // High quantity volume discount
  let qtyDiscountPct = 0;
  if (qty >= 2000) {
    qtyDiscountPct = 30;
  } else if (qty >= 1000) {
    qtyDiscountPct = 20;
  } else if (qty >= 500) {
    qtyDiscountPct = 10;
  }

  let finalSellingPrice = initialSellingPrice * (1 - qtyDiscountPct / 100);

  const unitPrice = Math.ceil((finalSellingPrice / qty) / 1) * 1;
  const unitPriceBase = Math.ceil((initialSellingPrice / qty) / 1) * 1;

  let totalPrice = unitPrice * qty;
  const quantityDiscount = Math.max(0, (unitPriceBase - unitPrice) * qty);

  // Promo coupon discount
  let discountAmount = 0;
  if (input.appliedDiscountCode && db.discountCodes) {
    const dcObj = db.discountCodes.find(
      code => code.code.toUpperCase() === input.appliedDiscountCode!.toUpperCase() && code.active
    );
    if (dcObj) {
      if (dcObj.type === "percentage") {
        discountAmount = Math.round(totalPrice * (dcObj.value / 100));
      } else {
        discountAmount = dcObj.value;
      }
      totalPrice = Math.max(0, totalPrice - discountAmount);
    }
  }

  const profitAMD = totalPrice - rawCost;
  const profitPct = totalPrice > 0 ? Math.round((profitAMD / totalPrice) * 1000) / 10 : 0;

  let displayMaterial = "Վինիլային Ջրակայուն";
  if (material === "paper_gloss") displayMaterial = "Թղթե Փայլուն";
  if (material === "paper_matte") displayMaterial = "Թղթե Փայլատ";
  if (material === "vinyl_transparent") displayMaterial = "Վինիլային Թափանցիկ";

  let displayShape = "Կլոր";
  if (shape === "rectangle") displayShape = "Ուղղանկյուն";
  if (shape === "contour") displayShape = "Ձևավոր / Կոնտուրային";

  return {
    success: true,
    unitCost: Math.ceil((rawCost / qty) / 1) * 1,
    unitPrice,
    totalPrice,
    profit: Math.ceil(profitAMD / 10) * 10,
    profitPercentage: profitPct,
    quantityDiscount,
    discountAmount,
    qty,
    shape,
    dimensionsText: `${w}×${h} սմ`,
    itemName: `Ինքնակպչուն սթիքերներ (${displayShape})`,
    materialType: displayMaterial,
    breakdown: {
      stickersCost: finalItemCost * qty,
      setupFee
    }
  };
}

export interface GiftCardInput {
  productKey: "giftcards";
  size: "standard" | "mini" | "euro";
  envelope: "none" | "standard_white" | "kraft" | "colored_premium";
  paper: "silk_350" | "soft_touch_400" | "textured_cream";
  qty: number;
  finishes: string[];
  appliedDiscountCode?: string;
}

export async function calculateGiftCardsPrice(input: GiftCardInput): Promise<any> {
  const db = await readDB();
  const rules = db.pricingRules;

  const qty = Math.max(1, Number(input.qty) || 50);
  const size = input.size || "standard";
  const envelope = input.envelope || "kraft";
  const paper = input.paper || "textured_cream";
  const finishesArr = input.finishes || [];

  // Card base cost
  let cardBaseCost = 85;
  if (size === "mini") {
    cardBaseCost = rules.giftcard_mini_base || 50;
  } else if (size === "standard") {
    cardBaseCost = rules.giftcard_a6_base || 85;
  } else if (size === "euro") {
    cardBaseCost = rules.giftcard_euro_base || 110;
  }

  // Envelope cost
  let envelopeCost = 0;
  if (envelope === "standard_white") {
    envelopeCost = rules.giftcard_env_standard || 100;
  } else if (envelope === "kraft") {
    envelopeCost = rules.giftcard_env_kraft || 150;
  } else if (envelope === "colored_premium") {
    envelopeCost = rules.giftcard_env_colored || 380;
  }

  // Paper upcharges
  let paperSurcharge = 0;
  if (paper === "soft_touch_400") {
    paperSurcharge = rules.giftcard_paper_softtouch || 75;
  } else if (paper === "textured_cream") {
    paperSurcharge = rules.giftcard_paper_textured || 120;
  }

  // Finishes upcharge setup fee and unit labor
  let finishSetupCost = 0;
  let finishUnitCost = 0;
  const hasUv = finishesArr.some(f => f.toLowerCase().includes("uv") || f.toLowerCase().includes("լաք"));
  const hasFoil = finishesArr.some(f => f.toLowerCase().includes("foil") || f.toLowerCase().includes("ոսկե") || f.toLowerCase().includes("արծաթ"));
  
  if (hasUv) {
    finishSetupCost += 3500;
    finishUnitCost += 20;
  }
  if (hasFoil) {
    finishSetupCost += 5000;
    finishUnitCost += 35;
  }

  const rawCost = (cardBaseCost + envelopeCost + paperSurcharge + finishUnitCost) * qty + finishSetupCost;

  const baseMult = getBaseMultiplier(rules);
  let initialSellingPrice = rawCost * baseMult;

  // High quantity volume discount
  let qtyDiscountPct = 0;
  if (qty >= 200) {
    qtyDiscountPct = 25;
  } else if (qty >= 100) {
    qtyDiscountPct = 15;
  } else if (qty >= 50) {
    qtyDiscountPct = 5;
  }

  let finalSellingPrice = initialSellingPrice * (1 - qtyDiscountPct / 100);

  const unitPrice = Math.ceil((finalSellingPrice / qty) / 5) * 5;
  const unitPriceBase = Math.ceil((initialSellingPrice / qty) / 5) * 5;

  let totalPrice = unitPrice * qty;
  const quantityDiscount = Math.max(0, (unitPriceBase - unitPrice) * qty);

  // Promo coupon discount
  let discountAmount = 0;
  if (input.appliedDiscountCode && db.discountCodes) {
    const dcObj = db.discountCodes.find(
      code => code.code.toUpperCase() === input.appliedDiscountCode!.toUpperCase() && code.active
    );
    if (dcObj) {
      if (dcObj.type === "percentage") {
        discountAmount = Math.round(totalPrice * (dcObj.value / 100));
      } else {
        discountAmount = dcObj.value;
      }
      totalPrice = Math.max(0, totalPrice - discountAmount);
    }
  }

  const profitAMD = totalPrice - rawCost;
  const profitPct = totalPrice > 0 ? Math.round((profitAMD / totalPrice) * 1000) / 10 : 0;

  let displaySize = "10×15 սմ (A6)";
  if (size === "mini") displaySize = "7×10 սմ (Այցեքարտային)";
  if (size === "euro") displaySize = "10×21 սմ (Եվրո)";

  let displayPaper = "Դիզայներական Տեքստուրային";
  if (paper === "silk_350") displayPaper = "Կավճապատ Մետաքսե 350գ";
  if (paper === "soft_touch_400") displayPaper = "Soft-Touch 400գ Պրեմիում";

  return {
    success: true,
    unitCost: Math.ceil((rawCost / qty) / 5) * 5,
    unitPrice,
    totalPrice,
    profit: Math.ceil(profitAMD / 10) * 10,
    profitPercentage: profitPct,
    quantityDiscount,
    discountAmount,
    qty,
    size,
    envelope,
    paper,
    dimensionsText: displaySize,
    itemName: "Ֆիրմային Նվեր Քարտեր + Ծրար",
    materialType: displayPaper,
    breakdown: {
      cardCost: cardBaseCost * qty,
      envelopesCost: envelopeCost * qty,
      papersCost: paperSurcharge * qty,
      finSetup: finishSetupCost
    }
  };
}

export interface BusinessCardInput {
  productKey: "businesscards";
  size: "standard" | "euro";
  paper: "silk_350" | "soft_touch_400" | "textured_premium";
  sides: number;
  corners: "straight" | "rounded";
  qty: number;
  finishes: string[];
  appliedDiscountCode?: string;
}

export async function calculateBusinessCardsPrice(input: BusinessCardInput): Promise<any> {
  const db = await readDB();
  const rules = db.pricingRules;

  const qty = Math.max(1, Number(input.qty) || 100);
  const size = input.size || "standard";
  const paper = input.paper || "silk_350";
  const sides = Number(input.sides) || 1;
  const corners = input.corners || "straight";
  const finishesArr = input.finishes || [];

  // Card base cost
  let cardBaseCost = size === "euro"
    ? (rules.businesscard_euro_base || 45)
    : (rules.businesscard_std_base || 40);

  // Paper upcharge
  if (paper === "soft_touch_400") {
    cardBaseCost += (rules.businesscard_paper_softtouch || 35);
  } else if (paper === "textured_premium") {
    cardBaseCost += (rules.businesscard_paper_textured || 70);
  }

  // Side printing multiplier
  if (sides === 2) {
    cardBaseCost = cardBaseCost * (rules.businesscard_double_sided_mult || 1.5);
  }

  // Rounded corners addon
  if (corners === "rounded") {
    cardBaseCost += (rules.businesscard_corners_rounded || 10);
  }

  // Finishes upcharge setup fee and unit labor
  let finishSetupCost = 0;
  let finishUnitCost = 0;
  const hasUv = finishesArr.some(f => f.toLowerCase().includes("uv") || f.toLowerCase().includes("լաք"));
  const hasFoil = finishesArr.some(f => f.toLowerCase().includes("foil") || f.toLowerCase().includes("ոսկե") || f.toLowerCase().includes("արծաթ"));
  
  if (hasFoil) {
    finishSetupCost += rules.businesscard_foil_setup || 5000;
    finishUnitCost += 25;
  }
  if (hasUv) {
    finishSetupCost += 3000;
    finishUnitCost += 15;
  }

  const rawCost = (cardBaseCost + finishUnitCost) * qty + finishSetupCost;

  const baseMult = getBaseMultiplier(rules);
  let initialSellingPrice = rawCost * baseMult;

  // Volume discount based on card tier
  let qtyDiscountPct = 0;
  if (qty >= 1000) {
    qtyDiscountPct = 40;
  } else if (qty >= 500) {
    qtyDiscountPct = 28;
  } else if (qty >= 200) {
    qtyDiscountPct = 12;
  }

  let finalSellingPrice = initialSellingPrice * (1 - qtyDiscountPct / 100);

  const unitPrice = Math.ceil((finalSellingPrice / qty) / 1) * 1;
  const unitPriceBase = Math.ceil((initialSellingPrice / qty) / 1) * 1;

  let totalPrice = unitPrice * qty;
  const quantityDiscount = Math.max(0, (unitPriceBase - unitPrice) * qty);

  // Promo coupon discount
  let discountAmount = 0;
  if (input.appliedDiscountCode && db.discountCodes) {
    const dcObj = db.discountCodes.find(
      code => code.code.toUpperCase() === input.appliedDiscountCode!.toUpperCase() && code.active
    );
    if (dcObj) {
      if (dcObj.type === "percentage") {
        discountAmount = Math.round(totalPrice * (dcObj.value / 100));
      } else {
        discountAmount = dcObj.value;
      }
      totalPrice = Math.max(0, totalPrice - discountAmount);
    }
  }

  const profitAMD = totalPrice - rawCost;
  const profitPct = totalPrice > 0 ? Math.round((profitAMD / totalPrice) * 1000) / 10 : 0;

  let displaySize = "9×5 սմ (Ստանդարտ)";
  if (size === "euro") displaySize = "8.5×5.5 սմ (Եվրո)";

  let displayPaper = "Կավճապատ Մետաքսե 350գ";
  if (paper === "soft_touch_400") displayPaper = "Soft-Touch 400գ Պրեմիում";
  if (paper === "textured_premium") displayPaper = "Դիզայներական Տեքստուրային";

  return {
    success: true,
    unitCost: Math.ceil((rawCost / qty) / 1) * 1,
    unitPrice,
    totalPrice,
    profit: Math.ceil(profitAMD / 10) * 10,
    profitPercentage: profitPct,
    quantityDiscount,
    discountAmount,
    qty,
    size,
    paper,
    sides,
    corners,
    dimensionsText: displaySize,
    itemName: `Պրեմիում Այցեքարտեր (Երկկողմանի՝ ${sides === 2 ? "Այո" : "Ոչ"})`,
    materialType: displayPaper,
    breakdown: {
      baseCardCost: cardBaseCost * qty,
      finCost: finishUnitCost * qty,
      finSetup: finishSetupCost
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LEGACY HELPERS (kept for backward compatibility)
// ─────────────────────────────────────────────────────────────────────────────

export function getMethod(qty: number, clientSelected: string): "digital" | "offset" {
  if (clientSelected === "digital") return "digital";
  if (clientSelected === "offset") return "offset";
  return qty >= 300 ? "offset" : "digital";
}
