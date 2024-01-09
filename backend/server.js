require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const itemRoutes = require('./routes/items')
const userRoutes = require('./routes/user')
const paymentRoutes = require('./routes/paypalOrder')
const orderRoutes = require('./routes/orders')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')

const app = express()

app.use(express.json({ limit: '50mb' }));

// looks up if the request has a body
// if it does it passes it to the request object
app.use(express.json())
app.use(cookieParser())

app.use(cors())


// global middleware
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
const Item = require('./models/itemModel')
const User = require('./models/userModel')

// app.get('/', function (req, res) {
//   res.send('welcome to the api');
// })
app.use('/api/items', itemRoutes)
app.use('/api/user', userRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/orders', orderRoutes)

// console.log(process.env.NODE_ENV !== 'development')**********

const __dirname2 = path.resolve()
// set react dist folder
app.use(express.static(path.join(__dirname2, '/frontend/dist')))
// redirect non /api routes to index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname2, 'frontend', 'dist', 'index.html'))
})

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('listening on port', process.env.PORT)
    })
  })
  .catch((err) => {
    console.log(err)
  })

// listen for requests
