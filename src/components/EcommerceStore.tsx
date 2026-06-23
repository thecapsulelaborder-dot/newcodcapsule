import React, { useState } from "react";
import { 
  Search, 
  ShoppingCart, 
  ArrowRight, 
  Tag, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Leaf, 
  Sparkles, 
  RotateCcw,
  Shirt,
  Coffee,
  ShoppingBag,
  Gift,
  Flame,
  Home,
  Laptop,
  Truck,
  Landmark
} from "lucide-react";

interface FeaturedProduct {
  id: string;
  nameHy: string;
  nameRu: string;
  nameEn: string;
  minQtyTextHy: string;
  minQtyTextRu: string;
  minQtyTextEn: string;
  tagHy: string;
  tagRu: string;
  tagEn: string;
  secondaryTagHy?: string;
  secondaryTagRu?: string;
  secondaryTagEn?: string;
  image: string;
  categoryId: string;
  active: boolean;
  price?: number;
  descHy?: string;
  descRu?: string;
  descEn?: string;
  
  customisation?: "custom" | "plain" | "pre_printed";
  industry?: string[];
  pkgType?: "shipping" | "product";
  sustainability?: string[];
  collections?: string[];
  useCases?: string[];
}

interface EcommerceStoreProps {
  locale: "hy" | "ru" | "en" | "ar";
  featuredProducts: FeaturedProduct[];
  categories: any[];
  onConfigureProduct: (categoryId: string) => void;
  onAddToCart: (item: any) => void;
  currency: string;
}

const FILTER_METRICS = {
  categories: [
    { id: "all", en: "All Products", ru: "Все товары", hy: "Բոլորը" },
    { id: "boxes", en: "Boxes", ru: "Коробки", hy: "Տուփեր" },
    { id: "tubes", en: "Packaging Tubes", ru: "Тубусы / Гильзы", hy: "Փաթեթավորման Գլաններ" },
    { id: "mailing_bags", en: "Mailing Bags", ru: "Почтовые пакеты", hy: "Փոստային Պարկեր" },
    { id: "accessories", en: "Accessories", ru: "Аксессуары", hy: "Աքսեսուարներ" },
    { id: "pouches", en: "Pouches & Bags", ru: "Мешочки и Мешки", hy: "Քսակներ և Պարկեր" },
    { id: "bags", en: "Packaging Bags", ru: "Пакеты", hy: "Փաթեթավորման Պայուսակներ" },
    { id: "envelopes", en: "Envelopes", ru: "Конверты", hy: "Ծրարներ" },
    { id: "food_pkg", en: "Food Packaging", ru: "Пищевая упаковка", hy: "Սննդի Փաթեթավորում" },
    { id: "containers", en: "Containers", ru: "Контейнеры", hy: "Կոնտեյներներ" },
    { id: "samples", en: "Samples / Proofs", ru: "Образцы", hy: "Նմուշներ" },
    { id: "bundles", en: "Bundles / Packs", ru: "Бандлы / Наборы", hy: "Հավաքածուներ" }
  ],
  customisation: [
    { id: "any", en: "Any", ru: "Любая", hy: "Ցանկացած" },
    { id: "custom", en: "Custom logo", ru: "С логотипом/кастомная", hy: "Անհատական (Լոգոյով)" },
    { id: "plain", en: "Plain blank", ru: "Без печати/чистая", hy: "Պարզ (Առանց տպագրության)" },
    { id: "pre_printed", en: "Pre-printed design", ru: "Готовый принт", hy: "Նախապես տպված երանգներ" }
  ],
  industry: [
    { id: "any", en: "Any Industry", ru: "Любая отрасль", hy: "Ցանկացած ոլորտ" },
    { id: "apparel", en: "Apparel & Fashion", ru: "Одежда и мода", hy: "Հագուստ և Նորաձևություն" },
    { id: "health_beauty", en: "Health & Beauty", ru: "Косметика и уход", hy: "Առողջություն և Գեղեցկություն" },
    { id: "ecommerce", en: "E-commerce startups", ru: "Электронная коммерция", hy: "Էլեկտրոնային Առևտուր" },
    { id: "food_drinks", en: "Food & Drinks", ru: "Еда и напитки", hy: "Սնունդ և Ըմպելիք" },
    { id: "marketing_events", en: "Marketing & Events", ru: "Маркетинг и события", hy: "Մարքեթինգ և Միջոցառումներ" },
    { id: "electronics", en: "Electronics & Tech", ru: "Электроника и девайсы", hy: "Էլեկտրոնիկա" },
    { id: "gifts", en: "Gifts & Souvenirs", ru: "Подарки и сувениры", hy: "Նվերներ և Հուշանվերներ" },
    { id: "home_deco", en: "Home & Deco", ru: "Дом и декор", hy: "Տուն և Դեկոր" },
    { id: "logistics", en: "Logistics & Delivery", ru: "Логистика и доставка", hy: "Լոգիստիկա և Ֆուլֆիլմենթ" }
  ],
  pkgType: [
    { id: "shipping", en: "Shipping packaging", ru: "Доставка / Транспортировка", hy: "Առաքում և Փոխադրում" },
    { id: "product", en: "Product packaging", ru: "Товарная / Подарочная", hy: "Ապրանքային և Ներկայացուցչական" }
  ],
  sustainability: [
    { id: "eco_choice", en: "Eco Choice 🍃", ru: "Эко выбор 🍃", hy: "Էկո Ընտրություն 🍃" },
    { id: "fsc", en: "FSC® certified", ru: "Сертификация FSC®", hy: "FSC® սերտիֆիկացված" },
    { id: "biodegradable", en: "Biodegradable material", ru: "Биоразлагаемый материал", hy: "Կենսաքայքայվող նյութ" },
    { id: "reusable", en: "Reusable bag/box", ru: "Многоразовое использование", hy: "Բազմակի օգտագործման" },
    { id: "recycled", en: "Recycled content", ru: "Из вторичного сырья", hy: "Վերամշակված նյութեր" },
    { id: "recyclable", en: "Recyclable", ru: "100% перерабатываемый", hy: "Վերամշակվող" }
  ],
  collections: [
    { id: "bestsellers", en: "Bestsellers", ru: "Бестселлеры", hy: "Բեսթսելլերներ" },
    { id: "new_arrivals", en: "New Arrivals", ru: "Новинки", hy: "Նորույթներ" },
    { id: "custom_sizes", en: "Custom sizes", ru: "Свои размеры под заказ", hy: "Անհատական չափսեր" },
    { id: "custom_promo", en: "Custom promo / Offs", ru: "Промо-акции", hy: "Անհատական պրոմո" }
  ],
  useCases: [
    { id: "christmas", en: "Christmas", ru: "Рождественские / Новый год", hy: "Ամանորյա տոներ" },
    { id: "return_friendly", en: "Return friendly bag", ru: "Удобный легкий возврат", hy: "Հետադարձի համար հարմար" },
    { id: "clothes", en: "Clothes & Outfits", ru: "Одежда и текстиль", hy: "Հագուստ և Կտորեղեն" },
    { id: "candle", en: "Candle containers", ru: "Свечи и ароматы", hy: "Արոմատիկ Մոմեր" },
    { id: "postal_boxes", en: "Postal Boxes", ru: "Почтовые плоские коробки", hy: "Փոստային Տուփեր" },
    { id: "marketing", en: "Marketing & Promo", ru: "Рекламные промо-боксы", hy: "Մարքեթինգային ակցիաներ" },
    { id: "cosmetics", en: "Cosmetics & beauty", ru: "Косметика и бьюти", hy: "Կոսմետիկա և Խնամք" },
    { id: "computers", en: "Computers & Laptops", ru: "Компьютеры и гаджеты", hy: "Համակարգիչներ" },
    { id: "ship_large", en: "Ship large items", ru: "Крупногабаритные посылки", hy: "Մեծ ապրանքներ" },
    { id: "unboxing", en: "Unboxing accessories", ru: "Аксессуары распаковки", hy: "Բացման աքսեսուարներ" },
    { id: "smartphone", en: "Smartphones & Covers", ru: "Смартфоны и чехлы", hy: "Սմարթֆոններ" },
    { id: "subscription", en: "Subscription box", ru: "Подписные ежемесячные боксы", hy: "Բաժանորդագրության տուփեր" }
  ]
};

