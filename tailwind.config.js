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
        accent: {
          DEFAULT: "#2BAADF",
          hover: "#1A95C8",
          light: "#E8F6FC",
          muted: "#55C5F0"
        },
        surface: {
          DEFAULT: "#FFFFFF",
          alt: "#F8FAFC",
          raised: "#FFFFFF"
        },
        border: {
          DEFAULT: "#E2E8F0",
          muted: "#F1F5F9"
        },
        text: {
          DEFAULT: "#0F172A",
          muted: "#475569",
          subtle: "#94A3B8"
        }
      },
      fontFamily: {
        mono: ["Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"]
      },
      borderRadius: {
        sharp: "2px"
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "float": "float 8s ease-in-out infinite",
        "pulse-dot": "pulseDot 2s ease-in-out infinite"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        float: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(10px, -10px) scale(1.02)" },
          "66%": { transform: "translate(-5px, 5px) scale(0.98)" }
        },
        pulseDot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" }
        }
      },
      boxShadow: {
        "card": "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
        "nav": "0 1px 2px 0 rgba(0, 0, 0, 0.03)"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
