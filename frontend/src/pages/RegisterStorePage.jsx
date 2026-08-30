import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { registerStore } from '../features/marketplace/marketplaceSlice'
import MarketplaceNavbar from '../components/MarketplaceNavbar'
import CartDrawer from '../components/CartDrawer'
import {
  Store,
  Sparkles,
  ShieldCheck,
  Building2,
  ArrowRight,
  CheckCircle2,
  Upload,
  Layers,
  Truck,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Lock,
  ChevronLeft,
  ShoppingBag,
  Clock,
  Star,
  Check,
} from 'lucide-react'

export default function RegisterStorePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics & Appliances',
    industryCategory: 'electronics',
    tagline: '',
    address: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    dispatchTime: '24-48 Hours Fast Dispatch',
    payoutUpi: '',
    coverImage:
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop&q=80',
    logo:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&auto=format&fit=crop&q=80',
  })

  const [step, setStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [registeredTenantId, setRegisteredTenantId] = useState('')

  const categories = [
    { name: 'Electronics & Appliances', industry: 'electronics' },
    { name: 'Smartphones & Gadgets', industry: 'gadgets' },
    { name: 'Fashion & Ethnic Wear', industry: 'fashion' },
    { name: 'Restaurants & Dining', industry: 'restaurant' },
    { name: 'Home & Office Furniture', industry: 'furniture' },
    { name: 'Grocery & Supermarket', industry: 'grocery' },
    { name: 'Snacks & Fast Food Center', industry: 'snacks' },
  ]

  const dispatchOptions = [
    '24-48 Hours Fast Dispatch',
    'Same-Day / Next-Day Delivery',
    'Express Hot Delivery (30 mins)',
    '3-5 Days Direct Home Delivery',
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'category') {
      const selected = categories.find((c) => c.name === value)
      setFormData((prev) => ({
        ...prev,
        category: value,
        industryCategory: selected ? selected.industry : 'electronics',
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const storeName = formData.name.trim() || 'My Partner Store'
    const cleanId =
      'tenant-' +
      storeName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || `tenant-${Date.now()}`

    const newTenant = {
      id: cleanId,
      name: storeName,
      handle: `@${storeName.toLowerCase().replace(/\s+/g, '')}`,
      category: formData.category,
      industryCategory: formData.industryCategory,
      logo: formData.logo,
      coverImage: formData.coverImage,
      rating: 5.0,
      reviewsCount: 1,
      productsCount: 0,
      badge: 'Verified New Partner',
      tagline:
        formData.tagline ||
        'Official verified partner store offering genuine products and fast local delivery.',
      address: formData.address || 'Main Market Road',
      dispatchTime: formData.dispatchTime,
      type:
        formData.industryCategory === 'restaurant' || formData.industryCategory === 'snacks'
          ? 'restaurant'
          : 'store',
    }

    dispatch(registerStore(newTenant))
    setRegisteredTenantId(cleanId)
    setIsSuccess(true)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      
      <MarketplaceNavbar />
      <CartDrawer />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50/70 via-white to-white">
        <div className="max-w-6xl mx-auto">
          
          {/* Top Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-gray-900 transition flex items-center gap-1 font-medium">
              <ChevronLeft className="w-3.5 h-3.5" /> Back to Marketplace
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Register Your Store Digitally</span>
          </div>

          {/* Success Screen */}
          {isSuccess ? (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border-2 border-emerald-300 shadow-xl text-center animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                Store Live on OmniMarket
              </span>

              <h2 className="text-3xl font-black text-gray-900 mt-4 tracking-tight">
                Congratulations, {formData.name || 'Store Owner'}!
              </h2>
              <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto leading-relaxed">
                Your digital storefront is now live and listed in the multi-tenant marketplace under <strong>{formData.category}</strong>.
              </p>

              <div className="bg-gray-50 rounded-2xl p-4 my-6 border border-gray-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Store Handle:</span>
                  <span className="font-bold text-gray-900">
                    @{formData.name ? formData.name.toLowerCase().replace(/\s+/g, '') : 'newstore'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fulfillment Status:</span>
                  <span className="font-bold text-green-700">Verified & Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Store URL:</span>
                  <span className="font-bold text-blue-600">/store/{registeredTenantId}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to={`/store/${registeredTenantId}`}
                  className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>Visit Your Live Storefront</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/"
                  className="w-full sm:w-auto px-6 py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-2"
                >
                  <span>Go to Marketplace Home</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Registration Form Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form Steps */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
                
                {/* Header */}
                <div className="border-b border-gray-100 pb-6 mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold mb-3 border border-blue-200">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>5-Minute Merchant Digital Onboarding</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Add Your Store or Restaurant Online
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Set up your digital storefront, receive customer orders, and enjoy automated multi-store cart split payouts.
                  </p>

                  {/* Progress Step Indicator (Fully Clickable) */}
                  <div className="flex items-center gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        step === 1
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      <span>1. Store Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        step === 2
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      <span>2. Owner & Payouts</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* STEP 1: STORE PROFILE */}
                  {step === 1 && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">
                          Business / Store Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Store className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Royal Electronics, Sai Sweets, Metro Fashion"
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">
                          Business Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-blue-600 focus:outline-none transition cursor-pointer"
                        >
                          {categories.map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">
                          Store Tagline / Specialties <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="tagline"
                          required
                          value={formData.tagline}
                          onChange={handleChange}
                          placeholder="e.g., Premium 4K TVs, home appliances & same-day local delivery"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">
                          Physical Store Address & City <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                          <input
                            type="text"
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="e.g., Shop No. 12, Main Market Road, Near Clock Tower"
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                          />
                        </div>
                      </div>

                      <div className="pt-3">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Proceed to Owner & Payout Setup</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: OWNER & PAYOUTS */}
                  {step === 2 && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1.5">
                            Owner Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="ownerName"
                            required
                            value={formData.ownerName}
                            onChange={handleChange}
                            placeholder="e.g., Rajesh Sharma"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1.5">
                            Business Email <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                            <input
                              type="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="store@domain.com"
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1.5">
                            Order WhatsApp / Mobile <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                            <input
                              type="tel"
                              name="phone"
                              required
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+91 98765 43210"
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1.5">
                            Portal Password <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Lock className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                            <input
                              type="password"
                              name="password"
                              required
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="••••••••"
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">
                          Delivery / Dispatch SLA
                        </label>
                        <select
                          name="dispatchTime"
                          value={formData.dispatchTime}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-blue-600 focus:outline-none transition cursor-pointer"
                        >
                          {dispatchOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">
                          UPI ID / Bank Account for Instant Payouts <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <DollarSign className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                          <input
                            type="text"
                            name="payoutUpi"
                            required
                            value={formData.payoutUpi}
                            onChange={handleChange}
                            placeholder="e.g. storename@okaxis or 9876543210@paytm"
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-3">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Back to Step 1
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Complete Digital Store Registration</span>
                        </button>
                      </div>
                    </div>
                  )}

                </form>

              </div>

              {/* Right Column: Live Store Card Preview */}
              <div className="lg:col-span-5 sticky top-28 space-y-6">
                
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-4">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>Live Storefront Preview</span>
                  </div>

                  {/* Rendered Mock Store Card */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
                    <div className="h-32 w-full relative bg-gray-200">
                      <img
                        src={formData.coverImage}
                        alt="Store Cover"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-gray-900 shadow-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" />
                        <span>Verified New Partner</span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start gap-3 -mt-8 relative z-10 mb-2">
                        <img
                          src={formData.logo}
                          alt="Logo"
                          className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md bg-white shrink-0"
                        />
                        <div className="pt-2">
                          <h4 className="font-extrabold text-sm text-gray-900 line-clamp-1">
                            {formData.name || 'Your Store Name Here'}
                          </h4>
                          <span className="text-[10px] text-blue-600 font-semibold">
                            {formData.name
                              ? `@${formData.name.toLowerCase().replace(/\s+/g, '')}`
                              : '@yourstorehandle'}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 min-h-[30px]">
                        {formData.tagline || 'Your store tagline and specialties will appear here.'}
                      </p>

                      <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>5.0 (New)</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-700 font-medium">
                          <Truck className="w-3 h-3 text-green-600" />
                          <span>{formData.dispatchTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Benefits check list */}
                  <div className="mt-6 space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Instant Dedicated Storefront URL (`/store/...`)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Unified Shopping Cart & Multi-Store Payouts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Zero Setup Fees & Direct Merchant Billing</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>
      </main>

      {/* Clean White Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 px-4 sm:px-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <Store className="w-4 h-4 text-blue-600" />
            <span>OmniMarket Multi-Tenant Merchant Network</span>
          </div>
          <div>© 2026 OmniMarket. Empowering Independent Stores & Restaurants Digitally.</div>
        </div>
      </footer>

    </div>
  )
}
