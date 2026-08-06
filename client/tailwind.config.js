/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rail: {
          blue: '#007AFF', // Apple system blue
          darkBlue: '#0051A8',
          cyan: '#32ADE6',
          teal: '#30B0C7',
          green: '#34C759',
          orange: '#FF9500',
          red: '#FF3B30',
          purple: '#AF52DE',
          indigo: '#5856D6',
          slate: '#1C1C1E',
          cardDark: '#2C2C2E',
          cardLight: '#FFFFFF',
          bgLight: '#F2F2F7',
          bgDark: '#000000',
          subtextLight: '#8E8E93',
          subtextDark: '#98989D'
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ]
      },
      boxShadow: {
        'apple': '0 4px 20px 0 rgba(0, 0, 0, 0.08)',
        'apple-hover': '0 8px 30px 0 rgba(0, 0, 0, 0.12)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
        'glow': '0 0 20px rgba(0, 122, 255, 0.4)'
      },
      backdropBlur: {
        'apple': '20px'
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'train-ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      }
    },
  },
  plugins: [],
}
