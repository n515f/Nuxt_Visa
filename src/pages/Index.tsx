import { useEffect } from "react";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import FAQ from "@/components/FAQ";

type IndexProps = {
  language: "ar" | "en";
};

const Index = ({ language }: IndexProps) => {
  useEffect(() => {
    document.title = language === "ar" ? "الرئيسية — Nux.T" : "Home — Nux.T";
  }, [language]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate-in");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section id="home" className="reveal">
        <Hero language={language} />
      </section>

      {/* إعلانات الصفحة الرئيسية */}
      <section id="ads-home" className="reveal">
        <div className="container mx-auto px-4 py-6">
          <div className="ad-grid">
            <a
              href="/#services"
              className="ad-card"
              aria-label={language === "ar" ? "إعلان رئيسي 1" : "Home banner 1"}
            >
              <img
                src="/ads/home-banner-1.webp"
                loading="lazy"
                alt={language === "ar" ? "إعلان رئيسي 1" : "Home banner 1"}
                className="ad-image"
              />
            </a>
            <a
              href="/#process"
              className="ad-card"
              aria-label={language === "ar" ? "إعلان رئيسي 2" : "Home banner 2"}
            >
              <img
                src="/ads/home-banner-2.webp"
                loading="lazy"
                alt={language === "ar" ? "إعلان رئيسي 2" : "Home banner 2"}
                className="ad-image"
              />
            </a>
          </div>
        </div>
      </section>

      <section id="services" className="reveal">
        <div className="container mx-auto px-4 py-8">
          <Services language={language} />
        </div>
      </section>
      <section id="process" className="reveal">
        <div className="container mx-auto px-4 py-8">
          <Process language={language} />
        </div>
      </section>
      <section id="faq" className="reveal">
        <div className="container mx-auto px-4 py-8">
          <FAQ language={language} />
        </div>
      </section>
      {/* بإمكانك لاحقًا وضع قسم تواصل هنا إن أردت: id="contact" */}
    </main>
  );
};

export default Index;