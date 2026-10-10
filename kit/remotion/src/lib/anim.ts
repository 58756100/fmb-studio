// time helpers — everything is driven by absolute time t (seconds)
export const FPS = 60;
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lin = (t: number, t0: number, t1: number) => clamp((t - t0) / (t1 - t0));
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;

// easings
export const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);
export const easeOutQuint = (p: number) => 1 - Math.pow(1 - p, 5);
export const easeInCubic = (p: number) => p * p * p;
export const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
export const easeOutExpo = (p: number) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));

// damped spring (closed form, critically-under-damped), starts at t0, returns 0..~1 with overshoot
export const spring = (t: number, t0: number, { stiffness = 170, damping = 18, mass = 1 } = {}) => {
  const x = t - t0;
  if (x <= 0) return 0;
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * w0 * x) * (Math.cos(wd * x) + ((zeta * w0) / wd) * Math.sin(wd * x));
  }
  return 1 - Math.exp(-w0 * x) * (1 + w0 * x);
};
export const SOFT = { stiffness: 120, damping: 20 };
export const SNAPPY = { stiffness: 260, damping: 22 };
export const BOUNCY = { stiffness: 220, damping: 14 };
export const GENTLE = { stiffness: 80, damping: 18 };

// typed substring between t0..t1
export const typed = (text: string, t: number, t0: number, t1: number) => {
  const n = Math.round(lin(t, t0, t1) * text.length);
  return text.slice(0, n);
};
export const caretOn = (t: number) => Math.floor(t * 2.2) % 2 === 0;

// deterministic random
export const rnd = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
