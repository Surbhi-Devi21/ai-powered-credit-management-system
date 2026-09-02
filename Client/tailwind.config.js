/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // High-end 2026 SaaS Brand Palette (Linear / Stripe / Mercury style)
        brand: {
          dark: '#0F172A',      // Slate 900
          light: '#1E293B',     // Slate 800
          muted: '#64748B',     // Slate 500
          subtle: '#94A3B8',    // Slate 400
          accent: '#2563EB',    // Cobalt Blue 600
          accentHover: '#1D4ED8',// Cobalt Blue 700
          accentLight: '#EFF6FF',// Blue 50
        },
        // Financial Semantics (Soft, vibrant, trustworthy)
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669', // Cash in / Settled
          700: '#047857',
        },
        rose: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          500: '#F43F5E',
          600: '#E11D48', // Credit out / Debt / Overdue
          700: '#BE123C',
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706', // Warning / Due soon
          700: '#B45309',
        },
        // Surface & Micro-Borders
        surface: {
          canvas: '#F8FAFC',    // Slate 50 Canvas
          card: '#FFFFFF',      // Pure White Card
          border: '#E2E8F0',    // Slate 200 Hairline
          borderSubtle: '#F1F5F9', // Slate 100
          subtle: '#F8FAFC',    // Slate 50 Neutral
          hover: '#F1F5F9',     // Slate 100 Hover
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 4px 12px -2px rgba(15, 23, 42, 0.03), 0 0 0 1px rgba(226, 232, 240, 0.8)',
        hover: '0 8px 24px -4px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.03), 0 0 0 1px rgba(203, 213, 225, 0.9)',
        dropdown: '0 12px 28px -6px rgba(15, 23, 42, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(226, 232, 240, 0.9)',
        modal: '0 24px 60px -12px rgba(15, 23, 42, 0.22), 0 8px 20px -4px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.9)',
        glow: '0 0 20px -3px rgba(37, 99, 235, 0.25)',
      },
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
    },
  },
  plugins: [],
};
