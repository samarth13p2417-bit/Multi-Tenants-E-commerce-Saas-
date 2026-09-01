import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
})

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    tenantId: { type: String, required: true, index: true }, // Isolated merchant routing
    tenantName: { type: String, required: true },
    customerName: { type: String, default: 'Customer' },
    customerEmail: { type: String },
    customerPhone: { type: String },
    deliveryAddress: { type: String, required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentGateway: {
      type: String,
      enum: ['RAZORPAY', 'STRIPE', 'COD'],
      default: 'RAZORPAY',
    },
    paymentId: { type: String, index: true },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PAID',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: ['PLACED', 'PREPARING', 'DISPATCHED', 'DELIVERED', 'CANCELLED'],
      default: 'PLACED',
    },
  },
  { timestamps: true }
)

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)
