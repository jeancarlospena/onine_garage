const jwt = require('jsonwebtoken')

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET, { expiresIn: '30d' })
  // set jwt as http-only cookie
  console.log('at generating page ', token)
  res.cookie('generatepage', 'generated')
  // res.cookie('jwt', token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV !== 'development',
  //   sameSite: 'strict',
  //   maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
  // })
  res.cookie('jwt', token)
  return token
}

module.exports = generateToken