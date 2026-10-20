/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        "primary":"#dda15e",
        "secondary":"#bc6c25",
        "foreground":"#fefae0",
        "primary-dark":"#283618",
        "secondary-dark":"#606c38",
      }
    },
  },
  plugins: [],
}