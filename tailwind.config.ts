// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        // Font families
        inter: ["var(--font-inter)", "sans-serif"],
        playfair: ["var(--font-playfair)", "serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      fontSize: {
        // Heading sizes
        "heading-1": ["2.5rem", { lineHeight: "1.2" }],
        "heading-2": ["2rem", { lineHeight: "1.3" }],
        "heading-3": ["1.5rem", { lineHeight: "1.4" }],
        "heading-4": ["1.25rem", { lineHeight: "1.4" }],
        // Body sizes
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        body: ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        "body-xs": ["0.75rem", { lineHeight: "1.4" }],
      },
    },
  },
  plugins: [],
};

export default config;
