import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import Chat from "@/pages/Chat";
import { useNavigate } from "react-router-dom";
import { getAuth } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export default function FloatingChatButton({
  hideWhenUnauthenticated = false,
}: { hideWhenUnauthenticated?: boolean }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token, user } = getAuth();
  const authenticated = Boolean(token && user);

  // خيار (A): إخفاء الزر إذا لم يكن المستخدم مسجّل دخول
  if (!authenticated && hideWhenUnauthenticated) {
    return null;
  }

  const handleOpen = () => {
    if (!authenticated) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يرجى تسجيل الدخول للوصول إلى الدردشة.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    setOpen(true);
  };

  return (
    <>
      {/* الزر العائم */}
      <button
        type="button"
        onClick={handleOpen}
        className={`fixed z-[60] bottom-5 rtl:left-5 ltr:right-5 rounded-full w-14 h-14 bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition grid place-items-center ${
          !authenticated ? "opacity-60 cursor-not-allowed" : ""
        }`}
        aria-label="فتح الدردشة"
        title={authenticated ? "الدردشة" : "سجّل الدخول للوصول للدردشة"}
        aria-disabled={!authenticated}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {open && authenticated && (
        <div className="fixed inset-0 z-[70]">
          {/* خلفية شفافة */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          {/* اللوحة */}
          <div className="absolute rtl:left-5 ltr:right-5 bottom-20 w-[92vw] sm:w-[480px] h-[70vh] rounded-2xl border border-border/60 bg-card/90 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
              <span className="font-semibold">الدردشة</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 hover:bg-muted"
                aria-label="إغلاق"
                title="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-[calc(70vh-56px)] overflow-auto">
              {/* نعرض صفحة الدردشة داخل اللوحة */}
              <Chat />
            </div>
          </div>
        </div>
      )}
    </>
  );
}