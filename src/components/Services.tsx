// أعلى الملف
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, CreditCard, Users, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

interface ServicesProps {
  language: 'ar' | 'en';
}

interface ServiceItem {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  color: string;
}

const Services = ({ language }: ServicesProps) => {
  const content = {
    ar: {
      title: 'لماذا Nux.T؟',
      subtitle: 'خدمات منظّمة ببطاقات نظيفة وتفاصيل واضحة.',
      cta: 'ابدأ الآن',
      services: [
        {
          icon: Briefcase,
          title: 'تأشيرات العمل',
          description: 'تجهيز المتطلبات، تعبئة النماذج، ومتابعة الاعتمادات حتى الإصدار.',
          features: [
            'جميع المهن والجنسيات',
            'تدقيق مستندات دقيق',
            'تحديثات حالة لحظية'
          ],
          color: 'from-blue-500 to-cyan-500'
        },
        {
          icon: CreditCard,
          title: 'الإقامات',
          description: 'إصدار/تجديد الإقامات، نقل كفالة، وتحديث المهنة بجدولة واضحة.',
          features: [
            'متابعة شاملة للطلبات',
            'تذكيرات بالمواعيد',
            'تقارير دورية'
          ],
          color: 'from-purple-500 to-pink-500'
        },
        {
          icon: Users,
          title: 'تأشيرات الأفراد',
          description: 'زيارة عائلية/شخصية، عمرة إلكترونية، وزيارات عمل قصيرة بسرعة متابعة.',
          features: [
            'خطوات بسيطة وواضحة',
            'دعم فوري',
            'أسعار شفافة'
          ],
          color: 'from-green-500 to-emerald-500'
        }
      ]
    },
    en: {
      title: 'Why Nux.T?',
      subtitle: 'Organized services with clean cards and clear details.',
      cta: 'Get Started',
      services: [
        {
          icon: Briefcase,
          title: 'Work Visas',
          description: 'Requirements preparation, form filling, and follow-up until issuance.',
          features: [
            'All professions and nationalities',
            'Accurate document verification',
            'Real-time status updates'
          ],
          color: 'from-blue-500 to-cyan-500'
        },
        {
          icon: CreditCard,
          title: 'Residency (Iqama)',
          description: 'Issuance/renewal of residency, sponsorship transfer, and profession updates.',
          features: [
            'Comprehensive request tracking',
            'Appointment reminders',
            'Regular reports'
          ],
          color: 'from-purple-500 to-pink-500'
        },
        {
          icon: Users,
          title: 'Individual Visas',
          description: 'Family/personal visits, electronic Umrah, and short business visits.',
          features: [
            'Simple and clear steps',
            'Instant support',
            'Transparent pricing'
          ],
          color: 'from-green-500 to-emerald-500'
        }
      ]
    }
  };

  const currentContent = content[language];
  const isRTL = language === 'ar';

  return (
    <section 
      id="services" 
      className="py-20 bg-background"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 reveal animate-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gradient">{currentContent.title}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {currentContent.subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentContent.services.map((service: ServiceItem, index: number) => {
            const Icon = service.icon;
            return (
              <Card 
                key={service.title}
                className="card-hover card-glow reveal animate-in border-0 shadow-card bg-card/50 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardHeader className="text-center pb-4">
                  {/* Icon with Gradient Background */}
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-elegant`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Features List */}
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className="w-full btn-nux group"
                    onClick={() => window.open('https://wa.me/966500000000', '_blank')}
                  >
                    {currentContent.cta}
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
        <div className="text-center mt-16 reveal animate-in" style={{ animationDelay: '0.8s' }}>
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl p-8 border border-primary/10">
            <h3 className="text-2xl font-bold mb-4">
              {language === 'ar' ? 'لديك استفسار خاص؟' : 'Have a specific inquiry?'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {language === 'ar' 
                ? 'تواصل معنا مباشرة للصول على استشارة مخصصة لحالتك'
                : 'Contact us directly for personalized consultation for your case'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="btn-nux"
                onClick={() => window.open('https://wa.me/966500000000', '_blank')}
              >
                {language === 'ar' ? 'محادثة واتساب' : 'WhatsApp Chat'}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="btn-ghost-nux"
              >
                {language === 'ar' ? 'طلب مكالمة' : 'Request Call'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;