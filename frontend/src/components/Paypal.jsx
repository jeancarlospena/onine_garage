// App.js
import { useCartContext } from "../hooks/useCartContext.jsx";
import { useAuthContext } from "../hooks/useAuthContext.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
// import { use } from "../../../backend/routes/paypalOrder.js";

// ================================================================

// Custom loader component
const LoadScriptButton = () => {
  const [{ isResolved }, dispatch] = usePayPalScriptReducer();
  return (
    <div>
      <button
        // className="checkout-button"
        className="regular-button form-button"
        type="button"
        disabled={isResolved}
        onClick={() => {
          dispatch({
            type: "setLoadingStatus",
            value: "pending",
          });
        }}
      >
        Checkout
      </button>
    </div>
  );
};

export default function App() {
  const { cart, dispatch: cartDispatch } = useCartContext();
  const { user, dispatch: dispatchAuth } = useAuthContext();
  const navigate = useNavigate();
  function createOrder() {
    return fetch(`/api/payment/create-paypal-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart: cart.cartItems,
        userId: user._id,
      }),
    })
      .then((response) => response.json())
      .then((order) => {
        return order.id;
      });
  }
  function onApprove(data) {
    return fetch(`/api/payment/capture-paypal-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderID: data.orderID,
        cart: cart.cartItems,
        userId: user._id,
      }),
    })
      .then((response) => response.json())
      .then((orderData) => {
        if (orderData.status === "COMPLETED") {
          cart.cartDetails = {
            cartItemsQty: 0,
            cartTotal: 0,
            tax: 0,
            shipping: 0,
            itemsTotal: 0,
          };
          cart.cartItems = [];
          cartDispatch({ type: "SET_CART" });
          navigate(`/completetransaction/${orderData.savedOrderId}`);
        }
      });
  }
  return (
    <PayPalScriptProvider
      deferLoading={true}
      options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID }}
    >
      <div className="paypal-buttons-section">
        <LoadScriptButton></LoadScriptButton>
        <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
      </div>
    </PayPalScriptProvider>
  );
}
