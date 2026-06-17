import { pgTable, serial, text, integer, boolean, real, jsonb, timestamp } from "drizzle-orm/pg-core";

// 1. Roles and Users Table (RBAC)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase Authentication UID
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("Super Admin"), // Roles: Super Admin, Manager, Sales, Production, Translator
  twoFactorSecret: text("two_factor_secret"),
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. Generic Configurations (Holds JSON blocks like pricingRules, siteTexts, aiSettings)
export const configurations = pgTable("configurations", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 3. Category Table (Supporting Draft/Publish)
export const categories = pgTable("categories", {
  id: text("id").primaryKey(), // e.g., 'bags', 'boxes'
  name: text("name").notNull(),
  navLabel: text("nav_label"),
  active: boolean("active").notNull().default(true),
  heroTitle: text("hero_title"),
  heroDesc: text("hero_desc"),
  heroBadge: text("hero_badge"),
  heroSmall: text("hero_small"),
  ruleChips: text("rule_chips"),
  minQty: integer("min_qty").notNull().default(100),
  qtyPresets: jsonb("qty_presets").$type<number[]>(),
  status: text("status").notNull().default("published"), // 'draft' | 'published'
  createdAt: timestamp("created_at").defaultNow(),
});

// 4. Products Table (Supporting Draft/Publish)
export const products = pgTable("products", {
  id: text("id").primaryKey(), // e.g., 'bags_items', 'boxes_items'
  categoryId: text("category_id").references(() => categories.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  desc: text("desc"),
  waText: text("wa_text"),
  orderNote: text("order_note"),
  active: boolean("active").notNull().default(true),
  status: text("status").notNull().default("published"), // 'draft' | 'published'
  createdAt: timestamp("created_at").defaultNow(),
});

// 5. Product Items Table (Nesting pricing items)
export const productItems = pgTable("product_items", {
  id: text("id").primaryKey(), // e.g., 'std_210'
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  unit: text("unit").notNull().default("հատ"),
  active: boolean("active").notNull().default(true),
});

// 6. Dimensions Table
export const dimensions = pgTable("dimensions", {
  id: text("id").primaryKey(),
  dim: text("dim").notNull(),
  w: real("w").notNull(),
  h: real("h").notNull(),
  d: real("d").notNull(),
  active: boolean("active").notNull().default(true),
  categoryId: text("category_id").references(() => categories.id, { onDelete: "cascade" }).notNull(),
  directPriceOverride: real("direct_price_override"),
  priceMultiplier: real("price_multiplier"),
});

// 7. Finishes Table
export const finishes = pgTable("finishes", {
  key: text("key").primaryKey(), // e.g. 'fin_spotUv'
  label: text("label").notNull(),
  icon: text("icon").notNull(),
  price: real("price").notNull(),
  active: boolean("active").notNull().default(true),
  categoryId: text("category_id").references(() => categories.id, { onDelete: "cascade" }).notNull(),
});

// 8. Papers Table
export const papers = pgTable("papers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  gsm: integer("gsm").notNull(),
  pricePerSqm: real("price_per_sqm").notNull(),
  active: boolean("active").notNull().default(true),
  assignedProducts: jsonb("assigned_products").$type<string[]>().notNull(), // JSON list e.g., ["bags"]
});

// 9. Printing Methods Table
export const printingMethods = pgTable("printing_methods", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  active: boolean("active").notNull().default(true),
  minQty: integer("min_qty").notNull().default(100),
  setupCost: real("setup_cost").notNull(),
  pricePerUnit: real("price_per_unit").notNull(),
  priceMultiplier: real("price_multiplier").notNull().default(1.0),
  minW: real("min_w"),
  maxW: real("max_w"),
  minH: real("min_h"),
  maxH: real("max_h"),
  minD: real("min_d"),
  maxD: real("max_d"),
  allowedCategories: jsonb("allowed_categories").$type<string[]>().notNull(),
  allowedMaterials: jsonb("allowed_materials").$type<string[]>(),
  warningMessage: text("warning_message"),
  productionDays: integer("production_days").default(5),
});

