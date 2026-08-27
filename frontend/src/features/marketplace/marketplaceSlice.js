import { createSlice } from '@reduxjs/toolkit'
import { poonamDressesCatalog } from '../../data/poonamDressesProducts'
import { allTenants } from '../../data/allStoresData'
import { expandedStoreProducts } from '../../data/allProductsData'

const additionalStoresProducts = [
  // ==========================================
  // 1. VIJAY SALES PRODUCTS
  // ==========================================
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

  // ==========================================
  // 2. CROMA PRODUCTS
  // ==========================================
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
    price: 23990.0,
    originalPrice: 30990.0,
    rating: 4.9,
    reviewsCount: 380,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Best Price Deal 🏆',
  },

  // ==========================================
  // 3. RELIANCE DIGITAL PRODUCTS
  // ==========================================
  {
    id: 'cmp-iphone-15-tenant-reliance-digital',
    tenantId: 'tenant-reliance-digital',
    tenantName: 'Reliance Digital',
    name: 'Apple iPhone 15 (128GB - Black / Blue)',
    category: 'iPhones',
    price: 69499.0,
    originalPrice: 79900.0,
    rating: 4.9,
    reviewsCount: 780,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Lowest Price Deal 🏆',
  },
  {
    id: 'cmp-s24-ultra-tenant-reliance-digital',
    tenantId: 'tenant-reliance-digital',
    tenantName: 'Reliance Digital',
    name: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB - Titanium Gray)',
    category: 'Samsung Phones',
    price: 126990.0,
    originalPrice: 134999.0,
    rating: 5.0,
    reviewsCount: 560,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Lowest Price Deal 🏆',
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
    tag: 'JioFiber 3 Mo Free',
  },
  {
    id: 'cmp-macbook-m3-tenant-reliance-digital',
    tenantId: 'tenant-reliance-digital',
    tenantName: 'Reliance Digital',
    name: 'Apple MacBook Air 13.6-inch M3 Chip (8GB RAM, 256GB SSD)',
    category: 'Laptops',
    price: 103990.0,
    originalPrice: 114900.0,
    rating: 4.9,
    reviewsCount: 460,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Lowest Price Deal 🏆',
  },
  {
    id: 'cmp-voltas-ac-tenant-reliance-digital',
    tenantId: 'tenant-reliance-digital',
    tenantName: 'Reliance Digital',
    name: 'Voltas 1.5 Ton 5-Star Adjustable Inverter Split AC (185V Vectra)',
    category: 'Air Conditioners',
    price: 36490.0,
    originalPrice: 62990.0,
    rating: 4.8,
    reviewsCount: 420,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Lowest Price Deal 🏆',
  },
  {
    id: 'cmp-samsung-fridge-tenant-reliance-digital',
    tenantId: 'tenant-reliance-digital',
    tenantName: 'Reliance Digital',
    name: 'Samsung 253L 3-Star Inverter Double Door Frost-Free Refrigerator',
    category: 'Refrigerators',
    price: 24990.0,
    originalPrice: 30990.0,
    rating: 4.8,
    reviewsCount: 310,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: '1000 Reliance Points',
  },

  // --- 4. SS Mobile Shop Products ---
  {
    id: 'p-ssm-1',
    tenantId: 'tenant-ss-mobile',
    tenantName: 'SS Mobile Shop',
    name: 'Apple iPhone 15 (128GB - Blue) with Dynamic Island & 48MP Camera',
    category: 'Smartphones & Accessories',
    price: 69999.0,
    originalPrice: 79900.0,
    rating: 4.9,
    reviewsCount: 1120,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Top Flagship',
  },
  {
    id: 'p-ssm-2',
    tenantId: 'tenant-ss-mobile',
    tenantName: 'SS Mobile Shop',
    name: 'Samsung Galaxy S24 5G (8GB RAM + 256GB AI Phone - Onyx Black)',
    category: 'Smartphones & Accessories',
    price: 74999.0,
    originalPrice: 82999.0,
    rating: 4.9,
    reviewsCount: 680,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Galaxy AI',
  },
  {
    id: 'p-ssm-3',
    tenantId: 'tenant-ss-mobile',
    tenantName: 'SS Mobile Shop',
    name: '65W GaN Dual USB-C Ultra-Fast Power Adapter for iPhone & Android',
    category: 'Smartphones & Accessories',
    price: 1499.0,
    originalPrice: 2499.0,
    rating: 4.8,
    reviewsCount: 390,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    featured: false,
    tag: 'Fast Charge',
  },

  // --- 5. Nimantran Restaurant Products ---
  {
    id: 'p-nim-1',
    tenantId: 'tenant-nimantran',
    tenantName: 'Nimantran Restaurant',
    name: 'Special Nimantran Royal Shahi Thali (Paneer Butter Masala, Dal Makhani, 3 Rotis, Pulao & Sweet)',
    category: 'Restaurant & Dining',
    price: 280.0,
    originalPrice: 320.0,
    rating: 5.0,
    reviewsCount: 1450,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Chef Signature Thali',
  },
  {
    id: 'p-nim-2',
    tenantId: 'tenant-nimantran',
    tenantName: 'Nimantran Restaurant',
    name: 'Hyderabadi Dum Chicken Biryani Handi Pot (with Raita, Salan & Boiled Egg)',
    category: 'Restaurant & Dining',
    price: 320.0,
    originalPrice: 380.0,
    rating: 4.9,
    reviewsCount: 1190,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Authentic Dum',
  },

  // --- 6. Mahabaleshwar Restaurant Products ---
  {
    id: 'p-mah-1',
    tenantId: 'tenant-mahabaleshwar',
    tenantName: 'Mahabaleshwar Restaurant',
    name: 'Famous Fresh Mahabaleshwar Strawberry with Whipped Fresh Cream & Ice Cream',
    category: 'Restaurant & Delicacies',
    price: 180.0,
    originalPrice: 220.0,
    rating: 5.0,
    reviewsCount: 2310,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'World Famous Treat',
  },

  // --- 7. Grossary Store ---
  {
    id: 'p-groc-1',
    tenantId: 'tenant-grocery-store',
    tenantName: 'Daily Fresh Grossary Store',
    name: 'Farm Pure Shuddh Desi Cow Ghee (1 Litre Jar)',
    category: 'Grocery & Daily Staples',
    price: 650.0,
    originalPrice: 750.0,
    rating: 4.9,
    reviewsCount: 520,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Pure & Fresh',
  },

  // --- 8. Aditya Shilai Machine ---
  {
    id: 'p-shilai-1',
    tenantId: 'tenant-aditya-shilai',
    tenantName: 'Aditya Shilai Machine',
    name: 'Aditya Automatic Electric Zig-Zag Sewing & Embroidery Machine',
    category: 'Sewing Machines & Tools',
    price: 8999.0,
    originalPrice: 10999.0,
    rating: 4.9,
    reviewsCount: 280,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: '2 Yr Warranty',
  },

  // --- 9. Shri Ram Furniture ---
  {
    id: 'p-furn-1',
    tenantId: 'tenant-shri-ram-furniture',
    tenantName: 'Shri Ram Furniture',
    name: 'Solid Teak Wood 3-Seater Classic Living Room Sofa',
    category: 'Home & Office Furniture',
    price: 16500.0,
    originalPrice: 19999.0,
    rating: 4.9,
    reviewsCount: 180,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Teakwood',
  },

  // --- 10. Pawar Shabudana Wada ---
  {
    id: 'p-wada-1',
    tenantId: 'tenant-pawar-shabudana',
    tenantName: 'Pawar Shabudana Wada',
    name: 'Special Crispy Hot Sabudana Wada Plate (2 Pcs + Peanut Chutney & Curd)',
    category: 'Traditional Fast Food & Snacks',
    price: 60.0,
    originalPrice: 70.0,
    rating: 5.0,
    reviewsCount: 1890,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tag: 'Hot & Fresh',
  },
]

