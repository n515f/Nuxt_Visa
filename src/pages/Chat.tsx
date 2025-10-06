// src/pages/Chat.tsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Trash2,
  Bell,
  CheckCircle2,
  Circle,
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  Plus,
  Search,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";

type Lang = "ar" | "en";

type Message = {
  id: string;
  from: "client" | "agent";
  text: string;
  time: string; // hh:mm
  read?: boolean;
};

type Chat = {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string; // ISO
  unread: boolean;
  notifications: number;
  messages: Message[];
  selected?: boolean;
};

type AuthForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

const initialAuth: AuthForm = { name: "", email: "", phone: "", password: "" };

const EmptyIllustration: React.FC<{ cta?: boolean }> = ({ cta = true }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6">
    <img src="/placeholder.svg" alt="لا توجد محادثات" className="w-40 h-40 opacity-80 mb-6" />
    <h3 className="text-lg font-semibold mb-2">لا توجد محادثات حتى الآن</h3>
    <p className="text-sm text-muted-foreground mb-6">
      ابدأ محادثة جديدة أو انتظر ردّ فريقنا لتظهر هنا.
    </p>
    {cta && (
      <Link
        to="/#contact"
        className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition"
      >
        ابدأ محادثة جديدة
        <Plus className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" aria-hidden="true" />
      </Link>
    )}
  </div>
);

