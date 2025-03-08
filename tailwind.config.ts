import type { Config } from "tailwindcss";

export default {
  plugins: [require("daisyui")],
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("daisyui")],
  daisyui: {
    themes: [
      {
        "@plugin": "daisyui/theme",
        name: "dracula",
        default: false,
        prefersdark: false,
        "color-scheme": "dark",
        "--color-base-100": "oklch(28.822% 0.022 277.508)",
        "--color-base-200": "oklch(26.805% 0.02 277.508)",
        "--color-base-300": "oklch(24.787% 0.019 277.508)",
        "--color-base-content": "oklch(97.747% 0.007 106.545)",
        "--color-primary": "oklch(75.461% 0.183 346.812)",
        "--color-primary-content": "oklch(15.092% 0.036 346.812)",
        "--color-secondary": "oklch(74.202% 0.148 301.883)",
        "--color-secondary-content": "oklch(14.84% 0.029 301.883)",
        "--color-accent": "oklch(83.392% 0.124 66.558)",
        "--color-accent-content": "oklch(16.678% 0.024 66.558)",
        "--color-neutral": "oklch(39.445% 0.032 275.524)",
        "--color-neutral-content": "oklch(87.889% 0.006 275.524)",
        "--color-info": "oklch(88.263% 0.093 212.846)",
        "--color-info-content": "oklch(17.652% 0.018 212.846)",
        "--color-success": "oklch(87.099% 0.219 148.024)",
        "--color-success-content": "oklch(17.419% 0.043 148.024)",
        "--color-warning": "oklch(95.533% 0.134 112.757)",
        "--color-warning-content": "oklch(19.106% 0.026 112.757)",
        "--color-error": "oklch(68.22% 0.206 24.43)",
        "--color-error-content": "oklch(13.644% 0.041 24.43)",
        "--radius-selector": "1rem",
        "--radius-field": "0.5rem",
        "--radius-box": "1rem",
        "--size-selector": "0.25rem",
        "--size-field": "0.25rem",
        "--border": "1px",
        "--depth": "0",
        "--noise": "0"
      },
      "light", "cupcake", "bumblebee", "emerald"
    ],
  },
}
