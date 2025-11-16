// src/App.tsx
import { useState, useEffect, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import { ThemeProvider } from "next-themes";
import Services from "./pages/Services";
import Process from "./pages/Process";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import AuthPage from "./pages/Auth";
import FloatingChatButton from "./components/FloatingChatButton";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, hash]);
  return null;
}

function AppShell({
  language,
  onLanguageChange,
}: {
  language: "ar" | "en";
  onLanguageChange: (lng: "ar" | "en") => void;
}) {
  const location = useLocation();
  const isAuthRoute = location.pathname === "/auth";
  return (
    <>
      <ScrollToHash />
      {!isAuthRoute && (
        <Header language={language} onLanguageChange={onLanguageChange} />
      )}
      <Routes>
        <Route path="/" element={<Index language={language} />} />
        <Route path="/services" element={<Services language={language} />} />
        <Route path="/process" element={<Process language={language} />} />
        <Route path="/faq" element={<FAQ language={language} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* زر الدردشة العائم */}
      <FloatingChatButton hideWhenUnauthenticated />
      {!isAuthRoute && <Footer language={language} />}
    </>
  );
}

export default function App() {
  const [language, setLanguage] = useState<"ar" | "en">(() => {
    const saved = localStorage.getItem("app_language");
    return saved === "en" ? "en" : "ar";
  });

  useEffect(() => {
    const html = document.documentElement;
    html.dir = language === "ar" ? "rtl" : "ltr";
    html.lang = language;
    localStorage.setItem("app_language", language);
  }, [language]);

  const handleLanguageChange = useCallback((lng: "ar" | "en") => setLanguage(lng), []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="min-h-screen bg-background text-foreground">
            <Router>
              <AppShell language={language} onLanguageChange={handleLanguageChange} />
            </Router>
          </div>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
