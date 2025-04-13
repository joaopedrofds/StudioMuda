/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Garante que o Tailwind escaneie todos os arquivos JS/JSX na pasta src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}