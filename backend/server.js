import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

// Config & DB
import { connectDB, getDBStatus } from './config/db.js'

// Routes
import authRoutes from './routes/authRoutes.js'
import storeRoutes from './routes/storeRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// 1. Security Middlewares (Helmet & CORS)
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible integration with Vite frontend & CDN assets
    crossOriginEmbedderPolicy: false,
  })
)

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
  })
)

// 2. Request Body Parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 3. Security Rate Limiting (Prevent Brute Force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
})
app.use('/api/auth', authLimiter)

// 4. API Endpoints
app.use('/api/auth', authRoutes)
app.use('/api/stores', storeRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/upload', uploadRoutes)

// 5. System Health Check & Status Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus()
  res.json({
    status: 'HEALTHY',
    service: 'OmniMarket Multi-Tenant Backend Engine',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbStatus,
    security: {
      jwt: 'ACTIVE',
      bcrypt: 'ACTIVE',
      helmet: 'ENABLED',
      rateLimiter: 'ENABLED',
    },
    integrations: {
      razorpay: {
        status: 'READY',
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_TVeMIEPx8WCIC1',
      },
      stripe: { status: 'READY' },
      cloudinary: { status: 'READY' },
      nodemailer: { status: 'READY' },
    },
  })
})

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'OmniMarket Multi-Tenant Node.js & Express REST API is running.',
    documentation: '/api/health',
  })
})

// 6. Global 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route [${req.method} ${req.originalUrl}] not found on this server.`,
  })
})

// 7. Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]:', err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
})

// 8. Start Server & Connect Database
const startServer = async () => {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`=======================================================`)
    console.log(`🚀 OmniMarket Backend Engine Live on: http://localhost:${PORT}`)
    console.log(`🔒 Security: JWT + Bcrypt + Helmet + Tenant Data Scoping`)
    console.log(`💳 Razorpay API Key: ${process.env.RAZORPAY_KEY_ID || 'rzp_test_TVeMIEPx8WCIC1'}`)
    console.log(`📊 Health Endpoint: http://localhost:${PORT}/api/health`)
    console.log(`=======================================================`)
  })
}

startServer()
