import React, { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  setSelectedTenant,
  addToCart,
  togglePocket,
} from '../features/marketplace/marketplaceSlice'
import MarketplaceNavbar from '../components/MarketplaceNavbar'
import CartDrawer from '../components/CartDrawer'
import TenantCard from '../components/TenantCard'
import ProductCard from '../components/ProductCard'
import {
  Store,
  Layers,
  Sparkles,
  ShieldCheck,
  Building2,
  ArrowRight,
  Shield,
  Lock,
  CheckCircle2,
  TrendingUp,
  Tv,
  Smartphone,
  Shirt,
  UtensilsCrossed,
  Armchair,
  ShoppingBasket,
  Coffee,
  ChevronRight,
  ShoppingBag,
  Star,
  Compass,
  Bus,
  Check,
  Zap,
  Wallet,
  Plus,
} from 'lucide-react'

export default function HomePage() {
  const dispatch = useDispatch()
  const { tenants, products, selectedTenantId, pocketBalance } = useSelector(
    (state) => state.marketplace
  )

  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all')

  // Filtered tenants by selected tenantId or active category filter
  const displayedTenants = useMemo(() => {
    let list = tenants
    if (selectedTenantId !== 'all') {
      return tenants.filter((t) => t.id === selectedTenantId)
    }
    if (activeCategoryFilter !== 'all') {
      return tenants.filter(
        (t) => t.industryCategory === activeCategoryFilter || t.category?.toLowerCase().includes(activeCategoryFilter)
      )
    }
    return list
  }, [tenants, selectedTenantId, activeCategoryFilter])

  // Featured Trending Products across all stores
  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.featured).slice(0, 8)
  }, [products])

  // Category grouping for sectioned view
  const categoryGroups = useMemo(() => {
    const groups = [
      {
        id: 'restaurant',
        title: '🥟 Food, Fast Food, Sweets & Dining',
        subtitle: 'Wow! Momos, Dragon Chinese Wok, Mamta Sweets, Shahi Thalis, Dum Biryani & Fast Food',
        icon: '🥟',
        stores: tenants.filter(
          (t) => t.industryCategory === 'restaurant' || t.industryCategory === 'snacks'
        ),
      },
      {
        id: 'travels',
        title: '🚌 Tours, Travels & Bus Bookings',
        subtitle: 'Luxury AC Sleeper Buses, Outstation Cabs, Shirdi Yatra, Konkan & Hill Station Holiday Packages',
        icon: '🚌',
        stores: tenants.filter((t) => t.industryCategory === 'travels'),
      },
      {
        id: 'fashion',
        title: '👗 Fashion, Garments & Ethnic Wear',
        subtitle: 'Designer Sarees, Suits, Kids Party Dresses, Western Tops & Handwoven Silks',
        icon: '👗',
        stores: tenants.filter((t) => t.industryCategory === 'fashion'),
      },
      {
        id: 'electronics',
        title: '⚡ Electronics & Home Appliances',
        subtitle: 'Smart 4K TVs, Inverter ACs, Refrigerators, Washing Machines, Audio & Laptops',
        icon: '⚡',
        stores: tenants.filter((t) => t.industryCategory === 'electronics'),
      },
      {
        id: 'gadgets',
        title: '📱 Smartphones, Mobiles & Tech Gadgets',
        subtitle: 'iPhones, OnePlus 12, Xiaomi 14 Ultra, Fast Chargers, Earbuds & MagSafe Gear',
        icon: '📱',
        stores: tenants.filter((t) => t.industryCategory === 'gadgets'),
      },
      {
        id: 'furniture',
        title: '🛋️ Home, Office & Sewing Machinery',
        subtitle: 'Solid Teakwood Sofas, Ergonomic Chairs, Beds & Automatic Electric Sewing Machines',
        icon: '🛋️',
        stores: tenants.filter((t) => t.industryCategory === 'furniture'),
      },
      {
        id: 'grocery',
        title: '🛒 Grocery & Supermarket Staples',
        subtitle: 'Pure Desi Cow Ghee, Premium Dry Fruits, Organic Oils, Aged Rice & Daily Essentials',
        icon: '🛒',
        stores: tenants.filter((t) => t.industryCategory === 'grocery'),
      },
    ]
    return groups.filter((g) => g.stores.length > 0)
  }, [tenants])

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      
      {/* Top Marketplace Navigation */}
      <MarketplaceNavbar />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      <main className="flex-1">
        
        {/* ================= 1. HERO SECTION ================= */}
        <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50/90 via-white to-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            
            {/* Ecosystem Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-black mb-6 shadow-2xs">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Multi-Tenant Commerce &amp; Dining Network</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight max-w-5xl mx-auto leading-tight sm:leading-tight">
              One Unified Marketplace.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                Top Independent Brands.
              </span>
              <br className="hidden sm:inline" /> 100% Safe Shopping for Everyone.
            </h1>

            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto mt-4 leading-relaxed">
              Explore <strong>37+ verified local merchants &amp; restaurants</strong> — from <strong>Electronics &amp; Gadgets</strong>, <strong>Fashion &amp; Garments</strong> to <strong>Momos, Sweets, Tours &amp; Travels</strong> with dedicated store carts.
            </p>

            {/* Quick Feature Metric Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-xs font-bold text-gray-700">
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-gray-200 shadow-2xs">
                <Store className="w-4 h-4 text-blue-600" />
                <span>37+ Verified Merchant Stores</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-gray-200 shadow-2xs">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span>Dedicated Store Carts &amp; Bags</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-gray-200 shadow-2xs">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>30-Min Fast Dispatch</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-gray-200 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>100% Genuine Buyer Protection</span>
              </div>
            </div>

            {/* Dual Pillars (For Shoppers & For Store Owners) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mt-10 text-left">
              
              {/* Pillar 1: For Customers */}
              <div className="bg-white p-6 rounded-3xl border border-emerald-200/80 shadow-xs hover:shadow-md transition relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </span>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">For Customers</span>
                      <h3 className="text-base font-bold text-gray-900">100% Safe &amp; Verified Shopping</h3>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">
                    Shop genuine products with official brand warranties, verified merchant authentications, and buyer protection guarantee across all stores.
                  </p>
                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-emerald-800">
                    <span className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100% Verified Stores
                    </span>
                    <span className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <Lock className="w-3.5 h-3.5" /> Zero-Fraud Checkout
                    </span>
                  </div>
                </div>
              </div>

              {/* Pillar 2: For Store Owners */}
              <div className="bg-white p-6 rounded-3xl border border-blue-200/80 shadow-xs hover:shadow-md transition relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="p-2 bg-blue-100 text-blue-800 rounded-xl">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </span>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700">For Store Owners</span>
                      <h3 className="text-base font-bold text-gray-900">Manage Inventory &amp; Live Sales</h3>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">
                    Store owners can log in with Phone &amp; OTP or Email to manage product pricing, stock units left, and view sales revenue charts.
                  </p>
                  <div className="flex items-center gap-3">
                    <Link
                      to="/login"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Vendor Portal &amp; Analytics</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link to="/register-store" className="text-[11px] text-gray-500 hover:text-gray-800 font-semibold">
                      Register Store
                    </Link>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ================= 2. FEATURED TRENDING PRODUCTS ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Marketplace Highlights</span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
                Trending Bestsellers Across All Stores
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Top rated items with real-time stock availability and instant merchant fulfillment.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ================= 3. ALL STOREFRONTS BY CATEGORY ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* If single tenant is filtered */}
          {selectedTenantId !== 'all' ? (
            <div>
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">
                    Selected Merchant Storefront
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Showing {displayedTenants.length} verified merchant storefront
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => dispatch(setSelectedTenant('all'))}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition cursor-pointer"
                >
                  Show All Stores
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {displayedTenants.map((tenant) => (
                  <TenantCard key={tenant.id} tenant={tenant} />
                ))}
              </div>
            </div>
          ) : (
            /* Structured Sectioned View for All Categories */
            <div className="space-y-16">
              {categoryGroups.map((group) => (
                <div key={group.id} className="pt-2">
                  
                  {/* Category Header */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-3 border-b border-gray-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                          {group.title}
                        </h2>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {group.stores.length} Store{group.stores.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {group.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Stores Grid in this Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {group.stores.map((tenant) => (
                      <TenantCard key={tenant.id} tenant={tenant} />
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}

        </section>

      </main>

      {/* ================= 4. CLEAN FOOTER ================= */}
      <footer className="border-t border-gray-200 bg-white py-12 px-4 sm:px-6 lg:px-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          
          <div className="col-span-2">
            <div className="flex items-center gap-2 font-bold text-gray-900 text-base mb-2">
              <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center text-white text-xs">
                <Layers className="w-4 h-4 text-blue-400" />
              </div>
              <span>OmniMarket Multi-Tenant</span>
            </div>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              India's premier multi-tenant commerce network connecting shoppers with verified independent stores and restaurants under a 100% safe shopping guarantee.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-[11px]">Stores &amp; Categories</h4>
            <ul className="space-y-1.5 text-xs">
              <li><span className="text-gray-700 font-medium">🥟 Food, Momos &amp; Sweets</span></li>
              <li><span className="text-gray-700 font-medium">🚌 Tours &amp; Travels</span></li>
              <li><span className="text-gray-700 font-medium">👗 Fashion &amp; Ethnic Wear</span></li>
              <li><span className="text-gray-700 font-medium">📱 Smartphones &amp; Gadgets</span></li>
              <li><span className="text-gray-700 font-medium">⚡ Electronics &amp; Appliances</span></li>
              <li><span className="text-gray-700 font-medium">🛋️ Furniture &amp; Sewing Tools</span></li>
              <li><span className="text-gray-700 font-medium">🛒 Grocery &amp; Supermarket</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-[11px]">For Businesses &amp; Admins</h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="hover:text-gray-900 transition font-semibold text-blue-600">Store Owner &amp; Vendor Portal</Link></li>
              <li><Link to="/vendor-dashboard" className="hover:text-gray-900 transition">Vendor Analytics Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-gray-900 transition">Super Admin Master Vault</Link></li>
              <li><Link to="/register-store" className="hover:text-gray-900 transition">Register New Store</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-[11px]">Safety &amp; Trust</h4>
            <ul className="space-y-2">
              <li><span className="text-emerald-700 font-semibold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> 100% Safe Shopping</span></li>
              <li><span className="text-gray-600">Genuine Product Guarantee</span></li>
              <li><span className="text-gray-600">Privacy &amp; SSL Protection</span></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div>© 2026 OmniMarket Multi-Tenant Ecosystem. 100% Safe Shopping Guaranteed.</div>
          <div className="flex items-center gap-4 font-medium">
            <span>Powered by React, Redux Toolkit &amp; Tailwind CSS</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
