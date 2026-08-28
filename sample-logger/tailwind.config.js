/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Matches the Preclarus / PPD Investigator Site Portal palette.
        ppd: {
          purple: '#4a1d75', // header / callouts
          purpleDark: '#331451',
          purpleLight: '#6b2f9c',
          green: '#8cc63f', // Create / Save-Submit / Search buttons
          greenDark: '#79b032',
          amber: '#f6b40a', // numbered step circles
          required: '#e53935', // required-field red border
          query: '#f5811f', // "will result in query" orange border
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
