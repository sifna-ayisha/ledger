module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./context/**/*.{js,jsx}", "./lib/**/*.{js,jsx}", "./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 500: "#10B981", 600: "#059669" },
        success: "#22C55E",
        expense: "#EF4444",
        ledgerBg: "#F8FAFC",
        ledgerText: "#0F172A",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
