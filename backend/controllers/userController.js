const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const generateToken = require('../utils/generateToken.js')

// const createToken = (_id) => {
//   return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
// }
// const token = createToken(user._id)


const verifyUserIdentity = (req, res) => {
  res.json(req.user)
}

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.login(email, password)
    const token = generateToken(res, user._id)
    console.log(token)
    res.cookie('pizza', 'token')
    res.status(200).json({ email: user.email, isAdmin: user.isAdmin, firstName: user.firstName, lastName: user.lastName, phoneNumber: user.phoneNumber, _id: user._id })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const logoutUser = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expiresIn: new Date(0) })
  res.status(200).json({ message: 'Logged out successfully' })
}

// signup user

const signupUser = async (req, res) => {
  const { email, password, firstName, lastName, phoneNumber } = req.body
  try {
    const user = await User.signup(email, password, firstName, lastName, phoneNumber)
    generateToken(res, user._id)
    res.status(200).json({ email: user.email, firstName: user.firstName, lastName: user.lastName, phoneNumber: user.phoneNumber, _id: user._id })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


module.exports = { signupUser, loginUser, verifyUserIdentity, logoutUser }