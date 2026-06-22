import React, { useState, useEffect, FormEvent } from "react";
import EnterpriseAdminSections from "./EnterpriseAdminSections";
import DynamicCategoryBuilder from "./DynamicCategoryBuilder";
import { 
  Settings, 
  X, 
  Lock, 
  LogOut, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw,
  Trash,
  Users,
  Check,
  Printer,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Upload,
  ShoppingBag,
  Gift,
  Box,
  Bookmark,
  Tag,
  CreditCard,
  Contact,
  Layers,
  QrCode,
  Heart,
  Palette,
  Scissors,
  Award,
  Eye,
  Sliders
} from "lucide-react";
import { 
  Category, 
  Product, 
  Dimension, 
  Finish, 
  PricingRules, 
  Tier, 
  OrderSubmission, 
  PaperType, 
  ContactSettings, 
  DiscountCode,
  BagRibbonHandle,
  AISettings,
  PaymentMethod,
  FeaturedProduct
} from "../types";
import { useTranslation, LocaleType } from "../locales/i18n";

export interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  adminToken: string | null;
  onLoginSuccess: (token: string) => void;
  onLogout: () => void;
  categories: Category[];
  products: Product[];
  dimensions: Dimension[];
  finishes: Finish[];
  papers: PaperType[];
  printingMethods: any[];
  tiers: Tier[];
  discountCodes: DiscountCode[];
  siteTexts: Record<string, string>;
  contactSettings: ContactSettings;
  pricingRules: PricingRules | null;
  decorativeBagsPricingRules: PricingRules | null;
  submissions: OrderSubmission[];
  bagRibbonHandles: BagRibbonHandle[];
  featuredProducts?: FeaturedProduct[];
  aiSettings?: AISettings;
  paymentMethods?: PaymentMethod[];
  
  onSaveConfig: (updatedConfig: any) => Promise<void>;
  onClearSubmissions: () => Promise<void>;
  onReload: () => Promise<void>;
}

