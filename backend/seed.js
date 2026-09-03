import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Tenant } from './models/Tenant.js'
import { Product } from './models/Product.js'
import { User } from './models/User.js'

// Import frontend data files
import { allTenants } from '../frontend/src/data/allStoresData.js'
import { expandedStoreProducts } from '../frontend/src/data/allProductsData.js'
import { poonamDressesCatalog } from '../frontend/src/data/poonamDressesProducts.js'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/omnimarket'

// Electronics comparison products for Vijay Sales, Croma, Reliance Digital, SS Mobile
const comparisonProducts = [
  // VIJAY SALES
  {
    id: 'cmp-iphone-15-tenant-vijay-sales',
    tenantId: 'tenant-vijay-sales',
    tenantName: 'Vijay Sales',
    name: 'Apple iPhone 15 (128GB - Black / Blue)',
    category: 'iPhones',
    price: 69990.0,
    originalPrice: 79900.0,
    rating: 4.8,
    reviewsCount: 510,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Bank ₹3000 Cashback',
  },
  {
    id: 'cmp-s24-ultra-tenant-vijay-sales',
    tenantId: 'tenant-vijay-sales',
    tenantName: 'Vijay Sales',
    name: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB - Titanium Gray)',
    category: 'Samsung Phones',
    price: 127999.0,
    originalPrice: 134999.0,
    rating: 4.9,
    reviewsCount: 380,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: '₹5000 Exchange Bonus',
  },
  {
    id: 'cmp-sony-55-tv-tenant-vijay-sales',
    tenantId: 'tenant-vijay-sales',
    tenantName: 'Vijay Sales',
    name: 'Sony Bravia 55-inch 4K Ultra HD Smart Google TV (KD-55X74L)',
    category: 'Smart TVs',
    price: 57990.0,
    originalPrice: 99990.0,
    rating: 4.8,
    reviewsCount: 420,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Free Wall Mount',
  },
  {
    id: 'cmp-macbook-m3-tenant-vijay-sales',
    tenantId: 'tenant-vijay-sales',
    tenantName: 'Vijay Sales',
    name: 'Apple MacBook Air 13.6-inch M3 Chip (8GB RAM, 256GB SSD)',
    category: 'Laptops',
    price: 104900.0,
    originalPrice: 114900.0,
    rating: 4.9,
    reviewsCount: 290,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Free Laptop Sleeve',
  },
  {
    id: 'cmp-voltas-ac-tenant-vijay-sales',
    tenantId: 'tenant-vijay-sales',
    tenantName: 'Vijay Sales',
    name: 'Voltas 1.5 Ton 5-Star Adjustable Inverter Split AC (185V Vectra)',
    category: 'Air Conditioners',
    price: 36990.0,
    originalPrice: 62990.0,
    rating: 4.9,
    reviewsCount: 340,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Free Installation Demo',
  },
  {
    id: 'cmp-samsung-fridge-tenant-vijay-sales',
    tenantId: 'tenant-vijay-sales',
    tenantName: 'Vijay Sales',
    name: 'Samsung 253L 3-Star Inverter Double Door Frost-Free Refrigerator',
    category: 'Refrigerators',
    price: 24490.0,
    originalPrice: 30990.0,
    rating: 4.8,
    reviewsCount: 280,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Exchange Old ₹3500',
  },

  // CROMA
  {
    id: 'cmp-iphone-15-tenant-croma',
    tenantId: 'tenant-croma',
    tenantName: 'Croma',
    name: 'Apple iPhone 15 (128GB - Black / Blue)',
    category: 'iPhones',
    price: 70490.0,
    originalPrice: 79900.0,
    rating: 4.9,
    reviewsCount: 640,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Tata Neu 5% Coins',
  },
  {
    id: 'cmp-s24-ultra-tenant-croma',
    tenantId: 'tenant-croma',
    tenantName: 'Croma',
    name: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB - Titanium Gray)',
    category: 'Samsung Phones',
    price: 129999.0,
    originalPrice: 134999.0,
    rating: 4.8,
    reviewsCount: 410,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'No Cost EMI',
  },
  {
    id: 'cmp-sony-55-tv-tenant-croma',
    tenantId: 'tenant-croma',
    tenantName: 'Croma',
    name: 'Sony Bravia 55-inch 4K Ultra HD Smart Google TV (KD-55X74L)',
    category: 'Smart TVs',
    price: 56990.0,
    originalPrice: 99990.0,
    rating: 4.9,
    reviewsCount: 520,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Best Price Deal 🏆',
  },
  {
    id: 'cmp-macbook-m3-tenant-croma',
    tenantId: 'tenant-croma',
    tenantName: 'Croma',
    name: 'Apple MacBook Air 13.6-inch M3 Chip (8GB RAM, 256GB SSD)',
    category: 'Laptops',
    price: 106900.0,
    originalPrice: 114900.0,
    rating: 4.8,
    reviewsCount: 330,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'HDFC ₹5000 Cashback',
  },
  {
    id: 'cmp-voltas-ac-tenant-croma',
    tenantId: 'tenant-croma',
    tenantName: 'Croma',
    name: 'Voltas 1.5 Ton 5-Star Adjustable Inverter Split AC (185V Vectra)',
    category: 'Air Conditioners',
    price: 37490.0,
    originalPrice: 62990.0,
    rating: 4.8,
    reviewsCount: 290,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Extended Warranty Promo',
  },
  {
    id: 'cmp-samsung-fridge-tenant-croma',
    tenantId: 'tenant-croma',
    tenantName: 'Croma',
    name: 'Samsung 253L 3-Star Inverter Double Door Frost-Free Refrigerator',
    category: 'Refrigerators',
    price: 24990.0,
    originalPrice: 30990.0,
    rating: 4.9,
    reviewsCount: 310,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Tata Neu Express Delivery',
  },

  // RELIANCE DIGITAL
  {
    id: 'cmp-iphone-15-tenant-reliance-digital',
    tenantId: 'tenant-reliance-digital',
    tenantName: 'Reliance Digital',
    name: 'Apple iPhone 15 (128GB - Black / Blue)',
    category: 'iPhones',
    price: 70990.0,
    originalPrice: 79900.0,
    rating: 4.8,
    reviewsCount: 480,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'JioFiber Special Discount',
  },
  {
    id: 'cmp-s24-ultra-tenant-reliance-digital',
    tenantId: 'tenant-reliance-digital',
    tenantName: 'Reliance Digital',
    name: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB - Titanium Gray)',
    category: 'Samsung Phones',
    price: 128999.0,
    originalPrice: 134999.0,
    rating: 4.9,
    reviewsCount: 350,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Free Wireless Charger Pad',
  },
  {
    id: 'cmp-sony-55-tv-tenant-reliance-digital',
    tenantId: 'tenant-reliance-digital',
    tenantName: 'Reliance Digital',
    name: 'Sony Bravia 55-inch 4K Ultra HD Smart Google TV (KD-55X74L)',
    category: 'Smart TVs',
    price: 58490.0,
    originalPrice: 99990.0,
    rating: 4.8,
    reviewsCount: 390,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'ResQ Installation Guarantee',
  },
  {
    id: 'cmp-macbook-m3-tenant-reliance-digital',
    tenantId: 'tenant-reliance-digital',
    tenantName: 'Reliance Digital',
    name: 'Apple MacBook Air 13.6-inch M3 Chip (8GB RAM, 256GB SSD)',
    category: 'Laptops',
    price: 105490.0,
    originalPrice: 114900.0,
    rating: 4.9,
    reviewsCount: 270,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Free USB-C Hub Included',
  },
  {
    id: 'cmp-voltas-ac-tenant-reliance-digital',
    tenantId: 'tenant-reliance-digital',
    tenantName: 'Reliance Digital',
    name: 'Voltas 1.5 Ton 5-Star Adjustable Inverter Split AC (185V Vectra)',
    category: 'Air Conditioners',
    price: 36490.0,
    originalPrice: 62990.0,
    rating: 4.9,
    reviewsCount: 410,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Lowest Price Guarantee 🏆',
  },
  {
    id: 'cmp-samsung-fridge-tenant-reliance-digital',
    tenantId: 'tenant-reliance-digital',
    tenantName: 'Reliance Digital',
    name: 'Samsung 253L 3-Star Inverter Double Door Frost-Free Refrigerator',
    category: 'Refrigerators',
    price: 24290.0,
    originalPrice: 30990.0,
    rating: 4.9,
    reviewsCount: 360,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Best Refrigerator Deal 🏆',
  },

  // SS MOBILE
  {
    id: 'cmp-iphone-15-tenant-ss-mobile',
    tenantId: 'tenant-ss-mobile',
    tenantName: 'SS Mobile Shop',
    name: 'Apple iPhone 15 (128GB - Black / Blue)',
    category: 'iPhones',
    price: 68999.0,
    originalPrice: 79900.0,
    rating: 4.9,
    reviewsCount: 780,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Lowest Price Guaranteed 🏆',
  },
  {
    id: 'cmp-s24-ultra-tenant-ss-mobile',
    tenantId: 'tenant-ss-mobile',
    tenantName: 'SS Mobile Shop',
    name: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB - Titanium Gray)',
    category: 'Samsung Phones',
    price: 126999.0,
    originalPrice: 134999.0,
    rating: 4.9,
    reviewsCount: 520,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Free 45W Fast Charger',
  },
]

