/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core SaaS Color System (Specification)
        canvas: {
          DEFAULT: '#F6F8FC',     // Primary background
          subtle: '#F8FAFD',
          muted: '#EEF2F6',
        },
        card: {
          DEFAULT: '#FFFFFF',     // Card background
          hover: '#FAFCFF',
        },
        text: {
          primary: '#111827',     // Primary text (slate 900)
          secondary: '#64748B',   // Secondary text (slate 500)
          muted: '#94A3B8',       // Muted / placeholder (slate 400)
          inverted: '#FFFFFF',
        },
        border: {
          saas: 'rgba(15, 23, 42, 0.06)',       // Standard SaaS hairline border
          subtle: 'rgba(15, 23, 42, 0.03)',     // Ultra-subtle divider
          active: 'rgba(37, 99, 235, 0.25)',    // Focus / active state
          hover: 'rgba(15, 23, 42, 0.10)',
        },

        // Brand & Functional Accents
        brand: {
          dark: '#111827',
          light: '#1E293B',
          muted: '#64748B',
          subtle: '#94A3B8',
          accent: '#2563EB',
          accentHover: '#1D4ED8',
          accentLight: '#EFF6FF',
        },

        // Financial Semantics (Vibrant & Clean)
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        rose: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        surface: {
          canvas: '#F6F8FC',
          card: '#FFFFFF',
          border: 'rgba(15, 23, 42, 0.06)',
          borderSubtle: 'rgba(15, 23, 42, 0.03)',
          subtle: '#F8FAFD',
          hover: '#F1F5F9',
        },
      },

      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Consolas', 'monospace'],
      },

      // Typography Hierarchy Scaling
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.9375rem', letterSpacing: '0.02em' }],
        xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
        sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '-0.005em' }],
        base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.011em' }],
        lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.017em' }],
        xl: ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '-0.02em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.03em' }],
        '4xl': ['2.25rem', { lineHeight: '2.625rem', letterSpacing: '-0.035em' }],
        '5xl': ['3rem', { lineHeight: '3.375rem', letterSpacing: '-0.04em' }],
      },

      // Very soft, almost invisible premium shadows
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
        soft: '0 2px 10px -2px rgba(15, 23, 42, 0.03), 0 1px 3px rgba(15, 23, 42, 0.02)',
        card: '0 4px 20px -2px rgba(15, 23, 42, 0.03), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
        cardHover: '0 12px 32px -4px rgba(15, 23, 42, 0.06), 0 4px 10px -2px rgba(15, 23, 42, 0.02)',
        hover: '0 12px 32px -4px rgba(15, 23, 42, 0.06), 0 4px 10px -2px rgba(15, 23, 42, 0.02)',
        floating: '0 20px 40px -8px rgba(15, 23, 42, 0.08), 0 6px 14px -2px rgba(15, 23, 42, 0.03)',
        dropdown: '0 16px 36px -6px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03)',
        modal: '0 24px 60px -12px rgba(15, 23, 42, 0.12), 0 8px 20px -4px rgba(15, 23, 42, 0.04)',
        button: '0 2px 8px -1px rgba(15, 23, 42, 0.05), 0 1px 2px rgba(15, 23, 42, 0.03)',
        buttonHover: '0 6px 16px -2px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.04)',
      },

      // Spacing & Border Radii Tokens
      borderRadius: {
        xs: '6px',
        sm: '10px',
        md: '14px',
        lg: '18px',
        input: '16px',       // Standard input radius
        button: '9999px',     // Standard button radius
        '2xl': '20px',
        '3xl': '28px',       // Standard card radius
        card: '28px',        // Explicit card token
        '4xl': '32px',
        full: '9999px',
      },

      // Layout & Whitespace Spacing Scale
      spacing: {
        4.5: '1.125rem',
        18: '4.5rem',
        22: '5.5rem',
      },
    },
  },
  plugins: [],
};
