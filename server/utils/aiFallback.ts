// Highly intelligent local expert fallback engine if the Gemini API credits are exhausted or offline
// Separated to keep routes and layouts modular.

export function getSmartLocalFallbackResponse(message: string, db: any, lang: string): string {
  const msg = message.toLowerCase();
  
  // Choose active language for the fallback response
  if (lang === "ru") {
    if (msg.includes("короб") || msg.includes("корзин") || msg.includes("ящик")) {
      return `📦 **Коробки и упаковка в Capsule Concept:**\n\nМы производим два основных типа премиум-коробок:\n• **Rigid Boxes (Твердые подарочные коробки):** Это прочные премиум-коробки из переплетного картона (толщина 1.5-2 мм), кашированные дизайнерской бумагой. Прекрасно подходят для ювелирных изделий, парфюмерии и дорогих сувениров. Минимальный заказ (MOQ) — **300 шт**.\n• **Folding Boxes (Складные коробки):** Коробки из мелованного картона плотностью 250-350г. Легко собираются, экономичны при транспортировке. MOQ — **500 шт**.\n\nВы можете рассчитать точную стоимость коробки прямо в калькуляторе!`;
    }
    if (msg.includes("пакет") || msg.includes("бумаж") || msg.includes("сумк") || msg.includes("пакеты")) {
      return `🛍️ **Бумажные пакеты:**\n\nМы производим пакеты высочайшего качества по вашим размерам:\n• **Материал:** Мелованная бумага (200-250г), Крафт-бумага (бурая или белая 120г) или текстурная дизайнерская бумага.\n• **Ручки:** Шнур (cord), атласная или репсовая лента, вырубные ручки.\n• **Дополнительно:** Ламинация (матовая/глянцевая), укрепленное дно и ручки.\n• **Минимальный тираж (MOQ):** от **200 шт**.\n\nЦену можно мгновенно узнать, выбрав вкладку "Bags" и указав размеры!`;
    }
    if (msg.includes("минимал") || msg.includes("количеств") || msg.includes("moq")) {
      return `📊 **Минимальные тиражи (MOQ) для заказа:**\n\n• **Бумажные пакеты:** от **200 шт**.\n• **Складные коробки:** от **500 шт**.\n• **Премиум-коробки (Rigid):** от **300 шт**.\n• **Ленты с печатью:** от **100 метров**.\n• **Стикеры и наклейки:** от **500 шт**.\n• **Визитки и открытки:** от **100 шт**.\n\nМы оптимизируем стоимость за единицу при увеличении тиража. Попробуйте изменить количество в калькуляторе, чтобы увидеть оптовую скидку!`;
    }
    if (msg.includes("печат") || msg.includes("краск") || msg.includes("нанесени") || msg.includes("шелког")) {
      return `🎨 **Способы нанесения и печати:**\n\n• **Шелкография (Silk Screen):** Идеально для насыщенных цветов на крафт-бумаге или дизайнерском картоне. MOQ — **100 шт**.\n• **Офсетная печать (Offset):** Полноцветная печать высочайшего качества для больших тиражей бумажных пакетов и коробок (от **500 шт**).\n• **Тиснение фольгой (Foil Stamping):** Золотая, серебряная или цветная фольга. Придает премиальный металлический блеск.\n• **УФ-лак (Spot UV):** Выборочный лак для создания эффекта глянцевых деталей на матовой поверхности.`;
    }
    if (msg.includes("дизайн") || msg.includes("макет") || msg.includes("лого")) {
      return `🖌️ **Дизайн и макеты:**\n\n• Если у вас есть готовый векторный макет (в форматах AI, PDF, CDR, EPS), мы напечатаем его без дополнительных наценок.\n• В случае отсутствия макета, наши профессиональные дизайнеры помогут разработать его под технические требования Capsule Concept всего за **5,000 ֏**.\n• Исходный файл дизайна передается вам для дальнейшего использования!`;
    }
    if (msg.includes("бумаг") || msg.includes("картон") || msg.includes("крафт")) {
      return `📄 **Материалы и бумага:**\n\nМы предлагаем только качественную сертифицированную продукцию:\n• **Мелованная бумага (Coated Paper):** Плотностью 200г, 250г. Отлично подходит для полноцветной печати и обязательно ламинируется.\n• **Крафт-бумага (Kraft Paper):** Белый крафт (120г) или бурый крафт (120г). Экологичный выбор, отлично смотрится с шелкографией.\n• **Дизайнерская бумага (Fedrigoni, Imitlin и др.):** Имеет уникальную текстуру (лен, верже) и глубокие насыщенные цвета. Защищена от царапин.`;
    }
    if (msg.includes("лент") || msg.includes("лента") || msg.includes("атлас")) {
      return `🎀 **Брендированные ленты с нанесением:**\n\nМы предлагаем репсовые и атласные (сатиновые) ленты различных ширин:\n• **Ширина:** 1.5 см, 2.0 см, 2.5 см, 3.0 см и 4.0 см.\n• **Печать:** Нанесение логотипа в один или несколько цветов (включая золото и серебро шелкографией).\n• **MOQ:** Минимальный рулон — всего **100 метров**!`;
    }
    return `👩‍💼 **Благодарим вас за обращение в Capsule Concept!**\n\nЯ ваш интеллектуальный виртуальный помощник. Наш основной сервер искусственного интеллекта загружен или исчерпал лимит запросов, но я здесь, чтобы ответить на любые технические вопросы о нашей продукции.\n\n**О чем вы хотите узнать?**\n• О минимальных количествах заказа (**MOQ**)\n• О технологии печати (**УФ-лак, Офсет, Фольга**)\n• О типах премиум-пакетов и коробок\n• Об использовании промо-кодов в корзине\n\nПожалуйста, выберите нужную вкладку на сайте для расчета цен в реальном времени!`;
  }

  if (lang === "ar") {
    if (msg.includes("صندوق") || msg.includes("صناديق") || msg.includes("كرتون")) {
      return `📦 **الصناديق والتغليف في Capsule Concept:**\n\nنقوم بإنتاج فئتين رئيسيتين من الصناديق الفاخرة:\n• **صناديق صلبة (Rigid Boxes):** مصنوعة من كرتون سميك قوي (1.5-2 مم)، مغطى بورق تصميم فاخر. مثالية للمجوهرات، العطور، والهدايا الثمينة. الحد الأدنى للطلب (MOQ) هو **300 قطعة**.\n• **صناديق قابلة للطي (Folding Boxes):** مصنوعة من ورق كرتون مصقول (250-350 جرام). ممتازة واقتصادية للنقل والتخزين. الحد الأدنى للطلب (MOQ) هو **500 قطعة**.\n\nيمكنكم حساب السعر الدقيق مباشرة في قسم "Boxes" في الحاسبة!`;
    }
    if (msg.includes("حقيبة") || msg.includes("حقائب") || msg.includes("كيس") || msg.includes("أكياس")) {
      return `🛍️ **حقائب ورقية فاخرة حسب مقاساتكم:**\n\nنقدم مجموعة واسعة من الحقائب الورقية المخصصة للعلامات التجارية:\n• **أنواع الورق:** ورق مصقول (Coated) 200-250 جم، كرافت صديق للبيئة (أبيض أو بني) 120 جم، أو ورق تصميم فاخر ذو ملمس خاص.\n• **المقابض:** حبل (cord)، شريط ستان أو ريبس، أو مقبض مقصوص.\n• **إضافات:** مغلفة إلزامياً (مات/لامع)، قاع ومقابض معززة ومقواة.\n• **الحد الأدنى للطلب (MOQ):** يبدأ من **200 قطعة**.\n\nلمعرفة السعر، انتقل إلى قسم "Bags" وأدخل مقاساتك بشكل مباشر.`;
    }
    if (msg.includes("أقل") || msg.includes("كمية") || msg.includes("الحد") || msg.includes("الأدنى")) {
      return `📊 **الحد الأدنى لكميات الطلب للمنتجات (MOQ):**\n\n• **حقائب ورقية:** تبدأ من **200 قطعة**\n• **صناديق قابلة للطي:** تبدأ من **500 قطعة**\n• **صناديق هدايا صلبة:** تبدأ من **300 قطعة**\n• **أشرطة مطبوعة:** تبدأ من **100 متر**\n• **ملصقات ونقوش:** تبدأ من **500 قطعة**\n• **بطاقات عمل وبطاقات ترحيب:** تبدأ من **100 قطعة**\n\nكلما زادت كمية الطلب، انخفض سعر القطعة الواحدة بشكل ملحوظ. جرب تغيير الكمية في الحاسبة لمشاهدة خصومات الجملة!`;
    }
    if (msg.includes("طباعة") || msg.includes("مեթոդ") || msg.includes("ألوان") || msg.includes("حبر")) {
      return `🎨 **تقنيات الطباعة المؤثرة والحديثة:**\n\n• **طباعة أوفست (Offset):** توفر دقة ألوان استثنائية وتفاصيل دقيقة. تستخدم للكميات الكبيرة (تبدأ من 500 قطعة).\n• **طباعة سلك سكرين (Silk Screen):** مثالية للشعارات ذات الألوان الكثيفة والمشبعة على أوراق كرافت أو الورق الملون الداكن. الـ MOQ هو **100 قطعة** فقط.\n• **الطباعة الحرارية البارزة (Foil Stamping):** ذهبي، فضي، أو نحاسي معدني لامع يضفي لمسة فخامة لشعارك.\n• **Spot UV (طلاء لميع تخصصي):** طلاء موضعي لامع يخلق تبايناً رائعاً على الأسطح المطفية (Matte).`;
    }
    if (msg.includes("تصميم") || msg.includes("شعار") || msg.includes("ملف") || msg.includes("مակետ")) {
      return `🖌️ **خدمات التصميم والقوالب الجاهزة:**\n\n• إذا كان لديك تصميم فيكتور جاهز (بصيغ AI, PDF, EPS, CDR)، تتم الطباعة دون أي رسوم إضافية للتصميم.\n• إذا لم يكن لديك تصميم جاهز، فإن مصممينا هنا لمساعدتك في إنشاء تصميم مناسب لمتطلبات الإنتاج الفنية مقابل **5,000 درام ֏** فقط.\n• يتم تسليم ملف الفيكتور النهائي لك بالكامل.`;
    }
    if (msg.includes("ورق") || msg.includes("مواد") || msg.includes("ورق كرافت")) {
      return `📄 **خيارات ممتازة من الأوراق والمواد:**\n\n• **ورق مصقول كوشيه (Coated Paper):** بوزن 200 جم و250 جم، تظهر الطباعة عليه حية ومشبعة. مغطى بطبقة لامع أو مات لحمايته.\n• **ورق كرافت البيئي (Kraft Paper):** كرافت أبيض أو بني بوزن 120 جم، يتميز بملمسه الطبيعي ومظهره الصديق للبيئة.\n• **ورق تصميم فاخر:** أوراق ملمسية من أشهر المصنعين الإيطاليين (Fedrigoni) تتميز بمقاومتها للخدش وملمسها الفاخر مثل الكتان أو الحرير.`;
    }
    if (msg.includes("شريط") || msg.includes("أشرطة") || msg.includes("حرير")) {
      return `🎀 **أشرطة فاخرة مطبوعة بشعارك:**\n\nنقدم أشرطة ريبس وحرير عالية الجودة مطبوع عليها شعار مشروعك:\n• **العرض:** 1.5 سم، 2.0 سم، 2.5 سم، 3.0 سم، و 4.0 سم.\n• **الطباعة:** طباعة سلك سكرين باللون الذهبي، الفضي، أو أي لون آخر.\n• **الحد الأدنى للطلب (MOQ):** يبدأ من **100 متر** (بكرة واحدة) فقط!`;
    }
    if (msg.includes("ملصق") || msg.includes("لاصق") || msg.includes("ملصقات")) {
      return `🏷 **الملصقات والأنقوش ذاتية الالتصاق:**\n\n• **الأنواع:** ملصقات ورقية، بلاستيكية مقاومة للماء (شفافة، بيضاء أو مطفية)، بالإضافة لملصقات فضية أو ذهبية لامعة.\n• **الأشكال:** دائرية، مربعة، أو أي شكل مخصص ذو قطع تعرجي.\n• **الحد الأدنى (MOQ):** يبدأ من **500 قطعة**.`;
    }
    return `👩‍💼 **مرحباً بكم في مركز دعم Capsule Concept!**\n\nأنا مساعدكم الافتراضي الذكي. خادم الذكاء الاصطناعي الرئيسي لدينا يخضع لعملية تحديث فنية حالياً، لكني هنا ومستعد للإجابة على أي استفسار فني حول منتجاتنا.\n\n**يمكنكم سؤالي عن:**\n• الحد الأدنى لكميات الطلب (**MOQ**)\n• أنواع الورق، الأشرطة، أو الكرتون\n• تأثيرات بعد الطباعة (**الرقائق الذهبية، ورنيش Spot UV**)\n• أوقات الإنتاج والتوصيل\n\nكما يمكنكم إدخال الرموز الترويجية النشطة هنا للحصول على خصومات مباشرة في السلة!`;
  }

  if (lang === "en") {
    if (msg.includes("box") || msg.includes("boxes") || msg.includes("rigid")) {
      return `📦 **Boxes and Packaging at Capsule Concept:**\n\nWe specialize in custom premium box manufacturing:\n• **Rigid Gift Boxes:** Premium thick cardboard structure (1.5mm - 2mm), wrapped in high-end design paper. Ideal for luxury goods, jewelry, and gifts. MOQ is **300 pcs**.\n• **Folding Boxboard Cartons:** Lightweight, folding boxes made of 250g-350g coated paperboard, easy to ship and store assemble. MOQ is **500 pcs**.\n\nYou can instantly calculate accurate pricing in our live calculator!`;
    }
    if (msg.includes("bag") || msg.includes("bags") || msg.includes("kraft")) {
      return `🛍️ **Premium Custom Shopping Bags:**\n\nTailored perfectly for your brand with the following specs:\n• **Paper types:** Coated Art Paper (200-250g), Craft Paper (Brown/White 120g), or textured specialty papers.\n• **Handles:** Premium braided cord, satin/grosgrain ribbon, or die-cut flat handles.\n• **Min Quantity (MOQ):** Starts at **200 pieces**.\n\nAdjust the size and finishes in the calculator to see real-time wholesale rates!`;
    }
    if (msg.includes("moq") || msg.includes("minimum") || msg.includes("quantity") || msg.includes("count")) {
      return `📊 **Minimum Order Quantities (MOQ):**\n\n• **Paper Shopping Bags:** from **200 pcs**.\n• **Folding Cartons:** from **500 pcs**.\n• **Rigid Gift Boxes:** from **300 pcs**.\n• **Custom Printed Ribbons:** from **100 meters**.\n• **Stickers & Decals:** from **500 pcs**.\n• **Business & Greeting Cards:** from **100 pcs**.\n\nBulk discount scales are completely interactive in the calculator slots above. Save more with higher tiers!`;
    }
    if (msg.includes("print") || msg.includes("method") || msg.includes("ink") || msg.includes("colors")) {
      return `🎨 **Printing Technologies & Enhancements:**\n\n• **Offset Printing:** Highest quality crisp detail colors. Perfect for full color bags and boxes (MOQ **500 pcs**).\n• **Silkscreen Printing:** Best for craft cardboard and deep colored boutique papers. Excellent matte finish density. MOQ is **100 pcs**.\n• **Foil Hot Stamping:** Elegant metallic gold, chrome silver, or rose gold shiny foil stamp.\n• **Spot UV Gloss Varnish:** Local transparent heavy coating contrasting on top of matte backgrounds.`;
    }
    if (msg.includes("design") || msg.includes("layout") || msg.includes("logo") || msg.includes("art")) {
      return `🖌️ **Bespoke Design Services & Vector Prep:**\n\n• Ready vector designs (formats AI, PDF, EPS, CDR) are printed with no design fee added.\n• Don't have a print-ready layout? Our graphic designers will transform your logo/ideas into production-ready specifications for only **5,000 ֏**.\n• You get full ownership files of the created master vector vector assets.`;
    }
    if (msg.includes("paper") || msg.includes("cardboard") || msg.includes("material")) {
      return `📄 **Eco-Friendly & Premium Materials:**\n\n• **Art Coated Paper (Matte/Gloss):** 200g-250g, sleek, uniform structure, always finished with protective lamination.\n• **Kraft Paper:** White (120g) or unbleached Brown (120g), natural organic texture with pure fibrous fibers.\n• **Specialty/Textured Fine Papers:** Imported Italian (e.g. Fedrigoni) textured boards with elegant linen, canvas, or leather textures. Protects against surface abrasion.`;
    }
    if (msg.includes("ribbon") || msg.includes("tape") || msg.includes("handle")) {
      return `🎀 **Bespoke Custom Satin & Grosgrain Ribbons:**\n\nWe print high-fidelity vector brandings on luxury satin or grosgrain options:\n• **Width Sizes:** 1.5 cm, 2.0 cm, 2.5 cm, 3.0 cm and 4.0 cm.\n• **Print finishes:** Screen-printed metallic gold, silver, or colored finishes.\n• **Min run (MOQ):** Starts at just **100 meters** (1 full roll)!`;
    }
    return `👩‍💼 **Welcome to Capsule Concept Support!**\n\nI am your intellectual AI Assistant. Our main AI model is currently experiencing high load or credits exhaustion, but I am ready here locally to address any technical query regarding print, papers, ribbons, boxes, bag layout, and sizes.\n\n**Select from these interest areas or type any question:**\n• **MOQs (Minimum order sizes)**\n• **Printing Techniques (Spot UV, Foil Stamping, Offset)**\n• **Custom Box Types vs Boutique Bags**\n• **Promo Codes discount activations**\n\nPlease feel free to use the specific calculator tabs for live pricing!`;
  }

  // Default Armenian helper fallback logic
  if (msg.includes("տուփ") || msg.includes("տուփեր") || msg.includes("կոշտ")) {
    return `📦 **Տուփեր և փաթեթավորում Capsule Concept-ում՝**\n\nՄենք արտադրում ենք երկու հիմնական դասի պրեմիում տուփեր՝\n• **Rigid Boxes (Կոշտ նվեր-տուփեր)՝** Պատրաստված են հաստ ստվարաթղթից (1.5-2 մմ), որը պատվում է բարձրորակ դիզայներական թղթով։ Իդեալական է զարդերի, օծանելիքների և թանկարժեք նվերների համար։ MOQ-ն՝ **300 հատ**։\n• **Folding Boxes (Ծալովի տուփեր)՝** Պատրաստվում են կավճապատ ստվարաթղթից (250-350գ)։ Շատ հարմար են և տնտեսող տրանսպորտավորման համար։ MOQ-ն՝ **500 հատ**։\n\nԴուք կարող եք հաշվարկել ճշգրիտ արժեքը կալկուլյատորում!`;
  }
  if (msg.includes("տոպրակ") || msg.includes("տոպրակներ") || msg.includes("պայուսակ")) {
    return `🛍️ **Բարձրակարգ թղթե տոպրակներ ըստ Ձեր չափսերի՝**\n\nՄենք առաջարկում ենք բրենդավորված տոպրակների լայն ընտրանի՝\n• **Թղթի տեսակներ՝** Կավճապատ (Coated) 200-250գ, էկո-կրաֆթ (սպիտակ կամ շագանակագույն) 120գ, կամ դիզայներական ֆակտուրային թղթեր։\n• **Բռնակներ՝** Պարան (cord), ատլասե կամ ռեպսե ժապավեն, կամ կտրվածքով բռնակ։\n• **Հավելյալ՝** Պարտադիր լամինացիա (փայլուն/մատային), ամրացված հատակ և բռնակային հատվածներ։\n• **Նվազագույն քանակ (MOQ):** սկսած **200 հատից**։\n\nԳինը հաշվարկելու համար անցեք համապատասխան բաժին և մուտքագրեք Ձեր չափսերը։`;
  }
  if (msg.includes("քանակ") || msg.includes("նվազագույն") || msg.includes("moq") || msg.includes("հատ")) {
    return `📊 **Արտադրանքի նվազագույն պատվերի քանակներ (MOQ)՝**\n\n• **Թղթե տոպրակներ՝** սկսած **200 հատից**\n• **Ծալովի տուփեր՝** սկսած **500 հատից**\n• **Կոշտ նվեր-տուփեր (Rigid)՝** սկսած **300 հատից**\n• **Տպագրությամբ ժապավեններ՝** սկսած **100 մետրից**\n• **Սթիքերներ և ինքնակպչուն պիտակներ՝** սկսած **500 հատից**\n• **Այցեքարտեր և բացիկներ՝** սկսած **100 հատից**\n\nՈրքան մեծ է պատվերի քանակը, այնքան զգալիորեն նվազում է մեկ հատի արժեքը։ Փորձեք փոխել քանակը կալկուլյատորում՝ մեծածախ զեղչերը տեսնելու համար։`;
  }
  if (msg.includes("տպագր") || msg.includes("լաք") || msg.includes("մեթոդ") || msg.includes("գույն") || msg.includes("ներկ") || msg.includes("շելկո")) {
    return `🎨 **Տպագրական տեխնոլոգիաներ և էֆեկտներ՝**\n\n• **Օֆսեթ տպագրություն (Offset)՝** Ապահովում է գույների բացառիկ ճշգրտություն և մանրամասնություն։ Կիրառվում է մեծ տպաքանակների համար (սկսած 500 հատից)։\n• **Շելկոգրաֆիա (Silk Screen)՝** Իդեալական է կրաֆթ կամ մուգ գունավոր թղթերի վրա խիտ և հագեցած գույներով լոգոների տպագրության համար։ MOQ-ն ընդամենը **100 հատ** է։\n• **Ֆոյլ տաք տպագրություն (Foil Stamping)՝** Ոսկեգույն, արծաթագույն կամ պղնձագույն փայլուն մետալիկ էֆեկտ Ձեր լոգոյի համար։\n• **Spot UV (Ուլտրամանուշակագույն լաք)՝** Տեղային փայլուն լաքապատում, որը ստեղծում է շքեղ հակադրություն մատային մակերեսի վրա։`;
  }
  if (msg.includes("դիզայն") || msg.includes("լոգո") || msg.includes("մակետ") || msg.includes("ֆայլ")) {
    return `🖌️ **Դիզայնի ծառայություններ և պատրաստի մակետներ՝**\n\n• Եթե ունեք պատրաստի վեկտորային մակետ (ֆորմատներ՝ AI, PDF, EPS, CDR), տպագրությունն իրականացվում է առանց որևէ հավելավճարի։\n• Պատրաստի մակետ չունենալու դեպքում, մեր դիզայներները կօգնեն ստեղծել այն ընդամենը **5,000 ֏** արժեքով՝ համապատասխանեցնելով արտադրության բոլոր տեխնիկական պահանջներին։\n• Վերջնական վեկտորային ֆայլը տրամադրվում է Ձեզ։`;
  }
  if (msg.includes("թուղթ") || msg.includes("նյութ") || msg.includes("ստվարաթղթ") || msg.includes("կրաֆտ")) {
    return `📄 **Բարձրակարգ թղթերի և նյութերի ընտրանի՝**\n\n• **Կավճապատ թուղթ (Chromo/Coated)՝** 200գ և 250գ խտության, որի վրա տպագրությունը ստացվում է վառ և հագեցած։ Պարտադիր լամինացվում է պաշտպանության համար։\n• **Էկո-Կրաֆթ թուղթ՝** Սպիտակ կամ դեղնավուն (շագանակագույն) 120գ խտության, որն ունի թելքավոր բնական ֆակտուրա և շատ էկոլոգիական է։\n• **Դիզայներական թղթեր՝** Տարբեր հայտնի իտալական արտադրողների (Fedrigoni) ֆակտուրային թղթեր, որոնք ունեն մետաքսանման մակերես, կտավի կամ կաշվի նմանվող նախշեր և պաշտպանված են քերծվելուց։`;
  }

  return `👩‍💼 **Ողջույն! Բարի գալուստ Capsule Concept-ի աջակցման կենտրոն՝**\n\nԵս Ձեր վիրտուալ AI օգնականն եմ։ Մեր AI հիմնական սերվերը ժամանակավորապես ծանրաբեռնված է, սակայն ես տեղային համակարգով կարող եմ օգնել Ձեզ ցանկացած տեխնիկական հարցում։\n\n**Ինչի՞ մասին կցանկանայիք տեղեկանալ՝**\n• Արտադրանքների նվազագույն քանակների պատվերների (**MOQ**)\n• Տպագրության տեխնոլոգիաների (**Spot UV, ֆոյլ տաք տպագրություն, օֆսեթ**)\n• Պրեմիում տոպրակների և կոշտ տուփերի առանձնահատկությունների\n• Զեղչային պրոմո-կոդերի և զամբյուղից օգտվելու կանոնների\n\nԿարող եք նաև օգտվել համապատասխան կալկուլյատորների բաժիններից՝ պատվերների արժեքները տեղում հաշվարկելու համար։`;
}
