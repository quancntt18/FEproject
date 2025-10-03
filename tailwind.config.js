/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Bạn có thể thêm các tùy chỉnh theme ở đây nếu muốn
      // Ví dụ:
      // colors: {
      //   'primary': '#6366f1',
      // },
    },
  },
  plugins: [],
}