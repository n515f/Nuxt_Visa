// src/pages/Contact.tsx — FINAL (Cards + Ticket submit + Map + i18n + reacts to header toggle)
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send, MessageSquare, Instagram, Facebook } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { apiTicketCreate } from "@/lib/api";

type Lang = "ar" | "en";

const detectLang = (): Lang => {
  try {
    const saved = localStorage.getItem("app_language");
    return saved === "en" ? "en" : "ar";
  } catch {
    return "ar";
  }
};

const i18n = {
  ar: {
    title: "يسعدنا تواصلك",
    breadcrumbHome: "الرئيسية",
    breadcrumbContact: "تواصل معنا",
    subtitle: "ارسل رسالتك وسنعود إليك سريعًا، أو استخدم بيانات التواصل المباشرة.",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "رقم الجوال",
    subject: "الموضوع",
    message: "نص الرسالة",
    placeholderName: "اكتب اسمك الكامل",
    placeholderEmail: "name@example.com",
    placeholderPhone: "05xxxxxxxx",
    placeholderSubject: "موضوع الرسالة",
    placeholderMessage: "اكتب رسالتك هنا…",
    send: "إرسال",
    sending: "جاري الإرسال…",
    privacy: "بالضغط على “إرسال” فأنت توافق على سياسة الخصوصية.",
    contactInfo: "معلومات الاتصال",
    followUs: "تابعنا على قنواتنا:",
    viewPrivacy: "عرض سياسة الخصوصية",
    toastMissing: "الاسم والبريد والرسالة مطلوبة",
    toastSent: (id: number) => `تم إنشاء تذكرتك بنجاح — رقم التذكرة: ${id}`,
    toastFail: "فشل الإرسال",
    cardsTitle: "قنواتنا",
    openMap: "افتح الخريطة",
    address: "الرياض، المملكة العربية السعودية",
    pageTitle: "تواصل معنا — Nux.T",
  },
  en: {
    title: "We’d love to hear from you",
    breadcrumbHome: "Home",
    breadcrumbContact: "Contact",
    subtitle: "Send us a message and we’ll get back to you shortly, or use direct contacts.",
    fullName: "Full name",
    email: "Email",
    phone: "Phone",
    subject: "Subject",
    message: "Message",
    placeholderName: "Write your full name",
    placeholderEmail: "name@example.com",
    placeholderPhone: "+9665xxxxxxx",
    placeholderSubject: "Message subject",
    placeholderMessage: "Write your message…",
    send: "Send",
    sending: "Sending…",
    privacy: "By clicking “Send”, you agree to our Privacy Policy.",
    contactInfo: "Contact info",
    followUs: "Follow us:",
    viewPrivacy: "View privacy policy",
    toastMissing: "Name, email and message are required",
    toastSent: (id: number) => `Ticket created successfully — ID: ${id}`,
    toastFail: "Failed to send",
    cardsTitle: "Our channels",
    openMap: "Open map",
    address: "Riyadh, Saudi Arabia",
    pageTitle: "Contact — Nux.T",
  },
} as const;

type SocialCard = {
  id: "x" | "instagram" | "facebook" | "whatsapp" | "email";
  label: string;
  handle: string;
  href: string; // ضَع هنا رابط ملفك/حسابك الحقيقي
  gradientFrom: string;
  gradientTo: string;
  icon: React.ReactNode;
};

// ⚠️ عدّل الحقول href/handle أدناه لحساباتك الفعلية:
const socials: SocialCard[] = [
  {
    id: "x",
    label: "X (Twitter)",
    handle: "@nuxtvisa",
    href: "https://x.com/YOUR_HANDLE", // عدّل
    gradientFrom: "from-slate-900",
    gradientTo: "to-slate-600",
    icon: <span className="text-2xl font-black">𝕏</span>,
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "@nuxtvisa",
    href: "https://instagram.com/YOUR_HANDLE", // عدّل
    gradientFrom: "from-fuchsia-600",
    gradientTo: "to-amber-400",
    icon: <Instagram className="h-5 w-5" />,
  },
  {
    id: "facebook",
    label: "Facebook",
    handle: "nuxtvisa",
    href: "https://facebook.com/YOUR_PAGE", // عدّل
    gradientFrom: "from-blue-600",
    gradientTo: "to-sky-400",
    icon: <Facebook className="h-5 w-5" />,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    handle: "+9665xxxxxxxx",
    href: "https://wa.me/9665XXXXXXX?text=Hello%20NuxtVisa", // عدّل رقمك ونص الرسالة
    gradientFrom: "from-emerald-600",
    gradientTo: "to-lime-500",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    id: "email",
    label: "Email",
    handle: "support@example.com",
    href: "mailto:support@example.com", // عدّل
    gradientFrom: "from-emerald-600",
    gradientTo: "to-teal-400",
    icon: <Mail className="h-5 w-5" />,
  },
];

