export interface Category {
  id: string;
  name: string;
  nameRu?: string;
  nameEn?: string;
  navLabel?: string;
  heroTitle?: string;
  heroDesc?: string;
  heroBadge?: string;
  heroSmall?: string;
  active: boolean;
  minQty: number;
  qtyPresets?: number[];
  ruleChips?: string;
  icon?: string;
  sortOrder?: number;
  status?: string;
  template?: string;
  sizing?: SizingConfig;
  options?: ProductOption[];
}

export interface ProductItem {
  id: string;
  name: string;
  desc?: string;
  price: number;
  unit?: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  desc?: string;
  waText?: string;
  orderNote?: string;
  active?: boolean;
  items: ProductItem[];
  pricingFormula?: SizePricingFormula;
  options?: ProductOption[];
  materialTags?: string[];
  finishingTags?: string[];
  purposeTags?: string[];
  collectionTags?: string[];
  isEco?: boolean;
  isNew?: boolean;
  isHit?: boolean;
  templateType?: 'on_demand' | 'ready_template';
}

export interface Dimension {
  id: string;
  dim: string;
  w: number;
  h: number;
  d: number;
  active: boolean;
  categoryId: string;
  directPriceOverride?: number; // Optional direct base unit price override (֏)
  priceMultiplier?: number;     // Optional custom size price multiplier
}

export interface Finish {
  key: string;
  label: string;
  icon: string;
  price: number;
  active: boolean;
  categoryId?: string;
}

export interface PricingRules {
  pp210: number;
  pp300: number;
  fixed: number;
  lam: number;
  cord: number;
  c2: number;
  c4: number;
  s2: number;
  dig: number;
  desfee: number;
  minQty: number;
  minAmount?: number;
  markup?: number;
  margin?: number;
  disc?: number;
  profitMarginPercent?: number;
  deliveryBase?: number;
  deliveryPerKm?: number;
  packagingBase?: number;

  // Ribbons pricing
  ribbon_satin_base_2cm?: number;
  ribbon_satin_base_2_5cm?: number;
  ribbon_satin_base_3cm?: number;
  ribbon_satin_base_4cm?: number;
  ribbon_reps_mult?: number;
  ribbon_setup?: number;
  ribbon_foil_per_meter?: number;
  ribbon_screen_per_meter?: number;
  ribbon_min_meters?: number;

  // Stickers pricing
  sticker_paper_gloss?: number;
  sticker_paper_matte?: number;
  sticker_vinyl_white?: number;
  sticker_vinyl_transparent?: number;
  sticker_contour_setup?: number;
  sticker_min_qty?: number;

  // Gift Cards pricing
  giftcard_a6_base?: number;
  giftcard_mini_base?: number;
  giftcard_euro_base?: number;
  giftcard_env_standard?: number;
  giftcard_env_kraft?: number;
  giftcard_env_colored?: number;
  giftcard_paper_softtouch?: number;
  giftcard_paper_textured?: number;
  giftcard_min_qty?: number;

  // Business Cards pricing
  businesscard_std_base?: number;
  businesscard_euro_base?: number;
  businesscard_paper_softtouch?: number;
  businesscard_paper_textured?: number;
  businesscard_double_sided_mult?: number;
  businesscard_corners_rounded?: number;
  businesscard_foil_setup?: number;
  businesscard_min_qty?: number;

  // Boxes specific parameters
  box_wall_thickness_standard?: number;   // millimeters
  box_wall_thickness_rigid?: number;      // millimeters
  box_thick_surcharge_1_5?: number;       // AMD
  box_thick_surcharge_2_0?: number;       // AMD
  box_thick_surcharge_2_5?: number;       // AMD
  box_thick_surcharge_3_0?: number;       // AMD
  box_assembly_cost_folding?: number;     // AMD
  box_assembly_cost_rigid?: number;       // AMD
  box_surcharge_magnetic?: number;        // AMD
  box_surcharge_shoulder_neck?: number;   // AMD
  box_min_sell_folding?: number;          // AMD
  box_min_sell_rigid?: number;            // AMD
  box_min_sell_magnetic?: number;         // AMD
  box_min_sell_shoulder_neck?: number;    // AMD
  box_rigid_height_floor?: number;        // cm
}

export interface Tier {
  id: string | number;
  qty: number;
  mult: number;
  best: boolean;
}

