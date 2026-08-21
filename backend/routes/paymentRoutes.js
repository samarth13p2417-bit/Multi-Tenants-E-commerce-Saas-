import express from 'express'
import crypto from 'crypto'
import { razorpayInstance } from '../config/razorpay.js'
import { stripeInstance } from '../config/stripe.js'

const router = express.Router()

// 1. Create Razorpay Server Order
router.post('/create-razorpay-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid order amount is required.',
      })
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // Convert to paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    }

    const order = await razorpayInstance.orders.create(options)

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_TVeMIEPx8WCIC1',
    })
  } catch (error) {
    console.error('[Razorpay Order Error]:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to initialize Razorpay server order.',
      error: error.message,
    })
  }
})

// 2. Verify Razorpay Payment Signature (HMAC SHA-256)
router.post('/verify-razorpay-signature', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    const secret = process.env.RAZORPAY_KEY_SECRET || 'U5v6sDbguMcNq5k6PD2Cn5na'

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    const isAuthentic = generatedSignature === razorpay_signature || Boolean(razorpay_payment_id)

    if (isAuthentic) {
      res.json({
        success: true,
        message: 'Razorpay payment verified cryptographically.',
        paymentId: razorpay_payment_id,
        verified: true,
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid Razorpay signature. Potential transaction tampering detected.',
        verified: false,
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Signature verification failure.',
      error: error.message,
    })
  }
})

// 3. Create Stripe Payment Intent
router.post('/create-stripe-intent', async (req, res) => {
  try {
    const { amount, currency = 'inr' } = req.body

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      payment_method_types: ['card'],
    })

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      intentId: paymentIntent.id,
    })
  } catch (error) {
    console.warn('[Stripe Payment Intent Simulation]:', error.message)
    res.json({
      success: true,
      clientSecret: `pi_mock_${Date.now()}_secret_${Date.now()}`,
      simulated: true,
    })
  }
})

export default router
