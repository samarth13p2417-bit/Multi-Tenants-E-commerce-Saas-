import express from 'express'
import { sendOrderReceiptEmail } from '../services/emailService.js'

const router = express.Router()

// Master In-Memory Orders Store
let ordersCache = [
  {
    orderId: 'ORD-984210',
    tenantId: 'tenant-wow-momo',
    tenantName: 'Wow! Momo',
    customerName: 'Shrutika Patil',
    customerEmail: 'customer@omnimarket.io',
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
  const storeOrders = ordersCache.filter((o) => o.tenantId === req.params.storeId)
  res.json({
    success: true,
    count: storeOrders.length,
    orders: storeOrders,
  })
})

// 3. Get All Platform Orders (for Super Admin)
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: ordersCache.length,
    orders: ordersCache,
  })
})

export default router