export default function Contact() {
  const [lang, setLang] = useState<Lang>(() => detectLang());
  const t = useMemo(() => i18n[lang], [lang]);

  // التزامن مع زر الهيدر:
  // - عبر localStorage (لو تغيّر من تبويب آخر)
  // - وعبر حدث مخصّص "app_language_changed" (لو بثّه الهيدر بعد التبديل)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "app_language") {
        setLang(e.newValue === "en" ? "en" : "ar");
      }
    };
    const onCustom = (e: Event) => {
      try {
        const detail = (e as CustomEvent<{ lang?: Lang }>).detail;
        if (detail?.lang) setLang(detail.lang);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("app_language_changed", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("app_language_changed", onCustom as EventListener);
    };
  }, []);

  // ترويسة وعناصر HTML حسب اللغة
  useEffect(() => {
    document.title = t.pageTitle;
    const html = document.documentElement;
    html.dir = lang === "ar" ? "rtl" : "ltr";
    html.lang = lang;
  }, [lang, t.pageTitle]);

  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("fullName") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const subject = String(fd.get("subject") ?? "").trim() || (lang === "ar" ? "تواصل معنا" : "Contact us");
    const message = String(fd.get("message") ?? "").trim();

    if (!name || !email || !message) {
      toast({
        title: lang === "ar" ? "تنبيه" : "Notice",
        description: t.toastMissing,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // نرسل كنص تذكرة للباك-إند (بديل Endpoint غير موجود لـ /contacts)
      const content =
        (lang === "ar"
          ? `مرسل من صفحة تواصل:\nالاسم: ${name}\nالبريد: ${email}\nالجوال: ${phone}\n\n${message}`
          : `Sent from Contact page:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`);
      const res = await apiTicketCreate({ subject, content });
      toast({ title: "✅", description: t.toastSent(res.ticket_id) });
      e.currentTarget.reset();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected error";
      toast({ title: t.toastFail, description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  const companyAddress = t.address;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(companyAddress)}&output=embed`;
  const mapOpen = `https://www.google.com/maps?q=${encodeURIComponent(companyAddress)}`;

  return (
    <div className="min-h-[60vh]">
      {/* محتوى مركز: البانر + بطاقات التواصل + الخريطة */}
      <section className="container mx-auto px-4 pt-28 pb-24">
        {/* بانر الإعلان */}
        <div className="ad-banner mb-6">
          <img
            src="/ads/contact-banner-1.webp"
            loading="lazy"
            alt={lang === "ar" ? "إعلان تواصل معنا" : "Contact banner"}
            className="ad-image"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* بطاقات التواصل */}
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 md:p-8 space-y-4">
            <p className="text-sm font-medium mb-3">{t.cardsTitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative overflow-hidden rounded-xl border border-border/60 p-4 bg-background/60 ad-card"
                  aria-label={s.label}
                >
                  <div className="relative flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm opacity-80">{s.label}</span>
                      <span className="font-semibold">{s.handle}</span>
                    </div>
                    <div
                      className="grid place-items-center w-10 h-10 rounded-full bg-white/10 backdrop-blur text-white"
                      aria-hidden="true"
                      title={s.label}
                    >
                      {s.icon}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* الخريطة */}
          <div className="rounded-2xl overflow-hidden border border-border/60 bg-card/40">
            <div className="aspect-video">
              <iframe
                title="Company map"
                src={mapSrc}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="p-3 text-right">
              <a
                href={mapOpen}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {t.openMap}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
