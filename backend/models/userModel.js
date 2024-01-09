const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: true
  },
  orders: [
    { id: Schema.Types.ObjectId }
  ],
  cart: Array,
  workingOrder: String,
  phoneNumber: { type: String, required: true }
})

// static signup method
userSchema.statics.signup = async function (email, password, firstName, lastName, phoneNumber) {
  // validator
  if (!email || !password || !firstName || !lastName || !phoneNumber) {
    throw Error('All fields must be filled')
  }

  if (!validator.isEmail(email)) {
    throw Error('Email is not valid')
  }

  // if (!validator.isStrongPassword(password)) {
  //   throw Error('Password not strong enough')
  // }
  email = email.toLowerCase()
  const exists = await this.findOne({ email })
  if (exists) {
    throw Error('Email already in use')
  }
  const salt = await bcrypt.genSalt(11)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({ email, password: hash, firstName, lastName, phoneNumber })

  return user
}

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email, !password) {
    throw Error('All fields must be filled')
  }
  const user = await this.findOne({ email })
  if (!user) {
    throw Error('Incorrect email')
  }

  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    throw Error('Incorrect password')
  }
  return user
}

module.exports = mongoose.model('User', userSchema)