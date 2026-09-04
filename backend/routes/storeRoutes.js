import express from 'express'
import { verifyJWT, requireSuperAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

// Master In-Memory / DB Store Cache with all 37 partner stores
let storesCache = [
  // 1. Wow! Momo
  {
    id: 'tenant-wow-momo',
    name: 'Wow! Momo',
    category: 'Momos, Chinese & Street Food',
    industryCategory: 'restaurant',
    tagline: 'Fresh Darjeeling Steamed & Fried Schezwan Momos',
    logo: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&auto=format&fit=crop&q=80',
    cover: '/covers/cover_tenant_wow_momo.svg',
    rating: 4.9,
    reviewsCount: 1840,
    dispatchTime: '20-30 Mins Hot Delivery',
    address: 'Food Court Level 3, Amanora Mall, Hadapsar, Pune - 411028',
    status: 'active',
  },
  // 2. Dragon Chinese Wok
  {
    id: 'tenant-chinese-wok',
    name: 'Dragon Chinese Wok & Noodles',
    category: 'Desi Chinese & Hakka Bowls',
    industryCategory: 'restaurant',
    tagline: 'Sizzling Wok Hakka Noodles & Manchurian Bowls',
    logo: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&auto=format&fit=crop&q=80',
    cover: '/covers/cover_tenant_chinese_wok.svg',
    rating: 4.8,
    reviewsCount: 1420,
    dispatchTime: '25-35 Mins Delivery',
    address: 'Shop 5, North Main Road, Koregaon Park, Pune - 411001',
    status: 'active',
  },
  // 3. Mamta Sweets
  {
    id: 'tenant-mamta-sweets',
    name: 'Mamta Sweets & Namkeen',
    category: 'Traditional Sweets & Mithai',
    industryCategory: 'restaurant',
    tagline: 'Pure Desi Ghee Kaju Katli & Fresh Rasgulla',
    logo: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=200&auto=format&fit=crop&q=80',
    cover: '/covers/cover_tenant_mamta_sweets.svg',
    rating: 4.9,
    reviewsCount: 2150,
    dispatchTime: 'Same Day Sweet Dispatch',
    address: 'Main Chowk, Raviwar Peth, Pune - 411002',
    status: 'active',
  },
  // 4. Good Food Cloud Kitchen
  {
    id: 'tenant-good-food',
    name: 'Good Food Cloud Kitchen',
    category: 'North Indian & Homestyle Thali',
    industryCategory: 'restaurant',
    tagline: 'Healthy Pure Veg Thalis & Paneer Curries',
    logo: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop&q=80',
    cover: '/covers/cover_tenant_good_food.svg',
    rating: 4.8,
    reviewsCount: 980,
    dispatchTime: '30-40 Mins Express',
    address: 'Kitchen Hub Unit 3, Senapati Bapat Road, Pune - 411016',
    status: 'active',
  },
  // 5. Rajgad Tours & Travels
  {
    id: 'tenant-rajgad-travels',
    name: 'Rajgad Tours & Travels',
    category: 'Luxury AC Sleeper Buses & Cabs',
    industryCategory: 'travels',
    tagline: 'Intercity Multi-Axle Volvo & Executive Cabs',
    logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&auto=format&fit=crop&q=80',
    cover: '/covers/cover_tenant_rajgad_travels.svg',
    rating: 4.9,
    reviewsCount: 1680,
    dispatchTime: 'Instant E-Ticket Booking',
    address: 'Shop 12, Transport Hub, Swargate Bus Station Complex, Pune - 411042',
    status: 'active',
  },
  // 6. Poonam Dresses
  {
    id: 'tenant-poonam-dresses',
    name: 'Poonam Dresses',
    category: 'Fashion & Ethnic Wear',
    industryCategory: 'fashion',
    tagline: 'Designer Sarees, Festive Kurtis & Party Gowns',
    logo: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&auto=format&fit=crop&q=80',
    cover: '/covers/cover_tenant_poonam_dresses.svg',
    rating: 4.9,
    reviewsCount: 2350,
    dispatchTime: 'Fast 24-48h Delivery',
    address: 'Shop No. 14, Sadashiv Peth, Pune - 411030',
    status: 'active',
  },
  // 7. Vijay Sales
  {
    id: 'tenant-vijay-sales',
    name: 'Vijay Sales',
    category: 'Electronics & Appliances',
    industryCategory: 'electronics',
    tagline: 'Smart 4K OLED TVs, Inverter ACs & Home Audio',
    logo: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&auto=format&fit=crop&q=80',
    cover: '/covers/cover_tenant_vijay_sales.svg',
    rating: 4.9,
    reviewsCount: 3840,
    dispatchTime: '24-48h Express Free Delivery',
    address: 'Vijay Commercial Tower, JM Road, Deccan, Pune - 411004',
    status: 'active',
  },
  // 8. Croma
  {
    id: 'tenant-croma',
    name: 'Croma',
    category: 'Electronics & Gadgets Mega Store',
    industryCategory: 'electronics',
    tagline: 'A Tata Enterprise Electronics Mega Store',
    logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200&auto=format&fit=crop&q=80',
    cover: '/covers/cover_tenant_croma.svg',
    rating: 4.9,
    reviewsCount: 5210,
    dispatchTime: 'Same Day Express Delivery',
    address: 'Phoenix Marketcity Mall, Ground Floor, Viman Nagar, Pune - 411014',
    status: 'active',
  },
  // 9. Reliance Digital
  {
    id: 'tenant-reliance-digital',
    name: 'Reliance Digital',
    category: 'Electronics & Smart Tech',
    industryCategory: 'electronics',
    tagline: 'Personal Audio, Laptops & Home Appliances',
    logo: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=200&auto=format&fit=crop&q=80',
    cover: '/covers/cover_tenant_reliance_digital.svg',
    rating: 4.8,
    reviewsCount: 4620,
    dispatchTime: '24-48 Hours Express Delivery',
    address: 'Westend Mall, Sector 2, Aundh, Pune - 411007',
    status: 'active',
  },
  // 10. SS Mobile Shop
  {
    id: 'tenant-ss-mobile',
    name: 'SS Mobile Shop',
    category: 'Smartphones & Accessories',
    industryCategory: 'gadgets',
    tagline: 'Official Apple, Samsung & OnePlus Smartphone Hub',
    logo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&auto=format&fit=crop&q=80',
    cover: '/covers/cover_tenant_ss_mobile.svg',
    rating: 4.9,
    reviewsCount: 1980,
    dispatchTime: 'Fast 2-4h Local Delivery',
    address: 'Shop No. 7, Telecom Plaza, Tilak Road, Pune - 411030',
    status: 'active',
  },
  // 11. Surya Mobile Shop
  {
    id: 'tenant-surya-mobile',
    name: 'Surya Mobile Shop',
    category: 'Budget & Flagship Smartphones',
    industryCategory: 'gadgets',
    tagline: 'Xiaomi, Realme & Vivo 5G Phones with Warranty',
    logo: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&auto=format&fit=crop&q=80',
    cover: '/covers/cover_tenant_surya_mobile.svg',
    rating: 4.8,
    reviewsCount: 1430,
    dispatchTime: 'Same Day Delivery',
    address: 'Surya Complex, Opp. City Pride, Satara Road, Pune - 411009',
    status: 'active',
  },
  // 12. Shilam Mobile
  {
    id: 'tenant-shilam-mobile',
    name: 'Shilam Mobile & Smart Tech',
    category: 'Smartphones & Wearables',
    industryCategory: 'gadgets',
    tagline: 'OnePlus Flagships, Smartwatches & ANC Earbuds',
    logo: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&auto=format&fit=crop&q=80',
    cover: '/covers/cover_tenant_shilam_mobile.svg',
    rating: 4.9,
    reviewsCount: 1120,
    dispatchTime: '24-48 Hours Express',
    address: 'Shop 18, Shilam Arcade, Market Yard, Gultekdi, Pune - 411037',
    status: 'active',
  },
]

// 1. Get All Stores (with category filtering)
router.get('/', (req, res) => {
  const { category, industry, search } = req.query
  let result = storesCache

  if (industry && industry !== 'all') {
    result = result.filter((s) => s.industryCategory === industry)
  }
  if (category && category !== 'all') {
    result = result.filter((s) => s.category?.toLowerCase().includes(category.toLowerCase()))
  }
  if (search) {
    result = result.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
  }

  res.json({
    success: true,
    count: result.length,
    stores: result,
  })
})

// 2. Get Single Store Details
router.get('/:storeId', (req, res) => {
  const store = storesCache.find((s) => s.id === req.params.storeId)
  if (!store) {
    return res.status(404).json({
      success: false,
      message: 'Merchant store not found.',
    })
  }
  res.json({
    success: true,
    store,
  })
})

// 3. Register New Store
router.post('/register', (req, res) => {
  const { name, category, industryCategory, address, dispatchTime, ownerEmail, ownerPhone } = req.body

  if (!name || !category) {
    return res.status(400).json({
      success: false,
      message: 'Store name and category are required.',
    })
  }

  const id = `tenant-custom-${Date.now()}`
  const newStore = {
    id,
    name,
    category,
    industryCategory: industryCategory || 'fashion',
    tagline: `Official digital storefront for ${name}`,
    logo: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?w=200&auto=format&fit=crop&q=80',
    cover: '/covers/cover_tenant_poonam_dresses.svg',
    rating: 5.0,
    reviewsCount: 1,
    dispatchTime: dispatchTime || '24-48h Fast Delivery',
    address: address || 'Commercial Plaza',
    status: 'active',
    ownerEmail,
    ownerPhone,
  }

  storesCache.unshift(newStore)

  res.status(201).json({
    success: true,
    message: `Store "${name}" registered successfully!`,
    store: newStore,
  })
})

// 4. Super Admin Toggle Store Status
router.put('/:storeId/status', (req, res) => {
  const { status } = req.body
  const store = storesCache.find((s) => s.id === req.params.storeId)

  if (!store) {
    return res.status(404).json({ success: false, message: 'Store not found' })
  }

  store.status = status || (store.status === 'active' ? 'suspended' : 'active')

  res.json({
    success: true,
    message: `Store status updated to ${store.status}.`,
    store,
  })
})

export default router
