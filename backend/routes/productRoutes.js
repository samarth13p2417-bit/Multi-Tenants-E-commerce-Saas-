import express from 'express'
import jwt from 'jsonwebtoken'
import { Product } from '../models/Product.js'
import { enforceTenantIsolation } from '../middleware/tenantIsolation.js'

const JWT_SECRET = process.env.JWT_SECRET || 'OmniMarket_Super_Secret_JWT_Key_#2026'

const router = express.Router()

// 1. Get Products (Directly from MongoDB with multi-tenant filtering)
router.get('/', enforceTenantIsolation, async (req, res) => {
  const { tenantId, category, featured, search } = req.query

  try {
    const query = {}

    if (tenantId && tenantId !== 'all') {
      query.tenantId = tenantId
    }
    if (category && category !== 'all') {
      query.category = { $regex: category, $options: 'i' }
    }
    if (featured === 'true') {
      query.featured = true
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    const products = await Product.find(query).sort({ featured: -1, rating: -1, createdAt: -1 })

    res.json({
      success: true,
      count: products.length,
      products,
    })
  } catch (error) {
    console.error('Error querying products from MongoDB:', error)
    res.status(500).json({ success: false, message: 'Failed to retrieve products from database.' })
  }
})

// 2. Vendor Add Product to MongoDB
router.post('/', enforceTenantIsolation, async (req, res) => {
  const { tenantId, tenantName, name, category, price, originalPrice, stockCount, inStock, image, tag } = req.body

  if (!name || !price || !tenantId) {
    return res.status(400).json({
      success: false,
      message: 'Product name, price, and store tenantId are required.',
    })
  }

  try {
    const initialStock = stockCount !== undefined ? Number(stockCount) : 15
    const id = `prod-${tenantId}-${Date.now()}`

    const newProduct = new Product({
      id,
      tenantId,
      tenantName: tenantName || 'Partner Store',
      name,
      category: category || 'General',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stockCount: initialStock,
      inStock: inStock !== undefined ? inStock : initialStock > 0,
      rating: 5.0,
      reviewsCount: 1,
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      tag: tag || 'New Launch',
      featured: true,
    })

    await newProduct.save()

    res.status(201).json({
      success: true,
      message: `Product "${name}" saved to MongoDB catalog.`,
      product: newProduct,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// 3. Vendor Update Product Price in MongoDB
router.put('/:id/price', async (req, res) => {
  const { price, originalPrice } = req.body

  try {
    const product = await Product.findOne({ id: req.params.id })

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found in database' })
    }

    // Enforce Tenant Isolation for authenticated vendor
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, JWT_SECRET)
        if (decoded.role === 'vendor' && decoded.storeId && decoded.storeId !== product.tenantId) {
          return res.status(403).json({
            success: false,
            message: 'Access Denied: Cross-tenant product modification is strictly prohibited.',
          })
        }
      } catch (e) {
        return res.status(401).json({ success: false, message: 'Invalid authorization token.' })
      }
    }

    if (price !== undefined) product.price = Number(price)
    if (originalPrice !== undefined) product.originalPrice = Number(originalPrice)

    await product.save()

    res.json({
      success: true,
      message: 'Product price updated in MongoDB.',
      product,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// 4. Vendor Update Stock & Availability in MongoDB
router.put('/:id/stock', async (req, res) => {
  const { stockCount, inStock } = req.body

  try {
    const product = await Product.findOne({ id: req.params.id })

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found in database' })
    }

    // Enforce Tenant Isolation for authenticated vendor
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, JWT_SECRET)
        if (decoded.role === 'vendor' && decoded.storeId && decoded.storeId !== product.tenantId) {
          return res.status(403).json({
            success: false,
            message: 'Access Denied: Cross-tenant product stock modification is strictly prohibited.',
          })
        }
      } catch (e) {
        return res.status(401).json({ success: false, message: 'Invalid authorization token.' })
      }
    }

    if (stockCount !== undefined) {
      product.stockCount = Math.max(0, Number(stockCount))
      product.inStock = product.stockCount > 0
    }

    if (inStock !== undefined) {
      product.inStock = inStock
      if (!inStock) product.stockCount = 0
      else if (product.stockCount === 0) product.stockCount = 10
    }

    await product.save()

    res.json({
      success: true,
      message: `Stock updated in MongoDB: ${product.stockCount} units (${product.inStock ? 'In Stock' : 'Out of Stock'}).`,
      product,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// 5. Vendor Delete Product from MongoDB
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id })
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found in database' })
    }

    // Enforce Tenant Isolation for authenticated vendor
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, JWT_SECRET)
        if (decoded.role === 'vendor' && decoded.storeId && decoded.storeId !== product.tenantId) {
          return res.status(403).json({
            success: false,
            message: 'Access Denied: Cross-tenant product deletion is strictly prohibited.',
          })
        }
      } catch (e) {
        return res.status(401).json({ success: false, message: 'Invalid authorization token.' })
      }
    }

    await Product.deleteOne({ id: req.params.id })

    res.json({
      success: true,
      message: 'Product deleted from MongoDB catalog.',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
