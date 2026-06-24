import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  HelpCircle, 
  LogOut, 
  LayoutDashboard, 
  ShoppingBag, 
  Folder, 
  CreditCard, 
  Settings, 
  Plus, 
  Trash2, 
  ArrowLeft,
  CheckCircle,
  Package,
  TrendingDown,
  Leaf,
  ChevronRight,
  Bot,
  User,
  Volume2,
  Mic,
  ArrowRight
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
  isWelcome?: boolean;
  isBentoSpec?: boolean;
}

interface AIChatAgentPageProps {
  locale: "hy" | "ru" | "en" | "ar";
  setCurrentView: (view: any) => void;
  categories?: any[];
}

// Localized Dictionary for Sidebar & Layout
const t = {
  portal: {
    en: "Client Portal",
    hy: "Հաճախորդի Պորտալ",
    ru: "Портал Клиента"
  },
  premium: {
    en: "Premium Enterprise Access",
    hy: "Պրեմիում Ձեռնարկության Մուտք",
    ru: "Премиум Доступ для Бизнеса"
  },
  newProject: {
    en: "New Project",
    hy: "Նոր Նախագիծ",
    ru: "Новый Проект"
  },
  dashboard: {
    en: "Dashboard",
    hy: "Գործիքախումբ",
    ru: "Панель управления"
  },
  orders: {
    en: "Orders",
    hy: "Պատվերներ",
    ru: "Заказы"
  },
  projects: {
    en: "Projects",
    hy: "Նախագծեր",
    ru: "Проекты"
  },
  invoices: {
    en: "Invoices",
    hy: "Հաշիվ-Ապրանքագրեր",
    ru: "Счета-фактуры"
  },
  settings: {
    en: "Settings",
    hy: "Կարգավորումներ",
    ru: "Настройки"
  },
  chatHistory: {
    en: "CHAT HISTORY",
    hy: "ԶՐՈՒՅՑԻ ՊԱՏՄՈՒԹՅՈՒՆ",
    ru: "ИСТОРИЯ ЧАТА"
  },
  support: {
    en: "Support",
    hy: "Աջակցություն",
    ru: "Поддержка"
  },
  signOut: {
    en: "Sign Out",
    hy: "Ելք",
    ru: "Выйти"
  },
  aiConsultant: {
    en: "AI Packaging Consultant",
    hy: "AI Փաթեթավորման Խորհրդատու",
    ru: "AI Консультант по Упаковке"
  },
  intelligence: {
    en: "ENGINEERING & DESIGN INTELLIGENCE",
    hy: "ԻՆԺԵՆԵՐԱԿԱՆ ԵՎ ԴԻԶԱՅՆԵՐԱԿԱՆ ԻՆՏԵԼԵԿՏ",
    ru: "ИНЖЕНЕРНЫЙ И ДИЗАЙНЕРСКИЙ ИНТЕЛЛЕКТ"
  },
  premiumMode: {
    en: "Premium Mode",
    hy: "Պրեմիում Ռեժիմ",
    ru: "Премиум Режим"
  },
  disclaimer: {
    en: "AI CAN MAKE MISTAKES. VERIFY CRITICAL SPECS WITH A CAPSULE PACK ENGINEER.",
    hy: "AI-Ը ԿԱՐՈՂ Է ՍԽԱԼՎԵԼ: ՍՏՈՒԳԵՔ ԿԱՐԵՎՈՐ ՏՎՅԱԼՆԵՐԸ CAPSULE PACK ԻՆԺԵՆԵՐԻ ՀԵՏ:",
    ru: "AI МОЖЕТ ОШИБАТЬСЯ. ПРОВЕРЯЙТЕ ВАЖНЫЕ ХАРАКТЕРИСТИКИ С ИНЖЕНЕРОМ CAPSULE PACK."
  },
  placeholder: {
    en: "Describe your packaging challenge...",
    hy: "Նկարագրեք ձեր փաթեթավորման խնդիրը...",
    ru: "Опишите вашу задачу по упаковке..."
  },
  materials: {
    en: "Materials",
    hy: "Նյութեր",
    ru: "Материалы"
  },
  materialsDesc: {
    en: "Recommend luxury polymers or recycled board.",
    hy: "Առաջարկել շքեղ պոլիմերներ կամ վերամշակված ստվարաթուղթ:",
    ru: "Рекомендовать роскошные полимеры или переработанный картон."
  },
  budget: {
    en: "Budget",
    hy: "Բյուջե",
    ru: "Бюджет"
  },
  budgetDesc: {
    en: "Calculate unit costs at scale for shipping.",
    hy: "Հաշվարկել միավորի արժեքը մասշտաբով առաքման համար:",
    ru: "Рассчитать стоимость единицы продукции для доставки."
  },
  sustainability: {
    en: "Sustainability",
    hy: "Էկոլոգիա",
    ru: "Экологичность"
  },
  sustainabilityDesc: {
    en: "Evaluate LCA scores for compostable solutions.",
    hy: "Գնահատել LCA միավորները կոմպոստացվող լուծումների համար:",
    ru: "Оценить показатели LCA для компостируемых решений."
  },
  specTitle: {
    en: "TECHNICAL SPECS",
    hy: "ՏԵԽՆԻԿԱԿԱՆ ԲՆՈՒԹԱԳԻՐ",
    ru: "ТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ"
  },
  recyclability: {
    en: "Recyclability:",
    hy: "Վերամշակելիություն՝",
    ru: "Перерабатываемость:"
  },
  rigidity: {
    en: "Rigidity Index:",
    hy: "Կոշտության Ինդեքս՝",
    ru: "Индекс жесткости:"
  },
  leadTime: {
    en: "Lead Time:",
    hy: "Արտադրության Ժամկետ՝",
    ru: "Срок выполнения:"
  },
  leadTimeVal: {
    en: "14 Days",
    hy: "14 Օր",
    ru: "14 Дней"
  },
  clearHistory: {
    en: "Clear Chat",
    hy: "Մաքրել Զրույցը",
    ru: "Очистить чат"
  },
  toastCopied: {
    en: "Prompt copied to input!",
    hy: "Հարցումը պատճենվեց մուտքագրման դաշտ:",
    ru: "Запрос скопирован в поле ввода!"
  }
};

