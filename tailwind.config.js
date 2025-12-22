/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./_includes/**/*.{html,md}",
    "./_layouts/**/*.{html,md}",
    "./_posts/**/*.{markdown,md,html}",
    "./_apps/**/*.{markdown,md,html}",
    "./assets/js/**/*.js",
    "./*.{html,md,markdown}",
    "./{apps,blog,sobre}/**/*.{html,md,markdown}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          400: "#6EE7B7",
          500: "#34D399",
          600: "#10B981"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Merriweather", "ui-serif", "Georgia", "serif"]
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};


