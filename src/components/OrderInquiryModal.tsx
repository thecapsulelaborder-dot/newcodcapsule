import React, { useState, useEffect, FormEvent } from "react";
import { X, Mail, MessageSquare } from "lucide-react";
import { ContactSettings } from "../types";
import { useTranslation } from "../locales/i18n";

export interface OrderInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiryDetails: string;
  inquiryPrice: number;
  inquiryType: string;
  contactSettings: ContactSettings;
  appliedPromo?: string;
  promoDiscount?: number;
  onAddSubmission: (payload: {
    type: string;
    customerName: string;
    customerPhone: string;
    details: string;
    totalPrice: number;
    appliedDiscountCode?: string;
    customerEmail?: string;
  }) => Promise<boolean>;
}

export default function OrderInquiryModal({
  isOpen,
  onClose,
  inquiryDetails,
  inquiryPrice,
  inquiryType,
  contactSettings,
  appliedPromo,
  promoDiscount,
  onAddSubmission
}: OrderInquiryModalProps) {
  const { t, formatPrice, isRtl } = useTranslation();

  const [orderMethod, setOrderMethod] = useState<"whatsapp" | "email">("whatsapp");
  const [custPhone, setCustPhone] = useState("");
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalActionUrl, setFinalActionUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem("cc_client_user");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed) {
            if (parsed.name) setCustName(parsed.name);
            if (parsed.email) setCustEmail(parsed.email);
            if (parsed.phone) setCustPhone(parsed.phone);
          }
        }
      } catch (e) {
        console.error("Failed to parse client user from local storage", e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (orderMethod === "email" && !custPhone.trim()) {
      alert(t("inquiry_modal.phone_required_error", "Խնդրում ենք լրացնել Հեռախոսահամարը։"));
      return;
    }

    try {
      setIsSubmitting(true);
      const realName = custName.trim() || (orderMethod === "whatsapp" ? "WhatsApp Customer" : "Email Customer");
      const realEmail = custEmail.trim() || (orderMethod === "whatsapp" ? "whatsapp@example.com" : "email_customer@example.com");
      const realPhone = custPhone.trim() || "WhatsApp Direct";

      let promoLine = "";
      if (appliedPromo && promoDiscount) {
        promoLine = `\n🏷️ ${t("common.coupon_code", "Պրոմո կոդ")}: ${appliedPromo} (-${formatPrice(promoDiscount)})`;
      }

      const fullDetails = `${inquiryDetails}${promoLine}\n\n👤 ${t("inquiry_modal.msg_contact_info", "Կոնտակտային տվյալներ")}:\n${t("inquiry_modal.msg_name", "Անուն")}: ${realName}\n${t("inquiry_modal.msg_phone", "Հեռախոս")}: ${realPhone}\n${t("inquiry_modal.msg_method", "Եղանակ")}: ${orderMethod === "whatsapp" ? "WhatsApp" : "Email"}`;

      const saved = await onAddSubmission({
        type: inquiryType,
        customerName: realName,
        customerPhone: realPhone,
        details: fullDetails,
        totalPrice: inquiryPrice,
        appliedDiscountCode: appliedPromo,
        customerEmail: realEmail
      });

      if (saved) {
        let finalUrl = "";
        if (orderMethod === "whatsapp") {
          const securePhone = contactSettings.whatsapp || "37499218090";
          const textMessage = `${t("inquiry_modal.msg_whatsapp_hello", "Բարև Ձեզ, ցանկանում եմ պատվիրել։")}\n\n📦 ${t("inquiry_modal.msg_order_details", "Պատվերի մանրամասներ")}:\n${inquiryDetails}${promoLine}\n\n💰 ${t("inquiry_modal.msg_total_price", "Ընդհանուր գին")}: ${formatPrice(inquiryPrice)}`;
          finalUrl = `https://wa.me/${securePhone}?text=${encodeURIComponent(textMessage)}`;
        } else {
          const recipient = contactSettings.email || "order@capsule.am";
          const subject = `CAPSULE PACK ${t("inquiry_modal.msg_subject", "Պատվերի Հայտ")} - ${realPhone}`;
          const body = `${t("inquiry_modal.msg_whatsapp_hello", "Բարև Ձեզ, ցանկանում եմ պատվիրել։")}\n\n👤 ${t("inquiry_modal.msg_contact_info", "Կոնտակտային տվյալներ")}:\n- ${t("inquiry_modal.msg_name", "Անուն")}: ${realName}\n- ${t("inquiry_modal.msg_phone", "Հեռախոսահամար")}: ${realPhone}\n- ${t("inquiry_modal.msg_email", "Էլ-փոստ")}: ${realEmail}\n\n📦 ${t("inquiry_modal.msg_order_details", "Պատվերի մանրամասներ")}:\n${inquiryDetails}${promoLine}\n\n💰 ${t("inquiry_modal.msg_total_price", "Ընդհանուր արժեք")}: ${formatPrice(inquiryPrice)}`;
          finalUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }

        setFinalActionUrl(finalUrl);
        setIsSubmitted(true);
        
        // Open link automatically
        window.open(finalUrl, "_blank");
      } else {
        alert(t("inquiry_modal.save_error", "Հայտի պահպանման սխալ"));
      }
    } catch {
      alert(t("inquiry_modal.network_error", "Կապի սխալ"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-capsule-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="bg-[#f0f2f5] border border-[#FF2300]/25/20 rounded-3xl w-full max-w-md p-6 relative shadow-2xl overflow-y-auto max-h-[95vh] scrollbar-thin">
        
        <button 
          onClick={onClose}
          className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} text-[#727784] hover:text-[#1a1c1d] cursor-pointer py-1 px-2 hover:bg-[#FF2300]/5 rounded-xl transition-all`}
        >
          <X size={18} />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 bg-green-100 text-green-800 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-3xl">
              ✓
            </div>
            
            <div className="space-y-1">
              <h3 className="font-serif font-semibold text-2xl text-[#FF2300]">
                {t("inquiry_modal.success_title", "Հայտը Գրանցված է")}
              </h3>
              <p className="text-xs text-[#414753] leading-relaxed max-w-xs mx-auto">
                {t("inquiry_modal.success_desc", "Ձեր պատվերի հայտը հաջողությամբ գրանցվել է համակարգում։ Սեղմեք կոճակը՝ պատվերը մեզ ուղարկելու համար։")}
              </p>
            </div>

            <div className={`bg-[#f0f2f5]/40 border border-[#FF2300]/25/10 rounded-2xl p-4 text-start text-xs space-y-1.5`}>
              <div className="font-bold text-[10px] text-[#727784] uppercase border-b border-[#FF2300]/25/5 pb-1 flex justify-between">
                <span>{t("inquiry_modal.order_desc_label", "Պատվերի մանրամասներ")}</span>
                <span className="font-mono text-[#FF2300]">#{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="text-[#414753] leading-snug">
                {custName && <div>{t("inquiry_modal.msg_name", "Անուն")}: <strong>{custName}</strong></div>}
                {custPhone && <div>{t("inquiry_modal.msg_phone", "Հեռախոս")}: <strong>{custPhone}</strong></div>}
                <div className={`p-2 rounded border border-[#FF2300]/25/5 mt-1 font-mono text-[10px] bg-white ${isRtl ? 'text-right' : 'text-left'}`}>
                  {inquiryDetails}
                </div>
              </div>
              <div className={`pt-2 border-t border-[#FF2300]/25/5 font-bold text-[#FF2300] ${isRtl ? 'text-left' : 'text-right'}`}>
                {t("inquiry_modal.price_label", "Գին:")} {formatPrice(inquiryPrice)}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => window.open(finalActionUrl, "_blank")}
                className="w-full bg-gradient-to-r from-[#ff2300] to-[#cc1c00] hover:from-[#e61f00] hover:to-[#b31900] text-white text-xs py-3.5 px-6 rounded-full font-bold uppercase shadow-[4px_4px_10px_#d1d9e6,_-4px_-4px_10px_#FFFFFF] shadow-inner tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                {orderMethod === "whatsapp" ? (
                  <>
                    <MessageSquare size={14} className="text-white" />
                    <span>{t("inquiry_modal.send_whatsapp", "Ուղարկել WhatsApp-ով")}</span>
                  </>
                ) : (
                  <>
                    <Mail size={14} className="text-white" />
                    <span>{t("inquiry_modal.send_email", "Ուղարկել Էլ․ Փոստով")}</span>
                  </>
                )}
              </button>
              
              <button
                onClick={onClose}
                className="w-full bg-transparent border border-[#FF2300]/25/20 hover:bg-[#FF2300]/5 text-[#1a1c1d]/60 hover:text-[#FF2300] text-xs py-3 px-6 rounded-full font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer active:scale-[0.98]"
              >
                {t("inquiry_modal.close", "Փակել")}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="font-serif font-light text-2xl text-[#FF2300] mb-1 text-center">
              {t("inquiry_modal.form_title", "Հայտի Ձևակերպում")}
            </h3>
            <p className="text-[11px] text-[#727784] mb-4 leading-relaxed text-center">
              {t("inquiry_modal.form_desc", "Խնդրում ենք լրացնել Ձեր տվյալները և ուղարկել պատվերը CAPSULE PACK-ին։")}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-[10px] sm:text-xs font-bold text-gray-800 uppercase tracking-widest ${isRtl ? 'text-right' : 'text-left'}`}>
                  {t("inquiry_modal.method_label", "Ուղարկման Եղանակ")}
                </label>
                <div className="grid grid-cols-2 gap-3 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setOrderMethod("whatsapp")}
                    className={`py-3 px-5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold cursor-pointer transition-all duration-300 active:scale-95 ${
                      orderMethod === "whatsapp" 
                        ? "bg-[#FF2300]/5 border-[#ff2300] text-[#ff2300] shadow-[0_4px_12px_rgba(255,35,0,0.1)]"
                        : "bg-[#f0f2f5] border-[#d1d9e6] text-[#1a1c1d] hover:border-[#1a1c1d]/40"
                    }`}
                  >
                    <MessageSquare size={13} />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderMethod("email")}
                    className={`py-3 px-5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold cursor-pointer transition-all duration-300 active:scale-95 ${
                      orderMethod === "email" 
                        ? "bg-[#FF2300]/5 border-[#ff2300] text-[#ff2300] shadow-[0_4px_12px_rgba(255,35,0,0.1)]"
                        : "bg-[#f0f2f5] border-[#d1d9e6] text-[#1a1c1d] hover:border-[#1a1c1d]/40"
                    }`}
                  >
                    <Mail size={13} />
                    <span>{t("inquiry_modal.send_email_short", "Էլ․ Փոստ")}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3.5 pt-2">
                <div>
                  <label className={`block text-[10px] font-bold text-gray-800 uppercase tracking-widest mb-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                    {t("inquiry_modal.name", "Ձեր Անունը")}{" "}
                    {orderMethod === "whatsapp" && (
                      <span className="text-[9px] text-green-700 tracking-normal lowercase normal-case">
                        {t("inquiry_modal.optional_suffix", "(ոչ պարտադիր)")}
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    required={orderMethod === "email"}
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder={
                      orderMethod === "whatsapp" 
                        ? t("inquiry_modal.name_placeholder_wa", "Անուն Ազգանուն (կամ կարող եք թողնել դատարկ)") 
                        : t("inquiry_modal.name_placeholder_email", "Անուն Ազգանուն")
                    }
                    className={`w-full bg-[#f0f2f5] border border-white/60 shadow-[inset_2px_2px_5px_#d1d9e6,_inset_-2px_-2px_5px_#FFFFFF] rounded-xl py-2.5 px-4 text-xs font-semibold outline-none focus:border-[#FF2300]/25/40 text-gray-800 ${isRtl ? 'text-right' : 'text-left'} transition-all`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] font-bold text-gray-800 uppercase tracking-widest mb-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                    {t("inquiry_modal.phone", "Հեռախոսահամար")}{" "}
                    {orderMethod === "whatsapp" ? (
                      <span className="text-[9px] text-green-700 tracking-normal lowercase normal-case">
                        {t("inquiry_modal.optional_suffix", "(ոչ պարտադիր)")}
                      </span>
                    ) : (
                      "*"
                    )}
                  </label>
                  <input
                    type="text"
                    required={orderMethod === "email"}
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder={
                      orderMethod === "whatsapp" 
                        ? t("inquiry_modal.phone_placeholder_wa", "+374 99 218 090 (կամ կարող եք թողնել դատարկ)") 
                        : t("inquiry_modal.phone_placeholder_email", "+374 99 218 090")
                    }
                    className={`w-full bg-[#f0f2f5] border border-white/60 shadow-[inset_2px_2px_5px_#d1d9e6,_inset_-2px_-2px_5px_#FFFFFF] rounded-xl py-2.5 px-4 text-xs font-semibold outline-none focus:border-[#FF2300]/25/40 text-gray-800 font-mono ${isRtl ? 'text-right' : 'text-left'} transition-all`}
                  />
                </div>
                {orderMethod === "email" && (
                  <div>
                    <label className={`block text-[10px] font-bold text-gray-800 uppercase tracking-widest mb-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                      {t("inquiry_modal.email_label", "Էլ-Փոստի Հասցե")}
                    </label>
                    <input
                      type="email"
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      placeholder="name@example.com"
                      className={`w-full bg-[#f0f2f5] border border-white/60 shadow-[inset_2px_2px_5px_#d1d9e6,_inset_-2px_-2px_5px_#FFFFFF] rounded-xl py-2.5 px-4 text-xs font-semibold outline-none focus:border-[#FF2300]/25/40 text-gray-800 font-mono ${isRtl ? 'text-right' : 'text-left'} transition-all`}
                    />
                  </div>
                )}
              </div>

              <div className={`bg-[#f0f2f5] p-4 rounded-2xl border border-white/60 space-y-1.5 mt-5 text-xs select-text shadow-[inset_2px_2px_5px_#d1d9e6,_inset_-2px_-2px_5px_#FFFFFF] ${isRtl ? 'text-right' : 'text-left'}`}>
                <p className={`font-bold text-[10px] uppercase tracking-widest text-[#ff2300] mb-1.5 border-b border-gray-200/80 pb-1 flex items-center justify-between ${isRtl ? 'text-right' : 'text-left'}`}>
                  <span>{t("inquiry_modal.summary_title", "Պատվերի Ամփոփում")}</span>
                  <span className="font-mono text-[#1a1c1d]/60">#{(Date.now() % 1000000).toString()}</span>
                </p>
                <div className={`whitespace-pre-line leading-relaxed text-[10px] font-semibold text-gray-700 max-h-[100px] overflow-y-auto scrollbar-thin ${isRtl ? 'text-right' : 'text-left'}`}>
                  {inquiryDetails}
                </div>
                <div className="border-t border-gray-200/80 pt-1.5 flex justify-between items-center font-bold text-[#ff2300]">
                  <span>{t("inquiry_modal.total_price_label", "Ընդհանուր գին:")}</span>
                  <span className="text-sm font-black">{formatPrice(inquiryPrice)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#ff2300] to-[#cc1c00] hover:from-[#e61f00] hover:to-[#b31900] text-white text-xs py-3.5 px-6 rounded-full font-bold uppercase transition-all duration-300 tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_10px_#d1d9e6,_-4px_-4px_10px_#FFFFFF] shadow-inner mt-5 active:scale-[0.98]"
              >
                {isSubmitting ? t("inquiry_modal.submitting", "Ուղարկվում է...") : t("inquiry_modal.submit", "Հաստատել Պատվերը")}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
