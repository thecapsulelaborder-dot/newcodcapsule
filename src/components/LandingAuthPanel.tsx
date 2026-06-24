import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, ArrowLeft, Bookmark, Settings, Volume2, VolumeX, Search, User } from "lucide-react";

interface LandingAuthPanelProps {
  locale: "hy" | "ru" | "en" | "ar";
  userEmail: string;
  setUserEmail: (email: string) => void;
  partnerDiscount: number;
  setPartnerDiscount: (discount: number) => void;
  setIsClientCabinetOpen: (open: boolean) => void;
  setNeumorphicActiveTab: (tab: "ai_chat" | "signup") => void;
  savedItemsCount: number;
  setSavedItemsCount: (count: number) => void;
  setBookmarkToastText: (text: string) => void;
  setShowBookmarkToast: (show: boolean) => void;
  signUpSuccessMessage: string;
  setSignUpSuccessMessage: (msg: string) => void;
  neumorphicEmail: string;
  setNeumorphicEmail: (email: string) => void;
  neumorphicPassword: string;
  setNeumorphicPassword: (password: string) => void;
}

export const LandingAuthPanel: React.FC<LandingAuthPanelProps> = ({
  locale,
  userEmail,
  setUserEmail,
  partnerDiscount,
  setPartnerDiscount,
  setIsClientCabinetOpen,
  setNeumorphicActiveTab,
  savedItemsCount,
  setSavedItemsCount,
  setBookmarkToastText,
  setShowBookmarkToast,
  signUpSuccessMessage,
  setSignUpSuccessMessage,
  neumorphicEmail,
  setNeumorphicEmail,
  neumorphicPassword,
  setNeumorphicPassword,
}) => {
  const [landingAuthMode, setLandingAuthMode] = useState<"login" | "signup">("login");
  const [landingAuthName, setLandingAuthName] = useState<string>("");
  const [landingAuthPhone, setLandingAuthPhone] = useState<string>("");
  const [landingAuthRole, setLandingAuthRole] = useState<"Client" | "Partner">("Client");
  const [landingAuthLoading, setLandingAuthLoading] = useState<boolean>(false);
  const [neumorphicSettingsOpen, setNeumorphicSettingsOpen] = useState<boolean>(false);
  const [neumorphicVolume, setNeumorphicVolume] = useState<boolean>(true);
  const [neumorphicSearchInput, setNeumorphicSearchInput] = useState<string>("");

  return (
    <div className="w-full">
      {userEmail ? (
        /* ==================== STYLE 1: LOGGED IN VIEW ==================== */
        <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto bg-[#EBF0F6] rounded-[2.5rem] p-8 sm:p-10 shadow-[12px_12px_24px_#B2B9C4,_-12px_-12px_24px_#FFFFFF] transition-all duration-300">
          <div className="text-center w-full space-y-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#FF2300]">Active Session</span>
            <h2 className="text-xl sm:text-2xl font-black text-[#5A6578] tracking-tight">
              {locale === "hy" ? "Բարի գալուստ" : locale === "ru" ? "Добро пожаловать" : "Welcome Back"}!
            </h2>
            <p className="text-sm text-[#7C8797] font-extrabold break-all pt-1 font-mono">
              {userEmail}
            </p>
          </div>

          {partnerDiscount > 0 && (
            <div className="w-full p-4 bg-[#EBF0F6] rounded-2xl flex flex-col items-center justify-center text-center shadow-[inset_4px_4px_8px_#B2B9C4,_inset_-4px_-4px_8px_#FFFFFF]">
              <span className="text-[10px] uppercase font-bold text-[#FF2300] mb-0.5 tracking-widest">Partner Discount Code Active</span>
              <span className="text-xs sm:text-sm font-bold text-[#5A6578]">15% automatic discount applied on all layouts</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsClientCabinetOpen(true)}
            className="group w-full flex items-center justify-center gap-2.5 bg-[#EBF0F6] rounded-full py-4 text-[#FF2300] font-sans font-bold text-xs sm:text-[13px] tracking-widest uppercase shadow-[6px_6px_12px_#B2B9C4,_-6px_-6px_12px_#FFFFFF] hover:shadow-[7px_7px_14px_#B2B9C4,_-7px_-7px_14px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#B2B9C4,_inset_-4px_-4px_8px_#FFFFFF] active:scale-[0.98] transition-all duration-300 cursor-pointer select-none"
          >
            <User size={13} className="text-[#FF2300]" />
            <span>{locale === "hy" ? "Բացել Լիչնի Կաբինետը" : locale === "ru" ? "Открыть Личный Кабинет" : "Open Personal Cabinet"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("cc_client_user");
              setUserEmail("");
              setPartnerDiscount(0);
              setSignUpSuccessMessage("");
              setBookmarkToastText("Signed out successfully");
              setShowBookmarkToast(true);
              setTimeout(() => setShowBookmarkToast(false), 2000);
            }}
            className="text-xs font-bold text-[#7C8797] hover:text-[#FF2300] hover:underline cursor-pointer transition-colors"
          >
            {locale === "hy" ? "Դուրս գալ" : locale === "ru" ? "Выйти" : "Sign Out"}
          </button>
        </div>
      ) : (
        /* ==================== STYLE 1: DUAL AUTHENTICATION VIEW ==================== */
        <div className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto bg-[#EBF0F6] rounded-[2.5rem] p-8 sm:p-10 shadow-[12px_12px_24px_#B2B9C4,_-12px_-12px_24px_#FFFFFF] transition-all duration-300 select-none">
          
          {/* Headline and switch links tab to toggle */}
          <div className="flex flex-col items-center select-none w-full gap-2">
            
            {/* Neumorphic Mode Switcher */}
            <div className="flex gap-4 justify-center text-[10px] font-black text-[#7C8797]/70 tracking-widest mb-1">
              <button 
                type="button" 
                onClick={() => { setLandingAuthMode("login"); setSignUpSuccessMessage(""); }}
                className={`uppercase transition-all duration-200 cursor-pointer ${landingAuthMode === "login" ? "text-[#FF2300] scale-105 font-black" : "hover:text-[#5A6578]"}`}
              >
                {locale === "hy" ? "Մուտք" : locale === "ru" ? "Вход" : "Log In"}
              </button>
              <span>|</span>
              <button 
                type="button" 
                onClick={() => { setLandingAuthMode("signup"); setSignUpSuccessMessage(""); }}
                className={`uppercase transition-all duration-200 cursor-pointer ${landingAuthMode === "signup" ? "text-[#FF2300] scale-105 font-black" : "hover:text-[#5A6578]"}`}
              >
                {locale === "hy" ? "Գրանցում" : locale === "ru" ? "Регистрация" : "Sign Up"}
              </button>
            </div>

            {/* Main title from IMAGE: SIGN UP / LOG IN with cute smile underline strictly under "UP" / "IN" */}
            <div className="mb-4 pt-1 relative flex justify-center">
              <h3 className="text-2xl sm:text-3xl font-sans font-medium tracking-[0.14em] text-[#7C8797] uppercase flex items-center gap-1.5">
                {landingAuthMode === "signup" ? (
                  <>
                    <span>SIGN</span>
                    <span className="relative">
                      UP
                      <span className="absolute -bottom-2 right-0 left-0 flex justify-center">
                        <svg className="w-6 h-2 text-[#FF2300]" viewBox="0 0 20 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 1.5C5 4.5 15 4.5 18 1.5" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" />
                        </svg>
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    <span>LOG</span>
                    <span className="relative">
                      IN
                      <span className="absolute -bottom-2 right-0 left-0 flex justify-center">
                        <svg className="w-6 h-2 text-[#FF2300]" viewBox="0 0 20 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 1.5C5 4.5 15 4.5 18 1.5" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" />
                        </svg>
                      </span>
                    </span>
                  </>
                )}
              </h3>
            </div>
          </div>

          {/* Name Input Pill (Concave) - Only for signup */}
          {landingAuthMode === "signup" && (
            <div className="w-full space-y-4">
              <div className="w-full flex items-center bg-[#EBF0F6] rounded-full px-5 py-4 shadow-[inset_4px_4px_8px_#B2B9C4,_inset_-4px_-4px_8px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                <input
                  type="text"
                  value={landingAuthName}
                  onChange={(e) => {
                    setLandingAuthName(e.target.value);
                    setSignUpSuccessMessage("");
                  }}
                  placeholder={locale === "hy" ? "Անուն / Ապրանքանիշ" : locale === "ru" ? "Ваше имя / Компания" : "Brand / Company Name"}
                  className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-xs sm:text-[13px] text-[#5A6578] font-semibold placeholder:text-[#9CA3AF] font-sans"
                />
              </div>

              <div className="w-full flex items-center bg-[#EBF0F6] rounded-full px-5 py-4 shadow-[inset_4px_4px_8px_#B2B9C4,_inset_-4px_-4px_8px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
                <input
                  type="tel"
                  value={landingAuthPhone}
                  onChange={(e) => {
                    setLandingAuthPhone(e.target.value);
                    setSignUpSuccessMessage("");
                  }}
                  placeholder={locale === "hy" ? "Հեռախոսահամար (ցանկալի է)" : locale === "ru" ? "Номер телефона (необяз.)" : "Phone Number (optional)"}
                  className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-xs sm:text-[13px] text-[#5A6578] font-semibold placeholder:text-[#9CA3AF] font-mono"
                />
              </div>
            </div>
          )}

          {/* Email Address Input Pill (Concave) */}
          <div className="w-full">
            <div className="w-full flex items-center bg-[#EBF0F6] rounded-full px-6 py-4 shadow-[inset_5px_5px_10px_#B2B9C4,_inset_-5px_-5px_10px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
              <input
                type="email"
                value={neumorphicEmail}
                onChange={(e) => {
                  setNeumorphicEmail(e.target.value);
                  setSignUpSuccessMessage("");
                }}
                placeholder="Email Address"
                className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-xs sm:text-[13px] text-[#5A6578] font-semibold placeholder:text-[#9CA3AF] font-sans"
              />
            </div>
          </div>

          {/* Password Input Pill (Concave) */}
          <div className="w-full">
            <div className="w-full flex items-center bg-[#EBF0F6] rounded-full px-6 py-4 shadow-[inset_5px_5px_10px_#B2B9C4,_inset_-5px_-5px_10px_#FFFFFF] border-none focus-within:ring-2 focus-within:ring-capsule-accent/15 transition-all duration-200">
              <input
                type="password"
                value={neumorphicPassword}
                onChange={(e) => {
                  setNeumorphicPassword(e.target.value);
                  setSignUpSuccessMessage("");
                }}
                placeholder="Password"
                className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-xs sm:text-[13px] text-[#5A6578] font-semibold placeholder:text-[#9CA3AF] font-sans"
              />
            </div>
          </div>

          {/* Account Role Selection - Only for signup */}
          {landingAuthMode === "signup" && (
            <div className="w-full space-y-1.5 pt-1 text-left">
              <span className="text-[9px] font-sans font-bold text-[#7C8797]/85 tracking-widest uppercase px-1">ACCOUNT TYPE / ԿԱՐԳԱՎԻՃԱԿ:</span>
              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  type="button"
                  onClick={() => setLandingAuthRole("Client")}
                  className={`py-3 px-4 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                    landingAuthRole === "Client"
                      ? "bg-[#EBF0F6] text-[#FF2300] shadow-[inset_3px_3px_6px_#B2B9C4,_inset_-3px_-3px_6px_#FFFFFF] font-black"
                      : "bg-[#EBF0F6] text-[#7C8797] shadow-[4px_4px_8px_#B2B9C4,_-4px_-4px_8px_#FFFFFF] hover:text-[#5A6578]"
                  }`}
                >
                  Client (Գնորդ)
                </button>
                <button
                  type="button"
                  onClick={() => setLandingAuthRole("Partner")}
                  className={`py-3 px-4 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                    landingAuthRole === "Partner"
                      ? "bg-[#EBF0F6] text-[#FF2300] shadow-[inset_3px_3px_6px_#B2B9C4,_inset_-3px_-3px_6px_#FFFFFF] font-black"
                      : "bg-[#EBF0F6] text-[#7C8797] shadow-[4px_4px_8px_#B2B9C4,_-4px_-4px_8px_#FFFFFF] hover:text-[#5A6578]"
                  }`}
                >
                  Partner (15% Զեղչ)
                </button>
              </div>
            </div>
          )}

          {/* Error & Success Messages */}
          <AnimatePresence>
            {signUpSuccessMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full rounded-2xl p-3.5 bg-[#EBF0F6] border-none text-[#FF2300] text-[11px] font-semibold text-center leading-normal shadow-[inset_3px_3px_6px_#B2B9C4,_inset_-3px_-3px_6px_#FFFFFF] break-words"
              >
                {signUpSuccessMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button: Extruded burgundy Pill exactly matching layout from USER SCREENSHOT */}
          <div className="w-full" id="neumorphic-signin-action-container">
            <button
              type="button"
              disabled={landingAuthLoading}
              onClick={async () => {
                if (!neumorphicEmail.trim() || !neumorphicPassword.trim()) {
                  setSignUpSuccessMessage("⚠️ Please write correct values in both Email and Password fields.");
                  return;
                }
                if (landingAuthMode === "signup" && !landingAuthName.trim()) {
                  setSignUpSuccessMessage("⚠️ Please fill the Name field.");
                  return;
                }

                setLandingAuthLoading(true);
                setSignUpSuccessMessage("");

                try {
                  const endpoint = landingAuthMode === "login" ? "/api/auth/client/login" : "/api/auth/client/register";
                  const payload = landingAuthMode === "login" 
                    ? { email: neumorphicEmail, password: neumorphicPassword }
                    : { name: landingAuthName, email: neumorphicEmail, password: neumorphicPassword, role: landingAuthRole, phone: landingAuthPhone };

                  const res = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                  });
                  const data = await res.json();
                  if (data.success) {
                    localStorage.setItem("cc_client_user", JSON.stringify(data.user));
                    setUserEmail(data.user.email);
                    if (data.user.role === "Partner") {
                      setPartnerDiscount(Number(data.user.partnerDiscount) || 15.0);
                    } else {
                      setPartnerDiscount(0);
                    }
                    setSignUpSuccessMessage(landingAuthMode === "login" 
                      ? "✨ Logged in successfully! Opening Personal Cabinet..." 
                      : "✨ Registered successfully! Opening Personal Cabinet..."
                    );
                    
                    setBookmarkToastText(landingAuthMode === "login" ? "🔐 Signed In!" : "🎉 Welcome Registered!");
                    setShowBookmarkToast(true);
                    setTimeout(() => {
                      setShowBookmarkToast(false);
                      setIsClientCabinetOpen(true);
                    }, 1500);
                  } else {
                    setSignUpSuccessMessage(`🚨 ${data.error || "Authentication failed."}`);
                  }
                } catch (err) {
                  setSignUpSuccessMessage("🚨 Connection error occurred. Verify database schema and state.");
                } finally {
                  setLandingAuthLoading(false);
                }
              }}
              className="group w-full flex items-center justify-center gap-2.5 bg-[#EBF0F6] rounded-full py-4 text-[#FF2300] font-sans font-bold text-sm tracking-wide shadow-[6px_6px_12px_#B2B9C4,_-6px_-6px_12px_#FFFFFF] hover:shadow-[7px_7px_14px_#B2B9C4,_-7px_-7px_14px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#B2B9C4,_inset_-4px_-4px_8px_#FFFFFF] active:scale-[0.98] transition-all duration-300 cursor-pointer select-none disabled:opacity-40"
            >
              <Lock size={14} className="text-[#FF2300] stroke-[2.5]" />
              <span>
                {landingAuthLoading ? (locale === "hy" ? "Խնդրում ենք սպասել..." : "Please wait...") : (landingAuthMode === "login" ? "Log in" : "Sign Up")}
              </span>
            </button>
          </div>

          {/* Neumorphic 3 Tabs Row: Back, Bookmark/Cabinet, Settings */}
          <div className="flex items-center justify-center gap-7 w-full py-2">
            <button
              type="button"
              onClick={() => {
                setNeumorphicActiveTab("ai_chat");
                setBookmarkToastText("Վերադարձ AI Chat");
                setShowBookmarkToast(true);
                setTimeout(() => setShowBookmarkToast(false), 1200);
              }}
              className="group w-14 h-14 rounded-2xl flex items-center justify-center bg-[#EBF0F6] text-[#7C8797] hover:text-[#5A6578] shadow-[5px_5px_10px_#B2B9C4,_-5px_-5px_10px_#FFFFFF] hover:shadow-[6px_6px_12px_#B2B9C4,_-6px_-6px_12px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#B2B9C4,_inset_-3px_-3px_6px_#FFFFFF] active:scale-[0.96] transition-all duration-300 cursor-pointer"
              title="Go to AI Chat"
            >
              <ArrowLeft size={16} strokeWidth={2.5} className="group-hover:translate-x-[-2px] transition-transform duration-300" />
            </button>

            <button
              type="button"
              onClick={() => {
                const newCount = savedItemsCount + 1;
                setSavedItemsCount(newCount);
                setBookmarkToastText(`Saved! Profile Spec Entries: ${newCount} 🔖`);
                setShowBookmarkToast(true);
                setTimeout(() => setShowBookmarkToast(false), 2000);
              }}
              className="group w-14 h-14 rounded-2xl flex items-center justify-center bg-[#EBF0F6] text-[#7C8797] hover:text-[#5A6578] shadow-[5px_5px_10px_#B2B9C4,_-5px_-5px_10px_#FFFFFF] hover:shadow-[6px_6px_12px_#B2B9C4,_-6px_-6px_12px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#B2B9C4,_inset_-3px_-3px_6px_#FFFFFF] active:scale-[0.96] transition-all duration-300 relative cursor-pointer"
              title="Bookmark Current Specifications"
            >
              <Bookmark size={16} strokeWidth={2.2} className="group-hover:scale-110 transition-transform duration-300" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FF2300] text-white font-sans font-black text-[9px] flex items-center justify-center border border-white shadow-sm">
                {savedItemsCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setNeumorphicSettingsOpen(!neumorphicSettingsOpen)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-[#EBF0F6] border-none transition-all duration-300 cursor-pointer ${
                neumorphicSettingsOpen
                  ? "text-[#FF2300] shadow-[inset_3px_3px_6px_#B2B9C4,_inset_-3px_-3px_6px_#FFFFFF]"
                  : "text-[#7C8797] hover:text-[#5A6578] shadow-[5px_5px_10px_#B2B9C4,_-5px_-5px_10px_#FFFFFF] hover:shadow-[6px_6px_12px_#B2B9C4,_-6px_-6px_12px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#B2B9C4,inset_-3px_-3px_6px_#FFFFFF] active:scale-[0.96]"
              }`}
              title="Preferences Settings"
            >
              <Settings size={16} strokeWidth={2.2} className={neumorphicSettingsOpen ? "animate-spin-slow text-[#FF2300]" : ""} />
            </button>
          </div>

          {/* Preferences Sub-Dropdown */}
          <AnimatePresence>
            {neumorphicSettingsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full bg-[#EBF0F6] shadow-[inset_4px_4px_8px_#B2B9C4,_inset_-4px_-4px_8px_#FFFFFF] rounded-2xl p-4 border-none space-y-3 overflow-hidden text-left"
              >
                <span className="text-[9px] font-mono tracking-widest font-black uppercase text-[#7C8797] block border-b border-gray-300 pb-1.5">
                  Ambient Console Preferences
                </span>
                
                <div className="flex items-center justify-between text-[11px] font-bold text-[#5A6578]">
                  <span>Sound Alerts:</span>
                  <button
                    type="button"
                    onClick={() => setNeumorphicVolume(!neumorphicVolume)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center bg-[#EBF0F6] border-none transition-all cursor-pointer ${
                      neumorphicVolume
                        ? "text-[#FF2300] shadow-[3px_3px_6px_#B2B9C4,_-3px_-3px_6px_#FFFFFF]"
                        : "text-[#7C8797] shadow-[inset_2px_2px_4px_#B2B9C4,_inset_-2px_-2px_4px_#FFFFFF]"
                    }`}
                  >
                    {neumorphicVolume ? <Volume2 size={13} /> : <VolumeX size={13} />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold text-[#5A6578]">
                  <span>Reset Inputs:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setNeumorphicEmail("");
                      setNeumorphicPassword("");
                      setLandingAuthName("");
                      setSignUpSuccessMessage("");
                      setBookmarkToastText("Console Fields Reset");
                      setShowBookmarkToast(true);
                      setTimeout(() => setShowBookmarkToast(false), 1500);
                    }}
                    className="px-3 py-1.5 text-[9px] uppercase font-black tracking-wider bg-[#EBF0F6] text-[#7C8797] rounded-lg shadow-[2px_2px_4px_#B2B9C4,_-2px_-2px_4px_#FFFFFF] border border-white hover:text-[#FF2300] active:scale-95 transition-all cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Row query: search input & search button */}
          <div className="w-full flex items-center gap-4 border-t border-gray-300 pt-5 mt-1 select-none">
            <div className="flex-1">
              <div className="w-full flex items-center bg-[#EBF0F6] rounded-full px-5 py-3.5 shadow-[inset_4px_4px_8px_#B2B9C4,_inset_-4px_-4px_8px_#FFFFFF] border-none transition-all duration-300">
                <input
                  type="text"
                  value={neumorphicSearchInput}
                  onChange={(e) => setNeumorphicSearchInput(e.target.value)}
                  placeholder="Email Address"
                  className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-xs sm:text-[13px] text-[#5A6578] font-semibold placeholder:text-[#9CA3AF] font-sans"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const term = neumorphicSearchInput.trim().toLowerCase();
                if (!term) {
                  setBookmarkToastText("Որոնման համար գրեք բանալի բառ / Enter keyword!");
                  setShowBookmarkToast(true);
                  setTimeout(() => setShowBookmarkToast(false), 2000);
                  return;
                }
              }}
              className="group w-12 h-12 rounded-2xl flex items-center justify-center bg-[#EBF0F6] text-[#7C8797] hover:text-[#5A6578] shadow-[5px_5px_10px_#B2B9C4,_-5px_-5px_10px_#FFFFFF] hover:shadow-[6px_6px_12px_#B2B9C4,_-6px_-6px_12px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#B2B9C4,_inset_-3px_-3px_6px_#FFFFFF] active:scale-95 transition-all duration-300 text-xs shrink-0 cursor-pointer"
            >
              <Search size={16} className="group-hover:scale-110 transition-all duration-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
