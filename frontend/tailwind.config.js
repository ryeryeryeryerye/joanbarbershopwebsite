/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Chủ đạo: Đen, xám, trắng
        dark: {
          bg: '#09090b',       // Đen sâu
          surface: '#121215',  // Đen xám bề mặt
          card: '#18181b',     // Xám card
          border: '#27272a',   // Viền xám
          muted: '#71717a',    // Xám chữ phụ
        },
        // Điểm nhấn cam DUY NHẤT cho nút CTA Đặt lịch
        cta: {
          orange: '#ea580c',        // Cam tiêu chuẩn
          'orange-hover': '#c2410c', // Cam đậm khi hover
          'orange-light': '#ff7828', // Cam sáng
        },
      },
    },
  },
  plugins: [],
}
