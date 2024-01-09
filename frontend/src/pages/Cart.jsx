// import { useEffect, useState } from "react";
// import { useAuthContext } from "../hooks/useAuthContext";
// import Paypal from "../components/Paypal";
// import { useCartContext } from "../hooks/useCartContext.jsx";

// const Cart = () => {
//   const { dispatch: cartDispatch, cart } = useCartContext();
//   console.log(cart, cartDispatch);
//   const { user } = useAuthContext();
//   // const { items, dispatch } = useItemsContext();
//   const [items, setItems] = useState([]);
//   const [error, setError] = useState("");
//   const [total, setTotal] = useState(0);
//   const [localCart, setLocalCart] = useState([]);

//   useEffect(() => {
//     let retreiveLocalCart = localStorage.getItem("cart");
//     if (!retreiveLocalCart) {
//       return;
//     }

//     const fetchItems = async () => {
//       const response = await fetch(
//         `${import.meta.env.VITE_BACKEND_API_URL}/api/items/cartitems`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: retreiveLocalCart,
//         }
//       );
//       const json = await response.json();
//       if (response.ok) {
//         JSON.parse(retreiveLocalCart).forEach((currentCartItem) => {
//           json.forEach((retreivedItem, index) => {
//             if (
//               currentCartItem.id ===
//               JSON.stringify(retreivedItem._id).split('"')[1]
//             ) {
//               json[index].qt = currentCartItem.qt;
//             }
//           });
//         });
//         setItems(json);
//         calculateTotal(json);
//       } else {
//         localStorage.removeItem("cart");
//         setError(json.error);
//       }
//     };
//     fetchItems();
//   }, []);

//   const calculateTotal = (itms) => {
//     const total = itms.reduce(
//       (accumulator, currentValue) =>
//         accumulator + currentValue.price * currentValue.qt,
//       0
//     );
//     setTotal(total);
//   };

//   const removeItemFromCart = (id) => {
//     const newArrayWithRemovedId = items.filter((itm) => {
//       return itm._id !== id;
//     });
//     setItems(newArrayWithRemovedId);
//     removeItemFromLocalStorage(id);
//   };

//   const removeItemFromLocalStorage = (id) => {
//     const currentCart = localStorage.getItem("cart");
//     const newLocalStorageString = JSON.parse(currentCart).filter((itm) => {
//       if (itm.id !== id) {
//         return itm;
//       }
//     });

//     localStorage.setItem("cart", JSON.stringify(newLocalStorageString));
//   };

//   const changeQty = (changeAmount, targetItem) => {
//     let removed = false;
//     let tooMany = false;
//     const arrayWithChangedAmount = items.map((itm) => {
//       if (itm._id === targetItem._id) {
//         if (itm.qt >= itm.qty && changeAmount === 1) {
//           itm.maxQtyError = true;
//           tooMany = true;
//         } else {
//           itm.qt += changeAmount;
//           if (itm.qt <= 0) {
//             removeItemFromCart(targetItem._id);
//             removed = true;
//           }
//         }
//       }
//       return itm;
//     });
//     if (removed) {
//       removeItemFromLocalStorage(targetItem._id);
//       // setItems(arrayWithChangedAmount);
//     } else {
//       setItems(arrayWithChangedAmount);
//       if (!tooMany) {
//         const currentCart = JSON.parse(localStorage.getItem("cart"));
//         const currentCartChangedQt = currentCart.map((itm) => {
//           if (itm.id === targetItem._id) {
//             itm.qt += changeAmount;
//           }
//           return itm;
//         });
//         localStorage.setItem("cart", JSON.stringify(currentCartChangedQt));
//       }
//     }
//     calculateTotal(items);
//   };

//   const removeQtyError = (id) => {
//     const removedQtyErrorFromSpecicId = items.map((itm) => {
//       if (id === itm._id) {
//         itm.maxQtyError = false;
//       }
//       return itm;
//     });
//     setItems(removedQtyErrorFromSpecicId);
//   };
//   return (
//     <div className="cart">
//       <div className="payment-section">
//         <div className="order-summary">
//           {!user && (
//             <h3 className="checkout-warning">
//               You must be logged in to check out!
//             </h3>
//           )}
//           <h2>ORDER SUMMARY</h2>
//           <p>Subtotal: ${total}.00</p>
//           <p>Shipping not included.</p>
//           <p>Items aveilable for pickup after being payed.</p>
//         </div>

//         {user && <Paypal />}
//       </div>
//       {error && <h1>error: {error}</h1>}
//       <div className="img-display-board">
//         {items &&
//           items.map((i) => {
//             return (
//               <div key={i._id} className="display-card">
//                 <img src={i.secure_url} alt="" className="img-cropped" />

//                 <h2>{i.title}</h2>
//                 <p>${i.price}</p>
//                 <p>Aveilable Qty: {i.qty}</p>
//                 <div className="quantityChanger">
//                   <p>
//                     Qty: <span>{i.qt}</span>
//                   </p>
//                   <div className="qty-buttons">
//                     <button
//                       className="submit-button"
//                       onClick={() => changeQty(1, i)}
//                     >
//                       +
//                     </button>
//                     {i.maxQtyError && (
//                       <div className="warning">
//                         <span
//                           className="closebtn"
//                           onClick={() => removeQtyError(i._id)}
//                         >
//                           &times;
//                         </span>
//                         <p>
//                           Only {i.qty} aveilabe. Max quantity aveilable already
//                           in cart.
//                         </p>
//                       </div>
//                     )}
//                     <button
//                       className="submit-button"
//                       onClick={() => changeQty(-1, i)}
//                     >
//                       -
//                     </button>
//                   </div>
//                 </div>
//                 <a className="dropdown">More Info</a>
//                 <div className="dropdown-content">
//                   {i.description.map((d) => (
//                     <p key={d.key}>{d.description}</p>
//                   ))}
//                 </div>
//                 <br></br>
//                 <a
//                   onClick={() => removeItemFromCart(i._id)}
//                   className="pointer dropdown"
//                 >
//                   - Remove Item
//                 </a>
//               </div>
//             );
//           })}
//       </div>
//     </div>
//   );
// };

// export default Cart;