// Generate tailored starter products for stores that don't have explicit lists yet
function getStarterProductsForTenant(t) {
  const cat = t.industryCategory || 'general'
  const storeName = t.name
  const tid = t.id

  if (cat === 'fashion') {
    return [
      {
        id: `p-${tid}-1`,
        tenantId: tid,
        tenantName: storeName,
        name: `Premium Designer Ethnic Outfit - ${storeName}`,
        category: 'Ethnic Wear',
        price: 2499,
        originalPrice: 3999,
        rating: 4.8,
        reviewsCount: 140,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
        featured: true,
        tag: 'Store Special',
      },
      {
        id: `p-${tid}-2`,
        tenantId: tid,
        tenantName: storeName,
        name: `Handcrafted Silk & Cotton Festive Set`,
        category: 'Festive Collection',
        price: 1899,
        originalPrice: 2899,
        rating: 4.9,
        reviewsCount: 95,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
        featured: false,
        tag: 'Trending',
      },
    ]
  }

  if (cat === 'grocery') {
    return [
      {
        id: `p-${tid}-1`,
        tenantId: tid,
        tenantName: storeName,
        name: `Fresh Farm Produce & Organic Staples Box (5kg)`,
        category: 'Daily Essentials',
        price: 499,
        originalPrice: 650,
        rating: 4.9,
        reviewsCount: 220,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',
        featured: true,
        tag: 'Farm Fresh',
      },
      {
        id: `p-${tid}-2`,
        tenantId: tid,
        tenantName: storeName,
        name: `Cold Pressed Pure Cooking Oil & Ghee Combo`,
        category: 'Oils & Ghee',
        price: 799,
        originalPrice: 999,
        rating: 4.8,
        reviewsCount: 130,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
        featured: false,
        tag: '100% Pure',
      },
    ]
  }

  if (cat === 'furniture') {
    return [
      {
        id: `p-${tid}-1`,
        tenantId: tid,
        tenantName: storeName,
        name: `Solid Teakwood Ergonomic Office Chair & Desk Set`,
        category: 'Office Furniture',
        price: 14999,
        originalPrice: 22000,
        rating: 4.9,
        reviewsCount: 85,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1580481077197-20272b14421d?w=600&auto=format&fit=crop&q=80',
        featured: true,
        tag: 'Solid Wood',
      },
    ]
  }

  if (cat === 'travels') {
    return [
      {
        id: `p-${tid}-1`,
        tenantId: tid,
        tenantName: storeName,
        name: `Luxury AC Multi-Axle Intercity Sleeper Ticket - ${storeName}`,
        category: 'Bus Travel',
        price: 1100,
        originalPrice: 1500,
        rating: 4.8,
        reviewsCount: 310,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
        featured: true,
        tag: 'Confirmed E-Ticket',
      },
    ]
  }

  if (cat === 'restaurant' || cat === 'snacks') {
    return [
      {
        id: `p-${tid}-1`,
        tenantId: tid,
        tenantName: storeName,
        name: `Chef Special Delicacy & Snack Box - ${storeName}`,
        category: 'Food & Dining',
        price: 249,
        originalPrice: 320,
        rating: 4.9,
        reviewsCount: 420,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        featured: true,
        tag: 'Hot & Fresh',
      },
    ]
  }

  return [
    {
      id: `p-${tid}-1`,
      tenantId: tid,
      tenantName: storeName,
      name: `Special Offer Product from ${storeName}`,
      category: 'General',
      price: 999,
      originalPrice: 1499,
      rating: 4.8,
      reviewsCount: 110,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      featured: true,
      tag: 'Verified Deal',
    },
  ]
}

