import { MessageCircle, Phone, Mail, MapPin, Clock, Shield } from 'lucide-react';

interface FooterProps {
  language: 'ar' | 'en';
}

const Footer = ({ language }: FooterProps) => {
  const content = {
    ar: {
      company: 'Nux.T Visa',
      tagline: 'شريكك الموثوق في خدمات التأشيرات والإقامات',
      contact: 'تواصل معنا',
      services: 'خدماتنا',
      info: 'معلومات',
      rights: 'جميع الحقوق محفوظة',
      contactInfo: {
        phone: '+966 50 000 0000',
        email: 'info@nuxt-visa.com',
        address: 'الرياض، المملكة العربية السعودية',
        hours: 'الأحد - الخميس: 9:00 ص - 6:00 م'
      },
      serviceLinks: [
        'تأشيرات العمل',
        'الإقامات',
        'تأشيرات الأفراد',
        'التجديدات',
        'نقل الكفالة'
      ],
      infoLinks: [
        'من نحن',
        'سياسة الخصوصية',
        'الشروط والأحكام',
        'الأسئلة الشائعة',
        'اتصل بنا'
      ],
      features: [
        { icon: Shield, text: 'موثوق ومرخص' },
        { icon: Clock, text: 'سرعة في الإنجاز' },
        { icon: Phone, text: 'دعم على مدار الساعة' }
      ]
    },
    en: {
      company: 'Nux.T Visa',
      tagline: 'Your trusted partner in visa and residency services',
      contact: 'Contact Us',
      services: 'Our Services',
      info: 'Information',
      rights: 'All rights reserved',
      contactInfo: {
        phone: '+966 50 000 0000',
        email: 'info@nuxt-visa.com',
        address: 'Riyadh, Saudi Arabia',
        hours: 'Sunday - Thursday: 9:00 AM - 6:00 PM'
      },
      serviceLinks: [
        'Work Visas',
        'Residency (Iqama)',
        'Individual Visas',
        'Renewals',
        'Sponsorship Transfer'
      ],
      infoLinks: [
        'About Us',
        'Privacy Policy',
        'Terms & Conditions',
        'FAQ',
        'Contact Us'
      ],
      features: [
        { icon: Shield, text: 'Trusted & Licensed' },
        { icon: Clock, text: 'Fast Processing' },
        { icon: Phone, text: '24/7 Support' }
      ]
    }
  };

  const currentContent = content[language];
  const isRTL = language === 'ar';

  return (
    <footer 
      className="bg-surface border-t border-border/50"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gradient">{currentContent.company}</h3>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {currentContent.tagline}
            </p>
            
            {/* Features */}
            <div className="space-y-3">
              {currentContent.features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{currentContent.contact}</h4>
            <div className="space-y-4">
              <a 
                href={`tel:${currentContent.contactInfo.phone}`}
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">{currentContent.contactInfo.phone}</span>
              </a>
              
              <a 
                href={`mailto:${currentContent.contactInfo.email}`}
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">{currentContent.contactInfo.email}</span>
              </a>
              
              <div className="flex items-start gap-3 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">{currentContent.contactInfo.address}</span>
              </div>
              
              <div className="flex items-start gap-3 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">{currentContent.contactInfo.hours}</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{currentContent.services}</h4>
            <ul className="space-y-3">
              {currentContent.serviceLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href="#services"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{currentContent.info}</h4>
            <ul className="space-y-3">
              {currentContent.infoLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/50 bg-surface/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 {currentContent.company}. {currentContent.rights}
            </p>
            
            {/* Quick Contact */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.open('https://wa.me/966500000000', '_blank')}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <MessageCircle className="h-4 w-4" />
                {language === 'ar' ? 'واتساب' : 'WhatsApp'}
              </button>
              
              <button 
                onClick={() => window.location.href = `tel:${currentContent.contactInfo.phone}`}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Phone className="h-4 w-4" />
                {language === 'ar' ? 'اتصل' : 'Call'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;