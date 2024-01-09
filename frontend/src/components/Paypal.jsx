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
    <div style={{ display: "inline-flex" }}>
      <button
        className="dropdown"
        type="button"
        style={{ display: "block", marginBottom: "20px" }}
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

      {/* <button
        type="button"
        style={{
          display: "block",
          marginBottom: "20px",
          marginLeft: "1em",
        }}
        onClick={() => {
          destroySDKScript(getScriptID(SCRIPT_PROVIDER_OPTIONS));
          dispatch({
            type: "setLoadingStatus",
            value: "initial",
          });
        }}
      >
        Reset
      </button> */}
    </div>
  );
};

// Show state
function PrintLoadingState() {
  const [{ isInitial, isPending, isResolved, isRejected }] =
    usePayPalScriptReducer();
  let status = "no status";

  if (isInitial) {
    status = "initial";
  } else if (isPending) {
    status = "pending";
  } else if (isResolved) {
    status = "resolved";
  } else if (isRejected) {
    status = "rejected";
  }

  return <div>Current status: {status}</div>;
}

// ================================================================

export default function App() {
  const { cart, dispatch: cartDispatch } = useCartContext();
  const { user, dispatch: dispatchAuth } = useAuthContext();
  const navigate = useNavigate();
  function createOrder() {
    return fetch(
      `${import.meta.env.VITE_BACKEND_API_URL}/api/payment/create-paypal-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // use the "body" param to optionally pass additional order information
        // like product ids and quantities
        body: JSON.stringify({
          cart: cart.cartItems,
          userId: user._id,
          // cart: [
          //   {
          //     id: "YOUR_PRODUCT_ID",
          //     quantity: "YOUR_PRODUCT_QUANTITY",
          //   },
          // ],
        }),
      }
    )
      .then((response) => response.json())
      .then((order) => {
        return order.id;
      });
  }
  function onApprove(data) {
    return fetch(
      `${
        import.meta.env.VITE_BACKEND_API_URL
      }/api/payment/capture-paypal-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderID: data.orderID,
          cart: cart.cartItems,
          userId: user._id,
        }),
      }
    )
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
        // alert(`Transaction completed by ${name}`);
      });
  }
  return (
    <PayPalScriptProvider
      deferLoading={true}
      options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID }}
    >
      <LoadScriptButton></LoadScriptButton>
      {/* <PrintLoadingState></PrintLoadingState> */}
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
    </PayPalScriptProvider>
  );
}
