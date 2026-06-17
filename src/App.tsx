import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CapsuleLogo } from "./components/CapsuleLogo";
import { 
  Calculator, 
  Settings, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Sliders, 
  Layers, 
  Expand, 
  FileText, 
  Check, 
  ShoppingBag, 
  ShoppingCart,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Globe,
  Sparkles,
  Inbox,
  HelpCircle,
  Package,
  X,
  Maximize2,
  Crown,
  Box,
  Bookmark,
  Tag,
  Gift,
  IdCard,
  Printer,
  Gem,
  Scissors,
  Award,
  CreditCard,
  Contact,
  Palette,
  QrCode,
  Bot,
  MessageSquare,
  Send,
  ArrowLeft,
  ArrowUp,
  Lock,
  Search,
  Copy,
  Volume2,
  VolumeX,
  Phone,
  Mail,
  User,
  Menu,
  Mic,
  Paperclip
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
} from "./types";
import AdminPanel from "./components/AdminPanel";
import ClientCabinet from "./components/ClientCabinet";
import { LandingAuthPanel } from "./components/LandingAuthPanel";
import OrderInquiryModal from "./components/OrderInquiryModal";
import OrderTrackPortal from "./components/OrderTrackPortal";
import { LuxuryNumericInput } from "./components/LuxuryNumericInput";
import DynamicProductCalculator from "./components/DynamicProductCalculator";
import { useTranslation, LocaleType } from "./locales/i18n";
import { Product3DViewer } from "./components/Product3DViewer";
import {
  clientCalculateBagsPrice,
  clientCalculateBoxesPrice,
  clientCalculateRibbonsPrice,
  clientCalculateStickersPrice,
  clientCalculateGiftCardsPrice,
  clientCalculateBusinessCardsPrice
} from "./clientCalculator";

const renderCategoryIcon = (iconName: string | undefined, fallbackId: string) => {
  const iconStyle = "w-10 h-10 stroke-[1.2]";
  const finalIcon = iconName || fallbackId;
  
  if (
    finalIcon.startsWith("http://") || 
    finalIcon.startsWith("https://") || 
    finalIcon.startsWith("/") || 
    finalIcon.startsWith("data:image")
  ) {
    return (
      <div 
        style={{
          maskImage: `url("${finalIcon}")`,
          WebkitMaskImage: `url("${finalIcon}")`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat"
        }}
        className="w-14 h-14 bg-current select-none pointer-events-none transition-all duration-300"
      />
    );
  }
  
  switch (finalIcon) {
    case "bags":
    case "ShoppingBag":
      return <ShoppingBag className={iconStyle} />;
    case "boxes":
    case "Package":
      return <Package className={iconStyle} />;
    case "ribbons":
    case "Scissors":
      return <Scissors className={iconStyle} />;
    case "stickers":
    case "Award":
      return <Award className={iconStyle} />;
    case "giftcards":
    case "CreditCard":
      return <CreditCard className={iconStyle} />;
    case "businesscards":
    case "Contact":
      return <Contact className={iconStyle} />;
    case "other_products":
    case "Palette":
      return <Palette className={iconStyle} />;
    case "qr_matrix":
    case "QrCode":
      return <QrCode className={iconStyle} />;
    case "Calculator":
      return <Calculator className={iconStyle} />;
    case "Sparkles":
      return <Sparkles className={iconStyle} />;
    case "Crown":
      return <Crown className={iconStyle} />;
    case "Box":
      return <Box className={iconStyle} />;
    case "Tag":
      return <Tag className={iconStyle} />;
    case "Gift":
      return <Gift className={iconStyle} />;
    case "Printer":
      return <Printer className={iconStyle} />;
    case "FileText":
      return <FileText className={iconStyle} />;
    case "Settings":
      return <Settings className={iconStyle} />;
    default:
      return <span className="text-4xl leading-none font-sans select-none">{finalIcon}</span>;
  }
};

const renderCategoryMiniIcon = (iconName: string | undefined, fallbackId: string) => {
  const iconStyle = "w-3.5 h-3.5 stroke-[1.8] shrink-0";
  const finalIcon = iconName || fallbackId;
  
  if (
    finalIcon && (
      finalIcon.startsWith("http://") || 
      finalIcon.startsWith("https://") || 
      finalIcon.startsWith("/") || 
      finalIcon.startsWith("data:image")
    )
  ) {
    return (
      <div 
        style={{
          maskImage: `url("${finalIcon}")`,
          WebkitMaskImage: `url("${finalIcon}")`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat"
        }}
        className="w-3.5 h-3.5 bg-current select-none pointer-events-none transition-all duration-300"
      />
    );
  }
  
  switch (finalIcon) {
    case "bags":
    case "ShoppingBag":
      return <ShoppingBag className={iconStyle} />;
    case "boxes":
    case "Package":
      return <Package className={iconStyle} />;
    case "ribbons":
    case "Scissors":
      return <Scissors className={iconStyle} />;
    case "stickers":
    case "Award":
      return <Award className={iconStyle} />;
    case "giftcards":
    case "CreditCard":
      return <CreditCard className={iconStyle} />;
    case "businesscards":
    case "Contact":
      return <Contact className={iconStyle} />;
    case "other_products":
    case "Palette":
      return <Palette className={iconStyle} />;
    case "qr_matrix":
    case "QrCode":
      return <QrCode className={iconStyle} />;
    default:
      return <span className="text-[10px] select-none leading-none">📦</span>;
  }
};

const FAQ_ITEMS = [
  {
    question: {
      hy: "Ինչպե՞ս ստանալ գնային առաջարկ",
      ru: "Как получить коммерческое предложение?",
      en: "How to get a price quote?",
      ar: "كيف تحصل على عرض سعر؟"
    },
    answer: {
      hy: "Կարող եք ուղարկել ձեր ցանկալի չափերը, քանակը, տպագրության տեսակը և օրինակները, իսկ մենք կպատրաստենք անհատական գնային առաջարկ։ Կամ օգտվել կայքի հաշվիչից և հաշված րոպեների ընթացքում ստանալ ձեր փաթեթավորման նախնական արժեքը։",
      ru: "Вы можете прислать интересующие вас размеры, тираж, тип печати и примеры, и мы подготовим индивидуальное предложение. Либо воспользуйтесь калькулятором на сайте и получите предварительную стоимость вашей упаковки за считанные минуты.",
      en: "You can send us your desired dimensions, quantity, printing type, and reference designs, and we will prepare a personalized price quote. Alternatively, you can use our built-in online calculator to get an estimated cost for your packaging within minutes.",
      ar: "يمكنك إرسال الأبعاد المطلوبة والكمية ونوع الطباعة والنماذج المرجعية، وسنقوم بإعداد عرض سعر مخصص لك. بدلاً من ذلك، يمكنك استخدام الآلة الحاسبة المدمجة على الموقع للحصول على تكلفة تقديرية لتغليفك في غضون دقائق."
    }
  },
  {
    question: {
      hy: "Ունե՞ք նվազագույն պատվերի քանակ",
      ru: "Есть ли минимальный объем заказа?",
      en: "Is there a minimum order quantity?",
      ar: "هل هناك حد أدنى لطلب الكمية؟"
    },
    answer: {
      hy: "Այո՛, որոշ արտադրատեսակների համար գործում է նվազագույն պատվերի քանակ, որը կախված է նյութից, չափից և տպագրության տեսակից։",
      ru: "Да, для некоторых видов продукции существует минимальный объем заказа, который зависит от выбранного материала, размера и технологии печати.",
      en: "Yes, certain products have a minimum order quantity (MOQ), which varies depending on the specific material, thickness, size, and printing details selected.",
      ar: "نعم، هناك حد أدنى لكمية الطلب (MOQ) لبعض المنتجات، ويختلف ذلك حسب المادة المحددة، الحجم، ونوع الطباعة."
    }
  },
  {
    question: {
      hy: "Որքա՞ն ժամանակ է պահանջվում պատվերի պատրաստման համար",
      ru: "Сколько времени занимает изготовление заказа?",
      en: "How long does it take to produce an order?",
      ar: "كم من الوقت يستгرق تجهيز الطلب؟"
    },
    answer: {
      hy: "Պատվերի ժամկետը կախված է նախագծի բարդությունից և քանակից։ Սովորաբար արտադրությունը տևում է 7–20 աշխատանքային օր։",
      ru: "Сроки изготовления зависят от сложности проекта и объема тиража. Обычно производство занимает от 7 до 20 рабочих дней.",
      en: "Production turnaround depends on the complexity and volume of the project. Generally, it takes between 7 to 20 business days.",
      ar: "يعتمد وقت الإنتاج على تعقيد المشروع وحجم الطلب. عادة ما يستغرق الإنتاج ما بين 7 إلى 20 يوم عمل."
    }
  },
  {
    question: {
      hy: "Արդյո՞ք իրականացնում եք առաքում",
      ru: "Осуществляете ли вы доставку?",
      en: "Do you provide delivery services?",
      ar: "هل تقدمون خدمات التوصيل؟"
    },
    answer: {
      hy: "Այո՛, իրականացնում ենք անվճար առաքում Երևանի տարածքում, իսկ մարզեր և միջազգային առաքումների դեպքում արժեքը հաշվարկվում է առանձին։",
      ru: "Да, мы предоставляем бесплатную доставку по Еревану. Доставка в регионы Армении, а также международная доставка рассчитываются индивидуально.",
      en: "Yes, we offer free shipping within Yerevan. Shipping to other regions of Armenia and international delivery rates are calculated separately.",
      ar: "نعم، نحن نقدم خدمة التوصيل المجاني داخل يريفان. أما بالنسبة للمناطق الأخرى أو الشحن الدولي، فإنه يتم احتساب التكلفة بشكل منفصل."
    }
  },
  {
    question: {
      hy: "Ի՞նչ նյութերով եք աշխատում",
      ru: "С какими материалами вы работаете?",
      en: "What materials do you work with?",
      ar: "ما هي المواد التي تعملون بها؟"
    },
    answer: {
      hy: "Աշխատում ենք բարձրորակ ստվարաթղթի, craft թղթի, դիզայներական թղթերի, տեքստիլի և այլ փաթեթավորման նյութերի հետ։",
      ru: "Мы работаем с высококачественным картоном, крафт-бумагой, дизайнерской бумагой различных фактур, текстилем и другими упаковочными материалами.",
      en: "We work with top-grade cardboard, eco-friendly kraft paper, high-end designer papers of various textures, textiles, and other premium packaging materials.",
      ar: "نحن نعمل مع ورق كرتون عالي الجودة، وورق كرافت صديق للبيئة، وأوراق تصميم متميزة، والمنسوجات ومواد التغليف الأخرى."
    }
  },
  {
    question: {
      hy: "Ի՞նչ տպագրության տեսակներ եք օգտագործում",
      ru: "Какие виды печати вы используете?",
      en: "What types of printing technologies do you use?",
      ar: "ما هي أنواع وفنون الطباعة التي تستخدمونها؟"
    },
    answer: {
      hy: "Կախված նախագծից՝ օգտագործում ենք\n• Օֆսեթ տպագրություն\n• UV տպագրություն\n• Մետաքսյա տպագրություն\n• Թվային տպագրություն\n• Տաք դրոշմում (foil stamping)\n• Լամինացիա և այլ հետտպագրական լուծումներ",
      ru: "В зависимости от проекта мы используем:\n• Офсетную печать\n• УФ-печать (UV)\n• Шелкографию (трафаретную печать)\n• Цифровую печать\n• Горячее тиснение фольгой (foil stamping)\n• Ламинацию и другие виды послепечатной обработки",
      en: "Depending on the project, we offer:\n• Offset printing\n• UV printing\n• Silk screen printing\n• Digital printing\n• Hot foil stamping\n• Lamination and other specialized post-printing finish solutions",
      ar: "اعتمادًا على طبيعة المشروع، نقدم:\n• طباعة الأوفست\n• طباعة الأشعة فوق البنفسجية (UV)\n• الطباعة الحريرية\n• الطباعة الرقمية\n• الختم الحراري بالورق المعدني (foil stamping)\n• التغليف والحلول المتخصصة الأخرى"
    }
  },
  {
    question: {
      hy: "Կարո՞ղ եմ նախապես տեսնել մակետը",
      ru: "Могу ли я предварительно увидеть макет?",
      en: "Can I preview the design layout beforehand?",
      ar: "هل يمكنني معاينة التخطيط مسبقًا؟"
    },
    answer: {
      hy: "Այո՛։ Նախքան արտադրությունը մենք տրամադրում ենք դիզայնի հաստատման մակետ, որպեսզի համոզվեք վերջնական արդյունքի մեջ։",
      ru: "Да. Перед запуском тиража в производство мы всегда предоставляем макет на утверждение, чтобы вы были уверены в конечном результате.",
      en: "Yes, absolutely. Before going into full-scale production, we always provide a digital pre-production layout proof for your final approval to guarantee accuracy.",
      ar: "نعم، بالتأكيد. قبل البدء في الإنتاج الكامل، نقوم دائمًا بتقديم نموذج مسبق للتصميم للموافقة عليه لضمان الدقة."
    }
  }
];

export default function App() {
  const { locale, setLocale, t, isRtl, formatNumber, formatPrice } = useTranslation();

  // ── INFRASTRUCTURE STATES ──────────────────────────────────────
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [finishes, setFinishes] = useState<Finish[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [papers, setPapers] = useState<PaperType[]>([]);
  const [printingMethods, setPrintingMethods] = useState<any[]>([]);
  const [contactSettings, setContactSettings] = useState<ContactSettings>({ whatsapp: "37499218090", email: "order@capsule.am" });
  const [pricingRules, setPricingRules] = useState<PricingRules | null>(null);
  const [decorativeRules, setDecorativeRules] = useState<PricingRules | null>(null);
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [siteTexts, setSiteTexts] = useState<Record<string, string>>({});
  const [submissions, setSubmissions] = useState<OrderSubmission[]>([]);
  const [bagRibbonHandles, setBagRibbonHandles] = useState<BagRibbonHandle[]>([]);
  const [aiSettings, setAiSettings] = useState<AISettings>({
    systemPrompt: "",
    temperature: 0.1,
    modelName: "gemini-3.5-flash",
    enabled: true
  });
  const [activeCategory, setActiveCategory] = useState<string>("");
  const categoryTabsRef = useRef<HTMLDivElement>(null);
  const lastActiveCategoryRef = useRef<string>("");
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [hasScrollableTabs, setHasScrollableTabs] = useState<boolean>(false);

  // ── AI ASSISTANT CLIENT STATES ──────────────────────────────────
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [assistantMessages, setAssistantMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Ողջույն! Ես Capsule Concept-ի փաթեթավորման և տպագրության պաշտոնական AI օգնականն եմ։ Կարող եմ Ձեզ խորհրդատվություն տալ տոպրակների, տուփերի, սթիքերների, այցեքարտերի կամ ժապավենների նյութերի, լամինացիայի, չափսերի և տպագրական տեխնիկաների վերաբերյալ։ Ինչպե՞ս կարող եմ օգնել։" }
  ]);
  const [assistantInput, setAssistantInput] = useState<string>("");
  const [isAssistantTyping, setIsAssistantTyping] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Compact Dropdown Language Switcher States
  const [isLangMenuOpen, setIsLangMenuOpen] = useState<boolean>(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Luxury Currency Switcher and Header Search States
  const [activeCurrency, setActiveCurrency] = useState<"AMD" | "USD" | "RUB">("AMD");
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState<boolean>(false);
  const [isHeaderSearchOpen, setIsHeaderSearchOpen] = useState<boolean>(false);
  const currencyMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(event.target as Node)) {
        setIsCurrencyMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Contact Message Form States
  const [contactName, setContactName] = useState<string>("");
  const [contactInfo, setContactInfo] = useState<string>("");
  const [contactMessage, setContactMessage] = useState<string>("");
  const [isSendingMsg, setIsSendingMsg] = useState<boolean>(false);
  const [msgSentSuccess, setMsgSentSuccess] = useState<boolean>(false);
  
  // FAQ active element state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSendContactMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactInfo.trim() || !contactMessage.trim()) {
      alert(locale === "hy" ? "Խնդրում ենք լրացնել բոլոր դաշտերը։" : 
            locale === "ru" ? "Пожалуйста, заполните все поля." : 
            locale === "ar" ? "يرجى ملء جميع الحقول." : 
            "Please fill in all fields.");
      return;
    }

    setIsSendingMsg(true);
    try {
      // 1. Log with backend
      await fetch("/api/contact-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          contact: contactInfo,
          message: contactMessage
        })
      });

      // 2. Format mailto
      const subject = `Capsule Contact: ${contactName}`;
      const body = `Name/Brand: ${contactName}\nContact: ${contactInfo}\n\nMessage:\n${contactMessage}`;
      const mailtoUrl = `mailto:${contactSettings.email || "order@capsule.am"}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Open default email composer
      window.location.href = mailtoUrl;

      setMsgSentSuccess(true);
      setContactName("");
      setContactInfo("");
      setContactMessage("");

      // Automatically clear success state
      setTimeout(() => {
        setMsgSentSuccess(false);
      }, 8000);
    } catch (err) {
      console.error("Failed to post message", err);
    } finally {
      setIsSendingMsg(false);
    }
  };

  // Auto scroll
  const homepageChatEndRef = useRef<HTMLDivElement>(null);
  const [homepageAssistantInput, setHomepageAssistantInput] = useState<string>("");
  const [isEmbeddedAiExpanded, setIsEmbeddedAiExpanded] = useState<boolean>(true);

  // ── NEUMORPHIC INTERACTIVE UI STATES ──
  const [neumorphicActiveTab, setNeumorphicActiveTab] = useState<"ai_chat" | "signup">("signup");
  const [neumorphicEmail, setNeumorphicEmail] = useState<string>("");
  const [neumorphicPassword, setNeumorphicPassword] = useState<string>("");
  const [landingAuthMode, setLandingAuthMode] = useState<"login" | "signup">("login");
  const [landingAuthName, setLandingAuthName] = useState<string>("");
  const [landingAuthRole, setLandingAuthRole] = useState<"Client" | "Partner">("Client");
  const [landingAuthLoading, setLandingAuthLoading] = useState<boolean>(false);
  const [neumorphicSearchInput, setNeumorphicSearchInput] = useState<string>("");
  const [neumorphicSettingsOpen, setNeumorphicSettingsOpen] = useState<boolean>(false);
  const [neumorphicVolume, setNeumorphicVolume] = useState<boolean>(true);
  const [savedItemsCount, setSavedItemsCount] = useState<number>(2);
  const [showBookmarkToast, setShowBookmarkToast] = useState<boolean>(false);
  const [bookmarkToastText, setBookmarkToastText] = useState<string>("");
  const [signUpSuccessMessage, setSignUpSuccessMessage] = useState<string>("");
  const [isConsoleActivated, setIsConsoleActivated] = useState<boolean>(false);

  const activeTemplate = categories.find(c => c.id === activeCategory)?.template || activeCategory;
  const [calcTab, setCalcTab] = useState<"select" | "custom" | "table">("select");
  const [loading, setLoading] = useState<boolean>(true);

  // States for standard calculators
  const [selectedPaperId, setSelectedPaperId] = useState<string>("");
  const [gsm, setGsm] = useState<number>(210);
  const [lamination, setLamination] = useState<"matte" | "gloss" | "soft_touch" | "none" | "">("");
  const [handle, setHandle] = useState<"cord" | "ribbon" | "">("");
  const [ribbonWidthPrice, setRibbonWidthPrice] = useState<number>(55);
  const ribbonWidths = [
    { id: "rw_1_5", widthCm: 1.5, label: "1.5 սմ", price: 55 },
    { id: "rw_2_0", widthCm: 2.0, label: "2.0 սմ", price: 75 },
    { id: "rw_2_5", widthCm: 2.5, label: "2.5 սմ", price: 95 },
    { id: "rw_3_0", widthCm: 3.0, label: "3.0 սմ", price: 120 }
  ];
  const activeRibbonObj = ribbonWidths.find((r) => r.price === ribbonWidthPrice) || ribbonWidths[0];
  const activeRibLabel = activeRibbonObj.label;
  const currentRibbonWidthCm = activeRibbonObj.widthCm;

  const [colors, setColors] = useState<number>(0);
  const [sides, setSides] = useState<number>(0);
  const [method, setMethod] = useState<string>("");
  const [design, setDesign] = useState<"ready" | "help" | "">("");
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(-1);
  const [qty, setQty] = useState<number>(0);

  // Custom dimensions states
  const [custW, setCustW] = useState<string>("20");
  const [custH, setCustH] = useState<string>("25");
  const [custD, setCustD] = useState<string>("8");
  const [custQty, setCustQty] = useState<number>(0);

  // Results & Errors states
  const [calcResult, setCalcResult] = useState<any>(null);
  const [calcError, setCalcError] = useState<string | null>(null);
  const [bulkMatrix, setBulkMatrix] = useState<any[]>([]);
  const [bulkLoading, setBulkLoading] = useState<boolean>(false);

  // Promo coupon code states
  const [promoInput, setPromoInput] = useState<string>("");
  const [appliedPromo, setAppliedPromo] = useState<string>("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // ── BUNDLE / KIT BUILDER STATE ──────────────────────────────
  const [bundleItems, setBundleItems] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("cc_bundle_items");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isInTrackPortal, setIsInTrackPortal] = useState(() => {
    return window.location.pathname === "/track-order";
  });
  const [submittedTrackData, setSubmittedTrackData] = useState<{ id: string; trackingCode: string; phone: string } | null>(null);

  // ── CLIENT CABINET PORTAL STATES ─────────────────────────────────
  const [isClientCabinetOpen, setIsClientCabinetOpen] = useState(false);
  const [partnerDiscount, setPartnerDiscount] = useState<number>(0);
  const [userEmail, setUserEmail] = useState<string>("");
  const [cabinetInitialTab, setCabinetInitialTab] = useState<string | undefined>(undefined);
  const [cabinetInitialAuthTab, setCabinetInitialAuthTab] = useState<"login" | "register" | undefined>(undefined);
  const [isDrawerMenuOpen, setIsDrawerMenuOpen] = useState(false);
  const [isDrawerCatalogOpen, setIsDrawerCatalogOpen] = useState(false);

  const openClientCabinetWithTab = (tab: string) => {
    setCabinetInitialTab(tab);
    setCabinetInitialAuthTab(undefined);
    setIsClientCabinetOpen(true);
  };

  const openClientCabinetWithAuth = (authTab: "login" | "register") => {
    setCabinetInitialTab(undefined);
    setCabinetInitialAuthTab(authTab);
    setIsClientCabinetOpen(true);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cc_client_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          setUserEmail(parsed.email);
          if (parsed.role === "Partner") {
            setPartnerDiscount(Number(parsed.partnerDiscount) || 15.0);
          } else {
            setPartnerDiscount(0);
          }
        }
      } else {
        // If logged out externally
        setUserEmail("");
        setPartnerDiscount(0);
      }
    } catch (e) {
      console.error("Local storage lookup failed", e);
    }
  }, [isClientCabinetOpen, isDrawerMenuOpen]);

  const handleSaveToCabinet = async () => {
    if (!calcResult) return;
    if (!userEmail) {
      alert(locale === "hy" 
        ? "Խնդրում ենք մուտք գործել Լիչնի Կաբինետ՝ հաշվարկը պահպանելու համար:" 
        : locale === "ru"
          ? "Пожалуйста, войдите в личный кабинет, чтобы сохранить этот расчёт."
          : "Please log in to your Client Cabinet to save this calculation.");
      setIsClientCabinetOpen(true);
      return;
    }
    const defaultName = `${calcResult.itemName} (${new Date().toLocaleDateString()})`;
    const userInput = prompt(
      locale === "hy"
        ? "Մուտքագրեք անվանում հաշվարկի համար."
        : locale === "ru"
          ? "Введите название для сохраняемого расчёта:"
          : "Enter a name for this saved calculation:",
      defaultName
    );
    if (userInput === null) return;
    const finalName = userInput.trim() || defaultName;

    try {
      const res = await fetch("/api/client/save-calculation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          name: finalName,
          categoryId: activeCategory,
          calcResult,
          customInputs: {}
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(locale === "hy"
          ? "Հաշվարկը հաջողությամբ պահպանվեց Լիչնի Կաբինետում:"
          : locale === "ru"
            ? "Успешно сохранено в личном кабинете!"
            : "Successfully saved to your personal cabinet!");
      } else {
        alert(data.error || "Failed to save calculation.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving calculation.");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedCalcId = params.get("sharedCalc");
    if (sharedCalcId) {
      fetch(`/api/client/shared-calculation/${sharedCalcId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.config) {
            const calc = data.config;
            setActiveCategory(calc.categoryId);
            setCalcResult(calc.calcResult);
            alert(locale === "hy" 
              ? `Հաջողությամբ բեռնվեց կիսված հաշվարկը՝ "${calc.name}"` 
              : `Успешно загружен общий расчёт: "${calc.name}"`);
            const newUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
          }
        })
        .catch(err => console.error("Could not fetch shared calculation:", err));
    }
  }, [locale]);

  useEffect(() => {
    localStorage.setItem("cc_bundle_items", JSON.stringify(bundleItems));
  }, [bundleItems]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleTabsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const maxScroll = target.scrollWidth - target.clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(target.scrollLeft / maxScroll);
      setHasScrollableTabs(true);
    } else {
      setHasScrollableTabs(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (categoryTabsRef.current) {
        const target = categoryTabsRef.current;
        const maxScroll = target.scrollWidth - target.clientWidth;
        setHasScrollableTabs(maxScroll > 0);
        if (maxScroll > 0) {
          setScrollProgress(target.scrollLeft / maxScroll);
        }
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [categories, activeCategory]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (homepageChatEndRef.current) {
      homepageChatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [assistantMessages, isAssistantTyping]);

  useEffect(() => {
    const handlePopState = () => {
      setIsInTrackPortal(window.location.pathname === "/track-order");
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigateToTrackPortal = () => {
    window.history.pushState({}, "", "/track-order");
    setIsInTrackPortal(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToHomeFromPortal = () => {
    window.history.pushState({}, "", "/");
    setIsInTrackPortal(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReorder = (order: any) => {
    if (!order) return;
    const cat = order.type || "bags";
    setActiveCategory(cat);
    
    if (cat === "bags") {
      setQty(order.qty || 100);
    } else if (cat === "boxes") {
      setBoxQty(order.qty || 100);
    } else if (cat === "ribbons") {
      setRibbonMeters(order.qty || 100);
    } else if (cat === "stickers") {
      setStickerQty(order.qty || 100);
    } else if (cat === "giftcards") {
      setGiftCardQty(order.qty || 100);
    } else if (cat === "businesscards") {
      setBusinessCardQty(order.qty || 100);
    } else if (cat === "other") {
      setOtherProductQty(order.qty || 100);
    } else if (cat === "qrmatrix") {
      setQrMatrixQty(order.qty || 100);
    }

    window.history.pushState({}, "", "/");
    setIsInTrackPortal(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSendAssistantMessage = async (customText?: string) => {
    const textToSend = customText || assistantInput;
    if (!textToSend.trim()) return;

    const updatedMessages = [...assistantMessages, { role: "user" as const, text: textToSend }];
    setAssistantMessages(updatedMessages);
    setAssistantInput("");
    setHomepageAssistantInput("");
    setIsAssistantTyping(true);

    // Smart auto promo-code scanner inside AI Chat
    let foundPromo: any = null;
    const trimmedUpperClean = textToSend.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
    const directMatch = discountCodes.find(d => d.code.toUpperCase() === trimmedUpperClean && d.active);
    if (directMatch) {
      foundPromo = directMatch;
    } else {
      const words = textToSend.toUpperCase().split(/[\s,՝.\n;:!?()[\]{}]+/);
      for (const word of words) {
        const cleaned = word.replace(/[^A-Z0-9-]/g, "");
        if (cleaned.length >= 3) {
          const matched = discountCodes.find(d => d.code.toUpperCase() === cleaned && d.active);
          if (matched) {
            foundPromo = matched;
            break;
          }
        }
      }
    }

    if (foundPromo) {
      await new Promise(resolve => setTimeout(resolve, 600));
      handleApplyCartPromo(foundPromo.code);
      if (calcResult) {
        setPromoInput(foundPromo.code);
        setTimeout(() => {
          handleApplyCoupon();
        }, 80);
      }
      setPromoSuccess(`${t("cart.applied", "Կիարռված է")}՝ ${foundPromo.code}`);
      const discountText = foundPromo.type === "percentage" ? foundPromo.value + "%" : formatPrice(foundPromo.value);
      const successReply = {
        role: "assistant" as const,
        text: t("assistant.promo_success", "🎟️ **{{code}}** պրոմո-կոդը հաջողությամբ կիրառվեց հենց այստեղից։ Զամբյուղի բոլոր հարմար ապրանքների արժեքը վերահաշվարկվել է {{discount}} զեղչով։")
          .replace("{{code}}", foundPromo.code)
          .replace("{{discount}}", discountText)
      };
      setAssistantMessages(prev => [...prev, successReply]);
      setIsAssistantTyping(false);
      return;
    }

    try {
      const response = await fetch("/api/chat-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, locale }),
      });
      const data = await response.json();
      if (data.success) {
        const fullResponseText = data.text;
        // Append an empty assistant message first
        setAssistantMessages(prev => [...prev, { role: "assistant", text: "" }]);
        
        // Split text into words to render them separately/gradually
        const words = fullResponseText.split(" ");
        let currentText = "";
        let wordIndex = 0;
        
        const typingInterval = setInterval(() => {
          if (wordIndex < words.length) {
            currentText += (wordIndex === 0 ? "" : " ") + words[wordIndex];
            setAssistantMessages(prev => {
              const copy = [...prev];
              if (copy.length > 0) {
                copy[copy.length - 1] = { role: "assistant", text: currentText };
              }
              return copy;
            });
            wordIndex++;
            // Smoothly scroll down as new words appear
            setTimeout(() => {
              homepageChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 10);
          } else {
            clearInterval(typingInterval);
          }
        }, 32); // Snappy, premium 32ms per word
      } else {
        setAssistantMessages(prev => [...prev, { role: "assistant", text: t("assistant.error_system", "Ներեցեք, համակարգային սխալ տեղի ունեցավ։ Խնդրում եմ կրկին փորձել կամ գրել մեզ WhatsApp-ով։") }]);
      }
    } catch (err) {
      setAssistantMessages(prev => [...prev, { role: "assistant", text: t("assistant.error_connection", "Կապի խնդիր տեղի ունեցավ։ Խնդրում եմ ստուգել ինտերնետ կապը:") }]);
    } finally {
      setIsAssistantTyping(false);
    }
  };

  const formatAssistantMessageText = (text: string) => {
    return text.split("\n").map((line, idx) => {
      let content = line;
      // Bold markdown format replacement
      const boldRegex = /\*\*(.*?)\*\*/g;
      let match;
      const parts = [];
      let lastIndex = 0;
      while ((match = boldRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
          parts.push(content.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-semibold text-capsule-accent">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
      }

      const isBulletPoint = line.trim().startsWith("•") || line.trim().startsWith("-");
      const cleanParts = parts.length > 0 ? parts : [content];

      if (isBulletPoint) {
        const displayLine = line.trim().replace(/^[•-]\s*/, "");
        // Resolve strong elements inside list lines if any
        let liContent = displayLine;
        const liParts = [];
        let liLastIndex = 0;
        boldRegex.lastIndex = 0; // reset regex
        while ((match = boldRegex.exec(liContent)) !== null) {
          if (match.index > liLastIndex) {
            liParts.push(liContent.substring(liLastIndex, match.index));
          }
          liParts.push(<strong key={match.index} className="font-semibold text-capsule-accent">{match[1]}</strong>);
          liLastIndex = boldRegex.lastIndex;
        }
        if (liLastIndex < liContent.length) {
          liParts.push(liContent.substring(liLastIndex));
        }
        return (
          <li key={idx} className="ml-4 list-disc text-xs leading-relaxed my-0.5 text-capsule-text">
            {liParts.length > 0 ? liParts : displayLine}
          </li>
        );
      }
      return (
        <p key={idx} className="text-xs leading-relaxed min-h-[0.8em] my-1 text-capsule-text">
          {cleanParts}
        </p>
      );
    });
  };

  const formatColorsLabel = (val: number) => {
    if (val === 1) return t("colors.monochrome_desc", "Մոնոքրոմ (Սև-Սպիտակ)");
    if (val === 2) return t("colors.pantone_desc", "Պանտոն (2 Գույն)");
    if (val === 4) return t("colors.cmyk_desc", "CMYK (Լիագույն)");
    if (val === 5) return t("colors.complex_desc", "CMYK + Pantone (Պրեմիում)");
    return `${val} ${t("common.colors", "գույն")}`;
  };

  const getSingleItemDetails = (catId: string, result: any, pld?: any) => {
    if (!result) return "";
    let desc = "";
    const p = pld || {};
    if (catId === "bags") {
      const pHandle = p.handle !== undefined ? p.handle : handle;
      const ribbonWidthText = pHandle === "ribbon" ? ` (${activeRibLabel})` : "";
      const handleText = pHandle === "cord" 
        ? t("options.handle_cord", "Շնուր") 
        : `${t("options.handle_ribbon", "Սատինե Ժապավեն")}${ribbonWidthText ? ribbonWidthText.replace("սմ", t("common.units.cm", "սմ")) : ""}`;
      const pLamination = p.lamination !== undefined ? p.lamination : lamination;
      const lamText = pLamination === "matte" 
        ? t("options.lamination_matte", "Փայլատ") 
        : pLamination === "gloss" 
          ? t("options.lamination_gloss", "Փայլուն") 
          : pLamination === "soft_touch" 
            ? t("options.lamination_soft_touch", "Soft-Touch") 
            : t("options.lamination_none", "Առանց լամինացիայի");
      const pGsm = p.gsm !== undefined ? p.gsm : gsm;
      const pColors = p.colors !== undefined ? p.colors : colors;
      const pSides = p.sides !== undefined ? p.sides : sides;
      const pFinishes = p.finishes !== undefined ? p.finishes : selectedFinishes;
      
      const finishesTranslated = pFinishes.map((k: string) => {
        const fObj = finishes.find(f => f.key === k);
        return fObj ? t(`db.finish.${fObj.key}`, fObj.label) : "";
      }).filter(Boolean).join(", ") || t("common.none", "Չկան");

      const dimsLabel = t("common.dimensions", "Չափսեր");
      const qtyLabel = t("common.qty_label", "Քանակ");
      const densityLabel = t("common.density", "Խտություն");
      const printLabel = t("common.printing", "Տպագրություն");
      const sidesLabel = t("common.sides", "կողմ");
      const handleLabel = t("common.handle", "Բռնակ");
      const finishesLabel = t("common.finishes", "Մշակումներ");
      const methodLabel = t("common.print_method", "Տպագրության Մեթոդ");
      const printMethodKey = result.printingMethodUsed === "offset" ? "print_method_offset" : result.printingMethodUsed === "digital" ? "print_method_digital" : result.printingMethodUsed === "silkscreen" ? "print_method_silkscreen" : result.printingMethodUsed === "flexo" ? "print_method_flexo" : result.printingMethodUsed === "foil" ? "print_method_foil" : "";
      const methodVal = printMethodKey ? t(`options.${printMethodKey}`, result.printingMethodUsed) : result.printingMethodUsed;
      
      desc = `${dimsLabel}: ${result.dimensionsText} ${t("common.units.cm", "սմ")}\n${qtyLabel}: ${formatNumber(result.qty)} ${t("common.units.pcs", "հատ")}\n${densityLabel}: ${pGsm}g/m² (${lamText})\n${printLabel}: ${formatColorsLabel(pColors)} (${pSides} ${sidesLabel})\n${handleLabel}: ${handleText}\n${finishesLabel}: ${finishesTranslated}\n${methodLabel}: ${methodVal}`;
    } else if (catId === "boxes") {
      const lamText = result.lamination === "matte" 
        ? t("options.lamination_matte", "Փայլատ") 
        : result.lamination === "gloss" 
          ? t("options.lamination_gloss", "Փայլուն") 
          : result.lamination === "soft_touch" 
            ? t("options.lamination_soft_touch", "Soft-touch") 
            : t("options.lamination_none", "Առանց լամինացիայի");
      const pFinishes = p.finishes !== undefined ? p.finishes : boxFinishes;
      const finishesTranslated = pFinishes.length > 0 
        ? pFinishes.map((k: string) => {
            const fObj = finishes.find(f => f.key === k || f.id === k);
            return fObj ? t(`db.finish.${fObj.key}`, fObj.label) : "";
          }).filter(Boolean).join(", ")
        : t("common.none", "Չկան");
        
      const thickText = result.wallThickness !== undefined ? `\n${t("common.wall_thickness", "Պատերի Հաստություն")}: ${result.wallThickness} ${t("common.units.mm", "մմ")}` : "";
      
      const materialVal = result.materialType === "rigid" 
        ? t("db.paper.rigid", "Rigid premium (Կոշտ)") 
        : result.materialType === "kraft" 
          ? t("db.paper.kraft", "Էկո Կրաֆտ") 
          : t("db.paper.standard", "Cardboard (Ստվարաթուղթ)");

      const dimsLabel = t("common.dimensions", "Չափսեր");
      const qtyLabel = t("common.qty_label", "Քանակ");
      const materialLabel = t("common.material", "Նյութը");
      const lamLabel = t("common.lamination", "Լամինացիա");
      const printLabel = t("common.printing", "Տպագրություն");
      const finishesLabel = t("common.finishes", "Մշակումներ");
      const methodLabel = t("common.print_method", "Տպագրության Մեթոդ");
      const printMethodKey = result.printingMethodUsed === "offset" ? "print_method_offset" : result.printingMethodUsed === "digital" ? "print_method_digital" : result.printingMethodUsed === "silkscreen" ? "print_method_silkscreen" : result.printingMethodUsed === "flexo" ? "print_method_flexo" : result.printingMethodUsed === "foil" ? "print_method_foil" : "";
      const methodVal = printMethodKey ? t(`options.${printMethodKey}`, result.printingMethodUsed) : result.printingMethodUsed;
      
      desc = `${dimsLabel}: ${result.dimensionsText} ${t("common.units.cm", "սմ")}\n${qtyLabel}: ${formatNumber(result.qty)} ${t("common.units.pcs", "հատ")}\n${materialLabel}: ${materialVal}${thickText}\n${lamLabel}: ${lamText}\n${printLabel}: ${formatColorsLabel(result.colors)}\n${finishesLabel}: ${finishesTranslated}\n${methodLabel}: ${methodVal}`;
    } else {
      const isRibbons = catId === "ribbons";
      const unitText = isRibbons ? t("common.units.meters", "մետր") : t("common.units.pcs", "հատ");
      const materialVal = result.materialType ? t(`db.paper.${result.materialType}`, result.materialType) : "---";
      
      desc = `${t("common.dimensions", "Չափսեր")}: ${result.dimensionsText || "---"} ${t("common.units.cm", "սմ")}\n${t("common.qty_label", "Քանակ")}: ${formatNumber(result.qty || 100)} ${unitText}\n${t("common.material", "Նյութը")}: ${materialVal}`;
      
      if (catId === "ribbons") {
        const ribbonTypeVal = result.type === "reps" ? t("options.ribbon_reps", "Ռեպսե") : t("options.ribbon_satin", "Սատինե");
        const printColorVal = result.printColor === "foil_gold" 
          ? t("options.print_color_gold_foil", "Ոսկեգույն Ֆոյլ") 
          : result.printColor === "foil_silver" 
            ? t("options.print_color_silver_foil", "Արծաթագույն Ֆոյլ") 
            : t("options.print_color_silkscreen", "Մաքուր Մետաքսատպություն");
            
        desc += `\n- ${t("common.ribbon_width", "Լայնություն")}: ${result.width || "---"} ${t("common.units.cm", "սմ")}\n- ${t("common.ribbon_type", "Տիպ")}: ${ribbonTypeVal}\n- ${t("common.printing", "Տպագրություն")}: ${printColorVal}`;
      } else if (catId === "stickers") {
        const pColors = p.colors !== undefined ? p.colors : stickerColors;
        const stickerShapeVal = result.shape === "circle" 
          ? t("options.shape_circle", "Կլոր") 
          : result.shape === "rectangle" 
            ? t("options.shape_square", "Ուղղանկյուն") 
            : t("options.shape_custom", "Ձևավոր / Կոնտուրային");
        desc += `\n- ${t("common.sticker_shape", "Ձև")}: ${stickerShapeVal}\n- ${t("common.material", "Նյութ")}: ${materialVal}\n- ${t("common.printing", "Տպագրություն")}: ${formatColorsLabel(pColors)}`;
      } else if (catId === "giftcards") {
        const pColors = p.colors !== undefined ? p.colors : giftCardColors;
        const envelopeVal = result.envelope === "none" 
          ? t("options.envelope_none", "Առանց ծրարի") 
          : result.envelope === "standard_white" 
            ? t("options.envelope_standard_white", "Սպիտակ ծրար") 
            : result.envelope === "kraft" 
              ? t("options.envelope_kraft", "Կրաֆտ ծրար") 
              : t("options.envelope_colored_premium", "Գունավոր պրեմիում ծրար");
        desc += `\n- ${t("common.envelope", "Ծրար")}: ${envelopeVal}\n- ${t("common.paper", "Թուղթ")}: ${materialVal}\n- ${t("common.printing", "Տպագրություն")}: ${formatColorsLabel(pColors)}`;
      } else if (catId === "businesscards") {
        const pColors = p.colors !== undefined ? p.colors : businessCardColors;
        const cornersVal = result.corners === "rounded" ? t("options.corners_rounded", "Կլորացված") : t("options.corners_straight", "Ուղիղ");
        desc += `\n- ${t("common.sides", "Կողմեր")}: ${result.sides === 2 ? t("options.sides_2", "Երկկողմանի") : t("options.sides_1", "Միակողմանի")}\n- ${t("common.corners", "Անկյուններ")}: ${cornersVal}\n- ${t("common.paper", "Թուղթ")}: ${materialVal}\n- ${t("common.printing", "Տպագրություն")}: ${formatColorsLabel(pColors)}`;
      } else if (catId === "other_products" || catId === "qr_matrix") {
        const itemNotes = catId === "other_products" 
          ? (p.notes !== undefined ? p.notes : otherProductNotes)
          : (p.notes !== undefined ? p.notes : qrMatrixNotes);
        desc += `\n- ${t("common.notes", "Նշումներ")}: ${itemNotes || t("common.none", "Չկան")}`;
      } else {
        // Built-in categories are "bags", "boxes", "ribbons", "stickers", "giftcards", "businesscards", "other_products", "qr_matrix"
        // Any other category ID is a dynamically generated category
        desc += `\n- ${t("common.dimensions", "Չափսեր (սմ)")}: ${result.dimensionsText || "---"}\n- ${t("common.material_type", "Պարամետրեր")}: ${result.materialType || "---"}`;
        if (result.detailsText) {
          desc += `\n- ${t("common.details", "Մանրամասներ")}: ${result.detailsText}`;
        }
      }
    }
    return desc;
  };

  const handleAddItemToBundle = (catId: string) => {
    if (!calcResult) return;
    const catName = categories.find(c => c.id === catId)?.navLabel || categories.find(c => c.id === catId)?.name || catId;
    
    // Core payload recreation for the cart item
    let payload: any = {};
    if (catId === "boxes") {
      const isCustomBox = selectedBoxItemId === "custom";
      payload = {
        productKey: "boxes",
        itemId: selectedBoxItemId,
        qty: boxQty,
        lamination: boxLamination,
        colors: boxColors,
        paperId: boxPaperId,
        method: boxPrintingMethod,
        boxStyle: boxStyle,
        wallThickness: boxWallThickness,
        finishes: [...boxFinishes],
        appliedDiscountCode: appliedPromo || undefined
      };
      if (isCustomBox) {
        payload.w = parseFloat(boxLength);
        payload.h = parseFloat(boxWidth);
        payload.d = parseFloat(boxHeight);
      }
    } else if (catId === "ribbons") {
      payload = {
        productKey: "ribbons",
        width: ribbonWidth,
        ribbonType: ribbonType,
        printColor: ribbonPrintColor,
        meters: ribbonMeters,
        appliedDiscountCode: appliedPromo || undefined
      };
    } else if (catId === "stickers") {
      payload = {
        productKey: "stickers",
        shape: stickerShape,
        width: stickerWidth,
        height: stickerHeight,
        material: stickerMaterial,
        qty: stickerQty,
        colors: stickerColors,
        appliedDiscountCode: appliedPromo || undefined
      };
    } else if (catId === "giftcards") {
      payload = {
        productKey: "giftcards",
        size: giftCardSize,
        envelope: giftCardEnvelope,
        paper: giftCardPaper,
        qty: giftCardQty,
        colors: giftCardColors,
        finishes: [...giftCardFinishes],
        appliedDiscountCode: appliedPromo || undefined
      };
    } else if (catId === "businesscards") {
      payload = {
        productKey: "businesscards",
        size: businessCardSize,
        paper: businessCardPaper,
        sides: businessCardSides,
        corners: businessCardCorners,
        qty: businessCardQty,
        colors: businessCardColors,
        finishes: [...businessCardFinishes],
        appliedDiscountCode: appliedPromo || undefined
      };
    } else if (catId === "other_products") {
      payload = {
        productKey: "other_products",
        itemId: selectedOtherProductId,
        qty: otherProductQty,
        notes: otherProductNotes,
        appliedDiscountCode: appliedPromo || undefined
      };
    } else if (catId === "qr_matrix") {
      payload = {
        productKey: "qr_matrix",
        itemId: selectedQrMatrixId,
        qty: qrMatrixQty,
        notes: qrMatrixNotes,
        appliedDiscountCode: appliedPromo || undefined
      };
    } else if (!["bags", "boxes", "ribbons", "stickers", "giftcards", "businesscards", "other_products", "qr_matrix"].includes(catId)) {
      payload = {
        productKey: catId,
        isDynamicCategory: true,
        qty: calcResult.qty,
        dimensionsText: calcResult.dimensionsText,
        materialType: calcResult.materialType,
        detailsText: calcResult.detailsText,
        appliedDiscountCode: appliedPromo || undefined
      };
    } else {
      const isCustomBag = calcTab === "custom";
      payload = {
        productKey: catId,
        paperId: selectedPaperId,
        gsm,
        lamination,
        handle,
        ribbonWidthPrice,
        colors,
        sides,
        method,
        design,
        finishes: [...selectedFinishes],
        qty: isCustomBag ? custQty : qty,
        appliedDiscountCode: appliedPromo || undefined
      };
      if (isCustomBag) {
        payload.w = parseFloat(custW);
        payload.h = parseFloat(custH);
        payload.d = parseFloat(custD) || 0;
      } else {
        payload.sizeIndex = selectedSizeIndex;
      }
    }

    const desc = getSingleItemDetails(catId, calcResult, payload);
    const newItem = {
      id: `bundle_${Date.now()}`,
      catId,
      catName,
      itemName: calcResult.itemName || "Անհատական պատվեր",
      qty: calcResult.qty,
      isMeters: catId === "ribbons",
      unitPrice: calcResult.unitPrice,
      totalPrice: calcResult.totalPrice,
      dimensionsText: calcResult.dimensionsText || "",
      description: desc,
      icon: categories.find(c => c.id === catId)?.icon || "📦",
      payload,
      calcResult
    };

    setBundleItems(prev => [...prev, newItem]);
    
    setSuccessMessage(`«${newItem.itemName}» հաջողությամբ ավելացվել է ձեր զամբյուղին:`);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4500);
  };

  const handleRemoveBundleItem = (id: string) => {
    setBundleItems(prev => prev.filter(item => item.id !== id));
  };
  
  const handleClearBundle = () => {
    setShowClearConfirm(true);
  };

  const handleClearTray = () => {
    setShowClearConfirm(true);
  };

  const handleConfirmClearCart = () => {
    setBundleItems([]);
    setIsCartOpen(false);
    setShowClearConfirm(false);
  };

  const handleUpdateCartItemQty = (id: string, newQty: number) => {
    if (newQty <= 0) return;
    
    const item = bundleItems.find(it => it.id === id);
    if (!item) return;

    if (!pricingRules) return;

    const localDb = {
      categories,
      products,
      dimensions,
      finishes,
      pricingRules,
      decorativeBagsPricingRules: decorativeRules,
      papers,
      printingMethods,
      tiers,
      discountCodes,
      bagRibbonHandles
    };

    const updatedPayload = item.payload ? { ...item.payload } : {};
    
    if (item.catId === "ribbons") {
      updatedPayload.meters = newQty;
    } else {
      updatedPayload.qty = newQty;
    }

    let localResult: any = null;
    try {
      if (item.catId === "boxes") {
        localResult = clientCalculateBoxesPrice(updatedPayload, localDb);
      } else if (item.catId === "ribbons") {
        localResult = clientCalculateRibbonsPrice(updatedPayload, localDb);
      } else if (item.catId === "stickers") {
        localResult = clientCalculateStickersPrice(updatedPayload, localDb);
      } else if (item.catId === "giftcards") {
        localResult = clientCalculateGiftCardsPrice(updatedPayload, localDb);
      } else if (item.catId === "businesscards") {
        localResult = clientCalculateBusinessCardsPrice(updatedPayload, localDb);
      } else if (item.catId === "other_products") {
        const itemsList = products
          .filter(p => p.categoryId === "other_products")
          .flatMap(p => p.items || []);
        const matchedItem = itemsList.find(it => it.id === updatedPayload.itemId);
        if (matchedItem) {
          const rawItemPrice = matchedItem.price * newQty;
          let finalPrice = rawItemPrice;
          let discountAmountForLocal = 0;
          if (updatedPayload.appliedDiscountCode) {
            const matchedPromo = discountCodes.find(d => d.code.toUpperCase() === updatedPayload.appliedDiscountCode.toUpperCase() && d.active);
            if (matchedPromo) {
              if (matchedPromo.type === "percentage") {
                discountAmountForLocal = Math.ceil(finalPrice * (matchedPromo.value / 100));
              } else if (matchedPromo.type === "fixed") {
                discountAmountForLocal = Math.min(matchedPromo.value, finalPrice);
              }
              finalPrice = Math.max(0, finalPrice - discountAmountForLocal);
            }
          }
          localResult = {
            success: true,
            itemName: matchedItem.name,
            qty: newQty,
            unitPrice: matchedItem.price,
            rawTotal: rawItemPrice,
            totalPrice: finalPrice,
            discountAmount: discountAmountForLocal,
            materialType: matchedItem.unit || "հատ",
            dimensionsText: "անհատական",
            detailsText: `Ապրանք: ${matchedItem.name}\nՔանակ: ${newQty} ${matchedItem.unit || "հատ"}`
          };
        }
      } else if (item.catId === "qr_matrix") {
        const itemsList = products
          .filter(p => p.categoryId === "qr_matrix")
          .flatMap(p => p.items || []);
        const matchedItem = itemsList.find(it => it.id === updatedPayload.itemId);
        if (matchedItem) {
          const rawItemPrice = matchedItem.price * newQty;
          let finalPrice = rawItemPrice;
          let discountAmountForLocal = 0;
          if (updatedPayload.appliedDiscountCode) {
            const matchedPromo = discountCodes.find(d => d.code.toUpperCase() === updatedPayload.appliedDiscountCode.toUpperCase() && d.active);
            if (matchedPromo) {
              if (matchedPromo.type === "percentage") {
                discountAmountForLocal = Math.ceil(finalPrice * (matchedPromo.value / 100));
              } else if (matchedPromo.type === "fixed") {
                discountAmountForLocal = Math.min(matchedPromo.value, finalPrice);
              }
              finalPrice = Math.max(0, finalPrice - discountAmountForLocal);
            }
          }
          localResult = {
            success: true,
            itemName: matchedItem.name,
            qty: newQty,
            unitPrice: matchedItem.price,
            rawTotal: rawItemPrice,
            totalPrice: finalPrice,
            discountAmount: discountAmountForLocal,
            materialType: "հատ",
            dimensionsText: "անհատական",
            detailsText: `Ապրանք: ${matchedItem.name}\nՔանակ: ${newQty} հատ`
          };
        }
      } else {
        localResult = clientCalculateBagsPrice(updatedPayload, localDb);
      }
    } catch (err: any) {
      alert(err.message || t("cart.update_qty_error", "Քանակը փոխելու սխալ:"));
      return;
    }

    if (localResult && localResult.success !== false) {
      const newDesc = getSingleItemDetails(item.catId, localResult, updatedPayload);
      setBundleItems(prev => prev.map(it => {
        if (it.id === id) {
          return {
            ...it,
            qty: localResult.qty,
            unitPrice: localResult.unitPrice,
            totalPrice: localResult.totalPrice,
            description: newDesc,
            payload: updatedPayload
          };
        }
        return it;
      }));
    }
  };

  const handleApplyCartPromo = (codeStr: string) => {
    const trimmed = codeStr.trim().toUpperCase();
    if (!trimmed) return;

    if (!pricingRules) return;

    const matchedPromo = discountCodes.find(d => d.code.toUpperCase() === trimmed && d.active);
    if (!matchedPromo) {
      alert(t("cart.invalid_promo", "Անվավեր կամ ոչ ակտիվ պրոմո-կոդ:"));
      return;
    }

    const localDb = {
      categories,
      products,
      dimensions,
      finishes,
      pricingRules,
      decorativeBagsPricingRules: decorativeRules,
      papers,
      printingMethods,
      tiers,
      discountCodes,
      bagRibbonHandles
    };

    const updatedItems = bundleItems.map(item => {
      const updatedPayload = item.payload ? { ...item.payload, appliedDiscountCode: trimmed } : { appliedDiscountCode: trimmed };
      
      let localResult: any = null;
      try {
        if (item.catId === "boxes") {
          localResult = clientCalculateBoxesPrice(updatedPayload, localDb);
        } else if (item.catId === "ribbons") {
          localResult = clientCalculateRibbonsPrice(updatedPayload, localDb);
        } else if (item.catId === "stickers") {
          localResult = clientCalculateStickersPrice(updatedPayload, localDb);
        } else if (item.catId === "giftcards") {
          localResult = clientCalculateGiftCardsPrice(updatedPayload, localDb);
        } else if (item.catId === "businesscards") {
          localResult = clientCalculateBusinessCardsPrice(updatedPayload, localDb);
        } else if (item.catId === "other_products") {
          const itemsList = products
            .filter(p => p.categoryId === "other_products")
            .flatMap(p => p.items || []);
          const matchedItem = itemsList.find(it => it.id === updatedPayload.itemId);
          if (matchedItem) {
            const rawItemPrice = matchedItem.price * item.qty;
            let finalPrice = rawItemPrice;
            let discountAmountForLocal = 0;
            if (matchedPromo.type === "percentage") {
              discountAmountForLocal = Math.ceil(finalPrice * (matchedPromo.value / 100));
            } else if (matchedPromo.type === "fixed") {
              discountAmountForLocal = Math.min(matchedPromo.value, finalPrice);
            }
            finalPrice = Math.max(0, finalPrice - discountAmountForLocal);
            localResult = {
              success: true,
              itemName: matchedItem.name,
              qty: item.qty,
              unitPrice: matchedItem.price,
              rawTotal: rawItemPrice,
              totalPrice: finalPrice,
              discountAmount: discountAmountForLocal,
              materialType: matchedItem.unit || "հատ",
              dimensionsText: "անհատական",
              detailsText: `Ապրանք: ${matchedItem.name}\nՔանակ: ${item.qty} ${matchedItem.unit || "հատ"}`
            };
          }
        } else if (item.catId === "qr_matrix") {
          const itemsList = products
            .filter(p => p.categoryId === "qr_matrix")
            .flatMap(p => p.items || []);
          const matchedItem = itemsList.find(it => it.id === updatedPayload.itemId);
          if (matchedItem) {
            const rawItemPrice = matchedItem.price * item.qty;
            let finalPrice = rawItemPrice;
            let discountAmountForLocal = 0;
            if (matchedPromo.type === "percentage") {
              discountAmountForLocal = Math.ceil(finalPrice * (matchedPromo.value / 100));
            } else if (matchedPromo.type === "fixed") {
              discountAmountForLocal = Math.min(matchedPromo.value, finalPrice);
            }
            finalPrice = Math.max(0, finalPrice - discountAmountForLocal);
            localResult = {
              success: true,
              itemName: matchedItem.name,
              qty: item.qty,
              unitPrice: matchedItem.price,
              rawTotal: rawItemPrice,
              totalPrice: finalPrice,
              discountAmount: discountAmountForLocal,
              materialType: "հատ",
              dimensionsText: "անհատական",
              detailsText: `Ապրանք: ${matchedItem.name}\nՔանակ: ${item.qty} հատ`
            };
          }
        } else {
          localResult = clientCalculateBagsPrice(updatedPayload, localDb);
        }
      } catch {
        // Fail gracefully and use same pricing
      }

      if (localResult && localResult.success !== false) {
        const newDesc = getSingleItemDetails(item.catId, localResult, updatedPayload);
        return {
          ...item,
          unitPrice: localResult.unitPrice,
          totalPrice: localResult.totalPrice,
          description: newDesc,
          payload: { ...updatedPayload }
        };
      }
      return item;
    });

    setBundleItems(updatedItems);
    setAppliedPromo(trimmed);
  };

  const totalBundlePrice = bundleItems.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleLaunchBundleInquiry = () => {
    if (bundleItems.length === 0) return;
    
    let desc = `🛒 Պատվեր Զամբյուղից (Cart Order):\n`;
    bundleItems.forEach((item, index) => {
      desc += `\n[${index + 1}] ${item.catName} - ${item.itemName}\n` + 
              `${item.description}\n` + 
              `- Քանակ: ${item.qty} ${item.isMeters ? "մետր" : "հատ"}\n` + 
              `- Միավորի գին: ${item.unitPrice.toLocaleString()} ֏\n` + 
              `- Մասնակի արժեք/Արժեքը: ${item.totalPrice.toLocaleString()} ֏\n` +
              `----------------------------------------\n`;
    });
    
    desc += `\nԶամբյուղի Ընդհանուր Գինը: ${totalBundlePrice.toLocaleString()} ֏`;
    
    setInquiryDetails(desc);
    setInquiryPrice(totalBundlePrice);
    setIsInquiryOpen(true);
  };

  // Admin access triggers
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem("cc_admin_token");
      if (stored && /^[\x21-\x7E]+$/.test(stored)) {
        return stored;
      }
      if (stored) {
        localStorage.removeItem("cc_admin_token");
      }
    } catch {
      // Ignored
    }
    return null;
  });
  const logoClicksRef = useRef<number>(0);
  const logoLastClickTimeRef = useRef<number>(0);

  // Modal Inquiry states
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryDetails, setInquiryDetails] = useState("");
  const [inquiryPrice, setInquiryPrice] = useState(0);

  // Box Specific customized options
  const [selectedBoxItemId, setSelectedBoxItemId] = useState<string>("box_1");
  const [boxLength, setBoxLength] = useState<string>("20");
  const [boxWidth, setBoxWidth] = useState<string>("15");
  const [boxHeight, setBoxHeight] = useState<string>("8");
  const [boxQty, setBoxQty] = useState<number>(0);
  const [boxLamination, setBoxLamination] = useState<"matte" | "gloss" | "soft_touch" | "none" | "">("");
  const [boxColors, setBoxColors] = useState<number>(0);
  const [boxPaperId, setBoxPaperId] = useState<string>("");
  const [boxPrintingMethod, setBoxPrintingMethod] = useState<string>("");
  const [boxStyle, setBoxStyle] = useState<"shoulder_lid" | "sleeve_drawer" | "shoulder_neck" | "magnetic_flap" | "">("");
  const [boxWallThickness, setBoxWallThickness] = useState<number>(2.0);
  const [boxFinishes, setBoxFinishes] = useState<string[]>([]);

  // Ribbons State
  const [ribbonWidth, setRibbonWidth] = useState<string>(""); 
  const [ribbonType, setRibbonType] = useState<"satin" | "reps" | "">("");
  const [ribbonPrintColor, setRibbonPrintColor] = useState<"foil_gold" | "foil_silver" | "screen_1" | "">("");
  const [ribbonMeters, setRibbonMeters] = useState<number>(0); 

  // Stickers State
  const [stickerShape, setStickerShape] = useState<"circle" | "rectangle" | "contour" | "">("");
  const [stickerWidth, setStickerWidth] = useState<string>("4"); 
  const [stickerHeight, setStickerHeight] = useState<string>("4"); 
  const [stickerMaterial, setStickerMaterial] = useState<"paper_gloss" | "paper_matte" | "vinyl_white" | "vinyl_transparent" | "">("");
  const [stickerQty, setStickerQty] = useState<number>(0); 

  // Gift Cards State
  const [giftCardSize, setGiftCardSize] = useState<"standard" | "mini" | "euro" | "">(""); 
  const [giftCardEnvelope, setGiftCardEnvelope] = useState<"none" | "standard_white" | "kraft" | "colored_premium" | "">("");
  const [giftCardPaper, setGiftCardPaper] = useState<"silk_350" | "soft_touch_400" | "textured_cream" | "">("");
  const [giftCardQty, setGiftCardQty] = useState<number>(0); 
  const [giftCardFinishes, setGiftCardFinishes] = useState<string[]>([]); 

  // Business Cards State
  const [businessCardSize, setBusinessCardSize] = useState<"standard" | "euro" | "">(""); 
  const [businessCardPaper, setBusinessCardPaper] = useState<"silk_350" | "soft_touch_400" | "textured_premium" | "">("");
  const [businessCardSides, setBusinessCardSides] = useState<number>(0); 
  const [businessCardCorners, setBusinessCardCorners] = useState<"straight" | "rounded" | "">("");
  const [businessCardQty, setBusinessCardQty] = useState<number>(0); 
  const [businessCardFinishes, setBusinessCardFinishes] = useState<string[]>([]);
  const [businessCardColors, setBusinessCardColors] = useState<number>(2);

  // Sticker & Gift Card Colors States
  const [stickerColors, setStickerColors] = useState<number>(4);
  const [giftCardColors, setGiftCardColors] = useState<number>(4);

  // Other Printing Products State
  const [selectedOtherProductId, setSelectedOtherProductId] = useState<string>("");
  const [otherProductQty, setOtherProductQty] = useState<number>(0);
  const [otherProductNotes, setOtherProductNotes] = useState<string>("");

  // QR Data Matrix State
  const [selectedQrMatrixId, setSelectedQrMatrixId] = useState<string>("");
  const [qrMatrixQty, setQrMatrixQty] = useState<number>(0);
  const [qrMatrixNotes, setQrMatrixNotes] = useState<string>("");

  const getMissingOptions = (): string[] => {
    const missing: string[] = [];
    if (activeCategory === "bags") {
      if (selectedSizeIndex === -1 && calcTab === "select") missing.push("Չափս");
      if (!selectedPaperId) missing.push("Թուղթ (Նյութ)");
      if (!lamination) missing.push("Լամինացիա");
      if (!handle) missing.push("Բռնակ");
      if (colors === 0) missing.push("Գունայնություն");
      if (!method) missing.push("Տպագրության Մեթոդ");
      if (sides === 0) missing.push("Կողմեր");
      if (!design) missing.push("Դիզայն");
      if (calcTab === "select" && qty === 0) missing.push("Պատվերի Քանակ");
      if (calcTab === "custom" && custQty === 0) missing.push("Պատվերի Քանակ");
    } else if (activeCategory === "boxes") {
      if (!boxStyle) missing.push("Տուփի Կառուցվածք");
      if (!boxPaperId) missing.push("Նյութ / Ստվարաթուղթ");
      if (!boxLamination) missing.push("Լամինացիա");
      if (boxColors === 0) missing.push("Գույներ / Գունայնություն");
      if (!boxPrintingMethod) missing.push("Տպագրության Մեթոդ");
      if (boxQty === 0) missing.push("Պատվերի Քանակ");
    } else if (activeCategory === "ribbons") {
      if (!ribbonWidth) missing.push("Լայնություն");
      if (!ribbonType) missing.push("Տեսակ");
      if (!ribbonPrintColor) missing.push("Տպագրության Տեսակ");
      if (ribbonMeters === 0) missing.push("Մետրերի Քանակ");
    } else if (activeCategory === "stickers") {
      if (!stickerShape) missing.push("Սթիքերի Ձև");
      if (!stickerMaterial) missing.push("Տպագրական Նյութ");
      if (stickerQty === 0) missing.push("Պատվերի Քանակ");
    } else if (activeCategory === "giftcards") {
      if (!giftCardSize) missing.push("Չափս");
      if (giftCardEnvelope === "") missing.push("Ծրար");
      if (!giftCardPaper) missing.push("Թուղթ / Նյութ");
      if (giftCardQty === 0) missing.push("Քանակ");
    } else if (activeCategory === "businesscards") {
      if (!businessCardSize) missing.push("Չափս");
      if (!businessCardPaper) missing.push("Թուղթ / Նյութ");
      if (businessCardSides === 0) missing.push("Կողմեր");
      if (!businessCardCorners) missing.push("Անկյուններ");
      if (businessCardQty === 0) missing.push("Քանակ");
    } else if (activeCategory === "other_products") {
      if (!selectedOtherProductId) missing.push("Ապրանք");
      if (otherProductQty === 0) missing.push("Քանակ");
    } else if (activeCategory === "qr_matrix") {
      if (!selectedQrMatrixId) missing.push("Ապրանք");
      if (qrMatrixQty === 0) missing.push("Քանակ");
    }
    return missing;
  };

  const handleLaunchOrderInquiry = () => {
    if (!calcResult) return;
    let desc = "";
    if (activeCategory === "bags") {
      const ribbonWidthText = handle === "ribbon" ? ` (${activeRibLabel})` : "";
      const handleText = handle === "cord" ? "Շնուր" : `Սատինե Ժապավեն${ribbonWidthText}`;
      const lamText = lamination === "matte" ? "Փայլատ" : lamination === "gloss" ? "Փայլուն" : lamination === "soft_touch" ? "Soft-Touch" : "Առանց լամինացիայի";
      desc = `Տոպրակի Պատվեր:\nՉափսեր: ${calcResult.dimensionsText} սմ\nՔանակ: ${calcResult.qty} հատ\nԽտություն: ${gsm}g/m² (${lamText})\nՏպագրություն: ${formatColorsLabel(colors)} (${sides} կողմ)\nԲռնակ: ${handleText}\nՄշակումներ: ${selectedFinishes.map(k => finishes.find(f => f.key === k)?.label).join(", ") || "Չկան"}\nՏպագրության Մեթոդ: ${calcResult.printingMethodUsed}`;
    } else if (activeCategory === "boxes") {
      const lamText = calcResult.lamination === "matte" ? "Փայլատ" : calcResult.lamination === "gloss" ? "Փայլուն" : calcResult.lamination === "soft_touch" ? "Soft-touch" : "Առանց լամինացիայի";
      const finishesText = boxFinishes.length > 0 
        ? boxFinishes.map(k => finishes.find(f => f.key === k)?.label).filter(Boolean).join(", ")
        : "Չկան";
      const thickText = calcResult.wallThickness !== undefined ? `\nՊատերի Հաստություն: ${calcResult.wallThickness} մմ` : "";
      desc = `Տուփի Պատվեր:\nՏեսակ: ${calcResult.itemName}\nՉափսեր: ${calcResult.dimensionsText} սմ\nՔանակ: ${calcResult.qty} հատ\nՆյութը: ${calcResult.materialType === "rigid" ? "Rigid premium (Կոշտ)" : calcResult.materialType === "kraft" ? "Էկո Կրաֆտ" : "Cardboard (Ստվարաթուղթ)"}${thickText}\nԼամինացիա: ${lamText}\nՏպագրություն: ${formatColorsLabel(calcResult.colors)}\nՄշակումներ: ${finishesText}\nՏպագրության Մեթոդ: ${calcResult.printingMethodUsed}`;
    } else {
      desc = `Պատվերի Հաշվարկ:\nԲաժին: ${categories.find(c => c.id === activeCategory)?.name || activeCategory}\nԱպրանք: ${calcResult.itemName || "Չկա"}\nՉափսեր: ${calcResult.dimensionsText || "---"}\nՔանակ: ${calcResult.qty || 100} ${activeCategory === "ribbons" ? "մետր" : "հատ"}\nՆյութը: ${calcResult.materialType || "---"}\nՄանրամասներ:`;
      if (activeCategory === "ribbons") {
        desc += `\n- Լայնություն: ${calcResult.width || "---"} սմ\n- Տիպ: ${calcResult.type === "reps" ? "Ռեպսե" : "Սատինե"}\n- Տպագրություն: ${calcResult.printColor === "foil_gold" ? "Ոսկեգույն Ֆոյլ" : calcResult.printColor === "foil_silver" ? "Արծաթագույն Ֆոյլ" : "Մաքուր Մետաքսատպություն"}`;
      } else if (activeCategory === "stickers") {
        desc += `\n- Ձև: ${calcResult.shape || "---"}\n- Նյութ: ${calcResult.materialType || "---"}`;
      } else if (activeCategory === "giftcards") {
        const paperName = papers.find(p => p.id === calcResult.paper)?.name || calcResult.paper || "---";
        desc += `\n- Ծրար: ${calcResult.envelope === "none" ? "Առանց ծրարի" : calcResult.envelope === "standard_white" ? "Սպիտակ ծրար" : calcResult.envelope === "kraft" ? "Կրաֆտ ծրար" : "Գունավոր պրեմիում ծրար"}\n- Թուղթ: ${paperName}\n- Տպագրություն: ${formatColorsLabel(giftCardColors)}`;
      } else if (activeCategory === "businesscards") {
        const paperName = papers.find(p => p.id === calcResult.paper)?.name || calcResult.paper || "---";
        desc += `\n- Թուղթ: ${paperName}\n- Տպագրություն: ${formatColorsLabel(businessCardColors)}`;
      }
    }
    desc += `\nՄիավորի Գին: ${calcResult.unitPrice} ֏\nԸնդհանուր Արժեք: ${calcResult.totalPrice} ֏`;
    setInquiryDetails(desc);
    setInquiryPrice(calcResult.totalPrice);
    setIsInquiryOpen(true);
  };

  const loadPublicConfig = async () => {
    try {
      const res = await fetch("/api/config");
      const data = await res.json();
      if (data.success) {
        if (data.categories) setCategories(data.categories.filter((c: any) => c.active));
        if (data.products) setProducts(data.products);
        if (data.dimensions) setDimensions(data.dimensions);
        if (data.finishes) setFinishes(data.finishes);
        if (data.tiers) setTiers(data.tiers);
        if (data.papers) setPapers(data.papers);
        if (data.printingMethods) setPrintingMethods(data.printingMethods);
        if (data.contactSettings) setContactSettings(data.contactSettings);
        if (data.pricingRules) setPricingRules(data.pricingRules);
        if (data.decorativeBagsPricingRules) setDecorativeRules(data.decorativeBagsPricingRules);
        if (data.discountCodes) setDiscountCodes(data.discountCodes);
        if (data.siteTexts) setSiteTexts(data.siteTexts);
        if (data.submissions) setSubmissions(data.submissions);
        if (data.bagRibbonHandles) setBagRibbonHandles(data.bagRibbonHandles);
        if (data.aiSettings) setAiSettings(data.aiSettings);
        
        if (data.categories && data.categories.length > 0 && !activeCategory) {
          // Keep activeCategory as "" on initial land so the premium landing page is shown
          setActiveCategory("");
        }
      }
    } catch (err) {
      console.error("Failed to load configuration", err);
    }
  };

  useEffect(() => {
    loadPublicConfig();
  }, []);

  // Automatically initialize sensible defaults when activeCategory changes
  useEffect(() => {
    if (!activeCategory) {
      lastActiveCategoryRef.current = "";
      return;
    }

    if (activeCategory === lastActiveCategoryRef.current) {
      return;
    }

    lastActiveCategoryRef.current = activeCategory;

    // Resetting & establishing defaults prevents "missing options" screen on fresh tab opens
    if (activeCategory === "bags") {
      setSelectedSizeIndex(0);
      setSelectedPaperId("p1");
      setGsm(210);
      setLamination("matte");
      setHandle("cord");
      setColors(1);
      setSides(1);
      setMethod("auto");
      setDesign("ready");
      setQty(300);
      setCalcTab("select");
    } else if (activeCategory === "boxes") {
      setBoxStyle("shoulder_lid");
      setSelectedBoxItemId("custom");
      setBoxLength("20");
      setBoxWidth("15");
      setBoxHeight("5");
      setBoxQty(50);
      setBoxLamination("matte");
      setBoxColors(1);
      setBoxPaperId("box_cardboard");
      setBoxPrintingMethod("auto");
      setBoxWallThickness(2.0);
    } else if (activeCategory === "ribbons") {
      setRibbonWidth("2");
      setRibbonType("satin");
      setRibbonPrintColor("foil_gold");
      setRibbonMeters(100);
    } else if (activeCategory === "stickers") {
      setStickerShape("circle");
      setStickerWidth("4");
      setStickerHeight("4");
      setStickerMaterial("paper_gloss");
      setStickerQty(500);
      setStickerColors(4);
    } else if (activeCategory === "giftcards") {
      setGiftCardSize("standard");
      setGiftCardEnvelope("standard_white");
      setGiftCardPaper("silk_350");
      setGiftCardQty(100);
      setGiftCardColors(4);
    } else if (activeCategory === "businesscards") {
      setBusinessCardSize("standard");
      setBusinessCardPaper("silk_350");
      setBusinessCardSides(2);
      setBusinessCardCorners("straight");
      setBusinessCardQty(200);
      setBusinessCardColors(4);
    } else if (activeCategory === "other_products") {
      const categoryProducts = products.filter(p => p.categoryId === "other_products");
      const firstItem = categoryProducts.flatMap(p => p.items || [])[0];
      if (firstItem) {
        setSelectedOtherProductId(firstItem.id);
      } else {
        setSelectedOtherProductId("");
      }
      setOtherProductQty(100);
    } else if (activeCategory === "qr_matrix") {
      const categoryProducts = products.filter(p => p.categoryId === "qr_matrix");
      const firstItem = categoryProducts.flatMap(p => p.items || [])[0];
      if (firstItem) {
        setSelectedQrMatrixId(firstItem.id);
      } else {
        setSelectedQrMatrixId("");
      }
      setQrMatrixQty(100);
    }
  }, [activeCategory, products]);

  // Dynamic fallback selections for async loaded items
  useEffect(() => {
    if (products.length > 0) {
      if (!selectedOtherProductId) {
        const categoryProducts = products.filter(p => p.categoryId === "other_products");
        const firstItem = categoryProducts.flatMap(p => p.items || [])[0];
        if (firstItem) {
          setSelectedOtherProductId(firstItem.id);
        }
      }
      if (!selectedQrMatrixId) {
        const categoryProducts = products.filter(p => p.categoryId === "qr_matrix");
        const firstItem = categoryProducts.flatMap(p => p.items || [])[0];
        if (firstItem) {
          setSelectedQrMatrixId(firstItem.id);
        }
      }
    }
  }, [products, selectedOtherProductId, selectedQrMatrixId]);

  // Synchronous client-side calculation triggers for customizable active choices
  useEffect(() => {
    if (!activeCategory || !pricingRules) {
      setCalcResult(null);
      setCalcError(null);
      return;
    }

    const missing = getMissingOptions();
    if (missing.length > 0) {
      setCalcResult(null);
      setCalcError(null);
      return;
    }

    const localDb = {
      categories,
      products,
      dimensions,
      finishes,
      pricingRules,
      decorativeBagsPricingRules: decorativeRules,
      papers,
      printingMethods,
      tiers,
      discountCodes,
      bagRibbonHandles
    };

    let payload: any = {};
    let result: any = null;

    try {
      if (activeCategory === "bags") {
        const isCustomBag = calcTab === "custom";
        payload = {
          productKey: activeCategory,
          paperId: selectedPaperId,
          gsm,
          lamination,
          handle,
          ribbonWidthPrice,
          colors,
          sides,
          method,
          design,
          finishes: [...selectedFinishes],
          qty: isCustomBag ? custQty : qty,
          appliedDiscountCode: appliedPromo || undefined
        };
        if (isCustomBag) {
          payload.w = parseFloat(custW);
          payload.h = parseFloat(custH);
          payload.d = parseFloat(custD) || 0;
        } else {
          payload.sizeIndex = selectedSizeIndex;
        }
        result = clientCalculateBagsPrice(payload, localDb);
      } else if (activeCategory === "boxes") {
        const isCustomBox = selectedBoxItemId === "custom";
        payload = {
          productKey: "boxes",
          itemId: selectedBoxItemId,
          qty: boxQty,
          lamination: boxLamination,
          colors: boxColors,
          paperId: boxPaperId,
          method: boxPrintingMethod,
          boxStyle: boxStyle,
          wallThickness: boxWallThickness,
          finishes: [...boxFinishes],
          appliedDiscountCode: appliedPromo || undefined
        };
        if (isCustomBox) {
          payload.w = parseFloat(boxLength);
          payload.h = parseFloat(boxWidth);
          payload.d = parseFloat(boxHeight);
        }
        result = clientCalculateBoxesPrice(payload, localDb);
      } else if (activeCategory === "ribbons") {
        payload = {
          productKey: "ribbons",
          width: ribbonWidth,
          ribbonType: ribbonType,
          printColor: ribbonPrintColor,
          meters: ribbonMeters,
          appliedDiscountCode: appliedPromo || undefined
        };
        result = clientCalculateRibbonsPrice(payload, localDb);
      } else if (activeCategory === "stickers") {
        payload = {
          productKey: "stickers",
          shape: stickerShape,
          width: stickerWidth,
          height: stickerHeight,
          material: stickerMaterial,
          qty: stickerQty,
          colors: stickerColors,
          appliedDiscountCode: appliedPromo || undefined
        };
        result = clientCalculateStickersPrice(payload, localDb);
      } else if (activeCategory === "giftcards") {
        payload = {
          productKey: "giftcards",
          size: giftCardSize,
          envelope: giftCardEnvelope,
          paper: giftCardPaper,
          qty: giftCardQty,
          colors: giftCardColors,
          finishes: [...giftCardFinishes],
          appliedDiscountCode: appliedPromo || undefined
        };
        result = clientCalculateGiftCardsPrice(payload, localDb);
      } else if (activeCategory === "businesscards") {
        payload = {
          productKey: "businesscards",
          size: businessCardSize,
          paper: businessCardPaper,
          sides: businessCardSides,
          corners: businessCardCorners,
          qty: businessCardQty,
          colors: businessCardColors,
          finishes: [...businessCardFinishes],
          appliedDiscountCode: appliedPromo || undefined
        };
        result = clientCalculateBusinessCardsPrice(payload, localDb);
      } else if (activeCategory === "other_products") {
        payload = {
          productKey: "other_products",
          itemId: selectedOtherProductId,
          qty: otherProductQty,
          notes: otherProductNotes,
          appliedDiscountCode: appliedPromo || undefined
        };
        const itemsList = products
          .filter(p => p.categoryId === "other_products")
          .flatMap(p => p.items || []);
        const matchedItem = itemsList.find(it => it.id === selectedOtherProductId);
        if (matchedItem) {
          const rawItemPrice = matchedItem.price * otherProductQty;
          let finalPrice = rawItemPrice;
          let discountAmountForLocal = 0;
          if (payload.appliedDiscountCode) {
            const matchedPromo = discountCodes.find(d => d.code.toUpperCase() === payload.appliedDiscountCode.toUpperCase() && d.active);
            if (matchedPromo) {
              if (matchedPromo.type === "percentage") {
                discountAmountForLocal = Math.ceil(finalPrice * (matchedPromo.value / 100));
              } else if (matchedPromo.type === "fixed") {
                discountAmountForLocal = Math.min(matchedPromo.value, finalPrice);
              }
              finalPrice = Math.max(0, finalPrice - discountAmountForLocal);
            }
          }
          result = {
            success: true,
            itemName: matchedItem.name,
            qty: otherProductQty,
            unitPrice: matchedItem.price,
            rawTotal: rawItemPrice,
            totalPrice: finalPrice,
            discountAmount: discountAmountForLocal,
            materialType: matchedItem.unit || "հատ",
            dimensionsText: "անհատական",
            detailsText: `Ապրանք: ${matchedItem.name}\nՔանակ: ${otherProductQty} ${matchedItem.unit || "հատ"}`
          };
        }
      } else if (activeCategory === "qr_matrix") {
        payload = {
          productKey: "qr_matrix",
          itemId: selectedQrMatrixId,
          qty: qrMatrixQty,
          notes: qrMatrixNotes,
          appliedDiscountCode: appliedPromo || undefined
        };
        const itemsList = products
          .filter(p => p.categoryId === "qr_matrix")
          .flatMap(p => p.items || []);
        const matchedItem = itemsList.find(it => it.id === selectedQrMatrixId);
        if (matchedItem) {
          const rawItemPrice = matchedItem.price * qrMatrixQty;
          let finalPrice = rawItemPrice;
          let discountAmountForLocal = 0;
          if (payload.appliedDiscountCode) {
            const matchedPromo = discountCodes.find(d => d.code.toUpperCase() === payload.appliedDiscountCode.toUpperCase() && d.active);
            if (matchedPromo) {
              if (matchedPromo.type === "percentage") {
                discountAmountForLocal = Math.ceil(finalPrice * (matchedPromo.value / 100));
              } else if (matchedPromo.type === "fixed") {
                discountAmountForLocal = Math.min(matchedPromo.value, finalPrice);
              }
              finalPrice = Math.max(0, finalPrice - discountAmountForLocal);
            }
          }
          result = {
            success: true,
            itemName: matchedItem.name,
            qty: qrMatrixQty,
            unitPrice: matchedItem.price,
            rawTotal: rawItemPrice,
            totalPrice: finalPrice,
            discountAmount: discountAmountForLocal,
            materialType: "հատ",
            dimensionsText: "անհատական",
            detailsText: `Ապրանք: ${matchedItem.name}\nՔանակ: ${qrMatrixQty} հատ`
          };
        }
      } else {
        // Fallback or decorative bags
        payload = {
          productKey: activeCategory,
          paperId: selectedPaperId,
          gsm,
          lamination,
          handle,
          ribbonWidthPrice,
          colors,
          sides,
          method,
          design,
          finishes: [...selectedFinishes],
          qty: calcTab === "custom" ? custQty : qty,
          appliedDiscountCode: appliedPromo || undefined
        };
        if (calcTab === "custom") {
          payload.w = parseFloat(custW);
          payload.h = parseFloat(custH);
          payload.d = parseFloat(custD) || 0;
        } else {
          payload.sizeIndex = selectedSizeIndex;
        }
        result = clientCalculateBagsPrice(payload, localDb);
      }

      setCalcResult(result);
      setCalcError(null);
    } catch (err: any) {
      setCalcResult(null);
      setCalcError(err.message || "Հաշվարկի սխալ:");
    }
  }, [
    activeCategory,
    calcTab,
    custQty,
    custW,
    custH,
    custD,
    qty,
    selectedPaperId,
    gsm,
    lamination,
    handle,
    ribbonWidthPrice,
    colors,
    sides,
    method,
    design,
    selectedFinishes,
    selectedSizeIndex,
    boxQty,
    boxLamination,
    boxColors,
    boxPaperId,
    boxPrintingMethod,
    boxStyle,
    boxWallThickness,
    boxFinishes,
    boxLength,
    boxWidth,
    boxHeight,
    selectedBoxItemId,
    ribbonMeters,
    ribbonWidth,
    ribbonType,
    ribbonPrintColor,
    stickerQty,
    stickerShape,
    stickerWidth,
    stickerHeight,
    stickerMaterial,
    stickerColors,
    giftCardQty,
    giftCardSize,
    giftCardEnvelope,
    giftCardPaper,
    giftCardColors,
    giftCardFinishes,
    businessCardQty,
    businessCardSize,
    businessCardPaper,
    businessCardSides,
    businessCardCorners,
    businessCardColors,
    businessCardFinishes,
    selectedOtherProductId,
    otherProductQty,
    otherProductNotes,
    selectedQrMatrixId,
    qrMatrixQty,
    qrMatrixNotes,
    pricingRules,
    decorativeRules,
    categories,
    products,
    dimensions,
    finishes,
    papers,
    printingMethods,
    tiers,
    discountCodes,
    bagRibbonHandles,
    appliedPromo
  ]);

  // Coupon applying handler for Customizable calculator blocks
  const handleApplyCoupon = () => {
    if (!promoInput) {
      setPromoError(locale === "hy" ? "Խնդրում ենք մուտքագրել պրոմո-կոդ" : locale === "ru" ? "Пожалуйста, введите промокод" : "Please enter a promo code");
      return;
    }
    const found = discountCodes.find(
      c => c.code.toUpperCase() === promoInput.toUpperCase() && c.active
    );
    if (!found) {
      setPromoError(locale === "hy" ? "Սխալ կամ ոչ ակտիվ պրոմո-կոդ" : locale === "ru" ? "Неверный или неактивный промокод" : "Invalid or inactive promo code");
      setAppliedPromo("");
      setPromoSuccess(null);
    } else {
      setAppliedPromo(found.code);
      setPromoError(null);
      setPromoSuccess(`${locale === "hy" ? "✓ Պրոմո-կոդը կիրառված է" : locale === "ru" ? "✓ Промокод применен" : "✓ Promo code applied"}՝ ${found.code}`);
    }
  };

  // Submission handler for active calculator inquiry forms
  const handleCreateSubmission = async (subPayload: any) => {
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subPayload)
      });
      const data = await res.json();
      if (data.success) {
        // Hydrate config to keep local state synced (e.g. submissions)
        loadPublicConfig();
        return data;
      } else {
        alert(data.error || "Failed to create submission");
        return null;
      }
    } catch (err: any) {
      console.error("Submission creation failed:", err);
      alert(err.message || "Failed to submit inquiry");
      return null;
    }
  };

  // Save updated admin parameters and pricing settings
  const handleSaveAdminConfigAll = async (updatedConfig: any) => {
    if (!adminToken) {
      alert("Unauthorized: No admin token found.");
      return;
    }
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify(updatedConfig)
      });
      const data = await res.json();
      if (data.success) {
        alert(locale === "hy" ? "Կարգավորումները հաջողությամբ պահպանվեցին:" : "Config saved successfully!");
        loadPublicConfig(); // Refresh local config
      } else {
        alert(data.error || "Failed to save configuration");
      }
    } catch (err: any) {
      console.error("Failed to save config:", err);
      alert(err.message || "Internal server error saving settings");
    }
  };

  // Clear orders and inquiry submissions logs
  const handleClearAdminLogs = async () => {
    if (!adminToken) {
      alert("Unauthorized: No admin token found.");
      return;
    }
    const confirmClear = window.confirm(
      locale === "hy"
        ? "Դուք վստա՞հ եք, որ ցանկանում եք ջնջել բոլոր պատվերները:"
        : "Are you sure you want to delete all submissions?"
    );
    if (!confirmClear) return;

    try {
      const res = await fetch("/api/submissions", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        alert(locale === "hy" ? "Բոլոր պատվերները հաջողությամբ ջնջվեցին:" : "All submissions cleared successfully!");
        setSubmissions([]); // Clear client-side state of submissions list log
      } else {
        alert(data.error || "Failed to delete submissions");
      }
    } catch (err: any) {
      console.error("Failed to clear submissions:", err);
      alert(err.message || "Internal server error clearing submissions");
    }
  };

  const handleLogoClickClick = () => {
    const now = Date.now();
    if (now - logoLastClickTimeRef.current > 1500) {
      logoClicksRef.current = 0;
    }
    logoClicksRef.current += 1;
    logoLastClickTimeRef.current = now;
    if (logoClicksRef.current >= 7) {
      setIsAdminOpen(true);
      logoClicksRef.current = 0;
    }
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-capsule-bg flex flex-col text-capsule-dark-secondary transition-all selection:bg-capsule-accent/15">
      {/* Luxury Minimalist Dual-Row Header (UNERO Style & Colors) */}
      <header className="relative z-[150] w-full select-none border-b border-[#E5E1D8] bg-[#FAFAF8] shadow-[0_1px_3px_rgba(58,32,16,0.02)] transition-colors">
        {/* Top Header Row */}
        <div className="max-w-[1400px] mx-auto h-16 sm:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* LEFT: Multi-language & Currency Selectors (Desktop) / Hamburger Menu (Mobile) */}
          <div className="flex items-center gap-3 md:gap-5 w-1/3 justify-start">
            
            {/* Desktop-only dropdown switchers */}
            <div className="hidden lg:flex items-center gap-4 text-[11px] font-bold tracking-[0.12em] text-[#3D271B]/80 font-sans">
              {/* Language Switcher Dropdown */}
              <div className="relative" ref={langMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="cursor-pointer flex items-center gap-1.5 py-1 hover:text-capsule-accent transition-colors uppercase border-none outline-none select-none"
                  title="Language Selector"
                >
                  <span>{locale === "hy" ? "AM (Հայ)" : locale === "ru" ? "RU (Рус)" : locale === "ar" ? "AR (عرب)" : "EN (Eng)"}</span>
                  <ChevronDown size={11} className={`text-[#3D271B]/50 transition-transform duration-200 ${isLangMenuOpen ? "rotate-180 text-capsule-accent" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {isLangMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-2.5 w-36 bg-white border border-[#E5E1D8] rounded-xl shadow-lg py-1.5 z-[200]"
                    >
                      {(["hy", "en", "ru", "ar"] as const).map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            setLocale(lang);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-[10px] uppercase tracking-wider hover:bg-[#F4F2EE] hover:text-capsule-accent transition-colors flex items-center justify-between ${locale === lang ? "text-capsule-accent font-black bg-[#FAF9F5]" : "text-[#3D271B]"}`}
                        >
                          <span>
                            {lang === "hy" ? "AM (Հայերեն)" : lang === "en" ? "EN (English)" : lang === "ru" ? "RU (Русский)" : "AR (العربية)"}
                          </span>
                          {locale === lang && <Check size={10} className="text-capsule-accent shrink-0" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Vertical Divider */}
              <span className="h-3.5 w-px bg-[#E5E1D8]"></span>

              {/* Currency Switcher Dropdown */}
              <div className="relative" ref={currencyMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                  className="cursor-pointer flex items-center gap-1.5 py-1 hover:text-capsule-accent transition-colors uppercase border-none outline-none select-none"
                  title="Currency Selector"
                >
                  <span>{activeCurrency} {activeCurrency === "AMD" ? "֏" : activeCurrency === "USD" ? "$" : "₽"}</span>
                  <ChevronDown size={11} className={`text-[#3D271B]/50 transition-transform duration-200 ${isCurrencyMenuOpen ? "rotate-180 text-capsule-accent" : ""}`} />
                </button>

                <AnimatePresence>
                  {isCurrencyMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-2.5 w-36 bg-white border border-[#E5E1D8] rounded-xl shadow-lg py-1.5 z-[200]"
                    >
                      {(["AMD", "USD", "RUB"] as const).map((curr) => (
                        <button
                          key={curr}
                          type="button"
                          onClick={() => {
                            setActiveCurrency(curr);
                            setIsCurrencyMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-[10.5px] font-bold hover:bg-[#F4F2EE] hover:text-capsule-accent transition-colors flex items-center justify-between ${activeCurrency === curr ? "text-capsule-accent font-black bg-[#FAF9F5]" : "text-[#3D271B]"}`}
                        >
                          <span>{curr} {curr === "AMD" ? "(֏)" : curr === "USD" ? "($)" : "(₽)"}</span>
                          {activeCurrency === curr && <Check size={10} className="text-capsule-accent shrink-0" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Hamburger menu */}
            <button
              type="button"
              onClick={() => setIsDrawerMenuOpen(true)}
              className="lg:hidden cursor-pointer group flex items-center gap-2 h-10 px-3 md:px-4 rounded-full bg-[#FAFAF8] text-[#3D271B]/80 hover:text-capsule-accent border border-[#E5E1D8] transition-all duration-200 active:scale-95 select-none outline-none"
              id="mobile-drawer-hamburger"
              title="Menu"
            >
              <Menu size={16} className="text-[#3D271B] group-hover:text-capsule-accent transition-colors" />
              <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest font-sans">
                {locale === "hy" ? "ՄԵՆՅՈՒ" : locale === "ru" ? "МЕНЮ" : "MENU"}
              </span>
            </button>
          </div>

          {/* CENTER: Vector Logo (Always symmetrical and elegant) */}
          <div className="flex items-center justify-center w-1/3">
            <div
              onClick={() => {
                setIsInTrackPortal(false);
                setActiveCategory("");
              }}
              className="cursor-pointer w-fit max-w-[170px] sm:max-w-[210px] md:max-w-[230px] flex items-center justify-center transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] mx-auto select-none"
            >
              <CapsuleLogo className="h-9 sm:h-11 md:h-13 w-auto text-[#3D271B]" />
            </div>
          </div>

          {/* RIGHT: Elegant luxury action icons (Search, Account, Cart Bag) */}
          <div className="relative flex items-center justify-end gap-2.5 sm:gap-4.5 md:gap-5.5 w-1/3 selection:bg-transparent">
            {/* Minimal Inline Header Search Box (Toggled on click) */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {isHeaderSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 170, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="overflow-hidden mr-2 hidden xs:block"
                  >
                    <input
                      type="text"
                      placeholder={locale === "ru" ? "Поиск..." : locale === "hy" ? "Փնտրել..." : "Search..."}
                      value={neumorphicSearchInput}
                      onChange={(e) => setNeumorphicSearchInput(e.target.value)}
                      className="w-full text-[11px] font-sans h-8 px-3 rounded-md bg-[#FAF9F5] border border-[#E5E1D8] text-[#3D271B] focus:border-capsule-accent transition-all focus:ring-1 focus:ring-capsule-accent/20 outline-none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <button
                type="button"
                onClick={() => setIsHeaderSearchOpen(!isHeaderSearchOpen)}
                className="cursor-pointer text-[#3D271B]/80 hover:text-capsule-accent p-1.5 hover:bg-[#F4F2EE]/30 rounded-full transition-all border-none outline-none"
                title="Search Products"
              >
                <Search size={17} className="stroke-[2.2]" />
              </button>
            </div>

            {/* Account / Personal Cabinet Icon */}
            <button
              type="button"
              onClick={() => setIsClientCabinetOpen(true)}
              className="cursor-pointer text-[#3D271B]/80 hover:text-capsule-accent p-1.5 hover:bg-[#F4F2EE]/30 rounded-full transition-all border-none outline-none flex items-center relative"
              id="mobile-drawer-cabinet-btn"
              title="Personal Area"
            >
              <User size={18} className="stroke-[2.2]" />
              {userEmail && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#FAFAF8]" />
              )}
            </button>

            {/* Shopping Bag / Cart triggering button with count bubble */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="cursor-pointer group text-[#3D271B]/80 hover:text-capsule-accent p-1.5 hover:bg-[#F4F2EE]/30 rounded-full transition-all border-none outline-none flex items-center relative"
              title="Shopping Cart"
            >
              <ShoppingBag size={18} className="stroke-[2.2] group-hover:scale-[1.05] transition-transform" />
              {bundleItems.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-capsule-accent text-white flex items-center justify-center font-sans font-black text-[8px] px-1 border-2 border-[#FAFAF8] shadow-xs">
                  {bundleItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Centered Desktop Navigation Menu Bar - Hidden on mobile/tablet */}
        <div className="hidden lg:block border-t border-[#E5E1D8]/40 bg-[#FAFAF8]">
          <div className="max-w-[1400px] mx-auto h-11 px-6 flex items-center justify-center gap-7 sm:gap-9 selection:bg-transparent">
            {/* Landing page resets category selection */}
            <button
              type="button"
              onClick={() => {
                setIsInTrackPortal(false);
                setActiveCategory("");
              }}
              className={`pb-3.5 pt-3.5 border-b-2 hover:text-capsule-accent transition-all duration-200 text-[10px] tracking-[0.2em] font-extrabold uppercase shrink-0 cursor-pointer ${!activeCategory && !isInTrackPortal ? "text-capsule-accent border-capsule-accent font-black" : "text-[#3D271B]/60 hover:text-[#3D271B] border-transparent"}`}
            >
              {locale === "hy" ? "ԳԼԽԱՎՈՐ" : locale === "ru" ? "ГЛАВНАЯ" : "HOME"}
            </button>

            {/* Dynamic categories loaded directly in center main navigation bar */}
            {categories.map((c) => {
              if (!c.active) return null;
              const isSelected = activeCategory === c.id && !isInTrackPortal;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setIsInTrackPortal(false);
                    setActiveCategory(c.id);
                    setCalcResult(null);
                    setCalcError(null);
                  }}
                  className={`pb-3.5 pt-3.5 border-b-2 hover:text-capsule-accent transition-all duration-200 text-[10px] tracking-[0.2em] font-extrabold uppercase shrink-0 cursor-pointer ${isSelected ? "text-capsule-accent border-capsule-accent font-black text-[10.5px]" : "text-[#3D271B]/60 hover:text-[#3D271B] border-transparent"}`}
                >
                  {t(`db.category.${c.id}.navLabel`, c.navLabel || c.name)}
                </button>
              );
            })}

            {/* Tracking Portal Selector */}
            <button
              type="button"
              onClick={() => {
                setIsInTrackPortal(true);
              }}
              className={`pb-3.5 pt-3.5 border-b-2 hover:text-capsule-accent transition-all duration-200 text-[10px] tracking-[0.2em] font-extrabold uppercase shrink-0 cursor-pointer ${isInTrackPortal ? "text-capsule-accent border-capsule-accent font-black" : "text-[#3D271B]/60 hover:text-[#3D271B] border-transparent"}`}
            >
              {locale === "hy" ? "ՀԵՏԵՎԵԼ ՊԱՏՎԵՐԻՆ" : locale === "ru" ? "ОТСЛЕЖИВАНИЕ" : "TRACK SHIPMENT"}
            </button>

            {/* Quick Contact navigation */}
            <button
              type="button"
              onClick={() => {
                // Smooth scroll to the contact form at bottom
                const contactSection = document.getElementById("footer-contact-section") || document.getElementById("app-footer");
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="pb-3.5 pt-3.5 border-b-2 border-transparent text-[#3D271B]/60 hover:text-[#3D271B] hover:text-capsule-accent transition-all duration-200 text-[10px] tracking-[0.2em] font-extrabold uppercase shrink-0 cursor-pointer"
            >
              {locale === "hy" ? "ԿԱՊ" : locale === "ru" ? "КОНТАКТЫ" : "CONTACT"}
            </button>
          </div>
        </div>
      </header>

      {isInTrackPortal ? (
        <OrderTrackPortal currentLocale={locale} onBackToHome={navigateToHomeFromPortal} onReorder={handleReorder} />
      ) : !activeCategory ? (
            <div className="flex-1 max-w-4xl w-full mx-auto py-10 px-4 flex flex-col items-center justify-center gap-8 select-none animate-[fadeIn_0.5s_ease_out] relative z-10">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-capsule-accent/5 border border-capsule-accent/15 text-capsule-accent text-[10px] font-bold tracking-widest uppercase">
                  <Sparkles size={12} className="text-capsule-accent animate-pulse" />
                  {siteTexts?.home_hero_badge || "Premium Customizer"}
                </div>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-capsule-accent tracking-[0.15em] uppercase font-normal leading-tight">
                  {siteTexts?.home_hero_title || "The Capsule Lab"}
                </h1>
                <p className="max-w-xl mx-auto text-xs sm:text-sm text-capsule-text-secondary leading-relaxed font-sans mt-2 text-center">
                  {siteTexts?.home_hero_desc || "Ընտրեք ցանկալի արտադրանքի տեսակը՝ հաշվարկը և 3D ֆիզիկական մոդելավորումը սկսելու համար։"}
                </p>

                {/* Spectacular Ultra-Modern AI Assistant Block modeled after the screenshot, with custom brand colors matching the project */}
                <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center mt-9 space-y-6 animate-[fadeIn_0.6s_ease_out]">
                  
                  {/* Top Elegant Brand Bot Icon (matching top-center icon from the screenshot) */}
                  <div className="flex flex-col items-center space-y-3.5 select-none scroll-mt-20" id="ai-assistant-header">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#FAF9F5] to-[#EBE4D5] shadow-[6px_6px_15px_#D0C9B9,_-6px_-6px_15px_#FFFFFF] border border-capsule-accent/45 flex items-center justify-center relative transition-transform duration-300 hover:scale-105 active:scale-95">
                      <div className="w-11 h-11 rounded-full bg-[#3D271B] flex items-center justify-center text-white shadow-inner border border-capsule-accent/20">
                        {/* Custom sleek chat bubble smiley vector icon (similar to Zap) with branding colors */}
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="2" y="4" width="20" height="15" rx="5" fill="#FAF9F5" />
                          <circle cx="8" cy="11" r="2" fill="#ff2300" />
                          <circle cx="16" cy="11" r="2" fill="#ff2300" />
                          <path d="M10 15C10 15 11 16 12 16C13 16 14 15 14 15" stroke="#ff2300" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M12 19L15 22V19H12Z" fill="#FAF9F5" />
                        </svg>
                      </div>
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-capsule-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-capsule-accent"></span>
                      </span>
                    </div>

                    {/* Centered Greetings typography exactly styled like the screenshot mockup */}
                    <div className="space-y-1">
                      <h2 className="font-serif text-xl sm:text-2xl text-[#3D271B] tracking-wide uppercase font-black">
                        {locale === "hy" ? "Ողջո՛ւյն, ես Capsule-ն եմ" : locale === "ru" ? "Привет, я Capsule AI" : "Hi, I'm Capsule AI."}
                      </h2>
                      <p className="font-sans text-xs sm:text-[13px] text-[#3D271B]/60 font-bold tracking-tight">
                        {locale === "hy" ? "Ինչպե՞ս կարող եմ օգնել Ձեզ այսօր։" : locale === "ru" ? "Чем я могу помочь вам сегодня?" : "How can I help you today?"}
                      </p>
                    </div>
                  </div>

                  {/* Elegant Glassmorphic Panel containing BOTH input and active conversation history */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!homepageAssistantInput.trim()) return;
                      handleSendAssistantMessage(homepageAssistantInput);
                    }}
                    className="w-full bg-gradient-to-b from-[#FAF9F5] to-[#F5F2EA] shadow-[10px_10px_25px_#DBD5C7,_-10px_-10px_25px_#FFFFFF] border border-[#E3DCD0] rounded-2xl sm:rounded-[2.25rem] p-3.5 sm:p-5.5 space-y-3 sm:space-y-4 text-left transition-all duration-300 hover:shadow-[18px_18px_40px_#DBD5C7]"
                  >
                    {/* Active Chat Conversation Viewport - Integrated inside the input container for clear structure */}
                    {assistantMessages.length > 1 && (
                      <div className="w-full bg-white/45 shadow-inner rounded-2xl p-3 sm:p-4.5 max-h-[200px] sm:max-h-[240px] overflow-y-auto custom-scrollbar flex flex-col gap-3 sm:gap-4 text-left border border-[#E3DCD0]/35 transition-all duration-300">
                        {assistantMessages.map((msg, index) => (
                          <div
                            key={index}
                            className={`flex flex-col max-w-[85%] ${
                              msg.role === "user" ? "self-end items-end" : "self-start items-start"
                            } animate-[fadeIn_0.3s_ease_out]`}
                          >
                            <span className="text-[8px] uppercase font-sans tracking-[0.1em] text-[#3D271B]/50 font-black mb-1 px-1.5 block">
                              {msg.role === "user" 
                                ? (locale === "hy" ? "Դուք" : locale === "ru" ? "Вы" : "You") 
                                : (locale === "hy" ? "Օգնական" : locale === "ru" ? "Ասիստենտ" : "Assistant")}
                            </span>
                            <div
                              className={`p-3 sm:p-3.5 rounded-[1.25rem] text-[11px] sm:text-[11.5px] leading-relaxed select-text font-semibold border transition-all duration-200 ${
                                msg.role === "user"
                                  ? "bg-gradient-to-r from-[#3D271B] to-[#2B180F] text-[#FAF9F5] rounded-tr-none border-capsule-accent/25 shadow-sm"
                                  : "bg-[#FAFAF8] text-[#3D271B] rounded-tl-none border-[#E3DCD0]/90 shadow-[3px_3px_6px_#ECE7DD]"
                              }`}
                            >
                              {msg.role === "assistant" ? formatAssistantMessageText(msg.text) : msg.text}
                            </div>
                          </div>
                        ))}
                        {isAssistantTyping && (
                          <div className="self-start flex flex-col items-start gap-1 p-0.5">
                            <span className="text-[8px] uppercase font-sans tracking-[0.1em] text-[#3D271B]/50 font-black px-1.5">
                              AI {locale === "hy" ? "Մտածում է..." : locale === "ru" ? "Печатает..." : "Thinking..."}
                            </span>
                            <div className="bg-[#FAFAF8] border border-[#E3DCD0]/80 px-4 py-3 rounded-2xl rounded-tl-none shadow-[2px_2px_4px_#ECE7DD] flex gap-2 items-center">
                              <span className="w-1.5 h-1.5 bg-capsule-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                              <span className="w-1.5 h-1.5 bg-capsule-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                              <span className="w-1.5 h-1.5 bg-capsule-accent rounded-full animate-bounce" />
                            </div>
                          </div>
                        )}
                        <div ref={homepageChatEndRef} />
                      </div>
                    )}

                    {/* The Ask anything text input */}
                    <div className="w-full">
                      <textarea
                        rows={2}
                        placeholder={locale === "hy" ? "Հարցրեք ինձ ցանկացած բան..." : locale === "ru" ? "Спросите меня о чем угодно..." : "Ask anything..."}
                        value={homepageAssistantInput}
                        onChange={(e) => setHomepageAssistantInput(e.target.value)}
                        className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-[13px] sm:text-[14.5px] text-[#3D271B] font-bold placeholder:text-[#3D271B]/35 resize-none px-2 py-1 leading-relaxed"
                      />
                    </div>

                    {/* Integrated footer action bar exactly replicating the screenshot structure in brand colors, optimized for single-line desktop & mobile layout */}
                    <div className="flex items-center justify-between gap-2 pt-3 sm:pt-3.5 border-t border-[#3D271B]/5 select-none">
                      {/* Left Side Area: Attachment Button & Scrollable prompt pills */}
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        {/* Sleek attachment paperclip button */}
                        <button
                          type="button"
                          onClick={() => {
                            const q = locale === "hy" 
                              ? "Ողջու՛յն, ցանկանում եմ կցել ինձ համար նախընտրելի լոգոն կամ լուսանկարը՝ տուփի տպագրության համար։" 
                              : "Здравствуйте! Я бы хотел прикрепить свой фирменный логотип для макета упаковки.";
                            handleSendAssistantMessage(q);
                          }}
                          className="cursor-pointer w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-[#FAF9F5] to-[#FAFAF8] border border-[#E3DCD0]/50 text-[#3D271B]/75 hover:text-capsule-accent flex items-center justify-center shadow-[1.5px_1.5px_3.5px_#DBD5C7] hover:scale-[1.03] active:scale-95 transition-all outline-none shrink-0"
                          title="Attach logo or image layout"
                        >
                          <Paperclip className="w-[13px] h-[13px] sm:w-[14px] sm:h-[14px]" strokeWidth={2.5} />
                        </button>

                        {/* Custom Pills (Deep Search + FAQ Search replica) in Brand Accent Colors - scrollable horizontally on mobile with swipe */}
                        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-nowrap py-0.5 pr-2 flex-1 min-w-0">
                          <button
                            type="button"
                            onClick={() => handleSendAssistantMessage(locale === "hy" ? "Ի՞նչ տուփերի տեսակներ կան և որո՞նք են նվազագույն պատվերի քանակները (MOQ)։" : "Какие виды коробок доступны и какой минимальный тираж (MOQ)?")}
                            className="cursor-pointer shrink-0 text-[8.5px] sm:text-[9.5px] font-sans font-black uppercase tracking-wider px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-b from-[#FAF9F5] to-[#FAFAF8] text-[#3D271B]/85 shadow-[1px_1px_2.5px_#DBD5C7] hover:text-capsule-accent hover:border-capsule-accent/40 border border-[#E3DCD0]/50 flex items-center gap-1 sm:gap-1.5 transition-all"
                          >
                            <Search size={10} className="text-capsule-accent shrink-0" strokeWidth={3} />
                            <span>{locale === "hy" ? "Պատվերի MOQ" : locale === "ru" ? "Тираж MOQ" : "Order MOQ"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSendAssistantMessage(locale === "hy" ? "Ի՞նչ է Spot UV լաքը և ոսկետառ ֆոյլը տպագրության մեջ։" : "Что такое выборочный лак Spot UV и тиснение фольгой?")}
                            className="cursor-pointer shrink-0 text-[8.5px] sm:text-[9.5px] font-sans font-black uppercase tracking-wider px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-b from-[#FAF9F5] to-[#FAFAF8] text-[#3D271B]/85 shadow-[1px_1px_2.5px_#DBD5C7] hover:text-capsule-accent hover:border-capsule-accent/40 border border-[#E3DCD0]/50 flex items-center gap-1 sm:gap-1.5 transition-all"
                          >
                            <Globe size={10} className="text-capsule-accent shrink-0" strokeWidth={3} />
                            <span>{locale === "hy" ? "Պրեմիում" : locale === "ru" ? "Премиум" : "Finishes"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Right Side Area: Microphone voice simulation indicator + Sleek Active Send Arrow */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Audio simulate wave icon from photo */}
                        <button
                          type="button"
                          onClick={() => {
                            const greet = locale === "hy" 
                              ? "Լսում եմ Ձեզ, խնդրում եմ հարցրեք ցանկացած տեղեկատվություն տուփերի մասին։" 
                              : "Слушаю вас! Пожалуйста, задайте любой вопрос по поводу упаковки голосом.";
                            setHomepageAssistantInput("");
                            handleSendAssistantMessage(greet);
                          }}
                          className="cursor-pointer w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-[#FAF9F5] to-[#FAFAF8] border border-[#E3DCD0]/50 text-[#3D271B]/75 hover:text-capsule-accent flex items-center justify-center shadow-[1.5px_1.5px_3.5px_#DBD5C7] hover:scale-[1.03] active:scale-95 transition-all outline-none"
                          title="Simulate Voice Input"
                        >
                          <Mic className="w-[13px] h-[13px] sm:w-[14px] sm:h-[14px]" strokeWidth={2.5} />
                        </button>

                        {/* Round glowing Send Button (Exactly centered rightmost, styled with brand accent color) */}
                        <button
                          type="submit"
                          disabled={!homepageAssistantInput.trim() || isAssistantTyping}
                          className="cursor-pointer w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-capsule-accent hover:bg-capsule-accent-light text-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-[1.05] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed select-none transition-all duration-200 border-none outline-none"
                        >
                          <ArrowUp className="w-[15px] h-[15px] sm:w-[16px] sm:h-[16px] text-white" strokeWidth={3.5} />
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Aesthetic Premium Brand/Studio Bottom Label */}
                  <div className="w-full max-w-sm pt-1 select-none">
                    <div className="flex justify-between items-center bg-[#FAFAF8]/95 border border-[#E3DCD0]/50 p-4 rounded-2xl shadow-[2px_2px_5px_rgba(220,214,201,0.25)]">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm text-capsule-accent">✦</span>
                        <p className="text-[10px] uppercase font-sans tracking-[0.18em] font-black text-[#3D271B]">
                          Capsule Studio AI
                        </p>
                      </div>
                      <span className="text-[9px] text-[#A69785] font-mono tracking-widest font-black uppercase">
                        Yerevan
                      </span>
                    </div>
                  </div>

                </div>


              </div>

              {/* Luxury Kit Bundle Display */}
              {bundleItems.length > 0 && (
                <div className="w-full bg-capsule-surf border border-capsule-accent/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden animate-[fadeIn_0.5s_ease_out]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-capsule-accent/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-capsule-accent/10 pb-4">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-mono tracking-widest text-capsule-accent/70 font-semibold block">
                        🛒 Ձեր Զամբյուղը / Your Selected Cart
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl text-capsule-accent tracking-wide uppercase">
                        Պատվերի Զամբյուղ
                      </h3>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsCartOpen(true)}
                        className="text-[10px] uppercase tracking-widest text-[#fbfbf8] bg-capsule-accent hover:bg-capsule-accent-light px-4 py-2 rounded-xl transition-all duration-250 cursor-pointer font-bold select-none"
                      >
                        Բացել Զամբյուղը / Open Cart
                      </button>
                      <button
                        onClick={handleClearBundle}
                        className="text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-2 rounded-xl border text-red-700 hover:text-white border-red-700/10 hover:border-red-700 hover:bg-red-700 transition-all duration-200 cursor-pointer"
                      >
                        Մաքրել / Clear
                      </button>
                    </div>
                  </div>

                  {/* Dynamic summary list of cart contents */}
                  <div className="flex flex-wrap gap-3 py-2">
                    {bundleItems.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => setIsCartOpen(true)}
                        className="flex items-center gap-3 bg-capsule-bg/25 hover:bg-capsule-bg/60 border border-capsule-accent/10 hover:border-capsule-accent/25 px-4 bg-opacity-40 py-2.5 rounded-2xl cursor-pointer transition-all duration-200"
                      >
                        <div className="w-8 h-8 rounded-lg bg-capsule-accent/5 text-capsule-accent flex items-center justify-center shrink-0">
                          {renderCategoryIcon(item.icon, item.catId)}
                        </div>
                        <div className="text-left select-text">
                          <span className="text-[8px] uppercase tracking-wider text-capsule-accent/70 block font-mono font-bold leading-none mb-0.5">
                            {item.catName}
                          </span>
                          <span className="text-[11px] font-bold text-capsule-dark block truncate max-w-[150px]">
                            {item.itemName}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono bg-capsule-accent/10 text-capsule-accent px-1.5 py-0.5 rounded-md font-bold shrink-0">
                          {item.qty.toLocaleString()} {item.isMeters ? "մ." : "հ."}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary Total */}
                  <div className="border-t border-capsule-accent/10 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-center sm:text-left select-text">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-capsule-text-muted font-semibold block">
                        Զամբյուղի Ընդհանուր Արժեքը
                      </span>
                      <h4 className="text-2xl sm:text-3xl font-extrabold text-capsule-accent font-sans">
                        {totalBundlePrice.toLocaleString()} ֏
                      </h4>
                    </div>
                    
                    <button
                      onClick={handleLaunchBundleInquiry}
                      className="w-full sm:w-auto bg-[#ff2300] hover:bg-[#e61f00] text-white text-xs px-8 py-4 rounded-full font-bold uppercase tracking-wider cursor-pointer text-center select-none shadow-md flex justify-center items-center gap-2 transition-colors duration-200"
                    >
                      <ShoppingBag size={14} />
                      Հաստատել Պատվերը / Send Cart Quote
                    </button>
                  </div>
                </div>
              )}



              {/* Categorized workspace selection (Moved to the very top as the hero element for ideal UX flow) */}
              <div className="w-full text-center mt-6 space-y-4">
                <span className="text-[10px] font-mono tracking-[0.25em] text-[#3D271B]/60 font-extrabold uppercase block select-none">
                  ✦ Ընտրեք կատեգորիան արտադրանքի հաշվարկի համար / Select Product Category to Start Calculating ✦
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                  {categories.filter(c => c.active).map((c) => {
                    let badgeText = c.heroSmall || "";
                    if (!badgeText) {
                      switch(c.id) {
                        case "bags": badgeText = "Պայուսակներ / Standard Bags"; break;
                        case "boxes": badgeText = "Պրեմիում Տուփեր / Rigid Boxes"; break;
                        case "ribbons": badgeText = "Սատին / Ռեպսե Ժապավեններ"; break;
                        case "stickers": badgeText = "Պիտակներ / Custom Stickers"; break;
                        case "giftcards": badgeText = "Նվեր Քարտեր / Gift Cards"; break;
                        case "businesscards": badgeText = "Այցեքարտեր / Business Cards"; break;
                        case "other_products": badgeText = "Այլ Արտադրանք / Custom Print"; break;
                        case "qr_matrix": badgeText = "QR & Matrix / Generate"; break;
                        default: badgeText = "Հաշվիչ / Dynamic Calculator"; break;
                      }
                    }
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          setActiveCategory(c.id);
                          setCalcResult(null);
                          setCalcError(null);
                        }}
                        className="luxury-card-hover p-6 rounded-[2.25rem] bg-[var(--color-capsule-bg)] border border-white/80 shadow-[7px_7px_15px_#D3C9B8,_-7px_-7px_15px_#FFFFFF] text-center cursor-pointer group flex flex-col items-center justify-between min-h-[235px] relative overflow-hidden active:scale-[0.98] active:shadow-[inset_4px_4px_8px_#E5E3DF,_inset_-3px_-3px_6px_#FFFFFF]"
                      >
                        <div className="absolute top-0 right-0 w-28 h-28 bg-capsule-accent/5 rounded-full -mr-10 -mt-10 transition-transform duration-500 ease-out group-hover:scale-110 pointer-events-none" />
                        
                        <div className="w-20 h-20 rounded-[1.75rem] bg-[var(--color-capsule-bg)] text-capsule-accent shadow-[inset_3px_3px_6px_#E5E3DF,_inset_-3px_-3px_6px_#FFFFFF] border border-white/40 group-hover:bg-capsule-accent group-hover:text-capsule-surf flex items-center justify-center transition-all duration-200">
                          {renderCategoryIcon(c.icon, c.id)}
                        </div>

                        <div className="space-y-1.5 z-10 mt-4 px-2">
                          <span className="text-[9px] uppercase font-mono tracking-widest text-capsule-accent/60 font-bold block">{badgeText}</span>
                          <h4 className="font-sans text-[12px] sm:text-[14px] font-bold uppercase tracking-[0.12em] text-capsule-dark group-hover:text-capsule-accent transition-colors leading-relaxed">
                            {c.name}
                          </h4>
                        </div>

                        <div className="mt-4 text-[9px] uppercase tracking-wider text-capsule-text-secondary bg-[#FAFAF9]/70 px-4 py-1.5 rounded-full border border-white/80 shadow-[2px_2px_4px_#E5E3DF,_-2px_-2px_4px_#FFFFFF] group-hover:border-capsule-accent/20 group-hover:bg-capsule-accent/10 group-hover:text-capsule-accent transition-all duration-300 font-bold flex items-center gap-1.5 font-sans">
                          <span>Սկսել հաշվարկը</span>
                          <span className="transition-transform group-hover:translate-x-1 duration-200">➔</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Spectacular Neumorphic Interactive Console (Disabled) */}
              {false && (
                <AnimatePresence mode="wait">
                {!isEmbeddedAiExpanded ? (
                  <motion.div
                    key="collapsed-ai"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    onClick={() => setIsEmbeddedAiExpanded(true)}
                    className="w-full mt-6 bg-capsule-surf rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-[8px_8px_20px_#E5E3DF,_-8px_-8px_20px_#FFFFFF] border-2 border-white cursor-pointer hover:shadow-[10px_10px_25px_#DCDAD5,_-10px_-10px_25px_#FFFFFF] hover:scale-[1.005] active:scale-[0.998] transition-all duration-300 select-none flex flex-col items-center justify-center text-center gap-6"
                  >
                    {/* Compact Interactive Mascot with Pulsing Glow */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-[inset_2px_2px_5px_#E5E3DF,_inset_-2px_-2px_5px_#FFFFFF] bg-capsule-surf2 overflow-hidden p-1">
                        <div className="absolute inset-1.5 rounded-full bg-gradient-to-tr from-[#FFAA33]/20 via-[#ff2300]/15 to-[#ff2300]/35 opacity-80 animate-pulse" />
                        <Bot size={24} className="text-capsule-accent relative z-10 drop-shadow-sm" />
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-[9px] bg-capsule-accent-dim text-capsule-accent border border-capsule-accent/15 px-2.5 py-0.5 rounded-full font-mono font-black tracking-widest uppercase shadow-[2px_2px_5px_#E5E3DF,_-2px_-2px_5px_#FFFFFF]">
                          CAPSULE AI CONSOLE
                        </span>
                        <h2 className="font-sans text-lg sm:text-xl text-capsule-dark tracking-tight font-black uppercase mt-1">
                          ԽԵԼԱՑԻ ՕԳՆԱԿԱՆ &amp; ՍՊԱՍԱՐԿՈՒՄ
                        </h2>
                        <p className="text-xs text-capsule-text-secondary max-w-md mx-auto font-semibold">
                          Կտտացրեք՝ բացելու նորագույն նեյրոմորֆիկ (Neumorphic) ինտերակտիվ վահանակը։
                        </p>
                      </div>
                    </div>

                    {/* Quick Access Neumorphic Pills */}
                    <div className="flex flex-wrap justify-center gap-3 max-w-xl">
                      <span className="text-[10px] bg-capsule-surf text-capsule-dark px-3.5 py-2 rounded-full font-bold shadow-[2px_2px_5px_#E5E3DF,_-2px_-2px_5px_#FFFFFF] border border-capsule-border">
                        💬 AI Chat
                      </span>
                      <span className="text-[10px] bg-capsule-surf text-capsule-dark px-3.5 py-2 rounded-full font-bold shadow-[2px_2px_5px_#E5E3DF,_-2px_-2px_5px_#FFFFFF] border border-capsule-border">
                        🔑 Sign Up Code
                      </span>
                      <span className="text-[10px] bg-capsule-surf text-capsule-dark px-3.5 py-2 rounded-full font-bold shadow-[2px_2px_5px_#E5E3DF,_-2px_-2px_5px_#FFFFFF] border border-capsule-border">
                        🔍 Product Specs
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="expanded-ai"
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="w-full mt-6 bg-capsule-surf rounded-[2.8rem] p-6 sm:p-8 md:p-10 shadow-[12px_12px_28px_#E5E3DF,_-12px_-12px_28px_#FFFFFF] border-3 border-white flex flex-col gap-6 select-text relative overflow-hidden"
                  >
                    {/* Interactive Floating Toast Notification for Bookmarks / Simulated Actions */}
                    <AnimatePresence>
                      {showBookmarkToast && (
                        <motion.div
                          initial={{ opacity: 0, y: -50, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-[#FAFAF9] border-2 border-white text-gray-800 font-sans font-bold text-xs px-5 py-3.5 rounded-2xl shadow-[6px_6px_12px_#E5E3DF,_-6px_-6px_12px_#FFFFFF] flex items-center gap-2.5"
                        >
                          <span className="text-emerald-500 text-sm">✦</span>
                          <span>{bookmarkToastText}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Header Zone: Neumorphic Dual View Controller & Close Button */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#3D271B]/5 pb-4">
                      {/* Left: Beautiful receded Neumorphic tab controller */}
                      <div className="flex items-center p-1.5 bg-[#FAFAF9] rounded-full shadow-[inset_3px_3px_6px_#E5E3DF,_inset_-3px_-3px_6px_#FFFFFF] w-full sm:w-auto relative">
                        <button
                          type="button"
                          onClick={() => {
                            setNeumorphicActiveTab("ai_chat");
                            if (neumorphicVolume) {
                              // Play subtle chime simulation
                              setBookmarkToastText("Անցում AI Chat վահանակին");
                              setShowBookmarkToast(true);
                              setTimeout(() => setShowBookmarkToast(false), 1500);
                            }
                          }}
                          className={`flex-1 sm:flex-none text-center px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                            neumorphicActiveTab === "ai_chat"
                              ? "bg-capsule-surf text-[#3B82F6] shadow-[2px_2px_5px_#E5E3DF,_-2px_-2px_5px_#FFFFFF] border-t border-white"
                              : "text-[#3D271B]/60 hover:text-[#3D271B]"
                          }`}
                        >
                          💬 AI Chat Info
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNeumorphicActiveTab("signup");
                            if (neumorphicVolume) {
                              setBookmarkToastText("Անցում Sign Up վահանակին");
                              setShowBookmarkToast(true);
                              setTimeout(() => setShowBookmarkToast(false), 1500);
                            }
                          }}
                          className={`flex-1 sm:flex-none text-center px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                            neumorphicActiveTab === "signup"
                              ? "bg-capsule-surf text-red-700 shadow-[2px_2px_5px_#E5E3DF,_-2px_-2px_5px_#FFFFFF] border-t border-white"
                              : "text-[#3D271B]/60 hover:text-[#3D271B]"
                          }`}
                        >
                          🔑 Sign Up &amp; Tools
                        </button>
                      </div>
 
                      {/* Right: Close Console circle button */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsEmbeddedAiExpanded(false);
                          setIsConsoleActivated(false);
                        }}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-capsule-surf text-capsule-dark hover:text-red-600 shadow-[3px_3px_6px_#E5E3DF,_-3px_-3px_6px_#FFFFFF] hover:shadow-[4px_4px_8px_#DCDAD5,_-4px_-4px_8px_#FFFFFF] border-t border-white active:shadow-[inset_2px_2px_4px_#E5E3DF,_inset_-2px_-2px_4px_#FFFFFF] active:scale-95 transition-all cursor-pointer"
                        title="Close Console"
                      >
                        <X size={15} />
                      </button>
                    </div>
 
                    {/* Main Workspace Frame */}
                    <div className="w-full">
                      {neumorphicActiveTab === "ai_chat" ? (
                        /* ==================== STYLE 2: AI CHAT VIEW (From Screenshot 2) ==================== */
                        <div className="flex flex-col items-center gap-6">
                          
                          {/* Main Heading styled like the screenshot header but slightly blue */}
                          <div className="text-center">
                            <h3 className="text-[#3B82F6] font-sans font-black tracking-widest text-lg sm:text-xl select-none">
                              AI Chat
                            </h3>
                          </div>
 
                          {/* Outer Raised White Card - Screenshot 2 exact shape */}
                          <div className="w-full max-w-lg bg-capsule-surf border-3 border-white rounded-[2.5rem] p-6 sm:p-8 shadow-[8px_8px_18px_#E5E3DF,_-8px_-8px_18px_#FFFFFF] flex flex-col items-center gap-6 relative overflow-hidden">
                            
                            {/* Spectacular Frosty Glass Layer at the Beginning (Unlockable upon focus/typing) */}
                            <AnimatePresence>
                              {!isConsoleActivated && (
                                <motion.div
                                  initial={{ opacity: 1 }}
                                  exit={{ opacity: 0, scale: 0.98, y: -5 }}
                                  transition={{ duration: 0.45, ease: "easeInOut" }}
                                  className="absolute inset-x-0 top-0 bottom-[84px] z-30 bg-capsule-surf/95 rounded-t-[2.3rem] flex flex-col items-center justify-center p-6 text-center select-none"
                                >
                                  {/* Premium Armenia text at the top of frosty block */}
                                  <div className="space-y-1.5 pt-2">
                                    <span className="text-[9px] bg-capsule-accent-dim text-capsule-accent border-2 border-white px-3 py-0.5 rounded-full font-mono font-black tracking-widest uppercase shadow-[2px_2px_4px_#E5E3DF,_-2px_-2px_4px_#FFFFFF]">
                                      CAPSULE SMART CORE
                                    </span>
                                    <h4 className="font-sans text-xs sm:text-[13px] font-black uppercase text-capsule-dark tracking-wider mt-2.5">
                                      ԽԵԼԱՑԻ AI ՕԳՆԱԿԱՆ
                                    </h4>
                                    <p className="text-[10px] text-[#3D271B]/60 font-bold uppercase tracking-widest">
                                      Concept Assistance Ready
                                    </p>
                                  </div>
 
                                  {/* Beautiful straight horizontal line requested by user */}
                                  <div className="w-40 h-[2.5px] bg-gradient-to-r from-transparent via-capsule-border to-transparent my-4" />
 
                                  {/* Description space for writing text */}
                                  <div className="space-y-2.5 max-w-xs mt-1">
                                    <p className="text-[11px] sm:text-xs text-capsule-text-secondary font-semibold leading-relaxed">
                                      Գրեք Ձեր հարցը կամ կտտացրեք տեքստային դաշտի վրա համակարգն ակտիվացնելու համար։
                                    </p>
                                    <p className="text-[9px] font-mono text-capsule-accent font-extrabold uppercase tracking-wider animate-pulse">
                                      ✦ Click text box below to activate ✦
                                    </p>
                                  </div>
 
                                  {/* Floating lock icon indicator matching screenshot aesthetic */}
                                  <div className="mt-4 w-9 h-9 rounded-full bg-capsule-surf border border-white shadow-[3px_3px_6px_#E5E3DF,_-3px_-2px_6px_#FFFFFF] flex items-center justify-center text-[#3D271B]/60">
                                    <Lock size={12} className="animate-pulse" />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Centered Glowing Neomorphic Rainbow Sphere */}
                            <div className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-[inset_3px_3px_7px_rgba(31,42,42,0.15),_inset_-3px_-3px_7px_#FFFFFF] bg-capsule-surf overflow-hidden p-1.5">
                              {/* Iridescent background layers rotating/pulsing */}
                              <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#FFCCD3] via-[#BCEEFF] to-[#E9D5FF] opacity-90 animate-[pulse_3.5s_infinite_alternate]" />
                              <div className="absolute inset-4 rounded-full bg-gradient-to-bl from-[#FFEAC7] via-[#D3F5FF] to-[#F1ACFF] mix-blend-screen animate-[spin_12s_linear_infinite]" />
                              <div className="absolute inset-5 rounded-full bg-white/90 flex items-center justify-center shadow-3xs">
                                <span className="text-base">✨</span>
                              </div>
                            </div>

                            {/* Center Headline */}
                            <div className="text-center space-y-1">
                              <h4 className="font-sans text-capsule-dark font-extrabold text-sm sm:text-[15px] tracking-normal select-none">
                                Ask Super AI anything
                              </h4>
                              <p className="text-[10px] text-capsule-text-secondary font-bold uppercase tracking-wider">
                                ՏՈՒՓԵՐՈՒՄ &amp; ՓԱԹԵԹԱՎՈՐՄԱՆ ԼՈՒԾՈՒՄՆԵՐ
                              </p>
                            </div>

                            {/* Chat messages inside an inset window - functional chat history scrollable block */}
                            <div className="w-full rounded-2xl p-4 bg-capsule-surf2 shadow-[inset_4px_4px_8px_#E5E3DF,_inset_-4px_-4px_8px_#FFFFFF] max-h-[220px] overflow-y-auto space-y-3.5 scroll-smooth border border-white/20">
                              {assistantMessages.map((msg, idx) => (
                                <div
                                  key={idx}
                                  className={`flex gap-2.5 max-w-[90%] ${
                                    msg.role === "user" ? "self-end ml-auto flex-row-reverse" : "self-startMR mr-auto"
                                  }`}
                                >
                                  {/* Compact circular avatar */}
                                  <div className="w-7 h-7 rounded-full flex items-center justify-center select-none text-[9px] font-mono font-black border border-white/80 shadow-[2px_2px_4px_#E5E3DF,_-2px_-2px_4px_#FFFFFF] shrink-0
                                    bg-capsule-surf text-capsule-accent">
                                    {msg.role === "user" ? "U" : "AI"}
                                  </div>

                                  {/* Speech speech bubble with beautiful convex feel */}
                                  <div
                                    className={`rounded-2xl px-3.5 py-2.5 text-xs font-semibold leading-relaxed border border-white/40 shadow-[3px_3px_5px_#E5E3DF,_-3px_-3px_5px_#FFFFFF] ${
                                      msg.role === "user"
                                        ? "bg-capsule-surf text-capsule-dark rounded-tr-none"
                                        : "bg-capsule-surf text-gray-700 rounded-tl-none"
                                    }`}
                                  >
                                    {formatAssistantMessageText(msg.text)}
                                  </div>
                                </div>
                              ))}

                              {isAssistantTyping && (
                                <div className="flex gap-2.5 self-start mr-auto max-w-[85%]">
                                  <div className="w-7 h-7 rounded-full bg-capsule-surf text-[#3D271B]/60 border border-white/80 shadow-[2px_2px_4px_#E5E3DF] flex items-center justify-center shrink-0">
                                    <Bot size={11} className="animate-spin text-capsule-accent" />
                                  </div>
                                  <div className="bg-capsule-surf rounded-2xl rounded-tl-none px-3.5 py-2.5 border border-white/45 text-[11px] text-[#3D271B]/60 flex items-center gap-2 shadow-[3px_3px_5px_#E5E3DF]">
                                    <span className="flex gap-1 animate-pulse">
                                      <span className="w-1.5 h-1.5 bg-capsule-accent rounded-full"></span>
                                      <span className="w-1.5 h-1.5 bg-capsule-accent-light rounded-full"></span>
                                      <span className="w-1.5 h-1.5 bg-capsule-accent-active rounded-full"></span>
                                    </span>
                                    <span className="italic font-bold">Concept AI is writing...</span>
                                  </div>
                                </div>
                              )}
                              <div ref={homepageChatEndRef} />
                            </div>

                            {/* Suggested Prompts Pill Buttons (Laid out beautifully, active triggers) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
                              <button
                                type="button"
                                onClick={() => handleSendAssistantMessage("Ի՞նչ տուփերի տեսակներ կան և որո՞նք են նվազագույն պատվերի քանակները (MOQ)։")}
                                className="bg-capsule-surf border border-white/60 hover:border-capsule-accent/30 rounded-2xl p-3 text-left transition-all duration-300 cursor-pointer shadow-[3.5px_3.5px_7px_#E5E3DF,_-3.5px_-3.5px_7px_#FFFFFF] hover:shadow-[5px_5px_10px_#DCDAD5,_-5px_-5px_10px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#E5E3DF,inset_-2px_-2px_4px_#FFFFFF] active:scale-95 text-[10.5px] font-sans font-bold text-[#3D271B] hover:text-capsule-accent flex items-center gap-2"
                              >
                                <span className="text-sm">📦</span>
                                <div className="truncate flex-1">
                                  <span className="block font-black text-capsule-dark">Boxes &amp; MOQ</span>
                                  <span className="text-[9px] text-[#3D271B]/65 font-bold">Տուփերի տեսակներն ու MOQ-ն</span>
                                </div>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSendAssistantMessage("Ինչպիսի՞ թղթերի տեսակներ ու հաստություններ կան տոպրակների համար։")}
                                className="bg-capsule-surf border border-white/60 hover:border-capsule-accent/30 rounded-2xl p-3 text-left transition-all duration-300 cursor-pointer shadow-[3.5px_3.5px_7px_#E5E3DF,_-3.5px_-3.5px_7px_#FFFFFF] hover:shadow-[5px_5px_10px_#DCDAD5,_-5px_-5px_10px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#E5E3DF,inset_-2px_-2px_4px_#FFFFFF] active:scale-95 text-[10.5px] font-sans font-bold text-[#3D271B] hover:text-capsule-accent flex items-center gap-2"
                              >
                                <span className="text-sm">📄</span>
                                <div className="truncate flex-1">
                                  <span className="block font-black text-capsule-dark">Paper Qualities</span>
                                  <span className="text-[9px] text-[#3D271B]/65 font-bold">Տոպրակի թղթերն ու հաստությունները</span>
                                </div>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSendAssistantMessage("Ի՞նչ է Spot UV լաքը և ոսկետառ ֆոյլը տպագրության մեջ։")}
                                className="bg-capsule-surf border border-white/60 hover:border-capsule-accent/30 rounded-2xl p-3 text-left transition-all duration-300 cursor-pointer shadow-[3.5px_3.5px_7px_#E5E3DF,_-3.5px_-3.5px_7px_#FFFFFF] hover:shadow-[5px_5px_10px_#DCDAD5,_-5px_-5px_10px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#E5E3DF,inset_-2px_-2px_4px_#FFFFFF] active:scale-95 text-[10.5px] font-sans font-bold text-[#3D271B] hover:text-capsule-accent flex items-center gap-2"
                              >
                                <span className="text-sm">✦</span>
                                <div className="truncate flex-1">
                                  <span className="block font-black text-capsule-dark">Premium Finishes</span>
                                  <span className="text-[9px] text-[#3D271B]/65 font-bold">Spot UV և Ոսկետառ Ֆոյլ</span>
                                </div>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSendAssistantMessage("Ինչպե՞ս է կատարվում տոպրակների կամ տուփերի չափսի ընտրությունը։")}
                                className="bg-capsule-surf border border-white/60 hover:border-capsule-accent/30 rounded-2xl p-3 text-left transition-all duration-300 cursor-pointer shadow-[3.5px_3.5px_7px_#E5E3DF,_-3.5px_-3.5px_7px_#FFFFFF] hover:shadow-[5px_5px_10px_#DCDAD5,_-5px_-5px_10px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#E5E3DF,inset_-2px_-2px_4px_#FFFFFF] active:scale-95 text-[10.5px] font-sans font-bold text-[#3D271B] hover:text-capsule-accent flex items-center gap-2"
                              >
                                <span className="text-sm">📐</span>
                                <div className="truncate flex-1">
                                  <span className="block font-black text-capsule-dark">Sizing Framework</span>
                                  <span className="text-[9px] text-[#3D271B]/65 font-bold">Ինչպես չափել կամ ընտրել չափսը</span>
                                </div>
                              </button>
                            </div>

                            {/* Message Input - Debossed Capsule exactly like Screenshot 2 */}
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (!homepageAssistantInput.trim()) return;
                                handleSendAssistantMessage(homepageAssistantInput);
                              }}
                              className="w-full flex items-center bg-capsule-surf rounded-full pl-5 pr-2 py-2 shadow-[inset_3px_3px_6px_#E5E3DF,_inset_-3px_-3px_6px_#FFFFFF] border border-white/20 hover:border-capsule-accent/35 focus-within:border-capsule-accent focus-within:ring-4 focus-within:ring-capsule-accent/5 transition-all duration-300 gap-2"
                            >
                              <input
                                type="text"
                                value={homepageAssistantInput}
                                onChange={(e) => {
                                  setHomepageAssistantInput(e.target.value);
                                  if (e.target.value.trim().length > 0) {
                                    setIsConsoleActivated(true);
                                  }
                                }}
                                onFocus={() => setIsConsoleActivated(true)}
                                onClick={() => setIsConsoleActivated(true)}
                                placeholder="Message..."
                                className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-xs sm:text-[13px] text-capsule-dark font-semibold placeholder:text-gray-400"
                              />
                              {/* Round circular dark button with crisp arrow up icon */}
                              <button
                                type="submit"
                                disabled={!homepageAssistantInput.trim() || isAssistantTyping}
                                className="w-9 h-9 rounded-full bg-capsule-accent overflow-hidden flex items-center justify-center text-white shadow-[2px_2px_4px_rgba(0,0,0,0.1)] hover:bg-capsule-accent-light active:scale-[0.92] disabled:opacity-40 disabled:cursor-not-allowed select-none transition-all duration-200"
                              >
                                <ArrowUp size={16} strokeWidth={2.7} />
                              </button>
                            </form>
                          </div>

                          {/* Footnote matching screenshot 2 */}
                          <p className="text-[10px] sm:text-[11px] font-sans font-bold text-gray-400 select-none text-center">
                            Ask AI with instant topic prompts.
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* ==================== STYLE 1: SIGN UP VIEW (From Screenshot 1) ==================== */}
                          <LandingAuthPanel
                          locale={locale}
                          userEmail={userEmail}
                          setUserEmail={setUserEmail}
                          partnerDiscount={partnerDiscount}
                          setPartnerDiscount={setPartnerDiscount}
                          setIsClientCabinetOpen={setIsClientCabinetOpen}
                          setNeumorphicActiveTab={setNeumorphicActiveTab}
                          savedItemsCount={savedItemsCount}
                          setSavedItemsCount={setSavedItemsCount}
                          setBookmarkToastText={setBookmarkToastText}
                          setShowBookmarkToast={setShowBookmarkToast}
                          signUpSuccessMessage={signUpSuccessMessage}
                          setSignUpSuccessMessage={setSignUpSuccessMessage}
                          neumorphicEmail={neumorphicEmail}
                          setNeumorphicEmail={setNeumorphicEmail}
                          neumorphicPassword={neumorphicPassword}
                          setNeumorphicPassword={setNeumorphicPassword}
                        />
                        {false && (
                        <div className="flex flex-col items-center gap-5 max-w-lg mx-auto bg-[#FAFAF9] border-3 border-white rounded-[2.5rem] p-7 sm:p-9 shadow-[8px_8px_18px_#E5E3DF,_-8px_-8px_18px_#FFFFFF]">
                          
                          {/* Heading with Under-smile Line signature */}
                          <div className="flex flex-col items-center select-none pt-2 mb-2">
                            <h3 className="text-xl sm:text-2xl font-sans font-black tracking-widest text-[#1F2A2A] uppercase">
                              SIGN UP
                            </h3>
                            {/* Hand-curved smile-underline vector exactly matching image, now colored in signature hot orange! */}
                            <svg className="w-14 h-2.5 text-capsule-accent mt-1" viewBox="0 0 48 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2 2C12 6.5 36 6.5 46 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                          </div>

                          {/* Email Address Inset Pill (Concave) */}
                          <div className="w-full">
                            <div className="w-full flex items-center bg-[#FAFAF9] rounded-full px-5 py-3.5 shadow-[inset_4px_4px_8px_#E5E3DF,_inset_-4px_-4px_8px_#FFFFFF] border border-white/20 focus-within:border-capsule-accent/40 focus-within:ring-2 focus-within:ring-capsule-accent/10 transition-all duration-200">
                              <input
                                type="email"
                                value={neumorphicEmail}
                                onChange={(e) => {
                                  setNeumorphicEmail(e.target.value);
                                  setSignUpSuccessMessage("");
                                }}
                                placeholder="Email Address"
                                className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-xs sm:text-[13px] text-gray-700 font-semibold placeholder:text-[#A8AFBA]"
                              />
                            </div>
                          </div>

                          {/* Password Inset Pill (Concave) */}
                          <div className="w-full">
                            <div className="w-full flex items-center bg-[#FAFAF9] rounded-full px-5 py-3.5 shadow-[inset_4px_4px_8px_#E5E3DF,_inset_-4px_-4px_8px_#FFFFFF] border border-white/20 focus-within:border-capsule-accent/40 focus-within:ring-2 focus-within:ring-capsule-accent/10 transition-all duration-200">
                              <input
                                type="password"
                                value={neumorphicPassword}
                                onChange={(e) => {
                                  setNeumorphicPassword(e.target.value);
                                  setSignUpSuccessMessage("");
                                }}
                                placeholder="Password"
                                className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-xs sm:text-[13px] text-gray-700 font-semibold placeholder:text-[#A8AFBA]"
                              />
                            </div>
                          </div>

                          {/* Interactive Result Error / Success block */}
                          <AnimatePresence>
                            {signUpSuccessMessage && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full rounded-2xl p-3.5 bg-[#ff2300]/5 border-2 border-[#ff2300]/20 text-capsule-accent text-[11px] font-bold text-center leading-normal shadow-[inset_2px_2px_5px_rgba(255,35,0,0.05),_2px_2px_4px_rgba(0,0,0,0.02)]"
                              >
                                {signUpSuccessMessage}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Convex Pill button is styled exactly as Signature Hot Orange "Log in" container with dark overlay hover state */}
                          <div className="w-full">
                            <button
                              type="button"
                              onClick={() => {
                                if (!neumorphicEmail.trim() || !neumorphicPassword.trim()) {
                                  setSignUpSuccessMessage("⚠️ Խնդրում ենք լրացնել թե՛ Էլ. փոստը և թե՛ Գաղտնաբառը / Please fill both fields!");
                                  return;
                                }
                                // Simulated register success
                                setSignUpSuccessMessage("✨ Գրանցումը կատարված է։ Զեղչի Կոդ CAPSULE10-ն ավտոմատ կիրառվել է Ձեր զամբյուղում: / Registration successful!");
                                handleApplyCartPromo("CAPSULE10");
                                
                                setBookmarkToastText("🎟️ CAPSULE10 պրոմո-կոդն ակտիվացավ!");
                                setShowBookmarkToast(true);
                                setTimeout(() => setShowBookmarkToast(false), 3000);
                              }}
                              className="group w-full flex items-center justify-center gap-2.5 bg-[#FAFAF9] hover:bg-capsule-accent rounded-full py-4 text-capsule-accent hover:text-white font-sans font-extrabold text-xs sm:text-[13px] tracking-wider uppercase border-2 border-white shadow-[4px_4px_10px_rgba(163,153,139,0.35),_-4px_-4px_10px_#FFFFFF] hover:shadow-[6px_6px_12px_rgba(244,90,29,0.25),_-6px_-6px_12px_#FFFFFF] active:shadow-[inset_2px_2px_5px_#E5E3DF,_inset_-2px_-2px_5px_#FFFFFF] active:scale-[0.98] transition-all duration-300 cursor-pointer select-none"
                            >
                              <Lock size={13} className="text-capsule-accent group-hover:text-white transition-colors duration-200" />
                              <span className="transition-colors duration-200">Log in</span>
                            </button>
                          </div>

                          {/* Control Row Containing the Three Raised Neumorphic Squares */}
                          <div className="flex items-center justify-center gap-7 w-full py-1">
                            
                            {/* Square Button 1: Arrow Left */}
                            <button
                              type="button"
                              onClick={() => {
                                setNeumorphicActiveTab("ai_chat");
                                setBookmarkToastText("Վերադարձ AI Chat");
                                setShowBookmarkToast(true);
                                setTimeout(() => setShowBookmarkToast(false), 1200);
                              }}
                              className="group w-12 h-12 rounded-2xl flex items-center justify-center bg-[#FAFAF9] text-[#1F2A2A] hover:text-capsule-accent border border-white shadow-[4px_4px_8px_#E5E3DF,_-4px_-4px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#DCDAD5,_-5px_-5px_10px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#E5E3DF,inset_-2px_-2px_4px_#FFFFFF] active:scale-95 transition-all duration-200 cursor-pointer"
                              title="Go to AI Chat"
                            >
                              <ArrowLeft size={16} strokeWidth={2.5} className="group-hover:translate-x-[-2px] transition-transform duration-200" />
                            </button>

                            {/* Square Button 2: Saved Item Bookmark */}
                            <button
                              type="button"
                              onClick={() => {
                                const newCount = savedItemsCount + 1;
                                  setSavedItemsCount(newCount);
                                  setBookmarkToastText(`Saved! Profile Spec Entries: ${newCount} 🔖`);
                                  setShowBookmarkToast(true);
                                  setTimeout(() => setShowBookmarkToast(false), 2000);
                              }}
                              className="group w-12 h-12 rounded-2xl flex items-center justify-center bg-[#FAFAF9] text-[#1F2A2A] hover:text-capsule-accent border border-white shadow-[4px_4px_8px_#E5E3DF,_-4px_-4px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#DCDAD5,_-5px_-5px_10px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#E5E3DF,inset_-2px_-2px_4px_#FFFFFF] active:scale-95 transition-all text-xs relative cursor-pointer"
                              title="Bookmark Current Specifications"
                            >
                              <Bookmark size={15} className="mr-0.5 group-hover:scale-110 transition-transform duration-200" />
                              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-capsule-accent text-white font-sans font-black text-[9px] flex items-center justify-center border-2 border-white shadow-3xs">
                                {savedItemsCount}
                              </span>
                            </button>

                            {/* Square Button 3: Settings Gear */}
                            <button
                              type="button"
                              onClick={() => setNeumorphicSettingsOpen(!neumorphicSettingsOpen)}
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-[#FAFAF9] border transition-all duration-200 cursor-pointer ${
                                neumorphicSettingsOpen
                                  ? "text-capsule-accent shadow-[inset_3px_3px_5px_#E5E3DF,_inset_-3px_-3px_5px_#FFFFFF] border-[#ff2300]/20"
                                  : "text-[#1F2A2A] hover:text-capsule-accent border-white shadow-[4px_4px_8px_#E5E3DF,_-4px_-4px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#DCDAD5,_-5px_-5px_10px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#E5E3DF,inset_-2px_-2px_4px_#FFFFFF] active:scale-95"
                              }`}
                              title="Preferences Settings"
                            >
                              <Settings size={15} className={neumorphicSettingsOpen ? "animate-spin-slow text-capsule-accent" : ""} />
                            </button>
                          </div>

                          {/* Expandable Settings Dropdown matching the Neumorphic styling */}
                          <AnimatePresence>
                            {neumorphicSettingsOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="w-full bg-[#FAFAF9] shadow-[inset_3px_3px_6px_#E5E3DF,_inset_-3px_-3px_6px_#FFFFFF] rounded-2xl p-4 border border-white/20 space-y-3 overflow-hidden"
                              >
                                <span className="text-[9px] font-mono tracking-widest font-black uppercase text-[#3D271B]/60 block border-b border-gray-200/80 pb-1.5">
                                  Ambient Console Preferences
                                </span>
                                
                                <div className="flex items-center justify-between text-[11px] font-bold text-[#1F2A2A]">
                                  <span>Sound Alerts:</span>
                                  <button
                                    type="button"
                                    onClick={() => setNeumorphicVolume(!neumorphicVolume)}
                                    className={`w-8 h-8 rounded-xl flex items-center justify-center bg-[#FAFAF9] border transition-all cursor-pointer ${
                                      neumorphicVolume
                                        ? "text-capsule-accent shadow-[3px_3px_6px_#E5E3DF,_-3px_-2px_6px_#FFFFFF] border-[#ff2300]/10"
                                        : "text-[#3D271B]/60 shadow-[inset_2px_2px_4px_#E5E3DF,_inset_-2px_-2px_4px_#FFFFFF]"
                                    }`}
                                  >
                                    {neumorphicVolume ? <Volume2 size={13} /> : <VolumeX size={13} />}
                                  </button>
                                </div>

                                <div className="flex items-center justify-between text-[11px] font-bold text-[#1F2A2A]">
                                  <span>Reset Inputs:</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setNeumorphicEmail("");
                                      setNeumorphicPassword("");
                                      setNeumorphicSearchInput("");
                                      setSignUpSuccessMessage("");
                                      setBookmarkToastText("Console Fields Reset");
                                      setShowBookmarkToast(true);
                                      setTimeout(() => setShowBookmarkToast(false), 1500);
                                    }}
                                    className="px-3 py-1.5 text-[9px] uppercase font-black tracking-wider bg-[#FAFAF9] text-[#1F2A2A] rounded-lg shadow-[2px_2px_4px_#E5E3DF,_-2px_-2px_4px_#FFFFFF] border border-white hover:text-capsule-accent hover:border-capsule-accent/20 active:scale-95 transition-all"
                                  >
                                    Clear
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Bottom Search Form Fields exactly matching Screenshot 1 layout */}
                          <div className="w-full flex items-center gap-4 border-t border-gray-200/50 pt-5 mt-1 select-none">
                            {/* Search Inset Capsule (Concave) */}
                            <div className="flex-1">
                              <div className="w-full flex items-center bg-[#FAFAF9] rounded-full px-5 py-3 shadow-[inset_3.5px_3.5px_6px_#E5E3DF,_inset_-3.5px_-3.5px_6px_#FFFFFF] border border-white/20 focus-within:border-capsule-accent/40 focus-within:ring-2 focus-within:ring-capsule-accent/10 transition-all duration-200">
                                <input
                                  type="text"
                                  value={neumorphicSearchInput}
                                  onChange={(e) => setNeumorphicSearchInput(e.target.value)}
                                  placeholder="Email Address"
                                  className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-xs sm:text-[13px] text-gray-700 font-semibold placeholder:text-[#A8AFBA]"
                                />
                              </div>
                            </div>

                            {/* Square Search Button (Convex) */}
                            <button
                              type="button"
                              onClick={() => {
                                const term = neumorphicSearchInput.trim().toLowerCase();
                                if (!term) {
                                  setBookmarkToastText("Որոնման համար գրեք բանալի բառ / Enter keyword!");
                                  setShowBookmarkToast(true);
                                  setTimeout(() => setShowBookmarkToast(false), 2000);
                                  return;
                                }

                                // TODO: Real API call to the product catalog should go here
                              }}
                              className="group w-[44px] h-[44px] rounded-2xl flex items-center justify-center bg-[#FAFAF9] text-[#1F2A2A] hover:text-capsule-accent border-2 border-white shadow-[4px_4px_8px_#E5E3DF,_-4px_-4px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#DCDAD5,_-5px_-5px_10px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#E5E3DF,inset_-2px_-2px_4px_#FFFFFF] active:scale-95 transition-all text-xs shrink-0 cursor-pointer"
                              title="Search specifications catalog"
                            >
                              <Search size={16} strokeWidth={2.7} className="group-hover:scale-110 transition-transform duration-200" />
                            </button>
                          </div>
                        </div>
                        )}
                        </>
                      )}
                    </div>

                    {/* Footer helper logo and status conforming to Neumorphic styles */}
                    <div className="flex items-center justify-center gap-2 select-none opacity-45 pb-0.5 pt-1 text-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                      <span className="text-[9px] font-sans font-bold tracking-widest uppercase text-[#3D271B]/60">
                        Concept Haptic Interface Grounding Active
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              )}

            </div>
          ) : (
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mt-6">
              {/* Premium, Sleek Back Arrow Button */}
              <div className="flex items-center justify-between mb-4 select-none gap-2">
                <button
                  onClick={() => {
                    setActiveCategory("");
                    setCalcResult(null);
                    setCalcError(null);
                  }}
                  className="group inline-flex items-center gap-1.5 sm:gap-2.5 px-3.5 py-2 sm:px-5 sm:py-2.5 bg-[#FAFAF9] border border-white/60 shadow-[2px_2px_5px_#E5E3DF,_-2px_-2px_5px_#FFFFFF] hover:shadow-[3px_3px_7px_#E5E3DF,_-3px_-3px_7px_#FFFFFF] text-[#3D271B] hover:text-capsule-accent hover:scale-[1.02] active:scale-[0.98] rounded-full font-bold text-[10px] sm:text-xs transition-all duration-300 cursor-pointer"
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-300 text-capsule-accent" />
                  <span className="uppercase tracking-wider">
                    <span className="hidden sm:inline">Դեպի Գլխավոր / Back</span>
                    <span className="inline sm:hidden">Հետ</span>
                  </span>
                </button>
                
                {(() => {
                  const catObj = categories.find((c) => c.id === activeCategory);
                  return catObj ? (
                    <div className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider sm:tracking-widest text-[#3D271B] font-black bg-[#FAFAF9] px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-white/80 shadow-[2px_2px_4px_#E5E3DF,_-2px_-2px_4px_#FFFFFF] truncate max-w-[180px] sm:max-w-none">
                      {t(`db.category.${catObj.id}.navLabel`, catObj.navLabel || catObj.name)}
                    </div>
                  ) : null;
                })()}
              </div>

               {/* Categorized workspace selection */}
              <div className="relative">
                {/* Left & Right Dynamic Elegant Inset Shadows for Mobile Scrolling Cue */}
                <div 
                  className="pointer-events-none absolute left-1 top-1 bottom-1 w-8 bg-gradient-to-r from-[#FAFAF9] to-transparent z-10 md:hidden rounded-l-full transition-opacity duration-300"
                  style={{ opacity: scrollProgress > 0.05 ? 1 : 0 }}
                />
                <div 
                  className="pointer-events-none absolute right-1 top-1 bottom-1 w-8 bg-gradient-to-l from-[#FAFAF9] to-transparent z-10 md:hidden rounded-r-full transition-opacity duration-300"
                  style={{ opacity: scrollProgress < 0.95 ? 1 : 0 }}
                />

                <div 
                  ref={categoryTabsRef}
                  onScroll={handleTabsScroll}
                  className="flex items-center gap-1 sm:gap-1.5 p-1 bg-[#FAFAF9] border border-[#E9E4DB]/40 rounded-full shadow-[inset_2px_2px_4px_rgba(58,32,16,0.05),_inset_-2px_-2px_6px_rgba(255,255,255,0.85)] w-full overflow-x-auto no-scrollbar scroll-smooth flex-nowrap md:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  <button
                    onClick={() => setActiveCategory("")}
                    className={`px-3.5 py-1.5 sm:px-4.5 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-normal transition-all duration-300 uppercase cursor-pointer flex items-center justify-center shrink-0 select-none whitespace-nowrap active:scale-[0.97] ${
                      activeCategory === ""
                        ? "bg-capsule-accent text-white shadow-[2px_2px_5px_rgba(58,32,16,0.18),_-1px_-1px_4px_rgba(255,255,255,0.15)] font-bold scale-[1.01]"
                        : "bg-[#FAFAF9]/40 text-[#3D271B]/70 hover:text-[#3D271B] hover:bg-white/80 shadow-[1px_1px_3px_rgba(58,32,16,0.02)] hover:shadow-[2px_2px_5px_rgba(58,32,16,0.04)] hover:scale-[1.01]"
                    }`}
                  >
                    <span>{t("menu.all", "ԳԼԽԱՎՈՐ (All)")}</span>
                  </button>
                  {categories.map((c) => {
                    if (!c.active) return null;
                    const isSelected = activeCategory === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          setActiveCategory(c.id);
                          setCalcResult(null);
                          setCalcError(null);
                        }}
                        className={`px-3.5 py-1.5 sm:px-4.5 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-normal transition-all duration-300 uppercase cursor-pointer flex items-center justify-center shrink-0 select-none whitespace-nowrap active:scale-[0.97] ${
                          isSelected 
                            ? "bg-capsule-accent text-white shadow-[2px_2px_5px_rgba(58,32,16,0.18),_-1px_-1px_4px_rgba(255,255,255,0.15)] font-bold scale-[1.01]"
                            : "bg-[#FAFAF9]/40 text-[#3D271B]/70 hover:text-[#3D271B] hover:bg-white/80 shadow-[1px_1px_3px_rgba(58,32,16,0.02)] hover:shadow-[2px_2px_5px_rgba(58,32,16,0.04)] hover:scale-[1.01]"
                        }`}
                      >
                        <span>{t(`db.category.${c.id}.navLabel`, c.navLabel || c.name)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sleek, Premium Interactive Scroll Track & Instructions */}
              {hasScrollableTabs && (
                <div className="flex flex-col items-center gap-1 mt-2.5 md:hidden">
                  <div className="w-12 h-1 bg-[#FAFAF9] border border-[#E9E4DB]/40 shadow-[inset_1px_1px_2px_rgba(58,32,16,0.08)] rounded-full relative overflow-hidden">
                    <div 
                      className="absolute top-0 bottom-0 left-0 w-4 bg-capsule-accent/60 shadow-[1px_1px_2px_rgba(58,32,16,0.1)] rounded-full transition-transform duration-100 ease-out"
                      style={{ 
                        transform: `translateX(${scrollProgress * 32}px)` 
                      }}
                    />
                  </div>
                  <span className="text-[9px] text-capsule-text-muted font-bold tracking-wider select-none uppercase">
                    {t("menu.scroll_hint", "Սահեցրեք՝ բոլոր բաժինները տեսնելու համար")}
                  </span>
                </div>
              )}
            </div>
          )}

          {activeCategory && (
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mt-6 flex flex-col gap-8 pb-10">
              {/* ACTIVE CATEGORY HERO HEADERS */}
          {(() => {
            const catObj = categories.find((c) => c.id === activeCategory);
            if (!catObj) return null;
            return (
              <div className="bg-capsule-surf border border-capsule-accent/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm relative overflow-hidden">
                <div className="space-y-1.5 flex-1 select-text">
                  <h2 className="font-serif font-normal text-xl sm:text-2xl tracking-wide text-capsule-accent">
                    {t(`db.category.${catObj.id}.heroTitle`, catObj.heroTitle || catObj.name)}
                  </h2>
                  <p className="text-xs text-capsule-text-secondary pr-4 leading-relaxed">
                    {t(`db.category.${catObj.id}.heroDesc`, catObj.heroDesc)}
                  </p>
                </div>
                {catObj.heroBadge && (
                  <div className="flex flex-col items-center justify-center text-center bg-capsule-accent/5 border border-capsule-accent/20 rounded-xl px-5 py-3 tracking-widest uppercase font-serif shrink-0 select-none">
                    <span className="text-xl font-medium text-capsule-accent leading-none">{t(`db.category.${catObj.id}.heroBadge`, catObj.heroBadge)}</span>
                    <span className="text-[10px] text-capsule-text-muted mt-0.5 leading-none font-sans font-semibold">{t(`db.category.${catObj.id}.heroSmall`, catObj.heroSmall || "ԱԿՑԻԱ")}</span>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ─────────────────── BAG CALCULATORS ─────────────────── */}
          {(activeTemplate === "bags") && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column Settings */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Card 1: Colors & Printing Method */}
                <div className="neu-convex-surf rounded-3xl p-6 space-y-4 relative overflow-hidden">
                  <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                    <Palette size={14} className="text-capsule-accent" />
                    <span>{t("calc.section_1_title", "Բաժին 1. Տպագրության Գունայնություն և Մեթոդ")}</span>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Colors Shade Option */}
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider font-mono">{t("common.colors", "Գունայնություն / Գույների Քանակ")}</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { val: 1, label: t("colors.monochrome", "Մոնոքրոմ"), desc: t("colors.monochrome_desc", "Սև-Սպիտակ / 1 Գույն") },
                          { val: 2, label: t("colors.pantone", "Պանտոն"), desc: t("colors.pantone_desc", "2 Գույն / Pantone") },
                          { val: 4, label: t("colors.cmyk", "CMYK"), desc: t("colors.cmyk_desc", "Լիագույն / CMYK") },
                          { val: 5, label: t("colors.complex", "CMYK + Pantone"), desc: t("colors.complex_desc", "Կոմպլեքս / Premium") }
                        ].map((item) => (
                          <button
                            key={item.val}
                            onClick={() => {
                              setColors(item.val);
                              setCalcResult(null);
                            }}
                            className={`py-3 px-2 rounded-2xl text-center cursor-pointer transition-all duration-300 flex flex-col justify-center items-center gap-0.5 min-h-[50px] ${
                              colors === item.val 
                                ? "neu-brand-active scale-[1.03]" 
                                : "bg-[#FAFAF9] shadow-[4px_4px_10px_#D5D0C8,_-4px_-4px_10px_#FFFFFF] border border-white/60 text-[#3D271B]/60 hover:text-[#3D271B] hover:scale-[1.01] active:scale-[0.98]"
                            }`}
                          >
                            <span className={`text-[11px] tracking-tight font-bold ${colors === item.val ? "text-white" : "text-[#3D271B]"}`}>{item.label}</span>
                            <span className={`text-[8px] leading-none opacity-85 select-none text-center ${colors === item.val ? "text-white/90" : "text-[#3D271B]/60"}`}>{item.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Printing Method Select Option */}
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider font-mono">{t("common.printing_tech", "Տպագրության Տեխնոլոգիա (Մեթոդ)")}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setMethod("auto");
                            setCalcResult(null);
                          }}
                          className={`py-3 px-4 rounded-2xl text-left cursor-pointer transition-all duration-300 flex flex-col justify-center min-h-[50px] ${
                            method === "auto" || method === ""
                              ? "neu-brand-active scale-[1.03]"
                              : "bg-[#FAFAF9] shadow-[4px_4px_10px_#D5D0C8,_-4px_-4px_10px_#FFFFFF] border border-white/60 text-[#3D271B]/60 hover:text-[#3D271B] hover:scale-[1.01] active:scale-[0.98]"
                          }`}
                        >
                          <span className={`text-[11px] font-bold tracking-tight ${method === "auto" || method === "" ? "text-white" : "text-[#3D271B]"}`}>✨ {t("printing.auto", "Ավտոմատ")}</span>
                          <span className={`text-[8px] leading-none mt-0.5 ${method === "auto" || method === "" ? "text-white/90" : "text-[#3D271B]/60"}`}>{t("printing.optimum_cheapest", "Օպտիմալ / Ամենաէժան")}</span>
                        </button>
                        {printingMethods
                          .filter((m) => m.active && m.allowedCategories?.includes(activeCategory))
                          .map((m) => {
                            const isSelected = method === m.id;
                            return (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => {
                                  setMethod(m.id);
                                  setCalcResult(null);
                                }}
                                className={`py-3 px-4 rounded-2xl text-left cursor-pointer transition-all duration-300 flex flex-col justify-center min-h-[50px] ${
                                  isSelected
                                    ? "neu-brand-active scale-[1.03]"
                                    : "bg-[#FAFAF9] shadow-[4px_4px_10px_#D5D0C8,_-4px_-4px_10px_#FFFFFF] border border-white/60 text-[#3D271B]/60 hover:text-[#3D271B] hover:scale-[1.01] active:scale-[0.98]"
                                }`}
                              >
                                <span className={`text-[11px] font-bold tracking-tight ${isSelected ? "text-white" : "text-[#3D271B]"}`}>{t(`db.print_method.${m.id}`, m.name)}</span>
                                <span className={`text-[8px] leading-none mt-0.5 ${isSelected ? "text-white/90" : "text-[#3D271B]/60"}`}>{t("printing.min_qty", "Մին.")} {m.minQty} {t("common.units.pcs", "հատ")}</span>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Sides & Design Option */}
                <div className="neu-convex-surf rounded-3xl p-6 space-y-4">
                  <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                    <FileText size={14} className="text-capsule-accent" />
                    <span>{t("calc.section_2_title", "Բաժին 2. Դիզայն և Տեղադրություն")}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider font-mono">{t("common.sides", "Տպագրության Կողմեր")}</span>
                      <div className="grid grid-cols-2 gap-2">
                        {[1, 2].map((sd) => {
                          const isSelected = sides === sd;
                          return (
                            <button
                              key={sd}
                              onClick={() => {
                                setSides(sd);
                                setCalcResult(null);
                              }}
                              className={`py-3 rounded-2xl text-[11px] font-bold transition-all duration-300 cursor-pointer ${
                                isSelected 
                                  ? "neu-brand-active scale-[1.03]" 
                                  : "bg-[#FAFAF9] shadow-[4px_4px_10px_#D5D0C8,_-4px_-4px_10px_#FFFFFF] border border-white/60 text-[#3D271B]/60 hover:text-[#3D271B] hover:scale-[1.01] active:scale-[0.98]"
                              }`}
                            >
                              <span className={isSelected ? "text-white" : "text-[#3D271B]"}>
                                {sd === 1 ? t("options.sides_1", "Միակողմանի") : t("options.sides_2", "Երկկողմանի")}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider font-mono">{t("common.design_file", "Դիզայնի Ֆայլ")}</span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: "ready", label: t("options.design_ready", "Պատրաստի Ֆայլ") },
                          { key: "help", label: t("options.design_help", "Օգնել դիզայնում") }
                        ].map((dObj) => {
                          const isSelected = design === dObj.key;
                          return (
                            <button
                              key={dObj.key}
                              onClick={() => {
                                setDesign(dObj.key as any);
                                setCalcResult(null);
                              }}
                              className={`py-3 rounded-2xl text-[11px] font-bold transition-all duration-300 cursor-pointer ${
                                isSelected 
                                  ? "neu-brand-active scale-[1.03]" 
                                  : "bg-[#FAFAF9] shadow-[4px_4px_10px_#D5D0C8,_-4px_-4px_10px_#FFFFFF] border border-white/60 text-[#3D271B]/60 hover:text-[#3D271B] hover:scale-[1.01] active:scale-[0.98]"
                              }`}
                            >
                              <span className={isSelected ? "text-white" : "text-[#3D271B]"}>
                                {dObj.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Post-press Finishes */}
                <div className="neu-convex-surf rounded-3xl p-6 space-y-4">
                  <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                    <Sparkles size={14} className="text-capsule-accent" />
                    <span>{t("calc.section_3_title", "Բาժին 3. Լրացուցիչ Մշակումներ (Դեկորներ)")}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider font-mono mb-2">{t("calc.effects_subtitle", "Ընտրեք ցանկալի էֆեկտները")}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {finishes.filter(f => f.active && f.categoryId === activeCategory).map((fin) => {
                        const isSel = selectedFinishes.includes(fin.key);
                        return (
                          <button
                            key={fin.key}
                            onClick={() => {
                              if (isSel) {
                                setSelectedFinishes(selectedFinishes.filter(k => k !== fin.key));
                              } else {
                                setSelectedFinishes([...selectedFinishes, fin.key]);
                              }
                            }}
                            className={`flex items-center gap-3 p-3 text-left rounded-2xl transition-all duration-300 cursor-pointer text-xs font-bold ${
                              isSel 
                                ? "neu-brand-active scale-[1.03]" 
                                : "bg-[#FAFAF9] shadow-[4px_4px_10px_#D5D0C8,_-4px_-4px_10px_#FFFFFF] border border-white/60 text-[#3D271B]/60 hover:text-[#3D271B] hover:scale-[1.01] active:scale-[0.98]"
                            }`}
                          >
                            <span className={`rounded-xl py-1 px-1.5 border ${isSel ? "bg-white/10 border-white/20 text-white" : "bg-capsule-bg/40 border-[#D5D0C8]"}`}>{fin.icon}</span>
                            <span className={`flex-1 truncate ${isSel ? "text-white" : "text-[#3D271B]"}`}>{t(`db.finish.${fin.key}`, fin.label)}</span>
                            <span className={`font-mono text-[9px] ${isSel ? "text-white/80" : "text-[#3D271B]/60"}`}>+{formatPrice(fin.price)} / {t("common.units.pcs", "հատ")}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Sizes sub tabs */}
                <div className="flex p-1 bg-[#FAFAF9] shadow-[inset_2px_2px_5px_#E5E3DF,_inset_-2px_-2px_5px_#FFFFFF] border border-[#E9E4DB]/40 rounded-full w-full max-w-md select-none mt-2">
                  {[
                    { key: "select", lbl: t("options.tab_select", "Ընտրել Չափս") },
                    { key: "custom", lbl: t("options.tab_custom", "Անհատական Չափս") },
                    { key: "table", lbl: t("options.tab_table", "Աղյուսակ") }
                  ].map((sub) => {
                    const isSelected = calcTab === sub.key;
                    return (
                      <button
                        key={sub.key}
                        onClick={() => setCalcTab(sub.key as any)}
                        className={`flex-1 py-2 text-[10px] sm:text-xs font-bold uppercase rounded-full text-center cursor-pointer transition-all duration-300 ${
                          isSelected 
                            ? "bg-capsule-accent text-white shadow-[2px_2px_5px_rgba(58,32,16,0.22)] scale-[1.02]" 
                            : "text-[#3D271B]/60 hover:text-[#3D271B] hover:scale-[1.01] active:scale-[0.98]"
                        }`}
                      >
                        {sub.lbl}
                      </button>
                    );
                  })}
                </div>

                {/* Sub Tab: PRESETS SIZE SELECT */}
                {calcTab === "select" && (
                  <div className="space-y-4 neu-convex-surf rounded-3xl p-6">
                    {/* Header */}
                    <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                      <Expand size={14} className="text-capsule-accent" />
                      <span>{t("calc.section_4_title", "Բաժին 4. Չափսի, Թղթի և Քանակի Ընտրություն (Ստանդարտ)")}</span>
                    </div>

                    {/* Preset Sizes block */}
                    <div className="bg-[#FAFAF9]/50 border border-white/60 shadow-[inset_2px_2px_5px_#E5E3DF,_inset_-2px_-2px_1px_#FFFFFF] rounded-2xl p-4 space-y-3">
                      <div className="text-[10px] font-bold text-capsule-accent uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Expand size={12} className="text-capsule-accent" />
                        <span>{t("common.dimensions", "Չափսեր (սմ)")}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {dimensions
                          .filter((d) => d.active && d.categoryId === activeCategory)
                          .map((dElement, index) => {
                            const isSelected = selectedSizeIndex === index;
                            return (
                              <button
                                key={dElement.id}
                                type="button"
                                onClick={() => {
                                  setSelectedSizeIndex(index);
                                  setCalcResult(null);
                                }}
                                className={`p-3 rounded-2xl text-center cursor-pointer transition-all duration-300 flex flex-col justify-center items-center min-h-[52px] ${
                                  isSelected
                                    ? "neu-brand-active scale-[1.03]"
                                    : "bg-[#FAFAF9] shadow-[4px_4px_10px_#D5D0C8,_-4px_-4px_10px_#FFFFFF] border border-white/60 text-[#3D271B]/60 hover:text-[#3D271B] hover:scale-[1.01] active:scale-[0.98]"
                                }`}
                              >
                                <span className={`text-[11px] font-bold tracking-tight font-sans ${isSelected ? "text-white" : "text-[#3D271B]"}`}>
                                  {dElement.dim} <span className={`text-[8px] font-normal leading-none ${isSelected ? "text-white/85" : "text-[#3D271B]/65"}`}>{t("common.units.cm", "սմ")}</span>
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    </div>

                    {/* Paper Selection block */}
                    <div className="bg-[#FAFAF9]/50 border border-white/60 shadow-[inset_2px_2px_5px_#E5E3DF,_inset_-2px_-2px_1px_#FFFFFF] rounded-2xl p-4 space-y-3">
                      <div className="text-[10px] font-bold text-capsule-accent uppercase tracking-wider font-mono flex items-center gap-1.5 font-normal">
                        <FileText size={12} className="text-capsule-accent" />
                        <span>{t("common.paper", "Թղթի Տեսակ և Խտություն (Paper Options)")}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {papers
                          .filter((p) => p.active && p.assignedProducts.includes(activeCategory))
                          .map((p) => {
                            const isSelected = selectedPaperId === p.id;
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => {
                                  setSelectedPaperId(p.id);
                                  setGsm(p.gsm);
                                  setCalcResult(null);
                                }}
                                className={`p-3 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-center min-h-[54px] ${
                                  isSelected
                                    ? "neu-brand-active scale-[1.03]"
                                    : "bg-[#FAFAF9] shadow-[4px_4px_10px_#D5D0C8,_-4px_-4px_10px_#FFFFFF] hover:shadow-[0_8px_15px_-3px_rgba(31,42,42,0.06)] active:shadow-[inset_2px_2px_4px_#D5D0C8,_inset_-2px_-2px_4px_#FFFFFF] border border-white/60 text-[#3D271B]/60 hover:text-[#3D271B] hover:scale-[1.01] active:scale-[0.98]"
                                }`}
                              >
                                <span className={`text-[11px] font-bold leading-tight truncate w-full ${isSelected ? "text-white" : "text-[#3D271B]"}`}>{t(`db.paper.${p.id}`, p.name)}</span>
                                <span className={`text-[8px] font-bold font-mono mt-0.5 ${isSelected ? "text-white/90" : "text-capsule-accent"}`}>
                                  {p.gsm} {t("common.units.g", "Gsm")}
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    </div>

                    {/* Sub-block: Lamination & Handles */}
                    <div className="bg-[#FAFAF9]/50 border border-white/60 shadow-[inset_2px_2px_5px_#E5E3DF,_inset_-2px_-2px_1px_#FFFFFF] rounded-2xl p-4 space-y-4">
                      <div className="text-[10px] font-bold text-capsule-accent uppercase tracking-wider font-mono">{t("common.lamination_and_handles", "Լամինացիա և Բռնակներ")}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider">{t("common.lamination", "Լամինացիայի Տեսակ")}</span>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            {[
                              { val: "matte", label: t("options.lamination_matte", "Փայլատ") },
                              { val: "gloss", label: t("options.lamination_gloss", "Փայլուն") },
                              { val: "soft_touch", label: t("options.lamination_soft_touch", "Soft-Touch") },
                              { val: "none", label: t("options.lamination_none", "Առանց") }
                            ].map((item) => (
                              <button
                                key={item.val}
                                type="button"
                                onClick={() => {
                                  setLamination(item.val as any);
                                  setCalcResult(null);
                                }}
                                className={`py-2 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                                  lamination === item.val
                                    ? "neu-brand-active scale-[1.03]"
                                    : "bg-[#FAFAF9] shadow-[4px_4px_10px_#D5D0C8,_-4px_-4px_10px_#FFFFFF] border border-white/60 text-[#3D271B]/60 hover:text-[#3D271B] hover:scale-[1.01] active:scale-[0.98]"
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider font-mono">{t("common.handle", "Բռնակներ")}</span>
                          <div className="grid grid-cols-2 gap-3 mt-1">
                            {[
                              { key: "cord", label: t("options.handle_cord", "Պարանային Շնուր") },
                              { key: "ribbon", label: t("options.handle_ribbon", "Սատինե Ժապավեն") }
                            ].map((hb) => (
                              <button
                                key={hb.key}
                                onClick={() => {
                                  setHandle(hb.key as any);
                                  if (hb.key === "ribbon") {
                                    const activeRibs = (bagRibbonHandles || []).filter(h => h.active);
                                    const defaultPrice = activeRibs.length > 0 ? activeRibs[0].price : 75;
                                    setRibbonWidthPrice(defaultPrice);
                                  }
                                  setCalcResult(null);
                                }}
                                className={`py-2 rounded-2xl text-[11px] font-bold transition-all duration-300 cursor-pointer ${
                                  handle === hb.key
                                    ? "neu-brand-active scale-[1.03]"
                                    : "bg-[#FAFAF9] shadow-[4px_4px_10px_#D5D0C8,_-4px_-4px_10px_#FFFFFF] border border-white/60 text-[#3D271B]/60 hover:text-[#3D271B] hover:scale-[1.01] active:scale-[0.98]"
                                }`}
                              >
                                {hb.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {handle === "ribbon" && (
                        <div className="space-y-1 border-t border-capsule-accent/5 pt-3">
                          <span className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider">{t("common.ribbon_width", "Ժապավենի Լայնություն")}</span>
                          <div className="grid grid-cols-4 gap-2 mt-1">
                            {(bagRibbonHandles.length > 0 ? bagRibbonHandles.filter(h => h.active) : [
                              { id: "rw_1_2", widthCm: 1.2, label: "1.2 սմ", price: 55, active: true },
                              { id: "rw_2_0", widthCm: 2.0, label: "2.0 սմ", price: 75, active: true },
                              { id: "rw_2_5", widthCm: 2.5, label: "2.5 սմ", price: 95, active: true },
                              { id: "rw_3_0", widthCm: 3.0, label: "3.0 սմ", price: 120, active: true }
                            ]).map((rib) => (
                              <button
                                key={rib.id || rib.label}
                                type="button"
                                onClick={() => {
                                  setRibbonWidthPrice(rib.price);
                                  setCalcResult(null);
                                }}
                                className={`py-2 rounded-2xl text-[11px] font-bold text-center transition-all duration-300 cursor-pointer ${
                                  ribbonWidthPrice === rib.price
                                    ? "neu-brand-active scale-[1.03]"
                                    : "bg-[#FAFAF9] shadow-[4px_4px_10px_#D5D0C8,_-4px_-4px_10px_#FFFFFF] border border-white/60 text-[#3D271B]/60 hover:text-[#3D271B] hover:scale-[1.01] active:scale-[0.98]"
                                }`}
                              >
                                <div className={ribbonWidthPrice === rib.price ? "text-white" : "text-[#3D271B]"}>{rib.label ? (rib.label.includes("սմ") ? rib.label.replace("սմ", t("common.units.cm", "սմ")) : rib.label) : rib.label}</div>
                                <div className={`text-[8px] font-bold font-mono mt-0.5 ${ribbonWidthPrice === rib.price ? "text-white/90" : "text-capsule-accent"}`}>{formatPrice(rib.price)}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sub-block: Quantity */}
                    <div className="bg-[#FAFAF9]/50 border border-white/60 shadow-[inset_2px_2px_5px_#E5E3DF,_inset_-2px_-2px_1px_#FFFFFF] rounded-2xl p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <span className="block text-[11px] font-bold text-capsule-accent uppercase tracking-wider font-mono">{t("common.qty", "Պատվերի Քանակ")}</span>
                          <span className="text-[9px] text-capsule-text-muted">{t("calc.qty_helper", "Ընտրեք առաջարկվող քանակներից կամ մուտքագրեք ձեր նախընտրածը")}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <LuxuryNumericInput
                            min={categories.find(c => c.id === activeCategory)?.minQty || 300}
                            step={100}
                            value={qty}
                            onChange={(val) => setQty(Math.max(0, parseInt(val) || 0))}
                            className="w-44"
                          />
                          <span className="text-xs text-capsule-text-secondary font-bold">{categories.find(c => c.id === activeCategory)?.id === "ribbons" ? t("common.units.meters", "մետր") : t("common.units.pcs", "հատ")}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {categories.find(c => c.id === activeCategory)?.qtyPresets?.map((pq) => {
                          const isSelected = qty === pq;
                          return (
                            <button
                              key={pq}
                              onClick={() => setQty(pq)}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                                isSelected 
                                  ? "neu-brand-active shadow-sm scale-[1.03]" 
                                  : "bg-[#FAFAF9] border-white/60 shadow-[4px_4px_10px_#D5D0C8,_-4px_-4px_10px_#FFFFFF] text-[#3D271B]/60 hover:text-[#3D271B] hover:scale-[1.02] active:scale-[0.97]"
                              }`}
                            >
                              <span className={isSelected ? "text-white" : "text-[#3D271B]"}>
                                {formatNumber(pq)} {categories.find(c => c.id === activeCategory)?.id === "ribbons" ? t("common.units.meters", "մետր") : t("common.units.pcs", "հատ")}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub Tab: CUSTOM DIMENSIONS */}
                {calcTab === "custom" && (
                  <div className="space-y-4 neu-convex-surf rounded-3xl p-6">
                    {/* Header */}
                    <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                      <Expand size={14} className="text-capsule-accent" />
                      <span>{t("calc.section_4_custom_title", "Բաժին 4. Չափսի, Թղթի և Քանակի Ընտրություն (Անհատական)")}</span>
                    </div>

                    {/* Sub-block: Custom Sizes */}
                    <div className="bg-[#FAFAF9]/50 border border-white/60 shadow-[inset_2px_2px_5px_#E5E3DF,_inset_-2px_-2px_1px_#FFFFFF] rounded-2xl p-4 space-y-3">
                      <span className="block text-[10px] font-bold text-capsule-accent uppercase tracking-wider font-mono">{t("common.dimensions", "Չափսեր (սմ)")}</span>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <span className="block text-[9px] font-bold text-capsule-text-muted uppercase mb-1">{t("common.width", "Լայնություն (W)")}</span>
                          <LuxuryNumericInput
                            min={1}
                            step={1}
                            value={custW}
                            onChange={(val) => setCustW(val)}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold text-capsule-text-muted uppercase mb-1">{t("common.height", "Բարձրություն (H)")}</span>
                          <LuxuryNumericInput
                            min={1}
                            step={1}
                            value={custH}
                            onChange={(val) => setCustH(val)}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold text-capsule-text-muted uppercase mb-1">{t("common.depth", "Խորություն (D)")}</span>
                          <LuxuryNumericInput
                            min={0}
                            step={1}
                            value={custD}
                            onChange={(val) => setCustD(val)}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Custom Paper Selection block */}
                    <div className="bg-[#FAFAF9]/50 border border-white/60 shadow-[inset_2px_2px_5px_#E5E3DF,_inset_-2px_-2px_1px_#FFFFFF] rounded-2xl p-4 space-y-3">
                      <div className="text-[10px] font-bold text-capsule-accent uppercase tracking-wider font-mono flex items-center gap-1.5 font-normal">
                        <FileText size={12} className="text-capsule-accent" />
                        <span>{t("common.paper", "Թղթի Տեսակ և Խտություն (Paper Options)")}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {papers
                          .filter((p) => p.active && p.assignedProducts.includes(activeCategory))
                          .map((p) => {
                            const isSelected = selectedPaperId === p.id;
                            return (
                              <button
                                type="button"
                                key={p.id}
                                onClick={() => {
                                  setSelectedPaperId(p.id);
                                  setGsm(p.gsm);
                                  setCalcResult(null);
                                }}
                                className={`p-3 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-center min-h-[54px] ${
                                  isSelected
                                    ? "neu-brand-active scale-[1.03]"
                                    : "bg-[#FAFAF9] shadow-[4px_4px_10px_#D5D0C8,_-4px_-4px_10px_#FFFFFF] hover:shadow-[0_8px_15px_-3px_rgba(31,42,42,0.06)] active:shadow-[inset_2px_2px_4px_#D5D0C8,_inset_-2px_-2px_4px_#FFFFFF] border border-white/60 text-[#3D271B]/60 hover:text-[#3D271B] hover:scale-[1.01] active:scale-[0.98]"
                                }`}
                              >
                                <span className={`text-[11px] font-bold leading-tight truncate w-full ${isSelected ? "text-white" : "text-[#3D271B]"}`}>{t(`db.paper.${p.id}`, p.name)}</span>
                                <span className={`text-[8px] font-bold font-mono mt-0.5 ${isSelected ? "text-white/90" : "text-capsule-accent"}`}>
                                  {p.gsm} {t("common.units.g", "Gsm")}
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    </div>

                    {/* Custom Handles block */}
                    <div className="bg-[#FAFAF9]/50 border border-white/60 shadow-[inset_2px_2px_5px_#E5E3DF,_inset_-2px_-2px_1px_#FFFFFF] rounded-2xl p-4 space-y-3">
                      <div className="text-[10px] font-bold text-capsule-accent uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Maximize2 size={12} className="text-capsule-accent" />
                        <span>{t("common.handle", "Բռնակի Տեսակ (Handle Type)")}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: "cord", label: t("options.handle_cord", "Պարանային Շնուր") },
                          { key: "ribbon", label: t("options.handle_ribbon", "Սատինե Ժապավեն") }
                        ].map((hb) => {
                          const isSelected = handle === hb.key;
                          return (
                            <button
                              type="button"
                              key={hb.key}
                              onClick={() => {
                                setHandle(hb.key as any);
                                if (hb.key === "ribbon") {
                                  const activeRibs = (bagRibbonHandles || []).filter(h => h.active);
                                  const defaultPrice = activeRibs.length > 0 ? activeRibs[0].price : 75;
                                  setRibbonWidthPrice(defaultPrice);
                                }
                                setCalcResult(null);
                              }}
                              className={`p-3 rounded-2xl text-xs font-bold transition-all duration-300 text-center cursor-pointer min-h-[50px] flex items-center justify-center ${
                                isSelected
                                  ? "neu-brand-active scale-[1.03]"
                                  : "bg-[#FAFAF9] shadow-[4px_4px_10px_#D5D0C8,_-4px_-4px_10px_#FFFFFF] border border-white/60 text-[#3D271B]/60 hover:text-[#3D271B] hover:scale-[1.01] active:scale-[0.98]"
                              }`}
                            >
                              <span className={isSelected ? "text-white" : "text-[#3D271B]"}>{hb.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sub-block: Lamination */}
                    <div className="bg-[#FAFAF9]/50 border border-white/60 shadow-[inset_2px_2px_5px_#E5E3DF,_inset_-2px_-2px_1px_#FFFFFF] rounded-2xl p-4 space-y-4">
                      <span className="block text-[10px] font-bold text-capsule-accent uppercase tracking-wider font-mono">{t("common.lamination", "Լամինացիայի Տեսակ")}</span>
                      <div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                          {[
                            { val: "matte", label: t("options.lamination_matte", "Փայլատ") },
                            { val: "gloss", label: t("options.lamination_gloss", "Փայլուն") },
                            { val: "soft_touch", label: t("options.lamination_soft_touch", "Soft-Touch") },
                            { val: "none", label: t("options.lamination_none", "Առանց") }
                          ].map((item) => {
                            const isSelected = lamination === item.val;
                            return (
                              <button
                                key={item.val}
                                type="button"
                                onClick={() => {
                                    setLamination(item.val as any);
                                    setCalcResult(null);
                                }}
                                className={`py-2 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                                  isSelected
                                    ? "neu-brand-active scale-[1.03]"
                                    : "bg-[#FAFAF9] shadow-[4px_4px_10px_#D5D0C8,_-4px_-4px_10px_#FFFFFF] border border-white/60 text-[#3D271B]/60 hover:text-[#3D271B] hover:scale-[1.01] active:scale-[0.98]"
                                }`}
                              >
                                <span className={isSelected ? "text-white" : "text-[#3D271B]"}>{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {handle === "ribbon" && (
                        <div className="space-y-1 border-t border-capsule-accent/5 pt-3">
                          <span className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider">{t("common.ribbon_width", "Ժապավենի Լայնություն")}</span>
                          <div className="grid grid-cols-4 gap-2 mt-1">
                            {(bagRibbonHandles.length > 0 ? bagRibbonHandles.filter(h => h.active) : [
                              { id: "rw_1_2", widthCm: 1.2, label: "1.2 սմ", price: 55, active: true },
                              { id: "rw_2_0", widthCm: 2.0, label: "2.0 սմ", price: 75, active: true },
                              { id: "rw_2_5", widthCm: 2.5, label: "2.5 սմ", price: 95, active: true },
                              { id: "rw_3_0", widthCm: 3.0, label: "3.0 սմ", price: 120, active: true }
                            ]).map((rib) => (
                              <button
                                key={rib.id || rib.label}
                                type="button"
                                onClick={() => {
                                  setRibbonWidthPrice(rib.price);
                                  setCalcResult(null);
                                }}
                                className={`py-2 rounded-2xl text-[11px] font-bold text-center transition-all duration-300 cursor-pointer ${
                                  ribbonWidthPrice === rib.price
                                    ? "neu-brand-active scale-[1.03]"
                                    : "bg-[#FAFAF9] shadow-[4px_4px_10px_#D5D0C8,_-4px_-4px_10px_#FFFFFF] border border-white/60 text-[#3D271B]/60 hover:text-[#3D271B] hover:scale-[1.01] active:scale-[0.98]"
                                }`}
                              >
                                <div className={ribbonWidthPrice === rib.price ? "text-white" : "text-[#3D271B]"}>{rib.label ? (rib.label.includes("սմ") ? rib.label.replace("սմ", t("common.units.cm", "սմ")) : rib.label) : rib.label}</div>
                                <div className={`text-[8px] font-bold font-mono mt-0.5 ${ribbonWidthPrice === rib.price ? "text-white/90" : "text-capsule-accent"}`}>{formatPrice(rib.price)}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sub-block: Custom Quantity */}
                    <div className="bg-[#FAFAF9]/50 border border-white/60 shadow-[inset_2px_2px_5px_#E5E3DF,_inset_-2px_-2px_1px_#FFFFFF] rounded-2xl p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <span className="block text-[11px] font-bold text-capsule-accent uppercase tracking-wider font-mono">{t("common.qty", "Պատվերի Քանակ")}</span>
                          <span className="text-[9px] text-capsule-text-muted">{t("calc.qty_helper", "Ընտրեք առաջարկվող քանակներից կամ մուտքագրեք ձեր նախընտրածը")}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <LuxuryNumericInput
                            min={categories.find(c => c.id === activeCategory)?.minQty || 300}
                            step={100}
                            value={custQty}
                            onChange={(val) => setCustQty(Math.max(0, parseInt(val) || 0))}
                            className="w-44"
                          />
                          <span className="text-xs text-capsule-text-secondary font-bold">{categories.find(c => c.id === activeCategory)?.id === "ribbons" ? t("common.units.meters", "մետր") : t("common.units.pcs", "հատ")}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {categories.find(c => c.id === activeCategory)?.qtyPresets?.map((pq) => {
                          const isSelected = custQty === pq;
                          return (
                            <button
                              key={pq}
                              onClick={() => setCustQty(pq)}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                                isSelected 
                                  ? "neu-brand-active shadow-sm scale-[1.03]" 
                                  : "bg-[#FAFAF9] border-white/60 shadow-[4px_4px_10px_#D5D0C8,_-4px_-4px_10px_#FFFFFF] text-[#3D271B]/60 hover:text-[#3D271B] hover:scale-[1.02] active:scale-[0.97]"
                              }`}
                            >
                              <span className={isSelected ? "text-white" : "text-[#3D271B]"}>
                                {formatNumber(pq)} {categories.find(c => c.id === activeCategory)?.id === "ribbons" ? t("common.units.meters", "մետր") : t("common.units.pcs", "հատ")}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub Tab: BULK MATRIX */}
                {calcTab === "table" && (
                  <div className="bg-[#FAFAF9]/50 border border-white/60 shadow-[inset_2px_2px_5px_#E5E3DF,_inset_-2px_-2px_1px_#FFFFFF] rounded-2xl p-6 space-y-4">
                    <div className="text-[10px] uppercase font-bold text-capsule-accent flex justify-between border-b border-capsule-accent/10 pb-2">
                      <span>{t("calc.matrix_title", "Չափերի և Մեծածախ Քանակների Գնացուցակ (֏/հատ)")}</span>
                      <span>{gsm} GSM</span>
                    </div>

                    {bulkLoading ? (
                      <div className="py-12 text-center text-xs text-capsule-text-muted animate-pulse">{t("calc.loading_matrix", "Հավաքագրվում է աղյուսակը...")}</div>
                    ) : (
                      <div className="overflow-x-auto border border-[#FAFAF9] bg-[#EFECE6]/50 shadow-[2px_2px_6px_rgba(0,0,0,0.06),_inset_-2px_-2px_2px_#FFFFFF] rounded-2xl max-h-[350px]">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-[#E9E4DB] text-capsule-text-muted text-[9px] uppercase font-bold sticky top-0">
                            <tr>
                              <th className="p-3">{t("common.dimensions", "Չափսեր (սմ)")}</th>
                              {tiers.map((tItem) => (
                                <th key={tItem.id} className="p-3 text-center">{formatNumber(tItem.qty)} {categories.find(c => c.id === activeCategory)?.id === "ribbons" ? t("common.units.meters", "մետր") : t("common.units.pcs", "հատ")}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-capsule-accent/5">
                            {bulkMatrix.map((bm, index) => (
                              <tr key={index} className="hover:bg-[#EFECE6]/60 transition-colors">
                                <td className="p-3 font-bold text-capsule-dark">{bm.dimText}</td>
                                {tiers.map((tItem) => (
                                  <td key={tItem.id} className="p-3 text-center font-mono text-capsule-text-secondary">
                                    {bm.tierPrices[tItem.qty] ? formatPrice(bm.tierPrices[tItem.qty]) : "—"}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Right Column: Dynamic Price breakdown output card */}
              <div className="lg:col-span-5 sticky top-6 space-y-6">
                
                {/* Dynamic 3D Product Visual Mockup */}
                {(() => {
                  const activeBagsDims = dimensions.filter(d => d.active && d.categoryId === activeCategory);
                  const selectedBagDim = activeBagsDims[selectedSizeIndex] || { w: 20, h: 25, d: 8 };
                  const bW = calcTab === "custom" ? (parseFloat(custW) || 20) : (selectedBagDim.w || 20);
                  const bH = calcTab === "custom" ? (parseFloat(custH) || 25) : (selectedBagDim.h || 25);
                  const bD = calcTab === "custom" ? (parseFloat(custD) || 8) : (selectedBagDim.d || 8);
                  
                  return (
                    <Product3DViewer 
                      productType={activeCategory}
                      w={bW}
                      h={bH}
                      d={bD}
                      paperType={selectedPaperId}
                      lamination={lamination}
                      handleType={handle}
                      ribbonColor={handle === "ribbon" ? "#7c2d12" : "#3c1e0b"}
                      finishes={selectedFinishes}
                      colorsCount={colors}
                      sides={sides}
                      ribbonWidthCm={currentRibbonWidthCm}
                    />
                  );
                })()}

                <div className="bg-capsule-surf border border-capsule-accent/15 rounded-3xl p-6 shadow-md space-y-5">
                  <div className="text-[10px] tracking-widest font-bold uppercase text-capsule-accent border-b border-capsule-accent/5 pb-2 flex items-center gap-1.5">
                    <Calculator size={14} />
                    <span>{t("calc.title", "Գնային Հաշվարկ")}</span>
                  </div>

                  {calcError ? (
                    <div className="py-10 text-center text-red-700/80 space-y-2">
                      <AlertTriangle className="mx-auto text-red-700" size={28} />
                      <p className="text-xs font-semibold uppercase">{t(`errors.${calcError}`, calcError)}</p>
                    </div>
                  ) : !calcResult ? (
                    <div className="py-8 px-4 text-center text-capsule-text-muted space-y-3 select-none">
                      <HelpCircle className="mx-auto text-capsule-accent/40" size={24} />
                      <div className="text-[11px] font-bold text-capsule-accent/80 uppercase tracking-wider">{t("calc.select_all_parameters", "Ընտրեք Բոլոր Պարամետրերը")}</div>
                      <p className="text-[10px] sm:text-xs leading-relaxed max-w-xs mx-auto text-capsule-text-secondary">
                        {t("calc.select_all_parameters_description", "Արժեքը և 3D նախադիտումը տեսնելու համար խնդրում ենք ընտրել բոլոր պարտադիր դաշտերը՝")}
                      </p>
                      {getMissingOptions().length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1 mt-2">
                          {getMissingOptions().map((opt) => (
                            <span key={opt} className="px-2 py-0.5 rounded bg-capsule-accent/5 border border-capsule-accent/15 text-capsule-accent text-[9px] font-bold whitespace-nowrap">
                              ● {t(`missing.${opt}`, opt)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col border-b border-capsule-accent/10 pb-4">
                        <span className="text-[9px] uppercase text-capsule-text-muted font-bold block">{t("calc.total_price", "Ընդհանուր Արժեք")}</span>
                        <div className="flex justify-between items-baseline mt-1">
                          <h3 className="text-3xl font-extrabold text-capsule-accent font-sans">{formatPrice(calcResult.totalPrice || 0)}</h3>
                          <span className="text-xs font-bold text-capsule-text-secondary">{formatPrice(calcResult.unitPrice)} / {categories.find(c => c.id === activeCategory)?.id === "ribbons" ? t("common.units.meters", "մետր") : t("common.units.pcs", "հատ")}</span>
                        </div>
                        <p className="text-[10px] text-capsule-text-muted mt-1 uppercase font-mono">
                          {t("common.size", "Չափս")}: {calcResult.dimensionsText} {t("common.units.cm", "սմ")} | {t("common.qty", "Քանակ")}: {formatNumber(calcResult.qty)} {categories.find(c => c.id === activeCategory)?.id === "ribbons" ? t("common.units.meters", "մետր") : t("common.units.pcs", "հատ")}
                        </p>
                      </div>

                      <div className="space-y-2.5 text-xs text-capsule-text-secondary">
                        <div className="flex justify-between border-[#3c1e0b]/10 border-b pb-1">
                          <span>{t("calc.order_type", "Պատվերի Տեսակ")}</span>
                          <span className="font-bold text-capsule-dark">
                            {activeTemplate === "bags" ? t("category.bags_desc", "Ստանդարտ Թղթե Տոպրակ") : t("category.decorative_desc", "Դեկորատիվ Թղթե Տոպրակ")}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-capsule-accent/5 pb-1">
                          <span>{t("calc.size_option", "Չափսի տարբերակ")}</span>
                          <span className="font-bold text-capsule-dark">
                            {calcTab === "custom" ? t("options.size_custom", "Անհատական") : t("options.size_standard", "Ստանդարտ")}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-capsule-accent/5 pb-1">
                          <span>{t("common.dimensions", "Չափսեր (սմ)")}</span>
                          <span className="font-bold text-capsule-dark">{calcResult.dimensionsText} {t("common.units.cm", "սմ")}</span>
                        </div>
                        <div className="flex justify-between border-b border-capsule-accent/5 pb-1">
                          <span>{t("common.qty", "Պատվերի Քանակ")}</span>
                          <span className="font-bold text-capsule-dark">{formatNumber(calcResult.qty)} {categories.find(c => c.id === activeCategory)?.id === "ribbons" ? t("common.units.meters", "մետր") : t("common.units.pcs", "հատ")}</span>
                        </div>
                        <div className="flex justify-between border-b border-capsule-accent/5 pb-1">
                          <span>{t("common.paper_type", "Թղթի տեսակ")}</span>
                          <span className="font-bold text-capsule-dark">
                            {selectedPaperId ? t(`db.paper.${selectedPaperId}`, papers.find(p => p.id === selectedPaperId)?.name) : "---"}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-capsule-accent/5 pb-1">
                          <span>{t("common.paper_gsm", "Թղթի խտություն")}</span>
                          <span className="font-bold text-capsule-dark">{gsm} {t("common.units.g", "Gsm")}</span>
                        </div>
                        <div className="flex justify-between border-b border-capsule-accent/5 pb-1">
                          <span>{t("common.lamination", "Լամինացիա")}</span>
                          <span className="font-bold text-capsule-dark">
                            {lamination === "matte" ? `${t("options.lamination_matte", "Փայլատ")} (Matte)` : lamination === "gloss" ? `${t("options.lamination_gloss", "Փայլուն")} (Gloss)` : lamination === "soft_touch" ? `${t("options.lamination_soft_touch", "Soft-Touch")} (Soft-Touch)` : t("options.lamination_none", "Առանց")}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-capsule-accent/5 pb-1">
                          <span>{t("common.colors", "Գունայնություն")}</span>
                          <span className="font-bold text-capsule-dark">
                            {formatColorsLabel(colors)}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-capsule-accent/5 pb-1">
                          <span>{t("common.sides", "Կողմեր")}</span>
                          <span className="font-bold text-capsule-dark">
                            {sides === 1 ? `${t("options.sides_1", "Միակողմանի")} (1/0)` : `${t("options.sides_2", "Երկկողմանի")} (1/1)`}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-capsule-accent/5 pb-1">
                          <span>{t("common.handle", "Բռնակի տեսակ")}</span>
                          <span className="font-bold text-capsule-dark">
                            {handle === "cord" 
                              ? t("options.handle_cord", "Պարանային Շնուր") 
                              : `${t("options.handle_ribbon", "Սատինե Ժապավեն")} (${activeRibLabel ? (activeRibLabel.includes("սմ") ? activeRibLabel.replace("սմ", t("common.units.cm", "սմ")) : activeRibLabel) : ""})`
                            }
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-capsule-accent/5 pb-1">
                          <span>{t("common.design", "Դիզայնի Փուլ")}</span>
                          <span className="font-bold text-capsule-dark text-right">
                            {design === "ready" ? t("options.design_ready_desc", "Ունեմ պատրաստի մակետ") : t("options.design_help_desc", "Անհրաժեշտ է դիզայնի մշակում")}
                          </span>
                        </div>
                        {selectedFinishes.length > 0 && (
                          <div className="flex justify-between border-b border-capsule-accent/5 pb-1">
                            <span>{t("common.finishes", "Մշակումներ")}</span>
                            <span className="font-bold text-capsule-dark text-right max-w-[200px] truncate">
                              {selectedFinishes.map(k => t(`db.finish.${k}`, finishes.find(f => f.key === k)?.label)).join(", ")}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between pb-1">
                          <span>{t("common.print_method", "Տպագրության մեթոդ")}</span>
                          <span className="bg-capsule-accent/10 px-2 py-0.5 rounded text-[9px] font-bold text-capsule-accent tracking-widest uppercase">
                            {t(`options.print_method_${calcResult.printingMethodUsed?.toLowerCase()}`, calcResult.printingMethodUsed)}
                          </span>
                        </div>
                      </div>

                      {calcResult.quantityDiscount > 0 && (
                        <div className="bg-green-100/50 border border-green-800/10 text-green-800 rounded-xl p-3 flex justify-between items-center text-xs">
                          <div>
                            <span className="block text-[8px] font-bold uppercase leading-none text-green-900/60 font-mono">ՄԵԾԱՔԱՆԱԿԻ ԶԵՂՉ</span>
                            <span className="mt-0.5 font-medium leading-none block">Դուք խնայում եք</span>
                          </div>
                          <span className="font-mono font-extrabold text-base">-{calcResult.quantityDiscount.toLocaleString()} ֏</span>
                        </div>
                      )}
                      <div className="border-t border-capsule-accent/10 pt-4 space-y-2">
                        <label className="block text-[9px] font-bold text-capsule-text-muted uppercase">Պրոմո Կոդ</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value.toUpperCase().replace(/\s/g, ""))}
                            disabled={!!appliedPromo}
                            placeholder="EX: WELCOME10"
                            className="flex-1 bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-1 px-2.5 text-xs text-capsule-dark font-bold font-mono outline-none"
                          />
                          {appliedPromo ? (
                            <button
                              onClick={() => {
                                setAppliedPromo("");
                                setPromoInput("");
                                setPromoSuccess(null);
                                setPromoError(null);
                                setDiscountAmount(0);
                              }}
                              className="bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg cursor-pointer"
                            >
                              Չեղարկել
                            </button>
                          ) : (
                            <button
                              onClick={handleApplyCoupon}
                              className="bg-capsule-accent text-capsule-surf text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-lg cursor-pointer"
                            >
                              Կիրառել
                            </button>
                          )}
                        </div>
                        {promoError && <p className="text-[10px] text-red-700 font-semibold">{promoError}</p>}
                        {promoSuccess && <p className="text-[10px] text-green-700 font-bold">{promoSuccess}</p>}
                      </div>

                      {/* Inquiry Submitter Button */}
                      <div className="pt-3 border-t border-capsule-accent/10 space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            const ribbonWidthText = ` (${activeRibLabel})`;
                            const handleText = handle === "cord" ? "Շնուր" : `Սատինե Ժապավեն${ribbonWidthText}`;
                            const lamText = lamination === "matte" ? "Փայլատ" : lamination === "gloss" ? "Փայլուն" : lamination === "soft_touch" ? "Soft-Touch" : "Առանց լամինացիայի";
                            const desc = `Տոպրակի Պատվեր:\nՉափսեր: ${calcResult.dimensionsText} սմ\nՔանակ: ${calcResult.qty} հատ\nԽտություն: ${gsm}g/m² (${lamText})\nՏպագրություն: ${formatColorsLabel(colors)} (${sides} կողմ)\nԲռնակ: ${handleText}\nՄշակումներ: ${selectedFinishes.map(k => finishes.find(f => f.key === k)?.label).join(", ") || "Չկան"}\nՏպագրության Մեթոդ: ${calcResult.printingMethodUsed}`;
                            setInquiryDetails(desc);
                            setInquiryPrice(calcResult.totalPrice);
                            setIsInquiryOpen(true);
                          }}
                          className="w-full bg-capsule-accent hover:bg-capsule-accent-light text-capsule-surf text-xs py-3.5 rounded-full font-bold uppercase cursor-pointer text-center select-none shadow flex justify-center items-center gap-2 transition-all duration-250"
                        >
                          <ShoppingBag size={14} />
                          <span>{t("buttons.submit_order", "Հաստատել Պատվերը")}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddItemToBundle(activeCategory)}
                          className="w-full bg-capsule-surf hover:bg-capsule-accent/5 text-capsule-accent border border-capsule-accent/20 text-xs py-3 rounded-full font-bold uppercase cursor-pointer text-center select-none flex justify-center items-center gap-2 transition-all duration-250"
                        >
                          <ShoppingCart size={14} />
                          <span>{t("buttons.add_to_cart", "Ավելացնել Զամբյուղին")}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ─────────────────── BOX CALCULATORS ─────────────────── */}
          {activeTemplate === "boxes" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column Box configuration specs */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* CARD 1: Box Dimensions */}
                <div className="bg-capsule-surf border border-capsule-accent/15 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                    <Expand size={14} className="text-capsule-accent" />
                    <span>{t("calc.card_1_title_box", "Քարտ 1. Տուփի Չափսեր (Dimensions)")}</span>
                  </div>
                  <p className="text-[10px] text-capsule-text-muted uppercase font-bold">{t("calc.card_1_desc_box", "Ընտրեք առաջարկվող ստանդարտ չափսերից կամ սահմանեք անհատական չափսեր")}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {products.find(p => p.id === "boxes_items")?.items.map((it) => (
                      <button
                        key={it.id}
                        type="button"
                        onClick={() => setSelectedBoxItemId(it.id)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between min-h-[90px] ${
                          selectedBoxItemId === it.id 
                            ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold" 
                            : "bg-capsule-surf2/20 border-capsule-accent/10 text-capsule-text-secondary hover:border-capsule-accent/20"
                        }`}
                      >
                        <div>
                          <p className={`text-[8px] uppercase tracking-wider font-bold ${selectedBoxItemId === it.id ? "text-white/80" : "text-capsule-text-muted"}`}>Ստանդարտ</p>
                          <h4 className="text-xs font-bold font-sans mt-0.5 leading-tight">{it.name.replace(/ \(.+\)/, "")}</h4>
                        </div>
                        <p className={`font-semibold text-[10px] mt-2 font-mono ${selectedBoxItemId === it.id ? "text-white/90" : "text-capsule-accent"}`}>Base: {it.price} ֏</p>
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setSelectedBoxItemId("custom")}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between min-h-[90px] ${
                        selectedBoxItemId === "custom" 
                          ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold" 
                          : "bg-transparent border border-capsule-accent/10 hover:border-capsule-accent/20"
                      }`}
                    >
                      <div>
                        <p className={`text-[8px] uppercase font-bold ${selectedBoxItemId === "custom" ? "text-white/80" : "text-capsule-accent-light"}`}>Անհատական</p>
                        <h4 className={`text-xs font-bold font-sans mt-0.5 ${selectedBoxItemId === "custom" ? "text-white" : "text-capsule-accent"}`}>Ազատ Չափսեր</h4>
                      </div>
                      <p className={`text-[9px] mt-2 font-medium ${selectedBoxItemId === "custom" ? "text-white/80" : "text-capsule-text-muted"}`}>Մուտքագրել ձեռքով</p>
                    </button>
                  </div>

                  {selectedBoxItemId === "custom" && (
                    <div className="bg-capsule-surf2/30 border border-capsule-accent/15 rounded-xl p-4 grid grid-cols-3 gap-3">
                      <div>
                        <span className="block text-[9px] font-bold text-capsule-text-muted uppercase mb-1">Երկարություն (L) սմ</span>
                        <LuxuryNumericInput
                          min={1}
                          step={1}
                          value={boxLength}
                          onChange={(val) => setBoxLength(val)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold text-capsule-text-muted uppercase mb-1">Լայնություն (W) սմ</span>
                        <LuxuryNumericInput
                          min={1}
                          step={1}
                          value={boxWidth}
                          onChange={(val) => setBoxWidth(val)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold text-capsule-text-muted uppercase mb-1">Բարձրություն (H) սմ</span>
                        <LuxuryNumericInput
                          min={1}
                          step={1}
                          value={boxHeight}
                          onChange={(val) => setBoxHeight(val)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* CARD 2: Box Structure */}
                <div className="bg-capsule-surf border border-capsule-accent/15 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                    <Layers size={14} className="text-capsule-accent" />
                    <span>Քարտ 2. Տուփի Կառուցվածք (Box Structure)</span>
                  </div>
                  <p className="text-[10px] text-capsule-text-muted uppercase font-bold">Ընտրեք տուփի արտաքին տեսքը և բացման մեխանիզմը</p>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setBoxStyle("shoulder_lid");
                        setCalcResult(null);
                      }}
                      className={`relative flex flex-col items-center gap-2 p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                        boxStyle === "shoulder_lid"
                          ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold"
                          : "bg-capsule-surf border-capsule-accent/10 text-capsule-text-secondary hover:border-capsule-accent/20"
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-current/5">
                        <Layers size={18} />
                      </div>
                      <div className="text-xs font-bold leading-none">Կափարիչով</div>
                      <div className={`text-[9px] font-medium mt-0.5 ${boxStyle === "shoulder_lid" ? "text-white/80" : "text-capsule-text-muted"}`}>Classic Rigid Lid</div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setBoxStyle("shoulder_neck");
                        setCalcResult(null);
                      }}
                      className={`relative flex flex-col items-center gap-2 p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                        boxStyle === "shoulder_neck"
                          ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold"
                          : "bg-capsule-surf border-capsule-accent/10 text-capsule-text-secondary hover:border-capsule-accent/20"
                      }`}
                    >
                      <span className="absolute -top-2 -right-1 bg-capsule-accent text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full select-none shadow">NEW</span>
                      <div className="p-2 rounded-lg bg-current/5">
                        <Inbox size={18} />
                      </div>
                      <div className="text-xs font-bold leading-none">Ուսիկով</div>
                      <div className={`text-[9px] font-medium mt-0.5 ${boxStyle === "shoulder_neck" ? "text-white/80" : "text-capsule-text-muted"}`}>Hinged Neck Box</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setBoxStyle("sleeve_drawer");
                        setCalcResult(null);
                      }}
                      className={`relative flex flex-col items-center gap-2 p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                        boxStyle === "sleeve_drawer"
                          ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold"
                          : "bg-capsule-surf border-capsule-accent/10 text-capsule-text-secondary hover:border-capsule-accent/20"
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-current/5">
                        <Sliders size={18} />
                      </div>
                      <div className="text-xs font-bold leading-none">Սահող Դարակով</div>
                      <div className={`text-[9px] font-medium mt-0.5 ${boxStyle === "sleeve_drawer" ? "text-white/80" : "text-capsule-text-muted"}`}>Slide Drawer</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setBoxStyle("magnetic_flap");
                        setCalcResult(null);
                      }}
                      className={`relative flex flex-col items-center gap-2 p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                        boxStyle === "magnetic_flap"
                          ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold"
                          : "bg-capsule-surf border-capsule-accent/10 text-capsule-text-secondary hover:border-capsule-accent/20"
                      }`}
                    >
                      <span className="absolute -top-2 -right-1 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full select-none shadow">LUX</span>
                      <div className="p-2 rounded-lg bg-current/5 text-amber-500">
                        <Sparkles size={18} />
                      </div>
                      <div className="text-xs font-bold leading-none">Մագնիսական</div>
                      <div className={`text-[9px] font-medium mt-0.5 ${boxStyle === "magnetic_flap" ? "text-white/80" : "text-capsule-text-muted"}`}>Luxury Magnetic</div>
                    </button>
                  </div>
                </div>

                {/* CARD 3: Technical material options */}
                <div className="bg-capsule-surf border border-capsule-accent/15 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                    <Sliders size={14} className="text-capsule-accent" />
                    <span>Քարտ 3. Տեխնիկական Մանրամասներ</span>
                  </div>
                  <p className="text-[10px] text-capsule-text-muted uppercase font-bold">Սահմանեք տուփի ստվարաթուղթը, լամինացիան և տպագրության որակը</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Material */}
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-1">Նյութ / Ստվարաթուղթ</span>
                      <div className="flex flex-col gap-1.5">
                        {papers
                          .filter((p) => p.active && p.assignedProducts.includes("boxes"))
                          .map((p) => {
                            const isSelected = boxPaperId === p.id;
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => {
                                  setBoxPaperId(p.id);
                                  setCalcResult(null);
                                }}
                                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-center min-h-[50px] ${
                                  isSelected
                                    ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold"
                                    : "bg-capsule-surf2/30 border-capsule-accent/10 hover:border-capsule-accent/20 text-capsule-text-secondary"
                                }`}
                              >
                                <span className="text-[11px] font-bold leading-tight">{p.name}</span>
                                <span className={`text-[8px] font-bold font-mono mt-0.5 ${isSelected ? "text-white/80" : "text-capsule-accent"}`}>
                                  {p.gsm} Gsm
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    </div>

                    {/* Lamination */}
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-1">Լամինացիա</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { val: "matte", label: "Փայլատ" },
                          { val: "gloss", label: "Փայլուն" },
                          { val: "soft_touch", label: "Soft-Touch" },
                          { val: "none", label: "Առանց" }
                        ].map((item) => (
                          <button
                            key={item.val}
                            type="button"
                            onClick={() => {
                              setBoxLamination(item.val as any);
                              setCalcResult(null);
                            }}
                            className={`py-2 px-1 rounded-xl text-[10px] font-bold border cursor-pointer transition-all ${
                              boxLamination === item.val
                                ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold"
                                : "bg-capsule-surf2/30 border-capsule-accent/10 hover:border-capsule-accent/20 text-capsule-text-secondary"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Colors Shade Option */}
                    <div className="md:col-span-2 space-y-1 pt-2">
                      <span className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-1">Գունայնություն / Տպագրություն</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { val: 1, label: "Մոնոքրոմ", desc: "Սև-Սպիտակ / 1 Գույն" },
                          { val: 2, label: "Պանտոն", desc: "2 Գույն / Pantone" },
                          { val: 4, label: "CMYK", desc: "Լիագույն / CMYK" },
                          { val: 5, label: "CMYK + Pantone", desc: "Կոմպլեքս / Premium" }
                        ].map((item) => (
                          <button
                            key={item.val}
                            onClick={() => {
                              setBoxColors(item.val);
                              setCalcResult(null);
                            }}
                            className={`py-2 px-1.5 rounded-xl text-center border cursor-pointer transition-all flex flex-col justify-center items-center gap-0.5 min-h-[46px] ${
                              boxColors === item.val 
                                ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold" 
                                : "bg-capsule-surf2/30 border-capsule-accent/10 hover:border-capsule-accent/20 text-capsule-text-secondary"
                            }`}
                          >
                            <span className="text-[11px] font-bold tracking-tight">{item.label}</span>
                            <span className={`text-[8px] leading-none opacity-80 select-none text-center ${boxColors === item.val ? "text-white" : "text-capsule-text-muted"}`}>{item.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Printing Method Option */}
                    <div className="md:col-span-2 space-y-1 pt-2">
                      <span className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-1">Տպագրության Մեթոդ</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setBoxPrintingMethod("auto");
                            setCalcResult(null);
                          }}
                          className={`py-2 px-3 rounded-xl text-left border cursor-pointer transition-all flex flex-col justify-center min-h-[46px] ${
                            boxPrintingMethod === "auto" || boxPrintingMethod === ""
                              ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold"
                              : "bg-capsule-surf2/30 border-capsule-accent/10 hover:border-capsule-accent/20 text-capsule-text-secondary"
                          }`}
                        >
                          <span className="text-[11px] font-bold tracking-tight font-sans">✨ Ավտոմատ</span>
                          <span className={`text-[8px] opacity-80 leading-none mt-0.5 ${boxPrintingMethod === "auto" ? "text-white" : ""}`}>Օպտիմալ / Ամենաէժան</span>
                        </button>
                        {printingMethods
                          .filter((m) => m.active && m.allowedCategories?.includes("boxes"))
                          .map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                      setBoxPrintingMethod(m.id);
                                      setCalcResult(null);
                              }}
                              className={`py-2 px-3 rounded-xl text-left border cursor-pointer transition-all flex flex-col justify-center min-h-[46px] ${
                                boxPrintingMethod === m.id
                                  ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold"
                                  : "bg-capsule-surf2/30 border-capsule-accent/10 hover:border-capsule-accent/20 text-capsule-text-secondary"
                              }`}
                            >
                              <span className="text-[11px] font-bold tracking-tight">{m.name}</span>
                              <span className={`text-[8px] opacity-80 leading-none mt-0.5 ${boxPrintingMethod === m.id ? "text-white" : ""}`}>Մին. {m.minQty} հատ</span>
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Wall Thickness Selector for Rigid Boxes */}
                  {(boxStyle === "magnetic_flap" || boxStyle === "shoulder_neck" || boxStyle === "shoulder_lid" || boxPaperId === "box_rigid") && (
                    <div className="border-t border-capsule-accent/5 pt-4">
                      <span className="block text-[9px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2">Պատերի Հաստություն (Rigid Core)</span>
                      <div className="flex flex-wrap gap-2.5">
                        {[1.5, 2.0, 2.5, 3.0].map((tVal) => (
                          <button
                            key={tVal}
                            type="button"
                            onClick={() => setBoxWallThickness(tVal)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              boxWallThickness === tVal
                                ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold"
                                : "bg-capsule-surf2/30 border-capsule-accent/10 hover:border-capsule-accent/20 text-capsule-text-secondary"
                            }`}
                          >
                            {tVal} մմ
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* CARD 4: Box Post-press Options */}
                <div className="bg-capsule-surf border border-capsule-accent/15 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                    <Sparkles size={14} className="text-capsule-accent" />
                    <span>Քարտ 4. Հետտպագրական Մշակումներ</span>
                  </div>
                  <p className="text-[10px] text-capsule-text-muted uppercase font-bold">Ավելացրեք պրեմիում լրացուցիչ ձևավորումներ ձեր տուփին</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {finishes.filter(f => f.active && f.categoryId === "boxes").map((fin) => {
                      const isSel = boxFinishes.includes(fin.key);
                      return (
                        <button
                          key={fin.key}
                          type="button"
                          onClick={() => {
                            if (isSel) {
                              setBoxFinishes(boxFinishes.filter(k => k !== fin.key));
                            } else {
                              setBoxFinishes([...boxFinishes, fin.key]);
                            }
                          }}
                          className={`flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all ${
                            isSel
                              ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold"
                              : "bg-capsule-surf border-capsule-accent/10 text-capsule-text-secondary hover:border-capsule-accent/20"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs">{fin.icon}</span>
                            <span className="text-xs leading-none">{fin.label}</span>
                          </div>
                          <span className={`text-[10px] font-mono ${isSel ? "text-white/90" : "opacity-85 text-capsule-accent font-bold"}`}>+{fin.price} ֏</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CARD 5: Order Quantity */}
                <div className="bg-capsule-accent/[0.03] border border-capsule-accent/25 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                    <Sliders size={14} className="text-capsule-accent" />
                    <span>Քարտ 5. Պատվերի Քանակ (Order Quantity)</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <p className="text-[10px] text-capsule-text-muted uppercase font-bold">Մեծաքանակ պատվերների դեպքում գործում են զգալի զեղչեր</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="number"
                        min="30"
                        value={boxQty}
                        onChange={(e) => setBoxQty(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-24 bg-capsule-surf border border-capsule-accent/35 rounded-lg py-1 px-2.5 text-center font-mono text-xs font-bold text-capsule-accent"
                      />
                      <span className="text-xs text-capsule-text-secondary font-bold">հատ</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1 font-mono">
                    {[50, 100, 300, 500, 1000, 2000].map((bqVal) => (
                      <button
                        key={bqVal}
                        onClick={() => setBoxQty(bqVal)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                          boxQty === bqVal ? "bg-capsule-accent text-capsule-surf border-capsule-accent font-bold" : "bg-capsule-surf border-capsule-accent/15 text-capsule-text-secondary hover:border-capsule-accent/30"
                        }`}
                      >
                        {bqVal.toLocaleString()} հատ
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Calculations Outputs Card for Boxes */}
              <div className="lg:col-span-4 sticky top-6 space-y-6">

                {/* Dynamic 3D Box interactive model */}
                {(() => {
                  const selectedBoxItem = (products.find(p => p.id === "boxes_items")?.items || []).find(it => it.id === selectedBoxItemId);
                  let bW = parseFloat(boxLength) || 20;
                  let bH = parseFloat(boxWidth) || 15;
                  let bD = parseFloat(boxHeight) || 8;

                  if (selectedBoxItemId !== "custom" && selectedBoxItem) {
                    const match = selectedBoxItem.name.match(/(\d+)[x\u00d7](\d+)[x\u00d7](\d+)/i);
                    if (match) {
                      bW = parseFloat(match[1]);
                      bH = parseFloat(match[2]);
                      bD = parseFloat(match[3]);
                    }
                  }

                  // Physical size laws validation for 3D Viewer suppression
                  const isRigid = boxPaperId === "box_rigid" || boxStyle === "shoulder_lid" || boxStyle === "sleeve_drawer" || boxStyle === "magnetic_flap" || boxStyle === "shoulder_neck";
                  let validationErrorMsg: string | null = null;

                  if (boxStyle === "shoulder_lid") {
                    if (bD < 3.5) {
                      validationErrorMsg = "Կափարիչով պրեմիում (Rigid Lid) տուփի նվազագույն բարձրությունը (H) պետք է լինի 3.5 սմ։";
                    } else if (bW < 8 || bH < 8) {
                      validationErrorMsg = "Կափարիչով պրեմիում տուփի երկարությունը և լայնությունը պետք է լինեն առնվազն 8 սմ։";
                    } else if (bD > Math.min(bW, bH) * 1.5) {
                      validationErrorMsg = "Կափարիչով պրեմիում տուփի բարձրությունը չի կարող լինել ավելին քան երկարության և լայնության 1.5-պատիկը՝ համաչափությունն ապահովելու համար։";
                    }
                  } else if (boxStyle === "sleeve_drawer") {
                    if (bD < 3.0) {
                      validationErrorMsg = "Սահող դարակով (Sleeve Drawer) տուփի նվազագույն բարձրությունը (H) պետք է լինի 3.0 սմ։";
                    } else if (bW < 8 || bH < 8) {
                      validationErrorMsg = "Սահող դարակով տուփի երկարությունը և լայնությունը պետք է լինեն առնվազն 8 սմ։";
                    } else if (bD > Math.min(bW, bH) * 0.6) {
                      validationErrorMsg = "Սահող դարակով տուփի բարձրությունը չի կարող լինել ավելին քան երկարության կամ լայնության 60%-ը՝ դարակի սահուն և համաչափ տեսքն ապահովելու համար։";
                    }
                  } else if (boxStyle === "magnetic_flap") {
                    if (bD < 3.0) {
                      validationErrorMsg = "Մագնիսական կափարիչով (Magnetic Flap) տուփի նվազագույն բարձրությունը (H) պետք է լինի 3.0 սմ։";
                    } else if (bW < 10 || bH < 10) {
                      validationErrorMsg = "Մագնիսական կափարիչով տուփի երկարությունը և լայնությունը պետք է լինեն առնվազն 10 սմ՝ ճիշտ ծալումն ապահովելու համար։";
                    } else if (bD > Math.min(bW, bH) * 0.65) {
                      validationErrorMsg = "Մագնիսական կափարիչով տուփի բարձրությունը չի կարող գերազանցել երկարության կամ լայնության 65%-ը՝ գրքի տիպի ճիշտ ծալումն արտացոլելու համար։";
                    }
                  } else if (boxStyle === "shoulder_neck") {
                    if (bD < 3.0) {
                      validationErrorMsg = "Ուսիկով պրեմիում (Shoulder Neck) տուփի նվազագույն բարձրությունը (H) պետք է լինի 3.0 սմ։";
                    } else if (bW < 8 || bH < 8) {
                      validationErrorMsg = "Ուսիկով պրեմիում տուփի երկարությունը և լայնությունը պետք է լինեն առնվազն 8 սմ։";
                    } else if (bD > Math.min(bW, bH) * 1.5) {
                      validationErrorMsg = "Ուսիկով պրեմիում տուփի բարձրությունը չի կարող լինել ավելին քան երկարության և լայնության 1.5-պատիկը՝ համաչափությունն ապահովելու համար։";
                    }
                  }

                  if (!validationErrorMsg && (isRigid || boxPaperId === "box_rigid")) {
                    if (bD < 3.0) {
                      validationErrorMsg = "Կոշտ ստվարաթղթով (Rigid) տուփերի նվազագույն բարձրությունը (H) պետք է լինի 3.0 սմ։";
                    }
                  }

                  if (!validationErrorMsg && (bW < 2 || bH < 2 || bD < 0.5)) {
                    validationErrorMsg = "Տուփի չափսերը սխալ են (սկսած 2 սմ-ից, բարձրությունը սկսած 0.5 սմ-ից)։";
                  }

                  if (validationErrorMsg) {
                    return (
                      <div className="w-full aspect-square md:aspect-auto md:h-[420px] bg-capsule-surf border border-dashed border-red-500/30 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
                        <div className="p-4 rounded-full bg-red-500/10 text-red-500 animate-pulse">
                          <AlertTriangle size={36} />
                        </div>
                        <div>
                          <h4 className="font-serif text-sm font-bold text-red-600">Անհամատեղելի Չափսեր</h4>
                          <p className="text-xs text-capsule-text-muted max-w-[280px] mt-2 leading-relaxed">
                            {validationErrorMsg}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Product3DViewer 
                      productType="boxes"
                      w={bW}
                      h={bH}
                      d={bD}
                      paperType={boxPaperId}
                      lamination={boxLamination}
                      colorsCount={boxColors}
                      boxStyle={boxStyle}
                    />
                  );
                })()}

                <div className="bg-capsule-surf border border-capsule-accent/15 rounded-3xl p-6 shadow-md space-y-5">
                  <div>
                    <span className="bg-capsule-accent/10 px-2 py-0.5 rounded text-[8px] font-bold text-capsule-accent tracking-widest uppercase">
                      ՀԱՇՎԱՐԿՎԱԾ (Տուփեր)
                    </span>
                    <h3 className="font-serif text-lg text-capsule-accent font-semibold mt-3">
                      {calcResult ? calcResult.itemName : "Տուփի Հաշվարկ"}
                    </h3>
                    <p className="text-[10px] text-capsule-text-muted mt-0.5">
                      Չափս: {calcResult ? calcResult.dimensionsText : `${boxLength}×${boxWidth}×${boxHeight}`} սմ | Քանակ: {boxQty} հատ
                    </p>
                  </div>

                  {calcError ? (
                    <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3.5 rounded-xl font-semibold">
                      {calcError}
                    </div>
                  ) : !calcResult ? (
                    <div className="py-8 px-4 text-center text-capsule-text-muted space-y-3 select-none">
                      <HelpCircle className="mx-auto text-capsule-accent/40" size={24} />
                      <div className="text-[11px] font-bold text-capsule-accent/80 uppercase tracking-wider">Ընտրեք Բոլոր Պարամետրերը</div>
                      <p className="text-[10px] sm:text-xs leading-relaxed max-w-xs mx-auto text-capsule-text-secondary">
                        Արժեքը և 3D նախադիտումը տեսնելու համար խնդրում ենք ընտրել բոլոր պարտադիր դաշտերը՝
                      </p>
                      {getMissingOptions().length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1 mt-2">
                          {getMissingOptions().map((opt) => (
                            <span key={opt} className="px-2 py-0.5 rounded bg-capsule-accent/5 border border-capsule-accent/15 text-capsule-accent text-[9px] font-bold whitespace-nowrap">
                              ● {opt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4 text-xs text-capsule-text-secondary">
                      
                      <div className="space-y-2 border-b border-capsule-accent/10 pb-4">
                        <div className="flex justify-between items-center py-1">
                          <span>Տուփի Տեսակ</span>
                          <span className="font-bold text-capsule-dark uppercase">
                            {boxStyle === "magnetic_flap" 
                              ? "Մագնիսական (Luxury Magnetic)" 
                              : boxStyle === "lid_base" 
                              ? "Կափարիչ-տուփ (Lid & Base)" 
                              : boxStyle === "dry_folding" 
                              ? "Ինքնահավաքվող (Self-Folding)" 
                              : boxStyle === "shoulder_neck" 
                              ? "Ուսիկով-Վզիկով (Shoulder & Neck)" 
                              : boxStyle === "shoulder_lid" 
                              ? "Shoulder with Lid" 
                              : "Սահող Տուփ (Drawer Box)"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span>Չափսեր</span>
                          <span className="font-bold text-capsule-dark font-mono">{calcResult.dimensionsText} սմ</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span>Պատվերի Քանակ</span>
                          <span className="font-bold text-capsule-dark font-mono">{boxQty} հատ</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span>Նյութ / Թուղթ</span>
                          <span className="font-bold text-capsule-dark uppercase">
                            {papers.find(p => p.id === boxPaperId)?.name || (calcResult.materialType === "rigid" ? "Պրեմիում Կոշտ (Rigid Core)" : calcResult.materialType === "kraft" ? "Էկո Կրաֆտ" : "Ստվարաթուղթ")}
                          </span>
                        </div>
                        {calcResult.wallThickness !== undefined && (
                          <div className="flex justify-between items-center py-1">
                            <span>Պատերի Հաստություն</span>
                            <span className="font-bold text-capsule-dark font-mono">
                              {calcResult.wallThickness} մմ
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center py-1">
                          <span>Լամինացիա</span>
                          <span className="font-bold text-capsule-dark">
                            {calcResult.lamination === "matte" ? "Փայլատ (Matte)" : calcResult.lamination === "gloss" ? "Փայլուն (Gloss)" : calcResult.lamination === "soft_touch" ? "Soft-touch (Թավշյա)" : "Առանց լամինացիայի"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span>Գունայնություն</span>
                          <span className="font-bold text-capsule-dark">{formatColorsLabel(calcResult.colors)}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span>Տպագրության մեթոդ</span>
                          <span className="bg-[#3a2010]/10 px-2 py-0.5 rounded text-[9px] font-bold text-[#3a2010] tracking-wider uppercase">
                            {calcResult.printingMethodUsed}
                          </span>
                        </div>
                      </div>

                      {boxFinishes.length > 0 && (
                        <div className="flex justify-between items-start py-1 pb-2 border-b border-capsule-accent/10">
                          <span className="shrink-0 mr-2">Լրացուցիչ Մշակումներ</span>
                          <span className="font-bold text-capsule-dark text-right">
                            {boxFinishes.map(k => finishes.find(f => f.key === k)?.label).filter(Boolean).join(", ")}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center py-1">
                        <span>Միավորի Գին</span>
                        <span className="font-bold font-mono text-capsule-accent text-sm">{calcResult.unitPrice?.toLocaleString()} ֏</span>
                      </div>

                      {boxQty >= 300 && (
                        <div className="bg-green-100/50 border border-green-800/10 text-green-800 rounded-xl p-3 flex justify-between items-center text-xs select-none">
                          <div>
                            <span className="block text-[8px] font-bold uppercase leading-none text-green-900/60 font-serif">ՄԵԾԱՔԱՆԱԿԻ ԶԵՂՉ</span>
                            <span className="mt-0.5 leading-none block font-medium">Ներառված է սակագնում</span>
                          </div>
                          <span className="font-bold text-[9px] tracking-widest uppercase text-green-800">ԱՊԱՀՈՎՎԱԾ Է</span>
                        </div>
                      )}

                      {/* Coupon interface */}
                      <div className="space-y-1 border-t border-capsule-accent/10 pt-4">
                        <label className="block text-[9px] font-bold text-capsule-text-muted uppercase">Պրոմո Կոդ</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value.toUpperCase().replace(/\s/g, ""))}
                            disabled={!!appliedPromo}
                            placeholder="EX: WELCOME10"
                            className="flex-1 bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-1 px-2.5 text-xs text-capsule-dark font-bold font-mono outline-none"
                          />
                          {appliedPromo ? (
                            <button
                              onClick={() => {
                                setAppliedPromo("");
                                setPromoInput("");
                                setPromoSuccess(null);
                                setPromoError(null);
                                setDiscountAmount(0);
                              }}
                              className="bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg cursor-pointer"
                            >
                              Չեղարկել
                            </button>
                          ) : (
                            <button
                              onClick={handleApplyCoupon}
                              className="bg-capsule-accent text-capsule-surf text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-lg cursor-pointer"
                            >
                              Կիրառել
                            </button>
                          )}
                        </div>
                        {promoError && <p className="text-[10px] text-red-700 font-semibold">{promoError}</p>}
                        {promoSuccess && <p className="text-[10px] text-green-700 font-bold">{promoSuccess}</p>}
                      </div>

                      {/* Pricing view */}
                      <div className="border-t border-capsule-accent/10 pt-4 flex justify-between items-baseline">
                        <span className="text-[10px] font-bold uppercase block text-capsule-text-muted">Ընդամենը</span>
                        <h3 className="text-2xl font-extrabold text-capsule-accent font-sans">{calcResult.totalPrice?.toLocaleString()} ֏</h3>
                      </div>

                      <div className="space-y-2 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            const lamText = calcResult.lamination === "matte" ? "Փայլատ" : calcResult.lamination === "gloss" ? "Փայլուն" : calcResult.lamination === "soft_touch" ? "Soft-touch" : "Առանց լամինացիայի";
                            const finishesText = boxFinishes.length > 0 
                              ? boxFinishes.map(k => finishes.find(f => f.key === k)?.label).filter(Boolean).join(", ")
                              : "Չկան";
                            const thickText = calcResult.wallThickness !== undefined ? `\nՊատերի Հաստություն: ${calcResult.wallThickness} մմ` : "";
                            const desc = `Տուփի Պատվեր:\nՏեսակ: ${calcResult.itemName}\nՉափսեր: ${calcResult.dimensionsText} սմ\nՔանակ: ${calcResult.qty} հատ\nՆյութը: ${calcResult.materialType === "rigid" ? "Rigid premium (Կոշտ)" : calcResult.materialType === "kraft" ? "Էկո Կրաֆտ" : "Cardboard (Ստվարաթուղթ)"}${thickText}\nԼամինացիա: ${lamText}\nՏպագրություն: ${formatColorsLabel(calcResult.colors)}\nՄշակումներ: ${finishesText}\nՏպագրության Մեթոդ: ${calcResult.printingMethodUsed}`;
                            setInquiryDetails(desc);
                            setInquiryPrice(calcResult.totalPrice);
                            setIsInquiryOpen(true);
                          }}
                          className="w-full bg-[#3a2010] hover:bg-[#4d2b16] text-white text-xs py-3.5 rounded-full font-bold uppercase cursor-pointer text-center select-none shadow flex justify-center items-center gap-1.5 transition-all duration-250"
                        >
                          <ShoppingBag size={14} />
                          <span>Հաստատել Պատվերը / Send Quote</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddItemToBundle(activeCategory)}
                          className="w-full bg-capsule-surf hover:bg-capsule-accent/5 text-capsule-accent border border-capsule-accent/20 text-xs py-3 rounded-full font-bold uppercase cursor-pointer text-center select-none flex justify-center items-center gap-1.5 transition-all duration-250"
                        >
                          <ShoppingCart size={14} />
                          <span>Ավելացնել Զամբյուղին / Add to Cart</span>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* ─────────────────── OTHER SIMPLER CHANNELS ─────────────────── */}
          {activeTemplate !== "bags" && activeTemplate !== "boxes" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-16">
              {/* Left Column: Options Selection Card */}
              <div className="lg:col-span-8 bg-capsule-surf border border-capsule-accent/10 rounded-3xl p-6 md:p-8 space-y-6">
                
                {activeTemplate === "ribbons" && (
                  <div className="space-y-6">
                    {/* CARD 1: Ribbon Specs */}
                    <div className="bg-capsule-surf border border-capsule-accent/15 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                        <Palette size={14} className="text-capsule-accent" />
                        <span>Քարտ 1. Ժապավենի Պարամետրեր</span>
                      </div>
                      <p className="text-[10px] text-capsule-text-muted uppercase font-bold">Ընտրեք ժապավենի տեսակը, լայնությունը և լոգոտիպի տպագրության եղանակը</p>

                      <div className="space-y-4">
                        {/* Ribbon Width */}
                        <div>
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">Լայնություն (Width)</label>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { val: "2", label: "2 սմ" },
                              { val: "2.5", label: "2.5 սմ" },
                              { val: "3", label: "3 սմ" },
                              { val: "4", label: "4 սմ" }
                            ].map((item) => (
                              <button
                                key={item.val}
                                type="button"
                                onClick={() => {
                                  setRibbonWidth(item.val);
                                  setCalcResult(null);
                                }}
                                className={`py-2 px-1 rounded-xl text-center border cursor-pointer transition-all flex flex-col justify-center items-center gap-0.5 min-h-[46px] ${
                                  ribbonWidth === item.val 
                                    ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm" 
                                    : "bg-capsule-surf2/30 border-capsule-accent/10 hover:border-capsule-accent/20 text-capsule-text-secondary"
                                }`}
                              >
                                <span className="text-[11px] font-bold tracking-tight">{item.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Ribbon Type */}
                        <div>
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">Ժապավենի Տեսակ (Material)</label>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { val: "satin", label: "Սատինե (Satin)", desc: "Նուրբ, փայլուն, հարթ մակերեսով ամենահանրաճանաչ տեսակը" },
                              { val: "reps", label: "Ռեպսե (Reps)", desc: "Խիտ, կառուցվածքային ռելյեֆով հատուկ ժապավեն տուփերի համար" }
                            ].map((item) => (
                              <button
                                key={item.val}
                                type="button"
                                onClick={() => {
                                  setRibbonType(item.val as any);
                                  setCalcResult(null);
                                }}
                                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                                  ribbonType === item.val ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm" : "bg-capsule-surf2/40 border-capsule-accent/10 hover:border-capsule-accent/20"
                                }`}
                              >
                                <span className={`block text-xs font-bold ${ribbonType === item.val ? "text-white" : ""}`}>{item.label}</span>
                                <span className={`block text-[9px] mt-0.5 ${ribbonType === item.val ? "text-white/85" : "text-capsule-text-muted"}`}>{item.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Printing Option */}
                        <div>
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">Տպագրության Տեսակ / Գույն (Print Foil)</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { val: "foil_gold", label: "Ոսկեփայլ", desc: "Foil Gold" },
                              { val: "foil_silver", label: "Արծաթափայլ", desc: "Foil Silver" },
                              { val: "screen_1", label: "Մետաքսատպություն", desc: "Silk Screen" }
                            ].map((item) => (
                              <button
                                key={item.val}
                                type="button"
                                onClick={() => {
                                  setRibbonPrintColor(item.val as any);
                                  setCalcResult(null);
                                }}
                                className={`py-2 px-1.5 rounded-xl text-center border cursor-pointer transition-all flex flex-col justify-center items-center gap-0.5 min-h-[46px] ${
                                  ribbonPrintColor === item.val 
                                    ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm" 
                                    : "bg-capsule-surf2/30 border-capsule-accent/10 hover:border-capsule-accent/20 text-capsule-text-secondary"
                                }`}
                              >
                                <span className="text-[11px] font-bold tracking-tight">{item.label}</span>
                                <span className="text-[8px] text-capsule-text-muted leading-none opacity-80 select-none text-center">{item.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CARD 2: Print & Quantity */}
                    <div className="bg-capsule-surf border border-capsule-accent/15 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                        <Sliders size={14} className="text-capsule-accent" />
                        <span>Քարտ 2. Երկարություն (Մետր)</span>
                      </div>
                      <p className="text-[10px] text-capsule-text-muted uppercase font-bold">Սահմանեք ժապավենի անհրաժեշտ երկարությունը մետրերով (նվազագույն պատվերը 100 մետր է)</p>

                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider font-mono">Ժապավենի Երկարություն</label>
                          <div className="flex items-center gap-2 shrink-0">
                            <input
                              type="number"
                              min="100"
                              value={ribbonMeters || ""}
                              onChange={(e) => setRibbonMeters(Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-20 bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-1 px-2.5 text-center font-mono text-xs font-bold text-capsule-dark outline-none focus:border-capsule-accent"
                            />
                            <span className="text-xs text-capsule-text-secondary font-bold">հատ</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 font-mono font-medium">
                          {[100, 200, 500, 1000, 2000].map((bqVal) => (
                            <button
                              key={bqVal}
                              type="button"
                              onClick={() => {
                                setRibbonMeters(bqVal);
                                setCalcResult(null);
                              }}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                                ribbonMeters === bqVal 
                                  ? "bg-[#ff2300] text-white border-[#ff2300] shadow-sm font-bold" 
                                  : "bg-capsule-surf border-capsule-accent/15 text-capsule-text-secondary hover:border-capsule-accent/30"
                              }`}
                            >
                              {bqVal} մետր
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTemplate === "stickers" && (
                  <div className="space-y-6 animate-fade-in">
                    {/* CARD 1: Sticker Parameters */}
                    <div className="bg-capsule-surf border border-capsule-accent/15 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                        <Palette size={14} className="text-capsule-accent" />
                        <span>{t("stickers_specs_title", "Քարտ 1. Սթիքերի Պարամետրեր")}</span>
                      </div>
                      <p className="text-[10px] text-capsule-text-muted uppercase font-bold">{t("stickers_specs_desc", "Ընտրեք սթիքերի ձևը, նյութը և չափերը")}</p>

                      <div className="space-y-4">
                        {/* Shape selection */}
                        <div>
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">{t("common.sticker_shape", "Ֆորմատ / Ձև")}</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { val: "circle", label: t("options.shape_circle", "Կլոր"), desc: "Circle" },
                              { val: "rectangle", label: t("options.shape_square", "Ուղղանկյուն"), desc: "Rectangle" },
                              { val: "contour", label: t("options.shape_custom", "Ձևավոր / Կոնտուրային"), desc: "Custom Contour" }
                            ].map((item) => (
                              <button
                                key={item.val}
                                type="button"
                                onClick={() => {
                                  setStickerShape(item.val as any);
                                  setCalcResult(null);
                                }}
                                className={`py-2 px-1 rounded-xl text-center border cursor-pointer transition-all flex flex-col justify-center items-center gap-0.5 min-h-[46px] ${
                                  stickerShape === item.val 
                                    ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold" 
                                    : "bg-capsule-surf2/30 border-capsule-accent/10 hover:border-capsule-accent/20 text-capsule-text-secondary"
                                }`}
                              >
                                <span className="text-[11px] font-bold tracking-tight">{item.label}</span>
                                <span className={`text-[8px] leading-none opacity-80 ${stickerShape === item.val ? "text-white" : "text-capsule-text-muted"}`}>{item.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Dimensions Input */}
                        <div>
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">{t("common.dimensions", "Չափսեր (սմ)")}</label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="block text-[9px] text-capsule-text-muted mb-1 font-mono">ԼԱՅՆՈՒԹՅՈՒՆ (W)</span>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  step="0.5"
                                  value={stickerWidth}
                                  onChange={(e) => {
                                    setStickerWidth(e.target.value);
                                    setCalcResult(null);
                                  }}
                                  className="w-full bg-capsule-surf border border-capsule-accent/35 rounded-xl py-1 px-3 text-xs font-bold text-capsule-accent text-center focus:outline-none"
                                />
                                <span className="text-xs text-capsule-text-secondary">սմ</span>
                              </div>
                            </div>
                            <div>
                              <span className="block text-[9px] text-capsule-text-muted mb-1 font-mono">ԲԱՐՁՐՈՒԹՅՈՒՆ (H)</span>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  step="0.5"
                                  value={stickerHeight}
                                  onChange={(e) => {
                                    setStickerHeight(e.target.value);
                                    setCalcResult(null);
                                  }}
                                  className="w-full bg-capsule-surf border border-capsule-accent/35 rounded-xl py-1 px-3 text-xs font-bold text-capsule-accent text-center focus:outline-none"
                                />
                                <span className="text-xs text-capsule-text-secondary">սմ</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Material selection */}
                        <div>
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">{t("common.material", "Տպագրական Նյութ")}</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { val: "paper_gloss", label: "Թղթե Փայլուն", desc: "Gloss Paper" },
                              { val: "paper_matte", label: "Թղթե Փայլատ", desc: "Matte Paper" },
                              { val: "vinyl_white", label: "Սպիտակ Վինիլ", desc: "White Vinyl" },
                              { val: "vinyl_transparent", label: "Թափանցիկ Վինիլ", desc: "Transparent Vinyl" }
                            ].map((item) => (
                              <button
                                key={item.val}
                                type="button"
                                onClick={() => {
                                  setStickerMaterial(item.val as any);
                                  setCalcResult(null);
                                }}
                                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                                  stickerMaterial === item.val 
                                    ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold" 
                                    : "bg-capsule-surf border border-capsule-accent/10 hover:border-capsule-accent/20 text-capsule-text-secondary"
                                }`}
                              >
                                <span className="block text-[11px] font-bold tracking-tight">{item.label}</span>
                                <span className={`block text-[8px] opacity-80 mt-0.5 ${stickerMaterial === item.val ? "text-white" : "text-capsule-text-muted"}`}>{item.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Color selection */}
                        <div>
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">{t("common.colors", "Գունայնություն / Տպագրություն")}</label>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { val: 1, label: "Մոնոքրոմ", desc: "1+0" },
                              { val: 2, label: "Պանտոն", desc: "2+0" },
                              { val: 4, label: "CMYK", desc: "CMYK Լիագույն" },
                              { val: 5, label: "Premium", desc: "CMYK + Gold" }
                            ].map((item) => (
                              <button
                                key={item.val}
                                type="button"
                                onClick={() => {
                                  setStickerColors(item.val);
                                  setCalcResult(null);
                                }}
                                className={`py-1.5 px-1 rounded-xl text-center border cursor-pointer transition-all flex flex-col justify-center items-center gap-0.5 min-h-[46px] ${
                                  stickerColors === item.val 
                                    ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold" 
                                    : "bg-capsule-surf2/30 border-capsule-accent/10 hover:border-capsule-accent/20 text-capsule-text-secondary"
                                }`}
                              >
                                <span className="text-[11px] font-bold tracking-tight">{item.label}</span>
                                <span className={`text-[8px] leading-none opacity-85 ${stickerColors === item.val ? "text-white" : "text-capsule-text-muted"}`}>{item.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CARD 2: Sticker Quantity */}
                    <div className="bg-capsule-surf border border-capsule-accent/15 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                        <Sliders size={14} className="text-capsule-accent" />
                        <span>{t("sticker_qty_title", "Քարտ 2. Պատվերի Քանակ")}</span>
                      </div>
                      <p className="text-[10px] text-capsule-text-muted uppercase font-bold">{t("sticker_qty_desc", "Մեծաքանակ պատվերների դեպքում գործում են զգալի զեղչեր")}</p>

                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider font-mono">{t("common.qty_label", "Քանակ")}</label>
                          <div className="flex items-center gap-2 shrink-0">
                            <input
                              type="number"
                              min="300"
                              value={stickerQty || ""}
                              onChange={(e) => {
                                setStickerQty(Math.max(0, parseInt(e.target.value) || 0));
                                setCalcResult(null);
                              }}
                              className="w-24 bg-capsule-surf border border-capsule-accent/35 rounded-lg py-1 px-2.5 text-center font-mono text-xs font-bold text-capsule-accent"
                            />
                            <span className="text-xs text-capsule-text-secondary font-bold">հատ</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 font-mono">
                          {[300, 500, 1000, 2000, 5000].map((bqVal) => (
                            <button
                              key={bqVal}
                              type="button"
                              onClick={() => {
                                setStickerQty(bqVal);
                                setCalcResult(null);
                              }}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                                stickerQty === bqVal ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold" : "bg-capsule-surf border-capsule-accent/15 text-capsule-text-secondary hover:border-capsule-accent/30"
                              }`}
                            >
                              {bqVal.toLocaleString()} հատ
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTemplate === "giftcards" && (
                  <div className="space-y-6 animate-fade-in">
                    {/* CARD 1: Gift Cards Options */}
                    <div className="bg-capsule-surf border border-capsule-accent/15 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                        <Palette size={14} className="text-capsule-accent" />
                        <span>{t("giftcards_specs_title", "Քարտ 1. Նվեր Քարտի Պարամետրեր")}</span>
                      </div>
                      <p className="text-[10px] text-capsule-text-muted uppercase font-bold">{t("giftcards_specs_desc", "Ընտրեք չափսը, ծրարը և դիզայներական թղթի տեսակը")}</p>

                      <div className="space-y-4">
                        {/* Size Selection */}
                        <div>
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">{t("common.size", "Չափս")}</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { val: "standard", label: "A6 (10x15սմ)", desc: "Standard" },
                              { val: "mini", label: "7x10սմ", desc: "Mini" },
                              { val: "euro", label: "Եվրո (10x21սմ)", desc: "Euro size" }
                            ].map((item) => (
                              <button
                                key={item.val}
                                type="button"
                                onClick={() => {
                                  setGiftCardSize(item.val as any);
                                  setCalcResult(null);
                                }}
                                className={`py-2 px-1 rounded-xl text-center border cursor-pointer transition-all flex flex-col justify-center items-center gap-0.5 min-h-[46px] ${
                                  giftCardSize === item.val 
                                    ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold" 
                                    : "bg-capsule-surf2/30 border-capsule-accent/10 hover:border-capsule-accent/20 text-capsule-text-secondary"
                                }`}
                              >
                                <span className="text-[11px] font-bold tracking-tight">{item.label}</span>
                                <span className={`text-[8px] leading-none opacity-80 ${giftCardSize === item.val ? "text-white" : "text-capsule-text-muted"}`}>{item.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Envelope Selection */}
                        <div>
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">{t("common.envelope", "Ծրարի Տեսակ")}</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { val: "none", label: "Առանց ծրարի", desc: "No Envelope" },
                              { val: "standard_white", label: "Սպիտակ ստանդարտ", desc: "Standard White" },
                              { val: "kraft", label: "Կրաֆտ Էկո", desc: "Eco Kraft" },
                              { val: "colored_premium", label: "Գունավոր Պրեմիում", desc: "Premium Colored" }
                            ].map((item) => (
                              <button
                                key={item.val}
                                type="button"
                                onClick={() => {
                                  setGiftCardEnvelope(item.val as any);
                                  setCalcResult(null);
                                }}
                                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                                  giftCardEnvelope === item.val 
                                    ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold" 
                                    : "bg-capsule-surf border border-capsule-accent/10 hover:border-capsule-accent/20 text-capsule-text-secondary"
                                }`}
                              >
                                <span className="block text-[11px] font-bold tracking-tight">{item.label}</span>
                                <span className={`block text-[8px] opacity-80 mt-0.5 ${giftCardEnvelope === item.val ? "text-white" : "text-capsule-text-muted"}`}>{item.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Design Paper Selection */}
                        <div>
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">{t("common.paper", "Թուղթ / Նյութ")}</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { val: "silk_350", label: "Մետաքսե 350գ", desc: "Silk Cardboard" },
                              { val: "soft_touch_400", label: "Soft-Touch 400գ", desc: "Velvet Feel" },
                              { val: "textured_cream", label: "Տեքստուրային", desc: "Textured Cream" }
                            ].map((item) => (
                              <button
                                key={item.val}
                                type="button"
                                onClick={() => {
                                  setGiftCardPaper(item.val as any);
                                  setCalcResult(null);
                                }}
                                className={`py-2 px-1 rounded-xl text-center border cursor-pointer transition-all flex flex-col justify-center items-center gap-0.5 min-h-[46px] ${
                                  giftCardPaper === item.val 
                                    ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold" 
                                    : "bg-capsule-surf2/30 border-capsule-accent/10 hover:border-capsule-accent/20 text-capsule-text-secondary"
                                }`}
                              >
                                <span className="text-[11px] font-bold tracking-tight">{item.label}</span>
                                <span className={`text-[8px] leading-none opacity-80 ${giftCardPaper === item.val ? "text-white" : "text-capsule-text-muted"}`}>{item.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Printing Colors Selection */}
                        <div>
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">{t("common.colors", "Գունայնություն / Տպագրություն")}</label>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { val: 1, label: "Մոնոքրոմ", desc: "1+0" },
                              { val: 2, label: "Պանտոն", desc: "2+0" },
                              { val: 4, label: "CMYK", desc: "Լիագույն" },
                              { val: 5, label: "Premium", desc: "CMYK+Pantone" }
                            ].map((item) => (
                              <button
                                key={item.val}
                                type="button"
                                onClick={() => {
                                  setGiftCardColors(item.val);
                                  setCalcResult(null);
                                }}
                                className={`py-1.5 px-1 rounded-xl text-center border cursor-pointer transition-all flex flex-col justify-center items-center gap-0.5 min-h-[46px] ${
                                  giftCardColors === item.val 
                                    ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold" 
                                    : "bg-capsule-surf2/30 border-capsule-accent/10 hover:border-capsule-accent/20 text-capsule-text-secondary"
                                }`}
                              >
                                <span className="text-[11px] font-bold tracking-tight">{item.label}</span>
                                <span className={`text-[8px] leading-none opacity-85 ${giftCardColors === item.val ? "text-white" : "text-capsule-text-muted"}`}>{item.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Premium Finishes Checkbox Grid */}
                        <div>
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">{t("common.finishes", "Լրացուցիչ Մշակումներ")}</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { key: "foil", label: "✨ Ոսկեփայլ Տպագրություն", desc: "+ Foil Setup" },
                              { key: "uv", label: "💎 Spot UV Լաքապատում", desc: "+ Spot UV Setup" }
                            ].map((fin) => {
                              const isSel = giftCardFinishes.includes(fin.key);
                              return (
                                <button
                                  key={fin.key}
                                  type="button"
                                  onClick={() => {
                                    if (isSel) {
                                      setGiftCardFinishes(giftCardFinishes.filter(k => k !== fin.key));
                                    } else {
                                      setGiftCardFinishes([...giftCardFinishes, fin.key]);
                                    }
                                    setCalcResult(null);
                                  }}
                                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-center ${
                                    isSel
                                      ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold"
                                      : "bg-capsule-surf border-capsule-accent/10 text-capsule-text-secondary hover:border-capsule-accent/20"
                                  }`}
                                >
                                  <span className="text-xs font-bold leading-none">{fin.label}</span>
                                  <span className={`text-[8px] mt-1 ${isSel ? "text-white/80" : "text-capsule-text-muted"}`}>{fin.desc}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CARD 2: Gift Cards Quantity */}
                    <div className="bg-capsule-surf border border-capsule-accent/15 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                        <Sliders size={14} className="text-capsule-accent" />
                        <span>{t("giftcards_qty_title", "Քարտ 2. Պատվերի Քանակ")}</span>
                      </div>
                      <p className="text-[10px] text-capsule-text-muted uppercase font-bold">{t("giftcards_qty_desc", "Մեծաքանակ պատվերների դեպքում գործում են զգալի զեղչեր")}</p>

                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider font-mono">{t("common.qty_label", "Քանակ")}</label>
                          <div className="flex items-center gap-2 shrink-0">
                            <input
                              type="number"
                              min="30"
                              value={giftCardQty || ""}
                              onChange={(e) => {
                                setGiftCardQty(Math.max(0, parseInt(e.target.value) || 0));
                                setCalcResult(null);
                              }}
                              className="w-24 bg-capsule-surf border border-capsule-accent/35 rounded-lg py-1 px-2.5 text-center font-mono text-xs font-bold text-capsule-accent"
                            />
                            <span className="text-xs text-capsule-text-secondary font-bold">հատ</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 font-mono">
                          {[30, 50, 100, 200, 300, 500].map((bqVal) => (
                            <button
                              key={bqVal}
                              type="button"
                              onClick={() => {
                                setGiftCardQty(bqVal);
                                setCalcResult(null);
                              }}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                                giftCardQty === bqVal ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold" : "bg-capsule-surf border-capsule-accent/15 text-capsule-text-secondary hover:border-capsule-accent/30"
                              }`}
                            >
                              {bqVal.toLocaleString()} հատ
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTemplate === "businesscards" && (
                  <div className="space-y-6 animate-fade-in">
                    {/* CARD 1: Business Cards Specs */}
                    <div className="bg-capsule-surf border border-capsule-accent/15 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                        <Palette size={14} className="text-capsule-accent" />
                        <span>{t("businesscards_specs_title", "Քարտ 1. Այցեքարտի Պարամետրեր")}</span>
                      </div>
                      <p className="text-[10px] text-capsule-text-muted uppercase font-bold">{t("businesscards_specs_desc", "Ընտրեք այցեքարտի չափսը, թղթի տեսակը, կողմերը և անկյունները")}</p>

                      <div className="space-y-4">
                        {/* Size Selection */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">{t("common.size", "Չափս")}</label>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { val: "standard", label: "9x5 սմ" },
                                { val: "euro", label: "8.5x5.5 սմ" }
                              ].map((item) => (
                                <button
                                  key={item.val}
                                  type="button"
                                  onClick={() => {
                                    setBusinessCardSize(item.val as any);
                                    setCalcResult(null);
                                  }}
                                  className={`py-2 px-1 rounded-xl text-center border cursor-pointer transition-all flex flex-col justify-center items-center gap-0.5 min-h-[46px] ${
                                    businessCardSize === item.val 
                                      ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold" 
                                      : "bg-capsule-surf2/30 border-capsule-accent/10 hover:border-capsule-accent/20 text-capsule-text-secondary"
                                  }`}
                                >
                                  <span className="text-[11px] font-bold tracking-tight">{item.label}</span>
                                  <span className={`text-[8px] leading-none opacity-80 ${businessCardSize === item.val ? "text-white" : "text-capsule-text-muted"}`}>{item.val === "standard" ? "Standard" : "Euro"}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Corners Selection */}
                          <div>
                            <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">{t("common.corners", "Անկյուններ")}</label>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { val: "straight", label: "Ուղիղ", desc: "Straight" },
                                { val: "rounded", label: "Կլորացված", desc: "Rounded" }
                              ].map((item) => (
                                <button
                                  key={item.val}
                                  type="button"
                                  onClick={() => {
                                    setBusinessCardCorners(item.val as any);
                                    setCalcResult(null);
                                  }}
                                  className={`py-2 px-1 rounded-xl text-center border cursor-pointer transition-all flex flex-col justify-center items-center gap-0.5 min-h-[46px] ${
                                    businessCardCorners === item.val 
                                      ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold" 
                                      : "bg-capsule-surf2/30 border-capsule-accent/10 hover:border-capsule-accent/20 text-capsule-text-secondary"
                                  }`}
                                >
                                  <span className="text-[11px] font-bold tracking-tight">{item.label}</span>
                                  <span className={`text-[8px] leading-none opacity-80 ${businessCardCorners === item.val ? "text-white" : "text-capsule-text-muted"}`}>{item.desc}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Sides & Design Paper Selection */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Printing Sides Selection */}
                          <div>
                            <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">{t("common.sides", "Կիրառում / Կողմեր")}</label>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { val: 1, label: "Միակողմանի", desc: "1 Side" },
                                { val: 2, label: "Երկկողմանի", desc: "Double Sided" }
                              ].map((item) => (
                                <button
                                  key={item.val}
                                  type="button"
                                  onClick={() => {
                                    setBusinessCardSides(item.val);
                                    setCalcResult(null);
                                  }}
                                  className={`py-2 px-1 rounded-xl text-center border cursor-pointer transition-all flex flex-col justify-center items-center gap-0.5 min-h-[46px] ${
                                    businessCardSides === item.val 
                                      ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold" 
                                      : "bg-capsule-surf2/30 border-capsule-accent/10 hover:border-capsule-accent/20 text-capsule-text-secondary"
                                  }`}
                                >
                                  <span className="text-[11px] font-bold tracking-tight">{item.label}</span>
                                  <span className={`text-[8px] leading-none opacity-80 ${businessCardSides === item.val ? "text-white" : "text-capsule-text-muted"}`}>{item.desc}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Design Paper Selection */}
                          <div>
                            <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">{t("common.paper", "Թուղթ / Նյութ")}</label>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { val: "silk_350", label: "Մետաքսե 350գ", desc: "Silk" },
                                { val: "soft_touch_400", label: "Soft-Touch", desc: "Velvet" },
                                { val: "textured_premium", label: "Տեքստուրային", desc: "Textured" }
                              ].map((item) => (
                                <button
                                  key={item.val}
                                  type="button"
                                  onClick={() => {
                                    setBusinessCardPaper(item.val as any);
                                    setCalcResult(null);
                                  }}
                                  className={`py-2 px-1 rounded-xl text-center border cursor-pointer transition-all flex flex-col justify-center items-center gap-0.5 min-h-[46px] ${
                                    businessCardPaper === item.val 
                                      ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold" 
                                      : "bg-capsule-surf2/30 border-capsule-accent/10 hover:border-capsule-accent/20 text-capsule-text-secondary"
                                  }`}
                                >
                                  <span className="text-[10px] font-bold tracking-tight leading-none">{item.label}</span>
                                  <span className={`text-[8px] leading-none opacity-80 mt-0.5 ${businessCardPaper === item.val ? "text-white" : "text-capsule-text-muted"}`}>{item.desc}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Printing Colors Selection */}
                        <div>
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">{t("common.colors", "Գունայնություն / Տպագրություն")}</label>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { val: 1, label: "Մոնոքրոմ", desc: "1+0 / 1+1" },
                              { val: 2, label: "2 Գույն", desc: "Pantone" },
                              { val: 4, label: "CMYK", desc: "CMYK Լիագույն" },
                              { val: 5, label: "Premium", desc: "Pantone + Foil" }
                            ].map((item) => (
                              <button
                                key={item.val}
                                type="button"
                                onClick={() => {
                                  setBusinessCardColors(item.val);
                                  setCalcResult(null);
                                }}
                                className={`py-1.5 px-0.5 rounded-xl text-center border cursor-pointer transition-all flex flex-col justify-center items-center gap-0.5 min-h-[46px] ${
                                  businessCardColors === item.val 
                                    ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold" 
                                    : "bg-capsule-surf2/30 border-capsule-accent/10 hover:border-capsule-accent/20 text-capsule-text-secondary"
                                }`}
                              >
                                <span className="text-[11px] font-bold tracking-tight">{item.label}</span>
                                <span className={`text-[8px] leading-none opacity-85 ${businessCardColors === item.val ? "text-white" : "text-capsule-text-muted"}`}>{item.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Premium Finishes Checkbox Grid */}
                        <div>
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">{t("common.finishes", "Լրացուցիչ Մշակումներ")}</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { key: "foil", label: "✨ Ոսկեփայլ Տպագրություն", desc: "+ Foil Setup" },
                              { key: "uv", label: "💎 Spot UV Լաքապատում", desc: "+ Spot UV Setup" }
                            ].map((fin) => {
                              const isSel = businessCardFinishes.includes(fin.key);
                              return (
                                <button
                                  key={fin.key}
                                  type="button"
                                  onClick={() => {
                                    if (isSel) {
                                      setBusinessCardFinishes(businessCardFinishes.filter(k => k !== fin.key));
                                    } else {
                                      setBusinessCardFinishes([...businessCardFinishes, fin.key]);
                                    }
                                    setCalcResult(null);
                                  }}
                                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-center ${
                                    isSel
                                      ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold"
                                      : "bg-capsule-surf border-capsule-accent/10 text-capsule-text-secondary hover:border-capsule-accent/20"
                                  }`}
                                >
                                  <span className="text-xs font-bold leading-none">{fin.label}</span>
                                  <span className={`text-[8px] mt-1 ${isSel ? "text-white/80" : "text-capsule-text-muted"}`}>{fin.desc}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CARD 2: Business Cards Quantity */}
                    <div className="bg-capsule-surf border border-capsule-accent/15 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                        <Sliders size={14} className="text-capsule-accent" />
                        <span>{t("businesscards_qty_title", "Քարտ 2. Պատվերի Քանակ")}</span>
                      </div>
                      <p className="text-[10px] text-capsule-text-muted uppercase font-bold">{t("businesscards_qty_desc", "Մեծաքանակ պատվերների դեպքում գործում են զգալի զեղչեր")}</p>

                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider font-mono">{t("common.qty_label", "Քանակ")}</label>
                          <div className="flex items-center gap-2 shrink-0">
                            <input
                              type="number"
                              min="100"
                              value={businessCardQty || ""}
                              onChange={(e) => {
                                setBusinessCardQty(Math.max(0, parseInt(e.target.value) || 0));
                                setCalcResult(null);
                              }}
                              className="w-24 bg-capsule-surf border border-capsule-accent/35 rounded-lg py-1 px-2.5 text-center font-mono text-xs font-bold text-capsule-accent"
                            />
                            <span className="text-xs text-capsule-text-secondary font-bold">հատ</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 font-mono font-medium">
                          {[100, 200, 500, 1000, 2000].map((bqVal) => (
                            <button
                              key={bqVal}
                              type="button"
                              onClick={() => {
                                setBusinessCardQty(bqVal);
                                setCalcResult(null);
                              }}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                                businessCardQty === bqVal ? "bg-capsule-accent text-capsule-surf border-capsule-accent shadow-sm font-bold" : "bg-capsule-surf border-capsule-accent/15 text-capsule-text-secondary hover:border-capsule-accent/30"
                              }`}
                            >
                              {bqVal.toLocaleString()} հատ
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTemplate === "other_products" && (
                  <div className="space-y-6">
                    {/* CARD 1: Choice of extra print material */}
                    <div className="bg-capsule-surf border border-capsule-accent/15 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                        <Layers size={14} className="text-capsule-accent" />
                        <span>Քարտ 1. Ապրանքի Տեսակ</span>
                      </div>
                      <p className="text-[10px] text-capsule-text-muted uppercase font-bold">Ընտրեք ցանկալի տպագրական արտադրանքի տեսակը կամ բրենդավորման նյութը</p>

                      <div className="space-y-4">
                        {/* Select other product items */}
                        <div className="grid grid-cols-1 gap-3">
                          {products
                            .filter(p => p.categoryId === "other_products")
                            .flatMap(p => p.items || [])
                            .map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  setSelectedOtherProductId(item.id);
                                  // Auto-fill default qty if current is 0
                                  if (otherProductQty === 0) setOtherProductQty(100);
                                }}
                                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex justify-between items-center ${
                                  selectedOtherProductId === item.id ? "bg-capsule-accent/10 border-capsule-accent text-capsule-accent shadow-sm" : "bg-capsule-surf2/40 border-capsule-accent/10 hover:border-capsule-accent/20"
                                }`}
                              >
                                <div>
                                  <span className="block text-xs font-bold">{item.name}</span>
                                  {item.desc && <span className="block text-[10px] text-capsule-text-muted mt-1">{item.desc}</span>}
                                </div>
                                <div className="text-right font-mono">
                                  <span className="block text-xs font-bold text-capsule-accent">{item.price} ֏</span>
                                  <span className="block text-[8px] text-capsule-text-muted uppercase">մեկ {item.unit || "հատի"} համար</span>
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* CARD 2: Quantity & Technical Requirements */}
                    <div className="bg-capsule-surf border border-capsule-accent/15 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                        <Sliders size={14} className="text-capsule-accent" />
                        <span>Քարտ 2. Քանակ և Հատուկ Պահանջներ</span>
                      </div>
                      <p className="text-[10px] text-capsule-text-muted uppercase font-bold">Նշեք պահանջվող տպաքանակը և լրացրեք տեխնիկական պահանջները՝ անհատականացման համար</p>

                      <div className="space-y-4">
                        {/* Other Product Quantity selection */}
                        <div>
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">Քանակ</label>
                          <div className="flex flex-wrap gap-2 font-mono mb-3">
                            {[50, 100, 250, 500, 1000, 2500, 5000].map((bqVal) => (
                              <button
                                key={bqVal}
                                type="button"
                                onClick={() => setOtherProductQty(bqVal)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                                  otherProductQty === bqVal ? "bg-capsule-accent text-capsule-surf border-capsule-accent" : "bg-capsule-surf2/30 border-capsule-accent/10"
                                }`}
                              >
                                {bqVal} հատ
                              </button>
                            ))}
                          </div>
                          <input
                            type="number"
                            placeholder="Այլ քանակ..."
                            value={otherProductQty || ""}
                            onChange={(e) => setOtherProductQty(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full bg-capsule-surf2/40 border border-capsule-accent/10 focus:border-capsule-accent rounded-xl px-4 py-2 text-xs focus:outline-none font-bold"
                          />
                        </div>

                        {/* Extra Notes */}
                        <div>
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">Հավելյալ պահանջներ / Նշումներ</label>
                          <textarea
                            placeholder="Օրինակ՝ չափսեր, լամինացիայի տիպ, այլ նախընտրություններ..."
                            value={otherProductNotes}
                            onChange={(e) => setOtherProductNotes(e.target.value)}
                            className="w-full h-24 bg-capsule-surf2/40 border border-capsule-accent/10 focus:border-capsule-accent rounded-xl px-4 py-3 text-xs focus:outline-none resize-none font-sans"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTemplate === "qr_matrix" && (
                  <div className="space-y-6">
                    {/* CARD 1: Choose Code Label Type */}
                    <div className="bg-capsule-surf border border-capsule-accent/15 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                        <QrCode size={14} className="text-capsule-accent" />
                        <span>Քարտ 1. Կոդի Տեսակ / Պիտակ</span>
                      </div>
                      <p className="text-[10px] text-capsule-text-muted uppercase font-bold">Ընտրեք անհրաժեշտ ինտեգրվող կոդի տիպը, նախընտրելի չափսը կամ պիտակի տեսակը</p>

                      <div className="space-y-4">
                        {/* Select QR/Matrix Item */}
                        <div className="grid grid-cols-1 gap-3">
                          {products
                            .filter(p => p.categoryId === "qr_matrix")
                            .flatMap(p => p.items || [])
                            .map((item) => (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setSelectedQrMatrixId(item.id);
                                  // Auto-fill default qty if current is 0
                                  if (qrMatrixQty === 0) setQrMatrixQty(100);
                                }}
                                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex justify-between items-center ${
                                  selectedQrMatrixId === item.id ? "bg-capsule-accent/10 border-capsule-accent text-capsule-accent shadow-sm" : "bg-capsule-surf2/40 border-capsule-accent/10 hover:border-capsule-accent/20"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-2.5 rounded-xl transition-all ${selectedQrMatrixId === item.id ? "bg-capsule-accent text-white" : "bg-capsule-accent/10 text-capsule-accent"}`}>
                                    <QrCode size={18} />
                                  </div>
                                  <div>
                                    <span className="block text-xs font-bold">{item.name}</span>
                                    {item.desc && <span className="block text-[10px] text-capsule-text-muted mt-1">{item.desc}</span>}
                                  </div>
                                </div>
                                <div className="text-right font-mono">
                                  <span className="block text-xs font-bold text-capsule-accent">{item.price} ֏</span>
                                  <span className="block text-[8px] text-capsule-text-muted uppercase">մեկ {item.unit || "հատի"} համար</span>
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* CARD 2: Quantity & Technical Requirements */}
                    <div className="bg-capsule-surf border border-capsule-accent/15 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                        <Sliders size={14} className="text-capsule-accent" />
                        <span>Քարտ 2. Քանակ և Հատուկ Պահանջներ</span>
                      </div>
                      <p className="text-[10px] text-capsule-text-muted uppercase font-bold">Նշեք պահանջվող տպաքանակը և լրացրեք տեխնիկական պահանջները` անհատականացման համար</p>

                      <div className="space-y-4">
                        {/* QR Matrix Quantity selection */}
                        <div>
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">Քանակ</label>
                          <div className="flex flex-wrap gap-2 font-mono mb-3">
                            {[50, 100, 250, 500, 1000, 2500, 5000].map((bqVal) => (
                              <button
                                key={bqVal}
                                onClick={() => setQrMatrixQty(bqVal)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                                  qrMatrixQty === bqVal ? "bg-capsule-accent text-capsule-surf border-capsule-accent" : "bg-capsule-surf2/30 border-capsule-accent/10"
                                }`}
                              >
                                {bqVal} հատ
                              </button>
                            ))}
                          </div>
                          <input
                            type="number"
                            placeholder="Այլ քանակ..."
                            value={qrMatrixQty || ""}
                            onChange={(e) => setQrMatrixQty(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full bg-capsule-surf2/40 border border-capsule-accent/10 focus:border-capsule-accent rounded-xl px-4 py-2 text-xs focus:outline-none font-bold"
                          />
                        </div>

                        {/* Extra Notes */}
                        <div>
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">Սերիալացման տվյալներ / Հավելյալ նշումներ</label>
                          <textarea
                            placeholder="Օրինակ` հղումներ, սերիալացման հաջորդականություն (0001-1000), կամ այլ հատուկ պահանջներ..."
                            value={qrMatrixNotes}
                            onChange={(e) => setQrMatrixNotes(e.target.value)}
                            className="w-full h-24 bg-capsule-surf2/40 border border-capsule-accent/10 focus:border-capsule-accent rounded-xl px-4 py-3 text-xs focus:outline-none resize-none font-sans"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* DYNAMIC CATEGORY CALCULATOR RENDER */}
                {!["ribbons", "stickers", "giftcards", "businesscards", "other_products", "qr_matrix"].includes(activeTemplate) && (
                  (() => {
                    const matchedCat = categories.find(c => c.id === activeCategory);
                    const matchedProd = products.find(p => p.categoryId === activeCategory);
                    if (matchedCat && matchedProd) {
                      return (
                        <DynamicProductCalculator
                          product={matchedProd as any}
                          category={matchedCat as any}
                          tiers={tiers}
                          onCalculate={(summary) => {
                            setCalcResult({
                              unitPrice: summary.unitPrice,
                              totalPrice: summary.totalPrice,
                              qty: summary.qty,
                              itemName: matchedProd.name,
                              materialType: Object.values(summary.selectedOptionValues).map(v => v.label).join(", ") || "Custom",
                              dimensionsText: `${summary.dimensions.w}x${summary.dimensions.h}${summary.dimensions.d ? `x${summary.dimensions.d}` : ""} սմ`,
                              detailsText: summary.details,
                            });
                          }}
                        />
                      );
                    }
                    return null;
                  })()
                )}

              </div>

              {/* Right Column: Output Card */}
              <div className="lg:col-span-4 sticky top-6">
                <div className="bg-capsule-surf border border-capsule-accent/15 rounded-3xl p-6 shadow-md space-y-5">
                  <div>
                    <span className="bg-capsule-accent/10 px-2 py-0.5 rounded text-[8px] font-bold text-capsule-accent tracking-widest uppercase">
                      Գնառաջարկ (Calculated)
                    </span>
                    <h3 className="font-serif text-lg text-capsule-accent font-semibold mt-3">
                      {calcResult ? calcResult.itemName : "Հաշվարկում..."}
                    </h3>
                    <p className="text-[10px] text-capsule-text-muted mt-0.5">
                      Տեսակ: {calcResult ? calcResult.materialType : "---"} | Քանակ: {calcResult ? calcResult.qty : "---"} {activeCategory === "ribbons" ? "մետր" : "հատ"}
                    </p>
                  </div>

                  {calcError ? (
                    <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3.5 rounded-xl font-semibold">
                      {calcError}
                    </div>
                  ) : !calcResult ? (
                    <div className="py-8 px-4 text-center text-capsule-text-muted space-y-3 select-none">
                      <HelpCircle className="mx-auto text-capsule-accent/40" size={24} />
                      <div className="text-[11px] font-bold text-capsule-accent/80 uppercase tracking-wider font-mono">Ընտրեք Բոլոր Պարամետրերը</div>
                      <p className="text-[10px] sm:text-xs leading-relaxed max-w-xs mx-auto text-capsule-text-secondary">
                        Արժեքը և 3D նախադիտումը տեսնելու համար խնդրում ենք ընտրել բոլոր պարտադիր դաշտերը՝
                      </p>
                      {getMissingOptions().length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1 mt-2">
                          {getMissingOptions().map((opt) => (
                            <span key={opt} className="px-2 py-0.5 rounded bg-capsule-accent/5 border border-capsule-accent/15 text-capsule-accent text-[9px] font-bold whitespace-nowrap">
                              ● {opt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4 text-xs text-capsule-text-secondary">
                      
                      <div className="space-y-2 border-b border-capsule-accent/10 pb-4">
                        <div className="flex justify-between items-center py-1">
                          <span>{t("common.category", "Ապրանքի Բաժին")}</span>
                          <span className="font-bold text-capsule-dark uppercase">
                            {t(`db.category.${activeCategory}.name`, categories.find(c => c.id === activeCategory)?.name || activeCategory)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span>{t("common.size", "Ընտրված Չափս")}</span>
                          <span className="font-bold text-capsule-dark uppercase">{calcResult.dimensionsText}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span>{t("common.qty_label", "Պատվերի Քանակ")}</span>
                          <span className="font-bold text-capsule-dark font-mono">
                            {calcResult.qty} {activeCategory === "ribbons" ? t("common.units.meters", "մետր") : t("common.units.pcs", "հատ")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span>{t("common.material_type", "Նյութի տեսակ")}</span>
                          <span className="font-bold text-capsule-dark text-right uppercase">
                            {calcResult.materialType}
                          </span>
                        </div>

                        {activeCategory === "ribbons" && (
                          <>
                            <div className="flex justify-between items-center py-1">
                              <span>{t("common.ribbon_type", "Ժապավենի տեսակ")}</span>
                              <span className="font-bold text-capsule-dark uppercase">{calcResult.type === "reps" ? t("options.ribbon_reps", "Ռեպսե") : t("options.ribbon_satin", "Սատինե")}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                              <span>{t("common.ribbon_width", "Ժապավենի լայնություն")}</span>
                              <span className="font-bold text-capsule-dark uppercase font-mono">{calcResult.width} {t("common.units.cm", "սմ")}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                              <span>{t("common.print_color", "Տպագրության գույն")}</span>
                              <span className="font-bold text-capsule-dark uppercase">
                                {calcResult.printColor === "foil_gold" ? t("options.print_color_gold_foil", "Ոսկեփայլ Ֆոյլ") : calcResult.printColor === "foil_silver" ? t("options.print_color_silver_foil", "Արծաթափայլ Ֆոյլ") : t("options.print_color_silkscreen", "Մաղային տպագրություն")}
                              </span>
                            </div>
                          </>
                        )}

                        {activeCategory === "stickers" && (
                          <div className="flex justify-between items-center py-1">
                            <span>{t("common.sticker_shape", "Ֆորմատ / Ձև")}</span>
                            <span className="font-bold text-capsule-dark uppercase">
                              {calcResult.shape === "circle" ? t("options.shape_circle", "Կլոր") : calcResult.shape === "rectangle" ? t("options.shape_square", "Ուղղանկյուն") : t("options.shape_custom", "Ձևավոր / Կոնտուրային")}
                            </span>
                          </div>
                        )}

                        {activeCategory === "giftcards" && (
                          <div className="flex justify-between items-center py-1">
                            <span>{t("common.envelope", "Ծրարի Տեսակ")}</span>
                            <span className="font-bold text-capsule-dark uppercase">
                              {calcResult.envelope === "none" ? t("options.envelope_none", "Առանց ծրարի") : calcResult.envelope === "standard_white" ? t("options.envelope_standard_white", "Սպիտակ ծրար") : calcResult.envelope === "kraft" ? t("options.envelope_kraft", "Կրաֆտ ծրար") : t("options.envelope_colored_premium", "Գունավոր պրեմիում ծրար")}
                            </span>
                          </div>
                        )}

                        {activeCategory === "businesscards" && (
                          <>
                            <div className="flex justify-between items-center py-1">
                              <span>{t("common.sides", "Կիրառում")}</span>
                              <span className="font-bold text-capsule-dark uppercase">{calcResult.sides === 2 ? t("options.sides_2", "Երկկողմանի") : t("options.sides_1", "Միակողմանի")}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                              <span>{t("common.corners", "Անկյուններ")}</span>
                              <span className="font-bold text-capsule-dark uppercase">{calcResult.corners === "rounded" ? t("options.corners_rounded", "Կլորացված") : t("options.corners_straight", "Ուղղաղ")}</span>
                            </div>
                          </>
                        )}

                        {activeCategory === "other_products" && (
                          <div className="flex justify-between items-start py-1 flex-col gap-1 w-full border-t border-capsule-accent/5 pt-2 mt-2">
                            <span className="text-[10px] text-capsule-text-secondary">{t("common.other_notes", "Հավելյալ պահանջներ (Նշումներ)՝")}</span>
                            <span className="font-semibold text-capsule-dark h-auto italic whitespace-pre-wrap text-[10px] sm:text-xs leading-snug bg-capsule-surf2/20 p-2 rounded-xl w-full border border-capsule-accent/5">
                              {otherProductNotes || t("common.no_notes", "Չկան հատուկ նշումներ")}
                            </span>
                          </div>
                        )}

                        {activeCategory === "qr_matrix" && (
                          <div className="flex justify-between items-start py-1 flex-col gap-1 w-full border-t border-capsule-accent/5 pt-2 mt-2">
                            <span className="text-[10px] text-capsule-text-secondary">{t("common.qr_notes", "Սերիալացման տվյալներ (Նշումներ)՝")}</span>
                            <span className="font-semibold text-capsule-dark h-auto italic whitespace-pre-wrap text-[10px] sm:text-xs leading-snug bg-capsule-surf2/20 p-2 rounded-xl w-full border border-capsule-accent/5">
                              {qrMatrixNotes || t("common.no_notes", "Չկան հատուկ նշումներ")}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-center py-1">
                          <span>{t("common.unit_price", "Միավորի Գին")}</span>
                          <span className="font-bold font-mono text-capsule-accent text-sm">
                            {formatPrice(calcResult.unitPrice)} <span className="text-[10px] text-capsule-text-muted">/ {activeCategory === "ribbons" ? t("common.units.meters", "մ") : t("common.units.pcs", "հատ")}</span>
                          </span>
                        </div>
                      </div>

                      {/* Promo coupon interface */}
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold text-capsule-text-muted uppercase">{t("common.coupon_code2", "Պրոմո Կոդ")}</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value.toUpperCase().replace(/\s/g, ""))}
                            disabled={!!appliedPromo}
                            placeholder="EX: WELCOME10"
                            className="flex-1 bg-capsule-surf2 border border-capsule-accent/15 rounded-lg py-1 px-2.5 text-xs text-capsule-dark font-bold font-mono outline-none"
                          />
                          {appliedPromo ? (
                            <button
                              type="button"
                              onClick={() => {
                                setAppliedPromo("");
                                setPromoInput("");
                                setPromoSuccess(null);
                                setPromoError(null);
                                setDiscountAmount(0);
                              }}
                              className="bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg cursor-pointer"
                            >
                              {t("common.cancel", "Չեղարկել")}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleApplyCoupon}
                              className="bg-capsule-accent text-capsule-surf text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-lg cursor-pointer"
                            >
                              {t("common.apply", "Կիրառել")}
                            </button>
                          )}
                        </div>
                        {promoError && <p className="text-[10px] text-red-700 font-semibold">{promoError}</p>}
                        {promoSuccess && <p className="text-[10px] text-green-700 font-bold">{promoSuccess}</p>}
                      </div>

                      {/* Price view */}
                      <div className="border-t border-capsule-accent/10 pt-4 flex justify-between items-baseline">
                        <span className="text-[10px] font-bold uppercase block text-capsule-text-muted">{t("common.total_price", "Ընդամենը")}</span>
                        <h3 className="text-2xl font-extrabold text-capsule-accent font-sans">{formatPrice(calcResult.totalPrice)}</h3>
                      </div>

                      <div className="space-y-2 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            let desc = `${t("inquiry_modal.msg_subject", "Պատվերի Հայտ")}:\n${t("common.category", "Բաժին")}: ${t(`db.category.${activeCategory}.name`, categories.find(c => c.id === activeCategory)?.name || activeCategory)}\n${t("common.product", "Ապրանք")}: ${calcResult.itemName}\n${t("common.dimensions", "Չափսեր (սմ)")}: ${calcResult.dimensionsText}\n${t("common.qty_label", "Քանակ")}: ${calcResult.qty} ${activeCategory === "ribbons" ? t("common.units.meters") : t("common.units.pcs")}\n${t("common.material_type", "Նյութը")}: ${calcResult.materialType}\n${t("inquiry_modal.desc_title", "Մանրամասներ")}:`;
                            if (activeCategory === "ribbons") {
                              desc += `\n- ${t("common.ribbon_width", "Լայնություն")}: ${calcResult.width} ${t("common.units.cm", "սմ")}\n- ${t("common.ribbon_type", "Տիպ")}: ${calcResult.type === "reps" ? t("options.ribbon_reps") : t("options.ribbon_satin")}\n- ${t("common.print_color", "Տպագրություն")}: ${calcResult.printColor === "foil_gold" ? t("options.print_color_gold_foil") : calcResult.printColor === "foil_silver" ? t("options.print_color_silver_foil") : t("options.print_color_silkscreen")}`;
                            } else if (activeCategory === "stickers") {
                              desc += `\n- ${t("common.sticker_shape", "Ձև")}: ${calcResult.shape === "circle" ? t("options.shape_circle") : calcResult.shape === "rectangle" ? t("options.shape_square") : t("options.shape_custom")}\n- ${t("common.material", "Նյութ")}: ${calcResult.materialType}`;
                            } else if (activeCategory === "giftcards") {
                              desc += `\n- ${t("common.envelope", "Ծրար")}: ${calcResult.envelope === "none" ? t("options.envelope_none") : calcResult.envelope === "standard_white" ? t("options.envelope_standard_white") : calcResult.envelope === "kraft" ? t("options.envelope_kraft") : t("options.envelope_colored_premium")}\n- ${t("common.paper", "Թուղթ")}: ${calcResult.paper}`;
                            } else if (activeCategory === "businesscards") {
                              desc += `\n- ${t("common.sides", "Կողմեր")}: ${calcResult.sides === 2 ? t("options.sides_2", "Երկկողմանի") : t("options.sides_1", "Միակողմանի")}\n- ${t("common.corners", "Անկյուններ")}: ${calcResult.corners === "rounded" ? t("options.corners_rounded", "Կլորացված") : t("options.corners_straight", "Ուղիղ")}\n- ${t("common.paper", "Թուղթ")}: ${calcResult.paper}`;
                            } else if (!["bags", "boxes", "ribbons", "stickers", "giftcards", "businesscards", "other_products", "qr_matrix"].includes(activeCategory)) {
                              desc += `\n- ${t("common.material_type", "Պարամետրեր")}: ${calcResult.materialType}`;
                              if (calcResult.detailsText) desc += `\n- ${calcResult.detailsText}`;
                            }
                            desc += `\n${t("common.unit_price", "Միավորի Գին")}: ${formatPrice(calcResult.unitPrice)}\n${t("common.total_price", "Ընդամենը")}: ${formatPrice(calcResult.totalPrice)}`;
                            setInquiryDetails(desc);
                            setInquiryPrice(calcResult.totalPrice);
                            setIsInquiryOpen(true);
                          }}
                          className="w-full bg-[#ff2300] hover:bg-[#e61f00] text-white text-xs py-3 rounded-full font-bold uppercase cursor-pointer text-center select-none flex justify-center items-center gap-1.5 transition-all duration-250"
                        >
                          <ShoppingBag size={14} />
                          <span>{t("buttons.complete_order", "Ձևակերպել Պատվերը")}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddItemToBundle(activeCategory)}
                          className="w-full bg-capsule-surf hover:bg-capsule-accent/5 text-capsule-accent border border-capsule-accent/20 text-xs py-3 rounded-full font-bold uppercase cursor-pointer text-center select-none flex justify-center items-center gap-1.5 transition-all duration-250"
                        >
                          <ShoppingCart size={14} />
                          <span>{t("buttons.add_to_cart", "Ավելացնել Զամբյուղին")}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSaveToCabinet}
                          className="w-full bg-red-50/50 hover:bg-red-50 text-[#ff2300] border border-[#ff2300]/20 text-xs py-3 rounded-full font-bold uppercase cursor-pointer text-center select-none flex justify-center items-center gap-1.5 transition-all duration-250"
                        >
                          <Bookmark size={14} />
                          <span>{locale === "hy" ? "Պահպանել Կաբինետում" : locale === "ru" ? "Сохранить в кабинет" : "Save to Cabinet"}</span>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

      {/* Contact & FAQ Grid Container */}
      <div className="max-w-6xl mx-auto px-4 mt-16 mb-12 select-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Frequently Asked Questions (FAQ) Block */}
          <div className="w-full bg-[#FAFAF9] border-3 border-white rounded-[2.5rem] p-6 sm:p-10 shadow-[8px_8px_20px_#E5E3DF,_-8px_-8px_20px_#FFFFFF] relative overflow-hidden flex flex-col transition-all duration-300">
            <div className="relative z-10 flex flex-col w-full">
              {/* Elegant tiny line indicator */}
              <div className="w-10 h-1 bg-capsule-accent/15 rounded-full mb-5 mx-auto"></div>

              {/* Heading with Under-smile Line signature */}
              <div className="flex flex-col items-center select-none pt-1 mb-6 text-center">
                <h4 className="font-serif text-lg sm:text-xl font-bold tracking-widest text-[#7C8592] uppercase">
                  {locale === "hy" ? "Հաճախ տրվող հարցեր" :
                   locale === "ru" ? "Часто задаваемые вопросы" :
                   locale === "ar" ? "الأسئلة الشائعة" :
                   "Frequently Asked Questions"}
                </h4>
                {/* Hand-curved smile-underline vector */}
                <svg className="w-16 h-2.5 text-capsule-accent/75 mt-1.5" viewBox="0 0 48 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 2C12 6.5 36 6.5 46 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <p className="text-[9px] sm:text-[10px] text-capsule-dark-secondary/40 font-mono font-bold uppercase tracking-widest mt-3.5">
                  {locale === "hy" ? "Պատասխաններ հանրամատչելի հարցերին" :
                   locale === "ru" ? "Ответы на популярные вопросы" :
                   locale === "ar" ? "إجابات على الأسئلة الشائعة" :
                   "Answers to popular questions"}
                </p>
              </div>

              {/* FAQ Accordion list */}
              <div className="space-y-4">
                {FAQ_ITEMS.map((item, idx) => {
                  const isOpen = activeFaq === idx;
                  const questionText = item.question[locale as LocaleType] || item.question["hy"];
                  const answerText = item.answer[locale as LocaleType] || item.answer["hy"];

                  return (
                    <div 
                      key={idx}
                      className="group flex flex-col w-full rounded-2xl bg-[#FAFAF9] border border-white/60 transition-all duration-300"
                      style={{
                        boxShadow: isOpen 
                          ? "inset 3px 3px 6px #E5E3DF, inset -3px -3px 6px #FFFFFF" 
                          : "4px 4px 8px #E5E3DF, -4px -4px 8px #FFFFFF"
                      }}
                    >
                      {/* Accordion header button */}
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between text-left py-3.5 px-4 sm:px-5 gap-3 transition-colors duration-200 hover:text-capsule-accent cursor-pointer select-none bg-transparent border-none outline-none focus:outline-none"
                      >
                        <span className="text-xs sm:text-[13px] font-sans font-extrabold text-[#3a2010] leading-snug group-hover:text-capsule-accent transition-colors duration-200">
                          {questionText}
                        </span>
                        <div 
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                            isOpen 
                              ? "bg-capsule-accent text-white rotate-180 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.15)]" 
                              : "bg-capsule-accent/10 text-capsule-accent hover:bg-capsule-accent/15"
                          }`}
                        >
                          <ChevronDown size={12} className="stroke-[2.5]" />
                        </div>
                      </button>

                      {/* Accordion content body using simple React height and ease transitions */}
                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-capsule-dark-secondary/80 font-sans leading-relaxed select-text border-t border-dashed border-capsule-border/10 pt-3">
                          {answerText}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Direct Contact column */}
          <div className="w-full bg-[#FAFAF9] border-3 border-white rounded-[2.5rem] p-6 sm:p-10 shadow-[8px_8px_20px_#E5E3DF,_-8px_-8px_20px_#FFFFFF] relative overflow-hidden flex flex-col transition-all duration-300">
            <div className="relative z-10 flex flex-col w-full">
              {/* Elegant tiny line indicator */}
              <div className="w-10 h-1 bg-capsule-accent/15 rounded-full mb-5 mx-auto"></div>

              <div className="flex flex-col items-center select-none pt-1 mb-6 text-center">
                <h4 className="font-serif text-lg sm:text-xl font-bold tracking-widest text-[#7C8592] uppercase">
                  {t("contact.heading", "GET IN TOUCH")}
                </h4>
                {/* Hand-curved smile-underline vector */}
                <svg className="w-16 h-2.5 text-capsule-accent/75 mt-1.5" viewBox="0 0 48 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 2C12 6.5 36 6.5 46 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <p className="text-[9px] sm:text-[10px] text-capsule-dark-secondary/40 font-mono font-bold uppercase tracking-widest mt-3.5">
                  {t("contact.subheading", "Contact & Wholesale inquiries")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6 w-full max-w-lg select-none">
                {/* Phone item */}
                <a 
                  href="tel:+37499218090" 
                  className="group flex items-center justify-center gap-3 bg-[#FAFAF9] border border-white/60 hover:border-capsule-accent/20 py-3.5 px-5 rounded-2xl w-full sm:w-1/2 transition-all duration-300 shadow-[4px_4px_8px_#E5E3DF,_-4px_-4px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#DCDAD5,_-5px_-5px_10px_#FFFFFF] active:shadow-[inset_2.5px_2.5px_5px_#E5E3DF,_inset_-2.5px_-2.5px_5px_#FFFFFF] active:scale-97"
                >
                  <div className="w-8 h-8 rounded-full bg-capsule-accent/10 text-capsule-accent flex items-center justify-center shrink-0 transition-all group-hover:bg-capsule-accent group-hover:text-white duration-300 shadow-[2px_2px_4px_rgba(163,153,139,0.1)]">
                    <Phone size={13} />
                  </div>
                  <div className="text-left">
                    <span className="block text-[8px] uppercase tracking-wider text-[#A8AFBA] font-mono font-bold leading-none mb-0.5">
                      {t("contact.phone_label", "Հեռախոս")}
                    </span>
                    <span className="text-[#3a2010] font-sans font-extrabold text-xs sm:text-sm group-hover:text-capsule-accent transition-colors duration-200">
                      +374 99 218090
                    </span>
                  </div>
                </a>

                {/* Email item */}
                <a 
                  href={`mailto:${contactSettings.email || "order@capsule.am"}`} 
                  className="group flex items-center justify-center gap-3 bg-[#FAFAF9] border border-white/60 hover:border-capsule-accent/20 py-3.5 px-5 rounded-2xl w-full sm:w-1/2 transition-all duration-300 shadow-[4px_4px_8px_#E5E3DF,_-4px_-4px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#DCDAD5,_-5px_-5px_10px_#FFFFFF] active:shadow-[inset_2.5px_2.5px_5px_#E5E3DF,_inset_-2.5px_-2.5px_5px_#FFFFFF] active:scale-97"
                >
                  <div className="w-8 h-8 rounded-full bg-capsule-accent/10 text-capsule-accent flex items-center justify-center shrink-0 transition-all group-hover:bg-capsule-accent group-hover:text-white duration-300 shadow-[2px_2px_4px_rgba(163,153,139,0.1)]">
                    <Mail size={13} />
                  </div>
                  <div className="text-left">
                    <span className="block text-[8px] uppercase tracking-wider text-[#A8AFBA] font-mono font-bold leading-none mb-0.5">
                      {t("contact.email_label", "Էլ․ Փոստ")}
                    </span>
                    <span className="text-[#3a2010] font-sans font-extrabold text-xs sm:text-sm group-hover:text-capsule-accent transition-colors duration-200 break-all">
                      {contactSettings.email || "order@capsule.am"}
                    </span>
                  </div>
                </a>
              </div>

              {/* Elegant Divider */}
              <div className="flex items-center gap-4 w-full my-7 select-none">
                <div className="h-[1.5px] bg-gradient-to-r from-transparent via-[#E5E3DF] to-transparent flex-1"></div>
                <span className="text-[9.5px] font-mono tracking-widest text-[#3D271B]/60 font-bold uppercase leading-none">
                  {locale === "hy" ? "Կամ Ուղարկեք Հաղորդագրություն" : 
                   locale === "ru" ? "ИЛИ ОТПРАВЬТЕ СООБЩЕНИЕ" : 
                   locale === "ar" ? "أו أرسل لنا رسالة" : 
                   "OR SEND A DIRECT MESSAGE"}
                </span>
                <div className="h-[1.5px] bg-gradient-to-l from-transparent via-[#E5E3DF] to-transparent flex-1"></div>
              </div>

              {/* Direct Message Form */}
              <form onSubmit={handleSendContactMessage} className="w-full text-left space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-extrabold uppercase tracking-widest text-[#7C8592]/95 pl-1.5">
                      {t("contact.name_label", "Your Name / Brand")}
                    </label>
                    <div className="w-full flex items-center bg-[#FAFAF9] rounded-full px-5 py-3.5 shadow-[inset_4px_4px_8px_#E5E3DF,_inset_-4px_-4px_8px_#FFFFFF] border border-white/20 focus-within:border-capsule-accent/40 focus-within:shadow-[inset_4px_4px_8px_#DCDAD5,_inset_-4px_-4px_8px_#FFFFFF,_0_0_12px_rgba(124,133,146,0.08)] transition-all duration-250">
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder={t("contact.name_placeholder", "e.g., John Doe / Coco Bakery")}
                        className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-xs sm:text-[13px] text-gray-700 font-semibold placeholder:text-[#A8AFBA] font-sans"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact info (Email/Phone) */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-extrabold uppercase tracking-widest text-[#7C8592]/95 pl-1.5">
                      {t("contact.contact_label", "Your Phone or Email")}
                    </label>
                    <div className="w-full flex items-center bg-[#FAFAF9] rounded-full px-5 py-3.5 shadow-[inset_4px_4px_8px_#E5E3DF,_inset_-4px_-4px_8px_#FFFFFF] border border-white/20 focus-within:border-capsule-accent/40 focus-within:shadow-[inset_4px_4px_8px_#DCDAD5,_inset_-4px_-4px_8px_#FFFFFF,_0_0_12px_rgba(124,133,146,0.08)] transition-all duration-250">
                      <input
                        type="text"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder={t("contact.contact_placeholder", "e.g., +374 99 123456 or mail@example.com")}
                        className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-xs sm:text-[13px] text-gray-700 font-semibold placeholder:text-[#A8AFBA] font-sans"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Message text */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-extrabold uppercase tracking-widest text-[#7C8592]/95 pl-1.5">
                    {t("contact.message_label", "Your Message")}
                  </label>
                  <div className="w-full flex items-center bg-[#FAFAF9] rounded-[1.75rem] px-5 py-4 shadow-[inset_4px_4px_8px_#E5E3DF,_inset_-4px_-4px_8px_#FFFFFF] border border-white/20 focus-within:border-capsule-accent/25 transition-all duration-200">
                    <textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder={t("contact.message_placeholder", "Write your inquiry, custom sizes, or questions here...")}
                      rows={3}
                      className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-xs sm:text-[13px] text-gray-700 font-semibold placeholder:text-[#A8AFBA] resize-none"
                      required
                    />
                  </div>
                </div>

                {/* Submit CTA - Premium, exact match of the burgundy "Log in" round pill from Screenshot 1 */}
                <button
                  type="submit"
                  disabled={isSendingMsg}
                  className="w-full flex items-center justify-center gap-2.5 bg-[#FAFAF9] rounded-full py-4 text-capsule-accent font-sans font-extrabold text-xs sm:text-[13px] tracking-widest uppercase border-2 border-white shadow-[4px_4px_10px_rgba(163,153,139,0.35),_-4px_-4px_10px_#FFFFFF] hover:shadow-[6px_6px_12px_rgba(163,153,139,0.4),_-6px_-6px_12px_#FFFFFF] active:shadow-[inset_2px_2px_5px_#E5E3DF,_inset_-2px_-2px_5px_#FFFFFF] active:scale-[0.98] transition-all duration-250 cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSendingMsg ? (
                    <>
                      <RefreshCw className="animate-spin text-capsule-accent" size={14} />
                      <span>{t("contact.sending", "Sending...")}</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} className="text-capsule-accent" />
                      <span>{t("contact.send_message", "Send Direct Message & Email")}</span>
                    </>
                  )}
                </button>

                {/* Success Notification Alert */}
                <AnimatePresence>
                  {msgSentSuccess && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: 10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-[#ff2300]/10 border border-[#ff2300]/20 rounded-xl p-3 flex items-center gap-2.5 mt-3 select-none text-[#ff2300] text-[11px] font-medium leading-normal">
                        <div className="w-5 h-5 rounded-full bg-[#ff2300]/20 flex items-center justify-center shrink-0 text-[#ff2300]">
                          <Check size={12} className="stroke-[3]" />
                        </div>
                        <p>{t("contact.message_success", "Thank you! Your message was saved and email draft prepared.")}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Footer system */}
      <footer className="py-10 text-center text-capsule-text-muted text-xs select-none border-t border-capsule-accent/5 mt-16 bg-transparent">
        <p 
          onClick={handleLogoClickClick}
          className="font-arial cursor-pointer transition-all active:scale-98"
        >
          &copy; {new Date().getFullYear()} Capsule Concept Studio. All rights reserved.
        </p>
      </footer>

      {/* Inquiry modal popup */}
      <OrderInquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        inquiryDetails={inquiryDetails}
        inquiryPrice={inquiryPrice}
        inquiryType={activeCategory}
        contactSettings={contactSettings}
        appliedPromo={appliedPromo || undefined}
        promoDiscount={discountAmount || undefined}
        onAddSubmission={handleCreateSubmission}
      />

      {/* Client Cabinet (Personal Cabinet) Overlay */}
      <AnimatePresence>
        {isClientCabinetOpen && (
          <ClientCabinet
            onClose={() => setIsClientCabinetOpen(false)}
            locale={locale}
            onReorder={(submission) => {
              // Automatic "reorder in 1-click": loads order specifications and opens checkout direct!
              setInquiryDetails(submission.details);
              setInquiryPrice(submission.totalPrice);
              setIsInquiryOpen(true);
              setIsClientCabinetOpen(false);
            }}
            partnerDiscountActive={partnerDiscount}
            setPartnerDiscountActive={setPartnerDiscount}
            setUserEmailState={setUserEmail}
            initialTab={cabinetInitialTab}
            initialAuthTab={cabinetInitialAuthTab}
          />
        )}
      </AnimatePresence>

      {/* Navigation & Catalog Drawer Menu */}
      <AnimatePresence>
        {isDrawerMenuOpen && (
          <div className="fixed inset-0 z-[300] flex justify-end" id="app-navigation-drawer" dir={isRtl ? "rtl" : "ltr"}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-[#1A1A1A]/50 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsDrawerMenuOpen(false)}
            />

            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: isRtl ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "-100%" : "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-[24rem] h-full bg-[#F8F6F1] shadow-[-16px_0_36px_#C4BDB1] flex flex-col border-l-2 border-white/60 z-10 overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/40 bg-[#F8F6F1] select-none shadow-[0_4px_10px_-4px_rgba(211,205,191,0.5)] z-10">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-2xl bg-[#F8F6F1] text-[#1A3F25] font-serif font-black flex items-center justify-center shadow-[inset_2.5px_2.5px_5px_#D3CDBF,_inset_-2.5px_-2.5px_5px_#FFFFFF] border border-white/30 text-sm">
                    C
                  </div>
                  <div>
                    <h3 className="font-serif text-xs tracking-[0.18em] font-black text-[#1A3F25] uppercase">
                      THE CAPSULE LAB
                    </h3>
                    <p className="text-[9px] font-mono tracking-wider text-[#7C8797] uppercase">
                      Premium Navigation
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDrawerMenuOpen(false)}
                  className="cursor-pointer h-9 w-9 rounded-full bg-[#F8F6F1] text-[#7C8797] hover:text-[#1A3F25] shadow-[3px_3px_6px_#D3CDBF,_-3px_-3px_6px_#FFFFFF] hover:shadow-[4px_4px_8px_#D3CDBF,_-4px_-4px_8px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#D3CDBF,_inset_-2px_-2px_4px_#FFFFFF] flex items-center justify-center transition-all border-none outline-none select-none"
                  title="Close Menu"
                >
                  <X size={13} className="stroke-[2.5]" />
                </button>
              </div>

              {/* Centralized Language Selector */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/30 bg-[#F8F6F1] select-none z-10 shadow-[0_2px_6px_-2px_rgba(211,205,191,0.3)]">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#7C8797]/80 block">
                  {locale === "hy" ? "Ընտրել Լեզուն" : locale === "ru" ? "Выбрать Язык" : "Select Language"}
                </span>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  {(["hy", "ru", "en"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLocale(lang)}
                      className={`cursor-pointer px-3.5 py-1.5 rounded-xl transition-all duration-200 border text-[9px] font-black ${
                        locale === lang 
                          ? "bg-[#F8F6F1] text-capsule-accent shadow-[inset_2.5px_2.5px_5px_#D3CDBF,_inset_-2.5px_-2.5px_5px_#FFFFFF] border-white/10" 
                          : "bg-[#F8F6F1] text-[#7C8797] hover:text-[#1A3F25] hover:shadow-[2px_2px_4px_#D3CDBF,_-2px_-2px_4px_#FFFFFF] border-transparent"
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drawer Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-5 space-y-7 custom-scrollbar select-none">
                
                {/* Section: Main Quick Navigation */}
                <div className="space-y-2.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#7C8797]/75 block px-1">
                    {locale === "hy" ? "Պորտալներ" : locale === "ru" ? "Порталы" : "Portals"}
                  </span>

                  {/* Calculator/Configurator Link */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsInTrackPortal(false);
                      setActiveCategory("");
                      setIsDrawerMenuOpen(false);
                    }}
                    className={`w-full cursor-pointer flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-300 ${
                      !isInTrackPortal && !activeCategory
                        ? "bg-[#F8F6F1] text-capsule-accent shadow-[inset_3px_3px_6px_#D3CDBF,_inset_-3px_-3px_6px_#FFFFFF] border-white/10 font-black"
                        : "bg-[#F8F6F1] text-[#7C8797] hover:text-[#1A3F25] hover:shadow-[4px_4px_8px_#D3CDBF,_-4px_-4px_8px_#FFFFFF] border-transparent shadow-[3px_3px_6px_#D3CDBF,_-3px_-3px_6px_#FFFFFF] font-extrabold"
                    }`}
                  >
                    <span className="text-xs font-sans">
                      {locale === "hy" ? "Հաշվիչի Գլխավոր" : locale === "ru" ? "Главный Калькулятор" : "Calculator Home"}
                    </span>
                    <ChevronRight size={11} className={!isInTrackPortal && !activeCategory ? "text-capsule-accent stroke-[2.5]" : "text-[#7C8797]"} />
                  </button>

                  {/* Order Track Portal Link */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsInTrackPortal(true);
                      setIsDrawerMenuOpen(false);
                    }}
                    className={`w-full cursor-pointer flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-300 ${
                      isInTrackPortal
                        ? "bg-[#F8F6F1] text-capsule-accent shadow-[inset_3px_3px_6px_#D3CDBF,_inset_-3px_-3px_6px_#FFFFFF] border-white/10 font-black"
                        : "bg-[#F8F6F1] text-[#7C8797] hover:text-[#1A3F25] hover:shadow-[4px_4px_8px_#D3CDBF,_-4px_-4px_8px_#FFFFFF] border-transparent shadow-[3px_3px_6px_#D3CDBF,_-3px_-3px_6px_#FFFFFF] font-extrabold"
                    }`}
                  >
                    <span className="text-xs font-sans">
                      {locale === "hy" ? "Հետևել Պատվերին" : locale === "ru" ? "Отследить Заказ" : "Track Order"}
                    </span>
                    <ChevronRight size={11} className={isInTrackPortal ? "text-capsule-accent stroke-[2.5]" : "text-[#7C8797]"} />
                  </button>
                </div>

                {/* Section: Premium Product Catalog */}
                <div className="space-y-2.5">
                  <div 
                    onClick={() => setIsDrawerCatalogOpen(!isDrawerCatalogOpen)}
                    className="flex items-center justify-between cursor-pointer px-1 text-[9px] font-black uppercase tracking-widest text-[#7C8797]/75 hover:text-[#1A3F25] transition-colors"
                  >
                    <span>{locale === "hy" ? "Արտադրանքի Կատալոգ" : locale === "ru" ? "Каталог Продукции" : "Luxury Catalog"}</span>
                    <ChevronDown size={11} className={`transition-transform duration-300 ${isDrawerCatalogOpen ? "rotate-180 text-[#1A3F25]" : "text-[#C59B6D]"}`} />
                  </div>

                  <AnimatePresence initial={false}>
                    {isDrawerCatalogOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden space-y-2"
                      >
                        {categories.map((cat) => {
                          const isCatSelected = activeCategory === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                setIsInTrackPortal(false);
                                setActiveCategory(cat.id);
                                setIsDrawerMenuOpen(false);
                              }}
                              className={`w-full cursor-pointer flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 ${
                                isCatSelected
                                  ? "bg-[#F8F6F1] text-capsule-accent border-white/10 shadow-[inset_2.5px_2.5px_5px_#D3CDBF,_inset_-2.5px_-2.5px_5px_#FFFFFF] font-black"
                                  : "bg-[#F8F6F1] text-[#7C8797] hover:text-[#1A3F25] border-transparent shadow-[2px_2px_4px_#D3CDBF,_-2px_-2px_4px_#FFFFFF] font-extrabold"
                              }`}
                            >
                              <span className="text-xs font-sans">
                                {t(`db.category.${cat.id}.name`, cat.name)}
                              </span>
                              <ChevronRight size={10} className="text-[#7C8797]/70 shrink-0" />
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isDrawerCatalogOpen && (
                    <div className="grid grid-cols-2 gap-3.5">
                      {categories.slice(0, 4).map((cat) => {
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setIsInTrackPortal(false);
                              setActiveCategory(cat.id);
                              setIsDrawerMenuOpen(false);
                            }}
                            className={`cursor-pointer p-4 rounded-2xl border text-center transition-all duration-300 bg-[#F8F6F1] ${
                              activeCategory === cat.id 
                                ? "text-capsule-accent border-white/10 shadow-[inset_2.5px_2.5px_5px_#D3CDBF,_inset_-2.5px_-2.5px_5px_#FFFFFF] font-black" 
                                : "text-[#7C8797] hover:text-[#1A3F25] border-transparent shadow-[3px_3px_6px_#D3CDBF,_-3px_-3px_6px_#FFFFFF] hover:shadow-[4px_4px_8px_#D3CDBF,_-4px_-4px_8px_#FFFFFF] font-extrabold"
                            }`}
                          >
                            <div className="text-[11px] font-black truncate font-sans">
                              {t(`db.category.${cat.id}.name`, cat.name)}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Section: Personal Cabinet Quick Actions */}
                <div className="space-y-2.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#7C8797]/75 block px-1">
                    {locale === "hy" ? "Լիչնի Կաբինետ" : locale === "ru" ? "Личный Кабинет" : "Client Cabinet"}
                  </span>

                  {userEmail ? (
                    <div className="bg-[#F8F6F1] border-2 border-white/40 p-5 rounded-[2rem] shadow-[inset_4px_4px_8px_#D3CDBF,_inset_-4px_-4px_8px_#FFFFFF] space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-[9px] text-[#C59B6D] uppercase font-black tracking-wider leading-none">
                            {partnerDiscount > 0 ? "PARTNER PRO" : "CLIENT"}
                          </p>
                          <p className="text-xs font-black text-capsule-dark truncate font-sans mt-1">
                            {userEmail}
                          </p>
                        </div>
                      </div>

                      {partnerDiscount > 0 && (
                        <div className="bg-[#1A3F25] text-[#FAF9F5] px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider text-center flex items-center justify-center gap-1 shadow-inner">
                          👑 PARTNER DISCOUNT: {partnerDiscount}% ACTIVE
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/50">
                        <button
                          type="button"
                          onClick={() => {
                            setIsDrawerMenuOpen(false);
                            openClientCabinetWithTab("overview");
                          }}
                          className="p-2.5 text-center rounded-xl bg-[#F8F6F1] text-[10px] font-black text-[#7C8797] hover:text-[#1A3F25] shadow-[2.5px_2.5px_5px_#D3CDBF,_-2.5px_-2.5px_5px_#FFFFFF] active:shadow-[inset_1.5px_1.5px_3px_#D3CDBF,_inset_-1.5px_-1.5px_3px_#FFFFFF] transition-all cursor-pointer font-sans border-none outline-none select-none"
                        >
                          Overview
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsDrawerMenuOpen(false);
                            openClientCabinetWithTab("orders");
                          }}
                          className="p-2.5 text-center rounded-xl bg-[#F8F6F1] text-[10px] font-black text-[#7C8797] hover:text-[#1A3F25] shadow-[2.5px_2.5px_5px_#D3CDBF,_-2.5px_-2.5px_5px_#FFFFFF] active:shadow-[inset_1.5px_1.5px_3px_#D3CDBF,_inset_-1.5px_-1.5px_3px_#FFFFFF] transition-all cursor-pointer font-sans border-none outline-none select-none"
                        >
                          My Orders
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsDrawerMenuOpen(false);
                            openClientCabinetWithTab("calculations");
                          }}
                          className="p-2.5 text-center rounded-xl bg-[#F8F6F1] text-[10px] font-black text-[#7C8797] hover:text-[#1A3F25] shadow-[2.5px_2.5px_5px_#D3CDBF,_-2.5px_-2.5px_5px_#FFFFFF] active:shadow-[inset_1.5px_1.5px_3px_#D3CDBF,_inset_-1.5px_-1.5px_3px_#FFFFFF] transition-all cursor-pointer font-sans border-none outline-none select-none"
                        >
                          Saved Calcs
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsDrawerMenuOpen(false);
                            openClientCabinetWithTab("profile");
                          }}
                          className="p-2.5 text-center rounded-xl bg-[#F8F6F1] text-[10px] font-black text-[#7C8797] hover:text-[#1A3F25] shadow-[2.5px_2.5px_5px_#D3CDBF,_-2.5px_-2.5px_5px_#FFFFFF] active:shadow-[inset_1.5px_1.5px_3px_#D3CDBF,_inset_-1.5px_-1.5px_3px_#FFFFFF] transition-all cursor-pointer font-sans border-none outline-none select-none"
                        >
                          Settings
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem("cc_client_user");
                          setUserEmail("");
                          setPartnerDiscount(0);
                          setIsDrawerMenuOpen(false);
                        }}
                        className="w-full text-center py-2.5 text-[10px] uppercase tracking-wider font-black bg-[#F8F6F1] text-[#D11A2A] shadow-[2.5px_2.5px_5px_#D3CDBF,_-2.5px_-2.5px_5px_#FFFFFF] hover:text-red-800 active:shadow-[inset_1.5px_1.5px_3px_#D3CDBF,_inset_-1.5px_-1.5px_3px_#FFFFFF] rounded-xl transition-all cursor-pointer font-sans border-none outline-none select-none"
                      >
                        {locale === "hy" ? "Դուրս գալ" : locale === "ru" ? "Выйти из Кабинета" : "Log Out"}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsDrawerMenuOpen(false);
                          openClientCabinetWithAuth("login");
                        }}
                        className="cursor-pointer bg-[#F8F6F1] text-capsule-accent hover:text-[#1A3F25] p-4 rounded-2xl flex flex-col items-center justify-center font-black text-[11px] shadow-[3px_3px_6px_#D3CDBF,_-3px_-3px_6px_#FFFFFF] hover:shadow-[4px_4px_8px_#D3CDBF,_-4px_-4px_8px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#D3CDBF,_inset_-2px_-2px_4px_#FFFFFF] transition-all font-sans border-none outline-none select-none"
                      >
                        <span className="text-[10px] uppercase tracking-widest font-black">
                          {locale === "hy" ? "Մուտք" : locale === "ru" ? "Войти" : "Log In"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsDrawerMenuOpen(false);
                          openClientCabinetWithAuth("register");
                        }}
                        className="cursor-pointer bg-[#F8F6F1] text-[#7C8797] hover:text-[#1A3F25] p-4 rounded-2xl flex flex-col items-center justify-center font-black text-[11px] shadow-[3px_3px_6px_#D3CDBF,_-3px_-3px_6px_#FFFFFF] hover:shadow-[4px_4px_8px_#D3CDBF,_-4px_-4px_8px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#D3CDBF,_inset_-2px_-2px_4px_#FFFFFF] transition-all font-sans border-none outline-none select-none"
                      >
                        <span className="text-[10px] uppercase tracking-widest font-black">
                          {locale === "hy" ? "Գրանցում" : locale === "ru" ? "Регистрация" : "Register"}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Section: Support Contacts */}
                <div className="space-y-3 pt-2.5 border-t border-dashed border-[#C59B6D]/20">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#7C8797]/75 block px-1">
                    {locale === "hy" ? "Արագ Կապ" : locale === "ru" ? "Связаться" : "Direct Support"}
                  </span>
                  
                  <div className="flex gap-3">
                    <a
                      href={`https://wa.me/${contactSettings.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 p-3 rounded-xl text-[10px] font-black uppercase tracking-wider bg-[#F8F6F1] text-emerald-800 shadow-[2.5px_2.5px_5px_#D3CDBF,_-2.5px_-2.5px_5px_#FFFFFF] hover:text-[#1A3F25] active:shadow-[inset_1.5px_1.5px_3px_#D3CDBF,_inset_-1.5px_-1.5px_3px_#FFFFFF] transition-all duration-200 font-sans select-none"
                    >
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={`mailto:${contactSettings.email}`}
                      className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 p-3 rounded-xl text-[10px] font-black uppercase tracking-wider bg-[#F8F6F1] text-[#D11A2A] shadow-[2.5px_2.5px_5px_#D3CDBF,_-2.5px_-2.5px_5px_#FFFFFF] hover:text-[#1A3F25] active:shadow-[inset_1.5px_1.5px_3px_#D3CDBF,_inset_-1.5px_-1.5px_3px_#FFFFFF] transition-all duration-200 font-sans select-none"
                    >
                      <span>Email</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-5 bg-[#F8F6F1] border-t border-white/30 text-center select-text">
                <p className="text-[9px] font-mono text-capsule-accent/80 font-semibold uppercase tracking-wider">
                  The Capsule Lab © {new Date().getFullYear()}
                </p>
                <p className="text-[8px] font-mono font-black uppercase tracking-widest text-[#7C8797] mt-1">
                  DESIGN & PACKAGING STUDIO
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CMS control panel modal popup */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        adminToken={adminToken}
        onLoginSuccess={(token) => {
          setAdminToken(token);
          localStorage.setItem("cc_admin_token", token);
        }}
        onLogout={() => {
          setAdminToken(null);
          localStorage.removeItem("cc_admin_token");
          setIsAdminOpen(false);
        }}
        categories={categories}
        products={products}
        dimensions={dimensions}
        finishes={finishes}
        papers={papers}
        printingMethods={printingMethods}
        tiers={tiers}
        discountCodes={discountCodes}
        siteTexts={siteTexts}
        contactSettings={contactSettings}
        pricingRules={pricingRules}
        decorativeBagsPricingRules={decorativeRules}
        submissions={submissions}
        bagRibbonHandles={bagRibbonHandles}
        aiSettings={aiSettings}
        onSaveConfig={handleSaveAdminConfigAll}
        onClearSubmissions={handleClearAdminLogs}
        onReload={loadPublicConfig}
      />

      {/* Floating Sticky Mobile Summary/Order Bar */}
      {calcResult && (
        <div className="fixed bottom-0 left-0 right-0 z-45 lg:hidden bg-[#FAFAF8] border-t border-capsule-accent/15 px-4 py-3 shadow-2xl flex items-center justify-between gap-4 select-none">
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-extrabold text-capsule-text-muted uppercase tracking-wider truncate">
              {t(`db.category.${activeCategory}.name`, categories.find(c => c.id === activeCategory)?.name || "Արժեք")} (x{calcResult.qty})
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-sm font-extrabold text-capsule-accent font-mono leading-none">
                {formatPrice(calcResult.totalPrice)}
              </span>
              {calcResult.unitPrice > 0 && (
                <span className="text-[10px] font-bold text-capsule-text-secondary font-mono">
                  ({formatPrice(calcResult.unitPrice)} / {activeCategory === "ribbons" ? t("common.units.meters_short", "մ.") : t("common.units.pcs_short", "հ.")})
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleLaunchOrderInquiry}
            className="bg-[#ff2300] hover:bg-[#e61f00] text-white text-[11px] font-extrabold uppercase px-4.5 py-2.5 rounded-full shadow-lg tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <ShoppingBag size={12} />
            <span>{t("buttons.order", "Պատվիրել")}</span>
          </button>
        </div>
      )}

      {/* Sliding Side Drawer Cart */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[1050] flex justify-end">
          {/* Premium Sharp Backdrop */}
          <div 
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-[#3a2010]/35 backdrop-blur-[4px] animate-fade-in-quick transition-all"
          />
          
          {/* Slide Over Panel - Ultra Premium Neumorphic Styling */}
          <div className="relative w-full sm:w-[500px] h-full bg-[#FAFAF8] shadow-[0_0_50px_rgba(58,32,16,0.12)] flex flex-col z-10 border-l border-[#E5E1D8] animate-slide-left overflow-hidden">
            {/* Drawer Header (Neumorphic Integrated Style) */}
            <div className="bg-[#FAFAF8] px-5 py-6 sm:px-7 sm:py-7 flex items-center justify-between border-b border-[#E5E1D8]/80 select-none">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-capsule-accent font-black block">
                  {t("cart.sub_title", "🛒 Պատվերի Զամբյուղ")}
                </span>
                <h3 className="font-serif text-lg sm:text-xl text-[#3D271B] tracking-wider uppercase font-extrabold">
                  {t("cart.title", "Պատվերի Զամբյուղ")}
                </h3>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="cursor-pointer p-2.5 rounded-full bg-[#FAFAF8] text-[#3D271B] shadow-[2.5px_2.5px_5px_#DFD9CD,_-2.5px_-2.5px_5px_#FFFFFF] hover:shadow-[3.5px_3.5px_7px_#DFD9CD,_-3.5px_-3.5px_7px_#FFFFFF] active:shadow-[inset_1.5px_1.5px_3px_#DFD9CD,_inset_-1.5px_-1.5px_3px_#FFFFFF] hover:scale-105 active:scale-95 transition-all outline-none border-none select-none flex items-center justify-center"
                title={t("common.close", "Փակել")}
              >
                <X size={18} className="stroke-[2.5]" />
              </button>
            </div>
 
            {/* Drawer Contents Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-[#FAFAF8]">
              {bundleItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-5">
                  <div className="w-16 h-16 rounded-full bg-[#FAFAF8] shadow-[4px_4px_8px_#DFD9CD,_-4px_-4px_8px_#FFFFFF] flex items-center justify-center text-rose-500 font-sans text-2xl border border-white/60">
                    🛒
                  </div>
                  <div className="space-y-2">
                    <p className="font-serif text-base text-[#3D271B] font-bold tracking-wide uppercase">{t("cart.empty_title", "Ձեր զամբյուղը դատարկ է")}</p>
                    <p className="text-xs text-[#3D271B]/60 leading-relaxed max-w-xs mx-auto">
                      {t("cart.empty_desc", "Ավելացրեք ապրանքներ ձեր պատվերին, որպեսզի հաշվարկեք վերջնական արժեքը և սկսեք պատվերը:")}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setActiveCategory("");
                    }}
                    className="cursor-pointer bg-[#FAFAF8] text-[#3D271B] font-sans text-[10px] sm:text-[11px] font-black uppercase tracking-widest px-7 py-3.5 rounded-full shadow-[4px_4px_8px_#DFD9CD,_-4px_-4px_8px_#FFFFFF] hover:shadow-[5px_5px_10px_#DFD9CD,_-5px_-5px_10px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#DFD9CD,_inset_-2px_-2px_4px_#FFFFFF] hover:text-capsule-accent transition-all border-none outline-none select-none"
                  >
                    {t("cart.explore", "Դիտել Արտադրանքը")}
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Promo Apply Field - Neumorphic Outer Card */}
                  <div className="bg-[#FAFAF8] shadow-[4px_4px_10px_#DFD9CD,_-4px_-4px_10px_#FFFFFF] border border-white/80 rounded-3xl p-5 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-sans tracking-wide text-[#3D271B]/70 font-black">
                        {t("cart.promo_ask", "🎟️ Ունե՞ք պրոմո-կոդ")}
                      </span>
                      {appliedPromo && (
                        <span className="text-[9px] bg-green-700/10 text-green-700 px-2.5 py-0.5 rounded-md font-mono font-bold animate-[fadeIn_0.3s_ease_out]">
                          {t("cart.applied", "ԿԻՐԱՌՎԱԾ Է")}
                        </span>
                      )}
                    </div>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const data = new FormData(e.currentTarget);
                        const code = data.get("promo-code") as string;
                        if (code) {
                          handleApplyCartPromo(code);
                          e.currentTarget.reset();
                        }
                      }}
                      className="flex gap-2.5"
                    >
                      <input 
                        type="text" 
                        name="promo-code"
                        placeholder={t("cart.promo_placeholder", "Օրինակ՝ CAPSULE10")} 
                        defaultValue={appliedPromo || ""}
                        className="flex-1 bg-[#FAFAF8] shadow-[inset_2px_2px_5px_#DFD9CD,_inset_-2px_-2px_5px_#FFFFFF] border border-transparent px-4 py-2.5 rounded-xl text-xs focus:ring-1 focus:ring-capsule-accent/20 text-[#3D271B] focus:border-[#E5E1D8] outline-none font-mono"
                      />
                      <button 
                        type="submit"
                        className="cursor-pointer bg-[#FAFAF8] text-capsule-accent hover:text-[#1A3F25] px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-[2.5px_2.5px_5px_#DFD9CD,_-2.5px_-2.5px_5px_#FFFFFF] hover:shadow-[3.5px_3.5px_7px_#DFD9CD,_-3.5px_-3.5px_7px_#FFFFFF] active:shadow-[inset_1.5px_1.5px_3px_#DFD9CD,_inset_-1.5px_-1.5px_3px_#FFFFFF] transition-all border-none outline-none select-none"
                      >
                        {t("common.apply", "Կիրառել")}
                      </button>
                    </form>
                    {appliedPromo && (
                      <p className="text-[10px] text-green-700 font-bold">
                        {t("cart.promo_success_prefix", "✓ Պրոմո-կոդ")} <strong>{appliedPromo}</strong> {t("cart.promo_success_suffix", "ն հաջողությամբ կիրառվել է բոլոր հարմար ապրանքների վրա։")}
                      </p>
                    )}
                  </div>
 
                  {/* Cart Items List */}
                  <div className="space-y-5">
                    {bundleItems.map((item, idx) => {
                      const minRequiredQty = categories.find(c => c.id === item.catId)?.minQty || 100;
                      return (
                        <div key={item.id} className="bg-[#FAFAF8] shadow-[4px_4px_10px_#DFD9CD,_-4px_-4px_10px_#FFFFFF] border border-white/60 p-5 rounded-3xl flex flex-col gap-4 animate-[fadeIn_0.3s_ease_out]">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3.5">
                              <div className="w-11 h-11 rounded-2xl bg-[#FAFAF8] text-[#3D271B] shadow-[inset_2px_2px_5px_#DFD9CD,_inset_-2px_-2px_5px_#FFFFFF] flex items-center justify-center shrink-0 border border-white/40">
                                {renderCategoryIcon(item.icon, item.catId)}
                              </div>
                              <div className="space-y-0.5 text-left">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[8px] uppercase font-sans tracking-[0.08em] bg-[#1A3F25]/5 text-[#1A3F25] px-1.5 py-0.5 rounded-md font-black">
                                    {t(`db.category.${item.catId}.name`, item.catName)}
                                  </span>
                                  <h4 className="font-sans text-[11px] font-black uppercase tracking-wider text-[#3D271B]">
                                    {item.payload?.itemId && item.payload.itemId !== "custom" 
                                      ? t(`db.product_item.${item.payload.itemId}`, item.itemName) 
                                      : t(`db.product.${item.catId}`, item.itemName)}
                                  </h4>
                                </div>
                                <p className="text-[10px] text-[#3D271B]/65 whitespace-pre-line leading-relaxed select-text mt-1.5">
                                  {getSingleItemDetails(item.catId, item.calcResult || item, item.payload)}
                                </p>
                              </div>
                            </div>
 
                            <button
                              onClick={() => handleRemoveBundleItem(item.id)}
                              className="cursor-pointer p-2.5 rounded-full bg-[#FAFAF8] text-[#3D271B]/60 hover:text-red-700 shadow-[2.5px_2.5px_5px_#DFD9CD,_-2.5px_-2.5px_5px_#FFFFFF] hover:shadow-[3.5px_3.5px_7px_#DFD9CD,_-3.5px_-3.5px_7px_#FFFFFF] active:shadow-[inset_1.5px_1.5px_3px_#DFD9CD,_inset_-1.5px_-1.5px_3px_#FFFFFF] hover:scale-105 active:scale-95 transition-all outline-none border-none select-none flex items-center justify-center shrink-0"
                              title={t("common.remove", "Հեռացնել")}
                            >
                              <Trash2 size={13} className="stroke-[2.2]" />
                            </button>
                          </div>
 
                          {/* Controls & Price Summary block inside item */}
                          <div className="flex items-center justify-between bg-[#FAFAF8] shadow-[inset_2.5px_2.5px_5px_#DFD9CD,_inset_-2.5px_-2.5px_5px_#FFFFFF] border border-white/20 p-3.5 rounded-2xl gap-4">
                            {/* Quantity buttons */}
                            <div className="space-y-1 text-left">
                              <span className="text-[8px] uppercase tracking-wider text-[#3D271B]/60 font-black block font-sans">
                                {t("common.qty_label", "Քանակ")} ({item.isMeters ? t("common.units.meters", "Մետր") : t("common.units.pcs", "Հատ")})
                              </span>
                              <div className="flex items-center bg-[#FAFAF8] shadow-[2px_2px_4px_#DFD9CD,_-2px_-2px_4px_#FFFFFF] rounded-xl p-0.5 select-none border border-white/40">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const step = item.isMeters ? 100 : (item.catId === "stickers" || item.catId === "giftcards" || item.catId === "businesscards") ? 50 : 100;
                                    const nextVal = item.qty - step;
                                    if (nextVal >= minRequiredQty) {
                                      handleUpdateCartItemQty(item.id, nextVal);
                                    }
                                  }}
                                  disabled={item.qty <= minRequiredQty}
                                  className={`w-7 h-7 flex items-center justify-center font-black text-xs rounded-lg transition-transform active:scale-95 ${item.qty <= minRequiredQty ? 'text-[#3D271B]/20 cursor-not-allowed' : 'text-[#3D271B] hover:text-capsule-accent cursor-pointer'}`}
                                >
                                  -
                                </button>
                                <span className="w-12 text-center text-[10.5px] font-black text-[#3D271B] font-mono">
                                  {item.qty.toLocaleString()}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const step = item.isMeters ? 100 : (item.catId === "stickers" || item.catId === "giftcards" || item.catId === "businesscards") ? 50 : 100;
                                    handleUpdateCartItemQty(item.id, item.qty + step);
                                  }}
                                  className="w-7 h-7 flex items-center justify-center font-black text-xs text-[#3D271B] hover:text-[#1A3F25] rounded-lg cursor-pointer transition-transform active:scale-95"
                                >
                                  +
                                </button>
                              </div>
                              {item.qty <= minRequiredQty && (
                                <span className="text-[8px] text-rose-700/80 font-black block font-sans mt-0.5">
                                  {t("cart.min_qty", "✓ Նվազագույն քանակ:")} {minRequiredQty}
                                </span>
                              )}
                            </div>
 
                            {/* Cost overview */}
                            <div className="text-right">
                              <span className="text-[8px] uppercase tracking-wider text-[#3D271B]/60 font-black block font-sans">
                                {t("common.price", "Արժեքը")}
                              </span>
                              <div className="text-[12px] font-mono font-black text-[#3D271B]">
                                {formatPrice(item.totalPrice)}
                              </div>
                              <div className="text-[8.5px] text-[#3D271B]/65 font-mono">
                                ({formatPrice(item.unitPrice)} / {item.isMeters ? t("common.units.meters_short", "մ.") : t("common.units.pcs_short", "հ.")})
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
 
            {/* Drawer Footer controls */}
            {bundleItems.length > 0 && (
              <div className="bg-[#FAFAF8] shadow-[0_-8px_30px_rgba(58,32,16,0.06)] border-t border-[#E5E1D8]/80 p-5 sm:p-7 space-y-4 select-none">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs text-[#3D271B]/70 font-sans font-bold">
                    <span>{t("cart.items_count_label", "Տեսակներ:")}</span>
                    <span className="font-mono text-[#3D271B]">{bundleItems.length} {t("cart.items_count_unit", "տեսակ")}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between items-center text-xs text-green-700 font-bold">
                      <span>{t("cart.active_promo", "Ակտիվ պրոմո-կոդ:")}</span>
                      <span className="font-mono text-green-700">-{appliedPromo}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-3 border-t border-[#E5E1D8]/60">
                    <span className="text-xs sm:text-[13px] font-sans text-[#3D271B]/80 font-black uppercase tracking-[0.1em]">{t("common.total_price", "Ընդհանուր գումար")}</span>
                    <span className="text-xl sm:text-2xl font-black text-[#3D271B] font-sans">
                      {formatPrice(totalBundlePrice)}
                    </span>
                  </div>
                </div>
 
                <div className="flex flex-col gap-3 pt-1">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      handleLaunchBundleInquiry();
                    }}
                    className="w-full bg-[#1A3F25] hover:bg-[#112d19] text-white py-3.5 sm:py-4 rounded-2xl font-black uppercase tracking-[0.15em] text-[10.5px] sm:text-[11px] shadow-[4px_4px_10px_#D3CDBF,_-4px_-4px_10px_#FFFFFF] hover:shadow-[5px_5px_12px_#D3CDBF,_-5px_-5px_12px_#FFFFFF] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2 outline-none border-none select-none"
                  >
                    <ShoppingBag size={14} className="stroke-[2.5]" />
                    {t("buttons.send_cart_quote", "Հաստատել Պատվերը")}
                  </button>
                  <button
                    onClick={handleClearTray}
                    className="w-full py-3 rounded-xl font-black uppercase tracking-[0.1em] text-[9.5px] text-[#A63A3A] bg-[#FAFAF8] border border-[#E5E1D8]/40 shadow-[2px_2px_5px_#DFD9CD,_-2px_-2px_5px_#FFFFFF] hover:shadow-[3px_3px_6px_#DFD9CD,_-3px_-3px_6px_#FFFFFF] hover:bg-red-500/5 active:shadow-[inset_1px_1px_3px_#DFD9CD,_inset_-1px_-1px_3px_#FFFFFF] transition-all cursor-pointer shrink-0 outline-none select-none flex items-center justify-center gap-1.5"
                  >
                    {t("buttons.clear_cart", "Մաքրել Զամբյուղը")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

            </div>
          )}

      {/* 2-Step Safe Deterministic Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setShowClearConfirm(false)}
            className="fixed inset-0 bg-black/60 transition-opacity duration-300"
          />
          
          {/* Modal Card */}
          <div className="relative bg-[#FFFFFF] border border-capsule-border rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-5 animate-[scaleIn_0.2s_ease_out] z-10">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            
            <div className="space-y-2">
              <h4 className="font-serif text-lg font-bold text-capsule-accent uppercase tracking-wide">
                {t("cart.clear_confirm_title", "Մաքրե՞լ Զամբյուղը")}
              </h4>
              <p className="text-xs text-capsule-text-secondary leading-relaxed">
                {t("cart.clear_confirm_desc", "Վստա՞հ եք, որ ցանկանում եք հեռացնել բոլոր ապրանքները զամբյուղից: Այս գործողությունը պատվերի պատմությունը չի պահպանում։")}
              </p>
              <p className="text-[10px] text-capsule-text-muted italic leading-relaxed pt-1">
                {t("cart.clear_confirm_sub", "Բոլոր հաշվարկված ապրանքները կջնջվեն:")}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-full font-sans font-bold text-xs uppercase text-capsule-accent hover:bg-capsule-bg/20 border border-capsule-accent/15 tracking-wide transition-colors duration-200 cursor-pointer"
              >
                {t("common.cancel", "Չեղարկել")}
              </button>
              <button
                onClick={handleConfirmClearCart}
                className="flex-1 py-2.5 rounded-full bg-red-700 hover:bg-red-800 text-white font-sans font-bold text-xs uppercase tracking-wide transition-colors duration-200 cursor-pointer"
              >
                {t("common.clear", "Մաքրել")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Elegantly Polished Order Tracking Success Modal Overlay */}
      <AnimatePresence>
        {submittedTrackData && (
          <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 backdrop-blur-xs select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative bg-white border border-capsule-border rounded-[2.5rem] max-w-lg w-full p-8 shadow-2xl text-center space-y-6 mx-4 overflow-hidden"
            >
              {/* Decorative top vector asset */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#ff2300] pointer-events-none" />
              
              <div className="w-16 h-16 rounded-full bg-green-50 text-green-700 flex items-center justify-center mx-auto shadow-md">
                <Sparkles size={30} className="animate-pulse" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] tracking-widest font-mono font-bold text-green-700 uppercase block select-text">
                  SUCCESSFULLY REGISTERED IN POSTGRESQL
                </span>
                <h3 className="font-serif text-2xl lg:text-3xl text-capsule-accent uppercase tracking-wider">
                  {locale === "hy" ? "Պատվերը Ընդունված է" : 
                   locale === "ru" ? "Заказ успешно оформлен" : 
                   locale === "ar" ? "تم تسجيل الطلب بنجاح" : 
                   "Order Created Successfully!"}
                </h3>
                <p className="text-xs text-capsule-text-secondary leading-relaxed max-w-sm mx-auto font-sans">
                  {locale === "hy" ? "Ձեր պատվերն ուղարկված է արտադրության բաժին: Օգտագործեք ստորև նշված տվյալները իրական ժամանակում հետևելու համար:" : 
                   locale === "ru" ? "Ваш заказ передан на производство! Используйте полученный код ниже для отслеживания стадий печати и постобработки в любое время." : 
                   locale === "ar" ? "تم إرسال طلبك إلى قسم الإنتاج بنجاح! استخدم رمز التتبع أدناه للتحقق من حالة طلبك في أي وقت." : 
                   "Your order has been routed to our production facility. Save the following credentials to trace your shipment in real-time."}
                </p>
              </div>

              {/* Box info inside the modal container */}
              <div className="bg-[#FAFAF9] border border-[#EBEBE8] rounded-2xl p-5 space-y-3.5 text-left select-text relative">
                {/* Order ID display */}
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-[10px] text-capsule-text-muted font-bold uppercase tracking-wider">
                    {locale === "hy" ? "Պատվերի ID" : locale === "ru" ? "Номер заказа" : "Order ID"}
                  </span>
                  <span className="font-sans font-black text-capsule-accent">
                    {submittedTrackData.id}
                  </span>
                </div>

                {/* Unique Tracking code Display */}
                <div className="border-t border-[#EBEBE8] pt-3 flex justify-between items-center text-xs">
                  <span className="font-mono text-[10px] text-capsule-text-muted font-bold uppercase tracking-wider">
                    {locale === "hy" ? "Հետևման կոդ" : locale === "ru" ? "Код отслеживания" : "Tracking Code"}
                  </span>
                  <span className="font-mono font-black text-green-800 text-sm tracking-widest uppercase">
                    {submittedTrackData.trackingCode}
                  </span>
                </div>
              </div>

              {/* Utility / copy & track triggers */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(submittedTrackData.trackingCode);
                    setSuccessMessage("Կոդը պատճենվեց / Copied!");
                    setTimeout(() => setSuccessMessage(null), 2500);
                  }}
                  className="flex-1 bg-white hover:bg-[#FAFAF9] text-capsule-accent border border-[#E0DCD4] transition-all py-3 px-4 rounded-full font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Copy size={13} />
                  <span>{locale === "hy" ? "Պատճենել կոդը" : locale === "ru" ? "Копировать կոդը" : "Copy Code"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const code = submittedTrackData.trackingCode;
                    const phoneVal = submittedTrackData.phone;
                    setSubmittedTrackData(null);
                    setIsInTrackPortal(true);
                    window.history.pushState({}, "", `/track-order?code=${code}&phone=${phoneVal}`);
                    // Trigger custom portal load
                  }}
                  className="flex-1 bg-[#ff2300] hover:bg-[#e61f00] text-white transition-all py-3 px-4 rounded-full font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Search size={13} />
                  <span>{locale === "hy" ? "Հետևել Հիմա" : locale === "ru" ? "Отследить" : "Track Order"}</span>
                </button>
              </div>

              {/* Close Button trigger */}
              <button
                type="button"
                onClick={() => setSubmittedTrackData(null)}
                className="absolute top-3 right-4 h-8 w-8 text-[#777777] bg-transparent hover:bg-black/5 hover:text-black rounded-full flex items-center justify-center transition-colors font-sans text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
