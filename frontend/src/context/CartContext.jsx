import { createContext, useReducer, useEffect, useState } from "react";
import { useItemsContext } from "../hooks/useItemscontext.jsx";
import { updateCartDetails } from "../manager/cartManager.jsx";

export const CartContext = createContext();

const initialState = {
  cartDetails: {
    cartItemsQty: 0,
    cartTotal: 0,
    tax: 0,
    shipping: 0,
    itemsTotal: 0,
  },
  cartItems: [],
};

export const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
      };
    default:
      return state;
  }
};

// const initialState = localStorage.getItem("cart")
//   ? JSON.parse(localStorage.getItem("cart"))
//   : {
//       cartDetails: { cartTotal: 0, tax: 0, shipping: 0, itemsTotal: 0 },
//       cartItems: [
//         {
//           qty: 1,
//           item: {
//             _id: "655fa3abd5e17f075d94c290",
//             title: "Mad Rock Mad Pad Crash Pad",
//             price: 100,
//             aveilable: true,
//             qty: 3,
//             public_id: "ujlpahyw1xm3rqojzdsa",
//             secure_url:
//               "https://res.cloudinary.com/dnr8vuf3b/image/upload/v1700766634/ujlpahyw1xm3rqojzdsa.jpg",
//             description: [
//               {
//                 key: "13341ece-3399-4b68-82f1-afb54f6cbd90",
//                 description: "Black",
//               },
//               {
//                 key: "e782f4f3-472b-4321-a182-1c117020dd97",
//                 description: 'Open Size: 48" x 36" x 5"',
//               },
//               {
//                 key: "ae5ba10b-d910-4914-85de-73bf59fcec0d",
//                 description: 'Closed Size: 24" x 36" x 10"',
//               },
//               { key: "6db76bbd-4bd6-43be-a132-e443232c0463", description: "" },
//             ],
//             createdAt: "2023-11-23T19:10:35.588Z",
//             updatedAt: "2024-01-03T22:30:54.859Z",
//           },
//         },
//       ],
//     };

export const CartContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [state, dispatch] = useReducer(cartReducer, {
    cart: initialState,
  });
  useEffect(() => {
    setIsLoading(false);
  });

  // const { items } = useItemsContext();

  // useEffect(() => {
  // try {
  //   let localStorageCart = JSON.parse(localStorage.getItem("cart"));
  //   if (localStorageCart) {
  //     let validItems = [];
  //     items.filter((currItem) => {
  //       localStorageCart.forEach((currCartItem) => {
  //         if (currItem._id === currCartItem.item._id) {
  //           validItems.push({ item: currItem, qty: currCartItem.qty });
  //         }
  //       });
  //     });
  //     state.cart.cartItems = validItems;
  //     updateCartDetails(state.cart);
  //     dispatch("SET_CART");
  //     setIsLoading(false);
  //   } else {
  //     setIsLoading(false);
  //   }
  // } catch (error) {
  //   localStorage.clear();
  // }
  // }, [items]);

  return (
    <CartContext.Provider value={{ ...state, dispatch, isLoading }}>
      {children}
    </CartContext.Provider>
  );
};
