import React, { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  updateProductPrice,
  updateProductStock,
  updateProductStockDetails,
  addProduct,
  deleteProduct,
  updateStoreProfile,
} from '../features/marketplace/marketplaceSlice'
import { logout } from '../features/auth/authSlice'
import MarketplaceNavbar from '../components/MarketplaceNavbar'
import CartDrawer from '../components/CartDrawer'
import {
  Store,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
  Eye,
  LogOut,
  Save,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Tag,
  ShoppingBag,
  Sparkles,
  Minus,
  Layers,
  Boxes,
  ShieldCheck,
  BarChart3,
  TrendingDown,
  Calendar,
  ChevronDown,
  LineChart as LineChartIcon,
  Info,
} from 'lucide-react'

// =========================================================================
// 1. DEDICATED REVENUE & SALES DUAL BAR CHART COMPONENT (SVG)
// =========================================================================
function RevenueSalesBarChart({ products }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const chartData = useMemo(() => {
    return products.slice(0, 6).map((p) => {
      const shortName = p.name.length > 16 ? p.name.slice(0, 14) + '...' : p.name
      return {
        id: p.id,
        name: p.name,
        shortName,
        revenue: p.revenue,
        unitsSold: p.unitsSold,
      }
    })
  }, [products])

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1000)
  const maxUnits = Math.max(...chartData.map((d) => d.unitsSold), 10)

  // Chart dimensions
  const svgWidth = 650
  const svgHeight = 280
  const padLeft = 70
  const padRight = 30
  const padTop = 30
  const padBottom = 50

  const plotWidth = svgWidth - padLeft - padRight
  const plotHeight = svgHeight - padTop - padBottom

  const barGroupWidth = plotWidth / (chartData.length || 1)
  const barWidth = Math.min(22, barGroupWidth * 0.28)

  // Y-axis grid ticks (4 intervals)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
    val: Math.round(maxRevenue * pct),
    y: padTop + plotHeight * (1 - pct),
  }))

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-gray-900">
              Product Revenue &amp; Sales Bar Chart
            </h3>
            <p className="text-xs text-gray-500">
              Comparison of total revenue (₹) vs sales volume (units) per product
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-bold bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-blue-600 shadow-2xs" />
            <span className="text-gray-700">Revenue (₹)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-500 shadow-2xs" />
            <span className="text-gray-700">Units Sold</span>
          </div>
        </div>
      </div>

      {/* SVG Bar Chart Canvas */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[500px]"
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="barRevGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="barUnitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={padLeft}
                y1={tick.y}
                x2={svgWidth - padRight}
                y2={tick.y}
                stroke="#F3F4F6"
                strokeWidth="1.5"
                strokeDasharray={i === 0 ? 'none' : '4 4'}
              />
              <text
                x={padLeft - 10}
                y={tick.y + 4}
                textAnchor="end"
                className="text-[11px] fill-gray-400 font-semibold font-mono"
              >
                ₹{tick.val >= 1000 ? `${(tick.val / 1000).toFixed(0)}k` : tick.val}
              </text>
            </g>
          ))}

          {/* Baseline X-axis */}
          <line
            x1={padLeft}
            y1={padTop + plotHeight}
            x2={svgWidth - padRight}
            y2={padTop + plotHeight}
            stroke="#E5E7EB"
            strokeWidth="2"
          />

          {/* Render Bars for each product */}
          {chartData.map((d, i) => {
            const groupCenterX = padLeft + i * barGroupWidth + barGroupWidth / 2
            
            // Revenue Bar
            const revHeight = (d.revenue / maxRevenue) * plotHeight
            const revY = padTop + plotHeight - revHeight
            const revX = groupCenterX - barWidth - 2

            // Units Bar (scaled proportionally to plotHeight)
            const unitHeight = (d.unitsSold / maxUnits) * plotHeight * 0.85
            const unitY = padTop + plotHeight - unitHeight
            const unitX = groupCenterX + 2

            const isHovered = hoveredIdx === i

            return (
              <g
                key={d.id}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer transition-opacity duration-150"
                opacity={hoveredIdx !== null && !isHovered ? 0.4 : 1}
              >
                {/* Background highlight pill on hover */}
                {isHovered && (
                  <rect
                    x={padLeft + i * barGroupWidth + 4}
                    y={padTop}
                    width={barGroupWidth - 8}
                    height={plotHeight}
                    fill="#EFF6FF"
                    rx="12"
                  />
                )}

                {/* Revenue Bar */}
                <rect
                  x={revX}
                  y={revY}
                  width={barWidth}
                  height={revHeight}
                  fill="url(#barRevGrad)"
                  rx="5"
                  className="transition-all duration-300 shadow-sm"
                />

                {/* Units Sold Bar */}
                <rect
                  x={unitX}
                  y={unitY}
                  width={barWidth}
                  height={unitHeight}
                  fill="url(#barUnitGrad)"
                  rx="5"
                  className="transition-all duration-300 shadow-sm"
                />

                {/* Value on top of bar on hover */}
                {isHovered && (
                  <g>
                    <text
                      x={revX + barWidth / 2}
                      y={revY - 6}
                      textAnchor="middle"
                      className="text-[10px] font-black fill-blue-800 font-mono"
                    >
                      ₹{(d.revenue / 1000).toFixed(1)}k
                    </text>
                    <text
                      x={unitX + barWidth / 2}
                      y={unitY - 6}
                      textAnchor="middle"
                      className="text-[10px] font-black fill-amber-700 font-mono"
                    >
                      {d.unitsSold}u
                    </text>
                  </g>
                )}

                {/* X-axis Product Label */}
                <text
                  x={groupCenterX}
                  y={padTop + plotHeight + 20}
                  textAnchor="middle"
                  className={`text-[10px] transition-colors ${
                    isHovered ? 'fill-blue-700 font-black' : 'fill-gray-600 font-bold'
                  }`}
                >
                  {d.shortName}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Hover Tooltip Box */}
        {hoveredIdx !== null && chartData[hoveredIdx] && (
          <div className="mt-2 p-2.5 bg-gray-900 text-white rounded-xl text-xs flex items-center justify-between shadow-lg">
            <span className="font-bold text-gray-200 truncate max-w-[280px]">
              {chartData[hoveredIdx].name}
            </span>
            <div className="flex items-center gap-3 font-mono">
              <span className="text-blue-400 font-extrabold">
                Revenue: ₹{chartData[hoveredIdx].revenue.toLocaleString('en-IN')}
              </span>
              <span className="text-amber-400 font-extrabold">
                Sales: {chartData[hoveredIdx].unitsSold} units
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>Highest sales earner: ₹{maxRevenue.toLocaleString('en-IN')}</span>
        <span className="font-bold text-blue-600">Top 6 Products in Catalog</span>
      </div>
    </div>
  )
}

// =========================================================================
// 2. DEDICATED STOCK LEVEL & INVENTORY HEALTH LINE CHART COMPONENT (SVG)
// =========================================================================
function StockLevelLineChart({ products }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const chartData = useMemo(() => {
    return products.slice(0, 7).map((p) => {
      const stock = p.stockCount !== undefined ? p.stockCount : p.inStock ? 15 : 0
      const shortName = p.name.length > 14 ? p.name.slice(0, 12) + '...' : p.name
      return {
        id: p.id,
        name: p.name,
        shortName,
        stock,
        isOut: p.inStock === false || stock === 0,
        isLow: p.inStock !== false && stock > 0 && stock <= 5,
      }
    })
  }, [products])

  const maxStock = Math.max(...chartData.map((d) => d.stock), 25)

  // Chart dimensions
  const svgWidth = 650
  const svgHeight = 280
  const padLeft = 50
  const padRight = 30
  const padTop = 30
  const padBottom = 50

  const plotWidth = svgWidth - padLeft - padRight
  const plotHeight = svgHeight - padTop - padBottom

  // Calculate points on SVG coordinate system
  const points = chartData.map((d, i) => {
    const x = padLeft + (i / Math.max(chartData.length - 1, 1)) * plotWidth
    const y = padTop + plotHeight - (d.stock / maxStock) * plotHeight
    return { ...d, x, y }
  })

  // Generate SVG smooth Bezier path
  const linePath = useMemo(() => {
    if (points.length === 0) return ''
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

    let path = `M ${points[0].x} ${points[0].y}`
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i]
      const next = points[i + 1]
      const cp1x = curr.x + (next.x - curr.x) / 2
      const cp1y = curr.y
      const cp2x = curr.x + (next.x - curr.x) / 2
      const cp2y = next.y
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`
    }
    return path
  }, [points])

  // Area path below the line
  const areaPath = useMemo(() => {
    if (points.length === 0) return ''
    const first = points[0]
    const last = points[points.length - 1]
    const bottomY = padTop + plotHeight
    return `${linePath} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`
  }, [linePath, points, padTop, plotHeight])

  // Critical Low Stock Threshold Line Y-coordinate (5 units)
  const lowStockThresholdY = padTop + plotHeight - (5 / maxStock) * plotHeight

  // Y-axis grid ticks
  const yTicks = [0, 5, 10, 15, 20, Math.max(25, maxStock)].filter(
    (val, i, arr) => arr.indexOf(val) === i && val <= maxStock
  ).map((val) => ({
    val,
    y: padTop + plotHeight - (val / maxStock) * plotHeight,
  }))

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
      {/* Header & Status Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <LineChartIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-gray-900">
              Stock Level &amp; Inventory Health Line Chart
            </h3>
            <p className="text-xs text-gray-500">
              Continuous inventory curve with critical replenishment threshold (5 units)
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-bold bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-500 rounded-full" />
            <span className="text-gray-700">Stock Curve</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b-2 border-rose-500 border-dashed" />
            <span className="text-rose-600">Min. Safe (5u)</span>
          </div>
        </div>
      </div>

      {/* SVG Line Chart Canvas */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[500px]"
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="stockAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#10B981" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={padLeft}
                y1={tick.y}
                x2={svgWidth - padRight}
                y2={tick.y}
                stroke="#F3F4F6"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={padLeft - 10}
                y={tick.y + 4}
                textAnchor="end"
                className="text-[11px] fill-gray-400 font-semibold font-mono"
              >
                {tick.val}
              </text>
            </g>
          ))}

          {/* Critical Low Stock Threshold Line (Dashed Rose) */}
          <g>
            <line
              x1={padLeft}
              y1={lowStockThresholdY}
              x2={svgWidth - padRight}
              y2={lowStockThresholdY}
              stroke="#F43F5E"
              strokeWidth="1.5"
              strokeDasharray="5 4"
            />
            <text
              x={svgWidth - padRight - 5}
              y={lowStockThresholdY - 6}
              textAnchor="end"
              className="text-[10px] fill-rose-600 font-black tracking-wider uppercase"
            >
              Threshold (5 Units)
            </text>
          </g>

          {/* Area Fill Below Line */}
          <path d={areaPath} fill="url(#stockAreaGrad)" />

          {/* Smooth Continuous Line Curve */}
          <path
            d={linePath}
            fill="none"
            stroke="#10B981"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-xs"
          />

          {/* Baseline X-axis */}
          <line
            x1={padLeft}
            y1={padTop + plotHeight}
            x2={svgWidth - padRight}
            y2={padTop + plotHeight}
            stroke="#E5E7EB"
            strokeWidth="2"
          />

          {/* Data Points (Dots on the curve) */}
          {points.map((p, i) => {
            const isHovered = hoveredIdx === i

            let pointColor = '#10B981'
            if (p.isOut) pointColor = '#F43F5E'
            else if (p.isLow) pointColor = '#F59E0B'

            return (
              <g
                key={p.id}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Vertical hover guide line */}
                {isHovered && (
                  <line
                    x1={p.x}
                    y1={padTop}
                    x2={p.x}
                    y2={padTop + plotHeight}
                    stroke="#D1D5DB"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Outer Glow Circle */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 8 : 5}
                  fill="white"
                  stroke={pointColor}
                  strokeWidth={isHovered ? 3.5 : 2.5}
                  className="transition-all duration-200 drop-shadow-sm"
                />

                {/* Inner center dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 3.5 : 2}
                  fill={pointColor}
                />

                {/* Stock count label on top of point */}
                <text
                  x={p.x}
                  y={p.y - 12}
                  textAnchor="middle"
                  className={`text-[11px] font-black font-mono transition-all ${
                    isHovered
                      ? 'fill-gray-900 text-xs'
                      : p.isOut
                      ? 'fill-rose-600'
                      : p.isLow
                      ? 'fill-amber-600'
                      : 'fill-emerald-700'
                  }`}
                >
                  {p.stock}
                </text>

                {/* X-axis Product Label */}
                <text
                  x={p.x}
                  y={padTop + plotHeight + 20}
                  textAnchor="middle"
                  className={`text-[10px] transition-colors ${
                    isHovered ? 'fill-emerald-700 font-black' : 'fill-gray-600 font-bold'
                  }`}
                >
                  {p.shortName}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Hover Tooltip Box */}
        {hoveredIdx !== null && points[hoveredIdx] && (
          <div className="mt-2 p-2.5 bg-gray-900 text-white rounded-xl text-xs flex items-center justify-between shadow-lg">
            <span className="font-bold text-gray-200 truncate max-w-[280px]">
              {points[hoveredIdx].name}
            </span>
            <div className="flex items-center gap-2 font-mono">
              <span
                className={`font-black px-2 py-0.5 rounded ${
                  points[hoveredIdx].isOut
                    ? 'bg-rose-950 text-rose-300'
                    : points[hoveredIdx].isLow
                    ? 'bg-amber-950 text-amber-300'
                    : 'bg-emerald-950 text-emerald-300'
                }`}
              >
                {points[hoveredIdx].isOut
                  ? 'Out of Stock (0 units)'
                  : `${points[hoveredIdx].stock} units left in stock`}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>Restock alert triggers when curve dips below 5 units</span>
        <span className="font-bold text-emerald-700">Live Inventory Health</span>
      </div>
    </div>
  )
}

// =========================================================================
// MAIN VENDOR DASHBOARD PAGE
// =========================================================================
export default function VendorDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loggedInUser } = useSelector((state) => state.auth)
  const { tenants, products } = useSelector((state) => state.marketplace)

  // Selected store to inspect in dashboard
  const [selectedStoreId, setSelectedStoreId] = useState(
    loggedInUser?.storeId || 'tenant-poonam-dresses'
  )

  const activeStore = tenants.find((t) => t.id === selectedStoreId) || tenants[0]

  // Products belonging to this specific store
  const storeProducts = useMemo(() => {
    return products.filter((p) => p.tenantId === activeStore.id)
  }, [products, activeStore.id])

  // Search & Filter within dashboard
  const [searchTerm, setSearchTerm] = useState('')
  const [stockFilter, setStockFilter] = useState('all') // 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'

  // Inline editing state for price
  const [editingPriceId, setEditingPriceId] = useState(null)
  const [editingPriceVal, setEditingPriceVal] = useState('')
  const [editingOrigVal, setEditingOrigVal] = useState('')

  // Inline editing state for stock count
  const [editingStockId, setEditingStockId] = useState(null)
  const [editingStockVal, setEditingStockVal] = useState('')

  // Add Product Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [newProdName, setNewProdName] = useState('')
  const [newProdCategory, setNewProdCategory] = useState(activeStore.category || 'General')
  const [newProdPrice, setNewProdPrice] = useState('')
  const [newProdOrigPrice, setNewProdOrigPrice] = useState('')
  const [newProdStock, setNewProdStock] = useState('20')
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80')
  const [newProdTag, setNewProdTag] = useState('New Drop')

  // Toast message
  const [toastMsg, setToastMsg] = useState('')

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  // Generate realistic sales & revenue metrics for each product
  const productSalesAnalytics = useMemo(() => {
    return storeProducts.map((p, idx) => {
      const baseUnits = Math.max(8, Math.round(((p.reviewsCount || 100) / 10) * (p.rating || 4.8) / 4))
      const unitsSold = Math.round(baseUnits * (1 + (idx % 3) * 0.4))
      const revenue = unitsSold * p.price
      const stock = p.stockCount !== undefined ? p.stockCount : p.inStock ? 15 : 0
      return {
        ...p,
        unitsSold,
        revenue,
        stock,
      }
    }).sort((a, b) => b.revenue - a.revenue)
  }, [storeProducts])

  // Total store sales revenue & units
  const totalStoreRevenue = useMemo(() => {
    return productSalesAnalytics.reduce((sum, p) => sum + p.revenue, 0)
  }, [productSalesAnalytics])

  // Filtered store products for inventory table
  const filteredProducts = useMemo(() => {
    return storeProducts.filter((p) => {
      const stock = p.stockCount !== undefined ? p.stockCount : p.inStock ? 15 : 0
      const isOut = p.inStock === false || stock === 0
      const isLow = !isOut && stock > 0 && stock <= 5

      if (searchTerm.trim() && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
      if (stockFilter === 'in_stock' && isOut) return false
      if (stockFilter === 'low_stock' && !isLow) return false
      if (stockFilter === 'out_of_stock' && !isOut) return false
      return true
    })
  }, [storeProducts, searchTerm, stockFilter])

  // Statistics
  const totalProductsCount = storeProducts.length
  const totalUnitsInStock = storeProducts.reduce((sum, p) => {
    const stock = p.stockCount !== undefined ? p.stockCount : p.inStock ? 15 : 0
    return sum + (p.inStock ? stock : 0)
  }, 0)
  const inStockCount = storeProducts.filter((p) => (p.inStock ?? true) && (p.stockCount === undefined || p.stockCount > 0)).length
  const lowStockCount = storeProducts.filter((p) => p.inStock && p.stockCount > 0 && p.stockCount <= 5).length
  const outOfStockCount = storeProducts.filter((p) => p.inStock === false || p.stockCount === 0).length

  // Save edited price
  const handleSavePrice = (productId) => {
    if (!editingPriceVal || Number(editingPriceVal) <= 0) return
    dispatch(
      updateProductPrice({
        id: productId,
        price: Number(editingPriceVal),
        originalPrice: editingOrigVal ? Number(editingOrigVal) : undefined,
      })
    )
    setEditingPriceId(null)
    showToast('Product price updated successfully!')
  }

  // Save edited stock units
  const handleSaveStockCount = (productId) => {
    const count = Math.max(0, parseInt(editingStockVal, 10) || 0)
    dispatch(
      updateProductStockDetails({
        id: productId,
        stockCount: count,
        inStock: count > 0,
      })
    )
    setEditingStockId(null)
    showToast(`Inventory updated: ${count} unit${count !== 1 ? 's' : ''} left in stock.`)
  }

  // Quick Stepper for stock count (+1 / -1 / +5)
  const handleQuickStockStep = (product, delta) => {
    const current = product.stockCount !== undefined ? product.stockCount : product.inStock ? 15 : 0
    const nextCount = Math.max(0, current + delta)
    dispatch(
      updateProductStockDetails({
        id: product.id,
        stockCount: nextCount,
        inStock: nextCount > 0,
      })
    )
    showToast(`Stock updated: ${nextCount} units remaining.`)
  }

  // Toggle inStock vs Out of Stock
  const handleToggleStock = (product) => {
    const currentInStock = (product.inStock ?? true) && (product.stockCount === undefined || product.stockCount > 0)
    const nextInStock = !currentInStock
    dispatch(
      updateProductStockDetails({
        id: product.id,
        inStock: nextInStock,
        stockCount: nextInStock ? (product.stockCount && product.stockCount > 0 ? product.stockCount : 10) : 0,
      })
    )
    showToast(`${product.name} is now ${nextInStock ? 'In Stock (Available)' : 'Out of Stock (Hidden from customer orders)'}`)
  }

  // Delete product
  const handleDeleteProduct = (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}" from ${activeStore.name} catalog?`)) {
      dispatch(deleteProduct(productId))
      showToast(`"${productName}" removed from catalog.`)
    }
  }

  // Add new product
  const handleAddProductSubmit = (e) => {
    e.preventDefault()
    if (!newProdName || !newProdPrice) return

    const initialStock = parseInt(newProdStock, 10) || 15

    dispatch(
      addProduct({
        tenantId: activeStore.id,
        tenantName: activeStore.name,
        name: newProdName,
        category: newProdCategory,
        price: Number(newProdPrice),
        originalPrice: newProdOrigPrice ? Number(newProdOrigPrice) : undefined,
        stockCount: initialStock,
        inStock: initialStock > 0,
        image: newProdImage,
        tag: newProdTag,
        featured: true,
      })
    )

    setShowAddModal(false)
    setNewProdName('')
    setNewProdPrice('')
    setNewProdOrigPrice('')
    setNewProdStock('20')
    showToast(`New product "${newProdName}" added with ${initialStock} units in stock!`)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white pb-12">
      
      {/* Top Navigation */}
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
        
        {/* ================= HEADER & STORE SWITCHER ================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={activeStore.logo}
              alt={activeStore.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-gray-100 shadow-sm shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Store Owner Management Hub</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live Visual Analytics Active
                </span>
              </div>
              
              {/* Store Switcher for easy inspection */}
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  {activeStore.name}
                </h1>
                <select
                  value={selectedStoreId}
                  onChange={(e) => setSelectedStoreId(e.target.value)}
                  className="text-xs font-bold bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-600 transition cursor-pointer"
                  title="Switch store to view its dedicated analytics"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      Switch Store: {t.name} ({t.category})
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {activeStore.category} • {activeStore.address || 'Commercial Center'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto flex-wrap">
            <Link
              to={`/store/${activeStore.id}`}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Eye className="w-4 h-4" />
              <span>Customer Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
            </Link>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* ================= STATS OVERVIEW CARDS ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Total Store Revenue */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-500 text-xs font-bold mb-2">
              <span>Total Store Revenue</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">
              ₹{totalStoreRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% this month</span>
            </div>
          </div>

          {/* Active Catalog & Units */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-500 text-xs font-bold mb-2">
              <span>Total Units in Stock</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600">{totalUnitsInStock}</div>
            <div className="text-[11px] text-gray-500 mt-1">
              Across {totalProductsCount} catalog items
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-500 text-xs font-bold mb-2">
              <span>Low Stock (&lt; 5 left)</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600">{lowStockCount}</div>
            <div className="text-[11px] text-gray-400 mt-1">Needs replenishment</div>
          </div>

          {/* Out of Stock */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-500 text-xs font-bold mb-2">
              <span>Out of Stock Items</span>
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-600">{outOfStockCount}</div>
            <div className="text-[11px] text-rose-600 font-semibold mt-1">Disabled for customers</div>
          </div>

        </div>

        {/* ================= VISUALIZATION CHARTS (BAR CHART + LINE CHART) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* 1. DUAL BAR CHART: REVENUE & SALES UNITS */}
          <RevenueSalesBarChart products={productSalesAnalytics} />

          {/* 2. SMOOTH LINE CHART: STOCK LEVEL & INVENTORY HEALTH */}
          <StockLevelLineChart products={productSalesAnalytics} />

        </div>

        {/* ================= INVENTORY & STOCK MANAGEMENT TABLE ================= */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
          
          {/* Table Header Controls */}
          <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-gray-50/50">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Product Inventory, Pricing &amp; Stock Controls
              </h3>
              <p className="text-xs text-gray-500">
                Edit items left in stock, toggle out of stock, change pricing, and add/remove products in real-time.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search input */}
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search store products..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gray-900 font-medium"
                />
              </div>

              {/* Stock Filter */}
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl text-xs px-3 py-2 font-bold text-gray-700"
              >
                <option value="all">All Products ({storeProducts.length})</option>
                <option value="in_stock">In Stock ({inStockCount})</option>
                <option value="low_stock">Low Stock &lt; 5 ({lowStockCount})</option>
                <option value="out_of_stock">Out of Stock ({outOfStockCount})</option>
              </select>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[11px] font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">Product Details</th>
                  <th className="py-3.5 px-4">Price (₹)</th>
                  <th className="py-3.5 px-4">Units Left (Stock Count)</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-4 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      No products found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isEditingPrice = editingPriceId === p.id
                    const isEditingStock = editingStockId === p.id
                    const stock = p.stockCount !== undefined ? p.stockCount : p.inStock ? 15 : 0
                    const isOut = p.inStock === false || stock === 0
                    const isLow = !isOut && stock > 0 && stock <= 5

                    return (
                      <tr key={p.id} className={`transition ${isOut ? 'bg-rose-50/20' : 'hover:bg-gray-50/80'}`}>
                        
                        {/* Product Details */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className={`w-12 h-12 rounded-xl object-cover border shrink-0 ${
                                isOut ? 'grayscale-40 border-rose-200' : 'border-gray-200'
                              }`}
                            />
                            <div>
                              <div className="font-bold text-gray-900 line-clamp-1 max-w-xs sm:max-w-md">
                                {p.name}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 text-[10px]">
                                  {p.category || 'General'}
                                </span>
                                {p.tag && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                                    {p.tag}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Price (Editable) */}
                        <td className="py-3 px-4">
                          {isEditingPrice ? (
                            <div className="flex items-center gap-1.5">
                              <div className="relative w-24">
                                <span className="absolute left-2 top-1.5 text-gray-400 text-xs">₹</span>
                                <input
                                  type="number"
                                  value={editingPriceVal}
                                  onChange={(e) => setEditingPriceVal(e.target.value)}
                                  className="w-full pl-5 pr-1 py-1 text-xs font-bold border-2 border-blue-600 rounded-lg focus:outline-none"
                                  autoFocus
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleSavePrice(p.id)}
                                className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
                                title="Save Price"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingPriceId(null)}
                                className="p-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg cursor-pointer"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 group">
                              <div>
                                <span className="font-extrabold text-sm text-gray-900">
                                  ₹{p.price.toLocaleString('en-IN')}
                                </span>
                                {p.originalPrice && (
                                  <span className="text-[11px] text-gray-400 line-through ml-1.5">
                                    ₹{p.originalPrice.toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingPriceId(p.id)
                                  setEditingPriceVal(p.price)
                                  setEditingOrigVal(p.originalPrice || '')
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 text-gray-400 hover:text-blue-600 rounded transition cursor-pointer"
                                title="Edit Price"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Stock Quantity / Items Left Controls (Store Owner Exclusive) */}
                        <td className="py-3 px-4">
                          {isEditingStock ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={0}
                                value={editingStockVal}
                                onChange={(e) => setEditingStockVal(e.target.value)}
                                className="w-20 px-2 py-1 text-xs font-bold border-2 border-blue-600 rounded-lg focus:outline-none"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveStockCount(p.id)}
                                className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
                                title="Save Stock Units"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingStockId(null)}
                                className="p-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg cursor-pointer"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {/* Quick Steppers */}
                              <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() => handleQuickStockStep(p, -1)}
                                  disabled={stock <= 0}
                                  className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                                  title="Decrease Stock by 1"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingStockId(p.id)
                                    setEditingStockVal(stock.toString())
                                  }}
                                  className="px-2.5 py-1 text-xs font-black text-gray-900 hover:bg-blue-50 hover:text-blue-600 cursor-pointer min-w-[3rem] text-center"
                                  title="Click to edit stock number"
                                >
                                  {stock} left
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleQuickStockStep(p, 1)}
                                  className="px-2 py-1 text-gray-600 hover:bg-gray-100 cursor-pointer"
                                  title="Increase Stock by 1"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Quick +5 Restock */}
                              <button
                                type="button"
                                onClick={() => handleQuickStockStep(p, 5)}
                                className="px-2 py-1 text-[10px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition cursor-pointer"
                                title="Add 5 units"
                              >
                                +5
                              </button>

                              {/* Low Stock Warning Icon */}
                              {isLow && (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                                  Low
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Availability Toggle (In Stock vs Out of Stock) */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleStock(p)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                              !isOut
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-600 text-white hover:bg-rose-700'
                            }`}
                            title={!isOut ? 'Click to mark as Out of Stock' : 'Click to restore to In Stock'}
                          >
                            <span className={`w-2 h-2 rounded-full ${!isOut ? 'bg-emerald-500' : 'bg-white animate-pulse'}`} />
                            <span>{!isOut ? 'In Stock' : 'Out of Stock'}</span>
                          </button>
                        </td>

                        {/* Delete & Catalog Actions */}
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                            title="Delete Product from Store"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>

                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

      </main>

      {/* ================= ADD PRODUCT MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 relative animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">Add New Product to {activeStore.name}</h3>
                  <p className="text-xs text-gray-500">Live instantly on your storefront</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Title / Name *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. 55-inch 4K Smart OLED TV"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    placeholder="e.g. Smart TVs"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Promo Tag</label>
                  <input
                    type="text"
                    value={newProdTag}
                    onChange={(e) => setNewProdTag(e.target.value)}
                    placeholder="e.g. 20% Off"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="45999"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={newProdOrigPrice}
                    onChange={(e) => setNewProdOrigPrice(e.target.value)}
                    placeholder="59999"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stock Units *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    placeholder="20"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Image URL</label>
                <input
                  type="url"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900"
                />
              </div>

              <div className="border-t border-gray-100 pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Publish to {activeStore.name}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 px-4 text-center text-xs text-gray-500">
        <div>OmniMarket Merchant Engine • Logged in as Verified Store Owner of {activeStore.name}</div>
      </footer>

    </div>
  )
}
