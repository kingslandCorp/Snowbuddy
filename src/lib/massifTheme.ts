import type { Massif } from "../data/resorts";

interface MassifStyle {
  /** Tailwind gradient stops for accent bars/badges */
  gradient: string;
  text: string;
  ring: string;
  glow: string;
}

export const massifTheme: Record<Massif, MassifStyle> = {
  Alps: {
    gradient: "from-cyan-400 to-blue-600",
    text: "text-cyan-400",
    ring: "ring-cyan-500/40",
    glow: "shadow-cyan-500/20",
  },
  Dolomites: {
    gradient: "from-rose-400 to-orange-500",
    text: "text-rose-400",
    ring: "ring-rose-500/40",
    glow: "shadow-rose-500/20",
  },
  Pyrenees: {
    gradient: "from-emerald-400 to-teal-600",
    text: "text-emerald-400",
    ring: "ring-emerald-500/40",
    glow: "shadow-emerald-500/20",
  },
  Highlands: {
    gradient: "from-violet-400 to-indigo-600",
    text: "text-violet-400",
    ring: "ring-violet-500/40",
    glow: "shadow-violet-500/20",
  },
};
