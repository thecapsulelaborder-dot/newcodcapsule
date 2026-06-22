import React, { useState } from "react";
import { Search, ShoppingCart, Sliders, ArrowRight, Check, Tag, Filter, PlayCircle, Sparkles } from "lucide-react";

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
}

interface EcommerceStoreProps {
  locale: "hy" | "ru" | "en" | "ar";
  featuredProducts: FeaturedProduct[];
  categories: any[];
  onConfigureProduct: (categoryId: string) => void;
  onAddToCart: (item: any) => void;
  currency: string;
}

export default function EcommerceStore({
  locale,
  featuredProducts,
  categories,
  onConfigureProduct,
  onAddToCart,
  currency
}: EcommerceStoreProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const getLocalizedTexts = () => {
    switch (locale) {
      case "hy":
        return {
          headerTitle: "Փաթեթավորման Պրեմիում Խանութ",
          headerSubtitle: "Բացահայտեք բրենդավորված տուփեր, տոպրակներ և աքսեսուարներ ձեր բիզնեսի համար",
          searchPlaceholder: "Փնտրել ապրանքներ...",
          allCategories: "Բոլորը",
          minQty: "Նվազագույն քանակ՝",
          configureBtn: "Անհատականացնել",
          addToCartBtn: "Ավելացնել Զամբյուղ",
          startingFrom: "Սկսած՝",
          noProducts: "Ապրանքներ չեն գտնվել",
          categoryFilter: "Կատեգորիաներ",
          tagFilter: "Ֆիլտրել ըստ տեսակի",
          popular: "Հանրաճանաչ",
          newArrival: "Նորույթ"
        };
      case "ru":
        return {
          headerTitle: "Премиальный Шоурум Упаковки",
          headerSubtitle: "Откройте для себя брендовые коробки, пакеты и аксессуары для вашего бизнеса",
          searchPlaceholder: "Поиск товаров...",
          allCategories: "Все товары",
          minQty: "Минимальный заказ:",
          configureBtn: "Кастомизировать",
          addToCartBtn: "В корзину",
          startingFrom: "Цена от:",
          noProducts: "Товары не найдены",
          categoryFilter: "Категории",
          tagFilter: "Фильтр по типу",
          popular: "Популярные",
          newArrival: "Новинки"
        };
      default:
        return {
          headerTitle: "Bespoke Packaging Showroom",
          headerSubtitle: "Discover luxury gift boxes, custom paper bags, and branding accessories",
          searchPlaceholder: "Search custom packaging...",
          allCategories: "All Products",
          minQty: "Min Quantities:",
          configureBtn: "Configure & Personalise",
          addToCartBtn: "Add to Cart",
          startingFrom: "Starting from:",
          noProducts: "No products matched your search",
          categoryFilter: "Categories",
          tagFilter: "Filter by type",
          popular: "Refined Selection",
          newArrival: "Bespoke Designs"
        };
    }
  };

  const texts = getLocalizedTexts();

  // Price conversion helper based on selection
  const formatPrice = (priceInAmd: number) => {
    let rate = 1;
    let symbol = "AMD";
    if (currency === "USD") {
      rate = 0.0025; // Approximate AMD to USD conversion
      symbol = "$";
    } else if (currency === "RUB") {
      rate = 0.23; // Approximate AMD to RUB conversion
      symbol = "₽";
    }
    const finalAmount = Math.ceil(priceInAmd * rate);
    return `${finalAmount} ${symbol}`;
  };

  // Preset illustrative premium list if database table featuredProducts is empty
  const defaultFallbackProducts: FeaturedProduct[] = [
    {
      id: "preset_1",
      nameEn: "Bespoke Magnetic Gift Boxes",
      nameHy: "Մագնիսական Պրեմիում Տուփեր",
      nameRu: "Магнитные Подарочные Коробки",
      minQtyTextEn: "100 pcs",
      minQtyTextHy: "100 հատ",
      minQtyTextRu: "100 шт",
      tagEn: "Luxury",
      tagHy: "Լյուքս",
      tagRu: "Премиум",
      secondaryTagEn: "Hot Foil Stamping",
      secondaryTagHy: "Ոսկետառ Տպագրություն",
      secondaryTagRu: "Тиснение Фольгой",
      image: "https://images.unsplash.com/photo-1512909430638-aa25c490a1b6?auto=format&fit=crop&q=80&w=600",
      categoryId: "boxes",
      active: true,
      price: 450,
      descEn: "Premium rigid storage packaging with magnetic flap closing and structural luxury touch.",
      descHy: "Ամուր պատերով մագնիսական տուփեր՝ նախատեսված նվերների և շքեղ աքսեսուարների համար:",
      descRu: "Жесткие подарочные коробки премиум-класса с магнитным клапаном для элитных подарков."
    },
    {
      id: "preset_2",
      nameEn: "Boutique Kraft Shopper Bags",
      nameHy: "Բուտիկ Կրավտ Տոպրակներ",
      nameRu: "Бутиковые Крафт Пакеты",
      minQtyTextEn: "200 pcs",
      minQtyTextHy: "200 հատ",
      minQtyTextRu: "200 шт",
      tagEn: "Eco-Friendly",
      tagHy: "Էկո-Մաքուր",
      tagRu: "Эко-Стиль",
      secondaryTagEn: "Satin Handle Options",
      secondaryTagHy: "Ատլասե Ժապավեններով",
      secondaryTagRu: "Шелковые Ручки",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600",
      categoryId: "bags",
      active: true,
      price: 180,
      descEn: "Earth-toned bio kraft paper carrier bags printed with precision design layout.",
      descHy: "Էկոլոգիապես մաքուր կրավտ թղթե տոպրակներ՝ բարձրորակ մետաքսատպագրությամբ:",
      descRu: "Экологически чистые крафт-пакеты с индивидуальным логотипом для шоурумов."
    },
    {
      id: "preset_3",
      nameEn: "Circular Die-Cut Label Stickers",
      nameHy: "Ինքնակպչուն Կլոր Պիտակներ",
      nameRu: "Наклейки и Круглые Стикеры",
      minQtyTextEn: "500 pcs",
      minQtyTextHy: "500 հատ",
      minQtyTextRu: "500 шт",
      tagEn: "Waterproof",
      tagHy: "Ջրակայուն",
      tagRu: "Влагостойкие",
      secondaryTagEn: "Matte Finishes",
      secondaryTagHy: "Փայլատ Ֆակտուրա",
      secondaryTagRu: "Матовая Фактура",
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=600",
      categoryId: "stickers",
      active: true,
      price: 25,
      descEn: "Elegant gloss or matte self-adhesive vinyl branding seals for box closures.",
      descHy: "Stickers-ների լայն տեսականի՝ տուփերն ու փաթեթները կնքելու համար:",
      descRu: "Самоклеящиеся влагостойкие стикеры для брендирования курьерских коробок."
    },
    {
      id: "preset_4",
      nameEn: "Embossed Double Satin Ribbons",
      nameHy: "Լոգոյով Ատլասե Ժապավեններ",
      nameRu: "Брендированные Атласные Ленты",
      minQtyTextEn: "100 meters",
      minQtyTextHy: "100 մետր",
      minQtyTextRu: "100 метров",
      tagEn: "Branding",
      tagHy: "Բրենդավորում",
      tagRu: "Идентичность",
      secondaryTagEn: "Bespoke Foiling",
      secondaryTagHy: "Ոսկեփայլ Տպագրություն",
      secondaryTagRu: "Тиснение Золотом",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600",
      categoryId: "ribbons",
      active: true,
      price: 120,
      descEn: "Lustrous tailored satin wrap styling options with dynamic recurring layout.",
      descHy: "Բարձրակարգ ատլասե ժապավեններ ձեր բրենդի անվանումով և լոգոտիպով:",
      descRu: "Премиальные атласные ленты с объемным нанесением логотипа для праздничной обвязки."
    }
  ];

  const mergedProducts = [...featuredProducts.filter(fp => fp.active), ...defaultFallbackProducts].reduce((acc, current) => {
    // Avoid duplicate products between featured list and default fallback
    const xName = current.nameEn.toLowerCase();
    const exists = acc.some(item => item.nameEn.toLowerCase() === xName);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, [] as FeaturedProduct[]);

  // Apply filters: Search Term + Category ID filter
  const filteredList = mergedProducts.filter((product) => {
    const prodName = locale === "hy" ? product.nameHy : locale === "ru" ? product.nameRu : product.nameEn;
    const searchMatch = prodName.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = selectedCategory === "all" || product.categoryId === selectedCategory;
    return searchMatch && categoryMatch;
  });

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-10 selection:bg-transparent animate-fade-in" id="exclusive-ecommerce-showroom">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Headings */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1 px-3.5 py-1 text-[9px] tracking-[0.25em] uppercase font-mono font-bold text-[#554DDC] bg-[#FAF9F6] border border-[#E0D7FC]/65 rounded-full shadow-sm mb-4">
            <Sparkles size={10} className="text-[#554DDC] animate-pulse" />
            <span>THE CAPSULE EXCLUSIVE SHOP</span>
          </div>
          <h1 className="font-sans font-black text-4xl sm:text-5xl text-[#3D271B] tracking-tight leading-none uppercase">
            {texts.headerTitle}
          </h1>
          <p className="text-sm sm:text-base text-[#3D271B]/60 mt-4 max-w-xl mx-auto leading-relaxed font-sans">
            {texts.headerSubtitle}
          </p>
        </div>

        {/* Central Filters & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 bg-white rounded-3xl p-4 sm:p-5 border border-[#EBE8D5]/60 shadow-[2px_4px_16px_rgba(180,175,166,0.08)] mb-10">
          
          {/* Quick Category Tab Selectors */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4.5 py-2 rounded-full text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-[#3D271B] text-white"
                  : "bg-[#FAFAF9] text-[#3D271B]/65 hover:bg-[#FAF9F5] hover:text-[#3D271B] border border-[#E3DFD7]/70"
              }`}
            >
              {texts.allCategories}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4.5 py-2 rounded-full text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#3D271B] text-white"
                    : "bg-[#FAFAF9] text-[#3D271B]/65 hover:bg-[#FAF9F5] hover:text-[#3D271B] border border-[#E3DFD7]/70"
                }`}
              >
                {locale === "hy" ? cat.navLabel || cat.name : locale === "ru" ? cat.name : cat.id.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Symmetrical Search pill bar */}
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              placeholder={texts.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FAFAF9] border border-[#E3DFD7] text-sm font-medium rounded-full py-2.5 pl-10 pr-4 outline-none text-[#3D271B] placeholder-[#8C8476]/70 focus:border-[#554DDC] transition-colors"
            />
            <Search size={15} className="absolute left-4 top-3 text-[#8C8476]" />
          </div>

        </div>

        {/* Dynamic Display Grid */}
        {filteredList.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[32px] border border-[#EBE8D5]/60 shadow-sm max-w-lg mx-auto">
            <Filter size={40} className="mx-auto text-[#8C8476] opacity-35 mb-4" />
            <p className="text-[#3D271B] font-bold text-base uppercase tracking-wide">{texts.noProducts}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredList.map((product) => {
              const prodName = locale === "hy" ? product.nameHy : locale === "ru" ? product.nameRu : product.nameEn;
              const minQtyText = locale === "hy" ? product.minQtyTextHy : locale === "ru" ? product.minQtyTextRu : product.minQtyTextEn;
              const tagText = locale === "hy" ? product.tagHy : locale === "ru" ? product.tagRu : product.tagEn;
              const secTagText = locale === "hy" ? product.secondaryTagHy : locale === "ru" ? product.secondaryTagRu : product.secondaryTagEn;
              const description = locale === "hy" ? product.descHy : locale === "ru" ? product.descRu : product.descEn;
              const startingPrice = product.price || 150;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-[32px] border border-[#E3DFD7]/70 hover:border-[#1A3F25]/35 shadow-[3px_6px_20px_rgba(180,175,166,0.08)] hover:shadow-[6px_10px_32px_rgba(26,63,37,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:scale-[1.015]"
                >
                  {/* Top image module */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#FAF9F6]">
                    <img
                      src={product.image}
                      alt={prodName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Floating badge types */}
                    {tagText && (
                      <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-[#FAF9F6]/95 backdrop-blur-sm border border-orange-200 uppercase font-mono font-black text-[8px] tracking-wider text-[#3D271B] px-3 py-1.5 rounded-full shadow-sm">
                        <Tag size={8} className="text-orange-500" />
                        {tagText}
                      </span>
                    )}

                    {secTagText && (
                      <span className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-sm rounded-full text-white uppercase text-[8px] tracking-widest font-mono font-bold px-2.5 py-1">
                        {secTagText}
                      </span>
                    )}
                  </div>

                  {/* Pricing/Specification details */}
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-sans font-black text-xl text-[#3D271B] tracking-tight hover:text-[#554DDC] transition-colors leading-[1.3] truncate mb-2 uppercase">
                        {prodName}
                      </h3>
                      
                      <p className="text-xs text-[#3D271B]/60 leading-relaxed min-h-[44px] line-clamp-2 mb-6">
                        {description || "High structural grade customizable layout options custom tailored for elegant client representation."}
                      </p>

                      {/* Specs pills */}
                      <div className="space-y-3.5 border-t border-[#EBE8D5]/60 pt-5 mb-6">
                        <div className="flex items-center justify-between text-xs text-[#3D271B]/75">
                          <span className="font-mono uppercase font-bold text-gray-400">{texts.minQty}</span>
                          <span className="font-sans font-black text-[#3D271B] bg-[#FAFAF9] px-3 py-1 rounded-full border border-gray-100 shadow-sm">{minQtyText}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#3D271B]/75">
                          <span className="font-mono uppercase font-bold text-gray-400">{texts.startingFrom}</span>
                          <span className="font-mono font-black text-emerald-800 text-sm">{formatPrice(startingPrice)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Integrated CTA actions */}
                    <div className="flex items-center gap-3 w-full">
                      <button
                        onClick={() => onConfigureProduct(product.categoryId)}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#1A3F25] hover:bg-[#112d19] text-white font-sans text-[10px] font-bold py-3.5 px-3 rounded-full uppercase tracking-wider transition-all duration-300 cursor-pointer active:scale-95"
                      >
                        <span>{texts.configureBtn}</span>
                        <ArrowRight size={12} />
                      </button>

                      <button
                        onClick={() => onAddToCart({
                          id: product.id,
                          name: prodName,
                          price: startingPrice,
                          image: product.image,
                          qty: parseInt(minQtyText) || 100,
                          details: `STANDARD E-COMMERCE STOCK PRESET:\n- Category: ${product.categoryId}\n- Tag: ${tagText}\n- Min quantity requirement met: ${minQtyText}`
                        })}
                        className="w-12 h-12 bg-[#FAF9F6] text-[#3D271B] hover:text-[#554DDC] hover:bg-white border border-[#E3DFD7] rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                        title={texts.addToCartBtn}
                      >
                        <ShoppingCart size={15} className="stroke-[2.2]" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
