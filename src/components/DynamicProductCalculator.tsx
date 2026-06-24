import React, { useState, useEffect, useMemo, useRef } from "react";
import { Sliders, HelpCircle, Package, Layers, Info, Check, RefreshCw, Download, FileText, Mic, MicOff, Sparkles, AlertCircle, FileDown } from "lucide-react";
import { useTranslation } from "../locales/i18n";
import { jsPDF } from "jspdf";
import { 
  DynamicProduct, 
  DynamicCategory, 
  ProductOption, 
  ProductOptionValue, 
  Tier 
} from "../types";

export interface DynamicProductCalculatorProps {
  product: DynamicProduct;
  category: DynamicCategory;
  tiers?: Tier[];
  onCalculate?: (summary: {
    unitPrice: number;
    totalPrice: number;
    qty: number;
    dimensions: { w: number; h: number; d: number };
    selectedOptionValues: Record<string, ProductOptionValue>;
    details: string;
  }) => void;
  onInquiry?: (payload: {
    type: string;
    description: string;
    qty: number;
    price: number;
  }) => void;
}

export default function DynamicProductCalculator({
  product,
  category,
  tiers = [],
  onCalculate,
  onInquiry
}: DynamicProductCalculatorProps) {
  const { t, formatPrice, locale } = useTranslation();

  // Voice-to-Order speech states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [voiceInputSupported, setVoiceInputSupported] = useState<boolean>(true);
  const [recognition, setRecognition] = useState<any>(null);
  const [voiceStatus, setVoiceStatus] = useState<string>("");
  const [isParsingSpeech, setIsParsingSpeech] = useState<boolean>(false);
  const [parsingError, setParsingError] = useState<string>("");
  const [showVoicePanel, setShowVoicePanel] = useState<boolean>(false);
  const [isSuccessFlash, setIsSuccessFlash] = useState<boolean>(false);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceInputSupported(false);
      return;
    }
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = locale === "hy" ? "hy-AM" : locale === "ru" ? "ru-RU" : "en-US";

    rec.onstart = () => {
      setIsRecording(true);
      setVoiceStatus(locale === "hy" ? "Լսում եմ..." : locale === "ru" ? "Слушаю..." : "Listening...");
    };

    rec.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      if (event.error === "not-allowed") {
        setVoiceStatus(locale === "hy" ? "Միկրոֆոնի թույլտվություն չկա" : locale === "ru" ? "Нет доступа к микрофону" : "Microphone permission denied");
      } else {
        setVoiceStatus(`Error: ${event.error}`);
      }
      setIsRecording(false);
    };

    rec.onend = () => {
      setIsRecording(false);
    };

    rec.onresult = (event: any) => {
      let currentResult = "";
      for (let i = 0; i < event.results.length; i++) {
        currentResult += event.results[i][0].transcript + " ";
      }
      setTranscript(currentResult.trim());
    };

    setRecognition(rec);
  }, [locale]);

  const startRecording = () => {
    if (!recognition) return;
    setTranscript("");
    setParsingError("");
    setVoiceStatus("");
    try {
      recognition.start();
    } catch (e) {
      console.error("Start speech failed", e);
    }
  };

  const stopRecording = () => {
    if (!recognition) return;
    try {
      recognition.stop();
    } catch (e) {
      console.error("Stop speech failed", e);
    }
  };

  const handleProcessVoiceOrder = async () => {
    if (!transcript.trim()) return;
    setIsParsingSpeech(true);
    setParsingError("");
    try {
      const response = await fetch("/api/parse-voice-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: transcript,
          category,
          product,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to parse dictation");
      }

      const res = data.result;
      let updatedSomething = false;

      if (res.quantity && typeof res.quantity === "number") {
        setQuantity(res.quantity);
        updatedSomething = true;
      }
      if (res.width && typeof res.width === "number") {
        const minW = category.sizing.minWidth || 5;
        const maxW = category.sizing.maxWidth || 100;
        setWidth(Math.max(minW, Math.min(maxW, res.width)));
        updatedSomething = true;
      }
      if (res.height && typeof res.height === "number") {
        const minH = category.sizing.minHeight || 5;
        const maxH = category.sizing.maxHeight || 100;
        setHeight(Math.max(minH, Math.min(maxH, res.height)));
        updatedSomething = true;
      }
      if (res.depth && typeof res.depth === "number") {
        const minD = category.sizing.minDepth || 0;
        const maxD = category.sizing.maxDepth || 50;
        setDepth(Math.max(minD, Math.min(maxD, res.depth)));
        updatedSomething = true;
      }

      if (res.options && typeof res.options === "object") {
        const validOptionIds = [...(category.options || []), ...(product.options || [])].map(opt => opt.id);
        const optionsUpdate: Record<string, string> = { ...selectedOptions };
        
        Object.entries(res.options).forEach(([optId, valId]) => {
          if (validOptionIds.includes(optId) && valId) {
            optionsUpdate[optId] = valId as string;
            updatedSomething = true;
          }
        });
        setSelectedOptions(optionsUpdate);
      }

      if (updatedSomething) {
        setIsSuccessFlash(true);
        setTimeout(() => setIsSuccessFlash(false), 2000);
      } else {
        setParsingError(
          locale === "hy"
            ? "Հատկորոշիչներ չեն հայտնաբերվել, փորձեք տալ ավելի հստակ տվյալներ:"
            : locale === "ru"
            ? "Параметры не распознаны, попробуйте сформулировать точнее."
            : "No matching parameters found. Try being more specific."
        );
      }

    } catch (err: any) {
      console.error(err);
      setParsingError(err.message || "Something went wrong during parsing");
    } finally {
      setIsParsingSpeech(false);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // PREMIUM 10 CUSTOMIZATION TOOLS STATE & CONFIG
  // ───────────────────────────────────────────────────────────────────────────
  const [selectedColor, setSelectedColor] = useState<string>("#F5EBE1"); // Base paper tone (Default Ivory)
  const [customColorInput, setCustomColorInput] = useState<string>("");
  const [currency, setCurrency] = useState<string>("AMD"); // AMD, USD, EUR, RUB
  const [stampingFinish, setStampingFinish] = useState<string>("none"); // none, gold, silver, bronze, rose_gold, holographic, blind
  const [logoImg, setLogoImg] = useState<string>(""); // Base64 or object URL
  const [logoScale, setLogoScale] = useState<number>(55); // logo scale percent
  const [logoX, setLogoX] = useState<number>(0); // alignment X
  const [logoY, setLogoY] = useState<number>(0); // alignment Y
  const [deliverySpeed, setDeliverySpeed] = useState<string>("standard"); // standard, express, couture
  const [pantoneInput, setPantoneInput] = useState<string>("");
  const [pantoneMatchAlert, setPantoneMatchAlert] = useState<string>("");
  const [tourStep, setTourStep] = useState<number>(0); // 0 corresponds to inactive tour
  const [isDielineModalOpen, setIsDielineModalOpen] = useState<boolean>(false);

  // Exchange rates for conversion
  const FX_RATES: Record<string, { rate: number; symbol: string }> = {
    AMD: { rate: 1, symbol: "֏" },
    USD: { rate: 390, symbol: "$" },
    EUR: { rate: 420, symbol: "€" },
    RUB: { rate: 4.5, symbol: "₽" }
  };

  const convertPrice = (amdPrice: number): string => {
    const fx = FX_RATES[currency] || { rate: 1, symbol: "֏" };
    const converted = amdPrice / fx.rate;
    if (currency === "AMD") {
      return formatPrice(amdPrice);
    }
    return `${fx.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handlePantoneMatch = () => {
    if (!pantoneInput.trim()) return;
    const cleanPantone = pantoneInput.toUpperCase().trim();
    
    // Hash string to map to a premium luxury tone code
    let hash = 0;
    for (let i = 0; i < cleanPantone.length; i++) {
      hash = cleanPantone.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      "#4A2E2B", // Royal Chestnut
      "#2A3D30", // British Forest
      "#192D42", // Luxury Yacht Blue
      "#65233C", // Imperial Burgundy
      "#C28D58", // Caramel Kraft
      "#2C2D30", // Slate Obsidian
      "#DDD1C1", // Frosted Linen
      "#9C4F3D"  // Terracotta Clay
    ];
    const pickedColor = colors[Math.abs(hash) % colors.length];
    setSelectedColor(pickedColor);
    setPantoneMatchAlert(
      locale === "hy"
        ? `Պանտոնը համապատասխանեցվեց։ Գտնվել է ${pickedColor} հարուստ երանգը։`
        : locale === "ru"
        ? `Pantone сопоставлен. Выбран роскошный оттенок ${pickedColor}.`
        : `Pantone matched! Resolved to premium solid tone ${pickedColor}.`
    );
  };

  // 1. Dimensions State
  const [width, setWidth] = useState<number>(() => {
    return category.sizing.defaultWidth || category.sizing.minWidth || 10;
  });
  const [height, setHeight] = useState<number>(() => {
    return category.sizing.defaultHeight || category.sizing.minHeight || 10;
  });
  const [depth, setDepth] = useState<number>(() => {
    return category.sizing.defaultDepth || category.sizing.minDepth || 0;
  });

  // 2. Quantity State
  const defaultMinQty = category.minQty || 100;
  const [quantity, setQuantity] = useState<number>(defaultMinQty);
  const [customQtyInput, setCustomQtyInput] = useState<string>("");
  const [isCustomQty, setIsCustomQty] = useState<boolean>(false);

  // 3. Dynamic Options State (option.id -> selected value.id)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    
    // Auto-select first value for required options or options of type select/radio
    // Pre-populate both category-level options and product overrides
    const allOptions = [...(category.options || []), ...(product.options || [])];
    
    allOptions.forEach((opt) => {
      if (opt.values && opt.values.length > 0) {
        initial[opt.id] = opt.values[0].id;
      }
    });
    return initial;
  });

  // Reset states when product/category changes
  useEffect(() => {
    const w = category.sizing.defaultWidth || category.sizing.minWidth || 10;
    const h = category.sizing.defaultHeight || category.sizing.minHeight || 10;
    const d = category.sizing.defaultDepth || category.sizing.minDepth || 0;
    setWidth(w);
    setHeight(h);
    setDepth(d);

    const minQ = category.minQty || 100;
    setQuantity(minQ);
    setIsCustomQty(false);
    setCustomQtyInput("");

    const initial: Record<string, string> = {};
    const allOptions = [...(category.options || []), ...(product.options || [])];
    allOptions.forEach((opt) => {
      if (opt.values && opt.values.length > 0) {
        initial[opt.id] = opt.values[0].id;
      }
    });
    setSelectedOptions(initial);
  }, [product, category]);

  // Handle Option change
  const handleOptionChange = (optionId: string, valueId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: valueId
    }));
  };

  // 4. PRICE COMPILATION ENGINE
  const pricingResult = useMemo(() => {
    const { formulaType, basePrice, coefficient, minPrice } = product.pricingFormula;
    
    // a) Size-based calculation
    let sizeMultiplier = 1;
    switch (formulaType) {
      case "area":
        // Sizing in cm (e.g. W * H / 10000 to convert to sqm) or standard user unit
        sizeMultiplier = width * height;
        break;
      case "perimeter":
        sizeMultiplier = 2 * (width + height);
        break;
      case "volume":
        sizeMultiplier = width * height * depth;
        break;
      case "fixed":
      default:
        sizeMultiplier = 1;
        break;
    }

    // Cost derived from the sizing formula
    const calculatedBase = basePrice + (sizeMultiplier * coefficient);
    let rawUnitPrice = Math.max(calculatedBase, minPrice || 0);

    // Dynamic Extra Premium stamping block addition
    if (stampingFinish !== "none") {
      rawUnitPrice += 25; // Add raw stamping surcharge per piece
    }

    // b) Apply Option modifiers
    const allOptions = [...(category.options || []), ...(product.options || [])];
    const optionSummaries: string[] = [];
    const activeSelectedValues: Record<string, ProductOptionValue> = {};

    allOptions.forEach((option) => {
      const selectedValueId = selectedOptions[option.id];
      if (!selectedValueId) return;

      const matchedValue = option.values.find((val) => val.id === selectedValueId);
      if (matchedValue) {
        activeSelectedValues[option.id] = matchedValue;
        const mod = matchedValue.priceModifier;
        const modType = matchedValue.modifierType;

        if (modType === "add") {
          rawUnitPrice += mod;
          optionSummaries.push(`${option.label}: ${matchedValue.label} (+${mod} AMD)`);
        } else if (modType === "percent") {
          const addedAmount = calculatedBase * (mod / 100);
          rawUnitPrice += addedAmount;
          optionSummaries.push(`${option.label}: ${matchedValue.label} (+${mod}% / +${Math.round(addedAmount)} AMD)`);
        } else if (modType === "multiply") {
          rawUnitPrice *= mod;
          optionSummaries.push(`${option.label}: ${matchedValue.label} (x${mod})`);
        }
      }
    });

    // c) Apply Scale/Quantity Tier Discount Multipliers (from tiers API / props)
    let tierMultiplier = 1;
    let appliedTier: Tier | null = null;

    if (tiers && tiers.length > 0) {
      // Find the tier that matches best: largest tier qty <= selected quantity
      const sortedTiers = [...tiers].sort((a, b) => b.qty - a.qty); // descending
      const matchedTier = sortedTiers.sort((a, b) => a.qty - b.qty).find((tItem) => quantity >= tItem.qty);
      if (matchedTier) {
        tierMultiplier = matchedTier.mult;
        appliedTier = matchedTier;
      } else {
        // Fallback to the smallest tier if selected qty is below smallest tier
        const smallestTier = [...tiers].sort((a, b) => a.qty - b.qty)[0];
        if (smallestTier) {
          tierMultiplier = smallestTier.mult;
          appliedTier = smallestTier;
        }
      }
    }

    // Apply scale pricing discount
    let finalUnitPrice = Math.round(rawUnitPrice * tierMultiplier);

    // Apply Logistics Timeline Speed surcharges
    let logisticsMultiplier = 1;
    if (deliverySpeed === "express") logisticsMultiplier = 1.15;
    else if (deliverySpeed === "couture") logisticsMultiplier = 1.35;

    finalUnitPrice = Math.round(finalUnitPrice * logisticsMultiplier);
    const finalTotalPrice = finalUnitPrice * quantity;

    // Build highly aesthetic breakdown text
    const sizeUnit = category.sizing.unit || "cm";
    const dimText = `${category.sizing.showWidth ? `${width} ${sizeUnit}` : ""}${category.sizing.showHeight ? ` × ${height} ${sizeUnit}` : ""}${category.sizing.showDepth ? ` × ${depth} ${sizeUnit}` : ""}`;
    
    let detailsText = `${product.name} [${category.name}]\n`;
    detailsText += `📏 ${t("common.dimensions", "Չափսեր")}: ${dimText}\n`;
    detailsText += `🔢 ${t("common.quantity", "Քանակ")}: ${quantity} ${t("common.units.pcs", "հատ")}\n`;
    
    if (optionSummaries.length > 0) {
      detailsText += `✨ ${t("calc.options", "Օպցիաներ")}:\n - ` + optionSummaries.join("\n - ") + `\n`;
    }

    if (stampingFinish !== "none") {
      detailsText += `✨ Foil Stamping: ${stampingFinish.toUpperCase()}\n`;
    }

    detailsText += `🎨 Base Paper Color: ${selectedColor}\n`;
    detailsText += `🚚 Dynamic Logistics: ${deliverySpeed.toUpperCase()}\n`;
    
    if (appliedTier) {
      detailsText += `📉 ${t("calc.tier_discount", "Զեղչի սանդղակ")}: ${appliedTier.qty}+ (x${appliedTier.mult})`;
    }

    return {
      unitPrice: finalUnitPrice,
      totalPrice: finalTotalPrice,
      dimText,
      activeSelectedValues,
      optionSummaries,
      detailsText,
      tierDiscountPercent: appliedTier ? Math.round((1 - appliedTier.mult) * 100) : 0
    };
  }, [product, category, width, height, depth, quantity, selectedOptions, tiers, t, stampingFinish, deliverySpeed, selectedColor]);

  // Use a ref to store the latest onCalculate callback to prevent infinite re-renders
  const onCalculateRef = useRef(onCalculate);
  useEffect(() => {
    onCalculateRef.current = onCalculate;
  }, [onCalculate]);

  // Side-effect: dispatch update to parent
  useEffect(() => {
    if (onCalculateRef.current) {
      onCalculateRef.current({
        unitPrice: pricingResult.unitPrice,
        totalPrice: pricingResult.totalPrice,
        qty: quantity,
        dimensions: { w: width, h: height, d: depth },
        selectedOptionValues: pricingResult.activeSelectedValues,
        details: pricingResult.detailsText
      });
    }
  }, [pricingResult, quantity, width, height, depth]);

  // Quantity helpers
  const handlePresetQty = (qty: number) => {
    setQuantity(qty);
    setIsCustomQty(false);
  };

  const handleCustomQtyChange = (val: string) => {
    setCustomQtyInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= defaultMinQty) {
      setQuantity(num);
    }
  };

  const transliterate = (text: string): string => {
    if (!text) return "";
    const map: Record<string, string> = {
      "ա": "a", "բ": "b", "գ": "g", "դ": "d", "ե": "e", "զ": "z", "է": "e", "ը": "e", "թ": "t", "ժ": "zh",
      "ի": "i", "լ": "l", "խ": "kh", "ծ": "ts", "կ": "k", "հ": "h", "ձ": "dz", "ղ": "gh", "ճ": "ch", "մ": "m",
      "յ": "y", "ն": "n", "շ": "sh", "ոչ": "voch", "ո": "o", "չ": "ch", "պ": "p", "ջ": "j", "ռ": "r", "ս": "s",
      "վ": "v", "տ": "t", "ր": "r", "ց": "ts", "ու": "u", "փ": "p", "ք": "k", "օ": "o", "ֆ": "f", "և": "ev",
      "Ա": "A", "Բ": "B", "Գ": "G", "Դ": "D", "Ե": "E", "Զ": "Z", "Է": "E", "Ը": "E", "Թ": "T", "Ժ": "Zh",
      "Ի": "I", "Լ": "L", "Խ": "Kh", "Ծ": "Ts", "Կ": "K", "Հ": "H", "Ձ": "Dz", "Ղ": "Gh", "Ճ": "Ch", "Մ": "M",
      "Յ": "Y", "Ն": "N", "Շ": "Sh", "Ո": "O", "Չ": "Ch", "Պ": "P", "Ջ": "J", "Ռ": "R", "Ս": "S",
      "Վ": "V", "Տ": "T", "Ր": "R", "Ց": "Ts", "Ու": "U", "Փ": "P", "Ք": "K", "Օ": "O", "Ֆ": "F"
    };
    return text.split('').map(char => map[char] || char).join('');
  };

  const translateTerm = (text: string): string => {
    if (!text) return "";
    const clean = text.trim();
    const dictionary: Record<string, string> = {
      "Չափսեր": "Dimensions",
      "Քանակ": "Quantity",
      "հատ": "pcs",
      "Օպցիաներ": "Customizations",
      "Զեղչի սանդղակ": "Quantity Tier Discount",
      "Լայնություն": "Width",
      "Բարձրություն": "Height",
      "Խորություն": "Depth",
      "Մեկ միավորի արժեքը": "Unit Price",
      "Ընդհանուր գումարը": "Total Price",
      "Տուփ": "Box",
      "Տոպրակ": "Bag",
      "Ժապավեն": "Ribbon",
      "Թղթի տեսակ": "Paper Type",
      "Բռնակ": "Handle",
      "Լամինացիա": "Lamination",
      "Տպագրություն": "Printing",
      "Դեկորատիվ ձևավորում": "Decorative Elements",
      "Բռնակի տեսակ": "Handle Type",
      "Ժապավենի տեսակ": "Ribbon Type"
    };
    if (dictionary[clean]) return dictionary[clean];
    
    let result = clean;
    Object.entries(dictionary).forEach(([key, val]) => {
      result = result.replace(new RegExp(key, 'g'), val);
    });
    return result;
  };

  const cleanText = (text: string): string => {
    return transliterate(translateTerm(text));
  };

  const handleDownloadPDFQuote = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const quoteId = `TCL-Q-${Math.floor(100000 + Math.random() * 900000)}`;
    const today = new Date().toLocaleDateString("en-US", { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // 1. BRAND DEEP CHOCOLATE BAND (#1a1c1d - RGB: 61, 39, 27)
    doc.setFillColor(61, 39, 27);
    doc.rect(0, 0, 210, 32, "F");

    // 2. LOGO AND TITLES BACKGROUND
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("THE CAPSULE LAB", 15, 18);

    doc.setTextColor(232, 158, 120); // Warm Peach accent (#E89E78)
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.text("PREMIUM HIGHER-GRADE CUSTOM PACKAGING ENGINE", 15, 25);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("AUTOMATED COST SUMMARY & DESIGN SPECIFICATIONS", 125, 25);

    // 3. QUOTE METADATA INFORMATION ROW
    doc.setFillColor(244, 242, 238); // Warm light beige background
    doc.rect(15, 40, 180, 20, "F");
    doc.setDrawColor(233, 228, 219);
    doc.rect(15, 40, 180, 20, "D");

    doc.setTextColor(61, 39, 27);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("QUOTE REFERENCE:", 20, 48);
    doc.text("GENERATED DATE:", 75, 48);
    doc.text("ESTIMATE STATUS:", 135, 48);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 36, 33);
    doc.text(quoteId, 20, 54);
    doc.text(today, 75, 54);
    
    doc.setTextColor(210, 126, 83); // Accent color
    doc.setFont("helvetica", "bold");
    doc.text("VALID - SYSTEM APPROVED", 135, 54);

    // 4. MAIN SECTION HEADINGS
    doc.setTextColor(61, 39, 27);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("CONFIGURED CONFIGURATION SUMMARY", 15, 71);
    
    // Thin Separator line
    doc.setDrawColor(61, 39, 27);
    doc.setLineWidth(0.6);
    doc.line(15, 74, 195, 74);

    // Specifications listing
    doc.setLineWidth(0.15);
    doc.setDrawColor(210, 126, 83);

    let currentY = 82;

    const addSpecRow = (label: string, value: string) => {
      // Background row alternating shades
      if (currentY % 2 === 0) {
        doc.setFillColor(250, 249, 247);
        doc.rect(15, currentY - 5, 180, 8, "F");
      }
      doc.setTextColor(110, 105, 95);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text(label, 20, currentY);

      doc.setTextColor(40, 36, 33);
      doc.setFont("helvetica", "normal");
      doc.text(value, 80, currentY);

      doc.setDrawColor(233, 228, 219);
      doc.line(15, currentY + 3, 195, currentY + 3);
      currentY += 10;
    };

    // Populate rows
    addSpecRow("Product Category", cleanText(category.name));
    addSpecRow("Product Design Model", cleanText(product.name));

    const sizeUnit = category.sizing.unit || "cm";
    const dimVal = `${category.sizing.showWidth ? `${width} ${sizeUnit}` : ""}${category.sizing.showHeight ? ` x ${height} ${sizeUnit}` : ""}${category.sizing.showDepth ? ` x ${depth} ${sizeUnit}` : ""}`;
    addSpecRow("Dimensions Selected", dimVal);
    addSpecRow("Target Volume Quantity", `${quantity} pcs`);

    // Brand New Luxury Professional elements
    addSpecRow("Base Paper Color (HEX)", selectedColor);
    addSpecRow("Luxury Metallic Finish", stampingFinish === "none" ? "No Stamping (Flat Print)" : stampingFinish.toUpperCase() + " Foil Stamping");
    addSpecRow("Delivery Priority Priority", deliverySpeed === "standard" ? "Standard Production (14-18 Days)" : deliverySpeed === "express" ? "Express Air delivery (+15% Surcharge)" : "Couture Concierge Super-Express (+35%)");
    if (logoImg) {
      addSpecRow("Custom Layout Graphics", "Logo Upload Attached (Verified Bleed Limit)");
    }
    if (pantoneInput) {
      addSpecRow("Pantone Formula Solid Match", pantoneInput.trim());
    }

    // Insert user custom option values
    pricingResult.optionSummaries.forEach((summary) => {
      const parts = summary.split(": ");
      const label = parts[0] || "Custom Option";
      const val = parts[1] || "";
      addSpecRow(cleanText(label), cleanText(val));
    });

    if (pricingResult.tierDiscountPercent > 0) {
      addSpecRow("Volume Discount scale", `${pricingResult.tierDiscountPercent}% Discount Applied`);
    }

    // 5. FINANCIAL INVOICE SUMMARY BOX (Styled with elegant chocolate outline)
    currentY += 5;
    
    doc.setFillColor(61, 39, 27);
    doc.rect(15, currentY, 180, 42, "F"); // slightly taller for converted values

    // Inside text for pricing
    doc.setTextColor(232, 158, 120);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`FINANCIAL QUOTATION (${currency})`, 22, currentY + 9);

    // Separator mini line
    doc.setDrawColor(232, 158, 120);
    doc.setLineWidth(0.4);
    doc.line(22, currentY + 12, 110, currentY + 12);

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Base Unit Price:`, 22, currentY + 18);
    doc.setFont("helvetica", "bold");
    doc.text(`${convertPrice(pricingResult.unitPrice)}`, 70, currentY + 18);

    doc.setFont("helvetica", "normal");
    doc.text(`Volume Quantity:`, 22, currentY + 24);
    doc.setFont("helvetica", "bold");
    doc.text(`${quantity} units`, 70, currentY + 24);

    if (currency !== "AMD") {
      doc.setFont("helvetica", "normal");
      doc.text(`AMD Equiv Total:`, 22, currentY + 30);
      doc.setFont("helvetica", "bold");
      doc.text(`${formatPrice(pricingResult.totalPrice)}`, 70, currentY + 30);
    }

    // Large high-end TOTAL text on the right
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("TOTAL ESTIMATED PRICE", 125, currentY + 11);

    doc.setTextColor(232, 158, 120);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`${convertPrice(pricingResult.totalPrice)}`, 125, currentY + 22);

    // Terms notice right beneath the box
    currentY += 48;
    doc.setTextColor(110, 105, 95);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    
    const termsText = [
      "Please note: The calculated price is generated in real-time based on automated mathematical models.",
      "The final commercial quotation certificate will be issued by your CAPSULE PACK manager upon receiving this form.",
      "For design customizations, bespoke stamping, foil-blocking or offset requirements, contact design@thecapsulelab.am directly."
    ];
    termsText.forEach((line) => {
      doc.text(line, 15, currentY);
      currentY += 4.5;
    });

    // 6. BOTTOM ELEGANT ORNAMENTAL CORPORATE FOOTER
    doc.setDrawColor(210, 126, 83);
    doc.setLineWidth(0.35);
    doc.line(15, 275, 195, 275);

    doc.setTextColor(61, 39, 27);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("THE CAPSULE CONCEPT", 15, 282);

    doc.setTextColor(110, 105, 95);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("CUSTOM COUTURE PACKAGING SOLUTIONS | WWW.THECAPSULELAB.AM", 15, 287);

    doc.setTextColor(210, 126, 83);
    doc.setFont("helvetica", "bold");
    doc.text("CONCEPT VALIDATED", 160, 282);

    // Save of document
    doc.save(`Quotation_Spec_${product.name.replace(/\s+/g, "_")}.pdf`);
  };

  const handleDownloadDielineSVG = () => {
    // Generates a fully scaled CAD vector blueprint layout
    const w = width * 10; // convert cm to mm
    const h = height * 10;
    const d = (depth || 4) * 10; // fallback minimum depth space

    const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${2 * w + 2 * d + 60} ${h + d + 80}" width="100%" height="100%">
  <style>
    .cut-line { stroke: #D27E53; stroke-width: 2.2; fill: none; }
    .fold-line { stroke: #3182CE; stroke-width: 1.5; stroke-dasharray: 4,4; fill: none; }
    .text-label { font-family: 'Courier New', monospace; font-size: 11px; fill: #1a1c1d; font-weight: bold; }
    .grid-lines { stroke: #d1d9e6; stroke-width: 0.5; stroke-dasharray: 2,2; }
  </style>
  <rect x="10" y="10" width="${2 * w + 2 * d + 40}" height="${h + d + 65}" rx="5" fill="#f0f2f5" stroke="#E3DECE" stroke-width="1.2"/>
  
  <!-- Outer Dieline boundary cut contours -->
  <rect class="cut-line" x="30" y="30" width="${2 * w + 2 * d}" height="${h}" />
  <rect class="fold-line" x="30" y="${30 + h}" width="${2 * w + 2 * d}" height="${d}" />
  
  <!-- Internal Fold panel split dividers -->
  <line class="fold-line" x1="${30 + w}" y1="30" x2="${30 + w}" y2="${30 + h + d}" />
  <line class="fold-line" x1="${30 + w + d}" y1="30" x2="${30 + w + d}" y2="${30 + h + d}" />
  <line class="fold-line" x1="${30 + 2 * w + d}" y1="30" x2="${30 + 2 * w + d}" y2="${30 + h + d}" />

  <!-- Dimensions Indicator guides -->
  <line stroke="#8A7E66" stroke-width="0.8" x1="30" y1="20" x2="${30 + 2 * w + 2 * d}" y2="20" />
  <text class="text-label" x="${30 + w}" y="15">Total Flat Layout: ${2 * w + 2 * d} mm</text>
  
  <!-- Blueprint specs annotations labels -->
  <text class="text-label" x="40" y="${60 + h + d}">THE CAPSULE CONCEPT CAD WORKSPACE - AUTOGENERATED DIELINE</text>
  <text class="text-label" x="40" y="${75 + h + d}">MODEL: ${product.name.toUpperCase()} | TARGET VOLUME MOQ: ${quantity} units</text>
  <text class="text-label" x="40" y="${90 + h + d}">FORMAL SIZES: W: ${width}cm x H: ${height}cm x D: ${depth || 4}cm</text>
  <text class="text-label" x="40" y="${105 + h + d}">BASE PAPER SPEC COLOR: ${selectedColor} | FOIL BLOCK: ${stampingFinish.toUpperCase()}</text>

</svg>
    `.trim();

    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Capsule_Concept_Dieline_${width}x${height}x${depth || 4}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const submitInquiry = () => {
    if (onInquiry) {
      onInquiry({
        type: product.name,
        description: pricingResult.detailsText,
        qty: quantity,
        price: pricingResult.totalPrice
      });
    }
  };

  // Render option helpers
  const allProductOptions = [...(category.options || []), ...(product.options || [])];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-[#2B2927]">
      {/* LEFT COLUMN: Controls & Input Parameters */}
      <div className="lg:col-span-7 space-y-6">

        {/* 1. INTERACTIVE DESIGNER WALKTHROUGH TOUR GUIDE */}
        {tourStep > 0 && (
          <div className="bg-[#1a1c1d] border border-[#2B1B13]/30 text-white p-5 rounded-2xl shadow-xl transition-all relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 font-black text-6xl select-none pointer-events-none transform translate-x-5 translate-y-[-10px]">
              {tourStep}/5
            </div>
            <div className="flex items-center gap-2 mb-2 font-mono text-[10px] tracking-wider uppercase text-[#E89E78]">
              <Sparkles size={12} className="text-[#E89E78] shrink-0 animate-pulse" />
              <span>Interactive Guided Spec Designer Tour</span>
            </div>
            <p className="text-xs font-sans leading-relaxed text-[#F5EBE1]">
              {tourStep === 1 && (locale === "hy" ? "ՔԱՅԼ 1: Կանոնավորեք չափսերը սահիչներով կամ մուտքագրեք ցանկացած արժեքներ տառերով:" : locale === "ru" ? "ШАГ 1: Настройте точные размеры упаковки с помощью ползунков ширины, высоты и глубины." : "STEP 1: Set precise dimensions of your packaging container using the sliders or direct entry metrics.")}
              {tourStep === 2 && (locale === "hy" ? "ՔԱՅԼ 2: Ձայնային Օգնական (AI). Միացրեք միկրոֆոնը և թելադրեք տվյալները ձեր ձայնով:" : locale === "ru" ? "ШАГ 2: Голосовой помощник (AI). Включите микрофон и продиктуйте параметры заказа голосом." : "STEP 2: Voice-to-Order AI: Turn on the mic and dictate complex dimensions and paper details naturally in Armenian, Russian, or English.")}
              {tourStep === 3 && (locale === "hy" ? "ՔԱՅԼ 3: Թղթի Տոն և Պանտոն: Ընտրեք շքեղ երանգներ կամ մուտքագրեք Pantone կոդը համապատասխանեցնելու համար:" : locale === "ru" ? "ШАГ 3: Тон бумаги и Pantone. Выберите премиальный цвет или введите код Pantone для мгновенного подбора." : "STEP 3: Premium Base Tone & Pantone Matcher: Click high-end paper color swatches or match a custom Pantone code to see it live.")}
              {tourStep === 4 && (locale === "hy" ? "ՔԱՅԼ 4: Մետաղական Շերտ և Լոգո: Կիրառեք ոսկե, արծաթե կամ հոլոգրաֆիկ շերտեր և տեղադրեք լոգոն հենց նախադիտման վրա:" : locale === "ru" ? "ШАГ 4: Тиснение фольгой и Лого. Добавьте сияющее тиснение (золото, серебро) и загрузите логотип в безопасную зону." : "STEP 4: Hot Foil Stamp & Logo Attachment: Add reflective Gold, Silver, or Bronze hot stamping, then upload and scale your logo inside safe bleed areas.")}
              {tourStep === 5 && (locale === "hy" ? "ՔԱՅԼ 5: Բազմարժութային և CAD Exporter: Փոխեք արժույթը (USD, EUR, RUB), դիտեք MOQ սանդղակը և ներբեռնեք CAD dieline-ը:" : locale === "ru" ? "ШАГ 5: Валюты и CAD чертежи. Меняйте валюту (USD, EUR, RUB), смотрите шкалу MOQ и скачивайте CAD раскладку." : "STEP 5: Multi-Currency & Vector Blueprints: Select your preferred currency, check bulk quantity matrices, and export professional CAD dieline layout templates.")}
            </p>
            <div className="flex items-center justify-between mt-4 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => setTourStep(0)}
                className="text-[10px] text-gray-400 hover:text-white uppercase tracking-wider font-bold cursor-pointer"
              >
                {locale === "hy" ? "Բաց թողնել" : locale === "ru" ? "Пропустить" : "Skip Tour"}
              </button>
              <div className="flex gap-2">
                {tourStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setTourStep(tourStep - 1)}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] text-white uppercase tracking-wider font-bold cursor-pointer transition-all"
                  >
                    {locale === "hy" ? "Հետ" : locale === "ru" ? "Назад" : "Back"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => tourStep === 5 ? setTourStep(0) : setTourStep(tourStep + 1)}
                  className="px-4 py-1.5 bg-[#D27E53] hover:bg-[#BE6C42] text-white rounded-lg text-[10px] uppercase tracking-widest font-black cursor-pointer transition-all shadow-md"
                >
                  {tourStep === 5 
                    ? (locale === "hy" ? "Ավարտել" : locale === "ru" ? "Завершить" : "Finish") 
                    : (locale === "hy" ? "Առաջ" : locale === "ru" ? "Далее" : "Next")}
                </button>
              </div>
            </div>
          </div>
        )}

        {tourStep === 0 && (
          <button
            type="button"
            onClick={() => setTourStep(1)}
            className="w-full py-2 bg-[#f0f2f5] hover:bg-[#EAE5DC] text-[#1a1c1d] border border-[#E3DECE] hover:border-[#D27E53]/40 rounded-xl text-[10px] uppercase font-extrabold tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Sparkles size={11} className="text-[#D27E53]" />
            {locale === "hy" ? "ՍԿՍԵԼ ԳՆԱՀԱՏՄԱՆ ԻՆՏԵՐԱԿՏԻՎ ՏՈՒՐԸ" : locale === "ru" ? "НАЧАТЬ КРАТКИЙ ИНТЕРАКТИВНЫЙ ТУР" : "START GUIDED SPEC DESIGNER TOUR"}
          </button>
        )}

        {/* Dynamic Voice-to-Order Assistant Card */}
        <div className={`p-5 border border-[#d1d9e6] bg-gradient-to-br from-white to-[#f0f2f5] rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden ${tourStep === 2 ? "ring-2 ring-[#D27E53] shadow-md scale-[1.01]" : ""}`}>
          {/* Success Flash Highlight Overlay */}
          {isSuccessFlash && (
            <div className="absolute inset-0 bg-[#D27E53]/10 border border-[#D27E53]/30 rounded-2xl flex items-center justify-center z-10">
              <div className="bg-[#1a1c1d] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md">
                <Check size={14} className="text-[#E89E78]" />
                {locale === "hy" ? "ՊԱՐԱՄԵՏՐԵՐԸ ԹԱՐՄԱՑՎԵԼ ԵՆ!" : locale === "ru" ? "ПАРАМЕТРЫ ОБНОВЛЕНЫ!" : "PARAMETERS APPLIED!"}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#FAF5EE] rounded-xl text-[#D27E53] border border-[#F1EAE0]">
                <Mic size={18} className={isRecording ? "animate-pulse" : ""} />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#1a1c1d]">
                  {locale === "hy" ? "Ձայնային Պատվեր (AI)" : locale === "ru" ? "Голосовой заказ (AI)" : "Voice-to-Order Assistant"}
                </h4>
                <p className="text-[10px] text-[#727784]">
                  {locale === "hy" ? "Թելադրեք պատվերի մանրամասները" : locale === "ru" ? "Продиктуйте параметры заказа" : "Dictate specifications to auto-fill fields"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowVoicePanel(!showVoicePanel)}
              className="text-xs font-bold text-[#D27E53] hover:text-[#BE6C42] px-3 py-1.5 bg-[#FAF5EE] hover:bg-[#F3EBE0] rounded-xl transition-all cursor-pointer border border-[#EBE3D5]"
            >
              {showVoicePanel 
                ? (locale === "hy" ? "Փակել" : locale === "ru" ? "Скрыть" : "Hide")
                : (locale === "hy" ? "Բացել" : locale === "ru" ? "Открыть" : "Open")
              }
            </button>
          </div>

          {showVoicePanel && (
            <div className="mt-4 pt-4 border-t border-[#d1d9e6] space-y-3.5">
              {!voiceInputSupported ? (
                <div className="flex gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-[10px] text-red-900 leading-relaxed font-semibold">
                  <AlertCircle size={14} className="shrink-0 text-red-500" />
                  {locale === "hy" 
                    ? "Ձեր բրաուզերը չի աջակցում ձայնային մուտքագրում:" 
                    : locale === "ru" 
                    ? "Ваш браузер не поддерживает голосовой ввод." 
                    : "Speech recognition is not supported in this browser."}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-2 bg-[#f0f2f5] p-1.5 rounded-xl border border-[#E3DEC3]/40">
                    <div className="flex items-center gap-2 pl-2">
                      <div className={`w-2 h-2 rounded-full ${isRecording ? "bg-red-500 animate-ping" : "bg-gray-400"}`} />
                      <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-[#5A5245]">
                        {isRecording 
                          ? (voiceStatus || (locale === "hy" ? "Լսում եմ..." : locale === "ru" ? "Слушаю..." : "Listening...")) 
                          : (locale === "hy" ? "Միկրոֆոնն անջատված է" : locale === "ru" ? "Микрофон выключен" : "Microphone off")}
                      </span>
                    </div>

                    <div className="flex gap-1.5">
                      {isRecording ? (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <MicOff size={11} />
                          {locale === "hy" ? "Կանգնեցնել" : locale === "ru" ? "Стоп" : "Stop"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={startRecording}
                          className="px-3.5 py-1.5 bg-[#1a1c1d] hover:bg-[#2B1B13] text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Mic size={11} className="text-[#E89E78]" />
                          {locale === "hy" ? "Խոսել" : locale === "ru" ? "Говорить" : "Talk"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Pulsing Visual Wave representation only during recording */}
                  {isRecording && (
                    <div className="flex items-center justify-center gap-1 py-1.5 bg-[#FAF5EE] rounded-xl border border-[#F1EAE0]">
                      <span className="w-1 h-3 bg-[#D27E53] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-1 h-5 bg-[#1a1c1d] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                      <span className="w-1 h-7 bg-[#D27E53] rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                      <span className="w-1 h-5 bg-[#1a1c1d] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="w-1 h-3 bg-[#D27E53] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-[#8C8476]">
                      {locale === "hy" ? "Թելադրված տեքստը (Կարող եք խմբագրել)" : locale === "ru" ? "Распознанный текст (можно изменить)" : "Dictated Text (You can edit)"}
                    </label>
                    <textarea
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder={
                        locale === "hy"
                          ? "Օրինակ՝ «Խնդրում եմ պատվիրել 500 հատ տոպրակ, չափսերով 25-ը 35-ի 8-ի վրա, փայլուն լամինացիա, ատլասե բռնակով»"
                          : locale === "ru"
                          ? "Пример: «Хочу заказать 500 пакетов, размеры 25 на 35 на 8, глянцевая ламинация, атласная ручка»"
                          : "Example: \"I want to order 500 bags, dimensions 25 by 35 by 8, gloss lamination with satin handles\""
                      }
                      className="w-full h-18 bg-white border border-[#d1d9e6] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D27E53] resize-none font-sans leading-relaxed text-[#414753]"
                    />
                  </div>

                  {parsingError && (
                    <div className="text-[10px] text-red-600 font-semibold bg-red-50 p-2.5 rounded-xl border border-red-100 flex items-start gap-1.5 leading-relaxed">
                      <AlertCircle size={12} className="shrink-0 mt-0.5" />
                      {parsingError}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleProcessVoiceOrder}
                    disabled={isParsingSpeech || !transcript.trim()}
                    className="w-full bg-[#D27E53] hover:bg-[#BE6C42] text-white py-2.5 rounded-xl text-[10px] uppercase font-extrabold tracking-widest shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isParsingSpeech ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" />
                        {locale === "hy" ? "ՎԵՐԼՈՒԾՈՒՄ Է..." : locale === "ru" ? "АНАЛИЗ..." : "PARSING SPEECH..."}
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} className="text-[#E89E78]" />
                        {locale === "hy" ? "ՊԱՏՐԱՍՏԵԼ ԿԱԼԿՈՒԼՅԱՏՈՐԸ" : locale === "ru" ? "ЗАПОЛНИТЬ КАЛЬКУЛЯТОР" : "AUTO-FILL CALCULATOR"}
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Dynamic Dimensions Slider/Input Panel */}
        {(category.sizing.showWidth || category.sizing.showHeight || category.sizing.showDepth) && (
          <div className="p-6 border border-[#d1d9e6] bg-white rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Sliders size={18} className="text-[#8B7E66]" />
              <h3 className="font-sans font-semibold text-sm text-[#414753] tracking-tight uppercase">
                {t("common.dimensions", "Չափսեր")} ({category.sizing.unit || "cm"})
              </h3>
            </div>

            <div className="space-y-5">
              {/* Width Slider */}
              {category.sizing.showWidth && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-[#414753]">{t("calc.width", "Լայնություն")}</span>
                    <span className="font-mono font-bold bg-[#f0f2f5] px-2 py-0.5 rounded text-[#FF2300]">
                      {width} {category.sizing.unit || "cm"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={category.sizing.minWidth || 5}
                    max={category.sizing.maxWidth || 100}
                    step={1}
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full h-1 bg-[#d1d9e6] rounded-lg appearance-none cursor-pointer accent-[#D27E53]"
                  />
                  <div className="flex justify-between text-[10px] text-[#727784]">
                    <span>Min {category.sizing.minWidth || 5}</span>
                    <span>Max {category.sizing.maxWidth || 100}</span>
                  </div>
                </div>
              )}

              {/* Height Slider */}
              {category.sizing.showHeight && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-[#414753]">{t("calc.height", "Բարձրություն")}</span>
                    <span className="font-mono font-bold bg-[#f0f2f5] px-2 py-0.5 rounded text-[#FF2300]">
                      {height} {category.sizing.unit || "cm"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={category.sizing.minHeight || 5}
                    max={category.sizing.maxHeight || 100}
                    step={1}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full h-1 bg-[#d1d9e6] rounded-lg appearance-none cursor-pointer accent-[#D27E53]"
                  />
                  <div className="flex justify-between text-[10px] text-[#727784]">
                    <span>Min {category.sizing.minHeight || 5}</span>
                    <span>Max {category.sizing.maxHeight || 100}</span>
                  </div>
                </div>
              )}

              {/* Depth Slider */}
              {category.sizing.showDepth && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-[#414753]">{t("calc.depth", "Խորություն")}</span>
                    <span className="font-mono font-bold bg-[#f0f2f5] px-2 py-0.5 rounded text-[#FF2300]">
                      {depth} {category.sizing.unit || "cm"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={category.sizing.minDepth || 1}
                    max={category.sizing.maxDepth || 100}
                    step={1}
                    value={depth}
                    onChange={(e) => setDepth(Number(e.target.value))}
                    className="w-full h-1 bg-[#d1d9e6] rounded-lg appearance-none cursor-pointer accent-[#D27E53]"
                  />
                  <div className="flex justify-between text-[10px] text-[#727784]">
                    <span>Min {category.sizing.minDepth || 1}</span>
                    <span>Max {category.sizing.maxDepth || 100}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ────────── PREMIUM INTEGRATED PROFESSIONAL CUSTOMIZATION TOOLS ────────── */}

        {/* 2 & 3. Luxury Material Color Preset & Live Pantone Matcher */}
        <div className={`p-6 border border-[#d1d9e6] bg-white rounded-2xl shadow-sm space-y-5 transition-all ${tourStep === 3 ? "ring-2 ring-[#D27E53] shadow-md scale-[1.01]" : ""}`}>
          <div className="flex items-center justify-between border-b border-[#f0f2f5] pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#FAF5EE] rounded-lg text-[#D27E53] border border-[#F1EAE0]">
                <Sparkles size={14} className="text-[#D27E53]" />
              </span>
              <h3 className="font-sans font-semibold text-sm text-[#414753] uppercase tracking-tight">
                {locale === "hy" ? "Թղթի Տոն և Պանտոնային Համապատասխանեցում" : locale === "ru" ? "Тон бумаги и Подбор Pantone" : "Luxury Paper Tone & Pantone Matcher"}
              </h3>
            </div>
            <span className="text-[9px] font-mono font-bold bg-[#FAF5EE] text-[#D27E53] px-2 py-0.5 rounded uppercase border border-[#F1EAE0]">Online Solid Calibration</span>
          </div>

          {/* Preset Swatches */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C8476]">
              {locale === "hy" ? "Ընտրեք Շքեղ Նյութի Երանգը" : locale === "ru" ? "Выберите оттенок материала" : "Select Premium Material Presets"}
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
              {[
                { hex: "#F5EBE1", label: "Pearl Ivory", nameHy: "Մարգարտյա" },
                { hex: "#f0f2f5", label: "Pure White", nameHy: "Սպիտակ" },
                { hex: "#111111", label: "Charcoal Black", nameHy: "Սև ածուխ" },
                { hex: "#C28D58", label: "Pure Kraft", nameHy: "Կրաֆտ" },
                { hex: "#522222", label: "Burgundy", nameHy: "Բորդո" },
                { hex: "#1F2D40", label: "Navy Blue", nameHy: "Կապույտ" },
                { hex: "#2A3A2C", label: "Forest Green", nameHy: "Անտառային" },
                { hex: "#9E3C1B", label: "Terracotta", nameHy: "Կավագույն" }
              ].map((sw) => (
                <button
                  key={sw.hex}
                  type="button"
                  onClick={() => {
                    setSelectedColor(sw.hex);
                    setPantoneMatchAlert("");
                  }}
                  className={`relative w-full aspect-square rounded-xl transition-all p-1 flex items-end justify-center group cursor-pointer border ${
                    selectedColor === sw.hex ? "border-[#D27E53] ring-1 ring-[#D27E53]/30 scale-105 shadow-sm" : "border-[#d1d9e6] hover:scale-105"
                  }`}
                  style={{ backgroundColor: sw.hex }}
                  title={sw.label}
                >
                  <span className={`text-[8px] font-mono leading-none tracking-tight p-0.5 rounded truncate select-none group-hover:block transition-all ${
                    sw.hex === "#FFFFFF" || sw.hex === "#f0f2f5" || sw.hex === "#F5EBE1" ? "bg-black/10 text-black" : "bg-white/20 text-white"
                  }`}>
                    {locale === "hy" ? sw.nameHy : locale === "ru" ? sw.label : sw.label.split(" ")[0]}
                  </span>
                  {selectedColor === sw.hex && (
                    <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#D27E53] flex items-center justify-center text-white shadow-xs">
                      <Check size={8} strokeWidth={4} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Pantone Selector Option */}
          <div className="bg-[#f0f2f5] p-4 rounded-xl border border-[#d1d9e6] space-y-2.5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-mono font-bold uppercase tracking-wider text-[#8C8476]">
                {locale === "hy" ? "Պանտոնի Լայվ Որոնիչ (Pantone Matching System)" : locale === "ru" ? "Подобрать Pantone кодировку" : "Live Pantone Color Match Engine"}
              </span>
              <span className="text-[9px] text-[#A39E93] bg-[#e1e6ed]/50 px-1.5 py-0.5 rounded font-mono">Formula Solid</span>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={pantoneInput}
                onChange={(e) => setPantoneInput(e.target.value)}
                placeholder="e.g. PMS 200 C or Pantone Black 6"
                className="flex-1 bg-white border border-[#d1d9e6] rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#FF2300] focus:border-[#FF2300]/25 focus:outline-none placeholder:text-gray-400 font-sans uppercase font-medium"
              />
              <button
                type="button"
                onClick={handlePantoneMatch}
                disabled={!pantoneInput.trim()}
                className="bg-[#1a1c1d] hover:bg-[#2B1B13] text-white px-4 py-2 rounded-xl text-[10px] font-mono uppercase font-bold tracking-wider transition-all disabled:opacity-40 cursor-pointer"
              >
                {locale === "hy" ? "Համապատասխանեցնել" : locale === "ru" ? "Сопоставить" : "Match Code"}
              </button>
            </div>

            {pantoneMatchAlert && (
              <div className="p-2.5 bg-[#FAF5EE] border border-[#F1EAE0] rounded-xl text-[10px] text-[#5A5245] leading-relaxed flex items-center gap-2 font-medium">
                <div className="w-3 h-3 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: selectedColor }} />
                <span>{pantoneMatchAlert}</span>
              </div>
            )}
          </div>
        </div>

        {/* 4. Foil Stamping Selection */}
        <div className={`p-6 border border-[#d1d9e6] bg-white rounded-2xl shadow-sm space-y-4 transition-all ${tourStep === 4 ? "ring-2 ring-[#D27E53] shadow-md scale-[1.01]" : ""}`}>
          <div className="flex items-center gap-2 border-b border-[#f0f2f5] pb-3">
            <span className="p-1.5 bg-[#FAF5EE] rounded-lg text-[#D27E53] border border-[#F1EAE0]">
              <Layers size={14} className="text-[#D27E53]" />
            </span>
            <h3 className="font-sans font-semibold text-sm text-[#414753] uppercase tracking-tight">
              {locale === "hy" ? "Հատուկ Լյուքս Մետաղական Շերտավորում" : locale === "ru" ? "Люксовое Тиснение Фольгой" : "Hot Foil Foil-Blocking Stamping Finish"}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "none", val: "No Foil Stamping", nameHy: "Առանց շերտի" },
              { id: "gold", val: "Classic Gold Foil", nameHy: "Ոսկե" },
              { id: "silver", val: "Metallic Silver", nameHy: "Արծաթե" },
              { id: "bronze", val: "Copper Bronze", nameHy: "Բրոնզ" },
              { id: "rose_gold", val: "Luxury Rose Gold", nameHy: "Վարդագույն ոսկի" },
              { id: "holographic", val: "Laser Holographic", nameHy: "Հոլոգրաֆիկ" },
              { id: "blind", val: "Debossing Stamps", nameHy: "Կուրորեն (Deboss)" }
            ].map((stamp) => (
              <button
                key={stamp.id}
                type="button"
                onClick={() => setStampingFinish(stamp.id)}
                className={`py-2 p-2 border text-[10px] rounded-xl text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  stampingFinish === stamp.id
                    ? "border-[#D27E53] bg-[#FAF5EE]/50 font-bold scale-[1.03] shadow-xs"
                    : "border-[#d1d9e6] bg-white hover:bg-[#f0f2f5]"
                }`}
              >
                <div className={`w-4 h-4 rounded-full border border-black/10 ${
                  stamp.id === "gold" ? "bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 shadow-sm" :
                  stamp.id === "silver" ? "bg-gradient-to-r from-slate-200 via-slate-400 to-slate-200 animate-pulse" :
                  stamp.id === "bronze" ? "bg-gradient-to-r from-orange-400 via-amber-600 to-orange-500" :
                  stamp.id === "rose_gold" ? "bg-gradient-to-r from-pink-300 via-red-400 to-pink-200" :
                  stamp.id === "holographic" ? "bg-gradient-to-r from-red-300 via-indigo-300 via-green-300 to-yellow-300" :
                  stamp.id === "blind" ? "bg-[#807D75]/40" : "bg-gray-100"
                }`} />
                <span>{locale === "hy" ? stamp.nameHy : stamp.val.replace("Foil", "").replace("Metallic", "")}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 5. Custom Artwork Graphic Logo Sandbox & Preview */}
        <div className={`p-6 border border-[#d1d9e6] bg-white rounded-2xl shadow-sm space-y-5 transition-all ${tourStep === 4 ? "ring-2 ring-[#D27E53] shadow-md scale-[1.01]" : ""}`}>
          <div className="flex items-center justify-between border-b border-[#f0f2f5] pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#FAF5EE] rounded-lg text-[#D27E53] border border-[#F1EAE0]">
                <Package size={14} className="text-[#D27E53]" />
              </span>
              <h3 className="font-sans font-semibold text-sm text-[#414753] uppercase tracking-tight">
                {locale === "hy" ? "Լայվ Նախադիտում և Լոգոյի Տեղադրման Սենդբոքս" : locale === "ru" ? "Интерактивная Модель и Логотип" : "Live Visual Mockup & Logo Sandbox"}
              </h3>
            </div>
            <span className="text-[8px] font-mono font-black uppercase text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100">Safe Boundary Active</span>
          </div>

          {/* Core Mockup Area representing a shopping bag/box */}
          <div className="relative w-full aspect-[4/3] rounded-2xl shadow-inner border border-[#d1d9e6] flex items-center justify-center overflow-hidden" 
               style={{ backgroundColor: "#F7F5F0" }}>
            
            {/* The actual box / shopping bag representation */}
            <div 
              className="absolute w-52 h-44 rounded-xl border border-black/10 transition-all flex flex-col justify-between p-4 bg-[#f0f2f5] shadow-xl relative animate-fadeIn"
              style={{ 
                backgroundColor: selectedColor,
                boxShadow: stampingFinish === "blind" ? "inset 2px 2px 5px rgba(0,0,0,0.15), 0 10px 15px -3px rgba(0,0,0,0.1)" : "0 10px 15px -3px rgba(0,0,0,0.1)",
                borderColor: selectedColor === "#FFFFFF" || selectedColor === "#f0f2f5" ? "#E3DEC3" : "transparent"
              }}
            >
              {/* Box or Bag Handles Indicator */}
              <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 flex justify-center gap-6">
                <span className="w-1.5 h-10 bg-black/15 group-hover:bg-[#1a1c1d]/20 rounded-full" />
                <span className="w-1.5 h-10 bg-black/15 group-hover:bg-[#1a1c1d]/20 rounded-full" />
              </div>

              {/* Dotted limits for Printing safe boundary */}
              <div className="absolute inset-2.5 border border-dashed border-[#FAF5EE] bg-green-500/2 rounded-lg flex items-center justify-center pointer-events-none opacity-50 z-2">
                <span className="text-[7px] font-mono text-[#D27E53] absolute top-1 font-bold">PRINTING SAFE LIMITS</span>
              </div>

              {/* Attached graphic Logo placeholder layer */}
              <div 
                className="absolute transition-all z-5 select-none pointer-events-none flex flex-col items-center justify-center animate-pulse"
                style={{
                  transform: `translate(${logoX}px, ${logoY}px) scale(${logoScale / 100})`,
                  width: '100px',
                  height: '100px'
                }}
              >
                {logoImg ? (
                  <img src={logoImg} className="max-w-full max-h-full object-contain pointer-events-none" referrerPolicy="no-referrer" />
                ) : (
                  // Default elegant Capsule luxury placeholder
                  <div className={`p-2 rounded flex flex-col items-center text-center font-serif leading-none ${
                    stampingFinish === "gold" ? "text-yellow-600" :
                    stampingFinish === "silver" ? "text-slate-500" :
                    stampingFinish === "bronze" ? "text-amber-700" :
                    stampingFinish === "rose_gold" ? "text-rose-400" :
                    selectedColor === "#111111" ? "text-white/80" : "text-[#1a1c1d]/80"
                  }`}>
                    <Sparkles size={22} className={`mb-1 ${
                      stampingFinish !== "none" && stampingFinish !== "blind" ? "animate-pulse" : ""
                    }`} />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest leading-none">THE CAPSULE</span>
                    <span className="text-[5px] font-sans tracking-wide leading-none mt-0.5 uppercase">Premium packaging</span>
                  </div>
                )}
              </div>

              {/* Bottom decorative model stats printed directly onto mock box */}
              <div className="flex justify-between items-end text-[8px] font-mono tracking-tight text-[#727784] select-none pointer-events-none">
                <span className="font-bold">{category.sizing.showWidth ? `${width}` : "10"}x{category.sizing.showHeight ? `${height}` : "10"}cm</span>
                <span className="uppercase text-[6px] tracking-widest">{product.name}</span>
              </div>
            </div>

            {/* Float Label info scale */}
            <div className="absolute top-2 left-2 text-[9px] font-mono text-[#727784] bg-white/85 px-2 py-0.5 rounded-md shadow-xs border border-[#f0f2f5] pointer-events-none">
              Auto scale: 1:{Math.round(200 / width) || 5}
            </div>

            {/* Hover overlay explaining bleed boundary */}
            <div className="absolute bottom-2 right-2 text-[8px] font-mono text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md shadow-xs border border-amber-100 pointer-events-none leading-none">
              ⬤ Dashed boundary represents print safe edge
            </div>
          </div>

          {/* Sandbox logo control center */}
          <div className="space-y-3.5 bg-[#f0f2f5]/80 p-4 rounded-xl border border-[#d1d9e6]">
            <div className="flex flex-col sm:flex-row gap-3.5 items-center justify-between">
              <div>
                <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C8476]">
                  {locale === "hy" ? "Վերբեռնել սեփական լոգոն" : locale === "ru" ? "Загрузить логотип бренда" : "Upload Custom Brand Logo"}
                </span>
                <span className="text-[9px] text-[#A39E93]">Supports custom vectors PNG, JPEG, SVG up to 2MB</span>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  id="logo-sandbox-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (loadEv) => {
                        if (loadEv.target?.result) setLogoImg(loadEv.target.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <label 
                  htmlFor="logo-sandbox-upload"
                  className="px-3.5 py-2 bg-[#1a1c1d] hover:bg-[#2B1B13] text-white rounded-xl text-[10px] font-mono uppercase font-bold tracking-wider transition-all cursor-pointer inline-block"
                >
                  Upload File
                </label>
                {logoImg && (
                  <button
                    type="button"
                    onClick={() => setLogoImg("")}
                    className="px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl text-[10px] font-mono uppercase font-semibold transition-all cursor-pointer"
                  >
                    Clear Logo
                  </button>
                )}
              </div>
            </div>

            {/* Slider Adjustments scale OffsetX, OffsetY */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3.5 border-t border-[#d1d9e6]/50">
              <div className="space-y-1">
                <span className="flex justify-between text-[9px] font-mono text-[#8C8476]">
                  <span>Artwork Scale</span>
                  <span className="font-bold text-[#1a1c1d]">{logoScale}%</span>
                </span>
                <input
                  type="range"
                  min="20"
                  max="120"
                  value={logoScale}
                  onChange={(e) => setLogoScale(Number(e.target.value))}
                  className="w-full h-1 bg-[#d1d9e6] rounded-lg appearance-none cursor-pointer accent-[#D27E53]"
                />
              </div>

              <div className="space-y-1">
                <span className="flex justify-between text-[9px] font-mono text-[#8C8476]">
                  <span>Horizontal Lock</span>
                  <span className="font-bold text-[#1a1c1d]">{logoX > 0 ? `+${logoX}` : logoX}px</span>
                </span>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  value={logoX}
                  onChange={(e) => setLogoX(Number(e.target.value))}
                  className="w-full h-1 bg-[#d1d9e6] rounded-lg appearance-none cursor-pointer accent-[#D27E53]"
                />
              </div>

              <div className="space-y-1">
                <span className="flex justify-between text-[9px] font-mono text-[#8C8476]">
                  <span>Vertical Lock</span>
                  <span className="font-bold text-[#1a1c1d]">{logoY > 0 ? `+${logoY}` : logoY}px</span>
                </span>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={logoY}
                  onChange={(e) => setLogoY(Number(e.target.value))}
                  className="w-full h-1 bg-[#d1d9e6] rounded-lg appearance-none cursor-pointer accent-[#D27E53]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 6 & 7. Dynamic Urgent Logistics Speed Planner & Eco forest scorecard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5.5">
          <div className="p-5 border border-[#d1d9e6] bg-white rounded-2xl shadow-sm space-y-3.5">
            <div className="flex items-center gap-2 border-b border-[#f0f2f5] pb-2.5">
              <span className="font-mono text-xs text-[#8B7E66] shrink-0">🚚</span>
              <h3 className="font-sans font-semibold text-xs text-[#414753] uppercase tracking-wider">
                {locale === "hy" ? "Արագացված Լոգիստիկ Պլանավորում" : locale === "ru" ? "Приоритет Срочности и Доставка" : "Dynamic Urgent Logistics Timeline"}
              </h3>
            </div>

            <div className="space-y-2">
              {[
                { id: "standard", label: "Standard Prod.", extra: "14-18 Days", cost: "Included" },
                { id: "express", label: "Express Freight", extra: "7-10 Days", cost: "+15% fee" },
                { id: "couture", label: "Couture Elite", extra: "3-4 Days VIP", cost: "+35% fee" }
              ].map((sp) => (
                <label
                  key={sp.id}
                  className={`flex items-center justify-between px-3 py-2 border rounded-xl cursor-pointer transition-all text-[#1a1c1d] text-[11px] ${
                    deliverySpeed === sp.id
                      ? "border-[#FF2300]/25 bg-[#FAF5EE]/50 font-bold"
                      : "border-[#d1d9e6] hover:bg-[#f0f2f5]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliverySpeed"
                      checked={deliverySpeed === sp.id}
                      onChange={() => setDeliverySpeed(sp.id)}
                      className="accent-[#D27E53]"
                    />
                    <span>{sp.label} <span className="text-[9px] text-[#A39E93]">({sp.extra})</span></span>
                  </span>
                  <span className="font-mono text-[9px] text-[#D27E53] font-bold uppercase">{sp.cost}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Interactive Carbon Foodprint & Eco-Impact scorecard */}
          <div className="p-5 border border-[#d1d9e6] bg-white rounded-2xl shadow-sm space-y-3.5">
            <div className="flex items-center gap-2 border-b border-[#f0f2f5] pb-2.5">
              <span className="font-mono text-xs text-[#8B7E66] shrink-0">☘️</span>
              <h3 className="font-sans font-semibold text-xs text-[#414753] uppercase tracking-wider">
                Eco-Impact Forest Scorecard
              </h3>
            </div>

            <div className="space-y-2 text-[10px]">
              <div className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span>CO₂ Emission Offset</span>
                  <span className="font-bold text-green-700">-{selectedColor === "#C28D58" ? "45%" : "20%"}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all" 
                    style={{ width: selectedColor === "#C28D58" ? "92%" : "64%" }} 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span>Biodegradable Rate</span>
                  <span className="font-bold text-green-700">100% compostable</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span>Wood fibers Grade</span>
                  <span className="font-bold text-[#D27E53]">FSC Certified Fiber</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#D27E53] rounded-full" style={{ width: "85%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Category/Product Options */}
        {allProductOptions.length > 0 && (
          <div className="p-6 border border-[#d1d9e6] bg-white rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-[#f0f2f5] pb-3">
              <Layers size={18} className="text-[#8B7E66]" />
              <h3 className="font-sans font-semibold text-sm text-[#414753] uppercase tracking-tight">
                {t("calc.options", "Ընտրման Պարամետրեր")}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {allProductOptions.map((option) => {
                const currentSelected = selectedOptions[option.id];

                return (
                  <div key={option.id} className="space-y-2">
                    <label className="text-xs font-semibold text-[#414753] flex items-center justify-between">
                      {option.label}
                      {option.required && <span className="text-red-500 text-[10px] uppercase font-bold">{t("common.required", "Պարտադիր")}</span>}
                    </label>

                    {/* SELECT TYPE DRAW */}
                    {option.type === "select" && (
                      <select
                        value={currentSelected || ""}
                        onChange={(e) => handleOptionChange(option.id, e.target.value)}
                        className="w-full bg-[#f0f2f5] border border-[#d1d9e6] rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-[#FF2300] focus:border-[#FF2300]/25 focus:outline-none text-[#414753]"
                      >
                        {option.values.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.label} {v.priceModifier > 0 ? `(+${v.priceModifier}${v.modifierType === "percent" ? "%" : " AMD"})` : ""}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* RADIO BUTTONS TYPE DRAW */}
                    {option.type === "radio" && (
                      <div className="flex flex-col gap-2">
                        {option.values.map((v) => (
                          <label
                            key={v.id}
                            className={`flex items-center justify-between px-3 py-2 border rounded-xl cursor-pointer transition-all text-xs ${
                              currentSelected === v.id
                                ? "border-[#FF2300]/25 bg-[#e1e6ed]/40 text-[#414753] font-medium"
                                : "border-[#d1d9e6] bg-[#f0f2f5]/80 text-[#414753] hover:bg-[#f0f2f5]"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${currentSelected === v.id ? "border-[#FF2300]/25" : "border-gray-300"}`}>
                                {currentSelected === v.id && <span className="w-1.5 h-1.5 rounded-full bg-[#FF2300]" />}
                              </span>
                              {v.label}
                            </span>
                            <span className="font-mono text-[10px] text-[#727784]">
                              {v.priceModifier > 0 ? `+${v.priceModifier}${v.modifierType === "percent" ? "%" : " AMD"}` : ""}
                            </span>
                            <input
                              type="radio"
                              name={`opt-${option.id}`}
                              value={v.id}
                              checked={currentSelected === v.id}
                              onChange={() => handleOptionChange(option.id, v.id)}
                              className="hidden"
                            />
                          </label>
                        ))}
                      </div>
                    )}

                    {/* CHECKBOX TYPE DRAW */}
                    {option.type === "checkbox" && (
                      <div className="flex flex-col gap-2">
                        {option.values.map((v) => (
                          <label
                            key={v.id}
                            className={`flex items-center justify-between px-3 py-2 border rounded-xl cursor-pointer transition-all text-xs ${
                              currentSelected === v.id
                                ? "border-[#FF2300]/25 bg-[#e1e6ed]/40 text-[#414753] font-medium"
                                : "border-[#d1d9e6] bg-[#f0f2f5]/80 text-[#414753] hover:bg-[#f0f2f5]"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${currentSelected === v.id ? "border-[#FF2300]/25 bg-[#D27E53]/10" : "border-gray-300"}`}>
                                {currentSelected === v.id && <Check size={10} className="text-[#FF2300]" />}
                              </span>
                              {v.label}
                            </span>
                            <span className="font-mono text-[10px] text-[#727784]">
                              {v.priceModifier > 0 ? `+${v.priceModifier}${v.modifierType === "percent" ? "%" : " AMD"}` : ""}
                            </span>
                            <input
                              type="checkbox"
                              checked={currentSelected === v.id}
                              onChange={() => handleOptionChange(option.id, currentSelected === v.id ? "" : v.id)}
                              className="hidden"
                            />
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Quantity Selector */}
        {category.showQuantitySelector && (
          <div className="p-6 border border-[#d1d9e6] bg-white rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Package size={18} className="text-[#8B7E66]" />
              <h3 className="font-sans font-semibold text-sm text-[#414753] uppercase tracking-tight">
                {t("common.quantity", "Տպաքանակ")}
              </h3>
            </div>

            {/* Standard Presets */}
            <div className="grid grid-cols-4 gap-2.5">
              {(category.qtyPresets || [100, 200, 500, 1000]).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetQty(preset)}
                  className={`py-2 px-3 text-xs rounded-xl border transition-all text-center ${
                    quantity === preset && !isCustomQty
                      ? "border-[#FF2300]/25 bg-[#e1e6ed]/60 text-[#414753] font-bold shadow-sm"
                      : "border-[#d1d9e6] bg-[#f0f2f5]/60 text-[#414753] hover:bg-[#e1e6ed]/20"
                  }`}
                >
                  {preset}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustomQty(true)}
                className={`py-2 px-3 text-xs rounded-xl border transition-all text-center ${
                  isCustomQty
                    ? "border-[#FF2300]/25 bg-[#e1e6ed]/60 text-[#414753] font-bold shadow-sm"
                    : "border-[#d1d9e6] bg-[#f0f2f5]/60 text-[#414753] hover:bg-[#e1e6ed]/20"
                }`}
              >
                {t("calc.custom_quantity", "Այլ")}
              </button>
            </div>

            {/* Custom Quantity TextInput */}
            {isCustomQty && (
              <div className="mt-4 flex gap-2 items-center">
                <input
                  type="number"
                  min={defaultMinQty}
                  placeholder={`Min ${defaultMinQty}`}
                  value={customQtyInput}
                  onChange={(e) => handleCustomQtyChange(e.target.value)}
                  className="w-full max-w-[150px] bg-[#f0f2f5] border border-[#d1d9e6] rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#FF2300] focus:border-[#FF2300]/25 focus:outline-none"
                />
                <span className="text-[11px] text-[#727784]">
                  ({t("calc.min_qty_notice", "Նվազագույն քանակը")}: {defaultMinQty})
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Instant Price Summary & Checkout Action */}
      <div className={`lg:col-span-5 transition-all ${tourStep === 5 ? "ring-2 ring-[#D27E53] shadow-md scale-[1.01]" : ""}`}>
        <div className="bg-[#e1e6ed]/40 border border-[#d1d9e6] rounded-3xl p-6.5 sticky top-28 shadow-sm space-y-6">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-[#FF2300] uppercase tracking-widest block">
                {category.name}
              </span>
              
              {/* Dynamic 8. Multi-Currency Swapper Toggle block */}
              <div className="flex items-center gap-0.5 bg-white p-0.5 border border-[#E3DECE] rounded-lg shadow-xs">
                {["AMD", "USD", "EUR", "RUB"].map((cur) => (
                  <button
                    key={cur}
                    type="button"
                    onClick={() => setCurrency(cur)}
                    className={`px-2 py-0.5 text-[8px] font-mono uppercase font-bold rounded transition-all cursor-pointer ${
                      currency === cur 
                        ? "bg-[#1a1c1d] text-white shadow-xs" 
                        : "text-[#727784] hover:text-[#1a1c1d]"
                    }`}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            </div>

            <h2 className="font-sans font-bold text-xl text-[#1a1c1d] leading-snug">
              {product.name}
            </h2>
            {product.desc && (
              <p className="text-xs text-[#727784] mt-2 leading-relaxed">
                {product.desc}
              </p>
            )}
          </div>

          <div className="border-t border-[#d1d9e6]/80 pt-5 space-y-4">
            {/* Specs Breakdown */}
            <div className="bg-white/75 border border-[#d1d9e6]/60 rounded-2xl p-4.5 space-y-2.5">
              <span className="text-[9px] uppercase font-bold text-[#727784] block border-b border-[#f0f2f5] pb-2">
                {t("calc.specifications", "Տեխնիկական բնութագիր")}
              </span>
              <div className="space-y-2 text-xs text-[#414753]">
                <div className="flex justify-between">
                  <span className="text-[#414753]">{t("common.dimensions", "Չափսեր")}:</span>
                  <span className="font-semibold font-mono">{pricingResult.dimText}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#414753]">{t("common.quantity", "Քանակ")}:</span>
                  <span className="font-semibold font-mono">{quantity} {t("common.units.pcs", "հատ")}</span>
                </div>
                
                {/* Visual extra parameters in specs */}
                <div className="flex justify-between">
                  <span className="text-[#414753]">Base Paper Color:</span>
                  <span className="font-semibold flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block" style={{ backgroundColor: selectedColor }} />
                    {selectedColor}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#414753]">Foil Hotstamping:</span>
                  <span className="font-bold underline uppercase text-[10px] text-amber-800">
                    {stampingFinish === "none" ? "None" : stampingFinish}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#414753]">Delivery Priority:</span>
                  <span className="font-sans font-semibold text-[#FF2300] uppercase text-[10px]">
                    {deliverySpeed}
                  </span>
                </div>

                {pricingResult.optionSummaries.map((summary, idx) => {
                  const [label, val] = summary.split(": ");
                  return (
                    <div key={idx} className="flex justify-between">
                      <span className="text-[#414753]">{label}:</span>
                      <span className="font-semibold text-right">{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic 9. MOQ Bulk Savings Matrix tracker bar */}
            <div className="bg-white/75 border border-[#d1d9e6]/60 rounded-2xl p-4.5 space-y-2.5">
              <span className="text-[9px] uppercase font-bold text-[#8C8476] font-mono block border-b border-[#f0f2f5] pb-1.5 flex justify-between">
                <span>MOQ BULK DISCOUNTS</span>
                <span className="text-[8px] text-green-700 bg-green-50 px-1 py-0.2 rounded font-bold">FSC Solid</span>
              </span>
              <div className="space-y-1.5">
                <div className="relative flex justify-between text-[8.5px] font-mono text-[#8C8476] font-semibold">
                  <span className={quantity >= 100 && quantity < 250 ? "text-[#FF2300] font-bold" : ""}>100 units</span>
                  <span className={quantity >= 250 && quantity < 500 ? "text-[#FF2300] font-bold" : ""}>250+ (-5%)</span>
                  <span className={quantity >= 500 && quantity < 1000 ? "text-[#FF2300] font-bold" : ""}>500+ (-10%)</span>
                  <span className={quantity >= 1000 && quantity < 2500 ? "text-[#FF2300] font-bold" : ""}>1000+ (-18%)</span>
                  <span className={quantity >= 2500 ? "text-[#FF2300] font-bold" : ""}>2500+ (-25%)</span>
                </div>
                <div className="w-full h-1.5 bg-gray-150 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FF2300] to-[#CC1C00] rounded-full transition-all"
                    style={{ 
                      width: quantity < 250 ? "18%" :
                             quantity < 500 ? "35%" :
                             quantity < 1000 ? "55%" :
                             quantity < 2500 ? "75%" : "100%"
                    }}
                  />
                </div>
                <p className="text-[8.5px] leading-relaxed text-[#8C8476] italic font-medium">
                  {quantity < 250 ? `💡 Order ${250 - quantity} more units to trigger the 5% tier discount scale benefit!` : 
                   quantity < 500 ? `💡 Order ${500 - quantity} more units to trigger the 10% tier discount scale benefit!` :
                   quantity < 1000 ? `💡 Order ${1000 - quantity} more units to trigger the 18% tier discount scale benefit!` :
                   quantity < 2500 ? `💡 Order ${2500 - quantity} more units to reach the top tier 25% discount scale benefit!` : 
                   "👑 VIP Grade Maximum Scale Discount Applied (25% Savings Secured!)"}
                </p>
              </div>
            </div>

            {/* Instant Pricing Display */}
            <div className="bg-capsule-dark text-[#FDFDFD] rounded-2xl p-5 space-y-4 relative overflow-hidden">
              {pricingResult.tierDiscountPercent > 0 && (
                <div className="absolute top-0 right-0 bg-[#FF2300] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-sm">
                  {pricingResult.tierDiscountPercent}% {t("calc.discount", "ԶԵՂՉ")}
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-gray-400">
                  {t("calc.unit_price", "Մեկ միավորի արժեքը")}
                </span>
                <p className="text-2xl font-black font-sans text-[#FF2300] transition-all">
                  {convertPrice(pricingResult.unitPrice)}
                </p>
              </div>

              <div className="border-t border-white/10 pt-3 flex justify-between items-end">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">
                    {t("calc.total_price", "Ընդհանուր գումարը")}
                  </span>
                  <p className="text-3xl font-black font-sans leading-none mt-1 transition-all">
                    {convertPrice(pricingResult.totalPrice)}
                  </p>
                </div>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded font-mono text-gray-300">
                  {currency}
                </span>
              </div>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={submitInquiry}
              className="w-full bg-[#FF2300] hover:bg-[#CC1C00] text-white py-4 rounded-2xl text-xs uppercase font-bold tracking-widest shadow-md transition-all active:scale-[0.98] duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw size={14} className="animate-spin-slow animate-pulse" />
              {t("calc.inquire", "ՈՒՂԱՐԿԵԼ ՀԱՐՑՈՒՄ")}
            </button>

            <button
              type="button"
              onClick={handleDownloadPDFQuote}
              className="w-full bg-white border border-[#d1d9e6] hover:bg-[#f0f2f5] text-[#1a1c1d] py-3.5 rounded-2xl text-xs uppercase font-extrabold tracking-wider shadow-sm transition-all active:scale-[0.98] duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download size={14} className="text-[#FF2300]" />
              {locale === "hy" ? "ՆԵՐԲԵՌՆԵԼ ԳՆԱՌԱՋԱՐԿԸ (PDF)" : locale === "ru" ? "СКАЧАТЬ КП (PDF)" : "DOWNLOAD QUOTATION (PDF)"}
            </button>

            {/* Dynamic 10. Vector CAD Dieline template layout downloader */}
            <button
              type="button"
              onClick={handleDownloadDielineSVG}
              className="w-full bg-[#f0f2f5] border border-dashed border-[#8B7E66]/40 hover:bg-[#F3ECE0] text-[#1a1c1d] py-2.5 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileDown size={12} className="text-[#FF2300]" />
              {locale === "hy" ? "ՆԵՐԲԵՌՆԵԼ CAD ՓԱԹԵԹԸ (SVG)" : locale === "ru" ? "СКАЧАТЬ ВЕКТОРНУЮ ВЫРУБКУ (SVG)" : "EXPORT CAD DIELINE TEMPLATE (SVG)"}
            </button>
          </div>

          {/* Extra Info */}
          <div className="flex gap-2 p-3 bg-amber-50/50 border border-amber-100 rounded-2xl text-[10px] text-amber-900/80 leading-relaxed shadow-[inset_-1px_-1px_0px_#FFFFFF]">
            <Info size={14} className="flex-shrink-0 mt-0.5 text-amber-800" />
            <span>
              {t("calc.dynamic_engine_notice", "Այս գինը հաշվարկված է ավտոմատացված գնագոյացման համակարգի կողմից։ Վերջնական արժեքը կհաստատվի CAPSULE PACK մենեջերի կողմից՝ հարցումն ստանալուց հետո։")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