export default function EcommerceStore({
  locale,
  featuredProducts,
  onConfigureProduct,
  onAddToCart,
  currency
}: EcommerceStoreProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [customisation, setCustomisation] = useState<string>("any");
  const [industry, setIndustry] = useState<string>("any");
  const [selectedPkgTypes, setSelectedPkgTypes] = useState<string[]>([]);
  const [selectedSustainabilities, setSelectedSustainabilities] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
  const [showAllUseCases, setShowAllUseCases] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const getLocalizedTexts = () => {
    switch (locale) {
      case "hy":
        return {
          headerTitle: "Փաթեթավորման Պրեմիում Խանութ",
          headerSubtitle: "Բացահայտեք բրենդավորված տուփեր, տոպրակներ և աքսեսուարներ ձեր բիզնեսի համար",
          searchPlaceholder: "Փնտրել ապրանքներ...",
          minQty: "Նվազագույն քանակ՝",
          configureBtn: "Անհատականացնել",
          addToCartBtn: "Ավելացնել Զամբյուղ",
          startingFrom: "Սկսած՝",
          noProducts: "Ապրանքներ չեն գտնվել",
          productsCount: (count: number) => `${count} ապրանք է գտնվել`,
          clearAll: "Մաքրել Ֆիլտրերը",
          customisable: "Անհատականացվող",
          
          categoriesTitle: "Կատեգորիաներ",
          customisationTitle: "Անհատականացում",
          industryTitle: "Ոլորտ",
          pkgTypeTitle: "Փաթեթավորման Տեսակ",
          sustainabilityTitle: "Էկոլոգիականություն",
          collectionsTitle: "Հավաքածուներ",
          useCaseTitle: "Օգտագործում / Նշանակություն",
          
          showMore: "Ցուցադրել ավելին",
          showLess: "Ցուցադրել քիչ",
          walletBannerTitle: "Խնայեք մինչև 20% CAPSULE WALLET-ով",
          walletBannerDesc: "Ստացեք քեշբեք յուրաքանչյուր պատվերից և վճարեք ավելի քիչ հաջորդ գնումների համար:",
          walletLearn: "Իմանալ ավելին",
          mobileFiltersButton: "Ֆիլտրեր և Կատեգորիաներ"
        };
      case "ru":
        return {
          headerTitle: "Шоурум Упаковки Packhelp",
          headerSubtitle: "Откройте для себя брендовые коробки, крафт-пакеты и аксессуары для вашего бизнеса",
          searchPlaceholder: "Поиск товаров...",
          minQty: "Минимальный заказ:",
          configureBtn: "Конфигурировать",
          addToCartBtn: "Купить",
          startingFrom: "Цена от:",
          noProducts: "Товары не найдены по заданным фильтрам",
          productsCount: (count: number) => `Найдено товаров: ${count}`,
          clearAll: "Сбросить фильтры",
          customisable: "Кастомизируемый",
          
          categoriesTitle: "Категории",
          customisationTitle: "Кастомизация",
          industryTitle: "Отрасль / Индустрия",
          pkgTypeTitle: "Тип упаковки",
          sustainabilityTitle: "Экологичность (Eco)",
          collectionsTitle: "Коллекции",
          useCaseTitle: "Назначение / Использование",
          
          showMore: "Показать больше",
          showLess: "Свернуть",
          walletBannerTitle: "Сэкономьте до 20% с CAPSULE WALLET",
          walletBannerDesc: "Получайте моментальный кэшбэк с каждого заказа и используйте бонусы на следующие покупки.",
          walletLearn: "Подробнее",
          mobileFiltersButton: "Фильтры и Категории"
        };
      default:
        return {
          headerTitle: "Packhelp Custom Packaging Shop",
          headerSubtitle: "Premium rigid mailer boxes, envelopes, tubes & customizable ecosystem accessories",
          searchPlaceholder: "Search custom packaging...",
          minQty: "Min Quantities:",
          configureBtn: "Configure product",
          addToCartBtn: "Add to cart",
          startingFrom: "Starting from:",
          noProducts: "No products matched your filtration",
          productsCount: (count: number) => `${count} products matched`,
          clearAll: "Clear filters",
          customisable: "Customisable",
          
          categoriesTitle: "Categories",
          customisationTitle: "Customisation",
          industryTitle: "Industry",
          pkgTypeTitle: "Packaging Type",
          sustainabilityTitle: "Sustainability",
          collectionsTitle: "Collections",
          useCaseTitle: "Use case",
          
          showMore: "Show more",
          showLess: "Show less",
          walletBannerTitle: "SAVE UP TO 20% WITH CAPSULE WALLET",
          walletBannerDesc: "Earn instant cashback with every single order and pay less on your next package batches.",
          walletLearn: "Learn more",
          mobileFiltersButton: "Filters & Categories"
        };
    }
  };

  const texts = getLocalizedTexts();

  const formatPrice = (priceInAmd: number) => {
    let rate = 1;
    let symbol = "AMD";
    if (currency === "USD") {
      rate = 0.0025;
      symbol = "$";
    } else if (currency === "RUB") {
      rate = 0.23;
      symbol = "₽";
    }
    const finalAmount = Math.ceil(priceInAmd * rate);
    return `${finalAmount} ${symbol}`;
  };

  const standardRichProducts: FeaturedProduct[] = [
    {
      id: "prod_mailer_box",
      nameEn: "Custom Mailer Box Inserts",
      nameHy: "Փոստային Տուփեր՝ Ներդիրներով",
      nameRu: "Коробки с Ложементом / Вставками",
      image: "https://images.unsplash.com/photo-1549463350-2f4836473950?auto=format&fit=crop&q=80&w=600",
      categoryId: "boxes",
      active: true,
      price: 240,
      minQtyTextEn: "Min. 30 pieces",
      minQtyTextRu: "Мин. 30 штук",
      minQtyTextHy: "Նվազագույնը 30 հատ",
      tagEn: "Eco Choice",
      tagRu: "Эко выбор",
      tagHy: "Էկո ընտրություն",
      customisation: "custom",
      industry: ["ecommerce", "gifts", "electronics"],
      pkgType: "shipping",
      sustainability: ["eco_choice", "recyclable", "recycled"],
      collections: ["bestsellers"],
      useCases: ["postal_boxes", "subscription", "smartphone"]
    },
    {
      id: "prod_tube_metal",
      nameEn: "Custom Cardboard Tube Box with Metal Lid",
      nameHy: "Ստվարաթղթե Գլան (Տուբուս) Մետաղական Կափարիչով",
      nameRu: "Картонный Тубус с Металлической Крышкой",
      image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600",
      categoryId: "tubes",
      active: true,
      price: 320,
      minQtyTextEn: "Min. 30 pieces",
      minQtyTextRu: "Мин. 30 штук",
      minQtyTextHy: "Նվազագույնը 30 հատ",
      tagEn: "Hot Foil Stamping",
      tagRu: "Тиснение золотом",
      tagHy: "Ոսկետպում",
      customisation: "custom",
      industry: ["food_drinks", "gifts", "home_deco"],
      pkgType: "product",
      sustainability: ["reusable", "recyclable", "fsc"],
      collections: ["new_arrivals"],
      useCases: ["candle", "christmas", "unboxing"]
    },
    {
      id: "prod_coffee_cup",
      nameEn: "Custom Disposable Coffee Cup",
      nameHy: "Բրենդավորված Սուրճի Բաժակներ",
      nameRu: "Картонные Кофейные Стаканчики",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=600",
      categoryId: "food_pkg",
      active: true,
      price: 35,
      minQtyTextEn: "Min. 1000 pieces",
      minQtyTextRu: "Мин. 1000 штук",
      minQtyTextHy: "Նվազագույնը 1000 հատ",
      tagEn: "Eco Choice 🍃",
      tagRu: "Эко выбор 🍃",
      tagHy: "Էկո Ընտրություն 🍃",
      customisation: "custom",
      industry: ["food_drinks", "marketing_events"],
      pkgType: "product",
      sustainability: ["eco_choice", "biodegradable", "recyclable"],
      collections: ["bestsellers"],
      useCases: ["unboxing", "marketing"]
    },
    {
      id: "prod_cotton_bag",
      nameEn: "Custom Cotton Tote Bag",
      nameHy: "Կտավե Բրենդային Շոփեր",
      nameRu: "Брендовая Хлопковая Сумка-Шопер",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600",
      categoryId: "pouches",
      active: true,
      price: 450,
      minQtyTextEn: "Min. 50 pieces",
      minQtyTextRu: "Мин. 50 штук",
      minQtyTextHy: "Նվազագույնը 50 հատ",
      tagEn: "100% Organic Cotton",
      tagRu: "Органический хлопок",
      tagHy: "Էկո Բամբակ",
      customisation: "custom",
      industry: ["apparel", "gifts", "home_deco"],
      pkgType: "product",
      sustainability: ["reusable", "biodegradable", "recycled"],
      collections: ["new_arrivals"],
      useCases: ["clothes", "christmas", "unboxing"]
    },
    {
      id: "prod_foil_mailer",
      nameEn: "Custom Mailer Box with Hot Stamping",
      nameHy: "Փոստային Տուփ՝ Փայլաթիթեղով Տպագրմամբ",
      nameRu: "Почтовые Коробки с Горячим Тиснением",
      image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=600",
      categoryId: "boxes",
      active: true,
      price: 360,
      minQtyTextEn: "Min. 120 pieces",
      minQtyTextRu: "Мин. 120 штук",
      minQtyTextHy: "Նվազագույնը 120 հատ",
      tagEn: "Luxury Gloss",
      tagRu: "Люкс тиснение",
      tagHy: "Շքեղ Ոսկետառ",
      customisation: "custom",
      industry: ["health_beauty", "gifts", "ecommerce"],
      pkgType: "shipping",
      sustainability: ["fsc", "recyclable"],
      collections: ["custom_promo"],
      useCases: ["cosmetics", "candle", "christmas", "marketing"]
    },
    {
      id: "prod_magnetic_rigid",
      nameEn: "Custom Rigid Magnetic Box",
      nameHy: "Շքեղ Մագնիսական Կոշտ Տուփ",
      nameRu: "Подарочная Коробка на Магните",
      image: "https://images.unsplash.com/photo-1512207724213-745521db61ac?auto=format&fit=crop&q=80&w=600",
      categoryId: "boxes",
      active: true,
      price: 880,
      minQtyTextEn: "Min. 120 pieces",
      minQtyTextRu: "Мин. 120 штук",
      minQtyTextHy: "Նվազագույնը 120 հատ",
      tagEn: "Luxury Rigid Seal",
      tagRu: "Премиум жесткий картон",
      tagHy: "Կոշտ շքեղ տուբ",
      customisation: "custom",
      industry: ["health_beauty", "gifts", "electronics"],
      pkgType: "product",
      sustainability: ["reusable", "recyclable"],
      collections: ["bestsellers"],
      useCases: ["cosmetics", "christmas", "smartphone"]
    },
    {
      id: "prod_recycled_poly",
      nameEn: "Custom Recycled Poly Mailer",
      nameHy: "Վերամշակված Կուրիերական Պարկ",
      nameRu: "Курьерский Пакет из Вторичного Пластика",
      image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&q=80&w=600",
      categoryId: "mailing_bags",
      active: true,
      price: 40,
      minQtyTextEn: "Min. 100 pieces",
      minQtyTextRu: "Мин. 100 штук",
      minQtyTextHy: "Նվազագույնը 100 հատ",
      tagEn: "Eco Recycled",
      tagRu: "Вторичный пластик",
      tagHy: "Վերամշակված էկո",
      customisation: "custom",
      industry: ["apparel", "ecommerce", "logistics"],
      pkgType: "shipping",
      sustainability: ["recycled", "recyclable"],
      collections: ["bestsellers"],
      useCases: ["clothes", "return_friendly"]
    },
    {
      id: "prod_tissue_silk",
      nameEn: "Custom Silk Tissue Paper",
      nameHy: "Բրենդավորված Դիզայներական Տիշյու Թուղթ",
      nameRu: "Матовая Бумага Тишью с печатью",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
      categoryId: "accessories",
      active: true,
      price: 18,
      minQtyTextEn: "Min. 30 pieces",
      minQtyTextRu: "Мин. 30 штук",
      minQtyTextHy: "Նվազագույնը 30 հատ",
      tagEn: "Acid-Free Paper",
      tagRu: "Премиум матовая тишью",
      tagHy: "Մետաքսե նուրբ թուղթ",
      customisation: "custom",
      industry: ["apparel", "health_beauty", "gifts"],
      pkgType: "product",
      sustainability: ["eco_choice", "recyclable", "fsc"],
      collections: ["new_arrivals"],
      useCases: ["unboxing", "cosmetics", "clothes"]
    },
    {
      id: "prod_paper_tape",
      nameEn: "Custom Paper Adhesive Tape",
      nameHy: "Լոգոյով Թղթե Կպչուն Ժապավեն",
      nameRu: "Бумажный Брендированный Скотч",
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600",
      categoryId: "accessories",
      active: true,
      price: 1300,
      minQtyTextEn: "Min. 36 pieces",
      minQtyTextRu: "Мин. 36 штук",
      minQtyTextHy: "Նվազագույնը 36 հատ",
      tagEn: "Self-Weaving Kraft",
      tagRu: "Бумажная эко-лента",
      tagHy: "Կրաֆտ կպչուն ժապավեն",
      customisation: "custom",
      industry: ["ecommerce", "logistics", "home_deco"],
      pkgType: "shipping",
      sustainability: ["eco_choice", "recyclable"],
      collections: ["bestsellers"],
      useCases: ["unboxing", "postal_boxes"]
    },
    {
      id: "prod_plain_courier",
      nameEn: "Standard Plain Courier Box",
      nameHy: "Ստանդարտ Փոստային Կրաֆտ Տուփ",
      nameRu: "Короб Курьерский Бурый без логотипа",
      image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=600",
      categoryId: "boxes",
      active: true,
      price: 110,
      minQtyTextEn: "Min. 10 pieces",
      minQtyTextRu: "Мин. 10 штук",
      minQtyTextHy: "Նվազագույնը 10 հատ",
      tagEn: "100% Recycled Kraft",
      tagRu: "Абсолютно чистый крафт",
      tagHy: "Մաքուր կրաֆտ ստվարաթուղթ",
      customisation: "plain",
      industry: ["ecommerce", "logistics"],
      pkgType: "shipping",
      sustainability: ["eco_choice", "recyclable", "recycled"],
      collections: ["bestsellers"],
      useCases: ["postal_boxes", "ship_large"]
    },
    {
      id: "prod_holiday_tube",
      nameEn: "Pre-printed Holiday Gift Tube",
      nameHy: "Նախշազարդ Տոնական Տուբուս",
      nameRu: "Готовый Новогодний Тубус для подарков",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600",
      categoryId: "tubes",
      active: true,
      price: 185,
      minQtyTextEn: "Min. 20 pieces",
      minQtyTextRu: "Мин. 20 штук",
      minQtyTextHy: "Նվազագույնը 20 հատ",
      tagEn: "Merry Seasonal Pattern",
      tagRu: "С рождественским узором",
      tagHy: "Ամանորյա դիզայնով",
      customisation: "pre_printed",
      industry: ["gifts", "food_drinks"],
      pkgType: "product",
      sustainability: ["recyclable"],
      collections: ["custom_promo"],
      useCases: ["christmas", "candle"]
    },
    {
      id: "prod_pizza_box",
      nameEn: "Standard Cardboard Pizza Box",
      nameHy: "Ավանդական Պիցցայի Տուփ",
      nameRu: "Каноничная Коробка под Пиццу",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
      categoryId: "food_pkg",
      active: true,
      price: 75,
      minQtyTextEn: "Min. 100 pieces",
      minQtyTextRu: "Мин. 100 штук",
      minQtyTextHy: "Նվազագույնը 100 հատ",
      tagEn: "Thermal Guard",
      tagRu: "Гофрокартон термозащитный",
      tagHy: "Ջերմապահպան ստվարաթուղթ",
      customisation: "pre_printed",
      industry: ["food_drinks"],
      pkgType: "product",
      sustainability: ["biodegradable", "recyclable"],
      collections: ["new_arrivals"],
      useCases: ["unboxing"]
    }
  ];

  const uniqueProducts = [...featuredProducts.filter(fp => fp.active), ...standardRichProducts].reduce((acc, curr) => {
    const exists = acc.some(x => x.id === curr.id || x.nameEn.toLowerCase() === curr.nameEn.toLowerCase());
    if (!exists) {
      acc.push(curr);
    }
    return acc;
  }, [] as FeaturedProduct[]);

  const filteredProductsList = uniqueProducts.filter((product) => {
    const currentName = locale === "hy" ? product.nameHy : locale === "ru" ? product.nameRu : product.nameEn;
    const matchesSearch = currentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory;
    const matchesCustomisation = customisation === "any" || product.customisation === customisation;
    const matchesIndustry = industry === "any" || (product.industry && product.industry.includes(industry));
    const matchesPkgType = selectedPkgTypes.length === 0 || (product.pkgType && selectedPkgTypes.includes(product.pkgType));
    const matchesSustainability = selectedSustainabilities.length === 0 || 
      (product.sustainability && selectedSustainabilities.some(s => product.sustainability?.includes(s)));
    const matchesCollection = selectedCollections.length === 0 ||
      (product.collections && selectedCollections.some(c => product.collections?.includes(c)));
    const matchesUseCase = selectedUseCases.length === 0 ||
      (product.useCases && selectedUseCases.some(u => product.useCases?.includes(u)));

    return matchesSearch && matchesCategory && matchesCustomisation && matchesIndustry && matchesPkgType && matchesSustainability && matchesCollection && matchesUseCase;
  });

  const toggleCheckbox = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    setList(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  const isAnyFilterActive =
    selectedCategory !== "all" ||
    customisation !== "any" ||
    industry !== "any" ||
    selectedPkgTypes.length > 0 ||
    selectedSustainabilities.length > 0 ||
    selectedCollections.length > 0 ||
    selectedUseCases.length > 0 ||
    searchTerm !== "";

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setCustomisation("any");
    setIndustry("any");
    setSelectedPkgTypes([]);
    setSelectedSustainabilities([]);
    setSelectedCollections([]);
    setSelectedUseCases([]);
    setSearchTerm("");
  };

  const getIndustryIcon = (id: string, active: boolean) => {
    const size = 18;
    const colorClass = active ? "text-white" : "text-capsule-accent";
    switch (id) {
      case "any":
        return <Tag size={size} className={colorClass} />;
      case "apparel":
        return <Shirt size={size} className={colorClass} />;
      case "health_beauty":
        return <Sparkles size={size} className={colorClass} />;
      case "food_drinks":
        return <Coffee size={size} className={colorClass} />;
      case "ecommerce":
        return <ShoppingBag size={size} className={colorClass} />;
      case "gifts":
        return <Gift size={size} className={colorClass} />;
      case "marketing_events":
        return <Flame size={size} className={colorClass} />;
      case "home_deco":
        return <Home size={size} className={colorClass} />;
      case "electronics":
        return <Laptop size={size} className={colorClass} />;
      case "logistics":
        return <Truck size={size} className={colorClass} />;
      default:
        return <Landmark size={size} className={colorClass} />;
    }
  };

  const getIndustryProductCountText = (count: number) => {
    if (locale === "hy") {
      return `${count} տեսականի`;
    }
    if (locale === "ru") {
      const lastDigit = count % 10;
      const lastTwo = count % 100;
      if (lastTwo >= 11 && lastTwo <= 19) return `${count} товаров`;
      if (lastDigit === 1) return `${count} товар`;
      if (lastDigit >= 2 && lastDigit <= 4) return `${count} товара`;
      return `${count} товаров`;
    }
    return `${count} items`;
  };

  const getIndustryCount = (indId: string) => {
    if (indId === "any") return uniqueProducts.length;
    return uniqueProducts.filter(p => p.industry && p.industry.includes(indId)).length;
  };

  const indHeader = locale === "hy" 
    ? "ՄԱՍՆԱԳԻՏԱՑՎԱԾ ՓԱԹԵԹԱՎՈՐՈՒՄ ԸՍՏ ՈԼՈՐՏՆԵՐԻ" 
    : locale === "ru" 
      ? "УПАКОВКА ПО ОТРАСЛЯМ БИЗНЕСА" 
      : "SPECIALISED PACKAGING BY INDUSTRY";

  const indSub = locale === "hy"
    ? "Ընտրեք ձեր ոլորտը՝ համապատասխան փաթեթավորման լուծումներն արագ գտնելու համար"
    : locale === "ru"
      ? "Выберите вашу нишу для мгновенного подбора идеальных упаковочных решений"
      : "Select your business niche to instantly match the perfect packaging tailored to your brand";

  const orderedIndustries = [
    { id: "any", en: "All Industries", ru: "Все отрасли", hy: "Բոլոր Ոլորտները" },
    { id: "apparel", en: "Apparel & Fashion", ru: "Одежда и мода", hy: "Հագուստ և Նորաձևություն" },
    { id: "food_drinks", en: "Food & Drinks (HoReCa)", ru: "Еда, напитки и HoReCa", hy: "Սնունդ և Ըմպելիք (HoReCa)" },
    { id: "health_beauty", en: "Health & Beauty (Cosmetics)", ru: "Косметика и бьюти", hy: "Կոսմետիկա և Գեղեցկություն" },
    { id: "ecommerce", en: "E-commerce Startups", ru: "Электронная коммерция", hy: "Էլեկտրոնային Առևտուր" },
    { id: "gifts", en: "Gifts & Souvenirs", ru: "Подарки и сувениры", hy: "Նվերներ և Հուշանվերներ" },
    { id: "home_deco", en: "Home & Deco", ru: "Дом и декор", hy: "Տուն և Դեկոր" },
    { id: "marketing_events", en: "Marketing & Events", ru: "Маркетинг и события", hy: "Մարքեթինգ և Միջոցառումներ" },
    { id: "electronics", en: "Electronics & Tech", ru: "Электроника и девайсы", hy: "Էլեկտրոնիկա" },
    { id: "logistics", en: "Logistics & Delivery", ru: "Логистика и доставка", hy: "Լոգիստիկա և Առաքում" }
  ];

  return (
    <div className="w-full bg-capsule-bg min-h-screen py-8 select-none" id="primary-packhelp-store-canvas">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1 px-3 py-1 text-[9px] tracking-[0.25em] uppercase font-mono font-extrabold text-capsule-accent bg-capsule-accent-dim border border-capsule-accent/10 rounded-full shadow-sm mb-3">
            <Sparkles size={11} className="text-capsule-accent animate-pulse" />
            <span>PACKHELP CATALOGUE ECOSYSTEM</span>
          </div>
          <h1 className="font-sans font-black text-3xl sm:text-5xl text-capsule-dark tracking-tight uppercase leading-none">
            {texts.headerTitle}
          </h1>
          <p className="text-xs sm:text-sm text-capsule-text-secondary mt-2 max-w-xl mx-auto leading-relaxed">
            {texts.headerSubtitle}
          </p>
        </div>

        {/* Visual Industry Category Selector Cards */}
        <div className="mb-12 animate-fade-in-quick" id="industry-selector-cards-section">
          <div className="text-center sm:text-left mb-8">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-capsule-accent shadow-[0_0_10px_#ff2300]" />
              <h2 className="font-sans font-black text-[11px] tracking-[0.25em] text-capsule-dark uppercase">
                {indHeader}
              </h2>
            </div>
            <p className="text-[12px] text-capsule-text-secondary/90 leading-relaxed max-w-2xl">
              {indSub}
            </p>
          </div>

          {/* Premium, fully visible responsive grid - no scrolling on desktop or mobile for instant accessibility */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 pb-3 pt-1 px-1">
            {orderedIndustries.map((ind) => {
              const isSelected = industry === ind.id;
              const count = getIndustryCount(ind.id);
              const name = locale === "hy" ? ind.hy : locale === "ru" ? ind.ru : ind.en;
              
              return (
                <button
                  key={ind.id}
                  onClick={() => setIndustry(ind.id)}
                  className={`group flex flex-col items-start p-4 w-full rounded-[28px] h-[126px] justify-between cursor-pointer transition-all duration-300 relative select-none text-left overflow-hidden border ${
                    isSelected
                      ? "bg-[#efede8] border-white/20 shadow-[inset_4px_4px_9px_#cfc9be,inset_-4px_-4px_9px_#ffffff] scale-[0.97]"
                      : "bg-[#fafaf8] border-white/90 shadow-[6px_6px_14px_#d2ccc2,-6px_-6px_14px_#ffffff] hover:scale-[1.03] hover:shadow-[8px_8px_18px_#d2ccc2,-8px_-8px_18px_#ffffff]"
                  }`}
                  id={`industry-card-${ind.id}`}
                >
                  {/* Soft organic circular gradient for modern physical material simulation */}
                  <div className={`absolute top-[-25px] right-[-25px] w-24 h-24 rounded-full transition-all duration-500 pointer-events-none ${
                    isSelected 
                      ? "bg-capsule-accent/[0.05] scale-110" 
                      : "bg-capsule-accent/[0.02] group-hover:scale-115 group-hover:bg-capsule-accent/[0.05]"
                  }`} />

                  <div className="flex items-center justify-between w-full relative z-10">
                    <div className={`p-2.5 rounded-[16px] transition-all duration-300 group-hover:scale-105 ${
                      isSelected 
                        ? "bg-capsule-accent text-white shadow-[0_6px_16px_rgba(255,35,0,0.35),_inset_1.5px_1.5px_3px_rgba(255,255,255,0.4)]" 
                        : "bg-[#fafaf8] shadow-[3px_3px_7px_#dcdad5,-3px_-3px_7px_#ffffff] border border-white/80 text-capsule-accent"
                    }`}>
                      {getIndustryIcon(ind.id, isSelected)}
                    </div>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-capsule-accent shadow-[0_0_6px_#ff2300] animate-pulse" />
                    )}
                  </div>

                  <div className="mt-3 relative z-10 w-full">
                    <span className={`block font-sans font-black text-[11px] tracking-tight uppercase leading-tight line-clamp-1 transition-colors duration-300 ${
                      isSelected ? "text-capsule-accent" : "text-capsule-dark"
                    }`}>
                      {name}
                    </span>
                    <span className={`block font-mono text-[9px] font-bold mt-0.5 transition-colors duration-300 ${
                      isSelected ? "text-capsule-dark/80" : "text-capsule-text-secondary"
                    }`}>
                      {getIndustryProductCountText(count)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:hidden w-full mb-4">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-capsule-surf text-capsule-dark text-sm font-bold rounded-xl shadow-sm neu-convex-surf neu-convex-hover"
          >
            <Filter size={14} className="text-capsule-accent" />
            <span>{texts.mobileFiltersButton}</span>
            {isAnyFilterActive && (
              <span className="w-2 h-2 rounded-full bg-capsule-accent" />
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <aside 
            className={`w-full lg:w-72 rounded-2xl p-5 lg:block space-y-7 shrink-0 neu-convex-surf ${
              mobileFiltersOpen ? "block" : "hidden"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-capsule-border/30">
              <span className="text-xs font-black uppercase text-capsule-dark font-mono tracking-wider">Side filters</span>
              {isAnyFilterActive && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-capsule-accent font-extrabold font-mono hover:text-capsule-accent-light cursor-pointer"
                >
                  <RotateCcw size={10} />
                  <span>{texts.clearAll}</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-black uppercase text-capsule-dark/40 font-mono tracking-widest">{texts.categoriesTitle}</span>
              <div className="space-y-1 pt-1">
                {FILTER_METRICS.categories.map((cat) => {
                  const label = locale === "hy" ? cat.hy : locale === "ru" ? cat.ru : cat.en;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-capsule-accent-dim text-capsule-accent font-black border-l-4 border-capsule-accent pl-2"
                          : "text-capsule-dark/80 hover:text-capsule-accent hover:bg-capsule-bg/30 font-semibold"
                      }`}
                    >
                      <span>{label}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-capsule-accent" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="block text-xs font-black uppercase text-capsule-dark/40 font-mono tracking-widest">{texts.customisationTitle}</span>
              <div className="space-y-2 pt-1">
                {FILTER_METRICS.customisation.map((option) => {
                  const label = locale === "hy" ? option.hy : locale === "ru" ? option.ru : option.en;
                  const isSelected = customisation === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setCustomisation(option.id)}
                      className="w-full flex items-center gap-2.5 text-xs text-left cursor-pointer text-capsule-dark/80 font-semibold hover:text-capsule-accent transition-colors"
                    >
                      <div className="w-4 h-4 rounded-full border border-capsule-border flex items-center justify-center bg-capsule-surf">
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-capsule-accent" />}
                      </div>
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="block text-xs font-black uppercase text-capsule-dark/40 font-mono tracking-widest">{texts.industryTitle}</span>
              <div className="space-y-2 pt-1 max-h-56 overflow-y-auto no-scrollbar">
                {FILTER_METRICS.industry.map((ind) => {
                  const label = locale === "hy" ? ind.hy : locale === "ru" ? ind.ru : ind.en;
                  const isSelected = industry === ind.id;
                  return (
                    <button
                      key={ind.id}
                      onClick={() => setIndustry(ind.id)}
                      className="w-full flex items-center gap-2.5 text-xs text-left cursor-pointer text-capsule-dark/80 font-semibold hover:text-capsule-accent transition-colors"
                    >
                      <div className="w-4 h-4 rounded-full border border-capsule-border flex items-center justify-center bg-capsule-surf">
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-capsule-accent" />}
                      </div>
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="block text-xs font-black uppercase text-capsule-dark/40 font-mono tracking-widest">{texts.pkgTypeTitle}</span>
              <div className="space-y-2.5 pt-1">
                {FILTER_METRICS.pkgType.map((pkg) => {
                  const label = locale === "hy" ? pkg.hy : locale === "ru" ? pkg.ru : pkg.en;
                  const isChecked = selectedPkgTypes.includes(pkg.id);
                  return (
                    <div 
                      key={pkg.id}
                      className="flex items-center gap-2.5 text-xs font-semibold text-capsule-dark/80 hover:text-capsule-accent transition-colors cursor-pointer"
                      onClick={() => toggleCheckbox(selectedPkgTypes, setSelectedPkgTypes, pkg.id)}
                    >
                      <div className={`w-4 h-4 border rounded flex items-center justify-center transition-all bg-capsule-surf ${isChecked ? "border-capsule-accent bg-capsule-accent text-white" : "border-capsule-border"}`}>
                        {isChecked && <span className="text-[9px] font-bold">✓</span>}
                      </div>
                      <span>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="block text-xs font-black uppercase text-capsule-dark/40 font-mono tracking-widest">{texts.sustainabilityTitle}</span>
              <div className="space-y-2.5 pt-1">
                {FILTER_METRICS.sustainability.map((sus) => {
                  const label = locale === "hy" ? sus.hy : locale === "ru" ? sus.ru : sus.en;
                  const isChecked = selectedSustainabilities.includes(sus.id);
                  return (
                    <div 
                      key={sus.id}
                      className="flex items-center gap-2.5 text-xs font-semibold text-capsule-dark/80 hover:text-capsule-accent transition-colors cursor-pointer"
                      onClick={() => toggleCheckbox(selectedSustainabilities, setSelectedSustainabilities, sus.id)}
                    >
                      <div className={`w-4 h-4 border rounded flex items-center justify-center transition-all bg-capsule-surf ${isChecked ? "border-capsule-accent bg-capsule-accent text-white" : "border-capsule-border"}`}>
                        {isChecked && <span className="text-[9px] font-bold">✓</span>}
                      </div>
                      <span>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="block text-xs font-black uppercase text-capsule-dark/40 font-mono tracking-widest">{texts.collectionsTitle}</span>
              <div className="space-y-2.5 pt-1">
                {FILTER_METRICS.collections.map((coll) => {
                  const label = locale === "hy" ? coll.hy : locale === "ru" ? coll.ru : coll.en;
                  const isChecked = selectedCollections.includes(coll.id);
                  return (
                    <div 
                      key={coll.id}
                      className="flex items-center gap-2.5 text-xs font-semibold text-capsule-dark/80 hover:text-capsule-accent transition-colors cursor-pointer"
                      onClick={() => toggleCheckbox(selectedCollections, setSelectedCollections, coll.id)}
                    >
                      <div className={`w-4 h-4 border rounded flex items-center justify-center transition-all bg-capsule-surf ${isChecked ? "border-capsule-accent bg-capsule-accent text-white" : "border-capsule-border"}`}>
                        {isChecked && <span className="text-[9px] font-bold">✓</span>}
                      </div>
                      <span>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="block text-xs font-black uppercase text-capsule-dark/40 font-mono tracking-widest">{texts.useCaseTitle}</span>
              <div className="space-y-2.5 pt-1">
                {FILTER_METRICS.useCases.slice(0, showAllUseCases ? 12 : 5).map((uc) => {
                  const label = locale === "hy" ? uc.hy : locale === "ru" ? uc.ru : uc.en;
                  const isChecked = selectedUseCases.includes(uc.id);
                  return (
                    <div 
                      key={uc.id}
                      className="flex items-center gap-2.5 text-xs font-semibold text-capsule-dark/80 hover:text-capsule-accent transition-colors cursor-pointer"
                      onClick={() => toggleCheckbox(selectedUseCases, setSelectedUseCases, uc.id)}
                    >
                      <div className={`w-4 h-4 border rounded flex items-center justify-center transition-all bg-capsule-surf ${isChecked ? "border-capsule-accent bg-capsule-accent text-white" : "border-capsule-border"}`}>
                        {isChecked && <span className="text-[9px] font-bold">✓</span>}
                      </div>
                      <span>{label}</span>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setShowAllUseCases(!showAllUseCases)}
                  className="flex items-center gap-1 text-[11px] font-bold text-capsule-accent hover:text-capsule-accent-light mt-2 transition-colors focus:outline-none cursor-pointer"
                >
                  <span>{showAllUseCases ? texts.showLess : texts.showMore}</span>
                  {showAllUseCases ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              </div>
            </div>

          </aside>

          <main className="flex-1 w-full space-y-6">

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl neu-convex-surf">
              <div className="flex items-center gap-2 pl-1 select-none">
                <span className="font-sans font-black text-capsule-dark text-sm sm:text-base uppercase tracking-tight">
                  {texts.productsCount(filteredProductsList.length)}
                </span>
                {isAnyFilterActive && (
                  <span className="px-2.5 py-1 bg-capsule-accent-dim text-[9px] text-capsule-accent font-mono font-extrabold uppercase rounded-full border border-capsule-accent/10">
                    Filtered
                  </span>
                )}
              </div>

              <div className="w-full sm:w-72 relative">
                <input
                  type="text"
                  placeholder={texts.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full glass-input text-xs font-bold rounded-xl py-2.5 pl-9 pr-4 text-capsule-dark placeholder-gray-400"
                />
                <Search size={14} className="absolute left-3.5 top-3.5 text-capsule-dark/50" />
              </div>
            </div>

            {filteredProductsList.length === 0 ? (
              <div className="text-center py-20 rounded-3xl p-8 neu-convex-surf">
                <Filter size={36} className="mx-auto text-capsule-dark/30 mb-3" />
                <p className="text-capsule-dark font-black text-sm uppercase tracking-wide">{texts.noProducts}</p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-4 px-5 py-2.5 bg-capsule-accent hover:bg-capsule-accent-light text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer neu-convex-hover"
                >
                  {texts.clearAll}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                
                {filteredProductsList.map((product) => {
                  const prodName = locale === "hy" ? product.nameHy : locale === "ru" ? product.nameRu : product.nameEn;
                  const minQtyText = locale === "hy" ? product.minQtyTextHy : locale === "ru" ? product.minQtyTextRu : product.minQtyTextEn;
                  const customTagText = locale === "hy" ? product.tagHy : locale === "ru" ? product.tagRu : product.tagEn;
                  
                  const isEco = product.sustainability?.includes("eco_choice");
                  const hasNewArrival = product.collections?.includes("new_arrivals");
                  const hasCustomSize = product.collections?.includes("custom_sizes");

                  return (
                    <div
                      key={product.id}
                      className="group flex flex-col justify-between rounded-[24px] transition-all duration-300 p-3.5 border-none bg-capsule-surf neu-convex-surf hover:scale-[1.03]"
                    >
                      <div className="relative aspect-[4/3] bg-capsule-bg/25 overflow-hidden rounded-[18px] border border-capsule-border/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]">
                        <img
                          src={product.image}
                          alt={prodName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-[1.06] transition-all duration-700 ease-out"
                        />

                        {/* Floating Glassmorphic Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                          {isEco && (
                            <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md border border-emerald-100/50 text-[#15803d] font-black text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                              <Leaf size={8} className="fill-emerald-400 stroke-none" />
                              <span>ECO CHOICE</span>
                            </span>
                          )}

                          {!isEco && customTagText && (
                            <span className="inline-flex items-center bg-[#fff5f5]/90 backdrop-blur-md border border-capsule-accent/10 text-capsule-accent font-black text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                              {customTagText}
                            </span>
                          )}
                        </div>

                        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
                          {hasNewArrival && (
                            <span className="inline-flex items-center bg-capsule-accent text-white font-mono font-black text-[8px] tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm">
                              NEW ARRIVAL
                            </span>
                          )}

                          {hasCustomSize && (
                            <span className="inline-flex items-center bg-[#fffbeb]/90 backdrop-blur-md border border-amber-200/50 text-[#b45309] font-black text-[8px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
                              NEW SIZES
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 px-1 pb-1 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Premium Status row */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${product.customisation === "custom" ? "bg-capsule-accent animate-pulse shadow-[0_0_8px_#ff2300]" : "bg-capsule-text-muted/60"}`} />
                              <span className="text-[9px] text-capsule-text-secondary font-mono tracking-wider uppercase font-extrabold">
                                {product.customisation === "custom" ? texts.customisable : "Catalogue Item"}
                              </span>
                            </div>
                            <span className="text-[9px] text-capsule-accent font-mono font-extrabold tracking-wider uppercase bg-capsule-accent-dim px-2 py-0.5 rounded border border-capsule-accent/10">
                              {minQtyText}
                            </span>
                          </div>

                          <h3 className="font-sans font-black text-sm text-capsule-dark group-hover:text-capsule-accent transition-colors tracking-tight leading-snug uppercase min-h-[40px] line-clamp-2 mt-1">
                            {prodName}
                          </h3>
                        </div>

                        <div className="space-y-3.5 pt-3 border-t border-capsule-border/20 mt-3.5">
                          <div className="flex items-baseline justify-between text-xs px-0.5">
                            <span className="text-capsule-text-secondary font-black uppercase tracking-wider font-mono text-[9px]">{texts.startingFrom}</span>
                            <span className="font-sans font-black text-capsule-accent text-base font-mono tracking-tight">
                              {formatPrice(product.price || 150)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onConfigureProduct(product.categoryId)}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-capsule-dark hover:neu-brand-active text-white text-[10px] font-black uppercase tracking-wider py-3 rounded-xl transition-all duration-300 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <span>{texts.configureBtn}</span>
                              <ArrowRight size={10} />
                            </button>

                            <button
                              onClick={() => {
                                onAddToCart({
                                  id: product.id,
                                  name: prodName,
                                  price: product.price || 150,
                                  image: product.image,
                                  qty: 30,
                                  details: `Packhelp Instant Order:\n- Item ID: ${product.id}\n- Customisation: ${product.customisation}`
                                });
                              }}
                              className="w-10 h-10 bg-capsule-surf border border-capsule-border/40 hover:border-capsule-accent/30 text-capsule-dark hover:text-capsule-accent rounded-xl flex items-center justify-center transition-all cursor-pointer hover:scale-[1.05] active:scale-[0.95] neu-convex-surf"
                              title={texts.addToCartBtn}
                            >
                              <ShoppingCart size={13} />
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}

                <div className="bg-gradient-to-br from-capsule-dark via-[#4a3225] to-[#251710] rounded-[24px] p-6 text-white flex flex-col justify-between shadow-md relative overflow-hidden select-none border border-white/5 neu-convex-surf">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
                  
                  <div className="space-y-3">
                    <span className="inline-block bg-capsule-accent text-white font-mono text-[8px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full border border-white/10 shadow-sm">
                      Promo Offer
                    </span>
                    <h4 className="font-sans font-black tracking-tight text-white text-base leading-snug uppercase">
                      {texts.walletBannerTitle}
                    </h4>
                    <p className="text-[11px] text-white/80 leading-relaxed font-sans">
                      {texts.walletBannerDesc}
                    </p>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 bg-capsule-accent hover:bg-capsule-accent-light text-white text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md hover:scale-[1.04] active:scale-[0.96]"
                    >
                      <span>{texts.walletLearn}</span>
                      <ArrowRight size={10} />
                    </button>
                  </div>
                </div>

              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
}

