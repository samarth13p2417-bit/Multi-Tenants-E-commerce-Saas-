import express from 'express'
import { enforceTenantIsolation } from '../middleware/tenantIsolation.js'

const router = express.Router()

// Master In-Memory Products Cache
let productsCache = [
  // Wow! Momo Products
  {
    id: 'p-wow-1',
    tenantId: 'tenant-wow-momo',
    tenantName: 'Wow! Momo',
    name: 'Steamed Darjeeling Veg & Cheese Momo Platter (8 Pcs + Spicy Dip)',
    category: 'Momos & Platters',
    price: 160.0,
    originalPrice: 190.0,
    stockCount: 25,
    inStock: true,
    rating: 4.9,
    reviewsCount: 1840,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Bestseller 🥟',
  },
  {
    id: 'p-wow-2',
    tenantId: 'tenant-wow-momo',
    tenantName: 'Wow! Momo',
    name: 'Pan-Fried Schezwan Paneer Momo in Hot Garlic Sauce (8 Pcs)',
    category: 'Momos & Platters',
    price: 190.0,
    originalPrice: 230.0,
    stockCount: 18,
    inStock: true,
    rating: 4.9,
    reviewsCount: 1250,
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Spicy Schezwan 🔥',
  },
  // Vijay Sales Products
  {
    id: 'p-vs-1',
    tenantId: 'tenant-vijay-sales',
    tenantName: 'Vijay Sales',
    name: 'Sony BRAVIA 65-inch 4K Ultra HD Smart OLED Google TV (XR-65A80L)',
    category: 'Smart TVs',
    price: 189990.0,
    originalPrice: 249990.0,
    stockCount: 8,
    inStock: true,
    rating: 4.9,
    reviewsCount: 640,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Flagship OLED ⚡',
  },
  {
    id: 'p-vs-2',
    tenantId: 'tenant-vijay-sales',
    tenantName: 'Vijay Sales',
    name: 'Daikin 1.5 Ton 5 Star Inverter Split AC (Copper, Triple Display)',
    category: 'Air Conditioners',
    price: 44990.0,
    originalPrice: 56990.0,
    stockCount: 14,
    inStock: true,
    rating: 4.8,
    reviewsCount: 1120,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: '5 Star Inverter ❄️',
  },

  // Poonam Dresses Products
  {
    id: 'pd-saree-01',
    tenantId: 'tenant-poonam-dresses',
    tenantName: 'Poonam Dresses',
    name: 'Pure Silk Traditional Paithani Saree with Peacock Zari Pallu',
    category: 'Sarees',
    price: 3499.0,
    originalPrice: 4599.0,
    stockCount: 15,
    inStock: true,
    rating: 4.9,
    reviewsCount: 380,
    image: '/images/products/paithani_saree.jpg',
    featured: true,
    tag: 'Bestseller 🥻',
  },
  {
    id: 'pd-ind-01',
    tenantId: 'tenant-poonam-dresses',
    tenantName: 'Poonam Dresses',
    name: 'Designer Embroidered Anarkali Kurta, Pants & Dupatta Set',
    category: 'Indian Dresses',
    price: 1999.0,
    originalPrice: 2799.0,
    stockCount: 20,
    inStock: true,
    rating: 4.9,
    reviewsCount: 310,
    image: '/images/products/anarkali_dress.jpg',
    featured: true,
    tag: 'Trending Ethnic ✨',
  },
  {
    id: 'pd-west-01',
    tenantId: 'tenant-poonam-dresses',
    tenantName: 'Poonam Dresses',
    name: 'Elegant Satin Sleeveless Cocktail Bodycon Midi Dress',
    category: 'Western Dresses',
    price: 1699.0,
    originalPrice: 2399.0,
    stockCount: 18,
    inStock: true,
    rating: 4.9,
    reviewsCount: 180,
    image: '/images/products/satin_midi_dress.jpg',
    featured: true,
    tag: 'Party Glam 👗',
  },
  {
    id: 'pd-crop-01',
    tenantId: 'tenant-poonam-dresses',
    tenantName: 'Poonam Dresses',
    name: 'Smocked Off-Shoulder Puff Sleeve Ruffle Crop Top',
    category: 'Crop Tops',
    price: 699.0,
    originalPrice: 999.0,
    stockCount: 25,
    inStock: true,
    rating: 4.8,
    reviewsCount: 280,
    image: '/images/products/smocked_crop_top.jpg',
    featured: true,
    tag: 'Trending 👚',
  },
  {
    id: 'pd-men-01',
    tenantId: 'tenant-poonam-dresses',
    tenantName: 'Poonam Dresses',
    name: 'Mens Pure Linen Mandarin Collar Slim Fit Casual Shirt',
    category: "Men's Clothes",
    price: 1399.0,
    originalPrice: 1999.0,
    stockCount: 30,
    inStock: true,
    rating: 4.8,
    reviewsCount: 310,
    image: '/images/products/mens_linen_shirt.jpg',
    featured: true,
    tag: 'Pure Linen 👔',
  },

  // Rajgad Travels Products
  {
    id: 'p-rajgad-1',
    tenantId: 'tenant-rajgad-travels',
    tenantName: 'Rajgad Tours & Travels',
    name: 'Pune to Goa Executive AC Multi-Axle Sleeper Bus (2+1 Luxury Berths)',
    category: 'Intercity Bus Tickets',
    price: 1250.0,
    originalPrice: 1500.0,
    stockCount: 22,
    inStock: true,
    rating: 4.9,
    reviewsCount: 1680,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Direct Volvo Sleeper 🚌',
  },
]

