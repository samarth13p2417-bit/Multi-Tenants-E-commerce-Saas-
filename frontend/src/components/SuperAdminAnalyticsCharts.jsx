import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Store,
  Award,
  ArrowUpRight,
  Filter,
  Sparkles,
  ArrowUpDown,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react'

export default function SuperAdminAnalyticsCharts({ tenants = [], products = [] }) {
  const [activeTab, setActiveTab] = useState('dual') // 'dual' | 'income' | 'visitors' | 'leaderboard'
  const [industryFilter, setIndustryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('income') // 'income' | 'visitors' | 'conversion' | 'rating'
  const [displayCount, setDisplayCount] = useState(8)
  const [hoveredStore, setHoveredStore] = useState(null)

  // 1. Compute realistic income and footfall for all partner stores
  const computedStoreAnalytics = useMemo(() => {
    return tenants.map((tenant) => {
      const storeProducts = products.filter((p) => p.tenantId === tenant.id)
      const catalogCount = storeProducts.length || tenant.productsCount || 8
      const rating = tenant.rating || 4.7
      const reviews = tenant.reviewsCount || 420
      const ind = tenant.industryCategory || tenant.industry || 'general'

      // Industry weight factors
      let ticketMultiplier = 1.0
      let trafficMultiplier = 1.0

      if (ind === 'electronics' || ind === 'gadgets') {
        ticketMultiplier = 3.2
        trafficMultiplier = 1.3
      } else if (ind === 'fashion') {
        ticketMultiplier = 1.4
        trafficMultiplier = 1.45
      } else if (ind === 'restaurant') {
        ticketMultiplier = 0.65
        trafficMultiplier = 1.8
      } else if (ind === 'travels') {
        ticketMultiplier = 2.5
        trafficMultiplier = 0.9
      } else if (ind === 'furniture') {
        ticketMultiplier = 2.8
        trafficMultiplier = 0.85
      }

      // Catalog valuation
      const catalogSum = storeProducts.reduce((sum, p) => sum + (p.price || 500), 0)
      const avgPrice = catalogCount > 0 ? catalogSum / catalogCount : 1200

      // Estimated Monthly Customer Visits (Footfall)
      const baseVisits = Math.round(
        (reviews * 14.5 * trafficMultiplier) +
        (catalogCount * 95) +
        (rating * 650)
      )
      const customerVisits = Math.max(3200, Math.min(68000, baseVisits))

      // Conversion rate (3.2% - 6.5%)
      const conversionRateVal = (3.2 + (rating - 4.0) * 2.2).toFixed(1)
      const totalOrders = Math.round(customerVisits * (parseFloat(conversionRateVal) / 100))

      // Estimated Monthly Income / Revenue (₹)
      const calculatedRevenue = Math.round(totalOrders * avgPrice * 0.42 * ticketMultiplier)
      const monthlyIncome = Math.max(250000, calculatedRevenue)

      return {
        id: tenant.id,
        name: tenant.name,
        category: tenant.category || 'Retail Store',
        industry: ind,
        logo: tenant.logo,
        address: tenant.address || 'Pune Commercial Area',
        rating,
        reviewsCount: reviews,
        catalogCount,
        customerVisits,
        monthlyIncome,
        totalOrders,
        conversionRate: parseFloat(conversionRateVal),
        avgTicket: Math.round(monthlyIncome / Math.max(1, totalOrders)),
      }
    })
  }, [tenants, products])

  // 2. Filter & Sort stores
  const filteredAndSortedStores = useMemo(() => {
    let result = [...computedStoreAnalytics]

    if (industryFilter !== 'all') {
      result = result.filter((s) => s.industry === industryFilter)
    }

    result.sort((a, b) => {
      if (sortBy === 'income') return b.monthlyIncome - a.monthlyIncome
      if (sortBy === 'visitors') return b.customerVisits - a.customerVisits
      if (sortBy === 'conversion') return b.conversionRate - a.conversionRate
      if (sortBy === 'rating') return b.rating - a.rating
      return 0
    })

    return result
  }, [computedStoreAnalytics, industryFilter, sortBy])

  // Display subset for charts
  const visibleStores = useMemo(() => {
    if (displayCount === 'all') return filteredAndSortedStores
    return filteredAndSortedStores.slice(0, Number(displayCount))
  }, [filteredAndSortedStores, displayCount])

  // Summary Metrics
  const topIncomeStore = useMemo(() => {
    return [...computedStoreAnalytics].sort((a, b) => b.monthlyIncome - a.monthlyIncome)[0]
  }, [computedStoreAnalytics])

  const topVisitedStore = useMemo(() => {
    return [...computedStoreAnalytics].sort((a, b) => b.customerVisits - a.customerVisits)[0]
  }, [computedStoreAnalytics])

  const totalPlatformIncome = useMemo(() => {
    return computedStoreAnalytics.reduce((sum, s) => sum + s.monthlyIncome, 0)
  }, [computedStoreAnalytics])

  const totalPlatformVisits = useMemo(() => {
    return computedStoreAnalytics.reduce((sum, s) => sum + s.customerVisits, 0)
  }, [computedStoreAnalytics])

  // Formatting helpers
  const formatCurrency = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`
    return `₹${val.toLocaleString('en-IN')}`
  }

  const formatVisits = (val) => {
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`
    return val.toLocaleString('en-IN')
  }

  // Maximum values for normalization
  const maxIncome = Math.max(...visibleStores.map((s) => s.monthlyIncome), 1000000)
  const maxVisits = Math.max(...visibleStores.map((s) => s.customerVisits), 10000)

  // SVG Chart Dimensions
  const svgWidth = 840
  const svgHeight = 320
  const padLeft = 85
  const padRight = 85
  const padTop = 35
  const padBottom = 65
  const plotWidth = svgWidth - padLeft - padRight
  const plotHeight = svgHeight - padTop - padBottom

  const groupWidth = plotWidth / (visibleStores.length || 1)
  const barWidth = Math.min(26, groupWidth * 0.36)

  // Y-axis ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
    incomeVal: Math.round(maxIncome * pct),
    visitsVal: Math.round(maxVisits * pct),
    y: padTop + plotHeight * (1 - pct),
  }))

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs mb-8">
      
      {/* Top Section Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Store Income &amp; Customer Footfall Intelligence
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Compare monthly gross revenue (₹) and customer traffic (store visits) across all 37 partner merchants
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-2xl self-stretch sm:self-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('dual')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'dual'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Dual Chart</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('income')
              setSortBy('income')
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'income'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Store Income</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('visitors')
              setSortBy('visitors')
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'visitors'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-amber-500" />
            <span>Customer Footfall</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-indigo-600" />
            <span>Leaderboard</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        
        {/* Top Income Store */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-4 rounded-2xl border border-emerald-200/70 flex items-start justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] font-extrabold uppercase tracking-wider mb-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>#1 Top Income Store</span>
            </div>
            <div className="font-black text-gray-900 text-base truncate max-w-[180px]">
              {topIncomeStore?.name || 'Top Merchant'}
            </div>
            <div className="text-xl font-black text-emerald-600 mt-0.5">
              {formatCurrency(topIncomeStore?.monthlyIncome || 0)}
              <span className="text-[10px] text-gray-500 font-normal"> /mo</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              {topIncomeStore?.category}
            </div>
          </div>
          {topIncomeStore?.logo && (
            <img
              src={topIncomeStore.logo}
              alt={topIncomeStore.name}
              className="w-11 h-11 rounded-xl object-cover border border-emerald-200 shrink-0 shadow-2xs"
            />
          )}
        </div>

        {/* Most Visited Store */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-4 rounded-2xl border border-amber-200/70 flex items-start justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center gap-1.5 text-amber-700 text-[11px] font-extrabold uppercase tracking-wider mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>#1 Most Visited Store</span>
            </div>
            <div className="font-black text-gray-900 text-base truncate max-w-[180px]">
              {topVisitedStore?.name || 'Popular Store'}
            </div>
            <div className="text-xl font-black text-amber-600 mt-0.5">
              {topVisitedStore?.customerVisits.toLocaleString('en-IN')}
              <span className="text-[10px] text-gray-500 font-normal"> visits/mo</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              {topVisitedStore?.category}
            </div>
          </div>
          {topVisitedStore?.logo && (
            <img
              src={topVisitedStore.logo}
              alt={topVisitedStore.name}
              className="w-11 h-11 rounded-xl object-cover border border-amber-200 shrink-0 shadow-2xs"
            />
          )}
        </div>

        {/* Total Aggregate Network Income */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80">
          <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>Total Network Monthly GMV</span>
          </div>
          <div className="text-xl font-black text-gray-900">
            {formatCurrency(totalPlatformIncome)}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            +18.4% monthly merchant growth
          </div>
        </div>

        {/* Total Aggregate Customer Footfall */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80">
          <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>Total Monthly Footfall</span>
          </div>
          <div className="text-xl font-black text-gray-900">
            {totalPlatformVisits.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">
            Across {computedStoreAnalytics.length} partner stores
          </div>
        </div>

      </div>

      {/* Filter & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50/80 rounded-2xl border border-gray-200/80 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span>Filter:</span>
          </span>

          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl text-xs px-2.5 py-1.5 font-bold text-gray-700 focus:outline-none"
          >
            <option value="all">All Industries ({tenants.length})</option>
            <option value="fashion">Fashion &amp; Garments</option>
            <option value="electronics">Electronics &amp; Appliances</option>
            <option value="gadgets">Mobiles &amp; Gadgets</option>
            <option value="restaurant">Food &amp; Sweets</option>
            <option value="furniture">Furniture</option>
            <option value="travels">Tours &amp; Travels</option>
            <option value="grocery">Grocery &amp; Supermarkets</option>
          </select>

          <span className="text-xs font-bold text-gray-500 flex items-center gap-1 ml-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <span>Sort:</span>
          </span>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl text-xs px-2.5 py-1.5 font-bold text-gray-700 focus:outline-none"
          >
            <option value="income">Highest Income (₹)</option>
            <option value="visitors">Most Customer Visits (Traffic)</option>
            <option value="conversion">Highest Conversion Rate (%)</option>
            <option value="rating">Highest Rating (★)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500">Show:</span>
          <div className="flex items-center bg-white border border-gray-200 rounded-xl p-0.5">
            {[6, 8, 12, 'all'].map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => setDisplayCount(cnt)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  displayCount === cnt
                    ? 'bg-gray-900 text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {cnt === 'all' ? 'All' : `Top ${cnt}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DUAL / COMPARATIVE SVG BAR CHART                                       */}
      {/* ========================================================================= */}
      {activeTab !== 'leaderboard' && (
        <div className="relative">
          
          {/* Chart Header Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2 px-2">
            <div className="text-xs font-extrabold text-gray-700 flex items-center gap-2">
              <span>Comparing {visibleStores.length} Stores</span>
              <span className="text-gray-400 font-normal">| Hover on any bar for store metrics</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs">
              {(activeTab === 'dual' || activeTab === 'income') && (
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-emerald-500 shadow-2xs" />
                  <span className="text-gray-700">Store Income (₹ Left Axis)</span>
                </div>
              )}
              {(activeTab === 'dual' || activeTab === 'visitors') && (
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-amber-500 shadow-2xs" />
                  <span className="text-gray-700">Customer Footfall (👥 Right Axis)</span>
                </div>
              )}
            </div>
          </div>

          {/* SVG Canvas Container */}
          <div className="w-full overflow-x-auto bg-gradient-to-b from-gray-50/50 to-white rounded-2xl border border-gray-200/70 p-4">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto min-w-[700px] select-none"
            >
              <defs>
                {/* Income Bar Gradient */}
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>

                {/* Income Hover Gradient */}
                <linearGradient id="incomeGradientHover" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>

                {/* Footfall Bar Gradient */}
                <linearGradient id="visitsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>

                {/* Footfall Hover Gradient */}
                <linearGradient id="visitsGradientHover" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>

              {/* Grid lines & Y-Axis Labels */}
              {yTicks.map((t, idx) => (
                <g key={idx}>
                  <line
                    x1={padLeft}
                    y1={t.y}
                    x2={svgWidth - padRight}
                    y2={t.y}
                    stroke="#E5E7EB"
                    strokeDasharray={idx === 0 ? 'none' : '4 4'}
                    strokeWidth={idx === 0 ? '1.5' : '1'}
                  />
                  
                  {/* Left Axis: Income (₹) */}
                  {(activeTab === 'dual' || activeTab === 'income') && (
                    <text
                      x={padLeft - 10}
                      y={t.y + 4}
                      textAnchor="end"
                      fill="#059669"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {formatCurrency(t.incomeVal)}
                    </text>
                  )}

                  {/* Right Axis: Visitors */}
                  {(activeTab === 'dual' || activeTab === 'visitors') && (
                    <text
                      x={svgWidth - padRight + 10}
                      y={t.y + 4}
                      textAnchor="start"
                      fill="#D97706"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {formatVisits(t.visitsVal)}
                    </text>
                  )}
                </g>
              ))}

              {/* Bars for Each Store */}
              {visibleStores.map((store, i) => {
                const groupX = padLeft + i * groupWidth
                const centerX = groupX + groupWidth / 2
                const isHovered = hoveredStore?.id === store.id

                // Heights
                const incomePct = store.monthlyIncome / maxIncome
                const incomeBarHeight = Math.max(6, plotHeight * incomePct)
                const incomeY = padTop + plotHeight - incomeBarHeight

                const visitsPct = store.customerVisits / maxVisits
                const visitsBarHeight = Math.max(6, plotHeight * visitsPct)
                const visitsY = padTop + plotHeight - visitsBarHeight

                // Dual vs Single layout positions
                let incomeX = centerX - barWidth - 2
                let visitsX = centerX + 2
                let singleBarWidth = barWidth * 1.6

                if (activeTab === 'income') {
                  incomeX = centerX - singleBarWidth / 2
                } else if (activeTab === 'visitors') {
                  visitsX = centerX - singleBarWidth / 2
                }

                const shortName =
                  store.name.length > 12 ? store.name.slice(0, 11) + '…' : store.name

                return (
                  <g
                    key={store.id}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredStore(store)}
                    onMouseLeave={() => setHoveredStore(null)}
                  >
                    {/* Hover Highlight Column Background */}
                    {isHovered && (
                      <rect
                        x={groupX + 2}
                        y={padTop}
                        width={groupWidth - 4}
                        height={plotHeight}
                        fill="#F3F4F6"
                        rx="8"
                        opacity="0.6"
                      />
                    )}

                    {/* Store Income Bar (Green) */}
                    {(activeTab === 'dual' || activeTab === 'income') && (
                      <rect
                        x={incomeX}
                        y={incomeY}
                        width={activeTab === 'income' ? singleBarWidth : barWidth}
                        height={incomeBarHeight}
                        rx="5"
                        fill={isHovered ? 'url(#incomeGradientHover)' : 'url(#incomeGradient)'}
                        className="transition-all duration-200"
                      />
                    )}

                    {/* Customer Footfall Bar (Amber) */}
                    {(activeTab === 'dual' || activeTab === 'visitors') && (
                      <rect
                        x={visitsX}
                        y={visitsY}
                        width={activeTab === 'visitors' ? singleBarWidth : barWidth}
                        height={visitsBarHeight}
                        rx="5"
                        fill={isHovered ? 'url(#visitsGradientHover)' : 'url(#visitsGradient)'}
                        className="transition-all duration-200"
                      />
                    )}

                    {/* X-Axis Store Name Label */}
                    <text
                      x={centerX}
                      y={svgHeight - padBottom + 18}
                      textAnchor="middle"
                      fill={isHovered ? '#111827' : '#4B5563'}
                      fontSize="10"
                      fontWeight={isHovered ? '800' : '600'}
                      fontFamily="sans-serif"
                    >
                      {shortName}
                    </text>

                    {/* X-Axis Sub-label: Category tag */}
                    <text
                      x={centerX}
                      y={svgHeight - padBottom + 30}
                      textAnchor="middle"
                      fill="#9CA3AF"
                      fontSize="8"
                      fontWeight="500"
                      fontFamily="sans-serif"
                    >
                      {store.industry}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Floating Hover Card Detail */}
          {hoveredStore && (
            <div className="mt-3 p-4 bg-gray-900 text-white rounded-2xl shadow-xl border border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center gap-3">
                {hoveredStore.logo && (
                  <img
                    src={hoveredStore.logo}
                    alt={hoveredStore.name}
                    className="w-12 h-12 rounded-xl object-cover border border-gray-700 shrink-0"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-sm">{hoveredStore.name}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      ★ {hoveredStore.rating} ({hoveredStore.reviewsCount} reviews)
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">{hoveredStore.category} • {hoveredStore.address}</div>
                </div>
              </div>

              <div className="flex items-center gap-6 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-800">
                <div>
                  <div className="text-[11px] text-gray-400 uppercase font-bold">Monthly Income</div>
                  <div className="text-base font-black text-emerald-400">
                    {formatCurrency(hoveredStore.monthlyIncome)}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-gray-400 uppercase font-bold">Customer Visits</div>
                  <div className="text-base font-black text-amber-400">
                    {hoveredStore.customerVisits.toLocaleString('en-IN')}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-gray-400 uppercase font-bold">Conversion</div>
                  <div className="text-base font-black text-blue-400">
                    {hoveredStore.conversionRate}%
                  </div>
                </div>

                <Link
                  to={`/store/${hoveredStore.id}`}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
                >
                  <span>Storefront</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
                </Link>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. LEADERBOARD / RANKINGS VIEW                                            */}
      {/* ========================================================================= */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-gray-500 mb-2">
            Multi-Tenant Partner Merchant Performance Rankings (Sorted by {sortBy.toUpperCase()})
          </div>

          <div className="grid grid-cols-1 gap-3">
            {visibleStores.map((store, rankIdx) => {
              const incomeRatio = Math.round((store.monthlyIncome / (topIncomeStore?.monthlyIncome || 1)) * 100)
              const visitsRatio = Math.round((store.customerVisits / (topVisitedStore?.customerVisits || 1)) * 100)

              return (
                <div
                  key={store.id}
                  className="p-4 bg-gray-50 hover:bg-gray-100/80 rounded-2xl border border-gray-200/80 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  {/* Left: Rank + Info */}
                  <div className="flex items-center gap-3 w-full md:w-1/3">
                    <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                      rankIdx === 0
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : rankIdx === 1
                        ? 'bg-slate-200 text-slate-800 border border-slate-300'
                        : rankIdx === 2
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-white text-gray-600 border border-gray-200'
                    }`}>
                      #{rankIdx + 1}
                    </span>

                    <img
                      src={store.logo}
                      alt={store.name}
                      className="w-10 h-10 rounded-xl object-cover border border-gray-200 shrink-0"
                    />

                    <div className="min-w-0">
                      <div className="font-extrabold text-gray-900 text-sm truncate">{store.name}</div>
                      <div className="text-[11px] text-gray-500 truncate">{store.category}</div>
                    </div>
                  </div>

                  {/* Middle: Comparative Progress Bars */}
                  <div className="w-full md:w-1/2 space-y-2">
                    {/* Income Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] font-bold mb-1">
                        <span className="text-emerald-700 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>Income: {formatCurrency(store.monthlyIncome)}</span>
                        </span>
                        <span className="text-gray-500">{incomeRatio}% of peak</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${incomeRatio}%` }}
                        />
                      </div>
                    </div>

                    {/* Customer Visits Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] font-bold mb-1">
                        <span className="text-amber-700 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>Customer Visits: {store.customerVisits.toLocaleString('en-IN')}</span>
                        </span>
                        <span className="text-gray-500">{visitsRatio}% of peak</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${visitsRatio}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick Action Link */}
                  <div className="flex items-center justify-end w-full md:w-auto shrink-0">
                    <Link
                      to={`/store/${store.id}`}
                      className="px-3 py-1.5 bg-white hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold border border-gray-200 transition flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
