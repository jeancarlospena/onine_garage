const express = require('express')
const { createPaypalOrder, capturePaypalOrder } = require('../controllers/paypalOrderController')
const { requireAuth } = require("../middleware/requireAuth.js");

// const requireAuth = require('../middleware/requireAuth')
// const requireAdminAuth = require('../middleware/requireAdminAuth')

const router = express.Router()

router.post('/create-paypal-order', createPaypalOrder)

router.post('/capture-paypal-order', capturePaypalOrder)

module.exports = router