// src/components/Header.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, Globe, Bell, Circle } from "lucide-react";
import { useTheme } from "next-themes";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { getAuth, clearAuth, apiNotificationsList, apiNotificationsMarkOne, type NotificationItem } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // جديد

interface HeaderProps {
  language: "ar" | "en";
  onLanguageChange: (lang: "ar" | "en") => void;
}

type NavItem = { label: string; to: string };

// src/components/Header.tsx
export default function Header({ language, onLanguageChange }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [auth, setAuthState] = useState(getAuth());
  const [logoError, setLogoError] = useState(false); // جديد

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setAuthState(getAuth()); // التقط أي تغيّر من صفحات ثانية
  }, [location.pathname, language]);

  const navItems: Record<"ar" | "en", NavItem[]> = {
    ar: [
      { label: "الرئيسية", to: "/" },
      { label: "خدماتنا", to: "/services" },
      { label: "كيف نعمل", to: "/process" },
      { label: "الأسئلة الشائعة", to: "/faq" },
      { label: "تواصل معنا", to: "/contact" },
      // تمت إزالة رابط الدردشة لصالح الزر العائم
    ],
    en: [
      { label: "Home", to: "/" },
      { label: "Services", to: "/services" },
      { label: "How We Work", to: "/process" },
      { label: "FAQ", to: "/faq" },
      { label: "Contact", to: "/contact" },
      // Chat link removed in favor of floating button
    ],
  };
  const currentNav = navItems[language];

  function logout() {
    clearAuth();
    // تنظيف كلا المفتاحين لضمان عدم بقاء تذكرة قديمة
    localStorage.removeItem("chat_ticket_id");
    const currentUserId = getAuth()?.user?.id;
    if (currentUserId) {
      localStorage.removeItem(`chat_ticket_id_${currentUserId}`);
    }
    setAuthState({ token: null, user: null });
    navigate("/");
  }

  // إشعارات المستخدم الحالي
  const queryClient = useQueryClient();
  const { data: notificationsResp } = useQuery<{ notifications: NotificationItem[] }>({
      queryKey: ["notifications", auth.user?.id],
      queryFn: () => apiNotificationsList(),
      enabled: Boolean(auth?.token && auth?.user?.id),
      refetchInterval: 30_000,
  });
  const notifications = notificationsResp?.notifications ?? [];
  const sortedNotifications = notifications.slice().sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  const unreadCount = sortedNotifications.filter((n) => n.is_read === 0).length;

  const markNotifReadMutation = useMutation({
      mutationFn: (id: number) => apiNotificationsMarkOne(id),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["notifications", auth.user?.id] });
      },
  });

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass shadow-glass backdrop-blur-lg" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 rtl:space-x-reverse cursor-pointer" onClick={() => navigate("/")}>
          <img
            src="/logo.svg"
            alt="Company Logo"
            className="w-10 h-10 rounded-xl shadow-md transition-transform hover:scale-105 anim-fade-in"
          />
          <div className="transition-colors">
            <h1 className="text-xl font-bold text-gradient">Nux.T</h1>
            <p className="text-xs text-muted-foreground">{language === "ar" ? "إصدار التأشيرات" : "Visa Services"}</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 rtl:space-x-reverse whitespace-nowrap">
          {currentNav.map((item) => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) => `font-medium transition-colors duration-200 ${isActive ? "text-primary" : "text-foreground hover:text-primary"}`}
              end={item.to === "/"}
            >{item.label}</NavLink>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3 rtl:space-x-reverse">
          {/* زر الإشعارات */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="relative rounded-full p-2 hover:bg-muted transition-transform hover:-translate-y-px disabled:opacity-100 disabled:cursor-default"
                aria-label={language === "ar" ? "الإشعارات" : "Notifications"}
                disabled={!auth?.token}
                title={language === "ar" ? "الإشعارات" : "Notifications"}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5 anim-pulse-badge">
                    {unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              {!sortedNotifications.length ? (
                <div className="p-3 text-sm text-muted-foreground">{language === "ar" ? "لا توجد إشعارات" : "No notifications"}</div>
              ) : (
                sortedNotifications.map((n: NotificationItem) => (
                  <DropdownMenuItem key={n.id} asChild>
                    <button
                      type="button"
                      className={`w-full text-left px-2 py-2 rounded transition ${n.is_read ? "opacity-70" : "bg-accent/30"}`}
                      onClick={() => markNotifReadMutation.mutate(n.id)}
                      title={new Date(n.created_at).toLocaleString()}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{n.title}</span>
                        {!n.is_read && <Circle className="h-3 w-3 text-sky-500" />}
                      </div>
                      {n.body && <p className="text-xs text-muted-foreground">{n.body}</p>}
                    </button>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" onClick={() => onLanguageChange(language === "ar" ? "en" : "ar")}
            className="hidden md:flex items-center gap-2 transition-transform hover:-translate-y-px" aria-label="Toggle language">
            <Globe className="h-4 w-4" />{language === "ar" ? "EN" : "عربي"}
          </Button>

          <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme"
            className="transition-transform hover:-translate-y-px">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* CTA / User pill */}
          {!auth?.token ? (
            <Button className="btn-nux hidden md:flex transition-transform hover:-translate-y-px" onClick={() => navigate("/auth")}>
              {language === "ar" ? "ابدأ الآن" : "Get Started"}
            </Button>
          ) : (
            <div className="hidden md:flex items-center gap-3 px-2 py-1.5 rounded-full bg-muted/60 hover:bg-muted transition-colors shadow-sm anim-fade-in">
              <Avatar className="h-9 w-9 ring-1 ring-border shadow-sm transition-transform hover:scale-105">
                {/* استبدل src بصورة حساب حقيقية لاحقًا إن وجدت */}
                <AvatarImage src="/person.png" alt={auth.user?.name ?? "User"} />
                <AvatarFallback className="text-xs font-semibold">
                  {(auth.user?.name ?? "U")
                    .split(" ")
                    .map(w => w[0])
                    .filter(Boolean)
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="leading-tight">
                <div className="font-semibold">{auth.user?.name ?? "حسابي"}</div>
                <div className="text-xs opacity-70">
                  {auth.user?.phone ?? auth.user?.email ?? ""}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={logout} className="ms-1 transition-transform hover:-translate-y-px">
                {language === "ar" ? "تسجيل الخروج" : "Logout"}
              </Button>
            </div>
          )}

          {/* Mobile */}
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMobileMenuOpen(s => !s)} aria-label="Toggle navigation menu">
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden glass border-t border-glass-border backdrop-blur-md">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-4">
              {currentNav.map((item) => (
                <NavLink key={item.to} to={item.to}
                  className={({ isActive }) => `font-medium py-2 transition-colors duration-200 ${isActive ? "text-primary" : "text-foreground hover:text-primary"}`}
                  end={item.to === "/"} onClick={() => setIsMobileMenuOpen(false)}
                >{item.label}</NavLink>
              ))}

              <div className="pt-4 border-t border-border/50 space-y-2">
                <Button variant="ghost" size="sm" onClick={() => onLanguageChange(language === "ar" ? "en" : "ar")} className="w-full justify-start">
                  <Globe className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />{language === "ar" ? "English" : "عربي"}
                </Button>

                {!auth?.token ? (
                  <Button className="btn-nux w-full" onClick={() => { setIsMobileMenuOpen(false); navigate("/auth"); }}>
                    {language === "ar" ? "ابدأ الآن" : "Get Started"}
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => { setIsMobileMenuOpen(false); logout(); }}>
                    {language === "ar" ? "تسجيل الخروج" : "Logout"}
                  </Button>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
