const { CLIENT_ID, APP_SECRET } = process.env;
const baseURL = {
  sandbox: "https://api-m.sandbox.paypal.com",
  production: "https://api-m.paypal.com"
};

const Item = require('../models/itemModel')
const User = require('../models/userModel')
const Order = require('../models/orderModel')
const mongoose = require('mongoose')


const initializeOrderObject = async (cart) => {
  const itemsIdList = cart.map((currItem) => currItem.item._id)
  const verifiedItems = await Item.find({ _id: { $in: itemsIdList } }).lean()
  if (verifiedItems) {
    let verifiedItemsWithQty = {
      cartDetails: {
        cartItemsQty: 0,
        cartTotal: 0,
        tax: 0,
        shipping: 0,
        itemsTotal: 0,
      }, cartItems: []
    }
    cart.map((currItem) => {
      verifiedItems.forEach((verifiedItem) => {
        let added = false
        if (!added && currItem.item._id === verifiedItem._id.toHexString()) {
          verifiedItemsWithQty.cartItems.push({ item: verifiedItem, qty: currItem.qty })
          added = true
        }
      })
    })
    let total = 0;
    let qty = 0;
    verifiedItemsWithQty.cartItems.forEach((currItem) => {
      total += currItem.qty * currItem.item.price;
      qty += currItem.qty;
    });
    verifiedItemsWithQty.cartDetails.cartItemsQty = qty;
    verifiedItemsWithQty.cartDetails.itemsTotal = total;
    verifiedItemsWithQty.cartDetails.tax = parseFloat(((total * 6.625) / 100).toFixed(2));
    verifiedItemsWithQty.cartDetails.cartTotal =
      verifiedItemsWithQty.cartDetails.itemsTotal + verifiedItemsWithQty.cartDetails.tax;
    return verifiedItemsWithQty
  }
}


// create a new order
const createPaypalOrder = async (req, res) => {
  const { cart } = req.body
  const verifiedItemsWithQty = await initializeOrderObject(cart)
  const order = await createOrder(verifiedItemsWithQty);
  res.json(order);
  // const verifiedItems = await Item.find({ _id: { $in: itemsIdList } }).lean()
  // if (verifiedItems) {
  //   let verifiedItemsWithQty = {
  //     cartDetails: {
  //       cartItemsQty: 0,
  //       cartTotal: 0,
  //       tax: 0,
  //       shipping: 0,
  //       itemsTotal: 0,
  //     }, cartItems: []
  //   }
  //   req.body.cart.map((currItem) => {
  //     verifiedItems.forEach((verifiedItem) => {
  //       let added = false
  //       if (!added && currItem.item._id === verifiedItem._id.toHexString()) {
  //         verifiedItemsWithQty.cartItems.push({ item: verifiedItem, qty: currItem.qty })
  //         added = true
  //       }
  //     })
  //   })
  //   let total = 0;
  //   let qty = 0;
  //   verifiedItemsWithQty.cartItems.forEach((currItem) => {
  //     total += currItem.qty * currItem.item.price;
  //     qty += currItem.qty;
  //   });
  //   verifiedItemsWithQty.cartDetails.cartItemsQty = qty;
  //   verifiedItemsWithQty.cartDetails.itemsTotal = total;
  //   verifiedItemsWithQty.cartDetails.tax = parseFloat(((total * 6.625) / 100).toFixed(2));
  //   verifiedItemsWithQty.cartDetails.cartTotal =
  //     verifiedItemsWithQty.cartDetails.itemsTotal + verifiedItemsWithQty.cartDetails.tax;
  //   // console.log(verifiedItemsWithQty)
  //   // const order = await createOrder(verifiedItemsWithQty.cartDetails.cartTotal);
  //   // const order = await createOrder(verifiedItemsWithQty);
  //   // order.cart = verifiedItemsWithQty
  //   // const savedOrder = await Order.create({ ...verifiedItemsWithQty, userId: req.body.userId })
  //   // order.savedOrderId = savedOrder._id



  // } else {
  //   res.json({ error: 'Missing items' })
  // }


  // const cartItemsArr = JSON.parse(req.body.cart)
  // const email = req.body.user.email
  // // console.log(email)
  // await User.findOneAndUpdate({ email }, { workingOrder: JSON.stringify(cartItemsArr) })
  // // verify each id is good
  // let invalidId = false
  // const itmsIdList = cartItemsArr.map(currItm => {
  //   if (!mongoose.Types.ObjectId.isValid(currItm.id)) {
  //     invalidId = true
  //   }
  //   return currItm.id
  // });
  // if (invalidId) {
  //   return res.status(404).json({ error: 'Invalid ID' })
  // }

  // // get the items in the cart and return them
  // const items = await Item.find({ _id: { $in: itmsIdList } }).lean()

  // cartItemsArr.forEach((currentCartItem) => {
  //   items.forEach((retreivedItem, index) => {
  //     if (currentCartItem.id === JSON.stringify(retreivedItem._id).split("\"")[1]) {
  //       items[index].orderedQty = currentCartItem.qt
  //     }
  //   })
  // })
  // const total = items.reduce((accumulator, currentValue) => accumulator + currentValue.price * currentValue.orderedQty, 0)

  // const order = await createOrder(total);

};

// capture payment & store order information or fullfill order
const capturePaypalOrder = async (req, res) => {
  const { orderID, cart, userId } = req.body;

  const verifiedItemsWithQty = await initializeOrderObject(cart)
  const savedOrder = await Order.create({
    ...verifiedItemsWithQty,
    userId: userId
  })

  const captureData = await capturePayment(orderID);

  if (captureData.status === 'COMPLETED') {
    const updatedTransaction = await Order.findOneAndUpdate(
      { _id: savedOrder._id },
      {
        isPaid: true,
        transactionId: captureData.id,
        shippingAddress: captureData.purchase_units[0].shipping.address,
        shippingName: captureData.purchase_units[0].shipping.name.full_name,
      }
    )
    captureData.savedOrderId = updatedTransaction._id
  }
  res.json(captureData);
};

//////////////////////
// PayPal API helpers
//////////////////////

// use the orders api to create an order
async function createOrder(cart) {
  const accessToken = await generateAccessToken();
  const url = `${baseURL.sandbox}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },


    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: cart.cartDetails.cartTotal,
          },
        }
      ]
    })
  });
  const data = await response.json();
  return data;
}

// use the orders api to capture payment for an order
async function capturePayment(orderId) {

  const accessToken = await generateAccessToken();
  const url = `${baseURL.sandbox}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  // let orderSummary = data;
  // console.log(data)
  // console.log(data.purchase_units[0].shipping)
  return data;
}

// generate an access token using client id and app secret
async function generateAccessToken() {
  const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64")
  const response = await fetch(`${baseURL.sandbox}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const data = await response.json();
  return data.access_token;
}

module.exports = {
  createPaypalOrder,
  capturePaypalOrder
}