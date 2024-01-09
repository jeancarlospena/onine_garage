import { useAuthContext } from "../hooks/useAuthContext.jsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CompletedPayment = () => {
  const [order, setOrder] = useState(null);
  const { user } = useAuthContext();
  const { orderId } = useParams();
  // useEffect(
  //   () => {
  //     axios
  //       .get(`${import.meta.env.VITE_BACKEND_API_URL}/api/orders/${orderId}`)
  //       .then((response) => {
  //         setOrder(response.data);
  //       });
  //   },
  //   (error) => {
  //     console.log(error);
  //   },
  //   []
  // );

  useEffect(() => {
    try {
      axios
        .get(`${import.meta.env.VITE_BACKEND_API_URL}/api/orders/${orderId}`)
        .then((response) => {
          setOrder(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      {order && (
        <>
          <h1 className="title">Order Payment Processed</h1>
          <p className="details">Order reference ID: {order._id}</p>

          <div className="order-summary">
            <h2 className="title">Order Summary:</h2>

            <p className="detals">Subtotal: ${order.cartDetails.cartTotal}</p>

            <p className="details">
              Items Total: ${order.cartDetails.itemsTotal}
            </p>
            <p className="details">Tax: ${order.cartDetails.tax}</p>
            <p className="details">
              Placed: {order.createdAt.substring(0, 10)}
            </p>
            <p className="details">Shipping not included.</p>
            <p className="details">Aveilable to pickup.</p>
          </div>
          <div className="img-display-board">
            {order &&
              order.cartItems.map((currItem) => {
                return (
                  <div key={currItem.item._id} className="display-card">
                    <Link to={`/${currItem.item._id}`}>
                      <img
                        src={currItem.item.secure_url}
                        alt=""
                        className="img-cropped"
                      />

                      <h2 className="title">{currItem.item.title}</h2>
                    </Link>
                    <p className="details">${currItem.item.price}</p>

                    <p className="details">Qty: {currItem.qty}</p>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </>
  );
};

export default CompletedPayment;
