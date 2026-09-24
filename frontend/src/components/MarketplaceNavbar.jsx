import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  setSelectedTenant,
  setSearchQuery,
  toggleCart,
  togglePocket,
} from '../features/marketplace/marketplaceSlice'
import { useTheme } from '../context/ThemeContext'
import {
  ShoppingBag,
  Search,
  Store,
  Layers,
  ChevronDown,
  User,
  Shield,
  ArrowRight,
  Menu,
  X,
  Building2,
  Package,
  Wallet,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react'

export default function MarketplaceNavbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { theme, resolvedTheme, setTheme } = useTheme()
  const { tenants, products, selectedTenantId, searchQuery, cartItems, pocketBalance } = useSelector(
    (state) => state.marketplace
  )
  const { loggedInUser } = useSelector((state) => state.auth)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false)
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false)
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false)
  const searchContainerRef = useRef(null)
  const themeContainerRef = useRef(null)

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const currentTenant = tenants.find((t) => t.id === selectedTenantId)

  // Live Matching Stores for Auto-Suggest
  const matchingStores = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase().trim()
    return tenants.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.handle.toLowerCase().includes(q) ||
        (t.tagline && t.tagline.toLowerCase().includes(q))
    )
  }, [tenants, searchQuery])

  // Live Matching Products
  const matchingProducts = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase().trim()
    return products
      .filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 4)
  }, [products, searchQuery])

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchDropdownOpen(false)
      }
      if (themeContainerRef.current && !themeContainerRef.current.contains(e.target)) {
        setThemeDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchChange = (e) => {
    const val = e.target.value
    dispatch(setSearchQuery(val))
    if (val.trim()) {
      setSearchDropdownOpen(true)
    } else {
      setSearchDropdownOpen(false)
    }
  }

  // Handle Search Submission (Enter key or Submit button)
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault()
    if (!searchQuery.trim()) return

    const q = searchQuery.toLowerCase().trim()

    // 1. Direct Store Match
    const directStoreMatch = tenants.find(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        q.includes(t.name.toLowerCase()) ||
        t.id.toLowerCase().includes(q) ||
        t.handle.toLowerCase().includes(q)
    )

    if (directStoreMatch) {
      setSearchDropdownOpen(false)
      setMobileMenuOpen(false)
      navigate(`/store/${directStoreMatch.id}`)
      return
    }

    // 2. Product Match -> Redirect to that Product's Store
    const productMatch = products.find((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    if (productMatch) {
      setSearchDropdownOpen(false)
      setMobileMenuOpen(false)
      navigate(`/store/${productMatch.tenantId}`)
      return
    }

    // 3. Fallback to first matching store
    if (matchingStores.length > 0) {
      setSearchDropdownOpen(false)
      setMobileMenuOpen(false)
      navigate(`/store/${matchingStores[0].id}`)
    }
  }

  const handleSelectStore = (storeId) => {
    setSearchDropdownOpen(false)
    setMobileMenuOpen(false)
    dispatch(setSearchQuery(''))
    navigate(`/store/${storeId}`)
  }

  const handleSelectTenant = (id) => {
    dispatch(setSelectedTenant(id))
    setTenantDropdownOpen(false)
    if (id !== 'all') {
      navigate(`/store/${id}`)
    } else {
      navigate('/')
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-2xs transition-colors duration-200">
      
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition">
            <Layers className="w-5 h-5 text-blue-400 dark:text-white" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight leading-none flex items-center gap-1">
              Omni<span className="text-blue-600 dark:text-blue-400">Market</span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Multi-Store
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Multi-Tenant Shopping & Dining</p>
          </div>
        </Link>

        {/* Tenant Selector Dropdown */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-200 transition cursor-pointer"
          >
            <Store className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="max-w-[180px] truncate">
              {currentTenant ? currentTenant.name : 'All Stores & Restaurants'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          </button>

          {tenantDropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                Select Store or Restaurant
              </div>
              <div className="max-h-72 overflow-y-auto py-1">
                <button
                  type="button"
                  onClick={() => handleSelectTenant('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                    selectedTenantId === 'all'
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    All Stores (Global Market)
                  </span>
                  {selectedTenantId === 'all' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />}
                </button>

                {tenants.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTenant(t.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                      selectedTenantId === t.id
                        ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={t.logo} alt={t.name} className="w-6 h-6 rounded-md object-cover border border-gray-200 dark:border-gray-700" />
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white leading-tight">{t.name}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-normal">{t.category}</div>
                      </div>
                    </div>
                    {selectedTenantId === t.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Global Marketplace Search Bar with Live Auto-Redirect Suggestions */}
        <div ref={searchContainerRef} className="flex-1 max-w-lg relative hidden lg:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchQuery.trim()) setSearchDropdownOpen(true)
              }}
              placeholder="Search store name (Poonam Dresses, Vijay Sales...) or products..."
              className="w-full pl-10 pr-20 py-2.5 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:bg-white dark:focus:bg-gray-900 focus:border-gray-900 dark:focus:border-blue-500 focus:outline-none transition shadow-2xs"
            />
            {searchQuery && (
              <button
                type="submit"
                className="absolute right-2 top-1.5 px-2.5 py-1 bg-gray-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition cursor-pointer"
              >
                Go
              </button>
            )}
          </form>

          {/* Interactive Live Search Dropdown */}
          {searchDropdownOpen && (matchingStores.length > 0 || matchingProducts.length > 0) && (
            <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              
              {/* Matching Stores Section */}
              {matchingStores.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 mb-1">
                    <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Matching Stores &amp; Restaurants</span>
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">Click to visit</span>
                  </div>

                  <div className="space-y-1">
                    {matchingStores.map((store) => (
                      <button
                        key={store.id}
                        type="button"
                        onClick={() => handleSelectStore(store.id)}
                        className="w-full text-left p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 transition flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={store.logo}
                            alt={store.name}
                            className="w-8 h-8 rounded-lg object-cover border border-gray-200 dark:border-gray-700 group-hover:scale-105 transition"
                          />
                          <div>
                            <div className="font-extrabold text-xs text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 flex items-center gap-1.5">
                              <span>{store.name}</span>
                              <span className="text-[10px] font-medium px-1.5 py-0.2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded">
                                {store.category}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                              {store.tagline}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition pr-1">
                          <span>Visit</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Products Section */}
              {matchingProducts.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 mb-1 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Matching Products</span>
                  </div>

                  <div className="space-y-1">
                    {matchingProducts.map((prod) => (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => handleSelectStore(prod.tenantId)}
                        className="w-full text-left p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-8 h-8 rounded-lg object-cover border border-gray-200 dark:border-gray-700 group-hover:scale-105 transition"
                          />
                          <div>
                            <div className="font-bold text-xs text-gray-900 dark:text-white line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                              {prod.name}
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-2">
                              <span className="font-extrabold text-gray-900 dark:text-white">₹{prod.price.toLocaleString('en-IN')}</span>
                              <span>•</span>
                              <span className="text-blue-600 dark:text-blue-400 font-medium">{prod.tenantName}</span>
                            </div>
                          </div>
                        </div>

                        <ArrowRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition pr-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Right Navigation & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* THEME TOGGLE DROPDOWN SWITCH */}
          <div ref={themeContainerRef} className="relative">
            <button
              type="button"
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 transition cursor-pointer shadow-2xs"
              title={`Switch Theme (Current: ${theme})`}
              aria-label="Toggle light or dark theme"
            >
              {resolvedTheme === 'dark' ? (
                <Moon className="w-4 h-4 text-indigo-400 animate-in spin-in-180 duration-200" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500 animate-in spin-in-180 duration-200" />
              )}
            </button>

            {themeDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800 mb-1">
                  Appearance
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setTheme('light')
                    setThemeDropdownOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    theme === 'light'
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light Mode</span>
                  </span>
                  {theme === 'light' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTheme('dark')
                    setThemeDropdownOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-300 font-bold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Dark Mode</span>
                  </span>
                  {theme === 'dark' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTheme('system')
                    setThemeDropdownOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    theme === 'system'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 font-bold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Laptop className="w-3.5 h-3.5 text-blue-500" />
                    <span>System Auto</span>
                  </span>
                  {theme === 'system' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                </button>
              </div>
            )}
          </div>

          {/* Store Owner Portal Link */}
          <Link
            to="/login"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition"
          >
            <Store className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
            <span>Store Portal</span>
          </Link>

          {/* 3-Role Login Button */}
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-900 dark:text-white hover:text-black dark:hover:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {loggedInUser ? loggedInUser.roleTitle : 'Sign In'}
            </span>
          </Link>

          {/* Pocket Digital Wallet Button */}
          <button
            type="button"
            onClick={() => dispatch(togglePocket())}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-900 dark:text-amber-100 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/80 transition shadow-2xs cursor-pointer group"
            title="OmniMarket Customer Pocket (Add Money)"
          >
            <div className="p-1.5 bg-amber-200 dark:bg-amber-800/60 text-amber-900 dark:text-amber-200 rounded-lg group-hover:scale-105 transition">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-black uppercase text-amber-700 dark:text-amber-400 leading-none">Pocket</span>
              <span className="text-xs font-black text-gray-900 dark:text-white leading-none mt-0.5">
                ₹{pocketBalance?.toLocaleString('en-IN') || '0'}
              </span>
            </div>
          </button>

          {/* Unified Cart Button */}
          <button
            type="button"
            onClick={() => dispatch(toggleCart())}
            className="relative flex items-center justify-center w-11 h-11 bg-gray-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white rounded-xl shadow-xs transition duration-150 cursor-pointer"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 dark:bg-rose-500 text-white font-bold text-[11px] rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-900 animate-in zoom-in">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

      </div>

      {/* Mobile search & menu drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Poonam Dresses, Vijay Sales..."
              className="w-full pl-10 pr-16 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white"
            />
            {searchQuery && (
              <button
                type="submit"
                className="absolute right-2 top-1.5 px-2 py-0.5 bg-gray-900 dark:bg-blue-600 text-white text-xs font-bold rounded"
              >
                Go
              </button>
            )}
          </form>

          {/* Mobile Theme Switcher Bar */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Theme Mode:</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-lg text-xs font-semibold ${
                  theme === 'light' ? 'bg-white dark:bg-gray-700 text-amber-600 shadow-xs' : 'text-gray-500'
                }`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-lg text-xs font-semibold ${
                  theme === 'dark' ? 'bg-white dark:bg-gray-700 text-indigo-400 shadow-xs' : 'text-gray-500'
                }`}
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-1.5 rounded-lg text-xs font-semibold ${
                  theme === 'system' ? 'bg-white dark:bg-gray-700 text-blue-500 shadow-xs' : 'text-gray-500'
                }`}
              >
                <Laptop className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Matching Stores Quick Links */}
          {matchingStores.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2 space-y-1">
              <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2">
                Matching Stores:
              </div>
              {matchingStores.map((store) => (
                <button
                  key={store.id}
                  type="button"
                  onClick={() => handleSelectStore(store.id)}
                  className="w-full text-left p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs font-bold"
                >
                  <div className="flex items-center gap-2">
                    <img src={store.logo} alt={store.name} className="w-5 h-5 rounded object-cover" />
                    <span className="text-gray-900 dark:text-white">{store.name}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Link
              to="/login"
              className="py-2 px-3 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between"
            >
              <span>Vendor / Store Owner Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/login"
              className="py-2 px-3 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between"
            >
              <span>Super Admin Master Access</span>
              <Shield className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
            </Link>
          </div>
        </div>
      )}

    </header>
  )
}
