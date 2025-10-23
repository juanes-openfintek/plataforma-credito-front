import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'wave-pattern': 'url("/images/bg-wave.png")',
        'wave-pattern-md': 'url("/images/bg-wave-md.png")',
        'wave-pattern-lg': 'url("/images/bg-wave-lg.png")',
      },
      colors: {
        'primary-color': 'var(--primary-color)',
        'secondary-color': 'var(--secondary-color)',
        'accent-color': 'var(--accent-color)',
        'accent-light-color': 'var(--accent-light-color)',
        'error-color': 'var(--error-color)',
        'light-color-one': 'var(--light-color-one)',
        'light-color-two': 'var(--light-color-two)',
        'light-color-three': 'var(--light-color-three)',
        'progress-color': 'var(--progress-color)',
        'success-color': 'var(--success-color)',
        'success-color-two': 'var(--success-color-two)',
        'reject-color': 'var(--reject-color)',
        'no-sign-color': 'var(--no-sign-color)',
        'signed-color': 'var(--signed-color)',
        'delay-color': 'var(--delay-color)',
      },
      borderWidth: {
        DEFAULT: '1px',
        0: '0',
        2: '2px',
        3: '3px',
        4: '4px',
        5: '5px',
        6: '6px',
        8: '8px',
      },
      fontFamily: {
        poppins: ['var(--display-poppins)'],
        sans: ['var(--display-sans)'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
      },
    },
  },
  plugins: []
}
export default config
