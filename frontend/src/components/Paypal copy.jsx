// import {
//   PayPalScriptProvider,
//   PayPalButtons,
//   usePayPalScriptReducer,
// } from "@paypal/react-paypal-js";

// // This value is from the props in the UI
// const style = { layout: "vertical" };

// function createOrder() {
//   const user = JSON.parse(localStorage.getItem("user"));
//   return fetch(
//     `${import.meta.env.VITE_BACKEND_API_URL}/api/payment/create-paypal-order`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       // use the "body" param to optionally pass additional order information
//       // like product ids and quantities
//       body: JSON.stringify({
//         cart: localStorage.getItem("cart"),
//         user,
//         // user: localStorage.getItem("user"),
//       }),
//     }
//   )
//     .then((response) => response.json())
//     .then((order) => {
//       // Your code here after create the order
//       return order.id;
//     });
// }
// function onApprove(data) {
//   return fetch(
//     `${import.meta.env.VITE_BACKEND_API_URL}/api/payment/capture-paypal-order`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         orderID: data.orderID,
//       }),
//     }
//   )
//     .then((response) => response.json())
//     .then((orderData) => {
//       if (orderData.status === "COMPLETED") {
//         const user = JSON.parse(localStorage.getItem("user"));

//         const saveOrderDetails = async () => {
//           await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/orders`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               userEmail: user.email,
//               itemsPurchased: user.workingOrder,
//               shippingAddress: orderData.purchase_units[0].shipping.address,
//               shippingName: orderData.purchase_units[0].shipping.name.full_name,
//               total:
//                 orderData.purchase_units[0].payments.captures[0].amount.value,
//             }),
//           });
//         };
//         const returnedVal = saveOrderDetails();
//         localStorage.removeItem("cart");
//         console.log(returnedVal);
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }

// // Custom component to wrap the PayPalButtons and show loading spinner
// const ButtonWrapper = ({ showSpinner }) => {
//   const [{ isPending }] = usePayPalScriptReducer();
//   return (
//     <>
//       {showSpinner && isPending && <div className="spinner" />}
//       <PayPalButtons
//         style={style}
//         disabled={false}
//         forceReRender={[style]}
//         fundingSource={undefined}
//         createOrder={createOrder}
//         onApprove={onApprove}
//       />
//     </>
//   );
// };

// export default function Paypal() {
//   return (
//     <>
//       <div style={{ maxWidth: "500px", minHeight: "200px" }}>
//         <PayPalScriptProvider
//           options={{
//             clientId: import.meta.env.PAYPAL_CLIENT_ID,
//             components: "buttons",
//             currency: "USD",
//           }}
//         >
//           <ButtonWrapper showSpinner={false} />
//         </PayPalScriptProvider>
//       </div>
//     </>
//   );
// }
