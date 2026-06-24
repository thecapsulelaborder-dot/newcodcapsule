import React, { useState, useEffect } from "react";
import { 
  Search, 
  Copy, 
  Check, 
  Calendar, 
  Inbox, 
  Loader2, 
  ArrowLeft, 
  AlertCircle,
  Clock,
  Printer,
  Compass,
  FileCheck,
  Cpu,
  BookmarkCheck,
  PackageCheck,
  Truck,
  Layers,
  MessageSquare,
  Sparkles,
  Download
} from "lucide-react";

interface StatusHistoryItem {
  status: string;
  ts: string;
  manager: string;
}

interface OrderDetail {
  id: string;
  trackingCode: string;
  ts: string;
  status: string;
  managerComment: string;
  type: string;
  qty: number;
  totalPrice: number;
  statusHistory: any[];
  manager?: string;
  expectedReadyTs?: string;
  managerPhone?: string;
  customerPhone?: string;
  estimatedCompletionDate?: string;
  estimatedCompletionUpdatedAt?: string;
  productionDays?: number;
  artworkStatus?: string;
  artworkComment?: string;
  artworkUrl?: string;
  files?: any[];
  review?: any;
  notificationPreferences?: any;
}

interface OrderTrackPortalProps {
  currentLocale: string;
  onBackToHome: () => void;
  onReorder?: (order: any) => void;
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
  hy: {
    portal_title: "Պատվերի Հետևման Պորտալ",
    portal_sub: "Մուտքագրեք Ձեր Հետևման Կոդը և Հեռախոսահամարը՝ պատվերի իրական կարգավիճակը իմանալու համար",
    tracking_code_label: "Հետևման Կոդ (Tracking Code)",
    tracking_code_placeholder: "Օրինակ՝ A112233",
    phone_label: "Հեռախոսահամար",
    phone_placeholder: "Մուտքագրեք հեռախոսահամարը",
    btn_track: "Որոնել Պատվերը",
    btn_back: "Վերադառնալ Գլխավոր",
    order_found: "Պատվերը Գտնվել է",
    order_number: "Պատվերի Համար",
    tracking_code: "Հետևման Կոդ",
    created_at: "Ստեղծման Ամսաթիվ",
    current_status: "Ընթացիկ Կարգավիճակ",
    last_comment: "Մենեջերի Մեկնաբանություն",
    no_comment: "Մեկնաբանություններ դեռ չկան",
    est_ready: "Օպերատիվ պատրաստման ամսաթիվ",
    copy_success: "Պատճենված է",
    copy_code: "Պատճենել Համարը",
    error_not_found: "Պատվերը չի գտնվել։ Խնդրում ենք ստուգել կոդը և հեռախոսահամարը։",
    searching: "Որոնվում է...",
    progress_title: "Արտադրության Փուլեր",
    details_title: "Արխիվի Մանրամասներ",
    qty: "Քանակ",
    total_price: "Ընդհանուր Արժեք",
    product_type: "Ապրանք",
    stage_new: "Նոր պատվեր",
    stage_proofing: "Մակետի ստուգում",
    stage_design: "Դիզայն",
    stage_approval: "Հաստատում",
    stage_print: "Տպագրություն",
    stage_post: "Մշակում",
    stage_assembly: "Սբորկա",
    stage_pack: "Փաթեթավորում",
    stage_ready: "Պատրաստ է",
    stage_delivered: "Առաքված է"
  },
  ru: {
    portal_title: "Портал отслеживания заказов",
    portal_sub: "Введите ваш трекинг-код и номер телефона для просмотра статуса производства",
    tracking_code_label: "Код отслеживания (Tracking Code)",
    tracking_code_placeholder: "Например: A112233",
    phone_label: "Номер телефона",
    phone_placeholder: "Введите ваш номер телефона",
    btn_track: "Найти заказ",
    btn_back: "Назад на главную",
    order_found: "Заказ найден",
    order_number: "Номер заказа",
    tracking_code: "Код отслеживания",
    created_at: "Дата создания",
    current_status: "Текущий статус",
    last_comment: "Комментарий менеджера",
    no_comment: "Комментариев пока нет",
    est_ready: "Ожидаемая дата готовности",
    copy_success: "Скопировано",
    copy_code: "Скопировать номер заказа",
    error_not_found: "Заказ не найден. Проверьте правильность трекинг-кода и телефона.",
    searching: "Поиск...",
    progress_title: "Прогресс производства",
    details_title: "Сведения о заказе",
    qty: "Количество",
    total_price: "Итоговая сумма",
    product_type: "Тип продукта",
    stage_new: "Новый",
    stage_proofing: "Проверка макета",
    stage_design: "Дизайн",
    stage_approval: "Подтверждение",
    stage_print: "Печать",
    stage_post: "Постобработка",
    stage_assembly: "Сборка",
    stage_pack: "Упаковка",
    stage_ready: "Готов",
    stage_delivered: "Доставлен"
  },
  en: {
    portal_title: "Customer Order Tracking Portal",
    portal_sub: "Enter your Tracking Code and phone number to monitor your order's real-time status",
    tracking_code_label: "Tracking Code",
    tracking_code_placeholder: "Example: A112233",
    phone_label: "Phone Number",
    phone_placeholder: "Enter your phone number",
    btn_track: "Search Order",
    btn_back: "Back to Home",
    order_found: "Order Located Successfully",
    order_number: "Order Number",
    tracking_code: "Tracking Code",
    created_at: "Created At",
    current_status: "Status",
    last_comment: "Manager Comment",
    no_comment: "No comments registered yet",
    est_ready: "Estimated Completion Date",
    copy_success: "Copied!",
    copy_code: "Copy Order ID",
    error_not_found: "Order not found. Please verify your tracking code and phone number.",
    searching: "Processing lookup...",
    progress_title: "Production Progress",
    details_title: "Order Details",
    qty: "Quantity",
    total_price: "Total Price",
    product_type: "Product",
    stage_new: "New Order",
    stage_proofing: "Proof Checking",
    stage_design: "Design Mode",
    stage_approval: "Approval",
    stage_print: "Printing",
    stage_post: "Finishing",
    stage_assembly: "Assembly",
    stage_pack: "Packaging",
    stage_ready: "Ready",
    stage_delivered: "Delivered"
  },
  ar: {
    portal_title: "بوابة تتبع طلبات العملاء",
    portal_sub: "أدخل كود التتبع ورقم الهاتف للتحقق من حالة طلبك في الوقت الفعلي",
    tracking_code_label: "كود التتبع (Tracking Code)",
    tracking_code_placeholder: "مثال: A112233",
    phone_label: "رقم الهاتف",
    phone_placeholder: "أدخل رقم هاتفك",
    btn_track: "البحث عن الطلب",
    btn_back: "العودة للرئيسية",
    order_found: "تم العثور على الطلب",
    order_number: "رقم الطلب",
    tracking_code: "كود التتبع",
    created_at: "تاريخ الإنشاء",
    current_status: "الحالة الحالية",
    last_comment: "ملاحظة المدير",
    no_comment: "لا يوجد تعليقات حتى الآن",
    est_ready: "تاريخ الجاهزية المتوقع",
    copy_success: "تم النسخ",
    copy_code: "نسخ رقم الطلب",
    error_not_found: "لم يتم العثور على الطلب. يرجى تأكيد كود التتبع ورقم الهاتف.",
    searching: "جاري البحث...",
    progress_title: "مرحلة الإنتاج والتقدم",
    details_title: "تفاصيل الطلب",
    qty: "الكمية",
    total_price: "السعر الإجمالي",
    product_type: "نوع المنتج",
    stage_new: "طلب جديد",
    stage_proofing: "مراجعة المخطط",
    stage_design: "التصميم",
    stage_approval: "اعتماد العميل",
    stage_print: "الطباعة",
    stage_post: "المعالجة اللاحقة",
    stage_assembly: "التجميع",
    stage_pack: "التعبئة والتحضير",
    stage_ready: "جاهز",
    stage_delivered: "تم التوصيل"
  }
};

