import "@testing-library/jest-dom/vitest";

// Polyfills for DOM APIs used by Lenis/ScrollStack in JSDOM
if (typeof (globalThis as any).ResizeObserver === "undefined") {
  (globalThis as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Basic matchMedia polyfill for tests
if (typeof (window as any).matchMedia !== "function") {
  (window as any).matchMedia = (query: string) => {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as unknown as MediaQueryList;
  };
}
