import { MessageCircle, FileSearch, Settings, Send, Award } from 'lucide-react';

interface ProcessProps {
  language: 'ar' | 'en';
}

const Process = ({ language }: ProcessProps) => {
  const content = {
    ar: {
      title: 'كيف نعمل؟',
      subtitle: 'عملية بسيطة ومنظمة لضمان حصولك على أفضل خدمة',
      steps: [
        { icon: MessageCircle, title: 'تواصل',  description: 'واتساب/اتصال',     details: 'تواصل معنا عبر واتساب أو الاتصال المباشر لبدء العملية' },
        { icon: FileSearch,   title: 'مراجعة',  description: 'متطلبات + مدة',     details: 'نراجع حالتك ونحدد المتطلبات والمدة الزمنية المطلوبة' },
        { icon: Settings,     title: 'تجهيز',   description: 'نماذج ومواعيد',     details: 'نجهز جميع النماذج المطلوبة ونحدد المواعيد اللازمة' },
        { icon: Send,         title: 'تقديم',   description: 'متابعة حالة',       details: 'نقدم طلبك ونتابع الحالة خطوة بخطوة' },
        { icon: Award,        title: 'استلام',  description: 'إشعار فوري',        details: 'تستلم إشعار فوري عند اكتمال المعاملة' },
      ],
      ctaTitle: 'مستعد للبدء؟',
      ctaBody: 'ابدأ رحلتك معنا الآن وأحصل على تأشيرتك أو إقامتك بأسرع وقت ممكن',
      stats: [
        { value: '5-7',  label: 'أيام معالجة' },
        { value: '24/7', label: 'دعم مستمر' },
        { value: '100%', label: 'ضمان الجودة' },
      ],
      ctaBtn: 'ابدأ الآن',
    },
    en: {
      title: 'How We Work',
      subtitle: 'A simple and organized process to ensure you get the best service',
      steps: [
        { icon: MessageCircle, title: 'Contact',     description: 'WhatsApp/Call',        details: 'Contact us via WhatsApp or direct call to start the process' },
        { icon: FileSearch,   title: 'Review',      description: 'Requirements + Duration', details: 'We review your case and determine requirements and timeline' },
        { icon: Settings,     title: 'Preparation', description: 'Forms & Appointments',   details: 'We prepare all required forms and schedule necessary appointments' },
        { icon: Send,         title: 'Submission',  description: 'Status Tracking',        details: 'We submit your application and track status step by step' },
        { icon: Award,        title: 'Delivery',    description: 'Instant Notification',   details: 'You receive instant notification when the process is complete' },
      ],
      ctaTitle: 'Ready to Start?',
      ctaBody: 'Start your journey with us now and get your visa or residency as quickly as possible',
      stats: [
        { value: '5-7',  label: 'Processing Days' },
        { value: '24/7', label: 'Continuous Support' },
        { value: '100%', label: 'Quality Guarantee' },
      ],
      ctaBtn: 'Start Now',
    },
  } as const;

  const current = content[language];
  const isRTL = language === 'ar';

  // كلاسات تأخير للأنيميشن بدلاً من style
  const delayClasses = ['','anim-delay-200','anim-delay-400','anim-delay-600','anim-delay-800'];

  return (
    <section
      id="process"
      className="py-20 bg-surface/30"
      dir={isRTL ? 'rtl' : 'ltr'}
      aria-labelledby="process-heading"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 reveal animate-in">
          <h2 id="process-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gradient">{current.title}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {current.subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line (desktop) */}
          <div
            className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary -translate-y-1/2 z-0"
            aria-hidden="true"
          />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10" role="list">
            {current.steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              const delay = delayClasses[index] ?? delayClasses[delayClasses.length - 1];

              return (
                <div
                  key={index}
                  role="listitem"
                  className={`timeline-step reveal animate-in ${delay} ${
                    isEven ? 'lg:-translate-y-4' : 'lg:translate-y-4'
                  }`}
                >
                  {/* Step Number & Icon */}
                  <div className="relative mb-4">
                    <div className="w-16 h-16 mx-auto rounded-full gradient-brand flex items-center justify-center shadow-elegant pulse-glow">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                      <div className="w-8 h-8 bg-surface border-2 border-primary rounded-full flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-primary font-medium mb-3">{step.description}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.details}</p>
                  </div>

                  {/* Mobile connection line */}
                  {index < current.steps.length - 1 && (
                    <div
                      className="lg:hidden absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-primary to-transparent"
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center reveal animate-in anim-delay-1000">
          <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-3xl p-8 border border-primary/10 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4">{current.ctaTitle}</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {current.ctaBody}
            </p>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" aria-label={isRTL ? 'إحصائيات' : 'Statistics'}>
              {current.stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-gradient mb-1">{s.value}</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              className="btn-nux px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-elegant hover:shadow-xl gradient-brand text-white"
              onClick={() => window.open('https://wa.me/966500000000', '_blank')}
            >
              {current.ctaBtn}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
