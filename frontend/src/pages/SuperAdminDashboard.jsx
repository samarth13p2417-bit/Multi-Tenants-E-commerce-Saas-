import React, { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'
import MarketplaceNavbar from '../components/MarketplaceNavbar'
import CartDrawer from '../components/CartDrawer'
import SuperAdminAnalyticsCharts from '../components/SuperAdminAnalyticsCharts'
import {
  ShieldCheck,
  Store,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Users,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Search,
  Filter,
  Activity,
  Server,
  Lock,
  LogOut,
  Sparkles,
  BarChart3,
  Layers,
  ArrowRight,
  Eye,
} from 'lucide-react'

export default function SuperAdminDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loggedInUser = null } = useSelector((state) => state?.auth || {})
  const { tenants = [], products = [] } = useSelector((state) => state?.marketplace || {})

  // Status for each store (simulated store moderation)
  const [storeStatuses, setStoreStatuses] = useState(() => {
    const initial = {}
    if (Array.isArray(tenants)) {
      tenants.forEach((t) => {
        if (t && t.id) initial[t.id] = 'active'
      })
    }
    return initial
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [toastMsg, setToastMsg] = useState('')

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  const toggleStoreStatus = (storeId, storeName) => {
    const current = storeStatuses[storeId] || 'active'
    const next = current === 'active' ? 'suspended' : 'active'
    setStoreStatuses((prev) => ({ ...prev, [storeId]: next }))
    showToast(`Store "${storeName}" is now ${next.toUpperCase()}`)
  }

  // Filtered stores safely
  const filteredStores = useMemo(() => {
    const safeTenants = Array.isArray(tenants) ? tenants : []
    return safeTenants.filter((t) => {
      if (!t) return false
      if (searchTerm.trim() && !t.name?.toLowerCase().includes(searchTerm.toLowerCase())) return false
      if (categoryFilter !== 'all' && t.industry !== categoryFilter && t.industryCategory !== categoryFilter) return false
      return true
    })
  }, [tenants, searchTerm, categoryFilter])

  // Total Platform Statistics
  const totalStores = Array.isArray(tenants) ? tenants.length : 0
  const totalProducts = Array.isArray(products) ? products.length : 0
  const totalInStockProducts = (Array.isArray(products) ? products : []).filter((p) => p && p.inStock).length
  const estimatedPlatformGMV = (Array.isArray(products) ? products : []).reduce((sum, p) => sum + (Number(p?.price) || 0) * 14, 0)

  // Quick helper for table income/visits
  const getStoreQuickStats = (t) => {
    if (!t) return { visits: 5000, income: 500000 }
    const storeProducts = (Array.isArray(products) ? products : []).filter((p) => p && p.tenantId === t.id)
    const count = storeProducts.length || t.productsCount || 8
    const reviews = Number(t.reviewsCount) || 420
    const ind = t.industryCategory || t.industry || 'general'
    
    let ticketMult = ind === 'electronics' || ind === 'gadgets' ? 3.2 : ind === 'fashion' ? 1.4 : ind === 'travels' ? 2.5 : 1.0
    let trafficMult = ind === 'restaurant' ? 1.8 : ind === 'fashion' ? 1.45 : 1.2

    const visits = Math.max(3200, Math.round(reviews * 14.5 * trafficMult + count * 95))
    const catalogSum = storeProducts.reduce((sum, p) => sum + (Number(p?.price) || 500), 0)
    const avgPrice = count > 0 ? catalogSum / count : 1200
    const income = Math.max(250000, Math.round(visits * 0.045 * avgPrice * 0.42 * ticketMult))

    return { visits, income }
  }

  const formatLakhs = (val = 0) => {
    const num = Number(val) || 0
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`
    return `₹${num.toLocaleString('en-IN')}`
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between selection:bg-gray-900 selection:text-white pb-12">
      
      {/* Top Navbar */}
      <MarketplaceNavbar />
      <CartDrawer />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-gray-700 flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-top-4 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="bg-gray-900 text-white rounded-3xl p-6 sm:p-8 shadow-md mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Super Admin Root Control</span>
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Network Clearance: Level 5
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              OmniMarket Platform Administration
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Multi-tenant architecture oversight, merchant compliance, catalog distribution, and gross revenue analytics.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 self-stretch sm:self-auto flex-wrap">
            <Link
              to="/vendor-dashboard"
              className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-gray-700 shadow-xs"
            >
              <Store className="w-4 h-4 text-blue-400" />
              <span>Vendor Portal</span>
            </Link>

            <Link
              to="/"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Eye className="w-4 h-4" />
              <span>View Live Marketplace</span>
            </Link>
          </div>
        </div>

        {/* ================= PLATFORM METRICS ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-500 text-xs font-bold mb-2">
              <span>Total Partner Stores</span>
              <Store className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">{totalStores}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              All 37+ verified merchants live
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-500 text-xs font-bold mb-2">
              <span>Total Catalog Products</span>
              <Package className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">{totalProducts}</div>
            <div className="text-[11px] text-gray-500 mt-1">
              {totalInStockProducts} available in stock
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-500 text-xs font-bold mb-2">
              <span>Platform GMV (Est.)</span>
              <DollarSign className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">
              ₹{(estimatedPlatformGMV / 100000).toFixed(2)} Lakhs
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Multi-tenant gross volume</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-500 text-xs font-bold mb-2">
              <span>System Health</span>
              <Server className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">99.98%</div>
            <div className="text-[11px] text-gray-400 mt-1">Zero downtime recorded</div>
          </div>

        </div>

        {/* ================= STORE INCOME & CUSTOMER FOOTFALL ANALYTICS CHARTS ================= */}
        <SuperAdminAnalyticsCharts tenants={tenants} products={products} />

        {/* ================= ALL STORES MANAGEMENT DIRECTORY ================= */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
          
          <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-gray-50/50">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Partner Merchant &amp; Store Management Directory
              </h3>
              <p className="text-xs text-gray-500">
                Inspect merchant credentials, regulate store activity, and review store income &amp; footfall.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search stores or restaurants..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gray-900"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl text-xs px-3 py-2 font-bold text-gray-700"
              >
                <option value="all">All Industries ({totalStores})</option>
                <option value="restaurant">Food &amp; Sweets</option>
                <option value="fashion">Fashion &amp; Garments</option>
                <option value="gadgets">Mobiles &amp; Gadgets</option>
                <option value="electronics">Electronics &amp; Appliances</option>
                <option value="travels">Tours &amp; Travels</option>
                <option value="furniture">Furniture</option>
                <option value="grocery">Grocery</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[11px] font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">Store Identity</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Est. Monthly Income</th>
                  <th className="py-3.5 px-4">Customer Footfall</th>
                  <th className="py-3.5 px-4">Catalog Count</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {filteredStores.map((t) => {
                  const status = storeStatuses[t.id] || 'active'
                  const storeProdCount = (Array.isArray(products) ? products : []).filter((p) => p && p.tenantId === t.id).length
                  const stats = getStoreQuickStats(t)

                  return (
                    <tr key={t.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={t.logo || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=120&auto=format&fit=crop&q=80'}
                            alt={t.name}
                            className="w-10 h-10 rounded-xl object-cover border border-gray-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-gray-900">{t.name}</div>
                            <div className="text-[11px] text-gray-500">{t.address || 'Commercial Center'}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-gray-600">
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[11px] font-semibold">
                          {t.category}
                        </span>
                      </td>

                      {/* Store Income */}
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-emerald-600 text-xs">
                          {formatLakhs(stats.income)}
                        </div>
                        <div className="text-[10px] text-gray-400">Monthly GMV</div>
                      </td>

                      {/* Customer Footfall */}
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-amber-600 text-xs">
                          {(Number(stats.visits) || 0).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-gray-400">Visits / mo</div>
                      </td>

                      <td className="py-3 px-4 font-bold text-gray-900">
                        {storeProdCount} products
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1 w-fit ${
                          status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span>{status === 'active' ? 'Live & Verified' : 'Suspended'}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/store/${t.id}`}
                            className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-blue-600 rounded-lg transition"
                            title="Inspect Storefront"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => toggleStoreStatus(t.id, t.name)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                              status === 'active'
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 px-4 text-center text-xs text-gray-500">
        <div>OmniMarket Super Admin Engine • Authenticated Root Session</div>
      </footer>

    </div>
  )
}
