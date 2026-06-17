import React from "react";
import { Plus, Minus, ChevronUp, ChevronDown } from "lucide-react";

interface LuxuryNumericInputProps {
  value: string | number;
  onChange: (val: string) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  className?: string;
  id?: string;
}

export const LuxuryNumericInput: React.FC<LuxuryNumericInputProps> = ({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  placeholder,
  className = "",
  id
}) => {
  const numericValue = typeof value === "number" ? value : parseFloat(value) || 0;

  const handleIncrement = () => {
    const nextVal = numericValue + step;
    if (max !== undefined && nextVal > max) return;
    onChange(nextVal.toString());
  };

  const handleDecrement = () => {
    const nextVal = numericValue - step;
    if (min !== undefined && nextVal < min) return;
    onChange(nextVal.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`relative flex items-center select-none ${className}`} id={id}>
      {/* Decrement Button */}
      <button
        type="button"
        type-attr="stepper-minus"
        onClick={handleDecrement}
        disabled={min !== undefined && numericValue <= min}
        className="cursor-pointer shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#FAFAF8] text-[#3D271B] shadow-[2px_2px_4px_#DFD9CD,_-2px_-2px_4px_#FFFFFF] hover:shadow-[3px_3px_6px_#DFD9CD,_-3px_-3px_6px_#FFFFFF] active:shadow-[inset_1.5px_1.5px_3px_#DFD9CD,_inset_-1.5px_-1.5px_3px_#FFFFFF] hover:text-capsule-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 outline-none border-none select-none"
        title="Decrease"
      >
        <Minus size={11} className="stroke-[3]" />
      </button>

      {/* Modern Centered Field Input */}
      <div className="flex-1 mx-2 relative flex items-center rounded-full bg-[#EFECE6] border border-[#d6cfc2] shadow-[inset_2.5px_2.5px_5px_#C2BAB0,_inset_-2.5px_-2.5px_5px_#FFFFFF] overflow-hidden group">
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          min={min}
          max={max}
          className="w-full bg-transparent border-none py-1.5 text-center font-mono text-xs font-black text-capsule-accent focus:outline-none focus:ring-0 text-ellipsis px-1.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        {/* Vertical arrow indicators inside for high-end look */}
        <div className="absolute right-2.5 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={handleIncrement}
            className="text-capsule-accent/50 hover:text-capsule-accent p-0.5 cursor-pointer"
          >
            <ChevronUp size={10} className="stroke-[3]" />
          </button>
          <button
            type="button"
            onClick={handleDecrement}
            className="text-capsule-accent/50 hover:text-capsule-accent p-0.5 cursor-pointer"
          >
            <ChevronDown size={10} className="stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Increment Button */}
      <button
        type="button"
        type-attr="stepper-plus"
        onClick={handleIncrement}
        disabled={max !== undefined && numericValue >= max}
        className="cursor-pointer shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#FAFAF8] text-[#3D271B] shadow-[2px_2px_4px_#DFD9CD,_-2px_-2px_4px_#FFFFFF] hover:shadow-[3px_3px_6px_#DFD9CD,_-3px_-3px_6px_#FFFFFF] active:shadow-[inset_1.5px_1.5px_3px_#DFD9CD,_inset_-1.5px_-1.5px_3px_#FFFFFF] hover:text-capsule-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 outline-none border-none select-none"
        title="Increase"
      >
        <Plus size={11} className="stroke-[3]" />
      </button>
    </div>
  );
};
