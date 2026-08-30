import React, { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setCartOpen, clearStoreCart } from '../features/marketplace/marketplaceSlice'
import MarketplaceNavbar from '../components/MarketplaceNavbar'
import CartDrawer from '../components/CartDrawer'
import ProductCard from '../components/ProductCard'
import {
  Store,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Phone,
  Share2,
  Heart,
  Sparkles,
  ChevronRight,
  User,
  Users,
  Baby,
  PlusCircle,
  Package,
  Layers,
  ArrowRight,
  ShoppingBag,
  MessageSquare,
  Send,
  X,
  MessageCircle,
  Check,
} from 'lucide-react'

export default function StorePage() {
  const { storeId } = useParams()
  const dispatch = useDispatch()
  const { tenants, products, cartItems } = useSelector((state) => state.marketplace)

  // Find tenant by storeId or default
  const tenant =
    tenants.find((t) => t.id === storeId) ||
    tenants.find((t) => t.id === 'tenant-poonam-dresses') ||
    tenants[0]

  // Filter products for this specific store
  const storeProducts = useMemo(() => {
    return products.filter((p) => p.tenantId === tenant.id)
  }, [products, tenant.id])

  // Dedicated Store Cart items calculation
  const storeCartItems = useMemo(() => {
    return cartItems.filter((item) => item.tenantId === tenant.id)
  }, [cartItems, tenant.id])
  const storeCartCount = storeCartItems.reduce((acc, item) => acc + item.quantity, 0)
  const storeCartSubtotal = storeCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Is this Poonam Dresses / fashion store with specific gender departments?
  const hasGenderDepartments = useMemo(() => {
    return storeProducts.some((p) => p.department && ['Women', 'Men', 'Kids'].includes(p.department))
  }, [storeProducts])

  // Department state ('all' | 'Women' | 'Men' | 'Kids')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedSubCategory, setSelectedSubCategory] = useState('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState('all')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const storePhone = tenant.phone || (tenant.id === 'tenant-poonam-dresses' ? '9325714431' : '9822012345')
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [contactName, setContactName] = useState('')
  const [contactPhoneInput, setContactPhoneInput] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [contactSubmitted, setContactSubmitted] = useState(false)

  // Department counts
  const departmentCounts = useMemo(() => {
    return {
      all: storeProducts.length,
      Women: storeProducts.filter((p) => p.department === 'Women').length,
      Men: storeProducts.filter((p) => p.department === 'Men').length,
      Kids: storeProducts.filter((p) => p.department === 'Kids').length,
    }
  }, [storeProducts])

  // Filter available subcategories dynamically
  const availableSubCategories = useMemo(() => {
    let prods = storeProducts
    if (selectedDepartment !== 'all') {
      prods = prods.filter((p) => p.department === selectedDepartment)
    }
    const cats = new Set(prods.map((p) => p.category).filter(Boolean))
    return ['all', ...Array.from(cats)]
  }, [storeProducts, selectedDepartment])

  // Reset subcategory when department changes
  const handleDepartmentChange = (dept) => {
    setSelectedDepartment(dept)
    setSelectedSubCategory('all')
  }

  // Filtered and sorted products
  const displayedProducts = useMemo(() => {
    return storeProducts
      .filter((p) => {
        if (selectedDepartment !== 'all' && p.department !== selectedDepartment) return false
        if (selectedSubCategory !== 'all' && p.category !== selectedSubCategory) return false
        if (searchKeyword.trim() && !p.name.toLowerCase().includes(searchKeyword.toLowerCase())) {
          return false
        }
        if (selectedPriceRange === 'under1000' && p.price >= 1000) return false
        if (selectedPriceRange === '1000to3000' && (p.price < 1000 || p.price > 3000)) return false
        if (selectedPriceRange === '3000to10000' && (p.price < 3000 || p.price > 10000)) return false
        if (selectedPriceRange === 'above10000' && p.price <= 10000) return false
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price
        if (sortBy === 'price-high') return b.price - a.price
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
        return 0 // default 'featured'
      })
  }, [
    storeProducts,
    selectedDepartment,
    selectedSubCategory,
    selectedPriceRange,
    searchKeyword,
    sortBy,
  ])

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white pb-20">
      
      {/* Marketplace Navigation */}
      <MarketplaceNavbar />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      <main className="flex-1">
        
        {/* ================= 1. STORE PROFILE HEADER ================= */}
        <section className="bg-white border-b border-gray-200">
          
          {/* Breadcrumb Navigation Bar */}
          <div className="bg-gray-50 border-b border-gray-100 px-4 sm:px-8 py-2.5 text-xs text-gray-500">
            <div className="max-w-7xl mx-auto flex items-center gap-1.5 flex-wrap">
              <Link to="/" className="hover:text-gray-900 transition flex items-center gap-1">
                <span>OmniMarket Home</span>
              </Link>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600 font-medium">{tenant.category}</span>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-gray-900 font-bold">{tenant.name}</span>
            </div>
          </div>

          {/* Banner Image Container */}
          <div className="relative w-full h-48 sm:h-64 lg:h-72 bg-gray-900 overflow-hidden">
            <img
              src={tenant.coverImage}
              alt={`${tenant.name} Cover`}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Top Right Badges */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-gray-900 shadow-md flex items-center gap-1.5 border border-white/50">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>{tenant.badge || 'Verified Partner Store'}</span>
              </span>
            </div>
          </div>

          {/* Store Info Container */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pt-2">
              
              {/* Left Logo + Meta */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                <div className="-mt-12 sm:-mt-16 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-1 shadow-xl border-2 border-white shrink-0 relative z-20">
                  <img
                    src={tenant.logo}
                    alt={tenant.name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                </div>

                <div className="pt-2 sm:pt-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                      {tenant.name}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                      {tenant.handle || `@${tenant.name.toLowerCase().replace(/\s+/g, '')}`}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {tenant.category}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 mt-1.5 max-w-2xl leading-relaxed">
                    {tenant.tagline || 'Official verified partner store offering genuine products and fast local delivery.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{tenant.rating || '5.0'}</span>
                      <span className="text-gray-500 font-normal">({tenant.reviewsCount || 1} reviews)</span>
                    </div>

                    {tenant.address && (
                      <div className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        <span>{tenant.address}</span>
                      </div>
                    )}

                    {tenant.dispatchTime && (
                      <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-800 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{tenant.dispatchTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Quick Actions (Includes Dedicated Store Cart Button) */}
              <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
                
                {/* Store-Specific Cart Button */}
                <button
                  type="button"
                  onClick={() => dispatch(setCartOpen(true))}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    storeCartCount > 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white ring-2 ring-blue-600/30'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{tenant.name} Bag ({storeCartCount})</span>
                  {storeCartCount > 0 && (
                    <span className="font-mono ml-1 font-extrabold">• ₹{storeCartSubtotal.toLocaleString('en-IN')}</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => alert(`Following ${tenant.name}! You will receive notifications for new drops & sales.`)}
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  Follow
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setIsContactOpen(true)
                    setContactSubmitted(false)
                  }}
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Contact</span>
                </button>
              </div>

            </div>
          </div>

        </section>

        {/* ================= 2. STORE CATALOG & PRODUCTS ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* If the store is a Fashion store with Women/Men/Kids departments */}
          {hasGenderDepartments && (
            <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-4 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => handleDepartmentChange('all')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  selectedDepartment === 'all'
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>All Departments</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-gray-200 text-gray-800">
                  {departmentCounts.all}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDepartmentChange('Women')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  selectedDepartment === 'Women'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Women's Wear</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800">
                  {departmentCounts.Women}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDepartmentChange('Men')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  selectedDepartment === 'Men'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Men's Wear</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-800">
                  {departmentCounts.Men}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDepartmentChange('Kids')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  selectedDepartment === 'Kids'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Baby className="w-4 h-4" />
                <span>Kids &amp; Girls Wear</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800">
                  {departmentCounts.Kids}
                </span>
              </button>
            </div>
          )}

          {/* Filter and Search Bar Controls */}
          {storeProducts.length > 0 ? (
            <div>
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6 bg-gray-50/80 p-3 rounded-2xl border border-gray-200">
                
                {/* Search in Store */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder={`Search within ${tenant.name}...`}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gray-900 transition"
                  />
                </div>

                {/* Subcategory dropdown */}
                {availableSubCategories.length > 2 && (
                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-gray-500" />
                    <select
                      value={selectedSubCategory}
                      onChange={(e) => setSelectedSubCategory(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl text-xs px-3 py-2 focus:outline-none focus:border-gray-900 transition font-medium"
                    >
                      <option value="all">All Store Categories</option>
                      {availableSubCategories
                        .filter((c) => c !== 'all')
                        .map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* Price range filter */}
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl text-xs px-3 py-2 focus:outline-none focus:border-gray-900 transition font-medium"
                >
                  <option value="all">All Prices</option>
                  <option value="under1000">Under ₹1,000</option>
                  <option value="1000to3000">₹1,000 – ₹3,000</option>
                  <option value="3000to10000">₹3,000 – ₹10,000</option>
                  <option value="above10000">Above ₹10,000</option>
                </select>

                {/* Sort order */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl text-xs px-3 py-2 focus:outline-none focus:border-gray-900 transition font-medium"
                  >
                    <option value="featured">Featured / Best Deals</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

              </div>

              {/* Products Grid */}
              {displayedProducts.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200 p-8">
                  <p className="text-sm font-bold text-gray-700">No items match your filter criteria.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDepartment('all')
                      setSelectedSubCategory('all')
                      setSelectedPriceRange('all')
                      setSearchKeyword('')
                    }}
                    className="mt-3 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

            </div>
          ) : (
            /* Empty State for Newly Registered Partner Store */
            <div className="max-w-2xl mx-auto text-center py-16 px-6 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 my-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-200">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-gray-900">Welcome to {tenant.name}!</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-md mx-auto leading-relaxed">
                This digital storefront is verified and active on the OmniMarket multi-tenant network. The merchant catalog is currently being loaded.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Vendor Portal Login</span>
                </Link>
                <Link
                  to="/"
                  className="px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold border border-gray-200 transition"
                >
                  <span>Browse Other Partner Stores</span>
                </Link>
              </div>
            </div>
          )}

        </section>

      </main>

      {/* ================= 3. FLOATING DEDICATED STORE CART BAR ================= */}
      {storeCartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-3xl mx-auto z-40 animate-in slide-in-from-bottom duration-200">
          <div className="bg-gray-900/95 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-gray-800 flex items-center justify-between gap-4 backdrop-blur-md">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-gray-200 flex items-center gap-1.5 truncate">
                  <span className="truncate">{tenant.name} Cart</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-blue-500/30 text-blue-300 text-[10px] shrink-0 font-extrabold">
                    {storeCartCount} item{storeCartCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="text-sm font-extrabold text-white">
                  ₹{storeCartSubtotal.toLocaleString('en-IN')}{' '}
                  <span className="text-[11px] text-gray-400 font-normal hidden sm:inline">
                    {storeCartSubtotal > 1000 ? '(Free Delivery)' : '(+ ₹40 Delivery)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => dispatch(clearStoreCart(tenant.id))}
                className="hidden sm:block px-3 py-2 text-xs font-semibold text-gray-400 hover:text-white transition cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => dispatch(setCartOpen(true))}
                className="px-4 sm:px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold shadow-md transition flex items-center gap-1.5 cursor-pointer group"
              >
                <span>View {tenant.name} Bag &amp; Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clean White Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 px-4 sm:px-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <Store className="w-4 h-4 text-blue-600" />
            <span>{tenant.name} — Verified Partner Store</span>
          </div>
          <div>All orders protected by OmniMarket Multi-Tenant Direct Merchant Fulfillment</div>
          <div>© 2026 {tenant.name}. All rights reserved.</div>
        </div>
      </footer>

      {/* Contact & Merchant Support Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white relative">
              <button
                type="button"
                onClick={() => setIsContactOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3.5">
                <img
                  src={tenant.logo}
                  alt={tenant.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-white/50 bg-white shadow-md"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-black">{tenant.name}</h3>
                    <CheckCircle2 className="w-4 h-4 text-white fill-white/20" />
                  </div>
                  <p className="text-xs text-blue-100 font-medium">Merchant Helpdesk &amp; Customer Support</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              
              {/* Quick Contact Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:+91${storePhone}`}
                  className="p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200/80 transition flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] text-blue-600 font-bold uppercase tracking-wider">Call Directly</div>
                    <div className="text-xs font-black text-gray-900 truncate">+91 {storePhone}</div>
                  </div>
                </a>

                <a
                  href={`https://wa.me/91${storePhone}?text=Hi%20${encodeURIComponent(tenant.name)},%20I%20have%20an%20inquiry%20regarding%20your%20products.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 transition flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider">WhatsApp Chat</div>
                    <div className="text-xs font-black text-gray-900 truncate">+91 {storePhone}</div>
                  </div>
                </a>
              </div>

              {/* Support Message Section */}
              {contactSubmitted ? (
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-emerald-950">Support Message Sent!</h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Your inquiry has been delivered directly to <span className="font-bold">{tenant.name}</span> support team at <span className="font-bold font-mono">+91 {storePhone}</span>.
                  </p>
                  <div className="text-[11px] text-emerald-600 bg-emerald-100/70 p-2 rounded-xl mt-2 font-medium">
                    A customer support executive will call or message you back shortly.
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setContactSubmitted(false)
                      setContactMessage('')
                    }}
                    className="mt-3 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (!contactPhoneInput.trim() && !contactMessage.trim()) return
                    setContactSubmitted(true)
                  }}
                  className="space-y-3.5 bg-gray-50/80 p-4 rounded-2xl border border-gray-200/80"
                >
                  <div className="flex items-center gap-2 text-xs font-black text-gray-900">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span>Send Instant Support Message</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-1">Your Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-1">Your Contact Number</label>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={contactPhoneInput}
                        onChange={(e) => setContactPhoneInput(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-1">How can we help you?</label>
                    <textarea
                      rows={3}
                      placeholder={`Type your inquiry or question for ${tenant.name}...`}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Support Message to {tenant.name}</span>
                  </button>
                </form>
              )}

              {/* Store Address & Hours Info */}
              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200/80 text-[11px] text-gray-600 space-y-1.5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <span>{tenant.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>Support Hours: 9:00 AM – 9:00 PM (Monday – Sunday)</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}