const STATUSES = [
  { key: "Новый", percent: 10, labelKey: "stage_new", icon: Inbox },
  { key: "Проверка макета", percent: 20, labelKey: "stage_proofing", icon: Compass },
  { key: "Дизайн", percent: 30, labelKey: "stage_design", icon: FileCheck },
  { key: "Подтверждение клиента", percent: 40, labelKey: "stage_approval", icon: BookmarkCheck },
  { key: "Печать", percent: 55, labelKey: "stage_print", icon: Printer },
  { key: "Постобработка", percent: 68, labelKey: "stage_post", icon: Cpu },
  { key: "Сборка", percent: 80, labelKey: "stage_assembly", icon: Layers },
  { key: "Упаковка", percent: 90, labelKey: "stage_pack", icon: PackageCheck },
  { key: "Готов", percent: 95, labelKey: "stage_ready", icon: Check },
  { key: "Доставлен", percent: 100, labelKey: "stage_delivered", icon: Truck }
];

const STATUS_EXPLANATIONS: Record<string, Record<string, string>> = {
  hy: {
    "Новый": "Պատվերը հաջողությամբ գրանցվել է ERP համակարգում: Մեր առաջատար մասնագետը ուսումնասիրում է տեխնիկական պարամետրերը և պատրաստում արտադրության պլանը:",
    "Проверка макета": "Մեր տեխնիկական բաժինը ստուգում է Ձեր տրամադրած դիզայնի ֆայլերի համապատասխանությունը տպագրական չափանիշներին (արյունահոսություն, չափսեր, լուծաչափ):",
    "Дизайн": "Դիզայների կողմից մշակվում է տպագրական կաղապարը և կատարվում է գունային կորեկցիա՝ Armenia-ի ամենաճշգրիտ երանգները ստանալու համար:",
    "Подтверждение клиента": "Մակետը պատրաստ է և սպասում է Ձեր վերջնական հաստատմանը: Խնդրում ենք ստուգել մանրամասները և սեղմել «Հաստատել մակետը»:",
    "Печать": "Արտադրանքը գտնվում է ակտիվ տպագրության փուլում: Մեր գերժամանակակից տեխնիկան իրականացնում է բարձրակարգ գունավորում հենց հիմա:",
    "Постобработка": "Իրականացվում է տպագրված նյութերի լրացուցիչ մշակում (լամինացիա, ուլտրամանուշակագույն լաքապատում, դաջում կամ կտրում):",
    "Сборка": "Կատարվում է պատվերի մասերի վերջնական հավաքում, սոսնձում և ամրացում համապատասխան տեխնոլոգիական չափանիշներով:",
    "Упаковка": "Ձեր պատվերը փաթեթավորվում է հատուկ պաշտպանիչ և բրենդային տուփերում՝ տեղափոխման ժամանակ վնասվածքներից խուսափելու համար:",
    "Готов": "Արտադրությունն ավարտված է: Պատվերը ստուգվել է որակի վերահսկման բաժնի կողմից և պատրաստ է ստացման կամ առաքման:",
    "Доставлен": "Պատվերը հաջողությամբ հանձնվել է հաճախորդին: Շնորհակալություն CAPSULE PACK-ին վստահելու համար:"
  },
  ru: {
    "Новый": "Заказ успешно зарегистрирован в ERP-системе. Ведущий специалист анализирует технические параметры и формирует план производства.",
    "Проверка макета": "Наш технический отдел проверяет предоставленные файлы дизайна на соответствие печатным стандартам (вылеты, размеры, разрешение DPI).",
    "Дизайн": "Дизайнер создает окончательный спуск полос, настраивает высечные контуры и калибрует цветовые профили для идеальной цветопередачи.",
    "Подтверждение клиента": "Макет полностью готов и ожидает вашего окончательного утверждения. Пожалуйста, проверьте превью и нажмите «Утвердить макет».",
    "Печать": "Продукция находится на печатном оборудовании. Выполняется высокоточный запуск тиража с использованием премиальных красителей.",
    "Постобработка": "Производятся работы по финишной обработке (ламинация, выборочный УФ-лак, тиснение фольгой, конгрев или высокоточная вырубка).",
    "Сборка": "Осуществляется склейка, сборка конструктива изделий, фиксация фурнитуры и доработка деталей вручную мастерами нашей мануфактуры.",
    "Упаковка": "Мы упаковываем ваш заказ в защитную брендированную транспортную тару, чтобы исключить любые повреждения при логистике.",
    "Готов": "Продукция полностью готова. Тираж успешно прошел строгий отдел технического контроля (ОТК) и готов к выдаче или отправке курьером.",
    "Доставлен": "Заказ успешно доставлен и передан заказчику. Мы будем рады вашему честному отзыву в блоке оценки ниже! Спасибо за доверие."
  },
  en: {
    "Новый": "The order is registered in our ERP. A lead specialist is reviewing the technical checklist and scheduling production slots.",
    "Проверка макета": "Our technical pre-press team is validating your design artwork against print-ready standards (bleeds, dimensions, color profiles).",
    "Дизайн": "Designers are laying out the precise die-cut line vectors and aligning colors to strict brand guideline requirements.",
    "Подтверждение клиента": "The design proof is ready and awaits your final greenlight. Please check the mock preview and click 'Approve proof' below.",
    "Печать": "Your order is currently engaged in the printing press. High-speed custom print run is operating now with premium ink density.",
    "Постобработка": "Specialized surface finish treatments are in progress (matte/gloss lamination, spot UV, hot foil stamping, or custom embossing).",
    "Сборка": "Manual or automated folding, precise box gluing, ribbon insertion and general construct assembly process is actively running.",
    "Упаковка": "Your units are securely packed into custom protective shock-absorbing brand boxes to guarantee pristine state upon arrival.",
    "Готов": "Production finished. Your entire batch has successfully qualified through our QA controls and is set for pickup or courier dispatch.",
    "Доставлен": "Your order has been safely delivered and signed for. Thank you for choosing CAPSULE PACK Yerevan!"
  },
  ar: {
    "Новый": "تم تسجيل الطلب في نظام إدارة المبيعات بنجاح. يقوم المهندس بمراجعة المخططات الهندسية وترتيب خطوط الإنتاج.",
    "Проверка макета": "يقوم قسم ما قبل الطباعة بالتحقق من جودة الملفات، والأبعاد، والمقاسات، وجودة الألوان المعتمدة.",
    "Дизайн": "يتم إعداد القوالب وتجهيز ملفات القص الليزري بدقة متناهية لضمان تطابق الأبعاد والزوايا.",
    "Подтверждение клиента": "تم إعداد نموذج التصميم النهائي وهو قيد انتظار اعتمادكم الرسمي. يرجى مراجعة الرابط والضغط على زر الاعتماد.",
    "Печать": "القطع الآن في مرحلة الطباعة المتقدمة وإنتاج الألوان بدقة على خامات الباكجينج الفاخرة.",
    "Постобработка": "عمليات المعالجة السطحية الجمالية الإضافية جارية حالياً (سواء السلوفان، الورنيش الموضعي، البصمة الحرارية أو الكبس الدقيق).",
    "Сборка": "جاري طي العبوات، واللصق المتين، وتجميع الهيكل وتحضير الشرائط والإكسسوارات الخاصة.",
    "Упаковка": "تغليف وحفظ العبوات في صناديق سميكة ومحمية للتأكد من وصولها إلى مقركم بأمان تام وبلا عيوب.",
    "Готов": "اكتمل الإنتاج بالكامل وتم الفحص النهائي بنجاح، شحنتك بانتظار الاستلام أو توجيهها لشركة الشحن الشريكة.",
    "Доставлен": "تم تسليم الطلب للعميل بنجاح. نسعد كثيراً بتقييمكم لخدمتنا في نموذج التعليقات بالأسفل! شكراً لثقتكم."
  }
};

