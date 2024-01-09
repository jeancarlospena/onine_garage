import { useCartContext } from "../hooks/useCartContext.jsx";
import { useAuthContext } from "../hooks/useAuthContext.jsx";
import Paypal from "../components/Paypal.jsx";
import {
  addItemToCart,
  subtractItemFromCart,
} from "../manager/cartManager.jsx";
import { Link } from "react-router-dom";

const CartRedone = () => {
  const {
    dispatch: cartDispatch,
    cart,
    isLoading: loadingCart,
  } = useCartContext();
  const { user } = useAuthContext();

  const addToCartHandler = (item, cart) => {
    const results = addItemToCart(item, cart);
    if (results) {
      cartDispatch({ type: "SET_CART", payload: results });
    }
  };

  const subtractFromCartHandler = (item, cart) => {
    const results = subtractItemFromCart(item, cart);
    if (results) {
      cartDispatch({ type: "SET_CART", payload: results });
    }
  };

  return (
    <>
      {!loadingCart && (
        <div className="cart">
          <div className="order-summary">
            <h2 className="title">ORDER SUMMARY:</h2>

            <p className="title">Subtotal: ${cart.cartDetails.cartTotal}</p>

            <p className="details">
              Items Total: ${cart.cartDetails.itemsTotal}
            </p>
            <p className="details">Tax: ${cart.cartDetails.tax}</p>
            <p className="details">Shipping not included.</p>
            <p className="details">
              Items aveilable for pickup after being payed.
            </p>
            {!user && <p className="title">Must be logged in to pay!</p>}
          </div>
          {!!cart.cartDetails.cartItemsQty && user && (
            <Paypal cart={cart.cartItems}></Paypal>
          )}
        </div>
      )}
      <div className="img-display-board">
        {cart &&
          cart.cartItems.map((currItem) => {
            return (
              <div key={currItem.item._id} className="display-card">
                <Link to={`/${currItem.item._id}`}>
                  <img
                    src={currItem.item.secure_url}
                    alt=""
                    className="img-cropped"
                  />

                  <h2 className="title">{currItem.item.title}</h2>
                </Link>
                <p className="details">${currItem.item.price}</p>
                <p className="muted details">
                  {currItem.item.qty} aveilable for sale
                </p>
                <p className="details">Qty: {currItem.qty}</p>
                <div className="quantityChanger">
                  <div className="qty-buttons">
                    <button
                      className="dropdown"
                      onClick={() => addToCartHandler(currItem.item, cart)}
                    >
                      +
                    </button>
                    {currItem.item.maxQtyError && (
                      <div className="warning">
                        <span
                          className="closebtn"
                          onClick={() => removeQtyError(currItem.item._id)}
                        >
                          &times;
                        </span>
                        <p>
                          Only {currItem.item.qty} aveilabe. Max quantity
                          aveilable already in cart.
                        </p>
                      </div>
                    )}
                    <button
                      className="dropdown"
                      onClick={() =>
                        subtractFromCartHandler(currItem.item, cart)
                      }
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default CartRedone;
