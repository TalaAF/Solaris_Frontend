/** @type {import('tailwindcss').Config} */
export default {
  content: {
    files: [
      './src/**/*.{js,jsx,ts,tsx,css}', // Add .css to scan component styles
    ],
  },
  safelist: [
    'bg-mint-500',
    'bg-mint-600',
    'bg-lavender-100',
    'bg-blue-100',
    'text-lavender-500',
    'text-gray-800',
    'text-gray-600',
    'shadow-lg',
    'rounded-lg',
  ],
  theme: {
    extend: {
      colors: {
        'blue-100': '#AEC6CF',
        'mint-50': '#E6F4EA',
        'mint-500': '#B5EAD7',
        'mint-600': '#A3D6C3',
        'lavender-50': '#F5F3FF',
        'lavender-100': '#E6E6FA',
        'lavender-500': '#C4B5FD',
        'lavender-600': '#B0A1E8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};