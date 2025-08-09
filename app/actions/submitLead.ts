"use server";

import {
  computeElapsedMsFromT0,
  makeInMemoryRateLimiter,
  parseFormData,
  validateLead,
} from "@/lib/actions/submitLeadCore";

const limiter = makeInMemoryRateLimiter({ maxRequests: 5, windowMs: 10 * 60 * 1000 });

export interface SubmitLeadResult {
  ok: boolean;
  message?: string;
  softWarning?: string;
}

export async function submitLead(formData: FormData): Promise<SubmitLeadResult> {
  const tStart = Date.now();

  try {
    const input = parseFormData(formData);

    // Honeypot & basic schema validation
    const validated = validateLead(input);
    if (!validated.success) {
      return { ok: false, message: validated.message };
    }

    // Timing guard: reject bot-quick submissions (< 800ms since t0)
    const elapsedClient = computeElapsedMsFromT0(input.t0);
    if (elapsedClient !== null && elapsedClient < 800) {
      return { ok: false, message: "Please take a moment and try again." };
    }

    // Simple per-session rate limit (instance local). Use more robust keying when headers available.
    const key = "anon-session"; // TODO: replace with IP/session fingerprint when available
    if (!limiter.check(key)) {
      return { ok: false, message: "Too many requests. Please try again later." };
    }

    // TODO (Story 4.3): send email via Resend/SMTP.
    // For this story, we return success quickly to keep p50 under 800ms.
    const elapsed = Date.now() - tStart;
    const softWarning = validated.softWarning;
    return { ok: true, message: `Thanks! We'll be in touch. (${elapsed}ms)`, softWarning };
  } catch (err) {
    const elapsed = Date.now() - tStart;
    console.error("submitLead_error", { elapsed, err: (err as Error)?.message });
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}


