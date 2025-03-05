
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
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
          DEFAULT: "#2DD4BF",
          hover: "#14B8A6",
          light: "#99F6E4",
          dark: "#0F766E",
        },
        secondary: {
          DEFAULT: "#64748B",
          hover: "#475569",
          light: "#CBD5E1",
          dark: "#334155",
        },
        urgent: {
          DEFAULT: "#FB923C",
          hover: "#F97316",
          light: "#FFEDD5",
          dark: "#C2410C",
        },
        card: {
          DEFAULT: "rgba(255, 255, 255, 0.8)",
          foreground: "#1E293B",
          dark: "rgba(26, 31, 44, 0.8)",
          darkForeground: "#E2E8F0",
        },
        success: {
          DEFAULT: "#22C55E",
          hover: "#16A34A",
        },
        destructive: {
          DEFAULT: "#EF4444",
          hover: "#DC2626",
        },
        dark: {
          100: "#403E43",
          200: "#221F26",
          300: "#1A1F2C",
          400: "#222222",
          500: "#333333",
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
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
