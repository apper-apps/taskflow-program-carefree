/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f4f3ff",
          100: "#ede9fe", 
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#5B4FCF",
          600: "#5041c7",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b"
        },
        secondary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe", 
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8B7FD8",
          600: "#8b5cf6",
          700: "#7c3aed",
          800: "#6d28d9",
          900: "#5b21b6"
        },
        accent: {
          50: "#fff5f5",
          100: "#fed7d7",
          200: "#feb2b2",
          300: "#fc8181",
          400: "#f56565",
          500: "#FF6B6B",
          600: "#e53e3e",
          700: "#c53030",
          800: "#9b2c2c",
          900: "#742a2a"
        },
        success: "#4CAF50",
        warning: "#FF9800", 
        error: "#F44336",
        info: "#2196F3"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"]
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }]
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.2s ease-out",
        "scale-in": "scaleIn 0.15s ease-out",
        "check-draw": "checkDraw 0.3s ease-out",
        "task-complete": "taskComplete 0.2s ease-out"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
        checkDraw: {
          "0%": { strokeDashoffset: "16" },
          "100%": { strokeDashoffset: "0" }
        },
        taskComplete: {
          "0%": { opacity: "1", transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
          "100%": { opacity: "0.6", transform: "scale(1)" }
        }
      }
    },
  },
  plugins: [],
}