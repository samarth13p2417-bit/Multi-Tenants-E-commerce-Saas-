// OmniMarket Central REST API Client
// Connects React frontend to Node.js / Express backend (http://localhost:5000/api)

const API_BASE_URL = 'http://localhost:5000/api'

class ApiService {
  constructor() {
    this.token = localStorage.getItem('omnimarket_token') || null
  }

  setToken(token) {
    this.token = token
    if (token) {
      localStorage.setItem('omnimarket_token', token)
    } else {
      localStorage.removeItem('omnimarket_token')
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    }
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }
    return headers
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      return data
    } catch (error) {
      console.warn(`[API Client Warning]: ${endpoint} -> ${error.message}. Operating in resilient local mode.`)
      return { success: false, message: error.message }
    }
  }

  // Auth APIs
  async customerLogin(emailOrPhone, password) {
    return this.request('/auth/customer-login', {
      method: 'POST',
      body: JSON.stringify({ emailOrPhone, password }),
    })
  }

  async vendorLogin(storeId, email, password) {
    return this.request('/auth/vendor-login', {
      method: 'POST',
      body: JSON.stringify({ storeId, email, password }),
    })
  }

  async vendorSendOtp(phone, storeId) {
    return this.request('/auth/vendor-send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, storeId }),
    })
  }

  async vendorVerifyOtp(phone, otp, storeId) {
    return this.request('/auth/vendor-verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp, storeId }),
    })
  }

  async adminSendOtp(adminId, email, password) {
    return this.request('/auth/admin-send-otp', {
      method: 'POST',
      body: JSON.stringify({ adminId, email, password }),
    })
  }

  async adminVerifyOtp(otp) {
    return this.request('/auth/admin-verify-otp', {
      method: 'POST',
      body: JSON.stringify({ otp }),
    })
  }

  // Stores API
  async getStores(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/stores?${query}`)
  }

  async getStoreById(storeId) {
    return this.request(`/stores/${storeId}`)
  }

  async registerStore(storeData) {
    return this.request('/stores/register', {
      method: 'POST',
      body: JSON.stringify(storeData),
    })
  }

  // Products API
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/products?${query}`)
  }

  async addProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  }

  async updateProductPrice(id, price, originalPrice) {
    return this.request(`/products/${id}/price`, {
      method: 'PUT',
      body: JSON.stringify({ price, originalPrice }),
    })
  }

  async updateProductStock(id, stockCount, inStock) {
    return this.request(`/products/${id}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ stockCount, inStock }),
    })
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    })
  }

  // Orders API
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  async getStoreOrders(storeId) {
    return this.request(`/orders/store/${storeId}`)
  }

  // Payment APIs
  async createRazorpayOrder(amount, receipt, notes = {}) {
    return this.request('/payment/create-razorpay-order', {
      method: 'POST',
      body: JSON.stringify({ amount, receipt, notes }),
    })
  }

  async verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature) {
    return this.request('/payment/verify-razorpay-signature', {
      method: 'POST',
      body: JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature }),
    })
  }

  async getHealth() {
    return this.request('/health')
  }
}

export const api = new ApiService()
export default api