// 1. Get Products (Filtered by TenantId or Category)
router.get('/', enforceTenantIsolation, (req, res) => {
  const { tenantId, category, featured, search } = req.query
  let result = productsCache

  if (tenantId && tenantId !== 'all') {
    result = result.filter((p) => p.tenantId === tenantId)
  }
  if (category && category !== 'all') {
    result = result.filter((p) => p.category?.toLowerCase() === category.toLowerCase())
  }
  if (featured === 'true') {
    result = result.filter((p) => p.featured)
  }
  if (search) {
    result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  }

  res.json({
    success: true,
    count: result.length,
    products: result,
  })
})

// 2. Vendor Add Product
router.post('/', enforceTenantIsolation, (req, res) => {
  const { tenantId, tenantName, name, category, price, originalPrice, stockCount, inStock, image, tag } = req.body

  if (!name || !price || !tenantId) {
    return res.status(400).json({
      success: false,
      message: 'Product name, price, and store tenantId are required.',
    })
  }

  const initialStock = stockCount !== undefined ? Number(stockCount) : 15
  const newProduct = {
    id: `prod-custom-${Date.now()}`,
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
  }

  productsCache.unshift(newProduct)

  res.status(201).json({
    success: true,
    message: `Product "${name}" added to catalog.`,
    product: newProduct,
  })
})

// 3. Vendor Update Product Price
router.put('/:id/price', (req, res) => {
  const { price, originalPrice } = req.body
  const product = productsCache.find((p) => p.id === req.params.id)

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' })
  }

  if (price !== undefined) product.price = Number(price)
  if (originalPrice !== undefined) product.originalPrice = Number(originalPrice)

  res.json({
    success: true,
    message: 'Product price updated.',
    product,
  })
})

// 4. Vendor Update Stock & Availability (Units Left / Out of Stock)
router.put('/:id/stock', (req, res) => {
  const { stockCount, inStock } = req.body
  const product = productsCache.find((p) => p.id === req.params.id)

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' })
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

  res.json({
    success: true,
    message: `Stock updated: ${product.stockCount} units (${product.inStock ? 'In Stock' : 'Out of Stock'}).`,
    product,
  })
})

// 5. Vendor Delete Product
router.delete('/:id', (req, res) => {
  const initialLen = productsCache.length
  productsCache = productsCache.filter((p) => p.id !== req.params.id)

  if (productsCache.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Product not found' })
  }

  res.json({
    success: true,
    message: 'Product deleted from store catalog.',
  })
})

export default router
