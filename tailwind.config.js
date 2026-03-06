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
          light: "rgba(43, 170, 223, 0.1)",
          muted: "rgba(43, 170, 223, 0.4)"
        },
        surface: {
          DEFAULT: "#09090b", // zinc-950
          alt: "#121214", // zinc-900ish
          raised: "#18181b" // zinc-900
        },
        border: {
          DEFAULT: "#27272a", // zinc-800
          muted: "#18181b" // zinc-900
        },
        text: {
          DEFAULT: "#fafafa", // zinc-50
          muted: "#a1a1aa", // zinc-400
          subtle: "#71717a" // zinc-500
        }
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Menlo", "Monaco", "monospace"],
        sans: ["Inter", "sans-serif"]
      },
      borderRadius: {
        sharp: "2px",
        soft: "8px",
        card: "24px",
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
        "card": "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 0 3px rgba(0,0,0,0.02)",
        "card-hover": "0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
        "nav": "0 1px 2px 0 rgba(0, 0, 0, 0.03)"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
