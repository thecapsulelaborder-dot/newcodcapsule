import React from "react";
import { PaymentMethod } from "../types";

interface PaymentMethodsProps {
  locale: string;
  paymentMethods?: PaymentMethod[];
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({ locale, paymentMethods = [] }) => {
  // Localized texts
  const titles = {
    hy: "Անվտանգ Վճարումներ",
    ru: "Безопасные платежи",
    ar: "طرق دفع آمنة",
    en: "Secure Payments"
  };

  const descriptions = {
    hy: "Աջակցում ենք Visa, Mastercard և ArCa քարտային համակարգերին",
    ru: "Поддержка платежных систем Visa, Mastercard и ArCa",
    ar: "نقوم بتسهيل الدفع الآمن عبر بطاقات فيزا، ماستركارد، وآركا",
    en: "Supporting secure checkout via Visa, Mastercard, and ArCa"
  };

  const getTitle = () => titles[locale as keyof typeof titles] || titles.en;
  const getDescription = () => descriptions[locale as keyof typeof descriptions] || descriptions.en;

  // Filter and sort active payment methods
  const activeMethods = Array.isArray(paymentMethods)
    ? paymentMethods
        .filter((pm) => pm.active)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    : [];

  return (
    <div id="payment-methods-component" className="py-6 my-6 border-t border-b border-capsule-border/10 flex flex-col xl:flex-row items-center justify-between gap-6 select-none w-full">
      <div className="text-center xl:text-left">
        <h4 id="payment-methods-title" className="font-serif text-[11px] sm:text-xs font-black tracking-widest text-[#7C8592] uppercase">
          {getTitle()}
        </h4>
        <p id="payment-methods-desc" className="text-[10px] text-capsule-text-muted mt-1 max-w-md">
          {getDescription()}
        </p>
      </div>
      
      <div id="payment-methods-icons-container" className="flex flex-wrap items-center justify-center gap-3">
        {activeMethods.length > 0 ? (
          activeMethods.map((pm) => {
            const pmTitle = pm.title[locale as keyof typeof pm.title] || pm.title.en || pm.name;
            const pmDesc = pm.description[locale as keyof typeof pm.description] || pm.description.en || "";
            return (
              <div 
                key={pm.id}
                id={`payment-method-dynamic-${pm.id}`}
                className="bg-white border border-[#E8E7E9] rounded-xl px-4 h-11 w-28 flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:scale-[1.03] hover:border-[#C59B6D]/35 hover:shadow-[0_4px_12px_rgba(197,155,109,0.06)] transition-all duration-300 ease-out cursor-pointer"
                title={`${pmTitle} - ${pmDesc}`}
                dangerouslySetInnerHTML={{ __html: pm.iconSvg }}
              />
            );
          })
        ) : (
          <>
            {/* Fallback Visa Card Button */}
            <div 
              id="payment-method-visa"
              className="bg-white border border-[#E8E7E9] rounded-xl px-4 h-11 w-28 flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:scale-[1.03] hover:border-[#C59B6D]/35 hover:shadow-[0_4px_12px_rgba(197,155,109,0.06)] transition-all duration-300 ease-out cursor-pointer"
              title="Visa"
            >
              <svg className="h-[12px] w-auto text-[#1434CB]" viewBox="0 0 100 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M42.2 2.1l-6.3 27.8H26.3L32.6 2.1h9.6zm29.3 0c-4.4 0-8 2.4-9.8 6.5l-11.3 21.3h9.8s1.6-4.5 1.9-5.4h11c.2 1 1.1 5.4 1.1 5.4h8.7L78 2.1h-6.5zm-5.4 14.8c.6-1.7 4.1-11.4 4.1-11.4s.8 2.3 1.3 3.6c.5 1.3 3.1 7.8 3.1 7.8h-8.5zM22.2 2.1l-10 19L11 6.5C10.5 4.1 8 2.1 5.5 2.1H0l.2.8c3.1.8 6.7 2.3 8.9 3.5l7.8 23.5h10.4L42 2.1H22.2zm76.5 0h-7.6c-2.4 0-4.3 1.5-5.2 3.7l-15.5 24.1h10.2l2-5.6h12.5c.3 1.3 1.2 5.6 1.2 5.6h9L98.7 2.1z" />
              </svg>
            </div>

            {/* Fallback MasterCard Button */}
            <div 
              id="payment-method-mastercard"
              className="bg-white border border-[#E8E7E9] rounded-xl px-4 h-11 w-28 flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:scale-[1.03] hover:border-[#C59B6D]/35 hover:shadow-[0_4px_12px_rgba(197,155,109,0.06)] transition-all duration-300 ease-out cursor-pointer"
              title="Mastercard"
            >
              <svg className="h-[20px] w-auto" viewBox="0 0 40 30" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="15" r="11" fill="#EB001B" />
                <circle cx="26" cy="15" r="11" fill="#F79E1B" opacity="0.88" />
                <path d="M 20 6.5 C 17.5 8.7 16 11.7 16 15 C 16 18.3 17.5 21.3 20 23.5 C 22.5 21.3 24 18.3 24 15 C 24 11.7 22.5 8.7 20 6.5 Z" fill="#FF5F00" />
              </svg>
            </div>

            {/* Fallback ArCa Button */}
            <div 
              id="payment-method-arca"
              className="bg-white border border-[#E8E7E9] rounded-xl px-4 h-11 w-28 flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:scale-[1.03] hover:border-[#C59B6D]/35 hover:shadow-[0_4px_12px_rgba(197,155,109,0.06)] transition-all duration-300 ease-out cursor-pointer"
              title="Armenian Card"
            >
              <svg className="h-[20px] w-auto max-w-[95%]" viewBox="0 0 160 50" xmlns="http://www.w3.org/2000/svg">
                <g fill="#0c54a3">
                  <path d="M 12.5 45 C 10.5 45, 8.5 44, 8 42 C 7.5 40, 8.5 37.5, 10 33.5 L 22.5 7.5 C 24 4.5, 27 3, 31 3 L 41.5 3 C 44.5 3, 46.5 4.5, 47 6 L 56 34 L 59 34 C 61 34, 62 36, 62 38 C 62 40, 60.5 45, 53.5 45 L 35.5 45 L 36 40 L 38.5 40 C 40.5 40, 42 39, 42 37.5 L 40 28.5 L 23.5 28.5 L 18 39.5 C 17 41.5, 18 43, 20.5 43 L 23 43 L 21 45 Z" />
                  <path d="M 28 28.5 L 31.75 12 L 35.5 28.5 L 33.75 28.5 L 33.75 37.5 L 29.75 37.5 L 29.75 28.5 Z" fill="#ffffff" />
                  <path d="M 52.5 45 C 51.5 45, 50.5 44, 50.5 42 L 51 39.5 L 53.5 39.5 C 55 39.5, 56 38.5, 56.5 36.5 L 61.5 14.5 C 62 12, 63.5 10.5, 66 10.5 L 75 10.5 C 77 10.5, 78 12, 78 13.5 C 78 15, 76.5 16, 74.5 16 L 71 16 L 66 38 C 65.5 40, 66.5 41, 68.5 41 L 70.5 41 L 69.5 45 Z" />
                  <path d="M 64.5 24 C 67.5 17.5, 71.5 12.5, 76 12.5 C 79.5 12.5, 81 14.5, 80.5 17 C 80 19, 78.5 21, 77 21 C 75.5 21, 74.8 20, 75.2 18 C 75.5 16.5, 74.5 15.5, 73 15.5 C 69.8 15.5, 66.8 20.5, 65.2 24 Z" stroke="#ffffff" strokeWidth="1" />
                  <path d="M 111 10.5 C 104.5 4.5, 91.5 4.5, 84.5 12.5 C 77.5 20.5, 74.5 31.5, 78.5 39.5 C 82.5 47.5, 93.5 49.5, 100.5 49.5 C 107.5 49.5, 112.5 44.5, 114.5 38.5 L 108.5 38.5 C 106.5 42.5, 103.5 44.5, 99.5 44.5 C 94.5 44.5, 89.5 42.5, 86.5 36.5 C 82.5 30.5, 83.5 21.5, 87.5 14.5 C 91.5 8.5, 97.5 6.5, 101.5 6.5 C 104.5 6.5, 106.5 8.5, 107.5 10.5 Z" />
                  <path d="M 136 19.5 C 130.5 19.5, 126.5 24, 125.5 29.5 C 124.5 35, 127.5 38.5, 132.5 38.5 C 138 38.5, 142 34, 143 28.5 C 144 23, 141 19.5, 136 19.5 Z M 134.5 23.5 C 137.5 23.5, 139.5 26, 139 29.5 C 138.5 33, 135 35, 132 35 C 129 35, 127.5 32.5, 128 29.5 C 128.5 26, 131.5 23.5, 134.5 23.5 Z" />
                  <path d="M 134.5 41 C 133.5 41, 132.5 40, 132.5 38.5 C 132.5 37, 133.5 36, 135 36 L 137.5 36 L 140 24 C 140.5 21.5, 142 20.5, 144 20.5 L 146 20.5 L 145 25 C 140.5 35, 138 41, 138 42.5 C 138 44, 139 45, 140.5 45 L 142 45 L 140.5 49 L 131 49 C 130.5 49, 129.5 48, 129.5 46.5 C 129.5 45, 130.5 44, 132 44 L 134 44 Z" />
                </g>
              </svg>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
