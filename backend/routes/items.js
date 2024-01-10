const express = require('express')
// const Item = require('../models/itemModel')
const {
  getItems,
  getItem,
  createItem,
  deleteItem,
  updateItem,
  getAveilableItems,
} = require('../controllers/itemController')
const { requireAuth, requiredAdmin } = require('../middleware/requireAuth')

const router = express.Router()



router.get('/', getItems)

router.get('/aveilable', getAveilableItems)

router.get('/:id', getItem)

router.post('/', requireAuth, requiredAdmin, createItem)

router.delete('/:id', requireAuth, requiredAdmin, deleteItem)

router.patch('/:id', requireAuth, requiredAdmin, updateItem)

module.exports = router