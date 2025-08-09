import { z } from "zod";

export interface LeadInput {
  name: string;
  email: string;
  company: string;
  whatsapp?: string;
  website?: string; // honeypot
  t0?: string; // client start timestamp ms (stringified number)
}

export interface LeadResult {
  ok: boolean;
  message?: string;
  softWarning?: string;
}

export const leadSchemaServer = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1).email("Enter a valid email"),
  company: z.string().min(1, "Company is required"),
  whatsapp: z.string().optional(),
  website: z.string().max(0).optional(),
  t0: z.string().regex(/^\d+$/).optional(),
});

const FREE_MAIL = new Set(
  [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "aol.com",
    "proton.me",
    "protonmail.com",
    "mail.com",
    "zoho.com",
    "yandex.com",
    "live.com",
    "msn.com",
    "pm.me",
  ].map((s) => s.toLowerCase()),
);

export function isFreeMail(email: string): boolean {
  const domain = email.split("@").pop()?.toLowerCase();
  if (!domain) return false;
  return FREE_MAIL.has(domain);
}

export function parseFormData(data: FormData): LeadInput {
  const obj = Object.fromEntries(data) as Record<string, string>;
  return {
    name: obj.name ?? "",
    email: obj.email ?? "",
    company: obj.company ?? "",
    whatsapp: obj.whatsapp || undefined,
    website: obj.website || undefined,
    t0: obj.t0 || undefined,
  };
}

export interface RateLimiterOptions {
  maxRequests: number; // e.g., 5
  windowMs: number; // e.g., 10 * 60 * 1000
}

export function makeInMemoryRateLimiter(options: RateLimiterOptions) {
  const store = new Map<string, number[]>();
  const { maxRequests, windowMs } = options;
  return {
    check(key: string, now: number = Date.now()): boolean {
      const arr = store.get(key) ?? [];
      const cutoff = now - windowMs;
      const recent = arr.filter((ts) => ts > cutoff);
      recent.push(now);
      store.set(key, recent);
      return recent.length <= maxRequests;
    },
    // for tests
    getCount(key: string, now: number = Date.now()): number {
      const arr = store.get(key) ?? [];
      const cutoff = now - windowMs;
      return arr.filter((ts) => ts > cutoff).length;
    },
    reset(key?: string) {
      if (key) store.delete(key);
      else store.clear();
    },
  };
}

export function computeElapsedMsFromT0(t0?: string): number | null {
  if (!t0) return null;
  const start = Number(t0);
  if (!Number.isFinite(start)) return null;
  return Date.now() - start;
}

export function validateLead(input: LeadInput): { success: true; data: LeadInput; softWarning?: string } | { success: false; message: string } {
  const parsed = leadSchemaServer.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Invalid form." };
  }
  if (parsed.data.website && parsed.data.website.length > 0) {
    return { success: false, message: "Invalid form." };
  }
  const softWarning = isFreeMail(parsed.data.email)
    ? "Using a personal email may reduce deliverability."
    : undefined;
  return { success: true, data: parsed.data, softWarning };
}


