tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
        surface: '#f3f4f6',
        ink: '#0f172a',
      },
      boxShadow: {
        card: '0 2px 8px rgba(15, 23, 42, 0.04), 0 12px 28px rgba(15, 23, 42, 0.05)',
        soft: '0 1px 2px rgba(15, 23, 42, 0.04)',
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '4xl': '1.75rem',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
};
