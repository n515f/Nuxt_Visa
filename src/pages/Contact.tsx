import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  useEffect(() => {
    document.title = "تواصل معنا — Nux.T";
  }, []);

  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // واجهة فقط — هنا مكان استدعاء API لاحقًا
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setSent(true);
    setLoading(false);
    e.currentTarget.reset();
  };

  return (
    <div className="min-h-[70vh]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 pt-28 pb-8">
          <nav className="text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground">الرئيسية</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">تواصل معنا</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            يسعدنا تواصلك
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            ارسل رسالتك وسنعود إليك سريعًا، أو استخدم بيانات التواصل المباشرة.
          </p>
        </div>
      </section>

      {/* محتوى */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* فورم */}
          <form
            onSubmit={handleSubmit}
            className="md:col-span-3 rounded-2xl border border-border/60 bg-card/40 p-6 md:p-8 space-y-4"
            noValidate
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm mb-1">الاسم الكامل</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="اكتب اسمك الكامل"
                  title="الاسم الكامل"
                  autoComplete="name"
                  required
                  className="w-full rounded-md bg-background border border-border px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm mb-1">البريد الإلكتروني</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  title="البريد الإلكتروني"
                  autoComplete="email"
                  required
                  className="w-full rounded-md bg-background border border-border px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm mb-1">رقم الجوال</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="05xxxxxxxx"
                  title="رقم الجوال"
                  autoComplete="tel"
                  className="w-full rounded-md bg-background border border-border px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm mb-1">الموضوع</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="موضوع الرسالة"
                  title="الموضوع"
                  className="w-full rounded-md bg-background border border-border px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm mb-1">نص الرسالة</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="اكتب رسالتك هنا…"
                title="نص الرسالة"
                required
                className="w-full rounded-md bg-background border border-border px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-label="إرسال الرسالة"
              className="rounded-md px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 transition inline-flex items-center gap-2 disabled:opacity-60"
            >
              {loading ? "جاري الإرسال…" : "إرسال"}
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>

            <p
              className="text-sm text-green-600 mt-2 min-h-[1.25rem]"
              aria-live="polite"
              role="status"
            >
              {sent ? "تم إرسال رسالتك بنجاح. سنعود إليك قريبًا." : ""}
            </p>
          </form>

          {/* معلومات الاتصال */}
          <aside className="md:col-span-2 rounded-2xl border border-border/60 bg-card/40 p-6 md:p-8 space-y-4">
            <h3 className="font-semibold mb-2">معلومات الاتصال</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>support@example.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>0500000000</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-border/60">
              <p className="text-xs text-muted-foreground">
                بالضغط على “إرسال” فأنت توافق على سياسة الخصوصية.
              </p>
              <Link to="/#privacy" className="text-xs text-primary hover:underline">
                عرض سياسة الخصوصية
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
