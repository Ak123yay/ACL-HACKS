// frontend/tailwind.config.js
/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mirror: {
          50:  '#F5F3FF',
          100: '#EDE9FF',
          200: '#C4B5FD',
          500: '#6B46C1',
          700: '#4C1D95',
          900: '#2E1065',
        }
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
};
