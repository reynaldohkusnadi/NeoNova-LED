"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { z } from "zod";
import { content } from "@/content/site";
import { track } from "@/lib/analytics/track";
import { submitLead } from "@/app/actions/submitLead";

interface SubmitResult {
  ok: boolean;
  message: string;
}

const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Work email is required").email("Enter a valid email"),
  company: z.string().min(1, "Company is required"),
  whatsapp: z.string().optional(),
});

export default function SlideOverForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const lastFocusableRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const liveRegionRef = useRef<HTMLDivElement | null>(null);

  const nameId = useId();
  const emailId = useId();
  const companyId = useId();
  const whatsappId = useId();
  const descriptionId = useId();

  const [fields, setFields] = useState({
    name: "",
    email: "",
    company: "",
    whatsapp: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof fields, string>>>({});

  const open = useCallback((source?: string) => {
    setIsOpen(true);
    setSubmitResult(null);
    setTimeout(() => firstFieldRef.current?.focus(), 0);
    track({ name: "form_open", props: { source } });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setErrors({});
    setSubmitResult(null);
    setTimeout(() => previouslyFocusedRef.current?.focus(), 0);
  }, []);

  // Listen for global open event dispatched by navbar bridge
  useEffect(() => {
    function onOpen(ev: Event) {
      const detail = (ev as CustomEvent).detail as { source?: string } | undefined;
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
      open(detail?.source);
    }
    window.addEventListener("nn:openSlideOver", onOpen);
    return () => window.removeEventListener("nn:openSlideOver", onOpen);
  }, [open]);

  // ESC to close and basic focus trap
  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable || focusable.length === 0) return;
        const elements = Array.from(focusable).filter(
          (el) => !el.hasAttribute("disabled"),
        );
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            (last as HTMLElement).focus();
          }
        } else if (document.activeElement === last) {
          e.preventDefault();
          (first as HTMLElement).focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }, []);

  const validate = useCallback(() => {
    const parsed = leadSchema.safeParse(fields);
    if (parsed.success) {
      setErrors({});
      return true;
    }
    const newErrors: Partial<Record<keyof typeof fields, string>> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path[0];
      if (typeof path === "string")
        newErrors[path as keyof typeof fields] = issue.message;
    }
    setErrors(newErrors);
    return false;
  }, [fields]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validate()) return;
      setIsSubmitting(true);

      const fd = new FormData(e.currentTarget);
      // timing guard start sent from client open time
      if (!fd.get("t0")) fd.set("t0", String(Date.now() - 1200));

      const res = await submitLead(fd);
      track({ name: res.ok ? "form_submit_success" : "form_submit_error" });
      setIsSubmitting(false);
      setSubmitResult({ ok: res.ok, message: res.message ?? content.form.success });
      if (liveRegionRef.current && res.message) liveRegionRef.current.textContent = res.message;
    },
    [validate],
  );

  return (
    <section aria-label="Lead form">
      {/* Trigger section remains in page for progressive enhancement */}
      <div className="sr-only" aria-live="polite" ref={liveRegionRef} />

      {/* Overlay */}
      <div
        aria-hidden={!isOpen}
        className={
          isOpen
            ? "fixed inset-0 z-[var(--nn-z-modal)] bg-black/50 backdrop-blur-xs block"
            : "hidden"
        }
        onClick={() => close()}
      />

      {/* Slide-over Panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={descriptionId}
        className={
          isOpen
            ? "fixed inset-y-0 right-0 z-[calc(var(--nn-z-modal)+1)] w-full max-w-md bg-[var(--background)] shadow-xl border-l outline-none transform translate-x-0 transition-transform"
            : "fixed inset-y-0 right-0 z-[calc(var(--nn-z-modal)+1)] w-full max-w-md bg-[var(--background)] shadow-xl border-l outline-none transform translate-x-full transition-transform"
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 id={descriptionId} className="text-lg font-medium">
            Request pricing
          </h2>
          <button
            type="button"
            onClick={close}
            className="inline-flex h-9 px-3 items-center justify-center rounded-md border"
            aria-label="Close form"
            ref={lastFocusableRef}
          >
            Close
          </button>
        </div>

        <form className="p-4 grid gap-4" onSubmit={onSubmit} noValidate>
          {/* Honeypot + timing fields */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
          <input type="hidden" name="t0" value={String(Date.now())} />
          <div className="grid gap-1">
            <label htmlFor={nameId}>Name</label>
            <input
              id={nameId}
              name="name"
              ref={firstFieldRef}
              value={fields.name}
              onChange={onChange}
              className="h-10 px-3 rounded-md border"
              aria-invalid={Boolean(errors.name) || undefined}
              aria-describedby={errors.name ? `${nameId}-error` : undefined}
              required
            />
            {errors.name && (
              <p id={`${nameId}-error`} className="text-sm text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <label htmlFor={emailId}>Work Email</label>
            <input
              id={emailId}
              name="email"
              inputMode="email"
              autoCapitalize="off"
              autoCorrect="off"
              value={fields.email}
              onChange={onChange}
              className="h-10 px-3 rounded-md border"
              aria-invalid={Boolean(errors.email) || undefined}
              aria-describedby={errors.email ? `${emailId}-error` : undefined}
              required
            />
            {errors.email && (
              <p id={`${emailId}-error`} className="text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <label htmlFor={companyId}>Company</label>
            <input
              id={companyId}
              name="company"
              value={fields.company}
              onChange={onChange}
              className="h-10 px-3 rounded-md border"
              aria-invalid={Boolean(errors.company) || undefined}
              aria-describedby={errors.company ? `${companyId}-error` : undefined}
              required
            />
            {errors.company && (
              <p id={`${companyId}-error`} className="text-sm text-red-600">
                {errors.company}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <label htmlFor={whatsappId}>WhatsApp</label>
            <input
              id={whatsappId}
              name="whatsapp"
              inputMode="tel"
              value={fields.whatsapp}
              onChange={onChange}
              className="h-10 px-3 rounded-md border"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              className="inline-flex h-9 px-3 items-center justify-center rounded-md border"
              onClick={close}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-9 px-4 items-center justify-center rounded-md bg-[var(--nn-foreground)] text-[var(--nn-primary-contrast)] disabled:opacity-60"
            >
              {isSubmitting ? "Submitting…" : content.form.ctaPrimary}
            </button>
          </div>

          {submitResult && (
            <p className="text-sm" aria-live="polite" role="status">
              {submitResult.message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
