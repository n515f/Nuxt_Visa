import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, CreditCard, Users, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

interface ServicesProps {
  language: 'ar' | 'en';
}

const Services = ({ language }: ServicesProps) => {
  const content = {
    ar: {
      title: 'لماذا Nux.T؟',
      subtitle: 'خدمات منظّمة ببطاقات نظيفة وتفاصيل واضحة.',
      cta: 'ابدأ الآن',
      ask: 'لديك استفسار خاص؟',
      askBody: 'تواصل معنا مباشرة للحصول على استشارة مخصصة لحالتك',
      whatsapp: 'محادثة واتساب',
      call: 'طلب مكالمة',
      services: [
        {
          icon: Briefcase,
          title: 'تأشيرات العمل',
          description: 'تجهيز المتطلبات، تعبئة النماذج، ومتابعة الاعتمادات حتى الإصدار.',
          features: ['جميع المهن والجنسيات', 'تدقيق مستندات دقيق', 'تحديثات حالة لحظية'],
          color: 'from-blue-500 to-cyan-500',
        },
        {
          icon: CreditCard,
          title: 'الإقامات',
          description: 'إصدار/تجديد الإقامات، نقل كفالة، وتحديث المهنة بجدولة واضحة.',
          features: ['متابعة شاملة للطلبات', 'تذكيرات بالمواعيد', 'تقارير دورية'],
          color: 'from-purple-500 to-pink-500',
        },
        {
          icon: Users,
          title: 'تأشيرات الأفراد',
          description: 'زيارة عائلية/شخصية، عمرة إلكترونية، وزيارات عمل قصيرة بسرعة متابعة.',
          features: ['خطوات بسيطة وواضحة', 'دعم فوري', 'أسعار شفافة'],
          color: 'from-green-500 to-emerald-500',
        },
      ],
    },
    en: {
      title: 'Why Nux.T?',
      subtitle: 'Organized services with clean cards and clear details.',
      cta: 'Get Started',
      ask: 'Have a specific inquiry?',
      askBody: 'Contact us directly for personalized consultation for your case',
      whatsapp: 'WhatsApp Chat',
      call: 'Request Call',
      services: [
        {
          icon: Briefcase,
          title: 'Work Visas',
          description: 'Requirements preparation, form filling, and follow-up until issuance.',
          features: ['All professions and nationalities', 'Accurate document verification', 'Real-time status updates'],
          color: 'from-blue-500 to-cyan-500',
        },
        {
          icon: CreditCard,
          title: 'Residency (Iqama)',
          description: 'Issuance/renewal of residency, sponsorship transfer, and profession updates.',
          features: ['Comprehensive request tracking', 'Appointment reminders', 'Regular reports'],
          color: 'from-purple-500 to-pink-500',
        },
        {
          icon: Users,
          title: 'Individual Visas',
          description: 'Family/personal visits, electronic Umrah, and short business visits.',
          features: ['Simple and clear steps', 'Instant support', 'Transparent pricing'],
          color: 'from-green-500 to-emerald-500',
        },
      ],
    },
  } as const;

  const current = content[language];
  const isRTL = language === 'ar';

  // بدائل تأخير الأنيميشن بدل inline styles
  const delay = ['','anim-delay-200','anim-delay-400'];

  return (
    <section
      id="services"
      className="py-20 bg-background"
      dir={isRTL ? 'rtl' : 'ltr'}
      aria-labelledby="services-heading"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 reveal animate-in">
          <h2 id="services-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gradient">{current.title}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{current.subtitle}</p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
          {current.services.map((service, index) => {
            const Icon = service.icon;
            const delayClass = delay[index] ?? 'anim-delay-600';

            return (
              <Card
                key={service.title}
                role="listitem"
                className={`card-hover card-glow reveal animate-in ${delayClass} border-0 shadow-card bg-card/50 backdrop-blur-sm`}
              >
                <CardHeader className="text-center pb-4">
                  {/* Icon with Gradient Background */}
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-elegant`}
                    aria-hidden="true"
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Features List */}
                  <ul className="space-y-3 mb-6" aria-label={isRTL ? 'مزايا الخدمة' : 'Service features'}>
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" aria-hidden="true" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    className="w-full btn-nux group"
                    onClick={() => window.open('https://wa.me/966500000000', '_blank')}
                    aria-label={current.cta}
                  >
                    {current.cta}
                    {isRTL ? (
                      <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 reveal animate-in anim-delay-800">
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl p-8 border border-primary/10">
            <h3 className="text-2xl font-bold mb-4">{current.ask}</h3>
            <p className="text-muted-foreground mb-6">{current.askBody}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="btn-nux"
                onClick={() => window.open('https://wa.me/966500000000', '_blank')}
                aria-label={current.whatsapp}
              >
                {current.whatsapp}
              </Button>
              <Button variant="outline" size="lg" className="btn-ghost-nux" aria-label={current.call}>
                {current.call}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
