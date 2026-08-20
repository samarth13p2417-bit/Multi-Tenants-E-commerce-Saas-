import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()

export const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mockKey2026', {
  apiVersion: '2024-12-18.acacia',
})

console.log(`[Stripe] Payment Engine configured.`)
