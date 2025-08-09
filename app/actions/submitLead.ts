"use server";

import {
  computeElapsedMsFromT0,
  makeInMemoryRateLimiter,
  parseFormData,
  validateLead,
} from "@/lib/actions/submitLeadCore";
import { Resend } from "resend";
import nodemailer from "nodemailer";

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

    // Email delivery (Resend primary, SMTP fallback)
    const subject = "New Neo Nova Lead";
    const html = `
      <h2>New Lead</h2>
      <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p><strong>Company:</strong> ${escapeHtml(input.company)}</p>
      ${input.whatsapp ? `<p><strong>WhatsApp:</strong> ${escapeHtml(input.whatsapp)}</p>` : ""}
    `;
    const text = `New Lead\nName: ${input.name}\nEmail: ${input.email}\nCompany: ${input.company}\n$${
      input.whatsapp ? `WhatsApp: ${input.whatsapp}\n` : ""
    }`;

    const to = process.env.SALES_EMAIL;
    if (!to) {
      return { ok: false, message: "Server is missing SALES_EMAIL configuration." };
    }

    let delivered = false;
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: "Neo Nova <no-reply@neonova.local>",
          to,
          subject,
          html,
          text,
        });
        delivered = true;
      } catch {
        // fall through to SMTP
      }
    }

    if (!delivered) {
      const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
      if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
        const transport = nodemailer.createTransport({
          host: SMTP_HOST,
          port: Number(SMTP_PORT),
          secure: Number(SMTP_PORT) === 465,
          auth: { user: SMTP_USER, pass: SMTP_PASS },
        });
        await transport.sendMail({
          from: `Neo Nova <${SMTP_USER}>`,
          to,
          subject,
          html,
          text,
        });
        delivered = true;
      }
    }

    if (!delivered) {
      return {
        ok: false,
        message: "Email send failed. Please try again later or use WhatsApp.",
      };
    }

    const elapsed = Date.now() - tStart;
    const softWarning = validated.softWarning;
    return { ok: true, message: `Thanks! We'll be in touch. (${elapsed}ms)`, softWarning };
  } catch (err) {
    const elapsed = Date.now() - tStart;
    console.error("submitLead_error", { elapsed, err: (err as Error)?.message });
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}