async function seedCompleteDatabase() {
  try {
    console.log('=======================================================')
    console.log('🚀 Starting Complete Multi-Tenant Database Seeding...')
    console.log('📍 Target MongoDB:', MONGODB_URI)
    console.log('=======================================================')

    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB successfully.')

    // 1. SEED ALL 37 STORES (TENANTS)
    console.log(`\n📦 1. Seeding All ${allTenants.length} Store Tenants into MongoDB...`)
    let seededTenantsCount = 0

    for (const t of allTenants) {
      const tenantDoc = {
        id: t.id,
        name: t.name,
        category: t.category,
        industryCategory: t.industryCategory || 'general',
        logo: t.logo || '',
        cover: t.coverImage || t.cover || '',
        tagline: t.tagline || 'Official Verified Merchant Store',
        rating: t.rating || 4.8,
        reviewsCount: t.reviewsCount || 100,
        dispatchTime: t.dispatchTime || '24-48 Hours Fast Dispatch',
        address: t.address || 'Pune Commercial Hub',
        status: 'active',
        ownerEmail: `${t.id.replace('tenant-', '').replace(/-/g, '')}@omnimarket.io`,
        ownerPhone: t.phone || '9822012345',
      }

      await Tenant.findOneAndUpdate({ id: t.id }, tenantDoc, { upsert: true, new: true })
      seededTenantsCount++
    }
    console.log(`✨ Successfully seeded ${seededTenantsCount} Stores into collection "tenants".`)

    // 2. COMPILE & SEED ALL PRODUCTS FOR ALL STORES
    console.log(`\n🛍️ 2. Compiling Products across all Stores...`)
    const allProductsMap = new Map()

    // A. Add Poonam Dresses Catalog (25 products)
    for (const p of poonamDressesCatalog) {
      allProductsMap.set(p.id, {
        id: p.id,
        tenantId: p.tenantId || 'tenant-poonam-dresses',
        tenantName: p.tenantName || 'Poonam Dresses',
        name: p.name,
        category: p.category || 'Women Ethnic',
        price: p.price,
        originalPrice: p.originalPrice || p.price * 1.3,
        stockCount: p.stockCount || 20,
        inStock: p.inStock !== false,
        rating: p.rating || 4.9,
        reviewsCount: p.reviewsCount || 150,
        image: p.image,
        tag: p.tag || 'Bestseller',
        featured: p.featured || true,
      })
    }

    // B. Add Comparison Tech & Appliances Products (Vijay Sales, Croma, Reliance Digital, SS Mobile)
    for (const p of comparisonProducts) {
      allProductsMap.set(p.id, {
        id: p.id,
        tenantId: p.tenantId,
        tenantName: p.tenantName,
        name: p.name,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice || p.price * 1.25,
        stockCount: 15,
        inStock: true,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        image: p.image,
        tag: p.tag,
        featured: true,
      })
    }

    // C. Add Expanded Store Products (Wow! Momo, Dragon Chinese Wok, Mamta Sweets, Rajgad Tours, etc.)
    for (const p of expandedStoreProducts) {
      allProductsMap.set(p.id, {
        id: p.id,
        tenantId: p.tenantId,
        tenantName: p.tenantName,
        name: p.name,
        category: p.category || 'Specialty',
        price: p.price,
        originalPrice: p.originalPrice || p.price * 1.2,
        stockCount: 30,
        inStock: true,
        rating: p.rating || 4.8,
        reviewsCount: p.reviewsCount || 100,
        image: p.image,
        tag: p.tag || 'Popular',
        featured: p.featured || false,
      })
    }

    // D. Ensure Every Single Store in allTenants has products
    for (const t of allTenants) {
      const existingForTenant = Array.from(allProductsMap.values()).filter(p => p.tenantId === t.id)
      if (existingForTenant.length === 0) {
        const starters = getStarterProductsForTenant(t)
        for (const sp of starters) {
          allProductsMap.set(sp.id, {
            ...sp,
            stockCount: 25,
            originalPrice: sp.originalPrice || sp.price * 1.3,
          })
        }
      }
    }

    const allProductsArray = Array.from(allProductsMap.values())
    console.log(`📦 Seeding ${allProductsArray.length} total Products into MongoDB...`)

    let seededProductsCount = 0
    for (const p of allProductsArray) {
      await Product.findOneAndUpdate({ id: p.id }, p, { upsert: true, new: true })
      seededProductsCount++
    }
    console.log(`✨ Successfully seeded ${seededProductsCount} Products into collection "products".`)

    // 3. SEED USERS (SUPER ADMIN + 37 VENDOR ACCOUNTS)
    console.log(`\n👤 3. Seeding Super Admin & 37 Vendor Accounts into MongoDB...`)
    
    // Super Admin
    const adminUser = {
      email: 'admin@omnimarket.io',
      password: 'Admin@2026',
      role: 'super_admin',
      fullName: 'Super Administrator',
      adminId: 'ADM-OMNI-01',
      phone: '9822000000',
    }

    const existingAdmin = await User.findOne({ email: adminUser.email })
    if (!existingAdmin) {
      await new User(adminUser).save()
    }

    let seededUsersCount = 1

    // 37 Vendor accounts
    for (const t of allTenants) {
      const email = `${t.id.replace('tenant-', '').replace(/-/g, '')}@omnimarket.io`
      const password = `${t.name.split(' ')[0]}@2026`
      const vendorUser = {
        email,
        password,
        role: 'vendor',
        storeId: t.id,
        storeName: t.name,
        fullName: `${t.name} Manager`,
        phone: t.phone || '9822012345',
      }

      const existingVendor = await User.findOne({ email })
      if (!existingVendor) {
        await new User(vendorUser).save()
      }
      seededUsersCount++
    }
    console.log(`✨ Successfully seeded ${seededUsersCount} Users into collection "users".`)

    console.log('\n=======================================================')
    console.log('🎉 ALL 37 STORES & ALL PRODUCTS ARE STORED IN MONGODB!')
    console.log('=======================================================')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding Error:', error)
    process.exit(1)
  }
}

seedCompleteDatabase()
