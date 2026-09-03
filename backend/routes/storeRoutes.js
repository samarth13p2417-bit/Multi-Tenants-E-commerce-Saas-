import express from 'express'
import { Tenant } from '../models/Tenant.js'
import { verifyJWT, requireSuperAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

// 1. Get All Stores (Queried directly from MongoDB with query filters)
router.get('/', async (req, res) => {
  const { category, industry, search } = req.query

  try {
    const query = {}
    if (industry && industry !== 'all') {
      query.industryCategory = industry
    }
    if (category && category !== 'all') {
      query.category = { $regex: category, $options: 'i' }
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    const stores = await Tenant.find(query).sort({ rating: -1, name: 1 })
    res.json({
      success: true,
      count: stores.length,
      stores,
    })
  } catch (error) {
    console.error('Error fetching stores from MongoDB:', error)
    res.status(500).json({ success: false, message: 'Failed to retrieve stores from database.' })
  }
})

// 2. Get Single Store Details
router.get('/:storeId', async (req, res) => {
  try {
    const store = await Tenant.findOne({ id: req.params.storeId })
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Merchant store not found in MongoDB.',
      })
    }
    res.json({
      success: true,
      store,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// 3. Register New Store
router.post('/register', async (req, res) => {
  const { name, category, industryCategory, address, dispatchTime, ownerEmail, ownerPhone, logo, coverImage, tagline } = req.body

  if (!name || !category) {
    return res.status(400).json({
      success: false,
      message: 'Store name and category are required.',
    })
  }

  try {
    const id = `tenant-${name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}-${Date.now()}`
    const newStore = new Tenant({
      id,
      name,
      category,
      industryCategory: industryCategory || 'general',
      tagline: tagline || `Official digital storefront for ${name}`,
      logo: logo || 'https://images.unsplash.com/photo-1556742049-0a67e557224f?w=200&auto=format&fit=crop&q=80',
      cover: coverImage || '/covers/cover_tenant_poonam_dresses.svg',
      rating: 5.0,
      reviewsCount: 1,
      dispatchTime: dispatchTime || '24-48h Fast Delivery',
      address: address || 'Pune Commercial Plaza',
      status: 'active',
      ownerEmail,
      ownerPhone,
    })

    await newStore.save()

    res.status(201).json({
      success: true,
      message: `Store "${name}" saved to MongoDB successfully!`,
      store: newStore,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// 4. Super Admin Toggle Store Status
router.put('/:storeId/status', async (req, res) => {
  const { status } = req.body
  try {
    const store = await Tenant.findOne({ id: req.params.storeId })

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found in database' })
    }

    store.status = status || (store.status === 'active' ? 'suspended' : 'active')
    await store.save()

    res.json({
      success: true,
      message: `Store status updated to ${store.status} in MongoDB.`,
      store,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
