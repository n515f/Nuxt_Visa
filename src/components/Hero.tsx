import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, MessageCircle, Phone } from "lucide-react";

interface HeroProps {
  language: "ar" | "en";
}

const Hero = ({ language }: HeroProps) => {
  const content = {
    ar: {
      title: "منصة ابو انس احترافية لإصدار التأشيرات والإقامات",
      subtitle: "واجهة عصرية، تفاعلات سلسة، وتجربة تلهم العملاء للبدء فورًا.",
      cta1: "محادثة واتساب",
      cta2: "طلب تواصل",
      features: ["سرعة المتابعة", "أسعار شفافة", "دعم فوري"],
    },
    en: {
      title: "Professional platform for visas & iqama",
      subtitle:
        "Modern UI, smooth interactions, and a delightful start experience.",
      cta1: "WhatsApp Chat",
      cta2: "Request Callback",
      features: ["Fast Processing", "Transparent Pricing", "Instant Support"],
    },
  };

  const currentContent = content[language];
  const isRTL = language === "ar";

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/20 blur-xl float" />
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-secondary/20 blur-xl float anim-delay-2000" />
        <div className="absolute bottom-32 left-1/4 w-20 h-20 rounded-full bg-accent/20 blur-xl float anim-delay-4000" />
        <div className="absolute bottom-20 right-1/3 w-28 h-28 rounded-full bg-[hsl(var(--primary-light))]/20 blur-xl float anim-delay-1000" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full pattern-grid" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 reveal animate-in">
            <span className="text-gradient">{currentContent.title}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto reveal animate-in anim-delay-200">
            {currentContent.subtitle}
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-10 reveal animate-in anim-delay-400">
            {currentContent.features.map((feature, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-surface/80 backdrop-blur-sm rounded-full border border-primary/20 text-sm font-medium"
              >
                {feature}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 reveal animate-in anim-delay-600">
            <Button
              size="lg"
              className="btn-nux group px-8 py-4 text-lg"
              onClick={() => window.open("https://wa.me/966500000000", "_blank")}
            >
              <MessageCircle className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`} />
              {currentContent.cta1}
              {isRTL ? (
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              ) : (
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>

            <Button variant="outline" size="lg" className="btn-ghost-nux px-8 py-4 text-lg">
              <Phone className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`} />
              {currentContent.cta2}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal animate-in anim-delay-800">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">500+</div>
              <div className="text-muted-foreground">
                {language === "ar" ? "تأشيرة مكتملة" : "Completed Visas"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">24/7</div>
              <div className="text-muted-foreground">
                {language === "ar" ? "دعم مستمر" : "Support Available"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">98%</div>
              <div className="text-muted-foreground">
                {language === "ar" ? "معدل النجاح" : "Success Rate"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
