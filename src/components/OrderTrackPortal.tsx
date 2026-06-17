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
        triggerAutoSearch(codeParam, phoneParam);
      }
    }
  }, []);

  const triggerAutoSearch = async (code: string, phoneNumber: string) => {
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingCode: code, phone: phoneNumber })
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
    if (!trackingCode.trim() || !phone.trim()) return;
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingCode: trackingCode.trim(), phone: phone.trim() })
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
    <div style="text-align: right; font-size: 12px;"><strong>Capsule Concept</strong></div>
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
  <div class="branding">Capsule Concept ERP Automation System - Yerevan, RA</div>
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
    <div style="text-align: right; font-size: 12px;"><strong>Capsule Concept</strong></div>
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
  <div class="branding">Capsule Concept ERP Automation System - Yerevan, RA</div>
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
      {/* Brand Back Navigation */}
      <button 
        onClick={onBackToHome}
        className="group mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-capsule-accent hover:text-capsule-dark-secondary cursor-pointer select-none transition-colors"
      >
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
        <span>{l.btn_back}</span>
      </button>

      {/* Header and Portal Title */}
      <div className="text-center space-y-3 mb-10 select-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-capsule-accent/15 border border-white/60 rounded-full font-mono text-[10px] font-bold text-capsule-accent uppercase tracking-widest">
          <Sparkles size={12} className="animate-pulse" />
          <span>Capsule Concept Studio</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-capsule-accent uppercase tracking-widest leading-snug">
          {l.portal_title}
        </h1>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-capsule-text-secondary leading-relaxed font-sans">
          {l.portal_sub}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Hand: Tracking Form Search Panel */}
        <div className="md:col-span-5 bg-[#FAFAF8] border-3 border-white rounded-[2rem] p-6 sm:p-8 shadow-[4px_4px_10px_#D5D0C8,_-4px_-4px_10px_#FFFFFF] relative space-y-6">
          <form onSubmit={handleSearch} className="space-y-5">
            {/* Tracking Code Field */}
            <div className="space-y-1.5 text-left">
              <label className="block text-[9px] font-bold text-capsule-accent uppercase tracking-wider font-mono">
                {l.tracking_code_label}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={l.tracking_code_placeholder}
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                  className="w-full bg-capsule-surf border border-capsule-accent/15 rounded-xl py-3 px-4 text-xs font-bold text-capsule-dark uppercase tracking-widest outline-none focus:border-capsule-accent/40 focus:ring-1 focus:ring-capsule-accent/40"
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="space-y-1.5 text-left">
              <label className="block text-[9px] font-bold text-capsule-accent uppercase tracking-wider font-mono">
                {l.phone_label}
              </label>
              <input
                type="text"
                required
                placeholder={l.phone_placeholder}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-capsule-surf border border-capsule-accent/15 rounded-xl py-3 px-4 text-xs font-bold text-capsule-dark outline-none focus:border-capsule-accent/40 focus:ring-1 focus:ring-capsule-accent/40"
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

        {/* Right Hand: Order Details Display */}
        <div className="md:col-span-7 space-y-6">
          {order ? (
            <div className="bg-[#FAFAF8] border-3 border-white rounded-[2rem] p-6 sm:p-8 shadow-[4px_4px_10px_#D5D0C8,_-4px_-4px_10px_#FFFFFF] relative space-y-6 animate-[fadeIn_0.5s_ease_out]">
              
              {/* Card Header & Status Ribbon */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-capsule-accent/10 pb-4 gap-4 text-left">
                <div>
                  <span className="text-[10px] text-green-700 font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1 select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-700 animate-pulse"></span>
                    {l.order_found}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-capsule-accent uppercase tracking-wide">
                    {l.order_number}: <span className="font-sans font-extrabold">{order.id}</span>
                  </h3>
                </div>

                <button
                  onClick={() => handleCopyId(order.id)}
                  className="bg-white hover:bg-capsule-accent/5 transition-all text-capsule-accent border border-capsule-accent/15 hover:border-capsule-accent/30 rounded-xl px-3 py-1.5 font-bold font-mono text-[9px] uppercase cursor-pointer select-none flex items-center gap-1.5"
                >
                  {copied ? <Check size={11} className="stroke-[3.5] text-green-700" /> : <Copy size={11} />}
                  <span>{copied ? l.copy_success : l.copy_code}</span>
                </button>
              </div>

              {/* Grid Specifications info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left font-sans">
                <div className="bg-capsule-surf/40 rounded-xl p-3 border border-capsule-accent/5">
                  <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-capsule-text-muted select-none block">
                    {l.created_at}
                  </span>
                  <p className="text-xs font-bold text-capsule-dark mt-0.5">
                    {new Date(order.ts).toLocaleDateString(currentLocale === "hy" ? "hy-AM" : currentLocale === "ru" ? "ru-RU" : "en-US", {
                      year: "numeric", month: "short", day: "numeric"
                    })}
                  </p>
                </div>

                <div className="bg-capsule-surf/40 rounded-xl p-3 border border-capsule-accent/5 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-capsule-text-muted select-none block">
                      {l.est_ready}
                    </span>
                    <p className="text-xs font-black text-green-800 mt-0.5 flex items-center gap-1">
                      <Clock size={12} className="inline mr-1 shrink-0" />
                      <span>
                        {order.estimatedCompletionDate 
                          ? new Date(order.estimatedCompletionDate).toLocaleDateString(currentLocale === "hy" ? "hy-AM" : currentLocale === "ru" ? "ru-RU" : "en-US", { year: "numeric", month: "long", day: "numeric" })
                          : (order.expectedReadyTs || getExpectedReadyDate(order.ts))}
                      </span>
                    </p>
                  </div>
                  {order.estimatedCompletionUpdatedAt && (
                    <div className="mt-1.5 pt-1.5 border-t border-[#ff2300]/10 text-[9px] text-[#78716c] font-sans">
                      <span className="font-bold">
                        {currentLocale === "hy" ? "Վերջին թարմացումը:" : currentLocale === "ru" ? "Последнее обновление:" : "Last Update:"}
                      </span>{" "}
                      {new Date(order.estimatedCompletionUpdatedAt).toLocaleDateString(currentLocale === "hy" ? "hy-AM" : currentLocale === "ru" ? "ru-RU" : "en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </div>
                  )}
                </div>

                <div className="bg-capsule-surf/40 rounded-xl p-3 border border-capsule-accent/5">
                  <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-capsule-text-muted select-none block">
                    {l.product_type}
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-widest text-capsule-dark mt-0.5">
                    {order.type}
                  </p>
                </div>

                <div className="bg-capsule-surf/40 rounded-xl p-3 border border-capsule-accent/5">
                  <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-capsule-text-muted select-none block">
                    {l.qty}
                  </span>
                  <p className="text-xs font-bold text-capsule-dark mt-0.5">
                    {order.qty.toLocaleString()} {order.type === "ribbons" ? (currentLocale === "hy" ? "մետր" : "м") : (currentLocale === "hy" ? "հատ" : "шт")}
                  </p>
                </div>

                <div className="bg-capsule-surf/40 rounded-xl p-3 border border-capsule-accent/5">
                  <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-capsule-text-muted select-none block">
                    {currentLocale === "hy" ? "Հետևման Կոդ" : currentLocale === "ru" ? "Код отслеживания" : "Tracking Code"}
                  </span>
                  <p className="text-xs font-mono font-black text-green-800 mt-0.5 tracking-wider uppercase">
                    {order.trackingCode || "N/A"}
                  </p>
                </div>

                <div className="bg-capsule-surf/40 rounded-xl p-3 border border-capsule-accent/5">
                  <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-capsule-text-muted select-none block">
                    {currentLocale === "hy" ? "Մենեջեր" : currentLocale === "ru" ? "Менеджер" : "Resp. Manager"}
                  </span>
                  <p className="text-xs font-bold text-capsule-dark mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                    {order.manager || "Unassigned"}
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
              <div className="space-y-3.5 text-left select-none">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-bold text-capsule-accent uppercase tracking-wider font-mono">
                    {l.progress_title}
                  </span>
                  <span className="text-xs font-mono font-black text-green-800 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    {getCurrentStatusPercent(order.status)}%
                  </span>
                </div>

                {/* Progress bar nested container */}
                <div className="relative w-full h-3 bg-capsule-border/60 rounded-full overflow-hidden border border-white/80 shadow-[inset_1.5px_1.5px_3px_#C2BAB0]">
                  <div 
                    className="h-full bg-gradient-to-r from-green-800 to-green-700 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${getCurrentStatusPercent(order.status)}%` }}
                  />
                </div>

                {/* Premium Percentage Indicator ticks */}
                <div className="flex justify-between text-[8px] font-mono font-bold text-capsule-text-muted px-1 mt-1">
                  {["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"].map((pct) => (
                    <div key={pct} className="flex flex-col items-center">
                      <span className="w-[1.5px] h-1.5 bg-[#D5D3CC] mb-0.5" />
                      <span>{pct}</span>
                    </div>
                  ))}
                </div>

                {/* Vertical Stepper Timeline layout (Neumorphic responsive timeline) */}
                <div className="pt-2 grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {STATUSES.map((statusItem, idx) => {
                    const isDone = idx <= currentStatusIndex;
                    const isActive = idx === currentStatusIndex;
                    const Icon = statusItem.icon;
                    return (
                      <div 
                        key={statusItem.key}
                        className={`p-2.5 rounded-xl border flex flex-col items-center text-center justify-center gap-1 transition-all ${
                          isActive 
                            ? "bg-green-700/10 border-green-700/30 text-green-800 scale-[1.04]"
                            : isDone
                              ? "bg-[#FAFAF9] border-green-700/10 text-green-700"
                              : "bg-[#FAFAF9]/40 border-[#E5E3DF]/50 text-capsule-text-muted opacity-60"
                        }`}
                      >
                        <Icon size={14} className={`${isActive ? "animate-pulse stroke-[2.5]" : ""}`} />
                        <span className="text-[8.5px] font-sans font-bold leading-tight block">
                          {l[statusItem.labelKey]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Full Timeline History List */}
              <div className="bg-white border rounded-2xl p-4 text-left font-sans space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-capsule-accent flex items-center gap-1.5 select-none">
                  📜 <span>{currentLocale === "hy" ? "Կատարման Պատմություն" : "Подробный таймлайн производства"}</span>
                </span>
                <div className="space-y-3 pt-1.5 pl-1.5">
                  {(order.statusHistory || []).map((step: any, sIdx: number) => (
                    <div key={sIdx} className="relative pl-4 border-l-2 border-green-800/40">
                      <div className="absolute w-2 h-2 rounded-full bg-green-800 -left-[5px] top-1" />
                      <div className="font-bold text-xs text-capsule-dark">{step.status}</div>
                      <div className="text-[9.5px] text-capsule-text-muted font-mono leading-tight">
                        {new Date(step.timestamp || step.ts).toLocaleString(currentLocale === "hy" ? "hy-AM" : "ru-RU")}
                      </div>
                      {step.manager && step.manager !== "Unassigned" && (
                        <div className="text-[9px] text-[#7C9082] italic">
                          Manager: {step.manager}
                        </div>
                      )}
                    </div>
                  ))}
                  {(!order.statusHistory || order.statusHistory.length === 0) && (
                    <div className="relative pl-4 border-l-2 border-green-800/40">
                      <div className="absolute w-2 h-2 rounded-full bg-green-800 -left-[5px] top-1" />
                      <div className="font-bold text-xs text-capsule-dark">Заказ создан</div>
                      <div className="text-[9.5px] text-capsule-text-muted font-mono leading-tight">
                        {new Date(order.ts).toLocaleString(currentLocale === "hy" ? "hy-AM" : "ru-RU")}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Artwork Design Preview & Approval Widget */}
              {order.artworkUrl && (
                <div className="bg-white border rounded-2xl p-4 text-left font-sans space-y-3">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-capsule-accent flex items-center gap-1.5">
                    🎨 <span>{currentLocale === "hy" ? "Դիզայնի Մակետի Հաստատում" : "Утверждение макета дизайна"}</span>
                  </span>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {order.artworkUrl.match(/\.(jpeg|jpg|gif|png|webp)/i) ? (
                      <img src={order.artworkUrl} alt="Design Proof" className="w-20 h-20 object-cover border rounded-lg bg-white p-1 shrink-0" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 border rounded-lg flex flex-col items-center justify-center text-[#3D271B]/60 text-center text-[10px] p-2 shrink-0">
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
                      <p className="text-[11px] text-[#3D271B]/60 leading-relaxed italic select-all font-sans">
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
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-capsule-accent flex items-center gap-1.5">
                    🔔 <span>{currentLocale === "hy" ? "Ծանուցումներ" : "Оповещения по статусу заказа"}</span>
                  </span>
                  {notifStatusMsg && <span className="text-[9px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded animate-pulse">{notifStatusMsg}</span>}
                </div>
                <p className="text-[10px] text-capsule-text-muted leading-relaxed">
                  {currentLocale === "hy" ? "Ակտիվացրեք փուլերի ավտոմատ իրազեկումը Ձեր հեռախոսին կամ էլփոստին" : "Проинформируем вас в секунду изменения статуса. Выберите удобный канал связи:"}
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
                  <label className="flex items-center gap-1.5 p-2 rounded-xl bg-gray-50/50 border hover:bg-gray-100/55 cursor-pointer text-[10px] font-bold select-none">
                    <input type="checkbox" checked={notifWhatsapp} onChange={(e) => handleToggleNotification("whatsapp", e.target.checked)} className="rounded text-green-700 focus:ring-green-700 transition" />
                    <span>WhatsApp</span>
                  </label>
                  <label className="flex items-center gap-1.5 p-2 rounded-xl bg-gray-50/50 border hover:bg-gray-100/55 cursor-pointer text-[10px] font-bold select-none">
                    <input type="checkbox" checked={notifEmail} onChange={(e) => handleToggleNotification("email", e.target.checked)} className="rounded text-green-700 focus:ring-green-700 transition" />
                    <span>Email</span>
                  </label>
                  <label className="flex items-center gap-1.5 p-2 rounded-xl bg-gray-50/50 border hover:bg-gray-100/55 cursor-pointer text-[10px] font-bold select-none">
                    <input type="checkbox" checked={notifTelegram} onChange={(e) => handleToggleNotification("telegram", e.target.checked)} className="rounded text-green-700 focus:ring-green-700 transition" />
                    <span>Telegram</span>
                  </label>
                </div>
              </div>

              {/* Order Files Center download container */}
              {order.files && order.files.length > 0 && (
                <div className="bg-white border rounded-2xl p-4 text-left font-sans space-y-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-capsule-accent flex items-center gap-1.5 select-none">
                    📁 <span>{currentLocale === "hy" ? "Կցված Փաստաթղթեր" : "Документы и официальные файлы заказа"}</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {order.files.map((file: any) => (
                      <a
                        key={file.id}
                        href={file.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-xl border bg-gray-50 hover:bg-[#FAF9F6] border-gray-150 transition-all text-xs group"
                      >
                        <div className="truncate pr-1">
                          <span className="font-bold text-[9px] uppercase tracking-wider text-green-800 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 inline-block mb-1">
                            {file.fileType}
                          </span>
                          <div className="text-gray-700 font-bold truncate text-[11px]">{file.fileName}</div>
                        </div>
                        <Download size={14} className="text-capsule-accent group-hover:scale-110 transition-transform shrink-0" />
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
                      <p className="text-[10px] text-[#3D271B]/60 leading-relaxed select-none">
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
              <div className="bg-capsule-accent/[0.03] border border-capsule-accent/10 rounded-2xl p-4 text-left font-sans">
                <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-capsule-accent flex items-center gap-1.5 select-none mb-2">
                  <MessageSquare size={12} />
                  <span>{l.last_comment}</span>
                </span>
                <p className="text-xs font-semibold leading-relaxed text-capsule-dark select-all whitespace-pre-line">
                  {order.managerComment ? order.managerComment : <i>{l.no_comment}</i>}
                </p>
              </div>

              {/* Client Actions: Downloads & Contact */}
              <div className="border-t border-capsule-accent/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* QR Code Container */}
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(
                      window.location.origin + "/track-order?code=" + order.trackingCode + "&phone=" + (phone || order.customerPhone || "")
                    )}`}
                    alt="Order QR Code"
                    className="w-16 h-16 border border-capsule-accent/10 rounded-md bg-white p-1"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left font-sans">
                    <span className="text-[9px] font-mono font-bold text-capsule-accent uppercase block">
                      {currentLocale === "hy" ? "ՈՒՂԻՂ ՀՂՈՒՄ" : currentLocale === "ru" ? "Прямая ссылка" : "Direct Tracking URL"}
                    </span>
                    <span className="text-[10px] text-capsule-text-secondary">
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
                    className="flex-1 sm:flex-initial bg-white hover:bg-capsule-accent/5 text-[10px] px-3 py-2 border border-[#E0DCD4] hover:border-capsule-accent/30 text-capsule-accent font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
                  >
                    <Download size={12} />
                    <span>Quote PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadInvoice(order)}
                    className="flex-1 sm:flex-initial bg-white hover:bg-capsule-accent/5 text-[10px] px-3 py-2 border border-[#E0DCD4] hover:border-capsule-accent/30 text-capsule-accent font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
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
            <div className="h-full min-h-[300px] border-3 border-dashed border-[#E5E3DF] rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center select-none">
              <div className="w-16 h-16 rounded-full bg-capsule-accent/5 text-capsule-accent/60 flex items-center justify-center mb-4">
                <Compass size={28} className="animate-spin-slow" />
              </div>
              <h4 className="font-serif text-base font-bold text-[#7C8592] uppercase tracking-wider">
                {currentLocale === "hy" ? "Սպասում է Որոնման" :
                 currentLocale === "ru" ? "Ожидание ввода" :
                 currentLocale === "ar" ? "في انتظار البحث" :
                 "Awaiting search query..."}
              </h4>
              <p className="text-[10px] text-capsule-text-muted max-w-sm mt-1.5">
                {currentLocale === "hy" ? "Մուտքագրեք պատվերի հետևման կոդը և հեռախոսահամարը ձախ կողմում՝ արտադրության փուլերը տեսնելու համար։" :
                 currentLocale === "ru" ? "Введите трекинг-код полученный в SMS/Email и ваш телефон слева для отслеживания стадий печати." :
                 currentLocale === "ar" ? "أدخل كود التتبع ورقم الهاتف في اللوحة الجانبية للتحقق من تفاصيل الإنتاج والشحن." :
                 "Enter your unique tracking code generated upon checkout together with your phone number."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
