import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    screens: {
      xs: '390px',
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        ink:        '#1A1A2E',
        terracotta: '#D4603A',
        rosso:      '#C0392B',
        canvas:     '#FDFAF6',
        avorio:     '#F5F0E8',
        sabbia:     '#E8DDD0',
        grigio:     '#8C8279',
        cuoio:      '#3D3530',
        success:    '#2A7A4B',
        warning:    '#C9820A',
        error:      '#B92D2D',
        info:       '#1E5A8E',
        // dark mode
        'dark-canvas':  '#0F0F1E',
        'dark-surface': '#1A1A2E',
        'dark-card':    '#252540',
        'dark-terra':   '#E06B46',
      },
      fontFamily: {
        serif: ['var(--font-dm-serif)', 'Georgia', 'serif'],
        sans:  ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        block: '4px',
        card:  '8px',
        modal: '16px',
      },
      maxWidth: {
        'public-page': '480px',
      },
      spacing: {
        touch:  '44px',
        avatar: '96px',
      },
      boxShadow: {
        card:  '0 1px 3px rgba(26,26,46,0.04)',
        hover: '0 4px 16px rgba(26,26,46,0.10)',
        drag:  '0 8px 32px rgba(26,26,46,0.14)',
      },
      transitionTimingFunction: {
        brand: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: 'var(--font-dm-sans)',
            color: '#3D3530',
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