// عنصر واحد في قائمة المحادثات
const ChatListItem: React.FC<{
  chat: Chat;
  active: boolean;
  onOpen: () => void;
  selectionMode: boolean;
  onToggleSelect: () => void;
}> = ({ chat, active, onOpen, selectionMode, onToggleSelect }) => {
  const onItemClick = () => {
    if (selectionMode) onToggleSelect();
    else onOpen();
  };

  return (
    <div
      className={`group relative flex items-start gap-3 p-3 rounded-lg cursor-pointer transition border hover:border-border ${
        active ? "bg-accent/40 border-border" : "bg-transparent border-transparent"
      }`}
      onClick={onItemClick}
    >
      {/* أفاتار */}
      <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/60 grid place-items-center text-primary-foreground">
        <span className="font-bold" aria-hidden="true">
          {chat.title.slice(0, 1).toUpperCase()}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <p className="font-semibold truncate">{chat.title}</p>
            {chat.notifications > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                <Bell className="h-3.5 w-3.5" aria-hidden="true" />
                {chat.notifications}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(chat.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground truncate max-w-[70%]">{chat.lastMessage}</p>

          {/* مؤشر غير مقروء */}
          {chat.unread ? (
            <span className="inline-flex" aria-label="غير مقروء">
              <CheckCircle2 className="h-4 w-4 text-sky-500" />
            </span>
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground opacity-25" aria-hidden="true" />
          )}
        </div>
      </div>

      {/* خانة تحديد عند وضع التحديد */}
      {selectionMode && (
        <div
          className={`absolute top-2 ${document.documentElement.dir === "rtl" ? "left-2" : "right-2"}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect();
          }}
        >
          <input
            type="checkbox"
            checked={!!chat.selected}
            readOnly
            aria-label={`تحديد المحادثة: ${chat.title}`}
            className="h-4 w-4 accent-primary"
          />
        </div>
      )}
    </div>
  );
};

const ChatPage: React.FC = () => {
  const [lang] = useState<Lang>("ar");
  const [authed, setAuthed] = useState(false);
  const [auth, setAuth] = useState<AuthForm>(initialAuth);

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [search, setSearch] = useState("");

  const activeChat = useMemo(() => chats.find((c) => c.id === activeId) || null, [chats, activeId]);

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  // سكروول لأسفل عند الرسائل
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages.length]);

  // دخول (واجهة فقط)
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth.name || !auth.email || !auth.phone || !auth.password) return;

    const demo: Chat[] = [
      {
        id: "c1",
        title: "أحمد",
        lastMessage: "تم استلام طلبك، سنعاودك قريبًا.",
        updatedAt: new Date().toISOString(),
        unread: true,
        notifications: 1,
        messages: [
          { id: "m1", from: "client", text: "مرحبا، أحتاج مساعدة في التأشيرة.", time: "10:05" },
          { id: "m2", from: "agent", text: "أهلًا أحمد، تم استلام طلبك ✨", time: "10:08", read: false },
        ],
      },
      {
        id: "c2",
        title: "نواف",
        lastMessage: "هل ما زلت بحاجة للدعم؟",
        updatedAt: new Date(Date.now() - 3600_000).toISOString(),
        unread: false,
        notifications: 0,
        messages: [
          { id: "m1", from: "client", text: "السلام عليكم", time: "09:00" },
          { id: "m2", from: "agent", text: "وعليكم السلام، كيف أقدر أخدمك؟", time: "09:02", read: true },
        ],
      },
    ];
    setChats(demo);
    setActiveId("c1");
    setAuthed(true);
  };

  // فتح محادثة → تعتبر مقروءة
  const openChat = (id: string) => {
    setActiveId(id);
    setChats((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, unread: false, notifications: 0, messages: c.messages.map((m) => ({ ...m, read: true })) }
          : c
      )
    );
  };

  // وضع التحديد
  const toggleSelectionMode = () => {
    setSelectionMode((s) => !s);
    if (selectionMode) setChats((prev) => prev.map((c) => ({ ...c, selected: false })));
  };

  const toggleSelectChat = (id: string) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c)));
  };

  // حذف المحدد أو الكل
  const deleteSelected = () => {
    const hasSelected = chats.some((c) => c.selected);
    const next = hasSelected ? chats.filter((c) => !c.selected) : [];
    setChats(next);
    if (!next.length) {
      setActiveId(null);
      setSelectionMode(false);
    } else if (activeId && !next.find((c) => c.id === activeId)) {
      setActiveId(next[0].id);
    }
  };

  // إرسال رسالة (عميل)
  const [draft, setDraft] = useState("");
  const sendMessage = () => {
    if (!draft.trim() || !activeChat) return;
    const msg: Message = {
      id: crypto.randomUUID(),
      from: "client",
      text: draft.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: true,
    };
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat.id
          ? { ...c, messages: [...c.messages, msg], lastMessage: msg.text, updatedAt: new Date().toISOString() }
          : c
      )
    );
    setDraft("");
    setTimeout(scrollToBottom, 50);
  };

  // محاكاة رد موظف
  const simulateAgentReply = () => {
    if (!activeChat) return;
    const reply: Message = {
      id: crypto.randomUUID(),
      from: "agent",
      text: "تم تحديث ملفك. راجع البريد ✉",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat.id
          ? {
              ...c,
              messages: [...c.messages, reply],
              lastMessage: reply.text,
              updatedAt: new Date().toISOString(),
              unread: true,
              notifications: (c.notifications ?? 0) + 1,
            }
          : c
      )
    );
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter((c) => c.title.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q));
  }, [search, chats]);

  // شاشة الدخول
  if (!authed) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-10">
        <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-2">تسجيل الدخول للدردشة</h2>
          <p className="text-sm text-muted-foreground mb-6">أدخل بياناتك للمتابعة إلى واجهة الدردشة.</p>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleLogin} noValidate>
            {/* الاسم */}
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="text-sm">
                الاسم الكامل
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  name="fullName"
                  title="الاسم الكامل"
                  className="w-full rounded-md bg-background border border-border px-10 py-2 outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="مثال: أحمد علي"
                  autoComplete="name"
                  value={auth.name}
                  onChange={(e) => setAuth((s) => ({ ...s, name: e.target.value }))}
                  required
                />
                <UserIcon className="h-4 w-4 absolute top-1/2 -translate-y-1/2 right-3 opacity-70" aria-hidden="true" />
              </div>
            </div>

            {/* البريد */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  title="البريد الإلكتروني"
                  type="email"
                  className="w-full rounded-md bg-background border border-border px-10 py-2 outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="name@example.com"
                  autoComplete="email"
                  value={auth.email}
                  onChange={(e) => setAuth((s) => ({ ...s, email: e.target.value }))}
                  required
                />
                <Mail className="h-4 w-4 absolute top-1/2 -translate-y-1/2 right-3 opacity-70" aria-hidden="true" />
              </div>
            </div>

            {/* الهاتف */}
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-sm">
                رقم الجوال
              </label>
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  title="رقم الجوال"
                  className="w-full rounded-md bg-background border border-border px-10 py-2 outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="05xxxxxxxx"
                  autoComplete="tel"
                  value={auth.phone}
                  onChange={(e) => setAuth((s) => ({ ...s, phone: e.target.value }))}
                  required
                />
                <Phone className="h-4 w-4 absolute top-1/2 -translate-y-1/2 right-3 opacity-70" aria-hidden="true" />
              </div>
            </div>

            {/* كلمة المرور */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  title="كلمة المرور"
                  type="password"
                  className="w-full rounded-md bg-background border border-border px-10 py-2 outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={auth.password}
                  onChange={(e) => setAuth((s) => ({ ...s, password: e.target.value }))}
                  required
                  minLength={6}
                />
                <Lock className="h-4 w-4 absolute top-1/2 -translate-y-1/2 right-3 opacity-70" aria-hidden="true" />
              </div>
            </div>

            <div className="md:col-span-2 flex items-center justify-between mt-2">
              <Link to="/#privacy" className="text-xs text-muted-foreground hover:text-foreground">
                بالضغط على “دخول” فأنت توافق على الشروط والخصوصية
              </Link>
              <button
                type="submit"
                className="rounded-md px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 transition"
                aria-label="تسجيل الدخول"
              >
                دخول
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // واجهة الدردشة بعد الدخول
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* القائمة الجانبية */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute top-1/2 -translate-y-1/2 right-3 opacity-70" aria-hidden="true" />
                <input
                  className="w-full rounded-md bg-background border border-border pl-3 pr-10 py-2 outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="ابحث عن محادثة…"
                  title="بحث المحادثات"
                  aria-label="بحث المحادثات"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {!!chats.length && (
                <button
                  className={`rounded-md border px-3 py-2 text-sm hover:bg-accent transition ${
                    selectionMode ? "bg-accent/60 border-border" : "border-border"
                  }`}
                  onClick={toggleSelectionMode}
                  aria-label="وضع حذف المحادثات"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* قائمة المحادثات */}
            {!chats.length ? (
              <EmptyIllustration />
            ) : filtered.length ? (
              <div className="flex flex-col gap-2 max-h-[60vh] lg:max-h-[72vh] overflow-auto">
                {filtered.map((c) => (
                  <ChatListItem
                    key={c.id}
                    chat={c}
                    active={c.id === activeId}
                    onOpen={() => openChat(c.id)}
                    selectionMode={selectionMode}
                    onToggleSelect={() => toggleSelectChat(c.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground py-10 text-center">لا توجد نتائج مطابقة</div>
            )}

            {/* أزرار الحذف */}
            {chats.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {selectionMode ? "اختر المحادثات ثم اضغط حذف" : "اضغط سلة المحذوفات للتحديد"}
                </span>
                <button
                  disabled={!selectionMode}
                  onClick={deleteSelected}
                  className={`rounded-md px-3 py-1.5 text-sm transition ${
                    selectionMode
                      ? "bg-destructive text-destructive-foreground hover:opacity-90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                  aria-label="حذف المحدد أو الكل"
                >
                  حذف المحدد/الكل
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* مساحة الرسائل */}
        <section className="lg:col-span-8 xl:col-span-9">
          <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur p-4 h-[70vh] flex flex-col">
            {!activeChat ? (
              <EmptyIllustration cta={false} />
            ) : (
              <>
                {/* ترويسة المحادثة */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/40 grid place-items-center">
                      <span className="font-bold" aria-hidden="true">
                        {activeChat.title.slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{activeChat.title}</p>
                      <p className="text-xs text-muted-foreground">
                        آخر تحديث: {new Date(activeChat.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={simulateAgentReply}
                      className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
                      aria-label="محاكاة رد من الموظف"
                    >
                      محاكاة رد
                    </button>
                    <button
                      className="rounded-md border border-border px-2.5 py-1.5 hover:bg-accent"
                      aria-label="حذف هذه المحادثة"
                      onClick={() => {
                        setChats((prev) => prev.filter((c) => c.id !== activeChat.id));
                        setActiveId(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* الرسائل */}
                <div className="flex-1 overflow-auto space-y-3 pr-1">
                  {activeChat.messages.map((m) => {
                    const mine = m.from === "client";
                    return (
                      <div
                        key={m.id}
                        className={`max-w-[80%] rounded-xl px-3 py-2 text-sm shadow-sm ${
                          mine ? "bg-primary text-primary-foreground ml-auto" : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{m.text}</p>
                        <div
                          className={`flex items-center gap-2 mt-1 text-[11px] opacity-80 ${
                            mine ? "justify-end" : "justify-start"
                          }`}
                        >
                          <span>{m.time}</span>
                          {!mine && !m.read && (
                            <span className="inline-flex" aria-label="غير مقروء">
                              <CheckCircle2 className="h-3.5 w-3.5 text-sky-500" />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* إدخال وإرسال */}
                <div className="pt-3 mt-3 border-t border-border/60 flex items-center gap-2">
                  <label htmlFor="chat-message" className="sr-only">
                    اكتب رسالتك
                  </label>
                  <input
                    id="chat-message"
                    name="message"
                    title="حقل الرسالة"
                    className="flex-1 rounded-md bg-background border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="اكتب رسالتك…"
                    aria-label="اكتب رسالتك"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <button
                    onClick={sendMessage}
                    className="rounded-md px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 transition inline-flex items-center gap-2"
                    aria-label="إرسال الرسالة"
                  >
                    إرسال
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChatPage;
