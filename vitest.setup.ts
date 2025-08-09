import "@testing-library/jest-dom/vitest";

// Polyfills for DOM APIs used by Lenis/ScrollStack in JSDOM
if (typeof (globalThis as any).ResizeObserver === "undefined") {
  (globalThis as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
