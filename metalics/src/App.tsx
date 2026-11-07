import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import PublicLayout from '@/components/layout/PublicLayout'
import AppLayout from '@/components/layout/AppLayout'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { ToastProvider } from '@/components/ui/Toast'

// صفحات عمومی
const Home = lazy(() => import('@/pages/public/Home'))
const Capabilities = lazy(() => import('@/pages/public/Capabilities'))
const Materials = lazy(() => import('@/pages/public/Materials'))
const HowItWorks = lazy(() => import('@/pages/public/HowItWorks'))
const Suppliers = lazy(() => import('@/pages/public/Suppliers'))
const About = lazy(() => import('@/pages/public/About'))
const Quote = lazy(() => import('@/pages/public/Quote'))
const Auth = lazy(() => import('@/pages/public/Auth'))
const NotFound = lazy(() => import('@/pages/public/NotFound'))
// پنل خریدار
const BuyerDashboard = lazy(() => import('@/pages/app/buyer/Dashboard'))
const Orders = lazy(() => import('@/pages/app/buyer/Orders'))
const OrderDetail = lazy(() => import('@/pages/app/buyer/OrderDetail'))
const RfqCompare = lazy(() => import('@/pages/app/buyer/RfqCompare'))
const Messages = lazy(() => import('@/pages/app/buyer/Messages'))
const Dispute = lazy(() => import('@/pages/app/buyer/Dispute'))
// پنل سازنده
const SupplierJobs = lazy(() => import('@/pages/app/supplier/Jobs'))
const SupplierProduction = lazy(() => import('@/pages/app/supplier/Production'))
const SupplierPayouts = lazy(() => import('@/pages/app/supplier/Payouts'))
const SupplierProfile = lazy(() => import('@/pages/app/supplier/Profile'))
// پنل کارشناس
const ExpertQueue = lazy(() => import('@/pages/app/expert/Queue'))
const ExpertReview = lazy(() => import('@/pages/app/expert/Review'))
// پنل مدیریت
const AdminOverview = lazy(() => import('@/pages/app/admin/Overview'))
const AdminApprovals = lazy(() => import('@/pages/app/admin/Approvals'))
const AdminSuppliers = lazy(() => import('@/pages/app/admin/Suppliers'))
const AdminSurveillance = lazy(() => import('@/pages/app/admin/Surveillance'))
const AdminRbac = lazy(() => import('@/pages/app/admin/Rbac'))
const AdminAudit = lazy(() => import('@/pages/app/admin/Audit'))

function ScrollTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => { if (!hash) window.scrollTo({ top: 0 }) }, [pathname, hash])
  return null
}

function Loader() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="h-1 w-40 overflow-hidden rounded-full bg-steel-700"><div className="h-full w-1/2 animate-shimmer temper-bar bg-[length:200%_100%]" /></div>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <ScrollTop />
      <CommandPalette />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/capabilities" element={<Capabilities />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/about" element={<About />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route element={<AppLayout />}>
            <Route path="/app" element={<BuyerDashboard />} />
            <Route path="/app/orders" element={<Orders />} />
            <Route path="/app/orders/:id" element={<OrderDetail />} />
            <Route path="/app/rfq/:id" element={<RfqCompare />} />
            <Route path="/app/messages" element={<Messages />} />
            <Route path="/app/disputes/:id" element={<Dispute />} />
            <Route path="/supplier" element={<SupplierJobs />} />
            <Route path="/supplier/production" element={<SupplierProduction />} />
            <Route path="/supplier/payouts" element={<SupplierPayouts />} />
            <Route path="/supplier/profile" element={<SupplierProfile />} />
            <Route path="/expert" element={<ExpertQueue />} />
            <Route path="/expert/review/:id" element={<ExpertReview />} />
            <Route path="/admin" element={<AdminOverview />} />
            <Route path="/admin/approvals" element={<AdminApprovals />} />
            <Route path="/admin/suppliers" element={<AdminSuppliers />} />
            <Route path="/admin/surveillance" element={<AdminSurveillance />} />
            <Route path="/admin/rbac" element={<AdminRbac />} />
            <Route path="/admin/audit" element={<AdminAudit />} />
          </Route>
        </Routes>
      </Suspense>
    </ToastProvider>
  )
}
