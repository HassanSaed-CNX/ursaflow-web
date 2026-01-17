import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
        // Core semantic colors mapped to CSS variables
        background: "hsl(var(--background))",
        surface: "hsl(var(--surface))",
        header: "hsl(var(--header))",
        "header-foreground": "hsl(var(--header-foreground))",
        text: "hsl(var(--text))",
        "text-muted": "hsl(var(--text-muted))",
        border: "hsl(var(--border))",
        "border-strong": "hsl(var(--border-strong))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        "accent-hover": "hsl(var(--accent-hover))",
        success: "hsl(var(--success))",
        "success-foreground": "hsl(var(--success-foreground))",
        warning: "hsl(var(--warning))",
        "warning-foreground": "hsl(var(--warning-foreground))",
        danger: "hsl(var(--danger))",
        "danger-foreground": "hsl(var(--danger-foreground))",
        focus: "hsl(var(--focus))",
        ring: "hsl(var(--ring))",
        
        // Legacy shadcn compatibility
        foreground: "hsl(var(--text))",
        primary: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--text))",
        },
        destructive: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--danger-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--background))",
          foreground: "hsl(var(--text-muted))",
        },
        popover: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--text))",
        },
        card: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--text))",
        },
        input: "hsl(var(--border))",
        sidebar: {
          DEFAULT: "hsl(var(--header))",
          foreground: "hsl(var(--header-foreground))",
          primary: "hsl(var(--accent))",
          "primary-foreground": "hsl(var(--accent-foreground))",
          accent: "hsl(var(--surface))",
          "accent-foreground": "hsl(var(--text))",
          border: "hsl(var(--border))",
          ring: "hsl(var(--focus))",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius)",
        sm: "var(--radius-sm)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
