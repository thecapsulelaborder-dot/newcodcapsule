import React, { createContext, useContext, useState, useEffect } from "react";
import hyTranslations from "./hy.json";
import enTranslations from "./en.json";
import ruTranslations from "./ru.json";
import arTranslations from "./ar.json";

export type LocaleType = "hy" | "en" | "ru" | "ar";

const translations: Record<LocaleType, any> = {
  hy: hyTranslations,
  en: enTranslations,
  ru: ruTranslations,
  ar: arTranslations
};

interface LanguageContextProps {
  locale: LocaleType;
  setLocale: (locale: LocaleType) => void;
  t: (key: string, fallback?: string) => string;
  isRtl: boolean;
  formatNumber: (n: number) => string;
  formatPrice: (n: number) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Retrieve saved language or default to hy
  const [locale, setLocaleState] = useState<LocaleType>(() => {
    const saved = localStorage.getItem("capsule_lang");
    if (saved && ["hy", "en", "ru", "ar"].includes(saved)) {
      return saved as LocaleType;
    }
    return "hy" as LocaleType;
  });

  const [dbTranslations, setDbTranslations] = useState<any>(null);

  useEffect(() => {
    fetch("/api/translations")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.translations) {
          setDbTranslations(data.translations);
        }
      })
      .catch(err => console.warn("Failed to load PostgreSQL translations, falling back to static files:", err));
  }, []);

  const isRtl = locale === "ar";

  const setLocale = (newLocale: LocaleType) => {
    setLocaleState(newLocale);
    localStorage.setItem("capsule_lang", newLocale);
  };

  useEffect(() => {
    // Apply direction (RTL/LTR) to html element
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale, isRtl]);

  // Deep object lookup for translations
  const t = (key: string, fallback?: string): string => {
    const segments = key.split(".");
    
    // Auth fallbacks dictionary to prevent json editing issues and support all four languages
    const authDict: Record<LocaleType, Record<string, string>> = {
      hy: {
        "auth.header_btn": "👤 Մուտք / Գրանցում",
        "auth.profile_btn": "👤 Անձնական Կաբինետ",
        "auth.tab_login": "Մուտք",
        "auth.tab_register": "Գրանցում",
        "auth.field_email_phone": "Էլ. հասցե կամ Հեռախոս",
        "auth.field_password": "Գաղտնաբառ",
        "auth.field_confirm_password": "Կրկնել Գաղտնաբառը",
        "auth.field_name": "Անուն",
        "auth.field_last_name": "Ազգանուն",
        "auth.field_company": "Կազմակերպություն / Բրենդ",
        "auth.field_phone": "Հեռախոսահամար",
        "auth.field_email": "Էլ. հասցե",
        "auth.remember_me": "Հիշել ինձ",
        "auth.agree_terms": "Համաձայն եմ Օգտագործման Պայմանների հետ",
        "auth.forgot_password": "Մոռացե՞լ եք գաղտնաբառը",
        "auth.btn_login": "Մուտք Գործել",
        "auth.btn_register": "Ստեղծել Հաշիվ",
        "auth.sec_orders": "Իմ Պատվերները",
        "auth.sec_track": "Հետևել Պատվերին",
        "auth.sec_quotes": "Կոմերցիոն Առաջարկներ",
        "auth.sec_invoices": "Հաշիվներ և Փաստաթղթեր",
        "auth.sec_saved_calcs": "Պահպանված Հաշվարկներ",
        "auth.sec_favorites": "Նախընտրած Կոնֆիգուրացիաներ",
        "auth.sec_profile": "Կազմակերպության Պրոֆիլ",
        "auth.sec_settings": "Հաշվի Կարգավորումներ",
        "auth.order_num": "Պատվեր №",
        "auth.order_tracking": "Հետևման Կոդ",
        "auth.order_date": "Ամսաթիվ",
        "auth.order_status": "Կարգավիճակ",
        "auth.order_total": "Գումար",
        "auth.order_details": "Մանրամասն",
        "auth.welcome_msg": "Բարի գալուստ"
      },
      ru: {
        "auth.header_btn": "👤 Войти / Регистрация",
        "auth.profile_btn": "👤 Личный Кабинет",
        "auth.tab_login": "Вход",
        "auth.tab_register": "Регистрация",
        "auth.field_email_phone": "Email или Телефон",
        "auth.field_password": "Пароль",
        "auth.field_confirm_password": "Подтверждение пароля",
        "auth.field_name": "Имя",
        "auth.field_last_name": "Фамилия",
        "auth.field_company": "Компания",
        "auth.field_phone": "Телефон",
        "auth.field_email": "Email",
        "auth.remember_me": "Запомнить меня",
        "auth.agree_terms": "Согласен с условиями использования",
        "auth.forgot_password": "Забыли пароль?",
        "auth.btn_login": "Войти",
        "auth.btn_register": "Создать аккаунт",
        "auth.sec_orders": "Мои заказы",
        "auth.sec_track": "Отслеживание заказов",
        "auth.sec_quotes": "Коммерческие предложения",
        "auth.sec_invoices": "Счета и документы",
        "auth.sec_saved_calcs": "Сохраненные расчеты",
        "auth.sec_favorites": "Избранные конфигурации",
        "auth.sec_profile": "Профиль компании",
        "auth.sec_settings": "Настройки аккаунта",
        "auth.order_num": "Номер заказа",
        "auth.order_tracking": "Tracking Code",
        "auth.order_date": "Дата",
        "auth.order_status": "Статус",
        "auth.order_total": "Сумма",
        "auth.order_details": "Подробнее",
        "auth.welcome_msg": "Добро пожаловать"
      },
      en: {
        "auth.header_btn": "👤 Login / Register",
        "auth.profile_btn": "👤 Personal Cabinet",
        "auth.tab_login": "Sign In",
        "auth.tab_register": "Sign Up",
        "auth.field_email_phone": "Email or Phone Number",
        "auth.field_password": "Password",
        "auth.field_confirm_password": "Confirm Password",
        "auth.field_name": "First Name",
        "auth.field_last_name": "Last Name",
        "auth.field_company": "Company / Brand",
        "auth.field_phone": "Phone Number",
        "auth.field_email": "Email Address",
        "auth.remember_me": "Remember me",
        "auth.agree_terms": "I agree to the Terms of Service",
        "auth.forgot_password": "Forgot password?",
        "auth.btn_login": "Sign In",
        "auth.btn_register": "Create Account",
        "auth.sec_orders": "My Orders",
        "auth.sec_track": "Order Tracking",
        "auth.sec_quotes": "Commercial Offers",
        "auth.sec_invoices": "Invoices and Documents",
        "auth.sec_saved_calcs": "Saved Calculations",
        "auth.sec_favorites": "Favorite Configurations",
        "auth.sec_profile": "Company Profile",
        "auth.sec_settings": "Account Settings",
        "auth.order_num": "Order Number",
        "auth.order_tracking": "Tracking Code",
        "auth.order_date": "Date",
        "auth.order_status": "Status",
        "auth.order_total": "Amount",
        "auth.order_details": "Details",
        "auth.welcome_msg": "Welcome back"
      },
      ar: {
        "auth.header_btn": "👤 تسجيل الدخول / التسجيل",
        "auth.profile_btn": "👤 الملف الشخصي والمكتب",
        "auth.tab_login": "دخول",
        "auth.tab_register": "تسجيل",
        "auth.field_email_phone": "البريد الإلكتروني أو الهاتف",
        "auth.field_password": "كلمة المرور",
        "auth.field_confirm_password": "تأكيد كلمة المرور",
        "auth.field_name": "الاسم الأول",
        "auth.field_last_name": "اسم العائلة",
        "auth.field_company": "الشركة / البراند",
        "auth.field_phone": "رقم الهاتف",
        "auth.field_email": "البريد الإلكتروني",
        "auth.remember_me": "تذكرني",
        "auth.agree_terms": "أوافق على شروط الخدمة والاستخدام",
        "auth.forgot_password": "هل نسيت كلمة المرور؟",
        "auth.btn_login": "دخول",
        "auth.btn_register": "إنشاء حساب",
        "auth.sec_orders": "طلباتي",
        "auth.sec_track": "تتبع الطلب",
        "auth.sec_quotes": "العروض التجارية",
        "auth.sec_invoices": "الفواتير والمستندات",
        "auth.sec_saved_calcs": "الحسابات المحفوظة",
        "auth.sec_favorites": "تكويناتي المفضلة",
        "auth.sec_profile": "ملف الشركة والبيانات",
        "auth.sec_settings": "إعدادات الحساب",
        "auth.order_num": "رقم الطلب",
        "auth.order_tracking": "رمز التتبع الدولي",
        "auth.order_date": "التاريخ",
        "auth.order_status": "موقف الطلب",
        "auth.order_total": "المجموع الاجمالي",
        "auth.order_details": "التفاصيل",
        "auth.welcome_msg": "أهلاً بك مجدداً"
      }
    };

    if (authDict[locale] && authDict[locale][key]) {
      return authDict[locale][key];
    }

    // 1. Try DB Translations first
    if (dbTranslations && dbTranslations[locale]) {
      let currentDb = dbTranslations[locale];
      let found = true;
      for (const seg of segments) {
        if (currentDb && currentDb[seg] !== undefined) {
          currentDb = currentDb[seg];
        } else {
          found = false;
          break;
        }
      }
      if (found && typeof currentDb === "string") {
        return currentDb;
      }
    }

    // 2. Fall back to static bundled translations
    let currentDic = translations[locale];
    
    for (const seg of segments) {
      if (currentDic && currentDic[seg] !== undefined) {
        currentDic = currentDic[seg];
      } else {
        currentDic = undefined;
        break;
      }
    }

    if (typeof currentDic === "string") {
      return currentDic;
    }

    // Try fallback translation in hy as a backup
    if (locale !== "hy") {
      let armDic = translations["hy"];
      for (const seg of segments) {
        if (armDic && armDic[seg] !== undefined) {
          armDic = armDic[seg];
        } else {
          armDic = undefined;
          break;
        }
      }
      if (typeof armDic === "string") {
        return armDic;
      }
    }

    return fallback !== undefined ? fallback : key;
  };

  // Locale-based number formatting
  const formatNumber = (n: number): string => {
    try {
      const code = locale === "hy" ? "hy-AM" : locale === "ar" ? "ar-EG" : locale === "ru" ? "ru-RU" : "en-US";
      return new Intl.NumberFormat(code).format(n);
    } catch {
      return n.toString();
    }
  };

  // Locale-based price formatting with corresponding currency tags
  const formatPrice = (n: number): string => {
    const formattedNum = formatNumber(n);
    if (locale === "hy") {
      return `${formattedNum} ֏`;
    } else if (locale === "ar") {
      return `${formattedNum} درهم`; // or AMD but in Arabic: درام
    } else if (locale === "ru") {
      return `${formattedNum} ֏`; // Or ֏ for consistency with AMD base pricing
    } else {
      return `${formattedNum} AMD`;
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isRtl, formatNumber, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};
