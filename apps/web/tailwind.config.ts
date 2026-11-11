import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#070711',
          secondary: '#0B0B18',
          card: '#111126',
          cardHover: '#161633',
        },
        surface: {
          1: '#070711',
          2: '#0B0B18',
          3: '#111126',
          card: '#111126',
          cardHover: '#171736',
          glass: 'rgba(33, 27, 65, 0.78)',
          glassSubtle: 'rgba(17, 17, 38, 0.75)',
        },
        violet: {
          DEFAULT: '#713BFF',
          primary: '#713BFF',
          bright: '#963FFF',
          light: '#B282FF',
          subtle: 'rgba(113, 59, 255, 0.15)',
        },
        electric: {
          blue: '#536CFF',
          cyan: '#38BDF8',
        },
        text: {
          primary: '#F7F5FF',
          secondary: '#AAA6C5',
          muted: '#6E6A8A',
        },
        border: {
          DEFAULT: 'rgba(164, 125, 255, 0.20)',
          subtle: 'rgba(164, 125, 255, 0.12)',
          bright: 'rgba(164, 125, 255, 0.50)',
          glow: 'rgba(150, 63, 255, 0.70)',
        },
        status: {
          success: '#35D39A',
          warning: '#F5B942',
          danger: '#FF647C',
        },
      },
      fontFamily: {
        heading: ['Sora', 'var(--font-sora)', '-apple-system', 'sans-serif'],
        sans: ['Inter', 'var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'var(--font-mono)', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(113, 59, 255, 0.25)',
        'glow-md': '0 0 30px rgba(113, 59, 255, 0.35)',
        'glow-lg': '0 0 60px rgba(150, 63, 255, 0.30)',
        'glow-cyan': '0 0 30px rgba(83, 108, 255, 0.35)',
        'glass-panel': 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 12px 40px rgba(0, 0, 0, 0.35), 0 0 28px rgba(112, 61, 255, 0.08)',
        'glass-active': 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 35px rgba(113, 59, 255, 0.35), 0 12px 40px rgba(0, 0, 0, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
