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