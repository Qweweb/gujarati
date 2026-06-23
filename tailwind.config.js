/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        // Light Mode
        "primary": "#0B3B36",
        "primary-container": "#115E59",
        "background": "#F4EFE6",
        "on-surface": "#1d1b17",
        "outline": "#8b7265",
        "outline-variant": "#dec1b1",
        "surface-container-low": "#F2EFE8",
        "surface-container": "#f3ede6",
        
        // Dark Mode - Royal Maroon & Golden -> Deep Forest Green
        "dark-bg": "#031412",
        "dark-surface": "#051816",
        "dark-accent": "#C49F67",
        "dark-text": "#ffffff",
        "dark-text-dim": "#e7e2db",
        
        "surface-tint": "#994700",
        "surface-container-highest": "#e7e2db",
        "inverse-primary": "#ffb68b",
        "on-tertiary-fixed-variant": "#004f4f",
        "on-tertiary-container": "#003b3b",
        "tertiary-container": "#49abab",
        "secondary-fixed": "#ffdad4",
        "on-primary-fixed": "#321200",
        "surface-dim": "#dfd9d2",
        "error-container": "#ffdad6",
        "tertiary-fixed-dim": "#76d6d5",
        "secondary-container": "#fe624e",
        "on-tertiary-fixed": "#002020",
        "on-secondary-fixed": "#410000",
        "error": "#ba1a1a",
        "secondary-fixed-dim": "#ffb4a8",
        "tertiary-fixed": "#93f2f2",
        "on-secondary-fixed-variant": "#8f0f07",
        "on-background": "#1d1b17",
        "surface-variant": "#e7e2db",
        "tertiary": "#006a6a",
        "on-error": "#ffffff",
        "surface-bright": "#fef8f1",
        "on-primary-fixed-variant": "#753400",
        "on-secondary-container": "#650000",
        "on-primary": "#ffffff",
        "surface": "#fef8f1",
        "surface-container-lowest": "#ffffff",
        "on-error-container": "#93000a",
        "on-surface-variant": "#574237",
        "secondary": "#b22b1d",
        "surface-container-high": "#ede7e0",
        "primary-fixed": "#ffdbc8",
        "on-secondary": "#ffffff",
        "inverse-on-surface": "#f6f0e9",
        "inverse-surface": "#32302c",
        "primary-fixed-dim": "#ffb68b",
        "on-primary-container": "#582600"
      },
      "fontFamily": {
        "headline": ["Yatra One", "cursive"],
        "body": ["Plus Jakarta Sans", "sans-serif"],
        "label": ["Plus Jakarta Sans", "sans-serif"],
        "gujarati": ["Noto Serif Gujarati", "serif"]
      },
      keyframes: {
        "bounce-in": {
          "0%": { opacity: "0", transform: "scale(0.8) translateY(10px)" },
          "50%": { opacity: "1", transform: "scale(1.05) translateY(-5px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" }
        },
        "scale-up": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)" }
        }
      },
      animation: {
        "bounce-in": "bounce-in 0.3s cubic-bezier(0.68, -0.55, 0.26, 1.55) forwards",
        "scale-up": "scale-up 0.3s ease-out forwards"
      }
    },
  },
  plugins: [],
}
