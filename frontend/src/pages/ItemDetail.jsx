import { useItemsContext } from "../hooks/useItemsContext.jsx";
import { useCartContext } from "../hooks/useCartContext.jsx";
import { getSingleItem } from "../manager/itemsManager.jsx";
import { useAuthContext } from "../hooks/useAuthContext.jsx";
import { addItemToCart, updateUsersCart } from "../manager/cartManager.jsx";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const ItemDetail = () => {
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const { cart, dispatch: cartDispatch } = useCartContext();
  const { id: itemId } = useParams();
  const { user } = useAuthContext();

  useEffect(() => {
    axios
      .get(`/api/items/${itemId}`)
      .then((value) => {
        setItem(value.data);
      })
      .catch((err) => {
        setError(err.response.data);
      });
  }, []);

  const addToCartHandler = () => {
    const results = addItemToCart(item, cart);
    if (results) {
      if (user) {
        updateUsersCart(results);
      }
      cartDispatch({ type: "SET_CART", payload: results });
    }
  };
  return (
    <>
      {error && <p className="error">Sorry: {error}</p>}
      {item && (
        <div className="img-display-board">
          <div key={item._id} className="display-card">
            <img src={item.secure_url} alt="" className="img-cropped" />

            <h2 className="title">{item.title}</h2>
            <p className="details">Price: ${item.price}</p>
            <p className="details">Aveilable In Stock: {item.qty}</p>
            <p className="title">Description:</p>

            {item.description.map((d) => (
              <p className="details" key={d.key}>
                {d.description}
              </p>
            ))}

            <button
              onClick={() => addToCartHandler(item, cart)}
              className={"dropdown"}
            >
              + Add to Cart
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ItemDetail;
