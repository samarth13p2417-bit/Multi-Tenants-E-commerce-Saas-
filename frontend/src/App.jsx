import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import StorePage from './pages/StorePage'
import LoginPage from './pages/LoginPage'
import RegisterStorePage from './pages/RegisterStorePage'
import VendorDashboard from './pages/VendorDashboard'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import PocketModal from './components/PocketModal'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white font-sans antialiased text-gray-900">
        {/* Global Customer Pocket / Digital Wallet Modal */}
        <PocketModal />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/store/:storeId" element={<StorePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-store" element={<RegisterStorePage />} />
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
