const express = require('express')
const { requireAuth } = require("../middleware/requireAuth.js");

const { createOrder, getOrders, getOrder, getUserOrders } = require('../controllers/orderController')

const router = express.Router()

router.post('/', createOrder)

router.get('/', getOrders)
router.get('/:id', getOrder)
router.get('/user/:id', requireAuth, getUserOrders)

module.exports = router