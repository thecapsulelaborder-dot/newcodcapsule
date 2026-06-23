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
  setCurrentView: (view: "home" | "calculator" | "track") => void;
  setActiveCategory: (catId: string) => void;
}

type TabType = "products" | "design" | "ordering" | "warehousing" | "pay_as_you_want";

export default function PackhelpShowcase({ locale, setCurrentView, setActiveCategory }: PackhelpShowcaseProps) {
  const [activeTab, setActiveTab] = useState<TabType>("products");

  // Multi-lingual Translation Dictionary
  const translations: Record<string, Record<"en" | "ru" | "hy", string>> = {
    sectionTitle: {
      en: "Making packaging simple",
      ru: "Упаковка — это просто",
      hy: "Պարզեցնելով փաթեթավորումը"
    },
    tabProducts: {
      en: "Products",
      ru: "Продукты",
      hy: "Արտադրանք"
    },
    tabDesign: {
      en: "Design",
      ru: "Дизайн",
      hy: "Դիզայն"
    },
    tabOrdering: {
      en: "Ordering",
      ru: "Заказ",
      hy: "Պատվեր"
    },
    tabWarehousing: {
      en: "Warehousing",
      ru: "Склад",
      hy: "Պահեստավորում"
    },
    tabPayments: {
      en: "Pay as you want",
      ru: "Оплата",
      hy: "Ճկուն Վճարում"
    },
    catalogueTitle: {
      en: "Catalogue",
      ru: "Каталог",
      hy: "Կատալոգ"
    },
    catalogueDesc: {
      en: "A curated catalogue of best-in-category, sustainable products available to buy in Shop",
      ru: "Кураторский каталог лучших в своей категории экологичных продуктов, доступных в магазине",
      hy: "Լավագույն կատեգորիայի էկոլոգիապես մաքուր արտադրանքների ընտրված կատալոգ"
    },
    customSizingTitle: {
      en: "Custom sizing",
      ru: "Индивидуальный размер",
      hy: "Անհատական չափսեր"
    },
    customSizingDesc: {
      en: "Design custom packaging that perfectly suits your products",
      ru: "Проектируйте уникальную упаковку, которая идеально подойдет под ваши продукты",
      hy: "Ստեղծեք անհատական չափսերով փաթեթավորում ձեր արտադրանքի համար"
    },
    tailorMadeTitle: {
      en: "Tailor-made packaging",
      ru: "Упаковка под ключ",
      hy: "Անհատական պատվերներ"
    },
    tailorMadeDesc: {
      en: "Reach beyond our catalogue and create original packaging that's unique to your brand and product",
      ru: "Выйдите за рамки стандартного каталога и создайте упаковочные решения под любые бренд-пакеты",
      hy: "Դուրս եկեք սովորական կատալոգի սահմաններից և ստեղծեք բացառիկ փաթեթավորում ձեր բրենդի համար"
    },
    supplierVettingTitle: {
      en: "Supplier vetting",
      ru: "Проверка поставщиков",
      hy: "Մատակարարների ստուգում"
    },
    supplierVettingDesc: {
      en: "Work only with vetted packaging manufacturers meeting ethical, environmental, and quality standards",
      ru: "Работайте только с надежными фабриками, прошедшими строгий аудит стандартов этики и качества",
      hy: "Աշխատեք միայն ստուգված արտադրողների հետ, ովքեր համապատասխանում են էկոլոգիական չափանիշներին"
    },
    designCreatorTitle: {
      en: "Artwork Creator",
      ru: "Конструктор макетов",
      hy: "Դիզայն ստեղծող"
    },
    designCreatorDesc: {
      en: "Design packaging in your web browser with simple interactive flat tooling",
      ru: "Создавайте профессиональный дизайн прямо в браузере с помощью интуитивных редакторов",
      hy: "Ձևավորեք ձեր փաթեթավորումը անմիջապես վեբ բրաուզերում պարզ գործիքներով"
    },
    readyTemplatesTitle: {
      en: "Design templates",
      ru: "Готовые шаблоны макетов",
      hy: "Դիզայնի կաղապարներ"
    },
    readyTemplatesDesc: {
      en: "A complete selection of ready-to-print compositions and theme structures",
      ru: "Огромная библиотека лицензированных готовых паттернов и шрифтовых сетов",
      hy: "Պատրաստի տպագրական կաղապարների և թեմատիկ կոմպոզիցիաների ամբողջական ընտրություն"
    },
    expertProofingTitle: {
      en: "Expert Proofing",
      ru: "Техконтроль эксперта",
      hy: "Փորձագիտական ստուգում"
    },
    expertProofingDesc: {
      en: "Every design upload is hand-checked by professional pre-press engineers before manufacturing",
      ru: "Все загруженные макеты проверяются технологами фабрики на оверпринт и вылеты под обрез",
      hy: "Յուրաքանչյուր դիզայն մանրամասն ստուգվում է տեխնոլոգների կողմից նախքան արտադրությունը"
    },
    bleedCalibrationTitle: {
      en: "Bleed calibration",
      ru: "Профессиональные контуры",
      hy: "Տպագրական կոնտուրներ"
    },
    bleedCalibrationDesc: {
      en: "Accurate offset vectors supporting high fidelity layouts on custom dielines",
      ru: "Профессиональные раскладки под вырубку с подробным указанием полей безопасной зоны",
      hy: "Բարձր ճշգրտության վեկտորային կաղապարներ custom տպագրության համար"
    },
    lowMinimumsTitle: {
      en: "Flexible scale",
      ru: "Гибкий тираж",
      hy: "Ճկուն քանակներ"
    },
    lowMinimumsDesc: {
      en: "Order from small test quantities to bulk, wholesale volumes with sliding economy scales",
      ru: "Заказывайте как малые пробные партии, так и крупные оптовые тиражи по прогрессивным скидкам",
      hy: "Պատվիրեք փոքր փորձնական խմբաքանակներից մինչև մեծածախ ծավալներ"
    },
    highWholesaleTitle: {
      en: "Wholesale pricing",
      ru: "Оптовые закупки",
      hy: "Մեծածախ արտադրություն"
    },
    highWholesaleDesc: {
      en: "Optimize packaging budgets with deep high-volume contract pricing discounts",
      ru: "Минимизируйте издержки на упаковку за счет долгосрочных крупных контрактов",
      hy: "Խնայեք բյուջեն խոշոր խմբաքանակների արտադրության դեպքում՝ հատուկ պայմաններով"
    },
    expressQueueTitle: {
      en: "Express turnaround",
      ru: "Сроки производства",
      hy: "Արտադրության Օրեր"
    },
    expressQueueDesc: {
      en: "Fast production queues delivering custom-branded orders on tight schedules",
      ru: "Соблюдайте самые сжатые сроки для проведения сезонных и маркетинговых кампаний",
      hy: "Պատվերն արտադրվում և ուղարկվում է ամենասեղմ ժամկետներում ըստ ձեր պլանի"
    },
    prepressControlTitle: {
      en: "Full tracking control",
      ru: "Отслеживание производства",
      hy: "Լիակատար վերահսկողություն"
    },
    prepressControlDesc: {
      en: "Integrate production tracking APIs. Inspect stages of dieline prepress and ship dispatches",
      ru: "Простой интерфейс для контроля готовности плит, сборки тиражей и отгрузки со склада",
      hy: "Հետևեք պատվերներին և առաքման փուլերին մեր պարզ և հարմար պորտալի միջոցով"
    },
    virtualStorageTitle: {
      en: "Easy warehousing",
      ru: "Простое хранение",
      hy: "Պարզ պահեստավորում"
    },
    virtualStorageDesc: {
      en: "Store your major print production in our climate-regulated storage. Call down delivery on demand",
      ru: "Храните готовую тиражную упаковку на нашем сухом складе и оформляйте партии в один клик",
      hy: "Պահեք ձեր տպագրված տուփերը մեր հատուկ պահեստում և ստացեք դրանք միայն անհրաժեշտության դեպքում"
    },
    splitDispatchesTitle: {
      en: "Bulk order discounts",
      ru: "Тиражные скидки",
      hy: "Մեծածախ զեղչեր"
    },
    splitDispatchesDesc: {
      en: "Buy more, save more - the bigger order you make, the more you benefit from our factory",
      ru: "Экономия за счет однократного крупного тиража. Выгода увеличивается с ростом партии",
      hy: "Ինչքան մեծ է պատվերը, այնքան ավելի շատ եք խնայում երաշխավորված պայմաններով"
    },
    climateGuardTitle: {
      en: "Climate guard",
      ru: "Микроклимат склада",
      hy: "Օդափոխվող պահեստ"
    },
    climateGuardDesc: {
      en: "Static temperature and moisture regulated vaults preventing organic cardboard rot",
      ru: "Идеальные складские условия: стабильные 21°C и сухой воздух предохраняют бумагу от порчи",
      hy: "Պահեստներ հատուկ ջերմաստիճանային և հարաբերական խոնավության վերահսկմամբ"
    },
    automatedRefillTitle: {
      en: "Streamlined scale",
      ru: "Умное снабжение",
      hy: "Անխափան մատակարարում"
    },
    automatedRefillDesc: {
      en: "Automated triggers prompting layout replenishments before inventories slip below critical markers",
      ru: "Автоматизированная отправка допечатанных тиражей при снижении остатков ниже 15%",
      hy: "Կանխատեսեք ձեր ծախսերը և ստացեք նոր խմբաքանակները պահեստից մեկ հպումով"
    },
    zeroInterestTitle: {
      en: "Zero interest financing",
      ru: "Рассрочка платежей",
      hy: "Ճկուն ֆինանսավորում"
    },
    zeroInterestDesc: {
      en: "Preserve valuable active capital runtimes with 0% interest deferred repayment scales",
      ru: "Поддерживайте стабильный кэшфлоу с беспроцентной отсрочкой платежа на долгий срок",
      hy: "Պահպանեք բիզնեսի անխափան դրամական շրջանառությունը 0% տոկոսադրույքով"
    },
    payOnDischargeTitle: {
      en: "Pay on Use",
      ru: "Оплата по факту",
      hy: "Վճարում ըստ օգտագործման"
    },
    payOnDischargeDesc: {
      en: "Steady your fiscal sheets by triggering invoicing only at physical shipping releases",
      ru: "Рассчитывайте нагрузку плавно — списывайте плату только в момент отправки коробок",
      hy: "Վերահսկեք ձեր բյուջեն. վճարեք միայն այն ապրանքների համար, որոնք առաքվում են պահեստից"
    },
    transparentPricingTitle: {
      en: "Transparent pricing",
      ru: "Прозрачные тарифы",
      hy: "Թափանցիկ գներ"
    },
    transparentPricingDesc: {
      en: "Absolutely zero setup fees, contract premiums, or unexpected tooling overheads",
      ru: "Никаких скрытых сборов, надбавок за запуск станков или неожиданных накладных расходов",
      hy: "Բացարձակապես զրոյական լրացուցիչ վճարներ կամ չնախատեսված ծախսեր"
    },
    dynamicInvoicesTitle: {
      en: "Dynamic Invoices",
      ru: "Удобный кабинет",
      hy: "Բիլլինգ պորտալ"
    },
    dynamicInvoicesDesc: {
      en: "Automated ledger entries and downloads synchronizing with localized business sheets",
      ru: "Автоматическая выгрузка закрывающих документов, счетов-фактур и реестров отгрузок",
      hy: "Ավտոմատացված հաշիվների ներկայացում և բիլլինգի համակարգում ձեր հաշվապահության համար"
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
                className="group bg-[#F4F2EE] rounded-2xl p-2 flex flex-col justify-between items-center aspect-[5/6] cursor-pointer shadow-[4px_4px_8px_rgba(180,175,166,0.45),_-4px_-4px_8px_rgba(255,255,255,1)] hover:shadow-[inset_2px_2px_4px_rgba(180,175,166,0.55),_inset_-2px_-2px_4px_rgba(255,255,255,1)] transition-all duration-200 border border-[#E3DFD7]/20"
              >
                <div className="w-full flex-1 flex items-center justify-center bg-[#F4F2EE] shadow-[inset_2px_2px_4px_rgba(180,175,166,0.5),_inset_-2px_-2px_4px_rgba(255,255,255,1)] rounded-xl overflow-hidden p-1.5">
                  <img src={th.img} alt={th.label.en} className="max-h-[44px] max-w-full object-contain group-hover:scale-105 transition-transform" />
                </div>
                <span className="text-[10px] font-bold text-[#3D271B] tracking-tight mt-1.5 block truncate max-w-full">
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
                <div key={idx} className="flex items-stretch rounded-xl shadow-[inset_3px_3px_6px_rgba(180,175,166,0.55),_inset_-3px_-3px_6px_rgba(255,255,255,1)] bg-[#F4F2EE] overflow-hidden text-sm h-10 w-24">
                  <span className="flex-1 flex items-center justify-center font-bold text-[#3D271B] font-mono select-none bg-transparent">{item.val}</span>
                  <span className="w-10 bg-[#F4F2EE] border-l border-[#E3DFD7]/40 flex items-center justify-center text-xs font-mono text-[#3D271B]/50 font-bold">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="w-36 h-28 relative flex items-center justify-center shrink-0 bg-[#F4F2EE] shadow-[inset_3px_3px_6px_rgba(180,175,166,0.45),_inset_-3px_-3px_6px_rgba(255,255,255,1)] rounded-2xl p-2 border border-[#E3DFD7]/20">
              <svg viewBox="0 0 100 80" className="w-full h-full stroke-[#ff2300] stroke-[1.8] fill-none stroke-linejoin-round stroke-linecap-round">
                <path d="M 20,40 L 50,55 L 90,32 L 60,18 Z" className="stroke-[#3D271B]/50 stroke-[1.5]" />
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
            <div className="w-full max-w-[280px] aspect-[16/9] rounded-2xl overflow-hidden bg-[#F4F2EE] p-2 shadow-[6px_6px_12px_rgba(180,175,166,0.5),_-6px_-6px_12px_rgba(255,255,255,1)] mb-4 border border-[#E3DFD7]/20">
              <img 
                src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400" 
                alt="Symmetric tailored box illustration" 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <button 
              type="button" 
              onClick={() => { setActiveCategory("custom_box"); setCurrentView("calculator"); }}
              className="text-[11px] font-bold text-[#ff2300] bg-[#F4F2EE] py-2 px-5 rounded-full inline-flex items-center gap-1.5 shadow-[3px_3px_6px_rgba(180,175,166,0.45),_-3px_-3px_6px_rgba(255,255,255,1)] active:shadow-[inset_2px_2px_4px_rgba(180,175,166,0.55),_inset_-2px_-2px_4px_#ffffff] transition-all hover:text-[#cc1c00] cursor-pointer"
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
          <div className="bg-[#F4F2EE] rounded-3xl p-5 w-full max-w-[280px] flex gap-4 items-start text-left shadow-[inset_4px_4px_8px_rgba(180,175,166,0.5),_inset_-4px_-4px_8px_rgba(255,255,255,1)] border border-[#E3DFD7]/10">
            <div className="w-12 h-12 rounded-xl bg-[#F4F2EE] text-[#ff2300] flex items-center justify-center shrink-0 shadow-[4px_4px_8px_rgba(180,175,166,0.45),_-4px_-4px_8px_rgba(255,255,255,1)]">
              <ShieldCheck size={22} />
            </div>
            <div className="flex-1 space-y-4 py-1">
              <div className="space-y-1.5">
                <div className="h-2 w-24 bg-[#3D271B]/20 rounded-full" />
                <div className="h-1.5 w-14 bg-[#3D271B]/10 rounded-full" />
              </div>
              <div className="space-y-2.5 pt-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check size={9} className="text-[#ff2300] shrink-0 font-black" />
                    <div className={`h-1.5 bg-[#3D271B]/15 rounded-full ${i === 1 ? 'w-20' : i === 2 ? 'w-28' : 'w-16'}`} />
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
          <div className="bg-[#F4F2EE] rounded-3xl shadow-[5px_5px_10px_rgba(180,175,166,0.4),_-5px_-5px_10px_rgba(255,255,255,1)] p-4.5 w-full max-w-[280px] space-y-3 border border-[#E3DFD7]/20">
            <div className="flex items-center justify-between border-b border-[#E3DFD7]/30 pb-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff2300]/80 shadow-[1px_1px_3px_rgba(255,35,0,0.3)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#3D271B]/25" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
              </div>
              <span className="text-[9px] font-mono text-[#3D271B]/50 font-bold">artboard.dieline</span>
            </div>
            <div className="h-20 bg-[#F4F2EE] rounded-xl shadow-[inset_3px_3px_6px_rgba(180,175,166,0.45),_inset_-3px_-3px_6px_rgba(255,255,255,1)] flex items-center justify-center text-[10px] text-[#3D271B]/40 font-mono font-bold uppercase tracking-widest gap-1 border border-none">
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
              { name: "Minimalist", bgDot: "bg-[#FAFAF8]" },
              { name: "Raw Kraft", bgDot: "bg-[#D0BFA6]" },
              { name: "Nordic", bgDot: "bg-[#253A2C]" },
              { name: "Warm Terra", bgDot: "bg-[#CE755A]" }
            ].map((tpl, i) => (
              <div key={i} className="p-2.5 rounded-2xl shadow-[4px_4px_8px_rgba(180,175,166,0.45),_-4px_-4px_8px_rgba(255,255,255,1)] flex flex-col justify-between aspect-[3/4] text-left bg-[#F4F2EE] border border-[#E3DFD7]/30">
                <span className="text-[9px] font-extrabold tracking-tight block uppercase text-[#3D271B]/80">{tpl.name}</span>
                <div className="flex items-center justify-center py-2">
                  <div className={`w-7 h-7 rounded-full shadow-[inset_2px_2px_4px_rgba(0,0,0,0.25),_inset_-2px_-2px_4px_rgba(255,255,255,0.15)] ${tpl.bgDot}`} />
                </div>
                <span className="text-[8px] font-mono text-[#3D271B]/40 font-bold">ID #40{1 + i}</span>
              </div>
            ))}
          </div>
        )
      },
      {
        titleKey: "expertProofingTitle",
        descKey: "expertProofingDesc",
        render: () => (
          <div className="bg-[#F4F2EE] rounded-24 shadow-[4px_4px_8px_rgba(180,175,166,0.45),_-4px_-4px_8px_#ffffff] p-5 w-full max-w-[280px] flex gap-4 items-center border border-[#E3DFD7]/20">
            <div className="w-12 h-12 bg-[#F4F2EE] text-[#ff2300] flex items-center justify-center shrink-0 rounded-xl shadow-[3px_3px_6px_rgba(180,175,166,0.4),_-3px_-3px_6px_#ffffff]">
              <FileCheck size={24} />
            </div>
            <div className="text-left flex-1 min-w-0">
              <span className="font-mono text-xs font-black text-[#3D271B] block truncate font-bold">approved_draft.pdf</span>
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
          <div className="w-full max-w-[240px] aspect-[16/10] border border-dashed border-[#ff2300]/20 bg-[#F4F2EE] shadow-[inset_3px_3px_6px_rgba(180,175,166,0.5),_inset_-3px_-3px_6px_#ffffff] rounded-2xl flex items-center justify-center p-3 relative">
            <div className="absolute inset-2 border border-[#ff2300]/15 border-dashed rounded-lg" />
            <div className="absolute inset-4 border border-[#3D271B]/10 rounded-lg" />
            <span className="text-[10px] font-mono text-[#3D271B]/40 font-bold tracking-widest uppercase z-10">[ Safe Art Zone ]</span>
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
            <div className="flex items-center justify-between p-3.5 px-5 bg-[#F4F2EE] shadow-[3.5px_3.5px_7px_rgba(180,175,166,0.45),_-3.5px_-3.5px_7px_rgba(255,255,255,1)] rounded-2xl border border-[#E3DFD7]/20 text-[#3D271B] text-xs font-mono font-bold">
              <span>30 pcs</span>
              <span>€2.15 / unit</span>
            </div>
            <div className="flex items-center justify-between p-3.5 px-5 bg-[#F4F2EE] shadow-[inset_3.5px_3.5px_7px_rgba(180,175,166,0.55),_inset_-3.5px_-3.5px_7px_rgba(255,255,255,1)] rounded-2xl text-[#ff2300] text-xs font-mono font-extrabold border-none">
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
            <div className="w-12 h-18 bg-[#F4F2EE] shadow-[4px_4px_8px_rgba(180,175,166,0.4),_-4px_-4px_8px_#ffffff] rounded-2xl border border-[#E3DFD7]/30" />
            <div className="w-12 h-24 bg-[#F4F2EE] shadow-[4px_4px_8px_rgba(180,175,166,0.41),_-4px_-4px_8px_#ffffff] rounded-2xl border border-[#E3DFD7]/30" />
            <div className="w-12 h-15 bg-[#ff2300] text-white font-mono font-black text-[9.5px] uppercase rounded-2xl flex items-center justify-center shadow-[4px_4px_8px_rgba(255,35,0,0.35),_-4px_-4px_8px_rgba(255,255,255,0.65)] border-none">SAVE</div>
          </div>
        )
      },
      {
        titleKey: "expressQueueTitle",
        descKey: "expressQueueDesc",
        render: () => (
          <div className="grid grid-cols-2 gap-4 w-full max-w-[320px]">
            <div className="p-4 bg-[#F4F2EE] rounded-2xl shadow-[4px_4px_8px_rgba(180,175,166,0.4),_-4px_-4px_8px_#ffffff] border border-[#E3DFD7]/20 text-left">
              <span className="text-[10px] text-[#3D271B]/50 font-bold uppercase tracking-tight block">Standard</span>
              <span className="font-black text-[#3D271B] text-sm block mt-1.5 font-bold">5 Bus. Days</span>
            </div>
            <div className="p-4 bg-[#F4F2EE] rounded-2xl shadow-[inset_3px_3px_6px_rgba(180,175,166,0.5),_inset_-3px_-3px_6px_#ffffff] text-left border-none">
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
          <div className="bg-[#F4F2EE] shadow-[inset_3.5px_3.5px_7px_rgba(180,175,166,0.55),_inset_-3.5px_-3.5px_7px_#ffffff] rounded-2xl p-4 w-full max-w-[280px] font-mono text-xs font-bold flex justify-between items-center border-none">
            <span className="text-[#3D271B]/80 font-black">Production Live</span>
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
          <div className="bg-[#F4F2EE] shadow-[4px_4px_8px_rgba(180,175,166,0.45),_-4px_-4px_8px_#ffffff] rounded-2xl p-5 w-full max-w-[280px] space-y-3.5 text-left border border-[#E3DFD7]/20">
            <div className="flex justify-between text-[11px] font-mono font-bold text-[#3D271B]">
              <span>Capacity Reserve</span>
              <span className="text-[#ff2300] font-extrabold">84% FREE</span>
            </div>
            <div className="h-3.5 w-full bg-[#F4F2EE] shadow-[inset_2.5px_2.5px_5px_rgba(180,175,166,0.5),_inset_-2.5px_-2.5px_5px_rgba(255,255,255,1)] rounded-full overflow-hidden p-0.5">
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
            <div className="flex justify-between items-center p-3 px-4 rounded-xl bg-[#F4F2EE] shadow-[3.5px_3.5px_7px_rgba(180,175,166,0.45),_-3.5px_-3.5px_7px_#ffffff] border border-[#E3DFD7]/20">
              <span className="text-[#3D271B]">30 units dispatch</span>
              <span className="text-[#3D271B]/60 font-black">€37.50</span>
            </div>
            <div className="flex justify-between items-center p-3 px-4 rounded-xl bg-[#F4F2EE] shadow-[inset_3px_3px_6px_rgba(180,175,166,0.5),_inset_-3px_-3px_6px_#ffffff] text-[#ff2300]">
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
          <div className="w-32 h-32 rounded-full bg-[#F4F2EE] shadow-[10px_10px_20px_rgba(180,175,166,0.5),_-10px_-10px_20px_#ffffff] border border-[#E3DFD7]/30 flex flex-col items-center justify-center p-2 relative">
            <div className="w-24 h-24 rounded-full bg-[#F4F2EE] shadow-[inset_3.5px_3.5px_7px_rgba(180,175,166,0.45),_inset_-3.5px_-3.5px_7px_#ffffff] flex flex-col items-center justify-center text-center">
              <span className="text-base font-black text-[#3D271B] font-mono leading-none font-bold">21 °C</span>
              <span className="text-[8px] text-[#ff2300] font-mono uppercase tracking-wider font-extrabold mt-1">Dry static</span>
            </div>
          </div>
        )
      },
      {
        titleKey: "automatedRefillTitle",
        descKey: "automatedRefillDesc",
        render: () => (
          <div className="w-full max-w-[240px] bg-[#F4F2EE] shadow-[4px_4px_8px_rgba(180,175,166,0.45),_-4px_-4px_8px_#ffffff] rounded-2xl border border-[#E3DFD7]/20 p-5 shrink-0 text-center space-y-4">
            <div>
              <span className="text-xs font-sans font-black text-[#3D271B] block font-bold">Dynamic Kraft Mailer</span>
              <span className="text-[10px] font-mono text-[#3D271B]/50 font-bold mt-0.5 block">10,000 package batch</span>
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
          <div className="bg-[#F4F2EE] rounded-2xl shadow-[4px_4px_8px_rgba(180,175,166,0.45),_-4px_-4px_8px_#ffffff] p-5 w-full max-w-[280px] space-y-3.5 border border-[#E3DFD7]/20 text-left">
            <span className="font-mono text-[10px] font-bold text-[#3D271B]/55 uppercase tracking-wide">Defer balance across:</span>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono font-bold text-center">
              <div className="p-2.5 bg-[#F4F2EE] shadow-[3px_3px_6px_rgba(180,175,166,0.35),_-3px_-3px_6px_rgba(255,255,255,1)] rounded-xl text-[#3D271B]/50 hover:text-[#3D271B] transition-all">30 days</div>
              <div className="p-2.5 bg-[#F4F2EE] shadow-[inset_3px_3px_6px_rgba(180,175,166,0.55),_inset_-3px_-3px_6px_#ffffff] rounded-xl text-[#ff2300] font-black border border-none">120 days</div>
            </div>
          </div>
        )
      },
      {
        titleKey: "payOnDischargeTitle",
        descKey: "payOnDischargeDesc",
        render: () => (
          <div className="bg-[#F4F2EE] shadow-[inset_3.5px_3.5px_7px_rgba(180,175,166,0.45),_inset_-3.5px_-3.5px_7px_#ffffff] rounded-2xl p-5 w-full max-w-[280px] text-left space-y-3.5 border border-none">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#3D271B]/40 font-mono">Latest activity</span>
            <div className="flex items-center justify-between text-xs font-bold font-sans">
              <span className="text-[#3D271B] font-extrabold">Postage release #102</span>
              <span className="text-[#ff2300] font-mono font-black">+ €140</span>
            </div>
          </div>
        )
      },
      {
        titleKey: "transparentPricingTitle",
        descKey: "transparentPricingDesc",
        render: () => (
          <div className="flex items-center gap-2.5 justify-center font-mono font-black text-[#ff2300] bg-[#F4F2EE] shadow-[inset_3.5px_3.5px_7px_rgba(180,175,166,0.5),_inset_-3.5px_-3.5px_7px_#ffffff] rounded-full px-5 py-2.5 text-xs">
            <span>✓ NO PLATFORM DUES</span>
          </div>
        )
      },
      {
        titleKey: "dynamicInvoicesTitle",
        descKey: "dynamicInvoicesDesc",
        render: () => (
          <div className="bg-[#F4F2EE] rounded-2xl shadow-[4px_4px_8px_rgba(180,175,166,0.45),_-4px_-4px_8px_#ffffff] p-4.5 w-full max-w-[280px] flex gap-3.5 items-center border border-[#E3DFD7]/20">
            <div className="w-10 h-10 bg-[#F4F2EE] shadow-[inset_2.5px_2.5px_5px_rgba(180,175,166,0.5),_inset_-2.5px_-2.5px_5px_#ffffff] text-[#3D271B]/60 rounded-xl flex items-center justify-center font-bold text-[10px] font-mono">PDF</div>
            <div className="text-left flex-1 min-w-0">
              <span className="font-mono text-xs font-bold text-[#3D271B] block truncate leading-none font-bold">statement_q2.pdf</span>
              <span className="text-[10px] text-[#3D271B]/50 block mt-1.5 leading-none">Ready for tax filings</span>
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
        <h2 className="font-sans font-black text-3.5xl sm:text-4.5xl text-[#3D271B] tracking-tight leading-none uppercase font-bold">
          {t("sectionTitle")}
        </h2>
        <div className="w-24 h-2 bg-[#F4F2EE] shadow-[inset_2.5px_2.5px_5px_rgba(180,175,166,0.65),inset_-2.5px_-2.5px_5px_#ffffff] rounded-full mx-auto mt-6" />
      </div>

      {/* Symmetric Neumorphic Tab bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-2.5 bg-[#F4F2EE] shadow-[inset_4px_4px_8px_rgba(180,175,166,0.45),_inset_-4px_-4px_8px_#ffffff] rounded-[2rem] max-w-4xl mx-auto mb-14 border border-[#E3DFD7]/20">
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
                  ? "bg-[#F4F2EE] text-[#ff2300] shadow-[inset_3px_3px_6px_rgba(180,175,166,0.65),_inset_-3px_-3px_6px_#ffffff] font-extrabold" 
                  : "bg-transparent text-[#3D271B]/60 hover:text-[#3D271B] hover:shadow-[3px_3px_6px_rgba(180,175,166,0.25),_-3px_-3px_6px_#ffffff]"
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
              <h3 className="font-sans font-black text-[#3D271B] text-[20px] tracking-tight mb-2 font-bold">
                {t(card.titleKey)}
              </h3>
              <p className="text-[#3D271B]/70 text-[13px] leading-relaxed max-w-[340px] mx-auto text-center font-medium">
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
