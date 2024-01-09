import axios from "axios";

const addItemToCart = (item, cart) => {
  let added = false;
  let maxReached = false;
  cart.cartItems.forEach((currItem, idx) => {
    if (currItem.item._id === item._id && !added) {
      if (currItem.qty === currItem.item.qty) {
        maxReached = true;
        added = true;
      } else {
        cart.cartItems[idx].qty += 1;
        added = true;
      }
    }
  });
  if (maxReached) {
    return null;
  }
  if (!added) {
    cart.cartItems.push({ item, qty: 1 });
  }
  updateCartDetails(cart);
  return cart;
};

const subtractItemFromCart = (item, cart) => {
  let subtracted = false;
  let remove = false;
  cart.cartItems.forEach((currItem, idx) => {
    if (currItem.item._id === item._id && !subtracted) {
      cart.cartItems[idx].qty -= 1;
      subtracted = true;
      if (cart.cartItems[idx].qty === 0) {
        remove = true;
      }
    }
  });
  if (remove) {
    cart.cartItems = cart.cartItems.filter((currItem) => currItem.qty >= 1);
  }
  updateCartDetails(cart);
  return cart;
};

const updateCartDetails = (cart) => {
  // { cartTotal: "", tax: "", shipping: "", itemsTotal: "" }
  let total = 0;
  let qty = 0;
  cart.cartItems.forEach((currItem) => {
    total += currItem.qty * currItem.item.price;
    qty += currItem.qty;
  });
  cart.cartDetails.cartItemsQty = qty;
  cart.cartDetails.itemsTotal = total;
  cart.cartDetails.tax = parseFloat(((total * 6.625) / 100).toFixed(2));
  cart.cartDetails.cartTotal =
    cart.cartDetails.itemsTotal + cart.cartDetails.tax;
  return cart;
};

const updateUsersCart = (cart) => {
  axios({
    url: "/api/user/updatecart",
    method: "post",
    data: { cart: cart.cartItems },
    withCredentials: true,
  });
};

export {
  addItemToCart,
  subtractItemFromCart,
  updateCartDetails,
  updateUsersCart,
};
