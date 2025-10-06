import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQProps {
  language: "ar" | "en";
}

const FAQ = ({ language }: FAQProps) => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const content = {
    ar: {
      title: "الأسئلة الشائعة",
      subtitle: "إجابات على أكثر الأسئلة تكراراً حول خدماتنا",
      faqs: [
        {
          question: "كم يستغرق إصدار تأشيرة العمل؟",
          answer:
            "عادة ما يستغرق إصدار تأشيرة العمل من 5-7 أيام عمل، اعتماداً على نوع المهنة والجنسية. نحن نقوم بمتابعة حالة الطلب يومياً ونبقيك على اطلاع بكل التحديثات.",
        },
        {
          question: "ما هي المستندات المطلوبة لتجديد الإقامة؟",
          answer:
            "للحصول على قائمة شاملة بالمستندات المطلوبة، يُرجى التواصل معنا مباشرة حيث تختلف المتطلبات حسب حالة كل عميل. سنوفر لك قائمة مخصصة وواضحة.",
        },
        {
          question: "هل تقدمون خدمة الاستلام والتسليم؟",
          answer:
            "نعم، نوفر خدمة الاستلام والتسليم داخل الرياض مجاناً. للمناطق الأخرى، يمكننا التنسيق معك لأفضل طريقة للتسليم.",
        },
        {
          question: "كيف أعرف حالة طلبي؟",
          answer:
            "نرسل لك تحديثات عبر واتساب والبريد الإلكتروني عند كل خطوة. كما يمكنك التواصل معنا في أي وقت للاستفسار عن حالة طلبك.",
        },
        {
          question: "ما هي أسعار خدماتكم؟",
          answer:
            "أسعارنا تنافسية وشفافة، وتختلف حسب نوع الخدمة والحالة. تواصل معنا للحصول على عرض سعر مفصل ومخصص لحالتك.",
        },
        {
          question: "هل يمكن إلغاء الطلب أو استرداد الرسوم؟",
          answer:
            "سياسة الإلغاء والاسترداد تعتمد على مرحلة معالجة الطلب. سنوضح لك جميع التفاصيل قبل البدء في العملية.",
        },
      ],
    },
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Answers to the most common questions about our services",
      faqs: [
        {
          question: "How long does it take to issue a work visa?",
          answer:
            "Work visa issuance typically takes 5-7 business days, depending on the profession type and nationality. We follow up daily and keep you updated.",
        },
        {
          question: "What documents are required for residency renewal?",
          answer:
            "Please contact us for a customized list, as requirements vary by case. We’ll provide a clear, tailored checklist.",
        },
        {
          question: "Do you provide pickup and delivery service?",
          answer:
            "Yes, free within Riyadh. For other regions, we’ll coordinate the best option with you.",
        },
        {
          question: "How do I know the status of my application?",
          answer:
            "We send updates via WhatsApp and email at every step. You can also contact us anytime.",
        },
        {
          question: "What are your service prices?",
          answer:
            "Competitive and transparent. Prices vary by service type and case. Contact us for a detailed quote.",
        },
        {
          question: "Can I cancel or get a refund?",
          answer:
            "It depends on the processing stage. We’ll clarify all details before we start.",
        },
      ],
    },
  };

  const currentContent = content[language];
  const isRTL = language === "ar";

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // فئات تأخير انتقال جاهزة للتدرّج بدون ستايل إنلاين
  const delayClasses = [
    "delay-0",
    "delay-100",
    "delay-200",
    "delay-300",
    "delay-400",
    "delay-500",
    "delay-700",
    "delay-1000",
  ];

  return (
    <section id="faq" className="py-20 bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 reveal animate-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-brand mb-6">
            <HelpCircle className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gradient">{currentContent.title}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {currentContent.subtitle}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {currentContent.faqs.map((faq, index) => {
              const isOpen = openItems.includes(index);
              const delayClass = delayClasses[index % delayClasses.length]; // بدون style إنلاين

              return (
                <div
                  key={index}
                  className={`faq-item reveal animate-in ${delayClass} bg-card/50 backdrop-blur-sm border border-card-border rounded-2xl overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300`}
                >
                  <button
                    className={`faq-trigger w-full p-6 text-left font-semibold transition-colors flex items-center justify-between ${
                      isOpen ? "text-primary" : "text-foreground hover:text-primary"
                    }`}
                    onClick={() => toggleItem(index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                  >
                    <span className="text-lg">{faq.question}</span>
                    <div className="flex-shrink-0 ml-4 rtl:ml-0 rtl:mr-4">
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 transition-transform duration-200" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="h-5 w-5 transition-transform duration-200" aria-hidden="true" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-panel-${index}`}
                      role="region"
                      aria-labelledby={`faq-button-${index}`}
                      className="faq-content px-6 pb-6 text-muted-foreground animate-in"
                    >
                      <p className="leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 reveal animate-in delay-700">
          <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-3xl p-8 border border-primary/10 backdrop-blur-sm max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              {language === "ar" ? "لم تجد إجابة سؤالك؟" : "Didn’t find your answer?"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {language === "ar"
                ? "تواصل معنا مباشرة وسنكون سعداء للإجابة على جميع استفساراتك"
                : "Contact us directly and we'll be happy to answer all your questions"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="btn-nux px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-elegant hover:shadow-xl gradient-brand text-white"
                onClick={() => window.open("https://wa.me/966500000000", "_blank")}
                aria-label={language === "ar" ? "محادثة واتساب" : "WhatsApp Chat"}
              >
                {language === "ar" ? "محادثة واتساب" : "WhatsApp Chat"}
              </button>
              <button
                className="btn-ghost-nux px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-primary/20 text-primary hover:bg-primary/10 hover:scale-105 hover:border-primary/40"
                aria-label={language === "ar" ? "طلب مكالمة" : "Request Call"}
              >
                {language === "ar" ? "طلب مكالمة" : "Request Call"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
