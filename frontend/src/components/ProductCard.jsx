import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, setSelectedTenant } from '../features/marketplace/marketplaceSlice'
import { Star, ShoppingBag, Store, AlertTriangle, Check } from 'lucide-react'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const { tenants } = useSelector((state) => state.marketplace)
  const { loggedInUser } = useSelector((state) => state.auth)
  const tenant = tenants.find((t) => t.id === product.tenantId)

  // Check stock availability
  const isOutOfStock = product.inStock === false || product.stockCount === 0
  const isLowStock = !isOutOfStock && product.stockCount !== undefined && product.stockCount > 0 && product.stockCount <= 5

  const handleAddToCart = (e) => {
    e.stopPropagation()
    if (isOutOfStock) return
    dispatch(addToCart(product))
  }

  const handleTenantClick = (e) => {
    e.stopPropagation()
    dispatch(setSelectedTenant(product.tenantId))
  }

  const isStoreOwner = loggedInUser?.role === 'vendor' && loggedInUser?.storeId === product.tenantId

  return (
    <div className={`group bg-white rounded-2xl border overflow-hidden transition-all duration-200 flex flex-col justify-between relative ${
      isOutOfStock ? 'border-gray-200 opacity-80' : 'border-gray-200 hover:shadow-lg hover:border-gray-300'
    }`}>
      
      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isOutOfStock ? 'grayscale-40' : 'group-hover:scale-105'
          }`}
          loading="lazy"
        />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex flex-col items-center justify-center text-white p-3 text-center z-10">
            <span className="px-3 py-1 bg-rose-600 text-white rounded-full text-xs font-black tracking-wider uppercase shadow-md mb-1">
              Out of Stock
            </span>
            <span className="text-[10px] text-gray-200">Merchant restocking soon</span>
          </div>
        )}

        {/* Tag badge or Low Stock badge */}
        {!isOutOfStock && isLowStock ? (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-black shadow-xs flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Only {product.stockCount} left!</span>
          </div>
        ) : product.tag ? (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-bold text-gray-900 shadow-xs border border-gray-200">
            {product.tag}
          </div>
        ) : null}

        {/* Quick Add Button Overlay (Only when in stock) */}
        {!isOutOfStock && (
          <button
            type="button"
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-white/95 hover:bg-gray-900 text-gray-900 hover:text-white shadow-md border border-gray-200 transition duration-150 cursor-pointer"
            title="Add to Unified Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Tenant Store Badge */}
          <button
            type="button"
            onClick={handleTenantClick}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline mb-1.5 group/tenant cursor-pointer text-left"
          >
            <Store className="w-3 h-3 text-blue-500 shrink-0" />
            <span className="truncate">{tenant ? tenant.name : product.tenantName}</span>
          </button>

          {/* Product Title */}
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold text-gray-800 ml-1">{product.rating}</span>
            </div>
            <span>•</span>
            <span className="text-[11px]">({product.reviewsCount} reviews)</span>
          </div>

          {/* Private Merchant Stock Indicator (Only for logged-in Store Owner) */}
          {isStoreOwner && (
            <div className="mt-2 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
              <span>👑 Store Owner Stock: {product.stockCount ?? 15} units</span>
            </div>
          )}
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-base font-extrabold text-gray-900">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          {isOutOfStock ? (
            <button
              type="button"
              disabled
              className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-400 text-xs font-semibold cursor-not-allowed border border-gray-200"
            >
              Out of Stock
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className="px-3.5 py-1.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Add</span>
              <ShoppingBag className="w-3 h-3" />
            </button>
          )}
        </div>

      </div>

    </div>
  )
}