export default function AIChatAgentPage({ locale, setCurrentView, categories = [] }: AIChatAgentPageProps) {
  const currentLang = (locale === "ar" ? "en" : locale) || "en"; // default fallback support

  // Helper to retrieve localized text
  const currentT = (key: keyof typeof t) => {
    return t[key][currentLang] || t[key]["en"];
  };

  // Helper to generate bespoke initial mock messages matching the screenshot
  const getInitialMessages = (lang: "hy" | "en" | "ru"): Message[] => {
    switch (lang) {
      case "hy":
        return [
          {
            role: "assistant",
            text: "Ողջույն: Ես ձեր փաթեթավորման մասնագիտացված խորհրդատուն եմ: Ես կարող եմ օգնել ձեզ կառուցվածքային ինժեներության, նյութագիտության և ծախսերի օպտիմալացման հարցում ձեր հաջորդ CAPSULE PACK նախագծի համար:",
            isWelcome: true
          },
          {
            role: "user",
            text: "Ինձ անհրաժեշտ են առաջարկներ շքեղ օծանելիքի շարքի համար: Մենք ձգտում ենք նվազագույն «Apple-անման» էսթետիկայի, բայց այն պետք է լինի 100% առանց պլաստիկի: Կառուցվածքային գաղափարներ կա՞ն:"
          },
          {
            role: "assistant",
            text: "Առանց պլաստիկի շքեղ կոսմետիկ փորձի համար՝ մինիմալիստական էսթետիկայով, ես առաջարկում եմ հետևյալ կոնֆիգուրացիան.",
            isBentoSpec: true
          }
        ];
      case "ru":
        return [
          {
            role: "assistant",
            text: "Здравствуйте. Я ваш специализированный консультант по упаковке. Я могу помочь с конструктивным проектированием, материаловедением и оптимизацией затрат для вашего следующего проекта CAPSULE PACK.",
            isWelcome: true
          },
          {
            role: "user",
            text: "Мне нужны предложения для линейки роскошных духов. Мы ориентируемся на минималистичную эстетику в стиле «Apple», но упаковка должна быть на 100% без пластика. Есть конструктивные идеи?"
          },
          {
            role: "assistant",
            text: "Для роскошной косметики без использования пластика и с минималистичным дизайном я рекомендую следующую конфигурацию:",
            isBentoSpec: true
          }
        ];
      default:
        return [
          {
            role: "assistant",
            text: "Hello. I am your specialized packaging consultant. I can assist with structural engineering, material science, and cost optimization for your next CAPSULE PACK project.",
            isWelcome: true
          },
          {
            role: "user",
            text: "I need suggestions for a luxury perfume line. We're targeting a minimal \"Apple-esque\" aesthetic but need it to be 100% plastic-free. Any structural ideas?"
          },
          {
            role: "assistant",
            text: "For a plastic-free luxury cosmetic experience with a minimalist aesthetic, I recommend the following configuration:",
            isBentoSpec: true
          }
        ];
    }
  };

  const [messages, setMessages] = useState<Message[]>(() => getInitialMessages(currentLang));
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle dynamic message sending to the server
  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: "user", text: trimmed };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInputVal("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map(m => ({
            role: m.role,
            text: m.text
          })),
          locale: currentLang
        })
      });

      const data = await response.json();
      if (data.success && data.text) {
        setMessages(prev => [...prev, { role: "assistant", text: data.text }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", text: data.error || "An error occurred." }]);
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { role: "assistant", text: "Connection error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to show a brief toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Preset Card Clicks
  const handlePresetClick = (type: "materials" | "budget" | "sustainability") => {
    let text = "";
    if (type === "materials") {
      text = currentLang === "hy" 
        ? "Առաջարկեք լավագույն պրեմիում նյութերը և էկոլոգիական ստվարաթղթերը շքեղ տուփերի համար:" 
        : currentLang === "ru" 
          ? "Порекомендуйте лучшие премиум материалы и дизайнерский эко-картон для упаковки."
          : "Suggest some premium materials and designer recycled board options for high-end boxes.";
    } else if (type === "budget") {
      text = currentLang === "hy" 
        ? "Ինչպես կարող եմ օպտիմալացնել և հաշվարկել փաթեթավորման միավորի արժեքը մեծ ծավալների դեպքում:" 
        : currentLang === "ru" 
          ? "Как я могу оптимизировать и рассчитать стоимость единицы упаковки при больших тиражах?"
          : "How can I optimize and calculate packaging unit costs at scale for bulk production?";
    } else {
      text = currentLang === "hy" 
        ? "Ինչպիսի՞ն են LCA էկոլոգիական ցուցանիշները կոմպոստացվող և էկո-ֆրենդլի տուփերի համար:" 
        : currentLang === "ru" 
          ? "Каковы экологические показатели LCA для биоразлагаемой и эко-упаковки?"
          : "What are the LCA sustainability scores for biodegradable and compostable custom packaging?";
    }
    handleSend(text);
  };

  const handleSuggestionClick = (promptText: string) => {
    handleSend(promptText);
  };

  // Clear History & start a fresh customized session
  const handleClearHistory = () => {
    // Reset to only the welcome message of current lang
    setMessages([
      {
        role: "assistant",
        text: getInitialMessages(currentLang)[0].text,
        isWelcome: true
      }
    ]);
    triggerToast(currentLang === "hy" ? "Զրույցը մաքրվեց:" : currentLang === "ru" ? "История чата очищена!" : "Chat history cleared!");
  };

  return (
    <div className="w-full min-h-[92vh] bg-[#f0f2f5] text-[#1a1c1d] selection:bg-[#FF2300]/10 select-none py-6 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Page Toast Notification Alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#1a1c1d] text-white px-5 py-3 rounded-full text-xs font-sans font-bold shadow-xl flex items-center gap-2 border border-white/10"
            >
              <CheckCircle size={14} className="text-emerald-400" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outer Split Screen Grid: Left Client Portal Sidebar, Right AI Agent Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Premium Client Portal Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#f0f2f5] p-6 rounded-[2.5rem] shadow-[8px_8px_16px_#d1d9e6,_-8px_-8px_16px_#ffffff] border border-white/60 text-left flex flex-col justify-between min-h-[680px]">
              
              <div>
                {/* Brand / Title Header */}
                <div className="mb-6 px-2">
                  <h2 className="text-2xl font-sans font-black text-[#FF2300] tracking-tight leading-none mb-1">
                    {currentT("portal")}
                  </h2>
                  <p className="text-[9px] font-mono font-bold tracking-wider text-gray-400 uppercase">
                    {currentT("premium")}
                  </p>
                </div>

                {/* CTA: New Project Red Button */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView("calculator");
                    window.history.pushState({}, "", "/calculator");
                  }}
                  className="w-full cursor-pointer flex items-center justify-center gap-2 px-6 py-4 bg-[#FF2300] hover:bg-[#e61f00] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-[4px_4px_8px_rgba(255,35,0,0.15),_-4px_-4px_8px_#ffffff] border border-white/20 transition-all active:scale-95 mb-8"
                >
                  <Plus size={14} className="stroke-[3]" />
                  <span>{currentT("newProject")}</span>
                </button>

                {/* Main Client Sidebar Navigation items */}
                <nav className="space-y-2 mb-8">
                  {/* Dashboard */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView("home");
                      window.history.pushState({}, "", "/");
                    }}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold text-gray-500 hover:text-[#1a1c1d] hover:bg-white/40 transition-colors text-left"
                  >
                    <LayoutDashboard size={16} className="text-gray-400 shrink-0" />
                    <span>{currentT("dashboard")}</span>
                  </button>

                  {/* Orders */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView("track");
                      window.history.pushState({}, "", "/track-order");
                    }}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold text-gray-500 hover:text-[#1a1c1d] hover:bg-white/40 transition-colors text-left"
                  >
                    <ShoppingBag size={16} className="text-gray-400 shrink-0" />
                    <span>{currentT("orders")}</span>
                  </button>

                  {/* Projects (Currently Active View - Premium selected styled bubble) */}
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black text-white bg-[#FF2300] shadow-[3px_3px_6px_rgba(255,35,0,0.15)] text-left"
                  >
                    <span className="flex items-center gap-3.5">
                      <Folder size={16} className="text-white shrink-0" />
                      <span>{currentT("projects")}</span>
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                  </button>

                  {/* Invoices */}
                  <button
                    type="button"
                    onClick={() => triggerToast(currentLang === "hy" ? "Հաշիվներն առկա են ձեր էլ. փոստում:" : currentLang === "ru" ? "Счета отправлены на вашу почту!" : "Invoices list is synced with your email.")}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold text-gray-500 hover:text-[#1a1c1d] hover:bg-white/40 transition-colors text-left"
                  >
                    <CreditCard size={16} className="text-gray-400 shrink-0" />
                    <span>{currentT("invoices")}</span>
                  </button>

                  {/* Settings */}
                  <button
                    type="button"
                    onClick={() => triggerToast(currentLang === "hy" ? "Կարգավորումները պահպանված են:" : currentLang === "ru" ? "Настройки обновлены!" : "Enterprise configuration updated.")}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold text-gray-500 hover:text-[#1a1c1d] hover:bg-white/40 transition-colors text-left"
                  >
                    <Settings size={16} className="text-gray-400 shrink-0" />
                    <span>{currentT("settings")}</span>
                  </button>
                </nav>

                {/* CHAT HISTORY STATIC RAIL */}
                <div className="pt-4 border-t border-gray-300/30 px-2">
                  <h4 className="text-[9px] font-mono font-black text-gray-400 tracking-wider uppercase mb-3">
                    {currentT("chatHistory")}
                  </h4>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick("Tell me about luxury matte black finish and hot gold foil stamp combination.")}
                      className="w-full text-left truncate text-[11px] font-bold text-gray-500 hover:text-[#FF2300] hover:underline transition-colors block"
                    >
                      Luxury Matte Black Finish
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick("What are the best shipping box dimensions for heavy weight items?")}
                      className="w-full text-left truncate text-[11px] font-bold text-gray-500 hover:text-[#FF2300] hover:underline transition-colors block"
                    >
                      Eco-Friendly Shipping Box
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar bottom panel */}
              <div className="pt-6 border-t border-gray-300/30 space-y-1">
                {/* Support Channel */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView("contact");
                    window.history.pushState({}, "", "/contact");
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-gray-500 hover:text-[#FF2300] hover:bg-white/30 transition-colors text-left"
                >
                  <HelpCircle size={15} className="text-gray-400 shrink-0" />
                  <span>{currentT("support")}</span>
                </button>

                {/* Sign Out Button */}
                <button
                  type="button"
                  onClick={() => {
                    triggerToast(currentLang === "hy" ? "Դուք դուրս եկաք համակարգից:" : currentLang === "ru" ? "Вы успешно вышли из системы!" : "Logged out from Client Cabinet.");
                    setTimeout(() => {
                      setCurrentView("home");
                      window.history.pushState({}, "", "/");
                    }, 1200);
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-gray-500 hover:text-[#1a1c1d] hover:bg-white/30 transition-colors text-left"
                >
                  <LogOut size={15} className="text-gray-400 shrink-0" />
                  <span>{currentT("signOut")}</span>
                </button>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Packaging Consultant Stage */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Top Bar Status Row */}
            <div className="bg-[#f0f2f5] p-5 rounded-[2.5rem] shadow-[8px_8px_16px_#d1d9e6,_-8px_-8px_16px_#ffffff] border border-white/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
                {/* Pulsing Solid Red Auto-Awesome Circle icon */}
                <div className="h-10 w-10 shrink-0 rounded-full bg-[#FF2300] flex items-center justify-center text-white shadow-[4px_4px_10px_rgba(255,35,0,0.2)]">
                  <Sparkles size={18} className="animate-pulse text-white" />
                </div>
                <div>
                  <h3 className="text-base font-sans font-black text-[#1a1c1d] leading-none mb-1">
                    {currentT("aiConsultant")}
                  </h3>
                  <p className="text-[9px] font-mono font-bold tracking-widest text-gray-400">
                    {currentT("intelligence")}
                  </p>
                </div>
              </div>

              {/* Premium Status Pill and Actions */}
              <div className="flex items-center gap-3 justify-end w-full sm:w-auto">
                {/* Clear chat icon button */}
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="h-9 px-4 rounded-xl text-[10px] font-bold text-gray-400 hover:text-[#FF2300] bg-[#f0f2f5] hover:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] border border-white/30 transition-all flex items-center gap-1.5 uppercase tracking-wider"
                  title="Reset conversation state"
                >
                  <Trash2 size={12} />
                  <span>{currentT("clearHistory")}</span>
                </button>

                <div className="px-4 py-2 rounded-full bg-[#FF2300]/5 border border-[#FF2300]/10 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2300] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF2300]"></span>
                  </span>
                  <span className="text-[9px] font-mono font-black text-[#FF2300] uppercase tracking-widest">
                    {currentT("premiumMode")}
                  </span>
                </div>
              </div>
            </div>

            {/* Conversation Window */}
            <div className="bg-[#f0f2f5] p-6 sm:p-8 rounded-[2.5rem] shadow-[8px_8px_16px_#d1d9e6,_-8px_-8px_16px_#ffffff] border border-white/60 min-h-[500px] flex flex-col justify-between">
              
              {/* Chat Messages Log timeline */}
              <div className="space-y-8 overflow-y-auto max-h-[640px] pr-2 no-scrollbar text-left">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    
                    {/* Bot avatar representation */}
                    {msg.role === "assistant" && (
                      <div className="h-10 w-10 shrink-0 rounded-full bg-[#FF2300] flex items-center justify-center text-white shadow-[2px_2px_5px_rgba(255,35,0,0.15)]">
                        <Bot size={18} />
                      </div>
                    )}

                    <div className="max-w-[85%] space-y-4">
                      {/* Message Content bubble wrapper */}
                      <div className={`p-5 rounded-3xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#FF2300] text-white font-semibold rounded-tr-none shadow-[4px_4px_12px_rgba(255,35,0,0.15)] text-left"
                          : "text-[#1a1c1d] bg-[#f0f2f5] border border-white/80 shadow-[inset_2px_2px_4px_#d1d9e6,_inset_-2px_-2px_4px_#ffffff] text-left"
                      }`}>
                        <p className="whitespace-pre-line font-medium">{msg.text}</p>
                      </div>

                      {/* Welcome message preset card blocks */}
                      {msg.role === "assistant" && msg.isWelcome && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-2">
                          {/* Materials card clicker */}
                          <div 
                            onClick={() => handlePresetClick("materials")}
                            className="bg-[#f0f2f5] p-5 rounded-2xl shadow-[4px_4px_8px_#d1d9e6,_-4px_-4px_8px_#ffffff] border border-white/60 hover:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] cursor-pointer transition-all hover:translate-y-[-2px]"
                          >
                            <Package size={20} className="text-[#FF2300] mb-2.5" />
                            <h5 className="text-xs font-black uppercase text-[#1a1c1d] mb-1">
                              {currentT("materials")}
                            </h5>
                            <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                              {currentT("materialsDesc")}
                            </p>
                          </div>

                          {/* Budget card clicker */}
                          <div 
                            onClick={() => handlePresetClick("budget")}
                            className="bg-[#f0f2f5] p-5 rounded-2xl shadow-[4px_4px_8px_#d1d9e6,_-4px_-4px_8px_#ffffff] border border-white/60 hover:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] cursor-pointer transition-all hover:translate-y-[-2px]"
                          >
                            <TrendingDown size={20} className="text-[#FF2300] mb-2.5" />
                            <h5 className="text-xs font-black uppercase text-[#1a1c1d] mb-1">
                              {currentT("budget")}
                            </h5>
                            <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                              {currentT("budgetDesc")}
                            </p>
                          </div>

                          {/* Sustainability card clicker */}
                          <div 
                            onClick={() => handlePresetClick("sustainability")}
                            className="bg-[#f0f2f5] p-5 rounded-2xl shadow-[4px_4px_8px_#d1d9e6,_-4px_-4px_8px_#ffffff] border border-white/60 hover:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] cursor-pointer transition-all hover:translate-y-[-2px]"
                          >
                            <Leaf size={20} className="text-[#FF2300] mb-2.5" />
                            <h5 className="text-xs font-black uppercase text-[#1a1c1d] mb-1">
                              {currentT("sustainability")}
                            </h5>
                            <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                              {currentT("sustainabilityDesc")}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Spec configuration card with image + metrics */}
                      {msg.role === "assistant" && msg.isBentoSpec && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            
                            {/* Card 1: Cosmetic Box illustration (image representation with caption) */}
                            <div className="relative h-52 bg-[#f0f2f5] rounded-3xl overflow-hidden shadow-[4px_4px_8px_#d1d9e6,_-4px_-4px_8px_#ffffff] border border-white/60">
                              <img 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJi1o3Z3rxZ7CrBgZAWqIV_5pqupsXc72E3i1cW7FDIKsdH4agy-iEqo-9Y5AxV9x5xSctzCfr9qHjrJiE5f09i9XDxPLZ788JwRYCwenvvxNeqpqle3R1Zgqs5JuzPs97r32bgcxGFCfU26sqmvltVtuJIjn2GPqWywVq4sfaiQ1fm6wv8DLpnIk4PkcY80r4vHTaUleizlXykUcwNIOvUhKgDB2Mx0Eb6d5jDSDm8xBBNrO7k5k1GK9VkK3lvZ2rGlMyrF1jKZom"
                                alt="Premium rigid cardboard box mockup"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/70 backdrop-blur-md border-t border-white/30 text-left">
                                <p className="text-[10px] font-mono font-black uppercase text-gray-500 tracking-wider mb-0.5">
                                  Structural Mockup
                                </p>
                                <p className="text-xs font-bold text-[#1a1c1d]">
                                  Material: 400gsm Arctic White
                                </p>
                              </div>
                            </div>

                            {/* Card 2: Numeric Technical Metrics List */}
                            <div className="bg-[#f0f2f5] p-5 rounded-3xl shadow-[4px_4px_8px_#d1d9e6,_-4px_-4px_8px_#ffffff] border border-white/60 flex flex-col justify-center text-left">
                              <h5 className="text-[10px] font-mono font-black text-[#FF2300] uppercase tracking-widest mb-4">
                                {currentT("specTitle")}
                              </h5>
                              <div className="space-y-3">
                                {/* Recyclability item */}
                                <div className="flex items-center justify-between border-b border-gray-300/30 pb-2">
                                  <span className="text-xs text-gray-500 font-bold">{currentT("recyclability")}</span>
                                  <span className="text-xs font-extrabold text-[#FF2300]">100%</span>
                                </div>
                                {/* Rigidity item */}
                                <div className="flex items-center justify-between border-b border-gray-300/30 pb-2">
                                  <span className="text-xs text-gray-500 font-bold">{currentT("rigidity")}</span>
                                  <span className="text-xs font-extrabold text-[#1a1c1d]">8.5/10</span>
                                </div>
                                {/* Lead Time item */}
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500 font-bold">{currentT("leadTime")}</span>
                                  <span className="text-xs font-extrabold text-[#1a1c1d]">{currentT("leadTimeVal")}</span>
                                </div>
                              </div>
                            </div>

                          </div>

                          {/* Dynamic concluding description */}
                          <p className="text-xs text-gray-500 font-semibold leading-relaxed max-w-2xl bg-white/30 p-4 rounded-2xl border border-white/40">
                            {currentLang === "hy" 
                              ? "Մենք կարող ենք հասնել «պրեմիում» սեղմման զգացողությանը՝ օգտագործելով ամբողջությամբ սեղմված ցելյուլոզային թելերից պատրաստված հատուկ մագնիսական ամրության շփման համակարգը: Սա վերացնում է պլաստիկ ներդիրների անհրաժեշտությունը՝ պահպանելով հաճելի շոշափելի բացման փորձը:" 
                              : currentLang === "ru" 
                                ? "Мы можем достичь «премиального» ощущения щелчка, используя специальную фрикционную посадку с магнитной прочностью, полностью изготовленную из спрессованных целлюлозных волокон. Это устраняет необходимость в пластиковых вставках, сохраняя при этом приятные тактильные ощущения при открытии."
                                : "We can achieve the \"premium\" click feel by using a custom magnetic-strength friction fit made entirely from compressed cellulose fibers. This removes the need for plastic inserts while maintaining a satisfying tactile opening experience."
                            }
                          </p>
                        </div>
                      )}

                    </div>

                    {/* User avatar representation */}
                    {msg.role === "user" && (
                      <div className="h-10 w-10 shrink-0 rounded-full bg-white flex items-center justify-center text-[#1a1c1d] shadow-[2px_2px_5px_#d1d9e6] border border-white/60">
                        <User size={18} />
                      </div>
                    )}

                  </div>
                ))}

                {/* Gemini Model Loader */}
                {isLoading && (
                  <div className="flex gap-4 justify-start">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-[#FF2300] flex items-center justify-center text-white shadow-[2px_2px_5px_rgba(255,35,0,0.15)] animate-pulse">
                      <Bot size={18} />
                    </div>
                    <div className="bg-[#f0f2f5] border border-white/80 shadow-[inset_2px_2px_4px_#d1d9e6,_inset_-2px_-2px_4px_#ffffff] rounded-3xl p-5 text-xs text-gray-500 font-bold flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#FF2300] animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 rounded-full bg-[#FF2300] animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 rounded-full bg-[#FF2300] animate-bounce"></span>
                      <span className="ml-1 text-[10px] font-mono tracking-wider uppercase text-gray-400">
                        {currentLang === "hy" ? "Մտածում է..." : currentLang === "ru" ? "Генерация ответа..." : "Consulting specs..."}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Scroll Target */}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Form prompt input box container */}
              <div className="mt-8 pt-4 border-t border-gray-300/30">
                
                {/* Suggested prompt chips above the input */}
                <div className="flex flex-wrap items-center justify-start gap-2.5 mb-5">
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(currentLang === "hy" ? "Ո՞րն է լավագույն տուփը շքեղ կոսմետիկայի համար:" : currentLang === "ru" ? "Какая упаковка лучше всего для люксовой косметики?" : "Best packaging for luxury cosmetics?")}
                    className="cursor-pointer px-4 py-2 text-[10px] font-black text-gray-500 bg-[#f0f2f5] shadow-[3px_3px_6px_#d1d9e6,_-3px_-3px_6px_#ffffff] rounded-full border border-white/60 hover:text-[#FF2300] hover:shadow-[inset_1.5px_1.5px_3px_#d1d9e6,inset_-1.5px_-1.5px_3px_#ffffff] transition-all"
                  >
                    {currentLang === "hy" ? "Լավագույն կոսմետիկ տուփերը" : currentLang === "ru" ? "Упаковка для люкс косметики" : "Best packaging for luxury cosmetics?"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(currentLang === "hy" ? "Էկոլոգիապես մաքուր սննդի տարաների տարբերակներ կա՞ն:" : currentLang === "ru" ? "Какие есть варианты экологичной пищевой упаковки?" : "Eco-friendly food containers?")}
                    className="cursor-pointer px-4 py-2 text-[10px] font-black text-gray-500 bg-[#f0f2f5] shadow-[3px_3px_6px_#d1d9e6,_-3px_-3px_6px_#ffffff] rounded-full border border-white/60 hover:text-[#FF2300] hover:shadow-[inset_1.5px_1.5px_3px_#d1d9e6,inset_-1.5px_-1.5px_3px_#ffffff] transition-all"
                  >
                    {currentLang === "hy" ? "Էկո սննդի տարաներ" : currentLang === "ru" ? "Эко пищевая упаковка" : "Eco-friendly food containers?"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(currentLang === "hy" ? "Ինչպե՞ս օպտիմալացնել իմ առաքման տուփերը ծախսերի կրճատման համար:" : currentLang === "ru" ? "Как оптимизировать мои транспортные коробки для снижения затрат?" : "Optimize my shipping boxes")}
                    className="cursor-pointer px-4 py-2 text-[10px] font-black text-gray-500 bg-[#f0f2f5] shadow-[3px_3px_6px_#d1d9e6,_-3px_-3px_6px_#ffffff] rounded-full border border-white/60 hover:text-[#FF2300] hover:shadow-[inset_1.5px_1.5px_3px_#d1d9e6,inset_-1.5px_-1.5px_3px_#ffffff] transition-all"
                  >
                    {currentLang === "hy" ? "Օպտիմալացնել առաքման տուփերը" : currentLang === "ru" ? "Оптимизация коробок доставки" : "Optimize my shipping boxes"}
                  </button>
                </div>

                {/* Input Text Form with paperclip / image attachments inside soft-ui-inset card */}
                <div className="relative flex items-center justify-between bg-[#f0f2f5] rounded-full px-5 py-3 shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#ffffff] border border-white/20">
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Attachment 1: Paperclip */}
                    <button
                      type="button"
                      onClick={() => triggerToast(currentLang === "hy" ? "Կցեք CAD ֆայլը (Դեմո):" : currentLang === "ru" ? "Прикрепите чертеж CAD (Демо):" : "Attach CAD blueprints (Demo):")}
                      className="cursor-pointer p-1.5 text-gray-400 hover:text-[#FF2300] transition-colors"
                      title="Attach project specification document"
                    >
                      <Paperclip size={16} />
                    </button>
                    {/* Attachment 2: Picture */}
                    <button
                      type="button"
                      onClick={() => triggerToast(currentLang === "hy" ? "Կցեք Տարբերանշանի նկարը (Դեմո):" : currentLang === "ru" ? "Прикрепите фото логотипа (Демо):" : "Attach Artwork Image (Demo):")}
                      className="cursor-pointer p-1.5 text-gray-400 hover:text-[#FF2300] transition-colors"
                      title="Attach branding graphics file"
                    >
                      <ImageIcon size={16} />
                    </button>
                  </div>

                  {/* Input field */}
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && inputVal.trim()) {
                        handleSend(inputVal);
                      }
                    }}
                    placeholder={currentT("placeholder")}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-4 text-xs font-sans text-[#1a1c1d] font-bold placeholder-gray-400"
                  />

                  {/* Send circular red button */}
                  <button
                    type="button"
                    disabled={isLoading || !inputVal.trim()}
                    onClick={() => handleSend(inputVal)}
                    className="shrink-0 h-9 w-9 cursor-pointer flex items-center justify-center bg-[#FF2300] hover:bg-[#e61f00] text-white rounded-full shadow-[2px_2px_6px_rgba(255,35,0,0.15)] border border-white/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <ArrowRight size={15} className="stroke-[3]" />
                  </button>
                </div>

                {/* Sub-note disclaimer at the bottom */}
                <div className="mt-4 text-center">
                  <p className="text-[9px] text-gray-400 font-mono tracking-widest font-bold">
                    {currentT("disclaimer")}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