export default function OrderTrackPortal({ currentLocale, onBackToHome, onReorder }: OrderTrackPortalProps) {
  const [trackingCode, setTrackingCode] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // New Interactive States for Customer Portal Upgrades
  const [satisfactionRated, setSatisfactionRated] = useState(false);
  const [satisfactionRating, setSatisfactionRating] = useState(5);
  const [satisfactionComment, setSatisfactionComment] = useState("");
  const [satisfactionSubmitting, setSatisfactionSubmitting] = useState(false);
  const [satisfactionStatusMsg, setSatisfactionStatusMsg] = useState<string | null>(null);

  const [notifWhatsapp, setNotifWhatsapp] = useState(false);
  const [notifEmail, setNotifEmail] = useState(false);
  const [notifTelegram, setNotifTelegram] = useState(false);
  const [notifStatusMsg, setNotifStatusMsg] = useState<string | null>(null);

  const [artworkComment, setArtworkComment] = useState("");
  const [artworkStatusMsg, setArtworkStatusMsg] = useState<string | null>(null);

  // Sync state values on order fetch response
  useEffect(() => {
    if (order) {
      if (order.notificationPreferences) {
        setNotifWhatsapp(!!order.notificationPreferences.whatsapp);
        setNotifEmail(!!order.notificationPreferences.email);
        setNotifTelegram(!!order.notificationPreferences.telegram);
      } else {
        setNotifWhatsapp(false);
        setNotifEmail(false);
        setNotifTelegram(false);
      }
      if (order.review) {
        setSatisfactionRated(true);
        setSatisfactionRating(order.review.rating || 5);
        setSatisfactionComment(order.review.comment || "");
      } else {
        setSatisfactionRated(false);
        setSatisfactionRating(5);
        setSatisfactionComment("");
      }
    }
  }, [order]);

  const handleToggleNotification = async (channel: "whatsapp" | "email" | "telegram", val: boolean) => {
    let nextW = notifWhatsapp;
    let nextE = notifEmail;
    let nextT = notifTelegram;
    if (channel === "whatsapp") { nextW = val; setNotifWhatsapp(val); }
    if (channel === "email") { nextE = val; setNotifEmail(val); }
    if (channel === "telegram") { nextT = val; setNotifTelegram(val); }

    try {
      const res = await fetch("/api/track-order/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingCode: order?.trackingCode,
          phone: phone || order?.customerPhone,
          whatsapp: nextW,
          email: nextE,
          telegram: nextT
        })
      });
      const data = await res.json();
      if (data.success) {
        setNotifStatusMsg(currentLocale === "hy" ? "Պահպանված է" : "Сохранено");
        setTimeout(() => setNotifStatusMsg(null), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const handleArtworkAction = async (action: "approve" | "reject") => {
    setArtworkStatusMsg(currentLocale === "hy" ? "Մշակվում է..." : "Обработка...");
    try {
      const res = await fetch("/api/track-order/artwork-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingCode: order?.trackingCode,
          phone: phone || order?.customerPhone,
          action,
          comment: artworkComment
        })
      });
      const data = await res.json();
      if (data.success) {
        setArtworkStatusMsg(action === "approve" 
          ? (currentLocale === "hy" ? "Մակետը հաստատվել է" : "Макет утвержден!") 
          : (currentLocale === "hy" ? "Ուղարկված է լրամշակման" : "Отправлено на доработку")
        );
        if (order) {
          setOrder({
            ...order,
            artworkStatus: action === "approve" ? "утвержден" : "на доработке",
            artworkComment: artworkComment
          });
        }
      } else {
        setArtworkStatusMsg(data.error);
      }
    } catch {
      setArtworkStatusMsg("Offline Error");
    }
  };

  const handleSendSatisfactionReview = async () => {
    if (!order) return;
    setSatisfactionSubmitting(true);
    try {
      const res = await fetch("/api/track-order/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingCode: order.trackingCode,
          phone: phone || order.customerPhone,
          rating: satisfactionRating,
          comment: satisfactionComment
        })
      });
      const data = await res.json();
      if (data.success) {
        setSatisfactionRated(true);
        setSatisfactionStatusMsg(currentLocale === "hy" ? "Շնորհակալություն գնահատականի համար:" : "Спасибо за оценку!");
      }
    } catch {
      setSatisfactionStatusMsg("Connection Error");
    } finally {
      setSatisfactionSubmitting(false);
    }
  };

  // Read code from URL parameters if available on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get("code");
    const phoneParam = params.get("phone");
    if (codeParam) {
      setTrackingCode(codeParam);
      if (phoneParam) {
        setPhone(phoneParam);
      }
      triggerAutoSearch(codeParam, phoneParam || "");
    }
  }, []);

  const triggerAutoSearch = async (code: string, phoneNumber?: string) => {
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingCode: code, phone: phoneNumber || undefined })
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Connection error. Real-time metrics offline.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingCode: trackingCode.trim(), phone: phone.trim() || undefined })
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      } else {
        setError(data.error || "Order not found");
      }
    } catch (err) {
      setError("Database lookup offline. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadQuote = (o: OrderDetail) => {
    const title = currentLocale === "hy" ? "ՊԱՇՏՈՆԱԿԱՆ ԳՆԱՌԱՋԱՐԿ" : currentLocale === "ru" ? "КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ" : "OFFICIAL QUOTE";
    const qtyText = currentLocale === "hy" ? "Քանակ" : "Qty";
    const specsText = currentLocale === "hy" ? "Տեխնիկական բնութագիր" : "Technical Specifications";
    const htmlContent = `<html>
<head>
  <title>Quote - ${o.id}</title>
  <style>
    body { font-family: sans-serif; padding: 40px; color: #1c1917; background: #fff; }
    .header { border-bottom: 2px solid #ff2300; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 26px; color: #ff2300; font-weight: bold; text-transform: uppercase; }
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; font-size: 13px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .table th, .table td { border: 1px solid #e7e5e4; padding: 12px; text-align: left; font-size: 13px; }
    .table th { background: #f5f5f4; }
    .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; color: #ff2300; }
    .branding { font-size: 12px; color: #78716c; margin-top: 40px; border-top: 1px solid #e7e5e4; padding-top: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">${title}</div>
    <div style="text-align: right; font-size: 12px;"><strong>CAPSULE PACK</strong></div>
  </div>
  <div class="meta">
    <div>
      <strong>Order / Lead ID:</strong> ${o.id}<br/>
      <strong>Tracking Code:</strong> ${o.trackingCode}<br/>
      <strong>Generated On:</strong> ${new Date().toLocaleDateString()}<br/>
    </div>
    <div>
      <strong>Expected Production Days:</strong> 5-7 Business Days<br/>
      <strong>Status:</strong> ${o.status}<br/>
    </div>
  </div>
  <h3>${specsText}</h3>
  <table class="table">
    <thead>
      <tr>
        <th>Specification Field</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Packaging Type</td>
        <td>${o.type.toUpperCase()}</td>
      </tr>
      <tr>
        <td>${qtyText}</td>
        <td>${o.qty.toLocaleString()} Units</td>
      </tr>
      <tr>
        <td>Latest Stage status</td>
        <td>${o.status}</td>
      </tr>
    </tbody>
  </table>
  <div class="total">Estimated Quote Total: ${o.totalPrice.toLocaleString()} AMD</div>
  <div class="branding">CAPSULE PACK ERP Automation System - Yerevan, RA</div>
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Quote_${o.id}.html`;
    a.click();
  };

  const downloadInvoice = (o: OrderDetail) => {
    const title = currentLocale === "hy" ? "ՀԱՇԻՎ-ԱՊՐԱՆՔԱԳԻՐ" : currentLocale === "ru" ? "СЧЕТ ИНВОЙС" : "OFFICIAL INVOICE";
    const htmlContent = `<html>
<head>
  <title>Invoice - ${o.id}</title>
  <style>
    body { font-family: sans-serif; padding: 40px; color: #1c1917; background: #fff; }
    .header { border-bottom: 2px solid #ff2300; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 26px; color: #ff2300; font-weight: bold; text-transform: uppercase; }
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; font-size: 13px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .table th, .table td { border: 1px solid #e7e5e4; padding: 12px; text-align: left; font-size: 13px; }
    .table th { background: #f5f5f4; }
    .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; color: #ff2300; }
    .branding { font-size: 12px; color: #78716c; margin-top: 40px; border-top: 1px solid #e7e5e4; padding-top: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">${title}</div>
    <div style="text-align: right; font-size: 12px;"><strong>CAPSULE PACK</strong></div>
  </div>
  <div class="meta">
    <div>
      <strong>Invoice Number:</strong> INV-${o.id.toUpperCase()}<br/>
      <strong>Tracking Reference:</strong> ${o.trackingCode}<br/>
      <strong>Billing Date:</strong> ${new Date(o.ts).toLocaleDateString()}<br/>
    </div>
    <div>
      <strong>Payment Status:</strong> Pending / Completed<br/>
      <strong>Responsible Manager:</strong> ${o.manager || "System"}<br/>
    </div>
  </div>
  <table class="table">
    <thead>
      <tr>
        <th>Description</th>
        <th>Quantity</th>
        <th>Rate</th>
        <th>Total Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Premium Branded Packaging Submissions (${o.type.toUpperCase()})</td>
        <td>${o.qty.toLocaleString()}</td>
        <td>${(o.totalPrice / o.qty).toFixed(1)} AMD</td>
        <td>${o.totalPrice.toLocaleString()} AMD</td>
      </tr>
    </tbody>
  </table>
  <div class="total">Amount Due: ${o.totalPrice.toLocaleString()} AMD</div>
  <div class="branding">CAPSULE PACK ERP Automation System - Yerevan, RA</div>
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice_${o.id}.html`;
    a.click();
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const l = TRANSLATIONS[currentLocale] || TRANSLATIONS["hy"];

  // Calculate manufacturing readiness estimate (creation date + 5 days)
  const getExpectedReadyDate = (createdTs: string) => {
    try {
      const d = new Date(createdTs);
      d.setDate(d.getDate() + 5);
      return d.toLocaleDateString(currentLocale === "hy" ? "hy-AM" : currentLocale === "ru" ? "ru-RU" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return "---";
    }
  };

  const getCurrentStatusPercent = (status: string) => {
    const foundStatus = STATUSES.find(s => s.key === status);
    return foundStatus ? foundStatus.percent : 10;
  };

  const currentStatusIndex = STATUSES.findIndex(s => s.key === (order?.status || "Новый"));

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto py-12 px-4 select-text">
      {/* Brand Back Navigation & Reset buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <button 
          onClick={onBackToHome}
          className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ff2300] hover:text-[#e61f00] cursor-pointer select-none transition-colors"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <span>{l.btn_back}</span>
        </button>

        {order && (
          <button 
            type="button"
            onClick={() => { setOrder(null); setError(null); }}
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#ff2300] hover:text-[#e61f00] cursor-pointer select-none transition-all border border-[#ff2300]/20 bg-[#ff2300]/5 rounded-xl px-4 py-2"
          >
            <Search size={12} />
            <span>{currentLocale === "hy" ? "Փնտրել Այլ Պատվեր" : currentLocale === "ru" ? "Искать другой заказ" : "Search Another Order"}</span>
          </button>
        )}
      </div>

      {!order ? (
        /* BEAUTIFUL CENTERED CARD */
        <div id="tracking-card-container" className="w-full max-w-2xl mx-auto bg-[#F9F9F9]/95 border-3 border-white rounded-[2.5rem] p-8 sm:p-12 shadow-[4px_4px_12px_#d1d9e6,_-4px_-4px_12px_#FFFFFF] text-center select-none space-y-6 sm:space-y-8 animate-fade-in mt-6">
          {/* Brand Stars */}
          <div className="flex justify-center gap-1.5 text-[#ff2300] text-sm sm:text-base">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
          </div>

          {/* Large Title */}
          <h1 className="font-serif text-3xl sm:text-4xl uppercase tracking-wider font-extrabold select-none leading-none">
            <span className="text-[#ff2300]">
              {currentLocale === "hy" ? "ՀԵՏԵՎԵԼ" : currentLocale === "ru" ? "ОТСЛЕДИТЬ" : "TRACK"}
            </span>{" "}
            <span className="text-[#1a1c1d]">
              {currentLocale === "hy" ? "ՊԱՏՎԵՐԻՆ" : currentLocale === "ru" ? "ЗАКАЗ" : "ORDER"}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#5B5B5B] leading-relaxed font-sans">
            {currentLocale === "hy" ? "Մուտքագրեք Ձեր պատվերի կոդը՝ արտադրության ընթացքին հետևելու համար:" :
             currentLocale === "ru" ? "Введите промокод или номер отслеживания для проверки этапа производства вашего заказа:" :
             "Enter your order tracking code to follow the live production stages of your order:"}
          </p>

          {/* Unified Inline Search Bar */}
          <form onSubmit={handleSearch} className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white border border-[#E5E7EB] rounded-2xl sm:rounded-full p-1.5 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.02)] transition-all focus-within:border-[#ff2300]/50 gap-2">
              <input
                type="text"
                required
                placeholder={currentLocale === "hy" ? "Օրինակ՝ A975198" : currentLocale === "ru" ? "Например: A975198" : "Example: A975198"}
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                className="flex-1 bg-transparent border-none outline-none py-3 px-5 text-sm font-semibold tracking-wider text-[#1a1c1d] placeholder-[#C2C2C2] min-w-0"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#ff2300] hover:bg-[#e61f00] text-white flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl sm:rounded-full uppercase tracking-wider font-bold select-none transition-all active:scale-98 shadow-[2px_2px_6px_rgba(255,35,0,0.2)] text-xs cursor-pointer min-w-[120px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    <span>{currentLocale === "hy" ? "Որոնում..." : "Поиск..."}</span>
                  </>
                ) : (
                  <>
                    <Search size={14} />
                    <span>
                      {currentLocale === "hy" ? "Փնտրել" : currentLocale === "ru" ? "Искать" : "Search"}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Error Feedback Display */}
            {error && (
              <div className="mt-5 bg-red-50 border border-red-200/50 rounded-2xl p-4 flex items-start gap-2.5 text-red-800 text-xs font-semibold tracking-wide animate-fade-in text-left">
                <AlertCircle size={15} className="shrink-0 text-red-600 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </form>
        </div>
      ) : (
        /* THE DETAILED STATUS PROGRESS PAGE, full width and extremely gorgeous */
        <div className="w-full max-w-3xl mx-auto space-y-6">
          <div className="hidden">
            <form onSubmit={handleSearch} className="space-y-5">
              {/* Tracking Code Field */}
              <div className="space-y-1.5 text-left">
                <label className="block text-[9px] font-bold text-[#FF2300] uppercase tracking-wider font-mono">
                  {l.tracking_code_label}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder={l.tracking_code_placeholder}
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                    className="w-full bg-[#f0f2f5] border border-[#FF2300]/25/15 rounded-xl py-3 px-4 text-xs font-bold text-[#1a1c1d] uppercase tracking-widest outline-none focus:border-[#FF2300]/25/40 focus:ring-1 focus:ring-[#FF2300]/40"
                  />
                </div>
              </div>

              {/* Phone Number Field */}
              <div className="space-y-1.5 text-left">
                <label className="block text-[9px] font-bold text-[#FF2300] uppercase tracking-wider font-mono">
                  {l.phone_label}
                </label>
                <input
                  type="text"
                  required
                  placeholder={l.phone_placeholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#f0f2f5] border border-[#FF2300]/25/15 rounded-xl py-3 px-4 text-xs font-bold text-[#1a1c1d] outline-none focus:border-[#FF2300]/25/40 focus:ring-1 focus:ring-[#FF2300]/40"
                />
              </div>

              {/* Action Search Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#ff2300] to-[#cc1c00] hover:from-[#e61f00] hover:to-[#b31900] text-white text-[11px] py-3.5 tracking-wider font-extrabold uppercase rounded-full cursor-pointer select-none transition-all hover:shadow-[4px_4px_12px_rgba(255,35,0,0.15)] shadow-inner active:scale-98 flex items-center justify-center gap-2 text-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    <span>{l.searching}</span>
                  </>
                ) : (
                  <>
                    <Search size={14} />
                    <span>{l.btn_track}</span>
                  </>
                )}
              </button>
            </form>

            {/* Feedback error container */}
            {error && (
              <div className="bg-red-700/5 border border-red-700/15 rounded-xl p-4 flex items-start gap-2.5 text-red-800 text-[11px] font-semibold tracking-wide animate-fade-in text-left">
                <AlertCircle size={15} className="shrink-0 text-red-700 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </div>

          {order ? (
            <div className="bg-[#f0f2f5] border-3 border-white rounded-[2.5rem] p-6 sm:p-10 shadow-[4px_4px_15px_#D4CFC4,_-4px_-4px_15px_#FFFFFF] relative space-y-8 animate-[fadeIn_0.5s_ease_out]">
              
              {/* Card Header & Status Ribbon */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#FF2300]/25/10 pb-4 gap-4 text-left">
                <div>
                  <span className="text-[10px] text-[#ff2300] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1.5 select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff2300] animate-pulse"></span>
                    {l.order_found}
                  </span>
                  <h3 className="font-serif text-2xl font-black text-[#1a1c1d] uppercase tracking-wide">
                    {l.order_number}: <span className="font-sans text-[#ff2300] font-extrabold">{order.id}</span>
                  </h3>
                </div>

                <button
                  onClick={() => handleCopyId(order.id)}
                  className="bg-white hover:bg-[#e1e6ed]/50 transition-all text-[#1a1c1d] border border-[#d1d9e6] hover:border-[#1a1c1d]/30 rounded-xl px-4 py-2 font-bold font-mono text-[10px] uppercase cursor-pointer select-none flex items-center gap-1.5 shadow-xs"
                >
                  {copied ? <Check size={12} className="stroke-[3.5] text-[#ff2300]" /> : <Copy size={12} />}
                  <span>{copied ? l.copy_success : l.copy_code}</span>
                </button>
              </div>

              {/* Grid Specifications info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left font-sans text-[#1a1c1d]">
                <div className="bg-[#f0f2f5]/85 p-4 rounded-2xl border border-[#d1d9e6]/60">
                  <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-[#727784] select-none block">
                    {l.created_at}
                  </span>
                  <p className="text-xs font-bold text-[#1a1c1d] mt-1">
                    {new Date(order.ts).toLocaleDateString(currentLocale === "hy" ? "hy-AM" : currentLocale === "ru" ? "ru-RU" : "en-US", {
                      year: "numeric", month: "short", day: "numeric"
                    })}
                  </p>
                </div>

                <div className="bg-[#f0f2f5]/85 p-4 rounded-2xl border border-[#d1d9e6]/60 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-[#727784] select-none block">
                      {l.est_ready}
                    </span>
                    <p className="text-xs font-black text-[#ff2300] mt-1 flex items-center gap-1.5">
                      <Clock size={13} className="inline mr-0.5 shrink-0 text-[#ff2300]" />
                      <span>
                        {order.estimatedCompletionDate 
                          ? new Date(order.estimatedCompletionDate).toLocaleDateString(currentLocale === "hy" ? "hy-AM" : currentLocale === "ru" ? "ru-RU" : "en-US", { year: "numeric", month: "long", day: "numeric" })
                          : (order.expectedReadyTs || getExpectedReadyDate(order.ts))}
                      </span>
                    </p>
                  </div>
                  {order.estimatedCompletionUpdatedAt && (
                    <div className="mt-2 pt-1.5 border-t border-[#1a1c1d]/5 text-[9px] text-[#78716c] font-sans">
                      <span className="font-bold">
                        {currentLocale === "hy" ? "Վերջին թարմացումը:" : currentLocale === "ru" ? "Последнее обновление:" : "Last Update:"}
                      </span>{" "}
                      {new Date(order.estimatedCompletionUpdatedAt).toLocaleDateString(currentLocale === "hy" ? "hy-AM" : currentLocale === "ru" ? "ru-RU" : "en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </div>
                  )}
                </div>

                <div className="bg-[#f0f2f5]/85 p-4 rounded-2xl border border-[#d1d9e6]/60">
                  <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-[#727784] select-none block">
                    {l.product_type}
                  </span>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#1a1c1d] mt-1 font-mono">
                    {order.type}
                  </p>
                </div>

                <div className="bg-[#f0f2f5]/85 p-4 rounded-2xl border border-[#d1d9e6]/60">
                  <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-[#1a1c1d]/60 select-none block">
                    {l.qty}
                  </span>
                  <p className="text-xs font-bold text-[#1a1c1d] mt-1">
                    {order.qty.toLocaleString()} {order.type === "ribbons" ? (currentLocale === "hy" ? "մետր" : "м") : (currentLocale === "hy" ? "հատ" : "шт")}
                  </p>
                </div>

                <div className="bg-[#f0f2f5]/85 p-4 rounded-2xl border border-[#d1d9e6]/60">
                  <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-[#1a1c1d]/60 select-none block">
                    {currentLocale === "hy" ? "Պատվերի Կոդ" : currentLocale === "ru" ? "Номер/Код заказа" : "Order / Tracking Code"}
                  </span>
                  <p className="text-xs font-mono font-black text-[#ff2300] mt-1 tracking-wider uppercase">
                    {order.id}
                  </p>
                </div>

                <div className="bg-[#f0f2f5]/85 p-4 rounded-2xl border border-[#d1d9e6]/60">
                  <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-[#1a1c1d]/60 select-none block">
                    {currentLocale === "hy" ? "Մենեջեր" : currentLocale === "ru" ? "Менеджер" : "Resp. Manager"}
                  </span>
                  <p className="text-xs font-bold text-[#1a1c1d] mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                    {order.manager || "Unassigned"}
                  </p>
                </div>
              </div>

              {/* ADVANCED ACTIVE STAGE DETAIL PANEL */}
              <div className="bg-[#f0f2f5] border border-[#ff2300]/30 rounded-[1.5rem] p-5 sm:p-6 text-left font-sans space-y-3 relative overflow-hidden shadow-xs">
                {/* Decorative glowing brand aura top right */}
                <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[#ff2300]/5 blur-xl pointer-events-none" />
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-[#ff2300] flex items-center gap-1.5 select-none bg-[#ff2300]/10 px-3 py-1 rounded-full border border-[#ff2300]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff2300] animate-pulse"></span>
                    {currentLocale === "hy" ? "ԸՆԹԱՑԻԿ ՓՈՒԼԻ ՄԱՆՐԱՄԱՍՆԵՐ" : currentLocale === "ru" ? "ДЕТАЛЬНЫЙ СТАТУС ТЕКУЩЕГО ЭТАПА" : "CURRENT STAGE DETAIL"}
                  </span>
                  
                  <span className="text-[9.5px] font-mono font-bold text-[#1a1c1d]/60 bg-[#e1e6ed] px-2.5 py-0.5 rounded uppercase">
                    Yerevan HQ
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-serif text-lg font-extrabold text-[#1a1c1d] uppercase tracking-wide">
                    {l[STATUSES.find(s => s.key === order.status)?.labelKey || "stage_new"]}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5B5B5B] leading-relaxed font-sans">
                    {STATUS_EXPLANATIONS[currentLocale]?.[order.status] || STATUS_EXPLANATIONS["hy"]?.[order.status] || "..."}
                  </p>
                </div>
              </div>

              {/* Overdue Warning Alert notice */}
              {(() => {
                const rawEstDate = order.estimatedCompletionDate ? new Date(order.estimatedCompletionDate) : null;
                const isOverdue = rawEstDate && rawEstDate.getTime() < Date.now() && order.status !== "Доставлен" && order.status !== "Готов";
                if (isOverdue) {
                  return (
                    <div className="bg-red-50 border border-red-250 text-red-800 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 animate-fadeIn text-left">
                      <AlertCircle size={16} className="text-red-700 shrink-0" />
                      <span>
                        {currentLocale === "hy" ? "Заказ требует дополнительного времени производства." : currentLocale === "ru" ? "Заказ требует дополнительного времени производства." : "The order requires additional production time."}
                      </span>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Progress Bar Container */}
              <div className="space-y-4 text-left select-none">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-bold text-[#1a1c1d] uppercase tracking-wider font-mono">
                    {l.progress_title}
                  </span>
                  <span className="text-[11px] font-mono font-black text-[#ff2300] bg-[#ff2300]/10 px-2.5 py-1 rounded border border-[#ff2300]/20">
                    {getCurrentStatusPercent(order.status)}%
                  </span>
                </div>

                {/* Progress bar nested container */}
                <div className="relative w-full h-3.5 bg-[#e1e6ed]/70 rounded-full overflow-hidden border border-white/80 shadow-[inset_1.5px_1.5px_3.5px_#D5CEBF]">
                  <div 
                    className="h-full bg-gradient-to-r from-[#ff2300] to-[#d91f00] rounded-full transition-all duration-1000 ease-out shadow-xs"
                    style={{ width: `${getCurrentStatusPercent(order.status)}%` }}
                  />
                </div>

                {/* Premium Percentage Indicator ticks */}
                <div className="flex justify-between text-[8px] font-mono font-bold text-[#727784] px-1 mt-1">
                  {["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"].map((pct) => (
                    <div key={pct} className="flex flex-col items-center">
                      <span className="w-[1.5px] h-1.5 bg-[#E2DEC5] mb-0.5" />
                      <span>{pct}</span>
                    </div>
                  ))}
                </div>

                {/* Vertical Stepper Timeline layout (Neumorphic responsive timeline) */}
                <div className="pt-3 grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {STATUSES.map((statusItem, idx) => {
                    const isDone = idx <= currentStatusIndex;
                    const isActive = idx === currentStatusIndex;
                    const Icon = statusItem.icon;
                    return (
                      <div 
                        key={statusItem.key}
                        className={`p-3.5 rounded-2xl border flex flex-col items-center text-center justify-center gap-1.5 transition-all ${
                          isActive 
                            ? "bg-[#ff2300]/10 border-[#ff2300]/45 text-[#ff2300] scale-[1.04] shadow-xs font-semibold"
                            : isDone
                              ? "bg-[#f0f2f5] border-[#ff2300]/20 text-[#ff2300]/80"
                              : "bg-[#f0f2f5]/40 border-[#d1d9e6]/50 text-[#727784] opacity-60"
                        }`}
                      >
                        <Icon size={15} className={`${isActive ? "animate-pulse stroke-[2.5]" : ""}`} />
                        <span className="text-[9px] font-sans font-bold leading-tight block uppercase tracking-wider">
                          {l[statusItem.labelKey]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Full Timeline History List */}
              <div className="bg-white border border-[#d1d9e6] rounded-3xl p-5 text-left font-sans space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-[#1a1c1d] flex items-center gap-1.5 select-none bg-[#e1e6ed]/40 px-3 py-1 rounded-full width-fit inline-flex">
                  📜 <span>{currentLocale === "hy" ? "Կատարման Պատմություն" : "Подробный таймлайн производства"}</span>
                </span>
                <div className="space-y-4 pt-2.5 pl-1.5">
                  {(order.statusHistory || []).map((step: any, sIdx: number) => (
                    <div key={sIdx} className="relative pl-5 border-l-[2px] border-[#ff2300]/30 last:border-transparent font-sans">
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-[#ff2300] -left-[6px] top-1 border-2 border-white shadow-xs" />
                      <div className="font-bold text-xs text-[#1a1c1d]">{step.status}</div>
                      <div className="text-[9.5px] text-[#727784] font-mono leading-tight mt-0.5 font-mono">
                        {new Date(step.timestamp || step.ts).toLocaleString(currentLocale === "hy" ? "hy-AM" : "ru-RU")}
                      </div>
                      {step.manager && step.manager !== "Unassigned" && (
                        <div className="text-[9px] text-[#ff2300] italic mt-0.5">
                          Manager: {step.manager}
                        </div>
                      )}
                    </div>
                  ))}
                  {(!order.statusHistory || order.statusHistory.length === 0) && (
                    <div className="relative pl-5 border-l-[2px] border-[#ff2300]/30">
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-[#ff2300] -left-[6px] top-1 border-2 border-white shadow-xs" />
                      <div className="font-bold text-xs text-[#1a1c1d]">Заказ создан</div>
                      <div className="text-[9.5px] text-[#727784] font-mono leading-tight mt-0.5 font-mono">
                        {new Date(order.ts).toLocaleString(currentLocale === "hy" ? "hy-AM" : "ru-RU")}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Artwork Design Preview & Approval Widget */}
              {order.artworkUrl && (
                <div className="bg-white border rounded-2xl p-4 text-left font-sans space-y-3">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#FF2300] flex items-center gap-1.5">
                    🎨 <span>{currentLocale === "hy" ? "Դիզայնի Մակետի Հաստատում" : "Утверждение макета дизайна"}</span>
                  </span>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {order.artworkUrl.match(/\.(jpeg|jpg|gif|png|webp)/i) ? (
                      <img src={order.artworkUrl} alt="Design Proof" className="w-20 h-20 object-cover border rounded-lg bg-white p-1 shrink-0" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 border rounded-lg flex flex-col items-center justify-center text-[#1a1c1d]/60 text-center text-[10px] p-2 shrink-0">
                        <span>Preview</span>
                        <a href={order.artworkUrl} target="_blank" rel="noreferrer" className="text-green-800 font-bold underline mt-1">Open File</a>
                      </div>
                    )}
                    <div className="flex-1 space-y-1">
                      <div className="text-xs font-bold text-gray-800">
                        {currentLocale === "hy" ? "Մակետի կարգավիճակը" : "Текущий статус макета"}:{" "}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.artworkStatus === "утвержден" ? "bg-green-100 text-green-850" :
                          order.artworkStatus === "на доработке" ? "bg-red-100 text-red-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>{order.artworkStatus || "ожидает"}</span>
                      </div>
                      <p className="text-[11px] text-[#1a1c1d]/60 leading-relaxed italic select-all font-sans">
                        {order.artworkComment || l.no_comment}
                      </p>
                    </div>
                  </div>

                  {order.artworkStatus !== "утвержден" && (
                    <div className="space-y-2 pt-2 border-t border-dashed">
                      <textarea
                        placeholder={currentLocale === "hy" ? "Գրեք Ձեր մեկնաբանությունը այստեղ..." : "Введите ваши комментарии или замечания по макету..."}
                        value={artworkComment}
                        onChange={(e) => setArtworkComment(e.target.value)}
                        className="w-full text-xs p-2.5 bg-gray-50 border rounded-xl outline-none"
                        rows={2}
                      />
                      {artworkStatusMsg && <div className="text-[10px] text-green-850 font-bold">{artworkStatusMsg}</div>}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleArtworkAction("approve")}
                          className="flex-1 bg-[#ff2300] hover:bg-[#e61f00] text-white font-bold py-2 px-3 text-[10px] rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                        >
                          ✓ {currentLocale === "hy" ? "Հաստատել" : "Утвердить макет"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleArtworkAction("reject")}
                          className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-3 text-[10px] rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                        >
                          ✗ {currentLocale === "hy" ? "Մերժել" : "На доработку"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Omnichannel notifications config */}
              <div className="bg-white border rounded-2xl p-4 text-left font-sans space-y-2">
                <div className="flex justify-between items-center select-none">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#FF2300] flex items-center gap-1.5">
                    🔔 <span>{currentLocale === "hy" ? "Ծանուցումներ" : "Оповещения по статусу заказа"}</span>
                  </span>
                  {notifStatusMsg && <span className="text-[9px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded animate-pulse">{notifStatusMsg}</span>}
                </div>
                <p className="text-[10px] text-[#727784] leading-relaxed">
                  {currentLocale === "hy" ? "Ակտիվացրեք փուլերի ավտոմատ իրազեկումը Ձեր հեռախոսին կամ էլփոստին" : "Проинформируем вас в секунду изменения статуса. Выберите удобный канал связи:"}
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
                  <label className="flex items-center gap-1.5 p-2 rounded-xl bg-gray-50/50 border hover:bg-gray-100/55 cursor-pointer text-[10px] font-bold select-none">
                    <input type="checkbox" checked={notifWhatsapp} onChange={(e) => handleToggleNotification("whatsapp", e.target.checked)} className="rounded text-[#ff2300] focus:ring-[#ff2300] transition" />
                    <span>WhatsApp</span>
                  </label>
                  <label className="flex items-center gap-1.5 p-2 rounded-xl bg-gray-50/50 border hover:bg-gray-100/55 cursor-pointer text-[10px] font-bold select-none">
                    <input type="checkbox" checked={notifEmail} onChange={(e) => handleToggleNotification("email", e.target.checked)} className="rounded text-[#ff2300] focus:ring-[#ff2300] transition" />
                    <span>Email</span>
                  </label>
                  <label className="flex items-center gap-1.5 p-2 rounded-xl bg-gray-50/50 border hover:bg-gray-100/55 cursor-pointer text-[10px] font-bold select-none">
                    <input type="checkbox" checked={notifTelegram} onChange={(e) => handleToggleNotification("telegram", e.target.checked)} className="rounded text-[#ff2300] focus:ring-[#ff2300] transition" />
                    <span>Telegram</span>
                  </label>
                </div>
              </div>

              {/* Order Files Center download container */}
              {order.files && order.files.length > 0 && (
                <div className="bg-white border rounded-2xl p-4 text-left font-sans space-y-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#FF2300] flex items-center gap-1.5 select-none">
                    📁 <span>{currentLocale === "hy" ? "Կցված Փաստաթղթեր" : "Документы и официальные файлы заказа"}</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {order.files.map((file: any) => (
                      <a
                        key={file.id}
                        href={file.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-xl border bg-gray-50 hover:bg-[#f0f2f5] border-gray-150 transition-all text-xs group"
                      >
                        <div className="truncate pr-1">
                          <span className="font-bold text-[9px] uppercase tracking-wider text-[#ff2300] bg-[#ff2300]/5 px-1.5 py-0.5 rounded border border-[#ff2300]/15 inline-block mb-1">
                            {file.fileType}
                          </span>
                          <div className="text-gray-700 font-bold truncate text-[11px]">{file.fileName}</div>
                        </div>
                        <Download size={14} className="text-[#FF2300] group-hover:scale-110 transition-transform shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer review sat rating */}
              {order.status === "Доставлен" && (
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50/30 border border-yellow-200 rounded-2xl p-4 text-left font-sans space-y-2.5">
                  <div className="flex items-center gap-1.5 text-yellow-850 font-bold text-xs select-none">
                    ⭐ <span>{currentLocale === "hy" ? "Պատվերի Գնահատում" : "Оценка выполнения вашего заказа"}</span>
                  </div>
                  {satisfactionRated ? (
                    <div className="text-xs text-yellow-905 italic font-medium leading-relaxed bg-white/60 p-2.5 rounded-xl border border-yellow-100 select-none">
                      ✓ {currentLocale === "hy" ? "Շնորհակալություն, Ձեր գնահատականը գրանցված է:" : "Ваш отзыв успешно сохранен. Благодарим вас за то, что помогаете нам становиться лучше!"}
                      {satisfactionComment && <p className="text-gray-700 font-normal mt-1.5 not-italic select-text">"{satisfactionComment}"</p>}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-[10px] text-[#1a1c1d]/60 leading-relaxed select-none">
                        {currentLocale === "hy" ? "Խնդրում ենք թողնել Ձեր գնահատականը:" : "Пожалуйста, выставите оценку от 1 до 5 звезд и напишите несколько слов о нашем сервисе:"}
                      </p>
                      <div className="flex gap-1.5 select-none">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setSatisfactionRating(star)}
                            className="focus:outline-none transition-transform hover:scale-115 text-2xl"
                          >
                            <span className={star <= satisfactionRating ? "text-amber-500 font-serif" : "text-gray-300 font-serif"}>★</span>
                          </button>
                        ))}
                      </div>
                      <textarea
                        placeholder={currentLocale === "hy" ? "Ձեր կարծիքը..." : "Ваши комментарии, отзывы или пожелания..."}
                        value={satisfactionComment}
                        onChange={(e) => setSatisfactionComment(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-yellow-200 rounded-xl outline-none"
                        rows={2}
                      />
                      {satisfactionStatusMsg && <div className="text-[10px] text-amber-900 font-bold select-none">{satisfactionStatusMsg}</div>}
                      <button
                        type="button"
                        disabled={satisfactionSubmitting}
                        onClick={handleSendSatisfactionReview}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {currentLocale === "hy" ? "Ուղարկել" : "Отправить"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Manager Comment Block */}
              <div className="bg-[#FF2300]/[0.03] border border-[#FF2300]/25/10 rounded-2xl p-4 text-left font-sans">
                <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-[#FF2300] flex items-center gap-1.5 select-none mb-2">
                  <MessageSquare size={12} />
                  <span>{l.last_comment}</span>
                </span>
                <p className="text-xs font-semibold leading-relaxed text-[#1a1c1d] select-all whitespace-pre-line">
                  {order.managerComment ? order.managerComment : <i>{l.no_comment}</i>}
                </p>
              </div>

              {/* Client Actions: Downloads & Contact */}
              <div className="border-t border-[#FF2300]/25/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* QR Code Container */}
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(
                      window.location.origin + "/track-order?code=" + order.trackingCode + "&phone=" + (phone || order.customerPhone || "")
                    )}`}
                    alt="Order QR Code"
                    className="w-16 h-16 border border-[#FF2300]/25/10 rounded-md bg-white p-1"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left font-sans">
                    <span className="text-[9px] font-mono font-bold text-[#FF2300] uppercase block">
                      {currentLocale === "hy" ? "ՈՒՂԻՂ ՀՂՈՒՄ" : currentLocale === "ru" ? "Прямая ссылка" : "Direct Tracking URL"}
                    </span>
                    <span className="text-[10px] text-[#414753]">
                      {currentLocale === "hy" ? "Սկանավորել QR" : currentLocale === "ru" ? "Сканируйте QR" : "Scan scan order tracker"}
                    </span>
                  </div>
                </div>

                {/* Buttons stack */}
                <div className="flex flex-wrap gap-2 w-full sm:w-auto font-sans">
                  {onReorder && (
                    <button
                      type="button"
                      onClick={() => onReorder(order)}
                      className="flex-1 sm:flex-initial bg-[#ff2300] hover:bg-[#e61f00] text-white text-[10px] px-3.5 py-2 font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
                    >
                      <Sparkles size={11} />
                      <span>{currentLocale === "hy" ? "Կրկնել Պատվերը" : "Повторить заказ"}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => downloadQuote(order)}
                    className="flex-1 sm:flex-initial bg-white hover:bg-[#FF2300]/5 text-[10px] px-3 py-2 border border-[#d1d9e6] hover:border-[#FF2300]/25/30 text-[#FF2300] font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
                  >
                    <Download size={12} />
                    <span>Quote PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadInvoice(order)}
                    className="flex-1 sm:flex-initial bg-white hover:bg-[#FF2300]/5 text-[10px] px-3 py-2 border border-[#d1d9e6] hover:border-[#FF2300]/25/30 text-[#FF2300] font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
                  >
                    <Download size={12} />
                    <span>Invoice</span>
                  </button>

                  <a
                    href={`https://wa.me/${order.managerPhone?.replace(/[^0-9]/g, "") || "37499000000"}?text=${encodeURIComponent(
                      `Hello/Привет! I am checking about order ${order.id} with tracking number ${order.trackingCode}. Please brief me on stages.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial bg-[#ff2300] hover:bg-[#e61f00] text-white text-[10px] px-4 py-2 font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
                  >
                    <MessageSquare size={12} />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>
          ) : (
            /* Standby Card when no order is active */
            <div className="h-full min-h-[300px] border-3 border-dashed border-[#d1d9e6] rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center select-none">
              <div className="w-16 h-16 rounded-full bg-[#FF2300]/5 text-[#FF2300]/60 flex items-center justify-center mb-4">
                <Compass size={28} className="animate-spin-slow" />
              </div>
              <h4 className="font-serif text-base font-bold text-[#7C8592] uppercase tracking-wider">
                {currentLocale === "hy" ? "Սպասում է Որոնման" :
                 currentLocale === "ru" ? "Ожидание ввода" :
                 currentLocale === "ar" ? "في انتظار البحث" :
                 "Awaiting search query..."}
              </h4>
              <p className="text-[10px] text-[#727784] max-w-sm mt-1.5">
                {currentLocale === "hy" ? "Մուտքագրեք պատվերի հետևման կոդը և հեռախոսահամարը ձախ կողմում՝ արտադրության փուլերը տեսնելու համար։" :
                 currentLocale === "ru" ? "Введите трекинг-код полученный в SMS/Email и ваш телефон слева для отслеживания стадий печати." :
                 currentLocale === "ar" ? "أدخل كود التتبع ورقم الهاتف في اللوحة الجانبية للتحقق من تفاصيل الإنتاج والشحن." :
                 "Enter your unique tracking code generated upon checkout together with your phone number."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
