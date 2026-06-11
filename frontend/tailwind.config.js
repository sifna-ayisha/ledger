module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./context/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 500: "#10B981", 600: "#059669" },
        success: "#22C55E",
        expense: "#EF4444",
        ledgerBg: "#F8FAFC",
        ledgerText: "#0F172A",
      },
    },
  },
  plugins: [],
};
