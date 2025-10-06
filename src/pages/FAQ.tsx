import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FAQSection from "../components/FAQ";
import { Search } from "lucide-react";

type PageProps = { language: "ar" | "en" };

export default function FAQ({ language }: PageProps) {
  useEffect(() => {
    document.title = language === "ar" ? "الأسئلة الشائعة — Nux.T" : "FAQ — Nux.T";
  }, [language]);

  const [q, setQ] = useState("");

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
            <span className="text-foreground">{language === "ar" ? "الأسئلة الشائعة" : "FAQ"}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            {language === "ar" ? "كل ما تريد معرفته" : "Everything you need to know"}
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            {language === "ar"
              ? "اطّلع على الإجابات الأكثر شيوعًا — وإن لم تجد سؤالك، راسلنا."
              : "Browse our most common answers — and contact us if you need more."}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-4 md:p-6 mb-6">
          <div className="relative max-w-xl">
            <Search className="h-4 w-4 absolute top-1/2 -translate-y-1/2 right-3 opacity-70" />
            <input
              className="w-full rounded-md bg-background border border-border pl-3 pr-10 py-2 outline-none focus:ring-2 focus:ring-primary/40"
              placeholder={language === "ar" ? "ابحث داخل الأسئلة…" : "Search in questions…"}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q && (
              <p className="text-xs text-muted-foreground mt-2">
                {language === "ar"
                  ? "هذا الحقل تجميلي — لدمجه فعليًا نحتاج دعم بحث داخل FAQSection."
                  : "This is a cosmetic field — real search needs support inside FAQSection."}
              </p>
            )}
          </div>
        </div>

        {/* ✅ تمرير اللغة */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-4 md:p-6">
          <FAQSection language={language} />
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            {language === "ar" ? "لم تجد إجابتك؟" : "Didn’t find your answer?"}{" "}
            <Link to="/contact" className="text-primary hover:underline">
              {language === "ar" ? "تواصل معنا" : "Contact us"}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}