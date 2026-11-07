import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[70vh] place-items-center text-center">
      <div>
        <div className="font-brand text-[96px] font-bold leading-none temper-text ltr">404</div>
        <h1 className="mt-4 text-[26px] font-bold text-white">این صفحه در نقشه نیست</h1>
        <p className="mt-2 text-steel-300">آدرس را بررسی کنید یا از صفحه اصلی دوباره شروع کنید. با Ctrl+K هم می‌توانید هر صفحه‌ای را پیدا کنید.</p>
        <div className="mt-6 flex justify-center gap-3"><Button to="/">صفحه اصلی</Button><Button to="/quote" variant="secondary">دریافت قیمت</Button></div>
      </div>
    </section>
  )
}
