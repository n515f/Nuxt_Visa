import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { NavLink, useLocation } from "react-router-dom";

interface HeaderProps {
  language: "ar" | "en";
  onLanguageChange: (lang: "ar" | "en") => void;
}

type NavItem = { label: string; to: string };

const Header = ({ language, onLanguageChange }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  /* ==============================
     📜 تغيّر شكل الهيدر عند التمرير
  ============================== */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ==============================
     🔄 أغلق قائمة الموبايل عند الانتقال
  ============================== */
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, language]);

  /* ==============================
     🌐 عناصر التنقّل (عربي / إنجليزي)
  ============================== */
  const navItems: Record<"ar" | "en", NavItem[]> = {
    ar: [
      { label: "الرئيسية", to: "/" },
      { label: "خدماتنا", to: "/services" },
      { label: "كيف نعمل", to: "/process" },
      { label: "الأسئلة الشائعة", to: "/faq" },
      { label: "تواصل معنا", to: "/contact" },
      { label: "الدردشة", to: "/chat" },
    ],
    en: [
      { label: "Home", to: "/" },
      { label: "Services", to: "/services" },
      { label: "How We Work", to: "/process" },
      { label: "FAQ", to: "/faq" },
      { label: "Contact", to: "/contact" },
      { label: "Chat", to: "/chat" },
    ],
  };

  const currentNav = navItems[language];

  /* ==============================
     ✨ JSX
  ============================== */
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass shadow-glass backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-xl gradient-brand grid place-items-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">Nux.T</h1>
            <p className="text-xs text-muted-foreground">
              {language === "ar" ? "إصدار التأشيرات" : "Visa Services"}
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 rtl:space-x-reverse whitespace-nowrap">
          {currentNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `font-medium transition-colors duration-200 ${
                  isActive ? "text-primary" : "text-foreground hover:text-primary"
                }`
              }
              end={item.to === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3 rtl:space-x-reverse">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLanguageChange(language === "ar" ? "en" : "ar")}
            className="hidden md:flex items-center gap-2"
            aria-label="Toggle language"
          >
            <Globe className="h-4 w-4" />
            {language === "ar" ? "EN" : "عربي"}
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* CTA */}
          <Button className="btn-nux hidden md:flex">
            {language === "ar" ? "ابدأ الآن" : "Get Started"}
          </Button>

          {/* Mobile Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen((s) => !s)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden glass border-t border-glass-border backdrop-blur-md">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-4">
              {currentNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `font-medium py-2 transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-foreground hover:text-primary"
                    }`
                  }
                  end={item.to === "/"}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="pt-4 border-t border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLanguageChange(language === "ar" ? "en" : "ar")}
                  className="w-full justify-start mb-2"
                >
                  <Globe className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {language === "ar" ? "English" : "عربي"}
                </Button>
                <Button className="btn-nux w-full">
                  {language === "ar" ? "ابدأ الآن" : "Get Started"}
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
