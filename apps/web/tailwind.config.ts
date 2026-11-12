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
        // ResolveAI Premium Purple Identity
        primary: {
          DEFAULT: '#7047EB',
          deep: '#5128C7',
          violet: '#8B5CF6',
          indigo: '#4338CA',
          light: '#F3EFFF',
          subtle: 'rgba(112, 71, 235, 0.15)',
        },
        brand: {
          purple: '#7047EB',
          deep: '#5128C7',
          violet: '#8B5CF6',
          indigo: '#4338CA',
          lavender: '#F3EFFF',
          bg: '#0B0819',
          sidebar: '#171329',
        },
        workspace: {
          bg: '#0B0819',
          card: '#171329',
          sidebar: '#171329',
          border: 'rgba(145, 105, 255, 0.22)',
          text: '#FFFFFF',
          muted: '#EAE5F5',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#EAE5F5',
          muted: '#D4CEF5',
        },
        border: {
          DEFAULT: 'rgba(145, 105, 255, 0.22)',
          subtle: 'rgba(145, 105, 255, 0.22)',
          lavender: 'rgba(145, 105, 255, 0.22)',
          active: '#7047EB',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        },
        base: {
          DEFAULT: '#0B0819',
          secondary: '#171329',
          card: '#171329',
          cardHover: '#201A38',
        },
        violet: {
          DEFAULT: '#7047EB',
          primary: '#7047EB',
          bright: '#8B5CF6',
          light: '#F3EFFF',
          subtle: 'rgba(112, 71, 235, 0.15)',
        },
      },
      fontFamily: {
        heading: ['Inter', 'Sora', 'var(--font-sora)', '-apple-system', 'sans-serif'],
        sans: ['Inter', 'var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'var(--font-mono)', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'saas-card': '0 1px 3px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(112, 71, 235, 0.08)',
        'saas-card-hover': '0 8px 30px rgba(112, 71, 235, 0.2), 0 2px 6px rgba(0, 0, 0, 0.2)',
        'saas-button': '0 1px 2px rgba(112, 71, 235, 0.2), 0 4px 14px rgba(112, 71, 235, 0.35)',
        'saas-button-hover': '0 6px 20px rgba(112, 71, 235, 0.45), 0 2px 4px rgba(112, 71, 235, 0.25)',
        'glow-purple': '0 0 25px rgba(112, 71, 235, 0.35)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
