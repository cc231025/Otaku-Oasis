/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: { colors : {
        background: '#0E0E0E',
        background_lighter: '#1C1C1C',
        font_in_main: '#F5F5F5',
        font_dark_icons_text: '#A8A8A8',
        font_brighter_highlight: '#DDDDDD',
        main_color: '#592D96',
        main_color_darker: '#312342',
        secondary_color: '#8F7003'


      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
        animation: {
            'spin-slow': 'spin 2s linear infinite',
        },
    },

  },
  plugins: [],
};
