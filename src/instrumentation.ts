export async function register() {
  // In Node >=25, `localStorage`/`sessionStorage` can exist on the server via
  // Node's internal webstorage implementation. Next's dev overlay (and some libs)
  // use a presence check (`typeof localStorage !== "undefined"`) to decide whether
  // they're in a browser, which can break SSR if these globals exist.
  if (typeof window !== "undefined") return;

  for (const key of ["localStorage", "sessionStorage"] as const) {
    try {
      const desc = Object.getOwnPropertyDescriptor(globalThis, key);
      if (desc && desc.configurable === false) continue;

      Object.defineProperty(globalThis, key, {
        value: undefined,
        writable: false,
        enumerable: false,
        configurable: true,
      });
    } catch {
      // Best-effort only. If the property is non-configurable, we just leave it.
    }
  }
}