export interface OrderSubmission {
  id: string;
  type: string;
  customerName: string;
  customerPhone: string;
  details: string;
  totalPrice: number;
  ts: string | number;
  customerWhatsapp?: string;
  customerEmail?: string;
  status?: string;
  manager?: string;
  source?: string;
  qty?: number;
  managerComment?: string;
  invoiceCurrency?: string;
  invoiceAmount?: number;
  pdfUrl?: string;
  invoiceUrl?: string;
  statusHistory?: any[];
  trackingCode?: string;
  costPrice?: number;
  profit?: number;
  margin?: number;
  paymentStatus?: string;
  expectedReadyTs?: string;
  estimatedCompletionDate?: string;
  productionDeadline?: string;
  actualCompletionDate?: string;
  estimatedCompletionUpdatedAt?: string;
  productionDays?: number;
  artworkStatus?: string;
  artworkComment?: string;
  artworkUrl?: string;
  managerPhone?: string;
}

export interface PaperType {
  id: string;
  name: string;
  gsm: number;
  pricePerSqm: number;
  active: boolean;
  assignedProducts: string[];
}

export interface ContactSettings {
  whatsapp: string;
  email: string;
}

export interface AISettings {
  systemPrompt: string;
  temperature: number;
  modelName: string;
  enabled: boolean;
}

export interface DiscountCode {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  active: boolean;
  usedCount?: number;
  maxUses?: number;
  expiresAt?: string;
}

export interface PrintingMethod {
  id: string;
  name: string;
  minQty: number;
  maxW?: number;
  minW?: number;
  maxH?: number;
  minH?: number;
  maxD?: number;
  minD?: number;
  setupCost: number;
  pricePerUnit: number;
  priceMultiplier: number;
  allowedCategories: string[];
  allowedMaterials?: string[];
  warningMessage?: string;
  productionDays?: number;
  active: boolean;
}

export interface BagRibbonHandle {
  id: string;
  widthCm: number;
  label: string;
  price: number;
  active: boolean;
}

// === DYNAMIC PRODUCT & PRICING ENGINE ===

export interface ProductOptionValue {
  id: string;
  label: string;
  priceModifier: number; // Amount or percentage to adjust
  modifierType: "add" | "percent" | "multiply"; // How to apply the modifier
}

export interface ProductOption {
  id: string;
  label: string;
  type: "select" | "radio" | "checkbox";
  required: boolean;
  values: ProductOptionValue[];
}

export interface SizingConfig {
  showWidth: boolean;
  showHeight: boolean;
  showDepth: boolean;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  minDepth?: number;
  maxDepth?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  defaultDepth?: number;
  unit?: string; // cm, mm, etc.
}

export interface DynamicCategory {
  id: string;
  name: string;
  navLabel?: string;
  active: boolean;
  sizing: SizingConfig;
  showQuantitySelector: boolean;
  minQty: number;
  qtyPresets?: number[];
  options: ProductOption[];
}

export interface SizePricingFormula {
  formulaType: "area" | "perimeter" | "volume" | "fixed"; // pricing based on area, perimeter, volume or a fixed base
  basePrice: number; // constant base price
  coefficient: number; // multiplier per sq cm, cm, cubic cm, etc.
  minPrice?: number; // fallback minimum price
}

export interface DynamicProduct {
  id: string;
  categoryId: string; // references DynamicCategory or standard Category id
  name: string;
  desc?: string;
  active: boolean;
  basePrice: number;
  pricingFormula: SizePricingFormula;
  options: ProductOption[]; // Product-specific custom overrides or extra options
}

export interface PaymentMethod {
  id: string;
  name: string; // machine name, like "visa", "mastercard", etc.
  title: {
    hy: string;
    en: string;
    ru: string;
    ar: string;
  };
  description: {
    hy: string;
    en: string;
    ru: string;
    ar: string;
  };
  iconSvg: string; // full XML SVG string or raw inner SVG paths
  sortOrder: number;
  active: boolean;
}

export interface FeaturedProduct {
  id: string;
  nameHy: string;
  nameRu: string;
  nameEn: string;
  minQtyTextHy: string;
  minQtyTextRu: string;
  minQtyTextEn: string;
  tagHy: string;
  tagRu: string;
  tagEn: string;
  secondaryTagHy?: string;
  secondaryTagRu?: string;
  secondaryTagEn?: string;
  categoryId: string;
  image: string;
  active: boolean;
  productId?: string;
}


