import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'OmniMarket_Super_Secret_JWT_Key_#2026_Enterprise_Secure_Hash'

// Protect routes with JWT verification
export const verifyJWT = (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, JWT_SECRET)
      req.user = decoded
      next()
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token. Please sign in again.',
      })
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided.',
    })
  }
}

// Require Vendor / Store Owner role
export const requireVendor = (req, res, next) => {
  if (req.user && (req.user.role === 'vendor' || req.user.role === 'super_admin')) {
    next()
  } else {
    res.status(403).json({
      success: false,
      message: 'Forbidden: Requires Merchant or Store Owner credentials.',
    })
  }
}

// Require Super Admin role
export const requireSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'super_admin') {
    next()
  } else {
    res.status(403).json({
      success: false,
      message: 'Access restricted: Requires Super Admin Root Authority.',
    })
  }
}

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}
