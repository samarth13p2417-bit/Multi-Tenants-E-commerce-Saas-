import Razorpay from 'razorpay'
import dotenv from 'dotenv'

dotenv.config()

export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_TZuZATB0AWjiF6',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'fSddaHaXCy1SHtPR7zUVx9S9',
})

console.log(`[Razorpay] Gateway initialized with Key ID: ${process.env.RAZORPAY_KEY_ID || 'rzp_test_TZuZATB0AWjiF6'}`)
