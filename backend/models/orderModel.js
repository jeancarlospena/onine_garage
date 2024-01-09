const mongoose = require('mongoose')

const Schema = mongoose.Schema



const orderSchema = new Schema({
  cartItems: [{
    item: {
      title: { type: String, required: true },
      price: { type: Number, required: true },
      _id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Item' },
      secure_url: { type: String, required: true }
    },
    qty: { type: Number, required: true }
  }],
  cartDetails: {
    cartItemsQty: { type: Number, required: true },
    cartTotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shipping: { type: Number, required: true },
    itemsTotal: { type: Number, required: true }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  shippingAddress: { address_line_1: String, admin_area_1: String, admin_area_2: String, country_code: String, postal_code: String },
  shippingName: String,
  transactionId: String,
  isPaid: { type: Boolean, required: true, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)