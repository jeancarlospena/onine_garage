const Order = require('../models/orderModel')
const Item = require('../models/itemModel')
const User = require('../models/userModel')

const createOrder = async (req, res) => {
  const { userEmail, shippingAddress, total } = req.body
  const userLookup = await User.findOne({ email: userEmail })
  const itemsPurchased = userLookup.workingOrder

  const orderValues = { itemsPurchased, userEmail, shippingAddress, total }

  for (const item of JSON.parse(itemsPurchased)) {
    const results = await Item.findOneAndUpdate({ _id: item.id }, { $inc: { qty: -item.qt } })
  }
  try {
    const order = await Order.create(orderValues)
    res.status(200).json({ order })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getOrders = async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 })
  res.status(200).json(orders)
}

const getUserOrders = async (req, res) => {
  const userId = req.params.id
  if (req.user._id.toString() === userId) {
    const orders = await Order.find({ userId: userId, isPaid: true })
    if (orders) {
      res.status(200).json(orders)
    } else {
      res.status(404).json({ message: 'Error: unable to find order' })
    }
  } else {
    res.status(401).json({ error: 'Request is not authorized' })
  }


}

const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    res.status(200).json(order)
  } else {
    res.status(404).json({ message: 'Error: unable to find order' })
  }
}

// itemsPurchased: String,
// userId: {
//   type: Schema.Types.ObjectId,
//   required: true
// },
// shippingAddress: { address_line_1: String, admin_area_1: String, admin_area_2: String, country_code: String, postal_code: String },

// total: {
//   type: Number,
//   required: true
// },


module.exports = { createOrder, getOrders, getOrder, getUserOrders }