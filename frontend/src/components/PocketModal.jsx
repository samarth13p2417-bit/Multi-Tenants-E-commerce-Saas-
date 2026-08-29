import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  togglePocket,
  addMoneyToPocket,
} from '../features/marketplace/marketplaceSlice'
import {
  X,
  Wallet,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Lock,
  CreditCard,
  Zap,
  TrendingUp,
} from 'lucide-react'

// Razorpay Test API Key
const RAZORPAY_TEST_KEY_ID = 'rzp_test_TVeMIEPx8WCIC1'

export default function PocketModal() {
  const dispatch = useDispatch()
  const { isPocketOpen, pocketBalance, pocketTransactions } = useSelector(
    (state) => state.marketplace
  )

  const [topUpAmount, setTopUpAmount] = useState(1000)
  const [customAmount, setCustomAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [topUpSuccess, setTopUpSuccess] = useState(null)

  if (!isPocketOpen) return null

  const selectedAmount = customAmount ? Number(customAmount) : topUpAmount

  const handleTopUpRazorpay = () => {
    if (!selectedAmount || selectedAmount <= 0) {
      alert('Please select or enter a valid top-up amount.')
      return
    }

    setIsProcessing(true)

    // Trigger Razorpay Checkout for adding money to pocket
    if (typeof window.Razorpay === 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => launchRazorpayPocket()
      script.onerror = () => {
        setIsProcessing(false)
        alert('Could not load Razorpay SDK.')
      }
      document.body.appendChild(script)
    } else {
      launchRazorpayPocket()
    }
  }

  const launchRazorpayPocket = () => {
    const options = {
      key: RAZORPAY_TEST_KEY_ID,
      amount: Math.round(selectedAmount * 100), // paise
      currency: 'INR',
      name: 'OmniMarket Pocket Top-Up',
      description: `Adding ₹${selectedAmount} to your OmniMarket Digital Pocket`,
      image: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?w=200&auto=format&fit=crop&q=80',
      handler: function (response) {
        setIsProcessing(false)
        const paymentId = response.razorpay_payment_id || `pay_pocket_${Date.now()}`

        dispatch(
          addMoneyToPocket({
            amount: selectedAmount,
            paymentId,
            method: 'Razorpay Instant UPI / Card',
          })
        )

        setTopUpSuccess({
          amount: selectedAmount,
          paymentId,
          time: new Date().toLocaleTimeString(),
        })
        setCustomAmount('')
      },
      prefill: {
        name: 'Shrutika Patil',
        email: 'customer@omnimarket.io',
        contact: '9822012345',
      },
      theme: {
        color: '#2563EB',
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false)
        },
      },
    }

    try {
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response) {
        setIsProcessing(false)
        alert(`Top-up failed: ${response.error.description || 'Declined'}`)
      })
      rzp.open()
    } catch (e) {
      setIsProcessing(false)
      console.error(e)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => {
          setTopUpSuccess(null)
          dispatch(togglePocket())
        }}
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between relative overflow-hidden">
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/20">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-200">Customer Digital Wallet</span>
                <h3 className="text-lg font-black text-white">OmniMarket Pocket</h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setTopUpSuccess(null)
                dispatch(togglePocket())
              }}
              className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer relative z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Balance Card */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Available Pocket Balance
              </span>
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Protected
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-1 flex items-baseline gap-1">
              <span className="text-blue-600">₹</span>
              <span>{pocketBalance.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Use for 1-click instant zero-fraud checkout across all 37+ verified stores.
            </p>
          </div>

          {/* Top-up Successful Notification Banner */}
          {topUpSuccess && (
            <div className="m-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div className="flex-1 min-w-0 text-xs">
                <div className="font-extrabold text-emerald-900">
                  ₹{topUpSuccess.amount.toLocaleString('en-IN')} Added Successfully!
                </div>
                <div className="text-emerald-700 text-[11px] truncate font-mono">
                  Ref: {topUpSuccess.paymentId}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTopUpSuccess(null)}
                className="text-emerald-700 hover:text-emerald-900 text-xs font-bold shrink-0 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Add Money Form */}
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-black text-gray-900 uppercase tracking-wider mb-2.5">
                Add Money to Pocket:
              </label>

              {/* Quick Amount Presets */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[500, 1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setTopUpAmount(amt)
                      setCustomAmount('')
                    }}
                    className={`py-2 rounded-xl text-xs font-black transition border cursor-pointer ${
                      !customAmount && topUpAmount === amt
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>

              {/* Custom Numeric Input */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="Or enter custom amount..."
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Top-up Action Button */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleTopUpRazorpay}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>
                {isProcessing
                  ? 'Connecting to Razorpay...'
                  : `Add ₹${selectedAmount.toLocaleString('en-IN')} to Pocket via Razorpay`}
              </span>
            </button>

            {/* Recent Pocket Transactions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black text-gray-500 uppercase tracking-wider">
                  Recent Pocket Activity
                </span>
                <span className="text-[10px] text-gray-400">Live Log</span>
              </div>

              <div className="max-h-36 overflow-y-auto space-y-1.5 border border-gray-100 rounded-2xl p-2 bg-gray-50/50">
                {pocketTransactions && pocketTransactions.length > 0 ? (
                  pocketTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-2 bg-white rounded-xl border border-gray-200/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`p-1.5 rounded-lg shrink-0 ${
                            tx.type === 'credit'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {tx.type === 'credit' ? (
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900 truncate max-w-[200px] text-[11px]">
                            {tx.title}
                          </div>
                          <div className="text-[10px] text-gray-400">{tx.time}</div>
                        </div>
                      </div>

                      <div
                        className={`font-black text-xs shrink-0 ${
                          tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount?.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-xs text-gray-400">
                    No transactions yet
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
