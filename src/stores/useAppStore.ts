import { create } from "zustand";

interface AppState {
  categories: any[];
  products: any[];
  dimensions: any[];
  finishes: any[];
  tiers: any[];
  papers: any[];
  pricingRules: any | null;
  decorativeRules: any | null;
  discountCodes: any[];
  siteTexts: Record<string, string>;
  submissions: any[];
  bagRibbonHandles: any[];
  paymentMethods: any[];
  newsletterEmail: string;
  newsletterSuccess: boolean;
  aiSettings: {
    systemPrompt: string;
    temperature: number;
    modelName: string;
    enabled: boolean;
  };
  activeCategory: string;
  featuredProducts: any[];
  scrollProgress: number;
  
  // AI Assistant States
  isAssistantOpen: boolean;
  assistantMessages: { role: "user" | "assistant"; text: string }[];
  assistantInput: string;
  isAssistantTyping: boolean;

  // Setters
  setCategories: (categories: any[]) => void;
  setProducts: (products: any[]) => void;
  setDimensions: (dimensions: any[]) => void;
  setFinishes: (finishes: any[]) => void;
  setTiers: (tiers: any[]) => void;
  setPapers: (papers: any[]) => void;
  setPricingRules: (rules: any | null) => void;
  setDecorativeRules: (rules: any | null) => void;
  setDiscountCodes: (codes: any[]) => void;
  setSiteTexts: (texts: Record<string, string>) => void;
  setSubmissions: (submissions: any[]) => void;
  setBagRibbonHandles: (handles: any[]) => void;
  setPaymentMethods: (methods: any[]) => void;
  setNewsletterEmail: (email: string) => void;
  setNewsletterSuccess: (success: boolean) => void;
  setAiSettings: (settings: any) => void;
  setActiveCategory: (category: string) => void;
  setFeaturedProducts: (products: any[]) => void;
  setScrollProgress: (progress: number) => void;
  
  setIsAssistantOpen: (open: boolean) => void;
  setAssistantMessages: (messages: any[] | ((prev: any[]) => any[])) => void;
  setAssistantInput: (input: string) => void;
  setIsAssistantTyping: (typing: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  categories: [],
  products: [],
  dimensions: [],
  finishes: [],
  tiers: [],
  papers: [],
  pricingRules: null,
  decorativeRules: null,
  discountCodes: [],
  siteTexts: {},
  submissions: [],
  bagRibbonHandles: [],
  paymentMethods: [],
  newsletterEmail: "",
  newsletterSuccess: false,
  aiSettings: {
    systemPrompt: "",
    temperature: 0.1,
    modelName: "gemini-3.5-flash",
    enabled: true,
  },
  activeCategory: "bags",
  featuredProducts: [],
  scrollProgress: 0,

  isAssistantOpen: false,
  assistantMessages: [
    {
      role: "assistant",
      text: "Ողջույն! Ես PACKY-ի փաթեթավորման և տպագրության պաշտոնական AI օգնականն եմ։ Կարող եմ Ձեզ խորհրդատվություն տալ տոպրակների, տուփերի, սթիքերների, այցեքարտերի կամ ժապավենների նյութերի, լամինացիայի, չափսերի և տպագրական տեխնիկաների վերաբերյալ։ Ինչպե՞ս կարող եմ օգնել։",
    },
  ],
  assistantInput: "",
  isAssistantTyping: false,

  setCategories: (categories) => set({ categories }),
  setProducts: (products) => set({ products }),
  setDimensions: (dimensions) => set({ dimensions }),
  setFinishes: (finishes) => set({ finishes }),
  setTiers: (tiers) => set({ tiers }),
  setPapers: (papers) => set({ papers }),
  setPricingRules: (pricingRules) => set({ pricingRules }),
  setDecorativeRules: (decorativeRules) => set({ decorativeRules }),
  setDiscountCodes: (discountCodes) => set({ discountCodes }),
  setSiteTexts: (siteTexts) => set({ siteTexts }),
  setSubmissions: (submissions) => set({ submissions }),
  setBagRibbonHandles: (bagRibbonHandles) => set({ bagRibbonHandles }),
  setPaymentMethods: (paymentMethods) => set({ paymentMethods }),
  setNewsletterEmail: (newsletterEmail) => set({ newsletterEmail }),
  setNewsletterSuccess: (newsletterSuccess) => set({ newsletterSuccess }),
  setAiSettings: (aiSettings) => set({ aiSettings }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setFeaturedProducts: (featuredProducts) => set({ featuredProducts }),
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),

  setIsAssistantOpen: (isAssistantOpen) => set({ isAssistantOpen }),
  setAssistantMessages: (updater) =>
    set((state) => ({
      assistantMessages: typeof updater === "function" ? updater(state.assistantMessages) : updater,
    })),
  setAssistantInput: (assistantInput) => set({ assistantInput }),
  setIsAssistantTyping: (isAssistantTyping) => set({ isAssistantTyping }),
}));
