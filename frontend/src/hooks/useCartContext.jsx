import { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw Error("useItemsContext must be used inside an ItemsContextPrivider");
  }

  return context;
};
