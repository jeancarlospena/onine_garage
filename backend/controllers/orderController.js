const Order = require('../models/orderModel')
const tryCatch = require('../utils/tryCatch.js')
const mongoose = require('mongoose')


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

const getOrder = tryCatch(async (req, res) => {

  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json('The order you tried to access does not exist')
  }
  const order = await Order.findById(id)
  if (order) {
    res.status(200).json(order)
  } else {
    // res.status(404).json({ error: 'Unable to find order' })
    throw new Error('Unable to find order')
  }
})

module.exports = { getOrders, getOrder, getUserOrders }