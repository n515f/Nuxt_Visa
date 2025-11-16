// src/pages/Auth.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, login, setAuth } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export default function AuthPage() {
  const nav = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [loading, setLoading] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      if (mode === "register") {
        const res = await register({ name, email, phone, password: pass });
        // ✅ setAuth(token, user)
        setAuth(res.token, res.user);
      } else {
        const res = await login({ email, password: pass });
        // ✅ setAuth(token, user)
        setAuth(res.token, res.user);
      }
      nav("/"); // رجوع للهوم
    } catch (err) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: (err as Error).message || "حدث خلل أثناء العملية",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background to-muted/40 grid place-items-center px-4">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md shadow-xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold">
              {mode === "register" ? "تسجيل مستخدم جديد" : "تسجيل الدخول"}
            </h1>
            <button
              type="button"
              onClick={() => setMode(mode === "register" ? "login" : "register")}
              className="text-primary hover:underline"
            >
              {mode === "register" ? "لدي حساب" : "إنشاء حساب"}
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm mb-1">الاسم الكامل</label>
                  <input
                    id="name"
                    title="الاسم الكامل"
                    placeholder="اكتب اسمك"
                    className="w-full rounded-md bg-background border border-border px-3 py-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm mb-1">رقم الجوال</label>
                  <input
                    id="phone"
                    title="رقم الجوال"
                    placeholder="05xxxxxxxx"
                    className="w-full rounded-md bg-background border border-border px-3 py-2"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm mb-1">البريد الإلكتروني</label>
              <input
                id="email"
                type="email"
                title="البريد الإلكتروني"
                placeholder="name@example.com"
                className="w-full rounded-md bg-background border border-border px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="pass" className="block text-sm mb-1">كلمة المرور</label>
              <input
                id="pass"
                type="password"
                title="كلمة المرور"
                placeholder="••••••••"
                className="w-full rounded-md bg-background border border-border px-3 py-2"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              {loading ? "جارِ المعالجة..." : mode === "register" ? "تسجيل" : "دخول"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
