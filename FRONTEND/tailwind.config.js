// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // O "molde" principal
    "./src/**/*.{js,ts,jsx,tsx}", // Todos os seus componentes e páginas
  ],
  theme: {
    extend: {
      fontFamily: {
        // Isso habilita a fonte 'Inter' que usamos
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}