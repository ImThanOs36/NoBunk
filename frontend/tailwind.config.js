/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'ranade': ['ranade', 'sans-serif'],
        'excon': ['excon', 'sans-serif'],
      },
    }
  },
  plugins: [],
}