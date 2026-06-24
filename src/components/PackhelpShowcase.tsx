import React, { useState } from "react";
import { 
  Check, 
  ChevronRight, 
  ShieldCheck, 
  Warehouse, 
  FileCheck 
} from "lucide-react";

interface PackhelpShowcaseProps {
  locale: "hy" | "ru" | "en";
  setCurrentView: (view: "home" | "calculator" | "track" | "ecommerce") => void;
  setActiveCategory: (catId: string) => void;
  setIsInTrackPortal?: (isIn: boolean) => void;
}

type TabType = "products" | "design" | "ordering" | "warehousing" | "pay_as_you_want";

export default function PackhelpShowcase({ locale, setCurrentView, setActiveCategory, setIsInTrackPortal }: PackhelpShowcaseProps) {
  const [activeTab, setActiveTab] = useState<TabType>("products");

  // Multi-lingual Translation Dictionary
  const translations: Record<string, Record<"en" | "ru" | "hy", string>> = {
    sectionTitle: {
      en: "Capsule Lab OS Overview",
      ru: "Обзор Capsule Lab Operating System",
      hy: "Capsule Lab OS Համակարգի Ակնարկ"
    },
    tabProducts: {
      en: "Packaging Solutions",
      ru: "Решения для упаковки",
      hy: "Փաթեթավորման Լուծումներ"
    },
    tabDesign: {
      en: "AI & Design",
      ru: "AI и Дизайн",
      hy: "AI & Դիզայն"
    },
    tabOrdering: {
      en: "Calculation & Ordering",
      ru: "Расчет и Заказ",
      hy: "Հաշվարկ և Պատվեր"
    },
    tabWarehousing: {
      en: "Warehousing",
      ru: "Склад и Хранение",
      hy: "Պահեստավորում"
    },
    tabPayments: {
      en: "Financial Solutions",
      ru: "Финансовые решения",
      hy: "Ֆինանսական Լուծումներ"
    },
    catalogueTitle: {
      en: "Products & Collections",
      ru: "Продукты и Коллекции",
      hy: "Ապրանքներ"
    },
    catalogueDesc: {
      en: "Select boxes, bags, and custom packaging solutions for any business category.",
      ru: "Выбирайте коробки, пакеты и индивидуальные упаковочные решения для любого бизнеса.",
      hy: "Ընտրեք տուփեր, տոպրակներ և անհատական փաթեթավորման լուծումներ ցանկացած բիզնեսի համար։"
    },
    customSizingTitle: {
      en: "Precise Size Calculation",
      ru: "Точный расчет размеров",
      hy: "Ճշգրիտ Չափսերի Հաշվարկ"
    },
    customSizingDesc: {
      en: "Input parameters to instantly generate the optimal construction blueprint and price estimate.",
      ru: "Введите размеры и мгновенно получите оптимальную конструкцию и смету стоимости.",
      hy: "Մուտքագրեք չափերը և անմիջապես ստացեք օպտիմալ կոնստրուկցիա և հաշվարկ։"
    },
    tailorMadeTitle: {
      en: "Custom Tailored Orders",
      ru: "Индивидуальные заказы",
      hy: "Անհատական Պատվերներ"
    },
    tailorMadeDesc: {
      en: "Design unique physical packaging matches precisely to your product dimensions and branding.",
      ru: "Создавайте уникальную упаковку в полном соответствии с требованиями вашего продукта и бренда.",
      hy: "Ստեղծեք յուրահատուկ փաթեթավորում՝ ձեր ապրանքի և բրենդի պահանջներին համապատասխան։"
    },
    supplierVettingTitle: {
      en: "Smart Manufacturing Network",
      ru: "Умная сеть производства",
      hy: "Խելացի Արտադրական Ցանց"
    },
    supplierVettingDesc: {
      en: "Collaborate seamlessly with vetted and checked manufacturers within a single integrated platform.",
      ru: "Работайте с проверенными сертифицированными производителями на единой цифровой платформе.",
      hy: "Աշխատեք ստուգված արտադրողների հետ մեկ միասնական հարթակում։"
    },
    designCreatorTitle: {
      en: "AI Assistant Adviser",
      ru: "AI Ассистент-консультант",
      hy: "AI Օգնական"
    },
    designCreatorDesc: {
      en: "Get instant recommendations on materials, sizes, printing types, and manufacturing layouts.",
      ru: "Получайте моментальные рекомендации по материалам, размерам, методам печати и производству.",
      hy: "Ստացեք առաջարկություններ նյութերի, չափսերի, տպագրության և արտադրության վերաբերյալ։"
    },
    readyTemplatesTitle: {
      en: "Design Templates",
      ru: "Шаблоны дизайна",
      hy: "Դիզայնի Շաբլոններ"
    },
    readyTemplatesDesc: {
      en: "Utilize professional ready-to-use compositions or initiate a completely custom design layout from scratch.",
      ru: "Используйте готовые проверенные решения или создавайте дизайн с чистого листа.",
      hy: "Օգտագործեք պատրաստի լուծումներ կամ ստեղծեք դիզայն զրոյից։"
    },
    expertProofingTitle: {
      en: "Pre-press File Proofing",
      ru: "Проверка печатных файлов",
      hy: "Տպագրական Ֆայլերի Ստուգում"
    },
    expertProofingDesc: {
      en: "Our automated algorithms and prepress engineers verify all files prior to launch.",
      ru: "Интеллектуальная система и эксперты досконально проверяют макеты до запуска в цех.",
      hy: "Համակարգը և մասնագետները ստուգում են ֆայլերը մինչև արտադրություն։"
    },
    bleedCalibrationTitle: {
      en: "3D Visualization",
      ru: "3D Визуализация",
      hy: "3D Նախագծում"
    },
    bleedCalibrationDesc: {
      en: "Preview your customized packaging in an interactive 3D model prior to committing to production.",
      ru: "Изучите свою упаковку в интерактивной 3D-среде перед подтверждением запуска тиража.",
      hy: "Դիտեք ձեր փաթեթավորումը 3D միջավայրում նախքան պատվեր հաստատելը։"
    },
    lowMinimumsTitle: {
      en: "Instant Cost Estimation",
      ru: "Мгновенный расчет цены",
      hy: "Ակնթարթային Գնային Հաշվարկ"
    },
    lowMinimumsDesc: {
      en: "Retrieve real quotes instantly in seconds without waiting for manual commercial proposals.",
      ru: "Узнайте стоимость за пару секунд, минуя долгое ожидание коммерческих предложений.",
      hy: "Ստացեք գինը մի քանի վայրկյանում՝ առանց սպասելու առաջարկի։"
    },
    highWholesaleTitle: {
      en: "Volumetric Scaling Discounts",
      ru: "Оптовые скидки на объем",
      hy: "Ծավալային Զեղչեր"
    },
    highWholesaleDesc: {
      en: "The platform dynamically scales and optimizes unit prices based on quantity thresholds.",
      ru: "Алгоритмы платформы автоматически рассчитывают наилучшую цену за единицу при росте тиража.",
      hy: "Համակարգը ավտոմատ հաշվարկում է լավագույն գինը ըստ քանակի։"
    },
    expressQueueTitle: {
      en: "Rapid Turnaround",
      ru: "Быстрое производство",
      hy: "Արագ Արտադրություն"
    },
    expressQueueDesc: {
      en: "Plan and queue printing lines. Track absolute lead times and shipment dates in real time.",
      ru: "Планируйте производственные циклы и отслеживайте точные сроки готовности в реальном времени.",
      hy: "Պլանավորեք արտադրությունը և տեսեք ժամկետները իրական ժամանակում։"
    },
    prepressControlTitle: {
      en: "Order Lifecycle Control",
      ru: "Управление заказами CRM",
      hy: "Պատվերի Կառավարում"
    },
    prepressControlDesc: {
      en: "Monitor stages of pre-press, printing, post-processing, and dispatch in one comprehensive dashboard.",
      ru: "Отслеживайте весь жизненный цикл заказа и логистических отправлений из единого личного кабинета.",
      hy: "Հետևեք պատվերի ամբողջ ընթացքին մեկ վահանակից։"
    },
    virtualStorageTitle: {
      en: "Warehouse Inventory Management",
      ru: "Управление складскими запасами",
      hy: "Պահեստային Մնացորդների Կառավարում"
    },
    virtualStorageDesc: {
      en: "Monitor physical stock reserves, forecast consumption trends, and control inventory movements.",
      ru: "Контролируйте доступные остатки на складах и управляйте движением готовой продукции.",
      hy: "Տեսեք հասանելի քանակները և վերահսկեք պահեստի շարժը։"
    },
    splitDispatchesTitle: {
      en: "Bulk Volume Optimization",
      ru: "Оптимизация крупных тиражей",
      hy: "Մեծ Ծավալների Օպտիմալացում"
    },
    splitDispatchesDesc: {
      en: "Maximize production efficiencies to drastically reduce per-unit manufacturing expenses.",
      ru: "Оптимизируйте промышленную загрузку, существенно снижая себестоимость каждой коробки.",
      hy: "Արտադրեք ավելի շատ և նվազեցրեք մեկ միավորի ինքնարժեքը։"
    },
    climateGuardTitle: {
      en: "On-demand Phased Deliveries",
      ru: "Поэтапные отгрузки по запросу",
      hy: "Փուլային Առաքումներ"
    },
    climateGuardDesc: {
      en: "Request delivery dispatching as required without overcrowding your physical business premises.",
      ru: "Получайте партии упаковки ровно тогда, когда они нужны, не перегружая свои склады.",
      hy: "Ստացեք արտադրանքը անհրաժեշտ պահին՝ առանց լրացուցիչ պահեստավորման խնդիրների։"
    },
    automatedRefillTitle: {
      en: "Smart Supply Continuity",
      ru: "Автоматическое пополнение",
      hy: "Անխափան Մատակարարում"
    },
    automatedRefillDesc: {
      en: "Smart limits automatically prompt replenishment dispatches to ensure uncompromised business flow.",
      ru: "Интеллектуальные триггеры напоминают о допечатке упаковки до критического снижения запасов.",
      hy: "Խելացի համակարգը ավտոմատ կերպով առաջարկում է լրացնել պաշարները մինչև դրանց սպառվելը։"
    },
    zeroInterestTitle: {
      en: "Deferred Payments Model",
      ru: "Отсрочка платежа",
      hy: "Հետաձգված Վճարումներ"
    },
    zeroInterestDesc: {
      en: "Preserve valuable circulating assets with our secure interest-free payment schemes.",
      ru: "Заказывайте упаковку сейчас, а оплачивайте потом по гибким беспроцентным схемам.",
      hy: "Պատվիրեք հիմա, վճարեք ավելի ուշ։"
    },
    payOnDischargeTitle: {
      en: "Pay-on-Use Fiscal Model",
      ru: "Оплата за использование",
      hy: "Վճարում Օգտագործման Համար"
    },
    payOnDischargeDesc: {
      en: "An agile billing method engineered to adapt dynamically to your active sales turnover.",
      ru: "Современная модель оплаты, которая идеально подстраивается под обороты вашего бизнеса.",
      hy: "Վճարային մոդել, որը հարմարեցվում է ձեր բիզնեսի շրջանառությանը։"
    },
    transparentPricingTitle: {
      en: "Transparent Pricing",
      ru: "Прозрачное ценообразование",
      hy: "Թափանցիկ Գներ"
    },
    transparentPricingDesc: {
      en: "No hidden setup costs, machine preparation charges, or unexpected tooling overheads.",
      ru: "Никаких скрытых плат, сборов за наладку станков или непредвиденных накладных расходов.",
      hy: "Բացարձակապես զրոյական լրացուցիչ վճարներ կամ չնախատեսված ծախսեր։"
    },
    dynamicInvoicesTitle: {
      en: "Interactive Ledger",
      ru: "Интерактивная бухгалтерия",
      hy: "Ինտերակտիվ Բիլլինգ"
    },
    dynamicInvoicesDesc: {
      en: "Download and synchronize accounting documents instantly with your business management software.",
      ru: "Выгружайте все закрывающие и налоговые документы автоматически для вашей бухгалтерии.",
      hy: "Ավտոմատացված հաշիվների ներկայացում և բիլլինգի համակարգում ձեր հաշվապահության համար։"
    },
    shopCatalog: {
      en: "Shop catalog",
      ru: "В каталог",
      hy: "Դիտել խանութը"
    },
    requestOffer: {
      en: "Request offer",
      ru: "Запросить цену",
      hy: "Հարցում ուղարկել"
    },
    sendBatch: {
      en: "Send my order",
      ru: "Отгрузить партию",
      hy: "Առաքել պատվերը"
    },
    blueBlockTitle: {
      hy: "Փաթեթավորման նախագծում, հաշվարկ և արտադրություն՝ մեկ հարթակում",
      ru: "Проектирование, расчет и производство упаковки — на одной платформе",
      en: "Packaging design, calculation & production in one platform"
    },
    blueBlockSubtitle: {
      hy: "Capsule Lab-ը միավորում է AI օգնականը, օնլայն հաշվարկիչը, 3D նախագծումը և արտադրության կառավարումը մեկ համակարգում։",
      ru: "Capsule Lab объединяет AI-ассистента, онлайн-калькулятор, 3D-проектирование и управление производством в единую систему.",
      en: "Capsule Lab integrates an AI assistant, online calculator, 3D modeling, and production management into one system."
    },
    blueBlockBullet1: {
      hy: "✓ AI փաթեթավորման օգնական",
      ru: "✓ AI-ассистент упаковки",
      en: "✓ AI Packaging Assistant"
    },
    blueBlockBullet2: {
      hy: "✓ Ակնթարթային գնի հաշվարկ",
      ru: "✓ Мгновенный расчет стоимости",
      en: "✓ Instant Cost Calculation"
    },
    blueBlockBullet3: {
      hy: "✓ 3D նախադիտում իրական ժամանակում",
      ru: "✓ 3D-предпросмотр в реальном времени",
      en: "✓ Real-time 3D Preview"
    },
    blueBlockBullet4: {
      hy: "✓ Պատվերների և արտադրության կառավարում",
      ru: "✓ Управление заказами и производством",
      en: "✓ Order & Production Management"
    },
    blueBlockBtn: {
      hy: "Սկսել հաշվարկը",
      ru: "Начать расчет",
      en: "Start Calculation"
    },
    blueBlockSliderLabel: {
      hy: "AI ՉԱՓՍԵՐԻ ԿԱՐԳԱՎՈՐՈՒՄ",
      ru: "AI НАСТРОЙКА РАЗМЕРОВ",
      en: "AI DIMENSION CONTROL"
    }
  };

  const t = (key: string): string => {
    return translations[key]?.[locale] || translations[key]?.["en"] || "";
  };

  // Neumorphic Configuration of the Cards inside the Grid by Tab
  const tabCards: Record<TabType, {
    titleKey: string;
    descKey: string;
    render: () => React.ReactNode;
  }[]> = {
    products: [
      {
        titleKey: "catalogueTitle",
        descKey: "catalogueDesc",
        render: () => (
          <div className="grid grid-cols-4 gap-3.5 w-full max-w-[420px]">
            {[
              { id: "boxes", label: { en: "Boxes", ru: "Коробки", hy: "Տուփեր" }, img: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=150" },
              { id: "bags", label: { en: "Bags", ru: "Пакеты", hy: "Պայուսակներ" }, img: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=150" },
              { id: "stickers", label: { en: "Stickers", ru: "Стикеры", hy: "Պիտակներ" }, img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=150" },
              { id: "ribbons", label: { en: "Ribbons", ru: "Ленты", hy: "Ժապավեններ" }, img: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=150" }
            ].map((th) => (
              <div 
                key={th.id}
                onClick={() => { setActiveCategory(th.id); setCurrentView("calculator"); }}
                className="group bg-[#f0f2f5] rounded-2xl p-2 flex flex-col justify-between items-center aspect-[5/6] cursor-pointer shadow-[4px_4px_8px_rgba(180,175,166,0.45),_-4px_-4px_8px_rgba(255,255,255,1)] hover:shadow-[inset_2px_2px_4px_rgba(180,175,166,0.55),_inset_-2px_-2px_4px_rgba(255,255,255,1)] transition-all duration-200 border border-[#E3DFD7]/20"
              >
                <div className="w-full flex-1 flex items-center justify-center bg-[#f0f2f5] shadow-[inset_2px_2px_4px_rgba(180,175,166,0.5),_inset_-2px_-2px_4px_rgba(255,255,255,1)] rounded-xl overflow-hidden p-1.5">
                  <img src={th.img} alt={th.label.en} className="max-h-[44px] max-w-full object-contain group-hover:scale-105 transition-transform" />
                </div>
                <span className="text-[10px] font-bold text-[#1a1c1d] tracking-tight mt-1.5 block truncate max-w-full">
                  {th.label[locale] || th.label.en}
                </span>
              </div>
            ))}
          </div>
        )
      },
      {
        titleKey: "customSizingTitle",
        descKey: "customSizingDesc",
        render: () => (
          <div className="flex items-center justify-center gap-8 w-full max-w-[360px] bg-transparent">
            <div className="flex flex-col gap-2 shrink-0">
              {[
                { val: "12", label: "cm" },
                { val: "14", label: "cm" },
                { val: "8", label: "cm" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-stretch rounded-xl shadow-[inset_3px_3px_6px_rgba(180,175,166,0.55),_inset_-3px_-3px_6px_rgba(255,255,255,1)] bg-[#f0f2f5] overflow-hidden text-sm h-10 w-24">
                  <span className="flex-1 flex items-center justify-center font-bold text-[#1a1c1d] font-mono select-none bg-transparent">{item.val}</span>
                  <span className="w-10 bg-[#f0f2f5] border-l border-[#E3DFD7]/40 flex items-center justify-center text-xs font-mono text-[#1a1c1d]/50 font-bold">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="w-36 h-28 relative flex items-center justify-center shrink-0 bg-[#f0f2f5] shadow-[inset_3px_3px_6px_rgba(180,175,166,0.45),_inset_-3px_-3px_6px_rgba(255,255,255,1)] rounded-2xl p-2 border border-[#E3DFD7]/20">
              <svg viewBox="0 0 100 80" className="w-full h-full stroke-[#ff2300] stroke-[1.8] fill-none stroke-linejoin-round stroke-linecap-round">
                <path d="M 20,40 L 50,55 L 90,32 L 60,18 Z" className="stroke-[#1a1c1d]/50 stroke-[1.5]" />
                <path d="M 20,40 L 20,58 L 50,72 L 50,55" />
                <path d="M 50,72 L 90,49 L 90,32" />
                <path d="M 20,50 L 50,64 L 90,41" className="stroke-[#ff2300]/50 stroke-[1.2]" />
              </svg>
            </div>
          </div>
        )
      },
      {
        titleKey: "tailorMadeTitle",
        descKey: "tailorMadeDesc",
        render: () => (
          <div className="flex flex-col items-center w-full">
            <div className="w-full max-w-[280px] aspect-[16/9] rounded-2xl overflow-hidden bg-[#f0f2f5] p-2 shadow-[6px_6px_12px_rgba(180,175,166,0.5),_-6px_-6px_12px_rgba(255,255,255,1)] mb-4 border border-[#E3DFD7]/20">
              <img 
                src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400" 
                alt="Symmetric tailored box illustration" 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <button 
              type="button" 
              onClick={() => { setActiveCategory("custom_box"); setCurrentView("calculator"); }}
              className="text-[11px] font-bold text-[#ff2300] bg-[#f0f2f5] py-2 px-5 rounded-full inline-flex items-center gap-1.5 shadow-[3px_3px_6px_rgba(180,175,166,0.45),_-3px_-3px_6px_rgba(255,255,255,1)] active:shadow-[inset_2px_2px_4px_rgba(180,175,166,0.55),_inset_-2px_-2px_4px_#ffffff] transition-all hover:text-[#cc1c00] cursor-pointer"
            >
              <span>{t("requestOffer")}</span>
              <ChevronRight size={13} />
            </button>
          </div>
        )
      },
      {
        titleKey: "supplierVettingTitle",
        descKey: "supplierVettingDesc",
        render: () => (
          <div className="bg-[#f0f2f5] rounded-3xl p-5 w-full max-w-[280px] flex gap-4 items-start text-left shadow-[inset_4px_4px_8px_rgba(180,175,166,0.5),_inset_-4px_-4px_8px_rgba(255,255,255,1)] border border-[#E3DFD7]/10">
            <div className="w-12 h-12 rounded-xl bg-[#f0f2f5] text-[#ff2300] flex items-center justify-center shrink-0 shadow-[4px_4px_8px_rgba(180,175,166,0.45),_-4px_-4px_8px_rgba(255,255,255,1)]">
              <ShieldCheck size={22} />
            </div>
            <div className="flex-1 space-y-4 py-1">
              <div className="space-y-1.5">
                <div className="h-2 w-24 bg-[#1a1c1d]/20 rounded-full" />
                <div className="h-1.5 w-14 bg-[#1a1c1d]/10 rounded-full" />
              </div>
              <div className="space-y-2.5 pt-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check size={9} className="text-[#ff2300] shrink-0 font-black" />
                    <div className={`h-1.5 bg-[#1a1c1d]/15 rounded-full ${i === 1 ? 'w-20' : i === 2 ? 'w-28' : 'w-16'}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }
    ],
    design: [
      {
        titleKey: "designCreatorTitle",
        descKey: "designCreatorDesc",
        render: () => (
          <div className="bg-[#f0f2f5] rounded-3xl shadow-[5px_5px_10px_rgba(180,175,166,0.4),_-5px_-5px_10px_rgba(255,255,255,1)] p-4.5 w-full max-w-[280px] space-y-3 border border-[#E3DFD7]/20">
            <div className="flex items-center justify-between border-b border-[#E3DFD7]/30 pb-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff2300]/80 shadow-[1px_1px_3px_rgba(255,35,0,0.3)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#1a1c1d]/25" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
              </div>
              <span className="text-[9px] font-mono text-[#1a1c1d]/50 font-bold">artboard.dieline</span>
            </div>
            <div className="h-20 bg-[#f0f2f5] rounded-xl shadow-[inset_3px_3px_6px_rgba(180,175,166,0.45),_inset_-3px_-3px_6px_rgba(255,255,255,1)] flex items-center justify-center text-[10px] text-[#1a1c1d]/40 font-mono font-bold uppercase tracking-widest gap-1 border border-none">
              <span>[</span> Canvas Workspace <span>]</span>
            </div>
          </div>
        )
      },
      {
        titleKey: "readyTemplatesTitle",
        descKey: "readyTemplatesDesc",
        render: () => (
          <div className="grid grid-cols-4 gap-3 w-full max-w-[340px]">
            {[
              { name: "Minimalist", bgDot: "bg-[#f0f2f5]" },
              { name: "Raw Kraft", bgDot: "bg-[#D0BFA6]" },
              { name: "Nordic", bgDot: "bg-[#253A2C]" },
              { name: "Warm Terra", bgDot: "bg-[#CE755A]" }
            ].map((tpl, i) => (
              <div key={i} className="p-2.5 rounded-2xl shadow-[4px_4px_8px_rgba(180,175,166,0.45),_-4px_-4px_8px_rgba(255,255,255,1)] flex flex-col justify-between aspect-[3/4] text-left bg-[#f0f2f5] border border-[#E3DFD7]/30">
                <span className="text-[9px] font-extrabold tracking-tight block uppercase text-[#1a1c1d]/80">{tpl.name}</span>
                <div className="flex items-center justify-center py-2">
                  <div className={`w-7 h-7 rounded-full shadow-[inset_2px_2px_4px_rgba(0,0,0,0.25),_inset_-2px_-2px_4px_rgba(255,255,255,0.15)] ${tpl.bgDot}`} />
                </div>
                <span className="text-[8px] font-mono text-[#1a1c1d]/40 font-bold">ID #40{1 + i}</span>
              </div>
            ))}
          </div>
        )
      },
      {
        titleKey: "expertProofingTitle",
        descKey: "expertProofingDesc",
        render: () => (
          <div className="bg-[#f0f2f5] rounded-24 shadow-[4px_4px_8px_rgba(180,175,166,0.45),_-4px_-4px_8px_#ffffff] p-5 w-full max-w-[280px] flex gap-4 items-center border border-[#E3DFD7]/20">
            <div className="w-12 h-12 bg-[#f0f2f5] text-[#ff2300] flex items-center justify-center shrink-0 rounded-xl shadow-[3px_3px_6px_rgba(180,175,166,0.4),_-3px_-3px_6px_#ffffff]">
              <FileCheck size={24} />
            </div>
            <div className="text-left flex-1 min-w-0">
              <span className="font-mono text-xs font-black text-[#1a1c1d] block truncate font-bold">approved_draft.pdf</span>
              <span className="bg-transparent text-[#ff2300] border border-[#ff2300]/25 shadow-[inset_1px_1px_2px_rgba(255,35,0,0.1)] font-mono text-[9px] font-black rounded px-2.5 py-0.5 uppercase mt-1 inline-block">
                PROVEN READY
              </span>
            </div>
          </div>
        )
      },
      {
        titleKey: "bleedCalibrationTitle",
        descKey: "bleedCalibrationDesc",
        render: () => (
          <div className="w-full max-w-[240px] aspect-[16/10] border border-dashed border-[#ff2300]/20 bg-[#f0f2f5] shadow-[inset_3px_3px_6px_rgba(180,175,166,0.5),_inset_-3px_-3px_6px_#ffffff] rounded-2xl flex items-center justify-center p-3 relative">
            <div className="absolute inset-2 border border-[#ff2300]/15 border-dashed rounded-lg" />
            <div className="absolute inset-4 border border-[#1a1c1d]/10 rounded-lg" />
            <span className="text-[10px] font-mono text-[#1a1c1d]/40 font-bold tracking-widest uppercase z-10">[ Safe Art Zone ]</span>
          </div>
        )
      }
    ],
    ordering: [
      {
        titleKey: "lowMinimumsTitle",
        descKey: "lowMinimumsDesc",
        render: () => (
          <div className="space-y-3 w-full max-w-[320px]">
            <div className="flex items-center justify-between p-3.5 px-5 bg-[#f0f2f5] shadow-[3.5px_3.5px_7px_rgba(180,175,166,0.45),_-3.5px_-3.5px_7px_rgba(255,255,255,1)] rounded-2xl border border-[#E3DFD7]/20 text-[#1a1c1d] text-xs font-mono font-bold">
              <span>30 pcs</span>
              <span>€2.15 / unit</span>
            </div>
            <div className="flex items-center justify-between p-3.5 px-5 bg-[#f0f2f5] shadow-[inset_3.5px_3.5px_7px_rgba(180,175,166,0.55),_inset_-3.5px_-3.5px_7px_rgba(255,255,255,1)] rounded-2xl text-[#ff2300] text-xs font-mono font-extrabold border-none">
              <span className="flex items-center gap-1.5">5,000 pcs <span className="bg-[#ff2300] text-white font-mono text-[9px] px-1.5 py-0.5 rounded font-black leading-none uppercase">-86%</span></span>
              <span>€0.30 / unit</span>
            </div>
          </div>
        )
      },
      {
        titleKey: "highWholesaleTitle",
        descKey: "highWholesaleDesc",
        render: () => (
          <div className="h-28 flex items-end justify-center gap-4 w-full">
            <div className="w-12 h-18 bg-[#f0f2f5] shadow-[4px_4px_8px_rgba(180,175,166,0.4),_-4px_-4px_8px_#ffffff] rounded-2xl border border-[#E3DFD7]/30" />
            <div className="w-12 h-24 bg-[#f0f2f5] shadow-[4px_4px_8px_rgba(180,175,166,0.41),_-4px_-4px_8px_#ffffff] rounded-2xl border border-[#E3DFD7]/30" />
            <div className="w-12 h-15 bg-[#ff2300] text-white font-mono font-black text-[9.5px] uppercase rounded-2xl flex items-center justify-center shadow-[4px_4px_8px_rgba(255,35,0,0.35),_-4px_-4px_8px_rgba(255,255,255,0.65)] border-none">SAVE</div>
          </div>
        )
      },
      {
        titleKey: "expressQueueTitle",
        descKey: "expressQueueDesc",
        render: () => (
          <div className="grid grid-cols-2 gap-4 w-full max-w-[320px]">
            <div className="p-4 bg-[#f0f2f5] rounded-2xl shadow-[4px_4px_8px_rgba(180,175,166,0.4),_-4px_-4px_8px_#ffffff] border border-[#E3DFD7]/20 text-left">
              <span className="text-[10px] text-[#1a1c1d]/50 font-bold uppercase tracking-tight block">Standard</span>
              <span className="font-black text-[#1a1c1d] text-sm block mt-1.5 font-bold">5 Bus. Days</span>
            </div>
            <div className="p-4 bg-[#f0f2f5] rounded-2xl shadow-[inset_3px_3px_6px_rgba(180,175,166,0.5),_inset_-3px_-3px_6px_#ffffff] text-left border-none">
              <span className="text-[10px] text-[#ff2300] font-bold uppercase tracking-tight block">Express</span>
              <span className="font-black text-[#ff2300] text-sm block mt-1.5 font-bold">3 Bus. Days *</span>
            </div>
          </div>
        )
      },
      {
        titleKey: "prepressControlTitle",
        descKey: "prepressControlDesc",
        render: () => (
          <div className="bg-[#f0f2f5] shadow-[inset_3.5px_3.5px_7px_rgba(180,175,166,0.55),_inset_-3.5px_-3.5px_7px_#ffffff] rounded-2xl p-4 w-full max-w-[280px] font-mono text-xs font-bold flex justify-between items-center border-none">
            <span className="text-[#1a1c1d]/80 font-black">Production Live</span>
            <span className="w-3.5 h-3.5 bg-[#ff2300] rounded-full shadow-[0_0_10px_rgba(255,35,0,0.65)] animate-pulse" />
          </div>
        )
      }
    ],
    warehousing: [
      {
        titleKey: "virtualStorageTitle",
        descKey: "virtualStorageDesc",
        render: () => (
          <div className="bg-[#f0f2f5] shadow-[4px_4px_8px_rgba(180,175,166,0.45),_-4px_-4px_8px_#ffffff] rounded-2xl p-5 w-full max-w-[280px] space-y-3.5 text-left border border-[#E3DFD7]/20">
            <div className="flex justify-between text-[11px] font-mono font-bold text-[#1a1c1d]">
              <span>Capacity Reserve</span>
              <span className="text-[#ff2300] font-extrabold">84% FREE</span>
            </div>
            <div className="h-3.5 w-full bg-[#f0f2f5] shadow-[inset_2.5px_2.5px_5px_rgba(180,175,166,0.5),_inset_-2.5px_-2.5px_5px_rgba(255,255,255,1)] rounded-full overflow-hidden p-0.5">
              <div className="h-full w-[16%] bg-[#ff2300] rounded-full shadow-[1px_1px_3px_rgba(0,0,0,0.15)]" />
            </div>
          </div>
        )
      },
      {
        titleKey: "splitDispatchesTitle",
        descKey: "splitDispatchesDesc",
        render: () => (
          <div className="space-y-3 w-full max-w-[320px] text-xs font-mono font-bold">
            <div className="flex justify-between items-center p-3 px-4 rounded-xl bg-[#f0f2f5] shadow-[3.5px_3.5px_7px_rgba(180,175,166,0.45),_-3.5px_-3.5px_7px_#ffffff] border border-[#E3DFD7]/20">
              <span className="text-[#1a1c1d]">30 units dispatch</span>
              <span className="text-[#1a1c1d]/60 font-black">€37.50</span>
            </div>
            <div className="flex justify-between items-center p-3 px-4 rounded-xl bg-[#f0f2f5] shadow-[inset_3px_3px_6px_rgba(180,175,166,0.5),_inset_-3px_-3px_6px_#ffffff] text-[#ff2300]">
              <span>90 units dispatch</span>
              <span className="font-extrabold">€79.20</span>
            </div>
          </div>
        )
      },
      {
        titleKey: "climateGuardTitle",
        descKey: "climateGuardDesc",
        render: () => (
          <div className="w-32 h-32 rounded-full bg-[#f0f2f5] shadow-[10px_10px_20px_rgba(180,175,166,0.5),_-10px_-10px_20px_#ffffff] border border-[#E3DFD7]/30 flex flex-col items-center justify-center p-2 relative">
            <div className="w-24 h-24 rounded-full bg-[#f0f2f5] shadow-[inset_3.5px_3.5px_7px_rgba(180,175,166,0.45),_inset_-3.5px_-3.5px_7px_#ffffff] flex flex-col items-center justify-center text-center">
              <span className="text-base font-black text-[#1a1c1d] font-mono leading-none font-bold">21 °C</span>
              <span className="text-[8px] text-[#ff2300] font-mono uppercase tracking-wider font-extrabold mt-1">Dry static</span>
            </div>
          </div>
        )
      },
      {
        titleKey: "automatedRefillTitle",
        descKey: "automatedRefillDesc",
        render: () => (
          <div className="w-full max-w-[240px] bg-[#f0f2f5] shadow-[4px_4px_8px_rgba(180,175,166,0.45),_-4px_-4px_8px_#ffffff] rounded-2xl border border-[#E3DFD7]/20 p-5 shrink-0 text-center space-y-4">
            <div>
              <span className="text-xs font-sans font-black text-[#1a1c1d] block font-bold">Dynamic Kraft Mailer</span>
              <span className="text-[10px] font-mono text-[#1a1c1d]/50 font-bold mt-0.5 block">10,000 package batch</span>
            </div>
            <button 
              type="button"
              onClick={() => { setCurrentView("track"); }}
              className="w-full bg-[#ff2300] hover:bg-[#ff3b1a] text-white font-mono text-[10px] font-black uppercase tracking-wider py-2.5 rounded-full cursor-pointer shadow-[3px_3px_6px_rgba(255,35,0,0.3),_-3px_-3px_6px_rgba(255,255,255,0.7)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)] transition-all"
            >
              {t("sendBatch")}
            </button>
          </div>
        )
      }
    ],
    pay_as_you_want: [
      {
        titleKey: "zeroInterestTitle",
        descKey: "zeroInterestDesc",
        render: () => (
          <div className="bg-[#f0f2f5] rounded-2xl shadow-[4px_4px_8px_rgba(180,175,166,0.45),_-4px_-4px_8px_#ffffff] p-5 w-full max-w-[280px] space-y-3.5 border border-[#E3DFD7]/20 text-left">
            <span className="font-mono text-[10px] font-bold text-[#1a1c1d]/55 uppercase tracking-wide">Defer balance across:</span>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono font-bold text-center">
              <div className="p-2.5 bg-[#f0f2f5] shadow-[3px_3px_6px_rgba(180,175,166,0.35),_-3px_-3px_6px_rgba(255,255,255,1)] rounded-xl text-[#1a1c1d]/50 hover:text-[#1a1c1d] transition-all">30 days</div>
              <div className="p-2.5 bg-[#f0f2f5] shadow-[inset_3px_3px_6px_rgba(180,175,166,0.55),_inset_-3px_-3px_6px_#ffffff] rounded-xl text-[#ff2300] font-black border border-none">120 days</div>
            </div>
          </div>
        )
      },
      {
        titleKey: "payOnDischargeTitle",
        descKey: "payOnDischargeDesc",
        render: () => (
          <div className="bg-[#f0f2f5] shadow-[inset_3.5px_3.5px_7px_rgba(180,175,166,0.45),_inset_-3.5px_-3.5px_7px_#ffffff] rounded-2xl p-5 w-full max-w-[280px] text-left space-y-3.5 border border-none">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#1a1c1d]/40 font-mono">Latest activity</span>
            <div className="flex items-center justify-between text-xs font-bold font-sans">
              <span className="text-[#1a1c1d] font-extrabold">Postage release #102</span>
              <span className="text-[#ff2300] font-mono font-black">+ €140</span>
            </div>
          </div>
        )
      },
      {
        titleKey: "transparentPricingTitle",
        descKey: "transparentPricingDesc",
        render: () => (
          <div className="flex items-center gap-2.5 justify-center font-mono font-black text-[#ff2300] bg-[#f0f2f5] shadow-[inset_3.5px_3.5px_7px_rgba(180,175,166,0.5),_inset_-3.5px_-3.5px_7px_#ffffff] rounded-full px-5 py-2.5 text-xs">
            <span>✓ NO PLATFORM DUES</span>
          </div>
        )
      },
      {
        titleKey: "dynamicInvoicesTitle",
        descKey: "dynamicInvoicesDesc",
        render: () => (
          <div className="bg-[#f0f2f5] rounded-2xl shadow-[4px_4px_8px_rgba(180,175,166,0.45),_-4px_-4px_8px_#ffffff] p-4.5 w-full max-w-[280px] flex gap-3.5 items-center border border-[#E3DFD7]/20">
            <div className="w-10 h-10 bg-[#f0f2f5] shadow-[inset_2.5px_2.5px_5px_rgba(180,175,166,0.5),_inset_-2.5px_-2.5px_5px_#ffffff] text-[#1a1c1d]/60 rounded-xl flex items-center justify-center font-bold text-[10px] font-mono">PDF</div>
            <div className="text-left flex-1 min-w-0">
              <span className="font-mono text-xs font-bold text-[#1a1c1d] block truncate leading-none font-bold">statement_q2.pdf</span>
              <span className="text-[10px] text-[#1a1c1d]/50 block mt-1.5 leading-none">Ready for tax filings</span>
            </div>
          </div>
        )
      }
    ]
  };

  return (
    <div className="w-full py-16 px-6 sm:px-10 lg:px-12 max-w-[1240px] mx-auto select-none font-sans mt-12 mb-12" id="packhelp-premium-block">
      
      {/* Symmetrical Header */}
      <div className="text-center mb-12">
        <h2 className="font-sans font-black text-3.5xl sm:text-4.5xl text-[#1a1c1d] tracking-tight leading-none uppercase font-bold">
          {t("sectionTitle")}
        </h2>
        <div className="w-24 h-2 bg-[#f0f2f5] shadow-[inset_2.5px_2.5px_5px_rgba(180,175,166,0.65),inset_-2.5px_-2.5px_5px_#ffffff] rounded-full mx-auto mt-6" />
      </div>

      {/* Symmetrical Hero Banner (Concentric Radial Ring Design - Styled like Scrooter Solid #FF2300 Premium Canvas) */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#FF2300] min-h-[460px] sm:min-h-[500px] lg:min-h-[560px] flex items-center p-8 sm:p-14 lg:p-16 xl:p-20 mb-16 shadow-[0_20px_50px_rgba(255,35,0,0.15)] border border-[#FF2300]">
        
        {/* Symmetrical technical geometry line decor for premium feel */}
        <div className="absolute top-8 left-8 text-white/20 font-mono text-[9px] tracking-widest uppercase hidden sm:block">
          Capsule System v4.1 // Precision Engineering
        </div>
        
        {/* Highly detailed decorative vector-svg radial-dial coordinate widget representing precision luxury packaging geometry design */}
        <svg className="absolute -right-28 sm:-right-20 lg:-right-6 bottom-[-22%] sm:bottom-[-18%] lg:bottom-[-5%] w-[360px] sm:w-[480px] lg:w-[620px] h-[360px] sm:h-[480px] lg:h-[620px] pointer-events-none opacity-45 lg:opacity-65 select-none duration-1000" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer boundary concentric rings in pure white */}
          <circle cx="300" cy="300" r="280" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4 8" opacity="0.25" />
          <circle cx="300" cy="300" r="255" stroke="#FFFFFF" strokeWidth="1" opacity="0.15" />
          <circle cx="300" cy="300" r="225" stroke="url(#arc-grad-white)" strokeWidth="1.2" strokeDasharray="2 12" opacity="0.3" />
          
          {/* The prominent wide white semi-transparent ring */}
          <circle cx="300" cy="300" r="190" stroke="url(#ring-grad-white)" strokeWidth="34" opacity="0.08" />
          <circle cx="300" cy="300" r="190" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.2" />
          
          {/* Middle circle with radial line ticks */}
          <circle cx="300" cy="300" r="145" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 6" opacity="0.2" />
          
          {/* Ticks ring */}
          <g opacity="0.35">
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
                  stroke="#FFFFFF"
                  strokeWidth={i % 4 === 0 ? "1.5" : "0.75"}
                />
              );
            })}
          </g>
          
          {/* Core elements */}
          <circle cx="300" cy="300" r="95" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="6 18" opacity="0.3" />
          <circle cx="300" cy="300" r="65" stroke="url(#arc-grad-white)" strokeWidth="1" opacity="0.2" />
          <circle cx="300" cy="300" r="12" fill="#FFFFFF" opacity="0.15" />
          <circle cx="300" cy="300" r="3" fill="#FFFFFF" opacity="0.8" />

          {/* Glow/Gradient Definitions */}
          <defs>
            <linearGradient id="ring-grad-white" x1="0" y1="0" x2="600" y2="600" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FF8B80" />
            </linearGradient>
            <linearGradient id="arc-grad-white" x1="0" y1="0" x2="0" y2="600" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FFA8A0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Left Content Column */}
        <div className="relative z-10 w-full max-w-xl flex flex-col items-start text-left">
          {/* Beta/Information Pill Tag - Styled like Scrooter luxury white outline */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[9px] tracking-[0.25em] uppercase font-mono font-bold text-white bg-white/10 backdrop-blur-md border border-white/30 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {locale === "hy" ? "ՊՐԵՄԻՈՒՄ ՓԱԹԵԹԱՎՈՐՈՒՄ" : locale === "ru" ? "ПРЕМИАЛЬНАЯ УПАКОВКА" : "PREMIUM PACKAGING LAB"}
          </div>

          {/* Double-fonts title matching the reference image layout precisely */}
          <h1 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.05] mt-5 md:mt-6 mb-4 md:mb-5 uppercase">
            {locale === "hy" ? "Ձևավորել Խելացի:" : locale === "ru" ? "Проектируй Умно." : "Design Smarter."}
            <span className="block font-sans font-black text-white/90 mt-1 lg:mt-2 text-3xl sm:text-4xl lg:text-5xl opacity-80">
              {locale === "hy" ? "Արտադրել Արագ," : locale === "ru" ? "Создавай Быстрее," : "Brand Faster,"}
            </span>
          </h1>

          {/* Spaced Subtitle Description */}
          <p className="font-sans text-xs sm:text-sm text-white/80 leading-relaxed max-w-sm sm:max-w-md md:max-w-lg mb-8 md:mb-9">
            {locale === "hy" 
              ? "Պատվիրեք անհատականացված բրենդային տոպրակներ, տուփեր և պիտակներ հաշված վայրկյաններում մեր առաջատար առցանց հաշվիչով:" 
              : locale === "ru"
              ? "Закажите фирменные пакеты, коробки и этикетки за считанные секунды с помощью нашего умного онлайн-калькулятора."
              : "Order custom branded bags, luxury boxes, and bespoke labels in seconds with our advanced instant online configurator."}
          </p>

          {/* Clean Symmetrical Action Buttons (Styled like Scrooter black solid & white outline) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setCurrentView("calculator");
                window.history.pushState({}, "", "/calculator");
              }}
              className="bg-[#0C0B0A] hover:bg-black text-white font-sans text-[11px] font-bold py-4 px-10 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.15)] cursor-pointer uppercase tracking-[0.15em] border-none outline-none hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              {locale === "hy" ? "Բացել Հաշվիչը" : locale === "ru" ? "Открыть Калькулятор" : "Open Calculator"}
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView("track");
                if (setIsInTrackPortal) setIsInTrackPortal(true);
                window.history.pushState({}, "", "/track-order");
              }}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/35 backdrop-blur-md transition-all duration-300 py-4 px-10 rounded-full font-bold text-[11px] uppercase tracking-[0.15em] cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              {locale === "hy" ? "Հետևել Պատվերին" : locale === "ru" ? "Отследить Заказ" : "Track Order"}
            </button>
          </div>
        </div>

      </div>

      {/* Symmetric Neumorphic Tab bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-2.5 bg-[#f0f2f5] shadow-[inset_4px_4px_8px_rgba(180,175,166,0.45),_inset_-4px_-4px_8px_#ffffff] rounded-[2rem] max-w-4xl mx-auto mb-14 border border-[#E3DFD7]/20">
        {(["products", "design", "ordering", "warehousing", "pay_as_you_want"] as TabType[]).map((tabKey) => {
          const isActive = activeTab === tabKey;
          const labelKey = `tab${tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}`.replace("Pay_as_you_want", "Payments");
          return (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              type="button"
              className={`px-5 py-2.5 rounded-full font-bold text-[11px] uppercase tracking-wider transition-all duration-200 border-none cursor-pointer active:scale-95
                ${isActive 
                  ? "bg-[#f0f2f5] text-[#ff2300] shadow-[inset_3px_3px_6px_rgba(180,175,166,0.65),_inset_-3px_-3px_6px_#ffffff] font-extrabold" 
                  : "bg-transparent text-[#1a1c1d]/60 hover:text-[#1a1c1d] hover:shadow-[3px_3px_6px_rgba(180,175,166,0.25),_-3px_-3px_6px_#ffffff]"
                }`}
            >
              {t(labelKey)}
            </button>
          );
        })}
      </div>

      {/* Main Tab Panels Grid Container */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 pb-12 transition-all duration-300">
        {tabCards[activeTab]?.map((card, idx) => (
          <div 
            key={idx}
            className="glass-mirror-card bg-white/40 rounded-[36px] pt-10 pb-12 px-8 flex flex-col items-center justify-between text-center min-h-[440px] border border-white/80 shadow-[12px_12px_28px_rgba(180,175,166,0.25),_-12px_-12px_28px_rgba(255,255,255,0.9)] hover:scale-[1.025] hover:border-white/90 hover:shadow-[16px_16px_36px_rgba(255,35,0,0.08),_0_12px_24px_rgba(61,39,27,0.04)] transition-all duration-500 relative group"
          >
            {/* Cell Titles and Descriptions */}
            <div className="flex flex-col items-center w-full">
              <h3 className="font-sans font-black text-[#1a1c1d] text-[20px] tracking-tight mb-2 font-bold">
                {t(card.titleKey)}
              </h3>
              <p className="text-[#1a1c1d]/70 text-[13px] leading-relaxed max-w-[340px] mx-auto text-center font-medium">
                {t(card.descKey)}
              </p>
            </div>

            {/* Render unique custom visualization */}
            <div className="w-full flex items-center justify-center mt-6 h-36">
              {card.render()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
