import React from 'react'
import LoginForm from '../features/auth/LoginForm'
import { Shield } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between py-12 px-4 sm:px-6">
      
      {/* Top Header / Logo */}
      <div className="w-full max-w-md mx-auto text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-900 text-white mb-3 shadow-xs">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Portal Authentication</h1>
        <p className="text-sm text-gray-500 mt-1">Please select your portal to sign in</p>
      </div>

      {/* Main Login Card */}
      <main className="w-full flex justify-center">
        <LoginForm />
      </main>

      {/* Simple Footer */}
      <footer className="w-full text-center text-xs text-gray-400 mt-12">
        © 2026 Authentication Portal. All rights reserved.
      </footer>
    </div>
  )
}
