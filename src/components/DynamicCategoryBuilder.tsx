import React, { useState } from "react";
import { Plus, Trash2, Settings, DollarSign, Move, Check, HelpCircle } from "lucide-react";
import { useTranslation } from "../locales/i18n";
import { 
  DynamicCategory, 
  DynamicProduct, 
  ProductOption, 
  ProductOptionValue, 
  SizingConfig, 
  SizePricingFormula 
} from "../types";

interface DynamicCategoryBuilderProps {
  onSave: (category: DynamicCategory, product: DynamicProduct) => void;
}

export default function DynamicCategoryBuilder({ onSave }: DynamicCategoryBuilderProps) {
  const { t } = useTranslation();

  // Category Basics
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  
  // Sizing Config
  const [showWidth, setShowWidth] = useState(true);
  const [showHeight, setShowHeight] = useState(true);
  const [showDepth, setShowDepth] = useState(false);
  const [minWidth, setMinWidth] = useState(5);
  const [maxWidth, setMaxWidth] = useState(100);
  const [minHeight, setMinHeight] = useState(5);
  const [maxHeight, setMaxHeight] = useState(100);
  const [minDepth, setMinDepth] = useState(1);
  const [maxDepth, setMaxDepth] = useState(50);
  const [unit, setUnit] = useState("cm");

  // Quantity Settings
  const [minQty, setMinQty] = useState(100);
  const [qtyPresetsStr, setQtyPresetsStr] = useState("100, 200, 500, 1000");

  // Pricing Formula
  const [formulaType, setFormulaType] = useState<"area" | "perimeter" | "volume" | "fixed">("area");
  const [basePrice, setBasePrice] = useState(30);
  const [coefficient, setCoefficient] = useState(0.12);
  const [minPrice, setMinPrice] = useState(15);

  // Dynamic Options Configuration
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [newOptionLabel, setNewOptionLabel] = useState("");
  const [newOptionType, setNewOptionType] = useState<"select" | "radio" | "checkbox">("select");

  // Option values temporary creation list helper
  const [tempValueLabel, setTempValueLabel] = useState("");
  const [tempValueModifier, setTempValueModifier] = useState(0);
  const [tempValueModType, setTempValueModType] = useState<"add" | "percent" | "multiply">("add");
  const [activeOptionIdForValues, setActiveOptionIdForValues] = useState<string | null>(null);

  // Form Submission or Saving
  const handleAddOption = () => {
    if (!newOptionLabel.trim()) return;
    const optionId = `opt-${Date.now()}`;
    const newOpt: ProductOption = {
      id: optionId,
      label: newOptionLabel,
      type: newOptionType,
      required: true,
      values: []
    };
    setOptions([...options, newOpt]);
    setNewOptionLabel("");
    setActiveOptionIdForValues(optionId);
  };

  const handleRemoveOption = (id: string) => {
    setOptions(options.filter(o => o.id !== id));
    if (activeOptionIdForValues === id) {
      setActiveOptionIdForValues(null);
    }
  };

  const handleAddValueToOption = (optionId: string) => {
    if (!tempValueLabel.trim()) return;
    setOptions(options.map((opt) => {
      if (opt.id === optionId) {
        const newValue: ProductOptionValue = {
          id: `val-${Date.now()}`,
          label: tempValueLabel,
          priceModifier: tempValueModifier,
          modifierType: tempValueModType
        };
        return {
          ...opt,
          values: [...opt.values, newValue]
        };
      }
      return opt;
    }));
    setTempValueLabel("");
    setTempValueModifier(0);
  };

  const handleRemoveValueFromOption = (optionId: string, valueId: string) => {
    setOptions(options.map((opt) => {
      if (opt.id === optionId) {
        return {
          ...opt,
          values: opt.values.filter(val => val.id !== valueId)
        };
      }
      return opt;
    }));
  };

  const handleSaveEngine = () => {
    if (!catName || !catSlug) {
      alert("Please fill Category Name and Slug ID!");
      return;
    }

    const presets = qtyPresetsStr
      .split(",")
      .map(q => parseInt(q.trim(), 10))
      .filter(q => !isNaN(q));

    const sizingConfig: SizingConfig = {
      showWidth,
      showHeight,
      showDepth,
      minWidth: showWidth ? minWidth : undefined,
      maxWidth: showWidth ? maxWidth : undefined,
      minHeight: showHeight ? minHeight : undefined,
      maxHeight: showHeight ? maxHeight : undefined,
      minDepth: showDepth ? minDepth : undefined,
      maxDepth: showDepth ? maxDepth : undefined,
      unit
    };

    const dynamicCategory: DynamicCategory = {
      id: catSlug,
      name: catName,
      navLabel: catName,
      active: true,
      sizing: sizingConfig,
      showQuantitySelector: true,
      minQty,
      qtyPresets: presets,
      options: options
    };

    const pricingFormula: SizePricingFormula = {
      formulaType,
      basePrice,
      coefficient,
      minPrice
    };

    const dynamicProduct: DynamicProduct = {
      id: `prod-${catSlug}`,
      categoryId: catSlug,
      name: `${catName} Dynamic Product`,
      desc: `Automated ${catName} packaging solution constructed dynamically.`,
      active: true,
      basePrice,
      pricingFormula,
      options: [] // Can be customized per product later
    };

    onSave(dynamicCategory, dynamicProduct);

    // Reset Form
    setCatName("");
    setCatSlug("");
    setOptions([]);
    setActiveOptionIdForValues(null);
  };

  return (
    <div className="bg-white border border-[#E9E4DB] rounded-3xl p-6.5 shadow-xs space-y-8">
      
      {/* Title Header */}
      <div className="border-b border-[#F4F2EE] pb-4.5">
        <h3 className="font-sans font-bold text-lg text-capsule-dark flex items-center gap-2">
          <Settings className="text-capsule-accent" size={20} />
          <span>Dynamic Category & Pricing Creator</span>
        </h3>
        <p className="text-xs text-capsule-text-muted mt-1 leading-relaxed">
          Create whole packaging categories with custom sizing limits, multiplier coefficients, and custom additions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT COMPARTMENT: Metadata & Specs */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-capsule-accent">
              1. Basic Identity
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-capsule-text-secondary">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. HoReCa Box"
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    if (!catSlug) {
                      setCatSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                    }
                  }}
                  className="w-full bg-[#FAFAF9] border border-[#E9E4DB] rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-capsule-accent focus:border-capsule-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-capsule-text-secondary">Category ID / Slug</label>
                <input
                  type="text"
                  placeholder="e.g. horeca-box"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="w-full bg-[#FAFAF9] border border-[#E9E4DB] rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-capsule-accent focus:border-capsule-accent focus:outline-none text-capsule-accent font-mono font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Sizing Toggles */}
          <div className="space-y-4 border-t border-[#F4F2EE] pt-4.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-capsule-accent">
              2. Dimensions & Units
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <label className="flex items-center gap-2 p-3 bg-[#FAFAF9] border border-[#E9E4DB] rounded-xl cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={showWidth}
                  onChange={(e) => setShowWidth(e.target.checked)}
                  className="accent-[#D27E53]"
                />
                Width
              </label>
              
              <label className="flex items-center gap-2 p-3 bg-[#FAFAF9] border border-[#E9E4DB] rounded-xl cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={showHeight}
                  onChange={(e) => setShowHeight(e.target.checked)}
                  className="accent-[#D27E53]"
                />
                Height
              </label>

              <label className="flex items-center gap-2 p-3 bg-[#FAFAF9] border border-[#E9E4DB] rounded-xl cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={showDepth}
                  onChange={(e) => setShowDepth(e.target.checked)}
                  className="accent-[#D27E53]"
                />
                Depth
              </label>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] text-capsule-text-muted">Min W</label>
                <input
                  type="number"
                  disabled={!showWidth}
                  value={minWidth}
                  onChange={(e) => setMinWidth(Number(e.target.value))}
                  className="w-full bg-[#FAFAF9] border border-[#E9E4DB] rounded-xl p-2 text-xs text-center"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-capsule-text-muted">Max W</label>
                <input
                  type="number"
                  disabled={!showWidth}
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(Number(e.target.value))}
                  className="w-full bg-[#FAFAF9] border border-[#E9E4DB] rounded-xl p-2 text-xs text-center"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-capsule-text-muted">Min H</label>
                <input
                  type="number"
                  disabled={!showHeight}
                  value={minHeight}
                  onChange={(e) => setMinHeight(Number(e.target.value))}
                  className="w-full bg-[#FAFAF9] border border-[#E9E4DB] rounded-xl p-2 text-xs text-center"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-capsule-text-muted">Max H</label>
                <input
                  type="number"
                  disabled={!showHeight}
                  value={maxHeight}
                  onChange={(e) => setMaxHeight(Number(e.target.value))}
                  className="w-full bg-[#FAFAF9] border border-[#E9E4DB] rounded-xl p-2 text-xs text-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3.5 pt-1">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-capsule-text-secondary">Measure Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-[#FAFAF9] border border-[#E9E4DB] rounded-xl p-2 text-xs text-[#403C39]"
                >
                  <option value="cm">cm (Centimeters)</option>
                  <option value="mm">mm (Millimeters)</option>
                  <option value="inch">in (Inches)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-capsule-text-secondary">Min Order Qty</label>
                <input
                  type="number"
                  value={minQty}
                  onChange={(e) => setMinQty(Number(e.target.value))}
                  className="w-full bg-[#FAFAF9] border border-[#E9E4DB] rounded-xl p-2 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-capsule-text-secondary">Quantity Presets</label>
                <input
                  type="text"
                  value={qtyPresetsStr}
                  onChange={(e) => setQtyPresetsStr(e.target.value)}
                  placeholder="e.g. 100, 200, 500"
                  className="w-full bg-[#FAFAF9] border border-[#E9E4DB] rounded-xl p-2 text-xs text-[#403C39]"
                />
              </div>
            </div>
          </div>

          {/* Pricing Config */}
          <div className="space-y-4 border-t border-[#F4F2EE] pt-4.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-capsule-accent">
              3. Dynamic Pricing Multipliers
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-capsule-text-secondary">Sizing Formula</label>
                <select
                  value={formulaType}
                  onChange={(e) => setFormulaType(e.target.value as any)}
                  className="w-full bg-[#FAFAF9] border border-[#E9E4DB] rounded-xl p-2 text-xs text-[#403C39]"
                >
                  <option value="area">Area (W * H)</option>
                  <option value="perimeter">Perimeter 2*(W+H)</option>
                  <option value="volume">Volume (W * H * D)</option>
                  <option value="fixed">Fixed Flat Price</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-capsule-text-secondary">Base Price (AMD)</label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full bg-[#FAFAF9] border border-[#E9E4DB] rounded-xl p-2 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-capsule-text-secondary">Multiplier / Coefficient</label>
                <input
                  type="number"
                  step="0.01"
                  value={coefficient}
                  onChange={(e) => setCoefficient(Number(e.target.value))}
                  className="w-full bg-[#FAFAF9] border border-[#E9E4DB] rounded-xl p-2 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-capsule-text-secondary">Min Price Floor (AMD)</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-full bg-[#FAFAF9] border border-[#E9E4DB] rounded-xl p-2 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COMPARTMENT: Options & Add-Ons Creator */}
        <div className="border-[#E9E4DB] bg-[#FAFAF9]/50 rounded-2xl p-5 space-y-5 border flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-capsule-accent">
              4. Custom Parameter Options
            </h4>

            {/* Quick Option Builder inside */}
            <div className="p-4 bg-white border border-[#E9E4DB] rounded-xl space-y-3 shadow-xs">
              <span className="text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider">
                Add parameter option (e.g. Laminations, Materials, Colors)
              </span>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Option Name (e.g. Gold Foil)"
                  value={newOptionLabel}
                  onChange={(e) => setNewOptionLabel(e.target.value)}
                  className="flex-1 bg-[#FAFAF9] border border-[#E9E4DB] rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-capsule-accent"
                />

                <select
                  value={newOptionType}
                  onChange={(e) => setNewOptionType(e.target.value as any)}
                  className="bg-[#FAFAF9] border border-[#E9E4DB] rounded-xl px-2 py-1.5 text-xs text-[#403C39]"
                >
                  <option value="select">Dropdown</option>
                  <option value="radio">Radio Group</option>
                  <option value="checkbox">Checkbox</option>
                </select>

                <button
                  type="button"
                  onClick={handleAddOption}
                  className="bg-capsule-dark hover:bg-black text-white p-2.5 rounded-xl flex-shrink-0 transition-all cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Current Options List with values modifier configuration */}
            <div className="space-y-3.5 max-h-[290px] overflow-y-auto pr-1">
              {options.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-[#E9E4DB] rounded-xl text-xs text-capsule-text-muted">
                  No attributes added. Create options above to assign prices.
                </div>
              ) : (
                options.map((opt) => (
                  <div key={opt.id} className="p-3.5 bg-white border border-[#E9E4DB] rounded-xl space-y-3 relative group transition-all hover:border-[#D27E53]/40">
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(opt.id)}
                      className="absolute top-2 right-2 p-1 text-capsule-text-muted hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-capsule-dark">{opt.label}</span>
                      <span className="text-[9px] bg-[#EFECE6] px-1.5 py-0.5 rounded text-capsule-text-secondary uppercase font-semibold">
                        {opt.type}
                      </span>
                    </div>

                    {/* Assigned modifiers list for this option */}
                    <div className="space-y-1">
                      {opt.values.map((v) => (
                        <div key={v.id} className="flex justify-between items-center bg-[#FAFAF9] px-2.5 py-1 rounded-lg text-[11px]">
                          <span className="text-capsule-text-secondary font-medium">{v.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-capsule-accent">
                              {v.modifierType === "add" ? `+${v.priceModifier} AMD` : ""}
                              {v.modifierType === "percent" ? `+${v.priceModifier}%` : ""}
                              {v.modifierType === "multiply" ? `x${v.priceModifier}` : ""}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveValueFromOption(opt.id, v.id)}
                              className="text-gray-300 hover:text-red-500 transition-all"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick values adder trigger */}
                    <div className="pt-2 border-t border-[#F4F2EE] flex gap-1.5 items-center">
                      <input
                        type="text"
                        placeholder="Value name (e.g. Kraft)"
                        value={activeOptionIdForValues === opt.id ? tempValueLabel : ""}
                        onFocus={() => setActiveOptionIdForValues(opt.id)}
                        onChange={(e) => setTempValueLabel(e.target.value)}
                        className="flex-1 bg-[#FAFAF9] border border-[#E9E4DB] rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-capsule-accent"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={activeOptionIdForValues === opt.id ? (tempValueModifier || "") : ""}
                        onFocus={() => setActiveOptionIdForValues(opt.id)}
                        onChange={(e) => setTempValueModifier(Number(e.target.value))}
                        className="w-12 bg-[#FAFAF9] border border-[#E9E4DB] rounded-lg px-2 py-1 text-[11px] text-center font-mono"
                      />
                      <select
                        value={activeOptionIdForValues === opt.id ? tempValueModType : "add"}
                        onFocus={() => setActiveOptionIdForValues(opt.id)}
                        onChange={(e) => setTempValueModType(e.target.value as any)}
                        className="bg-[#FAFAF9] border border-[#E9E4DB] rounded-lg p-0.5 text-[10px]"
                      >
                        <option value="add">AMD</option>
                        <option value="percent">%</option>
                        <option value="multiply">x</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleAddValueToOption(opt.id)}
                        className="bg-capsule-accent text-white px-2 py-1 rounded-lg text-[10px] font-bold hover:bg-[#BE6C42] transition-all cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Core Builder Button Actions */}
          <div className="space-y-3 pt-4 border-t border-[#F4F2EE]">
            <button
              onClick={handleSaveEngine}
              type="button"
              className="w-full bg-[#D27E53] hover:bg-[#BE6C42] text-white py-3 rounded-xl text-xs uppercase font-bold tracking-widest transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Check size={14} />
              Build Dynamic Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
