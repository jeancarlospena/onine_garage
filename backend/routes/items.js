const express = require('express')
// const Item = require('../models/itemModel')
const {
  getItems,
  getItem,
  createItem,
  deleteItem,
  updateItem,
  getAveilableItems,
  getFromArray
} = require('../controllers/itemController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()



router.get('/', getItems)

router.post('/cartitems', getFromArray)

router.get('/aveilable', getAveilableItems)

router.get('/:id', getItem)

router.post('/', createItem)

router.delete('/:id', deleteItem)

router.patch('/:id', updateItem)

module.exports = router