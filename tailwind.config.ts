import type { Config } from "tailwindcss";

export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // ألوان مبنية على متغيّرات CSS لديك
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        "card-border": "hsl(var(--card-border))",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",

        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        "primary-light": "hsl(var(--primary-light))",
        "primary-dark": "hsl(var(--primary-dark))",

        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",

        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",

        surface: "hsl(var(--surface))",
        "surface-elevated": "hsl(var(--surface-elevated))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        elegant: "var(--shadow-elegant)",
        glass: "var(--shadow-glass)",
      },
      backgroundImage: {
        "gradient-hero": "var(--gradient-hero)",
        "gradient-brand": "var(--gradient-brand)",
        "gradient-accent": "var(--gradient-accent)",
      },
    },
  },
  plugins: [],
} satisfies Config;
