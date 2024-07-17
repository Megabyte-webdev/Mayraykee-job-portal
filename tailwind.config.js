/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryColor: "#0f5a02",
        secondaryColor: "#f8faf7",
      },
      textColor: {
        primary: '#25324b'
      },
      fontSize: {
        little: '12px'
      }
    },
  },
  plugins: [],
};
