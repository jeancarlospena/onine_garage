import { useAuthContext } from "./useAuthContext";
import { useCartContext } from "./useCartContext.jsx";
import axios from "axios";

export const useLogout = () => {
  const { dispatch: authDispath } = useAuthContext();
  const { cart, dispatch: cartDispatch } = useCartContext();

  const logout = () => {
    cart.cartDetails = {
      cartItemsQty: 0,
      cartTotal: 0,
      tax: 0,
      shipping: 0,
      itemsTotal: 0,
    };
    cart.cartItems = [];

    // remove user from cookies
    axios({
      method: "post",
      url: `${import.meta.env.VITE_BACKEND_API_URL}/api/user/logout`,
      withCredentials: true,
    });

    // dispatch logout action
    authDispath({ type: "LOGOUT" });
    cartDispatch({ type: "SET_CART" });
  };
  return { logout };
};
