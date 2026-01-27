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
          300: "#86EFAC",
          400: "#6EE7B7",
          500: "#34D399",
          600: "#10B981"
        },
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          800: "#1e293b",
          850: "#172033",
          900: "#0f172a",
          950: "#020617"
        }
      },
      fontFamily: {
        sans: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Source Serif 4", "ui-serif", "Georgia", "serif"]
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
      },
      boxShadow: {
        "glow": "0 0 40px -10px rgba(52, 211, 153, 0.3)",
        "glow-lg": "0 0 60px -15px rgba(52, 211, 153, 0.4)",
        "inner-glow": "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
