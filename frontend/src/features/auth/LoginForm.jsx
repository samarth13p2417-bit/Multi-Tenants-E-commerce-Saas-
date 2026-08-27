import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import {
  setActiveRole,
  updateField,
  togglePassword,
  setLoading,
  setError,
  loginSuccess,
  logout,
} from './authSlice'
import { storeCredentials } from '../../data/storeCredentials'
import {
  User,
  Store,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Key,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Phone,
  Smartphone,
  Shield,
  RotateCcw,
  Check,
  KeyRound,
  ShieldAlert,
} from 'lucide-react'

// Super Secret Master Credentials
const SUPER_ADMIN_SECRET = {
  adminId: 'ADM-ROOT-MASTER-01',
  email: 'root.admin@omnimarket.io',
  password: 'SuperSecret@OmniAdmin#2026',
  securityPin: '778899',
}

export default function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { activeRole, formData, showPassword, isLoading, loggedInUser, errorMessage } =
    useSelector((state) => state.auth)
  const { tenants } = useSelector((state) => state.marketplace)

  // Vendor Login Mode: 'email_password' or 'phone_otp'
  const [vendorLoginMode, setVendorLoginMode] = useState('email_password')
  const [vendorStoreId, setVendorStoreId] = useState(tenants[0]?.id || 'tenant-poonam-dresses')
  const [vendorEmail, setVendorEmail] = useState(storeCredentials['tenant-poonam-dresses']?.email || 'poonam@dresses.com')
  const [vendorPassword, setVendorPassword] = useState(storeCredentials['tenant-poonam-dresses']?.password || 'Poonam@2026')
  const [vendorPhone, setVendorPhone] = useState(storeCredentials['tenant-poonam-dresses']?.phone || '9822012345')
  
  // Vendor OTP state
  const [otpStep, setOtpStep] = useState(false)
  const [vendorOtp, setVendorOtp] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('482910')
  const [resendTimer, setResendTimer] = useState(30)

  // Super Admin Credentials & 2FA OTP state
  const [adminId, setAdminId] = useState(SUPER_ADMIN_SECRET.adminId)
  const [adminEmail, setAdminEmail] = useState(SUPER_ADMIN_SECRET.email)
  const [adminPassword, setAdminPassword] = useState(SUPER_ADMIN_SECRET.password)
  const [adminOtpStep, setAdminOtpStep] = useState(false)
  const [adminOtp, setAdminOtp] = useState('')
  const [generatedAdminOtp, setGeneratedAdminOtp] = useState('994821')
  const [adminResendTimer, setAdminResendTimer] = useState(30)

  const currentData = formData[activeRole]

  // When store changes, update default credentials for that store
  const handleStoreSelect = (storeId) => {
    setVendorStoreId(storeId)
    const creds = storeCredentials[storeId]
    if (creds) {
      setVendorEmail(creds.email)
      setVendorPassword(creds.password)
      setVendorPhone(creds.phone)
    }
  }

  // Resend countdown timer for Vendor OTP
  useEffect(() => {
    let interval
    if (otpStep && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpStep, resendTimer])

  // Resend countdown timer for Admin OTP
  useEffect(() => {
    let interval
    if (adminOtpStep && adminResendTimer > 0) {
      interval = setInterval(() => {
        setAdminResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [adminOtpStep, adminResendTimer])

  // Auto redirect on successful login
  useEffect(() => {
    let timer
    if (loggedInUser) {
      if (loggedInUser.role === 'customer') {
        timer = setTimeout(() => {
          navigate('/')
        }, 1800)
      } else if (loggedInUser.role === 'vendor' && loggedInUser.storeId) {
        timer = setTimeout(() => {
          navigate('/vendor-dashboard')
        }, 1800)
      } else if (loggedInUser.role === 'super_admin') {
        timer = setTimeout(() => {
          navigate('/super-admin')
        }, 1800)
      }
    }
    return () => clearTimeout(timer)
  }, [loggedInUser, navigate])

  // Vendor Email & Password Submission
  const handleVendorEmailPasswordSubmit = (e) => {
    e.preventDefault()
    dispatch(setError(''))

    const selectedTenant = tenants.find((t) => t.id === vendorStoreId) || tenants[0]
    const expectedCreds = storeCredentials[selectedTenant.id]

    if (!vendorEmail) {
      dispatch(setError('Please enter your vendor email address.'))
      return
    }
    if (!vendorPassword) {
      dispatch(setError('Please enter your vendor password.'))
      return
    }

    if (expectedCreds) {
      if (
        vendorEmail.toLowerCase().trim() !== expectedCreds.email.toLowerCase().trim() ||
        vendorPassword !== expectedCreds.password
      ) {
        dispatch(
          setError(
            `Invalid credentials for ${selectedTenant.name}. Correct email: "${expectedCreds.email}" & Password: "${expectedCreds.password}".`
          )
        )
        return
      }
    }

    dispatch(setLoading(true))
    setTimeout(() => {
      dispatch(
        loginSuccess({
          role: 'vendor',
          roleTitle: 'Store Owner / Vendor',
          identifier: `${selectedTenant.name} (${vendorEmail})`,
          storeId: selectedTenant.id,
          storeName: selectedTenant.name,
          email: vendorEmail,
          loginTime: new Date().toLocaleTimeString(),
        })
      )
    }, 500)
  }

  // Vendor OTP Submission
  const handleSendVendorOtp = (e) => {
    if (e) e.preventDefault()
    if (!vendorPhone || vendorPhone.length < 10) {
      dispatch(setError('Please enter a valid 10-digit mobile number.'))
      return
    }

    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString()
    const selectedTenant = tenants.find((t) => t.id === vendorStoreId) || tenants[0]
    setGeneratedOtp(randomOtp)
    setOtpStep(true)
    setResendTimer(30)
    dispatch(setError(''))

    alert(`💬 SMS VERIFICATION ALERT\n\nYour 6-Digit Vendor Login OTP for "${selectedTenant.name}" is:\n\n👉  ${randomOtp}  👈\n\n(Valid for 5 minutes. Do not share this OTP with anyone.)`)
  }

  const handleVerifyVendorOtp = (e) => {
    e.preventDefault()
    if (!vendorOtp || vendorOtp.length < 6) {
      dispatch(setError('Please enter the complete 6-digit OTP.'))
      return
    }

    if (vendorOtp !== generatedOtp && vendorOtp !== '123456' && vendorOtp !== '482910') {
      dispatch(setError('Invalid OTP code. Please enter the OTP sent to your phone.'))
      return
    }

    dispatch(setLoading(true))
    setTimeout(() => {
      const selectedTenant = tenants.find((t) => t.id === vendorStoreId) || tenants[0]
      dispatch(
        loginSuccess({
          role: 'vendor',
          roleTitle: 'Store Owner / Vendor',
          identifier: `${selectedTenant.name} (+91 ${vendorPhone})`,
          storeId: selectedTenant.id,
          storeName: selectedTenant.name,
          phone: vendorPhone,
          loginTime: new Date().toLocaleTimeString(),
        })
      )
    }, 500)
  }

  // Super Admin Step 1: Validate Super Secret Email & Password, then dispatch 2FA OTP
  const handleSendSuperAdminOtp = (e) => {
    e.preventDefault()
    dispatch(setError(''))

    if (adminId.trim() !== SUPER_ADMIN_SECRET.adminId) {
      dispatch(setError(`Invalid Admin ID. Required ID: "${SUPER_ADMIN_SECRET.adminId}".`))
      return
    }
    if (adminEmail.trim().toLowerCase() !== SUPER_ADMIN_SECRET.email.toLowerCase()) {
      dispatch(setError(`Invalid Super Secret Email. Required: "${SUPER_ADMIN_SECRET.email}".`))
      return
    }
    if (adminPassword !== SUPER_ADMIN_SECRET.password) {
      dispatch(setError(`Invalid Super Secret Master Password. Required: "${SUPER_ADMIN_SECRET.password}".`))
      return
    }

    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedAdminOtp(randomOtp)
    setAdminOtpStep(true)
    setAdminResendTimer(30)

    alert(`🔐 SUPER ADMIN 2FA SECURITY ALERT\n\nRoot Authentication Code for ${SUPER_ADMIN_SECRET.adminId} is:\n\n👉  ${randomOtp}  👈\n\n(Authorized Root Level Clearance Only.)`)
  }

  // Super Admin Step 2: Verify Master 2FA OTP
  const handleVerifySuperAdminOtp = (e) => {
    e.preventDefault()
    dispatch(setError(''))

    if (!adminOtp || adminOtp.length < 6) {
      dispatch(setError('Please enter the 6-digit Master Security OTP.'))
      return
    }

    if (adminOtp !== generatedAdminOtp && adminOtp !== '994821' && adminOtp !== '123456') {
      dispatch(setError('Invalid Master 2FA OTP. Please check the security alert.'))
      return
    }

    dispatch(setLoading(true))
    setTimeout(() => {
      dispatch(
        loginSuccess({
          role: 'super_admin',
          roleTitle: 'Super Admin (Root Authority)',
          identifier: `${SUPER_ADMIN_SECRET.adminId} (${SUPER_ADMIN_SECRET.email})`,
          loginTime: new Date().toLocaleTimeString(),
        })
      )
    }, 500)
  }

  const handleInputChange = (field, value) => {
    dispatch(updateField({ role: activeRole, field, value }))
  }

  // Customer Submit
  const handleCustomerSubmit = (e) => {
    e.preventDefault()
    dispatch(setError(''))

    if (!currentData.emailOrPhone) {
      dispatch(setError('Please enter your email or phone number.'))
      return
    }
    if (!currentData.password) {
      dispatch(setError('Please enter your password.'))
      return
    }

    dispatch(setLoading(true))
    setTimeout(() => {
      dispatch(
        loginSuccess({
          role: 'customer',
          roleTitle: 'Customer',
          identifier: currentData.emailOrPhone,
          loginTime: new Date().toLocaleTimeString(),
        })
      )
    }, 500)
  }

  // If logged in, show success state with dashboard links
  if (loggedInUser) {
    return (
      <div className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-3xl p-8 shadow-sm text-center animate-in zoom-in-95 duration-150">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-black text-gray-900 mb-1">Login Successful!</h2>
        <p className="text-xs text-gray-500 mb-5">
          Authenticated as <span className="font-bold text-gray-800">{loggedInUser.roleTitle}</span>
        </p>

        {/* Customer Action Card */}
        {loggedInUser.role === 'customer' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Redirecting to Marketplace Homepage automatically...</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Signed in as <strong>{loggedInUser.identifier}</strong>. Ready to shop across 37+ verified stores.
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Go to Homepage Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Super Admin Action Card */}
        {loggedInUser.role === 'super_admin' && (
          <div className="bg-gray-900 text-white rounded-2xl p-4 mb-6 text-left border border-gray-700">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Redirecting to Super Admin Control Center...</span>
            </div>
            <p className="text-xs text-gray-300 mb-3">
              Root Authority Level 5 Active.
            </p>
            <button
              type="button"
              onClick={() => navigate('/super-admin')}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Open Super Admin Control Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Vendor Action Card */}
        {loggedInUser.role === 'vendor' && loggedInUser.storeId && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-800 mb-1">
              <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
              <span>Redirecting to your Vendor Dashboard automatically...</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Store: <strong>{loggedInUser.storeName}</strong>
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => navigate('/vendor-dashboard')}
                className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Vendor Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => navigate(`/store/${loggedInUser.storeId}`)}
                className="w-full py-2.5 px-3 bg-white hover:bg-gray-100 text-gray-800 text-xs font-bold rounded-xl border border-gray-200 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>View Storefront</span>
                <ExternalLink className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-left text-xs text-gray-600 mb-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Account:</span>
            <span className="font-bold text-gray-900">{loggedInUser.identifier}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Session Started:</span>
            <span className="font-mono text-gray-900">{loggedInUser.loginTime}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            dispatch(logout())
            setOtpStep(false)
            setAdminOtpStep(false)
          }}
          className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    )
  }

  const selectedStoreCreds = storeCredentials[vendorStoreId]

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs">
      
      {/* Role Selection Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-2xl mb-6">
        <button
          type="button"
          onClick={() => {
            dispatch(setActiveRole('customer'))
            setOtpStep(false)
            setAdminOtpStep(false)
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeRole === 'customer'
              ? 'bg-white text-gray-900 shadow-2xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Customer</span>
        </button>

        <button
          type="button"
          onClick={() => {
            dispatch(setActiveRole('vendor'))
            setOtpStep(false)
            setAdminOtpStep(false)
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeRole === 'vendor'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Vendor</span>
        </button>

        <button
          type="button"
          onClick={() => {
            dispatch(setActiveRole('super_admin'))
            setOtpStep(false)
            setAdminOtpStep(false)
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeRole === 'super_admin'
              ? 'bg-gray-900 text-white shadow-2xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Super Admin (OTP)</span>
        </button>
      </div>

      {/* Header Info */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          {activeRole === 'customer' && 'Customer Sign In'}
          {activeRole === 'vendor' && 'Store Owner & Vendor Portal'}
          {activeRole === 'super_admin' && 'Super Admin Master Security Vault'}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {activeRole === 'customer' && 'Sign in to access your orders and track deliveries'}
          {activeRole === 'vendor' && 'Manage your store pricing, inventory stock, and product catalog'}
          {activeRole === 'super_admin' && 'Root authority authorization with 2FA Master OTP verification'}
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ================= 1. VENDOR / STORE OWNER LOGIN ================= */}
      {activeRole === 'vendor' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Select Your Store / Restaurant <span className="text-blue-600">*</span>
            </label>
            <div className="relative">
              <Store className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
              <select
                value={vendorStoreId}
                onChange={(e) => handleStoreSelect(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none transition cursor-pointer"
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedStoreCreds && (
            <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-left text-xs">
              <div className="flex items-center justify-between font-bold text-blue-900 mb-1">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                  <span>{selectedStoreCreds.name} Credentials:</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setVendorEmail(selectedStoreCreds.email)
                    setVendorPassword(selectedStoreCreds.password)
                    setVendorPhone(selectedStoreCreds.phone)
                  }}
                  className="text-[11px] text-blue-700 hover:text-blue-900 underline font-bold cursor-pointer"
                >
                  Auto-Fill
                </button>
              </div>
              <div className="space-y-0.5 text-[11px] text-gray-600 font-mono">
                <div>Email: <strong className="text-gray-900">{selectedStoreCreds.email}</strong></div>
                <div>Password: <strong className="text-gray-900">{selectedStoreCreds.password}</strong></div>
                <div>Phone (OTP): <strong className="text-gray-900">+91 {selectedStoreCreds.phone}</strong></div>
              </div>
            </div>
          )}

          <div className="flex p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setVendorLoginMode('email_password')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                vendorLoginMode === 'email_password'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Email &amp; Password
            </button>
            <button
              type="button"
              onClick={() => {
                setVendorLoginMode('phone_otp')
                setOtpStep(false)
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                vendorLoginMode === 'phone_otp'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Mobile &amp; OTP
            </button>
          </div>

          {vendorLoginMode === 'email_password' && (
            <form onSubmit={handleVendorEmailPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Store Owner Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={vendorEmail}
                    onChange={(e) => setVendorEmail(e.target.value)}
                    placeholder="merchant@store.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none transition font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Store Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={vendorPassword}
                    onChange={(e) => setVendorPassword(e.target.value)}
                    placeholder="Enter store password"
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none transition font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => dispatch(togglePassword())}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In & Open Vendor Dashboard'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {vendorLoginMode === 'phone_otp' && (
            !otpStep ? (
              <form onSubmit={handleSendVendorOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Registered Mobile Number <span className="text-blue-600">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center gap-1 text-gray-500 text-xs font-bold border-r border-gray-200 pr-2 pointer-events-none">
                      <span>🇮🇳 +91</span>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      value={vendorPhone}
                      onChange={(e) => setVendorPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="9822012345"
                      className="w-full pl-20 pr-3 py-2.5 text-xs font-bold tracking-wider text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Send 6-Digit Verification OTP</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyVendorOtp} className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>SMS Dispatched to +91 {vendorPhone}</span>
                    </span>
                    <span className="text-[10px] bg-emerald-200/60 text-emerald-900 font-mono font-bold px-2 py-0.5 rounded">
                      OTP: {generatedOtp}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVendorOtp(generatedOtp)}
                    className="mt-2 text-[11px] font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                  >
                    Auto-Fill Code ({generatedOtp})
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Enter 6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={vendorOtp}
                    onChange={(e) => setVendorOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full py-3 text-center text-lg font-black tracking-widest text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none transition font-mono"
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <button
                    type="button"
                    onClick={() => setOtpStep(false)}
                    className="text-gray-500 hover:text-gray-900 font-medium cursor-pointer"
                  >
                    Change Phone Number
                  </button>

                  {resendTimer > 0 ? (
                    <span>Resend in {resendTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendVendorOtp}
                      className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Resend OTP</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>Verify OTP &amp; Open Store Dashboard</span>
                </button>
              </form>
            )
          )}

        </div>
      ) : activeRole === 'super_admin' ? (
        /* ================= 2. SUPER ADMIN (SECRET CREDENTIALS + MASTER 2FA OTP) ================= */
        <div className="space-y-4">
          
          {/* Secret Credentials Helper Badge */}
          <div className="p-3 bg-gray-900 text-white border border-gray-700 rounded-2xl text-left text-xs shadow-md">
            <div className="flex items-center justify-between font-bold text-gray-200 mb-1">
              <span className="flex items-center gap-1.5 text-blue-400">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Super Secret Master Clearance:</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setAdminId(SUPER_ADMIN_SECRET.adminId)
                  setAdminEmail(SUPER_ADMIN_SECRET.email)
                  setAdminPassword(SUPER_ADMIN_SECRET.password)
                }}
                className="text-[11px] text-blue-400 hover:text-blue-300 underline font-bold cursor-pointer"
              >
                Auto-Fill Secret
              </button>
            </div>
            <div className="space-y-0.5 text-[11px] text-gray-300 font-mono">
              <div>Admin ID: <strong className="text-white">{SUPER_ADMIN_SECRET.adminId}</strong></div>
              <div>Secret Email: <strong className="text-white">{SUPER_ADMIN_SECRET.email}</strong></div>
              <div>Master Pass: <strong className="text-white">{SUPER_ADMIN_SECRET.password}</strong></div>
            </div>
          </div>

          {!adminOtpStep ? (
            /* Super Admin Step 1: Secret Credentials Verification */
            <form onSubmit={handleSendSuperAdminOtp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Super Admin Root ID <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="ADM-ROOT-MASTER-01"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition font-mono uppercase font-bold text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Super Secret Admin Email <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="root.admin@omnimarket.io"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition font-mono text-gray-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Super Secret Master Passphrase <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="SuperSecret@OmniAdmin#2026"
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition font-mono text-gray-900 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => dispatch(togglePassword())}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Verify Credentials &amp; Dispatch 2FA OTP</span>
              </button>
            </form>
          ) : (
            /* Super Admin Step 2: Master 2FA OTP Verification */
            <form onSubmit={handleVerifySuperAdminOtp} className="space-y-4">
              
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Master 2FA Dispatched ({adminEmail})</span>
                  </span>
                  <span className="text-[10px] bg-emerald-200/60 text-emerald-900 font-mono font-bold px-2 py-0.5 rounded">
                    OTP: {generatedAdminOtp}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminOtp(generatedAdminOtp)}
                  className="mt-2 text-[11px] font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                >
                  Auto-Fill Master Code ({generatedAdminOtp})
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Enter 6-Digit Master Security OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={adminOtp}
                  onChange={(e) => setAdminOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full py-3 text-center text-lg font-black tracking-widest text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition font-mono"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <button
                  type="button"
                  onClick={() => setAdminOtpStep(false)}
                  className="text-gray-500 hover:text-gray-900 font-medium cursor-pointer"
                >
                  Back to Credentials
                </button>

                {adminResendTimer > 0 ? (
                  <span>Resend in {adminResendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendSuperAdminOtp}
                    className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Resend OTP</span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verify Master OTP &amp; Access Super Admin Hub</span>
              </button>
            </form>
          )}

        </div>
      ) : (
        /* ================= 3. CUSTOMER LOGIN ================= */
        <form onSubmit={handleCustomerSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Email or Phone Number
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={currentData.emailOrPhone || ''}
                onChange={(e) => handleInputChange('emailOrPhone', e.target.value)}
                placeholder="customer@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={currentData.password || ''}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-10 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => dispatch(togglePassword())}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 bg-gray-900 hover:bg-black text-white"
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In & Access Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      )}

      {/* Footer Registration Link */}
      <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs text-gray-500">
        <span>Want to register a new store? </span>
        <Link to="/register-store" className="text-blue-600 hover:text-blue-800 font-bold">
          Open Your Store Digitally
        </Link>
      </div>

    </div>
  )
}
