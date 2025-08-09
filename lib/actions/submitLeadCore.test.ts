import { describe, it, expect } from "vitest";
import {
  computeElapsedMsFromT0,
  isFreeMail,
  makeInMemoryRateLimiter,
  parseFormData,
  validateLead,
} from "./submitLeadCore";

describe("submitLeadCore", () => {
  it("detects free mail domains", () => {
    expect(isFreeMail("a@gmail.com")).toBe(true);
    expect(isFreeMail("b@company.com")).toBe(false);
  });

  it("parses form data", () => {
    const fd = new FormData();
    fd.set("name", "Jane");
    fd.set("email", "jane@company.com");
    fd.set("company", "ACME");
    const parsed = parseFormData(fd);
    expect(parsed.name).toBe("Jane");
    expect(parsed.email).toBe("jane@company.com");
    expect(parsed.company).toBe("ACME");
  });

  it("validates lead and returns soft warning for free mail", () => {
    const result = validateLead({ name: "J", email: "x@gmail.com", company: "C" });
    if (result.success) {
      expect(result.softWarning).toBeDefined();
    } else {
      throw new Error("expected success");
    }
  });

  it("rate limiter allows within window and blocks after threshold", () => {
    const limiter = makeInMemoryRateLimiter({ maxRequests: 2, windowMs: 1000 });
    const key = "k";
    expect(limiter.check(key, 0)).toBe(true);
    expect(limiter.check(key, 500)).toBe(true);
    expect(limiter.check(key, 900)).toBe(false);
    // after window
    expect(limiter.check(key, 2000)).toBe(true);
  });

  it("computes elapsed from t0 string", () => {
    const now = Date.now();
    const earlier = String(now - 1000);
    const diff = computeElapsedMsFromT0(earlier);
    expect(diff).toBeGreaterThanOrEqual(0);
  });
});


