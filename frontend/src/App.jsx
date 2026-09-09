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
  )
}
