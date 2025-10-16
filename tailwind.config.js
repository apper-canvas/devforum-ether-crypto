/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2C5282",
        secondary: "#4A5568",
        accent: "#F59E0B",
        surface: "#FFFFFF",
        background: "#F7FAFC",
        success: "#48BB78",
        warning: "#ED8936",
        error: "#F56565",
        info: "#4299E1"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"]
      }
    },
  },
  plugins: [],
}