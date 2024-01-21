import { useCartContext } from "../hooks/useCartContext.jsx";
import { useAuthContext } from "../hooks/useAuthContext.jsx";
import FlashSale from "../components/FlashSale.jsx";
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
    console.log(cart);
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
      <div className="container">
        {error && <p className="error">Sorry: {error}</p>}
        {item && (
          <div className="product-display">
            <div className="global-padding">
              <div key={item._id} className="product">
                <div className="hide-overflow">
                  {" "}
                  <img
                    src={item.secure_url}
                    alt=""
                    className="main-product-img"
                  />
                </div>

                <h1 className="prodict-title">{item.title}</h1>
                <div className="global-padding">
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
                    className="regular-button form-button"
                  >
                    + Add To Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ItemDetail;
