import React, { useState } from "react";
import { 
  ChevronRight, 
  ArrowRight, 
  Cpu, 
  Gem, 
  CheckCircle2, 
  Zap, 
  Globe, 
  Headphones, 
  Sparkles, 
  MessageSquare,
  Activity,
  User,
  Settings,
  Flame,
  MousePointerClick
} from "lucide-react";
import AIAgentBlock from "./AIAgentBlock";

interface CapsulePackHomeProps {
  locale: "hy" | "ru" | "en";
  setCurrentView: (view: "home" | "calculator" | "track" | "ecommerce" | "ai-chat") => void;
  setActiveCategory: (catId: string) => void;
  setIsInTrackPortal?: (isIn: boolean) => void;
  featuredProducts?: any[];
  setSavedItemsCount: React.Dispatch<React.SetStateAction<number>>;
  setCalcResult: (res: any) => void;
}

export default function CapsulePackHome({ 
  locale, 
  setCurrentView, 
  setActiveCategory, 
  setIsInTrackPortal,
  featuredProducts,
  setSavedItemsCount,
  setCalcResult
}: CapsulePackHomeProps) {
  
  // Interactive preview calculator states
  const [previewLength, setPreviewLength] = useState<number>(200);
  const [previewWidth, setPreviewWidth] = useState<number>(150);

  // Success state for sample request trigger
  const [samplesRequested, setSamplesRequested] = useState<boolean>(false);

  // Localized string translation dictionary
  const t = (key: string): string => {
    const dict: Record<string, Record<"en" | "ru" | "hy", string>> = {
      heroTagline: {
        en: "Manufacturing Excellence",
        ru: "Производственное Совершенство",
        hy: "Արտադրական Կատարելություն"
      },
      heroTitle: {
        en: "Premium Custom Packaging for Modern Brands",
        ru: "Премиальная упаковка для современных брендов",
        hy: "Պրեմիում Փաթեթավորում Ժամանակակից Բրենդների Համար"
      },
      heroSubtitle: {
        en: "From concept to production. Design, calculate, visualize, and order custom packaging with confidence using our enterprise-grade digital suite.",
        ru: "От идеи до готового тиража. Проектируйте, рассчитывайте стоимость, смотрите в 3D и заказывайте фирменную упаковку с гарантией качества.",
        hy: "Գաղափարից մինչև արտադրություն: Նախագծեք, հաշվարկեք, տեսեք 3D և պատվիրեք անհատական փաթեթավորում վստահությամբ:"
      },
      btnCalculate: {
        en: "Calculate Packaging",
        ru: "Рассчитать Упаковку",
        hy: "Հաշվարկել Փաթեթավորումը"
      },
      btnContact: {
        en: "Contact Us",
        ru: "Связаться с нами",
        hy: "Կապվել Մեզ հետ"
      },
      trustMfg: {
        en: "Custom manufacturing",
        ru: "Свое производство",
        hy: "Անհատական արտադրություն"
      },
      trustMaterials: {
        en: "Premium materials",
        ru: "Премиум материалы",
        hy: "Պրեմիում նյութեր"
      },
      trustQuality: {
        en: "Quality control",
        ru: "Контроль качества",
        hy: "Որակի վերահսկում"
      },
      trustProduction: {
        en: "Fast production",
        ru: "Быстрое производство",
        hy: "Արագ արտադրություն"
      },
      trustDelivery: {
        en: "Worldwide delivery",
        ru: "Доставка по миру",
        hy: "Համաշխարհային առաքում"
      },
      trustSupport: {
        en: "Professional support",
        ru: "Проф. поддержка",
        hy: "Պրոֆեսիոնալ աջակցում"
      },
      productsTitle: {
        en: "Product Solutions",
        ru: "Каталог Продукции",
        hy: "Ապրանքների Տեսականի"
      },
      productsSubtitle: {
        en: "Explore our catalog of precision-engineered packaging structures tailored for every industry.",
        ru: "Ознакомьтесь с каталогом упаковочных решений, разработанных специально для вашего бизнеса.",
        hy: "Բացահայտեք մեր բարձրորակ փաթեթավորման լուծումները՝ հարմարեցված յուրաքանչյուր ոլորտի համար:"
      },
      viewAllProducts: {
        en: "View All Products",
        ru: "Смотреть весь каталог",
        hy: "Դիտել Ամբողջ Տեսականին"
      },
      configureNow: {
        en: "Configure Now",
        ru: "Настроить сейчас",
        hy: "Կարգավորել Հիմա"
      },
      processTagline: {
        en: "The Process",
        ru: "Процесс работы",
        hy: "Գործընթացը"
      },
      processTitle: {
        en: "Streamlined From Idea to Reality",
        ru: "От Идеи до Готовой Коробки",
        hy: "Գաղափարից մինչև Իրականություն"
      },
      step1Title: {
        en: "Choose",
        ru: "Выбор шаблона",
        hy: "Ընտրել"
      },
      step1Desc: {
        en: "Select your base structure from 500+ templates.",
        ru: "Выберите базовую конструкцию из 500+ шаблонов.",
        hy: "Ընտրեք ձեր հիմքը 500+ կաղապարներից:"
      },
      step2Title: {
        en: "Configure",
        ru: "Параметры",
        hy: "Կարգավորել"
      },
      step2Desc: {
        en: "Input dimensions and material preferences.",
        ru: "Задайте точные размеры и выберите материалы.",
        hy: "Մուտքագրեք չափսերը և նյութի նախընտրությունները:"
      },
      step3Title: {
        en: "3D View",
        ru: "3D Визуализация",
        hy: "3D Դիտում"
      },
      step3Desc: {
        en: "Instant visualization of your design in real-time.",
        ru: "Интерактивный просмотр макета в 3D режиме.",
        hy: "Ձեր դիզայնի ակնթարթային 3D արտապատկերում:"
      },
      step4Title: {
        en: "Pricing",
        ru: "Расчет цены",
        hy: "Գնագոյացում"
      },
      step4Desc: {
        en: "Transparent cost calculation for bulk orders.",
        ru: "Моментальный автоматический расчет стоимости тиража.",
        hy: "Թափանցիկ գների հաշվարկ մեծաքանակ պատվերների համար:"
      },
      step5Title: {
        en: "Order",
        ru: "Запуск заказа",
        hy: "Պատվեր"
      },
      step5Desc: {
        en: "Finalize production with secure global shipping.",
        ru: "Запустите производство с надежной доставкой по миру.",
        hy: "Ավարտեք արտադրության կարգավորումը և ստացեք առաքմամբ:"
      },
      calcTagline: {
        en: "Advanced Engineering",
        ru: "Цифровой Конструктор",
        hy: "Ճարտարագիտական Հաշվիչ"
      },
      calcTitle: {
        en: "Packaging Calculator",
        ru: "Калькулятор Упаковки",
        hy: "Փաթեթավորման Հաշվիչ"
      },
      calcDesc: {
        en: "Our proprietary algorithm factors in volume, weight support, and material sustainability to give you the most efficient packaging dimensions and quote instantly.",
        ru: "Наш алгоритм учитывает объем, прочность и экологичность материалов для моментального подбора размеров и расчета стоимости.",
        hy: "Մեր հատուկ ալգորիթմը հաշվի է առնում տուփի ծավալը, քաշի հուսալիությունը և նյութերի էկոլոգիականությունը՝ ապահովելով լավագույն գինը:"
      },
      lengthLabel: {
        en: "Length (mm)",
        ru: "Длина (мм)",
        hy: "Երկարություն (մմ)"
      },
      widthLabel: {
        en: "Width (mm)",
        ru: "Ширина (мм)",
        hy: "Լայնություն (մմ)"
      },
      estPriceLabel: {
        en: "Estimated Unit Price:",
        ru: "Ориентировочная цена:",
        hy: "Միավորի Գինը:"
      },
      aiTitle: {
        en: "AI Consultant",
        ru: "AI Консультант",
        hy: "AI Խորհրդատու"
      },
      aiDesc: {
        en: "Get intelligent recommendations on material selection and sustainability scores for your project.",
        ru: "Получите интеллектуальные рекомендации по подбору сырья и экологичности вашего проекта.",
        hy: "Ստացեք խելացի խորհրդատվություն նյութերի ընտրության և էկոլոգիականության վերաբերյալ:"
      },
      trackingTitle: {
        en: "Order Tracking",
        ru: "Отслеживание Заказов",
        hy: "Հետևել Պատվերին"
      },
      trackingDesc: {
        en: "Real-time visibility into your production batch, from the first cut to the final delivery.",
        ru: "Прозрачное отслеживание вашей партии в реальном времени от первого реза на плоттере до двери.",
        hy: "Իրական ժամանակում հետևեք արտադրության ընթացքին՝ առաջին կտրվածքից մինչև առաքում:"
      },
      dashboardTitle: {
        en: "Client Dashboard",
        ru: "Личный Кабинет",
        hy: "Հաճախորդի Էջ"
      },
      dashboardDesc: {
        en: "Manage blueprints, re-order history, and assets in a unified enterprise portal.",
        ru: "Управляйте вашими чертежами, историей повторных тиражей и макетами в едином кабинете.",
        hy: "Կառավարեք ձեր գծագրերը, պատվերների պատմությունը և նյութերը մեկ հարթակում:"
      },
      showcaseTitle: {
        en: "Project Showcase",
        ru: "Наши Проекты",
        hy: "Կատարված Աշխատանքներ"
      },
      showcaseSubtitle: {
        en: "See how world-class brands use CAPSULE PACK.",
        ru: "Посмотрите примеры работ, созданных для лучших мировых брендов.",
        hy: "Տեսեք, թե ինչպես են առաջատար բրենդներն օգտագործում CAPSULE PACK-ը:"
      },
      ctaTitle: {
        en: "Ready to Elevate Your Brand?",
        ru: "Готовы поднять ценность бренда?",
        hy: "Պատրա՞ստ եք բարձրացնել ձեր բրենդի որակը:"
      },
      ctaDesc: {
        en: "Join 500+ global brands using our platform to manufacture custom packaging that delivers more than just a product.",
        ru: "Присоединяйтесь к 500+ мировым брендам, которые заказывают премиальную упаковку у нас.",
        hy: "Միացեք 500+ համաշխարհային բրենդներին, որոնք օգտագործում են մեր հարթակը՝ պատվիրելու անհատական փաթեթավորում:"
      },
      ctaStart: {
        en: "Start Your Project",
        ru: "Начать проект",
        hy: "Սկսել Նախագիծը"
      },
      ctaSamples: {
        en: "Request Samples",
        ru: "Заказать образцы",
        hy: "Պատվիրել Նմուշներ"
      }
    };
    return dict[key]?.[locale] || dict[key]?.["en"] || key;
  };

  // Pricing calculation based on user input
  const calculatedUnitPrice = Math.max(0.25, (previewLength * previewWidth * 0.000032 + 0.15)).toFixed(2);

  const handleConfigureCategory = (catId: string) => {
    setActiveCategory(catId);
    setCalcResult(null); // Clear previous configuration for fresh start
    setCurrentView("calculator");
    window.history.pushState({}, "", "/calculator");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full bg-[#f0f2f5] text-[#1a1c1d] font-sans antialiased pb-20 select-none">
      
      {/* Neomorphic CSS injected locally */}
      <style>{`
        .soft-ui-card {
          background: #f0f2f5;
          box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.45);
        }
        .soft-ui-card-inset {
          background: #f0f2f5;
          box-shadow: inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff;
        }
        .soft-ui-button {
          background: #f0f2f5;
          box-shadow: 6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.5);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .soft-ui-button:hover {
          box-shadow: 3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff;
          transform: translateY(-1px);
        }
        .soft-ui-button:active {
          box-shadow: inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff;
          transform: scale(0.98);
        }
        .soft-ui-button-primary {
          background: #FF2300;
          color: #ffffff;
          box-shadow: 6px 6px 12px rgba(255, 35, 0, 0.22), -6px -6px 12px #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .soft-ui-button-primary:hover {
          background: #e61f00;
          box-shadow: 3px 3px 6px rgba(255, 35, 0, 0.22), -3px -3px 6px #ffffff;
          transform: translateY(-1px);
        }
        .soft-ui-button-primary:active {
          box-shadow: inset 3px 3px 6px rgba(0,0,0,0.2);
          transform: scale(0.98);
        }
      `}</style>

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[85vh] flex items-center pt-16 md:pt-24 overflow-hidden bg-[#f0f2f5]">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full text-left">
          
          <div className="flex flex-col gap-5">
            <span className="text-[#FF2300] font-mono text-xs tracking-widest uppercase font-extrabold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF2300] animate-ping inline-block" />
              {t("heroTagline")}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6.5xl font-extrabold tracking-tight text-[#1a1c1d] leading-[1.1] uppercase">
              {t("heroTitle")}
            </h1>
            <p className="text-base sm:text-lg text-[#414753] max-w-xl font-medium leading-relaxed">
              {t("heroSubtitle")}
            </p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <button 
                type="button"
                onClick={() => handleConfigureCategory("boxes")}
                className="px-8 py-4 text-sm font-bold uppercase tracking-wider rounded-full soft-ui-button-primary flex items-center gap-2 cursor-pointer"
              >
                <span>{t("btnCalculate")}</span>
                <ArrowRight size={16} />
              </button>
              <button 
                type="button"
                onClick={() => {
                  setCurrentView("ai-chat");
                  window.history.pushState({}, "", "/chat");
                }}
                className="px-8 py-4 text-sm font-bold uppercase tracking-wider rounded-full soft-ui-button text-[#1a1c1d] cursor-pointer"
              >
                {t("btnContact")}
              </button>
            </div>
          </div>

          <div className="relative group w-full flex justify-center">
            <div className="absolute -inset-4 bg-[#FF2300]/5 rounded-full blur-3xl transition-all group-hover:bg-[#FF2300]/10" />
            <div className="soft-ui-card p-5 rounded-3xl w-full max-w-[500px]">
              <div className="overflow-hidden rounded-2xl relative shadow-inner">
                <img 
                  className="w-full h-auto object-cover rounded-xl transition-transform duration-700 group-hover:scale-[1.01]" 
                  alt="Premium Box Presentation"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP1v_EMZIPTntk_4h6BPjWRb_xKTjt_zWvgRjoM0BJ2wqalzc_gxsyoNTAhyRvuHhHsSN_9ZqRmSI0p6M0Af19V1BV9Vqb-msCJ5w2GeJUsDN50huiA6RuaAGzkmPqA9dZvrWKXQJnCHycDG5jroWya8EuH8QLg8UOVGRnLGGb9R5MhX1XyOCEMZekt4F6WoGBEQAlMUwy2zd7tGtzbA_IfCCKAGPpO9VIrP0VSqnHSBlMsoP1Fv0p6p0A-ff-5VMHwNTgbplp_dz2"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-white/40 px-3.5 py-1.5 rounded-full shadow-sm text-[10px] font-mono font-extrabold text-[#FF2300]">
                  SH-102 Bespoke Case
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= TRUST BADGES SECTION ================= */}
      <section className="py-16 bg-[#f0f2f5]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            
            <div className="flex flex-col items-center text-center p-6 soft-ui-card rounded-2xl hover:border-[#FF2300]/25 transition-colors cursor-default group">
              <div className="w-12 h-12 rounded-full soft-ui-card-inset flex items-center justify-center mb-4 text-[#FF2300] group-hover:scale-105 transition-transform duration-300">
                <Cpu size={22} />
              </div>
              <span className="text-[11px] font-mono tracking-wider font-extrabold text-[#1a1c1d] uppercase">{t("trustMfg")}</span>
            </div>

            <div className="flex flex-col items-center text-center p-6 soft-ui-card rounded-2xl hover:border-[#FF2300]/25 transition-colors cursor-default group">
              <div className="w-12 h-12 rounded-full soft-ui-card-inset flex items-center justify-center mb-4 text-[#FF2300] group-hover:scale-105 transition-transform duration-300">
                <Gem size={22} />
              </div>
              <span className="text-[11px] font-mono tracking-wider font-extrabold text-[#1a1c1d] uppercase">{t("trustMaterials")}</span>
            </div>

            <div className="flex flex-col items-center text-center p-6 soft-ui-card rounded-2xl hover:border-[#FF2300]/25 transition-colors cursor-default group">
              <div className="w-12 h-12 rounded-full soft-ui-card-inset flex items-center justify-center mb-4 text-[#FF2300] group-hover:scale-105 transition-transform duration-300">
                <CheckCircle2 size={22} />
              </div>
              <span className="text-[11px] font-mono tracking-wider font-extrabold text-[#1a1c1d] uppercase">{t("trustQuality")}</span>
            </div>

            <div className="flex flex-col items-center text-center p-6 soft-ui-card rounded-2xl hover:border-[#FF2300]/25 transition-colors cursor-default group">
              <div className="w-12 h-12 rounded-full soft-ui-card-inset flex items-center justify-center mb-4 text-[#FF2300] group-hover:scale-105 transition-transform duration-300">
                <Zap size={22} />
              </div>
              <span className="text-[11px] font-mono tracking-wider font-extrabold text-[#1a1c1d] uppercase">{t("trustProduction")}</span>
            </div>

            <div className="flex flex-col items-center text-center p-6 soft-ui-card rounded-2xl hover:border-[#FF2300]/25 transition-colors cursor-default group">
              <div className="w-12 h-12 rounded-full soft-ui-card-inset flex items-center justify-center mb-4 text-[#FF2300] group-hover:scale-105 transition-transform duration-300">
                <Globe size={22} />
              </div>
              <span className="text-[11px] font-mono tracking-wider font-extrabold text-[#1a1c1d] uppercase">{t("trustDelivery")}</span>
            </div>

            <div className="flex flex-col items-center text-center p-6 soft-ui-card rounded-2xl hover:border-[#FF2300]/25 transition-colors cursor-default group">
              <div className="w-12 h-12 rounded-full soft-ui-card-inset flex items-center justify-center mb-4 text-[#FF2300] group-hover:scale-105 transition-transform duration-300">
                <Headphones size={22} />
              </div>
              <span className="text-[11px] font-mono tracking-wider font-extrabold text-[#1a1c1d] uppercase">{t("trustSupport")}</span>
            </div>

          </div>
        </div>
      </section>

      {/* ================= PRODUCT SOLUTIONS CATALOG SHOWCASE ================= */}
      <section id="product-solutions-section" className="py-16 bg-[#f0f2f5]">
        <div className="max-w-[1280px] mx-auto px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-left">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#1a1c1d] uppercase">{t("productsTitle")}</h2>
              <p className="text-sm sm:text-base text-[#414753] mt-2 font-medium max-w-xl">{t("productsSubtitle")}</p>
            </div>
            <button 
              type="button"
              onClick={() => {
                setCurrentView("ecommerce");
                window.history.pushState({}, "", "/catalog");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-6 py-3.5 bg-[#f0f2f5] text-xs font-bold tracking-wider uppercase rounded-full soft-ui-button flex items-center gap-2 cursor-pointer shrink-0 self-start md:self-auto"
            >
              <span>{t("viewAllProducts")}</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Card 1: Luxury Boxes */}
            <div className="group cursor-pointer text-left" onClick={() => handleConfigureCategory("boxes")}>
              <div className="relative overflow-hidden aspect-[4/5] rounded-3xl mb-4 soft-ui-card p-3">
                <div className="w-full h-full overflow-hidden rounded-2xl relative">
                  <img 
                    className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105" 
                    alt="Luxury boxes template" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPD-IJDqpfFK2SPK7IYj9I0YYP8N5aw-h6fMzbHtINPvxtpHeqpFpwfqQhuXPqJct83MNBU33NGbUTEThXelAYYE31DGyKW0dtA97IX8UMNR76n6IvTtw-tQvJlTrWFv1JiCuUVgMspCNzBNB_ZsAOMMMsdARkeDbGOz_1DiwwfWVnesWEu5zyOrAbZgzGHbhZOR3Br8_eYgolzrWkCZgVIQ4O_58itEKo0iAOkIWGKgB2jvksCe5iMe3rOuYnnPeRCuTjgA0PMuV_"
                  />
                  <div className="absolute inset-0 bg-[#FF2300]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button className="w-full py-3 bg-[#FF2300] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                      {t("configureNow")}
                    </button>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#1a1c1d] uppercase mt-2">
                {locale === "hy" ? "Պրեմիում Տուփեր" : locale === "ru" ? "Премиум Коробки" : "Luxury Boxes"}
              </h3>
              <p className="text-xs text-[#414753] font-medium mt-1">
                {locale === "hy" ? "Կոշտ տուփեր պրեմիում բրենդների համար:" : locale === "ru" ? "Жесткие коробки для премиум брендов." : "Rigid structures for premium brands."}
              </p>
            </div>

            {/* Card 2: Folding Cartons / Bags */}
            <div className="group cursor-pointer text-left" onClick={() => handleConfigureCategory("bags")}>
              <div className="relative overflow-hidden aspect-[4/5] rounded-3xl mb-4 soft-ui-card p-3">
                <div className="w-full h-full overflow-hidden rounded-2xl relative">
                  <img 
                    className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105" 
                    alt="Bags packaging templates" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuARmT29UG29pZmugo3HZS5789D3X8UoWHS3gdLKFEVARq567LhotTRNxf_bZ9iRuu7bFEkFccz946ofIUZt6142JQjOdxB-VW9Cx_1MGxICWS7iqlcMxgsNtlm3rijcT8b3hWxbe7-eT3piaFqwzQ62bROtMFUdXNAsK8i6I4JDlz4mxawDX_wHa9p846K48PDs_LN5pucTTNPQZN0Tz-UYbF2xVSS_Jl2BT8QMjLXkZLTCRVKBkP0P8-MovIM9LCBlaTyhAQq4NHI_"
                  />
                  <div className="absolute inset-0 bg-[#FF2300]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button className="w-full py-3 bg-[#FF2300] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                      {t("configureNow")}
                    </button>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#1a1c1d] uppercase mt-2">
                {locale === "hy" ? "Թղթե Տոպրակներ" : locale === "ru" ? "Бумажные Пакеты" : "Folding Cartons"}
              </h3>
              <p className="text-xs text-[#414753] font-medium mt-1">
                {locale === "hy" ? "Բազմակողմանի և էկոլոգիապես մաքուր լուծումներ:" : locale === "ru" ? "Универсальные экологичные решения." : "Versatile & sustainable solutions."}
              </p>
            </div>

            {/* Card 3: E-commerce Boxes */}
            <div className="group cursor-pointer text-left" onClick={() => handleConfigureCategory("boxes")}>
              <div className="relative overflow-hidden aspect-[4/5] rounded-3xl mb-4 soft-ui-card p-3">
                <div className="w-full h-full overflow-hidden rounded-2xl relative">
                  <img 
                    className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105" 
                    alt="E-commerce box setup" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMo84f2mXqd0XLY-yD2GzwJ7Wcdfxxl0wvP14fDr29qtEk3Vx4onPt8AX-e75grWakKpCCx6eFXNaJdubGioMpcFu2MIu8N9Xsg9fuK0bkRVTVqidwwF91XjGg1u8VqzIXvhFOgf_K5hhNfYdOs5yD67GBXLOJ727UmrhcFPg7WnNm1WEk-gIHwDCpS5TS3UwDX0ctqiU6cjg9cOZGX5rAp9nFlOnqYu_rXyTKCcffEEE3mjkaiCA01M4hQKJ9TiqRAo9jh80duqgU"
                  />
                  <div className="absolute inset-0 bg-[#FF2300]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button className="w-full py-3 bg-[#FF2300] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                      {t("configureNow")}
                    </button>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#1a1c1d] uppercase mt-2">
                {locale === "hy" ? "Առաքման Տուփեր" : locale === "ru" ? "Картонные Коробки" : "E-commerce"}
              </h3>
              <p className="text-xs text-[#414753] font-medium mt-1">
                {locale === "hy" ? "Ամրությունը համատեղվում է բրենդի ոճի հետ:" : locale === "ru" ? "Надежность и яркий стиль бренда." : "Durability meets brand identity."}
              </p>
            </div>

            {/* Card 4: Cosmetic / Custom Other Products */}
            <div className="group cursor-pointer text-left" onClick={() => handleConfigureCategory("other_products")}>
              <div className="relative overflow-hidden aspect-[4/5] rounded-3xl mb-4 soft-ui-card p-3">
                <div className="w-full h-full overflow-hidden rounded-2xl relative">
                  <img 
                    className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105" 
                    alt="Cosmetic jars and tubes packaging" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU-t6r2CO4TSFFtOL6s1TGSCD0cmGeoKNSvJSQkSVVssZIcYaiWl60yZFkskY0Reya-CmAPDuq4e9SUWGjqmFaWgGBlOyazxTZBysAHqnFf7LUH2YyUhQSAt_nPwUmKQWXAXo9G3Code3D5vad7jMffGGU4oKvQuHprdlDBFIyjbPmmuSH4HlMqUhnjHWL3or-E4xwz2gugrYnIPawkrhCrQxJ8DbR_fg-NaVm4szJZszakvkxBcu8G1lSDk0ermRr1LcSyxdgN60y"
                  />
                  <div className="absolute inset-0 bg-[#FF2300]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button className="w-full py-3 bg-[#FF2300] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                      {t("configureNow")}
                    </button>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#1a1c1d] uppercase mt-2">
                {locale === "hy" ? "Կոսմետիկ Փաթեթներ" : locale === "ru" ? "Парфюм и Косметика" : "Cosmetic Packaging"}
              </h3>
              <p className="text-xs text-[#414753] font-medium mt-1">
                {locale === "hy" ? "Նրբագեղություն յուրաքանչյուր դետալում:" : locale === "ru" ? "Элегантность в каждой детали." : "Elegance in every detail."}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS (STREAMLINED PROCESS - Dark #0a0a0b Theme) ================= */}
      <section id="process-section" className="py-20 bg-[#0A0A0B] text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[#FF2300]/2 opacity-5 blur-2xl pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          
          <div className="text-center mb-16">
            <span className="text-[#FF2300] font-mono text-xs tracking-[0.25em] uppercase font-black block mb-3">
              {t("processTagline")}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase leading-none">
              {t("processTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-full bg-[#141416] border border-white/5 flex items-center justify-center mb-6 shadow-inner hover:border-[#FF2300]/30 hover:shadow-[0_0_20px_rgba(255,35,0,0.1)] transition-all duration-300">
                <span className="text-2xl font-mono text-[#FF2300] font-extrabold">01</span>
              </div>
              <h4 className="text-lg font-bold uppercase mb-2">{t("step1Title")}</h4>
              <p className="text-xs text-gray-400 font-medium max-w-[180px] leading-relaxed">{t("step1Desc")}</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-full bg-[#141416] border border-white/5 flex items-center justify-center mb-6 shadow-inner hover:border-[#FF2300]/30 hover:shadow-[0_0_20px_rgba(255,35,0,0.1)] transition-all duration-300">
                <span className="text-2xl font-mono text-[#FF2300] font-extrabold">02</span>
              </div>
              <h4 className="text-lg font-bold uppercase mb-2">{t("step2Title")}</h4>
              <p className="text-xs text-gray-400 font-medium max-w-[180px] leading-relaxed">{t("step2Desc")}</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-full bg-[#141416] border border-white/5 flex items-center justify-center mb-6 shadow-inner hover:border-[#FF2300]/30 hover:shadow-[0_0_20px_rgba(255,35,0,0.1)] transition-all duration-300">
                <span className="text-2xl font-mono text-[#FF2300] font-extrabold">03</span>
              </div>
              <h4 className="text-lg font-bold uppercase mb-2">{t("step3Title")}</h4>
              <p className="text-xs text-gray-400 font-medium max-w-[180px] leading-relaxed">{t("step3Desc")}</p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-full bg-[#141416] border border-white/5 flex items-center justify-center mb-6 shadow-inner hover:border-[#FF2300]/30 hover:shadow-[0_0_20px_rgba(255,35,0,0.1)] transition-all duration-300">
                <span className="text-2xl font-mono text-[#FF2300] font-extrabold">04</span>
              </div>
              <h4 className="text-lg font-bold uppercase mb-2">{t("step4Title")}</h4>
              <p className="text-xs text-gray-400 font-medium max-w-[180px] leading-relaxed">{t("step4Desc")}</p>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-full bg-[#141416] border border-white/5 flex items-center justify-center mb-6 shadow-inner hover:border-[#FF2300]/30 hover:shadow-[0_0_20px_rgba(255,35,0,0.1)] transition-all duration-300">
                <span className="text-2xl font-mono text-[#FF2300] font-extrabold">05</span>
              </div>
              <h4 className="text-lg font-bold uppercase mb-2">{t("step5Title")}</h4>
              <p className="text-xs text-gray-400 font-medium max-w-[180px] leading-relaxed">{t("step5Desc")}</p>
            </div>

          </div>

        </div>
      </section>

      {/* ================= INTERACTIVE DIGITAL TOOLS (PACKAGING CALCULATOR PREVIEW) ================= */}
      <section id="digital-tools-section" className="py-16 bg-[#f0f2f5]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
            
            <div>
              <span className="text-[#FF2300] font-mono text-xs tracking-widest uppercase font-extrabold block mb-3">
                {t("calcTagline")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1a1c1d] uppercase mb-6">
                {t("calcTitle")}
              </h2>
              <p className="text-sm sm:text-base text-[#414753] leading-relaxed mb-8 font-medium">
                {t("calcDesc")}
              </p>

              {/* Instant Interactive Card Box */}
              <div className="soft-ui-card p-8 rounded-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  
                  {/* Length Input */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-mono tracking-wider font-extrabold text-[#727784] uppercase">
                        {t("lengthLabel")}
                      </label>
                      <span className="text-[11px] font-mono font-bold text-[#FF2300] bg-white/60 px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">{previewLength} mm</span>
                    </div>
                    <div className="soft-ui-card-inset rounded-full px-4 py-2.5 flex items-center mb-1">
                      <input 
                        type="number"
                        value={previewLength}
                        onChange={(e) => setPreviewLength(Math.max(1, parseInt(e.target.value) || 0))}
                        className="bg-transparent border-none focus:outline-none focus:ring-0 w-full text-sm font-mono font-bold text-[#1a1c1d]"
                        placeholder="200"
                        min="1"
                      />
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="600" 
                      step="5" 
                      value={previewLength}
                      onChange={(e) => setPreviewLength(parseInt(e.target.value))}
                      className="neu-slider px-1"
                    />
                  </div>

                  {/* Width Input */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-mono tracking-wider font-extrabold text-[#727784] uppercase">
                        {t("widthLabel")}
                      </label>
                      <span className="text-[11px] font-mono font-bold text-[#FF2300] bg-white/60 px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">{previewWidth} mm</span>
                    </div>
                    <div className="soft-ui-card-inset rounded-full px-4 py-2.5 flex items-center mb-1">
                      <input 
                        type="number"
                        value={previewWidth}
                        onChange={(e) => setPreviewWidth(Math.max(1, parseInt(e.target.value) || 0))}
                        className="bg-transparent border-none focus:outline-none focus:ring-0 w-full text-sm font-mono font-bold text-[#1a1c1d]"
                        placeholder="150"
                        min="1"
                      />
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="600" 
                      step="5" 
                      value={previewWidth}
                      onChange={(e) => setPreviewWidth(parseInt(e.target.value))}
                      className="neu-slider px-1"
                    />
                  </div>

                </div>

                {/* Estimate Render Price container */}
                <div className="flex justify-between items-center p-5 bg-[#FF2300] text-white rounded-full soft-ui-button-primary">
                  <span className="font-bold text-xs tracking-wider uppercase ml-3">{t("estPriceLabel")}</span>
                  <span className="text-2xl font-mono font-extrabold mr-3">${calculatedUnitPrice}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleConfigureCategory("boxes")}
                  className="w-full mt-4 py-4 text-xs font-bold uppercase tracking-widest rounded-full soft-ui-button text-[#1a1c1d] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MousePointerClick size={15} />
                  <span>{locale === "hy" ? "ԲԱՑԵԼ ԱՄԲՈՂՋԱԿԱՆ ԿԱԼԿՈՒԼՅԱՏՈՐԸ" : locale === "ru" ? "ОТКРЫТЬ ПОЛНЫЙ КАЛЬКУЛЯТОР" : "LAUNCH FULL WORKSPACE"}</span>
                </button>
              </div>
            </div>

            {/* Geometric Vector Mockup with rotating hover state */}
            <div className="relative h-[480px] rounded-3xl overflow-hidden soft-ui-card p-4 flex items-center justify-center">
              <div className="w-full h-full bg-[#f0f2f5] rounded-2xl flex flex-col items-center justify-center shadow-inner relative group p-6">
                
                {/* Embedded Interactive 3D Mockup vector */}
                <svg className="w-48 h-48 text-[#FF2300] transition-transform duration-700 group-hover:rotate-12 stroke-[0.75]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>

                <div className="mt-8 text-center">
                  <span className="text-[10px] font-mono tracking-widest text-[#727784] uppercase block mb-1">Interactive Blueprint Representation</span>
                  <span className="text-xs font-mono font-bold text-[#1a1c1d]">
                    {previewLength} × {previewWidth} × 100 mm (Calibrated)
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 bg-white/75 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-gray-100 text-[9px] font-mono font-extrabold text-[#727784]">
                  CAD CALIBRATED SYSTEM
                </div>
              </div>
            </div>

          </div>

          {/* Symmetrical digital features rows */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 text-left">
            
            {/* Feature 1: AI Consultant */}
            <div 
              onClick={() => {
                setCurrentView("ai-chat");
                window.history.pushState({}, "", "/chat");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="soft-ui-card p-8 rounded-3xl flex flex-col gap-4 group hover:scale-[1.015] transition-transform duration-300 cursor-pointer border-t-2 border-t-[#FF2300]/20"
            >
              <div className="w-12 h-12 bg-[#FF2300] rounded-full flex items-center justify-center text-white soft-ui-button-primary shrink-0">
                <Sparkles size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#1a1c1d] uppercase mt-2">{t("aiTitle")}</h3>
              <p className="text-xs text-[#414753] font-medium leading-relaxed">{t("aiDesc")}</p>
            </div>

            {/* Feature 2: Order Tracking */}
            <div 
              onClick={() => {
                setCurrentView("track");
                if (setIsInTrackPortal) setIsInTrackPortal(true);
                window.history.pushState({}, "", "/track-order");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="soft-ui-card p-8 rounded-3xl flex flex-col gap-4 group hover:scale-[1.015] transition-transform duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 bg-[#f0f2f5] rounded-full flex items-center justify-center text-[#FF2300] soft-ui-card-inset shrink-0">
                <Activity size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#1a1c1d] uppercase mt-2">{t("trackingTitle")}</h3>
              <p className="text-xs text-[#414753] font-medium leading-relaxed">{t("trackingDesc")}</p>
            </div>

            {/* Feature 3: Client Portal / Catalogue */}
            <div 
              onClick={() => {
                setCurrentView("ecommerce");
                window.history.pushState({}, "", "/catalog");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="soft-ui-card p-8 rounded-3xl flex flex-col gap-4 group hover:scale-[1.015] transition-transform duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 bg-[#f0f2f5] rounded-full flex items-center justify-center text-[#FF2300] soft-ui-card-inset shrink-0">
                <Settings size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#1a1c1d] uppercase mt-2">{t("dashboardTitle")}</h3>
              <p className="text-xs text-[#414753] font-medium leading-relaxed">{t("dashboardDesc")}</p>
            </div>

          </div>

        </div>
      </section>

      {/* ================= PROJECT BENTO SHOWCASE GALLERY ================= */}
      <section id="project-showcase-section" className="py-16 bg-[#f0f2f5]">
        <div className="max-w-[1280px] mx-auto px-6">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#1a1c1d] uppercase">{t("showcaseTitle")}</h2>
            <p className="text-sm sm:text-base text-[#414753] mt-2 font-medium">{t("showcaseSubtitle")}</p>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            
            <div className="soft-ui-card p-3 rounded-3xl break-inside-avoid">
              <img 
                className="w-full rounded-2xl shadow-inner hover:opacity-90 transition-opacity" 
                alt="Smartphone packaging design mockup" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_sCz3WgHChwC5TF4_4AE1Rc_nPQ_VzUsZ0kmy7qdpjFgm2TAnv_t3oG3hqHdzFnWgYHJOlTckuGP94lnIrpfUtkpuh0edVViQ0hLDrMlVcUvyeqaOnrN_TVKvWgHjiaXu-QF3cYeZ0cWo21pW3Jjmf092S8JT9xqIVBNWEtgdHvIzqVlKIxMk_JvO9Q829ForEZtc-q4EWLFIjT5zcUmS7ZeqK9lHHNwbBLbA6vPfDsZ4D8xiHJlM6G9lEy6uEoRVrKg2AG8utsR5"
              />
            </div>

            <div className="soft-ui-card p-3 rounded-3xl break-inside-avoid">
              <img 
                className="w-full rounded-2xl shadow-inner hover:opacity-90 transition-opacity" 
                alt="Coffee packaging design mockup" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWfQzqTbjF4eKaXHQzKBVy28xluar4bWzVO03a1dtiofnuOuEWNnEhqfD3TF47TvTWIWXs_qwQfKjsYYfrZuj-BnL5nJeDMtHms1BYW_5UlJjAl6tDAYfpuKQstiTdxfMl-Xo3iWXvLVAvc1Se02DTH-bz6RGQjdasNYHlnwIpGvUy0ogTeH9t3OUQDQIJGWYiXcGvfETsekgLqfXb7Lh22_RFELyS3UY9M6m3I2XDLgbdvq4h13xVCz4mmSydAIDyrz25IfWyi_R1"
              />
            </div>

            <div className="soft-ui-card p-3 rounded-3xl break-inside-avoid">
              <img 
                className="w-full rounded-2xl shadow-inner hover:opacity-90 transition-opacity" 
                alt="Luxury boxes presentation mockup" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWUXBJQKn6gJG5QPWBnQCXH2TBJjt9ptJP8yRGi51rxeeby3-6a63Mq9n6N8dW5MFKsjSJrZFJFrJ6uhwcdx8NYxrlJSZlItxMOUVSRH8k5yp08MfnwMdkWSwucZ_2br_BqwSlr5OeJJE5OY236d45ErN-yS1olcPUT-V2RjMEpjrQHjV5627vXkdK8zPmQjx1vXNXLNDdJjsqIK6Fjq4Ek9xGKAbfWclIeyl9uDs7kVKHxeL76WguMoD1lLmDx3g9DuGe4zAkhvl7"
              />
            </div>

            <div className="soft-ui-card p-3 rounded-3xl break-inside-avoid">
              <img 
                className="w-full rounded-2xl shadow-inner hover:opacity-90 transition-opacity" 
                alt="Fashion brand bag packaging mockup" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBch8bW1o3d2T8OZwp60ktNFizE0WS79RdZZSQL2oZ8ujbn-hdY3tpb5pYwnGxsV-hSTJzAp11PkJRH2gmupp1NmWa4rCgynCsFt5eY5v_Vd-mB88VhRrZCKXJTKYobzR4DfxcbjTdg-alvQvmi8U5E99Kx-nt-eKHnA471BsqUHgFxWLY8ORLFRq8tpjn7bRw93EuPFGkneB59vlgnhkwbDheQZxNaqIFHjMKvb-aIOtVhbsyZnNMiWxH67m_-7CyZgyLjz2b0Qldl"
              />
            </div>

            <div className="soft-ui-card p-3 rounded-3xl break-inside-avoid">
              <img 
                className="w-full rounded-2xl shadow-inner hover:opacity-90 transition-opacity" 
                alt="Cosmetic jar boxes and tubes packaging mockup" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuinhnZ4dlLDtd3BHbDG6K4znQLvaQ2k6-kOt0Jg8gzsF_C-6z5cJUQDePSnnDYJ6MD4muyZqI88TKpYZciFr7x-M_LAQl4yACyNy8SyvQyAszu1qebCAfIhodPb04P88kdK9OHxVaSCmdOaSEaDKkjSsP-g3N04CoW_zvu-_nWiV-vuo0A5adLAVeRHf-ZxcHB8IvFV3zAV18KwuBfAyrfLpzXC7BSTSUZ2AGlk6xkF_uMfkOf1LzeBXOqCUpIs5JmFj0WGSFXzkV"
              />
            </div>

            <div className="soft-ui-card p-3 rounded-3xl break-inside-avoid">
              <img 
                className="w-full rounded-2xl shadow-inner hover:opacity-90 transition-opacity" 
                alt="Bespoke luxury chocolate wrapper mockup" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRgBdtN8rCr_nvRsjC1FV8tuqnWjwoFXFNbxodBoyaQQjaj39rwe-vmTWWPQ1SY6hovcLQqI4JG48Xc9hEWOVpQrdkBhhkqMWy2rqdZ2NNzKQAfufXzm1DQlQTW_PmUm4-FxNEE7-j7qMz6sJ6TS-K0BDHF5xgxnxD3K1-psd6QPuav1KA2lorkzERril28o2hqT_zj2AknFmD5xIwg_ZRAhSit_CBIoco_Rhas5klR7MkK1-LSWQbDmFDH6t24XHVDukc4DFza1tS"
              />
            </div>

          </div>

        </div>
      </section>

      {/* ================= INTEGRATED AI CO-DESIGNER CHAT WRAPPER ================= */}
      <section className="py-16 bg-[#010120] text-white select-none relative overflow-hidden">
        <div className="absolute inset-0 bg-[#FF2300]/5 opacity-10 blur-3xl pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-6 relative z-10 text-left">
          
          <div className="w-full h-px bg-white/10 mb-12 flex justify-between text-[9px] font-mono text-white/30">
            <span>CO-DESIGN PROCESS</span>
            <span>AI INTELLIGENCE SUITE</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6">
              <span className="text-[#FF2300] font-mono text-xs tracking-[0.2em] font-extrabold uppercase block mb-3">
                INTELLIGENT SUITE
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase leading-tight mb-6">
                {locale === "hy" ? "Արհեստական Բանականություն" : locale === "ru" ? "Искусственный Интеллект" : "AI Interactive Co-Designer"}
              </h2>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-xl mb-8">
                {locale === "hy" 
                  ? "Զրուցեք մեր AI օգնականի հետ՝ նյութերի լավագույն տարբերակներն ընտրելու, էկո-մակարդակները հաշվելու և ձեր բրենդի համար կատարյալ դիզայն ստանալու համար:"
                  : locale === "ru" 
                  ? "Общайтесь с нашим AI консультантом для моментального подбора материалов, расчета уровня экологичности и получения экспертных советов по дизайну."
                  : "Chat live with our built-in packaging AI assistant to instantly find ideal materials, check structural safety, verify sustainability ratings, and request customized samples."}
              </p>

              {/* Launcher link */}
              <div className="flex items-center gap-4">
                <div 
                  onClick={() => {
                    setCurrentView("ai-chat");
                    window.history.pushState({}, "", "/chat");
                  }}
                  className="w-12 h-12 bg-[#FF2300] text-white hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center rounded-2xl shadow-lg"
                >
                  <MessageSquare size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-white/40 block">CONVERSATIONAL EXPERT</span>
                  <span 
                    onClick={() => {
                      setCurrentView("ai-chat");
                      window.history.pushState({}, "", "/chat");
                    }}
                    className="text-xs text-white font-mono font-bold hover:text-[#FF2300] transition-colors cursor-pointer"
                  >
                    {locale === "hy" ? "ԲԱՑԵԼ AI ԶՐՈՒՅՑԸ ➔" : locale === "ru" ? "ОТКРЫТЬ ЧАТ С ИИ ➔" : "LAUNCH FULL AI CHAT WINDOW ➔"}
                  </span>
                </div>
              </div>
            </div>

            {/* Embedded Live Copilot Widget */}
            <div className="lg:col-span-6 bg-white/5 rounded-3xl p-6 border border-white/10 relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 bg-[#FF2300] text-white text-[8px] font-mono font-bold px-4 py-1 tracking-widest uppercase rounded-bl-xl shadow-md">
                Co-Designer Online
              </div>
              <AIAgentBlock locale={locale as any} />
            </div>

          </div>

        </div>
      </section>

      {/* ================= OTHERS ALSO BOUGHT / FEATURED ITEMS SECTION ================= */}
      {featuredProducts && featuredProducts.filter(fp => fp.active).length > 0 && (
        <section className="py-16 bg-[#f0f2f5]">
          <div className="max-w-[1280px] mx-auto px-6">
            
            <div className="w-full h-px bg-gray-300/60 mb-12 flex justify-between text-[9px] font-mono text-gray-500">
              <span>DISCOVER MORE</span>
              <span>POPULAR COMBINATIONS</span>
            </div>

            <h2 className="text-3xl font-extrabold text-[#1a1c1d] tracking-tight text-center uppercase mb-12">
              {locale === "hy" 
                ? "ՍԱ ՆՈՒՅՆՊԵՍ ՁԵՌՆՏՈՒ Է" 
                : locale === "ru" 
                ? "С этим товаром также покупают" 
                : "OTHERS ALSO BOUGHT"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.filter(fp => fp.active).map((fp) => {
                const prodName = locale === "hy" ? fp.nameHy : locale === "ru" ? fp.nameRu : fp.nameEn;
                const minQtyText = locale === "hy" ? fp.minQtyTextHy : locale === "ru" ? fp.minQtyTextRu : fp.minQtyTextEn;
                const tagText = locale === "hy" ? fp.tagHy : locale === "ru" ? fp.tagRu : fp.tagEn;

                return (
                  <div 
                    key={fp.id}
                    onClick={() => {
                      setActiveCategory(fp.categoryId);
                      setCalcResult(null);
                      setCurrentView("calculator");
                      window.history.pushState({}, "", "/calculator");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="soft-ui-card hover:border-[#FF2300]/20 rounded-3xl p-6 flex flex-col justify-between min-h-[440px] cursor-pointer transition-all duration-300 relative group"
                  >
                    <div className="text-left">
                      {tagText && (
                        <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-white bg-[#FF2300] px-3 py-1 rounded-full inline-block mb-4 shadow-sm">
                          {tagText}
                        </span>
                      )}
                      
                      <h4 className="text-lg font-bold text-[#1a1c1d] uppercase tracking-tight mb-2 leading-none">
                        {prodName}
                      </h4>
                      
                      <p className="text-xs text-[#414753] font-medium leading-relaxed mb-6">
                        {locale === "hy" 
                          ? `Բարձրակարգ բրենդավորում հատուկ չափսերով։ ${minQtyText}` 
                          : locale === "ru" 
                          ? `Премиальное брендирование по Вашим размерам. ${minQtyText}` 
                          : `Premium branding tailored to your dimensions. ${minQtyText}`}
                      </p>
                    </div>

                    <div>
                      {/* Product preview image inside inset card */}
                      <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#f0f2f5] p-2 mb-6 shadow-inner">
                        <img 
                          src={fp.image || "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400"} 
                          alt={prodName} 
                          className="w-full h-full object-cover rounded-xl group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      </div>

                      {/* CTA configuring trigger */}
                      <div className="w-full bg-[#1a1c1d] group-hover:bg-[#FF2300] text-white py-3 rounded-full text-[10px] font-mono font-black uppercase tracking-wider text-center transition-colors shadow-md">
                        {locale === "hy" ? "ԿԱՐԳԱՎՈՐԵԼ" : locale === "ru" ? "НАСТРОИТЬ" : "CONFIGURE NOW"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* ================= DYNAMIC CTA SECTION (Soft UI High-Impact Red Card) ================= */}
      <section className="py-16 bg-[#f0f2f5] relative">
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          
          <div className="soft-ui-card bg-[#FF2300] text-white p-12 md:p-20 rounded-[3rem] text-center shadow-2xl border border-white/20 relative overflow-hidden">
            
            {/* Symmetrical line geometry in background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <svg className="w-[450px] h-[450px] stroke-white stroke-[1]" fill="none" viewBox="0 0 500 500">
                <circle cx="250" cy="250" r="210" strokeDasharray="4 8" />
                <circle cx="250" cy="250" r="140" />
              </svg>
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase mb-6 leading-none text-white">
                {t("ctaTitle")}
              </h2>
              
              <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                {t("ctaDesc")}
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  type="button"
                  onClick={() => handleConfigureCategory("boxes")}
                  className="px-10 py-5 bg-white text-[#FF2300] hover:bg-white/95 text-sm font-bold uppercase tracking-wider rounded-full shadow-lg transition-transform hover:scale-105 active:scale-98 cursor-pointer border-none"
                >
                  {t("ctaStart")}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setSamplesRequested(true);
                    setTimeout(() => setSamplesRequested(false), 5000);
                  }}
                  className="px-10 py-5 bg-transparent border-2 border-white text-white hover:bg-white/10 text-sm font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer"
                >
                  {samplesRequested ? (locale === "hy" ? "Հարցումն Ուղարկված է" : locale === "ru" ? "Запрос Отправлен!" : "Request Sent!") : t("ctaSamples")}
                </button>
              </div>

              {samplesRequested && (
                <div className="mt-6 text-xs font-mono bg-white/20 max-w-md mx-auto py-2.5 px-4 rounded-xl border border-white/10 animate-pulse">
                  {locale === "hy" 
                    ? "✓ Նմուշների հարցումը ստացված է: Մենք շուտով կառաքենք ձեր հասցեով:" 
                    : locale === "ru" 
                    ? "✓ Запрос на образцы получен! Мы отправим их на ваш адрес в ближайшее время." 
                    : "✓ Samples pack request has been received! We will ship it to your address shortly."}
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
