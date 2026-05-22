/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#020817',
        surface: 'rgba(7,15,38,0.8)',
        cyan: { DEFAULT: '#38BDF8', dark: '#0EA5E9' },
        indigo: { DEFAULT: '#818CF8' },
        purple: { DEFAULT: '#A78BFA' },
        amber: { DEFAULT: '#FCD34D' },
        danger: { DEFAULT: '#F87171' },
        success: { DEFAULT: '#34D399' },
        warning: { DEFAULT: '#FB923C' },
        muted: '#64748B',
        dimmed: '#334155',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backdropBlur: { xl: '20px' },
      animation: {
        pulse: 'pulse 2s ease infinite',
        fadeIn: 'fadeIn 0.3s ease',
        spin: 'spin 1s linear infinite',
        glow: 'glow 3s ease infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        glow: { '0%,100%': { boxShadow: '0 0 20px rgba(56,189,248,0.06)' }, '50%': { boxShadow: '0 0 40px rgba(56,189,248,0.22)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      borderColor: { DEFAULT: 'rgba(56,189,248,0.1)' },
    },
  },
  plugins: [],
};
