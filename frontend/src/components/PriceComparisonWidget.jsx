import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../features/marketplace/marketplaceSlice'
import {
  benchmarkComparisonProducts,
  comparisonCategories,
} from '../data/electronicsComparisonData'
import {
  Smartphone,
  Tv,
  Laptop,
  Wind,
  Refrigerator,
  Check,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Truck,
  Star,
} from 'lucide-react'

export default function PriceComparisonWidget() {
  const dispatch = useDispatch()
  const [activeCategory, setActiveCategory] = useState('iPhones')

  // Find currently selected comparison product
  const activeProduct =
    benchmarkComparisonProducts.find((p) => p.category === activeCategory) ||
    benchmarkComparisonProducts[0]

  const iconMap = {
    iPhones: Smartphone,
    'Samsung Phones': Smartphone,
    'Smart TVs': Tv,
    Laptops: Laptop,
    'Air Conditioners': Wind,
    Refrigerators: Refrigerator,
  }

  const handleBuyFromStore = (offer) => {
    const productPayload = {
      id: `${activeProduct.comparisonId}-${offer.storeId}`,
      tenantId: offer.storeId,
      tenantName: offer.storeName,
      name: `${activeProduct.groupName}`,
      category: activeProduct.category,
      price: offer.price,
      originalPrice: activeProduct.mrp,
      rating: offer.rating,
      reviewsCount: 450,
      inStock: true,
      image: activeProduct.image,
      tag: offer.isBestDeal ? 'Best Price Deal' : 'Store Deal',
    }
    dispatch(addToCart(productPayload))
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold mb-2 shadow-2xs">
            <TrendingDown className="w-3.5 h-3.5 text-indigo-600" />
            <span>Multi-Store Live Price Comparison Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Compare Electronics Prices: Vijay Sales vs Croma vs Reliance Digital
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Same genuine brand product with official warranty — choose the store offering the best price, cashback & delivery!
          </p>
        </div>

        <div className="text-xs text-gray-500 flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 self-start md:self-auto">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span>100% Brand Certified • Official Indian Invoice</span>
        </div>
      </div>

      {/* 6 Category Pills (iPhones, Samsung Phones, TVs, Laptops, ACs, Fridges) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {comparisonCategories.map((cat) => {
          const isSelected = activeCategory === cat.name
          const IconComponent = iconMap[cat.name] || Smartphone
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{cat.name}</span>
            </button>
          )
        })}
      </div>

      {/* Active Comparison Matrix Card */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6 sm:p-8">
        
        {/* Top Product Summary */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <img
              src={activeProduct.image}
              alt={activeProduct.groupName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-gray-200 shadow-2xs shrink-0"
            />
            <div>
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                {activeProduct.category} Comparison
              </span>
              <h3 className="text-base sm:text-xl font-bold text-gray-900 mt-1">
                {activeProduct.groupName}
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-2xl font-mono">
                Specs: {activeProduct.specs}
              </p>
            </div>
          </div>

          <div className="text-left lg:text-right bg-gray-50 lg:bg-transparent p-3 lg:p-0 rounded-xl border lg:border-none border-gray-100">
            <div className="text-xs text-gray-400 font-medium">Official Brand MRP</div>
            <div className="text-lg font-bold text-gray-400 line-through">
              ₹{activeProduct.mrp.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* 3-Store Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          {activeProduct.storeOffers.map((offer) => {
            const savings = activeProduct.mrp - offer.price
            return (
              <div
                key={offer.storeId}
                className={`relative rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                  offer.isBestDeal
                    ? 'border-emerald-500 bg-emerald-50/20 shadow-md ring-2 ring-emerald-400/30'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs'
                }`}
              >
                {/* Best Deal Floating Ribbon */}
                {offer.isBestDeal && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Lowest Price Deal</span>
                  </div>
                )}

                <div>
                  {/* Store Name & Rating */}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                    <span className="font-extrabold text-sm text-gray-900">
                      {offer.storeName}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold bg-white px-2 py-0.5 rounded-md border border-gray-200">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="text-gray-800">{offer.rating}</span>
                    </div>
                  </div>

                  {/* Price Tag */}
                  <div className="my-2">
                    <div className="text-2xl font-black text-gray-900">
                      ₹{offer.price.toLocaleString('en-IN')}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {offer.discount}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        (Save ₹{savings.toLocaleString('en-IN')})
                      </span>
                    </div>
                  </div>

                  {/* Store Perks & Specs */}
                  <div className="space-y-2 my-4 text-xs text-gray-600 bg-white/80 p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1.5 font-medium text-indigo-900">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{offer.badge}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Truck className="w-3.5 h-3.5 text-green-600 shrink-0" />
                      <span>{offer.delivery}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{offer.warranty}</span>
                    </div>
                  </div>
                </div>

                {/* Add to Unified Cart Button */}
                <button
                  type="button"
                  onClick={() => handleBuyFromStore(offer)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    offer.isBestDeal
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-gray-900 hover:bg-black text-white'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy from {offer.storeName}</span>
                </button>

              </div>
            )
          })}
        </div>

      </div>

    </section>
  )
}
