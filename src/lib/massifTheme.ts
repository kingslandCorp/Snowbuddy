import type { Massif } from "../data/resorts";

interface MassifStyle {
  /** Tailwind gradient stops for accent bars/badges */
  gradient: string;
  /** Text color tuned for contrast on a white background */
  text: string;
}

export const massifTheme: Record<Massif, MassifStyle> = {
  Alps: {
    gradient: "from-cyan-400 to-blue-600",
    text: "text-blue-600",
  },
  Dolomites: {
    gradient: "from-rose-400 to-orange-500",
    text: "text-rose-600",
  },
  Pyrenees: {
    gradient: "from-emerald-400 to-teal-600",
    text: "text-teal-600",
  },
  Highlands: {
    gradient: "from-violet-400 to-indigo-600",
    text: "text-violet-600",
  },
};
