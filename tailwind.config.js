export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#137fec",
        "background-light": "#FFFFFF",
        "background-dark": "#0A0F18",
        "text-light": "#1A1A1A",
        "text-dark": "#E0E0E0",
        "text-muted-light": "#6B6B6B",
        "text-muted-dark": "#999999",
        "border-light": "#E0E0E0",
        "border-dark": "#2A3040",
        accent: "#137fec",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        serif: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
}
