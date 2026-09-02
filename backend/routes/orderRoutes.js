import express from 'express'
import jwt from 'jsonwebtoken'
import { sendOrderReceiptEmail } from '../services/emailService.js'

const JWT_SECRET = process.env.JWT_SECRET || 'OmniMarket_Super_Secret_JWT_Key_#2026_Enterprise_Secure_Hash'

const router = express.Router()

// Master In-Memory Orders Store
let ordersCache = [
  {
    orderId: 'ORD-984210',
    tenantId: 'tenant-wow-momo',
    tenantName: 'Wow! Momo',
    customerName: 'Samarth',
    customerEmail: 'samarth13p2417@gmail.com',
    customerPhone: '9822012345',
    deliveryAddress: 'Flat 402, Royal Residency, Senapati Bapat Road, Pune',
    items: [
      {
        productId: 'p-wow-1',
        name: 'Steamed Darjeeling Veg & Cheese Momo Platter',
        price: 160.0,
        quantity: 2,
      },
    ],
    subtotal: 320.0,
    deliveryFee: 40.0,
    totalAmount: 360.0,
    paymentGateway: 'RAZORPAY',
    paymentId: 'pay_rzp_test_984210',
    paymentStatus: 'PAID',
    orderStatus: 'PREPARING',
    createdAt: new Date().toISOString(),
  },
]

// 1. Create New Order (Customer Checkout)
router.post('/', async (req, res) => {
  const {
    tenantId,
    tenantName,
    items,
    totalAmount,
    deliveryAddress,
    customerName,
    customerEmail,
    customerPhone,
    paymentGateway = 'RAZORPAY',
    paymentId,
  } = req.body

  if (!tenantId || !items || !totalAmount) {
    return res.status(400).json({
      success: false,
      message: 'Store ID, items, and total amount are required.',
    })
  }

  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`
  const newOrder = {
    orderId,
    tenantId,
    tenantName: tenantName || 'Verified Merchant Store',
    customerName: customerName || 'Valued Customer',
    customerEmail: customerEmail || 'customer@omnimarket.io',
    customerPhone: customerPhone || '9822012345',
    deliveryAddress: deliveryAddress || 'Customer Address',
    items,
    subtotal: totalAmount,
    deliveryFee: totalAmount > 1000 ? 0 : 40,
    totalAmount,
    paymentGateway,
    paymentId: paymentId || `pay_${Date.now()}`,
    paymentStatus: 'PAID',
    orderStatus: 'PLACED',
    createdAt: new Date().toISOString(),
  }

  ordersCache.unshift(newOrder)

  // Dispatch Nodemailer transactional receipt asynchronously
  sendOrderReceiptEmail({
    customerEmail: newOrder.customerEmail,
    customerName: newOrder.customerName,
    orderId: newOrder.orderId,
    storeName: newOrder.tenantName,
    items: newOrder.items,
    totalAmount: newOrder.totalAmount,
    paymentMode: newOrder.paymentGateway,
    paymentId: newOrder.paymentId,
    address: newOrder.deliveryAddress,
  }).catch((err) => console.warn('[Email Warning]:', err.message))

  res.status(201).json({
    success: true,
    message: 'Order created and routed to store fulfillment center.',
    order: newOrder,
  })
})

// 2. Get Orders for Specific Store (for Vendor Dashboard)
router.get('/store/:storeId', (req, res) => {
  // Enforce Tenant Isolation if authenticated as vendor
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, JWT_SECRET)
      if (decoded.role === 'vendor' && decoded.storeId && decoded.storeId !== req.params.storeId) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Cross-tenant order inspection is strictly forbidden.',
        })
      }
    } catch (e) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization session token.',
      })
    }
  }

  const storeOrders = ordersCache.filter((o) => o.tenantId === req.params.storeId)
  res.json({
    success: true,
    count: storeOrders.length,
    orders: storeOrders,
  })
})

// 3. Get All Platform Orders (for Super Admin)
router.get('/', (req, res) => {
  // Restrict global order overview if non-admin token provided
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, JWT_SECRET)
      if (decoded.role === 'customer') {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Customer accounts cannot view master platform orders.',
        })
      }
    } catch (e) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization token.',
      })
    }
  }

  res.json({
    success: true,
    count: ordersCache.length,
    orders: ordersCache,
  })
})

export default router
