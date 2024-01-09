const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

// make async
const requireAuth = async (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET)
      req.user = await User.findById(decoded.userId).select('-password')
    } catch (error) {
      res.status(401).json({ error: 'Request is not authorized' })
    }
  } else {
    res.status(401)
    res.json("Not authorized. no token.")
    return
  }
  next()
};

const requiredAdmin = async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401).json({ message: "Not authorized, not an admin" })
  }
}

module.exports = { requireAuth, requiredAdmin }