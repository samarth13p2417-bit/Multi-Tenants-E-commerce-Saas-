import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PocketModal from './components/PocketModal'

// Lazy-loaded route components for optimal bundle splitting
const HomePage = lazy(() => import('./pages/HomePage'))
const StorePage = lazy(() => import('./pages/StorePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterStorePage = lazy(() => import('./pages/RegisterStorePage'))
const VendorDashboard = lazy(() => import('./pages/VendorDashboard'))
const SuperAdminDashboard = lazy(() => import('./pages/SuperAdminDashboard'))

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 text-center">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-xs text-gray-500 mb-6">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false })
                  window.location.href = '/'
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Go to Homepage
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function PageLoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
      <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-3 text-sm font-medium text-gray-500">Loading OmniMarket...</p>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-white font-sans antialiased text-gray-900">
          {/* Global Customer Pocket / Digital Wallet Modal */}
          <PocketModal />

          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/store/:storeId" element={<StorePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register-store" element={<RegisterStorePage />} />
              <Route path="/vendor-dashboard" element={<VendorDashboard />} />
              <Route path="/super-admin" element={<SuperAdminDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
