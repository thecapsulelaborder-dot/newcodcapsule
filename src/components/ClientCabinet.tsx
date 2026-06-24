import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Lock, 
  Mail, 
  FileText, 
  ChevronRight, 
  ArrowLeft, 
  Plus, 
  Briefcase, 
  Percent, 
  TrendingUp, 
  Layers, 
  Check, 
  Clock, 
  Truck, 
  CreditCard, 
  QrCode, 
  Download, 
  RefreshCw, 
  Users, 
  X,
  Smartphone,
  Eye,
  Trash2,
  Share2,
  Send,
  MessageSquare,
  Settings,
  ExternalLink,
  ShoppingBag,
  ShoppingCart,
  Star,
  Bookmark
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { useTranslation, LocaleType } from "../locales/i18n";

// Inject Keyframes for the dynamic animation effects
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes spinCube {
      from { transform: rotateX(-20deg) rotateY(0deg); }
      to { transform: rotateX(-20deg) rotateY(360deg); }
    }
    .animate-spin-cube {
      animation: spinCube 12s linear infinite;
    }
  `;
  document.head.appendChild(style);
}

interface ClientCabinetProps {
  onClose: () => void;
  locale: "hy" | "ru" | "en" | "ar";
  onReorder: (submission: any) => void;
  partnerDiscountActive: number;
  setPartnerDiscountActive: (discount: number) => void;
  setUserEmailState: (email: string) => void;
  initialTab?: string;
  initialAuthTab?: "login" | "register";
}

export default function ClientCabinet({ 
  onClose, 
  locale: defaultLocale, 
  onReorder,
  partnerDiscountActive,
  setPartnerDiscountActive,
  setUserEmailState,
  initialTab,
  initialAuthTab
}: ClientCabinetProps) {
  
  const { locale: currentLocale, setLocale, t } = useTranslation();

  const getT = (key: string, fallback?: string): string => {
    return t(key, fallback || key);
  };

  // Short ID generator for orders
  const getShortId = (id: any) => {
    if (!id) return "N/A";
    const str = String(id);
    return str.length > 4 ? str.substring(4, 11) : str;
  };

  // Auth/View states
  const [activeTab, setActiveTab] = useState<"login" | "register" | "recovery" | "reset" | "dashboard">(() => {
    const saved = localStorage.getItem("cc_client_user");
    if (saved) return "dashboard";
    if (initialAuthTab) return initialAuthTab;
    return "login";
  });

  const [user, setUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("cc_client_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Inner cabinet sub-navigation tabs matching corporate requirements
  const [dashboardTab, setDashboardTab] = useState<"overview" | "orders" | "tracking" | "quotes" | "invoices" | "calculations" | "favorites" | "profile" | "settings" | "partner">(() => {
    if (initialTab && ["overview", "orders", "tracking", "quotes", "invoices", "calculations", "favorites", "profile", "settings", "partner"].includes(initialTab)) {
      return initialTab as any;
    }
    return "overview";
  });

  // Form Fields
  const [emailInput, setEmailInput] = useState(() => {
    return localStorage.getItem("cc_remembered_email") || "";
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [companyInput, setCompanyInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [roleSelect, setRoleSelect] = useState<"Client" | "Partner">("Client");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return !!localStorage.getItem("cc_remembered_email");
  });
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Recovery code OTP
  const [simulatedOtp, setSimulatedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Orders and Subclients lists
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);
  const [subClientName, setSubClientName] = useState("");
  const [subClientEmail, setSubClientEmail] = useState("");
  const [subClientPhone, setSubClientPhone] = useState("");

  // Saved calculations (МОИ РАСЧЁТЫ)
  const [savedCalculations, setSavedCalculations] = useState<any[]>([]);
  const [isLoadingCalcs, setIsLoadingCalcs] = useState(false);
  const [favoritesList, setFavoritesList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("cc_favorites_configs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  // Payment simulations
  const [activePaymentOrder, setActivePaymentOrder] = useState<any | null>(null);
  const [paymentGateway, setPaymentGateway] = useState<"idram" | "telcell">("idram");
  const [isPayingSim, setIsPayingSim] = useState(false);

  // Profile management inputs
  const [profileName, setProfileName] = useState("");
  const [profileCompany, setProfileCompany] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileLegalDetails, setProfileLegalDetails] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Order status widgets filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string | null>(null);

  // Interactive Live Chat with Manager variables
  const [chatMessageInput, setChatMessageInput] = useState("");
  const [orderChats, setOrderChats] = useState<Record<string, { sender: "user" | "manager"; text: string; ts: string }[]>>({});

  // Timeline statuses sequence
  const trackingTimelineStatuses = [
    "Новый",
    "Проверка макета",
    "Дизайн",
    "Печать",
    "Постобработка",
    "Сборка",
    "Упаковка",
    "Готов",
    "Доставлен"
  ];

  // Helper to translate statuses cleanly to local user selection
  const getStatusText = (status: string) => {
    const statusMap: Record<string, Record<string, string>> = {
      "Новый": { ru: "Новый", en: "New", hy: "Նոր", ar: "جديد" },
      "Проверка макета": { ru: "Проверка макета", en: "Layout Check", hy: "Մակետի Ստուգում", ar: "مراجعة التصميم" },
      "Дизайн": { ru: "Дизайн", en: "Design Proofing", hy: "Դիզայն", ar: "تعديل المخطط" },
      "Печать": { ru: "Печать", en: "Printing", hy: "Տպագրություն", ar: "مرحلة الطباعة" },
      "Постобработка": { ru: "Постобработка", en: "Post-processing", hy: "Հետտպագրական Մշակում", ar: "تثبيت الألوان" },
      "Сборка": { ru: "Сборка", en: "Assembly", hy: "Հավաքում", ar: "تجميع" },
      "Упаковка": { ru: "Упаковка", en: "Packaging", hy: "Փաթեթավորում", ar: "تعبئة وتغليف" },
      "Готов": { ru: "Готов", en: "Ready", hy: "Պատրաստ է", ar: "جاهز للتسليم" },
      "Доставлен": { ru: "Доставлен", en: "Delivered", hy: "Առաքված է", ar: "تم التوصيل" }
    };
    
    // Normalize string defaults
    const lookup = statusMap[status];
    if (lookup) {
      return lookup[currentLocale] || lookup["en"] || status;
    }
    return status;
  };

  // Fetching orders
  const fetchOrders = async (email: string, role: string) => {
    try {
      const res = await fetch(`/api/client/orders?email=${encodeURIComponent(email)}&role=${role}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error("Failed to load client orders", e);
    }
  };

  // Fetching saved calculations
  const fetchSavedCalculations = async (email: string) => {
    setIsLoadingCalcs(true);
    try {
      const res = await fetch(`/api/client/saved-calculations?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success) {
        setSavedCalculations(data.savedConfigs || []);
      }
    } catch (e) {
      console.error("Failed loading saved configs", e);
    } finally {
      setIsLoadingCalcs(false);
    }
  };

  // Synchronize dynamic user states to parent
  useEffect(() => {
    if (user) {
      setUserEmailState(user.email);
      setProfileName(user.name || "");
      setProfileCompany(user.company || "");
      setProfilePhone(user.phone || "");
      setProfileLegalDetails(user.legalDetails || "");
      if (user.role === "Partner") {
        setPartnerDiscountActive(Number(user.partnerDiscount) || 15.0);
      } else {
        setPartnerDiscountActive(0);
      }
      setActiveTab("dashboard");
      fetchOrders(user.email, user.role);
      fetchSavedCalculations(user.email);
    } else {
      setUserEmailState("");
      setPartnerDiscountActive(0);
    }
  }, [user]);

  // Load chat messages of selected order details
  useEffect(() => {
    if (selectedOrderDetails) {
      const savedChats = localStorage.getItem(`cc_chat_${selectedOrderDetails.id}`);
      if (savedChats) {
        setOrderChats(prev => ({ ...prev, [selectedOrderDetails.id]: JSON.parse(savedChats) }));
      } else {
        // Initial welcome message from Armenian manager
        const welcomeMessage = [
          {
            sender: "manager" as const,
            text: currentLocale === "hy" 
              ? `Բարև Ձեզ, ես Ձեր պատվերի անձնական մենեջերն եմ: Պատվերը #${getShortId(selectedOrderDetails.id)} հաջողությամբ գրանցվել է համակարգում։ Հարցերի դեպքում կարող եք գրել այստեղ։` 
              : currentLocale === "ru"
                ? `Здравствуйте! Я персональный менеджер вашего заказа #${getShortId(selectedOrderDetails.id)}. Все параметры приняты. Если у вас возникли вопросы или пожелания, напишите мне напрямую в этот чат!`
                : `Hello! I am your personal design and production coordinator for order #${getShortId(selectedOrderDetails.id)}. All specifications are confirmed. If you have any notes or modifications, write them directly into this channel!`,
            ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ];
        setOrderChats(prev => ({ ...prev, [selectedOrderDetails.id]: welcomeMessage }));
        localStorage.setItem(`cc_chat_${selectedOrderDetails.id}`, JSON.stringify(welcomeMessage));
      }
    }
  }, [selectedOrderDetails, currentLocale]);

  // Toggle favorite calculated configuration
  const toggleFavoriteConfiguration = (id: string) => {
    const nextList = favoritesList.includes(id) 
      ? favoritesList.filter(item => item !== id)
      : [...favoritesList, id];
    setFavoritesList(nextList);
    localStorage.setItem("cc_favorites_configs", JSON.stringify(nextList));
  };

  // Trigger login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      setErrorMsg(t("auth.blankFields", "Please write correct values in all fields."));
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/client/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, password: passwordInput })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("cc_client_user", JSON.stringify(data.user));
        
        if (rememberMe) {
          localStorage.setItem("cc_remembered_email", emailInput);
        } else {
          localStorage.removeItem("cc_remembered_email");
        }

        // Welcome toast
        setSuccessMsg(`${t("auth.welcome_msg")}, ${data.user.name}!`);
        setTimeout(() => {
          setSuccessMsg(null);
          onClose(); // Automatically close modal upon successful authorization
        }, 1500);
      } else {
        setErrorMsg(data.error || t("auth.invalidCreds", "Incorrect email or password."));
      }
    } catch (err) {
      setErrorMsg("Connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google Simulated Sign-in
  const handleGoogleMockLogin = async () => {
    const defaultEmail = "melkoniangurgen@gmail.com";
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/client/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: defaultEmail, name: "Gurgen Melkonyan" })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("cc_client_user", JSON.stringify(data.user));
        setSuccessMsg("Google authorization successful!");
        setTimeout(() => {
          setSuccessMsg(null);
          onClose(); // Close automatically
        }, 1200);
      } else {
        setErrorMsg(data.error || "Google authentication failed.");
      }
    } catch (err) {
      setErrorMsg("Google gateway error.");
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput || !emailInput || !passwordInput) {
      setErrorMsg(t("auth.blankFields", "Please write correct values in all fields."));
      return;
    }
    if (!agreeTerms) {
      setErrorMsg(currentLocale === "ru" ? "Пожалуйста, примите условия соглашения" : "Please accept terms of use");
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const fullName = `${nameInput.trim()} ${lastNameInput.trim()}`.trim();
      const res = await fetch("/api/auth/client/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          company: companyInput,
          email: emailInput,
          password: passwordInput,
          role: roleSelect,
          phone: phoneInput
        })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("cc_client_user", JSON.stringify(data.user));
        setSuccessMsg(`${t("auth.welcome_msg")}, ${data.user.name}!`);
        setTimeout(() => {
          setSuccessMsg(null);
          onClose(); // Close auto
        }, 1500);
      } else {
        setErrorMsg(data.error || "Registration failed.");
      }
    } catch (err) {
      setErrorMsg("Registration endpoint error.");
    } finally {
      setIsLoading(false);
    }
  };

  // Recover password request
  const handleRequestRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) {
      setErrorMsg(t("auth.blankFields", "Please write correct values in all fields."));
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/client/recover-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput })
      });
      const data = await res.json();
      if (data.success) {
        setSimulatedOtp(data.simulatedOtp);
        setSuccessMsg(`${t("auth.otpSent", "SIMULATED EMAIL SENT: Reset token dispatched.")} Code: ${data.simulatedOtp}`);
        setActiveTab("reset");
      } else {
        setErrorMsg(data.error || "No account with this email.");
      }
    } catch (err) {
      setErrorMsg("Recovery request failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password verification
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredOtp || !newPassword) {
      setErrorMsg(t("auth.blankFields", "Please write correct values in all fields."));
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/client/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, otpCode: enteredOtp, newPassword: newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Password changed successfully! Please Sign In.");
        setActiveTab("login");
        setPasswordInput("");
        setEnteredOtp("");
        setNewPassword("");
      } else {
        setErrorMsg(data.error || "Invalid Reset Code.");
      }
    } catch (err) {
      setErrorMsg("failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile handler
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsUpdatingProfile(true);

    try {
      const res = await fetch("/api/client/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: profileName,
          company: profileCompany,
          phone: profilePhone,
          legalDetails: profileLegalDetails,
          password: profilePassword || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("cc_client_user", JSON.stringify(data.user));
        setSuccessMsg(currentLocale === "hy" ? "Պրոֆիլի տվյալները հաջողությամբ թարմացվեցին:" : "Ваш профиль обновлен успешно.");
        setProfilePassword("");
        setTimeout(() => setSuccessMsg(null), 3500);
      } else {
        setErrorMsg(data.error || "Failed profile update.");
      }
    } catch (err) {
      setErrorMsg("Connection failure.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Trigger payment simulation
  const handleTriggerPayment = async (order: any) => {
    setActivePaymentOrder(order);
  };

  // Complete simulated payment
  const handleCompletePaymentSimulation = async () => {
    if (!activePaymentOrder) return;
    setIsPayingSim(true);
    
    try {
      await fetch("/api/payments/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: activePaymentOrder.id, paymentMethod: paymentGateway })
      });

      const callbackRes = await fetch("/api/payments/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: activePaymentOrder.id, status: "success" })
      });
      const data = await callbackRes.json();
      if (data.success) {
        setSuccessMsg(currentLocale === "ru" ? "Оплата успешно проведена!" : "Payment successfully approved!");
        fetchOrders(user.email, user.role);
        setTimeout(() => {
          setSuccessMsg(null);
          setActivePaymentOrder(null);
        }, 2000);
      }
    } catch (err) {
      console.error("Payment simulator error", err);
    } finally {
      setIsPayingSim(false);
    }
  };

  // Delete saved calculation
  const handleDeleteCalculation = async (calcId: string) => {
    if (!user) return;
    try {
      const res = await fetch("/api/client/delete-calculation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, id: calcId })
      });
      const data = await res.json();
      if (data.success) {
        setSavedCalculations(data.savedConfigs || []);
        setSuccessMsg(currentLocale === "hy" ? "Հաշվարկը հեռացվեց:" : "Расчёт успешно удалён.");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Share calculation link
  const handleShareCalculationList = (calcId: string) => {
    const shareUrl = `${window.location.origin}/?sharedCalc=${calcId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setSuccessMsg(currentLocale === "hy" ? "Հղումը պատճենվեց կլիպբորդում:" : "Ссылка для обмена скопирована в буфер обмена!");
      setTimeout(() => setSuccessMsg(null), 3000);
    }).catch(err => {
      alert(shareUrl);
    });
  };

  // Add client sub-account for Agency Partners
  const handleAddSubClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subClientName || !subClientEmail || !subClientPhone) {
      alert("All sub-client details are required.");
      return;
    }

    const updatedSubClients = [...(user.partnerClients || []), {
      name: subClientName,
      email: subClientEmail.trim().toLowerCase(),
      phone: subClientPhone
    }];

    try {
      const res = await fetch("/api/auth/client/update-subclients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, partnerClients: updatedSubClients })
      });
      if (res.ok) {
        const updatedUser = { ...user, partnerClients: updatedSubClients };
        setUser(updatedUser);
        localStorage.setItem("cc_client_user", JSON.stringify(updatedUser));
        setSubClientName("");
        setSubClientEmail("");
        setSubClientPhone("");
        fetchOrders(user.email, user.role);
      }
    } catch (err) {
      console.error("Failed to add sub-client", err);
    }
  };

  const handleRemoveSubClient = async (index: number) => {
    const list = [...(user.partnerClients || [])];
    list.splice(index, 1);
    try {
      const res = await fetch("/api/auth/client/update-subclients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, partnerClients: list })
      });
      if (res.ok) {
        const updatedUser = { ...user, partnerClients: list };
        setUser(updatedUser);
        localStorage.setItem("cc_client_user", JSON.stringify(updatedUser));
        fetchOrders(user.email, user.role);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Client Chat room sending message to manager
  const handleSendMessageToManager = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderDetails || !chatMessageInput.trim()) return;

    const currentChats = orderChats[selectedOrderDetails.id] || [];
    const userMsg = {
      sender: "user" as const,
      text: chatMessageInput.trim(),
      ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updatedChats = [...currentChats, userMsg];
    setOrderChats(prev => ({ ...prev, [selectedOrderDetails.id]: updatedChats }));
    localStorage.setItem(`cc_chat_${selectedOrderDetails.id}`, JSON.stringify(updatedChats));
    setChatMessageInput("");

    // Simulate instant automated manager acknowledgement response after 1.5s
    setTimeout(() => {
      const autoManagerMsg = {
        sender: "manager" as const,
        text: currentLocale === "hy" 
          ? `Մենք ստացանք Ձեր հաղորդագրությունը: Մենեջերը կկապվի Ձեզ հետ շատ արագ WhatsApp-ով կամ հեռախոսով՝ հաստատելու տեղեկությունը։` 
          : currentLocale === "ru"
            ? `Ваше сообщение получено службой поддержки! Менеджер свяжется с вами или вышлет обновленную смету на ваш email / телефон в течение пары минут.`
            : `Your request has been received. Our print manager will contact you with details and status update within working hours.`,
        ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      const finalChats = [...updatedChats, autoManagerMsg];
      setOrderChats(prev => ({ ...prev, [selectedOrderDetails.id]: finalChats }));
      localStorage.setItem(`cc_chat_${selectedOrderDetails.id}`, JSON.stringify(finalChats));
    }, 1500);
  };

  // Sign out routine
  const handleSignout = () => {
    setUser(null);
    localStorage.removeItem("cc_client_user");
    setActiveTab("login");
  };

  // Filter computation indicators
  const activeOrders = orders.filter(o => ["Новый", "В производстве", "New", "In Production", "Подтверждён", "Confirmed"].includes(o.status));
  const waitingPaymentOrders = orders.filter(o => ["не оплачено", "частично оплачено"].includes(o.paymentStatus));
  const inProductionOrders = orders.filter(o => ["В производстве", "In Production"].includes(o.status));
  const readyOrders = orders.filter(o => ["Готов", "Ready"].includes(o.status));

  const filteredOrdersList = orderStatusFilter 
    ? orders.filter(o => {
        if (orderStatusFilter === "active") return ["Новый", "В производстве", "New", "In Production", "Подтверждён", "Confirmed"].includes(o.status);
        if (orderStatusFilter === "pending_pay") return ["не оплачено", "частично оплачено"].includes(o.paymentStatus);
        if (orderStatusFilter === "in_production") return ["В производстве", "In Production", "Печать"].includes(o.status);
        if (orderStatusFilter === "ready") return ["Готов", "Ready", "Доставлен"].includes(o.status);
        return true;
      })
    : orders;

  const totalVolume = orders.length;
  const totalValueSum = orders.reduce((acc, o) => acc + (Number(o.totalPrice) || 0), 0);
  
  const ordersChartData = Array.isArray(orders) && orders.length > 0
    ? [...orders].reverse().map(o => ({
        name: getShortId(o.id),
        AMD: o.totalPrice,
        Qty: o.qty || 100
      }))
    : [
        { name: "Week 1", AMD: 0, Qty: 0 },
        { name: "Week 2", AMD: 0, Qty: 0 },
        { name: "Week 3", AMD: 0, Qty: 0 },
        { name: "Week 4", AMD: 0, Qty: 0 }
      ];

  // Favorite calculations filtered list
  const favoritedCalculationsList = savedCalculations.filter(calc => favoritesList.includes(calc.id));

  const isAuthView = activeTab === "login" || activeTab === "register" || activeTab === "recovery" || activeTab === "reset";

  if (isAuthView) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 backdrop-blur-md p-4 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-[#f0f2f5] p-6 sm:p-10 rounded-[2.5rem] border-2 border-white shadow-[12px_12px_24px_#d1d9e6,_-12px_-12px_24px_#FFFFFF] relative my-auto text-[#1A1A1A]"
        >
          {/* Close button on the top right of the auth container */}
          <button 
            type="button" 
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center bg-[#f0f2f5] border-none text-[#7C8797] hover:text-[#FF2300] shadow-[3px_3px_6px_#d1d9e6,_-3px_-3px_6px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#d1d9e6,_inset_-2px_-2px_4px_#FFFFFF] transition-all duration-200 cursor-pointer outline-none"
            title="Close"
          >
            <X size={14} strokeWidth={2.5} />
          </button>

          {errorMsg && (
            <div className="mb-4 p-3.5 bg-red-50 border-l-4 border-red-650 rounded-xl text-xs font-bold text-red-700 flex justify-between items-center shadow-xs">
              <span className="leading-snug">{errorMsg}</span>
              <button type="button" onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-700 font-extrabold text-sm pl-2">×</button>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 bg-[#1A3F25]/5 border-l-4 border-[#FF2300]/25 rounded-xl text-xs font-bold text-[#FF2300] flex justify-between items-center shadow-xs">
              <span className="break-all leading-snug">{successMsg}</span>
              <button type="button" onClick={() => setSuccessMsg(null)} className="text-[#FF2300]/60 hover:text-[#FF2300] font-extrabold text-sm pl-2">×</button>
            </div>
          )}

          {/* WIDGET TABS HEAD */}
          {(activeTab === "login" || activeTab === "register") && (
            <div className="flex pb-4 mb-6 justify-center gap-10 select-none">
              <button 
                type="button"
                onClick={() => { setErrorMsg(null); setActiveTab("login"); }}
                className={`text-xl font-bold tracking-widest uppercase pb-2 transition-all duration-300 relative cursor-pointer outline-none ${
                  activeTab === "login" 
                    ? "text-[#FF2300] scale-105 font-black" 
                    : "text-[#7C8797] hover:text-[#5A6578]"
                }`}
              >
                <span className="relative">
                  {currentLocale === "hy" ? "ՄՈՒՏՔ" : currentLocale === "ru" ? "ВХОД" : "SIGN IN"}
                  {activeTab === "login" && (
                    <span className="absolute -bottom-2 right-0 left-0 flex justify-center">
                      <svg className="w-6 h-2 text-[#FF2300]" viewBox="0 0 20 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 1.5C5 4.5 15 4.5 18 1.5" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" />
                      </svg>
                    </span>
                  )}
                </span>
              </button>
              <button 
                type="button"
                onClick={() => { setErrorMsg(null); setActiveTab("register"); }}
                className={`text-xl font-bold tracking-widest uppercase pb-2 transition-all duration-300 relative cursor-pointer outline-none ${
                  activeTab === "register" 
                    ? "text-[#FF2300] scale-105 font-black" 
                    : "text-[#7C8797] hover:text-[#5A6578]"
                }`}
              >
                <span className="relative">
                  {currentLocale === "hy" ? "ԳՐԱՆՑՈՒՄ" : currentLocale === "ru" ? "РЕГИСТРАЦИЯ" : "SIGN UP"}
                  {activeTab === "register" && (
                    <span className="absolute -bottom-2 right-0 left-0 flex justify-center">
                      <svg className="w-6 h-2 text-[#FF2300]" viewBox="0 0 20 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 1.5C5 4.5 15 4.5 18 1.5" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" />
                      </svg>
                    </span>
                  )}
                </span>
              </button>
            </div>
          )}

          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Concave Neumorphic Email Input */}
              <div className="w-full">
                <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-5 py-3.5 shadow-[inset_5px_5px_10px_#d1d9e6,_inset_-5px_-5px_10px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                  <input 
                    type="email" 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-transparent border-none text-xs font-bold text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0"
                    placeholder={currentLocale === "hy" ? "Էլ. հասցե կամ հեռախոս" : currentLocale === "ru" ? "Эл. адрес или телефон" : "Email Address"} 
                    required
                  />
                </div>
              </div>

              {/* Concave Neumorphic Password Input */}
              <div className="w-full">
                <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-5 py-3.5 shadow-[inset_5px_5px_10px_#d1d9e6,_inset_-5px_-5px_10px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                  <input 
                    type="password" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-transparent border-none text-xs font-bold text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0"
                    placeholder={currentLocale === "hy" ? "Գաղտնաբառ" : currentLocale === "ru" ? "Пароль" : "Password"} 
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs px-2 pt-1">
                <label className="flex items-center gap-1.5 font-bold cursor-pointer select-none text-[#7C8797]">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-[#1A3F25] focus:ring-[#1A3F25]"
                  />
                  <span>{t("auth.remember_me")}</span>
                </label>
                <button 
                  type="button"
                  onClick={() => setActiveTab("recovery")}
                  className="font-bold text-[#C59B6D] hover:text-[#FF2300] hover:underline cursor-pointer outline-none"
                >
                  {t("auth.forgot_password")}
                </button>
              </div>

              {/* Extruded burgundy Pill exactly matching layout from USER SCREENSHOT */}
              <div className="w-full pt-1">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="group w-full flex items-center justify-center gap-2.5 bg-[#f0f2f5] rounded-full py-3.5 text-[#FF2300] font-sans font-extrabold text-sm tracking-wide shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#FFFFFF] hover:shadow-[7px_7px_14px_#d1d9e6,_-7px_-7px_14px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#FFFFFF] active:scale-[0.98] transition-all duration-300 cursor-pointer select-none disabled:opacity-40"
                >
                  <Lock size={14} className="text-[#FF2300] stroke-[2.5]" />
                  <span>
                    {isLoading ? (currentLocale === "hy" ? "Խնդրում ենք սպասել..." : "Please wait...") : "Log in"}
                  </span>
                </button>
              </div>

              {/* Secondary interactive row matching the exact three bottom buttons from user screenshot */}
              <div className="flex items-center justify-center gap-5 mt-4 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#f0f2f5] border-none text-[#7C8797] hover:text-[#FF2300] shadow-[4px_4px_8px_#d1d9e6,_-4px_-4px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] active:scale-[0.96] transition-all duration-300 cursor-pointer"
                  title={currentLocale === "ru" ? "Закрыть Кабинет" : "Close Cabinet"}
                >
                  <ArrowLeft size={16} strokeWidth={2.2} />
                </button>

                <button
                  type="button"
                  onClick={handleGoogleMockLogin}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#f0f2f5] border-none text-[#7C8797] hover:text-[#FF2300] shadow-[4px_4px_8px_#d1d9e6,_-4px_-4px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] active:scale-[0.96] transition-all duration-300 cursor-pointer"
                  title="Google Sign In"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="google" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const sound = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav");
                    sound.volume = 0.2;
                    sound.play().catch(() => {});
                  }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#f0f2f5] border-none text-[#7C8797] hover:text-[#FF2300] shadow-[4px_4px_8px_#d1d9e6,_-4px_-4px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] active:scale-[0.96] transition-all duration-300 cursor-pointer"
                  title="Play click"
                >
                  <Settings size={16} strokeWidth={2.2} className="hover:rotate-45 transition-transform duration-300" />
                </button>
              </div>
            </form>
          )}

          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* First & Last Name Concave Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-4 py-3 shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                  <input 
                    type="text" 
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    required
                    className="w-full bg-transparent border-none text-xs font-bold text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0"
                    placeholder={currentLocale === "hy" ? "Անուն" : currentLocale === "ru" ? "Имя" : "First Name"} 
                  />
                </div>
                <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-4 py-3 shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                  <input 
                    type="text" 
                    value={lastNameInput}
                    onChange={(e) => setLastNameInput(e.target.value)}
                    required
                    className="w-full bg-transparent border-none text-xs font-bold text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0"
                    placeholder={currentLocale === "hy" ? "Ազգանուն" : currentLocale === "ru" ? "Фамилия" : "Last Name"} 
                  />
                </div>
              </div>

              {/* Company (optional) Concave Input */}
              <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-5 py-3 shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                <input 
                  type="text" 
                  value={companyInput}
                  onChange={(e) => setCompanyInput(e.target.value)}
                  className="w-full bg-transparent border-none text-xs font-bold text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0"
                  placeholder={currentLocale === "ru" ? "Название компании (опционально)" : "Company Name (optional)"} 
                />
              </div>

              {/* Phone Concave Input */}
              <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-5 py-3 shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                <input 
                  type="tel" 
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  required
                  className="w-full bg-transparent border-none text-xs font-bold text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0 font-mono"
                  placeholder={currentLocale === "ru" ? "Номер телефона" : "Phone Number"} 
                />
              </div>

              {/* Email Concave Input */}
              <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-5 py-3 shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                <input 
                  type="email" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  className="w-full bg-transparent border-none text-xs font-bold text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0"
                  placeholder={currentLocale === "ru" ? "Адрес электронной почты" : "Email Address"} 
                />
              </div>

              {/* Password Concave Input */}
              <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-5 py-3 shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  className="w-full bg-transparent border-none text-xs font-bold text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0"
                  placeholder={currentLocale === "ru" ? "Минимум 6 символов" : "Create Password (min 6 chars)"} 
                />
              </div>

              <div>
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 px-1">Select Account Level</span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRoleSelect("Client")}
                    className={`py-2.5 px-3 rounded-xl text-[9px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                      roleSelect === "Client"
                        ? "bg-[#f0f2f5] text-[#FF2300] shadow-[inset_2.5px_2.5px_5px_#d1d9e6,_inset_-2.5px_-2.5px_5px_#FFFFFF] font-black"
                        : "bg-[#f0f2f5] text-[#7C8797] shadow-[3px_3px_6px_#d1d9e6,_-3px_-3px_6px_#FFFFFF] hover:text-[#5A6578]"
                    }`}
                  >
                    <User size={11} />
                    <span>Standard Client</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleSelect("Partner")}
                    className={`py-2.5 px-3 rounded-xl text-[9px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                      roleSelect === "Partner"
                        ? "bg-[#f0f2f5] text-[#FF2300] shadow-[inset_2.5px_2.5px_5px_#d1d9e6,_inset_-2.5px_-2.5px_5px_#FFFFFF] font-black"
                        : "bg-[#f0f2f5] text-[#7C8797] shadow-[3px_3px_6px_#d1d9e6,_-3px_-3px_6px_#FFFFFF] hover:text-[#5A6578]"
                    }`}
                  >
                    <Briefcase size={11} />
                    <span>Agency Partner</span>
                  </button>
                </div>
              </div>

              <div className="pt-1 px-1">
                <label className="flex items-start gap-2 text-[10px] font-semibold text-[#7C8797] cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-[#1A3F25] focus:ring-[#1A3F25]"
                  />
                  <span>{t("auth.agree_terms")}</span>
                </label>
              </div>

              {/* Neumorphic register button */}
              <div className="w-full pt-1">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="group w-full flex items-center justify-center gap-2.5 bg-[#f0f2f5] rounded-full py-3.5 text-[#FF2300] font-sans font-extrabold text-sm tracking-wide shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#FFFFFF] hover:shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] active:scale-[0.98] transition-all duration-300 cursor-pointer select-none disabled:opacity-40"
                >
                  <Lock size={14} className="text-[#FF2300] stroke-[2.5]" />
                  <span>
                    {isLoading ? (currentLocale === "hy" ? "Ստեղծվում է..." : "Please wait...") : "Sign Up"}
                  </span>
                </button>
              </div>

              {/* Secondary interactive row matching the exact three bottom buttons from user screenshot */}
              <div className="flex items-center justify-center gap-5 mt-4 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#f0f2f5] border-none text-[#7C8797] hover:text-[#FF2300] shadow-[4px_4px_8px_#d1d9e6,_-4px_-4px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] active:scale-[0.96] transition-all duration-300 cursor-pointer"
                  title={currentLocale === "ru" ? "Закрыть Кабинет" : "Close Cabinet"}
                >
                  <ArrowLeft size={16} strokeWidth={2.2} />
                </button>

                <button
                  type="button"
                  onClick={handleGoogleMockLogin}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#f0f2f5] border-none text-[#7C8797] hover:text-[#FF2300] shadow-[4px_4px_8px_#d1d9e6,_-4px_-4px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] active:scale-[0.96] transition-all duration-300 cursor-pointer"
                  title="Google Sign In"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="google" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const sound = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav");
                    sound.volume = 0.2;
                    sound.play().catch(() => {});
                  }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#f0f2f5] border-none text-[#7C8797] hover:text-[#FF2300] shadow-[4px_4px_8px_#d1d9e6,_-4px_-4px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] active:scale-[0.96] transition-all duration-300 cursor-pointer"
                  title="Play click"
                >
                  <Settings size={16} strokeWidth={2.2} className="hover:rotate-45 transition-transform duration-300" />
                </button>
              </div>
            </form>
          )}

          {activeTab === "recovery" && (
            <div className="space-y-4">
              <button 
                type="button"
                onClick={() => setActiveTab("login")}
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#7C8797] hover:text-[#FF2300] hover:underline mb-2 cursor-pointer outline-none"
              >
                <ArrowLeft size={14} strokeWidth={2.5} />
                <span>Back to login</span>
              </button>

              <div className="text-center mb-4">
                <h2 className="text-xl font-black text-[#1A3F25] tracking-tight">{t("auth.forgot_password")}</h2>
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#7C8797] mt-1">Dispatches recovery token simulated instantly</p>
              </div>

              <form onSubmit={handleRequestRecovery} className="space-y-4">
                <div className="w-full">
                  <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-5 py-3.5 shadow-[inset_5px_5px_10px_#d1d9e6,_inset_-5px_-5px_10px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                    <input 
                      type="email" 
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      required
                      className="w-full bg-transparent border-none text-xs font-bold text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0"
                      placeholder={t("auth.field_email")} 
                    />
                  </div>
                </div>

                <div className="w-full pt-1">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="group w-full flex items-center justify-center gap-2.5 bg-[#f0f2f5] rounded-full py-3.5 text-[#FF2300] font-sans font-extrabold text-sm tracking-wide shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#FFFFFF] hover:shadow-[7px_7px_14px_#d1d9e6,_-7px_-7px_14px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#FFFFFF] active:scale-[0.98] transition-all duration-300 cursor-pointer select-none disabled:opacity-40"
                  >
                    <Lock size={14} className="text-[#FF2300] stroke-[2.5]" />
                    <span>
                      {isLoading ? "Dispatching..." : getT("sendOtp")}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "reset" && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-xl font-black text-[#1A3F25] tracking-tight">{getT("enterOtp")}</h2>
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#7C8797] mt-1">Simulated secure OTP reset token</p>
              </div>

              <div className="mb-4 p-3 bg-[#f0f2f5] border-none rounded-2xl text-center shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#FFFFFF]">
                <span className="text-[8px] uppercase font-bold text-[#FF2300] block mb-0.5 tracking-widest">Simulated Reset Code Received</span>
                <span className="text-xl font-black text-[#1A3F25] font-mono tracking-widest">{simulatedOtp}</span>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <div className="w-full">
                  <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-5 py-3.5 shadow-[inset_5px_5px_10px_#d1d9e6,_inset_-5px_-5px_10px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                    <input 
                      type="text" 
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      required
                      className="w-full bg-transparent border-none text-xs font-bold text-center text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0 font-mono tracking-widest"
                      placeholder="CCS-XXXX" 
                    />
                  </div>
                </div>

                <div className="w-full">
                  <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-5 py-3.5 shadow-[inset_5px_5px_10px_#d1d9e6,_inset_-5px_-5px_10px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full bg-transparent border-none text-xs font-bold text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0"
                      placeholder="Create New Password" 
                    />
                  </div>
                </div>

                <div className="w-full pt-1">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="group w-full flex items-center justify-center gap-2.5 bg-[#f0f2f5] rounded-full py-3.5 text-[#FF2300] font-sans font-extrabold text-sm tracking-wide shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#FFFFFF] hover:shadow-[7px_7px_14px_#d1d9e6,_-7px_-7px_14px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#FFFFFF] active:scale-[0.98] transition-all duration-300 cursor-pointer select-none disabled:opacity-40"
                  >
                    <Lock size={14} className="text-[#FF2300] stroke-[2.5]" />
                    <span>
                      {isLoading ? "Saving..." : getT("resetPass")}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-5">
      <motion.div 
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-6xl h-[90vh] bg-[#f0f2f5] rounded-[2.5rem] shadow-[12px_12px_36px_#C4BDB1,_-12px_-12px_36px_#FFFFFF] flex flex-col overflow-hidden text-[#1A1A1A] border-2 border-white"
      >
        {/* Top Premium Brand Header bar - Replaced with polished Neumorphic bar */}
        <div className="bg-[#f0f2f5] px-6 py-4.5 flex items-center justify-between border-b border-white/50 shadow-[0_4px_10px_-4px_rgba(211,205,191,0.5)] shrink-0 z-10 select-none">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-[#f0f2f5] rounded-2xl shadow-[4px_4px_8px_#d1d9e6,_-4px_-4px_8px_#FFFFFF] border border-white/40 leading-none">
              <User size={18} className="text-[#1A3F25]" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-[#1A3F25] uppercase flex items-center gap-2">
                <span>{user ? user.name : t("auth.profile_btn")}</span>
                {user && (
                  <span className="text-[9px] font-black bg-[#f0f2f5] text-[#FF2300] shadow-[inset_1.5px_1.5px_3px_#d1d9e6,_inset_-1.5px_-1.5px_3px_#FFFFFF] border border-white/20 px-2.5 py-0.5 rounded-full font-mono">
                    {user.role}
                  </span>
                )}
              </h1>
              <p className="text-[10px] text-[#7C8797] font-bold mt-0.5">
                {user ? `${user.email} ${user.company ? `• ${user.company}` : ""}` : "CAPSULE PACK Premium Customer Workspace"}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2.5 px-4 bg-[#f0f2f5] text-[#7C8797] hover:text-[#FF2300] shadow-[3px_3px_6px_#d1d9e6,_-3px_-3px_6px_#FFFFFF] hover:shadow-[4px_4px_8px_#d1d9e6,_-4px_-4px_8px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#d1d9e6,_inset_-2px_-2px_4px_#FFFFFF] text-[11px] font-extrabold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer outline-none border-none"
          >
            <X size={13} className="text-[#FF2300] stroke-[2.5]" />
            <span>{currentLocale === "ru" ? "Закрыть" : "Close"}</span>
          </button>
        </div>

        {/* Outer content scrollable window */}
        <div className="flex-1 flex overflow-hidden bg-[#f0f2f5]">
          
          {/* LOGGED IN SIDEBAR NAVIGATION */}
          {activeTab === "dashboard" && user && (
            <div className="hidden md:flex w-64 bg-[#f0f2f5] border-r-2 border-white/40 flex-col justify-between p-5 pr-4 whitespace-nowrap shrink-0 select-none z-10 shadow-[4px_0_12px_-4px_rgba(211,205,191,0.4)]">
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-[#7C8797]/70 uppercase tracking-widest px-4 block mb-4">Workspace</span>
                
                <button
                  type="button"
                  onClick={() => { setDashboardTab("overview"); setOrderStatusFilter(null); }}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center gap-3 border ${
                    dashboardTab === "overview" 
                      ? "bg-[#f0f2f5] text-[#FF2300] shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] border-white/10 font-black" 
                      : "bg-[#f0f2f5] text-[#7C8797] hover:text-[#1A3F25] hover:shadow-[3px_3px_6px_#d1d9e6,_-3px_-3px_6px_#FFFFFF] border-transparent"
                  }`}
                >
                  <Layers size={14} className={dashboardTab === "overview" ? "text-[#FF2300]" : "text-[#7C8797]"} />
                  <span>{currentLocale === "hy" ? "Գլխավոր" : currentLocale === "ru" ? "Главная" : "Overview"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setDashboardTab("orders"); setOrderStatusFilter(null); }}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center gap-3 border ${
                    dashboardTab === "orders" 
                      ? "bg-[#f0f2f5] text-[#FF2300] shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] border-white/10 font-black" 
                      : "bg-[#f0f2f5] text-[#7C8797] hover:text-[#1A3F25] hover:shadow-[3px_3px_6px_#d1d9e6,_-3px_-3px_6px_#FFFFFF] border-transparent"
                  }`}
                >
                  <FileText size={14} className={dashboardTab === "orders" ? "text-[#FF2300]" : "text-[#7C8797]"} />
                  <span>{t("auth.sec_orders")}</span>
                  {activeOrders.length > 0 && (
                    <span className="ml-auto bg-[#f0f2f5] text-[#FF2300] text-[9px] px-2 py-0.5 font-bold rounded-full shadow-[inset_1.5px_1.5px_3px_#d1d9e6,_inset_-1.5px_-1.5px_3px_#FFFFFF] border border-white/20">{activeOrders.length}</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setDashboardTab("tracking"); setOrderStatusFilter(null); }}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center gap-3 border ${
                    dashboardTab === "tracking" 
                      ? "bg-[#f0f2f5] text-[#FF2300] shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] border-white/10 font-black" 
                      : "bg-[#f0f2f5] text-[#7C8797] hover:text-[#1A3F25] hover:shadow-[3px_3px_6px_#d1d9e6,_-3px_-3px_6px_#FFFFFF] border-transparent"
                  }`}
                >
                  <Truck size={14} className={dashboardTab === "tracking" ? "text-[#FF2300]" : "text-[#7C8797]"} />
                  <span>{t("auth.sec_track")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setDashboardTab("quotes"); setOrderStatusFilter(null); }}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center gap-3 border ${
                    dashboardTab === "quotes" 
                      ? "bg-[#f0f2f5] text-[#FF2300] shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] border-white/10 font-black" 
                      : "bg-[#f0f2f5] text-[#7C8797] hover:text-[#1A3F25] hover:shadow-[3px_3px_6px_#d1d9e6,_-3px_-3px_6px_#FFFFFF] border-transparent"
                  }`}
                >
                  <Briefcase size={14} className={dashboardTab === "quotes" ? "text-[#FF2300]" : "text-[#7C8797]"} />
                  <span>{t("auth.sec_quotes")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setDashboardTab("invoices"); setOrderStatusFilter(null); }}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center gap-3 border ${
                    dashboardTab === "invoices" 
                      ? "bg-[#f0f2f5] text-[#FF2300] shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] border-white/10 font-black" 
                      : "bg-[#f0f2f5] text-[#7C8797] hover:text-[#1A3F25] hover:shadow-[3px_3px_6px_#d1d9e6,_-3px_-3px_6px_#FFFFFF] border-transparent"
                  }`}
                >
                  <Download size={14} className={dashboardTab === "invoices" ? "text-[#FF2300]" : "text-[#7C8797]"} />
                  <span>{t("auth.sec_invoices")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setDashboardTab("calculations"); fetchSavedCalculations(user.email); }}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center gap-3 border ${
                    dashboardTab === "calculations" 
                      ? "bg-[#f0f2f5] text-[#FF2300] shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] border-white/10 font-black" 
                      : "bg-[#f0f2f5] text-[#7C8797] hover:text-[#1A3F25] hover:shadow-[3px_3px_6px_#d1d9e6,_-3px_-3px_6px_#FFFFFF] border-transparent"
                  }`}
                >
                  <QrCode size={14} className={dashboardTab === "calculations" ? "text-[#FF2300]" : "text-[#7C8797]"} />
                  <span>{t("auth.sec_saved_calcs")}</span>
                  {savedCalculations.length > 0 && (
                    <span className="ml-auto bg-[#f0f2f5] text-[#7C8797] text-[9px] px-2 py-0.5 font-bold rounded-full shadow-[inset_1.5px_1.5px_3px_#d1d9e6,_inset_-1.5px_-1.5px_3px_#FFFFFF] border border-white/20">{savedCalculations.length}</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setDashboardTab("favorites"); }}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center gap-3 border ${
                    dashboardTab === "favorites" 
                      ? "bg-[#f0f2f5] text-[#FF2300] shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] border-white/10 font-black" 
                      : "bg-[#f0f2f5] text-[#7C8797] hover:text-[#1A3F25] hover:shadow-[3px_3px_6px_#d1d9e6,_-3px_-3px_6px_#FFFFFF] border-transparent"
                  }`}
                >
                  <Star size={14} className={dashboardTab === "favorites" ? "text-[#FF2300] fill-capsule-accent" : "text-[#7C8797]"} />
                  <span>{t("auth.sec_favorites")}</span>
                  {favoritesList.length > 0 && (
                    <span className="ml-auto bg-[#f0f2f5] text-[#C59B6D] text-[9px] px-2 py-0.5 font-bold rounded-full shadow-[inset_1.5px_1.5px_3px_#d1d9e6,_inset_-1.5px_-1.5px_3px_#FFFFFF] border border-white/20">{favoritesList.length}</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setDashboardTab("profile")}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center gap-3 border ${
                    dashboardTab === "profile" 
                      ? "bg-[#f0f2f5] text-[#FF2300] shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] border-white/10 font-black" 
                      : "bg-[#f0f2f5] text-[#7C8797] hover:text-[#1A3F25] hover:shadow-[3px_3px_6px_#d1d9e6,_-3px_-3px_6px_#FFFFFF] border-transparent"
                  }`}
                >
                  <Users size={14} className={dashboardTab === "profile" ? "text-[#FF2300]" : "text-[#7C8797]"} />
                  <span>{t("auth.sec_profile")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDashboardTab("settings")}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center gap-3 border ${
                    dashboardTab === "settings" 
                      ? "bg-[#f0f2f5] text-[#FF2300] shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] border-white/10 font-black" 
                      : "bg-[#f0f2f5] text-[#7C8797] hover:text-[#1A3F25] hover:shadow-[3px_3px_6px_#d1d9e6,_-3px_-3px_6px_#FFFFFF] border-transparent"
                  }`}
                >
                  <Settings size={14} className={dashboardTab === "settings" ? "text-[#1A3F25]" : "text-[#7C8797]"} />
                  <span>{t("auth.sec_settings")}</span>
                </button>

                {user.role === "Partner" && (
                  <button
                    type="button"
                    onClick={() => setDashboardTab("partner")}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center gap-3 border ${
                      dashboardTab === "partner" 
                        ? "bg-[#f0f2f5] text-[#FF2300] shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] border-white/10 font-black" 
                        : "bg-[#f0f2f5] text-[#7C8797] hover:text-[#1A3F25] hover:shadow-[3px_3px_6px_#d1d9e6,_-3px_-3px_6px_#FFFFFF] border-transparent"
                    }`}
                  >
                    <Briefcase size={14} className={dashboardTab === "partner" ? "text-[#FF2300]" : "text-[#7C8797]"} />
                    <span>{currentLocale === "hy" ? "Պարտնյոր Զոնա" : "Партнерам (15%)"}</span>
                  </button>
                )}
              </div>

              <div className="pt-4 border-t-2 border-white/40">
                <button
                  type="button"
                  onClick={handleSignout}
                  className="w-full text-left px-4.5 py-3 rounded-2xl text-xs font-black text-[#7C8797] hover:text-[#D11A2A] hover:shadow-[3px_3px_6px_#d1d9e6,_-3px_-3px_6px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#d1d9e6,_inset_-2px_-2px_4px_#FFFFFF] flex items-center gap-3 transition-all duration-200 cursor-pointer outline-none border-none"
                >
                  <Lock size={13} className="stroke-[2.5]" />
                  <span>{getT("logout")}</span>
                </button>
              </div>
            </div>
          )}

          {/* MAIN CONTAINER WINDOW RENDER */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f0f2f5]">
            
            {errorMsg && (
              <div className="mb-4 p-3.5 bg-red-50 border-l-4 border-red-650 rounded-xl text-xs font-bold text-red-700 flex justify-between items-center shadow-xs">
                <span>{errorMsg}</span>
                <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-700 font-black text-sm pl-2">×</button>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3.5 bg-green-50 border-l-4 border-[#1A3F25] rounded-xl text-xs font-bold text-[#1A3F25] flex justify-between items-center shadow-xs">
                <span className="break-all">{successMsg}</span>
                <button onClick={() => setSuccessMsg(null)} className="text-[#1A3F25]/60 hover:text-[#1A3F25] font-black text-sm pl-2">×</button>
              </div>
            )}

            {/* MOBILE COMPACT HORIZONTAL SCROLL NAVIGATION */}
            {activeTab === "dashboard" && user && (
              <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-3 mb-4 select-none scrollbar-none">
                {(["overview", "orders", "tracking", "quotes", "invoices", "calculations", "favorites", "profile", "settings"] as const).map((tabKey) => (
                  <button 
                    key={tabKey}
                    onClick={() => { setDashboardTab(tabKey); setOrderStatusFilter(null); }}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${dashboardTab === tabKey ? "bg-[#1A3F25] text-white" : "bg-white text-gray-600 border border-gray-200"}`}
                  >
                    {tabKey}
                  </button>
                ))}
              </div>
            )}

            {/* ── CENTRAL PREMIUM AUTHENTICATION TABS LAYOUT ── */}
            {((activeTab as string) === "login" || (activeTab as string) === "register") && (
              <div className="max-w-md mx-auto my-6 bg-[#f0f2f5] p-8 sm:p-10 rounded-[2.5rem] border-2 border-white shadow-[12px_12px_24px_#d1d9e6,_-12px_-12px_24px_#FFFFFF] transition-all duration-300">
                
                {/* WIDGET TABS HEAD */}
                <div className="flex pb-4 mb-8 justify-center gap-10 select-none">
                  <button 
                    type="button"
                    onClick={() => { setErrorMsg(null); setActiveTab("login"); }}
                    className={`text-xl font-bold tracking-widest uppercase pb-2 transition-all duration-300 relative cursor-pointer outline-none ${
                      (activeTab as any) === "login" 
                        ? "text-[#FF2300] scale-105 font-black" 
                        : "text-[#7C8797] hover:text-[#5A6578]"
                    }`}
                  >
                    <span className="relative">
                      {currentLocale === "hy" ? "ՄՈՒՏՔ" : currentLocale === "ru" ? "ВХОД" : "SIGN IN"}
                      {(activeTab as any) === "login" && (
                        <span className="absolute -bottom-2 right-0 left-0 flex justify-center">
                          <svg className="w-6 h-2 text-[#FF2300]" viewBox="0 0 20 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 1.5C5 4.5 15 4.5 18 1.5" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" />
                          </svg>
                        </span>
                      )}
                    </span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setErrorMsg(null); setActiveTab("register"); }}
                    className={`text-xl font-bold tracking-widest uppercase pb-2 transition-all duration-300 relative cursor-pointer outline-none ${
                      (activeTab as any) === "register" 
                        ? "text-[#FF2300] scale-105 font-black" 
                        : "text-[#7C8797] hover:text-[#5A6578]"
                    }`}
                  >
                    <span className="relative">
                      {currentLocale === "hy" ? "ԳՐԱՆՑՈՒՄ" : currentLocale === "ru" ? "РЕГИСТРАЦИЯ" : "SIGN UP"}
                      {(activeTab as any) === "register" && (
                        <span className="absolute -bottom-2 right-0 left-0 flex justify-center">
                          <svg className="w-6 h-2 text-[#FF2300]" viewBox="0 0 20 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 1.5C5 4.5 15 4.5 18 1.5" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" />
                          </svg>
                        </span>
                      )}
                    </span>
                  </button>
                </div>

                {/* SIGN IN VIEW CONTENT */}
                {(activeTab as any) === "login" && (
                  <form onSubmit={handleLogin} className="space-y-5">
                    {/* Concave Neumorphic Email Input */}
                    <div className="w-full">
                      <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-6 py-4 shadow-[inset_5px_5px_10px_#d1d9e6,_inset_-5px_-5px_10px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                        <input 
                          type="email" 
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="w-full bg-transparent border-none text-xs font-bold text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0"
                          placeholder={currentLocale === "hy" ? "Էլ. հասցե կամ հեռախոս" : currentLocale === "ru" ? "Эл. адрес или телефон" : "Email Address"} 
                          required
                        />
                      </div>
                    </div>

                    {/* Concave Neumorphic Password Input */}
                    <div className="w-full">
                      <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-6 py-4 shadow-[inset_5px_5px_10px_#d1d9e6,_inset_-5px_-5px_10px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                        <input 
                          type="password" 
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          className="w-full bg-transparent border-none text-xs font-bold text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0"
                          placeholder={currentLocale === "hy" ? "Գաղտնաբառ" : currentLocale === "ru" ? "Пароль" : "Password"} 
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs px-2 pt-1">
                      <label className="flex items-center gap-1.5 font-bold cursor-pointer select-none text-[#7C8797]">
                        <input 
                          type="checkbox" 
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-gray-300 text-[#1A3F25] focus:ring-[#1A3F25]"
                        />
                        <span>{t("auth.remember_me")}</span>
                      </label>
                      <button 
                        type="button"
                        onClick={() => setActiveTab("recovery")}
                        className="font-bold text-[#C59B6D] hover:text-[#FF2300] hover:underline cursor-pointer outline-none"
                      >
                        {t("auth.forgot_password")}
                      </button>
                    </div>

                    {/* Extruded burgundy Pill exactly matching layout from USER SCREENSHOT */}
                    <div className="w-full pt-2">
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="group w-full flex items-center justify-center gap-2.5 bg-[#f0f2f5] rounded-full py-4 text-[#FF2300] font-sans font-extrabold text-sm tracking-wide shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#FFFFFF] hover:shadow-[7px_7px_14px_#d1d9e6,_-7px_-7px_14px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#FFFFFF] active:scale-[0.98] transition-all duration-300 cursor-pointer select-none disabled:opacity-40"
                      >
                        <Lock size={14} className="text-[#FF2300] stroke-[2.5]" />
                        <span>
                          {isLoading ? (currentLocale === "hy" ? "Խնդրում ենք սպասել..." : "Please wait...") : "Log in"}
                        </span>
                      </button>
                    </div>

                    {/* Secondary interactive row matching the exact three bottom buttons from user screenshot */}
                    <div className="flex items-center justify-center gap-6 mt-6 pt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#f0f2f5] border-none text-[#7C8797] hover:text-[#FF2300] shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#FFFFFF] hover:shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] active:scale-[0.96] transition-all duration-300 cursor-pointer"
                        title={currentLocale === "ru" ? "Закрыть Кабинет" : "Close Cabinet"}
                      >
                        <ArrowLeft size={16} strokeWidth={2.2} />
                      </button>

                      <button
                        type="button"
                        onClick={handleGoogleMockLogin}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#f0f2f5] border-none text-[#7C8797] hover:text-[#FF2300] shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#FFFFFF] hover:shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] active:scale-[0.96] transition-all duration-300 cursor-pointer"
                        title="Google Sign In"
                      >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="google" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const sound = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav");
                          sound.volume = 0.2;
                          sound.play().catch(() => {});
                        }}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#f0f2f5] border-none text-[#7C8797] hover:text-[#FF2300] shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#FFFFFF] hover:shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] active:scale-[0.96] transition-all duration-300 cursor-pointer"
                        title="Play click"
                      >
                        <Settings size={16} strokeWidth={2.2} className="hover:rotate-45 transition-transform duration-300" />
                      </button>
                    </div>
                  </form>
                )}

                {/* SIGN UP VIEW CONTENT */}
                {(activeTab as any) === "register" && (
                  <form onSubmit={handleRegister} className="space-y-4">
                    {/* First & Last Name Concave Inputs */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-5 py-3.5 shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                        <input 
                          type="text" 
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          required
                          className="w-full bg-transparent border-none text-xs font-bold text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0"
                          placeholder={currentLocale === "hy" ? "Անուն" : currentLocale === "ru" ? "Имя" : "First Name"} 
                        />
                      </div>
                      <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-5 py-3.5 shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                        <input 
                          type="text" 
                          value={lastNameInput}
                          onChange={(e) => setLastNameInput(e.target.value)}
                          required
                          className="w-full bg-transparent border-none text-xs font-bold text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0"
                          placeholder={currentLocale === "hy" ? "Ազգանուն" : currentLocale === "ru" ? "Фамилия" : "Last Name"} 
                        />
                      </div>
                    </div>

                    {/* Company (optional) Concave Input */}
                    <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-6 py-3.5 shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                      <input 
                        type="text" 
                        value={companyInput}
                        onChange={(e) => setCompanyInput(e.target.value)}
                        className="w-full bg-transparent border-none text-xs font-bold text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0"
                        placeholder={currentLocale === "ru" ? "Название компании (опционально)" : "Company Name (optional)"} 
                      />
                    </div>

                    {/* Phone Concave Input */}
                    <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-6 py-3.5 shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                      <input 
                        type="tel" 
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        required
                        className="w-full bg-transparent border-none text-xs font-bold text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0 font-mono"
                        placeholder={currentLocale === "ru" ? "Номер телефона" : "Phone Number"} 
                      />
                    </div>

                    {/* Email Concave Input */}
                    <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-6 py-3.5 shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                      <input 
                        type="email" 
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        required
                        className="w-full bg-transparent border-none text-xs font-bold text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0"
                        placeholder={currentLocale === "ru" ? "Адрес электронной почты" : "Email Address"} 
                      />
                    </div>

                    {/* Password Concave Input */}
                    <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-6 py-3.5 shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                      <input 
                        type="password" 
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        required
                        className="w-full bg-transparent border-none text-xs font-bold text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0"
                        placeholder={currentLocale === "ru" ? "Минимум 6 символов" : "Create Password (min 6 chars)"} 
                      />
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Select Account Level</span>
                      <div className="grid grid-cols-2 gap-3.5">
                        <button
                          type="button"
                          onClick={() => setRoleSelect("Client")}
                          className={`py-3 px-4 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                            roleSelect === "Client"
                              ? "bg-[#f0f2f5] text-[#FF2300] shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] font-black"
                              : "bg-[#f0f2f5] text-[#7C8797] shadow-[4px_4px_8px_#d1d9e6,_-4px_-4px_8px_#FFFFFF] hover:text-[#5A6578]"
                          }`}
                        >
                          <User size={12} />
                          <span>Standard Client</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRoleSelect("Partner")}
                          className={`py-3 px-4 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                            roleSelect === "Partner"
                              ? "bg-[#f0f2f5] text-[#FF2300] shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] font-black"
                              : "bg-[#f0f2f5] text-[#7C8797] shadow-[4px_4px_8px_#d1d9e6,_-4px_-4px_8px_#FFFFFF] hover:text-[#5A6578]"
                          }`}
                        >
                          <Briefcase size={12} />
                          <span>Agency Partner</span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-1.5 px-2">
                      <label className="flex items-start gap-2 text-[11px] font-semibold text-[#7C8797] cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="mt-0.5 rounded text-[#1A3F25] focus:ring-[#1A3F25]"
                        />
                        <span>{t("auth.agree_terms")}</span>
                      </label>
                    </div>

                    {/* Neumorphic register button */}
                    <div className="w-full pt-2">
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="group w-full flex items-center justify-center gap-2.5 bg-[#f0f2f5] rounded-full py-4 text-[#FF2300] font-sans font-extrabold text-sm tracking-wide shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#FFFFFF] hover:shadow-[7px_7px_14px_#d1d9e6,_-7px_-7px_14px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#FFFFFF] active:scale-[0.98] transition-all duration-300 cursor-pointer select-none disabled:opacity-40"
                      >
                        <Lock size={14} className="text-[#FF2300] stroke-[2.5]" />
                        <span>
                          {isLoading ? (currentLocale === "hy" ? "Ստեղծվում է..." : "Please wait...") : "Sign Up"}
                        </span>
                      </button>
                    </div>

                    {/* Secondary interactive row matching the exact three bottom buttons from user screenshot */}
                    <div className="flex items-center justify-center gap-6 mt-6 pt-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#f0f2f5] border-none text-[#7C8797] hover:text-[#FF2300] shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#FFFFFF] hover:shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] active:scale-[0.96] transition-all duration-300 cursor-pointer"
                        title={currentLocale === "ru" ? "Закрыть Кабинет" : "Close Cabinet"}
                      >
                        <ArrowLeft size={16} strokeWidth={2.2} />
                      </button>

                      <button
                        type="button"
                        onClick={handleGoogleMockLogin}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#f0f2f5] border-none text-[#7C8797] hover:text-[#FF2300] shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#FFFFFF] hover:shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] active:scale-[0.96] transition-all duration-300 cursor-pointer"
                        title="Google Sign In"
                      >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="google" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const sound = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav");
                          sound.volume = 0.2;
                          sound.play().catch(() => {});
                        }}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#f0f2f5] border-none text-[#7C8797] hover:text-[#FF2300] shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#FFFFFF] hover:shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] active:scale-[0.96] transition-all duration-300 cursor-pointer"
                        title="Play click"
                      >
                        <Settings size={16} strokeWidth={2.2} className="hover:rotate-45 transition-transform duration-300" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ── PASSWORD RECOVERY VIEW ────────────────── */}
            {(activeTab as string) === "recovery" && (
              <div className="max-w-md mx-auto my-6 bg-[#f0f2f5] p-8 sm:p-10 rounded-[2.5rem] border-2 border-white shadow-[12px_12px_24px_#d1d9e6,_-12px_-12px_24px_#FFFFFF] transition-all duration-300">
                <button 
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-[#7C8797] hover:text-[#FF2300] hover:underline mb-6 cursor-pointer outline-none"
                >
                  <ArrowLeft size={14} strokeWidth={2.5} />
                  <span>Back to login</span>
                </button>

                <div className="text-center mb-6">
                  <h2 className="text-xl font-black text-[#1A3F25] tracking-tight">{t("auth.forgot_password")}</h2>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#7C8797] mt-1">Dispatches recovery token simulated instantly</p>
                </div>

                <form onSubmit={handleRequestRecovery} className="space-y-5">
                  <div className="w-full">
                    <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-6 py-4 shadow-[inset_5px_5px_10px_#d1d9e6,_inset_-5px_-5px_10px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                      <input 
                        type="email" 
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        required
                        className="w-full bg-transparent border-none text-xs font-bold text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0"
                        placeholder={t("auth.field_email")} 
                      />
                    </div>
                  </div>

                  <div className="w-full pt-2">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="group w-full flex items-center justify-center gap-2.5 bg-[#f0f2f5] rounded-full py-4 text-[#FF2300] font-sans font-extrabold text-sm tracking-wide shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#FFFFFF] hover:shadow-[7px_7px_14px_#d1d9e6,_-7px_-7px_14px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#FFFFFF] active:scale-[0.98] transition-all duration-300 cursor-pointer select-none disabled:opacity-40"
                    >
                      <Lock size={14} className="text-[#FF2300] stroke-[2.5]" />
                      <span>
                        {isLoading ? "Dispatching..." : getT("sendOtp")}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── RESET PASSWORD VIEW FROM OTP ────────────────── */}
            {(activeTab as string) === "reset" && (
              <div className="max-w-md mx-auto my-6 bg-[#f0f2f5] p-8 sm:p-10 rounded-[2.5rem] border-2 border-white shadow-[12px_12px_24px_#d1d9e6,_-12px_-12px_24px_#FFFFFF] transition-all duration-300">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-black text-[#1A3F25] tracking-tight">{getT("enterOtp")}</h2>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#7C8797] mt-1">Simulated secure OTP reset token</p>
                </div>

                <div className="mb-5 p-4 bg-[#f0f2f5] border-none rounded-2xl text-center shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#FFFFFF]">
                  <span className="text-[9px] uppercase font-bold text-[#FF2300] block mb-1 tracking-widest">Simulated Reset Code Received</span>
                  <span className="text-2xl font-black text-[#1A3F25] font-mono tracking-widest">{simulatedOtp}</span>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="w-full">
                    <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-6 py-4 shadow-[inset_5px_5px_10px_#d1d9e6,_inset_-5px_-5px_10px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                      <input 
                        type="text" 
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        required
                        className="w-full bg-transparent border-none text-xs font-bold text-center text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0 font-mono tracking-widest"
                        placeholder="CCS-XXXX" 
                      />
                    </div>
                  </div>

                  <div className="w-full">
                    <div className="w-full flex items-center bg-[#f0f2f5] rounded-full px-6 py-4 shadow-[inset_5px_5px_10px_#d1d9e6,_inset_-5px_-5px_10px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full bg-transparent border-none text-xs font-bold text-[#1A1A1A] placeholder-[#7C8797]/60 outline-none focus:outline-none focus:ring-0"
                        placeholder="Create New Password" 
                      />
                    </div>
                  </div>

                  <div className="w-full pt-2">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="group w-full flex items-center justify-center gap-2.5 bg-[#f0f2f5] rounded-full py-4 text-[#FF2300] font-sans font-extrabold text-sm tracking-wide shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#FFFFFF] hover:shadow-[7px_7px_14px_#d1d9e6,_-7px_-7px_14px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#FFFFFF] active:scale-[0.98] transition-all duration-300 cursor-pointer select-none disabled:opacity-40"
                    >
                      <Lock size={14} className="text-[#FF2300] stroke-[2.5]" />
                      <span>
                        {isLoading ? "Saving..." : getT("resetPass")}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── LOGGED IN PORTAL SECTIONS ────────────────── */}
            {activeTab === "dashboard" && user && (
              <div className="space-y-6">
                
                {/* 1. OVERVIEW VIEW */}
                {dashboardTab === "overview" && (
                   <div className="space-y-6">
                     {/* Welcome banner */}
                     <div className="bg-gradient-to-r from-[#1A3F25] to-[#255C34] p-6.5 sm:p-8 rounded-[2.5rem] text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-5 border border-white/10 select-none">
                       <div>
                         <h2 className="text-xl md:text-2xl font-black">{t("auth.welcome_msg")}, {user.name}!</h2>
                         <p className="text-xs text-[#f0f2f5]/80 mt-1 font-semibold leading-relaxed">
                           {user.company ? `Brand Campaign Agency: ${user.company}` : "Managing individual premium layouts."} • Yerevan Premium Packaging OS.
                         </p>
                       </div>
                       <button
                         onClick={onClose}
                         className="bg-[#f0f2f5] text-[#FF2300] hover:text-[#1A3F25] text-xs font-black uppercase px-5 py-3 rounded-xl shadow-[4px_4px_10px_rgba(26,63,37,0.35)] hover:shadow-[5px_5px_12px_rgba(26,63,37,0.45)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 border-none outline-none cursor-pointer"
                       >
                         <ShoppingBag size={13} />
                         <span>{currentLocale === "hy" ? "Նոր Հաշվարկ" : currentLocale === "ru" ? "Новый Расчёт" : "New Estimate"}</span>
                       </button>
                     </div>
 
                     {/* Order Metrics Widgets - Soft UI raised buttons */}
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                       <div 
                         onClick={() => { setDashboardTab("orders"); setOrderStatusFilter("active"); }}
                         className="bg-[#f0f2f5] p-5 rounded-3xl shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#FFFFFF] hover:shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#FFFFFF] hover:scale-[1.01] active:shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center gap-3.5 border border-white/20 select-none"
                       >
                         <div className="p-3 bg-[#f0f2f5] text-[#1A3F25] rounded-2xl shadow-[inset_2.5px_2.5px_5px_#d1d9e6,_inset_-2.5px_-2.5px_5px_#FFFFFF]">
                           <Clock size={16} />
                         </div>
                         <div>
                           <span className="text-[9px] text-[#7C8797] font-black uppercase tracking-wider block leading-none">Active Runs</span>
                           <span className="text-xl font-black text-[#1A3F25] mt-1 block">{activeOrders.length}</span>
                         </div>
                       </div>
 
                       <div 
                         onClick={() => { setDashboardTab("invoices"); setOrderStatusFilter("pending_pay"); }}
                         className="bg-[#f0f2f5] p-5 rounded-3xl shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#FFFFFF] hover:shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#FFFFFF] hover:scale-[1.01] active:shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center gap-3.5 border border-white/20 select-none"
                       >
                         <div className="p-3 bg-[#f0f2f5] text-[#D11A2A] rounded-2xl shadow-[inset_2.5px_2.5px_5px_#d1d9e6,_inset_-2.5px_-2.5px_5px_#FFFFFF]">
                           <CreditCard size={16} />
                         </div>
                         <div>
                           <span className="text-[9px] text-[#7C8797] font-black uppercase tracking-wider block leading-none">Unpaid Bills</span>
                           <span className="text-xl font-black text-[#1A3F25] mt-1 block">{waitingPaymentOrders.length}</span>
                         </div>
                       </div>
 
                       <div 
                         onClick={() => { setDashboardTab("tracking"); }}
                         className="bg-[#f0f2f5] p-5 rounded-3xl shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#FFFFFF] hover:shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#FFFFFF] hover:scale-[1.01] active:shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center gap-3.5 border border-white/20 select-none"
                       >
                         <div className="p-3 bg-[#f0f2f5] text-[#C59B6D] rounded-2xl shadow-[inset_2.5px_2.5px_5px_#d1d9e6,_inset_-2.5px_-2.5px_5px_#FFFFFF]">
                           <RefreshCw size={16} className="text-[#C59B6D]" />
                         </div>
                         <div>
                           <span className="text-[9px] text-[#7C8797] font-black uppercase tracking-wider block leading-none">On Production</span>
                           <span className="text-xl font-black text-[#1A3F25] mt-1 block">{inProductionOrders.length}</span>
                         </div>
                       </div>
 
                       <div 
                         onClick={() => { setDashboardTab("orders"); setOrderStatusFilter("ready"); }}
                         className="bg-[#f0f2f5] p-5 rounded-3xl shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#FFFFFF] hover:shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#FFFFFF] hover:scale-[1.01] active:shadow-[inset_3px_3px_6px_#d1d9e6,_inset_-3px_-3px_6px_#FFFFFF] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center gap-3.5 border border-white/20 select-none"
                       >
                         <div className="p-3 bg-[#f0f2f5] text-green-700 rounded-2xl shadow-[inset_2.5px_2.5px_5px_#d1d9e6,_inset_-2.5px_-2.5px_5px_#FFFFFF]">
                           <Truck size={16} />
                         </div>
                         <div>
                           <span className="text-[9px] text-[#7C8797] font-black uppercase tracking-wider block leading-none">Dispatched</span>
                           <span className="text-xl font-black text-[#1A3F25] mt-1 block">{readyOrders.length}</span>
                         </div>
                       </div>
                     </div>
 
                     {/* Quick Highlights – Neumorphic Panels */}
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       <div className="bg-[#f0f2f5] rounded-[2.5rem] border border-white/30 p-6 shadow-[8px_8px_16px_#d1d9e6,_-8px_-8px_16px_#FFFFFF] lg:col-span-2 flex flex-col justify-between">
                         <div>
                           <h3 className="text-xs font-black uppercase tracking-widest text-[#1A3F25] mb-4.5">Live Dispatch Codes</h3>
                           {orders.slice(0, 3).map(o => (
                             <div key={o.id} className="py-3 px-4 mb-3 bg-[#f0f2f5] rounded-2xl shadow-[inset_2.5px_2.5px_5px_#d1d9e6,_inset_-2.5px_-2.5px_5px_#FFFFFF] flex justify-between items-center text-xs select-none">
                               <div>
                                 <span className="font-extrabold text-[#1A3F25]">#{getShortId(o.id)}</span>
                                 <span className="text-[#7C8797]/75 font-semibold ml-2 font-mono">({o.trackingCode || "TRK-PENDING"})</span>
                               </div>
                               <span className="px-3 py-1 bg-[#f0f2f5] text-[#FF2300] font-black shadow-[3px_3px_6px_#d1d9e6,_-3px_-3px_6px_#FFFFFF] rounded-lg text-[9px] uppercase border border-white/20">{getStatusText(o.status)}</span>
                             </div>
                           ))}
                           {orders.length === 0 && (
                             <p className="text-xs text-gray-400 py-6 font-semibold text-center uppercase tracking-wider">No active print campaigns. Calculations will spawn orders here.</p>
                           )}
                         </div>
                         <button
                           onClick={() => setDashboardTab("orders")}
                           className="mt-4 text-[#C59B6D] hover:text-[#1A3F25] text-xs font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors border-none outline-none bg-transparent"
                         >
                           <span>{t("auth.sec_orders")}</span>
                           <ChevronRight size={14} />
                         </button>
                       </div>
 
                      <div className="bg-[#f0f2f5] rounded-[2.5rem] border border-white/30 p-6 shadow-[8px_8px_16px_#d1d9e6,_-8px_-8px_16px_#FFFFFF] flex flex-col justify-between">
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-widest text-[#1A3F25] mb-4.5">{t("auth.sec_favorites")}</h3>
                          <div className="space-y-3.5 max-h-48 overflow-y-auto pr-1">
                            {favoritedCalculationsList.map((sc: any) => (
                              <div key={sc.id} className="text-xs py-3 px-4 bg-[#f0f2f5] rounded-2xl shadow-[inset_2.5px_2.5px_5px_#d1d9e6,_inset_-2.5px_-2.5px_5px_#FFFFFF] flex justify-between items-center select-none">
                                <span className="font-bold text-gray-800 truncate pr-2">{sc.name}</span>
                                <span className="text-[#1A3F25] font-black shrink-0">{sc.calcResult?.totalPrice?.toLocaleString()} ֏</span>
                              </div>
                            ))}
                            {favoritedCalculationsList.length === 0 && (
                              <p className="text-xs text-gray-400 py-6 font-semibold text-center uppercase tracking-wider">No starred configurations. Mark Calculations to add as favorites.</p>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDashboardTab("favorites")}
                          className="mt-4 text-[#C59B6D] hover:text-[#1A3F25] text-xs font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors border-none outline-none bg-transparent"
                        >
                          <span>{t("auth.sec_favorites")}</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SPECIFIC ORDERS TABLE (МОИ ЗАКАЗЫ) */}
                {dashboardTab === "orders" && (
                  <div className="bg-white rounded-2xl border border-[#C59B6D]/20 overflow-hidden shadow-xs">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                      <h2 className="text-xs sm:text-sm font-extrabold text-[#1A3F25] uppercase tracking-wider">{t("auth.sec_orders")}</h2>
                      <button 
                        type="button"
                        onClick={() => fetchOrders(user.email, user.role)}
                        className="px-3 py-1.5 bg-[#f0f2f5] border border-[#C59B6D]/30 hover:bg-white rounded-xl text-xs font-bold text-[#1A3F25] flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <RefreshCw size={12} className="text-[#C59B6D]" />
                        <span>Refresh</span>
                      </button>
                    </div>

                    {filteredOrdersList.length === 0 ? (
                      <div className="py-12 text-center text-gray-450 text-xs font-bold">
                        {getT("noOrders")}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs min-w-[700px]">
                          <thead className="bg-[#f0f2f5] uppercase text-[9px] tracking-widest text-[#1A3F25] font-black border-b border-[#C59B6D]/15">
                            <tr>
                              <th className="py-3.5 px-4">{t("auth.order_num")}</th>
                              <th className="py-3.5 px-4">{t("auth.order_tracking")}</th>
                              <th className="py-3.5 px-4">{t("auth.order_date")}</th>
                              <th className="py-3.5 px-4">Campaign Item</th>
                              <th className="py-3.5 px-4">{t("auth.order_total")}</th>
                              <th className="py-3.5 px-4">{t("auth.order_status")}</th>
                              <th className="py-3.5 px-4">Bill Status</th>
                              <th className="py-3.5 px-4 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 font-semibold text-[#1A1A1A]/90">
                            {filteredOrdersList.map((o) => (
                              <tr key={o.id} className="hover:bg-[#f0f2f5]/40 transition-colors">
                                <td className="py-4 px-4 text-[#1A3F25] font-black font-mono">
                                  #{getShortId(o.id)}
                                </td>
                                <td className="py-4 px-4 font-mono font-bold text-gray-500">
                                  {o.trackingCode || "TRK-GEN_PREP"}
                                </td>
                                <td className="py-4 px-4 text-gray-500 text-[11px]">
                                  {new Date(o.ts).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-4 pr-6 font-bold truncate max-w-[150px]">
                                  {o.type ? o.type : "Custom Packaging"}
                                </td>
                                <td className="py-4 px-4 font-bold text-gray-900">
                                  {o.totalPrice.toLocaleString()} AMD
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border uppercase ${
                                    o.status === "Новый" || o.status === "New"
                                      ? "bg-blue-50 text-blue-800 border-blue-100"
                                      : o.status === "Готов" || o.status === "Ready" || o.status === "Доставлен"
                                        ? "bg-green-50 text-green-700 border-green-100"
                                        : "bg-amber-50 text-[#C59B6D] border-[#C59B6D]/30"
                                  }`}>
                                    <Clock size={10} />
                                    <span>{getStatusText(o.status)}</span>
                                  </span>
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    o.paymentStatus === "оплачено"
                                      ? "bg-[#1A3F25]/10 text-[#1A3F25]"
                                      : "bg-red-50 text-red-650"
                                  }`}>
                                    <CreditCard size={10} />
                                    <span>{o.paymentStatus === "оплачено" ? "Paid" : "Unpaid"}</span>
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedOrderDetails(o)}
                                      className="p-1 px-2.5 bg-gray-150 hover:bg-[#1A3F25] hover:text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition"
                                    >
                                      {t("auth.order_details")}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => onReorder(o)}
                                      className="p-1 px-2 bg-red-50 hover:bg-red-100 rounded-lg text-[10px] font-bold text-red-650"
                                    >
                                      Repeat
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. ORDER TIMELINE TRACKING WINDOW (ОТСЛЕЖИВАНИЕ ЗАКАЗОВ) */}
                {dashboardTab === "tracking" && (
                  <div className="space-y-6">
                    {orders.length === 0 ? (
                      <div className="bg-white p-12 text-center rounded-2xl border border-[#C59B6D]/20 text-gray-400 text-xs font-semibold">
                        {t("auth.noOrders", "You have not submitted any orders yet.")}
                      </div>
                    ) : (
                      orders.map((trackOrder) => {
                        // Figure out current active step sequence
                        const currentIndex = trackingTimelineStatuses.indexOf(trackOrder.status) !== -1
                          ? trackingTimelineStatuses.indexOf(trackOrder.status)
                          : 0; // fallback to step 0
                        
                        return (
                          <div key={trackOrder.id} className="bg-white p-6 rounded-2xl border border-[#C59B6D]/15 shadow-xs space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                              <div>
                                <span className="text-[10px] font-black uppercase text-[#C59B6D] tracking-widest">Active Printing Sequence</span>
                                <h4 className="text-sm font-black text-[#1A3F25]">Order Ref #{getShortId(trackOrder.id)} ({trackOrder.type})</h4>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Est. Courier Code</span>
                                <span className="text-xs font-mono font-bold text-gray-800">{trackOrder.trackingCode || "TRK-PENDING_COURIER"}</span>
                              </div>
                            </div>

                            {/* PROGRESS TIMELINE TRAIL */}
                            <div className="py-4 overflow-x-auto select-none scrollbar-none">
                              <div className="flex items-center min-w-[800px] justify-between relative pl-2 pr-2">
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-150 z-0 -translate-y-1/2"></div>
                                
                                {trackingTimelineStatuses.map((step, sIdx) => {
                                  const isCompleted = sIdx <= currentIndex;
                                  const isActive = sIdx === currentIndex;
                                  
                                  return (
                                    <div key={step} className="flex flex-col items-center z-10 text-center relative px-1 flex-1">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                                        isActive 
                                          ? "bg-[#1A3F25] text-[#C59B6D] border-[#C59B6D] scale-110 shadow-md"
                                          : isCompleted
                                            ? "bg-[#C59B6D] text-[#1A3F25] border-[#1A3F25]"
                                            : "bg-white text-gray-400 border-gray-200"
                                      }`}>
                                        {isCompleted && !isActive ? (
                                          <Check size={13} className="stroke-[3]" />
                                        ) : (
                                          <span>{sIdx + 1}</span>
                                        )}
                                      </div>
                                      
                                      <span className={`text-[10px] mt-2 font-black ${
                                        isActive ? "text-[#1A3F25]" : isCompleted ? "text-gray-800" : "text-gray-400"
                                      }`}>
                                        {getStatusText(step)}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* 4. COMMERCIAL PROPOSALS TAB (КОММЕРЧЕСКИЕ ПРЕДЛОЖЕНИЯ) */}
                {dashboardTab === "quotes" && (
                  <div className="bg-white p-6 rounded-2xl border border-[#C59B6D]/20 shadow-xs space-y-4">
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#1A3F25] uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Briefcase size={16} className="text-[#C59B6D]" />
                      <span>Commercial Pitch Propositions ({orders.length})</span>
                    </h3>

                    {orders.length === 0 ? (
                      <p className="text-xs text-gray-400 font-semibold py-8 text-center bg-gray-50 rounded-xl">No campaigns initialized. Your estimates generate Proposals here.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {orders.map((quoteOrder) => (
                          <div key={quoteOrder.id} className="p-4 border border-[#C59B6D]/20 rounded-xl flex flex-col justify-between gap-4 bg-white hover:bg-gray-50/50 shadow-xs">
                            <div>
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] font-black uppercase text-[#C59B6D] tracking-widest pl-1 py-0.5">Commercial Offer</span>
                                <span className="text-[9px] font-mono font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">#{getShortId(quoteOrder.id)}</span>
                              </div>
                              <h4 className="text-xs font-black text-gray-900 mt-2 mb-1">Corporate Client Packaging Pitch</h4>
                              <p className="text-[10px] font-semibold text-gray-500 line-clamp-2">{quoteOrder.details}</p>
                              
                              <div className="pt-3 font-mono text-xs font-bold text-[#1A3F25]">
                                Est. Campaign: <span className="text-sm font-black">{quoteOrder.totalPrice.toLocaleString()} ֏</span>
                              </div>
                            </div>

                            <a
                              href={`/api/submissions/${quoteOrder.id}/invoice-pdf`}
                              target="_blank"
                              rel="noreferrer"
                              className="py-2.5 cursor-pointer bg-[#1A3F25] hover:bg-[#C59B6D] hover:text-[#1A3F25] text-white text-[10px] font-black tracking-widest uppercase rounded-lg text-center transition flex items-center justify-center gap-1.5"
                            >
                              <Download size={13} />
                              <span>Download PDF Offer</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. INVOICES AND DOCUMENTS (СЧЕТА И ДОКУМЕНТЫ) */}
                {dashboardTab === "invoices" && (
                  <div className="bg-white p-6 rounded-2xl border border-[#C59B6D]/20 shadow-xs space-y-4">
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#1A3F25] uppercase tracking-wider mb-4 flex items-center gap-2">
                      <CreditCard size={16} className="text-[#C59B6D]" />
                      <span>B2B Printable Invoices & Settlement Receipts</span>
                    </h3>

                    {orders.length === 0 ? (
                      <p className="text-xs text-gray-400 font-semibold py-8 text-center bg-[#f0f2f5] rounded-xl border border-dashed">No accounting items active.</p>
                    ) : (
                      <div className="space-y-3">
                        {orders.map((invoiceOrder) => (
                          <div key={invoiceOrder.id} className="p-4 bg-gray-50/70 border border-[#C59B6D]/15 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                              <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{invoiceOrder.paymentStatus === "оплачено" ? "Settled Receipt" : "Awaiting Payment"}</span>
                              <h4 className="text-xs font-black text-[#1A3F25] mt-1">Invoice Document - REF #{getShortId(invoiceOrder.id)}</h4>
                              <p className="text-[10px] text-gray-550 font-medium">Auto-generated with verified Capsule stamp & Yerevan fiscal details.</p>
                            </div>
                            
                            <div className="flex items-center gap-3 pl-1 self-end sm:self-auto">
                              <div className="text-right">
                                <span className="text-[10px] text-gray-405 font-bold block">Bill Total</span>
                                <span className="text-[#1A3F25] text-xs font-black">{invoiceOrder.totalPrice.toLocaleString()} AMD</span>
                              </div>
                              
                              <div className="flex gap-1.5">
                                {invoiceOrder.paymentStatus !== "оплачено" && (
                                  <button
                                    onClick={() => handleTriggerPayment(invoiceOrder)}
                                    className="px-3 py-2 bg-[#1A3F25] text-white hover:bg-[#C59B6D] hover:text-[#1A3F25] text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer flex items-center gap-1"
                                  >
                                    <CreditCard size={11} />
                                    <span>Pay bills</span>
                                  </button>
                                )}
                                <a
                                  href={`/api/submissions/${invoiceOrder.id}/invoice-pdf`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-2 bg-white hover:bg-gray-100 border border-gray-250 rounded-lg text-gray-600 transition"
                                >
                                  <Download size={11} />
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 6. SAVED CALCULATIONS SPECIFICATIONS (СОХРАНЕННЫЕ РАСЧЕТЫ) */}
                {dashboardTab === "calculations" && (
                  <div className="bg-white p-6 rounded-2xl border border-[#C59B6D]/20 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <h2 className="text-xs sm:text-sm font-extrabold text-[#1A3F25] uppercase tracking-wider">{t("auth.sec_saved_calcs")}</h2>
                      <button 
                        onClick={() => fetchSavedCalculations(user.email)}
                        className="px-2.5 py-1 bg-[#f0f2f5] border border-[#C59B6D]/30 text-[10px] font-bold text-[#1A3F25] rounded-md hover:bg-white cursor-pointer"
                      >
                        Reload
                      </button>
                    </div>

                    {isLoadingCalcs ? (
                      <div className="py-12 text-center text-xs text-gray-400 font-semibold">{currentLocale === "ru" ? "Загрузка спецификаций..." : "Loading specifications..."}</div>
                    ) : savedCalculations.length === 0 ? (
                      <div className="py-12 text-center text-xs text-gray-400 font-bold">
                        No saved calculations yet. You can save any estimate inside active calculation panel.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {savedCalculations.map((sc) => (
                          <div key={sc.id} className="p-4 rounded-xl border border-[#C59B6D]/15 shadow-xs flex flex-col justify-between gap-4 bg-white/70">
                            <div>
                              <div className="flex items-start justify-between">
                                <h4 className="text-xs font-black text-[#1A1A1A] leading-tight pr-2">{sc.name}</h4>
                                <div className="flex gap-1 items-center">
                                  <button
                                    onClick={() => toggleFavoriteConfiguration(sc.id)}
                                    className="p-1 hover:text-[#C59B6D] duration-200"
                                  >
                                    <Star size={14} className={favoritesList.includes(sc.id) ? "fill-[#C59B6D] text-[#C59B6D]" : "text-gray-350"} />
                                  </button>
                                  <span className="text-[8px] tracking-wider font-mono uppercase py-0.5 px-2 bg-[#f0f2f5] border border-[#C59B6D]/20 text-[#1A3F25] font-black rounded-sm">
                                    {sc.categoryId}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[9px] text-gray-400 font-medium">{new Date(sc.createdAt).toLocaleString()}</span>
                              
                              <p className="text-[11px] text-gray-500 font-semibold mt-3 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100 max-h-24 overflow-y-auto whitespace-pre-line leading-relaxed">
                                {sc.calcResult?.dimensionsText ? `Dimensions: ${sc.calcResult.dimensionsText} cm\n` : ""}
                                {sc.calcResult?.qty ? `Quantity: ${sc.calcResult.qty} pcs\n` : ""}
                                {sc.calcResult?.materialType ? `Material: ${sc.calcResult.materialType}\n` : ""}
                                {sc.calcResult?.detailsText || ""}
                              </p>
                              
                              <div className="text-base font-black text-[#1A3F25] mt-2 font-mono">
                                {sc.calcResult?.totalPrice?.toLocaleString()} AMD
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                onClick={() => handleShareCalculationList(sc.id)}
                                className="py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Share2 size={11} className="text-[#C59B6D]" />
                                <span>Copy Link</span>
                              </button>
                              
                              <button
                                onClick={() => handleDeleteCalculation(sc.id)}
                                className="py-2.5 bg-red-50 hover:bg-red-100 text-red-650 text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer border border-red-100"
                              >
                                <Trash2 size={11} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 7. FAVORITE CONFIGURATIONS (ИЗБРАННЫЕ КОНФИГУРАЦИИ) */}
                {dashboardTab === "favorites" && (
                  <div className="bg-white p-6 rounded-2xl border border-[#C59B6D]/20 shadow-xs space-y-4">
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#1A3F25] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
                      <Star size={16} className="text-[#C59B6D] fill-[#C59B6D]" />
                      <span>Starred favorited packaging configurations ({favoritedCalculationsList.length})</span>
                    </h3>

                    {favoritedCalculationsList.length === 0 ? (
                      <div className="py-12 text-center text-xs text-gray-400 font-semibold bg-[#f0f2f5] rounded-xl border border-dashed border-[#C59B6D]/35">
                        Please star configurations from the Calculations tab to highlight your major brand configurations.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {favoritedCalculationsList.map((sc) => (
                          <div key={sc.id} className="p-4 rounded-xl border border-[#C59B6D]/15 shadow-xs flex flex-col justify-between gap-4 bg-white">
                            <div>
                              <div className="flex items-start justify-between">
                                <h4 className="text-xs font-black text-[#1A1A1A] leading-tight pr-2">{sc.name}</h4>
                                <button
                                  onClick={() => toggleFavoriteConfiguration(sc.id)}
                                  className="text-[#C59B6D] p-0.5 hover:scale-105 transition-transform"
                                >
                                  <Star size={14} className="fill-[#C59B6D] text-[#C59B6D]" />
                                </button>
                              </div>
                              <span className="text-[9px] text-[#C59B6D] font-mono tracking-wider">FAVORITE CAMPAIGN CONFIG</span>
                              
                              <p className="text-[11px] text-gray-500 font-semibold mt-3 bg-gray-50/50 p-2 rounded border border-gray-100 max-h-24 overflow-y-auto whitespace-pre-line leading-relaxed">
                                {sc.calcResult?.dimensionsText ? `Dimensions: ${sc.calcResult.dimensionsText} cm\n` : ""}
                                {sc.calcResult?.qty ? `Quantity: ${sc.calcResult.qty} pcs\n` : ""}
                                {sc.calcResult?.materialType ? `Material: ${sc.calcResult.materialType}\n` : ""}
                              </p>
                              
                              <div className="text-sm font-black text-[#1A3F25] mt-1 font-mono">
                                {sc.calcResult?.totalPrice?.toLocaleString()} AMD
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 8. COMPANY PROFILE MANAGEMENT (ПРОФИЛЬ КОМПАНИИ) */}
                {dashboardTab === "profile" && (
                  <div className="bg-white p-6 rounded-2xl border border-[#C59B6D]/20 shadow-xs space-y-6">
                    <div className="border-b border-gray-100 pb-3">
                      <h3 className="text-xs sm:text-sm font-extrabold text-[#1A3F25] uppercase tracking-wider">Company Profile Specifications</h3>
                      <p className="text-xs text-gray-400 font-medium mt-1">Manage B2B brand attributes, legal invoicing details, and fiscal records.</p>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">{getT("name")}</label>
                          <input 
                            type="text"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            required
                            className="w-full text-xs font-bold px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1A3F25] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">{getT("company")}</label>
                          <input 
                            type="text"
                            value={profileCompany}
                            onChange={(e) => setProfileCompany(e.target.value)}
                            className="w-full text-xs font-bold px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1A3F25] focus:outline-none"
                            placeholder="e.g. Agency LLC"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">{getT("email")} (Verified login)</label>
                          <input 
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full text-xs font-bold px-3.5 py-2.5 bg-gray-100 text-gray-400 border border-gray-200 rounded-xl cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">{getT("phone")}</label>
                          <input 
                            type="text"
                            value={profilePhone}
                            onChange={(e) => setProfilePhone(e.target.value)}
                            className="w-full text-xs font-bold px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1A3F25] focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">Corporate Accounting and Fiscal details (Налоговые реквизиты)</label>
                        <textarea
                          value={profileLegalDetails}
                          onChange={(e) => setProfileLegalDetails(e.target.value)}
                          rows={3}
                          placeholder="Bank: VTB Armenia, Account: XXXXXXXXXX, Tin: XXXXXXXX, legal address, registered name for automaticprintable invoices formatting."
                          className="w-full text-xs font-semibold p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1A3F25] focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="px-5 py-2.5 bg-[#1A3F25] hover:bg-[#C59B6D] hover:text-[#1A3F25] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        {isUpdatingProfile ? "Saving changes..." : "Save Company Attributes"}
                      </button>
                    </form>
                  </div>
                )}

                {/* 9. ACCOUNT SETTINGS (НАСТРОЙКИ АККАУНТА) */}
                {dashboardTab === "settings" && (
                  <div className="bg-white p-6 rounded-2xl border border-[#C59B6D]/20 shadow-xs space-y-6">
                    <div className="border-b border-gray-100 pb-3">
                      <h3 className="text-xs sm:text-sm font-extrabold text-[#1A3F25] uppercase tracking-wider">Account Security Settings</h3>
                      <p className="text-xs text-gray-400 font-medium mt-1">Upgrade account login password and choose workspace languages.</p>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">{t("auth.field_password")} (Change Password)</label>
                        <input 
                          type="password"
                          value={profilePassword}
                          onChange={(e) => setProfilePassword(e.target.value)}
                          placeholder="Establish new secure password"
                          className="w-full text-xs font-semibold px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1A3F25] focus:outline-none"
                        />
                      </div>

                      <div className="p-4 bg-[#f0f2f5] rounded-2xl border border-[#C59B6D]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-[11px] font-black text-[#1A3F25] block">Workspace Language Preference</span>
                          <span className="text-[10px] text-gray-500">Allows changing the interface translation system locale instantly.</span>
                        </div>
                        <div className="flex gap-1.5 self-end sm:self-auto">
                          {(["hy", "ru", "en", "ar"] as const).map((langPref) => (
                            <button
                              key={langPref}
                              type="button"
                              onClick={() => setLocale(langPref)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all uppercase ${currentLocale === langPref ? "bg-[#1A3F25] text-white border border-[#1A3F25]" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
                            >
                              {langPref}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="px-5 py-2.5 bg-[#1A3F25] hover:bg-[#C59B6D] hover:text-[#1A3F25] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        {isUpdatingProfile ? "Saving changes..." : "Save Settings Changes"}
                      </button>
                    </form>
                  </div>
                )}

                {/* 10. PARTNER ZONE AREA FOR AGENCIES */}
                {dashboardTab === "partner" && user.role === "Partner" && (
                  <div className="space-y-6">
                    {/* Metrics row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-[#1A3F25] to-[#245833] rounded-2xl p-5 text-white shadow-md relative overflow-hidden flex flex-col justify-between h-40 border border-[#C59B6D]/30">
                        <div className="absolute right-3 bottom-0 opacity-15">
                          <Percent size={120} className="stroke-[1.2]" />
                        </div>
                        <div>
                          <span className="text-[9px] font-black tracking-widest uppercase bg-white/10 text-[#C59B6D] px-2 py-1 rounded">PARTNER BENEFITS</span>
                          <h3 className="text-xs font-bold text-gray-200 mt-2">Deducted Campaign Margin</h3>
                        </div>
                        <div className="text-3xl font-black text-[#C59B6D]">{partnerDiscountActive}% Off</div>
                        <p className="text-[9px] text-[#f0f2f5]/80 mt-1">Applied instantly dynamically to any custom package layouts.</p>
                      </div>

                      <div className="bg-white rounded-2xl p-5 border border-[#C59B6D]/20 shadow-xs flex flex-col justify-between h-40">
                        <div>
                          <span className="text-[9px] font-black tracking-widest text-[#1A3F25] uppercase bg-[#f0f2f5] px-2 py-1 rounded">AGENCY RUNS</span>
                          <h2 className="text-xl font-black mt-3 text-[#1A1A1A]">{totalVolume} Inquiries</h2>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500">{getT("volume")}</p>
                          <p className="text-[9px] text-gray-400 mt-0.5">Aggregated agency totals</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-5 border border-[#C59B6D]/20 shadow-xs flex flex-col justify-between h-40">
                        <div>
                          <span className="text-[9px] font-black tracking-widest text-green-700 uppercase bg-green-50 px-2 py-1 rounded">SALES VALUATION</span>
                          <h2 className="text-xl font-black mt-3 text-[#1A3F25]">{totalValueSum.toLocaleString()} AMD</h2>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500">{getT("sum")}</p>
                          <p className="text-[9px] text-gray-400 mt-0.5">Combined client-agency investments</p>
                        </div>
                      </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-white p-5 rounded-2xl border border-[#C59B6D]/15 shadow-sm">
                      <div className="flex items-center gap-2 mb-4 border-b border-[#f0f2f5] pb-3">
                        <TrendingUp size={16} className="text-[#C59B6D]" />
                        <h3 className="text-xs font-black text-[#1A3F25] uppercase tracking-wider">{getT("aggregate")}</h3>
                      </div>
                      <div className="h-64 sm:h-72 w-full font-sans">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={ordersChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f2f2f2" />
                            <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                            <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #f0f0f0", fontFamily: "sans-serif" }} />
                            <Bar dataKey="AMD" fill="#1A3F25" radius={[6, 6, 0, 0]} barSize={25} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Clients recruitment subclients */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-5 rounded-2xl border border-[#C59B6D]/20 shadow-sm h-fit">
                        <div className="flex items-center gap-2 mb-4">
                          <Plus size={16} className="text-[#C59B6D]" />
                          <h3 className="text-xs font-black text-[#1A3F25] uppercase tracking-wider">{getT("addSubclient")}</h3>
                        </div>
                        <form onSubmit={handleAddSubClient} className="space-y-4">
                          <div>
                            <label className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-1">Company Name</label>
                            <input
                              type="text"
                              value={subClientName}
                              onChange={(e) => setSubClientName(e.target.value)}
                              className="w-full text-xs font-bold px-3 py-2 bg-[#f0f2f5]/50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1A3F25]"
                              placeholder="e.g. Armenia Food LLC"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-1">{getT("email")}</label>
                            <input
                              type="email"
                              value={subClientEmail}
                              onChange={(e) => setSubClientEmail(e.target.value)}
                              className="w-full text-xs font-bold px-3 py-2 bg-[#f0f2f5]/50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1A3F25]"
                              placeholder="e.g. food@mail.am"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-1">{getT("phone")}</label>
                            <input
                              type="text"
                              value={subClientPhone}
                              onChange={(e) => setSubClientPhone(e.target.value)}
                              className="w-full text-xs font-bold px-3 py-2 bg-[#f0f2f5]/50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1A3F25]"
                              placeholder="e.g. +374 77 777 777"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full text-xs font-black py-2.5 px-4 bg-[#1A3F25] text-white hover:bg-[#C59B6D] hover:text-[#1A3F25] uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                          >
                            Add Agency Client
                          </button>
                        </form>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-[#C59B6D]/20 shadow-sm md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                          <Users size={16} className="text-[#C59B6D]" />
                          <h3 className="text-xs font-black text-[#1A3F25] uppercase tracking-wider">{getT("subclients")}</h3>
                        </div>

                        {(!user.partnerClients || user.partnerClients.length === 0) ? (
                          <div className="py-8 text-center text-gray-400 text-xs font-semibold">
                            No agency linked sub-clients. Register branch firms above.
                          </div>
                        ) : (
                          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                            {user.partnerClients.map((sc: any, idx: number) => (
                              <div key={idx} className="p-3 bg-gray-50 border border-[#C59B6D]/15 rounded-xl flex justify-between items-center hover:shadow-xs transition-shadow">
                                <div>
                                  <p className="text-xs font-bold text-[#1A1A1A]">{sc.name}</p>
                                  <p className="text-[9px] text-[#C59B6D] font-mono tracking-wide">Client Email: {sc.email} • Phone: {sc.phone}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSubClient(idx)}
                                  className="p-1 px-2.5 bg-red-100 hover:bg-red-200 rounded-lg text-[9px] font-bold text-red-700 flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                                >
                                  <Trash2 size={11} />
                                  <span>Remove</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      </motion.div>

      {/* ── ARMENIAN PAYMENTS DRAWER GATEWAY MODAL ── */}
      <AnimatePresence>
        {activePaymentOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 backdrop-blur-xs p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl text-[#1A1A1A] border border-[#C59B6D]/20"
            >
              <div className="bg-[#1A3F25] p-5 text-white flex justify-between items-center border-b border-[#C59B6D]/20">
                <div>
                  <h3 className="font-extrabold text-[#fff] text-xs sm:text-sm uppercase tracking-widest">{getT("paySim")}</h3>
                  <p className="text-[10px] text-[#C59B6D] font-black">Armenia IDram / Telcell Live Sandbox</p>
                </div>
                <button 
                  onClick={() => setActivePaymentOrder(null)} 
                  className="text-[#C59B6D] hover:bg-white/10 p-1.5 rounded-full cursor-pointer leading-none"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="p-5 space-y-5 bg-[#f0f2f5]">
                
                {/* Bill Card */}
                <div className="bg-white border border-[#C59B6D]/20 p-4 rounded-2xl flex justify-between items-center font-semibold text-xs shadow-xs">
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Invoicing</span>
                    <span className="text-gray-900 font-extrabold">Ref: #{getShortId(activePaymentOrder.id)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Campaign Bill</span>
                    <span className="text-[#1A3F25] text-base font-black">{activePaymentOrder.totalPrice.toLocaleString()} ֏</span>
                  </div>
                </div>

                {/* Gateway Choosing options with real Armenia brands */}
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 text-center">{getT("chooseAmPay")}</label>
                  <div className="grid grid-cols-2 gap-3">
                    
                    <button
                      type="button"
                      onClick={() => setPaymentGateway("idram")}
                      className={`p-3 rounded-2xl border text-center font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentGateway === "idram"
                          ? "border-[#1A3F25] bg-white text-[#1A3F25] shadow-sm"
                          : "border-gray-200 bg-white text-gray-500 overflow-hidden"
                      }`}
                    >
                      <img 
                        src="https://www.idram.am/assets/img/og/idram-logo.png" 
                        onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
                        className="w-auto h-6 object-contain" 
                        alt="IDram" 
                      />
                      <span className="text-[9px] tracking-widest uppercase font-black">IDram Core</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentGateway("telcell")}
                      className={`p-3 rounded-2xl border text-center font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentGateway === "telcell"
                          ? "border-[#1A3F25] bg-white text-[#1A3F25] shadow-sm"
                          : "border-gray-200 bg-white text-gray-500 overflow-hidden"
                      }`}
                    >
                      <img 
                        src="https://checkout.telcell.am/favicon.ico" 
                        onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
                        className="w-6 h-6 object-contain rounded-full" 
                        alt="Telcell" 
                      />
                      <span className="text-[9px] tracking-widest uppercase font-black">Telcell Pay</span>
                    </button>

                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCompletePaymentSimulation}
                  disabled={isPayingSim}
                  className="w-full py-3 bg-[#1A3F25] hover:bg-[#C59B6D] hover:text-[#1A3F25] text-white font-bold rounded-xl transition-all shadow-md text-xs tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2"
                >
                  {isPayingSim ? "Processing Settlement..." : `Authorize Payment via ${paymentGateway === "idram" ? "IDram" : "Telcell"}`}
                </button>

                <p className="text-[9px] text-gray-400 text-center leading-relaxed font-semibold">
                  Sandbox settlements execute automatic Postgres updates, updates dispatch statuses, and marks order receipts settled.
                </p>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── ORDER DETAILED SIDE OVERLAY DRAWER WITH 3D COMPONENT ── */}
      <AnimatePresence>
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-[80] flex justify-end bg-black/45 backdrop-blur-xs p-0">
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full max-w-sm bg-[#f0f2f5] h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-[#C59B6D]/20"
            >
              {/* Head order overlay */}
              <div className="p-4 border-b border-[#C59B6D]/20 flex justify-between items-center bg-white shrink-0">
                <div>
                  <h3 className="font-extrabold text-[#1A3F25] flex items-center gap-1.5 uppercase text-xs">
                    <FileText size={15} className="text-[#C59B6D]" />
                    <span>REF: #{getShortId(selectedOrderDetails.id)}</span>
                  </h3>
                  <span className="text-[10px] font-medium text-gray-400">{new Date(selectedOrderDetails.ts).toLocaleDateString()}</span>
                </div>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="p-1 px-3 bg-gray-150 hover:bg-gray-200 rounded-full text-xs font-bold flex items-center gap-1 transition"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Order items body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                
                {/* 3D Visualizer Simulation Card! */}
                <div className="p-4 bg-gradient-to-r from-[#1A3F25] to-gray-900 rounded-2xl text-white relative overflow-hidden text-center shadow-md">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#C59B6D] bg-white/10 px-2.5 py-0.5 rounded-full">Interactive 3D Geometry render</span>
                  
                  {/* Dynamic CSS cube block representing 3D product simulation */}
                  <div className="cube-wrapper h-32 relative mx-auto flex items-center justify-center mt-3" style={{ perspective: "400px" }}>
                    <div 
                      className="cube animate-spin-cube relative w-14 h-14 transform-style-3d hover:pause cursor-grab active:cursor-grabbing"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* 6 Face objects */}
                      <div className="absolute inset-0 bg-[#C59B6D]/20 border-2 border-[#C59B6D] text-center flex items-center justify-center text-[7px] font-mono select-none" style={{ transform: "rotateY(0deg) translateZ(28px)" }}>Capsule</div>
                      <div className="absolute inset-0 bg-[#C59B6D]/20 border-2 border-[#C59B6D] text-center flex items-center justify-center text-[7px] font-mono select-none" style={{ transform: "rotateY(180deg) translateZ(28px)" }}>Am.OS</div>
                      <div className="absolute inset-0 bg-[#C59B6D]/20 border-2 border-[#C59B6D] text-center flex items-center justify-center text-[7px] font-mono select-none" style={{ transform: "rotateY(90deg) translateZ(28px)" }}>Premium</div>
                      <div className="absolute inset-0 bg-[#C59B6D]/20 border-2 border-[#C59B6D] text-center flex items-center justify-center text-[7px] font-mono select-none" style={{ transform: "rotateY(-90deg) translateZ(28px)" }}>Yerevan</div>
                      <div className="absolute inset-0 bg-[#C59B6D]/20 border-2 border-[#C59B6D] text-center flex items-center justify-center text-[7px] font-mono select-none" style={{ transform: "rotateX(90deg) translateZ(28px)" }}>Print</div>
                      <div className="absolute inset-0 bg-[#C59B6D]/20 border-2 border-[#C59B6D] text-center flex items-center justify-center text-[7px] font-mono select-none" style={{ transform: "rotateX(-90deg) translateZ(28px)" }}>Studio</div>
                    </div>
                  </div>
                  
                  <p className="text-[9px] text-[#f0f2f5]/80 mt-1.5 font-medium">Drag to examine simulated print layout, custom textures, and folding vectors.</p>
                </div>

                {/* Specifications Parameters Card */}
                <div className="bg-white border border-[#C59B6D]/20 p-4 rounded-xl space-y-2 shadow-xs">
                  <h4 className="text-[10px] uppercase font-black text-gray-400 mb-2">Detailed Specifications</h4>
                  <p className="text-xs font-semibold text-gray-700 whitespace-pre-line leading-relaxed">
                    {selectedOrderDetails.details}
                  </p>
                  
                  <div className="pt-2 border-t border-gray-200 mt-3 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400">Total Valuation</span>
                    <span className="text-base font-black text-[#1A3F25]">{selectedOrderDetails.totalPrice.toLocaleString()} AMD</span>
                  </div>
                </div>

                {/* MANAGER DIRECT LIVE CHAT ROOM */}
                <div className="space-y-3 bg-white border border-[#C59B6D]/20 rounded-xl p-3 shadow-xs">
                  <h4 className="text-xs uppercase font-extrabold text-gray-500 flex items-center gap-1.5 leading-none">
                    <MessageSquare size={14} className="text-[#C59B6D]" />
                    <span>Direct chat with coordinator</span>
                  </h4>

                  <div className="h-40 overflow-y-auto bg-[#f0f2f5]/50 p-2.5 rounded-lg border border-gray-150 flex flex-col gap-2">
                    {(orderChats[selectedOrderDetails.id] || []).map((msg, idx) => (
                      <div key={idx} className={`max-w-[85%] text-xs p-2.5 rounded-xl leading-normal ${msg.sender === "user" ? "bg-[#1A3F25] text-white self-end text-right" : "bg-white border border-gray-150 text-[#1A1A1A] self-start text-left"}`}>
                        <p className="font-semibold whitespace-pre-line">{msg.text}</p>
                        <span className="text-[9px] opacity-75 block mt-1 font-mono">{msg.ts}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessageToManager} className="flex gap-1.5">
                    <input
                      type="text"
                      value={chatMessageInput}
                      onChange={(e) => setChatMessageInput(e.target.value)}
                      placeholder="Write message to coordinator..."
                      className="flex-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold px-3 py-1.5 focus:outline-none focus:border-[#1A3F25]"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-[#1A3F25] text-white hover:bg-[#C59B6D] rounded-lg transition active:scale-95 cursor-pointer leading-none"
                    >
                      <Send size={13} />
                    </button>
                  </form>
                </div>

              </div>

              {/* Foot order overlay actions */}
              <div className="p-4 border-t border-[#C59B6D]/20 bg-white flex items-center justify-between gap-2.5 shrink-0">
                <a
                  href={`/api/submissions/${selectedOrderDetails.id}/invoice-pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 bg-white hover:bg-[#f0f2f5] text-gray-700 font-bold text-xs rounded-xl border border-gray-250 flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <Download size={13} />
                  <span>Invoice PDF</span>
                </a>
                
                <button
                  onClick={() => {
                    onReorder(selectedOrderDetails);
                    setSelectedOrderDetails(null);
                  }}
                  className="flex-1 py-3 bg-[#1A3F25] text-white hover:bg-[#C59B6D] hover:text-[#1A3F25] font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <RefreshCw size={13} />
                  <span>Repeat Run</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
