import { useAuthContext } from "../hooks/useAuthContext.jsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CompletedPayment = () => {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const { orderId } = useParams();

  useEffect(() => {
    axios
      .get(`/api/orders/${orderId}`)
      .then((response) => {
        setOrder(response.data);
      })
      .catch((err) => {
        console.log(err);
        setError(err.response.data);
      });
  }, []);

  return (
    <div className="container">
      <div className="global-padding">
        {error && <p className="error">Sorry: {error}</p>}
        {order && (
          <>
            <div className="profile-board">
              <div className="profile-section">
                <h1 className="title">Order Summary</h1>

                <p className="detals">
                  Subtotal: ${order.cartDetails.cartTotal}
                </p>

                <p className="details">
                  Items Total: ${order.cartDetails.itemsTotal}
                </p>
                <p className="details">Tax: ${order.cartDetails.tax}</p>

                <p className="details">Shipping not included.</p>
                <p className="details">Aveilable for pickup.</p>
              </div>
              <div className="profile-section">
                <h1 className="title">Order Payment Processed</h1>
                <p className="details">Order reference ID: {order._id}</p>
                <p className="details">
                  Date Placed: {order.createdAt.substring(0, 10)}
                </p>
              </div>
            </div>
            <h1 className="title">Items Purchased</h1>
            <div className="product-display">
              {order &&
                order.cartItems.map((currItem) => {
                  return (
                    <div key={currItem.item._id} className="product">
                      <Link
                        className="product-link"
                        to={`/item/${currItem.item._id}`}
                      >
                        <img
                          src={currItem.item.secure_url}
                          alt=""
                          className="main-product-img"
                        />

                        <h1 className="product-title">{currItem.item.title}</h1>
                      </Link>
                      <p className="details">${currItem.item.price}</p>

                      <p className="details">Qty: {currItem.qty}</p>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompletedPayment;
