import { useItemsContext } from "../hooks/useItemscontext.jsx";
import { useCartContext } from "../hooks/useCartContext.jsx";
import { getSingleItem } from "../manager/itemsManager.jsx";
import { addItemToCart } from "../manager/cartManager.jsx";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const ItemDetail = () => {
  const [item, setItem] = useState(null);
  const { cart, dispatch: cartDispatch } = useCartContext();
  const { id: itemId } = useParams();

  useEffect(() => {
    getSingleItem(itemId).then(function (value) {
      setItem(value);
    });
  }, []);

  const addToCartHandler = () => {
    const results = addItemToCart(item, cart);
    if (results) {
      cartDispatch({ type: "SET_CART", payload: results });
    }
  };
  return (
    <>
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
