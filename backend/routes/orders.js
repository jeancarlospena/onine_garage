const express = require('express')
const { requireAuth, requiredAdmin } = require("../middleware/requireAuth.js");

const { getOrders, getOrder, getUserOrders } = require('../controllers/orderController')

const router = express.Router()

router.get('/', requireAuth, requiredAdmin, getOrders)
router.get('/:id', getOrder)
router.get('/user/:id', requireAuth, getUserOrders)

module.exports = router