// 10. Submissions/Orders Table
export const submissions = pgTable("submissions", {
  id: text("id").primaryKey(),
  ts: text("ts").notNull(),
  type: text("type").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  details: text("details").notNull(),
  totalPrice: real("total_price").notNull(),
  customerWhatsapp: text("customer_whatsapp"),
  customerEmail: text("customer_email"),
  status: text("status").notNull().default("Новый"),
  manager: text("manager").notNull().default("Unassigned"),
  source: text("source").notNull().default("Website"),
  qty: integer("qty").default(1),
  itemsList: jsonb("items_list"), // [{name: string, desc: string, price: number, qty: number}]
  managerComment: text("manager_comment"),
  invoiceCurrency: text("invoice_currency").default("AMD"),
  invoiceAmount: real("invoice_amount"),
  pdfUrl: text("pdf_url"),
  invoiceUrl: text("invoice_url"),
  statusHistory: jsonb("status_history"), // [{status: string, ts: string, manager: string}]
  trackingCode: text("tracking_code"),
  costPrice: real("cost_price").default(0), // себестоимость
  profit: real("profit").default(0), // прибыль
  margin: real("margin").default(0), // маржа (%)
  paymentStatus: text("payment_status").default("не оплачено"), // 'не оплачено', 'частично оплачено', 'оплачено'
  expectedReadyTs: text("expected_ready_ts"), // ожидаемая дата готовности
  artworkStatus: text("artwork_status").default("нет макета"), // 'нет макета', 'ожидает утверждения', 'утвержден', 'на доработке'
  artworkComment: text("artwork_comment"), // комментарий к макету
  artworkUrl: text("artwork_url"), // ссылка на макет
  managerPhone: text("manager_phone"), // телефон менеджера для WhatsApp связи
  estimatedCompletionDate: text("estimated_completion_date"), // ожидаемая дата готовности
  productionDays: integer("production_days").default(5), // количество дней производства
  productionDeadline: text("production_deadline"), // крайний срок производства
  actualCompletionDate: text("actual_completion_date"), // фактическая дата выполнения
  estimatedCompletionUpdatedAt: text("estimated_completion_updated_at"), // дата изменения планируемой даты
});

// WhatsApp Integration Logs
export const whatsappLogs = pgTable("whatsapp_logs", {
  id: serial("id").primaryKey(),
  customerPhone: text("customer_phone").notNull(),
  messageText: text("message_text").notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
  status: text("status").notNull().default("Sent"),
  manager: text("manager").notNull().default("System"),
});

