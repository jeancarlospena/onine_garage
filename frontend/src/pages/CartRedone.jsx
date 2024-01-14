import { useCartContext } from "../hooks/useCartContext.jsx";
import { useAuthContext } from "../hooks/useAuthContext.jsx";
import FlashSale from "../components/FlashSale.jsx";
import Paypal from "../components/Paypal.jsx";
import {
  addItemToCart,
  subtractItemFromCart,
  updateUsersCart,
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
      if (user) {
        updateUsersCart(results);
      }
      cartDispatch({ type: "SET_CART", payload: results });
    }
  };

  const subtractFromCartHandler = (item, cart) => {
    const results = subtractItemFromCart(item, cart);
    if (results) {
      if (user) {
        updateUsersCart(results);
      }
      cartDispatch({ type: "SET_CART", payload: results });
    }
  };

  return (
    <>
      <div className="container">
        <div className="global-padding">
          <div className="order-summary">
            <div className="summary-section">
              <h1 className="title">Order Summary</h1>

              <p className="title">Subtotal: ${cart.cartDetails.cartTotal}</p>

              <p className="details">
                Items Total: ${cart.cartDetails.itemsTotal}
              </p>
              <p className="details">Tax: ${cart.cartDetails.tax}</p>
              <p className="details">Shipping not included.</p>
              <p className="details">
                Items aveilable for pickup after being payed.
              </p>
              {!user && (
                <p className="details bold">
                  Must be logged in to make a purchase.
                </p>
              )}
            </div>
            {!!cart.cartDetails.cartItemsQty && user && (
              <Paypal cart={cart.cartItems}></Paypal>
            )}
          </div>

          <h1 className="title">Items In Cart</h1>
          <div className="products-display">
            {cart &&
              cart.cartItems.map((currItem) => {
                return (
                  <div key={currItem.item._id} className="product">
                    <Link
                      to={`/item/${currItem.item._id}`}
                      className="product-link"
                    >
                      <div className="global-padding">
                        <img
                          className="main-product-img"
                          src={currItem.item.secure_url}
                          alt=""
                        />
                        <h1 className="product-title">{currItem.item.title}</h1>
                      </div>
                    </Link>
                    <div className="global-padding">
                      <div className="product-info">${currItem.item.price}</div>
                      <div className="muted product-info">
                        {currItem.item.qty} aveilable for sale
                      </div>
                      <div className="product-info">Qty: {currItem.qty}</div>
                      <div className="quantityChanger">
                        <div className="qty-buttons">
                          <button
                            className="regular-button form-button"
                            onClick={() =>
                              addToCartHandler(currItem.item, cart)
                            }
                          >
                            +
                          </button>
                          {currItem.item.maxQtyError && (
                            <div className="warning">
                              <span
                                className="closebtn"
                                onClick={() =>
                                  removeQtyError(currItem.item._id)
                                }
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
                            className="regular-button form-button"
                            onClick={() =>
                              subtractFromCartHandler(currItem.item, cart)
                            }
                          >
                            -
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartRedone;
