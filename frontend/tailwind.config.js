/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        base: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        accent: {
          DEFAULT: '#6C5CE7', // brand indigo-violet
          hover: '#7C6FF5',
          soft: 'rgba(108, 92, 231, 0.15)',
        },
        flame: '#FF9F43', // streak / achievement accent
        rating: {
          1: '#7F1D1D',
          2: '#DC2626',
          3: '#EA580C',
          4: '#F97316',
          5: '#EAB308',
          6: '#A3E635',
          7: '#86EFAC',
          8: '#4ADE80',
          9: '#22C55E',
          10: '#10B981',
        },
        graymuted: '#3F4250', // past, not logged
        grayfuture: '#1C1E26', // future days
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(127,127,127,0.12), 0 8px 30px rgba(0,0,0,0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out both',
        pop: 'pop 0.25s ease-out both',
      },
    },
  },
  plugins: [],
};