// Customer CRM
export const customers = pgTable("customers", {
  phone: text("phone").primaryKey(),
  name: text("name").notNull(),
  comments: text("comments"),
  isVip: boolean("is_vip").notNull().default(false),
  company: text("company"),
  website: text("website"),
  instagram: text("instagram"),
  customerSource: text("customer_source"),
  assignedManager: text("assigned_manager"),
  notes: text("notes"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 11. Custom Fields Definition table (Dynamic schema creation)
export const customFields = pgTable("custom_fields", {
  id: serial("id").primaryKey(),
  categoryId: text("category_id").references(() => categories.id, { onDelete: "cascade" }), // Can apply generally to a category
  name: text("name").notNull(), // internal slug name
  label: text("label").notNull(), // display label
  type: text("type").notNull(), // 'text' | 'number' | 'select' | 'multiselect' | 'color' | 'image' | 'file' | 'boolean'
  options: jsonb("options").$type<string[]>(), // options list for select/multiselect
  required: boolean("required").notNull().default(false),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// 12. Custom Fields Values table (Instance values)
export const customFieldValues = pgTable("custom_field_values", {
  id: serial("id").primaryKey(),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }), // can attach to products
  submissionId: text("submission_id").references(() => submissions.id, { onDelete: "cascade" }), // or straight to orders/submissions
  fieldId: integer("field_id").references(() => customFields.id, { onDelete: "cascade" }).notNull(),
  value: text("value").notNull(), // Stored payload (can be string or stringified JSON list)
  createdAt: timestamp("created_at").defaultNow(),
});

// 13. Audit Log (Tracking all Admin modifications for Enterprise compliance)
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id"), // Firebase UID
  userEmail: text("user_email"),
  action: text("action").notNull(), // "INSERT" | "UPDATE" | "DELETE" | "PUBLISH"
  tableName: text("table_name").notNull(),
  recordId: text("record_id").notNull(),
  oldValue: jsonb("old_value"),
  newValue: jsonb("new_value"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 14. Database Translation Center Table
export const translations = pgTable("translations", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // e.g. 'menu.calculator', 'common.width'
  hy: text("hy").notNull(),
  ru: text("ru").notNull(),
  en: text("en").notNull(),
  ar: text("ar").notNull(),
  category: text("category").notNull().default("general"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 15. Visual Formula Builder Table
export const formulas = pgTable("formulas", {
  id: text("id").primaryKey(), // e.g., 'bags_formula', 'boxes_formula'
  name: text("name").notNull(),
  target: text("target").notNull(), // e.g. 'bags', 'boxes', 'stickers'
  expression: text("expression").notNull(), // Math expression: e.g. "(w * h * d * paper_price + finishes_price) * qty * markup"
  variables: jsonb("variables").notNull(), // Array of variables e.g. [{ name: "paper_price", type: "number", value: 4.5 }]
  conditions: jsonb("conditions"), // Condition blocks e.g. [{ if: "qty > 1000", then: "markup = 0.8" }]
  coefficients: jsonb("coefficients"), // Special key-value weight adjustments
  active: boolean("active").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 16. Workflow Automation Builder Table
export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  triggerEvent: text("trigger_event").notNull(), // 'on_submission' | 'on_status_change' | 'on_custom_field_update'
  actions: jsonb("actions").$type<any[]>().notNull(), // [{ type: 'telegram', active: true, config: { token: '', chat_id: '' } }]
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// 17. Version History Snapshots Table for 1-Click DB Snapshot Rollback
export const dbSnapshots = pgTable("db_snapshots", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  snapshotData: jsonb("snapshot_data").notNull(), // Entire configurations, products, categories, papers, formulas, translations state
  userId: text("user_id"),
  userEmail: text("user_email"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 18. Client Accounts Table
export const clientAccounts = pgTable("client_accounts", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  phone: text("phone").unique(),
  name: text("name"),
  company: text("company"),
  legalDetails: text("legal_details"),
  authProvider: text("auth_provider").notNull().default("email"), // 'email' | 'google' | 'whatsapp'
  passwordHash: text("password_hash"),
  role: text("role").notNull().default("Client"), // 'Client' | 'Partner'
  partnerDiscount: real("partner_discount").default(15.0),
  partnerClients: jsonb("partner_clients").$type<{name: string, email: string, phone: string}[]>().default([]),
  otpCode: text("otp_code"),
  otpExpiresAt: timestamp("otp_expires_at"),
  savedConfigs: jsonb("saved_configs").$type<any[]>().default([]),
  notifications: jsonb("notifications").$type<any[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// 18b. Client Sessions Table
export const clientSessions = pgTable("client_sessions", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clientAccounts.id, { onDelete: "cascade" }).notNull(),
  token: text("token").notNull().unique(),
  rememberMe: boolean("remember_me").notNull().default(false),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 18c. Password Reset Tokens Table
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 18d. Email Verifications Table
export const emailVerifications = pgTable("email_verifications", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// 18e. Client Saved Calculations Table
export const clientSavedCalculations = pgTable("client_saved_calculations", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clientAccounts.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  productType: text("product_type").notNull(), // e.g. 'bags', 'boxes'
  qty: integer("qty").notNull(),
  totalPrice: real("total_price").notNull(),
  details: jsonb("details").notNull(), // calculations inputs
  createdAt: timestamp("created_at").defaultNow(),
});

// 18f. Favorite Configurations Table
export const favoriteConfigurations = pgTable("favorite_configurations", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clientAccounts.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  productType: text("product_type").notNull(),
  details: jsonb("details").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 19. Artwork Approvals Table
export const artworkApprovals = pgTable("artwork_approvals", {
  id: serial("id").primaryKey(),
  submissionId: text("submission_id").references(() => submissions.id, { onDelete: "cascade" }).notNull(),
  artworkUrl: text("artwork_url").notNull(),
  status: text("status").notNull().default("pending"), // 'pending' | 'approved' | 'rejected'
  customerComment: text("customer_comment"),
  history: jsonb("history").$type<any[]>().default([]), // audit history
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 20. Tasks Table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  submissionId: text("submission_id").references(() => submissions.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'call' | 'proposal' | 'payment' | 'artwork' | 'production'
  description: text("description"),
  deadline: timestamp("deadline"),
  priority: text("priority").notNull().default("medium"), // 'high' | 'medium' | 'low'
  assignedTo: text("assigned_to"), // user email or uid
  status: text("status").notNull().default("pending"), // 'pending' | 'in_progress' | 'completed'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 21. Business Expenses Table
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  amount: real("amount").notNull(),
  category: text("category").notNull(),
  date: timestamp("date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 22. Workshop Job Sheets Table
export const jobSheets = pgTable("job_sheets", {
  id: serial("id").primaryKey(),
  submissionId: text("submission_id").references(() => submissions.id, { onDelete: "cascade" }).notNull(),
  specifications: jsonb("specifications").$type<any>().notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 23. Enterprise Media Library Table
export const mediaLibrary = pgTable("media_library", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(), // 'image' | 'video' | 'pdf' | 'logo' | 'document'
  fileSize: text("file_size"),
  folder: text("folder").default("general"),
  tags: jsonb("tags").$type<string[]>().default([]),
  uploadedBy: text("uploaded_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 24. Security Access Entry Logs
export const accessLogs = pgTable("access_logs", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  status: text("status").notNull(), // 'success' | 'failed_wrong_password' | 'failed_locked'
  createdAt: timestamp("created_at").defaultNow(),
});

// 25. Omnichannel Notification Logs
export const notificationLogs = pgTable("notification_logs", {
  id: serial("id").primaryKey(),
  channel: text("channel").notNull(), // 'whatsapp' | 'telegram' | 'email'
  event: text("event").notNull(), // e.g. 'new_order', 'status_change', 'artwork_approval'
  recipient: text("recipient").notNull(),
  messageText: text("message_text").notNull(),
  status: text("status").notNull().default("sent"), // 'sent' | 'failed' | 'pending'
  sentAt: timestamp("sent_at").defaultNow(),
});

// 26. Order Files (customer-facing)
export const orderFiles = pgTable("order_files", {
  id: serial("id").primaryKey(),
  submissionId: text("submission_id").references(() => submissions.id, { onDelete: "cascade" }).notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(), // 'quote' | 'invoice' | 'artwork' | 'preview' | 'spec'
  createdAt: timestamp("created_at").defaultNow(),
});

// 27. Customer Reviews and Satisfaction Rating
export const customerReviews = pgTable("customer_reviews", {
  id: serial("id").primaryKey(),
  submissionId: text("submission_id").references(() => submissions.id, { onDelete: "cascade" }).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 28. Client Omnichannel Notification Preferences
export const notificationPreferences = pgTable("notification_preferences", {
  id: serial("id").primaryKey(),
  submissionId: text("submission_id").references(() => submissions.id, { onDelete: "cascade" }).notNull(),
  whatsapp: boolean("whatsapp").default(false).notNull(),
  email: boolean("email").default(false).notNull(),
  telegram: boolean("telegram").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

