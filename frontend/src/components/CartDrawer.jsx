import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  toggleCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  clearStoreCart,
  togglePocket,
  debitPocketMoney,
} from '../features/marketplace/marketplaceSlice'
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Store,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Truck,
  CreditCard,
  Clock,
  ExternalLink,
  Receipt,
  MapPin,
  Check,
  Lock,
  Wallet,
  Zap,
  Navigation,
  PhoneCall,
  PackageCheck,
  CircleDot,
  Share2,
} from 'lucide-react'

// Razorpay Test API Credentials provided by user
const RAZORPAY_TEST_KEY_ID = 'rzp_test_TVeMIEPx8WCIC1'

export default function CartDrawer() {
  const dispatch = useDispatch()
  const { cartItems, isCartOpen, tenants, pocketBalance } = useSelector((state) => state.marketplace)
  
  // Active store filter tab inside drawer ('all' or specific tenantId)
  const [activeStoreTab, setActiveStoreTab] = useState('all')
  
  // Checkout & Tracking Modal State
  const [checkoutStore, setCheckoutStore] = useState(null) // null | { tenantId, tenantName, items, total }
  const [orderSuccess, setOrderSuccess] = useState(null) // null | { orderId, storeName, total, address, paymentId }
  const [trackingOrder, setTrackingOrder] = useState(null) // null | order object for live tracker
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 402, Royal Residency, Senapati Bapat Road, Pune')
  const [customerName, setCustomerName] = useState('Shrutika Patil')
  const [customerPhone, setCustomerPhone] = useState('9822012345')
  const [customerEmail, setCustomerEmail] = useState('customer@omnimarket.io')
  const [isProcessingRazorpay, setIsProcessingRazorpay] = useState(false)

  if (!isCartOpen) return null

  // Group items by tenantId (creating separate product carts for each store)
  const groupedItems = cartItems.reduce((acc, item) => {
    const tenantId = item.tenantId || 'global'
    if (!acc[tenantId]) {
      const tenant = tenants.find((t) => t.id === tenantId)
      acc[tenantId] = {
        tenantId,
        tenantName: tenant ? tenant.name : item.tenantName || 'Independent Merchant',
        tenantLogo: tenant ? tenant.logo : null,
        tenantCategory: tenant ? tenant.category : 'Store',
        dispatchTime: tenant ? tenant.dispatchTime : '24-48 Hours Fast Dispatch',
        items: [],
      }
    }
    acc[tenantId].items.push(item)
    return acc
  }, {})

  const storeIds = Object.keys(groupedItems)
  const distinctStoresCount = storeIds.length
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const grandSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Filtered stores to display based on activeStoreTab
  const visibleStoreIds = activeStoreTab === 'all' ? storeIds : storeIds.filter((id) => id === activeStoreTab)

  const handleStartCheckout = (store) => {
    const storeSubtotal = store.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const storeDelivery = storeSubtotal > 1000 ? 0 : 40
    setCheckoutStore({
      tenantId: store.tenantId,
      tenantName: store.tenantName,
      items: store.items,
      subtotal: storeSubtotal,
      delivery: storeDelivery,
      total: storeSubtotal + storeDelivery,
    })
  }

  // Launch Official Razorpay Payment Gateway
  const handlePayWithRazorpay = () => {
    if (!checkoutStore) return
    setIsProcessingRazorpay(true)

    // Ensure Razorpay SDK is loaded
    if (typeof window.Razorpay === 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => triggerRazorpayModal()
      script.onerror = () => {
        setIsProcessingRazorpay(false)
        alert('Could not load Razorpay SDK. Please check your internet connection.')
      }
      document.body.appendChild(script)
    } else {
      triggerRazorpayModal()
    }
  }

  const triggerRazorpayModal = () => {
    const options = {
      key: RAZORPAY_TEST_KEY_ID,
      amount: Math.round(checkoutStore.total * 100), // Amount in paise
      currency: 'INR',
      name: checkoutStore.tenantName || 'OmniMarket Partner',
      description: `Payment for ${checkoutStore.items.length} items from ${checkoutStore.tenantName}`,
      image: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?w=200&auto=format&fit=crop&q=80',
      handler: function (response) {
        setIsProcessingRazorpay(false)
        const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000)
        const paymentId = response.razorpay_payment_id || `pay_rzp_${Date.now()}`
        
        const successData = {
          orderId,
          storeName: checkoutStore.tenantName,
          tenantId: checkoutStore.tenantId,
          total: checkoutStore.total,
          itemsCount: checkoutStore.items.reduce((acc, i) => acc + i.quantity, 0),
          items: checkoutStore.items,
          address: deliveryAddress,
          customerName,
          paymentMode: 'RAZORPAY GATEWAY',
          paymentId: paymentId,
          paidAt: new Date().toLocaleTimeString(),
          estimatedDelivery: '25-35 Mins',
        }

        // Clear only this store's cart
        dispatch(clearStoreCart(checkoutStore.tenantId))
        setCheckoutStore(null)
        setOrderSuccess(successData)
      },
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone,
      },
      notes: {
        merchant_store: checkoutStore.tenantName,
        merchant_id: checkoutStore.tenantId,
        delivery_address: deliveryAddress,
      },
      theme: {
        color: '#2563EB',
      },
      modal: {
        ondismiss: function () {
          setIsProcessingRazorpay(false)
        },
      },
    }

    try {
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response) {
        setIsProcessingRazorpay(false)
        alert(`Payment Failed: ${response.error.description || 'Transaction declined'}`)
      })
      rzp.open()
    } catch (err) {
      setIsProcessingRazorpay(false)
      console.error('Razorpay initialization error:', err)
    }
  }

  // Instant Test Simulation for COD or Demo
  const handleConfirmCodOrder = () => {
    if (!checkoutStore) return
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000)
    const successData = {
      orderId,
      storeName: checkoutStore.tenantName,
      tenantId: checkoutStore.tenantId,
      total: checkoutStore.total,
      itemsCount: checkoutStore.items.reduce((acc, i) => acc + i.quantity, 0),
      items: checkoutStore.items,
      address: deliveryAddress,
      customerName,
      paymentMode: 'CASH ON DELIVERY (COD)',
      paymentId: 'PAY-COD-VERIFIED',
      paidAt: new Date().toLocaleTimeString(),
      estimatedDelivery: '30-45 Mins',
    }
    
    dispatch(clearStoreCart(checkoutStore.tenantId))
    setCheckoutStore(null)
    setOrderSuccess(successData)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!checkoutStore && !orderSuccess && !trackingOrder) {
            dispatch(toggleCart())
          }
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white border-l border-gray-200 shadow-2xl flex flex-col justify-between relative">
          
          {/* ================= DRAWER HEADER ================= */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-gray-900 text-white rounded-xl shadow-xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900">Separate Store Carts</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  {totalItemsCount} item{totalItemsCount !== 1 ? 's' : ''} organized into{' '}
                  <span className="font-bold text-blue-600">{distinctStoresCount} dedicated store bag{distinctStoresCount !== 1 ? 's' : ''}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => dispatch(toggleCart())}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ================= STORE SELECTION TABS ================= */}
          {distinctStoresCount > 1 && (
            <div className="bg-gray-50 border-b border-gray-100 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
                Filter:
              </span>
              <button
                type="button"
                onClick={() => setActiveStoreTab('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeStoreTab === 'all'
                    ? 'bg-gray-900 text-white shadow-2xs'
                    : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                All Store Carts ({distinctStoresCount})
              </button>

              {storeIds.map((id) => {
                const s = groupedItems[id]
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveStoreTab(id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      activeStoreTab === id
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }`}
                  >
                    <span>{s.tenantName}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      activeStoreTab === id ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {s.items.length}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* ================= CART ITEMS LIST ================= */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-1">Your cart is empty</h4>
                <p className="text-xs text-gray-500 max-w-xs mb-6">
                  Explore our verified stores and restaurants to add products to your dedicated store carts.
                </p>
                <button
                  type="button"
                  onClick={() => dispatch(toggleCart())}
                  className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                >
                  Explore Stores
                </button>
              </div>
            ) : (
              visibleStoreIds.map((tenantId) => {
                const store = groupedItems[tenantId]
                const storeSubtotal = store.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
                const storeItemsCount = store.items.reduce((acc, i) => acc + i.quantity, 0)
                const deliveryFee = storeSubtotal > 1000 ? 0 : 40

                return (
                  <div
                    key={tenantId}
                    className="bg-white rounded-2xl border-2 border-gray-200/80 shadow-xs overflow-hidden transition hover:border-gray-300"
                  >
                    {/* Store Card Header */}
                    <div className="p-3.5 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {store.tenantLogo ? (
                          <img
                            src={store.tenantLogo}
                            alt={store.tenantName}
                            className="w-8 h-8 rounded-lg object-cover border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                            <Store className="w-4 h-4" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <Link
                              to={`/store/${store.tenantId}`}
                              onClick={() => dispatch(toggleCart())}
                              className="text-xs font-extrabold text-gray-900 hover:text-blue-600 transition truncate"
                            >
                              {store.tenantName}
                            </Link>
                            <ExternalLink className="w-3 h-3 text-gray-400 shrink-0" />
                          </div>
                          <p className="text-[10px] text-gray-500 font-medium truncate">
                            {store.dispatchTime}
                          </p>
                        </div>
                      </div>

                      {/* Clear this specific store's items */}
                      <button
                        type="button"
                        onClick={() => dispatch(clearStoreCart(store.tenantId))}
                        className="text-[11px] text-gray-400 hover:text-rose-600 font-medium transition cursor-pointer shrink-0"
                        title="Remove all items for this store"
                      >
                        Clear Bag
                      </button>
                    </div>

                    {/* Products for this Store */}
                    <div className="p-3.5 divide-y divide-gray-100">
                      {store.items.map((item) => (
                        <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                              {item.name}
                            </h4>
                            <div className="text-xs font-extrabold text-gray-900 mt-0.5">
                              ₹{item.price.toLocaleString('en-IN')}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                                <button
                                  type="button"
                                  onClick={() =>
                                    dispatch(
                                      updateCartQuantity({
                                        id: item.id,
                                        quantity: item.quantity - 1,
                                      })
                                    )
                                  }
                                  className="p-1 text-gray-500 hover:text-gray-900 transition cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2 text-xs font-black text-gray-900 font-mono">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    dispatch(
                                      updateCartQuantity({
                                        id: item.id,
                                        quantity: item.quantity + 1,
                                      })
                                    )
                                  }
                                  className="p-1 text-gray-500 hover:text-gray-900 transition cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => dispatch(removeFromCart(item.id))}
                                className="p-1 text-gray-400 hover:text-rose-600 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="text-right shrink-0 font-extrabold text-xs text-gray-900">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Store Subtotal & Store Checkout Action */}
                    <div className="p-3.5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] text-gray-500">
                          {storeItemsCount} item{storeItemsCount !== 1 ? 's' : ''} • Delivery:{' '}
                          <span className={deliveryFee === 0 ? 'text-emerald-600 font-bold' : 'font-bold'}>
                            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                          </span>
                        </div>
                        <div className="text-sm font-black text-gray-900">
                          ₹{(storeSubtotal + deliveryFee).toLocaleString('en-IN')}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStartCheckout(store)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Checkout ({store.tenantName.split(' ')[0]})</span>
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* ================= DRAWER FOOTER ================= */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-gray-200 bg-white space-y-3 z-10">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Grand Total Across All Stores:</span>
                <span className="text-base font-black text-gray-900">
                  ₹{grandSubtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <span className="text-[11px] text-gray-400">
                  Direct merchant fulfillment per store bag
                </span>
                <button
                  type="button"
                  onClick={() => dispatch(clearCart())}
                  className="text-xs text-gray-400 hover:text-rose-600 font-semibold transition cursor-pointer"
                >
                  Clear All Stores
                </button>
              </div>
            </div>
          )}

          {/* ================= RAZORPAY & STORE CHECKOUT MODAL ================= */}
          {checkoutStore && (
            <div className="absolute inset-0 bg-white z-50 flex flex-col justify-between p-6 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900">
                      Checkout from {checkoutStore.tenantName}
                    </h3>
                    <p className="text-xs text-gray-500">Official Razorpay Gateway Integration</p>
                  </div>
                </div>
                <button
                  onClick={() => setCheckoutStore(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                
                {/* Razorpay Gateway Badge */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                      ₹
                    </div>
                    <div>
                      <div className="text-xs font-bold text-blue-900">Razorpay Payment Gateway (Live Test)</div>
                      <div className="text-[10px] text-blue-700 font-mono">Key: {RAZORPAY_TEST_KEY_ID}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded">
                    100% Secured
                  </span>
                </div>

                {/* Items Summary */}
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                  <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Store Order Items ({checkoutStore.items.length})
                  </div>
                  <div className="space-y-1.5 text-xs text-gray-600">
                    {checkoutStore.items.map((i) => (
                      <div key={i.id} className="flex justify-between">
                        <span className="truncate max-w-[240px]">
                          {i.quantity}x {i.name}
                        </span>
                        <span className="font-bold text-gray-900">₹{(i.price * i.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Contact & Address */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Customer Name</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Delivery Address</label>
                    <div className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full bg-transparent focus:outline-none font-medium text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Bill Breakup */}
                <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Items Subtotal:</span>
                    <span>₹{checkoutStore.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Store Delivery Fee:</span>
                    <span>{checkoutStore.delivery === 0 ? 'FREE' : `₹${checkoutStore.delivery}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                    <span>Payable Total:</span>
                    <span className="text-blue-600">₹{checkoutStore.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Payment Actions */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                
                {/* 1-Click Pocket Payment */}
                {pocketBalance >= checkoutStore.total ? (
                  <button
                    type="button"
                    onClick={() => {
                      const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000)
                      dispatch(
                        debitPocketMoney({
                          amount: checkoutStore.total,
                          storeName: checkoutStore.tenantName,
                          orderId,
                        })
                      )
                      dispatch(clearStoreCart(checkoutStore.tenantId))
                      const successData = {
                        orderId,
                        storeName: checkoutStore.tenantName,
                        tenantId: checkoutStore.tenantId,
                        total: checkoutStore.total,
                        itemsCount: checkoutStore.items.reduce((acc, i) => acc + i.quantity, 0),
                        items: checkoutStore.items,
                        address: deliveryAddress,
                        customerName,
                        paymentMode: 'OMNI POCKET DIGITAL WALLET',
                        paymentId: `PKT-${Date.now()}`,
                        paidAt: new Date().toLocaleTimeString(),
                        estimatedDelivery: '25-35 Mins',
                      }
                      setCheckoutStore(null)
                      setOrderSuccess(successData)
                    }}
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-gray-950 rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Wallet className="w-4 h-4 text-gray-950" />
                    <span>
                      1-Click Pay ₹{checkoutStore.total.toLocaleString('en-IN')} with Pocket (Bal: ₹{pocketBalance.toLocaleString('en-IN')})
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between p-2 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                    <span className="text-[11px] text-amber-900 font-bold">
                      Pocket: ₹{pocketBalance.toLocaleString('en-IN')} (Low balance)
                    </span>
                    <button
                      type="button"
                      onClick={() => dispatch(togglePocket())}
                      className="text-[11px] font-extrabold text-blue-600 hover:underline cursor-pointer"
                    >
                      + Top Up Pocket
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  disabled={isProcessingRazorpay}
                  onClick={handlePayWithRazorpay}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isProcessingRazorpay
                      ? 'Launching Razorpay Gateway...'
                      : `Pay ₹${checkoutStore.total.toLocaleString('en-IN')} via Razorpay`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmCodOrder}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-gray-500" />
                  <span>Or Pay Cash on Delivery (COD)</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= ORDER SUCCESS & RAZORPAY RECEIPT MODAL ================= */}
          {orderSuccess && !trackingOrder && (
            <div className="absolute inset-0 bg-white z-50 flex flex-col justify-between p-6 animate-in zoom-in-95 duration-200">
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 ring-8 ring-emerald-50">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 mb-1">
                  Payment Verified &amp; Order Confirmed!
                </span>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">
                  Thank You for Ordering from {orderSuccess.storeName}!
                </h3>
                
                {/* Detailed Receipt Card */}
                <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 mt-6 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order ID:</span>
                    <span className="font-mono font-bold text-gray-900">{orderSuccess.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Razorpay Payment ID:</span>
                    <span className="font-mono font-bold text-blue-600">{orderSuccess.paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Merchant Store:</span>
                    <span className="font-bold text-gray-900">{orderSuccess.storeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount Paid:</span>
                    <span className="font-black text-emerald-600">₹{orderSuccess.total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Gateway:</span>
                    <span className="font-bold text-blue-700">{orderSuccess.paymentMode}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="text-gray-500">Delivery Address:</span>
                    <span className="font-medium text-gray-900 max-w-[200px] truncate text-right">{orderSuccess.address}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                  Your order has been acknowledged by <strong>{orderSuccess.storeName}</strong> fulfillment center. Fast dispatch is now in progress.
                </p>
              </div>

              {/* Action Buttons (Track Order & Continue Shopping) */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => setTrackingOrder(orderSuccess)}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Navigation className="w-4 h-4 animate-pulse text-blue-200" />
                  <span>📍 Track Your Order Live</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOrderSuccess(null)
                    dispatch(toggleCart())
                  }}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

          {/* ================= 📍 LIVE ORDER TRACKING MODAL ================= */}
          {trackingOrder && (
            <div className="absolute inset-0 bg-white z-50 flex flex-col justify-between p-6 animate-in slide-in-from-right duration-200">
              
              {/* Tracker Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                    <Navigation className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">Live Order Tracking</span>
                    <h3 className="text-base font-black text-gray-900">{trackingOrder.orderId}</h3>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setTrackingOrder(null)
                    setOrderSuccess(null)
                    dispatch(toggleCart())
                  }}
                  className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tracker Timeline & Map Simulation */}
              <div className="flex-1 overflow-y-auto py-5 space-y-6">
                
                {/* Estimated Delivery Hero Banner */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-blue-100 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Estimated Arrival</span>
                      </span>
                      <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-xs">
                        On Schedule
                      </span>
                    </div>
                    <div className="text-2xl font-black tracking-tight mt-1">
                      {trackingOrder.estimatedDelivery || '25 - 35 Minutes'}
                    </div>
                    <p className="text-xs text-blue-100 mt-1">
                      Fulfilling from <strong>{trackingOrder.storeName}</strong>
                    </p>
                  </div>
                  <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-15">
                    <Truck className="w-32 h-32" />
                  </div>
                </div>

                {/* Live Stepper Timeline */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                  <div className="text-xs font-black text-gray-900 uppercase tracking-wider mb-5 flex items-center justify-between">
                    <span>Order Progress</span>
                    <span className="text-emerald-600 flex items-center gap-1 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Live Status
                    </span>
                  </div>

                  <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-gray-200">
                    
                    {/* Step 1: Order Placed */}
                    <div className="relative flex items-start gap-4">
                      <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 z-10 ring-4 ring-emerald-100">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">Order Placed &amp; Paid (Razorpay)</div>
                        <div className="text-[11px] text-gray-500 font-medium">{trackingOrder.paidAt || 'Just now'} • Verified ID: {trackingOrder.paymentId?.substring(0, 14)}...</div>
                      </div>
                    </div>

                    {/* Step 2: Merchant Preparing (Active) */}
                    <div className="relative flex items-start gap-4">
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 z-10 ring-4 ring-blue-100 animate-pulse">
                        <PackageCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-blue-700">Merchant Preparing Your Package</div>
                        <div className="text-[11px] text-gray-600 mt-0.5">
                          {trackingOrder.storeName} kitchen / dispatch team is preparing your {trackingOrder.itemsCount || 'ordered'} items.
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Out for Delivery */}
                    <div className="relative flex items-start gap-4">
                      <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center shrink-0 z-10">
                        <Truck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-500">Out for Delivery</div>
                        <div className="text-[11px] text-gray-400">Rider assigned for rapid doorstep fulfillment.</div>
                      </div>
                    </div>

                    {/* Step 4: Arrived */}
                    <div className="relative flex items-start gap-4">
                      <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center shrink-0 z-10">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-500">Delivered</div>
                        <div className="text-[11px] text-gray-400">{trackingOrder.address}</div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Delivery Contact & Support */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm">
                      {trackingOrder.storeName?.substring(0, 1)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">{trackingOrder.storeName} Support</div>
                      <div className="text-[11px] text-gray-500">Direct Merchant Line • +91 98220 99482</div>
                    </div>
                  </div>
                  <a
                    href="tel:+919822099482"
                    className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 text-blue-600 transition shadow-2xs cursor-pointer"
                    title="Call Store Support"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                </div>

              </div>

              {/* Tracker Footer Action */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setTrackingOrder(null)
                    setOrderSuccess(null)
                    dispatch(toggleCart())
                  }}
                  className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Return to Marketplace Shopping</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  )
}
