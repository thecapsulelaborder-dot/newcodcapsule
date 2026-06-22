const fs = require('fs');

const filePath = 'src/App.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Define the boundaries clearly
const startMarker = '                {activeTemplate === "qr_matrix" && (';
const endMarker = '      </footer>\n\n      {/* Inquiry modal popup */}';

const startIndex = content.indexOf(startMarker);
if (startIndex === -1) {
    console.error('Start marker not found');
    process.exit(1);
}

const endIndex = content.indexOf(endMarker);
if (endIndex === -1) {
    console.error('End marker not found');
    process.exit(1);
}

const fullEndIndex = endIndex + '      </footer>'.length;

console.log('Found start index at:', startIndex);
console.log('Found end index at:', fullEndIndex);

const qrMatrixBlockAndFooter = `                {activeTemplate === "qr_matrix" && (
                  <div className="space-y-6">
                    {/* CARD 1: Choose Code Label Type */}
                    <div className="bg-capsule-surf border border-capsule-accent/15 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                        <QrCode size={14} className="text-capsule-accent" />
                        <span>Քարտ 1. Կոդի Տեսակ / Պիտակ</span>
                      </div>
                      <p className="text-[10px] text-capsule-text-muted uppercase font-bold">Ընտրեք անհրաժեշտ ինտեգրվող կոդի տիպը, նյութը կամ պիտակը</p>

                      <div className="space-y-4">
                        {/* Select QR items */}
                        <div className="grid grid-cols-1 gap-3">
                          {products
                            .filter(p => p.categoryId === "qr_matrix")
                            .flatMap(p => p.items || [])
                            .map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  setSelectedQrMatrixId(item.id);
                                  // Auto-fill default qty if current is 0
                                  if (qrMatrixQty === 0) setQrMatrixQty(100);
                                }}
                                className={\`p-4 rounded-2xl border text-left transition-all cursor-pointer flex justify-between items-center \${
                                  selectedQrMatrixId === item.id ? "bg-capsule-accent/10 border-capsule-accent text-capsule-accent shadow-sm" : "bg-capsule-surf2/40 border-capsule-accent/10 hover:border-capsule-accent/20"
                                }\`}
                              >
                                <div>
                                  <span className="block text-xs font-bold">{item.name}</span>
                                  {item.desc && <span className="block text-[10px] text-capsule-text-muted mt-1">{item.desc}</span>}
                                </div>
                                <div className="text-right font-mono">
                                  <span className="block text-xs font-bold text-capsule-accent">{item.price} ֏</span>
                                  <span className="block text-[8px] text-capsule-text-muted uppercase">մեկ {item.unit || "հատի"} համար</span>
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* CARD 2: Quantity & Technical Requirements */}
                    <div className="bg-capsule-surf border border-capsule-accent/15 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="text-[11px] tracking-wider font-bold uppercase text-capsule-accent flex items-center gap-2 border-b border-capsule-accent/10 pb-2">
                        <Sliders size={14} className="text-capsule-accent" />
                        <span>Քարտ 2. Քանակ և Հատուկ Պահանջներ</span>
                      </div>
                      <p className="text-[10px] text-capsule-text-muted uppercase font-bold">Նշեք պահանջվող տպաքանակը և լրացրեք տեխնիկական պահանջները՝ անհատականացման համար</p>

                      <div className="space-y-4">
                        {/* QR Matrix Quantity selection */}
                        <div>
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">Քանակ</label>
                          <div className="flex flex-wrap gap-2 font-mono mb-3">
                            {[50, 100, 250, 500, 1000, 2500, 5000].map((bqVal) => (
                              <button
                                key={bqVal}
                                type="button"
                                onClick={() => setQrMatrixQty(bqVal)}
                                className={\`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer \${
                                  qrMatrixQty === bqVal ? "bg-capsule-accent text-capsule-surf border-capsule-accent" : "bg-capsule-surf2/30 border-capsule-accent/10"
                                }\`}
                              >
                                {bqVal} հատ
                              </button>
                            ))}
                          </div>
                          <input
                            type="number"
                            placeholder="Այլ քանակ..."
                            value={qrMatrixQty || ""}
                            onChange={(e) => setQrMatrixQty(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full bg-capsule-surf2/40 border border-capsule-accent/10 focus:border-capsule-accent rounded-xl px-4 py-2 text-xs focus:outline-none font-bold"
                          />
                        </div>

                        {/* Extra Notes */}
                        <div>
                          <label className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider mb-2 font-mono">Հավելյալ պահանջներ / Նշումներ</label>
                          <textarea
                            placeholder="Օրինակ՝ չափսեր, լամինացիայի տիպ, այլ նախընտրություններ..."
                            value={qrMatrixNotes}
                            onChange={(e) => setQrMatrixNotes(e.target.value)}
                            className="w-full h-24 bg-capsule-surf2/40 border border-capsule-accent/10 focus:border-capsule-accent rounded-xl px-4 py-3 text-xs focus:outline-none resize-none font-sans"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

          {/* Beautiful and Polished Single Footer */}
          <footer id="app-footer" className="relative z-20 w-full bg-[#FAFAF8] text-[#3D271B] border-t border-[#D5D0C8]/50 mt-20" dir={isRtl ? "rtl" : "ltr"}>
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16">
              {/* Main Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-8 pb-12 border-b border-[#D5D0C8]/40">
                {/* Column 1: Logo, tagline and Subscribe Section */}
                <div className="md:col-span-4 space-y-6">
                  <div>
                    <h3 className="font-sans text-xl md:text-2xl font-black text-[#3D271B] tracking-tight uppercase">
                      THE CAPSULE LAB
                    </h3>
                    <p className="text-[11px] font-mono tracking-wider text-capsule-accent uppercase font-bold">
                      {locale === "hy" ? "Պրեմիում Բրենդային Փաթեթավորում" : locale === "ru" ? "Премиум Фирменная Упаковка" : "Premium Packaging Lab"}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-sans text-sm font-bold text-[#3D271B] uppercase tracking-wider">
                      {locale === "hy" ? "Բաժանորդագրվել Հիմա" : locale === "ru" ? "Подписаться Сейчас" : "Subscribe Now"}
                    </h4>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (newsletterEmail.trim()) {
                          setNewsletterSuccess(true);
                          setTimeout(() => {
                            setNewsletterSuccess(false);
                            setNewsletterEmail("");
                          }, 5000);
                        }
                      }} 
                      className="space-y-3 max-w-[280px]"
                    >
                      <div className="flex items-center gap-2 border-b border-[#D5D0C8] py-1.5 focus-within:border-capsule-accent transition-colors">
                        <Mail size={15} className="text-[#3D271B]/60 shrink-0" />
                        <input 
                          type="email" 
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          placeholder={locale === "hy" ? "Մուտքագրեք Ձեր էլ. փոստը" : locale === "ru" ? "Введите ваш Email" : "Enter your Email"}
                          className="bg-transparent border-none outline-none text-xs text-[#3D271B] w-full placeholder-[#3D271B]/50 font-sans"
                          required
                        />
                      </div>
                      {newsletterSuccess ? (
                        <p className="text-xs text-emerald-800 font-semibold font-sans">
                          ✨ {locale === "hy" ? "Դուք հաջողությամբ բաժանորդագրվել եք:" : locale === "ru" ? "Вы успешно подписались!" : "Successfully subscribed!"}
                        </p>
                      ) : (
                        <button
                          type="submit"
                          className="bg-capsule-accent hover:bg-capsule-accent-light text-white font-sans text-xs font-bold px-5 py-2 rounded shadow-sm transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
                        >
                          {locale === "hy" ? "Բաժանորդագրվել" : locale === "ru" ? "Подписаться" : "Subscribe"}
                        </button>
                      )}
                    </form>
                  </div>
                </div>

                {/* Column 2: Information */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="font-sans text-xs sm:text-sm font-bold tracking-wider text-[#3D271B] uppercase">
                    {locale === "hy" ? "Տեղեկատվություն" : locale === "ru" ? "Информация" : "Information"}
                  </h4>
                  <ul className="space-y-2.5 text-xs">
                    {[
                      { labelHy: "Մեր Մասին", labelRu: "О Нас", labelEn: "About Us", action: () => { window.scrollTo({ top: 0, behavior: "smooth" }); } },
                      { labelHy: "Որոնում", labelRu: "Поиск", labelEn: "More Search", action: () => { setIsHeaderSearchOpen(true); window.scrollTo({ top: 0, behavior: "smooth" }); } },
                      { labelHy: "Բլոգ", labelRu: "Բլոգ", labelEn: "Blog", action: () => { alert(locale === "hy" ? "Բլոգի բաժինը շուտով հասանելի կլինի:" : "Раздел блога скоро будет доступен!"); } },
                      { labelHy: "Կարծիքներ", labelRu: "Отзывы", labelEn: "Testimonials", action: () => { alert("Thank you for your warm feedback!"); } },
                      { labelHy: "Իրադարձություններ", labelRu: "События", labelEn: "Events", action: () => { alert("Stay tuned for upcoming masterclasses and events!"); } }
                    ].map((link, idx) => (
                      <li key={idx} className="flex">
                        <button
                          type="button"
                          onClick={link.action}
                          className="text-[#3D271B]/70 hover:text-capsule-accent hover:translate-x-1 transition-all duration-250 cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-1 text-left opacity-80"
                        >
                          {locale === "hy" ? link.labelHy : locale === "ru" ? link.labelRu : link.labelEn}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 3: Helpful Links */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="font-sans text-xs sm:text-sm font-bold tracking-wider text-[#3D271B] uppercase">
                    {locale === "hy" ? "Օգտակար Հղումներ" : locale === "ru" ? "Полезные Ссылки" : "Helpful Links"}
                  </h4>
                  <ul className="space-y-2.5 text-xs">
                    {[
                      { labelHy: "Ծառայություններ", labelRu: "Услуги", labelEn: "Services", action: () => { setActiveCategory("bags"); window.scrollTo({ top: 0, behavior: "smooth" }); } },
                      { labelHy: "Աջակցություն", labelRu: "Աջակցություն", labelEn: "Supports", action: () => { window.location.href = \`https://wa.me/\${contactSettings.whatsapp || "37499218090"}\`; } },
                      { labelHy: "Պայմաններ", labelRu: "Правила", labelEn: "Terms & Condition", action: () => { alert("Luxury bespoke custom production terms and conditions."); } },
                      { labelHy: "Գաղտնիություն", labelRu: "Конфиденциальность", labelEn: "Privacy Policy", action: () => { alert("Client branding files confidentiality & privacy standard policy."); } }
                    ].map((link, idx) => (
                      <li key={idx} className="flex">
                        <button
                          type="button"
                          onClick={link.action}
                          className="text-[#3D271B]/70 hover:text-capsule-accent hover:translate-x-1 transition-all duration-250 cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-1 text-left opacity-80"
                        >
                          {locale === "hy" ? link.labelHy : locale === "ru" ? link.labelRu : link.labelEn}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 4: Our Services */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="font-sans text-xs sm:text-sm font-bold tracking-wider text-[#3D271B] uppercase">
                    {locale === "hy" ? "Մեր Ծառայությունները" : locale === "ru" ? "Наши Услуги" : "Our Services"}
                  </h4>
                  <ul className="space-y-2.5 text-xs">
                    {[
                      { labelHy: "Բրենդներ", labelRu: "Список брендов", labelEn: "Brands list", action: () => { alert("Collaborating with 100+ packaging design studios."); } },
                      { labelHy: "Պատվիրել", labelRu: "Заказать", labelEn: "Order", action: () => { setCabinetInitialTab("overview"); setIsClientCabinetOpen(true); } },
                      { labelHy: "Վերադարձ", labelRu: "Возврат товаров", labelEn: "Return & Exchange", action: () => { alert("Packaging materials orders can be refunded if a printing discrepancy is detected."); } },
                      { labelHy: "Նախագծեր", labelRu: "Новинки моды", labelEn: "Fashion list", action: () => { setActiveCategory("boxes"); window.scrollTo({ top: 0, behavior: "smooth" }); } },
                      { labelHy: "Բլոգ", labelRu: "Բլոգ", labelEn: "Blog", action: () => { alert("Tips for outstanding foil stamping and packaging styling."); } }
                    ].map((link, idx) => (
                      <li key={idx} className="flex">
                        <button
                          type="button"
                          onClick={link.action}
                          className="text-[#3D271B]/70 hover:text-capsule-accent hover:translate-x-1 transition-all duration-250 cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-1 text-left opacity-80"
                        >
                          {locale === "hy" ? link.labelHy : locale === "ru" ? link.labelRu : link.labelEn}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 5: Contact Us */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="font-sans text-xs sm:text-sm font-bold tracking-wider text-[#3D271B] uppercase">
                    {locale === "hy" ? "Կապ Մեզ հետ" : locale === "ru" ? "Связаться с Нами" : "Contact Us"}
                  </h4>
                  
                  <div className="space-y-3 text-xs text-[#3D271B]/70">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-[#3D271B] shrink-0" />
                      <a href={\`tel:+\${contactSettings.whatsapp || "37499218090"}\`} className="hover:text-capsule-accent transition-colors">
                        +\{contactSettings.whatsapp || "37499218090"\}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-[#3D271B] shrink-0" />
                      <a href={\`mailto:\${contactSettings.email || "order@capsule.am"}\`} className="hover:text-capsule-accent transition-colors break-all">
                        {contactSettings.email || "order@capsule.am"}
                      </a>
                    </div>

                    {/* Social Circle Buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      <a 
                        href="https://facebook.com/thecapsulelab" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-[#3D271B] hover:bg-capsule-accent text-[#FAFAF8] flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105"
                        aria-label="Facebook"
                      >
                        <Facebook size={14} />
                      </a>
                      <a 
                        href="https://t.me/thecapsulelab" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-[#3D271B] hover:bg-capsule-accent text-[#FAFAF8] flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105"
                        aria-label="Telegram"
                      >
                        <Send size={14} className="-translate-x-[0.5px] translate-y-[0.5px]" />
                      </a>
                      <a 
                        href="https://linkedin.com/company/thecapsulelab" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-[#3D271B] hover:bg-capsule-accent text-[#FAFAF8] flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105"
                        aria-label="LinkedIn"
                      >
                        <Linkedin size={14} />
                      </a>
                      <a 
                        href="https://instagram.com/thecapsulelab" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-[#3D271B] hover:bg-capsule-accent text-[#FAFAF8] flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105"
                        aria-label="Instagram"
                      >
                        <Instagram size={14} />
                      </a>
                    </div>

                    {/* Securely access Admin panel */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAdminOpen(true)}
                        className="text-xs text-[#3D271B] hover:text-[#ff2300] transition-colors font-bold inline-flex items-center gap-1.5 cursor-pointer font-sans bg-transparent border-none p-0 select-none animate-pulse"
                      >
                        🔑 {locale === "hy" ? "Ադմին" : locale === "ru" ? "Админ" : "Admin Panel"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secure Payment Methods Row */}
              <PaymentMethods locale={locale} paymentMethods={paymentMethods} />

              {/* Bottom Copyright Block */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-6 mt-4 text-center sm:text-left gap-4 select-none text-xs text-[#3D271B]/60">
                <p>
                  &copy; {new Date().getFullYear()} <span className="font-semibold text-[#3D271B]">thecapsulelab</span> | {locale === "ru" ? "Все права защищены." : locale === "hy" ? "Բոլոր իրավունքները պաշտպանված են։" : "All rights reserved."}
                </p>
                <div className="flex items-center gap-4 text-[#3D271B]/60">
                  <button onClick={() => alert("FAQ section loaded")} className="hover:text-capsule-accent cursor-pointer bg-transparent border-none p-0 font-medium font-sans">FAQ</button>
                  <button onClick={() => alert("Privacy policy page")} className="hover:text-capsule-accent cursor-pointer bg-transparent border-none p-0 font-medium font-sans">{locale === "hy" ? "Գաղտնիություն" : "Privacy"}</button>
                  <button onClick={() => alert("Bespoke terms and custom agreements")} className="hover:text-capsule-accent cursor-pointer bg-transparent border-none p-0 font-medium font-sans">{locale === "hy" ? "Պայմաններ" : "Terms & Condition"}</button>
                </div>
              </div>
            </div>
          </footer>`;

const result = content.slice(0, startIndex) + qrMatrixBlockAndFooter + content.slice(fullEndIndex);
fs.writeFileSync(filePath, result, 'utf8');
console.log('Successfully replaced corrupted layout and unified brand footer!');
