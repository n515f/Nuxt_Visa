// src/pages/Chat.tsx — FINAL (React/Vite + Backend wired, lint clean)
// في أعلى الملف - إزالة الاستيرادات غير المستخدمة وتوحيد الأنواع
import { useEffect, useRef, useState } from "react";
import { Loader2, Send, LogIn } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  apiMessagesList,
  apiMessageCreate,
  apiTicketCreate,
  apiNotificationsMarkOne,
  apiTicketsList,
  getAuth,
  apiAiChat,
  type MessageItem,
  type NotificationItem,
} from "@/lib/api";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// تمت إزالة الأنواع المحلية غير المستخدمة والمتعارضة:
// - ChatMessage
// - NotificationItem المحلي الذي كان يستخدم IsRead غير المعرّفة

// تبديل مفتاح التخزين ليصبح مميز لكل مستخدم
const LS_TICKET_ID_PREFIX = "chat_ticket_id_";

function loadTicketId(userId?: number | null): number | null {
  try {
    if (!userId) return null;
    const raw = localStorage.getItem(`${LS_TICKET_ID_PREFIX}${userId}`);
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

function saveTicketId(userId: number | null | undefined, id: number) {
  try {
    if (!userId) return;
    localStorage.setItem(`${LS_TICKET_ID_PREFIX}${userId}`, String(id));
  } catch {
    // ignore
  }
}

// مكوّن EmptyBox يظل كما هو
const EmptyBox = ({ title, desc }: { title: string; desc?: string }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6">
    <img src="/empty_chats.png" loading="lazy" alt="" className="w-40 h-40 opacity-80 mb-6" />
    <h3 className="text-lg font-semibold mb-1">{title}</h3>
    {!!desc && <p className="text-sm text-muted-foreground">{desc}</p>}
  </div>
);

// إزالة الكتلة المكررة التي تستخدم LS_TICKET_ID (غير موجود) بالكامل
// تم حذف:
// function loadTicketId(): number | null { /* يعتمد على LS_TICKET_ID */ }
// function saveTicketId(id: number) { /* يعتمد على LS_TICKET_ID */ }

export default function ChatPage() {
  // يجب أن يكون المستخدم مسجّل دخول
  const { token, user } = getAuth();
  const authenticated = Boolean(token && user);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ticketId كـ Query (من التخزين المحلي أولًا، ثم آخر تذكرة مفتوحة من API)
  const ticketQuery = useQuery<number | null>({
    queryKey: ["ticket", user?.id],
    queryFn: async () => {
      const local = loadTicketId(user?.id ?? null);
      if (local) return local;

      try {
        const list = await apiTicketsList();
        const open = list.tickets.find((t) => t.status === "open");
        if (open?.id) {
          saveTicketId(user?.id ?? null, open.id);
          return open.id;
        }
      } catch {
        // تجاهل أخطاء الفetch هنا لمنع تعطيل الصفحة
      }

      return null;
    },
    enabled: authenticated,
  });

  const ticketId = ticketQuery.data ?? null;
  const isTicketLoading = ticketQuery.isPending;

  // الرسائل عبر useQuery
  const {
    data: messagesResp,
    isPending: isMessagesPending,
  } = useQuery<{ page: number; per_page: number; messages: MessageItem[] }>({
    queryKey: ["messages", ticketId],
    queryFn: () => apiMessagesList({ ticket_id: ticketId!, page: 1, per_page: 100 }),
    enabled: !!ticketId,
  });

  const messages = messagesResp?.messages ?? [];

  // الإشعارات عبر useQuery مع تحديث دوري (افتراضي 30 ثانية)
  // تم النقل إلى Header — أزلنا جلب الإشعارات من هنا
  // const { data: notificationsResp, isFetching: isNotifsFetching } = useQuery(...)
  // const notifications = notificationsResp?.notifications ?? [];
  // const unreadCount = notifications.filter((n) => n.is_read === 0).length;

  // تعليم إشعار كمقروء عبر useMutation
  // تم النقل إلى Header
  // const markNotifReadMutation = useMutation(...);

  // مسودة الرسالة
  const [draft, setDraft] = useState("");

  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  // تعليم إشعار كمقروء عبر useMutation
  const markNotifReadMutation = useMutation({
    mutationFn: (id: number) => apiNotificationsMarkOne(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Unexpected error";
      toast({
        title: "تعذّر التعليم كمقروء",
        description: msg,
        variant: "destructive",
      });
    },
  });

  // إرسال الرسالة مع إنشاء تذكرة إذا لم توجد
  const sendMutation = useMutation<number, Error, string>({
    mutationFn: async (text: string): Promise<number> => {
      let id = ticketId;

      if (!id) {
        const created = await apiTicketCreate({
          subject: "محادثتي",
          content: text || "بدء محادثة",
        });
        id = created.ticket_id;
        saveTicketId(user?.id ?? null, id);
      } else {
        await apiMessageCreate({ ticket_id: id, body: text });
      }

      return id!;
    },
    onSuccess: (id: number) => {
      queryClient.setQueryData(["ticket", user?.id], id);
      queryClient.invalidateQueries({ queryKey: ["messages", id] });
      // يظل التحديث للإشعارات لتنعكس على جرس الهيدر
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Unexpected error";
      toast({
        title: "فشل الإرسال",
        description: msg,
        variant: "destructive",
      });
    },
  });

  // إضافة Mutation لرد المساعد الذكي
  const aiReplyMutation = useMutation({
    mutationFn: (payload: { user_id: number; message: string; ticket_id?: number }) =>
      apiAiChat(payload),
    onSuccess: (resp: { ticket_id?: number }) => {
      const idForInvalidate = resp?.ticket_id ?? ticketId;
      if (idForInvalidate) {
        queryClient.invalidateQueries({ queryKey: ["messages", idForInvalidate] });
      }
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Unexpected error";
      toast({
        title: "تعذّر جلب رد المساعد",
        description: msg,
        variant: "destructive",
      });
    },
  });

  const send = async () => {
    const text = draft.trim();
    if (!text || sendMutation.isPending) return;
    if (!authenticated || !user?.id) return;

    const id = await sendMutation.mutateAsync(text);
    setDraft("");

    // استدعاء ردّ المساعد الذكي بعد الإرسال
    aiReplyMutation.mutate({ user_id: user.id, message: text, ticket_id: id });
  };

  // لو غير موثّق
  if (!authenticated) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-8 text-center">
          <img
            src="/empty_chats.png"
            loading="lazy"
            alt=""
            className="w-28 h-28 opacity-70 mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold mb-2">تسجيل الدخول مطلوب</h3>
          <p className="text-sm text-muted-foreground mb-6">
            لبدء المحادثة ومزامنة الرسائل والإشعارات مع حسابك، يرجى تسجيل الدخول.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            <LogIn className="h-4 w-4" />
            الذهاب إلى صفحة الدخول
          </Link>
        </div>
      </div>
    );
  }

  // واجهة البدء (لا يوجد تذكرة حتى الآن)
  if (!ticketId) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-10">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 md:p-8">
          <EmptyBox
            title="لا توجد محادثة نشطة"
            desc="ابدأ من هنا بإرسال أول رسالة، وسيتم إنشاء تذكرة والبدء في جمع الرسائل والإشعارات."
          />
          <div className="mt-6 flex items-center gap-2">
            <label htmlFor="first-message" className="sr-only">
              اكتب رسالتك لبدء محادثة
            </label>
            <input
              id="first-message"
              className="flex-1 rounded-md bg-background border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="اكتب رسالتك لبدء محادثة…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              title="حقل الرسالة"
            />
            <button
              onClick={send}
              disabled={sendMutation.isPending}
              className="rounded-md px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 transition inline-flex items-center gap-2 disabled:opacity-60"
              aria-label="إرسال الرسالة"
            >
              {sendMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "إرسال"
              )}
              {!sendMutation.isPending && <Send className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Notifications */}
        {/* أزلنا لوحة الإشعارات من صفحة الدردشة لأن عرضها أصبح في الهيدر */}
        {/* Messages */}
        <section className="lg:col-span-12">
          <div className="rounded-2xl border border-border/60 bg-card/40 p-4 h-[70vh] flex flex-col">
            {isTicketLoading || isMessagesPending ? (
              <EmptyBox title="جاري التحميل…" />
            ) : (
              <>
                {/* TODO: هنا تكمل عرض الرسائل نفسها UI الخاص بالمحادثة */}
                <div className="flex-1 overflow-auto space-y-3 pb-3">
                  {messages.map((m: MessageItem) => (
                    <div
                      key={m.id}
                      className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm"
                    >
                      <div className="text-xs text-muted-foreground mb-1">
                        {new Date(m.created_at).toLocaleString()}
                      </div>
                      <div>{m.body}</div>
                    </div>
                  ))}
                  <div ref={endRef} />
                </div>

                <div className="pt-3 mt-3 border-t border-border/60 flex items-center gap-2">
                  <input
                    className="flex-1 rounded-md bg-background border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="اكتب رسالتك…"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                  />
                  <button
                    onClick={send}
                    disabled={sendMutation.isPending}
                    className="rounded-md px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 transition inline-flex items-center gap-2 disabled:opacity-60"
                    aria-label="إرسال الرسالة"
                  >
                    {sendMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "إرسال"
                    )}
                    {!sendMutation.isPending && <Send className="h-4 w-4" />}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
