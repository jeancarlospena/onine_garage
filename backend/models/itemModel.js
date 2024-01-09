const mongoose = require('mongoose')

const Schema = mongoose.Schema

// const ImageSchema = new Schema({
//   secure_url: String,
//   public_id: String
// })
// public_id: { type: String, required: true },
// secure_url: { type: String, required: true }


const itemSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 1
  },
  aveilable: {
    type: Boolean,
    required: true,
    default: true
  },
  qty: {
    type: Number,
    required: true,
    default: 1,
    min: 0
  },
  public_id: { type: String, required: true },
  secure_url: { type: String, required: true },
  description: {
    type: Array,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Item', itemSchema)