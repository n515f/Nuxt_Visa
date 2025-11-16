// src/lib/api.ts — FIXED FINAL (React/Vite)

// ====== Vite env typing (بدون any) ======
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE?: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
// مثال .env.local:
// VITE_API_BASE=http://localhost/nuxt-visa-api/public/api

// تعريف واحد فقط لـ API_BASE (بدون any)
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE) ??
  "http://localhost/nuxt-visa-api/public/api";

// ========= Types =========
export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
};

export type Ticket = {
  id: number;
  subject: string;
  content: string;
  status: "open" | "closed" | string;
  created_at: string;
};

export type MessageItem = {
  id: number;
  body: string;
  created_at: string;
};

export type NotificationItem = {
  id: number;
  title: string;
  body?: string;
  is_read: 0 | 1;
  created_at: string;
};

// ========= Errors =========
export class ApiHttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiHttpError";
    this.status = status;
  }
}

// ========= Config =========
export const AUTH_TOKEN_KEY = "auth_token";
export const AUTH_USER_KEY = "auth_user";

// ========= Auth Storage =========
export function getAuth(): { token: string | null; user: User | null } {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const raw = localStorage.getItem(AUTH_USER_KEY);
    const user = raw ? (JSON.parse(raw) as User) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

export function setAuth(token: string, user: User) {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  } catch {
    // ignore
  }
}

export function getAuthHeader(): Record<string, string> {
  const { token } = getAuth();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ========= Core request =========
async function request<TResp>(path: string, init?: RequestInit): Promise<TResp> {
  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const authHeaders = getAuthHeader();

  // طبع headers كـ object بسيط (حلّ لمشاكل TS/HeadersInit)
  const extra: Record<string, string> = {};
  if (init?.headers) {
    if (init.headers instanceof Headers) {
      init.headers.forEach((v, k) => {
        extra[k] = v;
      });
    } else if (Array.isArray(init.headers)) {
      for (const [k, v] of init.headers) extra[k] = v as string;
    } else {
      Object.assign(extra, init.headers as Record<string, string>);
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...baseHeaders, ...authHeaders, ...extra },
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = (await res.json()) as { error?: string; message?: string };
      if (body?.error) msg = body.error;
      else if (body?.message) msg = body.message;
    } catch {
      // ignore
    }
    throw new ApiHttpError(res.status, msg);
  }

  if (res.status === 204) return undefined as unknown as TResp;
  return (await res.json()) as TResp;
}

// ========= Endpoints =========

// --- Auth (/public/api/auth/*.php) ---
export async function apiRegister(data: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}) {
  // رجوع: { token, user }
  return request<{ token: string; user: User }>("/auth/register.php", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiLogin(data: { email: string; password: string }) {
  // رجوع: { token, user }
  return request<{ token: string; user: User }>("/auth/login.php", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiMe() {
  // رجوع: { user }
  return request<{ user: User }>("/auth/me.php", { method: "GET" });
}

// --- Tickets ---
export async function apiTicketsList() {
  // رجوع: { tickets: Ticket[] }
  return request<{ tickets: Ticket[] }>("/tickets/index.php", {
    method: "GET",
  });
}

export async function apiTicketCreate(data: {
  subject: string;
  content: string;
}) {
  // رجوع: { message, ticket_id, token }
  return request<{ message: string; ticket_id: number; token: string }>(
    "/tickets/create.php",
    { method: "POST", body: JSON.stringify(data) }
  );
}

// --- Messages ---
export async function apiMessagesList(params: {
  ticket_id: number;
  page?: number;
  per_page?: number;
}) {
  const p = new URLSearchParams();
  p.set("ticket_id", String(params.ticket_id));
  if (params.page) p.set("page", String(params.page));
  if (params.per_page) p.set("per_page", String(params.per_page));
  // رجوع: { page, per_page, messages: MessageItem[] }
  return request<{ page: number; per_page: number; messages: MessageItem[] }>(
    `/messages/index.php?${p.toString()}`,
    { method: "GET" }
  );
}

export async function apiMessageCreate(data: {
  ticket_id: number;
  body: string;
}) {
  // رجوع: { message: "created", ticket_id }
  return request<{ message: string; ticket_id: number }>(
    "/messages/create.php",
    { method: "POST", body: JSON.stringify(data) }
  );
}

// --- Notifications ---
export async function apiNotificationsList(opts?: { unread?: boolean }) {
  const p = new URLSearchParams();
  if (opts?.unread) p.set("unread", "1");
  // رجوع: { notifications: NotificationItem[] }
  const qs = p.toString();
  return request<{ notifications: NotificationItem[] }>(
    `/notifications/index.php${qs ? `?${qs}` : ""}`,
    { method: "GET" }
  );
}

export async function apiNotificationsMarkAllRead() {
  // رجوع: { message: "all marked as read" }
  return request<{ message: string }>("/notifications/mark_read.php", {
    method: "POST",
    body: JSON.stringify({ all: true }),
  });
}

export async function apiNotificationsMarkOne(id: number) {
  // رجوع: { message: "ok" | ... }
  return request<{ message: string }>("/notifications/mark_read.php", {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}

// --- Contact (غير مفعّل بالباك إند الحالي) ---
export type ContactPayload = { name: string; email: string; message: string };
export type ContactCreateResponse = { ok: boolean; id: number };

// ملاحظة: لا يوجد /contacts في الباك إند الحالي.
// إن أضفته لاحقًا كـ POST /public/api/contacts.php استخدم السطر التالي:
export async function apiCreateContact(_payload: ContactPayload) {
  throw new Error("Contact API is not implemented in backend yet.");
}

// ========= Legacy aliases (إن لديك استيرادات قديمة) =========
export const api = {
  register: apiRegister,
  login: apiLogin,
  me: apiMe,
  ticketsList: apiTicketsList,
  ticketCreate: apiTicketCreate,
  messagesList: apiMessagesList,
  messageCreate: apiMessageCreate,
  notificationsList: apiNotificationsList,
  notificationsMarkAllRead: apiNotificationsMarkAllRead,
  notificationsMarkOne: apiNotificationsMarkOne,
  createContact: apiCreateContact, // غير مفعّل
};

// Aliases
export const register = apiRegister;
export const login = apiLogin;
export const me = apiMe;

// --- AI Assistant (افتراضي: POST /ai/chat)
// TODO: عدّل URL لتطابق endpoint الفعلي في الباك-إند
export async function apiAiChat(payload: { user_id: number; message: string; ticket_id?: number }) {
  return request<{ ok: boolean; ticket_id?: number; reply?: string }>(
    "/ai/chat",
    {
      method: "POST", 
      body: JSON.stringify(payload),
    }
  );
}
