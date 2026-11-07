/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // پالت «فولاد گرافیتی» — پایه همه صفحات
        steel: {
          950: '#0F161E',
          900: '#121A23',
          850: '#16202A',
          800: '#1A2530',
          750: '#1F2C39',
          700: '#263544',
          600: '#334558',
          500: '#4A5F75',
          400: '#64788D',
          300: '#93A3B5',
          200: '#BCC8D4',
          100: '#E7ECF1',
        },
        // رنگ اقدام اصلی: درخشش فولاد داغ
        heat: { DEFAULT: '#F0A23B', soft: '#F7B65A', deep: '#C9761E', ink: '#1C1307' },
        // رنگ اطلاعات و لینک: خط برش لیزر
        cut: { DEFAULT: '#5BB8EA', soft: '#8ACDF1', deep: '#2E86BA' },
        // طیف رنگ‌های بازپخت فولاد (Temper colors) — امضای بصری برند
        temper: { straw: '#E9C878', bronze: '#C07A3E', violet: '#7A5AA6', blue: '#3C7DC4' },
        ok: '#3FCF8E',
        warn: '#F5D04C',
        err: '#EE5A4F',
      },
      fontFamily: {
        sans: ['"Vazirmatn Variable"', 'Vazirmatn', 'Tahoma', 'sans-serif'],
        display: ['"Estedad Variable"', '"Vazirmatn Variable"', 'sans-serif'],
        brand: ['"Unbounded Variable"', '"Estedad Variable"', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { panel: '14px', ctl: '10px' },
      boxShadow: {
        lift: '0 1px 0 rgba(255,255,255,.04) inset, 0 18px 40px -18px rgba(0,0,0,.55)',
        glow: '0 0 0 1px rgba(240,162,59,.35), 0 10px 30px -8px rgba(240,162,59,.35)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(50%)' } },
        scan: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100%)' } },
        dash: { to: { strokeDashoffset: '0' } },
        pulseRing: { '0%': { transform: 'scale(.8)', opacity: '.8' }, '100%': { transform: 'scale(2.2)', opacity: '0' } },
        shimmer: { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        scan: 'scan 2.2s ease-in-out infinite',
        pulseRing: 'pulseRing 1.8s ease-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}
