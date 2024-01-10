const Item = require('../models/itemModel')
const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: "dnr8vuf3b",
  api_key: "265697153918211",
  api_secret: "cEboq2DSETBnuYqEZ4NwCH0Aa8w"
})
const options = {
  overwrite: true,
  invalidate: true,
  resource_type: "image"
}

// get all 
const getItems = async (req, res) => {
  const items = await Item.find({}).sort({ createdAt: -1 })
  res.status(200).json(items)
}

// get ids in cart
const getFromArray = async (req, res) => {

  const itemsArr = req.body
  // verify each id us good
  let invalidId = false
  const itmsIdList = itemsArr.map(currItm => {
    if (!mongoose.Types.ObjectId.isValid(currItm.id)) {
      invalidId = true
    }
    return currItm.id
  });
  if (invalidId) {
    return res.status(404).json({ error: 'Invalid ID' })
  }

  // get the items in the cart and return them
  const items = await Item.find({ _id: { $in: itmsIdList } }).lean()
  itemsArr.forEach((itmIds) => {
    items.forEach((retreivedItem, index) => {
      if (itmIds.id === JSON.stringify(retreivedItem._id).split("\"")[1]) {
        items[index].qt = itmIds.qt
      }
    })
  })
  res.status(200).json(items)
}

// get aveilable
const getAveilableItems = async (req, res) => {
  res.cookie('imtires', 'yes i am')
  const items = await Item.find({ aveilable: true, qty: { $gt: 0 } }).sort({ createdAt: -1 })
  res.status(200).json(items)
}

// get single
const getItem = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json('The item you tried to access is not aveilable')
  }

  const item = await Item.findById(id)

  if (!item) {
    return res.status(404).json('The item you tried to access is not aveilable')
  }

  res.status(200).json(item)
}

// create 
const createItem = async (req, res) => {
  let emptyFields = []
  const { title, price, description, images } = req.body


  if (!title) {
    emptyFields.push('title')
  }
  if (!price) {
    emptyFields.push('price')
  }
  if (!description || description.length == 0) {
    emptyFields.push('description')
  }
  if (!images) {
    emptyFields.push('images')
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }



  // const uploadedImage = await cloudinary.uploader.upload(images, options)

  const uploadedImage = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload(images, options, (error, result) => {
      if (result && result.secure_url) {
        return resolve(result)
      }
      return res.status(400).json({ error: `Unable to upload image: ${error.message}`, })
    })
  })
  const { public_id, secure_url } = uploadedImage

  try {
    const item = await Item.create({ title, price, description, public_id, secure_url })
    res.status(200).json(item)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }

}

// delete
const deleteItem = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.stutus(404).json({ error: 'No such item' })
  }

  const item = await Item.findOneAndDelete({ _id: id })

  if (!item) {
    return res.status(400).json({ error: 'No such item' })
  }

  cloudinary.uploader.destroy(item.public_id, options)
    .then((result) => res.status(200).json(item, result))
    .catch((err) => res.status(500).send(err));

  res.status(200).json(item)
}

// update
const updateItem = async (req, res) => {
  const { id } = req.params

  if (req.body.images) {
    const uploadedImage = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(req.body.images, options, (error, result) => {
        if (result && result.secure_url) {
          return resolve(result)
        }
        return reject({ message: error.message })
      })
    })
    const { public_id, secure_url } = uploadedImage
    req.body.public_id = public_id
    req.body.secure_url = secure_url
    cloudinary.uploader.destroy(req.body.replaceImageDeleteId, options)
      .then((result) => res.status(200).json(item, result))
      .catch((err) => res.status(500).send(err));
  }

  // console.log(req.body)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.stutus(404).json({ error: 'No such item' })
  }

  const item = await Item.findOneAndUpdate({ _id: id }, {
    ...req.body
  })

  if (!item) {
    return res.status(400).json({ error: 'No such item' })
  }

  res.status(200).json(item)
}

module.exports = {
  getItems,
  getItem,
  createItem,
  deleteItem,
  updateItem,
  getAveilableItems,
  getFromArray
}