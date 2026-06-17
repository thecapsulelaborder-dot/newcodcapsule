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
  Upload
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
  AISettings
} from "../types";

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
  aiSettings?: AISettings;
  
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
  aiSettings,
  onSaveConfig,
  onClearSubmissions,
  onReload
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [pricingSubTab, setPricingSubTab] = useState<"standard" | "decorative" | "ribbons" | "stickers" | "giftcards" | "businesscards">("standard");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Edit states holding current modifications
  const [editCategories, setEditCategories] = useState<Category[]>(categories);
  const [editProducts, setEditProducts] = useState<Product[]>(products);
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
  
  // Auxiliary UI filter/search
  const [siteTextSearch, setSiteTextSearch] = useState("");

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

  // Deep sync helper: Whenever database configs change/reload from server, sync them immediately to input fields
  useEffect(() => {
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
    if (aiSettings) {
      setEditAiSettings(aiSettings);
    }
  }, [categories, products, dimensions, finishes, papers, tiers, discountCodes, siteTexts, contactSettings, pricingRules, decorativeBagsPricingRules, printingMethods, bagRibbonHandles, aiSettings]);

  // Non-blocking admin authentication diagnostic tracking and investigation
  useEffect(() => {
    console.group("Admin Debug - Token Validation Flow");
    console.log("[Authentication Integrity Check] Initializing token validation control.");
    if (!adminToken) {
      console.log("[Authentication Integrity Check] Present Status: Unauthenticated. Safely displaying standard Secure Login Gate. This is expected and non-blocking for normal platform operators.");
    } else {
      console.log("[Authentication Integrity Check] Present Status: Token Detected (starts with: " + adminToken.substring(0, 10) + "...). Bypassing login screen and loading dashboard components with maximum priority.");
      
      // Verification call running completely asynchronously in the background to confirm server validity
      fetch("/api/admin/me", {
        headers: { "Authorization": `Bearer ${adminToken}` }
      })
      .then(async (res) => {
        if (res.status === 401) {
          console.log("[Authentication Integrity Check] Stale session identified (401 Unauthorized).");
        } else {
          try {
            const body = await res.json().catch(() => null);
            if (body && body.success) {
              console.log("[Authentication Integrity Check] Background token validation succeeded:", body);
            }
          } catch (e) {
            // Safe fallback
          }
        }
      })
      .catch((error) => {
        console.log("[Authentication Integrity Check] Background token validation completed or bypassed gracefully.");
      });
    }
    console.groupEnd();
  }, [adminToken]);

  // Diagnostic logs to check and monitor state variables for product categories and pricing rules
  useEffect(() => {
    console.group("Admin Debug - State Variables Check");
    console.log("[Diagnostic Log] === AdminPanel Initialization Check ===");
    console.log("[Diagnostic Log] Props received:", {
      categoriesLength: categories?.length,
      productsLength: products?.length,
      pricingRulesValid: !!pricingRules,
      decPricingRulesValid: !!decorativeBagsPricingRules,
      hasContactSettings: !!contactSettings,
    });
    console.log("[Diagnostic Log] Current edit states in Admin Panel:", {
      editCategoriesLength: editCategories?.length,
      editProductsLength: editProducts?.length,
      editPricingRulesValid: !!editPricingRules,
      editDecPricingRulesValid: !!editDecPricingRules,
    });
    
    if (!categories || categories.length === 0) {
      console.warn("[Diagnostic Log] WARNING: Product categories are empty or undefined!");
    } else {
      console.log("[Diagnostic Log] Product Categories list:", categories.map(c => ({ id: c.id, name: c.name })));
    }

    if (!pricingRules) {
      console.warn("[Diagnostic Log] WARNING: Pricing rules are null or undefined!");
    } else {
      console.log("[Diagnostic Log] Pricing Rules keys:", Object.keys(pricingRules));
    }

    if (!products || products.length === 0) {
      console.warn("[Diagnostic Log] WARNING: Products list is empty or undefined!");
    }
    console.groupEnd();
  }, [categories, products, pricingRules, decorativeBagsPricingRules, editCategories, editProducts, editPricingRules, editDecPricingRules]);

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
      <div style="font-family: 'Noto Sans Armenian', 'Segoe UI', Helvetica, Arial, sans-serif; padding: 25px; color: #000; background: #fff;">
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
      <div style="font-family: 'Noto Sans Armenian', 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; color: #000; background: #fff; border: 1px solid #ddd; border-radius: 8px;">
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
      await onSaveConfig(payload);
      alert(`Դինամիկ բաժինը և ապրանքը հաջողությամբ ստեղծվել և պահպանվել են բազայում / Dynamic Category "${cat.name}" created and saved successfully!`);
      setActiveTab("categories");
    } catch (err: any) {
      alert("Error saving category: " + (err.message || err));
    }
  };

  return (
    <div className="fixed inset-0 bg-capsule-dark/60 backdrop-blur-md z-[2000] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-capsule-surf border border-capsule-accent/20 w-full max-w-5xl md:rounded-3xl flex flex-col shadow-2xl overflow-hidden min-h-[90vh] md:min-h-0 md:max-h-[92vh]">
        
        {/* Header bar */}
        <div className="px-6 py-4 bg-capsule-accent text-capsule-surf flex items-center justify-between border-b border-capsule-accent/20 shrink-0">
          <div className="flex items-center gap-2.5">
            <Settings size={20} className="text-capsule-surf animate-spin-slow" />
            <div>
              <h2 className="font-serif font-light text-xl tracking-wider uppercase">Ադմինիստրատորի Վահանակ</h2>
              <p className="text-[9px] uppercase tracking-widest opacity-75 font-semibold">Capsule Concept CMS System</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-capsule-surf/10 hover:bg-capsule-surf/20 text-capsule-surf hover:scale-105 transition-all text-xs border border-capsule-surf/20 rounded-full cursor-pointer"
          >
            <X size={15} />
          </button>
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
          <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
            
            {/* Sidebar navigation tabs */}
            <div className="w-full md:w-64 bg-[#FAF9F6] border-r border-capsule-accent/10 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible md:overflow-y-auto shrink-0 divide-x md:divide-x-0 divide-capsule-accent/10 scrollbar-thin">
              <div className="p-4 hidden md:block border-b border-capsule-accent/5 bg-[#1A3F25]/5">
                <span className="text-[10px] tracking-widest font-extrabold uppercase text-[#1A3F25] block">ENTERPRISE PLATFORM</span>
                <span className="text-[9px] text-[#7C9082] uppercase font-bold mt-0.5 block">Capsule Concept Hub</span>
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
                      { key: "dynamic_category_builder", lbl: "✨ Dynamic Category Builder" },
                      { key: "products", lbl: "📦 Legacy Other Products" },
                      { key: "categories", lbl: "🏷️ Kinds & MOQ" },
                      { key: "sizes", lbl: "📐 Sizes & Formats" },
                      { key: "papers", lbl: "📄 Paper Library" },
                      { key: "handles", lbl: "🎗️ Handle Accessories" }
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
                      { key: "media_library", lbl: "🖼️ Media Assets" }
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
                      { key: "backup_center", lbl: "💽 Enterprise Recovery" }
                    ]
                  }
                ].map((group) => (
                  <div key={group.title} className="flex flex-row md:flex-col shrink-0">
                    <span className="hidden md:block text-[9px] font-black uppercase text-[#C59B6D] tracking-widest px-3 mb-1.5 mt-2">
                      {group.title}
                    </span>
                    <div className="flex flex-row md:flex-col shrink-0 md:space-y-0.5">
                      {group.items.map((adTab) => {
                        const isAct = adTab.key === activeTab;
                        return (
                          <button
                            key={adTab.key}
                            onClick={() => setActiveTab(adTab.key)}
                            className={`py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-left transition-all shrink-0 cursor-pointer rounded-lg border-b-2 md:border-b-0 md:border-l-2 ${
                              isAct 
                                ? "bg-[#1A3F25] text-white border-[#C59B6D]" 
                                : "text-capsule-text-muted hover:bg-[#1A3F25]/5 hover:text-[#1A3F25] border-transparent"
                            }`}
                          >
                            {adTab.lbl}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={onLogout}
                className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-red-700 hover:bg-red-50 hover:text-red-900 transition-all text-left shrink-0 border-t border-capsule-accent/10 cursor-pointer flex items-center gap-1.5"
              >
                <LogOut size={12} />
                <span>ԴՈՒՐՍ ԳԱԼ / LOG OUT</span>
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
                        <div className="flex justify-between items-center">
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
                <div className="space-y-6">
                  {/* Part A: Main Homepage Hero Text Editor */}
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
                          placeholder="Ընտրեք ցանկալի արտադրանքի տեսակը՝ հաշվարկը և 3D ֆիզիկական մոդելավորումը սկսելու համար։"
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

                  {/* Part B: Category Header & Creator */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-capsule-accent/10 pb-3">
                    <div>
                      <h3 className="font-serif text-base text-capsule-accent font-semibold">Բաժինների կառավարում / Category Portal</h3>
                      <p className="text-[11px] text-capsule-text-muted">Ավելացրեք, դասավորեք, ընտրեք ձևանմուշներ, փոփոխեք պատկերակներ ու տեքստեր</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newId = `category_${Date.now()}`;
                        const newCat: Category = {
                          id: newId,
                          name: "Նոր բաժին / New division",
                          active: true,
                          minQty: 100,
                          qtyPresets: [100, 300, 500, 1000],
                          navLabel: "Նոր Բաժին",
                          heroTitle: "Նոր արտադրատեսակ",
                          heroBadge: "Custom Item",
                          heroSmall: "Նոր / Brand New",
                          ruleChips: "Բարձր Որակ | 3D visual",
                          heroDesc: "Անհատական տպագրությամբ պատվերների առցանց հաշվարկ",
                          template: "other_products",
                          icon: "🎨"
                        };
                        setEditCategories([...editCategories, newCat]);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-capsule-accent text-capsule-surf hover:bg-capsule-accent/90 text-xs font-bold transition-all shadow-sm cursor-pointer mr-2"
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
