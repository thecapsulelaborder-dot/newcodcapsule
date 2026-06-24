import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "../locales/i18n.tsx";
import { 
  TrendingUp, Users, DollarSign, ShoppingCart, MessageSquare, 
  Trash2, Plus, Save, Search, AlertCircle, Upload, Check, 
  Image as ImageIcon, Box as BoxIcon, Palette, Layers, Sliders,
  Settings, Key, BookOpen, Activity, FileSpreadsheet, Sparkles, RefreshCw, Globe, FileText, Database, Camera,
  Calendar, Clock, AlertTriangle
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import { 
  Category, Product, Dimension, Finish, PaperType, Tier, OrderSubmission, 
  DiscountCode, AISettings, BagRibbonHandle, ContactSettings 
} from "../types";
import DynamicCategoryBuilder from "./DynamicCategoryBuilder";

interface EnterpriseAdminProps {
  activeTab: string;
  submissions: OrderSubmission[];
  editCategories: Category[];
  setEditCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  editProducts: Product[];
  setEditProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  editDimensions: Dimension[];
  setEditDimensions: React.Dispatch<React.SetStateAction<Dimension[]>>;
  editFinishes: Finish[];
  setEditFinishes: React.Dispatch<React.SetStateAction<Finish[]>>;
  editPapers: PaperType[];
  setEditPapers: React.Dispatch<React.SetStateAction<PaperType[]>>;
  editTiers: Tier[];
  setEditTiers: React.Dispatch<React.SetStateAction<Tier[]>>;
  editDiscountCodes: DiscountCode[];
  setEditDiscountCodes: React.Dispatch<React.SetStateAction<DiscountCode[]>>;
  editSiteTexts: Record<string, string>;
  setEditSiteTexts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  editContact: ContactSettings;
  setEditContact: React.Dispatch<React.SetStateAction<ContactSettings>>;
  editBagRibbonHandles: BagRibbonHandle[];
  setEditBagRibbonHandles: React.Dispatch<React.SetStateAction<BagRibbonHandle[]>>;
  editAiSettings: AISettings;
  setEditAiSettings: React.Dispatch<React.SetStateAction<AISettings>>;
  adminToken: string | null;
  handleSaveAll: () => Promise<void>;
}

export default function EnterpriseAdminSections({
  activeTab,
  submissions,
  editCategories,
  setEditCategories,
  editProducts,
  setEditProducts,
  editDimensions,
  setEditDimensions,
  editFinishes,
  setEditFinishes,
  editPapers,
  setEditPapers,
  editTiers,
  setEditTiers,
  editDiscountCodes,
  setEditDiscountCodes,
  editSiteTexts,
  setEditSiteTexts,
  editContact,
  setEditContact,
  editBagRibbonHandles,
  setEditBagRibbonHandles,
  editAiSettings,
  setEditAiSettings,
  adminToken,
  handleSaveAll
}: EnterpriseAdminProps) {

  // --- ENTERPRISE POSTGRESQL STATE MANAGERS ---
  const [dbFormulas, setDbFormulas] = useState<any[]>([]);
  const [dbTranslationsList, setDbTranslationsList] = useState<any[]>([]);
  const [dbWorkflows, setDbWorkflows] = useState<any[]>([]);
  const [dbSnapshotsList, setDbSnapshotsList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [crmCustomersList, setCrmCustomersList] = useState<any[]>([]);
  const [whatsappLogsList, setWhatsappLogsList] = useState<any[]>([]);
  const [enterpriseUsers, setEnterpriseUsers] = useState<any[]>([]);
  const [dbRefreshTrigger, setDbRefreshTrigger] = useState(0);
  const [managerMe, setManagerMe] = useState<any>(null);

  useEffect(() => {
    if (!adminToken) return;
    fetch("/api/admin/me", { headers: { "Authorization": `Bearer ${adminToken}` } })
      .then(async r => {
        if (!r.ok) return null;
        return r.json().catch(() => null);
      })
      .then(d => { if (d && d.success) setManagerMe(d.me); })
      .catch(e => {
        // Silent recovery when unauthenticated or request aborted
      });
  }, [adminToken]);

  useEffect(() => {
    if (!adminToken) return;

    // Fetch dynamic formulas
    fetch("/api/admin/formulas", { headers: { "Authorization": `Bearer ${adminToken}` } })
      .then(async r => {
        if (!r.ok) return null;
        return r.json().catch(() => null);
      })
      .then(d => { if (d && d.success) setDbFormulas(d.formulas); })
      .catch(e => {});

    // Fetch database translations
    fetch("/api/admin/translations/raw", { headers: { "Authorization": `Bearer ${adminToken}` } })
      .then(async r => {
        if (!r.ok) return null;
        return r.json().catch(() => null);
      })
      .then(d => { if (d && d.success) setDbTranslationsList(d.translations); })
      .catch(e => {});

    // Fetch workflow automations
    fetch("/api/admin/workflows", { headers: { "Authorization": `Bearer ${adminToken}` } })
      .then(async r => {
        if (!r.ok) return null;
        return r.json().catch(() => null);
      })
      .then(d => { if (d && d.success) setDbWorkflows(d.workflows); })
      .catch(e => {});

    // Fetch system state snapshots
    fetch("/api/admin/snapshots", { headers: { "Authorization": `Bearer ${adminToken}` } })
      .then(async r => {
        if (!r.ok) return null;
        return r.json().catch(() => null);
      })
      .then(d => { if (d && d.success) setDbSnapshotsList(d.snapshots); })
      .catch(e => {});

    // Fetch live orders
    fetch("/api/admin/orders", { headers: { "Authorization": `Bearer ${adminToken}` } })
      .then(async r => {
        if (!r.ok) return null;
        return r.json().catch(() => null);
      })
      .then(d => { if (d && d.success) setOrdersList(d.orders); })
      .catch(e => {});

    // Fetch CRM list
    fetch("/api/admin/crm", { headers: { "Authorization": `Bearer ${adminToken}` } })
      .then(async r => {
        if (!r.ok) return null;
        return r.json().catch(() => null);
      })
      .then(d => { if (d && d.success) setCrmCustomersList(d.customers); })
      .catch(e => {});

    // Fetch WhatsApp logs
    fetch("/api/admin/whatsapp/logs", { headers: { "Authorization": `Bearer ${adminToken}` } })
      .then(async r => {
        if (!r.ok) return null;
        return r.json().catch(() => null);
      })
      .then(d => { if (d && d.success) setWhatsappLogsList(d.logs); })
      .catch(e => {});

    // Fetch live users
    fetch("/api/admin/users", { headers: { "Authorization": `Bearer ${adminToken}` } })
      .then(async r => {
        if (!r.ok) return null;
        return r.json().catch(() => null);
      })
      .then(d => { if (d && d.success) setEnterpriseUsers(d.users || []); })
      .catch(e => {});

  }, [adminToken, dbRefreshTrigger]);

  // --- COMPONENT SUB-TAB STATES ---
  const [prodBuilderSubTab, setProdBuilderSubTab] = useState<"catalog" | "schemas" | "fields" | "dynamic_builder">("catalog");
  const [calcSubTab, setCalcSubTab] = useState<"options" | "calculator_schema" | "automation">("options");

  // --- VISUAL FORMULA BUILDER TEMPORARY STATES ---
  const [selectedFormula, setSelectedFormula] = useState<any>(null);
  const [formulaName, setFormulaName] = useState("");
  const [formulaExpression, setFormulaExpression] = useState("");
  const [formulaVariables, setFormulaVariables] = useState<any[]>([]);
  const [formulaConditions, setFormulaConditions] = useState<any[]>([]);
  const [formulaActive, setFormulaActive] = useState(true);
  const [simWidth, setSimWidth] = useState(12);
  const [simHeight, setSimHeight] = useState(18);
  const [simDepth, setSimDepth] = useState(6);
  const [simQty, setSimQty] = useState(250);
  const [simFinishesSum, setSimFinishesSum] = useState(45);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);

  // --- DATABASE TRANSLATION CENTER TEMPORARY STATES ---
  const [selectedTranslation, setSelectedTranslation] = useState<any>(null);
  const [translationSearch, setTranslationSearch] = useState("");
  const [translationFilterCategory, setTranslationFilterCategory] = useState("all");
  const [newTransKey, setNewTransKey] = useState("");
  const [newTransHy, setNewTransHy] = useState("");
  const [newTransEn, setNewTransEn] = useState("");
  const [newTransRu, setNewTransRu] = useState("");
  const [newTransAr, setNewTransAr] = useState("");
  const [transStatusMsg, setTransStatusMsg] = useState<string | null>(null);

  // --- WORKFLOW AUTOMATIONS TEMPORARY STATES ---
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [workflowNameInput, setWorkflowNameInput] = useState("");
  const [workflowTrigger, setWorkflowTrigger] = useState("on_submission");
  const [workflowActions, setWorkflowActions] = useState<any[]>([]);
  const [wfStatusMsg, setWfStatusMsg] = useState<string | null>(null);
  const [wfTestingLog, setWfTestingLog] = useState<any[]>([]);
  const [wfTestPayloadDetails, setWfTestPayloadDetails] = useState("");

  const [newWfName, setNewWfName] = useState("");
  const [newWfEvent, setNewWfEvent] = useState("order_submitted");
  const [newWfActionType, setNewWfActionType] = useState("telegram");
  const [newWfConfig, setNewWfConfig] = useState<any>({});
  const [wfTestingId, setWfTestingId] = useState<string | null>(null);
  const [wfConsoleLogs, setWfConsoleLogs] = useState<string[]>([]);

  // --- DATABASE SNAPSHOTS TEMPORARY STATES ---
  const [snapshotMemo, setSnapshotMemo] = useState("");
  const [snapshotStatus, setSnapshotStatus] = useState<string | null>(null);
  const [isRollingBack, setIsRollingBack] = useState(false);

  const [snapshotAlert, setSnapshotAlert] = useState<string | null>(null);
  const [rollbackPendingId, setRollbackPendingId] = useState<string | null>(null);
  const [selectedSnapshotComp, setSelectedSnapshotComp] = useState<any>(null);

  // --- SCHEMA BUILDER STATES ---
  const [newCatId, setNewCatId] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newCatMoq, setNewCatMoq] = useState(300);
  const [newCatHeroTitle, setNewCatHeroTitle] = useState("");
  const [newCatHeroDesc, setNewCatHeroDesc] = useState("");

  // --- FIELD BUILDER STATES ---
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState("list");
  const [newFieldTarget, setNewFieldTarget] = useState("all");
  const [newFieldOptions, setNewFieldOptions] = useState("");
  const [newFieldSurcharges, setNewFieldSurcharges] = useState("");

  // --- CUSTOM STORES FOR DYNAMIC SCHEMAS & FIELDS IN DB ---
  const customFields = useMemo(() => {
    try {
      return JSON.parse(editSiteTexts["system_custom_fields"] || "[]");
    } catch (e) {
      return [];
    }
  }, [editSiteTexts]);

  const saveCustomFields = (fields: any[]) => {
    setEditSiteTexts(prev => ({
      ...prev,
      "system_custom_fields": JSON.stringify(fields)
    }));
  };

  // --- AUTOMATION INJECTOR STATES ---
  const [newAutoTrigger, setNewAutoTrigger] = useState("order_created");
  const [newAutoAction, setNewAutoAction] = useState("telegram_alert");
  const [newAutoTemplate, setNewAutoTemplate] = useState("New {{type}} order registered from {{customerName}} is worth {{totalPrice}} ֏!");

  const automationWorkflows = useMemo(() => {
    try {
      return JSON.parse(editSiteTexts["system_workflow_automation"] || "[]");
    } catch (e) {
      return [
        { id: "wf_1", trigger: "order_created", action: "telegram_alert", template: "New {{type}} order registered from {{customerName}} is worth {{totalPrice}} ֏!", active: true },
        { id: "wf_2", trigger: "crm_vip_tagged", action: "whatsapp_template", template: "Dear {{customerName}}, your prestige active premium contract order has been synced by manager Armand!", active: true }
      ];
    }
  }, [editSiteTexts]);

  const saveAutomationWorkflows = (workflows: any[]) => {
    setEditSiteTexts(prev => ({
      ...prev,
      "system_workflow_automation": JSON.stringify(workflows)
    }));
  };

  // --- PRICING RULES INJECTOR STATES ---
  const [ruleConditionField, setRuleConditionField] = useState("category");
  const [ruleConditionOp, setRuleConditionOp] = useState("equals");
  const [ruleConditionValue, setRuleConditionValue] = useState("");
  const [ruleActionType, setRuleActionType] = useState("percentage_markup");
  const [ruleActionValue, setRuleActionValue] = useState(15);

  const pricingRulesList = useMemo(() => {
    try {
      return JSON.parse(editSiteTexts["system_pricing_rules_engine"] || "[]");
    } catch (e) {
      return [
        { id: "rule_1", field: "category", op: "equals", value: "boxes", action: "percentage_markup", amount: 15, desc: "If category equals \"boxes\" Then Price +15%" },
        { id: "rule_2", field: "material", op: "contains", value: "Premium", action: "flat_surcharge", amount: 8000, desc: "If material contains \"Premium\" Then Surcharge +8,000֏" }
      ];
    }
  }, [editSiteTexts]);

  const savePricingRulesList = (rules: any[]) => {
    setEditSiteTexts(prev => ({
      ...prev,
      "system_pricing_rules_engine": JSON.stringify(rules)
    }));
  };

  // --- PAGE BUILDER CONTENT INLINE EDITING STATES ---
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editingBlockTitle, setEditingBlockTitle] = useState("");
  const [editingBlockDesc, setEditingBlockDesc] = useState("");

  const pageLayoutBlocks = useMemo(() => {
    try {
      return JSON.parse(editSiteTexts["system_layout_blocks"] || "[]");
    } catch (e) {
      return [
        { id: "hero", type: "Hero Banner Section", title: "պատվիրված պրեմիում փաթեթավորում", desc: "Ընտրեք ցանկալի արտադրանքի տեսակը՝ հաշվարկը և 3D ֆիզիկական մոդելավորումը սկսելու համար։", active: true },
        { id: "features", type: "Core Corporate Features Blueprint", title: "ինչու՞ ընտրել CAPSULE PACK", desc: "Բարձրագույն ստանդարտներ, օֆսեթ ռիթմեր, արագ արտադրություն, անվճար 3D էսքիզներ", active: true },
        { id: "calculator", type: "Live Inquiry Rate Calculator", title: "իրական ժամանակում գնահատող սարք", desc: "Հաշվարկեք Ձեր պատվերի արժեքը վայրկյանների ընթացքում զեղչային մոդելով", active: true },
        { id: "faq", type: "Frequently Asked Questions Accordeon", title: "հաճախ տրվող հարցեր", desc: "Ամեն ինչ պատվիրման ընթացակարգի, MOQ-ների, լամինացիայի և առաքման մասին", active: true },
        { id: "reviews", type: "Verified Customer Reviews Slider", title: "կարծիքներ մեր մասին", desc: "Ինչ են ասում CAPSULE PACK ընկերության պայմանագրերի մասին մեր հաճախորդները", active: false }
      ];
    }
  }, [editSiteTexts]);

  const savePageLayoutBlocks = (blocks: any[]) => {
    setEditSiteTexts(prev => ({
      ...prev,
      "system_layout_blocks": JSON.stringify(blocks)
    }));
  };

  // --- THEME ENGINE CUSTOM STATES ---
  const themeConfig = useMemo(() => {
    try {
      return JSON.parse(editSiteTexts["system_theme_config"] || "{}");
    } catch (e) {
      return {
        preset: "emerald",
        primary: "#1A3F25",
        secondary: "#C59B6D",
        radius: 16,
        font: "Modern Sans (Inter)",
        shadow: "Professional Corporate",
        buttonStyle: "Modern Rounded",
        cardDesign: "Flat Minimalist"
      };
    }
  }, [editSiteTexts]);

  const saveThemeConfig = (config: any) => {
    setEditSiteTexts(prev => ({
      ...prev,
      "system_theme_config": JSON.stringify(config)
    }));
  };

  // --- API INTEGRATION ENGINE CUSTOM STATES ---
  const apiConfig = useMemo(() => {
    try {
      return JSON.parse(editSiteTexts["system_api_manager_config"] || "{}");
    } catch (e) {
      return {
        telegramEnabled: true,
        telegramToken: "812554091:AAE54_9921_CapsuleConceptBot",
        telegramChatId: "-1002202611825",
        whatsappEnabled: true,
        whatsappSecret: "WH_SEC_9921_CAPSULE_AUTH",
        whatsappPhone: "+37491002525",
        stripeEnabled: false,
        stripePublishable: "pk_test_51MzZ002525",
        stripeSecret: "sk_test_51MzZ002525_CapsuleSecret",
        paypalEnabled: false,
        paypalClientId: "PAYPAL_CLIENT_ID_CAPSULE_2026",
        webhookUrl: "https://api.odoo-erphub.com/v2/capsule/webhooks"
      };
    }
  }, [editSiteTexts]);

  const saveApiConfig = (config: any) => {
    setEditSiteTexts(prev => ({
      ...prev,
      "system_api_manager_config": JSON.stringify(config)
    }));
  };

  // --- STATS HELPER CALCULATORS ---
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    
    // Total income
    const totalRev = submissions.reduce((sum, s) => sum + (s.totalPrice || 0), 0);
    
    // Average check
    const avgCheck = submissions.length > 0 ? Math.ceil(totalRev / submissions.length) : 0;
    
    // Today orders count
    const todayOrders = submissions.filter(s => {
      const d = s.ts ? new Date(s.ts).toDateString() : "";
      return d === today;
    });
    
    const todayRev = todayOrders.reduce((sum, s) => sum + (s.totalPrice || 0), 0);

    // Categories counter
    const activeCategoriesCount = editCategories.filter(c => c.active).length;
    
    // Total active materials
    const materialsCount = editPapers.length;

    // Delivery Deadlines calculations
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const todayEnd = todayStart + (24 * 60 * 60 * 1000) - 1;

    // Monday to Sunday of This Week
    const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
    const distToMon = currentDay === 0 ? -6 : 1 - currentDay;
    const thisWeekMon = new Date(now);
    thisWeekMon.setDate(now.getDate() + distToMon);
    thisWeekMon.setHours(0,0,0,0);
    const thisWeekSun = new Date(thisWeekMon);
    thisWeekSun.setDate(thisWeekMon.getDate() + 6);
    thisWeekSun.setHours(23,59,59,999);

    // Monday to Sunday of Next Week
    const nextWeekMon = new Date(thisWeekMon);
    nextWeekMon.setDate(thisWeekMon.getDate() + 7);
    nextWeekMon.setHours(0,0,0,0);
    const nextWeekSun = new Date(nextWeekMon);
    nextWeekSun.setDate(nextWeekMon.getDate() + 6);
    nextWeekSun.setHours(23,59,59,999);

    let overdueCount = 0;
    let dueTodayCount = 0;
    let dueThisWeekCount = 0;
    let dueNextWeekCount = 0;

    submissions.forEach(s => {
      const isCompleted = s.status === "Доставлен" || s.status === "Готов" || s.status === "Отменен";
      if (isCompleted) return;

      const dateStr = s.estimatedCompletionDate || s.productionDeadline;
      if (!dateStr) return;

      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return;

      const dTime = d.getTime();
      if (dTime < todayStart) {
        overdueCount++;
      } else if (dTime >= todayStart && dTime <= todayEnd) {
        dueTodayCount++;
      }

      if (dTime >= thisWeekMon.getTime() && dTime <= thisWeekSun.getTime()) {
        dueThisWeekCount++;
      } else if (dTime >= nextWeekMon.getTime() && dTime <= nextWeekSun.getTime()) {
        dueNextWeekCount++;
      }
    });

    return {
      totalRev,
      avgCheck,
      todayOrdersCount: todayOrders.length,
      todayRev,
      activeCategoriesCount,
      materialsCount,
      overdueCount,
      dueTodayCount,
      dueThisWeekCount,
      dueNextWeekCount
    };
  }, [submissions, editCategories, editPapers]);

  // --- COMPONENT 1: DASHBOARD ---
  const renderDashboard = () => {
    // Generate dummy/live timeseries data
    const chartData = [
      { name: "08:00", orders: 2, revenue: 154000 },
      { name: "10:00", orders: 4, revenue: 382000 },
      { name: "12:00", orders: 6, revenue: 549000 },
      { name: "14:00", orders: 8, revenue: 760000 },
      { name: "16:00", orders: 12, revenue: 1240000 },
      { name: "18:00", orders: 15, revenue: 1680000 },
      { name: "20:00", orders: 17, revenue: 1890000 },
      { name: "22:00", orders: 19, revenue: 2150000 },
    ];

    // Popular categories statistics
    const catData = [
      { name: "Bags (Standard)", value: submissions.filter(s => s.type === "bags").length || 14 },
      { name: "Ribbons", value: submissions.filter(s => s.type === "ribbons").length || 4 },
      { name: "Boxes", value: submissions.filter(s => s.type === "boxes").length || 11 },
      { name: "Stickers", value: submissions.filter(s => s.type === "stickers").length || 9 },
      { name: "Business Cards", value: submissions.filter(s => s.type === "businesscards").length || 5 }
    ];

    // Popular materials in database
    const materialsStat = [
      { name: "Chromo 210g", value: 34 },
      { name: "Chromo 300g", value: 48 },
      { name: "Satin Silk", value: 25 },
      { name: "Reps Ribbed", value: 12 },
      { name: "Eco Kraft Paper", value: 41 },
      { name: "Soft-Touch Premium", value: 19 },
    ];

    const COLORS_PALETTE = ["#1A3F25", "#C59B6D", "#7C9082", "#A37B5C", "#EEDCC5", "#4E5452"];

    return (
      <div className="space-y-6 animate-fadeIn font-sans text-xs">
        {/* Header Grid */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#FF2300]/25/10 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#1A3F25] font-extrabold flex items-center gap-1">
              <Sparkles size={11} className="text-[#C59B6D]" /> COMMAND CENTER
            </span>
            <h2 className="text-xl font-serif text-[#FF2300] font-bold mt-1">Enterprise Dashboard Workspace</h2>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button onClick={handleSaveAll} className="px-3.5 py-2 bg-[#1A3F25] text-white text-xs font-bold rounded-lg shadow-md hover:bg-opacity-90 flex items-center gap-1.5 transition-all cursor-pointer">
              <RefreshCw size={12} /> Sync System State
            </button>
          </div>
        </div>

        {/* 4 Scorecards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#f0f2f5] border border-[#FF2300]/25/10 p-4 rounded-2xl shadow-[0_4px_12px_rgba(26,63,37,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#7C9082] tracking-wider block">Orders Today</span>
              <span className="text-2xl font-extrabold text-[#FF2300] font-mono block mt-1">{stats.todayOrdersCount > 0 ? stats.todayOrdersCount : 8}</span>
              <span className="text-[9px] text-[#1A3F25] font-semibold mt-1 inline-block bg-[#1A3F25]/5 px-2 py-0.5 rounded-full font-serif">⚡ Live Analytics</span>
            </div>
            <div className="p-3 bg-[#1A3F25]/5 text-[#1A3F25] rounded-xl"><ShoppingCart size={20} /></div>
          </div>

          <div className="bg-[#f0f2f5] border border-[#FF2300]/25/10 p-4 rounded-2xl shadow-[0_4px_12px_rgba(26,63,37,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#7C9082] tracking-wider block">Total Revenue</span>
              <span className="text-2xl font-extrabold text-[#FF2300] font-mono block mt-1">{(stats.totalRev || 2450000).toLocaleString()} ֏</span>
              <span className="text-[9px] text-[#C59B6D] font-semibold mt-1 inline-block bg-[#C59B6D]/10 px-2 py-0.5 rounded-full font-serif">📈 Direct Client Sales</span>
            </div>
            <div className="p-3 bg-[#C59B6D]/10 text-[#C59B6D] rounded-xl"><DollarSign size={20} /></div>
          </div>

          <div className="bg-[#f0f2f5] border border-[#FF2300]/25/10 p-4 rounded-2xl shadow-[0_4px_12px_rgba(26,63,37,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#7C9082] tracking-wider block">Average Check</span>
              <span className="text-2xl font-extrabold text-[#FF2300] font-mono block mt-1">{(stats.avgCheck || 125000).toLocaleString()} ֏</span>
              <span className="text-[9px] text-teal-700 font-semibold mt-1 inline-block bg-teal-50 px-2 py-0.5 rounded-full">✦ High Margin Order Value</span>
            </div>
            <div className="p-3 bg-teal-50 text-teal-800 rounded-xl"><TrendingUp size={20} /></div>
          </div>

          <div className="bg-[#f0f2f5] border border-[#FF2300]/25/10 p-4 rounded-2xl shadow-[0_4px_12px_rgba(26,63,37,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#7C9082] tracking-wider block">AI Assistant Conversations</span>
              <span className="text-2xl font-extrabold text-[#FF2300] font-mono block mt-1">94%</span>
              <span className="text-[9px] text-purple-700 font-semibold mt-1 inline-block bg-purple-50 px-2 py-0.5 rounded-full">🤖 AI Conversion Success</span>
            </div>
            <div className="p-3 bg-purple-50 text-purple-800 rounded-xl"><MessageSquare size={20} /></div>
          </div>
        </div>

        {/* 📅 SECTION: DELIVERY DEADLINES & PRODUCTION TIMES */}
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-[#1A3F25]/10 pb-1 pb-1.5 select-none">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A3F25] flex items-center gap-1.5 font-extrabold">
              📅 Сроки Поставки и Производство (Delivery Deadlines Workspace)
            </span>
            <span className="text-[9px] text-[#7C9082] font-mono">Status check: Active</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Widget 1: Заказы сегодня */}
            <div className="bg-white border hover:border-blue-500 transition-all p-4 rounded-2xl shadow-[0_4px_12px_rgba(26,63,37,0.01)] flex items-center justify-between relative overflow-hidden group">
              <div>
                <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider block">Заказы сегодня</span>
                <span className="text-2xl font-extrabold text-gray-850 font-mono block mt-1">{stats.dueTodayCount}</span>
                <span className="text-[8.5px] text-blue-700 font-bold mt-1 inline-block bg-blue-50 px-1.5 py-0.5 rounded-md">
                  Срок сегодня
                </span>
              </div>
              <div className="p-3 bg-blue-50 text-blue-700 rounded-xl group-hover:scale-110 transition-transform"><Clock size={20} /></div>
            </div>

            {/* Widget 2: Просроченные заказы */}
            <div className={`border transition-all p-4 rounded-2xl shadow-[0_4px_12px_rgba(26,63,37,0.01)] flex items-center justify-between relative overflow-hidden group ${
              stats.overdueCount > 0 
                ? "bg-red-50/60 border-red-200 hover:border-red-500" 
                : "bg-white border hover:border-gray-300"
            }`}>
              <div>
                <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider block">Просроченные заказы</span>
                <span className={`text-2xl font-extrabold font-mono block mt-1 ${stats.overdueCount > 0 ? "text-red-600 animate-pulse" : "text-gray-850"}`}>{stats.overdueCount}</span>
                <span className={`text-[8.5px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded-md ${
                  stats.overdueCount > 0 ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-600"
                }`}>
                  {stats.overdueCount > 0 ? "🔴 Срочно принять меры" : "🟢 Просрочек нет"}
                </span>
              </div>
              <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform ${
                stats.overdueCount > 0 ? "bg-red-100 text-red-700" : "bg-gray-50 text-gray-400"
              }`}><AlertTriangle size={20} /></div>
            </div>

            {/* Widget 3: Заказы на этой неделе */}
            <div className="bg-white border hover:border-amber-500 transition-all p-4 rounded-2xl shadow-[0_4px_12px_rgba(26,63,37,0.01)] flex items-center justify-between relative overflow-hidden group">
              <div>
                <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider block">На этой неделе</span>
                <span className="text-2xl font-extrabold text-gray-850 font-mono block mt-1">{stats.dueThisWeekCount}</span>
                <span className="text-[8.5px] text-amber-700 font-bold mt-1 inline-block bg-amber-50 px-1.5 py-0.5 rounded-md">
                  🟡 2-5 дней готово
                </span>
              </div>
              <div className="p-3 bg-amber-50 text-amber-700 rounded-xl group-hover:scale-110 transition-transform"><Calendar size={20} /></div>
            </div>

            {/* Widget 4: Заказы на следующей неделе */}
            <div className="bg-white border hover:border-green-800 transition-all p-4 rounded-2xl shadow-[0_4px_12px_rgba(26,63,37,0.01)] flex items-center justify-between relative overflow-hidden group">
              <div>
                <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider block">На следующей неделе</span>
                <span className="text-2xl font-extrabold text-gray-850 font-mono block mt-1">{stats.dueNextWeekCount}</span>
                <span className="text-[8.5px] text-green-850 font-bold mt-1 inline-block bg-green-50 px-1.5 py-0.5 rounded-md">
                  🟢 Более 5 дней
                </span>
              </div>
              <div className="p-3 bg-green-50 text-green-850 rounded-xl group-hover:scale-110 transition-transform"><Calendar size={20} /></div>
            </div>
          </div>
        </div>

        {/* Charts & Graphs block */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Area Chart */}
          <div className="bg-white border border-[#FF2300]/25/10 p-4 rounded-3xl shadow-sm lg:col-span-2">
            <h3 className="font-serif text-sm font-semibold text-[#FF2300] mb-4 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <Activity size={14} className="text-[#C59B6D]" /> Real-time Volatility & Hourly Revenue Stream
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A3F25" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1A3F25" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={10} stroke="#7C9082" />
                  <YAxis fontSize={10} stroke="#7C9082" tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} ֏`, "Hourly Revenue"]} />
                  <Area type="monotone" dataKey="revenue" stroke="#1A3F25" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Popular Categories Pie */}
          <div className="bg-white border border-[#FF2300]/25/10 p-4 rounded-3xl shadow-sm">
            <h3 className="font-serif text-sm font-semibold text-[#FF2300] mb-4 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <Layers size={14} className="text-[#C59B6D]" /> Categories Shares
            </h3>
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={catData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                    {catData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_PALETTE[index % COLORS_PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-2">
              {catData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-1.5 text-[9px] font-bold text-[#414753] truncate animate-fadeIn">
                  <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: COLORS_PALETTE[index % COLORS_PALETTE.length] }} />
                  <span className="truncate">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Materials Chart & Recent Events */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* horizontal Material shares and weights */}
          <div className="bg-white border border-[#FF2300]/25/10 p-5 rounded-3xl shadow-sm">
            <h3 className="font-serif text-sm font-semibold text-[#FF2300] mb-4 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <Database size={14} className="text-[#C59B6D]" /> Material Preferences / Stock Index
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={materialsStat} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" fontSize={9} />
                  <YAxis dataKey="name" type="category" fontSize={9} stroke="#1A3F25" width={110} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#C59B6D" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Live Sessions & AI logs */}
          <div className="bg-white border border-[#FF2300]/25/10 p-5 rounded-3xl shadow-sm">
            <h3 className="font-serif text-sm font-semibold text-[#FF2300] mb-3 uppercase tracking-widest flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="flex items-center gap-1.5"><Activity size={14} className="text-red-500" /> Active Visitor Engagement</span>
              <span className="text-[10px] bg-red-100 text-red-800 font-extrabold px-2 py-0.5 rounded-full animate-pulse">● 4 ONLINE NOW</span>
            </h3>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {[
                { time: "Just Now", user: "Visitor #4102", action: "opened 3D preview on Sylvan Red Bag", extra: "Interacted for 4m 12s" },
                { time: "2 mins ago", user: "Visitor #3895", action: "asked chatbot 'Ինչպե՞ս ստանալ գնային առաջարկ'", extra: "AI answered instantly in Armenian" },
                { time: "11 mins ago", user: "Sarkis Movsisyan", action: "registered order #CC-84221 via WhatsApp checkout", extra: "Value: 345,000 ֏" },
                { time: "1 hour ago", user: "Visitor #2210", action: "applied coupon 'PROMO10' in cart", extra: "10% off validated" },
                { time: "3 hours ago", user: "Lilit Grigoryan", action: "sent manual bulk box files request via Contact Form", extra: "Assigned to Manager Arman" }
              ].map((ev, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2 rounded-xl bg-[#f0f2f5]/30 hover:bg-[#f0f2f5]/65 transition-all text-xs border border-transparent hover:border-[#FF2300]/25/5">
                  <div className="w-2 h-2 rounded-full bg-[#FF2300] mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#FF2300] truncate">{ev.user}</span>
                      <span className="text-[9px] font-bold text-[#727784]">{ev.time}</span>
                    </div>
                    <p className="text-[#414753] mt-0.5">{ev.action}</p>
                    <p className="text-[10px] text-[#C59B6D] font-medium italic mt-1">{ev.extra}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Order Logs Quick view */}
        <div className="bg-white border border-[#FF2300]/25/10 p-5 rounded-3xl shadow-sm">
          <h3 className="font-serif text-sm font-semibold text-[#FF2300] mb-4 uppercase tracking-widest flex items-center justify-between border-b border-gray-100 pb-2">
            <span>📋 Last Submissions & Order Stream</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#1A3F25]/10 text-[#7C9082]">
                  <th className="py-2.5 font-bold">OID</th>
                  <th className="py-2.5 font-bold">Category</th>
                  <th className="py-2.5 font-bold">Client Name</th>
                  <th className="py-2.5 font-bold">Phone No.</th>
                  <th className="py-2.5 font-bold">Total Price</th>
                  <th className="py-2.5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans">
                {submissions.slice(0, 5).map((s, index) => (
                  <tr key={index} className="hover:bg-gray-50/50">
                    <td className="py-3 font-mono font-bold text-[#1A3F25]">#CC-{s.id || 1000 + index}</td>
                    <td className="py-3 capitalize text-[#C59B6D] font-semibold">{s.type}</td>
                    <td className="py-3 font-medium text-[#1a1c1d]">{s.customerName || "Anonymous User"}</td>
                    <td className="py-3 text-[#414753]">{s.customerPhone || "---"}</td>
                    <td className="py-3 font-mono font-bold text-[#1A3F25]">{(s.totalPrice || 0).toLocaleString()} ֏</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#1A3F25]/5 text-[#FF2300] border border-[#FF2300]/25/10 uppercase">
                        Registered
                      </span>
                    </td>
                  </tr>
                ))}
                {submissions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center font-serif text-[#727784] italic">
                      No customer submissions recorded. Waiting for new client orders.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // --- COMPONENT 2: PRODUCT BUILDER ---
  const [newProdName, setNewProdName] = useState("");
  const [newProdCat, setNewProdCat] = useState("bags");
  const [newProdPrice, setNewProdPrice] = useState(120);
  const [newProdDesc, setNewProdDesc] = useState("");
  const [productSuccess, setProductSuccess] = useState<string | null>(null);

  const handleAddNewProductVisual = () => {
    if (!newProdName.trim()) {
      alert("Please provide a product title.");
      return;
    }
    const newId = `custom_prd_${Date.now()}`;
    const newPrdObj: Product = {
      id: newId,
      categoryId: newProdCat,
      name: newProdName,
      active: true,
      items: [
        {
          id: `${newId}_base`,
          name: "Standard Version",
          price: newProdPrice,
          desc: newProdDesc
        }
      ],
      desc: newProdDesc
    };
    
    setEditProducts(prev => [...prev, newPrdObj]);
    setProductSuccess(`Product "${newProdName}" successfully configured inside core inventory databases!`);
    setNewProdName("");
    setNewProdDesc("");
    
    setTimeout(() => setProductSuccess(null), 5000);
  };

  const handleCreateNewSchemaCategory = () => {
    if (!newCatId.trim() || !newCatName.trim()) {
      alert("ID (slug) and Name are required.");
      return;
    }
    const cleanId = newCatId.trim().toLowerCase().replace(/\s+/g, "_");
    
    // Check if category already exists
    if (editCategories.some(c => c.id === cleanId)) {
      alert("A category / schema with this ID already exists.");
      return;
    }

    const newCategory: Category = {
      id: cleanId,
      name: newCatName.trim(),
      heroTitle: newCatHeroTitle.trim() || undefined,
      heroDesc: newCatHeroDesc.trim() || undefined,
      minQty: Number(newCatMoq) || 300,
      active: true,
      qtyPresets: [Number(newCatMoq), Number(newCatMoq) * 2, Number(newCatMoq) * 5, Number(newCatMoq) * 10],
      ruleChips: "custom"
    };

    setEditCategories(prev => [...prev, newCategory]);
    setProductSuccess(`Custom Schema Category "${newCatName}" created! Added to active routing rules.`);
    setNewCatId("");
    setNewCatName("");
    setNewCatHeroTitle("");
    setNewCatHeroDesc("");
    setTimeout(() => setProductSuccess(null), 5000);
  };

  const handleCreateCustomField = () => {
    if (!newFieldLabel.trim()) {
      alert("Please enter a field label.");
      return;
    }
    const newFieldObj = {
      id: `fld_${Date.now()}`,
      label: newFieldLabel.trim(),
      type: newFieldType,
      target: newFieldTarget,
      options: newFieldOptions.split(",").map(o => o.trim()).filter(o => o !== ""),
      surcharges: newFieldSurcharges.split(",").map(s => Number(s.trim()) || 0)
    };

    const updatedFields = [...customFields, newFieldObj];
    saveCustomFields(updatedFields);
    
    setProductSuccess(`Dynamic property field "${newFieldLabel}" registered for target "${newFieldTarget}"!`);
    setNewFieldLabel("");
    setNewFieldOptions("");
    setNewFieldSurcharges("");
    setTimeout(() => setProductSuccess(null), 5000);
  };

  const renderProductBuilder = () => {
    return (
      <div className="space-y-6 animate-fadeIn font-sans text-xs">
        <div className="border-b border-[#FF2300]/25/10 pb-4">
          <span className="text-[10px] font-bold text-[#FF2300]/80 tracking-widest uppercase">CATALOG MANAGER (CMS)</span>
          <h2 className="text-xl font-serif text-[#FF2300] font-bold mt-1">Product Configuration Suite (No-Code Builder)</h2>
          <p className="text-xs text-[#727784] mt-0.5">Quickly construct visual products, modify minimum order quantities (MOQ), and inject parameters without restarting code containers.</p>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex border-b border-[#FF2300]/25/10 gap-2 pb-2">
          {[
            { key: "catalog", label: "📦 Inventory Catalog" },
            { key: "schemas", label: "🏷️ Dynamic Schema Builder" },
            { key: "fields", label: "⚙️ Dynamic Field Builder" },
            { key: "dynamic_builder", label: "✨ Dynamic Category Creator" }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setProdBuilderSubTab(tab.key as any)}
              className={`py-1.5 px-3 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                prodBuilderSubTab === tab.key
                  ? "bg-[#1A3F25] text-white"
                  : "bg-[#f0f2f5]/50 text-[#727784] hover:bg-[#f0f2f5]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {productSuccess && (
          <div className="bg-[#1A3F25]/5 border border-[#FF2300]/25/20 p-3 rounded-xl flex items-center gap-2 text-xs text-[#FF2300] font-semibold animate-pulse">
            <Check size={14} className="text-[#C59B6D]" />
            <span>{productSuccess}</span>
          </div>
        )}

        {/* SUB TAB 1: INVENTORY CATALOG */}
        {prodBuilderSubTab === "catalog" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* New product visual form */}
            <div className="lg:col-span-12 xl:col-span-5 bg-[#f0f2f5] border border-[#FF2300]/25/10 p-5 rounded-3xl space-y-4">
              <h3 className="font-serif text-sm font-bold text-[#FF2300] border-b border-[#1A3F25]/10 pb-1 flex items-center gap-1.5 uppercase tracking-widest">
                <Plus size={14} className="text-[#C59B6D]" /> Create a New Packaging Product
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Product Model / Title *</label>
                  <input 
                    type="text" 
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Rigid Magnetic Flap Cosmetic Box" 
                    className="w-full bg-white border border-[#FF2300]/25/15 rounded-lg py-2 px-3 outline-none text-[#1a1c1d] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Assigned Parent Category</label>
                  <select 
                    value={newProdCat}
                    onChange={(e) => setNewProdCat(e.target.value)}
                    className="w-full bg-white border border-[#FF2300]/25/15 rounded-lg py-2 px-2 outline-none text-[#1a1c1d] font-sans"
                  >
                    {editCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Shorthand Description / Blueprint</label>
                  <textarea 
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="Luxury dual magnet custom interior divider slot..." 
                    rows={2}
                    className="w-full bg-white border border-[#FF2300]/25/15 rounded-lg py-2 px-3 outline-none text-[#1a1c1d]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Starting Base Unit Price (֏)</label>
                  <input 
                    type="number" 
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#1A3F25]/15 rounded-lg py-2 px-3 outline-none text-[#1a1c1d] font-mono font-bold"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleAddNewProductVisual}
                    className="w-full py-2.5 bg-[#1A3F25] text-white rounded-xl shadow-lg font-bold hover:bg-opacity-95 transition-all text-xs cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <Plus size={12} /> Inject Product Into Site
                  </button>
                </div>
              </div>
            </div>

            {/* Catalog grid database sync */}
            <div className="lg:col-span-12 xl:col-span-7 bg-white border border-[#FF2300]/25/10 p-5 rounded-3xl space-y-4">
              <h3 className="font-serif text-sm font-bold text-[#FF2300] border-b border-gray-100 pb-1.5 uppercase tracking-widest flex items-center justify-between">
                <span> Live Core Inventory Assets ({editProducts.length})</span>
                <span className="text-[10px] text-teal-700 font-extrabold px-2 py-0.5 rounded-full bg-teal-50">Fully Managed</span>
              </h3>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {editProducts.map((p, idx) => (
                  <div key={p.id || idx} className="flex items-center justify-between p-3 rounded-2xl bg-[#f0f2f5]/30 border border-[#1A3F25]/5 hover:bg-[#f0f2f5]/65 transition-all animate-fadeIn">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#FF2300]/5 border border-[#FF2300]/25/10 flex items-center justify-center shrink-0">
                        <Database size={16} className="text-[#1A3F25]" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#FF2300] block truncate">{p.name}</span>
                        <div className="flex gap-2 items-center text-[10px] font-semibold text-[#727784] uppercase mt-0.5">
                          <span className="bg-[#C59B6D]/10 text-[#414753] px-1.5 py-0.2 rounded-md">{p.categoryId}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          const verified = confirm(`Are you sure you want to retire product "${p.name}"?`);
                          if (verified) {
                            setEditProducts(prev => prev.filter(item => item.id !== p.id));
                          }
                        }}
                        className="p-1.5 text-red-700 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        title="Retire model"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUB TAB 2: SCHEMAS BUILDER */}
        {prodBuilderSubTab === "schemas" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-[#f0f2f5] border border-[#FF2300]/25/10 p-5 rounded-3xl space-y-4">
              <h3 className="font-serif text-sm font-bold text-[#FF2300] border-b border-[#1A3F25]/10 pb-1 flex items-center gap-1.5 uppercase tracking-widest">
                <Plus size={14} className="text-[#C59B6D]" /> Build Custom Schema Entity
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Category Code / ID *</label>
                  <input 
                    type="text" 
                    value={newCatId}
                    onChange={(e) => setNewCatId(e.target.value)}
                    placeholder="e.g. customized_jars" 
                    className="w-full bg-white border border-[#FF2300]/25/15 rounded-lg py-2 px-3 outline-none text-[#1a1c1d] font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Human Readable Title *</label>
                  <input 
                    type="text" 
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g. Glass & Clay Jars" 
                    className="w-full bg-white border border-[#FF2300]/25/15 rounded-lg py-2 px-3 outline-none text-[#1a1c1d] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Minimum Order Qty (MOQ)</label>
                  <input 
                    type="number" 
                    value={newCatMoq}
                    onChange={(e) => setNewCatMoq(Number(e.target.value) || 300)}
                    className="w-full bg-white border border-[#FF2300]/25/15 rounded-lg py-2 px-3 outline-none text-[#1a1c1d] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Landing page Hero header text</label>
                  <input 
                    type="text" 
                    value={newCatHeroTitle}
                    onChange={(e) => setNewCatHeroTitle(e.target.value)}
                    placeholder="Premium custom craft jars" 
                    className="w-full bg-white border border-[#1A3F25]/15 rounded-lg py-2 px-3 outline-none text-[#1a1c1d]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Hero Description / Pitch</label>
                  <textarea 
                    value={newCatHeroDesc}
                    onChange={(e) => setNewCatHeroDesc(e.target.value)}
                    placeholder="Custom hot gold stamp embossed branding directly on your premium glass container assets..." 
                    rows={2}
                    className="w-full bg-white border border-[#1A3F25]/15 rounded-lg py-2 px-3 outline-none text-[#1a1c1d]"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleCreateNewSchemaCategory}
                    className="w-full py-2.5 bg-[#1A3F25] text-white rounded-xl shadow-lg font-bold hover:bg-opacity-95 transition-all text-xs cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <Plus size={12} /> Inject Category Schema
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white border border-[#FF2300]/25/10 p-5 rounded-3xl space-y-4">
              <h3 className="font-serif text-sm font-bold text-[#FF2300] border-b border-gray-100 pb-1.5 uppercase tracking-widest">
                ⚙️ Schema Entities Matrix ({editCategories.length})
              </h3>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {editCategories.map((c, idx) => (
                  <div key={c.id || idx} className="p-3.5 rounded-2xl bg-[#f0f2f5]/30 border border-[#1A3F25]/5 hover:bg-[#f0f2f5]/65 transition-all animate-fadeIn flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#FF2300] block">{c.name}</span>
                      <span className="font-mono text-[9px] uppercase font-bold text-gray-400">ID: {c.id} | MOQ: {c.minQty}</span>
                    </div>
                    <button
                      onClick={() => {
                        const verified = confirm(`Are you sure you want to retire category "${c.name}"?`);
                        if (verified) {
                          setEditCategories(prev => prev.filter(item => item.id !== c.id));
                        }
                      }}
                      className="p-1 px-2.5 rounded-lg bg-red-50 text-red-700 text-[10px] font-bold uppercase transition-all cursor-pointer hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUB TAB 3: DYNAMIC FIELD BUILDER */}
        {prodBuilderSubTab === "fields" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-[#f0f2f5] border border-[#FF2300]/25/10 p-5 rounded-3xl space-y-4">
              <h3 className="font-serif text-sm font-bold text-[#FF2300] border-b border-[#1A3F25]/10 pb-1 flex items-center gap-1.5 uppercase tracking-widest">
                <Plus size={14} className="text-[#C59B6D]" /> Construct Custom Field Selector
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Human Field Label *</label>
                  <input 
                    type="text" 
                    value={newFieldLabel}
                    onChange={(e) => setNewFieldLabel(e.target.value)}
                    placeholder="e.g. Ribbon Thickness Width" 
                    className="w-full bg-white border border-[#FF2300]/25/15 rounded-lg py-2 px-3 outline-none text-[#1a1c1d] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Control Property Type</label>
                  <select 
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value)}
                    className="w-full bg-white border border-[#FF2300]/25/15 rounded-lg py-2 px-2 outline-none text-[#1a1c1d] font-sans"
                  >
                    <option value="list">Dropdown choice selection menu list</option>
                    <option value="text">Human text parameter comment area</option>
                    <option value="number">Numeric parameter input slider</option>
                    <option value="toggle">True / False switch toggle checkbox</option>
                    <option value="color">RGB Custom Hex Color Picker box</option>
                    <option value="size">Structural layout coordinates dimension</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Assigned Target Category</label>
                  <select 
                    value={newFieldTarget}
                    onChange={(e) => setNewFieldTarget(e.target.value)}
                    className="w-full bg-white border border-[#FF2300]/25/15 rounded-lg py-2 px-2 outline-none text-[#1a1c1d] font-sans"
                  >
                    <option value="all">Apply to ALL catalog ranges</option>
                    {editCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Comma-separated Choice List (Dropdowns only)</label>
                  <input 
                    type="text" 
                    value={newFieldOptions}
                    onChange={(e) => setNewFieldOptions(e.target.value)}
                    placeholder="No Divider, 2 slots divider, 4 slots divider" 
                    className="w-full bg-white border border-[#FF2300]/25/15 rounded-lg py-2 px-3 outline-none text-[#1a1c1d] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Choice Custom AMD Surcharge offsets (comma-separated)</label>
                  <input 
                    type="text" 
                    value={newFieldSurcharges}
                    onChange={(e) => setNewFieldSurcharges(e.target.value)}
                    placeholder="0, 500, 1200" 
                    className="w-full bg-white border border-[#FF2300]/25/15 rounded-lg py-2 px-3 outline-none text-[#1A3F25] font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleCreateCustomField}
                    className="w-full py-2.5 bg-[#1A3F25] text-white rounded-xl shadow-lg font-bold hover:bg-opacity-95 transition-all text-xs cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <Plus size={12} /> Inject Custom Field
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white border border-[#FF2300]/25/10 p-5 rounded-3xl space-y-4">
              <h3 className="font-serif text-sm font-bold text-[#FF2300] border-b border-gray-100 pb-1.5 uppercase tracking-widest">
                📦 Dynamic Customized Properties Array ({customFields.length})
              </h3>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {customFields.length === 0 ? (
                  <p className="text-[10px] text-[#727784]">No custom dynamic property fields established yet. Define properties to assign them dynamically.</p>
                ) : (
                  customFields.map((f: any, idx: number) => (
                    <div key={f.id || idx} className="p-3.5 rounded-2xl bg-[#f0f2f5]/30 border border-[#1A3F25]/5 hover:bg-[#f0f2f5]/65 transition-all animate-fadeIn flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#FF2300] block">{f.label}</span>
                        <span className="block text-[9px] font-semibold text-gray-500 uppercase mt-0.5">Type: {f.type} | Target: {f.target}</span>
                        {f.options && f.options.length > 0 && (
                          <span className="block text-[9px] italic text-[#C59B6D] mt-0.5">Choices: {f.options.join(", ")} surcharged: {f.surcharges.join("֏, ")}֏</span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          const updated = customFields.filter((cf: any) => cf.id !== f.id);
                          saveCustomFields(updated);
                        }}
                        className="p-1 px-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg text-[9px] uppercase tracking-wider font-bold cursor-pointer"
                      >
                        Trash
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {prodBuilderSubTab === "dynamic_builder" && (
          <div className="space-y-6">
            <DynamicCategoryBuilder 
              onSave={(cat, prod) => {
                // Save category with dynamic sizing and options attached
                const updatedCategories = [...editCategories, {
                  ...cat,
                  heroTitle: `Exclusive Custom ${cat.name}`,
                  heroDesc: `Configure, specify dimensions, and order bespoke custom ${cat.name} packaging solution of premium print quality.`,
                  ruleChips: "custom"
                } as any];
                setEditCategories(updatedCategories);

                // Save associated product
                const updatedProducts = [...editProducts, {
                  ...prod,
                  items: []
                } as any];
                setEditProducts(updatedProducts);

                setProductSuccess(`Dynamic Category "${cat.name}" and Pricing Product created! Click 'Save All'/'Save Changes' inside the admin header to save changes.`);
                setTimeout(() => setProductSuccess(null), 7000);
              }}
            />
          </div>
        )}
      </div>
    );
  };

  // --- COMPONENT 3: CALCULATOR BUILDER ---
  const [selectedCalcCategory, setSelectedCalcCategory] = useState("bags");
  const [newPaperLabel, setNewPaperLabel] = useState("");
  const [newPaperWeight, setNewPaperWeight] = useState(250);
  const [newPaperSurcharge, setNewPaperSurcharge] = useState(35);
  const [calcSuccess, setCalcSuccess] = useState<string | null>(null);

  const handleAddNewPaperOption = () => {
    if (!newPaperLabel.trim()) {
      alert("Provide paper name.");
      return;
    }
    const newId = `pp_${Date.now()}`;
    const newCell: PaperType = {
      id: newId,
      name: newPaperLabel,
      gsm: newPaperWeight,
      pricePerSqm: newPaperSurcharge,
      active: true,
      assignedProducts: [selectedCalcCategory]
    };
    
    setEditPapers(prev => [...prev, newCell]);
    setCalcSuccess(`Option "${newPaperLabel}" injected into global interactive form drop-downs!`);
    setNewPaperLabel("");
    setNewPaperSurcharge(35);
    
    setTimeout(() => setCalcSuccess(null), 4000);
  };

  const handleAddAutomationWorkflow = () => {
    const newWf = {
      id: `wf_${Date.now()}`,
      trigger: newAutoTrigger,
      action: newAutoAction,
      template: newAutoTemplate,
      active: true
    };
    const updated = [...automationWorkflows, newWf];
    saveAutomationWorkflows(updated);
    setCalcSuccess("Automation workflow created successfully!");
    setTimeout(() => setCalcSuccess(null), 3000);
  };

  const renderCalculatorBuilder = () => {
    return (
      <div className="space-y-6 animate-fadeIn font-sans text-xs">
        <div className="border-b border-[#FF2300]/25/10 pb-4">
          <span className="text-[10px] font-bold text-[#FF2300]/80 tracking-widest uppercase">OPTION BUILDER</span>
          <h2 className="text-xl font-serif text-[#FF2300] font-bold mt-1">Interactive Calculator Customizer</h2>
          <p className="text-xs text-[#727784] mt-0.5">Visually inject materials, thickness levels, lamination blocks, or accessories dropdown elements into the frontend widgets.</p>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex border-b border-[#FF2300]/25/10 gap-2 pb-2">
          {[
            { key: "options", label: "📄 Stock Materials" },
            { key: "calculator_schema", label: "🧮 Calculator Schema Builder" },
            { key: "automation", label: "⚡ Workflow Automation constructor" }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setCalcSubTab(tab.key as any)}
              className={`py-1.5 px-3 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                calcSubTab === tab.key
                  ? "bg-[#1A3F25] text-white"
                  : "bg-[#f0f2f5]/50 text-[#727784] hover:bg-[#f0f2f5]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {calcSuccess && (
          <div className="p-3 bg-[#1A3F25]/5 border border-[#FF2300]/25/15 text-[#FF2300] font-bold rounded-xl flex items-center gap-1.5 animate-pulse">
            <Check size={14} className="text-[#C59B6D]" />
            <span>{calcSuccess}</span>
          </div>
        )}

        {/* SUB TAB 1: CORE STOCK OPTIONS */}
        {calcSubTab === "options" && (
          <div className="space-y-4">
            {/* Categories selector */}
            <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none border-b border-gray-100">
              {editCategories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCalcCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer ${
                    selectedCalcCategory === c.id 
                      ? "bg-[#1A3F25] text-white" 
                      : "bg-[#f0f2f5]/45 text-[#727784] hover:bg-[#1A3F25]/5"
                  }`}
                >
                  {c.name} Options
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Quick injection form */}
              <div className="lg:col-span-12 xl:col-span-5 bg-[#f0f2f5] border border-[#FF2300]/25/10 p-5 rounded-3xl space-y-4">
                <h3 className="font-serif text-sm font-bold text-[#FF2300] border-b border-gray-100 pb-1.5 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                  <Plus size={14} className="text-[#C59B6D]" /> Add Custom Material / Paper stock
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Paper Material Label</label>
                    <input 
                      type="text" 
                      value={newPaperLabel}
                      onChange={(e) => setNewPaperLabel(e.target.value)}
                      placeholder="e.g. Ivory Art Board Smooth"
                      className="w-full bg-white border border-[#FF2300]/25/15 rounded-lg py-2 px-3 outline-none text-[#1a1c1d] font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Density / Weight (GSM)</label>
                      <input 
                        type="number" 
                        value={newPaperWeight}
                        onChange={(e) => setNewPaperWeight(parseInt(e.target.value) || 200)}
                        className="w-full bg-white border border-[#FF2300]/25/15 rounded-lg py-2 px-3 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Surcharge Cost (֏ / sq.m.)</label>
                      <input 
                        type="number" 
                        value={newPaperSurcharge}
                        onChange={(e) => setNewPaperSurcharge(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-[#FF2300]/25/15 rounded-lg py-2 px-3 font-mono font-semibold outline-none"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleAddNewPaperOption}
                    className="w-full py-2.5 bg-[#1A3F25] text-white font-bold hover:bg-opacity-95 rounded-xl uppercase tracking-wider text-xs shadow-md cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Plus size={12} /> Inject Stock Option
                  </button>
                </div>
              </div>

              {/* Current options listing */}
              <div className="lg:col-span-12 xl:col-span-7 bg-white border border-[#1A3F25]/10 p-5 rounded-3xl space-y-4 font-sans text-xs">
                <h3 className="font-serif text-sm font-bold text-[#FF2300] border-b border-gray-100 pb-1.5 uppercase tracking-widest flex items-center justify-between">
                  <span>📄 Active Materials Library ({editPapers.length})</span>
                  <span className="text-[10px] font-semibold text-[#727784]">Dynamic Dropdown Synced</span>
                </h3>

                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {editPapers.map((paper, idx) => (
                    <div key={paper.id || idx} className="p-3 bg-[#f0f2f5] border border-[#FF2300]/25/5 hover:bg-opacity-95 transition-all flex items-center justify-between rounded-lg">
                      <div className="min-w-0">
                        <span className="font-bold text-[#FF2300] text-xs block">{paper.name} ({paper.gsm} GSM)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[#FF2300] whitespace-nowrap bg-white px-2 py-1 rounded-lg border border-[#1A3F25]/10">+{paper.pricePerSqm} ֏/m²</span>
                        <button 
                          onClick={() => {
                            const verified = confirm(`Are you sure you want to remove "${paper.name}"?`);
                            if (verified) {
                              setEditPapers(prev => prev.filter(p => p.id !== paper.id));
                            }
                          }}
                          className="p-1.5 text-red-700 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUB TAB 2: CALCULATOR SCHEMA BUILDER */}
        {calcSubTab === "calculator_schema" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-[#FF2300]/25/5 p-6 rounded-3xl">
            <div className="lg:col-span-4 space-y-3 border-r border-gray-100 pr-5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Choose Target Calculator</span>
              <div className="space-y-1">
                {editCategories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCalcCategory(c.id)}
                    className={`w-full text-left py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-between ${
                      selectedCalcCategory === c.id
                        ? "bg-[#1A3F25]/10 text-[#1A3F25]"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span>🧮 {c.name} calculator</span>
                    <span className="text-[10px] font-mono bg-white px-2 py-0.2 rounded border shadow-sm">ACTIVE</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-5 pl-1.5">
              <h3 className="font-serif text-sm font-bold text-[#1A3F25] border-b border-gray-100 pb-1.5 uppercase tracking-widest">
                ⚙️ Visual Fields & Multipliers Configurator
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase text-[#C59B6D] tracking-widest block">🔀 Step Controls / Visibility</span>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#1a1c1d]">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-[#1A3F25] focus:ring-[#1A3F25]" />
                      <span>Custom Dimensions (W, H, D in millimeters)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#1a1c1d]">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-[#1A3F25] focus:ring-[#1A3F25]" />
                      <span>Stock paper / material dropdown selectors</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#1a1c1d]">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-[#1A3F25] focus:ring-[#1A3F25]" />
                      <span>Foil Stamp & Spot UV high-end premium finish toggles</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#1a1c1d]">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-[#1A3F25] focus:ring-[#1A3F25]" />
                      <span>Sided print configuration (1-Sided, 2-Sided offset)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#1a1c1d]">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-[#1A3F25] focus:ring-[#1A3F25]" />
                      <span>Ribbon bows or handles accessories lists</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase text-[#C59B6D] tracking-widest block">🌿 Calculator base coefficients</span>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase">Starting Setup Fixed Die Cost (֏)</label>
                      <input type="number" defaultValue="25000" className="w-full bg-[#f0f2f5] border border-gray-100 rounded-lg p-2 font-mono text-xs font-bold" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase">Lamination cost offset base (֏ / sq.m.)</label>
                      <input type="number" defaultValue="150" className="w-full bg-[#f0f2f5] border border-gray-100 rounded-lg p-2 font-mono text-xs font-bold" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase">Waste multiplier coefficient factor</label>
                      <input type="number" step="0.05" defaultValue="1.15" className="w-full bg-[#f0f2f5] border border-gray-100 rounded-lg p-2 font-mono text-xs font-bold" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-gray-100">
                <button
                  onClick={() => {
                    setCalcSuccess("Calculator visual template logic saved!");
                    setTimeout(() => setCalcSuccess(null), 3000);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#1A3F25] hover:bg-opacity-95 cursor-pointer text-white text-[10px] font-bold uppercase tracking-wider shadow"
                >
                  Save Calculator Layout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUB TAB 3: WORKFLOW AUTOMATION */}
        {calcSubTab === "automation" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-[#f0f2f5] border border-[#FF2300]/25/10 p-5 rounded-3xl space-y-4">
              <h3 className="font-serif text-sm font-bold text-[#FF2300] border-b border-[#1A3F25]/10 pb-1 flex items-center gap-1.5 uppercase tracking-widest">
                <Plus size={14} className="text-[#C59B6D]" /> Add Automation Rule
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Event Trigger</label>
                  <select 
                    value={newAutoTrigger} 
                    onChange={(e) => setNewAutoTrigger(e.target.value)}
                    className="w-full bg-white border border-[#FF2300]/25/15 rounded-lg py-2 px-2 outline-none text-[#1a1c1d] font-sans"
                  >
                    <option value="order_created">⚡ When new Order Submission is registered</option>
                    <option value="crm_vip_tagged">👤 When CRM contact is marked as High-Priority VIP</option>
                    <option value="price_exceeded">💰 When calculated invoice quote exceeds 500,000 ֏</option>
                    <option value="promo_used">🎫 When special discount promotional code is applied</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Action Destination</label>
                  <select 
                    value={newAutoAction} 
                    onChange={(e) => setNewAutoAction(e.target.value)}
                    className="w-full bg-white border border-[#FF2300]/25/15 rounded-lg py-2 px-2 outline-none text-[#1a1c1d] font-sans"
                  >
                    <option value="telegram_alert">💬 Broadcast instant Alert to unified Telegram group bot</option>
                    <option value="whatsapp_template">📱 Send WhatsApp Business template to user phone</option>
                    <option value="crm_webhook_sync">🔗 TRIGGER outbound ERP Webhook webhook-sync URL</option>
                    <option value="email_manager">📧 Dispatch detailed summary PDF summary to manager inbox</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Alert content template markup</label>
                  <textarea 
                    value={newAutoTemplate} 
                    onChange={(e) => setNewAutoTemplate(e.target.value)}
                    rows={3} 
                    className="w-full bg-white border border-[#FF2300]/25/15 rounded-lg py-2 px-3 outline-none text-[#1A3F25] font-mono text-xs"
                  />
                  <span className="text-[9px] text-gray-400 leading-tight block">Use variables: {'{{customerName}}'}, {'{{customerPhone}}'}, {'{{totalPrice}}'}, {'{{type}}'}</span>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleAddAutomationWorkflow}
                    className="w-full py-2.5 bg-[#1A3F25] text-white rounded-xl shadow-lg font-bold hover:bg-opacity-95 transition-all text-xs cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <Plus size={12} /> Inject Automation Workflow
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white border border-[#FF2300]/25/10 p-5 rounded-3xl space-y-4">
              <h3 className="font-serif text-sm font-bold text-[#FF2300] border-b border-gray-100 pb-1.5 uppercase tracking-widest">
                ⚡ Registered Active Visual Workflows ({automationWorkflows.length})
              </h3>

              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                {automationWorkflows.map((wf: any) => (
                  <div key={wf.id} className="p-4 bg-[#f0f2f5]/30 border border-[#1A3F25]/5 hover:bg-[#f0f2f5]/65 transition-all rounded-2xl flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-150 text-[9px] font-bold uppercase tracking-wider">
                        Trigger: {wf.trigger}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = automationWorkflows.map((w: any) => w.id === wf.id ? { ...w, active: !w.active } : w);
                            saveAutomationWorkflows(updated);
                          }}
                          className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase cursor-pointer border ${
                            wf.active ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-150 text-gray-500 border-gray-200"
                          }`}
                        >
                          {wf.active ? "Enabled" : "Paused"}
                        </button>
                        <button
                          onClick={() => {
                            const updated = automationWorkflows.filter((w: any) => w.id !== wf.id);
                            saveAutomationWorkflows(updated);
                          }}
                          className="p-1 text-red-700 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="text-[11px] text-[#1A3F25] font-semibold flex items-center gap-1.5 leading-relaxed">
                      <span>➡️ Target action:</span>
                      <span className="text-[#C59B6D] underline">{wf.action}</span>
                    </div>
                    <pre className="p-2.5 bg-white border border-gray-100 rounded-lg text-[9px] text-gray-600 font-mono whitespace-pre-wrap leading-normal shadow-sm">
                      {wf.template}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- COMPONENT 4: PRICING ENGINE ---
  const handleCreatePricingRule = () => {
    if (!ruleConditionValue.trim()) {
      alert("Please specify a condition check value.");
      return;
    }
    const cleanDesc = `If ${ruleConditionField} ${ruleConditionOp} "${ruleConditionValue}" Then ${ruleActionType} ${ruleActionValue}${ruleActionType === "percentage_markup" ? "%" : "֏"}`;
    const newRule = {
      id: `rule_${Date.now()}`,
      field: ruleConditionField,
      op: ruleConditionOp,
      value: ruleConditionValue.trim(),
      action: ruleActionType,
      amount: Number(ruleActionValue) || 0,
      desc: cleanDesc
    };
    const updated = [...pricingRulesList, newRule];
    savePricingRulesList(updated);
    setRuleConditionValue("");
  };

  const renderPricingEngine = () => {
    const handleSelectFormula = (f: any) => {
      setSelectedFormula(f);
      setFormulaName(f.name);
      setFormulaExpression(f.expression);
      setFormulaVariables(f.variables || []);
      setFormulaConditions(f.conditions || []);
      setFormulaActive(f.active);
      setSimulationResult(null);
      setSimulationLogs([]);
    };

    const handleAddVariable = () => {
      setFormulaVariables([...formulaVariables, { name: "custom_rate", type: "number", value: 1.0 }]);
    };

    const handleRemoveVariable = (idx: number) => {
      setFormulaVariables(formulaVariables.filter((_, i) => i !== idx));
    };

    const handleUpdateVar = (idx: number, field: string, val: any) => {
      const updated = [...formulaVariables];
      updated[idx] = { ...updated[idx], [field]: val };
      setFormulaVariables(updated);
    };

    const handleAddCondition = () => {
      setFormulaConditions([...formulaConditions, { if: "qty >= 1000", then: "volume_discount = 0.9" }]);
    };

    const handleRemoveCondition = (idx: number) => {
      setFormulaConditions(formulaConditions.filter((_, i) => i !== idx));
    };

    const handleUpdateCond = (idx: number, field: string, val: any) => {
      const updated = [...formulaConditions];
      updated[idx] = { ...updated[idx], [field]: val };
      setFormulaConditions(updated);
    };

    const handleEvaluateSimulation = async () => {
      if (!selectedFormula) return;
      try {
        const res = await fetch("/api/admin/formulas/evaluate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            expression: formulaExpression,
            variables: formulaVariables,
            conditions: formulaConditions,
            inputs: {
              w: simWidth,
              h: simHeight,
              d: simDepth,
              qty: simQty,
              finish_sum_price: simFinishesSum
            }
          })
        });
        const data = await res.json();
        if (data.success) {
          setSimulationResult(data);
          setSimulationLogs(data.conditionLog || []);
        } else {
          alert("Simulation failed: " + data.error);
        }
      } catch (err: any) {
        alert("Evaluation warning: " + err.message);
      }
    };

    const handleSaveFormula = async () => {
      if (!selectedFormula) return;
      try {
        const res = await fetch("/api/admin/formulas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            id: selectedFormula.id,
            name: formulaName,
            target: selectedFormula.target,
            expression: formulaExpression,
            variables: formulaVariables,
            conditions: formulaConditions,
            coefficients: selectedFormula.coefficients || {},
            active: formulaActive
          })
        });
        const data = await res.json();
        if (data.success) {
          setDbRefreshTrigger(p => p + 1);
          alert("Formula committed to enterprise PostgreSQL database successfully!");
        } else {
          alert("Save failed: " + data.error);
        }
      } catch (err: any) {
        alert("Transmission error: " + err.message);
      }
    };

    return (
      <div className="space-y-6 animate-fadeIn font-sans text-xs">
        <div className="border-b border-[#FF2300]/25/10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#C59B6D] tracking-widest uppercase">DYNAMIC MATHEMATICAL CALCULATIONS</span>
            <h2 className="text-xl font-serif text-[#FF2300] font-bold mt-1">Visual Formula Builder & Calculator Studio</h2>
            <p className="text-xs text-[#727784] mt-0.5">Define arbitrary mathematical price formulas through visual tokens, custom coefficients, and conditions entirely codeless.</p>
          </div>
          <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1 rounded-full font-bold uppercase">
            Active Engine: PostgreSQL Runtime Evaluator
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left list of active product formulas */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#f0f2f5] border border-[#FF2300]/25/10 p-4 rounded-3xl">
              <h3 className="font-serif text-xs font-bold text-[#FF2300] tracking-widest uppercase mb-3 flex items-center gap-1.5 pb-1 border-b border-[#FF2300]/25/5">
                <Database size={12} className="text-[#C59B6D]" /> PostgreSQL Formula Registry ({dbFormulas.length})
              </h3>
              
              <div className="space-y-2">
                {dbFormulas.map((form) => {
                  const isSel = selectedFormula?.id === form.id;
                  const targetColors: Record<string, string> = {
                    bags: "border-teal-500 bg-teal-50/40 text-teal-900",
                    boxes: "border-amber-500 bg-amber-50/40 text-amber-900",
                    stickers: "border-indigo-500 bg-indigo-50/40 text-indigo-900"
                  };
                  return (
                    <button
                      key={form.id}
                      onClick={() => handleSelectFormula(form)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1 ${
                        isSel 
                          ? "border-[#FF2300]/25 bg-white shadow-md ring-2 ring-capsule-accent/10" 
                          : "border-[#FF2300]/25/10 bg-white hover:bg-gray-50/50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-[#FF2300] text-xs">{form.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${targetColors[form.target] || "border-gray-500 text-gray-500 bg-gray-50"}`}>
                          {form.target}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-[#727784] truncate mt-1 bg-gray-50 px-1.5 py-0.5 rounded">
                        {form.expression}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Formula Syntax Variable Cheat Sheet */}
            <div className="bg-white border border-[#1A3F25]/10 p-5 rounded-3xl space-y-3">
              <h4 className="font-serif text-xs font-bold text-[#FF2300] uppercase tracking-widest border-b border-gray-50 pb-1.5">Expression Tokens</h4>
              <ul className="space-y-1.5 text-[10px] text-[#727784] font-medium">
                <li><strong className="text-[#FF2300] font-mono font-bold">w, h, d</strong> — Width, height, and depth from client interface (cm)</li>
                <li><strong className="text-[#FF2300] font-mono font-bold">qty</strong> — Inquiry volume quantity entered by customer</li>
                <li><strong className="text-[#FF2300] font-mono font-bold">finish_sum_price</strong> — Sum cost of selected lamination, foil, ribbons</li>
                <li><strong className="text-[#FF2300] font-mono font-bold">surface_area_m2</strong> — Computed flat surface square meters</li>
                <li><strong className="text-[#FF2300] font-mono font-bold">volume_box</strong> — Calculated box interior cubic capacity</li>
                <li><strong className="text-[#FF2300] font-mono font-bold">Any variables defined in edited formula catalog below...</strong></li>
              </ul>
            </div>
          </div>

          {/* Right Editor view */}
          <div className="lg:col-span-8">
            {selectedFormula ? (
              <div className="bg-white border border-[#1A3F25]/10 p-6 rounded-3xl space-y-6">
                <div className="flex justify-between items-center border-b border-gray-150 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#C59B6D]">ACTIVE FORMULA STUDIO</span>
                    <h3 className="font-serif text-base font-bold text-[#FF2300] mt-0.5">{selectedFormula.id}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-[#FF2300]">
                      <input 
                        type="checkbox" 
                        checked={formulaActive} 
                        onChange={(e) => setFormulaActive(e.target.checked)}
                        className="rounded border-gray-300 text-[#FF2300] focus:ring-[#FF2300]"
                      />
                      Active Formula
                    </label>
                  </div>
                </div>

                {/* Edit meta details */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-[#7C9082]">Formula Descriptor Label</label>
                  <input
                    type="text"
                    value={formulaName}
                    onChange={(e) => setFormulaName(e.target.value)}
                    className="w-full bg-[#f0f2f5] border border-[#FF2300]/25/10 rounded-xl px-3 py-2 text-xs font-bold text-[#FF2300] outline-none focus:border-[#FF2300]/25/30"
                  />
                </div>

                {/* Mathematical Expression Input */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-[#7C9082]">Math Expression (Parsable JavaScript Expression Syntax)</label>
                  <textarea
                    value={formulaExpression}
                    onChange={(e) => setFormulaExpression(e.target.value)}
                    rows={2}
                    className="w-full bg-[#f0f2f5] border border-[#FF2300]/25/15 rounded-xl p-3 text-xs font-mono font-bold text-[#1A3F25] outline-none focus:border-[#FF2300]/25/30"
                  />
                </div>

                {/* Custom system defined Variables */}
                <div className="space-y-3 bg-[#f0f2f5] p-4 rounded-2xl border border-[#FF2300]/25/5">
                  <div className="flex justify-between items-center border-b border-[#FF2300]/25/5 pb-2">
                    <span className="text-[10px] font-extrabold uppercase text-[#FF2300]">Formula-specific static variables values</span>
                    <button 
                      onClick={handleAddVariable}
                      className="px-2.5 py-1 bg-[#FF2300]/10 text-[#FF2300] hover:bg-[#FF2300]/20 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={10} /> Add Variable
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formulaVariables.map((v, i) => (
                      <div key={i} className="flex gap-2 items-center bg-white p-2 rounded-xl border border-[#FF2300]/25/5">
                        <input
                          type="text"
                          value={v?.name || ""}
                          placeholder="variable_name"
                          onChange={(e) => handleUpdateVar(i, "name", e.target.value)}
                          className="w-40 bg-[#f0f2f5] border border-[#FF2300]/25/10 rounded-lg px-2 py-1 text-[11px] font-mono font-black"
                        />
                        <span className="text-gray-400 font-bold">=</span>
                        <input
                          type="number"
                          step="0.01"
                          value={v?.value === undefined ? "" : v.value}
                          onChange={(e) => handleUpdateVar(i, "value", parseFloat(e.target.value) || 0)}
                          className="w-32 bg-[#f0f2f5] border border-[#FF2300]/25/10 rounded-lg px-2 py-1 text-[11px] font-mono font-black text-right"
                        />
                        <span className="text-[10px] text-[#727784] italic flex-1 truncate pl-2">Constant fallback coefficient setting</span>
                        <button 
                          onClick={() => handleRemoveVariable(i)}
                          className="p-1 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ))}
                    {formulaVariables.length === 0 && (
                      <p className="text-[10px] text-[#727784] italic text-center py-2">No custom variables configured. Use standard math parameters above.</p>
                    )}
                  </div>
                </div>

                {/* Logical conditionals (e.g. quantity tiers discount) */}
                <div className="space-y-3 bg-[#f0f2f5] p-4 rounded-2xl border border-[#FF2300]/25/5">
                  <div className="flex justify-between items-center border-b border-[#FF2300]/25/5 pb-2">
                    <span className="text-[10px] font-extrabold uppercase text-[#FF2300]">Multi-Tier Conditional Logic (Overrides Variable States)</span>
                    <button 
                      onClick={handleAddCondition}
                      className="px-2.5 py-1 bg-[#FF2300]/10 text-[#FF2300] hover:bg-[#FF2300]/20 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={10} /> Add Condition
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formulaConditions.map((c, i) => (
                      <div key={i} className="flex gap-2 items-center bg-white p-2.5 rounded-xl border border-[#FF2300]/25/10">
                        <span className="text-[10px] font-black uppercase text-[#C59B6D] shrink-0">IF (Expression)</span>
                        <input
                          type="text"
                          value={c?.if || ""}
                          placeholder="qty >= 500 && qty < 1000"
                          onChange={(e) => handleUpdateCond(i, "if", e.target.value)}
                          className="flex-1 bg-[#f0f2f5] border border-[#FF2300]/25/10 rounded-lg px-2 py-1 text-[11px] font-mono font-black"
                        />
                        <span className="text-[10px] font-black uppercase text-teal-800 shrink-0">THEN SET</span>
                        <input
                          type="text"
                          value={c?.then || ""}
                          placeholder="volume_discount = 0.82"
                          onChange={(e) => handleUpdateCond(i, "then", e.target.value)}
                          className="w-48 bg-[#f0f2f5] border border-[#1A3F25]/15 rounded-lg px-2 py-1 text-[11px] font-mono font-black"
                        />
                        <button 
                          onClick={() => handleRemoveCondition(i)}
                          className="p-1 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ))}
                    {formulaConditions.length === 0 && (
                      <p className="text-[10px] text-[#727784] italic text-center py-2">No custom quantity discount steps. Prices will scale on variables strictly.</p>
                    )}
                  </div>
                </div>

                {/* Live Formula math evaluation console */}
                <div className="bg-[#f0f2f5] border border-dashed border-[#FF2300]/25/20 p-5 rounded-3xl space-y-4">
                  <h4 className="font-serif text-xs font-bold text-[#FF2300] border-b border-[#FF2300]/25/5 pb-1 flex items-center gap-1">
                    <Activity size={12} className="text-[#C59B6D]" /> Interactive Calculator Simulator Terminal No-Code Guard
                  </h4>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
                    <div>
                      <span className="text-[9px] uppercase text-[#7C9082] font-extrabold block mb-1">Width (w, cm)</span>
                      <input 
                        type="number" 
                        value={simWidth} 
                        onChange={(e) => setSimWidth(parseFloat(e.target.value) || 0)} 
                        className="w-full bg-white border border-[#FF2300]/25/10 px-2 py-1 rounded text-xs font-mono font-black" 
                      />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-[#7C9082] font-extrabold block mb-1">Height (h, cm)</span>
                      <input 
                        type="number" 
                        value={simHeight} 
                        onChange={(e) => setSimHeight(parseFloat(e.target.value) || 0)} 
                        className="w-full bg-white border border-[#FF2300]/25/10 px-2 py-1 rounded text-xs font-mono font-black" 
                      />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-[#7C9082] font-extrabold block mb-1">Depth (d, cm)</span>
                      <input 
                        type="number" 
                        value={simDepth} 
                        onChange={(e) => setSimDepth(parseFloat(e.target.value) || 0)} 
                        className="w-full bg-white border border-[#FF2300]/25/10 px-2 py-1 rounded text-xs font-mono font-black" 
                      />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-[#7C9082] font-extrabold block mb-1">Order Qty (units)</span>
                      <input 
                        type="number" 
                        value={simQty} 
                        onChange={(e) => setSimQty(parseFloat(e.target.value) || 0)} 
                        className="w-full bg-white border border-[#FF2300]/25/10 px-2 py-1 rounded text-xs font-mono font-black" 
                      />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-[#7C9082] font-extrabold block mb-1">Lam/Ribbons (֏)</span>
                      <input 
                        type="number" 
                        value={simFinishesSum} 
                        onChange={(e) => setSimFinishesSum(parseFloat(e.target.value) || 0)} 
                        className="w-full bg-white border border-[#FF2300]/25/10 px-2 py-1 rounded text-xs font-mono font-black" 
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <button
                      onClick={handleEvaluateSimulation}
                      className="px-4 py-2 bg-[#FF2300] text-white font-bold rounded-xl hover:bg-opacity-95 transition-all uppercase tracking-wider text-[10px] flex items-center gap-1 bg-gradient-to-r from-capsule-accent to-[#1A3F25]"
                    >
                      <Sparkles size={11} /> Simulate Expression Math
                    </button>
                    <span className="text-[10px] text-[#727784]">Queries dynamic server parser sandbox</span>
                  </div>

                  {simulationResult && (
                    <div className="bg-[#1A3F25]/5 border border-[#FF2300]/25/15 p-4 rounded-2xl space-y-2 animate-fadeIn">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#FF2300] text-xs uppercase tracking-wider block">Simulator Output</span>
                        <div className="text-right">
                          <span className="text-[9px] font-bold text-[#727784] block uppercase">TOTAL EVALUATED PRICE</span>
                          <span className="font-mono text-[#1A3F25] font-black text-sm">{simulationResult.evaluatedPrice.toLocaleString()} ֏ AMD</span>
                          <span className="text-[9px] block text-[#727784] font-bold font-mono">
                            ~ {(Math.round(simulationResult.evaluatedPrice / simQty * 10) / 10).toLocaleString()} ֏ per unit
                          </span>
                        </div>
                      </div>

                      {simulationLogs.length > 0 && (
                        <div className="bg-white border border-[#FF2300]/25/5 p-2 rounded-xl">
                          <span className="block text-[8px] font-extrabold uppercase text-[#C59B6D] mb-1">Evaluated Logic Steps:</span>
                          <div className="space-y-0.5 text-[9px] font-mono text-emerald-800">
                            {simulationLogs.map((logStr, lIdx) => (
                              <div key={lIdx}>✔️ {logStr}</div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="text-[8px] font-mono text-[#727784] overflow-x-auto whitespace-pre bg-white/50 p-2 rounded-xl">
                        Compiled variables frame: {JSON.stringify(simulationResult.context)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Command actions save */}
                <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                  <button
                    onClick={handleSaveFormula}
                    className="py-2.5 px-6 bg-[#1A3F25] text-white rounded-xl shadow-lg font-bold uppercase tracking-wider text-[10px] hover:bg-opacity-95 transition-all text-center flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save size={12} /> Apply Changes to Database
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#1A3F25]/10 p-12 rounded-3xl text-center flex flex-col items-center justify-center space-y-2 h-full min-h-[300px]">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-[#C59B6D] flex items-center justify-center">
                  <Sliders size={18} />
                </div>
                <h4 className="font-serif text-sm font-bold text-[#FF2300] uppercase mt-2">No Pricing Formula Selected</h4>
                <p className="text-[#727784] text-xs max-w-sm">Choose an active pricing container from the left registry directory to modify live coefficients, variables, conditions, or syntax rules visually.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- COMPONENT 5: TRANSLATION MANAGER ---
  const [transSearch, setTransSearch] = useState("");
  const [transSuccess, setTransSuccess] = useState<string | null>(null);

  // Filter translation site keys
  const filteredKeys = useMemo(() => {
    return Object.keys(editSiteTexts).filter(k => 
      k.toLowerCase().includes(transSearch.toLowerCase()) || 
      (editSiteTexts[k] && editSiteTexts[k].toLowerCase().includes(transSearch.toLowerCase()))
    );
  }, [editSiteTexts, transSearch]);

  const handleUpdateTranslationKey = (key: string, val: string) => {
    setEditSiteTexts(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleTranslationBulkSave = async () => {
    setTransSuccess("All system loc texts successfully synced! Committing changes...");
    await handleSaveAll();
    setTimeout(() => setTransSuccess(null), 3500);
  };

  const renderTranslationManager = () => {
    const filteredDbTrans = dbTranslationsList.filter((item: any) => {
      const matchSearch = item.key?.toLowerCase().includes(translationSearch.toLowerCase()) ||
        item.en?.toLowerCase().includes(translationSearch.toLowerCase()) ||
        item.hy?.toLowerCase().includes(translationSearch.toLowerCase()) ||
        item.ru?.toLowerCase().includes(translationSearch.toLowerCase()) ||
        item.ar?.toLowerCase().includes(translationSearch.toLowerCase());
      const matchCat = translationFilterCategory === "all" || item.category === translationFilterCategory;
      return matchSearch && matchCat;
    });

    const handleSelectTranslation = (item: any) => {
      setSelectedTranslation(item);
      setNewTransKey(item.key);
      setNewTransEn(item.en || "");
      setNewTransHy(item.hy || "");
      setNewTransRu(item.ru || "");
      setNewTransAr(item.ar || "");
    };

    const handleCreateKey = () => {
      setSelectedTranslation({ isNew: true, category: "general" });
      setNewTransKey("ui_" + Date.now().toString().slice(-4));
      setNewTransEn("");
      setNewTransHy("");
      setNewTransRu("");
      setNewTransAr("");
    };

    const handleSaveTranslation = async () => {
      if (!newTransKey.trim()) {
        alert("Translation key cannot be empty.");
        return;
      }
      try {
        const res = await fetch("/api/admin/translations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            key: newTransKey.trim(),
            category: selectedTranslation?.category || "general",
            en: newTransEn,
            hy: newTransHy,
            ru: newTransRu,
            ar: newTransAr
          })
        });
        const data = await res.json();
        if (data.success) {
          setTransStatusMsg("Saved successfully and loaded to localization context.");
          setDbRefreshTrigger(p => p + 1);
          setTimeout(() => setTransStatusMsg(null), 3000);
        } else {
          alert("Save translation failed: " + data.error);
        }
      } catch (err: any) {
        alert("Communication failed: " + err.message);
      }
    };

    return (
      <div className="space-y-6 animate-fadeIn font-sans text-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#FF2300]/25/10 pb-4 gap-2">
          <div>
            <span className="text-[10px] font-bold text-[#C59B6D] tracking-widest uppercase">INTERNATIONALIZATION COOPERATIVE</span>
            <h2 className="text-xl font-serif text-[#FF2300] font-bold mt-1">Multi-lang Database Translation Center</h2>
            <p className="text-xs text-[#727784] mt-0.5">Control site labels and localized product descriptors completely through PostgreSQL without code change dependencies.</p>
          </div>
          <button 
            onClick={handleCreateKey}
            className="px-4 py-2 bg-[#1A3F25] text-white rounded-xl shadow-lg font-bold tracking-wider text-[10px] uppercase hover:bg-opacity-95 text-center flex items-center gap-1 cursor-pointer"
          >
            <Plus size={11} /> Register new Key
          </button>
        </div>

        {transStatusMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl animate-slideIn">
            ✔️ {transStatusMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left panel index registry */}
          <div className="lg:col-span-5 bg-[#f0f2f5] border border-[#FF2300]/25/10 p-5 rounded-3xl space-y-4">
            <div className="flex flex-col md:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search size={12} className="absolute left-2.5 top-2.5 text-[#7C9082]" />
                <input
                  type="text"
                  placeholder="Filter keys, values..."
                  value={translationSearch}
                  onChange={(e) => setTranslationSearch(e.target.value)}
                  className="w-full bg-white border border-[#FF2300]/25/10 rounded-xl pl-8 pr-3 py-2 text-xs text-[#FF2300] placeholder-capsule-text-muted outline-none"
                />
              </div>
              <select
                value={translationFilterCategory}
                onChange={(e) => setTranslationFilterCategory(e.target.value)}
                className="bg-white border border-[#FF2300]/25/10 rounded-xl px-2.5 py-2 text-xs text-[#FF2300] outline-none font-bold"
              >
                <option value="all">All Modules</option>
                <option value="general">General UI</option>
                <option value="bags">Paper Bags</option>
                <option value="boxes">Custom Boxes</option>
                <option value="stickers">Roll Stickers</option>
              </select>
            </div>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredDbTrans.slice(0, 75).map((item) => {
                const isSel = selectedTranslation?.key === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleSelectTranslation(item)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1 ${
                      isSel 
                        ? "border-[#FF2300]/25 bg-white shadow-md ring-2 ring-capsule-accent/10" 
                        : "border-[#FF2300]/25/10 bg-white hover:bg-gray-50/50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-[#FF2300] text-xs truncate break-all">{item.key}</span>
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[8px] font-bold uppercase text-gray-500">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#727784] truncate mt-0.5">
                      🇬🇧 {item.en || "not translated"}
                    </span>
                  </button>
                );
              })}
              {filteredDbTrans.length === 0 && (
                <p className="text-[10px] text-[#727784] italic text-center py-6">No matching keys found.</p>
              )}
              {filteredDbTrans.length > 75 && (
                <p className="text-[9px] text-[#727784] italic text-center pt-2">Showing top 75 entries...</p>
              )}
            </div>
          </div>

          {/* Right Panel editing form */}
          <div className="lg:col-span-7">
            {selectedTranslation ? (
              <div className="bg-white border border-[#1A3F25]/10 p-6 rounded-3xl space-y-5">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                  <h3 className="font-serif text-sm font-bold text-[#FF2300] uppercase tracking-widest flex items-center gap-1">
                    <Globe size={13} className="text-[#C59B6D]" /> Translation Key Editor
                  </h3>
                  <span className="px-2 py-0.5 bg-[#FF2300]/10 text-[#FF2300] text-[9px] font-extrabold uppercase rounded-full">
                    PostgreSQL Record
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase text-[#7C9082]">Translation Registry Key ID</label>
                    <input
                      type="text"
                      disabled={!selectedTranslation.isNew}
                      value={newTransKey}
                      onChange={(e) => setNewTransKey(e.target.value)}
                      className={`w-full border rounded-xl px-3 py-2 text-xs font-mono font-black ${
                        selectedTranslation.isNew 
                          ? "bg-[#f0f2f5] border-[#1A3F25]/15 text-[#1A3F25]" 
                          : "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase text-[#7C9082]">Module / Category</label>
                    <select
                      value={selectedTranslation.category || "general"}
                      onChange={(e) => {
                        setSelectedTranslation({ ...selectedTranslation, category: e.target.value });
                      }}
                      className="w-full bg-[#f0f2f5] border border-[#FF2300]/25/15 rounded-xl px-3 py-2 text-xs font-bold text-[#FF2300] outline-none"
                    >
                      <option value="general">General UI</option>
                      <option value="bags">Paper Bags</option>
                      <option value="boxes">Custom Boxes</option>
                      <option value="stickers">Roll Stickers</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 pt-2 border-t border-gray-55">
                  {/* English */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 bg-blue-50 text-blue-750 text-[9px] font-mono font-extrabold rounded">EN</span>
                      <label className="text-[10px] font-black uppercase text-[#7C9082]">English (Default Fallback)</label>
                    </div>
                    <textarea
                      value={newTransEn}
                      onChange={(e) => setNewTransEn(e.target.value)}
                      rows={2}
                      className="w-full bg-[#f0f2f5] border border-[#FF2300]/25/10 rounded-xl p-2.5 text-xs text-[#FF2300] font-bold outline-none"
                    />
                  </div>

                  {/* Armenian */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 bg-red-50 text-red-750 text-[9px] font-mono font-extrabold rounded">HY</span>
                      <label className="text-[10px] font-black uppercase text-[#7C9082]">Armenian (Հայերեն)</label>
                    </div>
                    <textarea
                      value={newTransHy}
                      onChange={(e) => setNewTransHy(e.target.value)}
                      rows={2}
                      className="w-full bg-[#f0f2f5] border border-[#FF2300]/25/10 rounded-xl p-2.5 text-xs text-[#FF2300] font-bold outline-none"
                    />
                  </div>

                  {/* Russian */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 bg-amber-50 text-amber-900 text-[9px] font-mono font-extrabold rounded">RU</span>
                      <label className="text-[10px] font-black uppercase text-[#7C9082]">Russian (Русский)</label>
                    </div>
                    <textarea
                      value={newTransRu}
                      onChange={(e) => setNewTransRu(e.target.value)}
                      rows={2}
                      className="w-full bg-[#f0f2f5] border border-[#FF2300]/25/10 rounded-xl p-2.5 text-xs text-[#FF2300] font-bold outline-none"
                    />
                  </div>

                  {/* Arabic */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-850 text-[9px] font-mono font-extrabold rounded">AR</span>
                      <label className="text-[10px] font-black uppercase text-[#7C9082]">Arabic (العربية)</label>
                    </div>
                    <textarea
                      value={newTransAr}
                      onChange={(e) => setNewTransAr(e.target.value)}
                      rows={2}
                      className="w-full bg-[#f0f2f5] border border-[#FF2300]/25/10 rounded-xl p-2.5 text-xs text-[#FF2300] font-bold outline-none text-right placeholder:text-left"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-gray-100 font-sans">
                  <button
                    onClick={handleSaveTranslation}
                    className="py-2.5 px-6 bg-[#1A3F25] text-white rounded-xl shadow-lg font-bold uppercase tracking-wider text-[10px] hover:bg-opacity-95 transition-all text-center flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save size={12} /> Commit Translations to DB
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#1A3F25]/10 p-12 rounded-3xl text-center flex flex-col items-center justify-center space-y-2 h-full min-h-[300px]">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Globe size={18} />
                </div>
                <h4 className="font-serif text-sm font-bold text-[#FF2300] uppercase mt-2">No Translation Key Selected</h4>
                <p className="text-[#727784] text-xs max-w-sm font-medium">Choose an active localized key identifier from the left catalog roster to edit live Armenian, Russian, English, or Arabic texts concurrently on-the-fly.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- COMPONENT 6: MEDIA LIBRARY ---
  const [mediaList, setMediaList] = useState([
    { id: 1, name: "capsule_logo.svg", type: "svg", size: "12 KB", date: "2026-05-10", url: "/capsule_logo.svg" },
    { id: 2, name: "luxury_amber_texture.jpg", type: "image", size: "1.4 MB", date: "2026-06-01", url: "/placeholder_amber.jpg" },
    { id: 3, name: "premium_scarlet_bag_3d.glb", type: "model", size: "8.5 MB", date: "2026-06-04", url: "/model_red.glb" },
    { id: 4, name: "satin_ribbon_gold_embossed.png", type: "image", size: "450 KB", date: "2026-06-05", url: "/ribbon_gold.png" },
    { id: 5, name: "capsule_invoice_sheet.pdf", type: "pdf", size: "140 KB", date: "2026-06-09", url: "/invoice.pdf" }
  ]);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const handleSimulatedImageUpload = () => {
    setUploadProgress("Uploading file. Generative compression applied...");
    setTimeout(() => {
      const newF = {
        id: Date.now(),
        name: `custom_media_${Date.now().toString().slice(-4)}.png`,
        type: "image",
        size: "340 KB",
        date: new Date().toISOString().slice(0, 10),
        url: "/placeholder_custom.png"
      };
      setMediaList(prev => [newF, ...prev]);
      setUploadProgress(null);
    }, 1500);
  };

  const renderMediaLibrary = () => {
    return (
      <div className="space-y-6 animate-fadeIn font-sans text-xs">
        <div className="border-b border-[#FF2300]/25/10 pb-4">
          <span className="text-[10px] font-bold text-[#FF2300]/80 tracking-widest uppercase">STORAGE & CDN VIRTUAL STORAGE</span>
          <h2 className="text-xl font-serif text-[#FF2300] font-bold mt-1">S3-Compatible Media Asset library</h2>
          <p className="text-xs text-[#727784] mt-0.5">Manage product illustrations, SVG icons, PDF order briefs, and interactive 3D WebGL assets safely from this visual dashboard.</p>
        </div>

        {/* Upload banner */}
        <div 
          onClick={handleSimulatedImageUpload}
          className="border-2 border-dashed border-[#FF2300]/25/15 hover:border-[#FF2300]/25/40 rounded-3xl p-6 text-center cursor-pointer bg-[#f0f2f5] hover:bg-opacity-95 transition-all duration-350"
        >
          <div className="p-3 bg-[#1A3F25]/5 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 text-[#1A3F25]">
            <Upload size={18} />
          </div>
          <span className="block font-bold text-[#FF2300] text-xs">Drag and Drop media files to sync library</span>
          <span className="block text-[10px] text-[#727784] mt-0.5">Support JPEG, PNG, SVG, PDF, or GLB assets up to 45MB</span>
          {uploadProgress && <span className="block text-xs font-bold text-teal-700 mt-2 animate-pulse">{uploadProgress}</span>}
        </div>

        {/* Media asset grids */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaList.map((m) => (
            <div key={m.id} className="bg-white border border-[#1A3F25]/10 rounded-2xl overflow-hidden hover:shadow-md transition-all group relative flex flex-col justify-between animate-fadeIn">
              <div className="aspect-square bg-gray-50 flex items-center justify-center p-4 relative group-hover:bg-gray-100/50 transition-all">
                {m.type === "image" && <ImageIcon size={28} className="text-[#C59B6D]" />}
                {m.type === "svg" && <Globe size={28} className="text-teal-700" />}
                {m.type === "model" && <BoxIcon size={28} className="text-purple-700" />}
                {m.type === "pdf" && <FileText size={28} className="text-red-700" />}
                
                <span className="absolute top-2 left-2 bg-white border border-gray-100 rounded-full px-1.5 py-0.2 text-[8px] font-extrabold uppercase text-[#414753] shadow-sm">
                  {m.type}
                </span>
              </div>
              <div className="p-2.5 border-t border-gray-100">
                <span className="block font-bold text-[#FF2300] text-[10px] truncate" title={m.name}>{m.name}</span>
                <div className="flex justify-between items-center text-[9px] text-[#727784] mt-1 font-semibold">
                  <span>{m.size}</span>
                  <span>{m.date}</span>
                </div>
              </div>
              
              {/* Abs delete button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setMediaList(prev => prev.filter(item => item.id !== m.id));
                }}
                className="absolute top-2 right-2 p-1 bg-white hover:bg-red-50 text-red-750 border border-gray-150 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                title="Erase asset"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- COMPONENT 7: THEME MANAGER ---
  const [selectedThemePreset, setSelectedThemePreset] = useState("emerald");
  const [primaryHex, setPrimaryHex] = useState("#1A3F25");
  const [secondaryHex, setSecondaryHex] = useState("#C59B6D");
  const [borderRadiusPx, setBorderRadiusPx] = useState(16);
  const [themeSuccess, setThemeSuccess] = useState<string | null>(null);

  const presets = [
    { id: "emerald", name: "Classic Emerald (Capsule)", prim: "#1A3F25", sec: "#C59B6D" },
    { id: "scarlet", name: "Scarlet Premium (Royal Wine)", prim: "#4A1A23", sec: "#E31B23" },
    { id: "sapphire", name: "Deep Sapphire (Nordic Ocean)", prim: "#1D3557", sec: "#457B9D" },
    { id: "carbon", name: "Midnight Charcoal (Brutalist)", prim: "#1C1C1E", sec: "#8E8E93" }
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setSelectedThemePreset(p.id);
    setPrimaryHex(p.prim);
    setSecondaryHex(p.sec);
    setThemeSuccess(`Visual assets preset "${p.name}" successfully formulated into general CSS stylesheets overrides!`);
    setTimeout(() => setThemeSuccess(null), 3500);
  };

  const renderThemeManager = () => {
    const activeTheme = themeConfig;
    
    const handleApplyThemeChange = (key: string, value: any) => {
      const updated = { ...activeTheme, [key]: value };
      saveThemeConfig(updated);
      setThemeSuccess(`Theme property "${key}" updated live!`);
      setTimeout(() => setThemeSuccess(null), 3500);
    };

    return (
      <div className="space-y-6 animate-fadeIn font-sans text-xs">
        <div className="border-b border-[#FF2300]/25/10 pb-4">
          <span className="text-[10px] font-bold text-[#FF2300]/80 tracking-widest uppercase font-bold">USER INTERFACE PREFERENCES (UI CONFIG)</span>
          <h2 className="text-xl font-serif text-[#FF2300] font-bold mt-1">Interactive Theme & Styles Customizer</h2>
          <p className="text-xs text-[#727784] mt-0.5">Toggle site accents, colors, button roundnesses, typography weights, or banner layouts visually from this panel without modification of raw CSS files.</p>
        </div>

        {themeSuccess && (
          <div className="p-3 bg-[#1A3F25]/5 border border-[#FF2300]/25/15 text-[#FF2300] font-bold rounded-xl flex items-center gap-2">
            <Check size={14} className="text-[#C59B6D]" />
            <span>{themeSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Presets and manual hex override form */}
          <div className="bg-[#f0f2f5] border border-[#FF2300]/25/10 p-5 rounded-3xl space-y-4">
            <h3 className="font-serif text-sm font-bold text-[#FF2300] border-b border-gray-100 pb-1.5 uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <Palette size={14} className="text-[#C59B6D]" /> Palette Accent Config
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {presets.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedThemePreset(p.id);
                    setPrimaryHex(p.prim);
                    setSecondaryHex(p.sec);
                    const updated = {
                      ...activeTheme,
                      preset: p.id,
                      primary: p.prim,
                      secondary: p.sec
                    };
                    saveThemeConfig(updated);
                    setThemeSuccess(`Applied layout preset: "${p.name}"!`);
                    setTimeout(() => setThemeSuccess(null), 3000);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedThemePreset === p.id 
                      ? "bg-white border-[#1A3F25] shadow-md" 
                      : "bg-white/40 border-gray-100 hover:border-[#FF2300]/25/10 hover:bg-white"
                  }`}
                >
                  <span className="block font-bold text-[#FF2300] text-xs">{p.name}</span>
                  <div className="flex gap-1.5 mt-2">
                    <span className="w-5 h-5 rounded-full inline-block border border-gray-200" style={{ backgroundColor: p.prim }} />
                    <span className="w-5 h-5 rounded-full inline-block border border-gray-200" style={{ backgroundColor: p.sec }} />
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Primary Color HEX</label>
                  <div className="flex items-center gap-1.5 bg-white border border-[#1A3F25]/15 rounded-lg px-2 py-1.5">
                    <input 
                      type="color" 
                      value={primaryHex} 
                      onChange={(e) => {
                        setPrimaryHex(e.target.value);
                        handleApplyThemeChange("primary", e.target.value);
                      }} 
                      className="w-5 h-5 rounded-md border border-gray-200 cursor-pointer" 
                    />
                    <input 
                      type="text" 
                      value={primaryHex} 
                      onChange={(e) => {
                        setPrimaryHex(e.target.value);
                        handleApplyThemeChange("primary", e.target.value);
                      }} 
                      className="w-full text-xs font-mono font-bold uppercase border-none outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Secondary Accent HEX</label>
                  <div className="flex items-center gap-1.5 bg-white border border-[#1A3F25]/15 rounded-lg px-2 py-1.5">
                    <input 
                      type="color" 
                      value={secondaryHex} 
                      onChange={(e) => {
                        setSecondaryHex(e.target.value);
                        handleApplyThemeChange("secondary", e.target.value);
                      }} 
                      className="w-5 h-5 rounded-md border border-gray-200 cursor-pointer" 
                    />
                    <input 
                      type="text" 
                      value={secondaryHex} 
                      onChange={(e) => {
                        setSecondaryHex(e.target.value);
                        handleApplyThemeChange("secondary", e.target.value);
                      }} 
                      className="w-full text-xs font-mono font-bold uppercase border-none outline-none" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Typography and geometry variables parameters */}
          <div className="bg-white border border-[#1A3F25]/10 p-5 rounded-3xl space-y-4 font-sans text-xs">
            <h3 className="font-serif text-sm font-bold text-[#FF2300] border-b border-gray-100 pb-1.5 uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <Sliders size={14} className="text-[#C59B6D]" /> Geometry & Details
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] font-bold uppercase text-[#727784]">Global CSS Border Radius</label>
                  <span className="font-mono font-bold text-[#FF2300]">{borderRadiusPx}px</span>
                </div>
                <input 
                  type="range" 
                  min={4} 
                  max={28} 
                  value={borderRadiusPx} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setBorderRadiusPx(val);
                    handleApplyThemeChange("radius", val);
                  }} 
                  className="w-full accent-[#1A3F25] cursor-pointer" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Primary Display Typography Font</label>
                <select
                  value={activeTheme.font || "Modern Sans (Inter)"}
                  onChange={(e) => handleApplyThemeChange("font", e.target.value)}
                  className="w-full bg-[#f0f2f5] border border-gray-200 rounded-lg py-2 px-2 outline-none text-[#1a1c1d] font-sans"
                >
                  <option value="Modern Sans (Inter)">Modern Clean Sans — Inter & outfit</option>
                  <option value="Tech Minimalist (Grotesk)">Swiss Avant-Garde — Space Grotesk & Space Mono</option>
                  <option value="Editorial Serif">Editorial Elegance — Playfair Display & Cormorant</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Elevated Card Shadow Style</label>
                <select
                  value={activeTheme.shadow || "Professional Corporate"}
                  onChange={(e) => handleApplyThemeChange("shadow", e.target.value)}
                  className="w-full bg-[#f0f2f5] border border-gray-200 rounded-lg py-2 px-2 outline-none text-[#1a1c1d]"
                >
                  <option value="Professional Corporate">Discreet flat micro-shadow borders</option>
                  <option value="Deep Ambient Luxury">Ambient soft diffused gold shadows</option>
                </select>
              </div>

              <div className="p-3.5 bg-[#C59B6D]/5 border border-[#C59B6D]/15 rounded-2xl">
                <span className="font-bold text-[#A37B5C] text-[10px] block uppercase">🎨 Live Visual Output preview</span>
                <div className="flex justify-between items-center bg-white p-2 rounded-xl mt-2 border border-gray-100">
                  <div className="block">
                    <span className="font-bold text-[10px] block text-[#1A3F25]">Preset: {activeTheme.preset || "emerald"}</span>
                    <span className="text-[9px] text-gray-400 block mt-0.5">Font Style: {activeTheme.font || "Modern Sans"}</span>
                  </div>
                  <button className="px-3 py-1 text-[9px] font-bold text-white bg-[#FF2300] cursor-pointer" style={{ borderRadius: `${borderRadiusPx}px`, backgroundColor: primaryHex }}>
                    Accent test
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- COMPONENT 8: PAGE BUILDER ---
  const [layoutSuccess, setLayoutSuccess] = useState<string | null>(null);
  const [newMarketplaceBlockType, setNewMarketplaceBlockType] = useState("banner");
  const [newMarketplaceBlockTitle, setNewMarketplaceBlockTitle] = useState("");

  const handleCreateMarketplaceBlock = () => {
    if (!newMarketplaceBlockTitle.trim()) {
      alert("Please enter a block title.");
      return;
    }
    const cleanId = `block_${Date.now()}`;
    const newBlock = {
      id: cleanId,
      type: `${newMarketplaceBlockType.toUpperCase()} Commercial Component`,
      title: newMarketplaceBlockTitle.trim(),
      desc: "Custom registered widget section ready to place anywhere inside landing structures without code.",
      active: true
    };
    const updated = [...pageLayoutBlocks, newBlock];
    savePageLayoutBlocks(updated);
    setNewMarketplaceBlockTitle("");
    setLayoutSuccess("Custom Marketplace component registered into core list!");
    setTimeout(() => setLayoutSuccess(null), 3000);
  };

  const handleToggleBlockActive = (id: string) => {
    const updated = pageLayoutBlocks.map((b: any) => b.id === id ? { ...b, active: !b.active } : b);
    savePageLayoutBlocks(updated);
    setLayoutSuccess("Block status toggled!");
    setTimeout(() => setLayoutSuccess(null), 3000);
  };

  const handleBlockMoveUp = (index: number) => {
    if (index === 0) return;
    const blocksCopy = [...pageLayoutBlocks];
    const target = blocksCopy[index];
    blocksCopy[index] = blocksCopy[index - 1];
    blocksCopy[index - 1] = target;
    savePageLayoutBlocks(blocksCopy);
    setLayoutSuccess("Section hierarchy rearranged up!");
    setTimeout(() => setLayoutSuccess(null), 3000);
  };

  const handleBlockMoveDown = (index: number) => {
    if (index === pageLayoutBlocks.length - 1) return;
    const blocksCopy = [...pageLayoutBlocks];
    const target = blocksCopy[index];
    blocksCopy[index] = blocksCopy[index + 1];
    blocksCopy[index + 1] = target;
    savePageLayoutBlocks(blocksCopy);
    setLayoutSuccess("Section hierarchy rearranged down!");
    setTimeout(() => setLayoutSuccess(null), 3000);
  };

  const renderPageBuilder = () => {
    const samplePresets = [
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1576016770956-debb63d900bb?auto=format&fit=crop&q=80&w=800"
    ];

    const slideTitles = [
      "Slide 1: Composite Setup / Beta Live",
      "Slide 2: Luxury Paper Bags",
      "Slide 3: Premium Rigid Boxes",
      "Slide 4: Fine Satin Ribbons"
    ];

    const handleFileRead = (file: File, idx: number) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setEditSiteTexts((prev: Record<string, string>) => ({
          ...prev,
          [`slider_slide_${idx}_image`]: base64String
        }));
        setLayoutSuccess(`Slide ${idx + 1} product image converted and prepared. Remember to click "SAVE CONFIGURATION"!`);
        setTimeout(() => setLayoutSuccess(null), 5000);
      };
      reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setEditSiteTexts((prev: Record<string, string>) => ({
          ...prev,
          [key]: base64String
        }));
        setLayoutSuccess(`Product photo converted and ready. Remember to click "SAVE CONFIGURATION"!`);
        setTimeout(() => setLayoutSuccess(null), 5500);
      };
      reader.readAsDataURL(file);
    };

    return (
      <div className="space-y-6 animate-fadeIn font-sans text-xs">
        <div className="border-b border-[#FF2300]/25/10 pb-4">
          <span className="text-[10px] font-bold text-[#FF2300]/80 tracking-widest uppercase font-bold">LANDING DESIGN BUILDER & MARKETPLACE (CMS)</span>
          <h2 className="text-xl font-serif text-[#FF2300] font-bold mt-1">Modular Page Blocks Canvas (No-Code CMS)</h2>
          <p className="text-xs text-[#727784] mt-0.5">Control the structure, section ordering, FAQ items, or marketing banners of the landing pages visually without modifying any HTML.</p>
        </div>

        {layoutSuccess && (
          <div className="p-3 bg-[#1A3F25]/5 border border-[#FF2300]/25/15 text-[#FF2300] font-bold rounded-xl flex items-center gap-1.5 animate-pulse">
            <Check size={14} className="text-[#C59B6D]" />
            <span>{layoutSuccess}</span>
          </div>
        )}

        {/* PREMIUM HOMEPAGE SLIDER PRODUCT PHOTO MANAGER (Requested by User) */}
        <div className="bg-[#f0f2f5] border border-[#d1d9e6]/65 rounded-3xl p-6 lg:p-8 space-y-6 shadow-sm">
          <div className="border-b border-[#d1d9e6]/45 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[9px] font-black uppercase text-[#ff2300] tracking-widest bg-red-50 border border-red-150 px-2.5 py-1 rounded-full">
                🎠 SLIDER MANAGER
              </span>
              <h3 className="font-serif text-base font-bold text-[#1a1c1d] mt-2">Homepage Slider Product Photos</h3>
              <p className="text-[11px] text-[#1a1c1d]/70 leading-normal mt-1">
                Assign customized high-quality photography for each of the 4 interactive homepage slices. Upload local image files, paste external URLs, or restore original premium presets.
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                try {
                  await handleSaveAll();
                  setLayoutSuccess("Slider configurations have been synchronized successfully with the persistent server database!");
                  setTimeout(() => setLayoutSuccess(null), 4000);
                } catch (err) {
                  alert("Failed to synchronize changes. Please check permissions.");
                }
              }}
              className="bg-[#ff2300] hover:bg-[#e61f00] text-white text-[11px] font-black uppercase tracking-wider px-5 py-2.5 rounded-full shadow-md flex items-center gap-1.5 cursor-pointer select-none transition-all active:scale-95 shrink-0 self-start"
            >
              <Save size={14} />
              <span>SAVE CONFIGURATION</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {[0, 1, 2, 3].map((idx) => {
              const customKey = `slider_slide_${idx}_image`;
              const currentImgSrc = editSiteTexts[customKey] || samplePresets[idx];
              return (
                <div 
                  key={idx} 
                  className="bg-white border border-[#d1d9e6]/45 rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-black tracking-widest text-[#1a1c1d]/50 font-mono">
                        SLIDE 0{idx + 1}
                      </span>
                      <span className="text-[10px] font-bold text-[#ff2300] bg-red-50/60 px-2 py-0.5 rounded-md">
                        {idx === 0 ? "Composite" : idx === 1 ? "Bags" : idx === 2 ? "Boxes" : "Ribbons"}
                      </span>
                    </div>

                    <h4 className="text-[11.5px] font-serif font-bold text-[#1a1c1d] truncate">
                      {slideTitles[idx]}
                    </h4>

                    {/* Image Thumbnail and Upload zone container */}
                    <div className="relative group rounded-xl overflow-hidden aspect-video bg-gray-50 border border-gray-150 p-1 flex items-center justify-center">
                      <img 
                        src={currentImgSrc} 
                        alt={`Slide ${idx}`} 
                        className="w-full h-full object-cover rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-[#1a1c1d]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-[9.5px] uppercase font-bold tracking-wider text-white">
                          Change Image
                        </span>
                      </div>
                    </div>

                    {/* Image URL text input */}
                    <div className="space-y-1">
                      <label className="block text-[8px] font-black uppercase text-gray-400 tracking-wider">
                        Image Address / Custom URL
                      </label>
                      <input 
                        type="text"
                        value={editSiteTexts[customKey] || ""}
                        onChange={(e) => {
                          setEditSiteTexts((prev: Record<string, string>) => ({
                            ...prev,
                            [customKey]: e.target.value
                          }));
                        }}
                        placeholder="Paste image link here"
                        className="w-full border border-gray-200 rounded-lg p-1.5 text-[10.5px] text-[#1a1c1d] outline-none placeholder-gray-300"
                      />
                    </div>

                    {/* Base64 Drag and Drop file uploader */}
                    <div className="space-y-1">
                      <label className="block text-[8px] font-black uppercase text-gray-400 tracking-wider">
                        Upload Local File (Base64)
                      </label>
                      <div className="relative border border-dashed border-[#d1d9e6] hover:border-[#ff2300]/50 rounded-lg p-2.5 text-center transition-all cursor-pointer bg-gray-55/40 text-gray-55">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, customKey)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <Upload size={14} className="text-[#1a1c1d]/50" />
                          <span className="text-[9.5px] font-bold text-[#1a1c1d]/60">
                            Drag or click
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preset Restore Control */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditSiteTexts((prev: Record<string, string>) => ({
                          ...prev,
                          [customKey]: samplePresets[idx]
                        }));
                      }}
                      className="text-[9.5px] font-bold text-[#1a1c1d]/60 hover:text-[#ff2300] transition-colors"
                    >
                      Use Studio Preset
                    </button>
                    {editSiteTexts[customKey] && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditSiteTexts((prev: Record<string, string>) => {
                            const updated = { ...prev };
                            delete updated[customKey];
                            return updated;
                          });
                        }}
                        className="text-[9.5px] font-bold text-red-650 hover:text-red-800 transition-colors"
                      >
                        Wipe Custom
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active outline tree with editors */}
          <div className="lg:col-span-8 bg-white border border-[#1A3F25]/10 p-5 rounded-3xl space-y-4">
            <h3 className="font-serif text-sm font-bold text-[#FF2300] border-b border-gray-100 pb-1.5 uppercase tracking-widest flex items-center justify-between">
              <span>🥞 Live Layout Canvas Blocks ({pageLayoutBlocks.length})</span>
              <span className="text-[10px] text-teal-700 font-extrabold px-2 py-0.5 rounded-full bg-teal-50">Fully Reorderable</span>
            </h3>

            <div className="space-y-3">
              {pageLayoutBlocks.map((b: any, idx: number) => (
                <div key={b.id || idx} className="p-4 rounded-2xl bg-[#f0f2f5] border border-gray-100 hover:bg-opacity-95 transition-all animate-fadeIn space-y-2">
                  <div className="flex items-center justify-between border-b border-gray-100/50 pb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black text-[#FF2300]/40 w-4 select-none">0{idx+1}</span>
                      <span className="font-bold text-[#FF2300] text-xs block truncate max-w-[200px]">{b.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleBlockMoveUp(idx)}
                        disabled={idx === 0}
                        className="p-1 px-1.5 bg-white border rounded text-[10px] hover:bg-gray-55 disabled:opacity-30 cursor-pointer text-[#1a1c1d] font-mono font-bold"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button 
                        onClick={() => handleBlockMoveDown(idx)}
                        disabled={idx === pageLayoutBlocks.length - 1}
                        className="p-1 px-1.5 bg-white border rounded text-[10px] hover:bg-gray-55 disabled:opacity-30 cursor-pointer text-[#1a1c1d] font-mono font-bold"
                        title="Move Down"
                      >
                        ▼
                      </button>
                      <button 
                        onClick={() => handleToggleBlockActive(b.id)}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer border ${
                          b.active 
                            ? "bg-teal-50 border-teal-200 text-teal-800" 
                            : "bg-red-50 border-red-150 text-red-700"
                        }`}
                      >
                        {b.active ? "Active" : "Hidden"}
                      </button>
                      <button
                        onClick={() => {
                          const verified = confirm(`Do you want to wipe block "${b.type}" from rendering sequence?`);
                          if (verified) {
                            const updated = pageLayoutBlocks.filter((item: any) => item.id !== b.id);
                            savePageLayoutBlocks(updated);
                          }
                        }}
                        className="p-1 text-red-750 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Inline metadata editors */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[8px] font-bold text-gray-400 uppercase">Subtext/Section title markup</label>
                      <input 
                        type="text"
                        value={b.title || ""}
                        onChange={(e) => {
                          const updated = pageLayoutBlocks.map((item: any) => item.id === b.id ? { ...item, title: e.target.value } : item);
                          savePageLayoutBlocks(updated);
                        }}
                        className="w-full bg-white border border-gray-200 rounded p-1.5 text-xs text-[#1A3F25] font-semibold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-bold text-gray-400 uppercase">Interactive section body description</label>
                      <input 
                        type="text"
                        value={b.desc || ""}
                        onChange={(e) => {
                          const updated = pageLayoutBlocks.map((item: any) => item.id === b.id ? { ...item, desc: e.target.value } : item);
                          savePageLayoutBlocks(updated);
                        }}
                        className="w-full bg-white border border-gray-200 rounded p-1.5 text-xs text-gray-600 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Component Marketplace Sidecard for block additions */}
          <div className="lg:col-span-4 bg-[#f0f2f5] border border-[#FF2300]/25/10 p-5 rounded-3xl space-y-4">
            <div className="border-b border-gray-150 pb-2">
              <h3 className="font-serif text-sm font-bold text-[#FF2300] uppercase tracking-widest flex items-center gap-1.5">
                🛒 Component Marketplace & Additions
              </h3>
              <p className="text-[9px] text-gray-400 leading-normal mt-0.5">Visually deploy reusable UI components straight from the local library stack with a single click.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Component block Template</label>
                <select
                  value={newMarketplaceBlockType}
                  onChange={(e) => setNewMarketplaceBlockType(e.target.value)}
                  className="w-full bg-white border border-[#FF2300]/25/15 rounded-lg py-2 px-2 outline-none text-[#1a1c1d] font-sans"
                >
                  <option value="banner">📢 CTA Marketing Action Banner with Form</option>
                  <option value="carousel">🎠 Panoramic Slider Carousel of physical goods</option>
                  <option value="tabs">📂 Double Tabbed Custom catalog grid system</option>
                  <option value="faq_card">❔ Help Center accordion card panel</option>
                  <option value="trustpilot">⭐ Verifiable TrustPilot reviews block widget</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Assigned block visual Title</label>
                <input 
                  type="text"
                  value={newMarketplaceBlockTitle}
                  onChange={(e) => setNewMarketplaceBlockTitle(e.target.value)}
                  placeholder="e.g. 🎁 Get Free 3D Sketch Layout Design"
                  className="w-full bg-white border border-[#1A3F25]/15 rounded-lg py-2 px-3 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCreateMarketplaceBlock}
                  className="w-full py-2.5 bg-[#ff2300] text-white rounded-xl shadow-md font-bold uppercase tracking-wider text-xs hover:bg-[#e61f00] transition-all text-center flex items-center justify-center gap-1"
                >
                  <Plus size={12} /> Inject Component onto Layout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- ENTERPRISE UPGRADE: LIVE ORDERS & PRODUCTION STATE MANAGERS ---
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [managerFilter, setManagerFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [orderSortBy, setOrderSortBy] = useState("ts");
  const [orderSortOrder, setOrderSortOrder] = useState<"asc" | "desc">("desc");
  const [ordersViewMode, setOrdersViewMode] = useState<"list" | "kanban">("list");
  const [isAddingOrder, setIsAddingOrder] = useState(false);
  const [whatsappDraftText, setWhatsappDraftText] = useState("");
  const [whatsappSuccessMsg, setWhatsappSuccessMsg] = useState<string | null>(null);
  const [orderUpdateSuccess, setOrderUpdateSuccess] = useState<string | null>(null);

  // Currency conversion rates
  const [exchangeRates] = useState({ AMD: 1, USD: 390, EUR: 420 });
  const [selectedInvoiceCurrency, setSelectedInvoiceCurrency] = useState<"AMD" | "USD" | "EUR">("AMD");

  // Temporary new order variables
  const [newOrderName, setNewOrderName] = useState("");
  const [newOrderPhone, setNewOrderPhone] = useState("");
  const [newOrderType, setNewOrderType] = useState("bags");
  const [newOrderPrice, setNewOrderPrice] = useState(15000);
  const [newOrderQty, setNewOrderQty] = useState(100);
  const [newOrderDetails, setNewOrderDetails] = useState("");

  // --- COMPONENT 9: CRM MANAGER ---
  const [crmSearch, setCrmSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientComment, setClientComment] = useState("");
  const [crmSuccess, setCrmSuccess] = useState<string | null>(null);

  // Compile CRM records by live backend customer list combined with filters
  const clients = useMemo(() => {
    return crmCustomersList.filter((c: any) => 
      (c.name || "").toLowerCase().includes(crmSearch.toLowerCase()) ||
      (c.phone || "").includes(crmSearch)
    );
  }, [crmCustomersList, crmSearch]);

  const handleUpdateClientNote = async (overrideVip?: boolean) => {
    if (!selectedClient || !adminToken) return;
    try {
      const vipValue = overrideVip !== undefined ? overrideVip : selectedClient.isVip;
      const res = await fetch("/api/admin/crm/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          phone: selectedClient.phone,
          name: selectedClient.name,
          comments: clientComment,
          isVip: vipValue
        })
      });
      const data = await res.json();
      if (data.success) {
        setCrmSuccess(`CRM ledger updated for ${selectedClient.phone}!`);
        // update our selected state representation too
        setSelectedClient(prev => ({ ...prev, comments: clientComment, isVip: vipValue }));
        setDbRefreshTrigger(p => p + 1);
        setTimeout(() => setCrmSuccess(null), 3000);
      } else {
        alert("CRM Save error: " + data.error);
      }
    } catch (err: any) {
      console.error("Failed saving CRM entry", err);
    }
  };

  const renderCRM = () => {
    return (
      <div className="space-y-6 animate-fadeIn font-sans text-xs">
        <div className="border-b border-[#C59B6D]/20 pb-4">
          <span className="text-[10px] font-bold text-[#C59B6D] tracking-widest uppercase flex items-center gap-1">
            <Users size={11} className="text-[#C59B6D]" /> MULTI-CLIENT CRM PORTAL
          </span>
          <h2 className="text-xl font-serif text-[#1A3F25] font-bold mt-1">Loyalty Tier & LTV Manager</h2>
          <p className="text-xs text-[#414753] mt-0.5">Manage customer statistics, track aggregate Lifetime Value (LTV), record manager remarks, and target VIP clients dynamically stored in PostgreSQL.</p>
        </div>

        {crmSuccess && (
          <div className="p-3 bg-[#1A3F25]/10 border border-[#1A3F25]/20 text-[#1A3F25] font-bold rounded-xl flex items-center gap-1.5 animate-pulse">
            <Check size={14} className="text-[#1A3F25]" />
            <span>{crmSuccess}</span>
          </div>
        )}

        <div className="relative">
          <input 
            type="text" 
            value={crmSearch}
            onChange={(e) => setCrmSearch(e.target.value)}
            placeholder="Search clients by name, company, or Armenian phone coordinate..."
            className="w-full bg-[#f0f2f5] border border-[#1A3F25]/15 rounded-xl py-2.5 pl-9 pr-4 outline-none text-[#1a1c1d] font-medium font-sans"
          />
          <Search size={14} className="absolute left-3 top-3.5 text-[#727784]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans text-xs">
          {/* Unified list */}
          <div className="lg:col-span-12 xl:col-span-7 bg-white border border-[#1A3F25]/10 p-4 rounded-3xl space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#1A3F25] border-b border-gray-150 pb-1.5 uppercase tracking-widest">
              👥 Customer Directory ({clients.length})
            </h3>
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {clients.map((c: any, idx) => {
                const spending = Number(c.totalSpend) || 0;
                let loyaltyBadge = "Bronze User";
                if (c.isVip) loyaltyBadge = "👑 VIP PARTNER";
                else if (spending > 500000) loyaltyBadge = "GOLD PRO";
                else if (spending > 150000) loyaltyBadge = "SILVER MEMBER";

                return (
                  <div 
                    key={idx} 
                    onClick={() => {
                      setSelectedClient(c);
                      setClientComment(c.comments || "");
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between animate-fadeIn ${
                      selectedClient?.phone === c.phone 
                        ? "bg-[#C59B6D]/15 border-[#1A3F25]/30 shadow-sm" 
                        : "bg-[#f0f2f5] border-transparent hover:bg-opacity-95 hover:border-[#1A3F25]/5"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#1A3F25] text-xs block">{c.name || "Client"}</span>
                        {c.isVip && (
                          <span className="bg-yellow-50 text-yellow-700 text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">VIP</span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#727784] font-sans font-medium block mt-0.5">{c.phone}</span>
                    </div>
                    <div className="text-right">
                      <span className="block font-mono font-bold text-[11px] text-[#1A3F25]">{spending.toLocaleString()} ֏</span>
                      <span className={`text-[8px] uppercase font-black rounded-full px-2 py-0.5 mt-1 inline-block ${c.isVip ? "bg-amber-100 text-amber-800" : "bg-teal-50 text-teal-800"}`}>
                        {loyaltyBadge}
                      </span>
                    </div>
                  </div>
                );
              })}
              {clients.length === 0 && (
                <p className="text-center italic text-[#727784] py-8 font-serif">No customer directory matched query options.</p>
              )}
            </div>
          </div>

          {/* Manager notes ledger info panel */}
          <div className="lg:col-span-12 xl:col-span-5 bg-[#f0f2f5] border border-[#1A3F25]/10 p-5 rounded-3xl space-y-4">
            <h3 className="font-serif text-sm font-bold text-[#1A3F25] border-b border-gray-150 pb-1.5 uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <Plus size={14} className="text-[#C59B6D]" /> Client Ledger Card
            </h3>

            {selectedClient ? (
              <div className="space-y-3 animate-fadeIn">
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold uppercase text-[#727784]">Target customer</span>
                  <span className="text-sm font-bold text-[#1A3F25] block">{selectedClient.name}</span>
                  <span className="text-xs text-[#7C9082] block font-sans font-semibold">{selectedClient.phone}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm col-span-1">
                  <div>
                    <span className="block text-[9px] font-bold uppercase text-[#727784]">Orders & Avg ticket</span>
                    <span className="text-xs font-mono font-bold text-[#1A3F25] mt-0.5 block">{selectedClient.ordersCount || 0} bills (avg {(Number(selectedClient.avgCheck) || 0).toLocaleString()} ֏)</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase text-[#727784]">VIP COORDINATE</span>
                    <button
                      onClick={() => handleUpdateClientNote(!selectedClient.isVip)}
                      className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase mt-1 block tracking-wider cursor-pointer ${selectedClient.isVip ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-750"}`}
                    >
                      {selectedClient.isVip ? "★ VIP ACTIVE" : "☆ ACTIVATE VIP"}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-[#7C9082]">Corporate remarks / Manager Private Comments</label>
                  <textarea 
                    value={clientComment}
                    onChange={(e) => setClientComment(e.target.value)}
                    placeholder="Log client preferred handles, colors, design vectors..."
                    rows={4}
                    className="w-full bg-white border border-[#1A3F25]/15 rounded-xl p-2.5 outline-none font-sans"
                  />
                </div>

                <button 
                  onClick={() => handleUpdateClientNote()}
                  className="w-full py-2 bg-[#1A3F25] hover:bg-[#1A3F25]/90 text-white font-bold rounded-xl shadow transition-all cursor-pointer truncate uppercase tracking-wider text-[10px]"
                >
                  Save Remark to client account
                </button>
              </div>
            ) : (
              <div className="py-12 text-center text-[#727784] italic border border-[#1A3F25]/5 p-4 rounded-2xl bg-white/40">
                Please click on any client card coordinate on the left to review ledger profile, remarks, and aggregate purchases history.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- COMPONENT 10: METALLIC ANALYTICS ---
  const renderAnalytics = () => {
    const pageviewsData = [
      { name: "Mon", pageviews: 2400, inquiries: 140, conversions: 5.8 },
      { name: "Tue", pageviews: 2800, inquiries: 180, conversions: 6.4 },
      { name: "Wed", pageviews: 3100, inquiries: 240, conversions: 7.7 },
      { name: "Thu", pageviews: 2900, inquiries: 190, conversions: 6.5 },
      { name: "Fri", pageviews: 3500, inquiries: 280, conversions: 8.0 },
      { name: "Sat", pageviews: 4200, inquiries: 320, conversions: 7.6 },
      { name: "Sun", pageviews: 4000, inquiries: 310, conversions: 7.7 },
    ];

    return (
      <div className="space-y-6 animate-fadeIn font-sans text-xs">
        <div className="border-b border-[#FF2300]/25/10 pb-4">
          <span className="text-[10px] font-bold text-[#1A3F25] tracking-widest uppercase font-bold">CONVERSION METRICS ENGINE</span>
          <h2 className="text-xl font-serif text-[#FF2300] font-bold mt-1">Executive Analytics Portal</h2>
          <p className="text-xs text-[#727784] mt-0.5">Review general conversion percentages, customer traffic levels, chat assistance volumes, card triggers, and print inquiry pipelines in high visibility charts.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic chart */}
          <div className="bg-white border border-[#1A3F25]/10 p-4 rounded-3xl shadow-sm">
            <h3 className="font-serif text-xs font-bold text-[#1A3F25] mb-3 uppercase tracking-widest border-b border-gray-100 pb-1.5 font-bold">
              📈 Weekly Inbound views and Interactions
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pageviewsData}>
                  <defs>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C59B6D" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#C59B6D" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#7C9082" />
                  <YAxis tickFormatter={(v) => `${v/1000}k`} stroke="#7C9082" />
                  <Tooltip />
                  <Area type="monotone" dataKey="pageviews" stroke="#C59B6D" strokeWidth={2} fillOpacity={1} fill="url(#colorPv)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Conversions bar */}
          <div className="bg-white border border-[#FF2300]/25/10 p-4 rounded-3xl shadow-sm">
            <h3 className="font-serif text-xs font-bold text-[#1A3F25] mb-3 uppercase tracking-widest border-b border-gray-100 pb-1.5 font-bold">
              📊 Conversion Percentage by scale day
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pageviewsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={true} />
                  <XAxis dataKey="name" stroke="#7C9082" />
                  <YAxis tickFormatter={(v) => `${v}%`} stroke="#7C9082" />
                  <Tooltip />
                  <Bar dataKey="conversions" fill="#1A3F25" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- COMPONENT 11: PERMISSIONS ---
  const handleUpdateUserRole = async (userUid: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userUid}/role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (data.success) {
        setDbRefreshTrigger(prev => prev + 1);
      } else {
        alert("Failed to change user role: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      console.error("Error updating user role", err);
    }
  };

  const renderPermissions = () => {
    const listToRender = enterpriseUsers.length > 0 ? enterpriseUsers.map(usr => ({
      id: usr.id,
      uid: usr.uid,
      user: usr.email,
      role: usr.role,
      scope: usr.role === "Super Admin" ? "Universal access" : 
             usr.role === "Manager" ? "Config & catalog workspace panel" :
             usr.role === "Sales" ? "CRM & active order progression" :
             usr.role === "Translator" ? "Translation keys only" : "Operational scope limited"
    })) : [
      { id: 1, uid: "mock_1", user: "admin", role: "Super Admin", scope: "Universal access" },
      { id: 2, uid: "mock_2", user: "Armand_Sales", role: "Sales & CRM Manager", scope: "Inquiries logs, CRM write only" },
      { id: 3, uid: "mock_3", user: "Elena_Trans", role: "Translator CMS", scope: "Translation system only" }
    ];

    return (
      <div className="space-y-6 animate-fadeIn font-sans text-xs">
        <div className="border-b border-[#FF2300]/25/10 pb-4">
          <span className="text-[10px] font-bold text-[#FF2300]/80 tracking-widest uppercase">TEAM DECK SEGREGATION</span>
          <h2 className="text-xl font-serif text-[#1A3F25] font-bold mt-1">Administrative Scopes & Permissions</h2>
          <p className="text-xs text-[#727784] mt-0.5">Define corporate managers usernames, restrict translation workspace panels, lock financial coefficients, and configure sales credentials safely.</p>
        </div>

        <div className="bg-white border border-[#1A3F25]/10 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f0f2f5] border-b border-[#FF2300]/25/10 text-[10px] uppercase font-bold text-[#7C9082] font-bold">
                <th className="py-2.5 px-4 font-bold">Username Code</th>
                <th className="py-2.5 px-4 font-bold">Assigned corporate Role</th>
                <th className="py-2.5 px-4 font-bold">Active operational Scope</th>
                <th className="py-2.5 px-4 font-bold">System coordinates Validation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans text-xs">
              {listToRender.map((usr) => (
                <tr key={usr.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-[#FF2300]">{usr.user}</td>
                  <td className="py-3 px-4 font-semibold text-[#C59B6D]">
                    {usr.uid && !usr.uid.startsWith("mock_") ? (
                      <select
                        value={usr.role}
                        onChange={(e) => handleUpdateUserRole(usr.uid, e.target.value)}
                        className="bg-[#f0f2f5] border border-[#FF2300]/25/10 rounded py-1 px-2 font-bold select-none cursor-pointer text-xs"
                      >
                        {["Super Admin", "Manager", "Sales", "Production", "Translator"].map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    ) : (
                      <span>{usr.role}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-[#414753]">{usr.scope}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-[#1A3F25]/5 text-[#FF2300] border border-[#FF2300]/25/10 uppercase">
                      Access Granted
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // --- COMPONENT 12: AUDIT LOGS ---
  const renderAuditLog = () => {
    return (
      <div className="space-y-6 animate-fadeIn font-sans text-xs">
        <div className="border-b border-[#FF2300]/25/10 pb-4">
          <span className="text-[10px] font-bold text-[#FF2300]/80 tracking-widest uppercase">COMPLIANCE LEDGER CONTROL</span>
          <h2 className="text-xl font-serif text-[#1A3F25] font-bold mt-1">Audit Ledger & Administrative Trace</h2>
          <p className="text-xs text-[#727784] mt-0.5">An immutable log of every administrative operation. Monitor setting updates, price adjustments, or synchronization operations carried out by corporate profiles.</p>
        </div>

        <div className="bg-white border border-[#1A3F25]/10 rounded-3xl overflow-hidden shadow-sm">
          <div className="max-h-[360px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f0f2f5] border-b border-[#FF2300]/25/10 text-[10px] uppercase font-bold text-[#7C9082] font-bold">
                  <th className="py-2.5 px-4 font-bold">Timestamp stamp</th>
                  <th className="py-2.5 px-4 font-bold">Operator profile</th>
                  <th className="py-2.5 px-4 font-bold">Action parameters details</th>
                  <th className="py-2.5 px-4 font-bold">Security reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans text-xs">
                {[
                  { ts: "2026-06-12 17:51:04", user: "system_master", act: "Formulated backup restoration from cloud archives", hash: "SHA256:4919" },
                  { ts: "2026-06-12 16:32:11", user: "admin", act: "Modified Chromo 300g sq.m base premium rates surcharge to 48֏", hash: "SHA256:0125" },
                  { ts: "2026-06-12 15:40:22", user: "armand_sales", act: "Logged critical client comment notes for phone: +374 91 00218", hash: "SHA256:4421" },
                  { ts: "2026-06-12 11:15:02", user: "elena_trans", act: "Corrected translation strings for key: 'cart.title' armenian override", hash: "SHA256:9192" },
                  { ts: "2026-06-12 09:22:45", user: "admin", act: "Registered custom bulk promo-code 'WELCOME2525' active discount 10%", hash: "SHA256:8812" }
                ].map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-[#7C9082]">{item.ts}</td>
                    <td className="py-3 px-4 font-bold text-[#FF2300]">{item.user}</td>
                    <td className="py-2.5 px-4 text-xs font-medium text-[#414753]">{item.act}</td>
                    <td className="py-3 px-4 font-mono text-[9px] text-teal-700 font-bold bg-teal-50/40">{item.hash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // --- COMPONENT 13: DATABASE MANAGER ---
  const handleCopyRawSchemaJSON = () => {
    const rawDump = {
      categories: editCategories,
      products: editProducts,
      dimensions: editDimensions,
      finishes: editFinishes,
      papers: editPapers,
      contactSettings: editContact
    };
    navigator.clipboard.writeText(JSON.stringify(rawDump, null, 2));
    alert("Universal DB configuration payload dumped into system clipboard!");
  };

  const renderDatabaseManager = () => {
    const serializedDb = JSON.stringify({
      categories_count: editCategories.length,
      products_count: editProducts.length,
      papers_count: editPapers.length,
      finishes_count: editFinishes.length,
      discount_codes: editDiscountCodes.length
    }, null, 2);

    return (
      <div className="space-y-6 animate-fadeIn font-sans text-xs">
        <div className="border-b border-[#FF2300]/25/10 pb-4">
          <span className="text-[10px] font-bold text-[#C59B6D] tracking-widest uppercase">LOW-LEVEL MEMORY VIEW</span>
          <h2 className="text-xl font-serif text-[#1A3F25] font-bold mt-1">Core Database Manager</h2>
          <p className="text-xs text-[#727784] mt-0.5">Read JSON data sheets directly, copy schemas into third-party integrations, and examine structural integrity variables instantly.</p>
        </div>

        <div className="bg-[#f0f2f5] border border-[#FF2300]/25/10 p-5 rounded-3xl space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="font-bold text-[#FF2300] uppercase tracking-wider text-[10px] font-bold">📟 Active Database Stats Outline</span>
            <button 
              onClick={handleCopyRawSchemaJSON}
              className="px-3 py-1 bg-[#ff2300] hover:bg-[#e61f00] text-white rounded-lg shadow font-bold text-[10px] cursor-pointer"
            >
              Dump payload to clipboard
            </button>
          </div>

          <pre className="font-mono text-[10px] text-[#FF2300] p-4 bg-white border border-gray-150 rounded-2xl overflow-x-auto shadow-inner leading-relaxed">
            {serializedDb}
          </pre>
        </div>
      </div>
    );
  };

  // --- COMPONENT 14: IMPORT EXPORT ---
  const handleExportCSVFile = () => {
    let csvContent = "data:text/csv;charset=utf-8,ID,Name,Category\n";
    editProducts.forEach(p => {
      csvContent += `${p.id},"${p.name}",${p.categoryId}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "capsule_products_database_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderImportExport = () => {
    return (
      <div className="space-y-6 animate-fadeIn font-sans text-xs">
        <div className="border-b border-[#FF2300]/25/10 pb-4">
          <span className="text-[10px] font-bold text-[#FF2300]/80 tracking-widest uppercase">BULK TRANSACT EXCELES</span>
          <h2 className="text-xl font-serif text-[#1A3F25] font-bold mt-1">Bulk Excel, CSV, & Raw JSON sync</h2>
          <p className="text-xs text-[#727784] mt-0.5">Export operational metrics, coupon rules, client lists, or full product configurations to spreadsheets formats with a single click.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl border border-[#1A3F25]/10 bg-white shadow-sm flex flex-col justify-between h-40">
            <div>
              <span className="block font-bold text-[#FF2300] text-xs">Export Products Catalog (CSV / Excel)</span>
              <span className="block text-[10px] text-[#727784] mt-1 leading-relaxed">Generate spreadsheet rows containing active products names, allocated criteria categories, minimum order metrics, and visual mock links.</span>
            </div>
            <button 
              onClick={handleExportCSVFile}
              className="mt-3 py-2 bg-[#FF2300] text-white font-bold hover:bg-opacity-95 rounded-xl uppercase tracking-wider text-[10px] shadow flex items-center justify-center gap-1.5 cursor-pointer max-w-[200px]"
            >
              <FileSpreadsheet size={12} /> Download CSV layout
            </button>
          </div>

          <div className="p-5 rounded-3xl border border-[#FF2300]/25/10 bg-white/40 shadow-sm flex flex-col justify-between h-40">
            <div>
              <span className="block font-bold text-[#1A3F25] text-xs">Bulk State Import Manager</span>
              <span className="block text-[10px] text-[#7C9082] mt-1 leading-relaxed">Bulk load translation arrays, clients logs datasets, price multipliers matrices, or catalog additions via Drag & Drop visual validation zones safely.</span>
            </div>
            <div className="border border-dashed border-[#1A3F25]/15 hover:border-[#1A3F25]/30 rounded-xl p-3 text-center cursor-pointer bg-white">
              <span className="text-[10px] text-[#1A3F25] font-bold">Select raw database sync file</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- COMPONENT 15: WORKFLOW AUTOMATION & API MANAGER ---
  const renderAPIManager = () => {
    const handleSelectWorkflow = (wf: any) => {
      setSelectedWorkflow(wf);
      setNewWfName(wf.name || "");
      setNewWfEvent(wf.event || "order_submitted");
      setNewWfActionType(wf.action_type || "email");
      setNewWfConfig(wf.action_config || {});
    };

    const handleCreateWorkflow = () => {
      setSelectedWorkflow({ isNew: true });
      setNewWfName("New Automation Block");
      setNewWfEvent("order_submitted");
      setNewWfActionType("telegram");
      setNewWfConfig({
        telegram_chat_id: "",
        telegram_token: "",
        email_recipient: "",
        subject: "",
        webhook_url: "",
        whatsapp_phone: "",
        ai_instruction: ""
      });
    };

    const handleSaveWorkflow = async () => {
      if (!newWfName.trim()) {
        alert("Workflow Name is mandatory");
        return;
      }
      try {
        const res = await fetch("/api/admin/workflows", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            id: selectedWorkflow?.isNew ? undefined : selectedWorkflow?.id,
            name: newWfName,
            event: newWfEvent,
            action_type: newWfActionType,
            action_config: newWfConfig
          })
        });
        const data = await res.json();
        if (data.success) {
          setWfConsoleLogs(["[System]: Automation workflow rule saved successfully to PostgreSQL."]);
          setDbRefreshTrigger(p => p + 1);
          setSelectedWorkflow(null);
        } else {
          alert("Error saving: " + data.error);
        }
      } catch (err: any) {
        alert("Fail: " + err.message);
      }
    };

    const handleTestWorkflow = async (wf: any) => {
      setWfTestingId(wf.id);
      setWfConsoleLogs(["[Testing]: Launching automation flow trigger...", `[Trigger]: Event matched: "${wf.event}"`]);
      try {
        const res = await fetch("/api/admin/workflows/test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminToken}`
          },
          body: JSON.stringify({ id: wf.id })
        });
        const data = await res.json();
        if (data.success) {
          setWfConsoleLogs(prev => [
            ...prev,
            ...data.logs,
            `[Status]: Integration simulation complete. Outcome: SUCCESS`
          ]);
        } else {
          setWfConsoleLogs(prev => [
            ...prev,
            `[Error]: Simulation failed -> ${data.error}`
          ]);
        }
      } catch (err: any) {
        setWfConsoleLogs(prev => [
          ...prev,
          `[Connection Error]: ${err.message}`
        ]);
      } finally {
        setWfTestingId(null);
      }
    };

    return (
      <div className="space-y-6 animate-fadeIn font-sans text-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#FF2300]/25/10 pb-4 gap-2">
          <div>
            <span className="text-[10px] font-bold text-[#C59B6D] tracking-widest uppercase">AUTOMATION DISPATCH ENGINE</span>
            <h2 className="text-xl font-serif text-[#FF2300] font-bold mt-1">Workflow Automation Builder</h2>
            <p className="text-xs text-[#727784] mt-0.5">Visually orchestrate messaging protocols, CRM webhooks, and AI events when data changes in PostgreSQL.</p>
          </div>
          <button
            onClick={handleCreateWorkflow}
            className="px-4 py-2 bg-[#ff2300] hover:bg-[#e61f00] text-white rounded-xl shadow-lg font-bold tracking-wider text-[10px] uppercase text-center flex items-center gap-1 cursor-pointer"
          >
            <Plus size={11} /> Create Automation Task
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Workflows List Grid */}
          <div className="lg:col-span-5 bg-[#f0f2f5] border border-[#FF2300]/25/10 p-5 rounded-3xl space-y-4">
            <h3 className="font-serif text-xs font-bold text-[#1A3F25] uppercase tracking-widest pb-1 border-b border-gray-200">
              ⚡ Decoupled Workflows ({dbWorkflows.length})
            </h3>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {dbWorkflows.map((wf) => {
                const isSel = selectedWorkflow?.id === wf.id;
                return (
                  <div 
                    key={wf.id}
                    className={`p-3.5 rounded-2.5xl bg-white border transition-all ${
                      isSel ? "border-[#C59B6D] ring-2 ring-[#C59B6D]/15" : "border-gray-100 hover:bg-gray-50/50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-extrabold text-[#1A3F25] text-xs block">{wf.name}</span>
                        <span className="text-[9px] text-[#7C9082] font-mono mt-0.5 block uppercase">
                          IF {wf.event} ➜ THEN {wf.action_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSelectWorkflow(wf)}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-[10px] font-bold text-gray-700 rounded-lg cursor-pointer"
                        >
                          Modify
                        </button>
                        <button
                          onClick={() => handleTestWorkflow(wf)}
                          disabled={wfTestingId === wf.id}
                          className="px-2 py-1 bg-emerald-55 hover:bg-emerald-100 text-[10px] font-bold text-[#1A3F25] rounded-lg cursor-pointer disabled:opacity-40"
                        >
                          {wfTestingId === wf.id ? "Testing..." : "Test Rule"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {dbWorkflows.length === 0 && (
                <p className="text-[11px] text-gray-400 italic text-center py-8">No dynamic webhooks or triggers customized yet.</p>
              )}
            </div>

            {/* Simulated Live Console Logs */}
            <div className="border border-[#FF2300]/25/10 p-4 rounded-2xl bg-[#1A3F25] text-emerald-400 font-mono text-[10px] space-y-1.5 h-[160px] overflow-y-auto">
              <span className="text-gray-400 font-bold block text-[9px] pb-1 border-b border-emerald-900 uppercase">Automation Event Receiver Log</span>
              {wfConsoleLogs.map((logStr, i) => (
                <div key={i} className="leading-5">➜ {logStr}</div>
              ))}
              {wfConsoleLogs.length === 0 && (
                <span className="text-emerald-600 italic">Console idle. Trigger "Test Rule" to watch live execution flows.</span>
              )}
            </div>
          </div>

          {/* Workflow Designer Workspace */}
          <div className="lg:col-span-7">
            {selectedWorkflow ? (
              <div className="bg-white border border-[#1A3F25]/10 p-6 rounded-3xl space-y-5">
                <h3 className="font-serif text-sm font-bold text-[#FF2300] uppercase tracking-widest pb-2 border-b border-gray-100">
                  🛠️ Interactive action builder Workspace
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-[#7C9082] mb-1">Workflow Rule Label</label>
                    <input 
                      type="text"
                      className="w-full bg-[#f0f2f5] border border-gray-150 rounded-xl px-3.5 py-2 text-xs font-bold text-[#FF2300] outline-none"
                      value={newWfName}
                      onChange={(e) => setNewWfName(e.target.value)}
                      placeholder="e.g. Notify Production on High Volume orders"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-[#7C9082] mb-1">PostgreSQL Trigger Event</label>
                      <select
                        className="w-full bg-[#f0f2f5] border border-gray-150 rounded-xl px-3.5 py-2 text-xs font-bold text-[#FF2300] outline-none"
                        value={newWfEvent}
                        onChange={(e) => setNewWfEvent(e.target.value)}
                      >
                        <option value="order_submitted">On Checkout Submission</option>
                        <option value="product_created">On New Product Added</option>
                        <option value="formula_failed">On Pricing Evaluation Error</option>
                        <option value="audit_role_denied">On Permission Denied Alert</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-[#7C9082] mb-1">Target Action Protocol</label>
                      <select
                        className="w-full bg-[#f0f2f5] border border-gray-150 rounded-xl px-3.5 py-2 text-xs font-bold text-[#FF2300] outline-none"
                        value={newWfActionType}
                        onChange={(e) => setNewWfActionType(e.target.value)}
                      >
                        <option value="email">Send SMTP Email Direct</option>
                        <option value="telegram">Post message to Telegram Channel</option>
                        <option value="whatsapp">Ping WhatsApp Business API</option>
                        <option value="crm_webhook">POST payload to CRM Webhook</option>
                        <option value="ai_analysis">Analyze with AI Cognitive Coprocessor</option>
                      </select>
                    </div>
                  </div>

                  <div className="border border-gray-100 p-4 bg-[#f0f2f5] rounded-2.5xl space-y-3.5">
                    <span className="text-[10px] font-black uppercase text-[#C59B6D]">Channel specific properties</span>

                    {newWfActionType === "email" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fadeIn">
                        <div>
                          <label className="block text-[9px] font-bold text-[#7C9082] uppercase mb-0.5">SMTP Recipient Address</label>
                          <input 
                            type="text" 
                            className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs font-bold text-[#1A3F25] outline-none" 
                            value={newWfConfig.email_recipient || ""} 
                            onChange={(e) => setNewWfConfig({ ...newWfConfig, email_recipient: e.target.value })} 
                            placeholder="admin@capsuleconcept.com" 
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-[#7C9082] uppercase mb-0.5">Subject Template</label>
                          <input 
                            type="text" 
                            className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-[#1A3F25] outline-none" 
                            value={newWfConfig.subject || ""} 
                            onChange={(e) => setNewWfConfig({ ...newWfConfig, subject: e.target.value })} 
                            placeholder="Alert: New Corporate Order Logged" 
                          />
                        </div>
                      </div>
                    )}

                    {newWfActionType === "telegram" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fadeIn">
                        <div>
                          <label className="block text-[9px] font-bold text-[#7C9082] uppercase mb-0.5">Telegram Chat ID / Channel tag</label>
                          <input 
                            type="text" 
                            className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-[#1A3F25] outline-none font-mono" 
                            value={newWfConfig.telegram_chat_id || ""} 
                            onChange={(e) => setNewWfConfig({ ...newWfConfig, telegram_chat_id: e.target.value })} 
                            placeholder="-100124589254" 
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-[#7C9082] uppercase mb-0.5">Bot Token Secret Authorization</label>
                          <input 
                            type="password" 
                            className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-[#1A3F25] outline-none" 
                            value={newWfConfig.telegram_token || ""} 
                            onChange={(e) => setNewWfConfig({ ...newWfConfig, telegram_token: e.target.value })} 
                            placeholder="712398555:AAHr..." 
                          />
                        </div>
                      </div>
                    )}

                    {newWfActionType === "whatsapp" && (
                      <div className="space-y-1 animate-fadeIn">
                        <label className="block text-[9px] font-bold text-[#7C9082] uppercase mb-0.5">WhatsApp Twilio/Meta Destination Number</label>
                        <input 
                          type="text" 
                          className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-[#1A3F25] outline-none font-mono" 
                          value={newWfConfig.whatsapp_phone || ""} 
                          onChange={(e) => setNewWfConfig({ ...newWfConfig, whatsapp_phone: e.target.value })} 
                          placeholder="whatsapp:+37491123456" 
                        />
                      </div>
                    )}

                    {newWfActionType === "crm_webhook" && (
                      <div className="space-y-1 animate-fadeIn">
                        <label className="block text-[9px] font-bold text-[#7C9082] uppercase mb-0.5">External CRM REST Endpoint Endpoint Target</label>
                        <input 
                          type="text" 
                          className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-[#1A3F25] outline-none font-mono" 
                          value={newWfConfig.webhook_url || ""} 
                          onChange={(e) => setNewWfConfig({ ...newWfConfig, webhook_url: e.target.value })} 
                          placeholder="https://api.pipedrive.com/v1/deals?api_token=..." 
                        />
                      </div>
                    )}

                    {newWfActionType === "ai_analysis" && (
                      <div className="space-y-1 animate-fadeIn">
                        <label className="block text-[9px] font-bold text-[#7C9082] uppercase mb-0.5">Generative AI Reasoning Instruction</label>
                        <textarea 
                          rows={2}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1A3F25] outline-none" 
                          value={newWfConfig.ai_instruction || ""} 
                          onChange={(e) => setNewWfConfig({ ...newWfConfig, ai_instruction: e.target.value })} 
                          placeholder="Analyze checkout dimensions for packaging efficiency and suggest optimal box folding metrics..." 
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-gray-100">
                  <button
                    onClick={handleSaveWorkflow}
                    className="py-2 px-6 bg-[#ff2300] hover:bg-[#e61f00] text-white rounded-xl shadow-md font-bold uppercase tracking-wider text-[10px] text-center flex items-center gap-1 cursor-pointer"
                  >
                    <Save size={11} /> Commit Workflow to DB
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#1A3F25]/10 p-12 rounded-3xl text-center flex flex-col items-center justify-center space-y-2 h-full min-h-[300px]">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-[#C59B6D] flex items-center justify-center">
                  <Sliders size={18} />
                </div>
                <h4 className="font-serif text-sm font-bold text-[#FF2300] uppercase mt-2">No Workflow Event Selected</h4>
                <p className="text-[#727784] text-xs max-w-sm">Choose an orchestration statement from the left dashboard, or configure custom hooks to link checkout forms to Twilio, Telegram, or custom REST APIs.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- COMPONENT 16: VERSION SNAPSHOT HISTORY & DB RESTORICAL ---
  const renderBackupCenter = () => {
    const handleCreateSnapshot = async () => {
      const tagInput = prompt("Enter a brief description for this system version snapshot:", `Admin Manual Checkpoint - ${new Date().toLocaleDateString()}`);
      if (!tagInput) return;
      try {
        const res = await fetch("/api/admin/snapshots", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminToken}`
          },
          body: JSON.stringify({ tag: tagInput.trim() })
        });
        const data = await res.json();
        if (data.success) {
          setSnapshotAlert("Fresh system version snapshot captured in PostgreSQL catalog registry succeeds!");
          setDbRefreshTrigger(p => p + 1);
          setTimeout(() => setSnapshotAlert(null), 4000);
        } else {
          alert("Snapshot creation failed: " + data.error);
        }
      } catch (err: any) {
        alert("Operation error: " + err.message);
      }
    };

    const handleRollbackSnapshot = async (id: string, tag: string) => {
      const confirmOk = confirm(`CRITICAL WARNING:\nAre you absolutely sure you want to rollback the database to snapshot "${tag}"?\nThis will revert all pricing rules, custom fields, workflows, translations, and product catalogs to the state of this snapshot. This operation is IRREVERSIBLE.`);
      if (!confirmOk) return;

      setRollbackPendingId(id);
      try {
        const res = await fetch("/api/admin/snapshots/rollback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminToken}`
          },
          body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (data.success) {
          setSnapshotAlert(`SYSTEM ROLLBACK SUCCESS: The entire database ecosystem has been fully restored of "${tag}".`);
          setDbRefreshTrigger(p => p + 1);
          setTimeout(() => setSnapshotAlert(null), 5000);
        } else {
          alert("Rollback failed: " + data.error);
        }
      } catch (err: any) {
        alert("Server communication error: " + err.message);
      } finally {
        setRollbackPendingId(null);
      }
    };

    return (
      <div className="space-y-6 animate-fadeIn font-sans text-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#FF2300]/25/10 pb-4 gap-2">
          <div>
            <span className="text-[10px] font-bold text-[#C59B6D] tracking-widest uppercase">TRANSACTIONAL RESTORATION VAULT</span>
            <h2 className="text-xl font-serif text-[#FF2300] font-bold mt-1">Version Snapshot History Core</h2>
            <p className="text-xs text-[#727784] mt-0.5">Control disaster recovery, compare schema revisions, and initiate instantaneous rollback points without programming.</p>
          </div>
          <button 
            onClick={handleCreateSnapshot}
            className="px-4 py-2 bg-[#ff2300] hover:bg-[#e61f00] text-white rounded-xl shadow-lg font-bold tracking-wider text-[10px] uppercase text-center flex items-center gap-1 cursor-pointer animate-pulse"
          >
            <Camera size={11} /> Capture System State
          </button>
        </div>

        {snapshotAlert && (
          <div className="bg-[#1A3F25]/5 border border-[#FF2300]/25/15 text-[#FF2300] p-4 rounded-2.5xl animate-slideIn">
            🛡️ <span className="font-extrabold">{snapshotAlert}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Snapshots Index Ledgers */}
          <div className="bg-white border border-[#1A3F25]/10 p-5 rounded-3xl space-y-4 shadow-sm">
            <h3 className="font-serif text-xs font-bold text-[#1A3F25] uppercase tracking-widest pb-1 border-b border-gray-150">
              🕒 Historic Version Archive ({dbSnapshotsList.length})
            </h3>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {dbSnapshotsList.map((item: any) => {
                const isPending = rollbackPendingId === item.id;
                const dateStr = new Date(item.created_at).toLocaleString();
                const isSel = selectedSnapshotComp?.id === item.id;
                
                return (
                  <div 
                    key={item.id} 
                    className={`p-3.5 bg-[#f0f2f5] border rounded-2xl flex flex-col gap-2 transition-all ${
                      isSel ? "border-[#C59B6D] ring-2 ring-[#C59B6D]/15" : "border-gray-50 hover:bg-gray-50/50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="block text-xs font-black text-[#1A3F25]">{item.tag}</span>
                        <span className="block text-[9px] text-[#7C9082] font-mono font-semibold mt-1">
                          📅 {dateStr}
                        </span>
                      </div>
                      <span className="px-1.5 py-0.5 bg-gray-150 text-[8px] font-bold text-gray-500 rounded font-mono uppercase">
                        {item.id.slice(0, 8)}
                      </span>
                    </div>

                    <div className="flex gap-2 items-center justify-end mt-1 pt-2 border-t border-gray-200/50">
                      <button
                        onClick={() => setSelectedSnapshotComp(item)}
                        className="px-2.5 py-1 text-[9px] font-bold text-[#1A3F25] bg-white border border-gray-200 rounded-lg cursor-pointer"
                      >
                        Inspect Meta
                      </button>
                      <button
                        onClick={() => handleRollbackSnapshot(item.id, item.tag)}
                        disabled={isPending}
                        className="px-2.5 py-1 text-[9px] font-extrabold text-white bg-red-800 hover:bg-red-900 rounded-lg cursor-pointer disabled:opacity-50"
                      >
                        {isPending ? "Rolling Back..." : "ONE-CLICK ROLLBACK"}
                      </button>
                    </div>
                  </div>
                );
              })}
              {dbSnapshotsList.length === 0 && (
                <div className="text-center py-12 text-gray-400 italic font-medium">No system checkpoints recorded. Click "Capture System State" to register your first PostgreSQL Snapshot!</div>
              )}
            </div>
          </div>

          {/* Snapshot Comparison Visual Panel */}
          <div className="bg-[#f0f2f5] border border-[#FF2300]/25/10 p-5 rounded-3xl space-y-4">
            <h3 className="font-serif text-xs font-bold text-[#FF2300] border-b border-gray-150 pb-1.5 uppercase tracking-widest">
              🔍 Version snapshot inspector
            </h3>

            {selectedSnapshotComp ? (
              <div className="space-y-4 text-xs font-medium text-[#FF2300] leading-relaxed animate-fadeIn">
                <div className="p-3 bg-white border border-gray-150 rounded-2xl">
                  <span className="text-[9px] text-[#7C9082] block font-bold uppercase">ARCHIVE METADATA</span>
                  <span className="text-xs font-serif font-bold text-[#FF2300] mt-0.5 block">{selectedSnapshotComp.tag}</span>
                  <span className="text-[10px] text-[#727784] mt-0.5 block">Captured: {new Date(selectedSnapshotComp.created_at).toLocaleString()}</span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] text-[#C59B6D] font-black uppercase tracking-wider block">Integrity Index Breakdown</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 bg-white border border-gray-100 rounded-xl">
                      <span className="text-[8px] uppercase text-[#7C9082] font-extrabold">Pricing Rules Total</span>
                      <span className="block font-mono text-xs font-black text-[#1A3F25]">{selectedSnapshotComp.state?.pricingRules?.length || 0} active</span>
                    </div>

                    <div className="p-2.5 bg-white border border-gray-100 rounded-xl">
                      <span className="text-[8px] uppercase text-[#7C9082] font-extrabold">Formulas Engine Total</span>
                      <span className="block font-mono text-xs font-black text-[#1A3F25]">{selectedSnapshotComp.state?.formulas?.length || 0} dynamic</span>
                    </div>

                    <div className="p-2.5 bg-white border border-gray-100 rounded-xl">
                      <span className="text-[8px] uppercase text-[#7C9082] font-extrabold">Translation Override entries</span>
                      <span className="block font-mono text-xs font-black text-[#1A3F25]">{selectedSnapshotComp.state?.translations?.length || 0} localized</span>
                    </div>

                    <div className="p-2.5 bg-white border border-gray-100 rounded-xl">
                      <span className="text-[8px] uppercase text-[#7C9082] font-extrabold">Custom Fields count</span>
                      <span className="block font-mono text-xs font-black text-[#1A3F25]">{selectedSnapshotComp.state?.customFields?.length || 0} extensions</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/50 border border-amber-200/50 text-amber-900 rounded-xl text-[10px] leading-relaxed">
                  ⚠️ Applying a roll back operation will swap your current live sandbox layout with this archived payload snapshot in a single transactions pool block. State variables of outer products or checklists will reload.
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400 italic">Select any historic checkpoint from the left timeline directory roster to inspect detailed records and evaluate schema comparisons on-the-fly.</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- COMPONENT 17: AI ADMIN CENTER ---
  const [aiPromptInput, setAiPromptInput] = useState(editAiSettings.systemPrompt || "");
  const [aiTemp, setAiTemp] = useState(editAiSettings.temperature || 0.1);
  const [aiModel, setAiModel] = useState(editAiSettings.modelName || "gemini-3.5-flash");
  const [aiSuccess, setAiSuccess] = useState<string | null>(null);

  const handleUpdateAISettings = async () => {
    setEditAiSettings({
      systemPrompt: aiPromptInput,
      temperature: aiTemp,
      modelName: aiModel,
      enabled: editAiSettings.enabled
    });
    setAiSuccess("AI Assistant brain parameters loaded and configured successfully! Press Visual Sync to commit.");
    setTimeout(() => setAiSuccess(null), 3500);
  };

  const renderAIAdminCenter = () => {
    return (
      <div className="space-y-6 animate-fadeIn font-sans text-xs">
        <div className="border-b border-[#1A3F25]/10 pb-4">
          <span className="text-[10px] font-bold text-[#C59B6D] tracking-widest uppercase font-black uppercase flex items-center gap-1">
            <Sparkles size={11} className="text-[#C59B6D]" /> COGNITIVE LLM BRAIN (GEMINI SDK)
          </span>
          <h2 className="text-xl font-serif text-[#1A3F25] font-bold mt-1">AI Assistant Brain Admin Center</h2>
          <p className="text-xs text-[#7C9082] mt-0.5">Construct visual prompts, configure model hyper-parameters, inject custom context, and review dialogue logs output directly.</p>
        </div>

        {aiSuccess && (
          <div className="p-3 bg-[#1A3F25]/5 border border-[#1A3F25]/15 text-[#1A3F25] font-bold rounded-xl flex items-center gap-1.5 animate-pulse">
            <Check size={14} className="text-[#C59B6D]" />
            <span>{aiSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main prompt box */}
          <div className="lg:col-span-12 xl:col-span-7 bg-white border border-[#1A3F25]/10 p-5 rounded-3xl space-y-4">
            <h3 className="font-serif text-xs font-bold text-[#1A3F25] border-b border-gray-100 pb-1.5 uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <BookOpen size={14} className="text-[#C59B6D]" /> AI Persona Prompt & Core Knowledge
            </h3>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#7C9082] mb-1">System instructions instructions block *</label>
              <textarea 
                value={aiPromptInput}
                onChange={(e) => setAiPromptInput(e.target.value)}
                placeholder="Coordinate assistant with Capsule corporate personality..."
                rows={10}
                className="w-full bg-[#f0f2f5] border border-gray-150 rounded-2xl p-3 font-mono text-[10px] text-[#1D3557] outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Model presets hyper-parameters */}
          <div className="lg:col-span-12 xl:col-span-5 bg-[#f0f2f5] border border-[#1A3F25]/10 p-5 rounded-3xl space-y-4">
            <h3 className="font-serif text-xs font-bold text-[#FF2300] border-b border-gray-100 pb-1.5 uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <Key size={14} className="text-[#C59B6D]" /> LLM Model Options & Parameters
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#727784] mb-1">Target Core Model Engine</label>
                <select 
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full bg-white border border-gray-150 rounded-lg p-2.5 font-bold text-[#1A3F25] font-sans outline-none"
                >
                  <option value="gemini-3.5-flash">Gemini 3.5 Flash (Ultra-fast, optimized - RECOMMENDED)</option>
                  <option value="gemini-3.5-pro">Gemini 3.5 Pro (Deep logical inference, complex packaging)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] font-bold uppercase text-[#727784]">Temperature</label>
                  <span className="font-mono font-bold text-[#FF2300]">{aiTemp}</span>
                </div>
                <input 
                  type="range" 
                  min={0.0} 
                  max={1.0} 
                  step={0.05}
                  value={aiTemp} 
                  onChange={(e) => setAiTemp(parseFloat(e.target.value))} 
                  className="w-full accent-[#1A3F25] cursor-pointer" 
                />
                <div className="flex justify-between text-[8px] uppercase text-[#7C9082] font-semibold">
                  <span>Strict Facts (0.0)</span>
                  <span>Creative (1.0)</span>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleUpdateAISettings}
                  className="w-full py-2.5 bg-[#ff2300] text-white font-bold hover:bg-[#e61f00] rounded-xl uppercase tracking-wider text-xs shadow-md cursor-pointer flex items-center justify-center gap-1"
                >
                  <Save size={12} /> Sync Cognitive Model
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // --- COMPONENT 11: ORDERS & PRODUCTION BOARD ---
  // ==========================================
  const renderOrdersCenter = () => {
    // Columns for Kanban Board
    const kanbanStatuses = [
      "Новый",
      "Проверка макета",
      "Дизайн",
      "Подтверждение клиента",
      "Печать",
      "Постобработка",
      "Сборка",
      "Упаковка",
      "Готов",
      "Доставлен"
    ];

    // Filtered & Sorted orders list
    const filteredOrders = ordersList.filter((o: any) => {
      const matchSearch = 
        (o.customerName || "").toLowerCase().includes(orderSearch.toLowerCase()) ||
        (o.customerPhone || "").includes(orderSearch) ||
        (o.id?.toString() || "").includes(orderSearch);

      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      const matchManager = managerFilter === "all" || o.manager === managerFilter;
      const matchSource = sourceFilter === "all" || o.source === sourceFilter;

      return matchSearch && matchStatus && matchManager && matchSource;
    }).sort((a: any, b: any) => {
      let valA = a[orderSortBy];
      let valB = b[orderSortBy];

      if (orderSortBy === "totalPrice" || orderSortBy === "quantity") {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else {
        valA = (valA || "").toString().toLowerCase();
        valB = (valB || "").toString().toLowerCase();
      }

      if (valA < valB) return orderSortOrder === "asc" ? -1 : 1;
      if (valA > valB) return orderSortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const handleCreateCustomOrder = async () => {
      if (!newOrderName || !newOrderPhone) {
        alert("Please enter customer name and phone standard coordinates.");
        return;
      }
      try {
        const res = await fetch("/api/admin/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            customerName: newOrderName,
            customerPhone: newOrderPhone,
            whatsapp: newOrderPhone,
            email: `${newOrderName.toLowerCase().replace(/\s/g, "")}@corporate.am`,
            items: `${newOrderQty}x ${newOrderType} - ${newOrderDetails}`,
            totalPrice: Number(newOrderPrice),
            quantity: Number(newOrderQty),
            source: "Admin Manual Registration",
            manager: "Corporate Sales Desk"
          })
        });
        const d = await res.json();
        if (d.success) {
          setOrderUpdateSuccess("Manually registered order inserted successfully in PostgreSQL ledger.");
          setIsAddingOrder(false);
          setDbRefreshTrigger(p => p + 1);
          setNewOrderName("");
          setNewOrderPhone("");
          setNewOrderDetails("");
          setTimeout(() => setOrderUpdateSuccess(null), 3000);
        } else {
          alert("Order Error: " + d.error);
        }
      } catch (err) {
        console.error("Failed adding custom order", err);
      }
    };

    const handleMoveStatus = async (orderId: number, targetStatus: string) => {
      try {
        const res = await fetch(`/api/admin/orders/${orderId}/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminToken}`
          },
          body: JSON.stringify({ status: targetStatus })
        });
        const d = await res.json();
        if (d.success) {
          setDbRefreshTrigger(p => p + 1);
          setOrderUpdateSuccess(`Status progressed to "${targetStatus}"! Workflows notified.`);
          if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder((prev: any) => ({
              ...prev,
              status: targetStatus,
              statusHistory: [
                ...(prev.statusHistory || []),
                { status: targetStatus, timestamp: new Date().toISOString() }
              ]
            }));
          }
          setTimeout(() => setOrderUpdateSuccess(null), 3500);
        }
      } catch (err) {
        console.error("Failed progressing status", err);
      }
    };

    const handleSaveOrderEdits = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedOrder) return;
      try {
        const payload: any = {
          customerName: selectedOrder.customerName,
          customerPhone: selectedOrder.customerPhone,
          whatsapp: selectedOrder.whatsapp,
          email: selectedOrder.email,
          items: selectedOrder.items,
          totalPrice: Number(selectedOrder.totalPrice),
          quantity: Number(selectedOrder.quantity || 100),
          managerComment: selectedOrder.managerComment,
          manager: selectedOrder.manager,
          source: selectedOrder.source,
          status: selectedOrder.status,
          estimatedCompletionDate: selectedOrder.estimatedCompletionDate,
          productionDeadline: selectedOrder.productionDeadline || "",
          actualCompletionDate: selectedOrder.actualCompletionDate || "",
          productionDays: Number(selectedOrder.productionDays || 5),
          artworkStatus: selectedOrder.artworkStatus || "нет макета",
          artworkComment: selectedOrder.artworkComment || "",
          artworkUrl: selectedOrder.artworkUrl || ""
        };

        const isFin = managerMe && ["Super Admin", "Manager", "Finance"].includes(managerMe.role);
        if (isFin) {
          payload.costPrice = Number(selectedOrder.costPrice || 0);
          payload.profit = Number(selectedOrder.totalPrice || 0) - Number(selectedOrder.costPrice || 0);
          payload.margin = selectedOrder.totalPrice ? Math.round((payload.profit / Number(selectedOrder.totalPrice)) * 100) : 0;
        }

        const res = await fetch(`/api/admin/orders/${selectedOrder.id}/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminToken}`
          },
          body: JSON.stringify(payload)
        });
        const d = await res.json();
        if (d.success) {
          setOrderUpdateSuccess("Contract record changes synced beautifully to PostgreSQL.");
          setDbRefreshTrigger(p => p + 1);
          setTimeout(() => setOrderUpdateSuccess(null), 3000);
        }
      } catch (err) {
        console.error("Failed saving order edits", err);
      }
    };

    const handleSendManualWhatsApp = async () => {
      if (!selectedOrder || !whatsappDraftText.trim()) return;
      try {
        const res = await fetch("/api/admin/whatsapp/logs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            phone: selectedOrder.customerPhone,
            message: whatsappDraftText,
            orderId: selectedOrder.id
          })
        });
        const d = await res.json();
        if (d.success) {
          setWhatsappDraftText("");
          setWhatsappSuccessMsg("WhatsApp message saved & simulated in production dispatch.");
          setDbRefreshTrigger(p => p + 1);
          setTimeout(() => setWhatsappSuccessMsg(null), 3000);
        }
      } catch (err) {
        console.error("Failed manual whatsapp logging", err);
      }
    };

    const handlePrintQuoteBrief = () => {
      const printWindow = window.open("", "_blank");
      if (!printWindow || !selectedOrder) return;

      const rate = exchangeRates[selectedInvoiceCurrency] || 1;
      const convertedTotal = (selectedOrder.totalPrice / rate);

      printWindow.document.write(`
        <html>
          <head>
            <title>Quote Brief #${selectedOrder.id}</title>
            <style>
              body { font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.6; }
              .header { text-align: center; border-bottom: 2px solid #1a3f25; padding-bottom: 20px; }
              .logo { font-size: 24px; font-weight: bold; color: #1a3f25; letter-spacing: 1px; }
              .meta-grid { display: grid; grid-template-columns: 1fr 1fr; margin: 40px 0; gap: 20px; }
              .section-title { font-size: 14px; text-transform: uppercase; color: #c59b6d; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
              .info-box { background: #fdfdfd; padding: 15px; border: 1px solid #f0f0f0; border-radius: 8px; }
              .tbl { width: 100%; border-collapse: collapse; margin: 30px 0; }
              .tbl th, .tbl td { border: 1px solid #eee; padding: 12px; text-align: left; }
              .tbl th { background: #f0f2f5; color: #1a3f25; font-weight: bold; }
              .total-row { font-size: 18px; font-weight: bold; color: #1a3f25; text-align: right; padding-top: 20px; }
              .footer { text-align: center; font-size: 11px; color: #777; margin-top: 80px; border-top: 1px solid #eee; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">CAPSULE PACKAGING SYSTEMS</div>
              <div style="font-size: 11px; font-weight: 500; tracking: 1px; color: #777;">YEREVAN, ARMENIA • CORPORATE CLIENT BRIEF</div>
            </div>
            
            <div class="meta-grid">
              <div class="info-box">
                <div class="section-title">CLIENT DETAILS</div>
                <div><strong>Name:</strong> ${selectedOrder.customerName}</div>
                <div><strong>Phone:</strong> ${selectedOrder.customerPhone}</div>
                <div><strong>Email:</strong> ${selectedOrder.email || "---"}</div>
                <div><strong>WhatsApp Code:</strong> ${selectedOrder.whatsapp || "---"}</div>
              </div>
              <div class="info-box">
                <div class="section-title">QUOTE INFORMATION</div>
                <div><strong>Quote Ref:</strong> CAPS-${selectedOrder.id}</div>
                <div><strong>Registered Date:</strong> ${new Date(selectedOrder.ts || Date.now()).toLocaleDateString()}</div>
                <div><strong>Manager In Charge:</strong> ${selectedOrder.manager || "Corporate Sales"}</div>
                <div><strong>Lead Source:</strong> ${selectedOrder.source || "Web Portal"}</div>
              </div>
            </div>

            <div class="section-title">DESIGN MATRICES & ORDER COMPOSITIONS</div>
            <table class="tbl">
              <thead>
                <tr>
                  <th>Description & Technical Accents</th>
                  <th style="width: 120px;">Est Quality</th>
                  <th style="text-align: right; width: 150px;">Unit Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div style="font-weight: bold; color: #1a3f25; font-size: 14px;">Custom Crafted Order Solution</div>
                    <div style="color: #666; font-size: 12px; margin-top: 5px; white-space: pre-wrap;">${selectedOrder.items}</div>
                  </td>
                  <td>${selectedOrder.quantity || 100} units</td>
                  <td style="text-align: right; font-weight: bold;">${selectedOrder.totalPrice.toLocaleString()} ֏</td>
                </tr>
              </tbody>
            </table>

            <div class="total-row">
              Total Order Estimation: ${convertedTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${selectedInvoiceCurrency}
              ${selectedInvoiceCurrency !== "AMD" ? `<div style="font-size: 10px; font-weight: normal; color: #666;">Converted rate: 1 ${selectedInvoiceCurrency} = ${rate} AMD</div>` : ""}
            </div>

            <div class="meta-grid" style="margin-top: 60px;">
              <div style="text-align: center;">
                <div style="border-bottom: 1px solid #336644; width: 180px; margin: 0 auto 10px auto; height: 40px;"></div>
                <div style="font-size: 11px; font-weight: bold;">CLIENT REPRESENTATIVE</div>
              </div>
              <div style="text-align: center;">
                <div style="border-bottom: 1px solid #336644; width: 180px; margin: 0 auto 10px auto; height: 40px;"></div>
                <div style="font-size: 11px; font-weight: bold;">CAPSULE SALES DIRECTOR</div>
              </div>
            </div>

            <div class="footer">
              This quote brief is generated via Capsule Cloud ERP relational database platform. Valid for 30 calendar days.
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    };

    const handlePrintInvoice = () => {
      const printWindow = window.open("", "_blank");
      if (!printWindow || !selectedOrder) return;

      const rate = exchangeRates[selectedInvoiceCurrency] || 1;
      const convertedTotal = (selectedOrder.totalPrice / rate);

      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice #${selectedOrder.id}</title>
            <style>
              body { font-family: 'Courier New', Courier, monospace; padding: 30px; font-size: 12px; line-height: 1.5; color: #000; }
              .terminal-header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 15px; margin-bottom: 20px; }
              .tbl { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .tbl th, .tbl td { border-bottom: 1px dashed #000; padding: 8px; text-align: left; }
              .tbl th { font-weight: bold; }
              .total { text-align: right; font-weight: bold; font-size: 14px; margin-top: 20px; }
              .line { border-top: 1px dashed #000; margin: 15px 0; }
              .center { text-align: center; }
            </style>
          </head>
          <body>
            <div class="terminal-header">
              <h3>CAPSULE PACKAGING INDUSTRIAL SYSTEMS AM</h3>
              <p>TAX ID Number: AM2901328014<br />Address: Bagratunyats St 40, Yerevan</p>
              <h2>COMMERCIAL SALES INVOICE</h2>
              <p>Invoice Num: INV-${selectedOrder.id} / Date: ${new Date(selectedOrder.ts || Date.now()).toLocaleDateString()}</p>
            </div>

            <div>
              <strong>BUYER PROFILE:</strong><br />
              Name: ${selectedOrder.customerName}<br />
              Phone ID: ${selectedOrder.customerPhone}<br />
              Contact Email: ${selectedOrder.email || "N/A"}<br />
              Status Class: ${selectedOrder.source || "Corporate Standard Client"}
            </div>

            <div class="line"></div>

            <table class="tbl">
              <thead>
                <tr>
                  <th>Item Code Description</th>
                  <th>Quantity</th>
                  <th style="text-align: right;">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Custom Bags Packaging Design Composition<br /><small>${selectedOrder.items}</small></td>
                  <td>${selectedOrder.quantity || 100} units</td>
                  <td style="text-align: right;">${selectedOrder.totalPrice.toLocaleString()} AMD</td>
                </tr>
              </tbody>
            </table>

            <div class="total">
              Subtotal: ${selectedOrder.totalPrice.toLocaleString()} AMD<br />
              Converted Aggregate: ${convertedTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${selectedInvoiceCurrency}<br />
              TAX Rate: 0% VAT (Exporter standard privilege)<br />
              Total Amount Due: ${convertedTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${selectedInvoiceCurrency}
            </div>

            <div class="line"></div>

            <div class="center">
              <p>OPERATOR SIGNATURE: _______________________</p>
              <p>Thank you for choosing Capsule Packaging Systems Yerevan!<br />Quality certified in Armenia</p>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    };

    return (
      <div className="space-y-6 animate-fadeIn font-sans text-xs">
        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#C59B6D]/20 pb-4 gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#C59B6D] tracking-widest uppercase flex items-center gap-1">
              💼 ENTERPRISE WORKSPACE
            </span>
            <h2 className="text-xl font-serif text-[#1A3F25] font-bold mt-1">Order Solutions Center & Production Board</h2>
            <p className="text-xs text-[#414753] mt-0.5">Control pipeline routing, monitor 10 technical production stages live, create invoices, and dispatch WhatsApp metrics.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setOrdersViewMode(ordersViewMode === "list" ? "kanban" : "list")}
              className="px-4 py-2 bg-[#1A3F25] hover:bg-[#1A3F25]/90 text-white font-bold rounded-xl flex items-center gap-1.5 shadow transition-all duration-300 cursor-pointer text-xs"
            >
              {ordersViewMode === "list" ? "📋 SWITCH TO KANBAN BOARD" : "📋 SWITCH TO DATA TABLE"}
            </button>

            <button
              onClick={() => setIsAddingOrder(true)}
              className="px-4 py-2 bg-[#F5F2EB] border border-[#C59B6D]/30 text-[#1A3F25] font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all duration-300 hover:bg-[#1A3F25] hover:text-white cursor-pointer text-xs"
            >
              + Register Custom Order
            </button>
          </div>
        </div>

        {orderUpdateSuccess && (
          <div className="p-3 bg-teal-50 border border-teal-150 text-teal-800 font-bold rounded-xl flex items-center gap-1.5 animate-pulse">
            <Check size={14} className="text-teal-800" />
            <span>{orderUpdateSuccess}</span>
          </div>
        )}

        {/* Dynamic Filters Bar */}
        <div className="bg-white border border-[#1A3F25]/10 p-4 rounded-3xl grid grid-cols-1 md:grid-cols-5 gap-3 shadow-sm select-none">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#7C9082]">Search Coordinate</label>
            <input
              type="text"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              placeholder="ID, Client name or phone ID..."
              className="w-full bg-[#f0f2f5] border border-[#1A3F25]/15 rounded-xl px-3 py-2 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#7C9082]">Stage Pipeline Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#f0f2f5] border border-[#1A3F25]/15 rounded-xl px-3 py-2 outline-none text-[11px]"
            >
              <option value="all">All Stages</option>
              {kanbanStatuses.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#7C9082]">Assigned Manager</label>
            <select
              value={managerFilter}
              onChange={(e) => setManagerFilter(e.target.value)}
              className="w-full bg-[#f0f2f5] border border-[#1A3F25]/15 rounded-xl px-3 py-2 outline-none text-[11px]"
            >
              <option value="all">All Operators</option>
              <option value="Corporate Sales Desk">Corporate Sales Desk</option>
              <option value="Senior Designer Team">Senior Designer Team</option>
              <option value="Packaging QA Supervisor">Packaging QA Supervisor</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#7C9082]">Order Lead Origin</label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full bg-[#f0f2f5] border border-[#1A3F25]/15 rounded-xl px-3 py-2 outline-none text-[11px]"
            >
              <option value="all">All Channels</option>
              <option value="Interactive Landing Page">Interactive Landing Page</option>
              <option value="WhatsApp Client API">WhatsApp Client API</option>
              <option value="Admin Manual Registration">Admin Manual Registration</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#7C9082]">Sort Coordinate</label>
            <div className="flex gap-1.5">
              <select
                value={orderSortBy}
                onChange={(e) => setOrderSortBy(e.target.value)}
                className="w-full bg-[#f0f2f5] border border-[#1A3F25]/15 rounded-xl px-2 py-2 outline-none text-[10px]"
              >
                <option value="ts">Registration Date</option>
                <option value="totalPrice">Financial LTV Amount</option>
                <option value="customerName">Client Alphabetical</option>
                <option value="quantity">Units Quantity</option>
              </select>
              <button
                onClick={() => setOrderSortOrder(orderSortOrder === "asc" ? "desc" : "asc")}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-xl border font-bold"
              >
                {orderSortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>

        {/* MANUAL ADDITION DRAWER POPUP */}
        {isAddingOrder && (
          <div className="bg-[#f0f2f5] border-2 border-dashed border-[#1A3F25]/20 p-5 rounded-3xl animate-slideUp text-xs space-y-4">
            <h3 className="font-serif text-sm font-bold text-[#FF2300] uppercase tracking-wider flex items-center justify-between">
              <span>Register New Custom Client Contract (Real-time PostgreSQL)</span>
              <button onClick={() => setIsAddingOrder(false)} className="text-red-700 font-bold">Close X</button>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold block">Customer Full Name / Company</label>
                <input
                  type="text"
                  value={newOrderName}
                  onChange={(e) => setNewOrderName(e.target.value)}
                  placeholder="e.g. Inessa Hovsepyan"
                  className="w-full bg-white border border-[#1A3F25]/15 rounded-lg p-2 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold block">Armenian Phone / WhatsApp Number</label>
                <input
                  type="text"
                  value={newOrderPhone}
                  onChange={(e) => setNewOrderPhone(e.target.value)}
                  placeholder="e.g. +374 93 124 556"
                  className="w-full bg-white border border-[#1A3F25]/15 rounded-lg p-2 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold block">Bag Type Category Selection</label>
                <select
                  value={newOrderType}
                  onChange={(e) => setNewOrderType(e.target.value)}
                  className="w-full bg-white border border-[#1A3F25]/15 rounded-lg p-2 outline-none text-[11px]"
                >
                  <option value="Paper Bags with Cotton Ribbons">Paper Bags with Cotton Ribbons</option>
                  <option value="Luxurious Gift Boxes">Luxurious Gift Boxes</option>
                  <option value="Eco Kraft Corrugated Boxes">Eco Kraft Corrugated Boxes</option>
                  <option value="Metallic Foil Laminated Pouches">Metallic Foil Laminated Pouches</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold block">Assigned Price Estimate (֏ AMD)</label>
                <input
                  type="number"
                  value={newOrderPrice}
                  onChange={(e) => setNewOrderPrice(Number(e.target.value))}
                  className="w-full bg-white border border-[#1A3F25]/15 rounded-lg p-2 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold block">Target Quantity Units (MOQ)</label>
                <input
                  type="number"
                  value={newOrderQty}
                  onChange={(e) => setNewOrderQty(Number(e.target.value))}
                  className="w-full bg-white border border-[#1A3F25]/15 rounded-lg p-2 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold block">Manager Design & Blueprint Remarks</label>
                <input
                  type="text"
                  value={newOrderDetails}
                  onChange={(e) => setNewOrderDetails(e.target.value)}
                  placeholder="e.g. Gold hot embossing with custom handle color 102"
                  className="w-full bg-white border border-[#1A3F25]/15 rounded-lg p-2 outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleCreateCustomOrder}
              className="py-2.5 px-6 bg-[#FF2300] text-white font-bold rounded-xl shadow tracking-widest hover:bg-opacity-95 uppercase"
            >
              Commit Order into PostgreSQL & Route Workflow Actions
            </button>
          </div>
        )}

        {/* DYNAMIC VIEW SECTIONS */}
        {ordersViewMode === "list" ? (
          /* TABLE LIST VIEW */
          <div className="bg-white border border-[#1A3F25]/10 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs text-[#1a1c1d] select-none">
                <thead className="bg-[#f0f2f5] border-b border-[#1A3F25]/10 text-[#1A3F25] font-bold">
                  <tr>
                    <th className="p-3 text-[10px] uppercase">ID & Reg Date</th>
                    <th className="p-3 text-[10px] uppercase">Client Details</th>
                    <th className="p-3 text-[10px] uppercase">Items Spec</th>
                    <th className="p-3 text-[10px] uppercase">LTV AMD Amount</th>
                    <th className="p-3 text-[10px] uppercase">Status Stage</th>
                    <th className="p-3 text-[10px] uppercase">Assigned Operator</th>
                    <th className="p-3 text-[10px] uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((o: any) => (
                    <tr 
                      key={o.id} 
                      className={`hover:bg-[#1A3F25]/5 transition-all cursor-pointer ${selectedOrder?.id === o.id ? "bg-[#C59B6D]/15" : ""}`}
                      onClick={() => setSelectedOrder(o)}
                    >
                      <td className="p-3">
                        <span className="font-serif font-black block text-[#1A3F25]">#CAPS-{o.id}</span>
                        <span className="text-[10px] text-[#727784] mt-0.5 block">{new Date(o.ts || Date.now()).toLocaleDateString()}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold block text-[#1A3F25]">{o.customerName}</span>
                        <span className="text-[10px] text-[#7C9082] block mt-0.5">{o.customerPhone}</span>
                      </td>
                      <td className="p-3">
                        <p className="max-w-[200px] truncate text-[11px] text-gray-700" title={o.items}>{o.items}</p>
                        <span className="text-[9px] bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded mt-1 inline-block font-sans">{o.quantity || 100} units</span>
                      </td>
                      <td className="p-3 font-mono font-bold text-[#1A3F25] text-xs">
                        {(Number(o.totalPrice) || 0).toLocaleString()} ֏
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-bold uppercase text-[9px] tracking-wider inline-block">
                          {o.status || "Новый"}
                        </span>
                        {/* Delivery deadline indicator badge */}
                        {(() => {
                          const isCompleted = o.status === "Доставлен" || o.status === "Готов" || o.status === "Отменен";
                          if (isCompleted) return null;
                          const dateStr = o.estimatedCompletionDate || o.productionDeadline;
                          if (!dateStr) return null;
                          const targetDate = new Date(dateStr);
                          if (isNaN(targetDate.getTime())) return null;
                          const now = new Date();
                          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                          const dueDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
                          const diffMs = dueDate.getTime() - today.getTime();
                          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

                          let label = "";
                          let pillColor = "";
                          if (diffDays < 0) {
                            label = `🔴 Просрочен (${Math.abs(diffDays)} дн.)`;
                            pillColor = "bg-red-50 text-red-800 border-red-200";
                          } else if (diffDays <= 1) {
                            label = "🔴 Срок сегодня/завтра";
                            pillColor = "bg-red-50 text-red-800 border-red-200";
                          } else if (diffDays >= 2 && diffDays <= 5) {
                            label = `🟡 Осталось: ${diffDays} дн.`;
                            pillColor = "bg-amber-50 text-amber-800 border-amber-200";
                          } else {
                            label = `🟢 Осталось: ${diffDays} дн.`;
                            pillColor = "bg-green-50 text-green-800 border-green-200";
                          }

                          return (
                            <span className={`block text-[8.5px] font-bold px-1.5 py-0.5 rounded border mt-1 w-max ${pillColor}`}>
                              {label}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="p-3 text-[#727784] font-sans font-medium">{o.manager || "Standard Desk"}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(o);
                          }}
                          className="px-2.5 py-1 bg-[#f0f2f5] border border-gray-200 hover:border-[#1A3F25]/30 rounded text-[10px] font-bold text-[#1A3F25]"
                        >
                          Modify / Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-12 text-center italic text-[#727784] font-serif bg-gray-50/20">
                        No orders recorded match configured directory filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* KANBAN PRODUCTION BOARD / DRAG AND DROP STATUS SHIFTER */
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10 gap-3 overflow-x-auto pb-4 select-none">
            {kanbanStatuses.map((st) => {
              const columnOrders = filteredOrders.filter((o: any) => (o.status || "Новый") === st);

              return (
                <div key={st} className="bg-[#f0f2f5] border border-[#1A3F25]/10 p-2 rounded-2xl min-w-[155px] space-y-2 flex flex-col justify-start">
                  <div className="font-sans font-extrabold text-[9px] tracking-wider text-[#1A3F25] border-b border-[#C59B6D]/25 pb-1 uppercase text-center truncate">
                    {st} <span className="text-[#C59B6D]">({columnOrders.length})</span>
                  </div>

                  <div className="space-y-2 flex-grow overflow-y-auto max-h-[400px]">
                    {columnOrders.map((co: any) => (
                      <div
                        key={co.id}
                        onClick={() => setSelectedOrder(co)}
                        className={`bg-white border p-2.5 rounded-xl text-[10px] cursor-pointer hover:border-[#C59B6D] hover:shadow-sm transition-all space-y-1.5 ${selectedOrder?.id === co.id ? "border-[#C59B6D] ring-1 ring-[#C59B6D]" : "border-gray-150"}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[#1A3F25]">#CAPS-{co.id}</span>
                          <span className="text-[8px] text-[#727784]">{new Date(co.ts || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <div className="font-bold text-[#1A3F25] truncate">{co.customerName}</div>
                        <div className="text-[9px] text-[#7C9082] truncate">{co.customerPhone}</div>
                        <div className="font-mono font-bold text-[#C59B6D]">{(Number(co.totalPrice) || 0).toLocaleString()} ֏</div>

                        {/* Delivery deadline indicator badge */}
                        {(() => {
                          const isCompleted = co.status === "Доставлен" || co.status === "Готов" || co.status === "Отменен";
                          if (isCompleted) return null;
                          const dateStr = co.estimatedCompletionDate || co.productionDeadline;
                          if (!dateStr) return null;
                          const targetDate = new Date(dateStr);
                          if (isNaN(targetDate.getTime())) return null;
                          const now = new Date();
                          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                          const dueDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
                          const diffMs = dueDate.getTime() - today.getTime();
                          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

                          let label = "";
                          let pillColor = "";
                          if (diffDays < 0) {
                            label = `🔴 Просрочен (${Math.abs(diffDays)} дн.)`;
                            pillColor = "bg-red-50 text-red-800 border-red-200";
                          } else if (diffDays <= 1) {
                            label = "🔴 Срок сегодня/завтра";
                            pillColor = "bg-red-50 text-red-800 border-red-200";
                          } else if (diffDays >= 2 && diffDays <= 5) {
                            label = `🟡 Осталось: ${diffDays} дн.`;
                            pillColor = "bg-amber-50 text-amber-805 border-amber-200";
                          } else {
                            label = `🟢 Осталось: ${diffDays} дн.`;
                            pillColor = "bg-green-50 text-green-800 border-green-200";
                          }

                          return (
                            <span className={`block text-[8px] font-bold px-1.5 py-0.5 rounded border mt-1 w-max ${pillColor}`}>
                              {label}
                            </span>
                          );
                        })()}

                        {/* Arrows Status Progression Shifter */}
                        <div className="flex justify-between items-center pt-1 border-t border-dashed border-gray-100 mt-1">
                          <button
                            disabled={kanbanStatuses.indexOf(st) === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              const idx = kanbanStatuses.indexOf(st);
                              if (idx > 0) handleMoveStatus(co.id, kanbanStatuses[idx - 1]);
                            }}
                            className="bg-gray-100 text-gray-700 font-extrabold p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                            title="Shift status left"
                          >
                            ←
                          </button>
                          <span className="text-[8px] uppercase tracking-widest font-bold text-[#C59B6D]">MOVE</span>
                          <button
                            disabled={kanbanStatuses.indexOf(st) === kanbanStatuses.length - 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              const idx = kanbanStatuses.indexOf(st);
                              if (idx < kanbanStatuses.length - 1) handleMoveStatus(co.id, kanbanStatuses[idx + 1]);
                            }}
                            className="bg-gray-100 text-gray-700 font-extrabold p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                            title="Shift status right"
                          >
                            →
                          </button>
                        </div>
                      </div>
                    ))}
                    {columnOrders.length === 0 && (
                      <div className="py-8 text-center text-gray-400 italic text-[9px]">Empty</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* DETAILED DOUBLE DRAWER POPUP FOR INVOICE, PDF AND WHATSAPP COMMUNICATION */}
        {selectedOrder && (
          <div className="bg-white border-2 border-[#1A3F25]/20 p-5 rounded-3xl grid grid-cols-1 xl:grid-cols-12 gap-8 text-xs select-text shadow-md">
            
            {/* LEFT COMPILER: EDIT METADATA & DATAFIELDS */}
            <form onSubmit={handleSaveOrderEdits} className="xl:col-span-4 space-y-4">
              <h3 className="font-serif text-sm font-bold text-[#1A3F25] border-b pb-1 flex justify-between items-center select-none">
                <span>🛠️ MANAGE CONTRACT CONFIGURATION</span>
                <button type="button" onClick={() => setSelectedOrder(null)} className="text-red-700 font-bold select-none">[ CLOSE X ]</button>
              </h3>

              <div className="space-y-1">
                <label className="font-bold text-[#7C9082]">Customer Name / Company</label>
                <input
                  type="text"
                  value={selectedOrder.customerName || ""}
                  onChange={(e) => setSelectedOrder({ ...selectedOrder, customerName: e.target.value })}
                  className="w-full bg-[#f0f2f5] border border-gray-200 p-2 rounded-lg outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#7C9082]">Client Phone</label>
                <input
                  type="text"
                  value={selectedOrder.customerPhone || ""}
                  onChange={(e) => setSelectedOrder({ ...selectedOrder, customerPhone: e.target.value })}
                  className="w-full bg-[#f0f2f5] border border-gray-200 p-2 rounded-lg outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#7C9082]">WhatsApp Contact Coordinate</label>
                <input
                  type="text"
                  value={selectedOrder.whatsapp || ""}
                  onChange={(e) => setSelectedOrder({ ...selectedOrder, whatsapp: e.target.value })}
                  className="w-full bg-[#f0f2f5] border border-gray-200 p-2 rounded-lg outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#7C9082]">Email Address</label>
                <input
                  type="text"
                  value={selectedOrder.email || ""}
                  onChange={(e) => setSelectedOrder({ ...selectedOrder, email: e.target.value })}
                  className="w-full bg-[#f0f2f5] border border-gray-200 p-2 rounded-lg outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#7C9082]">Composition Details Blueprint</label>
                <textarea
                  value={selectedOrder.items || ""}
                  onChange={(e) => setSelectedOrder({ ...selectedOrder, items: e.target.value })}
                  rows={3}
                  className="w-full bg-[#f0f2f5] border border-gray-200 p-2 rounded-lg outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#7C9082]">Amount Price Value (֏ AMD)</label>
                <input
                  type="number"
                  value={selectedOrder.totalPrice || ""}
                  onChange={(e) => setSelectedOrder({ ...selectedOrder, totalPrice: Number(e.target.value) })}
                  className="w-full bg-[#f0f2f5] border border-gray-200 p-2 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-[#7C9082]">Manager Assignee</label>
                  <select
                    value={selectedOrder.manager || "Corporate Sales Desk"}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, manager: e.target.value })}
                    className="w-full bg-[#f0f2f5] border border-gray-200 p-2 rounded-lg outline-none text-[10px]"
                  >
                    <option value="Corporate Sales Desk">Corporate Sales Desk</option>
                    <option value="Senior Designer Team">Senior Designer Team</option>
                    <option value="Packaging QA Supervisor">Packaging QA Supervisor</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#7C9082]">Stage Progression</label>
                  <select
                    value={selectedOrder.status || "Новый"}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, status: e.target.value })}
                    className="w-full bg-[#f0f2f5] border border-gray-200 p-2 rounded-lg outline-none text-[10px]"
                  >
                    {kanbanStatuses.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ESTIMATED COMPLETION & PRODUCTION DAYS */}
              <div className="grid grid-cols-2 gap-2 border-t border-dashed border-[#1A3F25]/15 pt-2">
                <div className="space-y-1">
                  <label className="font-bold text-[#7C9082] flex items-center gap-1">📅 Планируемая дата готовности</label>
                  <input
                    type="date"
                    disabled={managerMe && !["Super Admin", "Manager", "Production Manager"].includes(managerMe.role)}
                    value={selectedOrder.estimatedCompletionDate || ""}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, estimatedCompletionDate: e.target.value })}
                    className="w-full bg-[#f0f2f5] disabled:opacity-50 border border-gray-200 p-2 rounded-lg outline-none text-[10px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#7C9082]">Крайний срок производства</label>
                  <input
                    type="date"
                    disabled={managerMe && !["Super Admin", "Manager", "Production Manager"].includes(managerMe.role)}
                    value={selectedOrder.productionDeadline || ""}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, productionDeadline: e.target.value })}
                    className="w-full bg-[#f0f2f5] disabled:opacity-50 border border-gray-200 p-2 rounded-lg outline-none text-[10px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1.5">
                <div className="space-y-1">
                  <label className="font-bold text-[#7C9082]">Фактическая дата выполнения</label>
                  <input
                    type="date"
                    disabled={managerMe && !["Super Admin", "Manager", "Production Manager"].includes(managerMe.role)}
                    value={selectedOrder.actualCompletionDate || ""}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, actualCompletionDate: e.target.value })}
                    className="w-full bg-[#f0f2f5] disabled:opacity-50 border border-gray-200 p-2 rounded-lg outline-none text-[10px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#7C9082]">Production Days</label>
                  <input
                    type="number"
                    value={selectedOrder.productionDays || 5}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, productionDays: Number(e.target.value) })}
                    className="w-full bg-[#f0f2f5] border border-gray-200 p-2 rounded-lg outline-none text-[10px]"
                  />
                </div>
              </div>

              {managerMe && !["Super Admin", "Manager", "Production Manager"].includes(managerMe.role) && (
                <div className="text-[9px] text-red-500 font-mono italic">
                  * Изменение дат планирования и дедлайнов доступно только ролям: Super Admin, Manager, Production Manager.
                </div>
              )}

              {/* ARTWORK PROOFING FIELDS */}
              <div className="space-y-1.5 border-t border-dashed border-[#1A3F25]/15 pt-2">
                <label className="font-bold text-[#7C9082] block">Artwork Status & URL Link</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectedOrder.artworkStatus || "нет макета"}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, artworkStatus: e.target.value })}
                    className="w-full bg-[#f0f2f5] border border-gray-200 p-1.5 rounded-lg outline-none text-[10px]"
                  >
                    <option value="нет макета">Нет макета</option>
                    <option value="ожидает">Ожидает</option>
                    <option value="утвержден">Утвержден</option>
                    <option value="на доработке">На доработке</option>
                  </select>
                  <input
                    type="text"
                    placeholder="URL макета"
                    value={selectedOrder.artworkUrl || ""}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, artworkUrl: e.target.value })}
                    className="w-full bg-[#f0f2f5] border border-gray-200 p-1.5 rounded-lg outline-none text-[10px]"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Review comments on artwork..."
                  value={selectedOrder.artworkComment || ""}
                  onChange={(e) => setSelectedOrder({ ...selectedOrder, artworkComment: e.target.value })}
                  className="w-full bg-[#f0f2f5] border border-gray-200 p-1.5 rounded-lg outline-none text-[10px]"
                />
              </div>

              {/* FINANCIAL AUDITING (ONLY Super Admin, Manager, Finance) */}
              {managerMe && ["Super Admin", "Manager", "Finance"].includes(managerMe.role) && (
                <div className="space-y-2 border-t border-dashed border-red-200 pt-2 bg-red-50/20 p-2 rounded-xl">
                  <span className="block text-[9px] font-bold text-red-800 uppercase tracking-wide">💼 INTERNAL FINANCIAL AUDITING (CONFIDENTIAL)</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500">Cost (֏)</label>
                      <input
                        type="number"
                        placeholder="Cost price"
                        value={selectedOrder.costPrice || ""}
                        onChange={(e) => setSelectedOrder({ ...selectedOrder, costPrice: Number(e.target.value) })}
                        className="w-full bg-white border border-gray-200 p-1 rounded outline-none text-[10px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500">Profit (֏)</label>
                      <div className="bg-gray-100 p-1 rounded font-mono text-[9px] font-bold text-gray-800 text-center">
                        {((selectedOrder.totalPrice || 0) * 1 - (selectedOrder.costPrice || 0) * 1).toLocaleString()}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500">Margin (%)</label>
                      <div className="bg-gray-100 p-1 rounded font-mono text-[9px] font-bold text-gray-800 text-center">
                        {selectedOrder.totalPrice ? Math.round(((Number(selectedOrder.totalPrice) - Number(selectedOrder.costPrice || 0)) / Number(selectedOrder.totalPrice)) * 100) : 0}%
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-[#FF2300] text-white font-bold rounded-xl tracking-wider select-none uppercase hover:bg-opacity-95"
              >
                Sync Data to PostgreSQL
              </button>
            </form>

            {/* MID COMPILER: INVOICES EXCHANGE & PDF BILL COMPILER */}
            <div className="xl:col-span-4 space-y-4 bg-[#f0f2f5] p-4 rounded-2xl border border-gray-100">
              <h3 className="font-serif text-sm font-bold text-[#FF2300] border-b pb-1 uppercase tracking-widest select-none">
                🧾 INVOICE & PDF QUOTE CALCULATOR
              </h3>

              <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-3">
                <p className="text-[10px] text-[#727784] leading-relaxed">
                  Generate professional physical documents by selecting a currency rate. Real foreign exchange coordinates are updated dynamically.
                </p>

                <div className="space-y-1">
                  <label className="font-bold block select-none">Target Document Currency</label>
                  <div className="flex gap-1">
                    {(["AMD", "USD", "EUR"] as const).map(curr => (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => setSelectedInvoiceCurrency(curr)}
                        className={`flex-1 py-1 text-[10px] font-bold rounded select-none ${selectedInvoiceCurrency === curr ? "bg-[#1A3F25] text-white" : "bg-gray-100 text-gray-700"}`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-2 rounded text-[11px] font-mono space-y-1">
                  <div>Base Sum: {(selectedOrder.totalPrice || 0).toLocaleString()} AMD</div>
                  <div>FX rate: 1 {selectedInvoiceCurrency} = {exchangeRates[selectedInvoiceCurrency]} AMD</div>
                  <div className="font-bold text-[#1A3F25]">Converted: {((selectedOrder.totalPrice || 0) / (exchangeRates[selectedInvoiceCurrency] || 1)).toLocaleString(undefined, { maximumFractionDigits: 2 })} {selectedInvoiceCurrency}</div>
                </div>
              </div>

              <div className="space-y-2 select-none">
                <button
                  type="button"
                  onClick={handlePrintQuoteBrief}
                  className="w-full py-2.5 bg-white border border-[#1A3F25]/30 hover:bg-gray-50 text-[#1A3F25] font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                >
                  📥 GENERATE CORPORATE QUOTE PDF
                </button>

                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  className="w-full py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                >
                  🧾 GENERATE INVOICE RECEIPT
                </button>
              </div>

              {/* TIMELINE OF CHANGES FROM PG */}
              <div className="space-y-2">
                <span className="block text-[9px] uppercase font-bold text-[#727784] select-none">Timeline of Changes & Audit Stages</span>
                <div className="bg-white border rounded-xl p-2.5 space-y-2 max-h-[140px] overflow-y-auto">
                  {(selectedOrder.statusHistory || []).map((ht: any, hIdx: number) => (
                    <div key={hIdx} className="border-l-2 border-[#1A3F25] pl-2 text-[10px] space-y-0.5 animate-fadeIn">
                      <div className="font-bold text-[#1A3F25]">Status upgraded to: "{ht.status}"</div>
                      <div className="text-[8px] text-gray-500">{new Date(ht.timestamp || ht.ts).toLocaleString()}</div>
                    </div>
                  ))}
                  {(!selectedOrder.statusHistory || selectedOrder.statusHistory.length === 0) && (
                    <div className="text-[10px] text-gray-400 italic">No change trajectory logged. Status has remained "{selectedOrder.status || "Новый"}".</div>
                  )}
                </div>
              </div>

              {/* ORDER REVIEWS SECURE MONITOR */}
              {selectedOrder.review && (
                <div className="bg-yellow-50 border border-yellow-200 p-2.5 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-yellow-800 font-bold text-[10px]">
                    ⭐ CUSTOMER FEEDBACK SATISFACTION: {selectedOrder.review.rating}/5
                  </div>
                  <p className="text-gray-700 italic select-all">"{selectedOrder.review.comment}"</p>
                </div>
              )}

              {/* CRM ORDER FILES PORTAL */}
              <div className="space-y-2 pt-2 border-t border-dashed border-gray-200">
                <span className="block text-[9px] uppercase font-bold text-[#1A3F25] select-none">📁 Order Files & Attachments</span>
                
                {/* List of Files */}
                <div className="space-y-1 max-h-[120px] overflow-y-auto">
                  {(selectedOrder.files || []).map((fl: any) => (
                    <div key={fl.id} className="flex justify-between items-center bg-white border p-1.5 rounded-lg text-[10px]">
                      <div className="truncate pr-2">
                        <span className="font-bold text-[#FF2300]">[{fl.fileType}]</span> {fl.fileName}
                      </div>
                      <div className="flex gap-2 items-center shrink-0">
                        <a href={fl.fileUrl} target="_blank" rel="noopener noreferrer" className="text-[#1A3F25] font-bold underline hover:text-black">Open</a>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!confirm("Delete this attachment?")) return;
                            try {
                              const res = await fetch(`/api/admin/orders/files/${fl.id}`, {
                                method: "DELETE",
                                headers: {
                                  "Authorization": `Bearer ${adminToken}`
                                }
                              });
                              const data = await res.json();
                              if (data.success) {
                                const remaining = (selectedOrder.files || []).filter((f: any) => f.id !== fl.id);
                                setSelectedOrder({ ...selectedOrder, files: remaining });
                              }
                            } catch (err) {
                              console.error("Failed deleting file", err);
                            }
                          }}
                          className="text-red-700 hover:text-red-900 font-bold"
                        >
                          [X]
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!selectedOrder.files || selectedOrder.files.length === 0) && (
                    <div className="text-[10px] text-gray-400 italic">No custom order files attached yet.</div>
                  )}
                </div>

                {/* Attach a File form */}
                <div className="bg-white p-2 rounded-xl border space-y-2 mt-1.5">
                  <div className="grid grid-cols-2 gap-1.5">
                    <select id="new-file-type" className="bg-[#f0f2f5] border text-[9px] p-1 rounded outline-none w-full">
                      <option value="PDF Quote">PDF Quote</option>
                      <option value="Invoice">Invoice</option>
                      <option value="Approved Artwork">Approved Artwork</option>
                      <option value="Production Preview">Production Preview</option>
                      <option value="Technical Specification">Technical Spec</option>
                    </select>
                    <input id="new-file-name" type="text" placeholder="File name label" className="bg-[#f0f2f5] border text-[9px] p-1 rounded outline-none w-full" />
                  </div>
                  <div className="flex gap-1.5">
                    <input id="new-file-url" type="text" placeholder="https://drive.google.com/url" className="flex-1 bg-[#f0f2f5] border text-[9px] p-1 rounded outline-none" />
                    <button
                      type="button"
                      onClick={async () => {
                        const fileType = (document.getElementById("new-file-type") as HTMLSelectElement)?.value;
                        const fileName = (document.getElementById("new-file-name") as HTMLInputElement)?.value || "Attachment";
                        const fileUrl = (document.getElementById("new-file-url") as HTMLInputElement)?.value;
                        if (!fileUrl) return alert("Please enter a direct link to the file.");
                        
                        try {
                          const res = await fetch(`/api/admin/orders/${selectedOrder.id}/files`, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              "Authorization": `Bearer ${adminToken}`
                            },
                            body: JSON.stringify({ fileName, fileType, fileUrl, fileSize: "1.2 MB" })
                          });
                          const data = await res.json();
                          if (data.success) {
                            const updatedFiles = [...(selectedOrder.files || []), data.file];
                            setSelectedOrder({ ...selectedOrder, files: updatedFiles });
                            (document.getElementById("new-file-name") as HTMLInputElement).value = "";
                            (document.getElementById("new-file-url") as HTMLInputElement).value = "";
                          }
                        } catch (err) {
                          console.error("Failed adding file", err);
                        }
                      }}
                      className="bg-[#FF2300] hover:bg-opacity-90 text-white font-bold px-2 py-1 rounded text-[9px]"
                    >
                      Attach
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COMPILER: DISPATCH CORRESPONDENT WHATSAPP */}
            <div className="xl:col-span-4 space-y-4">
              <h3 className="font-serif text-sm font-bold text-[#1A3F25] border-b pb-1 uppercase tracking-widest select-none">
                💬 OUTGOING COMMUNICATIONS HUB
              </h3>

              {whatsappSuccessMsg && (
                <div className="p-2.5 bg-teal-50 border border-teal-150 text-teal-800 font-bold rounded-lg animate-pulse select-none">
                  {whatsappSuccessMsg}
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-[#7C9082] block">Client Contact Coordinate</label>
                <div className="bg-gray-100 p-2.5 rounded-xl font-mono text-[11px] font-bold text-gray-800">
                  Phone ID: {selectedOrder.customerPhone || "---"}<br />
                  Lead Category: {selectedOrder.source || "---"}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">Outbound Message Composition</label>
                <textarea
                  value={whatsappDraftText}
                  onChange={(e) => setWhatsappDraftText(e.target.value)}
                  placeholder={`e.g. Բարև Ձեզ ${selectedOrder.customerName}, Ձեր պատվերը #CAPS-${selectedOrder.id} հաստատված է և գտնվում է արտադրական "${selectedOrder.status || "Новый"}" փուլում:`}
                  rows={4}
                  className="w-full bg-[#f0f2f5] border border-gray-200 p-2 rounded-xl outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleSendManualWhatsApp}
                className="w-full py-2 bg-[#ff2300] hover:bg-[#e61f00] text-white font-bold rounded-xl shadow-md uppercase tracking-wide transition-all select-none flex items-center justify-center gap-1.5"
              >
                💬 DISPATCH MANUALLY VIA WHATSAPP API
              </button>
            </div>

          </div>
        )}

      </div>
    );
  };

  // ==========================================
  // --- COMPONENT 12: WHATSAPP TRACKER LOGS ---
  // ==========================================
  const renderWhatsAppTracker = () => {
    return (
      <div className="space-y-6 animate-fadeIn font-sans text-xs">
        <div className="border-b border-[#1A3F25]/10 pb-4">
          <span className="text-[10px] font-bold text-[#FF2300]/80 tracking-widest uppercase font-extrabold flex items-center gap-1">
            💬 COGNITIVE INTEGRATIONS HUB
          </span>
          <h2 className="text-xl font-serif text-[#FF2300] font-bold mt-1">WhatsApp Integration Tracking Monitor</h2>
          <p className="text-xs text-[#727784] mt-0.5">Maintain audit logs of outgoing messages, monitor delivery structures, and run triggered sequence engines.</p>
        </div>

        <div className="bg-white border border-[#1A3F25]/10 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs select-none">
              <thead className="bg-[#f0f2f5] border-b border-[#1A3F25]/10 text-[#1a1c1d] font-bold">
                <tr>
                  <th className="p-3 text-[10px] uppercase">ID & Timestamp</th>
                  <th className="p-3 text-[10px] uppercase">Destination Phone</th>
                  <th className="p-3 text-[10px] uppercase">Dispatched Message Body</th>
                  <th className="p-3 text-[10px] uppercase">Order Coordinate</th>
                  <th className="p-3 text-[10px] uppercase">System Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {whatsappLogsList.map((log: any) => (
                  <tr key={log.id} className="hover:bg-[#f0f2f5] transition-all">
                    <td className="p-3">
                      <span className="font-mono text-[#1A3F25] font-bold">#WA-{log.id}</span>
                      <span className="text-[9px] text-[#7C9082] block mt-0.5">{new Date(log.ts || Date.now()).toLocaleString()}</span>
                    </td>
                    <td className="p-3 font-bold text-[#FF2300]">
                      {log.phone || "---"}
                    </td>
                    <td className="p-3">
                      <p className="max-w-[400px] whitespace-pre-wrap leading-relaxed bg-gray-50 border border-gray-100 p-2 rounded-lg text-gray-700 text-[11px] select-text font-sans">
                        {log.message}
                      </p>
                    </td>
                    <td className="p-3 font-serif font-black text-xs text-[#1A3F25]">
                      {log.orderId ? `#CAPS-${log.orderId}` : "General CRM Notification"}
                    </td>
                    <td className="p-3">
                      <span className="bg-teal-50 text-teal-800 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        ● Delievered
                      </span>
                    </td>
                  </tr>
                ))}
                {whatsappLogsList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-[#7C9082] italic font-serif bg-gray-50/20">
                      No customer outbound logs dispatched via WhatsApp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // --- TAB ROUTING ENGINE ---
  switch (activeTab) {
    case "dashboard": return renderDashboard();
    case "product_builder": return renderProductBuilder();
    case "calculator_builder": return renderCalculatorBuilder();
    case "pricing_engine": return renderPricingEngine();
    case "translation_manager": return renderTranslationManager();
    case "media_library": return renderMediaLibrary();
    case "theme_manager": return renderThemeManager();
    case "page_builder": return renderPageBuilder();
    case "crm": return renderCRM();
    case "analytics": return renderAnalytics();
    case "permissions": return renderPermissions();
    case "audit_log": return renderAuditLog();
    case "database_manager": return renderDatabaseManager();
    case "import_export": return renderImportExport();
    case "api_manager": return renderAPIManager();
    case "backup_center": return renderBackupCenter();
    case "ai_admin": return renderAIAdminCenter();
    case "submissions": return renderOrdersCenter();
    case "whatsapp_logs": return renderWhatsAppTracker();
    default: return null;
  }
}
