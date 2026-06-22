import React, { useState } from "react";
import { Sliders, Save, Percent, RefreshCw } from "lucide-react";

interface PricingSettingsProps {
  pricingRules: any | null;
  onSavePricingRules?: (rules: any) => Promise<void>;
  locale: string;
}

export const PricingSettings: React.FC<PricingSettingsProps> = ({
  pricingRules,
  onSavePricingRules,
  locale
}) => {
  const [profitMargin, setProfitMargin] = useState(pricingRules?.profitMargin || 1.35);
  const [setupFee, setSetupFee] = useState(pricingRules?.setupFee || 5000);
  const [taxRate, setTaxRate] = useState(pricingRules?.taxRate || 0.2);

  const handleSave = async () => {
    if (onSavePricingRules) {
      await onSavePricingRules({
        ...pricingRules,
        profitMargin: Number(profitMargin),
        setupFee: Number(setupFee),
        taxRate: Number(taxRate)
      });
    }
  };

  return (
    <div className="w-full space-y-6 select-none">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-serif text-[#1A3F25] font-bold">Pricing Engine Configurator</h2>
          <p className="text-xs text-gray-500">Fine-tune margins, raw cost modifiers, setup fees, and local value-added taxes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xs space-y-5">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Algorithmic Variables</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-2xl">
              <div>
                <span className="text-xs font-bold text-gray-700 block">Baseline Profit Margin Coefficient</span>
                <span className="text-[10px] text-gray-400">Multiplication factor applied to baseline manufacturing and material costs</span>
              </div>
              <input
                type="number"
                step="0.05"
                value={profitMargin}
                onChange={(e) => setProfitMargin(Number(e.target.value))}
                className="w-20 text-center bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-extrabold text-[#1A3F25] outline-none"
              />
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-2xl">
              <div>
                <span className="text-xs font-bold text-gray-700 block">Production Setups / Cliché Fee</span>
                <span className="text-[10px] text-gray-400">One-time engineering setup charge per custom order</span>
              </div>
              <input
                type="number"
                step="500"
                value={setupFee}
                onChange={(e) => setSetupFee(Number(e.target.value))}
                className="w-24 text-center bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-extrabold text-[#1A3F25] outline-none"
              />
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-2xl">
              <div>
                <span className="text-xs font-bold text-gray-700 block">Value-Added Tax (VAT) Coefficient</span>
                <span className="text-[10px] text-gray-400">Surcharged and listed dynamically in invoices</span>
              </div>
              <input
                type="number"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-20 text-center bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-extrabold text-[#1A3F25] outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-[#C59B6D] hover:bg-opacity-95 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Save size={12} /> Save Pricing Parameters
          </button>
        </div>

        {/* Real-time simulation feedback cabinet */}
        <div className="bg-[#FAF9F6] p-6 rounded-[2rem] border border-gray-150 space-y-4">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Live Calculations Preview</h3>
          
          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Estimated cost base:</span>
              <span className="font-extrabold text-gray-700">AMD 10,000</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Profit margin premium ({Math.round((profitMargin - 1) * 100)}%):</span>
              <span className="font-extrabold text-gray-700">AMD {Math.round(10000 * (profitMargin - 1)).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Fixed Cliché Cost:</span>
              <span className="font-extrabold text-gray-700">AMD {setupFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Subtotal:</span>
              <span className="font-extrabold text-gray-750">AMD {Math.round(10000 * profitMargin + setupFee).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-200 text-green-700 font-semibold">
              <span>VAT ({taxRate * 100}%):</span>
              <span>AMD {Math.round((10000 * profitMargin + setupFee) * taxRate).toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 text-[#1A3F25] font-black text-sm">
              <span>Simulated Invoice Total:</span>
              <span>AMD {Math.round((10000 * profitMargin + setupFee) * (1 + taxRate)).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
