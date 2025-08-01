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
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        "gradient-animation": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "glow-pulse": {
          "0%": { opacity: "0.5" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
          "100%": { opacity: "0.5" },
        },
        "gentle-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        "glow-shadow": {
          "0%, 100%": { boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3), 0 4px 6px -4px rgba(99, 102, 241, 0.3)" },
          "50%": { boxShadow: "0 15px 20px -3px rgba(99, 102, 241, 0.4), 0 8px 10px -4px rgba(99, 102, 241, 0.4)" },
        },
        "pulse-slow": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
        "rotate-left": {
          "0%": { transform: "rotate(-6deg) translateX(-12px)" },
          "33%": { transform: "rotate(-10deg) translateX(-10px)" },
          "66%": { transform: "rotate(-4deg) translateX(-14px)" },
          "100%": { transform: "rotate(-6deg) translateX(-12px)" },
        },
        "rotate-right": {
          "0%": { transform: "rotate(6deg) translateX(12px)" },
          "33%": { transform: "rotate(10deg) translateX(10px)" },
          "66%": { transform: "rotate(4deg) translateX(14px)" },
          "100%": { transform: "rotate(6deg) translateX(12px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "gradient-animation": "gradient-animation 6s ease infinite",
        "float": "float 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s infinite ease-in-out",
        "gentle-bounce": "gentle-bounce 3s infinite ease-in-out",
        "glow-shadow": "glow-shadow 3s infinite ease-in-out",
        "pulse-slow": "pulse-slow 3s infinite ease-in-out",
        "rotate-left": "rotate-left 5s infinite ease-in-out",
        "rotate-right": "rotate-right 5s infinite ease-in-out",
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
      {
        "@plugin": "daisyui/theme",
        name: "nebula",
        default: true,
        prefersdark: true,
        "color-scheme": "dark",
        "--color-base-100": "oklch(15% 0.025 270)",
        "--color-base-200": "oklch(12% 0.02 270)",
        "--color-base-300": "oklch(10% 0.015 270)",
        "--color-base-content": "oklch(98% 0.005 100)",
        "--color-primary": "oklch(70% 0.2 265)",
        "--color-primary-content": "oklch(98% 0.003 100)",
        "--color-secondary": "oklch(70% 0.18 320)",
        "--color-secondary-content": "oklch(98% 0.003 100)",
        "--color-accent": "oklch(75% 0.15 190)",
        "--color-accent-content": "oklch(10% 0.015 190)",
        "--color-neutral": "oklch(30% 0.025 270)",
        "--color-neutral-content": "oklch(90% 0.003 270)",
        "--color-info": "oklch(80% 0.15 210)",
        "--color-info-content": "oklch(10% 0.015 210)",
        "--color-success": "oklch(75% 0.2 150)",
        "--color-success-content": "oklch(10% 0.02 150)",
        "--color-warning": "oklch(90% 0.15 90)",
        "--color-warning-content": "oklch(10% 0.015 90)",
        "--color-error": "oklch(70% 0.2 25)",
        "--color-error-content": "oklch(98% 0.003 25)",
        "--radius-selector": "1rem",
        "--radius-field": "0.75rem",
        "--radius-box": "1.25rem",
        "--size-selector": "0.25rem",
        "--size-field": "0.25rem",
        "--border": "1px",
        "--depth": "0",
        "--noise": "0"
      },
      {
        "@plugin": "daisyui/theme",
        name: "sunset",
        prefersdark: false,
        "color-scheme": "light",
        "--color-base-100": "oklch(98% 0.01 90)",
        "--color-base-200": "oklch(95% 0.01 90)",
        "--color-base-300": "oklch(92% 0.01 90)",
        "--color-base-content": "oklch(25% 0.02 90)",
        "--color-primary": "oklch(65% 0.2 30)",
        "--color-primary-content": "oklch(98% 0.003 30)",
        "--color-secondary": "oklch(70% 0.15 350)",
        "--color-secondary-content": "oklch(98% 0.003 350)",
        "--color-accent": "oklch(80% 0.12 60)",
        "--color-accent-content": "oklch(25% 0.02 60)",
        "--color-neutral": "oklch(50% 0.02 90)",
        "--color-neutral-content": "oklch(95% 0.01 90)",
        "--color-info": "oklch(75% 0.15 210)",
        "--color-info-content": "oklch(98% 0.003 210)",
        "--color-success": "oklch(70% 0.2 150)",
        "--color-success-content": "oklch(98% 0.003 150)",
        "--color-warning": "oklch(85% 0.15 90)",
        "--color-warning-content": "oklch(25% 0.02 90)",
        "--color-error": "oklch(65% 0.2 25)",
        "--color-error-content": "oklch(98% 0.003 25)",
        "--radius-selector": "1rem",
        "--radius-field": "0.75rem",
        "--radius-box": "1.25rem",
        "--size-selector": "0.25rem",
        "--size-field": "0.25rem",
        "--border": "1px",
        "--depth": "1",
        "--noise": "0"
      },
      "light", "cupcake", "bumblebee", "emerald"
    ],
  },
}
