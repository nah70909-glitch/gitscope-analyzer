/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B0F19',       // Deep sleek space background
          card: '#161F30',     // Premium glass background card
          border: '#23324C',   // Translucent borders
          accent: '#6366F1'    // Indigo main theme
        },
        brand: {
          primary: '#4F46E5',  // Indigo-600
          secondary: '#8B5CF6',// Purple-500
          success: '#10B981',  // Emerald-500
          warning: '#F59E0B',  // Amber-500
          danger: '#EF4444',   // Red-500
          info: '#3B82F6',     // Blue-500
          rankGold: '#F59E0B',
          rankPurple: '#C084FC',
          rankBlue: '#60A5FA',
          rankGreen: '#34D399',
          rankGray: '#9CA3AF'
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
