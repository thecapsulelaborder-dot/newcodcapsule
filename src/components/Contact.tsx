import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, HelpCircle, ArrowRight } from "lucide-react";

interface ContactProps {
  locale: "hy" | "en" | "ru";
}

export default function Contact({ locale }: ContactProps) {
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Localization Dictionary
  const t = {
    title: {
      en: "Connect with the Laboratory",
      hy: "Կապնվեք Լաբորատորիայի հետ",
      ru: "Связаться с Лабораторией"
    },
    subtitle: {
      en: "Have questions about custom boxes, CAD specifications, or wholesale pricing? Drop us a line.",
      hy: "Հարցեր ունե՞ք անհատական տուփերի, CAD տեխնիկական բնութագրերի կամ մեծածախ գների մասին: Գրեք մեզ:",
      ru: "У вас есть вопросы об индивидуальных коробках, чертежах CAD или оптовых ценах? Напишите нам."
    },
    formTitle: {
      en: "Inquiry Message",
      hy: "Հաղորդագրություն",
      ru: "Форма Запроса"
    },
    fieldName: { en: "Your Name", hy: "Ձեր Անունը", ru: "Ваше Имя" },
    fieldEmail: { en: "Email Address", hy: "Էլ. Հասցե", ru: "Электронная Почта" },
    fieldSubject: { en: "Subject", hy: "Թեմա", ru: "Тема" },
    fieldMessage: { en: "Describe your packaging project...", hy: "Նկարագրեք ձեր տուփի նախագիծը...", ru: "Опишите ваш проект упаковки..." },
    btnSend: { en: "Send Inquiry", hy: "Ուղարկել", ru: "Отправить Запрос" },
    sending: { en: "Sending...", hy: "Ուղարկվում է...", ru: "Отправка..." },
    successTitle: {
      en: "Message Submitted!",
      hy: "Հաղորդագրությունն Ուղարկված է",
      ru: "Запрос Успешно Отправлен!"
    },
    successText: {
      en: "Thank you for contacting The Capsule Lab. Our design engineers will review your CAD specs and reach out within 4 business hours.",
      hy: "Շնորհակալություն The Capsule Lab-ին դիմելու համար: Մեր ինժեներները կուսումնասիրեն ձեր նախագիծը և կկապնվեն 4 աշխատանքային ժամվա ընթացքում:",
      ru: "Спасибо за обращение в The Capsule Lab. Наши инженеры изучат ваши спецификации и свяжутся с вами в течение 4 рабочих часов."
    },
    infoAddress: {
      en: "Production Facility",
      hy: "Արտադրական Լաբորատորիա",
      ru: "Производственная Лаборатория"
    },
    addressVal: {
      en: "42 Tumanyan St, Yerevan 0010, Armenia",
      hy: "Թումանյան 42, Երևան 0010, Հայաստան",
      ru: "ул. Туманяна 42, Ереван 0010, Армения"
    },
    infoHours: { en: "Laboratory Hours", hy: "Աշխատանքային Ժամեր", ru: "Часы Работы" },
    hoursVal: {
      en: "Monday – Saturday: 10:00 – 19:00",
      hy: "Երկուշաբթի – Շաբաթ՝ 10:00 – 19:00",
      ru: "Понедельник – Суббота: 10:00 – 19:00"
    }
  };

  const currentT = (key: keyof typeof t) => {
    return t[key][locale] || t[key]["en"];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      // Reset success banner after 6 seconds
      setTimeout(() => setSubmitSuccess(false), 8000);
    }, 1200);
  };

  return (
    <div className="w-full bg-[#f0f2f5] py-12 px-4 sm:px-6 lg:px-8 xl:px-12 selection:bg-[#FF2300]/10 select-none">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Header Breadcrumbs / Indicator */}
        <div className="mb-10 flex items-center justify-start gap-2">
          <span className="text-[9px] font-mono font-bold tracking-widest text-[#FF2300] uppercase bg-[#FF2300]/5 px-3 py-1 rounded-full border border-[#FF2300]/10 shadow-[sm]">
            Direct Channel
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF2300]"></span>
          <span className="text-[9px] font-mono tracking-wider text-gray-500 uppercase font-bold">
            {locale === "hy" ? "Կապ" : locale === "ru" ? "Контакты" : "Contact"}
          </span>
        </div>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-left mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-black text-[#1a1c1d] tracking-tight mb-6">
            {currentT("title")}
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-sans text-gray-500 max-w-4xl leading-relaxed font-semibold">
            {currentT("subtitle")}
          </p>
        </motion.div>

        {/* Contact Page Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* Left Column: Contact info and map */}
          <div className="lg:col-span-5 space-y-8 text-left">
            
            {/* Info Cards Container */}
            <div className="bg-[#f0f2f5] p-8 rounded-[2.5rem] shadow-[8px_8px_16px_#d1d9e6,_-8px_-8px_16px_#ffffff] border border-white/60 space-y-8">
              
              {/* Address Detail */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-2xl bg-[#f0f2f5] shadow-[inset_2px_2px_4px_#d1d9e6,_inset_-2px_-2px_4px_#ffffff] flex items-center justify-center text-[#FF2300] border border-white/20">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    {currentT("infoAddress")}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#1a1c1d] font-semibold leading-relaxed">
                    {currentT("addressVal")}
                  </p>
                </div>
              </div>

              {/* Phone Detail */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-2xl bg-[#f0f2f5] shadow-[inset_2px_2px_4px_#d1d9e6,_inset_-2px_-2px_4px_#ffffff] flex items-center justify-center text-[#FF2300] border border-white/20">
                  <Phone size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    {locale === "hy" ? "Հեռախոս" : locale === "ru" ? "Телефон" : "Phone Hotline"}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#1a1c1d] font-bold tracking-wide">
                    +374 98 232323
                  </p>
                </div>
              </div>

              {/* Email Detail */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-2xl bg-[#f0f2f5] shadow-[inset_2px_2px_4px_#d1d9e6,_inset_-2px_-2px_4px_#ffffff] flex items-center justify-center text-[#FF2300] border border-white/20">
                  <Mail size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    {locale === "hy" ? "Էլ. Փոստ" : locale === "ru" ? "Эл. Почта" : "Email Channel"}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#FF2300] font-bold tracking-wide hover:underline cursor-pointer">
                    laboratory@thecapsulelab.com
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-2xl bg-[#f0f2f5] shadow-[inset_2px_2px_4px_#d1d9e6,_inset_-2px_-2px_4px_#ffffff] flex items-center justify-center text-[#FF2300] border border-white/20">
                  <Clock size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    {currentT("infoHours")}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#1a1c1d] font-semibold">
                    {currentT("hoursVal")}
                  </p>
                </div>
              </div>

            </div>

            {/* Artistic Neumorphic Map Preview Block */}
            <div className="bg-[#f0f2f5] rounded-[2.5rem] p-4 shadow-[8px_8px_16px_#d1d9e6,_-8px_-8px_16px_#ffffff] border border-white/60 overflow-hidden relative h-[210px] flex flex-col justify-end">
              {/* Minimalistic map layout representation */}
              <div className="absolute inset-0 bg-[#e0e4eb] opacity-40 flex items-center justify-center pointer-events-none">
                <div className="w-full h-full relative">
                  {/* Grid lines */}
                  <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-[#d1d9e6]" />
                  <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-[#d1d9e6]" />
                  <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-[#d1d9e6]" />
                  <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-[#d1d9e6]" />
                  {/* River curve */}
                  <div className="absolute inset-0 border-r-8 border-b-8 border-white/50 rounded-full scale-125" />
                  {/* Yerevan map dot */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    <span className="absolute h-8 w-8 rounded-full bg-[#FF2300]/15 animate-ping" />
                    <span className="absolute h-4 w-4 rounded-full bg-[#FF2300] border-2 border-white shadow-md" />
                  </div>
                </div>
              </div>
              <div className="relative z-10 bg-[#f0f2f5]/90 backdrop-blur-sm p-4 rounded-2xl border border-white/80 flex items-center justify-between">
                <div>
                  <h5 className="text-[10px] font-black uppercase text-[#1a1c1d]">Yerevan Lab Location</h5>
                  <span className="text-[8.5px] font-mono text-gray-400 font-bold">YEREVAN COORDINATES: 40.1792° N, 44.5152° E</span>
                </div>
                <HelpCircle size={14} className="text-gray-400" />
              </div>
            </div>

          </div>

          {/* Right Column: Premium Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#f0f2f5] p-8 sm:p-10 rounded-[2.5rem] shadow-[12px_12px_24px_#d1d9e6,_-12px_-12px_24px_#ffffff] border border-white/70 text-left">
              
              <h3 className="text-xl sm:text-2xl font-sans font-black text-[#1a1c1d] mb-6 tracking-tight flex items-center gap-3">
                <span>{currentT("formTitle")}</span>
                <span className="h-1 w-10 bg-[#FF2300] rounded-full"></span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div>
                    <label className="block text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                      {currentT("fieldName")} <span className="text-[#FF2300]">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-5 py-3 rounded-2xl bg-[#f0f2f5] border border-transparent shadow-[inset_2.5px_2.5px_5px_#d1d9e6,_inset_-2.5px_-2.5px_5px_#ffffff] focus:shadow-[inset_1.5px_1.5px_3px_#d1d9e6,_inset_-1.5px_-1.5px_3px_#ffffff] focus:border-white/40 focus:outline-none text-xs font-sans text-[#1a1c1d] font-bold"
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="block text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                      {currentT("fieldEmail")} <span className="text-[#FF2300]">*</span>
                    </label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-5 py-3 rounded-2xl bg-[#f0f2f5] border border-transparent shadow-[inset_2.5px_2.5px_5px_#d1d9e6,_inset_-2.5px_-2.5px_5px_#ffffff] focus:shadow-[inset_1.5px_1.5px_3px_#d1d9e6,_inset_-1.5px_-1.5px_3px_#ffffff] focus:border-white/40 focus:outline-none text-xs font-sans text-[#1a1c1d] font-bold"
                    />
                  </div>
                </div>

                {/* Subject field */}
                <div>
                  <label className="block text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                    {currentT("fieldSubject")}
                  </label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-5 py-3 rounded-2xl bg-[#f0f2f5] border border-transparent shadow-[inset_2.5px_2.5px_5px_#d1d9e6,_inset_-2.5px_-2.5px_5px_#ffffff] focus:shadow-[inset_1.5px_1.5px_3px_#d1d9e6,_inset_-1.5px_-1.5px_3px_#ffffff] focus:border-white/40 focus:outline-none text-xs font-sans text-[#1a1c1d] font-bold"
                  />
                </div>

                {/* Message field */}
                <div>
                  <label className="block text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                    {locale === "hy" ? "Հաղորդագրություն" : locale === "ru" ? "Сообщение" : "Inquiry Content"} <span className="text-[#FF2300]">*</span>
                  </label>
                  <textarea 
                    rows={5}
                    required
                    placeholder={currentT("fieldMessage")}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-[#f0f2f5] border border-transparent shadow-[inset_2.5px_2.5px_5px_#d1d9e6,_inset_-2.5px_-2.5px_5px_#ffffff] focus:shadow-[inset_1.5px_1.5px_3px_#d1d9e6,_inset_-1.5px_-1.5px_3px_#ffffff] focus:border-white/40 focus:outline-none text-xs font-sans text-[#1a1c1d] font-semibold leading-relaxed min-h-[120px]"
                  />
                </div>

                {/* Form Actions & Success message */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <AnimatePresence>
                    {submitSuccess && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center gap-2 text-emerald-600 bg-emerald-500/10 px-4 py-2.5 rounded-xl border border-emerald-500/10 text-[10px] font-sans font-bold leading-tight"
                      >
                        <CheckCircle size={14} className="shrink-0" />
                        <div>
                          <p className="font-extrabold">{currentT("successTitle")}</p>
                          <p className="text-[8.5px] text-emerald-600/80 mt-0.5">{currentT("successText")}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto cursor-pointer ml-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-[#FF2300] hover:bg-[#e61f00] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-[4px_4px_8px_rgba(255,35,0,0.15),_-4px_-4px_8px_#ffffff] border border-white/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? currentT("sending") : currentT("btnSend")}</span>
                    <Send size={11} className="stroke-[2.5]" />
                  </button>
                </div>
              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
