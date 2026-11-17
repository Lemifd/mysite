// Demo recordings are served from this repository's public/video directory.
// An alternate media origin is optional and must be explicitly configured.
export const demoOrigin = import.meta.env.VITE_DEMO_ORIGIN ?? '';
export function demoUrl(path) { return new URL(path, demoOrigin || window.location.origin).href; }
