import mongoose from 'mongoose'

const tenantSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    industryCategory: { type: String, required: true, index: true },
    logo: { type: String, default: '' },
    cover: { type: String, default: '' },
    tagline: { type: String, default: '' },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 120 },
    dispatchTime: { type: String, default: '30-45 Mins Fast Delivery' },
    address: { type: String, default: 'Commercial Center' },
    status: { type: String, enum: ['active', 'suspended'], default: 'active', index: true },
    ownerEmail: { type: String },
    ownerPhone: { type: String },
  },
  { timestamps: true }
)

export const Tenant = mongoose.models.Tenant || mongoose.model('Tenant', tenantSchema)
