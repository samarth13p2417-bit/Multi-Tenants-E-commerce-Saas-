import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true },
    phone: { type: String, index: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['customer', 'vendor', 'super_admin'],
      default: 'customer',
      index: true,
    },
    storeId: { type: String, index: true }, // Bound tenantId if role === 'vendor'
    storeName: { type: String },
    adminId: { type: String },
    fullName: { type: String, default: 'User' },
    isPhoneVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Pre-save password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Match password helper
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

export const User = mongoose.models.User || mongoose.model('User', userSchema)
