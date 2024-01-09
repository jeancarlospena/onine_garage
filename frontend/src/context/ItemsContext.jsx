import { createContext, useReducer, useEffect, useState } from "react";

export const ItemsContext = createContext();

export const itemsReducer = (state, action) => {
  switch (action.type) {
    case "SET_ITEMS":
      return {
        items: action.payload,
      };
    case "CREATE_ITEM":
      return {
        items: [action.payload, ...state.items],
      };
    case "DELETE_ITEM":
      return {
        items: state.items.filter((i) => i._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const ItemsContextProvider = ({ children }) => {
  const [isLoading, setIsloading] = useState(true);
  const [state, dispatch] = useReducer(itemsReducer, {
    items: [],
  });

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/items/aveilable`
      );
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "SET_ITEMS", payload: json });
        setIsloading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <ItemsContext.Provider value={{ ...state, dispatch, isLoading }}>
      {children}
    </ItemsContext.Provider>
  );
};
