import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#fff0ef",
        surface: "#fff9f9",
        "surface-alt": "#ffe1e3",
        text: "#493434",
        "text-muted": "#826b6a",
        accent: "#f8869a",
        "accent-strong": "#db4b71",
        secondary: "#f2bade",
        tertiary: "#f5dc98",
        success: "#93e4a4",
        border: "#f2d7d6",
      },
      fontFamily: {
        heading: ["var(--font-baloo-2)", "var(--font-quicksand)", "-apple-system", "sans-serif"],
        body: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        base: "clamp(1.05rem, 1rem + 0.3vw, 1.2rem)",
        heading: "clamp(2.5rem, 1.8rem + 3.5vw, 4.25rem)",
        subheading: "clamp(1.25rem, 1.1rem + 0.8vw, 1.75rem)",
      },
      spacing: {
        section: "clamp(2.5rem, 2rem + 2.5vw, 6rem)",
        md: "clamp(1rem, 0.9rem + 0.5vw, 1.5rem)",
        sm: "0.5rem",
      },
      borderRadius: {
        card: "1.75rem",
        row: "1.25rem",
      },
      boxShadow: {
        card: "0 8px 24px rgba(248, 134, 154, 0.18)",
        "card-hover": "0 12px 28px rgba(248, 134, 154, 0.3)",
        row: "0 4px 14px rgba(248, 134, 154, 0.12)",
        "row-hover": "0 8px 20px rgba(248, 134, 154, 0.25)",
        icon: "0 4px 14px rgba(248, 134, 154, 0.25)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        normal: "220ms",
      },
    },
  },
};

export default config;
