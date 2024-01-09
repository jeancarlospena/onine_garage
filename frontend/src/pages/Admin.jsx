import { useEffect } from "react";

import ItemDetails from "../components/ItemDetails";
import { useItemsContext } from "../hooks/useItemscontext";

// components
import ItemForm from "../components/ItemForm";

const Admin = () => {
  const { items, dispatch } = useItemsContext();

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/items`
      );
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "SET_ITEMS", payload: json });
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="img-display-board">
      {items && items.map((item) => <ItemDetails key={item._id} item={item} />)}
    </div>
  );
};

export default Admin;
