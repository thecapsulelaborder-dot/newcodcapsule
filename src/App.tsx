import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CapsuleLogo } from "./components/CapsuleLogo";
import PackhelpShowcase from "./components/PackhelpShowcase";
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
  Paperclip,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Info,
  Trash,
  Upload,
  Image as ImageIcon
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
import { PaymentMethods } from "./components/PaymentMethods";
import AIAgentBlock from "./components/AIAgentBlock";
import EcommerceStore from "./components/EcommerceStore";

import {
  calculateBagsPrice as clientCalculateBagsPrice,
  calculateBoxesPrice as clientCalculateBoxesPrice,
  calculateRibbonsPrice as clientCalculateRibbonsPrice,
  calculateStickersPrice as clientCalculateStickersPrice,
  calculateGiftCardsPrice as clientCalculateGiftCardsPrice,
  calculateBusinessCardsPrice as clientCalculateBusinessCardsPrice
} from "./calculator";

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
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [aiSettings, setAiSettings] = useState<AISettings>({
    systemPrompt: "",
    temperature: 0.1,
    modelName: "gemini-3.5-flash",
    enabled: true
  });
  const [activeCategory, setActiveCategory] = useState<string>("bags");
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const categoryTabsRef = useRef<HTMLDivElement>(null);
  const lastActiveCategoryRef = useRef<string>("");
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [hasScrollableTabs, setHasScrollableTabs] = useState<boolean>(false);

  // ── AI ASSISTANT CLIENT STATES ──────────────────────────────────
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [assistantMessages, setAssistantMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Ողջույն! Ես PACKY-ի փաթեթավորման և տպագրության պաշտոնական AI օգնականն եմ։ Կարող եմ Ձեզ խորհրդատվություն տալ տոպրակների, տուփերի, սթիքերների, այցեքարտերի կամ ժապավենների նյութերի, լամինացիայի, չափսերի և տպագրական տեխնիկաների վերաբերյալ։ Ինչպե՞ս կարող եմ օգնել։" }
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
  const [currentView, setCurrentView] = useState<"home" | "calculator" | "track" | "ecommerce">(() => {
    if (window.location.pathname === "/track-order") return "track";
    if (window.location.pathname === "/calculator") return "calculator";
    if (window.location.pathname === "/shop") return "ecommerce";
    return "home";
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
      const path = window.location.pathname;
      if (path === "/track-order") {
        setCurrentView("track");
        setIsInTrackPortal(true);
      } else if (path === "/calculator") {
        setCurrentView("calculator");
        setIsInTrackPortal(false);
      } else {
        setCurrentView("home");
        setIsInTrackPortal(false);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigateToTrackPortal = () => {
    window.history.pushState({}, "", "/track-order");
    setCurrentView("track");
    setIsInTrackPortal(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToHomeFromPortal = () => {
    window.history.pushState({}, "", "/");
    setCurrentView("home");
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

    window.history.pushState({}, "", "/calculator");
    setCurrentView("calculator");
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
            const fObj = finishes.find(f => f.key === k || (f as any).id === k);
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

  const handleAddShopItemToCart = (item: any) => {
    const defaultCatName = categories.find(c => c.id === item.categoryId)?.navLabel || categories.find(c => c.id === item.categoryId)?.name || "Shop Item";
    const newItem = {
      id: `bundle_${Date.now()}`,
      catId: item.categoryId || "bags",
      catName: defaultCatName,
      itemName: item.name,
      qty: item.qty,
      isMeters: item.categoryId === "ribbons",
      unitPrice: item.price,
      totalPrice: item.price * item.qty,
      dimensionsText: "Preset Standard",
      description: item.details,
      icon: categories.find(c => c.id === item.categoryId)?.icon || "📦",
      payload: {},
      calcResult: {
        itemName: item.name,
        qty: item.qty,
        unitPrice: item.price,
        totalPrice: item.price * item.qty,
        dimensionsText: "Preset Standard",
        discountAmount: 0
      }
    };
    setBundleItems(prev => [...prev, newItem]);
    
    setSuccessMessage(locale === "hy" 
      ? `«${newItem.itemName}»-ը հաջողությամբ ավելացվել է զամբյուղին:`
      : locale === "ru"
        ? `«${newItem.itemName}» успешно добавлен в корзину!`
        : `"${newItem.itemName}" successfully added to cart!`);
    
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4500);
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

    (async () => {
      let localResult: any = null;
      try {
        if (item.catId === "boxes") {
          localResult = await clientCalculateBoxesPrice(updatedPayload, localDb);
        } else if (item.catId === "ribbons") {
          localResult = await clientCalculateRibbonsPrice(updatedPayload, localDb);
        } else if (item.catId === "stickers") {
          localResult = await clientCalculateStickersPrice(updatedPayload, localDb);
        } else if (item.catId === "giftcards") {
          localResult = await clientCalculateGiftCardsPrice(updatedPayload, localDb);
        } else if (item.catId === "businesscards") {
          localResult = await clientCalculateBusinessCardsPrice(updatedPayload, localDb);
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
          localResult = await clientCalculateBagsPrice(updatedPayload, localDb);
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
    })();
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

    (async () => {
      const updatedItemsPromises = bundleItems.map(async item => {
        const updatedPayload = item.payload ? { ...item.payload, appliedDiscountCode: trimmed } : { appliedDiscountCode: trimmed };
        
        let localResult: any = null;
        try {
          if (item.catId === "boxes") {
            localResult = await clientCalculateBoxesPrice(updatedPayload, localDb);
          } else if (item.catId === "ribbons") {
            localResult = await clientCalculateRibbonsPrice(updatedPayload, localDb);
          } else if (item.catId === "stickers") {
            localResult = await clientCalculateStickersPrice(updatedPayload, localDb);
          } else if (item.catId === "giftcards") {
            localResult = await clientCalculateGiftCardsPrice(updatedPayload, localDb);
          } else if (item.catId === "businesscards") {
            localResult = await clientCalculateBusinessCardsPrice(updatedPayload, localDb);
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
            localResult = await clientCalculateBagsPrice(updatedPayload, localDb);
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

      const updatedItems = await Promise.all(updatedItemsPromises);
      setBundleItems(updatedItems);
      setAppliedPromo(trimmed);
    })();
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

  // Call booking modal states
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("+374 ");
  const [bookingGoal, setBookingGoal] = useState("");

  // Slide index for homepage slider
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

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
  const [boxStyle, setBoxStyle] = useState<"shoulder_lid" | "sleeve_drawer" | "shoulder_neck" | "magnetic_flap" | "lid_base" | "dry_folding" | "">("");
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
        if (data.featuredProducts) setFeaturedProducts(data.featuredProducts);
        if (data.paymentMethods) setPaymentMethods(data.paymentMethods);
        if (data.aiSettings) setAiSettings(data.aiSettings);
        
        if (data.categories && data.categories.length > 0 && !activeCategory) {
          const firstCat = data.categories.find((c: any) => c.active)?.id || "bags";
          setActiveCategory(firstCat);
        }
      }
    } catch (err) {
      console.error("Failed to load configuration", err);
    }
  };

  useEffect(() => {
    loadPublicConfig();
  }, []);

  // Autoplay effect for the premier homepage product slides
  useEffect(() => {
    if (activeCategory || isInTrackPortal) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeCategory, isInTrackPortal]);

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

    (async () => {
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
          result = await clientCalculateBagsPrice(payload, localDb);
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
          result = await clientCalculateBoxesPrice(payload, localDb);
        } else if (activeCategory === "ribbons") {
          payload = {
            productKey: "ribbons",
            width: ribbonWidth,
            ribbonType: ribbonType,
            printColor: ribbonPrintColor,
            meters: ribbonMeters,
            appliedDiscountCode: appliedPromo || undefined
          };
          result = await clientCalculateRibbonsPrice(payload, localDb);
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
          result = await clientCalculateStickersPrice(payload, localDb);
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
          result = await clientCalculateGiftCardsPrice(payload, localDb);
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
          result = await clientCalculateBusinessCardsPrice(payload, localDb);
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
          result = await clientCalculateBagsPrice(payload, localDb);
        }

        setCalcResult(result);
        setCalcError(null);
      } catch (err: any) {
        setCalcResult(null);
        setCalcError(err.message || "Հաշվարկի սխալ:");
      }
    })();
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

  const scrollToSection = (id: string) => {
    const targetId = id === "footer-contact-section" ? "app-footer" : id;
    setIsInTrackPortal(false);
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        const footer = document.getElementById("app-footer");
        if (footer) {
          footer.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 150);
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-capsule-bg flex flex-col text-capsule-dark-secondary transition-all selection:bg-capsule-accent/15">
      {/* Luxury Minimalist Single-Row Header (PACKY Premium Style & Colors based on official mockup) */}
      <header className="relative z-[150] w-full select-none bg-[#FAFAF8] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),_0_3px_12px_rgba(58,32,16,0.03)] border-b border-[#E5E1D8]/50 transition-colors py-1.5">
        <div className="max-w-[1440px] mx-auto h-20 px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between">
          
          {/* LEFT: Premium Star Logo + Brand Typography */}
          <div className="flex items-center gap-3.5">
            {/* Mobile Hamburger menu - visible only on mobile/tablet */}
            <button
              type="button"
              onClick={() => setIsDrawerMenuOpen(true)}
              className="lg:hidden cursor-pointer group flex items-center justify-center w-10 h-10 rounded-full bg-[#FAFAF8] shadow-[2.5px_2.5px_6px_#E5DDD1,_-2.5px_-2.5px_6px_#FFFFFF] border border-white/60 hover:shadow-[1.5px_1.5px_4px_#E5DDD1,_-1.5px_-1.5px_4px_#FFFFFF] active:shadow-[inset_1.5px_1.5px_4px_#E5DDD1,_inset_-1.5px_-1.5px_4px_#FFFFFF] transition-all duration-200 outline-none"
              title="Menu"
            >
              <Menu size={16} className="text-[#3D271B]" />
            </button>

            <button
              type="button"
              onClick={() => {
                handleLogoClickClick();
                setCurrentView("home");
                setIsInTrackPortal(false);
                window.history.pushState({}, "", "/");
              }}
              className="flex items-center select-none border-none outline-none cursor-pointer hover:opacity-95 active:scale-95 transition-all bg-transparent group"
              title="PACKY"
            >
              <svg 
                className="h-10.5 sm:h-11 md:h-12 w-auto shrink-0 select-none transition-transform duration-300 group-hover:scale-[1.02] text-[#FF2300]" 
                viewBox="0 0 205 84" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M59.206 28.152H54.662C54.2567 27.4053 53.8407 26.7973 53.414 26.328C53.0087 25.8373 52.614 25.4747 52.23 25.24C51.3553 24.7067 50.374 24.44 49.286 24.44C47.8567 24.44 46.6193 25.0053 45.574 26.136C45.0407 26.7333 44.6353 27.3733 44.358 28.056C44.102 28.8027 43.974 29.592 43.974 30.424C43.974 32.1307 44.4967 33.5493 45.542 34.68C46.6087 35.7893 47.8993 36.344 49.414 36.344C50.4593 36.344 51.4193 36.0773 52.294 35.544C52.742 35.2667 53.1473 34.904 53.51 34.456C53.8727 34.008 54.246 33.3893 54.63 32.6H59.174C58.5767 34.2853 57.9687 35.5973 57.35 36.536C56.7313 37.4533 55.9953 38.2107 55.142 38.808C54.31 39.384 53.4353 39.8107 52.518 40.088C51.6007 40.3867 50.598 40.536 49.51 40.536C46.8433 40.536 44.486 39.5333 42.438 37.528C41.5633 36.568 40.87 35.5013 40.358 34.328C39.8673 33.1333 39.622 31.8427 39.622 30.456C39.622 27.704 40.582 25.3253 42.502 23.32C44.4433 21.3147 46.8007 20.312 49.574 20.312C51.6647 20.312 53.51 20.8773 55.11 22.008C55.942 22.6053 56.646 23.32 57.222 24.152C57.9047 25.1333 58.566 26.4667 59.206 28.152ZM79.6042 40.056H75.3802V38.712L74.0363 39.544C73.7802 39.6507 73.4602 39.768 73.0763 39.896C72.6922 40.024 72.3402 40.1307 72.0202 40.216C71.3376 40.408 70.6016 40.504 69.8122 40.504C67.0389 40.504 64.7029 39.544 62.8042 37.624C61.8869 36.6853 61.1616 35.608 60.6282 34.392C60.2016 33.2187 59.9882 31.9173 59.9882 30.488C59.9882 27.672 60.9482 25.2933 62.8682 23.352C64.8096 21.3893 67.1882 20.408 70.0042 20.408C70.7509 20.408 71.4656 20.472 72.1482 20.6C72.7456 20.7493 73.3856 20.984 74.0682 21.304L75.3802 22.072V20.792H79.6042V40.056ZM75.3802 30.264C75.3802 28.792 74.8149 27.4693 73.6842 26.296C72.5749 25.1227 71.3269 24.536 69.9402 24.536C68.3829 24.536 67.0709 25.1013 66.0042 26.232C65.4282 26.8507 65.0016 27.5013 64.7242 28.184C64.6602 28.376 64.5749 28.696 64.4682 29.144C64.3616 29.5707 64.3082 30.0507 64.3082 30.584C64.3082 32.2267 64.8629 33.6133 65.9722 34.744C66.5056 35.256 67.1029 35.6613 67.7642 35.96C68.4682 36.2373 69.1722 36.376 69.8762 36.376C70.5162 36.376 71.1989 36.2373 71.9242 35.96C72.5002 35.6613 73.0656 35.2347 73.6202 34.68C74.1749 34.04 74.6122 33.3467 74.9323 32.6C75.0602 32.216 75.1669 31.832 75.2522 31.448C75.3376 31.0427 75.3802 30.648 75.3802 30.264ZM101.552 30.488C101.552 33.24 100.603 35.6187 98.7045 37.624C97.8512 38.52 96.7952 39.2347 95.5365 39.768C94.9605 40.0027 94.3525 40.184 93.7125 40.312C93.0725 40.44 92.3898 40.504 91.6645 40.504C90.1498 40.504 88.7525 40.1947 87.4725 39.576C87.1952 39.448 86.8965 39.288 86.5765 39.096C86.2778 38.9253 86.0005 38.7333 85.7445 38.52C85.4885 38.3067 85.3392 38.1893 85.2965 38.168C85.2752 38.1253 85.2538 38.0933 85.2325 38.072C85.2965 38.1787 85.3605 38.2747 85.4245 38.36C85.6805 38.7013 85.9258 39.0213 86.1605 39.32V37.464V40.024V45.624H81.9045V20.792H86.1605V22.072L87.3125 21.368C88.5712 20.728 89.9578 20.408 91.4725 20.408C94.3738 20.408 96.7738 21.3787 98.6725 23.32C100.592 25.2613 101.552 27.6507 101.552 30.488ZM97.1685 30.552C97.1685 28.8453 96.6138 27.416 95.5045 26.264C94.4165 25.0907 93.0832 24.504 91.5045 24.504C90.1605 24.504 88.9232 25.0907 87.7925 26.264C87.2592 26.84 86.8432 27.48 86.5445 28.184C86.2672 28.952 86.1285 29.656 86.1285 30.296C86.1285 31.9387 86.6725 33.368 87.7605 34.584C88.8485 35.7787 90.1285 36.376 91.6005 36.376C93.1152 36.376 94.4058 35.8107 95.4725 34.68C96.0058 34.1467 96.4218 33.528 96.7205 32.824C96.8272 32.5253 96.9232 32.1947 97.0085 31.832C97.1152 31.4693 97.1685 31.0427 97.1685 30.552ZM114.989 34.328C114.989 36.0773 114.349 37.5493 113.069 38.744C111.81 39.9173 110.274 40.504 108.461 40.504C106.583 40.504 105.037 39.8747 103.821 38.616C103.607 38.4027 103.458 38.2427 103.373 38.136C103.202 37.88 103.074 37.688 102.989 37.56L102.413 36.344C102.263 35.9173 102.157 35.448 102.093 34.936C102.029 34.4027 101.997 33.6133 101.997 32.568H106.349C106.349 33.5493 106.391 34.232 106.477 34.616C106.562 34.9787 106.733 35.32 106.989 35.64C107.415 36.1093 107.917 36.344 108.493 36.344C109.069 36.344 109.538 36.1627 109.901 35.8C110.285 35.48 110.477 35.0533 110.477 34.52C110.477 34.0293 110.327 33.6027 110.029 33.24C109.666 32.856 108.994 32.472 108.013 32.088C106.989 31.7467 106.125 31.3733 105.421 30.968C104.717 30.5413 104.194 30.1253 103.853 29.72C103.106 28.8453 102.733 27.672 102.733 26.2C102.733 24.5787 103.319 23.2027 104.493 22.072C105.687 20.92 107.095 20.344 108.717 20.344C110.423 20.344 111.842 20.8453 112.973 21.848C113.229 22.104 113.453 22.3813 113.645 22.68C113.858 22.9787 114.05 23.3413 114.221 23.768C114.391 24.1733 114.509 24.6107 114.573 25.08C114.658 25.528 114.701 26.2213 114.701 27.16H110.253C110.253 26.4773 110.242 26.072 110.221 25.944C110.199 25.7947 110.157 25.6347 110.093 25.464C110.029 25.272 109.922 25.1013 109.773 24.952C109.559 24.7173 109.175 24.6 108.621 24.6C108.215 24.6 107.863 24.7387 107.565 25.016C107.287 25.2933 107.149 25.6453 107.149 26.072C107.149 26.4133 107.202 26.6907 107.309 26.904C107.415 27.032 107.607 27.192 107.885 27.384L108.525 27.736L109.517 28.056L111.149 28.6C112.343 29.1333 113.282 29.88 113.965 30.84C114.647 31.7787 114.989 32.9413 114.989 34.328ZM132.93 40.056H128.642C128.984 39.6293 129.154 39.3627 129.154 39.256C129.069 39.256 128.994 39.256 128.93 39.256C128.482 39.512 128.12 39.704 127.842 39.832C127.736 39.8747 127.512 39.9493 127.17 40.056C126.829 40.1627 126.52 40.2587 126.242 40.344C125.773 40.4293 125.4 40.472 125.122 40.472C124.845 40.4933 124.621 40.504 124.45 40.504C123.042 40.504 121.816 40.3013 120.77 39.896C119.746 39.512 118.925 38.9467 118.306 38.2C117.688 37.432 117.218 36.44 116.898 35.224C116.578 33.9867 116.418 32.504 116.418 30.776V20.792H120.674V30.936C120.674 32.0453 120.738 32.952 120.866 33.656C121.016 34.3387 121.229 34.8613 121.506 35.224C121.784 35.5653 122.189 35.8427 122.722 36.056C123.256 36.248 123.853 36.344 124.514 36.344C125.197 36.344 125.848 36.1947 126.466 35.896C127.106 35.5973 127.629 35.128 128.034 34.488C128.12 34.3387 128.205 34.168 128.29 33.976C128.376 33.7627 128.44 33.528 128.482 33.272L128.61 32.056L128.642 30.264V20.792H132.93V40.056ZM139.606 40.056H135.318V15.224H139.606V40.056ZM160.971 32.152H145.515C145.579 32.5147 145.686 32.8453 145.835 33.144C146.177 33.784 146.603 34.3493 147.115 34.84C147.627 35.3307 148.214 35.704 148.875 35.96C149.558 36.216 150.262 36.344 150.987 36.344C152.033 36.344 152.993 36.0667 153.867 35.512C154.315 35.192 154.721 34.808 155.083 34.36C155.467 33.912 155.841 33.304 156.203 32.536H160.875C160.235 34.2 159.585 35.5013 158.923 36.44C158.283 37.3573 157.537 38.1253 156.683 38.744C155.062 39.9387 153.185 40.536 151.051 40.536C148.257 40.536 145.889 39.5333 143.947 37.528C143.073 36.568 142.358 35.48 141.803 34.264C141.334 33.112 141.099 31.8213 141.099 30.392C141.099 27.4693 142.049 25.0587 143.947 23.16C145.867 21.2613 148.267 20.312 151.147 20.312C154.027 20.312 156.385 21.304 158.219 23.288C160.054 25.272 160.971 27.8213 160.971 30.936V32.152ZM156.139 28.216C155.734 27.1067 155.179 26.264 154.475 25.688C153.579 24.8773 152.363 24.472 150.827 24.472C149.441 24.472 148.257 24.8987 147.275 25.752C146.571 26.3707 146.059 27.192 145.739 28.216H156.139Z" fill="currentColor"/>
                <path d="M59.32 57.488C59.32 60.24 58.3707 62.6187 56.472 64.624C55.6187 65.52 54.5627 66.2347 53.304 66.768C52.728 67.0027 52.12 67.184 51.48 67.312C50.84 67.44 50.1573 67.504 49.432 67.504C47.9173 67.504 46.52 67.1947 45.24 66.576C44.9627 66.448 44.664 66.288 44.344 66.096C44.0453 65.9253 43.768 65.7333 43.512 65.52C43.256 65.3067 43.1067 65.1893 43.064 65.168C43.0427 65.1253 43.0213 65.0933 43 65.072C43.064 65.1787 43.128 65.2747 43.192 65.36C43.448 65.7013 43.6933 66.0213 43.928 66.32V64.464V67.024V72.624H39.672V47.792H43.928V49.072L45.08 48.368C46.3387 47.728 47.7253 47.408 49.24 47.408C52.1413 47.408 54.5413 48.3787 56.44 50.32C58.36 52.2613 59.32 54.6507 59.32 57.488ZM54.936 57.552C54.936 55.8453 54.3813 54.416 53.272 53.264C52.184 52.0907 50.8507 51.504 49.272 51.504C47.928 51.504 46.6907 52.0907 45.56 53.264C45.0267 53.84 44.6107 54.48 44.312 55.184C44.0347 55.952 43.896 56.656 43.896 57.296C43.896 58.9387 44.44 60.368 45.528 61.584C46.616 62.7787 47.896 63.376 49.368 63.376C50.8827 63.376 52.1733 62.8107 53.24 61.68C53.7733 61.1467 54.1893 60.528 54.488 59.824C54.5947 59.5253 54.6907 59.1947 54.776 58.832C54.8827 58.4693 54.936 58.0427 54.936 57.552ZM79.6042 67.056H75.3802V65.712L74.0363 66.544C73.7802 66.6507 73.4602 66.768 73.0763 66.896C72.6922 67.024 72.3402 67.1307 72.0202 67.216C71.3376 67.408 70.6016 67.504 69.8122 67.504C67.0389 67.504 64.7029 64.624 62.8042 64.624C61.8869 63.6853 61.1616 62.608 60.6282 61.392C60.2016 60.2187 59.9882 58.9173 59.9882 57.488C59.9882 54.672 60.9482 52.2933 62.8682 50.352C64.8096 48.3893 67.1882 47.408 70.0042 47.408C70.7509 47.408 71.4656 47.472 72.1482 47.6C72.7456 47.7493 73.3856 47.984 74.0682 48.304L75.3802 49.072V47.792H79.6042V67.056ZM75.3802 57.264C75.3802 55.792 74.8149 54.4693 73.6842 53.296C72.5749 52.1227 71.3269 51.536 69.9402 51.536C68.3829 51.536 67.0709 52.1013 66.0042 53.232C65.4282 53.8507 65.0016 54.5013 64.7242 55.184C64.6602 55.376 64.5749 55.696 64.4682 56.144C64.3616 56.5707 64.3082 57.0507 64.3082 57.584C64.3082 59.2267 64.8629 60.6133 65.9722 61.744C66.5056 62.256 67.1029 62.6613 67.7642 62.96C68.4682 63.2373 69.1722 63.376 69.8762 63.376C70.5162 63.376 71.1989 63.2373 71.9242 62.96C72.5002 62.6613 73.0656 62.2347 73.6202 61.68C74.1749 61.04 74.6122 60.3467 74.9323 59.6C75.0602 59.216 75.1669 58.832 75.2522 58.448C75.3376 58.0427 75.3802 57.648 75.3802 57.264ZM100.688 55.152H96.1445C95.7392 54.4053 95.3232 53.7973 94.8965 53.328C94.4912 52.8373 94.0965 52.4747 93.7125 52.24C92.8378 51.7067 91.8565 51.44 90.7685 51.44C89.3392 51.44 88.1018 52.0053 87.0565 53.136C86.5232 53.7333 86.1178 54.3733 85.8405 55.056C85.5845 55.8027 85.4565 56.592 85.4565 57.424C85.4565 59.1307 85.9792 60.5493 87.0245 61.68C88.0912 62.7893 89.3818 63.344 90.8965 63.344C91.9418 63.344 92.9018 63.0773 93.7765 62.544C94.2245 62.2667 94.6298 61.904 94.9925 61.456C95.3552 61.008 95.7285 60.3893 96.1125 59.6H100.656C100.059 61.2853 99.4512 62.5973 98.8325 63.536C98.2138 64.4533 97.4778 65.2107 96.6245 65.808C95.7925 66.384 94.9178 66.8107 94.0005 67.088C93.0832 67.3867 92.0805 67.536 90.9925 67.536C88.3258 67.536 85.9685 66.5333 83.9205 64.528C83.0458 63.568 82.3525 62.5013 81.8405 61.328C81.3498 60.1333 81.1045 58.8427 81.1045 57.456C81.1045 54.704 82.0645 52.3253 83.9845 50.32C85.9258 48.3147 88.2832 47.312 91.0565 47.312C93.1472 47.312 94.9925 47.8773 96.5925 49.008C97.4245 49.6053 98.1285 50.32 98.7045 51.152C99.3872 52.1333 100.048 53.4667 100.688 55.152ZM117.887 67.056H112.415L106.655 59.984V67.056H102.367V42.224H106.655V53.712L111.263 47.792H116.479L109.439 56.784L117.887 67.056Z" fill="currentColor"/>
                <path d="M120.75 67.06C121.855 67.06 122.75 66.1646 122.75 65.06C122.75 63.9554 121.855 63.06 120.75 63.06C119.645 63.06 118.75 63.9554 118.75 65.06C118.75 66.1646 119.645 67.06 120.75 67.06Z" fill="currentColor"/>
              </svg>
            </button>
          </div>

          {/* CENTER: Symmetrical Navigation Links (Hidden on mobile) */}
          <div className="hidden lg:flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-full bg-[#FAFAF8] shadow-[inset_3px_3px_7px_#E5DDD1,_inset_-3px_-3px_7px_#FFFFFF] border border-white/45 selection:bg-transparent">
            {/* Home Link */}
            <button
              type="button"
              onClick={() => {
                setCurrentView("home");
                setIsInTrackPortal(false);
                window.history.pushState({}, "", "/");
              }}
              className={`text-[10px] tracking-[0.2em] font-extrabold uppercase shrink-0 cursor-pointer transition-all px-4 py-2 rounded-full border-none outline-none ${
                currentView === "home" 
                  ? "text-capsule-accent bg-[#FAFAF8] shadow-[2px_2px_5px_#E5DDD1,_-2px_-2px_5px_#FFFFFF] font-black border border-white/80" 
                  : "text-[#3D271B]/55 hover:text-[#3D271B] bg-transparent"
              }`}
            >
              {locale === "hy" ? "ԳԼԽԱՎՈՐ" : locale === "ru" ? "ГЛАВНАЯ" : "HOME"}
            </button>

            {/* Calculator Link */}
            <button
              type="button"
              onClick={() => {
                setCurrentView("calculator");
                setIsInTrackPortal(false);
                window.history.pushState({}, "", "/calculator");
              }}
              className={`text-[10px] tracking-[0.2em] font-extrabold uppercase shrink-0 cursor-pointer transition-all px-4 py-2 rounded-full border-none outline-none ${
                currentView === "calculator" 
                  ? "text-capsule-accent bg-[#FAFAF8] shadow-[2px_2px_5px_#E5DDD1,_-2px_-2px_5px_#FFFFFF] font-black border border-white/80" 
                  : "text-[#3D271B]/55 hover:text-[#3D271B] bg-transparent"
              }`}
            >
              {locale === "hy" ? "ՀԱՇՎԻՉ" : locale === "ru" ? "КАЛЬКУЛЯТОР" : "CALCULATOR"}
            </button>

            {/* Shop E-commerce Link */}
            <button
              type="button"
              onClick={() => {
                setCurrentView("ecommerce");
                setIsInTrackPortal(false);
                window.history.pushState({}, "", "/shop");
              }}
              className={`text-[10px] tracking-[0.2em] font-extrabold uppercase shrink-0 cursor-pointer transition-all px-4 py-2 rounded-full border-none outline-none ${
                currentView === "ecommerce" 
                  ? "text-capsule-accent bg-[#FAFAF8] shadow-[2px_2px_5px_#E5DDD1,_-2px_-2px_5px_#FFFFFF] font-black border border-white/80" 
                  : "text-[#3D271B]/55 hover:text-[#3D271B] bg-transparent"
              }`}
            >
              {locale === "hy" ? "ԽԱՆՈՒԹ" : locale === "ru" ? "МАГАЗИН" : "SHOP"}
            </button>

            {/* Tracking Portal Selector */}
            <button
              type="button"
              onClick={() => {
                setCurrentView("track");
                setIsInTrackPortal(true);
                window.history.pushState({}, "", "/track-order");
              }}
              className={`text-[10px] tracking-[0.2em] font-extrabold uppercase shrink-0 cursor-pointer transition-all px-4 py-2 rounded-full border-none outline-none ${
                currentView === "track" 
                  ? "text-capsule-accent bg-[#FAFAF8] shadow-[2px_2px_5px_#E5DDD1,_-2px_-2px_5px_#FFFFFF] font-black border border-white/80" 
                  : "text-[#3D271B]/55 hover:text-[#3D271B] bg-transparent"
              }`}
            >
              {locale === "hy" ? "ՊԱՏՎԵՐԻ ՀԵՏԵՎՈՒՄ" : locale === "ru" ? "ОТСЛЕЖИВАНИЕ" : "TRACK ORDER"}
            </button>
          </div>

          {/* RIGHT: Switchers, Actions */}
          <div className="flex items-center justify-end gap-3.5 sm:gap-4 lg:gap-5 selection:bg-transparent">
            
            {/* Extremely subtle dropdown select switchers (Desktop only) */}
            <div className="hidden xl:flex items-center gap-3 px-4.5 py-2.5 rounded-full bg-[#FAFAF8] shadow-[inset_2.5px_2.5px_6px_#E5DDD1,_inset_-2.5px_-2.5px_6px_#FFFFFF] border border-white/35 text-[10px] font-extrabold tracking-[0.1em] text-[#3D271B]/75 font-sans">
              {/* Language Switcher */}
              <div className="relative" ref={langMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="cursor-pointer flex items-center gap-1.5 py-0.5 px-2 rounded-lg hover:bg-[#F4F2EE]/45 hover:text-capsule-accent transition-all uppercase border-none outline-none select-none bg-transparent font-extrabold"
                  title="Language Selector"
                >
                  <span>{locale === "hy" ? "AM" : locale === "ru" ? "RU" : "EN"}</span>
                  <ChevronDown size={10} className={`text-[#3D271B]/40 transition-transform duration-200 ${isLangMenuOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isLangMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2.5 w-32 bg-[#FAFAF8] border border-[#E5E1D8] shadow-[4px_4px_12px_rgba(58,32,16,0.1)] rounded-2xl py-1.5 z-[220] overflow-hidden"
                    >
                      {(["hy", "en", "ru"] as const).map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            setLocale(lang);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-[9px] uppercase tracking-wider hover:bg-[#F4F2EE] hover:text-capsule-accent transition-colors flex items-center justify-between border-none bg-transparent ${locale === lang ? "text-capsule-accent font-black bg-[#FAF9F5]" : "text-[#3D271B]"}`}
                        >
                          <span>{lang === "hy" ? "AM" : lang === "en" ? "EN" : "RU"}</span>
                          {locale === lang && <Check size={8} className="text-capsule-accent" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <span className="h-3.5 w-px bg-[#E5E1D8]/80"></span>

              {/* Currency Switcher */}
              <div className="relative" ref={currencyMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                  className="cursor-pointer flex items-center gap-1.5 py-0.5 px-2 rounded-lg hover:bg-[#F4F2EE]/45 hover:text-capsule-accent transition-all uppercase border-none outline-none select-none bg-transparent font-extrabold"
                  title="Currency Selector"
                >
                  <span>{activeCurrency}</span>
                  <ChevronDown size={10} className={`text-[#3D271B]/40 transition-transform duration-200 ${isCurrencyMenuOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isCurrencyMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2.5 w-32 bg-[#FAFAF8] border border-[#E5E1D8] shadow-[4px_4px_12px_rgba(58,32,16,0.1)] rounded-2xl py-1.5 z-[220] overflow-hidden"
                    >
                      {(["AMD", "USD", "RUB"] as const).map((curr) => (
                        <button
                          key={curr}
                          type="button"
                          onClick={() => {
                            setActiveCurrency(curr);
                            setIsCurrencyMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-[9px] font-bold hover:bg-[#F4F2EE] hover:text-capsule-accent transition-colors flex items-center justify-between border-none bg-transparent ${activeCurrency === curr ? "text-capsule-accent font-black bg-[#FAF9F5]" : "text-[#3D271B]"}`}
                        >
                          <span>{curr}</span>
                          {activeCurrency === curr && <Check size={8} className="text-capsule-accent" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Shopping Bag / Cart Dial (Embossed Neumorphic Dial) */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="cursor-pointer group text-[#3D271B] w-10 h-10 rounded-full bg-[#FAFAF8] shadow-[3px_3px_7px_#E5DDD1,_-3px_-3px_7px_#FFFFFF] border border-white/60 hover:shadow-[1.5px_1.5px_4px_#E5DDD1,_-1.5px_-1.5px_4px_#FFFFFF] active:shadow-[inset_2px_2px_5px_#E5DDD1,_inset_-2px_-2px_5px_#FFFFFF] transition-all duration-200 flex items-center justify-center relative outline-none"
              title="Shopping Cart"
            >
              <ShoppingBag size={15} className="stroke-[2.4] group-hover:scale-[1.05] transition-transform" />
              {bundleItems.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[15px] h-3.5 rounded-full bg-capsule-accent text-white flex items-center justify-center font-sans font-black text-[7.5px] px-0.5 border-1.5 border-[#FAFAF8] shadow-[1px_1px_3px_rgba(58,32,16,0.15)]">
                  {bundleItems.length}
                </span>
              )}
            </button>

            {/* User Account / Cabinet Dial (Embossed Neumorphic Dial) */}
            <button
              type="button"
              onClick={() => setIsClientCabinetOpen(true)}
              className="cursor-pointer text-[#3D271B] w-10 h-10 rounded-full bg-[#FAFAF8] shadow-[3px_3px_7px_#E5DDD1,_-3px_-3px_7px_#FFFFFF] border border-white/60 hover:shadow-[1.5px_1.5px_4px_#E5DDD1,_-1.5px_-1.5px_4px_#FFFFFF] active:shadow-[inset_2px_2px_5px_#E5DDD1,_inset_-2px_-2px_5px_#FFFFFF] transition-all duration-200 flex items-center justify-center relative outline-none"
              title="Personal Cabinet"
            >
              <User size={15} className="stroke-[2.2]" />
              {userEmail && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-[#FAFAF8]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {currentView === "home" && (
        <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mt-8 sm:mt-12 md:mt-16 mb-20 select-none">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#FAFAF8] shadow-[5px_5px_15px_#E5DDD1,_-5px_-5px_15px_#FFFFFF] border border-white/60 min-h-[460px] sm:min-h-[500px] lg:min-h-[560px] flex items-center p-8 sm:p-14 lg:p-16 xl:p-20">
            
            {/* Ambient Purple/Blue Glow Overlays */}
            <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-violet-400/20 mix-blend-multiply filter blur-[70px] opacity-75 pointer-events-none" />
            <div className="absolute top-10 left-36 w-64 h-64 rounded-full bg-indigo-300/15 mix-blend-multiply filter blur-[60px] opacity-60 pointer-events-none" />
            
            {/* Highly detailed decorative vector-svg radial-dial coordinate widget representing precision luxury packaging geometry design exactly matching the image */}
            <svg className="absolute -right-28 sm:-right-20 lg:-right-6 bottom-[-22%] sm:bottom-[-18%] lg:bottom-[-5%] w-[360px] sm:w-[480px] lg:w-[620px] h-[360px] sm:h-[480px] lg:w-[620px] h-[620px] pointer-events-none opacity-80 lg:opacity-100 select-none duration-1000" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer boundary concentric rings */}
              <circle cx="300" cy="300" r="280" stroke="url(#card-grad)" strokeWidth="1" strokeDasharray="4 8" opacity="0.35" />
              <circle cx="300" cy="300" r="255" stroke="#7C72E6" strokeWidth="1" opacity="0.1" />
              <circle cx="300" cy="300" r="225" stroke="url(#arc-grad)" strokeWidth="1.2" strokeDasharray="2 12" opacity="0.4" />
              
              {/* The prominent wide bluish-purple semi-transparent ring */}
              <circle cx="300" cy="300" r="190" stroke="url(#ring-grad)" strokeWidth="34" opacity="0.18" />
              <circle cx="300" cy="300" r="190" stroke="#8E9AE2" strokeWidth="0.5" opacity="0.3" />
              
              {/* Middle circle with radial line ticks */}
              <circle cx="300" cy="300" r="145" stroke="#7C72E6" strokeWidth="1" strokeDasharray="3 6" opacity="0.22" />
              
              {/* Ticks ring */}
              <g opacity="0.45">
                {Array.from({ length: 48 }).map((_, i) => {
                  const angle = (i * 360) / 48;
                  const rad = (angle * Math.PI) / 180;
                  const x1 = 300 + Math.cos(rad) * 145;
                  const y1 = 300 + Math.sin(rad) * 145;
                  const x2 = 300 + Math.cos(rad) * 160;
                  const y2 = 300 + Math.sin(rad) * 160;
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#8A7EE4"
                      strokeWidth={i % 4 === 0 ? "1.5" : "0.75"}
                    />
                  );
                })}
              </g>
              
              {/* Core elements */}
              <circle cx="300" cy="300" r="95" stroke="#7D8DE5" strokeWidth="1.5" strokeDasharray="6 18" opacity="0.45" />
              <circle cx="300" cy="300" r="65" stroke="url(#arc-grad)" strokeWidth="1" opacity="0.3" />
              <circle cx="300" cy="300" r="12" fill="#7C72E6" opacity="0.1" />

              {/* Glow/Gradient Definitions */}
              <defs>
                <linearGradient id="ring-grad" x1="0" y1="0" x2="600" y2="600" gradientUnits="userSpaceOnUse">
                  <stop offset="0.1" stopColor="#8A7EE4" />
                  <stop offset="0.6" stopColor="#5E83F2" />
                  <stop offset="0.9" stopColor="#BD85E6" />
                </linearGradient>
                <linearGradient id="card-grad" x1="0" y1="0" x2="600" y2="600" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#8E7EE2" />
                  <stop offset="1" stopColor="#FAFAF8" />
                </linearGradient>
                <linearGradient id="arc-grad" x1="0" y1="0" x2="0" y2="600" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#7C72E6" />
                  <stop offset="1" stopColor="#E3ABFF" />
                </linearGradient>
              </defs>
            </svg>

            {/* Left Content Column */}
            <div className="relative z-10 w-full max-w-xl flex flex-col items-start text-left">
              {/* Beta/Information Pill Tag */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[9px] tracking-[0.25em] uppercase font-mono font-bold text-[#554DDC] bg-white/80 backdrop-blur-sm border border-[#E0D7FC]/65 rounded-full shadow-[0_2px_8px_rgba(99,102,241,0.06)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#554DDC] animate-ping" />
                {locale === "hy" ? "ՊՐԵՄԻՈՒՄ ՓԱԹԵԹԱՎՈՐՈՒՄ" : locale === "ru" ? "ПРЕМИАЛЬНАЯ УПАКОВКА" : "PREMIUM PACKAGING LAB"}
              </div>

              {/* Double-fonts title matching the reference image layout precisely */}
              <h1 className="font-sans font-black text-4xl sm:text-5xl lg:text-5xl xl:text-6xl tracking-tight text-[#30241C] leading-[1.1] mt-5 md:mt-6 mb-4 md:mb-5">
                {locale === "hy" ? "Ձևավորել Խելացի:" : locale === "ru" ? "Проектируй Умно." : "Design Smarter."}
                <span className="block font-serif font-light italic text-[#30241C] mt-1 lg:mt-2">
                  {locale === "hy" ? "Արտադրել Արագ," : locale === "ru" ? "Создавай Быстрее," : "Brand Faster,"}
                </span>
              </h1>

              {/* Spaced Subtitle Description */}
              <p className="font-sans text-xs sm:text-sm text-[#3D271B]/65 leading-relaxed max-w-sm sm:max-w-md md:max-w-lg mb-8 md:mb-9">
                {locale === "hy" 
                  ? "Պատվիրեք անհատականացված բրենդային տոպրակներ, տուփեր և պիտակներ հաշված վայրկյաններում մեր առաջատար առցանց հաշվիչով:" 
                  : locale === "ru"
                  ? "Закажите фирменные пакеты, коробки и этикетки за считанные секунды с помощью нашего умного онлайн-калькулятора."
                  : "Order custom branded bags, luxury boxes, and bespoke labels in seconds with our advanced instant online configurator."}
              </p>

              {/* Clean Symmetrical Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView("calculator");
                    window.history.pushState({}, "", "/calculator");
                  }}
                  className="bg-[#1A3F25] hover:bg-[#112d19] text-white font-sans text-[11px] font-bold py-3.5 px-8 rounded-full shadow-[2px_4px_10px_rgba(26,63,37,0.15)] cursor-pointer uppercase tracking-[0.1em] border-none outline-none hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  {locale === "hy" ? "Բացել Հաշվիչը" : locale === "ru" ? "Открыть Калькулятор" : "Open Calculator"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView("track");
                    setIsInTrackPortal(true);
                    window.history.pushState({}, "", "/track-order");
                  }}
                  className="bg-white/90 hover:bg-white text-[#30241C] border border-[#E0DCD4] shadow-[2px_2px_8px_#E5DDD1] transition-all duration-300 py-3.5 px-8 rounded-full font-bold text-[11px] uppercase tracking-[0.1em] cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  {locale === "hy" ? "Հետևել Պատվերին" : locale === "ru" ? "Отследить Заказ" : "Track Order"}
                </button>
              </div>
            </div>

          </div>

          {/* AI Mode packaging assistant block exactly as requested */}
          <AIAgentBlock locale={locale} />

          {/* "Others also bought" / "Այլ հաճախորդներ նաև գնել են" block */}
          {featuredProducts && featuredProducts.filter(fp => fp.active).length > 0 && (
            <div className="w-full py-16 px-6 sm:px-10 lg:px-12 max-w-[1240px] mx-auto select-none font-sans mt-16 mb-16 select-none animate-fade-in" id="others-also-bought-block">
              <div className="text-center mb-12">
                <h2 className="font-sans font-black text-3.5xl sm:text-4.5xl text-[#3D271B] tracking-tight leading-none uppercase font-bold">
                  {locale === "hy" 
                    ? "Սա նույնպես ձեռնտու է (Այլ հաճախորդներ գնում են)" 
                    : locale === "ru" 
                    ? "С этим товаром также часто покупают" 
                    : "Others Also Bought"}
                </h2>
                <div className="w-24 h-2 bg-[#F4F2EE] shadow-[inset_2.5px_2.5px_5px_rgba(180,175,166,0.65),inset_-2.5px_-2.5px_5px_#ffffff] rounded-full mx-auto mt-6" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {featuredProducts.filter(fp => fp.active).map((fp, idx) => {
                  const prodName = locale === "hy" ? fp.nameHy : locale === "ru" ? fp.nameRu : fp.nameEn;
                  const minQtyText = locale === "hy" ? fp.minQtyTextHy : locale === "ru" ? fp.minQtyTextRu : fp.minQtyTextEn;
                  const tagText = locale === "hy" ? fp.tagHy : locale === "ru" ? fp.tagRu : fp.tagEn;
                  const secTagText = locale === "hy" ? fp.secondaryTagHy : locale === "ru" ? fp.secondaryTagRu : fp.secondaryTagEn;

                  // Define Packhelp-style premium custom themes for each card
                  let themeClass = "";
                  let textClass = "";
                  let tagClass = "";
                  let subtextClass = "";
                  let btnClass = "";
                  let borderClass = "";
                  let cardShadowClass = "";
                  let btnShadowClass = "";
                  let imgWBorderClass = "";

                  if (idx % 4 === 0) {
                    // Lilac / Lavender
                    themeClass = "bg-[#ECE2F7] hover:bg-[#E4D7F2]";
                    textClass = "text-[#1C0D32]";
                    tagClass = "bg-[#D6C5EB] text-[#1C0D32]/80 border-none shadow-[inset_1.5px_1.5px_3px_rgba(162,143,184,0.45),_inset_-1.5px_-1.5px_3px_rgba(255,255,255,1)]";
                    subtextClass = "text-[#1C0D32]/75";
                    btnClass = "bg-[#ECE2F7] text-[#1C0D32]";
                    borderClass = "border-[#1C0D32]/10";
                    cardShadowClass = "shadow-[12px_12px_24px_rgba(162,143,184,0.45),_-12px_-12px_24px_rgba(255,255,255,1)] hover:shadow-[6px_6px_12px_rgba(162,143,184,0.4),_-6px_-6px_12px_rgba(255,255,255,1)]";
                    btnShadowClass = "shadow-[3px_3px_6px_rgba(162,143,184,0.45),_-3px_-3px_6px_rgba(255,255,255,1)] hover:shadow-[inset_2px_2px_4px_rgba(162,143,184,0.45),_inset_-2px_-2px_4px_rgba(255,255,255,1)]";
                    imgWBorderClass = "border-white/30 shadow-[inset_3px_3px_6px_rgba(162,143,184,0.35),_inset_-3px_-3px_6px_rgba(255,255,255,1)]";
                  } else if (idx % 4 === 1) {
                    // Deep Forest Green
                    themeClass = "bg-[#0B5C3A] hover:bg-[#094F31]";
                    textClass = "text-white";
                    tagClass = "bg-white/10 text-white/95 border-none shadow-[inset_1.5px_1.5px_3px_rgba(5,50,32,0.5),_inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.15)]";
                    subtextClass = "text-white/80";
                    btnClass = "bg-[#0B5C3A] text-white";
                    borderClass = "border-white/10";
                    cardShadowClass = "shadow-[12px_12px_24px_rgba(5,50,32,0.45),_-12px_-12px_24px_rgba(30,168,110,0.3)] hover:shadow-[6px_6px_12px_rgba(5,50,32,0.4),_-6px_-6px_12px_rgba(30,168,110,0.25)]";
                    btnShadowClass = "shadow-[3px_3px_6px_rgba(5,50,32,0.45),_-3px_-3px_6px_rgba(30,168,110,0.35)] hover:shadow-[inset_2px_2px_4px_rgba(5,50,32,0.45),_inset_-2px_-2px_4px_rgba(30,168,110,0.35)]";
                    imgWBorderClass = "border-white/10 shadow-[inset_3px_3px_6px_rgba(5,50,32,0.35),_inset_-3px_-3px_6px_rgba(255,255,255,0.1)]";
                  } else if (idx % 4 === 2) {
                    // Warm Silt Gray / Silver
                    themeClass = "bg-[#E6E4E2] hover:bg-[#DDDCDA]";
                    textClass = "text-[#282624]";
                    tagClass = "bg-[#D6D3D1] text-[#282624]/80 border-none shadow-[inset_1.5px_1.5px_3px_rgba(170,164,160,0.45),_inset_-1.5px_-1.5px_3px_rgba(255,255,255,1)]";
                    subtextClass = "text-[#282624]/75";
                    btnClass = "bg-[#E6E4E2] text-[#282624]";
                    borderClass = "border-[#282624]/10";
                    cardShadowClass = "shadow-[12px_12px_24px_rgba(170,164,160,0.45),_-12px_-12px_24px_rgba(255,255,255,1)] hover:shadow-[6px_6px_12px_rgba(170,164,160,0.4),_-6px_-6px_12px_rgba(255,255,255,1)]";
                    btnShadowClass = "shadow-[3px_3px_6px_rgba(170,164,160,0.45),_-3px_-3px_6px_rgba(255,255,255,1)] hover:shadow-[inset_2px_2px_4px_rgba(170,164,160,0.45),_inset_-2px_-2px_4px_rgba(255,255,255,1)]";
                    imgWBorderClass = "border-white/30 shadow-[inset_3px_3px_6px_rgba(170,164,160,0.35),_inset_-3px_-3px_6px_rgba(255,255,255,1)]";
                  } else {
                    // Sage / Eco Green
                    themeClass = "bg-[#D7E6DD] hover:bg-[#C9DAD0]";
                    textClass = "text-[#1B3021]";
                    tagClass = "bg-[#BDD4C5] text-[#1B3021]/80 border-none shadow-[inset_1.5px_1.5px_3px_rgba(154,170,160,0.45),_inset_-1.5px_-1.5px_3px_rgba(255,255,255,1)]";
                    subtextClass = "text-[#1B3021]/75";
                    btnClass = "bg-[#D7E6DD] text-[#1B3021]";
                    borderClass = "border-[#1B3021]/10";
                    cardShadowClass = "shadow-[12px_12px_24px_rgba(154,170,160,0.45),_-12px_-12px_24px_rgba(255,255,255,1)] hover:shadow-[6px_6px_12px_rgba(154,170,160,0.4),_-6px_-6px_12px_rgba(255,255,255,1)]";
                    btnShadowClass = "shadow-[3px_3px_6px_rgba(154,170,160,0.45),_-3px_-3px_6px_rgba(255,255,255,1)] hover:shadow-[inset_2px_2px_4px_rgba(154,170,160,0.45),_inset_-2px_-2px_4px_rgba(255,255,255,1)]";
                    imgWBorderClass = "border-white/30 shadow-[inset_3px_3px_6px_rgba(154,170,160,0.35),_inset_-3px_-3px_6px_rgba(255,255,255,1)]";
                  }

                  return (
                    <div
                      key={fp.id}
                      onClick={() => {
                        setActiveCategory(fp.categoryId);
                        setCalcResult(null); // Clear previous calcs to start fresh
                        setCurrentView("calculator");
                        window.history.pushState({}, "", "/calculator");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`group cursor-pointer rounded-[36px] pt-10 pb-12 px-8 flex flex-col justify-between min-h-[500px] md:min-h-[560px] transition-all duration-300 border border-[#E3DFD7]/20 relative active:scale-[0.98] ${themeClass} ${cardShadowClass}`}
                    >
                      <div className="flex flex-col justify-between h-full flex-1">
                        <div>
                          {/* Slogan classification label / Main custom Tag */}
                          {tagText && (
                            <span className={`text-[10px] uppercase font-mono tracking-widest font-black opacity-90 inline-block mb-3.5 px-3 py-1 rounded-full ${tagClass}`}>
                              {tagText}
                            </span>
                          )}

                          {/* Large display Heading showing name */}
                          <h3 className={`font-sans text-2xl sm:text-2xl font-black tracking-tight leading-[1.125] mb-3 ${textClass}`}>
                            {prodName}
                          </h3>

                          {/* Symmetrical elegant details description */}
                          <p className={`font-sans text-xs sm:text-xs leading-relaxed mb-6 ${subtextClass}`}>
                            {locale === "hy" 
                              ? `Բարձրակարգ բրենդավորում հատուկ չափսերով։ ${minQtyText}` 
                              : locale === "ru" 
                              ? `Премиальное брендирование по Вашим размерам. ${minQtyText}` 
                              : `Premium branding tailored to your dimensions. ${minQtyText}`}
                          </p>

                          {/* Action call - simple link styling matching packhelp.com */}
                          <div className={`mt-2.5 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 select-none text-center flex items-center justify-center gap-1.5 border-none outline-none ${btnClass} ${btnShadowClass}`}>
                            <span>
                              {locale === "hy" ? "Պատվիրել հիմա" : locale === "ru" ? "Заказать сейчас" : "Shop now"}
                            </span>
                            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                          </div>
                        </div>

                        {/* Visual asset / Nested 3D Mockup Product image at the bottom */}
                        <div className={`relative aspect-[16/10] w-full overflow-hidden rounded-[1.8rem] border bg-white/10 mt-8 ${imgWBorderClass}`}>
                          <img
                            src={fp.image || "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600"}
                            alt={prodName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          />
                          {secTagText && (
                            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm border border-emerald-100 rounded-full px-2.5 py-1 text-[8px] uppercase tracking-wider font-mono font-bold text-emerald-800 shadow-sm">
                              {secTagText}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <PackhelpShowcase locale={locale as any} setCurrentView={setCurrentView} setActiveCategory={setActiveCategory} />
        </div>
      )}

      {currentView === "ecommerce" && (
        <EcommerceStore
          locale={locale}
          featuredProducts={featuredProducts}
          categories={categories}
          onConfigureProduct={(catId) => {
            setActiveCategory(catId);
            setCurrentView("calculator");
            window.history.pushState({}, "", "/calculator");
          }}
          onAddToCart={handleAddShopItemToCart}
          currency={activeCurrency}
        />
      )}


      {currentView === "track" && (
        <OrderTrackPortal currentLocale={locale} onBackToHome={navigateToHomeFromPortal} onReorder={handleReorder} />
      )}

      {currentView === "calculator" && (
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mt-6">
              {/* Premium Category Label (Removed back to main link) */}
              <div className="flex items-center justify-end mb-4 select-none gap-2">
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

          {currentView === "calculator" && activeCategory && (
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
                              <th key="dimensions-col-header" className="p-3">{t("common.dimensions", "Չափսեր (սմ)")}</th>
                              {tiers.map((tItem) => (
                                <th key={`header-tier-${tItem.id}`} className="p-3 text-center">{formatNumber(tItem.qty)} {categories.find(c => c.id === activeCategory)?.id === "ribbons" ? t("common.units.meters", "մետր") : t("common.units.pcs", "հատ")}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-capsule-accent/5">
                            {bulkMatrix.map((bm, index) => (
                              <tr key={`matrix-row-${index}`} className="hover:bg-[#EFECE6]/60 transition-colors">
                                <td key={`matrix-col-dim-${index}`} className="p-3 font-bold text-capsule-dark">{bm.dimText}</td>
                                {tiers.map((tItem) => (
                                  <td key={`matrix-col-tier-${index}-${tItem.id}`} className="p-3 text-center font-mono text-capsule-text-secondary">
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

                    {/* CARD 2: Other Product Quantity */}
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
                      <p className="text-[10px] text-capsule-text-muted uppercase font-bold">Ընտրեք անհրաժեշտ ինտեգրվող կոդի տիպը, նյութը կամ պիտակը</p>

                      <div className="space-y-4">
                        {/* Select QR items */}
                        <div className="grid grid-cols-1 gap-3">
                          {products
                            .filter(p => p.categoryId === "qr_matrix")
                            .flatMap(p => p.items || [])
                            .map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  setSelectedQrMatrixId(item.id);
                                  // Auto-fill default qty if current is 0
                                  if (qrMatrixQty === 0) setQrMatrixQty(100);
                                }}
                                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex justify-between items-center ${
                                  selectedQrMatrixId === item.id ? "bg-capsule-accent/10 border-capsule-accent text-capsule-accent shadow-sm" : "bg-capsule-surf2/40 border-capsule-accent/10 hover:border-capsule-accent/20"
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
                        {/* QR Matrix Quantity selection */}
                        <div>
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">Քանակ</label>
                          <div className="flex flex-wrap gap-2 font-mono mb-3">
                            {[50, 100, 250, 500, 1000, 2500, 5000].map((bqVal) => (
                              <button
                                key={bqVal}
                                type="button"
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
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">Հավելյալ պահանջներ / Նշումներ</label>
                          <textarea
                            placeholder="Օրինակ՝ չափսեր, լամինացիայի տիպ, այլ նախընտրություններ..."
                            value={qrMatrixNotes}
                            onChange={(e) => setQrMatrixNotes(e.target.value)}
                            className="w-full h-24 bg-capsule-surf2/40 border border-capsule-accent/10 focus:border-capsule-accent rounded-xl px-4 py-3 text-xs focus:outline-none resize-none font-sans"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Calculations Outputs Card for Simpler Channels */}
              <div className="lg:col-span-4 sticky top-6 space-y-6">
                <div className="bg-capsule-surf border border-capsule-accent/15 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm select-none">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-capsule-accent/5 text-capsule-accent flex items-center justify-center border border-capsule-accent/10 shadow-inner">
                        <Sliders size={18} className="text-capsule-accent" />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-capsule-accent block leading-none">
                          {locale === "hy" ? "ՊՐԵՄԻՈՒՄ ՀԱՇՎԻՉ" : locale === "ru" ? "ПРЕМИУМ КАЛЬКУЛЯТОР" : "PREMIUM SERVICE"}
                        </span>
                        <h3 className="font-serif text-base text-capsule-dark uppercase tracking-wider mt-1 font-bold leading-none">
                          {t(`db.category.${activeCategory}.name`, categories.find(c => c.id === activeCategory)?.name || activeCategory)}
                        </h3>
                      </div>
                    </div>

                    {!calcResult ? (
                      <div className="bg-amber-500/5 border border-amber-500/20 text-amber-900 rounded-2xl p-4 text-[11px] font-medium leading-relaxed font-sans">
                        <Info size={14} className="text-amber-600 block mb-1.5" />
                        {locale === "hy" 
                          ? "Խնդրում ենք լրացնել բոլոր անհրաժեշտ պարամետրերը գինը տեսնելու համար։" 
                          : "Пожалуйста, заполните все параметры для расчёта окончательной стоимости."}
                      </div>
                    ) : (
                      <div className="space-y-3.5 pt-3.5 border-t border-capsule-accent/10 text-xs text-left">
                        <div className="flex justify-between items-center py-1 border-b border-dashed border-capsule-accent/5">
                          <span className="text-capsule-text-secondary">{locale === "hy" ? "Արտադրանք" : "Продукт / Тип"}</span>
                          <span className="font-bold text-capsule-dark font-sans max-w-[160px] truncate block text-right">
                            {calcResult.itemName}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1 border-b border-dashed border-capsule-accent/5">
                          <span className="text-capsule-text-secondary">{locale === "hy" ? "Չափս" : "Размеры"}</span>
                          <span className="font-bold text-capsule-dark font-mono">{calcResult.dimensionsText}</span>
                        </div>

                        <div className="flex justify-between items-center py-1 border-b border-dashed border-capsule-accent/5">
                          <span className="text-capsule-text-secondary">{locale === "hy" ? "Քանակ" : "Количество"}</span>
                          <span className="font-bold text-capsule-dark font-mono">
                            {calcResult.qty?.toLocaleString()} {activeCategory === "ribbons" ? (locale === "hy" ? "մետր" : "м.") : (locale === "hy" ? "հատ" : "шт.")}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1">
                          <span className="text-capsule-text-secondary">{locale === "hy" ? "Միավորի Գին" : "Цена за ед."}</span>
                          <span className="font-bold font-mono text-capsule-accent text-sm">
                            {formatPrice(calcResult.unitPrice)}
                          </span>
                        </div>

                        <div className="border-t border-capsule-accent/10 pt-4 flex justify-between items-baseline">
                          <span className="text-[10px] font-bold uppercase block text-capsule-text-muted">
                            {locale === "hy" ? "Ընդամենը" : "Итого"}
                          </span>
                          <h3 className="text-2xl font-black text-capsule-accent font-sans">
                            {formatPrice(calcResult.totalPrice)}
                          </h3>
                        </div>

                        <div className="space-y-2.5 mt-4">
                          <button
                            type="button"
                            onClick={() => {
                              const desc = getSingleItemDetails(activeCategory, calcResult, { 
                                itemId: selectedOtherProductId || selectedQrMatrixId || "custom" 
                              });
                              const fullDesc = `Պատվեր:\nԲաժին: ${categories.find(c => c.id === activeCategory)?.name || activeCategory}\n${desc}`;
                              setInquiryDetails(fullDesc);
                              setInquiryPrice(calcResult.totalPrice);
                              setIsInquiryOpen(true);
                            }}
                            className="w-full bg-[#1A3F25] hover:bg-[#112d19] text-white text-xs py-3.5 rounded-full font-bold uppercase cursor-pointer text-center select-none shadow flex justify-center items-center gap-1.5 transition-all duration-250 border-none outline-none"
                          >
                            <ShoppingBag size={14} />
                            <span>{locale === "hy" ? "Հաստատել Պատվերը" : "Отправить запрос"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAddItemToBundle(activeCategory)}
                            className="w-full bg-capsule-surf hover:bg-capsule-accent/10 text-capsule-accent border border-capsule-accent/20 text-xs py-3 rounded-full font-bold uppercase cursor-pointer text-center select-none flex justify-center items-center gap-1.5 transition-all duration-250 outline-none"
                          >
                            <ShoppingCart size={14} />
                            <span>{locale === "hy" ? "Ավելացնել Զամբյուղին" : "Добавить в корзину"}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Method A: The Beautiful e-commerce footer has been moved outside of any nested max-width wrappers to the bottom of the outermost layout container, ensuring perfect edge-to-edge browser margin stretching. */}
          <footer className="relative z-20 w-full bg-[#FCFCFA] text-[#1C1B19] border-t border-[#E5DDD1] mt-28 pt-16 pb-12 px-0 mx-0 max-w-none animate-[fadeIn_0.5s_ease_out]" id="app-footer">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 text-left">
                {/* Col 1: Brand & Contact */}
                <div className="col-span-2 md:col-span-3 space-y-5 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base font-black tracking-wider text-neutral-800">thecapsulelab</span>
                  </div>
                  <p className="text-[12.5px] text-neutral-500 leading-relaxed font-sans max-w-xs">
                    {locale === "hy" 
                      ? "Բարձրակարգ փաթեթավորման և տպագրական լուծումներ բիզնեսի և անհատների համար։" 
                      : locale === "ru" 
                      ? "Премиальные упаковочные и печатные решения для бизнеса и частных клиентов." 
                      : "Premium packaging and print solutions for business and retail."}
                  </p>
                  <div className="space-y-1.5 text-[11.5px] text-neutral-500 font-sans">
                    <p className="flex items-center gap-2">
                      <span>📍</span> Yerevan, Armenia
                    </p>
                    <p className="flex items-center gap-2">
                      <span>📞</span> +374 99 999999
                    </p>
                    <p className="flex items-center gap-2">
                      <span>✉️</span> support@thecapsulelab.com
                    </p>
                  </div>
                </div>

                {/* Col 2: Quick Links */}
                <div className="col-span-1 md:col-span-2 space-y-4 text-left">
                  <h4 className="font-sans text-xs font-black uppercase tracking-wider text-neutral-800">
                    {locale === "hy" ? "Արտադրանք" : locale === "ru" ? "Продукты" : "Products"}
                  </h4>
                  <ul className="space-y-2 text-[12.5px] text-[#777777]">
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCategory(cat.id);
                            setCurrentView("calculator");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="hover:text-emerald-700 hover:translate-x-0.5 transition-all text-left bg-transparent border-none p-0 cursor-pointer block"
                        >
                          {locale === "hy" ? cat.name : cat.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Col 3: Sustainability */}
                <div className="col-span-1 md:col-span-2 space-y-4 text-left">
                  <h4 className="font-sans text-xs font-black uppercase tracking-wider text-neutral-800">
                    {locale === "hy" ? "Էկոլոգիա" : locale === "ru" ? "Экологичность" : "Sustainability"}
                  </h4>
                  <ul className="space-y-2.5 text-[12.5px] text-neutral-500">
                    {[
                      { 
                        hy: "Էկո-պորտալ", 
                        ru: "Эко-портал", 
                        en: "Sustainability Hub", 
                        action: () => { alert("Our environment-first design and premium materials list."); } 
                      },
                      { 
                        hy: "Զեկույցներ", 
                        ru: "Отчеты о прогрессе", 
                        en: "Our Progress Reports", 
                        action: () => { alert("Transparency and eco-accountability standards."); } 
                      },
                      { 
                        hy: "Պատասխանատու մատակարարում", 
                        ru: "Ответственные поставки", 
                        en: "Responsible Supply Chain", 
                        action: () => { alert("Pristine premium cardboard sourced from responsibly managed forests."); } 
                      },
                      { 
                        hy: "FSC Սերտիֆիկացում", 
                        ru: "Сертификация FSC", 
                        en: "FSC Certification", 
                        action: () => { alert("Highlighting the FSC symbol on customer request on all production runs."); } 
                      },
                      { 
                        hy: "Էկո հատկություններ", 
                        ru: "Эко-свойства", 
                        en: "Eco properties", 
                        action: () => { alert("Compostable, bio-degradable, water-based printing inks."); } 
                      },
                      { 
                        hy: "Էկո տարբերանշան", 
                        ru: "Эко-значок", 
                        en: "Eco badge", 
                        action: () => { alert("Add our organic stamp to print layouts for premium visual green verification."); } 
                      }
                    ].map((item, idx) => (
                      <li key={idx}>
                        <button
                          type="button"
                          onClick={item.action}
                          className="hover:text-emerald-700 hover:translate-x-0.5 transition-all text-left bg-transparent border-none p-0 cursor-pointer block"
                        >
                          {locale === "hy" ? item.hy : locale === "ru" ? item.ru : item.en}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Col 4: Resources */}
                <div className="col-span-1 md:col-span-2 space-y-4 text-left">
                  <h4 className="font-sans text-xs font-black uppercase tracking-wider text-neutral-800">
                    {locale === "hy" ? "Ռեսուրսներ" : locale === "ru" ? "Ресурсы" : "Resources"}
                  </h4>
                  <ul className="space-y-2.5 text-[12.5px] text-neutral-500">
                    {[
                      { 
                        hy: "Բլոգ", 
                        ru: "Блог", 
                        en: "Blog", 
                        action: () => { alert("Tips for foil hot stamping, custom boxes and luxury paper craft."); } 
                      },
                      { 
                        hy: "Ոգեշնչում", 
                        ru: "Вдохновение", 
                        en: "Inspirations", 
                        action: () => { alert("See our custom lookbook for outstanding premium designs!"); } 
                      },
                      { 
                        hy: "Պայմաններ", 
                        ru: "Условия обслуживания", 
                        en: "Terms of service", 
                        action: () => { alert("Premium bespoke manufacturer production rules and agreement codes."); } 
                      },
                      { 
                        hy: "Գաղտնիություն", 
                        ru: "Конфиденциальность", 
                        en: "Privacy policy", 
                        action: () => { alert("Your design files and secrets are safe and protected with us."); } 
                      },
                      { 
                        hy: "Բողոքների քաղաքականություն", 
                        ru: "Политика информирования", 
                        en: "Whistleblowing policy", 
                        action: () => { alert("Maintaining high business ethics and absolute transparency."); } 
                      },
                      { 
                        hy: "Կայքի քարտեզ", 
                        ru: "Карта сайта", 
                        en: "Sitemap", 
                        action: () => { alert("Explore the premium products, boxes, sleeves and ribbons catalog."); } 
                      },
                      { 
                        hy: "Cookie կարգավորումներ", 
                        ru: "Файлы-cookie", 
                        en: "Cookie settings", 
                        action: () => { alert("Customize secure tracker preference options."); } 
                      }
                    ].map((item, idx) => (
                      <li key={idx}>
                        <button
                          type="button"
                          onClick={item.action}
                          className="hover:text-emerald-700 hover:translate-x-0.5 transition-all text-left bg-transparent border-none p-0 cursor-pointer block"
                        >
                          {locale === "hy" ? item.hy : locale === "ru" ? item.ru : item.en}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Col 5: Newsletter Sign Up Box (col-span-3) */}
                <div className="col-span-2 md:col-span-3 space-y-4 text-left">
                  <h4 className="font-sans text-sm font-extrabold tracking-tight text-neutral-800 leading-snug">
                    {locale === "hy" 
                      ? "Բաց մի թողեք – ստացեք 15% զեղչ ձեր առաջին պատվերի համար, երբ միանում եք լրատվականին:" 
                      : locale === "ru" 
                      ? "Не упустите – получите скидку 15% на первый заказ при подписке на рассылку." 
                      : "Don't miss out – get 15% off your first order when you join the newsletter."}
                  </h4>
                  
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newsletterEmail.trim()) {
                        setNewsletterSuccess(true);
                        setTimeout(() => {
                          setNewsletterSuccess(false);
                          setNewsletterEmail("");
                        }, 5000);
                      }
                    }} 
                    className="flex flex-col sm:flex-row items-stretch border border-neutral-300 w-full rounded-md overflow-hidden bg-white shadow-sm mt-3"
                  >
                    <input 
                      type="email" 
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder={locale === "hy" ? "Էլ. հասցե" : locale === "ru" ? "Электронная почта" : "E-mail"}
                      className="flex-1 px-4 py-3 text-sm text-neutral-800 outline-none border-none bg-transparent placeholder-neutral-400 font-sans focus:ring-0 min-w-0"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-[#2B5DF5] hover:bg-blue-700 text-white font-sans text-xs font-bold py-3 px-6 transition-colors tracking-wider uppercase shrink-0 cursor-pointer border-none outline-none"
                    >
                      {locale === "hy" ? "Բաժանորդագրվել" : locale === "ru" ? "Подписаться" : "Subscribe"}
                    </button>
                  </form>

                  {newsletterSuccess && (
                    <p className="text-xs text-emerald-850 font-bold font-sans mt-2 animate-pulse">
                      🌱 {locale === "hy" ? "Դուք հաջողությամբ բաժանորդագրվել եք:" : locale === "ru" ? "Вы успешно подписались на рассылку!" : "Successfully subscribed to our newsletter!"}
                    </p>
                  )}

                  {/* Securely access Admin panel link inside news section */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAdminOpen(true)}
                      className="text-[11px] text-neutral-400 hover:text-[#ff2300] transition-colors font-semibold inline-flex items-center gap-1.5 cursor-pointer font-sans bg-transparent border-none p-0 select-none opacity-85 hover:opacity-100"
                    >
                      🔑 {locale === "hy" ? "Ադմին" : locale === "ru" ? "Админ" : "Admin Panel"}
                    </button>
                  </div>
                </div>

              </div>

              {/* Secure Payment Methods Row */}
              <div className="pt-6 border-t border-[#E5DDD1]/50 pb-4">
                <PaymentMethods locale={locale} paymentMethods={paymentMethods} />
              </div>

              {/* Bottom Copyright & Legal Info */}
              <div className="flex flex-col md:flex-row items-center justify-between pt-6 mt-4 text-center md:text-left gap-6 text-xs text-neutral-500 font-sans">
                <p className="font-medium">
                  &copy; {new Date().getFullYear()} <span className="font-bold text-neutral-800">thecapsulelab</span> . {locale === "ru" ? "Все права защищены." : locale === "hy" ? "Բոլոր իրավունքները պաշտպանված են։" : "All rights reserved."} 
                  <span className="mx-2 font-light opacity-50">|</span> 
                  {locale === "hy" 
                    ? "Բիզնես ժամեր: Երկուշաբթի - Ուրբաթ 09:00 - 18:00 (Yerevan)" 
                    : locale === "ru" 
                    ? "Часы работы: Понедельник - Пятница 09:00 - 18:00 (Yerevan)" 
                    : "Business Hours: Monday - Friday 09:00 - 18:00 (Yerevan)"}
                </p>

                {/* Social icons matching Packhelp.com layout */}
                <div className="flex items-center gap-3">
                  {[
                    { href: "https://instagram.com/thecapsulelab", icon: <Instagram size={15} />, label: "Instagram" },
                    { href: "https://twitter.com/thecapsulelab", icon: <Twitter size={15} />, label: "Twitter" },
                    { href: "https://linkedin.com/company/thecapsulelab", icon: <Linkedin size={15} />, label: "LinkedIn" },
                    { href: "https://youtube.com/thecapsulelab", icon: <Youtube size={15} />, label: "YouTube" },
                    { href: "https://facebook.com/thecapsulelab", icon: <Facebook size={15} />, label: "Facebook" },
                    { href: "https://t.me/thecapsulelab", icon: <Send size={15} className="-translate-x-[0.5px] translate-y-[0.5px]" />, label: "Telegram" }
                  ].map((soc, idx) => (
                    <a 
                      key={idx}
                      href={soc.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-[#094F31] hover:text-white text-zinc-600 flex items-center justify-center transition-all duration-300 outline-none hover:shadow-sm"
                      aria-label={soc.label}
                    >
                      {soc.icon}
                    </a>
                  ))}
                </div>
              </div>

            </div>
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

                  {/* Home Link */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView("home");
                      setIsInTrackPortal(false);
                      setIsDrawerMenuOpen(false);
                      window.history.pushState({}, "", "/");
                    }}
                    className={`w-full cursor-pointer flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-300 ${
                      (currentView as any) === "home"
                        ? "bg-[#F8F6F1] text-capsule-accent shadow-[inset_3px_3px_6px_#D3CDBF,_inset_-3px_-3px_6px_#FFFFFF] border-white/10 font-black"
                        : "bg-[#F8F6F1] text-[#7C8797] hover:text-[#1A3F25] hover:shadow-[4px_4px_8px_#D3CDBF,_-4px_-4px_8px_#FFFFFF] border-transparent shadow-[3px_3px_6px_#D3CDBF,_-3px_-3px_6px_#FFFFFF] font-extrabold"
                    }`}
                  >
                    <span className="text-xs font-sans">
                      {locale === "hy" ? "Գլխավոր" : locale === "ru" ? "Главная" : "Home"}
                    </span>
                    <ChevronRight size={11} className={(currentView as any) === "home" ? "text-capsule-accent stroke-[2.5]" : "text-[#7C8797]"} />
                  </button>

                  {/* Calculator/Configurator Link */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView("calculator");
                      setIsInTrackPortal(false);
                      setActiveCategory("bags");
                      setIsDrawerMenuOpen(false);
                      window.history.pushState({}, "", "/calculator");
                    }}
                    className={`w-full cursor-pointer flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-300 ${
                      currentView === "calculator"
                        ? "bg-[#F8F6F1] text-capsule-accent shadow-[inset_3px_3px_6px_#D3CDBF,_inset_-3px_-3px_6px_#FFFFFF] border-white/10 font-black"
                        : "bg-[#F8F6F1] text-[#7C8797] hover:text-[#1A3F25] hover:shadow-[4px_4px_8px_#D3CDBF,_-4px_-4px_8px_#FFFFFF] border-transparent shadow-[3px_3px_6px_#D3CDBF,_-3px_-3px_6px_#FFFFFF] font-extrabold"
                    }`}
                  >
                    <span className="text-xs font-sans">
                      {locale === "hy" ? "Հաշվիչ" : locale === "ru" ? "Калькулятор" : "Calculator"}
                    </span>
                    <ChevronRight size={11} className={currentView === "calculator" ? "text-capsule-accent stroke-[2.5]" : "text-[#7C8797]"} />
                  </button>

                  {/* Shop E-commerce Link */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView("ecommerce");
                      setIsInTrackPortal(false);
                      setIsDrawerMenuOpen(false);
                      window.history.pushState({}, "", "/shop");
                    }}
                    className={`w-full cursor-pointer flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-300 ${
                      (currentView as any) === "ecommerce"
                        ? "bg-[#F8F6F1] text-capsule-accent shadow-[inset_3px_3px_6px_#D3CDBF,_inset_-3px_-3px_6px_#FFFFFF] border-white/10 font-black"
                        : "bg-[#F8F6F1] text-[#7C8797] hover:text-[#1A3F25] hover:shadow-[4px_4px_8px_#D3CDBF,_-4px_-4px_8px_#FFFFFF] border-transparent shadow-[3px_3px_6px_#D3CDBF,_-3px_-3px_6px_#FFFFFF] font-extrabold"
                    }`}
                  >
                    <span className="text-xs font-sans">
                      {locale === "hy" ? "Խանութ" : locale === "ru" ? "Магазин" : "Shop"}
                    </span>
                    <ChevronRight size={11} className={(currentView as any) === "ecommerce" ? "text-capsule-accent stroke-[2.5]" : "text-[#7C8797]"} />
                  </button>

                  {/* Order Track Portal Link */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView("track");
                      setIsInTrackPortal(true);
                      setIsDrawerMenuOpen(false);
                      window.history.pushState({}, "", "/track-order");
                    }}
                    className={`w-full cursor-pointer flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-300 ${
                      (currentView as any) === "track"
                        ? "bg-[#F8F6F1] text-capsule-accent shadow-[inset_3px_3px_6px_#D3CDBF,_inset_-3px_-3px_6px_#FFFFFF] border-white/10 font-black"
                        : "bg-[#F8F6F1] text-[#7C8797] hover:text-[#1A3F25] hover:shadow-[4px_4px_8px_#D3CDBF,_-4px_-4px_8px_#FFFFFF] border-transparent shadow-[3px_3px_6px_#D3CDBF,_-3px_-3px_6px_#FFFFFF] font-extrabold"
                    }`}
                  >
                    <span className="text-xs font-sans">
                      {locale === "hy" ? "Հետևել Պատվերին" : locale === "ru" ? "Отследить Заказ" : "Track Order"}
                    </span>
                    <ChevronRight size={11} className={(currentView as any) === "track" ? "text-capsule-accent stroke-[2.5]" : "text-[#7C8797]"} />
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
        featuredProducts={featuredProducts || []}
        aiSettings={aiSettings}
        paymentMethods={paymentMethods}
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
                      setActiveCategory("bags");
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
                {/* Unified Single Order Code display */}
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-[10px] text-capsule-text-muted font-bold uppercase tracking-wider">
                    {locale === "hy" ? "Պատվերի Կոդ" : locale === "ru" ? "Код заказа" : "Order Code"}
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
