import Razorpay from 'razorpay'
import dotenv from 'dotenv'

dotenv.config()

export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_TVeMIEPx8WCIC1',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'U5v6sDbguMcNq5k6PD2Cn5na',
})

console.log(`[Razorpay] Gateway initialized with Key ID: ${process.env.RAZORPAY_KEY_ID || 'rzp_test_TVeMIEPx8WCIC1'}`)
