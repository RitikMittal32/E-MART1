/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all JS/TS files in src folder
    "./public/index.html",         // Include the main HTML file
  ],
  theme: {
    extend: {
      height: {
        'screen-minus-150': 'calc(100vh + 150px)',
      },
    },
  },
  plugins: [],
}
