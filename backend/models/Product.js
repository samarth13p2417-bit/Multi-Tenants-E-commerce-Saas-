import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    tenantId: { type: String, required: true, index: true }, // Tenant Data Isolation Discriminant
    tenantName: { type: String, required: true },
    name: { type: String, required: true, index: true },
    category: { type: String, default: 'General' },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    stockCount: { type: Number, default: 15 },
    inStock: { type: Boolean, default: true, index: true },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 80 },
    image: { type: String, default: '' },
    tag: { type: String },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Multi-tenant Compound Index for fast isolated store querying
productSchema.index({ tenantId: 1, inStock: 1 })
productSchema.index({ tenantId: 1, category: 1 })

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema)
