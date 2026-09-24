import React from 'react'
import { Link } from 'react-router-dom'
import { Store, Star, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function TenantCard({ tenant }) {
  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg dark:hover:shadow-blue-950/30 transition-all duration-200 overflow-hidden flex flex-col justify-between">
      
      {/* Top Cover Banner */}
      <div className="h-28 w-full relative overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={tenant.coverImage}
          alt={tenant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category Pill */}
        <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-white/95 dark:bg-gray-900/90 backdrop-blur-xs text-[10px] font-bold text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 shadow-2xs">
          {tenant.category}
        </div>
      </div>

      {/* Content & Logo */}
      <div className="p-4 pt-0 relative flex-1 flex flex-col justify-between">
        
        {/* Overlapping Logo */}
        <div className="-mt-7 mb-2 flex items-end justify-between">
          <div className="w-14 h-14 rounded-xl bg-white dark:bg-gray-800 p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            <img
              src={tenant.logo}
              alt={tenant.name}
              className="w-full h-full rounded-lg object-cover"
            />
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{tenant.rating}</span>
          </div>
        </div>

        {/* Store Title & Badge */}
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              {tenant.name}
            </h4>
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          </div>

          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">
            {tenant.tagline}
          </p>
        </div>

        {/* Action Link to Storefront Page */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
          <span className="text-gray-400 dark:text-gray-500 font-medium text-[11px]">
            {tenant.productsCount} products
          </span>

          <Link
            to={`/store/${tenant.id}`}
            className="px-3 py-1.5 bg-gray-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
          >
            <span>Visit Store</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

      </div>
    </div>
  )
}
