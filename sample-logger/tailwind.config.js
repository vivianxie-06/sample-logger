/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Nods to the Preclarus / PPD purple palette from the lab manual.
        brand: {
          DEFAULT: '#4a1d75',
          dark: '#33144f',
          light: '#7b3fb0',
        },
      },
    },
  },
  plugins: [],
}
