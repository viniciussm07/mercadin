/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/App.tsx", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
