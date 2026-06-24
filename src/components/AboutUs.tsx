import React from "react";
import { motion } from "motion/react";
import { Shield, Sparkles, Compass, Users, Globe, ArrowRight } from "lucide-react";

interface AboutUsProps {
  locale: "hy" | "en" | "ru";
  setCurrentView: (view: any) => void;
}

export default function AboutUs({ locale, setCurrentView }: AboutUsProps) {
  // Localization dictionary
  const t = {
    title: {
      en: "About The Capsule Lab",
      hy: "The Capsule Lab-ի Մասին",
      ru: "О компании The Capsule Lab"
    },
    subtitle: {
      en: "Where engineering meets art to create the ultimate luxury packaging solutions.",
      hy: "Որտեղ ճարտարագիտությունը հանդիպում է արվեստին՝ ստեղծելու շքեղ փաթեթավորման լուծումներ։",
      ru: "Где инженерное искусство встречается с дизайном для создания премиальной упаковки."
    },
    historyTitle: {
      en: "Our Story",
      hy: "Մեր Պատմությունը",
      ru: "Наша История"
    },
    historyText1: {
      en: "Founded on the principles of Swiss-inspired CAD calibration and architectural precision, The Capsule Lab has redefined custom box manufacturing. What started as a structural engineering studio in Yerevan has grown into a leading technology-driven packaging laboratory.",
      hy: "Հիմնադրվելով շվեյցարական ոգեշնչմամբ CAD տրամաչափման և ճարտարապետական ճշգրտության սկզբունքների վրա՝ The Capsule Lab-ը վերաիմաստավորել է տուփերի պատրաստումը: Այն, ինչ սկսվեց Երևանում որպես կառուցվածքային ինժեներական ստուդիա, վերածվել է տեխնոլոգիական առաջատար փաթեթավորման լաբորատորիայի:",
      ru: "Основанная на принципах швейцарской точности калибровки CAD и архитектурного дизайна, компания The Capsule Lab переосмыслила производство индивидуальной упаковки. То, что начиналось как конструкторское бюро в Ереване, выросло в передовую упаковочную лабораторию."
    },
    historyText2: {
      en: "We don't just manufacture boxes; we engineer tactile experiences. By blending high-speed laser cutting, luxury textured cardstocks, and our patented interactive 3D configurator, we empower creators to build packaging that commands attention and elevates physical products.",
      hy: "Մենք ոչ միայն տուփեր ենք արտադրում, այլև նախագծում ենք շոշափելի զգացողություններ: Համատեղելով լազերային արագ կտրումը, շքեղ տեքստուրային ստվարաթղթերն ու մեր արտոնագրված ինտերակտիվ 3D կոնֆիգուրատորը՝ մենք հնարավորություն ենք տալիս ստեղծել փաթեթավորում, որը գրավում է ուշադրություն և բարձրացնում արտադրանքի արժեքը:",
      ru: "Мы не просто производим коробки — мы создаем тактильные ощущения. Сочетая высокоскоростную лазерную резку, премиальные дизайнерские картоны и наш запатентованный интерактивный 3D-конфигуратор, мы помогаем брендам создавать упаковку, которая приковывает взгляды."
    },
    statTitle1: { en: "Accuracy", hy: "Ճշգրտություն", ru: "Точность" },
    statVal1: { en: "0.1mm", hy: "0.1մմ", ru: "0.1мм" },
    statTitle2: { en: "Eco Materials", hy: "Էկո Նյութեր", ru: "Эко Материалы" },
    statVal2: { en: "100%", hy: "100%", ru: "100%" },
    statTitle3: { en: "Global Delivery", hy: "Առաքում", ru: "Доставка" },
    statVal3: { en: "Active", hy: "Ակտիվ", ru: "Активно" },

    pillarsTitle: {
      en: "Our Core Pillars",
      hy: "Մեր Հիմնական Սկզբունքները",
      ru: "Наши Ключевые Ценности"
    },
    pillar1Title: {
      en: "CAD Calibration",
      hy: "CAD Կալիբրացիա",
      ru: "Калибровка CAD"
    },
    pillar1Text: {
      en: "Every design is calculated down to 0.1mm, ensuring flawless folding structure, interlocking tabs, and tight lids without any adhesive dependency.",
      hy: "Յուրաքանչյուր դիզայն հաշվարկվում է մինչև 0.1 մմ ճշգրտությամբ՝ ապահովելով անթերի ծալման կառուցվածք և կափարիչների ամուր փակում առանց սոսնձի:",
      ru: "Каждый макет рассчитывается с точностью до 0.1 мм, гарантируя идеальную сборку, прочные замки и плотное прилегание крышек без клея."
    },
    pillar2Title: {
      en: "Aesthetic Luxury",
      hy: "Էսթետիկ Շքեղություն",
      ru: "Эстетика и Роскошь"
    },
    pillar2Text: {
      en: "We curate the world's finest linen-textured, matte soft-touch, and hot-foil stamped boards to evoke absolute sophistication upon contact.",
      hy: "Մենք ընտրում ենք աշխարհի լավագույն կտավային տեքստուրայով, փայլատ և ֆոլգապատ ստվարաթղթերը՝ ապահովելով բացառիկ նրբություն շոշափելիս:",
      ru: "Мы отбираем лучшие дизайнерские материалы с текстурой льна, матовым покрытием soft-touch и тиснением фольгой для незабываемого первого контакта."
    },
    pillar3Title: {
      en: "Zero-Waste Ecology",
      hy: "Էկոլոգիական Մաքրություն",
      ru: "Экология и Чистота"
    },
    pillar3Text: {
      en: "Sustainable forestry materials, vegan soy inks, and optimized digital cutting paths that minimize industrial trim and waste material.",
      hy: "Կայուն անտառային նյութեր, սոյայի հիմքով էկո ներկեր և օպտիմալացված կտրում, որոնք նվազագույնի են հասցնում արտադրական թափոնները:",
      ru: "Материалы из возобновляемых лесов, веганские соевые чернила и оптимизированный раскрой, снижающий технологические отходы до нуля."
    },
    ctaTitle: {
      en: "Ready to start your premium packaging project?",
      hy: "Պատրա՞ստ եք սկսել ձեր շքեղ փաթեթավորման նախագիծը:",
      ru: "Готовы создать премиальную упаковку для вашего бренда?"
    },
    ctaBtn: {
      en: "Open Configurator",
      hy: "Բացել Կոնֆիգուրատորը",
      ru: "Открыть Конфигуратор"
    }
  };

  const currentT = (key: keyof typeof t) => {
    return t[key][locale] || t[key]["en"];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 }
    }
  } as const;

  return (
    <div className="w-full bg-[#f0f2f5] py-12 px-4 sm:px-6 lg:px-8 xl:px-12 selection:bg-[#FF2300]/10 select-none">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Header Breadcrumbs / Indicator */}
        <div className="mb-10 flex items-center justify-start gap-2">
          <span className="text-[9px] font-mono font-bold tracking-widest text-[#FF2300] uppercase bg-[#FF2300]/5 px-3 py-1 rounded-full border border-[#FF2300]/10 shadow-[sm]">
            Laboratory Profile
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF2300]"></span>
          <span className="text-[9px] font-mono tracking-wider text-gray-500 uppercase font-bold">
            {locale === "hy" ? "Մեր Մասին" : locale === "ru" ? "О нас" : "About Us"}
          </span>
        </div>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-black text-[#1a1c1d] tracking-tight mb-6">
            {currentT("title")}
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-sans text-gray-500 max-w-4xl leading-relaxed font-semibold">
            {currentT("subtitle")}
          </p>
        </motion.div>

        {/* Bento-style Story block */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20"
        >
          {/* Main Story Text (Large Block) */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-7 bg-[#f0f2f5] rounded-[2.5rem] p-8 sm:p-10 md:p-12 shadow-[8px_8px_16px_#d1d9e6,_-8px_-8px_16px_#ffffff] border border-white/60 text-left flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-xl bg-[#f0f2f5] shadow-[inset_2px_2px_4px_#d1d9e6,_inset_-2px_-2px_4px_#ffffff] flex items-center justify-center text-[#FF2300]">
                  <Sparkles size={14} />
                </div>
                <h2 className="text-xl sm:text-2xl font-sans font-extrabold text-[#1a1c1d] tracking-tight">
                  {currentT("historyTitle")}
                </h2>
              </div>
              <div className="space-y-6 text-gray-600 text-xs sm:text-sm leading-relaxed font-semibold">
                <p>{currentT("historyText1")}</p>
                <p>{currentT("historyText2")}</p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-10 border-t border-gray-200/50 mt-8">
              <div>
                <span className="block text-lg sm:text-2xl font-sans font-black text-[#FF2300] tracking-tight">
                  {currentT("statVal1")}
                </span>
                <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                  {currentT("statTitle1")}
                </span>
              </div>
              <div>
                <span className="block text-lg sm:text-2xl font-sans font-black text-[#FF2300] tracking-tight">
                  {currentT("statVal2")}
                </span>
                <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                  {currentT("statTitle2")}
                </span>
              </div>
              <div>
                <span className="block text-lg sm:text-2xl font-sans font-black text-[#FF2300] tracking-tight">
                  {currentT("statVal3")}
                </span>
                <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                  {currentT("statTitle3")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Aesthetic Showcase Photo Box (Right Block) */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 h-[320px] lg:h-auto rounded-[2.5rem] bg-[#f0f2f5] p-3 shadow-[8px_8px_16px_#d1d9e6,_-8px_-8px_16px_#ffffff] border border-white/60 overflow-hidden relative group"
          >
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPD-IJDqpfFK2SPK7IYj9I0YYP8N5aw-h6fMzbHtINPvxtpHeqpFpwfqQhuXPqJct83MNBU33NGbUTEThXelAYYE31DGyKW0dtA97IX8UMNR76n6IvTtw-tQvJlTrWFv1JiCuUVgMspCNzBNB_ZsAOMMMsdARkeDbGOz_1DiwwfWVnesWEu5zyOrAbZgzGHbhZOR3Br8_eYgolzrWkCZgVIQ4O_58itEKo0iAOkIWGKgB2jvksCe5iMe3rOuYnnPeRCuTjgA0PMuV_" 
              alt="Premium laboratory craft"
              className="w-full h-full object-cover rounded-[2rem] filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent p-8 flex flex-col justify-end text-left pointer-events-none">
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#FF2300] bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gray-100/10 shadow-md self-start mb-2.5 uppercase">
                Yerevan Workshop
              </span>
              <p className="text-[10px] text-white/90 font-sans tracking-wide leading-relaxed font-bold">
                {locale === "hy" 
                  ? "Յուրաքանչյուր արտադրանք հավաքվում և ստուգվում է մեր լաբորատորիայում:" 
                  : locale === "ru" 
                    ? "Каждое изделие проходит ручную проверку качества в нашей мастерской." 
                    : "Every custom box is calibrated, structural-tested, and hand-inspected."}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Core Pillars Grid */}
        <div className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-left mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-sans font-black text-[#1a1c1d] tracking-tight">
              {currentT("pillarsTitle")}
            </h2>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
          >
            {/* Pillar 1 */}
            <motion.div 
              variants={itemVariants}
              className="bg-[#f0f2f5] p-8 rounded-3xl shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#ffffff] border border-white/40 flex flex-col justify-between h-full"
            >
              <div>
                <div className="h-10 w-10 rounded-2xl bg-white shadow-[2px_2px_4px_#d1d9e6,_-2px_-2px_4px_#ffffff] flex items-center justify-center text-[#FF2300] mb-6">
                  <Compass size={16} />
                </div>
                <h3 className="text-base sm:text-lg font-sans font-black text-[#1a1c1d] tracking-tight mb-3">
                  {currentT("pillar1Title")}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                  {currentT("pillar1Text")}
                </p>
              </div>
            </motion.div>

            {/* Pillar 2 */}
            <motion.div 
              variants={itemVariants}
              className="bg-[#f0f2f5] p-8 rounded-3xl shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#ffffff] border border-white/40 flex flex-col justify-between h-full"
            >
              <div>
                <div className="h-10 w-10 rounded-2xl bg-white shadow-[2px_2px_4px_#d1d9e6,_-2px_-2px_4px_#ffffff] flex items-center justify-center text-[#FF2300] mb-6">
                  <Shield size={16} />
                </div>
                <h3 className="text-base sm:text-lg font-sans font-black text-[#1a1c1d] tracking-tight mb-3">
                  {currentT("pillar2Title")}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                  {currentT("pillar2Text")}
                </p>
              </div>
            </motion.div>

            {/* Pillar 3 */}
            <motion.div 
              variants={itemVariants}
              className="bg-[#f0f2f5] p-8 rounded-3xl shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#ffffff] border border-white/40 flex flex-col justify-between h-full"
            >
              <div>
                <div className="h-10 w-10 rounded-2xl bg-white shadow-[2px_2px_4px_#d1d9e6,_-2px_-2px_4px_#ffffff] flex items-center justify-center text-[#FF2300] mb-6">
                  <Globe size={16} />
                </div>
                <h3 className="text-base sm:text-lg font-sans font-black text-[#1a1c1d] tracking-tight mb-3">
                  {currentT("pillar3Title")}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                  {currentT("pillar3Text")}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* CTA Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-[2.5rem] bg-[#0A0A0B] text-white p-8 sm:p-12 md:p-16 text-center relative overflow-hidden shadow-[12px_12px_24px_rgba(209,217,230,0.5)] border border-white/10"
        >
          <div className="absolute inset-0 bg-[#FF2300]/5 opacity-10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-sans font-black text-white tracking-tight mb-6 leading-tight">
              {currentT("ctaTitle")}
            </h2>
            <button
              onClick={() => {
                setCurrentView("calculator");
                window.history.pushState({}, "", "/calculator");
              }}
              className="cursor-pointer flex items-center gap-2 px-8 py-4 bg-[#FF2300] hover:bg-[#e61f00] text-white text-[11px] sm:text-xs font-black uppercase tracking-widest rounded-full shadow-lg border border-white/20 transition-all active:scale-95"
            >
              <span>{currentT("ctaBtn")}</span>
              <ArrowRight size={13} className="stroke-[2.5]" />
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