// All combined products
const initialProducts = [
  ...poonamDressesCatalog,
  ...additionalStoresProducts,
  ...expandedStoreProducts,
]

const initialState = {
  tenants: allTenants,
  products: initialProducts,
  selectedTenantId: 'all',
  selectedCategory: 'all',
  selectedIndustry: 'all',
  searchQuery: '',
  cartItems: [
    {
      ...additionalStoresProducts[12], // iPhone 15 from Reliance Digital (₹69,499)
      quantity: 1,
    },
  ],
  isCartOpen: false,
  pocketBalance: 2500,
  isPocketOpen: false,
  pocketTransactions: [
    {
      id: 'tx-init-1',
      type: 'credit',
      title: 'Welcome Pocket Balance Added',
      amount: 2500,
      time: 'Just now',
      paymentMode: 'RAZORPAY SECURED',
    },
  ],
}

export const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    setSelectedTenant: (state, action) => {
      state.selectedTenantId = action.payload
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload
    },
    setSelectedIndustry: (state, action) => {
      state.selectedIndustry = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    addToCart: (state, action) => {
      const product = action.payload
      const existing = state.cartItems.find((item) => item.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.cartItems.push({ ...product, quantity: 1 })
      }
      state.isCartOpen = true
    },
    removeFromCart: (state, action) => {
      const productId = action.payload
      state.cartItems = state.cartItems.filter((item) => item.id !== productId)
    },
    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.cartItems.find((i) => i.id === id)
      if (item) {
        if (quantity <= 0) {
          state.cartItems = state.cartItems.filter((i) => i.id !== id)
        } else {
          item.quantity = quantity
        }
      }
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen
    },
    setCartOpen: (state, action) => {
      state.isCartOpen = action.payload
    },
    clearCart: (state) => {
      state.cartItems = []
    },
    clearStoreCart: (state, action) => {
      const storeId = action.payload
      state.cartItems = state.cartItems.filter((item) => item.tenantId !== storeId)
    },
    registerStore: (state, action) => {
      const newTenant = action.payload
      state.tenants.unshift(newTenant)
    },
    updateProductPrice: (state, action) => {
      const { id, price, originalPrice } = action.payload
      const product = state.products.find((p) => p.id === id)
      if (product) {
        product.price = Number(price)
        if (originalPrice !== undefined) {
          product.originalPrice = Number(originalPrice)
        }
      }
    },
    updateProductStock: (state, action) => {
      const { id, inStock } = action.payload
      const product = state.products.find((p) => p.id === id)
      if (product) {
        product.inStock = inStock
        if (!inStock) {
          product.stockCount = 0
        } else if (!product.stockCount || product.stockCount <= 0) {
          product.stockCount = 10
        }
      }
    },
    updateProductStockDetails: (state, action) => {
      const { id, inStock, stockCount } = action.payload
      const product = state.products.find((p) => p.id === id)
      if (product) {
        if (stockCount !== undefined) {
          const count = Math.max(0, Number(stockCount))
          product.stockCount = count
          product.inStock = count > 0
        }
        if (inStock !== undefined) {
          product.inStock = inStock
          if (!inStock) {
            product.stockCount = 0
          } else if (!product.stockCount || product.stockCount <= 0) {
            product.stockCount = 10
          }
        }
      }
    },
    addProduct: (state, action) => {
      const newProduct = {
        ...action.payload,
        id: action.payload.id || `prod-custom-${Date.now()}`,
        rating: action.payload.rating || 5.0,
        reviewsCount: action.payload.reviewsCount || 1,
      }
      state.products.unshift(newProduct)
    },
    deleteProduct: (state, action) => {
      const productId = action.payload
      state.products = state.products.filter((p) => p.id !== productId)
      state.cartItems = state.cartItems.filter((item) => item.id !== productId)
    },
    updateStoreProfile: (state, action) => {
      const { storeId, tagline, address, dispatchTime } = action.payload
      const tenant = state.tenants.find((t) => t.id === storeId)
      if (tenant) {
        if (tagline !== undefined) tenant.tagline = tagline
        if (address !== undefined) tenant.address = address
        if (dispatchTime !== undefined) tenant.dispatchTime = dispatchTime
      }
    },
    togglePocket: (state) => {
      state.isPocketOpen = !state.isPocketOpen
    },
    setPocketOpen: (state, action) => {
      state.isPocketOpen = action.payload
    },
    addMoneyToPocket: (state, action) => {
      const { amount, paymentId, method } = action.payload
      const numericAmount = Math.max(0, Number(amount))
      state.pocketBalance += numericAmount
      state.pocketTransactions.unshift({
        id: `tx-${Date.now()}`,
        type: 'credit',
        title: `Added to Pocket (${method || 'Razorpay Gateway'})`,
        amount: numericAmount,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        paymentId: paymentId || `pay_rzp_${Date.now()}`,
      })
    },
    debitPocketMoney: (state, action) => {
      const { amount, storeName, orderId } = action.payload
      const numericAmount = Math.max(0, Number(amount))
      state.pocketBalance = Math.max(0, state.pocketBalance - numericAmount)
      state.pocketTransactions.unshift({
        id: `tx-${Date.now()}`,
        type: 'debit',
        title: `Paid at ${storeName || 'Merchant Store'}`,
        amount: numericAmount,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        orderId: orderId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      })
    },
  },
})

export const {
  setSelectedTenant,
  setSelectedCategory,
  setSelectedIndustry,
  setSearchQuery,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  toggleCart,
  setCartOpen,
  clearCart,
  clearStoreCart,
  registerStore,
  updateProductPrice,
  updateProductStock,
  updateProductStockDetails,
  addProduct,
  deleteProduct,
  updateStoreProfile,
  togglePocket,
  setPocketOpen,
  addMoneyToPocket,
  debitPocketMoney,
} = marketplaceSlice.actions

export default marketplaceSlice.reducer
