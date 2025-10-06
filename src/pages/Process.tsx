// src/pages/Process.tsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import ProcessSection from "../components/Process";
import { CheckCircle2, ArrowRight } from "lucide-react";

type PageProps = { language: "ar" | "en" };

export default function Process({ language }: PageProps) {
  useEffect(() => {
    document.title = language === "ar" ? "كيف نعمل — Nux.T" : "How We Work — Nux.T";
  }, [language]);

  return (
    <div className="min-h-[70vh]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 pt-28 pb-8">
          <nav className="text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground">
              {language === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">
              {language === "ar" ? "كيف نعمل" : "How We Work"}
            </span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            {language === "ar" ? "خطوات واضحة… نتائج دقيقة" : "Clear Steps, Precise Outcomes"}
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            {language === "ar"
              ? "من أول استشارة إلى استلام التأشيرة — مسار شفاف ومتابعة مستمرة."
              : "From the first consult to visa issuance — transparent, continuous updates."}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-4 md:p-6">
          <ProcessSection language={language} />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {(language === "ar"
            ? ["استشارة مجانية أولية", "تدقيق مستندات احترافي", "تحديثات فورية على الحالة"]
            : ["Free initial consult", "Pro document review", "Instant status updates"]
          ).map((txt) => (
            <div key={txt} className="rounded-xl border border-border/60 bg-background p-4 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm">{txt}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-muted-foreground">
            {language === "ar"
              ? "جاهز تبدأ؟ ارسل لنا بياناتك وسنرتّب جلسة استشارية قصيرة."
              : "Ready to start? Send your info and we’ll arrange a short consult."}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            {language === "ar" ? "ابدأ الآن" : "Get started"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