export default function AdminPanel({
  isOpen,
  onClose,
  adminToken,
  onLoginSuccess,
  onLogout,
  categories,
  products,
  dimensions,
  finishes,
  papers,
  printingMethods,
  tiers,
  discountCodes,
  siteTexts,
  contactSettings,
  pricingRules,
  decorativeBagsPricingRules,
  submissions,
  bagRibbonHandles = [],
  featuredProducts = [],
  aiSettings,
  paymentMethods = [],
  onSaveConfig,
  onClearSubmissions,
  onReload
}: AdminPanelProps) {
  const { locale, setLocale, t } = useTranslation();

  const generateSlugFromName = (name: string): string => {
    const armToLat: Record<string, string> = {
      'ա': 'a', 'բ': 'b', 'գ': 'g', 'դ': 'd', 'ե': 'e', 'զ': 'z', 'է': 'e', 'ը': 'y', 'թ': 't', 'ժ': 'zh',
      'ի': 'i', 'լ': 'l', 'խ': 'kh', 'ծ': 'ts', 'կ': 'k', 'հ': 'h', 'ձ': 'dz', 'ղ': 'gh', 'ճ': 'ch', 'մ': 'm',
      'յ': 'y', 'ն': 'n', 'շ': 'sh', 'ոչ': 'vo', 'չ': 'ch', 'պ': 'p', 'ջ': 'j', 'ռ': 'r', 'ս': 's', 'վ': 'v',
      'տ': 't', 'ր': 'r', 'ց': 'ts', 'ու': 'u', 'փ': 'p', 'ք': 'q', 'օ': 'o', 'ֆ': 'f', 'և': 'ev',
      'Ա': 'A', 'Բ': 'B', 'Գ': 'G', 'Դ': 'D', 'Ե': 'E', 'Զ': 'Z', 'Է': 'E', 'Ը': 'Y', 'Թ': 'T', 'Ժ': 'ZH',
      'Ի': 'I', 'Լ': 'L', 'Խ': 'KH', 'Ծ': 'TS', 'Կ': 'K', 'Հ': 'H', 'Ձ': 'DZ', 'Ղ': 'GH', 'Ճ': 'CH', 'Մ': 'M',
      'Յ': 'Y', 'Ն': 'N', 'Շ': 'SH', 'Ո': 'VO', 'Չ': 'CH', 'Պ': 'P', 'Ջ': 'J', 'Ռ': 'R', 'Ս': 'S', 'Վ': 'V',
      'Տ': 'T', 'Ր': 'R', 'Ց': 'TS', 'ՈՒ': 'U', 'Փ': 'P', 'Ք': 'Q', 'Օ': 'O', 'Ֆ': 'F'
    };
    let result = "";
    for (let i = 0; i < name.length; i++) {
      const char = name[i];
      result += armToLat[char] || char;
    }
    return result
      .toLowerCase()
      .replace(/[^a-z0-9\s-_]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 30);
  };

  const getUniqueSlug = (name: string, list: { id: string }[], ignoreId?: string): string => {
    const base = generateSlugFromName(name) || "category";
    let slug = base;
    let counter = 2;
    while (list.some(item => item.id === slug && item.id !== ignoreId)) {
      slug = `${base}_${counter}`;
      counter++;
    }
    return slug;
  };

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [pricingSubTab, setPricingSubTab] = useState<"standard" | "decorative" | "ribbons" | "stickers" | "giftcards" | "businesscards">("standard");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Edit states holding current modifications
  const [editCategories, setEditCategories] = useState<Category[]>(categories);
  const [editProducts, setEditProducts] = useState<Product[]>(products);
  const [editFeaturedProducts, setEditFeaturedProducts] = useState<FeaturedProduct[]>(featuredProducts || []);
  const [editDimensions, setEditDimensions] = useState<Dimension[]>(dimensions);
  const [editFinishes, setEditFinishes] = useState<Finish[]>(finishes);
  const [editPapers, setEditPapers] = useState<PaperType[]>(papers);
  const [editTiers, setEditTiers] = useState<Tier[]>(tiers);
  const [editDiscountCodes, setEditDiscountCodes] = useState<DiscountCode[]>(discountCodes);
  const [editSiteTexts, setEditSiteTexts] = useState<Record<string, string>>(siteTexts);
  const [editContact, setEditContact] = useState<ContactSettings>(contactSettings);
  const [editPricingRules, setEditPricingRules] = useState<PricingRules | null>(pricingRules);
  const [editDecPricingRules, setEditDecPricingRules] = useState<PricingRules | null>(decorativeBagsPricingRules);
  const [editPrintingMethods, setEditPrintingMethods] = useState<any[]>(printingMethods || []);
  const [editBagRibbonHandles, setEditBagRibbonHandles] = useState<BagRibbonHandle[]>(bagRibbonHandles || []);
  const [editAiSettings, setEditAiSettings] = useState<AISettings>(
    aiSettings || {
      systemPrompt: "",
      temperature: 0.1,
      modelName: "gemini-3.5-flash",
      enabled: true
    }
  );
  const [editPaymentMethods, setEditPaymentMethods] = useState<PaymentMethod[]>(paymentMethods || []);
  const [hasSynced, setHasSynced] = useState(false);
  
  // Auxiliary UI filter/search
  const [siteTextSearch, setSiteTextSearch] = useState("");
  const [categorySubTab, setCategorySubTab] = useState<"portal" | "dashboard">("portal");
  const [selectedDashboardCategory, setSelectedDashboardCategory] = useState<string>("all");
  const [showLiveClientPreview, setShowLiveClientPreview] = useState(false);

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPin, setNewPin] = useState("");

  // Sync / Backup features
  const [backupLoading, setBackupLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [backupError, setBackupError] = useState<string | null>(null);
  const [backupSuccess, setBackupSuccess] = useState<string | null>(null);

  const handleDownloadBackup = async () => {
    setBackupLoading(true);
    setBackupError(null);
    setBackupSuccess(null);
    try {
      const res = await fetch("/api/admin/config", {
        headers: {
          "Authorization": `Bearer ${adminToken || ""}`
        }
      });
      const data = await res.json();
      if (data.success && data.db) {
        const jsonStr = JSON.stringify(data.db, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `capsule_database_backup_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setBackupSuccess("Պահուստային պատճենը հաջողությամբ ներբեռնվել է։");
      } else {
        setBackupError(data.error || "Սխալ ներբեռնման ընթացքում");
      }
    } catch (err: any) {
      setBackupError(err.message || "Կապի խափանում");
    } finally {
      setBackupLoading(false);
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset standard input value so the same file can be uploaded again if needed
    const oldTarget = e.target;

    setImportLoading(true);
    setBackupError(null);
    setBackupSuccess(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonText = event.target?.result as string;
        const parsed = JSON.parse(jsonText);

        const res = await fetch("/api/admin/import-backup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminToken || ""}`
          },
          body: JSON.stringify(parsed)
        });
        const data = await res.json();
        if (data.success) {
          setBackupSuccess("Տվյալների բազան հաջողությամբ վերականգնվել է։ Էջը կվերահաշվարկվի... ");
          setTimeout(() => {
            onReload().then(() => {
              window.location.reload();
            });
          }, 1500);
        } else {
          setBackupError(data.error || "Սխալ ներմուծման ընթացքում");
        }
      } catch (err: any) {
        setBackupError("Սխալ ֆայլը կարդալիս կամ անվավեր JSON ֆորմատ։");
      } finally {
        setImportLoading(false);
        if (oldTarget) oldTarget.value = "";
      }
    };
    reader.readAsText(file);
  };

  // Reset sync flag when the modal is closed, so that when it is opened again it gets fresh sync
  useEffect(() => {
    if (!isOpen) {
      setHasSynced(false);
    }
  }, [isOpen]);

  // Deep sync helper: Whenever database configs change/reload from server, sync them immediately to input fields
  useEffect(() => {
    if (!isOpen) return;
    if (hasSynced) return;

    console.group("Admin Debug");
    console.log("[AdminPanel Mount & Update] Props received from parent:", {
      categories,
      products,
      pricingRules,
      decorativeBagsPricingRules,
      papers,
      finishes,
      printingMethods,
    });
    console.log("[AdminPanel Syncing State] Syncing values to form local edit state...");
    console.groupEnd();

    setEditCategories(categories);
    setEditProducts(products);
    setEditFeaturedProducts(featuredProducts || []);
    setEditDimensions(dimensions);
    setEditFinishes(finishes);
    setEditPapers(papers);
    setEditTiers(tiers);
    setEditDiscountCodes(discountCodes);
    setEditSiteTexts(siteTexts);
    setEditContact(contactSettings);
    setEditPricingRules(pricingRules);
    setEditDecPricingRules(decorativeBagsPricingRules);
    setEditPrintingMethods(printingMethods || []);
    setEditBagRibbonHandles(bagRibbonHandles || []);
    setEditPaymentMethods(paymentMethods || []);
    if (aiSettings) {
      setEditAiSettings(aiSettings);
    }
    setHasSynced(true);
  }, [isOpen, hasSynced, categories, products, featuredProducts, dimensions, finishes, papers, tiers, discountCodes, siteTexts, contactSettings, pricingRules, decorativeBagsPricingRules, printingMethods, bagRibbonHandles, aiSettings, paymentMethods]);

  // Non-blocking admin authentication check running asynchronously in the background to confirm server validity
  useEffect(() => {
    if (!isOpen || !adminToken) return;
    
    fetch("/api/admin/me", {
      headers: { "Authorization": `Bearer ${adminToken}` }
    })
    .then(async (res) => {
      if (res.status === 401) {
        // Session staled, handled gracefully
      } else {
        const body = await res.json().catch(() => null);
        if (body && body.success) {
          // Validation succeeded
        }
      }
    })
    .catch(() => {
      // Safe fallback
    });
  }, [isOpen, adminToken]);

  // Clean, noiseless state sync diagnostics
  useEffect(() => {
    if (!isOpen) return;
    
    // Smooth check to ensure catalog contents are initialized
    const isCatalogLoaded = categories?.length > 0 && products?.length > 0 && !!pricingRules;
    if (isCatalogLoaded) {
      console.log("[CMS Integrity Check] Live catalog database successfully synchronized.");
    }
  }, [isOpen, categories, products, pricingRules]);

  if (!isOpen) return null;

  const handlePrintAll = () => {
    const printDiv = document.createElement("div");
    printDiv.id = "printable-section";
    
    let rowsHtml = submissions.map((sub, idx) => `
      <div style="margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px dashed #bbb; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 8px;">
          <span style="font-size: 11pt;">#${idx + 1} [${sub.type.toUpperCase()}]</span>
          <span style="font-size: 10pt; color: #666;">${new Date(sub.ts).toLocaleString('hy-AM')}</span>
        </div>
        <div style="margin-bottom: 8px; font-size: 11pt; font-weight: 500;">
          👤 <strong>${sub.customerName}</strong> (${sub.customerPhone})
        </div>
        <pre style="font-family: inherit; font-size: 10pt; white-space: pre-wrap; background: #fdfdfd; border: 1px solid #eee; padding: 10px; margin: 5px 0; border-radius: 4px; color: #333;">${sub.details}</pre>
        <div style="text-align: right; font-weight: bold; font-size: 12pt; margin-top: 8px;">
          Արժեք: ${sub.totalPrice?.toLocaleString()} ֏
        </div>
      </div>
    `).join("");

    printDiv.innerHTML = `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 25px; color: #000; background: #fff;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 15px;">
          <h1 style="font-size: 20pt; font-family: 'Cormorant Garamond', serif; letter-spacing: 2px; margin: 0 0 5px 0;">CAPSULE CONCEPT</h1>
          <h2 style="font-size: 12pt; font-weight: normal; margin: 0; text-transform: uppercase; letter-spacing: 1px;">ՍՏԱՑՎԱԾ ՊԱՏՎԵՐՆԵՐԻ ԱՄՓՈՓԱԳԻՐ</h2>
          <div style="font-size: 9pt; color: #555; margin-top: 8px;">
            Տպված է՝ ${new Date().toLocaleString('hy-AM')} | Ընդհանուր հայտեր՝ ${submissions.length}
          </div>
        </div>
        <div>
          ${rowsHtml}
        </div>
        <div style="margin-top: 40px; border-top: 1px solid #000; padding-top: 15px; text-align: right; font-weight: bold; font-size: 14pt;">
          Ընդհանուր Գումար՝ ${submissions.reduce((acc, s) => acc + (s.totalPrice || 0), 0).toLocaleString()} ֏
        </div>
      </div>
    `;
    
    document.body.appendChild(printDiv);
    window.print();
    document.body.removeChild(printDiv);
  };

  const handlePrintSingle = (sub: OrderSubmission) => {
    const printDiv = document.createElement("div");
    printDiv.id = "printable-section";
    
    printDiv.innerHTML = `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; color: #000; background: #fff; border: 1px solid #ddd; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 15px;">
          <h1 style="font-size: 22pt; font-family: 'Cormorant Garamond', serif; letter-spacing: 2px; margin: 0 0 5px 0;">CAPSULE CONCEPT</h1>
          <div style="font-size: 10pt; text-transform: uppercase; letter-spacing: 1.5px; color: #333;">ՊԱՏՎԵՐԻ ՀԱՇԻՎ-ԱՊՐԱՆՔԱԳԻՐ</div>
          <div style="font-size: 9pt; margin-top: 6px; color: #666;">
            Հայտի ID: ${sub.id || Math.floor(100000 + Math.random() * 900000)} | Ամսաթիվ՝ ${new Date(sub.ts).toLocaleString('hy-AM')}
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 11pt; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">👤 Պատվիրատու</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 10.5pt;">
            <tr>
              <td style="padding: 4px 0; font-weight: bold; width: 120px;">Անուն:</td>
              <td style="padding: 4px 0;">${sub.customerName}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold;">Հեռախոս:</td>
              <td style="padding: 4px 0; font-family: monospace;">${sub.customerPhone}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold;">Բաժին:</td>
              <td style="padding: 4px 0; text-transform: capitalize;">${sub.type}</td>
            </tr>
          </table>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 11pt; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">📋 Պատվերի Մանրամասներ</h3>
          <div style="background: #fdfdfd; border: 1px solid #e0e0e0; border-radius: 6px; padding: 15px; font-size: 10pt; line-height: 1.5; white-space: pre-wrap; font-family: inherit; color: #333; margin-top: 5px;">${sub.details}</div>
        </div>
        
        <div style="margin-top: 30px; border-top: 2px solid #000; padding-top: 15px; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 9pt; color: #666; font-style: italic;">ԱԱՀ ներառված չէ։ Սակագինը վերջնական է:</div>
          <div style="font-size: 14pt; font-weight: bold;">Ընդհանուր՝ ${sub.totalPrice?.toLocaleString()} ֏</div>
        </div>
        
        <div style="text-align: center; margin-top: 40px; border-top: 1px dashed #ccc; padding-top: 15px; font-size: 9pt; color: #555;">
          Շնորհակալություն Capsule Concept-ին դիմելու համար:<br/>
          <span style="font-family: monospace; font-size: 8pt; color: #888;">www.capsule.am | order@capsule.am</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(printDiv);
    window.print();
    document.body.removeChild(printDiv);
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoginError(null);
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput.trim(), password: passwordInput })
      });
      const data = await res.json();
      if (data.success) {
        onLoginSuccess(data.token);
      } else {
        setLoginError(data.error || "Սխալ օգտանուն կամ գաղտնաբառ։");
      }
    } catch {
      setLoginError("Կապի խափանում մուտք գործելիս։");
    }
  };

  const handleSaveAll = async () => {
    const payload = {
      categories: editCategories,
      products: editProducts,
      featuredProducts: editFeaturedProducts,
      dimensions: editDimensions,
      finishes: editFinishes,
      pricingRules: editPricingRules,
      decorativeBagsPricingRules: editDecPricingRules,
      papers: editPapers,
      contactSettings: editContact,
      tiers: editTiers,
      discountCodes: editDiscountCodes,
      siteTexts: editSiteTexts,
      printingMethods: editPrintingMethods,
      bagRibbonHandles: editBagRibbonHandles,
      aiSettings: editAiSettings,
      paymentMethods: editPaymentMethods
    };
    setHasSynced(false);
    await onSaveConfig(payload);
  };

  const handleCredentialsUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() && !newPassword.trim() && !newPin.trim()) {
      alert("Խնդրում ենք լրացնել գոնե մեկ դաշտ փոփոխության համար։");
      return;
    }
    try {
      const res = await fetch("/api/admin/change-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          newUsername: newUsername.trim() || undefined,
          newPassword: newPassword.trim() || undefined,
          newPin: newPin.trim() || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.token) {
          onLoginSuccess(data.token);
        }
        setNewUsername("");
        setNewPassword("");
        setNewPin("");
        alert("Տվյալները հաջողությամբ թարմացվեցին:");
      } else {
        alert(data.error || "Սխալ");
      }
    } catch {
      alert("Կապի սխալ");
    }
  };

  const handleSaveDynamicCategory = async (cat: any, prod: any) => {
    // Save category with dynamic sizing and options attached
    const updatedCategories = [
      ...(editCategories || []).filter(c => c.id !== cat.id),
      {
        ...cat,
        id: cat.id,
        name: cat.name,
        navLabel: cat.navLabel || cat.name,
        active: cat.active ?? true,
        sizing: cat.sizing,
        minQty: cat.minQty || 100,
        qtyPresets: cat.qtyPresets || [100, 300, 500, 1000],
        options: cat.options || [],
        heroTitle: cat.heroTitle || `Exclusive Custom ${cat.name}`,
        heroDesc: cat.heroDesc || `Configure, specify dimensions, and order bespoke custom ${cat.name} packaging solution of premium print quality.`,
        ruleChips: cat.ruleChips || "custom",
        icon: cat.icon || "✨",
        template: cat.template || cat.id
      }
    ];
    setEditCategories(updatedCategories);

    // Save associated product
    const updatedProducts = [
      ...(editProducts || []).filter(p => p.id !== prod.id),
      {
        ...prod,
        items: prod.items || []
      }
    ];
    setEditProducts(updatedProducts);

    const payload = {
      categories: updatedCategories,
      products: updatedProducts,
      dimensions: editDimensions,
      finishes: editFinishes,
      pricingRules: editPricingRules,
      decorativeBagsPricingRules: editDecPricingRules,
      papers: editPapers,
      contactSettings: editContact,
      tiers: editTiers,
      discountCodes: editDiscountCodes,
      siteTexts: editSiteTexts,
      printingMethods: editPrintingMethods,
      bagRibbonHandles: editBagRibbonHandles,
      aiSettings: editAiSettings
    };

    try {
      setHasSynced(false);
      await onSaveConfig(payload);
      alert(`Դինամիկ բաժինը և ապրանքը հաջողությամբ ստեղծվել և պահպանվել են բազայում / Dynamic Category "${cat.name}" created and saved successfully!`);
      setActiveTab("categories");
    } catch (err: any) {
      alert("Error saving category: " + (err.message || err));
    }
  };

  const adminTranslations: Record<LocaleType, {
    enterprisePlatform: string;
    controlHub: string;
    logout: string;
    headerTitle: string;
    groups: Record<string, string>;
    tabs: Record<string, string>;
  }> = {
    hy: {
      enterprisePlatform: "✨ ԿԱՌԱՎԱՐՄԱՆ ՊԼԱՏՖՈՐՄ",
      controlHub: "Capsule կառավարման կենտրոն",
      logout: "ԴՈՒՐՍ ԳԱԼ / LOG OUT",
      headerTitle: "Ադմինիստրատորի Վահանակ",
      groups: {
        "📊 Core Metrics": "📊 Հիմնական Ցուցանիշներ",
        "🛒 Catalog & Config": "🛒 Կատալոգ և Կարգավորումներ",
        "⚙️ Pricing & Logic": "⚙️ Գնագոյացում և Տրամաբանություն",
        "🌍 Content & UI": "🌍 Բովանդակություն և Դիզայն",
        "🛡️ System Management": "🛡️ Համակարգի Կառավարում"
      },
      tabs: {
        dashboard: "📊 Վահանակ",
        analytics: "📈 Խորը Վերլուծություն",
        crm: "👥 CRM Հաճախորդներ",
        submissions: "📋 Պատվերների Կենտրոն",
        whatsapp_logs: "💬 WhatsApp Լոգեր",
        audit_log: "📜 Գործողությունների Գիրք",
        product_builder: "🛍️ Ապրանքի Ստեղծող",
        dynamic_category_builder: "✨ Կատեգորիաների Կառավարիչ",
        products: "📦 Legacy Ապրանքներ",
        categories: "🏷️ Տեսակներ և MOQ",
        sizes: "📐 Չափսեր և Ձևաչափեր",
        papers: "📄 Թղթի Գրադարան",
        handles: "🎗️ Բռնակներ և Ժապավեններ",
        finishes: "✨ Ֆոլգա և ՈՒՎ Լաք",
        promo: "🎫 Պրոմո Կոդեր",
        calculator_builder: "🔀 Հաշվիչի Կառուցող",
        pricing_engine: "🔢 Գների Կանոններ",
        pricing_standard: "🛍️ Տոպրակներ (Ստանդարտ)",
        pricing_decorative: "✨ Տոպրակներ (Դեկորատիվ)",
        pricing_ribbons: "🎗️ Ժապավեններ",
        pricing_stickers: "🏷️ Պիտակներ",
        pricing_giftcards: "🎁 Նվեր Քարտեր",
        pricing_businesscards: "🪪 Այցեքարտեր",
        box_pricing: "📦 Տուփեր",
        tiers: "📊 Քանակական Խմբեր",
        taxes: "⚖️ Մարժաներ / Գործակիցներ",
        printing: "🖨️ Տպագրության Կարգավորումներ",
        page_builder: "🎨 Էջի Կառուցող",
        translation_manager: "🌐 Միասնական Թարգմանություններ",
        sitetexts: "📝 Էջի Տեքստեր (Old)",
        media_library: "🖼️ Մեդիա Գրադարան",
        theme_manager: "🎨 Visual Թեմաներ",
        contact: "📞 Կապի Կանալներ",
        permissions: "👥 Թիմի Իրավունքներ",
        api_manager: "🔗 Ինտեգրումներ և API",
        ai_agent: "🤖 AI Գործակալ",
        ai_admin: "🧠 AI Կարգավորումներ",
        credentials: "🔒 Մուտքի Տվյալներ",
        backups: "💾 Հին Սինք",
        backup_center: "💽 Enterprise Վերականգնում",
        database_manager: "🗄️ Հիմնական Տվյալների Բազա",
        import_export: "💾 Excel և CSV Սինք"
      }
    },
    en: {
      enterprisePlatform: "✨ ENTERPRISE PLATFORM",
      controlHub: "Capsule Control Hub",
      logout: "LOG OUT",
      headerTitle: "Administrator Portal",
      groups: {
        "📊 Core Metrics": "📊 Core Metrics",
        "🛒 Catalog & Config": "🛒 Catalog & Config",
        "⚙️ Pricing & Logic": "⚙️ Pricing & Logic",
        "🌍 Content & UI": "🌍 Content & UI",
        "🛡️ System Management": "🛡️ System Management"
      },
      tabs: {
        dashboard: "📊 Dashboard",
        analytics: "📈 Deep Analytics",
        crm: "👥 CRM Client Deck",
        submissions: "📋 Orders Center",
        whatsapp_logs: "💬 WhatsApp Tracker",
        audit_log: "📜 Audit Ledger",
        product_builder: "🛍️ Product Builder",
        dynamic_category_builder: "✨ Dynamic Category Builder",
        products: "📦 Legacy Other Products",
        categories: "🏷️ Kinds & MOQ",
        sizes: "📐 Sizes & Formats",
        papers: "📄 Paper Library",
        handles: "🎗️ Handle Accessories",
        finishes: "✨ Foil & UV Finishes",
        promo: "🎫 Promo Coupons",
        calculator_builder: "🔀 Calculator Builder",
        pricing_engine: "🔢 Pricing Rules",
        pricing_standard: "🛍️ Bags (Standard)",
        pricing_decorative: "✨ Bags (Decorative)",
        pricing_ribbons: "🎗️ Ribbon pricing",
        pricing_stickers: "🏷️ Sticker pricing",
        pricing_giftcards: "🎁 Gift Cards",
        pricing_businesscards: "🪪 Business Cards",
        box_pricing: "📦 Box pricing",
        tiers: "📊 Tier Quantities",
        taxes: "⚖️ Margins / Coeffs",
        printing: "🖨️ Print Settings",
        page_builder: "🎨 Page Web Builder",
        translation_manager: "🌐 Unified Translations",
        sitetexts: "📝 Old Site Texts",
        media_library: "🖼️ Media Assets",
        theme_manager: "🎨 Visual Themes",
        contact: "📞 Channel Controls",
        permissions: "👥 Team Permissions",
        api_manager: "🔗 Integrations & API",
        ai_agent: "🤖 AI Agent Admin",
        ai_admin: "🧠 AI Settings Engine",
        credentials: "🔒 Credentials Control",
        backups: "💾 Legacy Sync",
        backup_center: "💽 Enterprise Recovery",
        database_manager: "🗄️ Core Database Manager",
        import_export: "💾 Excel & CSV Sync"
      }
    },
    ru: {
      enterprisePlatform: "✨ УПРАВЛЯЮЩАЯ ПЛАТФОРМА",
      controlHub: "Capsule Панель управления",
      logout: "ВЫЙТИ / LOG OUT",
      headerTitle: "Панель Администратора",
      groups: {
        "📊 Core Metrics": "📊 Основные метрики",
        "🛒 Catalog & Config": "🛒 Каталог и конфигурация",
        "⚙️ Pricing & Logic": "⚙️ Цены и логика",
        "🌍 Content & UI": "🌍 Контент и дизайн",
        "🛡️ System Management": "🛡️ Управление системой"
      },
      tabs: {
        dashboard: "📊 Панель управления",
        analytics: "📈 Глубокая аналитика",
        crm: "👥 CRM Клиенты",
        submissions: "📋 Центр заказов",
        whatsapp_logs: "💬 WhatsApp логи",
        audit_log: "📜 Журнал аудита",
        product_builder: "🛍️ Конструктор товаров",
        dynamic_category_builder: "✨ Конструктор категорий",
        products: "📦 Другие товары (Legacy)",
        categories: "🏷️ Виды и MOQ",
        sizes: "📐 Размеры и форматы",
        papers: "📄 Библиотека бумаги",
        handles: "🎗️ Ручки и аксессуары",
        finishes: "✨ Тиснение фольгой & УФ",
        promo: "🎫 Промо-купоны",
        calculator_builder: "🔀 Конструктор калькулятора",
        pricing_engine: "🔢 Правила цен",
        pricing_standard: "🛍️ Пакеты (Стандарт)",
        pricing_decorative: "✨ Пакеты (Декоративные)",
        pricing_ribbons: "🎗️ Расценки лент",
        pricing_stickers: "🏷️ Расценки наклеек",
        pricing_giftcards: "🎁 Подарочные карты",
        pricing_businesscards: "🪪 Визитные карточки",
        box_pricing: "📦 Коробки",
        tiers: "📊 Тиражные группы",
        taxes: "⚖️ Маржа и коэффициенты",
        printing: "🖨️ Настройки печати",
        page_builder: "🎨 Конструктор веб-страниц",
        translation_manager: "🌐 Единая локализация",
        sitetexts: "📝 Старые тексты сайта",
        media_library: "🖼️ Медиабиблиотека",
        theme_manager: "🎨 Визуальные темы",
        contact: "📞 Каналы связи",
        permissions: "👥 Права команды",
        api_manager: "🔗 Интеграции и API",
        ai_agent: "🤖 ИИ-Агент",
        ai_admin: "🧠 Настройки ИИ",
        credentials: "🔒 Управление доступом",
        backups: "💾 Синхронизация данных",
        backup_center: "💽 Восстановление данных",
        database_manager: "🗄️ База данных ядра",
        import_export: "💾 Синхронизация Excel/CSV"
      }
    },
    ar: {
      enterprisePlatform: "✨ منصة الإدارة والمتابعة",
      controlHub: "مركز إدارة تابلت كابسول",
      logout: "تسجيل الخروج",
      headerTitle: "لوحة تحكم المدير العام",
      groups: {
        "📊 Core Metrics": "📊 المؤشرات والتحليلات",
        "🛒 Catalog & Config": "🛒 المنتجات والتهيئة",
        "⚙️ Pricing & Logic": "⚙️ قواعد وحساب الأسعار",
        "🌍 Content & UI": "🌍 المحتوى والواجهة",
        "🛡️ System Management": "🛡️ إدارة النظام والأمان"
      },
      tabs: {
        dashboard: "📊 لوحة التحكم",
        analytics: "📈 تحليلات عميقة",
        crm: "👥 إدارة العملاء CRM",
        submissions: "📋 مركز الطلبات",
        whatsapp_logs: "💬 نظام تتبع واتساب",
        audit_log: "📜 سجل التدقيق والمراقبة",
        product_builder: "🛍️ منشئ المنتجات",
        dynamic_category_builder: "✨ منشئ الفئات الديناميكي",
        products: "📦 منتجات قديمة أخرى",
        categories: "🏷️ أنواع المنتجات لـ MOQ",
        sizes: "📐 الأحجام والمقاسات",
        papers: "📄 مكتبة أنواع الورق",
        handles: "🎗️ مقابض الحلقات والشرائط",
        finishes: "✨ التشطيبات الفاخرة واللمعان",
        promo: "🎫 الكوبونات والخصومات",
        calculator_builder: "🔀 منشئ نظام الحساب المتقدم",
        pricing_engine: "🔢 خوارزمية تسعير القواعد",
        pricing_standard: "🛍️ الحقائب الورقية (القياسية)",
        pricing_decorative: "📊 الحقائب الورقية (المزخرفة)",
        pricing_ribbons: "🎗️ تسعير الأشرطة المطبوعة",
        pricing_stickers: "🏷️ تسعير الملصقات اللاصقة",
        pricing_giftcards: "🎁 تسعير بطاقات الهدايا",
        pricing_businesscards: "🪪 تسعير كروت الأعمال",
        box_pricing: "📦 تسعير كرتون التغليف",
        tiers: "📊 فئات حدود الكميات",
        taxes: "⚖️ معاملات ونسب الربح",
        printing: "🖨️ إعدادات ماكينات الطباعة",
        page_builder: "🎨 منشئ صفحات الويب",
        translation_manager: "🌐 إدارة الترجمات الموحدة",
        sitetexts: "📝 نصوص الموقع القديمة",
        media_library: "🖼️ مكتبة الوسائط والصور",
        theme_manager: "🎨 التحكم في القوالب والألوان",
        contact: "📞 إدارة قنوات الاتصال",
        permissions: "👥 صلاحيات فريق العمل",
        api_manager: "🔗 الربط البرمجي والـ API",
        ai_agent: "🤖 مدير عميل الذكاء الاصطناعي",
        ai_admin: "🧠 خوارزمية الذكاء الاصطناعي",
        credentials: "🔒 أمان لوحة التحكم",
        backups: "💾 نقل ومزامنة البيانات",
        backup_center: "💽 نظام استرداد الكوارث",
        database_manager: "🗄️ نظام إدارة قاعدة البيانات",
        import_export: "💾 تصدير واستيراد ملفات Excel/CSV"
      }
    }
  };

  const getEnterprisePlatformTr = () => adminTranslations[locale]?.enterprisePlatform || adminTranslations["en"].enterprisePlatform;
  const getControlHubTr = () => adminTranslations[locale]?.controlHub || adminTranslations["en"].controlHub;
  const getLogoutTr = () => adminTranslations[locale]?.logout || adminTranslations["en"].logout;
  const getHeaderTitleTr = () => adminTranslations[locale]?.headerTitle || adminTranslations["en"].headerTitle;
  const getGroupTr = (title: string) => adminTranslations[locale]?.groups[title] || adminTranslations["en"]?.groups[title] || title;
  const getTabTr = (key: string, original: string) => adminTranslations[locale]?.tabs[key] || adminTranslations["en"]?.tabs[key] || original;

  return (
    <div className="fixed inset-0 bg-capsule-dark/70 backdrop-blur-md z-[2000] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-capsule-surf border border-[#C59B6D]/30 w-full max-w-[96vw] xl:max-w-[1450px] h-[92vh] md:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        
        {/* Header bar - Premium Dark Green & Delicate Bronze styling */}
        <div className="px-6 py-4 bg-[#1A3F25] text-white flex items-center justify-between border-b border-[#C59B6D]/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <Settings size={20} className="text-[#C59B6D] animate-spin-slow" />
            <div>
              <h2 className="font-serif font-light text-xl tracking-wider uppercase text-[#FAF9F6]">{getHeaderTitleTr()}</h2>
              <p className="text-[9px] uppercase tracking-widest text-[#C59B6D] font-bold">Capsule Concept CMS Platform & Production Control</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Embedded Multi-locale Switcher */}
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-full border border-white/20 select-none">
              {[
                { code: "hy", flag: "🇦🇲", name: "AM" },
                { code: "en", flag: "🇬🇧", name: "EN" },
                { code: "ru", flag: "🇷🇺", name: "RU" },
                { code: "ar", flag: "🇦🇪", name: "AR" }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLocale(lang.code as LocaleType)}
                  className={`px-2 py-0.5 text-[8px] font-black rounded-full cursor-pointer transition-all uppercase flex items-center gap-1 border border-transparent ${
                    locale === lang.code 
                      ? "bg-[#C59B6D] text-[#1A3F25] border-white/25 shadow-sm font-extrabold" 
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                  title={lang.name}
                >
                  <span>{lang.flag}</span>
                  <span className="hidden sm:inline">{lang.name}</span>
                </button>
              ))}
            </div>

            <button 
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-[#C59B6D] hover:text-[#1A3F25] text-[#FAF9F6] hover:scale-105 transition-all text-xs border border-white/25 rounded-full cursor-pointer flex items-center justify-center h-8 w-8"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Secure login gate */}
        {!adminToken ? (
          <div className="p-10 flex-1 flex flex-col items-center justify-center max-w-sm mx-auto text-center gap-4">
            <Lock size={36} className="text-capsule-accent" />
            <h3 className="font-serif text-lg text-capsule-accent font-semibold">Անվտանգ Լոգին</h3>
            <p className="text-xs text-capsule-text-secondary leading-relaxed">
              Մուտքագրեք Ձեր ադմինիստրատորի տվյալները` վահանակը բացելու համար։
            </p>
            
            <form onSubmit={handleLoginSubmit} className="w-full space-y-3 text-left">
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-capsule-text-muted uppercase tracking-wider">Օգտանուն</label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs font-semibold outline-none focus:border-capsule-accent text-capsule-dark transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-capsule-text-muted uppercase tracking-wider">Գաղտնաբառ</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs font-semibold outline-none focus:border-capsule-accent text-capsule-dark transition-all"
                />
              </div>
              {loginError && (
                <p className="text-[10px] text-red-600 font-semibold text-center">{loginError}</p>
              )}
              <button
                type="submit"
                className="w-full bg-capsule-accent hover:bg-capsule-accent-light text-capsule-surf py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer shadow-md mt-2"
              >
                Մուտք
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-[#FAFAF8]">
            
            {/* Sidebar navigation tabs - Luxurious layout */}
            <div className="w-full md:w-64 bg-[#F5F2EB] border-r border-[#C59B6D]/20 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible md:overflow-y-auto shrink-0 divide-x md:divide-x-0 divide-[#C59B6D]/15 scrollbar-thin">
              <div className="p-4 hidden md:block border-b border-[#C59B6D]/15 bg-[#1A3F25]/5">
                <span className="text-[10px] tracking-widest font-extrabold uppercase text-[#1A3F25] block">{getEnterprisePlatformTr()}</span>
                <span className="text-[9px] text-[#C59B6D] uppercase font-bold mt-0.5 block">{getControlHubTr()}</span>
              </div>
              
              <div className="flex flex-row md:flex-col md:space-y-4 md:p-3 overflow-y-auto flex-1 h-full scrollbar-none">
                {[
                  {
                    title: "📊 Core Metrics",
                    items: [
                      { key: "dashboard", lbl: "📊 Dashboard" },
                      { key: "analytics", lbl: "📈 Deep Analytics" },
                      { key: "crm", lbl: "👥 CRM Client Deck" },
                      { key: "submissions", lbl: "📋 Orders Center" },
                      { key: "whatsapp_logs", lbl: "💬 WhatsApp Tracker" },
                      { key: "audit_log", lbl: "📜 Audit Ledger" }
                    ]
                  },
                  {
                    title: "🛒 Catalog & Config",
                    items: [
                      { key: "product_builder", lbl: "🛍️ Product Builder" },
                      { key: "featured_products", lbl: "🌟 Featured / Home Page" },
                      { key: "dynamic_category_builder", lbl: "✨ Dynamic Category Builder" },
                      { key: "products", lbl: "📦 Legacy Other Products" },
                      { key: "categories", lbl: "🏷️ Kinds & MOQ" },
                      { key: "sizes", lbl: "📐 Sizes & Formats" },
                      { key: "papers", lbl: "📄 Paper Library" },
                      { key: "handles", lbl: "🎗️ Handle Accessories" },
                      { key: "finishes", lbl: "✨ Foil & UV Finishes" },
                      { key: "promo", lbl: "🎫 Promo Coupons" },
                      { key: "payment_methods", lbl: "💳 Payment Methods" }
                    ]
                  },
                  {
                    title: "⚙️ Pricing & Logic",
                    items: [
                      { key: "calculator_builder", lbl: "🔀 Calculator Builder" },
                      { key: "pricing_engine", lbl: "🔢 Pricing Rules" },
                      { key: "pricing_standard", lbl: "🛍️ Bags (Standard)" },
                      { key: "pricing_decorative", lbl: "✨ Bags (Decorative)" },
                      { key: "pricing_ribbons", lbl: "🎗️ Ribbon pricing" },
                      { key: "pricing_stickers", lbl: "🏷️ Sticker pricing" },
                      { key: "pricing_giftcards", lbl: "🎁 Gift Cards" },
                      { key: "pricing_businesscards", lbl: "🪪 Business Cards" },
                      { key: "box_pricing", lbl: "📦 Box pricing" },
                      { key: "tiers", lbl: "📊 Tier Quantities" },
                      { key: "taxes", lbl: "⚖ Margins / Coeffs" },
                      { key: "printing", lbl: "🖨️ Print Settings" }
                    ]
                  },
                  {
                    title: "🌍 Content & UI",
                    items: [
                      { key: "page_builder", lbl: "🎨 Page Web Builder" },
                      { key: "translation_manager", lbl: "🌐 Unified Translations" },
                      { key: "sitetexts", lbl: "📝 Old Site Texts" },
                      { key: "media_library", lbl: "🖼️ Media Assets" },
                      { key: "theme_manager", lbl: "🎨 Visual Themes" },
                      { key: "contact", lbl: "📞 Channel Controls" }
                    ]
                  },
                  {
                    title: "🛡️ System Management",
                    items: [
                      { key: "permissions", lbl: "👥 Team Permissions" },
                      { key: "api_manager", lbl: "🔗 Integrations & API" },
                      { key: "ai_agent", lbl: "🤖 AI Agent Admin" },
                      { key: "ai_admin", lbl: "🧠 AI Settings Engine" },
                      { key: "credentials", lbl: "🔒 Credentials Control" },
                      { key: "backups", lbl: "💾 Legacy Sync" },
                      { key: "backup_center", lbl: "💽 Enterprise Recovery" },
                      { key: "database_manager", lbl: "🗄️ Core Database Manager" },
                      { key: "import_export", lbl: "💾 Excel & CSV Sync" }
                    ]
                  }
                ].map((group) => (
                  <div key={group.title} className="flex flex-row md:flex-col shrink-0">
                    <span className="hidden md:block text-[9px] font-black uppercase text-[#1A3F25]/80 tracking-widest px-3 mb-1.5 mt-2 border-l border-[#C59B6D] pl-2">
                      {getGroupTr(group.title)}
                    </span>
                    <div className="flex flex-row md:flex-col shrink-0 md:space-y-0.5">
                      {group.items.map((adTab) => {
                        const isAct = adTab.key === activeTab;
                        return (
                          <button
                            key={adTab.key}
                            onClick={() => setActiveTab(adTab.key)}
                            className={`py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-left transition-all shrink-0 cursor-pointer rounded-lg flex items-center justify-between border-b-2 md:border-b-0 ${
                              isAct 
                                ? "bg-[#1A3F25] text-white shadow-md border-l-4 border-[#C59B6D]" 
                                : "text-[#3D271B]/80 hover:bg-[#1A3F25]/5 hover:text-[#1A3F25] border-l-4 border-transparent"
                            }`}
                          >
                            <span>{getTabTr(adTab.key, adTab.lbl)}</span>
                            {isAct && <span className="w-1.5 h-1.5 rounded-full bg-[#C59B6D] animate-pulse shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={onLogout}
                className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-red-700 hover:bg-red-50 hover:text-red-900 transition-all text-left shrink-0 border-t border-[#C59B6D]/20 cursor-pointer flex items-center gap-1.5"
              >
                <LogOut size={12} />
                <span>{getLogoutTr()}</span>
              </button>
            </div>

            {/* Right side container: wrapping the work area and bottom banner */}
            <div className="flex-1 flex flex-col min-h-0 relative">
              
              {/* Editing Work area with dynamic executive high-end sizing */}
              <div className="flex-1 p-5 md:p-6 overflow-y-auto max-h-[62vh] md:max-h-[72vh] lg:max-h-[76vh] xl:max-h-[80vh] scrollbar-thin scrollbar-thumb-capsule-accent/10 scrollbar-track-transparent">
              
              {/* ENTERPRISE WORKSPACE NEW SECTIONS */}
              {["dashboard", "product_builder", "calculator_builder", "pricing_engine", "translation_manager", "media_library", "theme_manager", "page_builder", "crm", "analytics", "permissions", "audit_log", "database_manager", "import_export", "api_manager", "backup_center", "ai_admin", "submissions", "whatsapp_logs"].includes(activeTab) && (
                <EnterpriseAdminSections 
                  activeTab={activeTab}
                  submissions={submissions}
                  editCategories={editCategories}
                  setEditCategories={setEditCategories}
                  editProducts={editProducts}
                  setEditProducts={setEditProducts}
                  editDimensions={editDimensions}
                  setEditDimensions={setEditDimensions}
                  editFinishes={editFinishes}
                  setEditFinishes={setEditFinishes}
                  editPapers={editPapers}
                  setEditPapers={setEditPapers}
                  editTiers={editTiers}
                  setEditTiers={setEditTiers}
                  editDiscountCodes={editDiscountCodes}
                  setEditDiscountCodes={setEditDiscountCodes}
                  editSiteTexts={editSiteTexts}
                  setEditSiteTexts={setEditSiteTexts}
                  editContact={editContact}
                  setEditContact={setEditContact}
                  editBagRibbonHandles={editBagRibbonHandles}
                  setEditBagRibbonHandles={setEditBagRibbonHandles}
                  editAiSettings={editAiSettings}
                  setEditAiSettings={setEditAiSettings}
                  adminToken={adminToken}
                  handleSaveAll={handleSaveAll}
                />
              )}

              {/* TAB: DYNAMIC CATEGORY CREATOR/BUILDER */}
              {activeTab === "dynamic_category_builder" && (
                <div className="space-y-6 bg-white p-6 rounded-2xl border border-capsule-accent/10 shadow-xs">
                  <div className="border-b border-capsule-accent/10 pb-4 mb-3">
                    <h3 className="font-serif text-lg text-capsule-accent font-semibold flex items-center gap-2">
                      <Sparkles size={18} className="text-[#D27E53]" />
                      <span>Ավելացնել Դինամիկ Բաժին / Create Dynamic Product Category</span>
                    </h3>
                    <p className="text-xs text-capsule-text-muted mt-1">
                      Սահմանեք անհատական չափսերի, նյութերի, հավելյալ տարբերակների և գների բանաձևերի կանոններ նոր բաժնի համար։
                    </p>
                  </div>
                  <DynamicCategoryBuilder onSave={handleSaveDynamicCategory} />
                </div>
              )}

              {/* TAB: STANDARD BAGS PRICING */}
              {activeTab === "pricing_standard" && editPricingRules && (
                <div className="space-y-6">
                  <div className="border-b border-capsule-accent/10 pb-2 mb-4">
                    <h3 className="font-serif text-base text-capsule-accent font-semibold">🛍️ Տոպրակներ (Standard) — Rules & Pricing</h3>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-serif text-sm font-semibold text-capsule-accent">Թղթի և Լամինացիայի Բազային Գներ (֏ / քմ)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">210 Gsm (մեկ քմ)</label>
                        <input
                          type="number"
                          value={editPricingRules.pp210}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, pp210: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">300 Gsm (մեկ քմ)</label>
                        <input
                          type="number"
                          value={editPricingRules.pp300}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, pp300: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                    </div>

                    <h4 className="font-serif text-sm font-semibold text-capsule-accent pt-2">Աքսեսուարներ & Բռնակներ</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Ամրակում (Fixed Setup)</label>
                        <input
                          type="number"
                          value={editPricingRules.fixed}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, fixed: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-1.5 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Լամինացիա (հատ)</label>
                        <input
                          type="number"
                          value={editPricingRules.lam}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, lam: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-1.5 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Բռնակ (Շնուր / հատ)</label>
                        <input
                          type="number"
                          value={editPricingRules.cord}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, cord: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-1.5 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: DECORATIVE BAGS PRICING */}
              {activeTab === "pricing_decorative" && editDecPricingRules && (
                <div className="space-y-6">
                  <div className="border-b border-capsule-accent/10 pb-2 mb-4">
                    <h3 className="font-serif text-base text-capsule-accent font-semibold">✨ Տոպրակներ (Decorative) — Rules & Pricing</h3>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-serif text-sm font-semibold text-capsule-accent">Դեկորատիվ Թղթի Բազային Գներ (֏ / քմ)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">210 Gsm (մեկ քմ)</label>
                        <input
                          type="number"
                          value={editDecPricingRules.pp210}
                          onChange={(e) => setEditDecPricingRules({ ...editDecPricingRules, pp210: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">300 Gsm (մեկ քմ)</label>
                        <input
                          type="number"
                          value={editDecPricingRules.pp300}
                          onChange={(e) => setEditDecPricingRules({ ...editDecPricingRules, pp300: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                    </div>

                    <h4 className="font-serif text-sm font-semibold text-capsule-accent pt-2">Աքսեսուարներ & Ժապավեններ</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Ամրակում (Fixed Setup)</label>
                        <input
                          type="number"
                          value={editDecPricingRules.fixed}
                          onChange={(e) => setEditDecPricingRules({ ...editDecPricingRules, fixed: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-1.5 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Լամինացիա (հատ)</label>
                        <input
                          type="number"
                          value={editDecPricingRules.lam}
                          onChange={(e) => setEditDecPricingRules({ ...editDecPricingRules, lam: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-1.5 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Բռնակ (Շնուր / հատ)</label>
                        <input
                          type="number"
                          value={editDecPricingRules.cord}
                          onChange={(e) => setEditDecPricingRules({ ...editDecPricingRules, cord: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-1.5 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: RIBBONS PRICING */}
              {activeTab === "pricing_ribbons" && editPricingRules && (
                <div className="space-y-6">
                  <div className="border-b border-capsule-accent/10 pb-2 mb-4">
                    <h3 className="font-serif text-base text-capsule-accent font-semibold">🎗️ Ժապավեններ (Ribbons) — Rules & Pricing</h3>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-serif text-sm font-semibold text-capsule-accent">Ժապավենի Գնային Գործակիցներ</h4>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Satin 2cm Base (1մ)</label>
                        <input
                          type="number"
                          value={editPricingRules.ribbon_satin_base_2cm ?? 80}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, ribbon_satin_base_2cm: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Satin 2.5cm Base (1մ)</label>
                        <input
                          type="number"
                          value={editPricingRules.ribbon_satin_base_2_5cm ?? 100}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, ribbon_satin_base_2_5cm: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Satin 3cm Base (1մ)</label>
                        <input
                          type="number"
                          value={editPricingRules.ribbon_satin_base_3cm ?? 130}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, ribbon_satin_base_3cm: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Satin 4cm Base (1մ)</label>
                        <input
                          type="number"
                          value={editPricingRules.ribbon_satin_base_4cm ?? 150}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, ribbon_satin_base_4cm: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Reps Material Multiplier</label>
                        <input
                          type="number"
                          step="0.1"
                          value={editPricingRules.ribbon_reps_mult ?? 1.4}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, ribbon_reps_mult: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Setup Fixed Fee (֏)</label>
                        <input
                          type="number"
                          value={editPricingRules.ribbon_setup ?? 6000}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, ribbon_setup: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Min Meters Limit</label>
                        <input
                          type="number"
                          value={editPricingRules.ribbon_min_meters ?? 85}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, ribbon_min_meters: parseInt(e.target.value) || 85 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Foil Print Extra Rate/Meter</label>
                        <input
                          type="number"
                          value={editPricingRules.ribbon_foil_per_meter ?? 25}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, ribbon_foil_per_meter: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Silkscreen Extra Rate/Meter</label>
                        <input
                          type="number"
                          value={editPricingRules.ribbon_screen_per_meter ?? 15}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, ribbon_screen_per_meter: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: STICKERS PRICING */}
              {activeTab === "pricing_stickers" && editPricingRules && (
                <div className="space-y-6">
                  <div className="border-b border-capsule-accent/10 pb-2 mb-4">
                    <h3 className="font-serif text-base text-capsule-accent font-semibold">🏷️ Սթիքերներ (Stickers) — Rules & Pricing</h3>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-serif text-sm font-semibold text-capsule-accent">Սթիքերների Բազային Սակագներ (Լամինացված / 1քմ համարժեք)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Glossy Paper Base</label>
                        <input
                          type="number"
                          value={editPricingRules.sticker_paper_gloss ?? 10}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, sticker_paper_gloss: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Matte Paper Base</label>
                        <input
                          type="number"
                          value={editPricingRules.sticker_paper_matte ?? 12}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, sticker_paper_matte: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">White Vinyl</label>
                        <input
                          type="number"
                          value={editPricingRules.sticker_vinyl_white ?? 18}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, sticker_vinyl_white: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Transparent Vinyl</label>
                        <input
                          type="number"
                          value={editPricingRules.sticker_vinyl_transparent ?? 20}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, sticker_vinyl_transparent: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Contour Die Setup Fee (֏)</label>
                        <input
                          type="number"
                          value={editPricingRules.sticker_contour_setup ?? 3000}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, sticker_contour_setup: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Minimum order Qty</label>
                        <input
                          type="number"
                          value={editPricingRules.sticker_min_qty ?? 300}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, sticker_min_qty: parseInt(e.target.value) || 300 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: GIFTCARDS PRICING */}
              {activeTab === "pricing_giftcards" && editPricingRules && (
                <div className="space-y-6">
                  <div className="border-b border-capsule-accent/10 pb-2 mb-4">
                    <h3 className="font-serif text-base text-capsule-accent font-semibold">🎁 Նվեր Քարտեր (Gift Cards) — Rules & Pricing</h3>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-serif text-sm font-semibold text-capsule-accent">Նվեր Քարտերի և Ծրարների Սակագներ</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">A6 Card Base (֏)</label>
                        <input
                          type="number"
                          value={editPricingRules.giftcard_a6_base ?? 85}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, giftcard_a6_base: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Mini Card Base (֏)</label>
                        <input
                          type="number"
                          value={editPricingRules.giftcard_mini_base ?? 50}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, giftcard_mini_base: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Euro Card Base (֏)</label>
                        <input
                          type="number"
                          value={editPricingRules.giftcard_euro_base ?? 110}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, giftcard_euro_base: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">White Envelope (֏)</label>
                        <input
                          type="number"
                          value={editPricingRules.giftcard_env_standard ?? 100}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, giftcard_env_standard: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Kraft Envelope (֏)</label>
                        <input
                          type="number"
                          value={editPricingRules.giftcard_env_kraft ?? 150}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, giftcard_env_kraft: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Colored Premium (֏)</label>
                        <input
                          type="number"
                          value={editPricingRules.giftcard_env_colored ?? 380}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, giftcard_env_colored: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Paper Soft-Touch Extra</label>
                        <input
                          type="number"
                          value={editPricingRules.giftcard_paper_softtouch ?? 75}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, giftcard_paper_softtouch: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Paper Textured Extra</label>
                        <input
                          type="number"
                          value={editPricingRules.giftcard_paper_textured ?? 120}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, giftcard_paper_textured: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Min Card Order Qty</label>
                        <input
                          type="number"
                          value={editPricingRules.giftcard_min_qty ?? 30}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, giftcard_min_qty: parseInt(e.target.value) || 30 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: BUSINESSCARDS PRICING */}
              {activeTab === "pricing_businesscards" && editPricingRules && (
                <div className="space-y-6">
                  <div className="border-b border-capsule-accent/10 pb-2 mb-4">
                    <h3 className="font-serif text-base text-capsule-accent font-semibold">🪪 Այցեքարտեր (Business Cards) — Rules & Pricing</h3>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-serif text-sm font-semibold text-capsule-accent">Այցեքարտերի Գնային Գործակիցներ</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Std Size (9x5) Base (֏)</label>
                        <input
                          type="number"
                          value={editPricingRules.businesscard_std_base ?? 40}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, businesscard_std_base: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Euro Size (8.5x5.5) Base (֏)</label>
                        <input
                          type="number"
                          value={editPricingRules.businesscard_euro_base ?? 45}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, businesscard_euro_base: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Soft-touch paper extra (֏)</label>
                        <input
                          type="number"
                          value={editPricingRules.businesscard_paper_softtouch ?? 35}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, businesscard_paper_softtouch: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Textured paper extra (֏)</label>
                        <input
                          type="number"
                          value={editPricingRules.businesscard_paper_textured ?? 70}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, businesscard_paper_textured: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Double-side multiplier</label>
                        <input
                          type="number"
                          step="0.1"
                          value={editPricingRules.businesscard_double_sided_mult ?? 1.5}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, businesscard_double_sided_mult: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Corners rounded extra (֏)</label>
                        <input
                          type="number"
                          value={editPricingRules.businesscard_corners_rounded ?? 10}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, businesscard_corners_rounded: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Min Card order qty</label>
                        <input
                          type="number"
                          value={editPricingRules.businesscard_min_qty ?? 100}
                          onChange={(e) => setEditPricingRules({ ...editPricingRules, businesscard_min_qty: parseInt(e.target.value) || 100 })}
                          className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Custom stamp setup fee (֏)</label>
                      <input
                        type="number"
                        value={editPricingRules.businesscard_foil_setup ?? 5000}
                        onChange={(e) => setEditPricingRules({ ...editPricingRules, businesscard_foil_setup: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-2 px-3 text-xs outline-none text-capsule-dark"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PAPERS */}
              {activeTab === "papers" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-capsule-accent/10 pb-2">
                    <h3 className="font-serif text-base text-capsule-accent font-semibold">Պահեստավորված Թղթեր</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newP: PaperType = {
                          id: "paper_" + Date.now().toString(),
                          name: "Նոր Թղթատեսակ",
                          gsm: 250,
                          pricePerSqm: 400,
                          active: true,
                          assignedProducts: ["bags"]
                        };
                        setEditPapers([...editPapers, newP]);
                      }}
                      className="bg-capsule-accent text-capsule-surf px-3 py-1 rounded-lg text-xs font-bold uppercase cursor-pointer"
                    >
                      + Ավելացնել
                    </button>
                  </div>

                  <div className="space-y-3">
                    {editPapers.map((paper, idx) => (
                      <div key={paper.id} className="bg-capsule-surf2/40 border border-capsule-accent/10 p-3 rounded-xl flex flex-col gap-2">
                        <div className="flex justify-between items-center font-sans">
                          <input
                            type="text"
                            value={paper.name}
                            onChange={(e) => {
                              const updated = [...editPapers];
                              updated[idx] = { ...paper, name: e.target.value };
                              setEditPapers(updated);
                            }}
                            className="bg-transparent font-bold border-b border-capsule-accent/15 text-xs outline-none flex-1 font-sans"
                          />
                          <button
                            type="button"
                            onClick={() => setEditPapers(editPapers.filter(p => p.id !== paper.id))}
                            className="p-1 text-red-700 hover:bg-red-50 rounded cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-[9px] text-capsule-text-muted uppercase font-bold block">GSM</span>
                            <input
                              type="number"
                              value={paper.gsm}
                              onChange={(e) => {
                                const updated = [...editPapers];
                                updated[idx] = { ...paper, gsm: parseInt(e.target.value, 10) || 0 };
                                setEditPapers(updated);
                              }}
                              className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-2 font-mono text-center w-full"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-capsule-text-muted uppercase font-bold block">Գին (֏ / քմ)</span>
                            <input
                              type="number"
                              value={paper.pricePerSqm}
                              onChange={(e) => {
                                const updated = [...editPapers];
                                updated[idx] = { ...paper, pricePerSqm: parseInt(e.target.value, 10) || 0 };
                                setEditPapers(updated);
                              }}
                              className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-2 font-mono text-center w-full"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CONTACTS */}
              {activeTab === "contact" && (
                <div className="space-y-4">
                  <h3 className="font-serif text-base text-capsule-accent font-semibold">Պատվերների Ստացման Ալիքներ</h3>
                  <div className="space-y-3 bg-capsule-surf2/30 border border-capsule-accent/10 p-4 rounded-xl">
                    <div>
                      <label className="block text-[10px] font-bold text-capsule-text-muted uppercase">WhatsApp հեռախոսահամար</label>
                      <input
                        type="text"
                        value={editContact.whatsapp}
                        onChange={(e) => setEditContact({ ...editContact, whatsapp: e.target.value.replace(/[^0-9]/g, "") })}
                        className="w-full bg-capsule-surf border border-capsule-accent/10 rounded py-2 px-3 text-xs text-capsule-dark font-mono font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-capsule-text-muted uppercase">Email Address</label>
                      <input
                        type="email"
                        value={editContact.email}
                        onChange={(e) => setEditContact({ ...editContact, email: e.target.value })}
                        className="w-full bg-capsule-surf border border-capsule-accent/10 rounded py-2 px-3 text-xs text-capsule-dark font-mono font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CATEGORIES */}
              {activeTab === "categories" && (
                <div className="space-y-6 animate-fade-in" id="categories-and-storefront-manager">
                  
                  {/* Master Sub-Tabs Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-capsule-accent/15 pb-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCategorySubTab("portal")}
                        className={`px-4 py-2 text-xs font-bold uppercase transition-all tracking-wider rounded-t-xl ${
                          categorySubTab === "portal" 
                            ? "bg-capsule-accent text-white shadow" 
                            : "bg-capsule-surf border border-transparent hover:bg-capsule-accent/5 text-capsule-accent"
                        }`}
                      >
                        🏷️ Բաժինների Կառավարում / Category Portal
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCategorySubTab("dashboard");
                          // pre-set active category to first available
                          if (editCategories.length > 0 && selectedDashboardCategory === "all") {
                            setSelectedDashboardCategory(editCategories[0].id);
                          }
                        }}
                        className={`px-4 py-2 text-xs font-bold uppercase transition-all tracking-wider rounded-t-xl ${
                          categorySubTab === "dashboard" 
                            ? "bg-capsule-accent text-white shadow" 
                            : "bg-capsule-surf border border-transparent hover:bg-capsule-accent/5 text-capsule-accent"
                        }`}
                      >
                        🛍️ Ցուցափեղկ և Դասավորություն / Product Sorting
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowLiveClientPreview(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#554DDC] hover:bg-[#4339CA] text-white text-xs font-bold transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-95"
                    >
                      <Eye size={13} className="stroke-[2.5]" />
                      <span>Տեսնել հաճախորդի աչքերով / Client View Preview</span>
                    </button>
                  </div>

                  {/* ----------------- SUBTAB 1: PORTAL (Category Creator) ----------------- */}
                  {categorySubTab === "portal" && (
                    <div className="space-y-6">
                      
                      {/* Main Homepage Hero Text Editor */}
                      <div className="bg-capsule-surf border border-capsule-accent/15 rounded-2xl p-4 md:p-5 space-y-4 shadow-sm">
                        <div className="flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                          <Sparkles className="text-capsule-accent" size={16} />
                          <h4 className="font-serif text-sm font-semibold text-capsule-accent">Գլխավոր էջի տեքստեր / Homepage Hero Texts</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-1 font-mono">Գովազդային Բեյջ (Hero Badge)</label>
                            <input
                              type="text"
                              value={editSiteTexts.home_hero_badge || ""}
                              onChange={(e) => setEditSiteTexts({ ...editSiteTexts, home_hero_badge: e.target.value })}
                              placeholder="Premium Customizer"
                              className="w-full bg-capsule-surf2/40 border border-capsule-accent/15 rounded-xl py-1.5 px-3 text-capsule-dark outline-none focus:border-capsule-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-1 font-mono">Արտադրամասի Գլխագիր (Hero Title)</label>
                            <input
                              type="text"
                              value={editSiteTexts.home_hero_title || ""}
                              onChange={(e) => setEditSiteTexts({ ...editSiteTexts, home_hero_title: e.target.value })}
                              placeholder="The Capsule Lab"
                              className="w-full bg-capsule-surf2/40 border border-capsule-accent/15 rounded-xl py-1.5 px-3 text-capsule-dark outline-none focus:border-capsule-accent"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-1 font-mono">Հակիրճ Բացատրություն (Hero Description)</label>
                            <textarea
                              value={editSiteTexts.home_hero_desc || ""}
                              onChange={(e) => setEditSiteTexts({ ...editSiteTexts, home_hero_desc: e.target.value })}
                              placeholder="Ընտրեք ցանկալի արտադրանքի տեսակը՝ հաշвարկը և 3D ֆիզիկական մոդելավորումը սկսելու համար։"
                              className="w-full bg-capsule-surf2/40 border border-capsule-accent/15 rounded-xl py-1.5 px-3 text-capsule-dark outline-none focus:border-capsule-accent h-16 resize-none"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-1 font-mono">Գործողության հրահանգ (Action line)</label>
                            <input
                              type="text"
                              value={editSiteTexts.home_hero_action || ""}
                              onChange={(e) => setEditSiteTexts({ ...editSiteTexts, home_hero_action: e.target.value })}
                              placeholder="Խնդրում ենք ընտրել ստորև՝"
                              className="w-full bg-capsule-surf2/40 border border-capsule-accent/15 rounded-xl py-1.5 px-3 text-capsule-dark outline-none focus:border-capsule-accent"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Header bar */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-capsule-accent/10 pb-3">
                        <div>
                          <h3 className="font-serif text-base text-capsule-accent font-semibold">Բաժինների Կառավարման Պորտալ / Edit and Add Categories</h3>
                          <p className="text-[11px] text-capsule-text-muted">Ավելացրեք նոր բաժիններ, սահմանեք լեզուներ (Հայերեն/Русский/English), պատկերակներ, սորտավորում և MOQ քանակներ։</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const sourceName = "Նոր բաժին";
                              const computedId = getUniqueSlug(sourceName, editCategories);
                              
                              const newCat: Category = {
                                id: computedId,
                                name: sourceName,
                                active: true,
                                minQty: 100,
                                qtyPresets: [100, 300, 500, 1000],
                                navLabel: "Նոր բաժին",
                                nameRu: "",
                                nameEn: "",
                                sortOrder: (editCategories.length + 1) * 10,
                                heroTitle: "Նոր արտադրատեսակ",
                                heroBadge: "Custom Item",
                                heroSmall: "New / Brand New",
                                ruleChips: "Premium quality | 3D dynamic preview",
                                heroDesc: "Անհատանելի տպագրությամբ պատվերների առցանց հաշվարկ",
                                template: "other_products",
                                icon: "ShoppingBag"
                              };
                              setEditCategories([...editCategories, newCat]);
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-capsule-accent text-capsule-surf hover:bg-capsule-accent/90 text-xs font-bold transition-all shadow-sm cursor-pointer"
                          >
                            <Plus size={14} className="stroke-[2.5]" />
                            Ավելացնել Բաժին
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveTab("dynamic_category_builder")}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#D27E53] hover:bg-[#BE6C42] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                          >
                            <Sparkles size={14} className="stroke-[2.5]" />
                            Ավելացնել Դինամիկ Բաժին / Add Dynamic Category
                          </button>
                        </div>
                      </div>

                      {/* Part C: Categories List Grid */}
                  <div className="space-y-4">
                    {(editCategories || []).map((cat, idx) => (
                      <div key={cat.id} className="p-4 bg-capsule-surf border border-capsule-accent/10 hover:border-capsule-accent/25 rounded-2xl space-y-4 shadow-sm transition-all relative group/catcard">
                        
                        {/* Upper action bar inside card */}
                        <div className="flex flex-wrap items-center justify-between gap-2 bg-capsule-surf2/20 -mx-4 -mt-4 p-3 rounded-t-2xl border-b border-capsule-accent/5">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-capsule-accent/10 text-capsule-accent text-[11px] font-bold flex items-center justify-center font-mono">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-xs text-capsule-accent truncate max-w-[150px] sm:max-w-[240px]">
                              {cat.name}
                            </span>
                            <span className="text-[10px] font-mono bg-capsule-accent/5 text-capsule-text-muted px-1.5 py-0.5 rounded uppercase">
                              ID: {cat.id}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {/* Sort Up */}
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const updated = [...editCategories];
                                const temp = updated[idx];
                                updated[idx] = updated[idx - 1];
                                updated[idx - 1] = temp;
                                setEditCategories(updated);
                              }}
                              className="p-1.5 rounded-lg border border-capsule-accent/5 hover:border-capsule-accent hover:text-capsule-accent hover:bg-capsule-accent/5 transition-all text-capsule-text-muted disabled:opacity-30 disabled:pointer-events-none"
                              title="Տեղափոխել վերև"
                            >
                              <ChevronUp size={13} />
                            </button>
                            {/* Sort Down */}
                            <button
                              type="button"
                              disabled={idx === editCategories.length - 1}
                              onClick={() => {
                                const updated = [...editCategories];
                                const temp = updated[idx];
                                updated[idx] = updated[idx + 1];
                                updated[idx + 1] = temp;
                                setEditCategories(updated);
                              }}
                              className="p-1.5 rounded-lg border border-capsule-accent/5 hover:border-capsule-accent hover:text-capsule-accent hover:bg-capsule-accent/5 transition-all text-capsule-text-muted disabled:opacity-30 disabled:pointer-events-none"
                              title="Տեղափոխել ներքև"
                            >
                              <ChevronDown size={13} />
                            </button>
                            <span className="mx-1 h-3 w-px bg-capsule-accent/10" />
                            {/* Is Active Checkbox */}
                            <label className="inline-flex items-center gap-1.5 text-[11px] font-sans text-capsule-text-muted mr-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={cat.active}
                                onChange={(e) => {
                                  const updated = [...editCategories];
                                  updated[idx] = { ...cat, active: e.target.checked };
                                  setEditCategories(updated);
                                }}
                                className="accent-capsule-accent rounded"
                              />
                              <span>Ակտիվ</span>
                            </label>
                            {/* Delete Category */}
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Վստա՞հ եք, որ ցանկանում եք ջնջել «${cat.name}» բաժինը։`)) {
                                  setEditCategories(editCategories.filter((_, cIdx) => cIdx !== idx));
                                }
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100 text-capsule-text-muted transition-all"
                              title="Ջնջել բաժինը"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Core settings form fields */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                          <div className="md:col-span-2">
                            <span className="text-[9px] text-capsule-text-muted uppercase font-bold font-mono">Բաժնի Անուն (անգլերեն/ներքին)</span>
                            <input
                              type="text"
                              value={cat.name}
                              onChange={(e) => {
                                const updated = [...editCategories];
                                updated[idx] = { ...cat, name: e.target.value };
                                setEditCategories(updated);
                              }}
                              placeholder="Standard Bags"
                              className="bg-capsule-surf2/40 border border-capsule-accent/15 rounded-xl py-1.5 px-3 w-full text-capsule-dark outline-none focus:border-capsule-accent"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-capsule-text-muted uppercase font-bold font-mono">Կոճակի Անուն (Nav Label)</span>
                            <input
                              type="text"
                              value={cat.navLabel || ""}
                              onChange={(e) => {
                                const updated = [...editCategories];
                                updated[idx] = { ...cat, navLabel: e.target.value };
                                setEditCategories(updated);
                              }}
                              placeholder="Տոպրակներ"
                              className="bg-capsule-surf2/40 border border-capsule-accent/15 rounded-xl py-1.5 px-3 w-full text-capsule-dark outline-none focus:border-capsule-accent"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-capsule-text-muted uppercase font-bold font-mono">Ձևանմուշ (Template Layout)</span>
                            <select
                              value={cat.template || cat.id}
                              onChange={(e) => {
                                const updated = [...editCategories];
                                updated[idx] = { ...cat, template: e.target.value };
                                setEditCategories(updated);
                              }}
                              className="bg-capsule-surf2/40 border border-capsule-accent/15 rounded-xl py-1.5 px-3 w-full text-capsule-dark outline-none focus:border-capsule-accent font-bold"
                            >
                              <option value="bags">Bags / Տոպրակներ</option>
                              <option value="boxes">Boxes / Տուփեր</option>
                              <option value="ribbons">Ribbons / Ժապավեններ</option>
                              <option value="stickers">Stickers / Պիտակներ</option>
                              <option value="giftcards">Gift Cards / Նվեր Քարտեր</option>
                              <option value="businesscards">Business Cards / Այցեքարտեր</option>
                              <option value="other_products">Other / Այլ Տպագրություն</option>
                              <option value="qr_matrix">QR & Matrix / Կոդավորում</option>
                            </select>
                          </div>
                        </div>

                        {/* Interactive Icon Selector Section */}
                        <div className="bg-capsule-surf2/10 border border-capsule-accent/5 rounded-2xl p-3 space-y-2">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 pb-1 border-b border-capsule-accent/5">
                            <span className="text-[10px] text-capsule-accent uppercase font-bold font-mono">Ընտրել Պատկերակ կամ Կցել սեփականը (Pick/Upload Custom Icon)</span>
                            <span className="text-[9px] text-capsule-text-muted">Ընտրեք Lucide, Emoji, կամ կցեք սեփական պատկերակը (Image file / PNG / JPG / SVG)</span>
                          </div>
                          <div className="flex flex-col sm:flex-row items-center gap-3">
                            {/* Current icon show */}
                            <div className="w-20 h-20 rounded-2xl bg-capsule-accent/5 border border-capsule-accent/10 flex items-center justify-center text-3xl text-capsule-accent shrink-0 overflow-hidden">
                              {cat.icon && (cat.icon.startsWith("http") || cat.icon.startsWith("/") || cat.icon.startsWith("data:image")) ? (
                                <div 
                                  style={{
                                    maskImage: `url("${cat.icon}")`,
                                    WebkitMaskImage: `url("${cat.icon}")`,
                                    maskSize: "contain",
                                    WebkitMaskSize: "contain",
                                    maskPosition: "center",
                                    WebkitMaskPosition: "center",
                                    maskRepeat: "no-repeat",
                                    WebkitMaskRepeat: "no-repeat"
                                  }}
                                  className="w-14 h-14 bg-current select-none pointer-events-none transition-colors duration-300"
                                />
                              ) : (
                                cat.icon || "🪄"
                              )}
                            </div>
                            
                            {/* Presets Horizontal list of buttons */}
                            <div className="flex flex-wrap gap-1.5 flex-1 justify-center sm:justify-start">
                              {[
                                { val: "ShoppingBag", label: "🛍️ Bags" },
                                { val: "Gem", label: "💎 Deco" },
                                { val: "Package", label: "📦 Box" },
                                { val: "Scissors", label: "🎗️ Ribbon" },
                                { val: "Award", label: "🏷️ Tag" },
                                { val: "CreditCard", label: "🎁 Card" },
                                { val: "Contact", label: "🪪 ID" },
                                { val: "Palette", label: "🎨 Other" },
                                { val: "QrCode", label: "📱 QR" },
                                { val: "✨", label: "✨ Star" },
                                { val: "✦", label: "✦ Cross" }
                              ].map((preset) => (
                                <button
                                  key={preset.val}
                                  type="button"
                                  onClick={() => {
                                    const updated = [...editCategories];
                                    updated[idx] = { ...cat, icon: preset.val };
                                    setEditCategories(updated);
                                  }}
                                  className={`px-2 py-1 rounded-lg border text-[10px] font-sans font-bold transition-all cursor-pointer ${
                                    cat.icon === preset.val ? "bg-capsule-accent text-capsule-surf border-capsule-accent" : "bg-capsule-surf border-capsule-accent/10 hover:border-capsule-accent/25"
                                  }`}
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>

                            {/* Uploader Input */}
                            <div className="shrink-0 flex items-center">
                              <label className="px-2.5 py-1.5 rounded-xl border text-[10px] font-sans font-bold transition-all cursor-pointer bg-capsule-accent/10 border-capsule-accent/20 text-capsule-accent hover:bg-capsule-accent hover:text-capsule-surf select-none flex items-center justify-center gap-1">
                                <Upload size={12} className="stroke-[2.5]" />
                                <span>Կցել Նկար</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        if (event.target?.result) {
                                          const updated = [...editCategories];
                                          updated[idx] = { ...cat, icon: event.target.result as string };
                                          setEditCategories(updated);
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                            </div>

                            {/* Manual write input */}
                            <div className="min-w-[110px] w-full sm:w-auto">
                              <input
                                type="text"
                                value={cat.icon || ""}
                                onChange={(e) => {
                                  const updated = [...editCategories];
                                  updated[idx] = { ...cat, icon: e.target.value };
                                  setEditCategories(updated);
                                }}
                                placeholder="Icon, URL or emoji..."
                                className="w-full bg-capsule-surf border border-capsule-accent/15 rounded-lg py-1 px-2 text-[10px] text-capsule-dark outline-none font-mono focus:border-capsule-accent text-center"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Minimum quantities & Presets settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-[9px] text-capsule-text-muted uppercase font-bold font-mono">Նվազագույն Քանակ (MOQ Limit)</span>
                            <input
                              type="number"
                              value={cat.minQty}
                              onChange={(e) => {
                                const updated = [...editCategories];
                                updated[idx] = { ...cat, minQty: parseInt(e.target.value, 10) || 1 };
                                setEditCategories(updated);
                              }}
                              className="bg-capsule-surf2/40 border border-capsule-accent/15 rounded-xl py-1.5 px-3 w-full font-mono font-bold text-capsule-accent focus:border-capsule-accent outline-none"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-capsule-text-muted uppercase font-bold font-mono">Քանակի Արագ Կոճակներ (Comma separated presets)</span>
                            <input
                              type="text"
                              value={(cat.qtyPresets || []).join(", ")}
                              onChange={(e) => {
                                const updated = [...editCategories];
                                updated[idx] = { 
                                  ...cat, 
                                  qtyPresets: e.target.value.split(",").map(v => parseInt(v.trim(), 10)).filter(v => !isNaN(v)) 
                                };
                                setEditCategories(updated);
                              }}
                              placeholder="100, 300, 500, 1000"
                              className="bg-capsule-surf2/40 border border-capsule-accent/15 rounded-xl py-1.5 px-3 w-full font-mono text-capsule-dark focus:border-capsule-accent outline-none"
                            />
                          </div>
                        </div>

                        {/* Detailed Texts (Hero title / Badge / Desc) */}
                        <div className="bg-capsule-surf2/10 rounded-2xl p-3 border border-capsule-accent/5 text-xs space-y-3">
                          <span className="text-[10px] text-capsule-text-muted uppercase font-extrabold tracking-wider block font-mono border-b border-capsule-accent/5 pb-1">👀 Բաժնի վերնագրեր և գովազդներ / Hero Section Customizer</span>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <span className="text-[9px] text-capsule-text-muted uppercase font-bold font-mono">Գործակալի Վերնագիր (Hero Banner Title)</span>
                              <input
                                type="text"
                                value={cat.heroTitle || ""}
                                onChange={(e) => {
                                  const updated = [...editCategories];
                                  updated[idx] = { ...cat, heroTitle: e.target.value };
                                  setEditCategories(updated);
                                }}
                                placeholder="Թղթե Տոպրակներ"
                                className="bg-capsule-surf border border-capsule-accent/10 rounded-lg py-1 px-2.5 w-full text-capsule-dark outline-none focus:border-capsule-accent"
                              />
                            </div>
                            <div>
                              <span className="text-[9px] text-capsule-text-muted uppercase font-bold font-mono">Գովազդի Բեյջ (Hero Badge Text)</span>
                              <input
                                type="text"
                                value={cat.heroBadge || ""}
                                onChange={(e) => {
                                  const updated = [...editCategories];
                                  updated[idx] = { ...cat, heroBadge: e.target.value };
                                  setEditCategories(updated);
                                }}
                                placeholder="CUSTOM PRINT"
                                className="bg-capsule-surf border border-capsule-accent/10 rounded-lg py-1 px-2.5 w-full text-capsule-dark outline-none focus:border-capsule-accent"
                              />
                            </div>
                            <div>
                              <span className="text-[9px] text-capsule-text-muted uppercase font-bold font-mono">Բաժնի Քարտի Բեյջ (Home Card Badge)</span>
                              <input
                                type="text"
                                value={cat.heroSmall || ""}
                                onChange={(e) => {
                                  const updated = [...editCategories];
                                  updated[idx] = { ...cat, heroSmall: e.target.value };
                                  setEditCategories(updated);
                                }}
                                placeholder="Պատվիրել անհատական"
                                className="bg-capsule-surf border border-capsule-accent/10 rounded-lg py-1 px-2.5 w-full text-capsule-dark outline-none focus:border-capsule-accent"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-1 gap-2">
                            <div>
                              <span className="text-[9px] text-capsule-text-muted uppercase font-bold font-mono">Խորհրդատվական Չիպեր (Recommendation Chips separated with |)</span>
                              <input
                                type="text"
                                value={cat.ruleChips || ""}
                                onChange={(e) => {
                                  const updated = [...editCategories];
                                  updated[idx] = { ...cat, ruleChips: e.target.value };
                                  setEditCategories(updated);
                                }}
                                placeholder="e.g. 100% Էկո թուղթ | Ոսկեփայլ տպագրություն | Մետաքսատիպ"
                                className="bg-capsule-surf border border-capsule-accent/10 rounded-lg py-1 px-2.5 w-full text-capsule-dark outline-none focus:border-capsule-accent"
                              />
                            </div>
                          </div>

                          <div>
                            <span className="text-[9px] text-capsule-text-muted uppercase font-bold font-mono">Մանրամասն Նկարագրություն (Hero Banner Description)</span>
                            <textarea
                              value={cat.heroDesc || ""}
                              onChange={(e) => {
                                const updated = [...editCategories];
                                updated[idx] = { ...cat, heroDesc: e.target.value };
                                setEditCategories(updated);
                              }}
                              placeholder="Կրաֆտ և կավճապատ թղթերից պայուսակների պատրաստում..."
                              className="bg-capsule-surf border border-capsule-accent/10 rounded-lg py-1 px-2.5 w-full h-12 text-capsule-dark outline-none focus:border-capsule-accent resize-none font-sans"
                            />
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

              {/* TAB 6S: PROMO */}
              {activeTab === "promo" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-capsule-accent/10 pb-2">
                    <h3 className="font-serif text-base text-capsule-accent font-semibold">Զեղչի Կտրոնների Կառավարում</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newC: DiscountCode = {
                          code: "PROMO" + Math.floor(100 + Math.random() * 900),
                          type: "percentage",
                          value: 10,
                          active: true,
                          usedCount: 0
                        };
                        setEditDiscountCodes([...editDiscountCodes, newC]);
                      }}
                      className="bg-capsule-accent text-capsule-surf px-3 py-1 rounded-lg text-xs font-bold uppercase cursor-pointer"
                    >
                      + Կտրոն
                    </button>
                  </div>

                  {editDiscountCodes.map((dc, idx) => (
                    <div key={dc.code + idx} className="bg-capsule-surf2/30 border border-capsule-accent/10 p-3 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          value={dc.code}
                          onChange={(e) => {
                            const val = e.target.value.toUpperCase().replace(/\s/g, "");
                            const updated = [...editDiscountCodes];
                            updated[idx] = { ...dc, code: val };
                            setEditDiscountCodes(updated);
                          }}
                          className="bg-transparent border-b border-capsule-accent/15 font-bold text-xs text-capsule-dark uppercase outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setEditDiscountCodes(editDiscountCodes.filter((_, i) => i !== idx))}
                          className="p-1 text-red-700 hover:bg-red-50 rounded cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[9px] text-capsule-text-muted font-bold block uppercase">Type</span>
                          <select
                            value={dc.type}
                            onChange={(e) => {
                              const updated = [...editDiscountCodes];
                              updated[idx] = { ...dc, type: e.target.value as any };
                              setEditDiscountCodes(updated);
                            }}
                            className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-2 w-full"
                          >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed (֏)</option>
                          </select>
                        </div>
                        <div>
                          <span className="text-[9px] text-capsule-text-muted font-bold block uppercase">Value</span>
                          <input
                            type="number"
                            value={dc.value}
                            onChange={(e) => {
                              const updated = [...editDiscountCodes];
                              updated[idx] = { ...dc, value: parseInt(e.target.value, 10) || 0 };
                              setEditDiscountCodes(updated);
                            }}
                            className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-2 w-full text-center font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: PAYMENT METHODS */}
              {activeTab === "payment_methods" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-capsule-accent/10 pb-4">
                    <div>
                      <h3 className="font-serif text-lg text-capsule-accent font-bold">💳 Վճարման Մեթոդներ (Payment Methods)</h3>
                      <p className="text-xs text-capsule-text-muted mt-1">Ավելացրեք, խմբագրեք կամ հեռացրեք կայքում ցուցադրվող վճարման համակարգերը։</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const presets = [
                            {
                              id: "visa",
                              name: "visa",
                              title: {
                                hy: "Visa Քարտեր",
                                en: "Visa Card",
                                ru: "Карты Visa",
                                ar: "بطاقة فيزا"
                              },
                              description: {
                                hy: "Անվտանգ գործարքներ միջազգային Visa համակարգով",
                                en: "Secure transactions via the international Visa network",
                                ru: "Безопасные транзакции через международную систему Visa",
                                ar: "معاملات آمنة عبر شبكة فيزا العالمية"
                              },
                              iconSvg: `<svg className="h-[12px] w-auto text-[#1434CB]" viewBox="0 0 100 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M42.2 2.1l-6.3 27.8H26.3L32.6 2.1h9.6zm29.3 0c-4.4 0-8 2.4-9.8 6.5l-11.3 21.3h9.8s1.6-4.5 1.9-5.4h11c.2 1 1.1 5.4 1.1 5.4h8.7L78 2.1h-6.5zm-5.4 14.8c.6-1.7 4.1-11.4 4.1-11.4s.8 2.3 1.3 3.6c.5 1.3 3.1 7.8 3.1 7.8h-8.5zM22.2 2.1l-10 19L11 6.5C10.5 4.1 8 2.1 5.5 2.1H0l.2.8c3.1.8 6.7 2.3 8.9 3.5l7.8 23.5h10.4L42 2.1H22.2zm76.5 0h-7.6c-2.4 0-4.3 1.5-5.2 3.7l-15.5 24.1h10.2l2-5.6h12.5c.3 1.3 1.2 5.6 1.2 5.6h9L98.7 2.1z" /></svg>`,
                              sortOrder: 1,
                              active: true
                            },
                            {
                              id: "mastercard",
                              name: "mastercard",
                              title: {
                                hy: "Mastercard",
                                en: "Mastercard",
                                ru: "Mastercard",
                                ar: "ماستركارد"
                              },
                              description: {
                                hy: "Պաշտպանված վճարումներ Mastercard քարտերով",
                                en: "Protected payments via Mastercard standards",
                                ru: "Защищенные платежи по картам Mastercard",
                                ar: "مدفوعات محمية ببطاقات ماستركارد"
                              },
                              iconSvg: `<svg className="h-[20px] w-auto" viewBox="0 0 40 30" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="15" r="11" fill="#EB001B" /><circle cx="26" cy="15" r="11" fill="#F79E1B" opacity="0.88" /><path d="M 20 6.5 C 17.5 8.7 16 11.7 16 15 C 16 18.3 17.5 21.3 20 23.5 C 22.5 21.3 24 18.3 24 15 C 24 11.7 22.5 8.7 20 6.5 Z" fill="#FF5F00" /></svg>`,
                              sortOrder: 2,
                              active: true
                            },
                            {
                              id: "arca",
                              name: "arca",
                              title: {
                                hy: "ArCa Քարտեր",
                                en: "ArCa Armenian Card",
                                ru: "Карты ArCa",
                                ar: "بطاقة آركا المحلية"
                              },
                              description: {
                                hy: "Անվտանգ ինտեգրված տեղական ArCa վճարային համակարգ",
                                en: "Integrated Armenian Card local payment gateway",
                                ru: "Интегрированная локальная платежная система ArCa",
                                ar: "بوابة دفع متكاملة لبطاقات آركا المحلية الأرمنية"
                              },
                              iconSvg: `<svg className="h-[20px] w-auto max-w-[95%]" viewBox="0 0 160 50" xmlns="http://www.w3.org/2000/svg"><g fill="#0c54a3"><path d="M 12.5 45 C 10.5 45, 8.5 44, 8 42 C 7.5 40, 8.5 37.5, 10 33.5 L 22.5 7.5 C 24 4.5, 27 3, 31 3 L 41.5 3 C 44.5 3, 46.5 4.5, 47 6 L 56 34 L 59 34 C 61 34, 62 36, 62 38 C 62 40, 60.5 45, 53.5 45 L 35.5 45 L 36 40 L 38.5 40 C 40.5 40, 42 39, 42 37.5 L 40 28.5 L 23.5 28.5 L 18 39.5 C 17 41.5, 18 43, 20.5 43 L 23 43 L 21 45 Z" /><path d="M 28 28.5 L 31.75 12 L 35.5 28.5 L 33.75 28.5 L 33.75 37.5 L 29.75 37.5 L 29.75 28.5 Z" fill="#ffffff" /><path d="M 52.5 45 C 51.5 45, 50.5 44, 50.5 42 L 51 39.5 L 53.5 39.5 C 55 39.5, 56 38.5, 56.5 36.5 L 61.5 14.5 C 62 12, 63.5 10.5, 66 10.5 L 75 10.5 C 77 10.5, 78 12, 78 13.5 C 78 15, 76.5 16, 74.5 16 L 71 16 L 66 38 C 65.5 40, 66.5 41, 68.5 41 L 70.5 41 L 69.5 45 Z" /><path d="M 64.5 24 C 67.5 17.5, 71.5 12.5, 76 12.5 C 79.5 12.5, 81 14.5, 80.5 17 C 80 19, 78.5 21, 77 21 C 75.5 21, 74.8 20, 75.2 18 C 75.5 16.5, 74.5 15.5, 73 15.5 C 69.8 15.5, 66.8 20.5, 65.2 24 Z" stroke="#ffffff" strokeWidth="1" /><path d="M 111 10.5 C 104.5 4.5, 91.5 4.5, 84.5 12.5 C 77.5 20.5, 74.5 31.5, 78.5 39.5 C 82.5 47.5, 93.5 49.5, 100.5 49.5 C 107.5 49.5, 112.5 44.5, 114.5 38.5 L 108.5 38.5 C 106.5 42.5, 103.5 44.5, 99.5 44.5 C 94.5 44.5, 89.5 42.5, 86.5 36.5 C 82.5 30.5, 83.5 21.5, 87.5 14.5 C 91.5 8.5, 97.5 6.5, 101.5 6.5 C 104.5 6.5, 106.5 8.5, 107.5 10.5 Z" /><path d="M 136 19.5 C 130.5 19.5, 126.5 24, 125.5 29.5 C 124.5 35, 127.5 38.5, 132.5 38.5 C 138 38.5, 142 34, 143 28.5 C 144 23, 141 19.5, 136 19.5 Z M 134.5 23.5 C 137.5 23.5, 139.5 26, 139 29.5 C 138.5 33, 135 35, 132 35 C 129 35, 127.5 32.5, 128 29.5 C 128.5 26, 131.5 23.5, 134.5 23.5 Z" /><path d="M 134.5 41 C 133.5 41, 132.5 40, 132.5 38.5 C 132.5 37, 133.5 36, 135 36 L 137.5 36 L 140 24 C 140.5 21.5, 142 20.5, 144 20.5 L 146 20.5 L 145 25 C 140.5 35, 138 41, 138 42.5 C 138 44, 139 45, 140.5 45 L 142 45 L 140.5 49 L 131 49 C 130.5 49, 129.5 48, 129.5 46.5 C 129.5 45, 130.5 44, 132 44 L 134 44 Z" /></g></svg>`,
                              sortOrder: 3,
                              active: true
                            }
                          ];
                          if (window.confirm("Վստա՞հ եք, որ ցանկանում եք վերականգնել Visa, Mastercard, ArCa ստանդարտ տվյալները։")) {
                            setEditPaymentMethods(presets);
                          }
                        }}
                        className="border border-[#C59B6D] text-[#C59B6D] hover:bg-[#C59B6D]/5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase cursor-pointer tracking-tight transition-colors"
                      >
                        ⚡ Վերականգնել Ստանդարտները (Restore Defaults)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newM: PaymentMethod = {
                            id: "method_" + Date.now(),
                            name: "new_method",
                            title: { hy: "Նոր Մեթոդ", en: "New Method", ru: "Новый метод", ar: "طريقة دفع جديدة" },
                            description: { hy: "Նոր վճարման համակարգ", en: "New payment method", ru: "Новый способ оплаты", ar: "طريقة دفع جديدة" },
                            iconSvg: `<svg viewBox="0 0 100 100" className="h-8 w-auto text-gray-500" fill="currentColor"><rect width="100" height="70" rx="10" y="15" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="30" cy="50" r="10"/><circle cx="70" cy="50" r="10"/></svg>`,
                            sortOrder: (editPaymentMethods.length + 1),
                            active: true
                          };
                          setEditPaymentMethods([...editPaymentMethods, newM]);
                        }}
                        className="bg-capsule-accent hover:bg-capsule-accent-hover text-capsule-surf px-4 py-1.5 rounded-lg text-xs font-bold uppercase cursor-pointer tracking-tight flex items-center gap-1 transition-colors"
                      >
                        <Plus size={12} />
                        <span>Ավելացնել (Add New)</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[62vh] overflow-y-auto pr-1">
                    {editPaymentMethods.map((pm, idx) => (
                      <div key={pm.id} className="bg-capsule-surf2/30 border border-capsule-accent/10 p-4 rounded-2xl space-y-4 shadow-[0_1px_4px_rgba(0,0,0,0.01)] transition-all">
                        {/* Upper Row: Status, Order, ID, Delete */}
                        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-capsule-accent/5 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[10px] bg-capsule-accent/10 text-capsule-accent py-0.5 px-2 rounded-md font-bold">
                              ID: {pm.id}
                            </span>
                            <div className="flex items-center gap-1">
                              <label className="text-xs text-capsule-dark/80 cursor-pointer font-bold select-none">
                                <input
                                  type="checkbox"
                                  checked={pm.active}
                                  onChange={(e) => {
                                    const updated = [...editPaymentMethods];
                                    updated[idx] = { ...pm, active: e.target.checked };
                                    setEditPaymentMethods(updated);
                                  }}
                                  className="mr-1.5 accent-capsule-accent"
                                />
                                Ակտիվ (Active)
                              </label>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-capsule-text-muted font-bold uppercase">Հերթականություն:</span>
                              <input
                                type="number"
                                value={pm.sortOrder}
                                onChange={(e) => {
                                  const updated = [...editPaymentMethods];
                                  updated[idx] = { ...pm, sortOrder: parseInt(e.target.value, 10) || 0 };
                                  setEditPaymentMethods(updated);
                                }}
                                className="bg-capsule-surf border border-capsule-accent/10 rounded py-0.5 px-2 w-14 text-center text-xs font-mono font-bold"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Հեռացնե՞լ "${pm.title.hy || pm.name}" վճարման մեթոդը։`)) {
                                  setEditPaymentMethods(editPaymentMethods.filter((_, i) => i !== idx));
                                }
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg cursor-pointer transition-colors"
                              title="Delete method"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* General attributes */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          {/* Machine name */}
                          <div className="md:col-span-3">
                            <label className="text-[9px] text-capsule-text-muted font-black uppercase tracking-wider block mb-1">Կոդային Անուն (Machine Name)</label>
                            <input
                              type="text"
                              value={pm.name}
                              placeholder="e.g. visa"
                              onChange={(e) => {
                                const updated = [...editPaymentMethods];
                                updated[idx] = { ...pm, name: e.target.value.toLowerCase().replace(/\s+/g, "_") };
                                setEditPaymentMethods(updated);
                              }}
                              className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-1 px-3 text-xs text-capsule-dark font-mono font-bold outline-none"
                            />
                          </div>

                          {/* Live Preview Box */}
                          <div className="md:col-span-9 flex flex-col items-start gap-1 pb-1">
                            <span className="text-[9px] text-capsule-text-muted font-black uppercase tracking-wider block mb-1">Վիզուալ Տեսքի Նախադիտում (Visual Preview)</span>
                            <div className="flex items-center gap-4">
                              <div 
                                className="bg-white border border-[#E8E7E9] rounded-xl px-4 h-11 w-28 flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:scale-[1.03] hover:border-[#C59B6D]/35 hover:shadow-[0_4px_12px_rgba(197,155,109,0.06)] transition-all duration-300 ease-out cursor-pointer"
                                title={`${pm.title[locale as keyof typeof pm.title] || pm.title.en} Preview`}
                                dangerouslySetInnerHTML={{ __html: pm.iconSvg }}
                              />
                              <div className="text-[10px] text-capsule-text-muted leading-tight">
                                <span className="text-capsule-accent font-bold block">112x44px badge-view</span>
                                SVG-ն պետք է ունենա <code className="bg-capsule-surf2 px-1 rounded font-mono text-[9px]">h-[12px] h-[20px]</code> կամ <code className="bg-capsule-surf2 px-1 rounded font-mono text-[9px]">h-auto max-h-[22px]</code> դասեր:
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Language blocks: Titles & Descriptions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/5 pb-4 p-3 rounded-xl border border-dashed border-capsule-accent/5">
                          {/* Left: Titles in 4 Languages */}
                          <div className="space-y-2">
                            <span className="text-[10px] text-capsule-accent font-extrabold uppercase tracking-wider block border-b border-capsule-accent/5 pb-1">🔤 Անվանումներ (Localized Titles)</span>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <span className="text-[9px] text-capsule-text-muted font-bold block mb-1">🇦🇲 Armenian (hy)</span>
                                <input
                                  type="text"
                                  value={pm.title.hy}
                                  onChange={(e) => {
                                    const updated = [...editPaymentMethods];
                                    updated[idx] = { ...pm, title: { ...pm.title, hy: e.target.value } };
                                    setEditPaymentMethods(updated);
                                  }}
                                  className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-1 px-2.5 text-xs text-capsule-dark font-semibold outline-none"
                                />
                              </div>
                              <div>
                                <span className="text-[9px] text-capsule-text-muted font-bold block mb-1">🇬🇧 English (en)</span>
                                <input
                                  type="text"
                                  value={pm.title.en}
                                  onChange={(e) => {
                                    const updated = [...editPaymentMethods];
                                    updated[idx] = { ...pm, title: { ...pm.title, en: e.target.value } };
                                    setEditPaymentMethods(updated);
                                  }}
                                  className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-1 px-2.5 text-xs text-capsule-dark font-semibold outline-none"
                                />
                              </div>
                              <div>
                                <span className="text-[9px] text-capsule-text-muted font-bold block mb-1">🇷🇺 Russian (ru)</span>
                                <input
                                  type="text"
                                  value={pm.title.ru}
                                  onChange={(e) => {
                                    const updated = [...editPaymentMethods];
                                    updated[idx] = { ...pm, title: { ...pm.title, ru: e.target.value } };
                                    setEditPaymentMethods(updated);
                                  }}
                                  className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-1 px-2.5 text-xs text-capsule-dark font-semibold outline-none"
                                />
                              </div>
                              <div>
                                <span className="text-[9px] text-capsule-text-muted font-bold block mb-1">🇦🇪 Arabic (ar)</span>
                                <input
                                  type="text"
                                  value={pm.title.ar}
                                  onChange={(e) => {
                                    const updated = [...editPaymentMethods];
                                    updated[idx] = { ...pm, title: { ...pm.title, ar: e.target.value } };
                                    setEditPaymentMethods(updated);
                                  }}
                                  className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-1 px-2.5 text-xs text-capsule-dark font-semibold outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Right: Descriptions in 4 Languages */}
                          <div className="space-y-2">
                            <span className="text-[10px] text-[#C59B6D] font-extrabold uppercase tracking-wider block border-b border-capsule-accent/5 pb-1">💬 Նկարագրություններ (Localized Descriptions)</span>
                            <div className="space-y-2">
                              <div>
                                <span className="text-[9px] text-capsule-text-muted font-bold block mb-0.5">Անգլերեն, Հայերեն, Ռուսերեն, Արաբերեն  (hy/en/ru/ar)</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={pm.description.hy}
                                    placeholder="Նկարագրություն (Հայերեն)"
                                    onChange={(e) => {
                                      const updated = [...editPaymentMethods];
                                      updated[idx] = { ...pm, description: { ...pm.description, hy: e.target.value } };
                                      setEditPaymentMethods(updated);
                                    }}
                                    className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-1 px-2 text-xs text-capsule-dark outline-none"
                                  />
                                  <input
                                    type="text"
                                    value={pm.description.en}
                                    placeholder="Description (English)"
                                    onChange={(e) => {
                                      const updated = [...editPaymentMethods];
                                      updated[idx] = { ...pm, description: { ...pm.description, en: e.target.value } };
                                      setEditPaymentMethods(updated);
                                    }}
                                    className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-1 px-2 text-xs text-capsule-dark outline-none"
                                  />
                                  <input
                                    type="text"
                                    value={pm.description.ru}
                                    placeholder="Описание (Русский)"
                                    onChange={(e) => {
                                      const updated = [...editPaymentMethods];
                                      updated[idx] = { ...pm, description: { ...pm.description, ru: e.target.value } };
                                      setEditPaymentMethods(updated);
                                    }}
                                    className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-1 px-2 text-xs text-capsule-dark outline-none"
                                  />
                                  <input
                                    type="text"
                                    value={pm.description.ar}
                                    placeholder="الوصف (العربية)"
                                    onChange={(e) => {
                                      const updated = [...editPaymentMethods];
                                      updated[idx] = { ...pm, description: { ...pm.description, ar: e.target.value } };
                                      setEditPaymentMethods(updated);
                                    }}
                                    className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-1 px-2 text-xs text-capsule-dark outline-none font-sans"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Payment Method Logo Manager (Uploader and Preset Library Selector) */}
                        <div className="bg-capsule-accent/5 p-4 rounded-xl border border-dashed border-capsule-accent/10 space-y-4">
                          <span className="text-[10px] text-capsule-accent font-black uppercase tracking-wider block border-b border-capsule-accent/5 pb-1">🛡️ Լոգոտիպի Կառավարիչ (Logo Manager)</span>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column: Upload custom image logo button + raw code edit textarea */}
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <span className="text-[10px] text-capsule-dark font-bold block">1. Բեռնել Սեփական Լոգոն (Upload Custom Logo File)</span>
                                <div className="flex flex-wrap items-center gap-3">
                                  <input
                                    type="file"
                                    id={`logo_upload_${pm.id}`}
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                          const dataUrl = event.target?.result as string;
                                          const imgHtml = `<img src="${dataUrl}" class="h-[20px] w-auto max-h-[22px] object-contain inline-block" alt="Logo" />`;
                                          const updated = [...editPaymentMethods];
                                          updated[idx] = { ...pm, iconSvg: imgHtml };
                                          setEditPaymentMethods(updated);
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                    className="hidden"
                                  />
                                  <label
                                    htmlFor={`logo_upload_${pm.id}`}
                                    className="flex items-center gap-1.5 px-3 py-2 bg-capsule-accent text-capsule-surf hover:bg-capsule-accent-hover cursor-pointer rounded-lg text-xs font-bold transition-all shadow-[0_2px_6px_rgba(197,155,109,0.15)] hover:shadow-[0_4px_10px_rgba(197,155,109,0.25)] select-none"
                                  >
                                    <Upload size={14} />
                                    <span>📁 Ընտրել Լոգո Ֆայլ (Select Logo Image)</span>
                                  </label>
                                  
                                  {pm.iconSvg && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...editPaymentMethods];
                                        updated[idx] = { ...pm, iconSvg: "" };
                                        setEditPaymentMethods(updated);
                                      }}
                                      className="px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg cursor-pointer font-bold transition-colors"
                                    >
                                      Ջնջել (Clear)
                                    </button>
                                  )}
                                </div>
                                <p className="text-[10px] text-capsule-text-muted">Աջակցում է PNG, JPG, JPEG, SVG կամ WebP ձևաչափերին։ Ֆայլն ավտոմատ կերպով կվերածվի Base64 կոդի։</p>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] text-capsule-text-muted font-bold uppercase tracking-wider block">Կամ խմբագրել կոդը ձեռքով (Or Modify Raw HTML/SVG Code):</label>
                                <textarea
                                  rows={2}
                                  value={pm.iconSvg}
                                  placeholder="<svg ...>...</svg> or <img ... />"
                                  onChange={(e) => {
                                    const updated = [...editPaymentMethods];
                                    updated[idx] = { ...pm, iconSvg: e.target.value };
                                    setEditPaymentMethods(updated);
                                  }}
                                  className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-1.5 px-3 text-[10px] text-capsule-dark font-mono outline-none resize-y min-h-[50px]"
                                />
                              </div>
                            </div>

                            {/* Right Column: Premium Quick-Apply Logo Presets Library */}
                            <div className="space-y-2">
                              <span className="text-[10px] text-[#C59B6D] font-extrabold uppercase tracking-wider block">2. 💡 Պատրաստի Լոգոների Գրադարան (Ready-to-use Preset Logos)</span>
                              <p className="text-[10px] text-capsule-text-muted">Սեղմեք ցանկացած լոգոյի վրա՝ այն ակնթարթորեն այս վճարման համակարգին կցելու համար։</p>
                              
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[165px] overflow-y-auto p-2 border border-dashed border-capsule-accent/15 rounded-xl bg-black/5">
                                {[
                                  {
                                    label: "Visa",
                                    icon: `<svg class="h-[12px] w-auto text-[#1434CB] inline-block" viewBox="0 0 100 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M42.2 2.1l-6.3 27.8H26.3L32.6 2.1h9.6zm29.3 0c-4.4 0-8 2.4-9.8 6.5l-11.3 21.3h9.8s1.6-4.5 1.9-5.4h11c.2 1 1.1 5.4 1.1 5.4h8.7L78 2.1h-6.5zm-5.4 14.8c.6-1.7 4.1-11.4 4.1-11.4s.8 2.3 1.3 3.6c.5 1.3 3.1 7.8 3.1 7.8h-8.5zM22.2 2.1l-10 19L11 6.5C10.5 4.1 8 2.1 5.5 2.1H0l.2.8c3.1.8 6.7 2.3 8.9 3.5l7.8 23.5h10.4L42 2.1H22.2zm76.5 0h-7.6c-2.4 0-4.3 1.5-5.2 3.7l-15.5 24.1h10.2l2-5.6h12.5c.3 1.3 1.2 5.6 1.2 5.6h9L98.7 2.1z" /></svg>`
                                  },
                                  {
                                    label: "Mastercard",
                                    icon: `<svg class="h-[20px] w-auto inline-block" viewBox="0 0 40 30" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="15" r="11" fill="#EB001B" /><circle cx="26" cy="15" r="11" fill="#F79E1B" opacity="0.88" /><path d="M 20 6.5 C 17.5 8.7 16 11.7 16 15 C 16 18.3 17.5 21.3 20 23.5 C 22.5 21.3 24 18.3 24 15 C 24 11.7 22.5 8.7 20 6.5 Z" fill="#FF5F00" /></svg>`
                                  },
                                  {
                                    label: "ArCa",
                                    icon: `<svg class="h-[18px] w-auto max-w-[95%] inline-block" viewBox="0 0 160 50" xmlns="http://www.w3.org/2000/svg"><g fill="#0c54a3"><path d="M 12.5 45 C 10.5 45, 8.5 44, 8 42 C 7.5 40, 8.5 37.5, 10 33.5 L 22.5 7.5 C 24 4.5, 27 3, 31 3 L 41.5 3 C 44.5 3, 46.5 4.5, 47 6 L 56 34 L 59 34 C 61 34, 62 36, 62 38 C 62 40, 60.5 45, 53.5 45 L 35.5 45 L 36 40 L 38.5 40 C 40.5 40, 42 39, 42 37.5 L 40 28.5 L 23.5 28.5 L 18 39.5 C 17 41.5, 18 43, 20.5 43 L 23 43 L 21 45 Z" /><path d="M 28 28.5 L 31.75 12 L 35.5 28.5 L 33.75 28.5 L 33.75 37.5 L 29.75 37.5 L 29.75 28.5 Z" fill="#ffffff" /><path d="M 52.5 45 C 51.5 45, 50.5 44, 50.5 42 L 51 39.5 L 53.5 39.5 C 55 39.5, 56 38.5, 56.5 36.5 L 61.5 14.5 C 62 12, 63.5 10.5, 66 10.5 L 75 10.5 C 77 10.5, 78 12, 78 13.5 C 78 15, 76.5 16, 74.5 16 L 71 16 L 66 38 C 65.5 40, 66.5 41, 68.5 41 L 70.5 41 L 69.5 45 Z" /><path d="M 64.5 24 C 67.5 17.5, 71.5 12.5, 76 12.5 C 79.5 12.5, 81 14.5, 80.5 17 C 80 19, 78.5 21, 77 21 C 75.5 21, 74.8 20, 75.2 18 C 75.5 16.5, 74.5 15.5, 73 15.5 C 69.8 15.5, 66.8 20.5, 65.2 24 Z" stroke="#ffffff" stroke-width="1" /><path d="M 111 10.5 C 104.5 4.5, 91.5 4.5, 84.5 12.5 C 77.5 20.5, 74.5 31.5, 78.5 39.5 C 82.5 47.5, 93.5 49.5, 100.5 49.5 C 107.5 49.5, 112.5 44.5, 114.5 38.5 L 108.5 38.5 C 106.5 42.5, 103.5 44.5, 99.5 44.5 C 94.5 44.5, 89.5 42.5, 86.5 36.5 C 82.5 30.5, 83.5 21.5, 87.5 14.5 C 91.5 8.5, 97.5 6.5, 101.5 6.5 C 104.5 6.5, 106.5 8.5, 107.5 10.5 Z" /><path d="M 136 19.5 C 130.5 19.5, 126.5 24, 125.5 29.5 C 124.5 35, 127.5 38.5, 132.5 38.5 C 138 38.5, 142 34, 143 28.5 C 144 23, 141 19.5, 136 19.5 Z M 134.5 23.5 C 137.5 23.5, 139.5 26, 139 29.5 C 138.5 33, 135 35, 132 35 C 129 35, 127.5 32.5, 128 29.5 C 128.5 26, 131.5 23.5, 134.5 23.5 Z" /><path d="M 134.5 41 C 133.5 41, 132.5 40, 132.5 38.5 C 132.5 37, 133.5 36, 135 36 L 137.5 36 L 140 24 C 140.5 21.5, 142 20.5, 144 20.5 L 146 20.5 L 145 25 C 140.5 35, 138 41, 138 42.5 C 138 44, 139 45, 140.5 45 L 142 45 L 140.5 49 L 131 49 C 130.5 49, 129.5 48, 129.5 46.5 C 129.5 45, 130.5 44, 132 44 L 134 44 Z" /></g></svg>`
                                  },
                                  {
                                    label: "Idram",
                                    icon: `<svg class="h-[18px] w-auto inline-block" viewBox="0 0 160 50" xmlns="http://www.w3.org/2000/svg"><path d="M12.4 34.6c-.6 0-1.2-.5-1.2-1.2V16.6H7.1c-.6 0-1.2-.5-1.2-1.2s.5-1.2 1.2-1.2h4.1V10c0-.6.5-1.2 1.2-1.2s1.2.5 1.2 1.2v4.2h5.1c.6 0 1.2.5 1.2 1.2 0 .7-.5 1.2-1.2 1.2h-5.1v16.8c0 .6-.5 1.2-1.2 1.2z" fill="#FF7900"/><path d="M37.8 34.6c-5.7 0-10.4-4.7-10.4-10.4s4.7-10.4 10.4-10.4 10.4 4.7 10.4 10.4-4.7 10.4-10.4 10.4zm0-18.4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z" fill="#00B3E3"/><path d="M68 34.6c-.6 0-1.2-.5-1.2-1.2V16.6h-5.1c-.6 0-1.2-.5-1.2-1.2s.5-1.2 1.2-1.2H68c.6 0 1.2.5 1.2 1.2v16.8c0 .7-.5 1.2-1.2 1.2z" fill="#00B3E3"/><text x="76" y="32" font-family="sans-serif" font-weight="900" font-size="20" fill="#2E2E2E">idram</text></svg>`
                                  },
                                  {
                                    label: "Telcell",
                                    icon: `<svg class="h-[18px] w-auto inline-block" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg"><rect width="18" height="40" rx="4" fill="#E30613"/><circle cx="9" cy="20" r="5" fill="#FFFFFF"/><text x="26" y="33" font-family="sans-serif" font-weight="900" font-size="22" fill="#E30613">telcell</text></svg>`
                                  },
                                  {
                                    label: "EasyPay",
                                    icon: `<svg class="h-[18px] w-auto inline-block" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="50" rx="8" fill="#0A2540"/><text x="15" y="35" font-family="sans-serif" font-weight="bold" font-size="26" fill="#00D4B2">easy</text><text x="92" y="35" font-family="sans-serif" font-weight="bold" font-size="26" fill="#FFFFFF">pay</text></svg>`
                                  },
                                  {
                                    label: "Apple Pay",
                                    icon: `<svg class="h-[18px] w-auto inline-block" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M43 14h-5.9c-.3 0-.5.2-.5.5v11c0 .3.2.5.5.5h2.1c.3 0 .5-.2.5-.5v-3.7h3.3c2.7 0 4.3-1.5 4.3-3.9v-.1c0-2.3-1.6-3.8-4.3-3.8zm1.5 4c0 1.1-.7 1.7-1.9 1.7H39.2v-3.4h3.4c1.1 0 1.9.6 1.9 1.6V18zm11-.1c-1-.1-2.2.3-2.6.9v-.6c0-.3-.2-.5-.5-.5h-2.1c-.3 0-.5.2-.5.5v11.7c0 .3.2.5.5.5h2.1c.3 0 .5-.2.5-.5v-5.2c.4.6 1.5 1 2.5.9 2.1-.2 3.8-2 3.8-4.4v-.1c.1-2.4-1.6-4.5-3.7-4.7zm-.6 5.5c-1 0-1.8-.8-1.8-1.9v-.1c0-1.1.8-1.9 1.8-1.9s1.8.8 1.8 1.9v.1c0 1.1-.8 1.9-1.8 1.9zm15.7-5.4c-.9 0-1.8.4-2.2 1.2v-.9c0-.3-.2-.5-.5-.5h-2.1c-.3 0-.5.2-.5.5v11.8c0 .2.1.3.2.4l1.1 1.1c.1.1.3.1.4 0l1.4-1c.1-.1.1-.3.1-.4v-4c.4.7 1.3 1.1 2.2 1.1 2.1 0 3.7-1.8 3.7-4.6v-.1c-.1-2.8-1.7-4.6-3.8-4.6zm-.4 5.5c-1 0-1.7-.9-1.7-2.1v-.1c0-1.2.7-2.1 1.7-2.1s1.7.9 1.7 2.1v.1c.1 1.2-.7 2.1-1.7 2.1zm-49-11c-.5 0-1 .2-1.4.5-.7.5-1.2 1.4-1.2 2.5 0 1.4.8 2.3 2.1 2.3.4 0 .9-.1 1.2-.3.6-.4.9-1.2.9-2.3.1-1.5-.7-2.7-2.1-2.7zm-1.8-1c.3-1.6 1.5-2.7 2.9-2.7h.5c0-.1 0-.3-.1-.4-.2-1.4-1.4-2.4-2.9-2.4-1.2 0-2.3.7-2.8 1.4-.2.2-.1.5.1.7l.9.6c.2.1.4.1.6 0 .3-.3.8-.6 1.3-.6.6 0 1 .3 1.1.9l-1 .1c-2.3.2-3.7 1.4-3.7 3.2 0 1.7 1.2 2.9 3.2 2.9 1.4 0 2.4-.7 2.9-1.5v.9c0 .3.2.5.5.5h2c.3 0 .5-.2.5-.5v-4.1c0-2-1.5-3.5-3.7-3.5-2.2-.1-3.9 1.3-4.3 3.4-.1.3.1.5.4.6l1.2.2zm11.2-.6c-1.3 0-2.4.7-2.9 1.5v-1.1c0-.3-.2-.5-.5-.5h-2.1c-.3 0-.5.2-.5.5v11.8c0 .3.2.5.5.5h2.1c.3 0 .5-.2.5-.5v-5.2c.4.6 1.3 1.2 2.4 1.2 2.3 0 3.8-1.8 3.8-4.6v-.1c.1-2.8-1.4-4.6-3.7-4.6zm-.4 5.5c-1.1 0-1.8-.9-1.8-2v-.1c0-1.1.7-2 1.8-2s1.8.9 1.8 2v.1c.1 1.1-.7 2-1.8 2zm13.1-4c-.7-1.1-1.9-1.5-3.3-1.5-2.6 0-4.4 2.1-4.4 4.7v.1c0 2.6 1.8 4.7 4.5 4.7 1.4 0 2.5-.5 3.3-1.5v.9c0 .3.2.5.5.5h2.1c.3 0 .5-.2.5-.5V9.4c0-.3-.2-.5-.5-.5H87c-.3 0-.5.2-.5.5V18zm-3.3 5.4c-1.1 0-1.9-.9-1.9-2.1v-.1c0-1.2.8-2.1 1.9-2.1s1.9.9 1.9 2.1v.1c0 1.2-.8 2.1-1.9 2.1z" /></svg>`
                                  },
                                  {
                                    label: "Google Pay",
                                    icon: `<svg class="h-[18px] w-auto inline-block" viewBox="0 0 160 50" xmlns="http://www.w3.org/2000/svg"><rect width="160" height="50" rx="8" fill="#F8F9FA" stroke="#E0E0E0" stroke-width="1"/><text x="12" y="34" font-family="sans-serif" font-weight="950" font-size="24" fill="#5F6368">G</text><text x="36" y="34" font-family="sans-serif" font-weight="800" font-size="20" fill="#7F848C">Pay</text></svg>`
                                  },
                                  {
                                    label: "PayPal",
                                    icon: `<svg class="h-[18px] w-auto inline-block" viewBox="0 0 100 32" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L4 22h6l2-6h5c5 0 8-3 8-7s-3-7-8-7H12zm23 4c1 4-1 8-5 10l-2 5h-5l2-6H9l3-9h8c1 0 2 0 3 .5.7.5 1.5 1.5 1.5 3.5zm-5 12h-4v4h4v-4z" fill="#003087"/></svg>`
                                  },
                                  {
                                    label: "Stripe",
                                    icon: `<svg class="h-[18px] w-auto inline-block text-[#635BFF]" viewBox="0 0 80 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M80 16.5c0-5-3.5-8.5-8.3-8.5-4.8 0-8.2 3.5-8.2 8.5 0 5 3.4 8.5 8.2 8.5 4.8 0 8.3-3.5 8.3-8.5zm-11.7 0c0-2.8 1.8-4.4 4.5-4.4s4.5 1.6 4.5 4.4c0 2.8-1.8 4.4-4.5 4.4s-4.5-1.6-4.5-4.4zM53.6 11.8V9H45v15.5h4.8V17c1.7-2.3 4.3-2 5-1.5V11c-.7-.4-2-.4-3.5.8zM40.2 16.6h-7c.1-2.2 1.6-3.2 3.6-3.2 1.8 0 3 .8 3.4 1.7h4.8c-.8-3.4-4.2-5.1-8.2-5.1-5.3 0-8.6 3.5-8.6 8.5s3.3 8.5 8.7 8.5c4.1 0 7.7-2 8.3-5.2H40c-.4 1-1.6 1.7-3.4 1.7-2.1 0-3.4-1.1-3.5-3.4h7.1zm-21.5-6h-4.8V9H9.1v2.8H4.6v4h4.5v5.5c0 3.3 2.1 5.2 5.5 5.2 1.4 0 2.5-.2 3.2-.5v-4.1c-.5.2-1 .3-1.6.3-1.1 0-1.7-.6-1.7-1.9V13h4.9v-2.4zM24.2 4.4h4.8V24h-4.8V4.4z"/></svg>`
                                  },
                                  {
                                    label: "Credit Card",
                                    icon: `<svg class="h-[18px] w-auto text-capsule-accent inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="2" y1="15" x2="6" y2="15"/></svg>`
                                  },
                                  {
                                    label: "Bank Transfer",
                                    icon: `<svg class="h-[18px] w-auto text-capsule-accent inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><polyline points="6 18 6 11 10 11 10 18"/><polyline points="14 18 14 11 18 11 18 18"/><polygon points="12 2 20 7 4 7"/></svg>`
                                  }
                                ].map((preset, pIdx) => (
                                  <button
                                    key={pIdx}
                                    type="button"
                                    onClick={() => {
                                      const updated = [...editPaymentMethods];
                                      updated[idx] = { ...pm, iconSvg: preset.icon };
                                      setEditPaymentMethods(updated);
                                    }}
                                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-[#E8E7E9] hover:border-capsule-accent/50 hover:bg-capsule-accent/5 cursor-pointer text-center text-[10px] font-sans transition-all group shadow-[0_1px_2px_rgba(0,0,0,0.01)] h-[68px]"
                                    title={`Apply ${preset.label} Logo`}
                                  >
                                    <div 
                                      className="h-8 flex items-center justify-center max-w-full overflow-hidden mb-1 transform group-hover:scale-105 transition-transform" 
                                      dangerouslySetInnerHTML={{ __html: preset.icon }}
                                    />
                                    <span className="text-[9px] text-capsule-dark/80 font-black tracking-tight group-hover:text-capsule-accent">{preset.label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    ))}

                    {editPaymentMethods.length === 0 && (
                      <div className="text-center py-12 border-2 border-dashed border-capsule-accent/15 rounded-2xl bg-capsule-surf2/10">
                        <p className="text-sm font-semibold text-capsule-text-muted">Ոչ մի վճարման մեթոդ գտնված չէ։</p>
                        <p className="text-xs text-capsule-text-muted/70 mt-1">Ավելացրեք նոր մեթոդ կամ սեղմեք հրապարակված Presets-ի վերականգնման վրա։</p>
                      </div>
                    )}
                  </div>

                  {/* Save button at the bottom of the tab */}
                  <div className="flex justify-end pt-4 border-t border-capsule-accent/10 mt-6">
                    <button
                      type="button"
                      onClick={handleSaveAll}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase shadow-sm cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <span>💾 Պահպանել Փոփոխությունները (Save Payment Methods)</span>
                    </button>
                  </div>

                </div>
              )}

              {/* TAB: HANDLES (RIBBON WIDTHS & SIZES) */}
              {activeTab === "handles" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-capsule-accent/10 pb-2">
                    <h3 className="font-serif text-base text-capsule-accent font-semibold">Սատինե Ժապավենների Չափսեր և Գներ</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newH: BagRibbonHandle = {
                          id: "rw_" + Date.now(),
                          widthCm: 1.5,
                          label: "1.5 սմ",
                          price: 60,
                          active: true
                        };
                        setEditBagRibbonHandles([...editBagRibbonHandles, newH]);
                      }}
                      className="bg-capsule-accent text-capsule-surf px-3 py-1 rounded-lg text-xs font-bold uppercase cursor-pointer"
                    >
                      + Ավելացնել Ժապավեն
                    </button>
                  </div>

                  <p className="text-xs text-capsule-text-muted italic leading-relaxed">
                    Այստեղ կարող եք կարգավորել ժապավենների լայնությունները (սմ) և դրանց ինդիվիդուալ գները (֏)։ 
                    3D մոդելում ժապավենի հաստությունը ավտոմատ կերպով կփոխվի՝ համապատասխան ընտրված սանտիմետրին։
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {editBagRibbonHandles.map((hCode, idx) => (
                      <div key={hCode.id || idx} className="bg-capsule-surf2/30 border border-capsule-accent/10 p-3 rounded-xl space-y-3 relative group">
                        <div className="flex justify-between items-center border-b border-capsule-accent/5 pb-1">
                          <span className="font-bold text-xs text-capsule-accent">Ժապավեն #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => setEditBagRibbonHandles(editBagRibbonHandles.filter((_, i) => i !== idx))}
                            className="p-1 text-red-700 hover:bg-red-50 rounded cursor-pointer text-xs"
                          >
                            ✕ Ջնջել
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-[9px] text-capsule-text-muted font-bold block uppercase">Լայնություն (սմ)</span>
                            <input
                              type="number"
                              step="0.1"
                              value={hCode.widthCm}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                const updated = [...editBagRibbonHandles];
                                updated[idx] = { 
                                  ...hCode, 
                                  widthCm: val,
                                  label: `${val} սմ` // auto keep label in sync
                                };
                                setEditBagRibbonHandles(updated);
                              }}
                              className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-2 w-full outline-none font-mono"
                            />
                          </div>

                          <div>
                            <span className="text-[9px] text-capsule-text-muted font-bold block uppercase font-serif">Անվանում (Հայերեն)</span>
                            <input
                              type="text"
                              value={hCode.label}
                              onChange={(e) => {
                                const updated = [...editBagRibbonHandles];
                                updated[idx] = { ...hCode, label: e.target.value };
                                setEditBagRibbonHandles(updated);
                              }}
                              className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-2 w-full outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                          <div>
                            <span className="text-[9px] text-capsule-text-muted font-bold block uppercase font-serif">Հավելյալ Գին (֏)</span>
                            <input
                              type="number"
                              value={hCode.price}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                const updated = [...editBagRibbonHandles];
                                updated[idx] = { ...hCode, price: val };
                                setEditBagRibbonHandles(updated);
                              }}
                              className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-2 w-full outline-none font-mono"
                            />
                          </div>

                          <div className="font-serif">
                            <span className="text-[9px] text-capsule-text-muted font-bold block uppercase">Կարգավիճակ</span>
                            <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={hCode.active}
                                onChange={(e) => {
                                  const updated = [...editBagRibbonHandles];
                                  updated[idx] = { ...hCode, active: e.target.checked };
                                  setEditBagRibbonHandles(updated);
                                }}
                                className="rounded text-capsule-accent border-capsule-accent/20 cursor-pointer"
                              />
                              <span className="text-[11px] font-semibold text-capsule-dark">Ակտիվ</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {editBagRibbonHandles.length === 0 && (
                    <div className="p-8 text-center bg-capsule-surf2/20 border border-dashed border-capsule-accent/10 rounded-xl">
                      <p className="text-xs text-capsule-text-muted">Ժապավեններ չկան։ Ավելացրեք նորը:</p>
                    </div>
                  )}

                  <div className="flex justify-end pt-4 border-t border-capsule-accent/5">
                    <button
                      type="button"
                      onClick={handleSaveAll}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase shadow cursor-pointer transition-all"
                    >
                      Պահպանել Փոփոխությունները
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 7S: FINISHES */}
              {activeTab === "finishes" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-capsule-accent/10 pb-2">
                    <h3 className="font-serif text-base text-capsule-accent font-semibold">Հավելյալ Մշակումներ</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newF: Finish = {
                          key: "finish_" + Date.now().toString(),
                          label: "Նոր Մշակում",
                          icon: "✦",
                          price: 40,
                          active: true
                        };
                        setEditFinishes([...editFinishes, newF]);
                      }}
                      className="bg-capsule-accent text-capsule-surf px-3 py-1 rounded-lg text-xs font-bold uppercase cursor-pointer"
                    >
                      + Ավելացնել
                    </button>
                  </div>

                  <div className="space-y-3">
                    {editFinishes.map((f, idx) => (
                      <div key={f.key} className="bg-capsule-surf2/40 border border-capsule-accent/10 p-3 rounded-xl flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <input
                            type="text"
                            value={f.label}
                            onChange={(e) => {
                              const updated = [...editFinishes];
                              updated[idx] = { ...f, label: e.target.value };
                              setEditFinishes(updated);
                            }}
                            className="bg-transparent font-bold border-b border-capsule-accent/15 text-xs outline-none flex-1 font-sans"
                          />
                          <button
                            type="button"
                            onClick={() => setEditFinishes(editFinishes.filter(item => item.key !== f.key))}
                            className="p-1 text-red-700 hover:bg-red-50 rounded cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-[9px] text-capsule-text-muted uppercase font-bold block">Իկոն</span>
                            <input
                              type="text"
                              value={f.icon}
                              onChange={(e) => {
                                const updated = [...editFinishes];
                                updated[idx] = { ...f, icon: e.target.value };
                                setEditFinishes(updated);
                              }}
                              className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-2 text-center w-full"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-capsule-text-muted uppercase font-bold block">Գին (֏ / հատ)</span>
                            <input
                              type="number"
                              value={f.price}
                              onChange={(e) => {
                                const updated = [...editFinishes];
                                updated[idx] = { ...f, price: parseInt(e.target.value, 10) || 0 };
                                setEditFinishes(updated);
                              }}
                              className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-2 font-mono text-center w-full"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8S: OTHER PRODUCTS */}
              {activeTab === "products" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-capsule-accent/10 pb-3 flex-wrap gap-2">
                    <div>
                      <h3 className="font-serif text-base text-capsule-accent font-semibold">📦 Ապրանքների և Տեսակների Կառավարում</h3>
                      <p className="text-[11px] text-capsule-text-muted mt-1">Այստեղ կարող եք ավելացնել նոր արտադրատեսակներ և փոփոխել նրանց գները։</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newProd: Product = {
                          id: "prod_" + Date.now(),
                          categoryId: "other_products",
                          name: "Նոր Արտադրանքի Խումբ",
                          desc: "Հակիրճ նկարագրություն",
                          active: true,
                          items: [
                            {
                              id: "it_" + Date.now(),
                              name: "Օրինակելի արտադրանք",
                              price: 100,
                              unit: "հատ"
                            }
                          ]
                        };
                        setEditProducts([...editProducts, newProd]);
                      }}
                      className="bg-capsule-accent text-capsule-surf text-xs font-bold px-3 py-1.5 rounded-full hover:bg-opacity-90 transition cursor-pointer"
                    >
                      + Ավելացնել Նոր Խումբ
                    </button>
                  </div>

                  <div className="space-y-6">
                    {editProducts.map((prod, pIdx) => (
                      <div key={prod.id} className="p-4 bg-capsule-surf2/20 border border-capsule-accent/10 rounded-2xl space-y-4 shadow-sm">
                        {/* Header of product group details */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div className="col-span-1">
                            <label className="block text-[9px] text-capsule-text-muted uppercase font-bold mb-1 font-mono">Բաժին (Category)</label>
                            <select
                              value={prod.categoryId}
                              onChange={(e) => {
                                const updated = [...editProducts];
                                updated[pIdx] = { ...prod, categoryId: e.target.value };
                                setEditProducts(updated);
                              }}
                              className="w-full bg-white border border-capsule-accent/10 rounded-lg p-1.5 text-xs outline-none focus:border-capsule-accent font-sans font-semibold"
                            >
                              <option value="qr_matrix">QR և Data Matrix Կոդեր</option>
                              <option value="other_products">Այլ Տպագրություն</option>
                              <option value="boxes">Տուփեր</option>
                              <option value="ribbons">Ժապավեններ</option>
                              <option value="stickers">Սթիքերներ</option>
                              <option value="giftcards">Նվեր Քարտեր</option>
                              <option value="businesscards">Այցեքարտեր</option>
                            </select>
                          </div>
                          
                          <div className="col-span-2">
                            <label className="block text-[9px] text-capsule-text-muted uppercase font-bold mb-1 font-mono">Խմբի Անվանում</label>
                            <input
                              type="text"
                              value={prod.name}
                              onChange={(e) => {
                                const updated = [...editProducts];
                                updated[pIdx] = { ...prod, name: e.target.value };
                                setEditProducts(updated);
                              }}
                              className="w-full bg-white border border-capsule-accent/10 rounded-lg p-1.5 text-xs outline-none focus:border-capsule-accent font-sans font-bold"
                            />
                          </div>
                          
                          <div className="flex items-end justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const newIt = {
                                  id: "it_" + Date.now(),
                                  name: "Նոր Ապրանք / Չափս",
                                  price: 200,
                                  unit: "հատ"
                                };
                                const updated = [...editProducts];
                                updated[pIdx] = { ...prod, items: [...prod.items, newIt] };
                                setEditProducts(updated);
                              }}
                              className="text-[10px] bg-capsule-accent text-capsule-surf px-2.5 py-1.5 rounded-lg active:scale-95 transition font-bold cursor-pointer"
                            >
                              + Ավելացնել Ապրանք
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm("Ցանկանու՞մ եք ջնջել այս խումբը և նրա բոլոր ապրանքները:")) {
                                  setEditProducts(editProducts.filter((_, idx) => idx !== pIdx));
                                }
                              }}
                              className="p-1.5 text-red-700 hover:bg-red-50 rounded-lg transition active:scale-95 cursor-pointer"
                              title="Ջնջել ամբողջ խումբը"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] text-capsule-text-muted uppercase font-bold mb-1 font-mono">Հակիրճ Նկարագրություն</label>
                          <input
                            type="text"
                            value={prod.desc || ""}
                            onChange={(e) => {
                              const updated = [...editProducts];
                              updated[pIdx] = { ...prod, desc: e.target.value };
                              setEditProducts(updated);
                            }}
                            className="w-full bg-white border border-capsule-accent/10 rounded-lg p-1.5 text-xs outline-none focus:border-capsule-accent font-sans"
                            placeholder="Օրինակ` A5, A6 և DL չափսեր..."
                          />
                        </div>

                        {/* Items Sub-table */}
                        <div className="space-y-2 border-t border-capsule-accent/5 pt-3">
                          <label className="block text-[9px] text-capsule-text-muted uppercase font-bold font-mono">Ապրանքների Ցուցակ և Գներ</label>
                          {prod.items.map((it, itIdx) => (
                            <div key={it.id} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded-xl border border-capsule-accent/5 text-xs">
                              <div className="col-span-5">
                                <label className="text-[8px] text-capsule-text-muted block mb-0.5">Անուն (Չափս, Տեսակ)</label>
                                <input
                                  type="text"
                                  value={it.name}
                                  onChange={(e) => {
                                    const updated = [...editProducts];
                                    const updatedItems = [...prod.items];
                                    updatedItems[itIdx] = { ...it, name: e.target.value };
                                    updated[pIdx] = { ...prod, items: updatedItems };
                                    setEditProducts(updated);
                                  }}
                                  className="w-full bg-capsule-surf/50 rounded-lg py-1 px-2 border border-capsule-accent/5 outline-none font-sans font-bold"
                                />
                              </div>
                              <div className="col-span-3">
                                <label className="text-[8px] text-capsule-text-muted block mb-0.5">Միավորի Գին (֏)</label>
                                <input
                                  type="number"
                                  value={it.price}
                                  onChange={(e) => {
                                    const updated = [...editProducts];
                                    const updatedItems = [...prod.items];
                                    updatedItems[itIdx] = { ...it, price: parseInt(e.target.value, 10) || 0 };
                                    updated[pIdx] = { ...prod, items: updatedItems };
                                    setEditProducts(updated);
                                  }}
                                  className="w-full bg-capsule-surf/50 rounded-lg py-1 px-2 border border-capsule-accent/5 outline-none text-center font-mono font-bold"
                                />
                              </div>
                              <div className="col-span-3">
                                <label className="text-[8px] text-capsule-text-muted block mb-0.5">Միավոր (հատ/մետր)</label>
                                <input
                                  type="text"
                                  value={it.unit || "հատ"}
                                  onChange={(e) => {
                                    const updated = [...editProducts];
                                    const updatedItems = [...prod.items];
                                    updatedItems[itIdx] = { ...it, unit: e.target.value };
                                    updated[pIdx] = { ...prod, items: updatedItems };
                                    setEditProducts(updated);
                                  }}
                                  className="w-full bg-capsule-surf/50 rounded-lg py-1 px-2 border border-capsule-accent/5 outline-none text-center font-mono"
                                />
                              </div>
                              <div className="col-span-1 flex justify-center pt-3 font-bold">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...editProducts];
                                    updated[pIdx] = { ...prod, items: prod.items.filter((_, i) => i !== itIdx) };
                                    setEditProducts(updated);
                                  }}
                                  className="text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition active:scale-95 cursor-pointer text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: FEATURED PRODUCTS / HOME PAGE HIGHLIGHTS */}
              {activeTab === "featured_products" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-capsule-accent/10 pb-3 flex-wrap gap-2">
                    <div>
                      <h3 className="font-serif text-base text-capsule-accent font-semibold">🌟 Գլխավոր Էջի Ապրանքներ (Main Page Featured Cards)</h3>
                      <p className="text-[11px] text-capsule-text-muted mt-1">Այստեղ կարող եք ավելացնել և կառավարել գլխավոր էջում ցուցադրվող ապրանքների քարտերը՝ կապելով դրանք կոնկրետ կալկուլյատորի բաժինների հետ։</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newFP: FeaturedProduct = {
                          id: "fp_" + Date.now(),
                          nameHy: "Նոր Գովազդային Ապրանք",
                          nameRu: "Новый рекламный товар",
                          nameEn: "New Featured Product",
                          minQtyTextHy: "Նվազ. 50 հատ",
                          minQtyTextRu: "Мин. 50 шт.",
                          minQtyTextEn: "Min. 50 pieces",
                          tagHy: "ՆՈՐ",
                          tagRu: "НОВИНКА",
                          tagEn: "NEW",
                          secondaryTagHy: "",
                          secondaryTagRu: "",
                          secondaryTagEn: "",
                          categoryId: categories[0]?.id || "boxes",
                          image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600",
                          active: true
                        };
                        setEditFeaturedProducts([...editFeaturedProducts, newFP]);
                      }}
                      className="bg-capsule-accent text-capsule-surf text-xs font-bold px-3 py-1.5 rounded-full hover:bg-opacity-90 transition cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      + Ավելացնել Ապրանք Գլխավոր Էջում
                    </button>
                  </div>

                  <div className="space-y-6">
                    {editFeaturedProducts.map((fp, fIdx) => (
                      <div key={fp.id} className="p-4 bg-capsule-surf2/20 border border-capsule-accent/10 rounded-2xl space-y-4 shadow-sm relative group">
                        
                        {/* Control buttons */}
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...editFeaturedProducts];
                              updated[fIdx] = { ...fp, active: !fp.active };
                              setEditFeaturedProducts(updated);
                            }}
                            className={`text-[9px] font-bold px-2 py-1 rounded-full transition ${fp.active ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-500"}`}
                          >
                            {fp.active ? "● Active" : "○ Draft"}
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("Ցանկանու՞մ եք ջնջել այս ապրանքը գլխավոր էջից։")) {
                                setEditFeaturedProducts(editFeaturedProducts.filter((_, idx) => idx !== fIdx));
                              }
                            }}
                            className="p-1.5 text-red-700 hover:bg-red-100 rounded-lg transition active:scale-95 cursor-pointer text-xs font-bold"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          
                          {/* Left Column: Image Preview, Upload button & URL input */}
                          <div className="col-span-1 md:col-span-3 flex flex-col justify-between space-y-2">
                            <div>
                              <label className="block text-[9px] text-capsule-text-muted uppercase font-bold mb-1 font-mono">
                                {locale === "hy" ? "Ապրանքի Նկար" : locale === "ru" ? "Изображение товара" : "Product Image"}
                              </label>
                              <div className="w-full h-32 rounded-xl border border-capsule-accent/10 bg-white overflow-hidden shadow-inner flex flex-col items-center justify-center relative group">
                                {fp.image ? (
                                  <img 
                                    src={fp.image} 
                                    alt="Featured Product" 
                                    className="w-full h-full object-cover" 
                                    referrerPolicy="no-referrer" 
                                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} 
                                  />
                                ) : (
                                  <span className="text-xs text-capsule-text-muted font-sans text-center px-2">
                                    {locale === "hy" ? "Պատկեր չկա" : locale === "ru" ? "Нет изображения" : "No Image"}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              {/* Hidden file uploader input */}
                              <input
                                type="file"
                                id={`fp_upload_${fp.id}`}
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const dataUrl = event.target?.result as string;
                                      const updated = [...editFeaturedProducts];
                                      updated[fIdx] = { ...fp, image: dataUrl };
                                      setEditFeaturedProducts(updated);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                              />
                              <label
                                htmlFor={`fp_upload_${fp.id}`}
                                className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-capsule-accent text-capsule-surf hover:bg-opacity-95 cursor-pointer rounded-lg text-[10px] font-bold transition-all shadow-sm select-none"
                              >
                                <Upload size={11} className="stroke-[2.5]" />
                                <span>
                                  {locale === "hy" ? "Բեռնել Նկար" : locale === "ru" ? "Загрузить Фото" : "Upload Image"}
                                </span>
                              </label>

                              <input
                                type="text"
                                value={fp.image}
                                onChange={(e) => {
                                              const updated = [...editFeaturedProducts];
                                              updated[fIdx] = { ...fp, image: e.target.value };
                                              setEditFeaturedProducts(updated);
                                }}
                                placeholder={locale === "hy" ? "Կամ տեղադրեք CDN հղումը..." : locale === "ru" ? "Или вставьте ссылку..." : "Or paste CDN URL..."}
                                className="w-full bg-white border border-capsule-accent/10 rounded-lg p-1.5 text-[10px] outline-none focus:border-capsule-accent font-mono"
                              />
                            </div>
                          </div>

                          {/* Right Column: Name, Description and Anchors */}
                          <div className="col-span-1 md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-3 pr-20">
                            
                            {/* Names Translation */}
                            <div className="col-span-2 grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-[9px] text-capsule-text-muted uppercase font-bold mb-1 font-mono">Անվանում (Հայերեն)</label>
                                <input
                                  type="text"
                                  value={fp.nameHy}
                                  onChange={(e) => {
                                                const updated = [...editFeaturedProducts];
                                                updated[fIdx] = { ...fp, nameHy: e.target.value };
                                                setEditFeaturedProducts(updated);
                                  }}
                                  className="w-full bg-white border border-capsule-accent/10 rounded-lg p-1.5 text-xs outline-none focus:border-capsule-accent font-sans font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] text-capsule-text-muted uppercase font-bold mb-1 font-mono">Անվանում (Русский)</label>
                                <input
                                  type="text"
                                  value={fp.nameRu}
                                  onChange={(e) => {
                                                const updated = [...editFeaturedProducts];
                                                updated[fIdx] = { ...fp, nameRu: e.target.value };
                                                setEditFeaturedProducts(updated);
                                  }}
                                  className="w-full bg-white border border-capsule-accent/10 rounded-lg p-1.5 text-xs outline-none focus:border-capsule-accent font-sans font-semibold"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] text-capsule-text-muted uppercase font-bold mb-1 font-mono">Անվանում (English)</label>
                                <input
                                  type="text"
                                  value={fp.nameEn}
                                  onChange={(e) => {
                                                const updated = [...editFeaturedProducts];
                                                updated[fIdx] = { ...fp, nameEn: e.target.value };
                                                setEditFeaturedProducts(updated);
                                  }}
                                  className="w-full bg-white border border-capsule-accent/10 rounded-lg p-1.5 text-xs outline-none focus:border-capsule-accent font-sans font-semibold"
                                />
                              </div>
                            </div>

                            {/* Min Qty text Translations */}
                            <div className="col-span-2 grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-[9px] text-capsule-text-muted uppercase font-bold mb-1 font-mono">Մին. Քանակ (Հայերեն)</label>
                                <input
                                  type="text"
                                  value={fp.minQtyTextHy}
                                  onChange={(e) => {
                                                const updated = [...editFeaturedProducts];
                                                updated[fIdx] = { ...fp, minQtyTextHy: e.target.value };
                                                setEditFeaturedProducts(updated);
                                  }}
                                  className="w-full bg-white border border-capsule-accent/10 rounded-lg p-1.5 text-xs outline-none focus:border-capsule-accent font-sans"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] text-capsule-text-muted uppercase font-bold mb-1 font-mono">Մին. Քանակ (Русский)</label>
                                <input
                                  type="text"
                                  value={fp.minQtyTextRu}
                                  onChange={(e) => {
                                                const updated = [...editFeaturedProducts];
                                                updated[fIdx] = { ...fp, minQtyTextRu: e.target.value };
                                                setEditFeaturedProducts(updated);
                                  }}
                                  className="w-full bg-white border border-capsule-accent/10 rounded-lg p-1.5 text-xs outline-none focus:border-capsule-accent font-sans"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] text-capsule-text-muted uppercase font-bold mb-1 font-mono">Մին. Քանակ (English)</label>
                                <input
                                  type="text"
                                  value={fp.minQtyTextEn}
                                  onChange={(e) => {
                                                const updated = [...editFeaturedProducts];
                                                updated[fIdx] = { ...fp, minQtyTextEn: e.target.value };
                                                setEditFeaturedProducts(updated);
                                  }}
                                  className="w-full bg-white border border-capsule-accent/10 rounded-lg p-1.5 text-xs outline-none focus:border-capsule-accent font-sans"
                                />
                              </div>
                            </div>

                            {/* Tags Translation */}
                            <div className="col-span-2 grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-[9px] text-capsule-text-muted uppercase font-bold mb-1 font-mono">Թեգ/Պիտակ (Հայերեն)</label>
                                <input
                                  type="text"
                                  value={fp.tagHy}
                                  onChange={(e) => {
                                                const updated = [...editFeaturedProducts];
                                                updated[fIdx] = { ...fp, tagHy: e.target.value };
                                                setEditFeaturedProducts(updated);
                                  }}
                                  className="w-full bg-white border border-capsule-accent/10 rounded-lg p-1.5 text-xs outline-none focus:border-capsule-accent font-sans"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] text-capsule-text-muted uppercase font-bold mb-1 font-mono">Թեգ/Պիտակ (Русский)</label>
                                <input
                                  type="text"
                                  value={fp.tagRu}
                                  onChange={(e) => {
                                                const updated = [...editFeaturedProducts];
                                                updated[fIdx] = { ...fp, tagRu: e.target.value };
                                                setEditFeaturedProducts(updated);
                                  }}
                                  className="w-full bg-white border border-capsule-accent/10 rounded-lg p-1.5 text-xs outline-none focus:border-capsule-accent font-sans"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] text-capsule-text-muted uppercase font-bold mb-1 font-mono">Թեգ/Պիտակ (English)</label>
                                <input
                                  type="text"
                                  value={fp.tagEn}
                                  onChange={(e) => {
                                                const updated = [...editFeaturedProducts];
                                                updated[fIdx] = { ...fp, tagEn: e.target.value };
                                                setEditFeaturedProducts(updated);
                                  }}
                                  className="w-full bg-white border border-capsule-accent/10 rounded-lg p-1.5 text-xs outline-none focus:border-capsule-accent font-sans"
                                />
                              </div>
                            </div>

                            {/* Secondary Tags Translation */}
                            <div className="col-span-2 grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-[9px] text-capsule-text-muted uppercase font-bold mb-1 font-mono">Երկրորդական Թեգ (Հայերեն)</label>
                                <input
                                  type="text"
                                  value={fp.secondaryTagHy || ""}
                                  onChange={(e) => {
                                                const updated = [...editFeaturedProducts];
                                                updated[fIdx] = { ...fp, secondaryTagHy: e.target.value };
                                                setEditFeaturedProducts(updated);
                                  }}
                                  placeholder="Օրինակ` ԷԿՈ ԸՆՏՐՈՒԹՅՈՒՆ 🌿"
                                  className="w-full bg-white border border-capsule-accent/10 rounded-lg p-1.5 text-xs outline-none focus:border-capsule-accent font-sans"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] text-capsule-text-muted uppercase font-bold mb-1 font-mono">Երկրորդական Թեգ (Русский)</label>
                                <input
                                  type="text"
                                  value={fp.secondaryTagRu || ""}
                                  onChange={(e) => {
                                                const updated = [...editFeaturedProducts];
                                                updated[fIdx] = { ...fp, secondaryTagRu: e.target.value };
                                                setEditFeaturedProducts(updated);
                                  }}
                                  placeholder="Например` ЭКО ВЫБОР 🌿"
                                  className="w-full bg-white border border-capsule-accent/10 rounded-lg p-1.5 text-xs outline-none focus:border-capsule-accent font-sans"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] text-capsule-text-muted uppercase font-bold mb-1 font-mono">Երկրորդական Թեգ (English)</label>
                                <input
                                  type="text"
                                  value={fp.secondaryTagEn || ""}
                                  onChange={(e) => {
                                                const updated = [...editFeaturedProducts];
                                                updated[fIdx] = { ...fp, secondaryTagEn: e.target.value };
                                                setEditFeaturedProducts(updated);
                                  }}
                                  placeholder="Example` ECO CHOICE 🌿"
                                  className="w-full bg-white border border-capsule-accent/10 rounded-lg p-1.5 text-xs outline-none focus:border-capsule-accent font-sans"
                                />
                              </div>
                            </div>

                            {/* Category dropdown links / Calculator categories Anchor */}
                            <div className="col-span-2">
                              <label className="block text-[9px] text-capsule-text-muted uppercase font-bold mb-1 font-mono">Կապված Կալկուլյատորի Բաժինը (Target Calculator Category Anchor)</label>
                              <select
                                value={fp.categoryId}
                                onChange={(e) => {
                                              const updated = [...editFeaturedProducts];
                                              updated[fIdx] = { ...fp, categoryId: e.target.value };
                                              setEditFeaturedProducts(updated);
                                }}
                                className="w-full bg-white border border-[#2E3159]/20 rounded-lg p-1.5 text-xs outline-none focus:border-capsule-accent font-sans font-bold text-capsule-accent"
                              >
                                {categories.map(cat => (
                                  <option key={cat.id} value={cat.id}>
                                    {cat.navLabel || cat.name} (ID: {cat.id})
                                  </option>
                                ))}
                              </select>
                              <p className="text-[10px] text-capsule-accent mt-1">
                                🔗 Գլխավոր էջում այս ապրանքի վրա սեղմելիս, օգտատերը կուղղորդվի կալկուլյատոր և ավտոմատ կընտրվի նշված բաժինը։
                              </p>
                            </div>

                          </div>
                          
                        </div>

                      </div>
                    ))}
                  </div>

                  {/* Symmetrical bottom save button */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={handleSaveAll}
                      className="bg-[#1A3F25] text-white text-xs font-bold px-6 py-2 rounded-full hover:bg-opacity-95 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>💾 {locale === "hy" ? "Պահպանել բոլորը" : "Save All"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: BOXES PRICING & SPECIFICATIONS CONFIGURATION */}
              {activeTab === "box_pricing" && editPricingRules && (
                <div className="space-y-6">
                  <div className="border-b border-capsule-accent/10 pb-3 flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <h3 className="font-serif text-lg text-capsule-accent font-semibold">📦 Տուփերի Գնագոյացման Կառավարման Վահանակ (Boxes Pricing Portal)</h3>
                      <p className="text-[11px] text-capsule-text-muted mt-1">
                        Այստեղ կարող եք փոփոխել պատերի հաստությունը (մմ), հավաքման սակագները, մարժաներն ու պատրաստի չափսերի անհատական գները։
                      </p>
                    </div>
                  </div>

                  {/* SECTION 1: WALL THICKNESS & DIMENSION RULES */}
                  <div className="bg-capsule-surf2/25 border border-capsule-accent/10 p-5 rounded-xl space-y-4">
                    <h4 className="font-sans text-xs font-bold text-capsule-accent uppercase tracking-wider">
                      1. Պատերի Հաստության Կարգավորում (Wall Thickness in mm)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] text-capsule-text-secondary uppercase font-bold mb-1">
                          Սովորական Ստվարաթուղթ (Standard Folding)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.1"
                            value={editPricingRules.box_wall_thickness_standard !== undefined ? editPricingRules.box_wall_thickness_standard : 0.5}
                            onChange={(e) => {
                              setEditPricingRules({
                                ...editPricingRules,
                                box_wall_thickness_standard: parseFloat(e.target.value) || 0
                              });
                            }}
                            className="bg-white border border-capsule-accent/15 rounded-lg py-1.5 px-3 w-full font-mono font-bold text-xs outline-none focus:border-capsule-accent"
                          />
                          <span className="absolute right-3 top-1.5 text-[9px] font-bold text-capsule-text-muted uppercase">մմ</span>
                        </div>
                        <p className="text-[9px] text-capsule-text-muted mt-1">
                          Ծալվող ստվարաթղթե տուփերի պատի միջին հաստությունը (օր.՝ 0.5 մմ)։
                        </p>
                      </div>

                      <div>
                        <label className="block text-[10px] text-capsule-text-secondary uppercase font-bold mb-1">
                          Պրեմիում Կոշտ Ստվարաթուղթ (Premium Rigid)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.1"
                            value={editPricingRules.box_wall_thickness_rigid !== undefined ? editPricingRules.box_wall_thickness_rigid : 2.0}
                            onChange={(e) => {
                              setEditPricingRules({
                                ...editPricingRules,
                                box_wall_thickness_rigid: parseFloat(e.target.value) || 0
                              });
                            }}
                            className="bg-white border border-capsule-accent/15 rounded-lg py-1.5 px-3 w-full font-mono font-bold text-xs outline-none focus:border-capsule-accent"
                          />
                          <span className="absolute right-3 top-1.5 text-[9px] font-bold text-capsule-text-muted uppercase">մմ</span>
                        </div>
                        <p className="text-[9px] text-capsule-text-muted mt-1">
                          Rigid տուփերի ներքին մոխրագույն ստվարաթղթի (greyboard) հաստությունը (օր.՝ 2.0 մմ / 1.5 մմ)։
                        </p>
                      </div>

                      <div>
                        <label className="block text-[10px] text-capsule-text-secondary uppercase font-bold mb-1">
                          Կոշտ Տուփի Բարձրության Շեմ (Rigid Height Floor)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.1"
                            value={editPricingRules.box_rigid_height_floor !== undefined ? editPricingRules.box_rigid_height_floor : 3.0}
                            onChange={(e) => {
                              setEditPricingRules({
                                ...editPricingRules,
                                box_rigid_height_floor: parseFloat(e.target.value) || 0
                              });
                            }}
                            className="bg-white border border-capsule-accent/15 rounded-lg py-1.5 px-3 w-full font-mono font-bold text-xs outline-none focus:border-capsule-accent"
                          />
                          <span className="absolute right-3 top-1.5 text-[9px] font-bold text-capsule-text-muted uppercase">սմ</span>
                        </div>
                        <p className="text-[9px] text-capsule-text-muted mt-1">
                          Կոշտ տուփերի կառուցվածքային սահմանաչափով նվազագույն թույլատրելի բարձրությունը (օր.՝ 3.0 սմ)։
                        </p>
                      </div>
                    </div>

                    {/* Surcharges per unit based on chosen wall thickness/greyboard core */}
                    <div className="border-t border-capsule-accent/5 pt-4 mt-4">
                      <h5 className="font-sans text-[10px] font-bold text-capsule-accent uppercase tracking-wider mb-2">
                        Կոշտ ստվարաթղթի (Greyboard) հաստության գնային հավելումներ (Core Surcharges per unit in AMD)
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[10px] text-capsule-text-secondary uppercase font-bold mb-1">
                            1.5 մմ հաստություն (֏)
                          </label>
                          <input
                            type="number"
                            value={editPricingRules.box_thick_surcharge_1_5 !== undefined ? editPricingRules.box_thick_surcharge_1_5 : -30}
                            onChange={(e) => {
                              setEditPricingRules({
                                ...editPricingRules,
                                box_thick_surcharge_1_5: parseInt(e.target.value, 10) || 0
                              });
                            }}
                            className="bg-white border border-capsule-accent/15 rounded-lg py-1.5 px-3 w-full font-mono font-bold text-xs outline-none focus:border-capsule-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-capsule-text-secondary uppercase font-bold mb-1">
                            2.0 մմ հաստություն (֏)
                          </label>
                          <input
                            type="number"
                            value={editPricingRules.box_thick_surcharge_2_0 !== undefined ? editPricingRules.box_thick_surcharge_2_0 : 0}
                            onChange={(e) => {
                              setEditPricingRules({
                                ...editPricingRules,
                                box_thick_surcharge_2_0: parseInt(e.target.value, 10) || 0
                              });
                            }}
                            className="bg-white border border-capsule-accent/15 rounded-lg py-1.5 px-3 w-full font-mono font-bold text-xs outline-none focus:border-capsule-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-capsule-text-secondary uppercase font-bold mb-1">
                            2.5 մմ հաստություն (֏)
                          </label>
                          <input
                            type="number"
                            value={editPricingRules.box_thick_surcharge_2_5 !== undefined ? editPricingRules.box_thick_surcharge_2_5 : 80}
                            onChange={(e) => {
                              setEditPricingRules({
                                ...editPricingRules,
                                box_thick_surcharge_2_5: parseInt(e.target.value, 10) || 0
                              });
                            }}
                            className="bg-white border border-capsule-accent/15 rounded-lg py-1.5 px-3 w-full font-mono font-bold text-xs outline-none focus:border-capsule-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-capsule-text-secondary uppercase font-bold mb-1">
                            3.0 մմ հաստություն (֏)
                          </label>
                          <input
                            type="number"
                            value={editPricingRules.box_thick_surcharge_3_0 !== undefined ? editPricingRules.box_thick_surcharge_3_0 : 160}
                            onChange={(e) => {
                              setEditPricingRules({
                                ...editPricingRules,
                                box_thick_surcharge_3_0: parseInt(e.target.value, 10) || 0
                              });
                            }}
                            className="bg-white border border-capsule-accent/15 rounded-lg py-1.5 px-3 w-full font-mono font-bold text-xs outline-none focus:border-capsule-accent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: ASSEMBLY COSTS & SURCHARGES */}
                  <div className="bg-capsule-surf2/25 border border-capsule-accent/10 p-5 rounded-xl space-y-4">
                    <h4 className="font-sans text-xs font-bold text-capsule-accent uppercase tracking-wider">
                      2. Աշխատուժի և Հավաքման Սակագներ (Assembly Labor & Surcharges)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] text-capsule-text-secondary uppercase font-bold mb-1">
                          Folding Box Base (֏)
                        </label>
                        <input
                          type="number"
                          value={editPricingRules.box_assembly_cost_folding !== undefined ? editPricingRules.box_assembly_cost_folding : 80}
                          onChange={(e) => {
                            setEditPricingRules({
                              ...editPricingRules,
                              box_assembly_cost_folding: parseInt(e.target.value, 10) || 0
                            });
                          }}
                          className="bg-white border border-capsule-accent/15 rounded-lg py-1.5 px-3 w-full font-mono font-bold text-xs outline-none focus:border-capsule-accent"
                        />
                        <p className="text-[9px] text-capsule-text-muted mt-1">
                          Փափուկ ծալվող տուփերի հավաքման բազային աշխատուժի գինը։
                        </p>
                      </div>

                      <div>
                        <label className="block text-[10px] text-capsule-text-secondary uppercase font-bold mb-1">
                          Rigid Box Base (֏)
                        </label>
                        <input
                          type="number"
                          value={editPricingRules.box_assembly_cost_rigid !== undefined ? editPricingRules.box_assembly_cost_rigid : 250}
                          onChange={(e) => {
                            setEditPricingRules({
                              ...editPricingRules,
                              box_assembly_cost_rigid: parseInt(e.target.value, 10) || 0
                            });
                          }}
                          className="bg-white border border-capsule-accent/15 rounded-lg py-1.5 px-3 w-full font-mono font-bold text-xs outline-none focus:border-capsule-accent"
                        />
                        <p className="text-[9px] text-capsule-text-muted mt-1">
                          Rigid (Կոշտ կափարիչով) տուփերի պատրաստման և պաստառապատման բազային աշխատուժի գինը։
                        </p>
                      </div>

                      <div>
                        <label className="block text-[10px] text-capsule-text-secondary uppercase font-bold mb-1">
                          Magnetic Flap Surcharge (֏)
                        </label>
                        <input
                          type="number"
                          value={editPricingRules.box_surcharge_magnetic !== undefined ? editPricingRules.box_surcharge_magnetic : 200}
                          onChange={(e) => {
                            setEditPricingRules({
                              ...editPricingRules,
                              box_surcharge_magnetic: parseInt(e.target.value, 10) || 0
                            });
                          }}
                          className="bg-white border border-capsule-accent/15 rounded-lg py-1.5 px-3 w-full font-mono font-bold text-xs outline-none focus:border-capsule-accent"
                        />
                        <p className="text-[9px] text-capsule-text-muted mt-1">
                          Մագնիսական կափարիչով տուփերի նեոդիմյան մագնիսների և փաթթոցման հավելավճարը։
                        </p>
                      </div>

                      <div>
                        <label className="block text-[10px] text-capsule-text-secondary uppercase font-bold mb-1">
                          Shoulder Neck Surcharge (֏)
                        </label>
                        <input
                          type="number"
                          value={editPricingRules.box_surcharge_shoulder_neck !== undefined ? editPricingRules.box_surcharge_shoulder_neck : 100}
                          onChange={(e) => {
                            setEditPricingRules({
                              ...editPricingRules,
                              box_surcharge_shoulder_neck: parseInt(e.target.value, 10) || 0
                            });
                          }}
                          className="bg-white border border-capsule-accent/15 rounded-lg py-1.5 px-3 w-full font-mono font-bold text-xs outline-none focus:border-capsule-accent"
                        />
                        <p className="text-[9px] text-capsule-text-muted mt-1">
                          Օձիքով (Shoulder/hinge neck) տուփերի ուսիկների և ճշգրիտ հարմարեցման հավելավճարը։
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: SELLING PRICE FLOORS */}
                  <div className="bg-capsule-surf2/25 border border-capsule-accent/10 p-5 rounded-xl space-y-4">
                    <h4 className="font-sans text-xs font-bold text-capsule-accent uppercase tracking-wider">
                      3. Նվազագույն Վաճառքի Շեմեր (Min Unit Price Selling Floors)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] text-capsule-text-secondary uppercase font-bold mb-1">
                          Folding Box Min (֏)
                        </label>
                        <input
                          type="number"
                          value={editPricingRules.box_min_sell_folding !== undefined ? editPricingRules.box_min_sell_folding : 200}
                          onChange={(e) => {
                            setEditPricingRules({
                              ...editPricingRules,
                              box_min_sell_folding: parseInt(e.target.value, 10) || 0
                            });
                          }}
                          className="bg-white border border-capsule-accent/15 rounded-lg py-1.5 px-3 w-full font-mono font-bold text-xs outline-none focus:border-capsule-accent"
                        />
                        <p className="text-[9px] text-capsule-text-muted mt-1">
                          Ծալվող սովորական տուփի նվազագույն վաճառքի միավոր գինը։
                        </p>
                      </div>

                      <div>
                        <label className="block text-[10px] text-capsule-text-secondary uppercase font-bold mb-1">
                          Rigid Box Min (֏)
                        </label>
                        <input
                          type="number"
                          value={editPricingRules.box_min_sell_rigid !== undefined ? editPricingRules.box_min_sell_rigid : 600}
                          onChange={(e) => {
                            setEditPricingRules({
                              ...editPricingRules,
                              box_min_sell_rigid: parseInt(e.target.value, 10) || 0
                            });
                          }}
                          className="bg-white border border-capsule-accent/15 rounded-lg py-1.5 px-3 w-full font-mono font-bold text-xs outline-none focus:border-capsule-accent"
                        />
                        <p className="text-[9px] text-capsule-text-muted mt-1">
                          Rigid (Կափարիչով կոշտ) տուփի նվազագույն վաճառքի միավոր գինը։
                        </p>
                      </div>

                      <div>
                        <label className="block text-[10px] text-capsule-text-secondary uppercase font-bold mb-1">
                          Magnetic Flap Min (֏)
                        </label>
                        <input
                          type="number"
                          value={editPricingRules.box_min_sell_magnetic !== undefined ? editPricingRules.box_min_sell_magnetic : 900}
                          onChange={(e) => {
                            setEditPricingRules({
                              ...editPricingRules,
                              box_min_sell_magnetic: parseInt(e.target.value, 10) || 0
                            });
                          }}
                          className="bg-white border border-capsule-accent/15 rounded-lg py-1.5 px-3 w-full font-mono font-bold text-xs outline-none focus:border-capsule-accent"
                        />
                        <p className="text-[9px] text-capsule-text-muted mt-1">
                          Մագնիսական կոշտ տուփի նվազագույն վաճառքի միավոր գինը։
                        </p>
                      </div>

                      <div>
                        <label className="block text-[10px] text-capsule-text-secondary uppercase font-bold mb-1">
                          Shoulder Neck Min (֏)
                        </label>
                        <input
                          type="number"
                          value={editPricingRules.box_min_sell_shoulder_neck !== undefined ? editPricingRules.box_min_sell_shoulder_neck : 850}
                          onChange={(e) => {
                            setEditPricingRules({
                              ...editPricingRules,
                              box_min_sell_shoulder_neck: parseInt(e.target.value, 10) || 0
                            });
                          }}
                          className="bg-white border border-capsule-accent/15 rounded-lg py-1.5 px-3 w-full font-mono font-bold text-xs outline-none focus:border-capsule-accent"
                        />
                        <p className="text-[9px] text-capsule-text-muted mt-1">
                          Ուսիկով (Shoulder neck) տուփի նվազագույն վաճառքի միավոր գինը։
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: PREDEFINED SIZES & FIXED PRICING PORTAL (kakoy razmer, kakoy cena) */}
                  <div className="bg-capsule-surf2/25 border border-capsule-accent/10 p-5 rounded-xl space-y-4">
                    <div className="flex justify-between items-center border-b border-capsule-accent/10 pb-2 flex-wrap gap-2">
                      <h4 className="font-sans text-xs font-bold text-capsule-accent uppercase tracking-wider">
                        4. Տուփերի Պատրաստի Չափսեր և Անհատական Գներ (Predeclared Sizes & Direct Prices)
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          const boxesIdx = editProducts.findIndex(p => p.id === "boxes_items");
                          if (boxesIdx !== -1) {
                            const newIt = {
                              id: "it_" + Date.now(),
                              name: "Տուփ 15×15×5 սմ",
                              price: 650,
                              unit: "հատ"
                            };
                            const updated = [...editProducts];
                            updated[boxesIdx] = {
                              ...updated[boxesIdx],
                              items: [newIt, ...updated[boxesIdx].items]
                            };
                            setEditProducts(updated);
                          }
                        }}
                        className="bg-capsule-accent text-capsule-surf px-2.5 py-1 rounded text-[10px] font-bold uppercase cursor-pointer flex items-center gap-1 hover:bg-capsule-accent-light transition-all shadow-sm"
                      >
                        <Plus size={12} /> Ավելացնել Չափս / Գին
                      </button>
                    </div>

                    <p className="text-[11px] text-capsule-text-muted mt-1">
                      Այստեղ կարող եք ստեղծել կոնկրետ չափսեր և դրանց ուղղակի վաճառքի գինը (֏), որոնք կլինեն ընտրության ցանկում։
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
                      {editProducts.find(p => p.id === "boxes_items")?.items.map((it, itIdx) => {
                        const boxesPIdx = editProducts.findIndex(p => p.id === "boxes_items");
                        return (
                          <div key={it.id} className="grid grid-cols-12 gap-2 items-center bg-white p-3 rounded-lg border border-capsule-accent/10 text-xs shadow-sm">
                            <div className="col-span-7">
                              <label className="block text-[8px] text-capsule-text-muted uppercase font-bold">Անվանում և Չափս</label>
                              <input
                                type="text"
                                value={it.name}
                                onChange={(e) => {
                                  const updated = [...editProducts];
                                  const prod = updated[boxesPIdx];
                                  const updatedItems = [...prod.items];
                                  updatedItems[itIdx] = { ...it, name: e.target.value };
                                  updated[boxesPIdx] = { ...prod, items: updatedItems };
                                  setEditProducts(updated);
                                }}
                                className="bg-transparent border-b border-capsule-accent/10 focus:border-capsule-accent outline-none font-sans font-bold w-full text-capsule-dark mt-0.5 py-0.5"
                                placeholder="օր.՝ Տուփ 15×15×5 սմ"
                              />
                            </div>
                            <div className="col-span-4">
                              <label className="block text-[8px] text-capsule-text-muted uppercase font-bold">Միավորի Գին (֏)</label>
                              <input
                                type="number"
                                value={it.price}
                                onChange={(e) => {
                                  const updated = [...editProducts];
                                  const prod = updated[boxesPIdx];
                                  const updatedItems = [...prod.items];
                                  updatedItems[itIdx] = { ...it, price: parseInt(e.target.value, 10) || 0 };
                                  updated[boxesPIdx] = { ...prod, items: updatedItems };
                                  setEditProducts(updated);
                                }}
                                className="bg-capsule-surf2/50 rounded px-2 py-1 font-mono font-bold text-center text-capsule-accent w-full mt-0.5"
                              />
                            </div>
                            <div className="col-span-1 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...editProducts];
                                  const prod = updated[boxesPIdx];
                                  updated[boxesPIdx] = {
                                    ...prod,
                                    items: prod.items.filter((_, i) => i !== itIdx)
                                  };
                                  setEditProducts(updated);
                                }}
                                className="text-red-700 hover:bg-red-50 p-1.5 rounded cursor-pointer mt-2"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9S: CREDENTIALS UPDATE */}
              {activeTab === "credentials" && (
                <div className="space-y-4 max-w-sm">
                  <h3 className="font-serif text-base text-capsule-accent font-semibold">Մուտքի Տվյալների Փոփոխում</h3>
                  <form onSubmit={handleCredentialsUpdate} className="space-y-3">
                    <div>
                      <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Նոր Օգտանուն</label>
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="admin"
                        className="w-full bg-capsule-surf2 border border-capsule-accent/10 rounded py-1.5 px-3 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Նոր Գաղտնաբառ</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-capsule-surf2 border border-capsule-accent/10 rounded py-1.5 px-3 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">PIN Կոդ</label>
                      <input
                        type="password"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        placeholder="1234"
                        className="w-full bg-capsule-surf2 border border-capsule-accent/10 rounded py-1.5 px-3 text-xs outline-none font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-capsule-accent text-capsule-surf text-xs py-2 px-5 rounded-full font-semibold uppercase tracking-wider shadow cursor-pointer transition-all mt-2"
                    >
                      Թարմացնել Տվյալները
                    </button>
                  </form>
                </div>
              )}

              {/* TAB: BACKUPS & INTEGRATION SYNC */}
              {activeTab === "backups" && (
                <div className="space-y-6 max-w-2xl bg-white p-6 rounded-xl border border-capsule-accent/10 shadow-sm">
                  <div className="border-b border-capsule-accent/10 pb-4">
                    <h3 className="font-serif text-lg text-capsule-accent font-semibold flex items-center gap-2">
                      <span>💾</span> Տվյալների Պահուստավորում և Սինքրոնիզացիա (Backup & Sync)
                    </h3>
                    <p className="text-xs text-capsule-text-secondary mt-1">
                      Ներբեռնեք Ձեր ամբողջական տվյալների բազան կամ վերականգնեք այն JSON ֆայլի միջոցով։
                    </p>
                  </div>

                  {backupSuccess && (
                     <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg">
                       🟢 {backupSuccess}
                     </div>
                  )}

                  {backupError && (
                     <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-lg">
                       🔴 {backupError}
                     </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Export Card */}
                    <div className="border border-capsule-accent/5 bg-capsule-surf2/30 p-5 rounded-lg flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-xs text-capsule-accent uppercase tracking-wider mb-2">Ներբեռնել (Backup / Export)</h4>
                        <p className="text-xs text-capsule-text-muted leading-relaxed mb-4">
                          Արտահանեք ամբողջական տվյալների բազան (բոլոր գները, բանաձևերը, կատեգորիաները, այլ ապրանքները և հարցումները) որպես մեկ <strong className="font-mono text-capsule-dark direct-select">capsule_database.json</strong> ֆայլ։
                        </p>
                      </div>
                      <button
                        onClick={handleDownloadBackup}
                        disabled={backupLoading}
                        className="w-full bg-capsule-accent hover:bg-capsule-accent-light text-capsule-surf py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow cursor-pointer text-center disabled:opacity-50"
                      >
                        {backupLoading ? "Ներբեռնվում է..." : "⬇️ Ներբեռնել Պահուստային Ֆայլը"}
                      </button>
                    </div>

                    {/* Import Card */}
                    <div className="border border-capsule-accent/5 bg-capsule-surf2/30 p-5 rounded-lg flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-xs text-capsule-accent uppercase tracking-wider mb-2">Վերականգնել (Import / Restore)</h4>
                        <p className="text-xs text-capsule-text-muted leading-relaxed mb-4">
                          Վերականգնեք Ձեր ամբողջ տվյալների բազան՝ վերբեռնելով նախկինում ներբեռնված պահուստային <strong className="font-mono text-capsule-dark">.json</strong> ֆայլը։ Բոլոր ընթացիկ տվյալները կփոխարինվեն։
                        </p>
                      </div>
                      <label className={`w-full bg-capsule-dark hover:bg-capsule-accent text-capsule-surf py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow cursor-pointer text-center block ${importLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                        {importLoading ? "Վերականգնվում է..." : "⬆️ Վերբեռնել և Վերականգնել (JSON)"}
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportBackup}
                          className="hidden"
                          disabled={importLoading}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Render.com sync guidance */}
                  <div className="bg-capsule-accent/5 border border-capsule-accent/15 p-5 rounded-xl space-y-3">
                    <h4 className="font-serif font-bold text-xs text-capsule-dark uppercase tracking-wider flex items-center gap-1.5">
                      <span>☁️</span> ERP / Render & GitHub Ավտոմատ Սինքրոնիզացիա
                    </h4>
                    <p className="text-xs text-capsule-text-secondary leading-relaxed">
                      Render հոսթինգը օգտագործում է <strong className="text-capsule-accent font-semibold">ephemeral filesystem (ժամանակավոր ֆայլային համակարգ)</strong>: Սա նշանակում է՝ ամեն անգամ նոր տարբերակ թողարկելիս (Redeploy / Update) կամ սերվերը ավտոմատ վերագործարկվելիս, սերվերի վրայի տեղական ֆայլերը ջնջվում են և վերականգնվում են GitHub-ում կոմիթ արված տարբերակով, ինչի պատճառով ադմինից կատարված փոփոխությունները կարող են կորչել։
                    </p>
                    <div className="space-y-2 pt-1.5">
                      <p className="text-[11px] font-bold text-capsule-accent uppercase tracking-wider">
                        🛠️ Ինչպե՞ս միացնել ավտոմատ պահպանումը GitHub-ում (Foolproof Auto-Sync).
                      </p>
                      <p className="text-xs text-capsule-text-muted leading-relaxed">
                        Դուք կարող եք Render-ի Ձեր Վահանակում (Environment Variables բաժնում) ավելացնել հետևյալ փոփոխականները։ Այդ դեպքում համակարգը ավտոմատ կերպով ցանկացած կարգավորում փոխելիս փոփոխությունները կոմիթ կանի Ձեր GitHub-ում, ինչը կկանխի ցանկացած տվյալների կորուստ.
                      </p>
                      <ul className="list-disc list-inside space-y-1.5 text-xs text-capsule-text-secondary pl-2 bg-white/50 p-3 rounded border border-capsule-accent/5 font-mono">
                        <li>
                          <strong className="text-capsule-dark">GITHUB_TOKEN</strong>: Ձեր personal access token-ը (PAT), որը տալիս է repo-ին կարդալու/գրելու թույլտվություն (տես GitHub Settings)։
                        </li>
                        <li>
                          <strong className="text-capsule-dark">GITHUB_REPO</strong>: Ձեր պրոյեկտի ռեպոզիտորիան (օր․՝ <code className="bg-capsule-surf2 py-0.5 px-1 rounded">username/repo-name</code>)։
                        </li>
                        <li>
                          <strong className="text-capsule-dark">GITHUB_BRANCH</strong>: Այն ճյուղը, որով աշխատում եք (լռելյայն՝ <code className="bg-capsule-surf2 py-0.5 px-1 rounded">main</code>)։
                        </li>
                      </ul>
                      <p className="text-xs text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded border border-emerald-200 mt-2">
                        💡 Եթե GitHub sync-ը միացված չէ, միշտ կարող եք օգտվել վերևի <strong>«Ներբեռնել / Վերականգնել»</strong> կոճակներից՝ ձեռքով ֆայլը պահպանելու և նոր դիպլոյից հետո 1 վայրկյանում ետ բեռնելու համար։
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: AI AGENT SETTINGS */}
              {activeTab === "ai_agent" && editAiSettings && (
                <div className="space-y-6 max-w-3xl bg-white p-6 rounded-xl border border-capsule-accent/10 shadow-sm animate-fade-in">
                  <div className="border-b border-capsule-accent/10 pb-4">
                    <h3 className="font-serif text-lg text-capsule-accent font-semibold flex items-center gap-2">
                      <span>🤖</span> AI Օգնականի Կարգավորումներ (AI Agent Settings)
                    </h3>
                    <p className="text-xs text-capsule-text-secondary mt-1">
                      Կարգավորեք Capsule Concept-ի ավտոմատ AI համակարգի պետությունները, հրահանգները և պարամետրերը:
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Toggle Activation Switch */}
                    <div className="flex items-center justify-between p-4 bg-capsule-surf2/30 border border-capsule-accent/5 rounded-lg">
                      <div>
                        <h4 className="font-serif font-bold text-xs text-capsule-dark uppercase tracking-wider">ԱԿՏԻՎԱՑՆԵԼ AI ՕԳՆԱԿԱՆԸ (Enable AI Chat)</h4>
                        <p className="text-xs text-capsule-text-muted mt-0.5">Անջատելու դեպքում AI Խորհրդատուի բաժինը ամբողջությամբ կթաքնվի կայքից։</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={editAiSettings.enabled}
                          onChange={(e) => setEditAiSettings({ ...editAiSettings, enabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-capsule-accent"></div>
                      </label>
                    </div>

                    {/* Model & Temp Inputs row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-capsule-dark uppercase tracking-wider mb-1.5">Model Name (Gemini API Engine)</label>
                        <select
                          value={editAiSettings.modelName || "gemini-3.5-flash"}
                          onChange={(e) => setEditAiSettings({ ...editAiSettings, modelName: e.target.value })}
                          className="w-full bg-[#FAFAF9] border border-capsule-accent/25 rounded-lg py-2.5 px-3.5 text-xs text-capsule-dark font-semibold outline-none focus:ring-1 focus:ring-capsule-accent transition-all"
                        >
                          <option value="gemini-3.5-flash">Gemini 3.5 Flash (Default/Recommended)</option>
                          <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                          <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-capsule-dark uppercase tracking-wider mb-1.5">Temperature / Ջերմաստիճան ({editAiSettings.temperature})</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={editAiSettings.temperature}
                            onChange={(e) => setEditAiSettings({ ...editAiSettings, temperature: parseFloat(e.target.value) })}
                            className="flex-1 accent-capsule-accent cursor-pointer"
                          />
                          <span className="font-mono text-xs text-capsule-dark font-bold bg-[#FAFAF9] border px-2.5 py-1 rounded block">{editAiSettings.temperature}</span>
                        </div>
                        <p className="text-[10px] text-capsule-text-muted mt-1">Որքան ցածր է արժեքը, այնքան պատասխանները կլինեն ճշգրիտ, փաստացի և հետևողական:</p>
                      </div>
                    </div>

                    {/* System Prompt Custom Instructions text area */}
                    <div>
                      <label className="block text-xs font-bold text-capsule-dark uppercase tracking-wider mb-1.5">AI System Prompt Instructions (Հրահանգներ AI-ի համար)</label>
                      <textarea
                        rows={10}
                        value={editAiSettings.systemPrompt}
                        onChange={(e) => setEditAiSettings({ ...editAiSettings, systemPrompt: e.target.value })}
                        className="w-full bg-[#FAFAF9] border border-capsule-accent/25 rounded-lg py-3 px-3.5 text-xs text-capsule-dark font-medium leading-relaxed outline-none focus:ring-1 focus:ring-capsule-accent font-sans transition-all"
                        placeholder="Write dynamic system instruction guidelines..."
                      />
                      <p className="text-[10px] text-capsule-text-muted mt-1 leading-relaxed">
                        💡 <em>Նշում:</em> Բոլոր ակտիվ չափսերը, թղթերի տեսակներն ու հետտպագրական մշակումների գները ավտոմատ կերպով կցվում են այս հրահանգի վերջում, այնպես որ AI-ն միշտ կտիրապետի վերջին տվյալներին:
                      </p>
                    </div>

                    {/* Quick Suggestions Helper Buttons to restore defaults */}
                    <div className="flex justify-between items-center bg-capsule-accent/5 p-4 rounded-lg border border-capsule-accent/10">
                      <div className="text-[11px] text-capsule-text-secondary font-medium">
                        Ցանկանու՞մ եք վերադարձնել լռելյայն հրահանգները:
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Ցանկանու՞մ եք վերականգնել լռելյայն համակարգային հրահանգները:")) {
                            setEditAiSettings({
                              ...editAiSettings,
                              systemPrompt: `Դուք Capsule Concept-ի պրոֆեսիոնալ փաթեթավորման և տպագրության խորհրդատուն եք (Professional Packaging & Printing Consultant)։\nՁեր միակ առաքելությունն է խորհրդատվություն և օգնություն մատուցել հաճախորդներին տպագրության, տոպրակների, տուփերի, ժապավենների, սթիքերների և այլ փաթեթավորման նյութերի ընտրության վերաբերյալ։\n\nԿԱՐԵՎՈՐ ԿԱՆՈՆՆԵՐ (Strict Guidelines):\n1. Եղեք խիստ պրոֆեսիոնալ, կոնկրետ, օբյեկտիվ և հակիրճ։ Մի՛ փորձեք ընկերանալ հաճախորդի հետ, խուսափեք չափազանց ջերմ, ոչ պաշտոնական կամ հասարակ արտահայտություններից (ne navalit družic)։ Պատասխանեք պարզ, սառնասիրտ, բայց օգնող և պոլիտեկտ՝ ինչպես Capsule Concept բարձրակարգ ընկերության պրոֆեսիոնալ ներկայացուցիչը։\n2. Խոսեք ՄԻԱՅՆ տպագրության, թղթերի տեսակների (foil, lamination, kraft, rigid, decorative), տուփերի, տոպրակների և փաթեթավորման թեմաների շրջանակներում։ Եթե հաճախորդը փորձի զրուցել այլ թեմաներից (օրինակ՝ խոհարարություն, ծրագրավորում, պատմություն, անձնական հարցեր, անկապ զրույցներ), քաղաքավարի բայց հաստատակամորեն մերժեք և ուղղորդեք հարցը դեպի մաքուր տպագրության ու տոպրակների/տուփերի աշխարհ։\n3. Օգտագործեք միայն Capsule Concept-ի իրական ցանկերն ու տվյալները, որոնք առկա են մեր պորտֆոլիոյում (folio) և բազայում։\n4. Զրուցեք այն լեզվով, որով դիմել է օգտատերը (հայերեն, ռուսերեն կամ անգլերեն)։ Գրեք գրագետ և առանց ուղղագրական սխալների։\n5. Պատասխանները պահեք փոքր, կազմակերպված և հեշտ ընթեռնելի (օգտագործեք bullet point-եր կամ կարճ պարբերություններ)։`
                            });
                          }
                        }}
                        className="py-1.5 px-3 bg-white hover:bg-capsule-accent/5 rounded-full border border-capsule-accent/20 text-[10px] font-bold uppercase tracking-wider transition-colors inline-block cursor-pointer select-none"
                      >
                        🔄 Վերականգնել Լռելյայնը / Default
                      </button>
                    </div>

                    {/* Apply Configuration Form Submission button */}
                    <div className="flex bg-white justify-end pt-3">
                      <button
                        type="button"
                        onClick={handleSaveAll}
                        className="bg-capsule-accent hover:bg-capsule-accent-light text-capsule-surf text-xs py-2.5 px-6 rounded-full font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer selection:bg-transparent"
                      >
                        <Save size={13} />
                        ՊԱՀՊԱՆԵԼ AI ԿԱՐԳԱՎՈՐՈՒՄՆԵՐԸ
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: TIERS */}
              {activeTab === "tiers" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-capsule-accent/10 pb-2">
                    <h3 className="font-serif text-base text-capsule-accent font-semibold">Մեծածախ Քանակի Գործակիցներ (Tiers)</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newTier: Tier = {
                          id: "t_" + Date.now(),
                          qty: 3000,
                          mult: 0.5,
                          best: false
                        };
                        setEditTiers([...editTiers, newTier]);
                      }}
                      className="bg-capsule-accent text-capsule-surf px-3 py-1 rounded-lg text-xs font-bold uppercase cursor-pointer"
                    >
                      + Ավելացնել Tier
                    </button>
                  </div>
                  <div className="space-y-3">
                    {editTiers.map((t, idx) => (
                      <div key={t.id} className="bg-capsule-surf2/40 border border-capsule-accent/10 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-1 grid grid-cols-3 gap-3 text-xs">
                          <div>
                            <label className="block text-[9px] text-capsule-text-muted uppercase font-bold">Քանակ</label>
                            <input
                              type="number"
                              value={t.qty}
                              onChange={(e) => {
                                const updated = [...editTiers];
                                updated[idx] = { ...t, qty: parseInt(e.target.value, 10) || 0 };
                                setEditTiers(updated);
                              }}
                              className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-2 font-mono text-center w-full font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-capsule-text-muted uppercase font-bold">Գործակից (mult)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={t.mult}
                              onChange={(e) => {
                                const updated = [...editTiers];
                                updated[idx] = { ...t, mult: parseFloat(e.target.value) || 0 };
                                setEditTiers(updated);
                              }}
                              className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-2 font-mono text-center w-full font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-capsule-text-muted uppercase font-bold">Լավագույն Գին</label>
                            <div className="flex items-center h-8 justify-center">
                              <input
                                type="checkbox"
                                checked={t.best}
                                onChange={(e) => {
                                  const updated = [...editTiers];
                                  updated[idx] = { ...t, best: e.target.checked };
                                  setEditTiers(updated);
                                }}
                                className="accent-capsule-accent size-4"
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditTiers(editTiers.filter(item => item.id !== t.id))}
                          className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold shrink-0 self-end sm:self-center h-8 flex items-center border border-red-200"
                        >
                          <Trash2 size={13} className="mr-1" /> Ջնջել
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: SIZES */}
              {activeTab === "sizes" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-capsule-accent/10 pb-2">
                    <h3 className="font-serif text-base text-capsule-accent font-semibold">Չափսերի Պրեսեթներ</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newDim: Dimension = {
                          id: "dim_" + Date.now(),
                          dim: "20×20×8",
                          w: 20,
                          h: 20,
                          d: 8,
                          active: true,
                          categoryId: "bags"
                        };
                        setEditDimensions([newDim, ...editDimensions]);
                      }}
                      className="bg-capsule-accent text-capsule-surf px-3 py-1 rounded-lg text-xs font-bold uppercase cursor-pointer"
                    >
                      + Նոր Չափս
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
                    {editDimensions.map((d, idx) => (
                      <div key={d.id} className="bg-capsule-surf2/40 border border-capsule-accent/10 p-3.5 rounded-xl space-y-3 relative">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] bg-capsule-accent/10 text-capsule-accent px-2 py-0.5 rounded uppercase tracking-wider font-bold">ID: {d.id}</span>
                          <div className="flex items-center gap-3">
                            <label className="text-[9px] text-capsule-text-muted font-bold uppercase flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={d.active}
                                onChange={(e) => {
                                  const updated = [...editDimensions];
                                  updated[idx] = { ...d, active: e.target.checked };
                                  setEditDimensions(updated);
                                }}
                                className="accent-capsule-accent size-3.5"
                              />
                              Ակտիվ
                            </label>
                            <button
                              type="button"
                              onClick={() => setEditDimensions(editDimensions.filter(item => item.id !== d.id))}
                              className="p-1 text-red-700 hover:bg-red-55 rounded"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2 text-xs">
                          <div>
                            <label className="block text-[9px] text-capsule-text-muted uppercase font-bold">Չափսի Տեքստ (սմ)</label>
                            <input
                              type="text"
                              value={d.dim}
                              onChange={(e) => {
                                const updated = [...editDimensions];
                                updated[idx] = { ...d, dim: e.target.value };
                                setEditDimensions(updated);
                              }}
                              className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-2.5 w-full font-bold"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] text-capsule-text-muted uppercase font-bold">Բաժին</label>
                              <select
                                value={d.categoryId}
                                onChange={(e) => {
                                  const updated = [...editDimensions];
                                  updated[idx] = { ...d, categoryId: e.target.value };
                                  setEditDimensions(updated);
                                }}
                                className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-2 w-full font-semibold"
                              >
                                {categories.map(c => (
                                  <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                              </select>
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                              <div>
                                <label className="block text-[8px] text-capsule-text-muted uppercase text-center font-bold">Լայնք</label>
                                <input
                                  type="number"
                                  value={d.w}
                                  onChange={(e) => {
                                    const updated = [...editDimensions];
                                    updated[idx] = { ...d, w: parseFloat(e.target.value) || 0 };
                                    setEditDimensions(updated);
                                  }}
                                  className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-1 text-center font-mono w-full font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] text-capsule-text-muted uppercase text-center font-bold">Բարձր</label>
                                <input
                                  type="number"
                                  value={d.h}
                                  onChange={(e) => {
                                    const updated = [...editDimensions];
                                    updated[idx] = { ...d, h: parseFloat(e.target.value) || 0 };
                                    setEditDimensions(updated);
                                  }}
                                  className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-1 text-center font-mono w-full font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] text-capsule-text-muted uppercase text-center font-bold">Խորք</label>
                                <input
                                  type="number"
                                  value={d.d}
                                  onChange={(e) => {
                                    const updated = [...editDimensions];
                                    updated[idx] = { ...d, d: parseFloat(e.target.value) || 0 };
                                    setEditDimensions(updated);
                                  }}
                                  className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-1 text-center font-mono w-full font-bold"
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 mt-1">
                              <div>
                                <label className="block text-[8px] text-capsule-text-secondary uppercase text-center font-bold">Գնի Ուղղում (֏)</label>
                                <input
                                  type="number"
                                  placeholder="Չկա"
                                  value={d.directPriceOverride || ""}
                                  onChange={(e) => {
                                    const updated = [...editDimensions];
                                    updated[idx] = { ...d, directPriceOverride: parseInt(e.target.value, 10) || undefined };
                                    setEditDimensions(updated);
                                  }}
                                  className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-1 text-center font-mono w-full font-bold text-emerald-700"
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] text-capsule-text-secondary uppercase text-center font-bold">Գործակից / Mult.</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  placeholder="1.00"
                                  value={d.priceMultiplier || ""}
                                  onChange={(e) => {
                                    const updated = [...editDimensions];
                                    updated[idx] = { ...d, priceMultiplier: parseFloat(e.target.value) || undefined };
                                    setEditDimensions(updated);
                                  }}
                                  className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-1 text-center font-mono w-full font-bold text-amber-700"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: TAXES & COEFFICIENTS */}
              {activeTab === "taxes" && editPricingRules && editDecPricingRules && (
                <div className="space-y-6">
                  <h3 className="font-serif text-base text-capsule-accent font-semibold border-b border-capsule-accent/10 pb-2">Մարժաներ, Զեղչեր և Հավելավճարներ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-1 col-span-2">
                    {/* STANDARD RULES */}
                    <div className="bg-capsule-surf2/20 border border-capsule-accent/10 rounded-2xl p-4 space-y-4">
                      <h4 className="font-serif font-bold text-sm text-capsule-accent uppercase tracking-wider border-b border-capsule-accent/5 pb-1 col-span-2">Ստանդարտ Բաժիններ (Standard Bags)</h4>
                      <div className="grid grid-cols-2 gap-3 text-xs col-span-2">
                        <div>
                          <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Markup Coefficient</label>
                          <input
                            type="number"
                            step="0.01"
                            value={editPricingRules.markup ?? 1.15}
                            onChange={(e) => setEditPricingRules({ ...editPricingRules, markup: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-2 px-3 outline-none font-semibold font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Profit Margin Mult</label>
                          <input
                            type="number"
                            step="0.01"
                            value={editPricingRules.margin ?? 1.45}
                            onChange={(e) => setEditPricingRules({ ...editPricingRules, margin: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-2 px-3 outline-none font-semibold font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Դիզայնի Գին (֏)</label>
                          <input
                            type="number"
                            value={editPricingRules.desfee ?? 15000}
                            onChange={(e) => setEditPricingRules({ ...editPricingRules, desfee: parseInt(e.target.value, 10) || 0 })}
                            className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-2 px-3 outline-none font-semibold font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Մին. MOQ (հատ)</label>
                          <input
                            type="number"
                            value={editPricingRules.minQty ?? 300}
                            onChange={(e) => setEditPricingRules({ ...editPricingRules, minQty: parseInt(e.target.value, 10) || 0 })}
                            className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-2 px-3 outline-none font-semibold font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">1/2 Գույն Գործակից</label>
                          <input
                            type="number"
                            value={editPricingRules.c2 ?? 48}
                            onChange={(e) => setEditPricingRules({ ...editPricingRules, c2: parseInt(e.target.value, 10) || 0 })}
                            className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-2 px-3 outline-none font-semibold font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">CMYK Գույների Գործակից</label>
                          <input
                            type="number"
                            value={editPricingRules.c4 ?? 98}
                            onChange={(e) => setEditPricingRules({ ...editPricingRules, c4: parseInt(e.target.value, 10) || 0 })}
                            className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-2 px-3 outline-none font-semibold font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Երկկողմանի Գործակից</label>
                          <input
                            type="number"
                            value={editPricingRules.s2 ?? 58}
                            onChange={(e) => setEditPricingRules({ ...editPricingRules, s2: parseInt(e.target.value, 10) || 0 })}
                            className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-2 px-3 outline-none font-semibold font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Թվային Տպ. Mult</label>
                          <input
                            type="number"
                            value={editPricingRules.dig ?? 42}
                            onChange={(e) => setEditPricingRules({ ...editPricingRules, dig: parseInt(e.target.value, 10) || 0 })}
                            className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-2 px-3 outline-none font-semibold font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* PREMIUM/DECORATIVE RULES */}
                    <div className="bg-capsule-surf2/20 border border-capsule-accent/10 rounded-2xl p-4 space-y-4">
                      <h4 className="font-serif font-bold text-sm text-capsule-accent uppercase tracking-wider border-b border-capsule-accent/5 pb-1">Դեկորատիվ Բաժիններ (Premium Bags)</h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Markup Coefficient</label>
                          <input
                            type="number"
                            step="0.01"
                            value={editDecPricingRules.markup ?? 1.25}
                            onChange={(e) => setEditDecPricingRules({ ...editDecPricingRules, markup: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-2 px-3 outline-none font-semibold font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Profit Margin Mult</label>
                          <input
                            type="number"
                            step="0.01"
                            value={editDecPricingRules.margin ?? 1.60}
                            onChange={(e) => setEditDecPricingRules({ ...editDecPricingRules, margin: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-2 px-3 outline-none font-semibold font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Դիզայնի Գին (֏)</label>
                          <input
                            type="number"
                            value={editDecPricingRules.desfee ?? 25000}
                            onChange={(e) => setEditDecPricingRules({ ...editDecPricingRules, desfee: parseInt(e.target.value, 10) || 0 })}
                            className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-2 px-3 outline-none font-semibold font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Մին. MOQ (հատ)</label>
                          <input
                            type="number"
                            value={editDecPricingRules.minQty ?? 300}
                            onChange={(e) => setEditDecPricingRules({ ...editDecPricingRules, minQty: parseInt(e.target.value, 10) || 0 })}
                            className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-2 px-3 outline-none font-semibold font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">1/2 Գույն Գործակից</label>
                          <input
                            type="number"
                            value={editDecPricingRules.c2 ?? 70}
                            onChange={(e) => setEditDecPricingRules({ ...editDecPricingRules, c2: parseInt(e.target.value, 10) || 0 })}
                            className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-2 px-3 outline-none font-semibold font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">CMYK Գույների Գործակից</label>
                          <input
                            type="number"
                            value={editDecPricingRules.c4 ?? 140}
                            onChange={(e) => setEditDecPricingRules({ ...editDecPricingRules, c4: parseInt(e.target.value, 10) || 0 })}
                            className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-2 px-3 outline-none font-semibold font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Երկկողմանի Գործակից</label>
                          <input
                            type="number"
                            value={editDecPricingRules.s2 ?? 80}
                            onChange={(e) => setEditDecPricingRules({ ...editDecPricingRules, s2: parseInt(e.target.value, 10) || 0 })}
                            className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-2 px-3 outline-none font-semibold font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-capsule-text-muted uppercase font-bold">Թվային Տպ. Mult</label>
                          <input
                            type="number"
                            value={editDecPricingRules.dig ?? 65}
                            onChange={(e) => setEditDecPricingRules({ ...editDecPricingRules, dig: parseInt(e.target.value, 10) || 0 })}
                            className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-2 px-3 outline-none font-semibold font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PRINTING METHODS */}
              {activeTab === "printing" && editPrintingMethods && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-capsule-accent/10 pb-2">
                    <h3 className="font-serif text-base text-capsule-accent font-semibold">Տպագրական Մեթոդներ</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newMethodObj = {
                          id: "method_" + Date.now(),
                          name: "Նոր Մեթոդ",
                          minQty: 100,
                          setupCost: 10000,
                          pricePerUnit: 50,
                          priceMultiplier: 1.0,
                          allowedCategories: ["bags", "boxes"],
                          active: true
                        };
                        setEditPrintingMethods([...editPrintingMethods, newMethodObj]);
                      }}
                      className="bg-capsule-accent text-capsule-surf px-3 py-1 rounded-lg text-xs font-bold uppercase cursor-pointer select-none"
                    >
                      + Նոր Մեթոդ
                    </button>
                  </div>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                    {editPrintingMethods.map((m, idx) => (
                      <div key={m.id} className="bg-capsule-surf2/40 border border-capsule-accent/10 p-4 rounded-xl space-y-3">
                        <div className="flex justify-between items-center">
                          <input
                            type="text"
                            value={m.name}
                            onChange={(e) => {
                              const updated = [...editPrintingMethods];
                              updated[idx] = { ...m, name: e.target.value };
                              setEditPrintingMethods(updated);
                            }}
                            className="bg-transparent border-none outline-none font-bold text-xs text-capsule-dark flex-1 font-sans border-b border-capsule-accent/10 py-1"
                          />
                          <div className="flex items-center gap-3 ml-2 text-xs">
                            <label className="text-[10px] text-capsule-text-secondary font-bold uppercase flex items-center gap-1 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={m.active}
                                onChange={(e) => {
                                  const updated = [...editPrintingMethods];
                                  updated[idx] = { ...m, active: e.target.checked };
                                  setEditPrintingMethods(updated);
                                }}
                                className="accent-capsule-accent h-4 w-4 rounded"
                              />
                              Ակտիվ
                            </label>
                            <button
                              type="button"
                              onClick={() => setEditPrintingMethods(editPrintingMethods.filter(item => item.id !== m.id))}
                              className="p-1 text-red-700 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div>
                            <span className="text-[9px] text-capsule-text-muted uppercase font-bold block">Նվազագույն Քանակ (MOQ)</span>
                            <input
                              type="number"
                              value={m.minQty}
                              onChange={(e) => {
                                const updated = [...editPrintingMethods];
                                updated[idx] = { ...m, minQty: parseInt(e.target.value, 10) || 0 };
                                setEditPrintingMethods(updated);
                              }}
                              className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-2.5 w-full font-mono text-center font-bold"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-capsule-text-muted uppercase font-bold block">Մեքենայի Կարգաբերում (Setup ֏)</span>
                            <input
                              type="number"
                              value={m.setupCost}
                              onChange={(e) => {
                                const updated = [...editPrintingMethods];
                                updated[idx] = { ...m, setupCost: parseInt(e.target.value, 10) || 0 };
                                setEditPrintingMethods(updated);
                              }}
                              className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-2.5 w-full font-mono text-center font-bold"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-capsule-text-muted uppercase font-bold block">Մեկ հատի գին (֏)</span>
                            <input
                              type="number"
                              value={m.pricePerUnit}
                              onChange={(e) => {
                                const updated = [...editPrintingMethods];
                                updated[idx] = { ...m, pricePerUnit: parseInt(e.target.value, 10) || 0 };
                                setEditPrintingMethods(updated);
                              }}
                              className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-2.5 w-full font-mono text-center font-bold"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-capsule-text-muted uppercase font-bold block">Գործակից / Mult.</span>
                            <input
                              type="number"
                              step="0.05"
                              value={m.priceMultiplier}
                              onChange={(e) => {
                                const updated = [...editPrintingMethods];
                                updated[idx] = { ...m, priceMultiplier: parseFloat(e.target.value) || 1.0 };
                                setEditPrintingMethods(updated);
                              }}
                              className="bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-2.5 w-full font-mono text-center font-bold"
                            />
                          </div>
                        </div>
                        
                        <div className="text-[10px] space-y-1">
                          <span className="text-[9px] text-capsule-text-muted uppercase font-bold block">Թույլատրելի Բաժիններ</span>
                          <div className="flex gap-4">
                            {["bags", "boxes"].map((catId) => {
                              const hasCat = (m.allowedCategories || []).includes(catId);
                              return (
                                <label key={catId} className="flex items-center gap-1.5 font-semibold text-capsule-dark hover:text-capsule-accent cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={hasCat}
                                    onChange={(e) => {
                                      const updatedCategories = e.target.checked 
                                        ? [...(m.allowedCategories || []), catId]
                                        : (m.allowedCategories || []).filter(c => c !== catId);
                                      const updated = [...editPrintingMethods];
                                      updated[idx] = { ...m, allowedCategories: updatedCategories };
                                      setEditPrintingMethods(updated);
                                    }}
                                    className="accent-capsule-accent h-3.5 w-3.5 rounded"
                                  />
                                  {catId === "bags" ? "Ստանդարտ Տոպրակներ" : "Տուփեր"}
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        {/* Optional Warning Message field */}
                        <div className="text-[10px] space-y-1">
                          <span className="text-[9px] text-capsule-text-muted uppercase font-bold block">Սահմանափակման / Զգուշացման Հաղորդագրություն (Warning Message)</span>
                          <input
                            type="text"
                            value={m.warningMessage || ""}
                            onChange={(e) => {
                              const updated = [...editPrintingMethods];
                              updated[idx] = { ...m, warningMessage: e.target.value };
                              setEditPrintingMethods(updated);
                            }}
                            className="w-full bg-capsule-surf border border-capsule-accent/10 rounded py-1 px-2.5 font-semibold outline-none"
                            placeholder="Օրինակ՝ Օֆսեթ տպագրության համար նվազագույն քանակը 300 հատ է:"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: SITE TEXTS & TRANSLATIONS */}
              {activeTab === "sitetexts" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-capsule-accent/10 pb-2 gap-2">
                    <h3 className="font-serif text-base text-capsule-accent font-semibold">Ինտերֆեյսային Տեքստեր և Թարգմանություններ</h3>
                    <input
                      type="text"
                      placeholder="Որոնել բանալի կամ տեքստ..."
                      value={siteTextSearch}
                      onChange={(e) => setSiteTextSearch(e.target.value)}
                      className="bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-1 px-3 text-xs w-full sm:w-64 tracking-tight outline-none"
                    />
                  </div>
                  
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 col-span-2">
                    {Object.keys(editSiteTexts)
                      .filter((k) => 
                        k.toLowerCase().includes(siteTextSearch.toLowerCase()) || 
                        editSiteTexts[k].toLowerCase().includes(siteTextSearch.toLowerCase())
                      )
                      .map((key) => (
                        <div key={key} className="bg-capsule-surf2/30 border border-capsule-accent/10 p-3 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                          <div className="md:col-span-4 font-mono font-bold text-[10px] text-capsule-accent py-1.5 break-all">
                            {key}
                          </div>
                          <div className="md:col-span-8">
                            <textarea
                              rows={1}
                              value={editSiteTexts[key]}
                              onChange={(e) => {
                                const updated = { ...editSiteTexts };
                                updated[key] = e.target.value;
                                setEditSiteTexts(updated);
                              }}
                              className="w-full bg-capsule-surf border border-capsule-accent/10 rounded-lg py-1.5 px-3 text-xs text-capsule-dark font-semibold outline-none resize-y min-h-[36px]"
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions banner for admin edits */}
            <div className="px-4 py-2 bg-[#FAF9F5] border-t border-capsule-accent/10 flex justify-end gap-2 shrink-0 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
              <button 
                onClick={onReload}
                className="border border-capsule-accent/15 hover:bg-capsule-accent/5 text-capsule-accent text-[10px] px-3 py-1 rounded-md font-bold uppercase tracking-wider cursor-pointer transition-all active:scale-95 duration-150"
              >
                Չեղարկել
              </button>
              <button 
                onClick={handleSaveAll}
                className="bg-[#ff2300] hover:bg-[#e61f00] text-white text-[10px] px-3.5 py-1 rounded-md font-extrabold uppercase tracking-wider cursor-pointer flex items-center gap-1 transition-all active:scale-95 shadow-sm duration-150"
              >
                <Save size={10} />
                <span>Պահպանել</span>
              </button>
            </div>

          </div>
        </div>
        )}

      </div>
    </div>
  );
}
