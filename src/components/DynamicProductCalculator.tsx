import React, { useState, useEffect, useMemo } from "react";
import { Sliders, HelpCircle, Package, Layers, Info, Check, RefreshCw } from "lucide-react";
import { useTranslation } from "../locales/i18n";
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
  const { t, formatPrice } = useTranslation();

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
      const matchedTier = sortedTiers.find((tItem) => quantity >= tItem.qty);
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
    const finalUnitPrice = Math.round(rawUnitPrice * tierMultiplier);
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
  }, [product, category, width, height, depth, quantity, selectedOptions, tiers, t]);

  // Side-effect: dispatch update to parent
  useEffect(() => {
    if (onCalculate) {
      onCalculate({
        unitPrice: pricingResult.unitPrice,
        totalPrice: pricingResult.totalPrice,
        qty: quantity,
        dimensions: { w: width, h: height, d: depth },
        selectedOptionValues: pricingResult.activeSelectedValues,
        details: pricingResult.detailsText
      });
    }
  }, [pricingResult, quantity, width, height, depth, onCalculate]);

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
        
        {/* Dynamic Dimensions Slider/Input Panel */}
        {(category.sizing.showWidth || category.sizing.showHeight || category.sizing.showDepth) && (
          <div className="p-6 border border-[#E9E4DB] bg-white rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Sliders size={18} className="text-[#8B7E66]" />
              <h3 className="font-sans font-semibold text-sm text-[#403C39] tracking-tight uppercase">
                {t("common.dimensions", "Չափսեր")} ({category.sizing.unit || "cm"})
              </h3>
            </div>

            <div className="space-y-5">
              {/* Width Slider */}
              {category.sizing.showWidth && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-[#403C39]">{t("calc.width", "Լայնություն")}</span>
                    <span className="font-mono font-bold bg-[#F4F2EE] px-2 py-0.5 rounded text-capsule-accent">
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
                    className="w-full h-1 bg-[#E9E4DB] rounded-lg appearance-none cursor-pointer accent-[#D27E53]"
                  />
                  <div className="flex justify-between text-[10px] text-capsule-text-muted">
                    <span>Min {category.sizing.minWidth || 5}</span>
                    <span>Max {category.sizing.maxWidth || 100}</span>
                  </div>
                </div>
              )}

              {/* Height Slider */}
              {category.sizing.showHeight && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-[#403C39]">{t("calc.height", "Բարձրություն")}</span>
                    <span className="font-mono font-bold bg-[#F4F2EE] px-2 py-0.5 rounded text-capsule-accent">
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
                    className="w-full h-1 bg-[#E9E4DB] rounded-lg appearance-none cursor-pointer accent-[#D27E53]"
                  />
                  <div className="flex justify-between text-[10px] text-capsule-text-muted">
                    <span>Min {category.sizing.minHeight || 5}</span>
                    <span>Max {category.sizing.maxHeight || 100}</span>
                  </div>
                </div>
              )}

              {/* Depth Slider */}
              {category.sizing.showDepth && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-[#403C39]">{t("calc.depth", "Խորություն")}</span>
                    <span className="font-mono font-bold bg-[#F4F2EE] px-2 py-0.5 rounded text-capsule-accent">
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
                    className="w-full h-1 bg-[#E9E4DB] rounded-lg appearance-none cursor-pointer accent-[#D27E53]"
                  />
                  <div className="flex justify-between text-[10px] text-capsule-text-muted">
                    <span>Min {category.sizing.minDepth || 1}</span>
                    <span>Max {category.sizing.maxDepth || 100}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dynamic Category/Product Options */}
        {allProductOptions.length > 0 && (
          <div className="p-6 border border-[#E9E4DB] bg-white rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-[#F4F2EE] pb-3">
              <Layers size={18} className="text-[#8B7E66]" />
              <h3 className="font-sans font-semibold text-sm text-[#403C39] uppercase tracking-tight">
                {t("calc.options", "Ընտրման Պարամետրեր")}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {allProductOptions.map((option) => {
                const currentSelected = selectedOptions[option.id];

                return (
                  <div key={option.id} className="space-y-2">
                    <label className="text-xs font-semibold text-[#403C39] flex items-center justify-between">
                      {option.label}
                      {option.required && <span className="text-red-500 text-[10px] uppercase font-bold">{t("common.required", "Պարտադիր")}</span>}
                    </label>

                    {/* SELECT TYPE DRAW */}
                    {option.type === "select" && (
                      <select
                        value={currentSelected || ""}
                        onChange={(e) => handleOptionChange(option.id, e.target.value)}
                        className="w-full bg-[#FAFAF9] border border-[#E9E4DB] rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-capsule-accent focus:border-capsule-accent focus:outline-none text-[#403C39]"
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
                                ? "border-capsule-accent bg-[#EFECE6]/40 text-[#403C39] font-medium"
                                : "border-[#E9E4DB] bg-[#FAFAF9]/80 text-capsule-text-secondary hover:bg-[#FAFAF9]"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${currentSelected === v.id ? "border-capsule-accent" : "border-gray-300"}`}>
                                {currentSelected === v.id && <span className="w-1.5 h-1.5 rounded-full bg-capsule-accent" />}
                              </span>
                              {v.label}
                            </span>
                            <span className="font-mono text-[10px] text-capsule-text-muted">
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
                                ? "border-capsule-accent bg-[#EFECE6]/40 text-[#403C39] font-medium"
                                : "border-[#E9E4DB] bg-[#FAFAF9]/80 text-capsule-text-secondary hover:bg-[#FAFAF9]"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${currentSelected === v.id ? "border-capsule-accent bg-[#D27E53]/10" : "border-gray-300"}`}>
                                {currentSelected === v.id && <Check size={10} className="text-capsule-accent" />}
                              </span>
                              {v.label}
                            </span>
                            <span className="font-mono text-[10px] text-capsule-text-muted">
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
          <div className="p-6 border border-[#E9E4DB] bg-white rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Package size={18} className="text-[#8B7E66]" />
              <h3 className="font-sans font-semibold text-sm text-[#403C39] uppercase tracking-tight">
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
                      ? "border-capsule-accent bg-[#EFECE6]/60 text-[#403C39] font-bold shadow-sm"
                      : "border-[#E9E4DB] bg-[#FAFAF9]/60 text-capsule-text-secondary hover:bg-[#EFECE6]/20"
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
                    ? "border-capsule-accent bg-[#EFECE6]/60 text-[#403C39] font-bold shadow-sm"
                    : "border-[#E9E4DB] bg-[#FAFAF9]/60 text-capsule-text-secondary hover:bg-[#EFECE6]/20"
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
                  className="w-full max-w-[150px] bg-[#FAFAF9] border border-[#E9E4DB] rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-capsule-accent focus:border-capsule-accent focus:outline-none"
                />
                <span className="text-[11px] text-capsule-text-muted">
                  ({t("calc.min_qty_notice", "Նվազագույն քանակը")}: {defaultMinQty})
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Instant Price Summary & Checkout Action */}
      <div className="lg:col-span-5">
        <div className="bg-[#EFECE6]/40 border border-[#E9E4DB] rounded-3xl p-6.5 sticky top-28 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-bold text-capsule-accent uppercase tracking-widest block mb-1">
              {category.name}
            </span>
            <h2 className="font-sans font-bold text-xl text-capsule-dark leading-snug">
              {product.name}
            </h2>
            {product.desc && (
              <p className="text-xs text-capsule-text-muted mt-2 leading-relaxed">
                {product.desc}
              </p>
            )}
          </div>

          <div className="border-t border-[#E9E4DB]/80 pt-5 space-y-4">
            {/* Specs Breakdown */}
            <div className="bg-white/75 border border-[#E9E4DB]/60 rounded-2xl p-4.5 space-y-2.5">
              <span className="text-[9px] uppercase font-bold text-capsule-text-muted block border-b border-[#F4F2EE] pb-2">
                {t("calc.specifications", "Տեխնիկական բնութագիր")}
              </span>
              <div className="space-y-2 text-xs text-[#403C39]">
                <div className="flex justify-between">
                  <span className="text-capsule-text-secondary">{t("common.dimensions", "Չափսեր")}:</span>
                  <span className="font-semibold font-mono">{pricingResult.dimText}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-capsule-text-secondary">{t("common.quantity", "Քանակ")}:</span>
                  <span className="font-semibold font-mono">{quantity} {t("common.units.pcs", "հատ")}</span>
                </div>
                
                {pricingResult.optionSummaries.map((summary, idx) => {
                  const [label, val] = summary.split(": ");
                  return (
                    <div key={idx} className="flex justify-between">
                      <span className="text-capsule-text-secondary">{label}:</span>
                      <span className="font-semibold text-right">{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instant Pricing Display */}
            <div className="bg-capsule-dark text-[#FDFDFD] rounded-2xl p-5 space-y-4 relative overflow-hidden">
              {pricingResult.tierDiscountPercent > 0 && (
                <div className="absolute top-0 right-0 bg-[#E89E78] text-capsule-dark text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-sm">
                  {pricingResult.tierDiscountPercent}% {t("calc.discount", "ԶԵՂՉ")}
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-gray-400">
                  {t("calc.unit_price", "Մեկ միավորի արժեքը")}
                </span>
                <p className="text-2xl font-black font-sans text-[#E89E78]">
                  {formatPrice(pricingResult.unitPrice)}
                </p>
              </div>

              <div className="border-t border-white/10 pt-3 flex justify-between items-end">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">
                    {t("calc.total_price", "Ընդհանուր գումարը")}
                  </span>
                  <p className="text-3xl font-black font-sans leading-none mt-1">
                    {formatPrice(pricingResult.totalPrice)}
                  </p>
                </div>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded font-mono text-gray-300">
                  ֏ AMD
                </span>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <button
            type="button"
            onClick={submitInquiry}
            className="w-full bg-[#D27E53] hover:bg-[#BE6C42] text-white py-4 rounded-2xl text-xs uppercase font-bold tracking-widest shadow-md transition-all active:scale-[0.98] duration-150 flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} className="animate-spin-slow animate-pulse" />
            {t("calc.inquire", "ՈՒՂԱՐԿԵԼ ՀԱՐՑՈՒՄ")}
          </button>

          {/* Extra Info */}
          <div className="flex gap-2 p-3 bg-amber-50/50 border border-amber-100 rounded-2xl text-[10px] text-amber-900/80 leading-relaxed shadow-[inset_-1px_-1px_0px_#FFFFFF]">
            <Info size={14} className="flex-shrink-0 mt-0.5 text-amber-800" />
            <span>
              {t("calc.dynamic_engine_notice", "Այս գինը հաշվարկված է ավտոմատացված գնագոյացման համակարգի կողմից։ Վերջնական արժեքը կհաստատվի Capsule Concept մենեջերի կողմից՝ հարցումն ստանալուց հետո։")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
