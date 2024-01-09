import axios from "axios";
import { useEffect, useState } from "react";
import { useCartContext } from "../hooks/useCartContext.jsx";
import { useAuthContext } from "../hooks/useAuthContext.jsx";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { user } = useAuthContext();
  const [orders, setOrders] = useState();
  useEffect(() => {
    if (user) {
      try {
        axios({
          method: "get",
          url: `${import.meta.env.VITE_BACKEND_API_URL}/api/orders/user/${
            user._id
          }`,
          withCredentials: true,
        }).then((response) => {
          setOrders(response.data);
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [user]);

  return (
    <>
      {user && (
        <>
          <h1 className="title">User Profile</h1>
          <p className="details">
            Name: {user.firstName} {user.lastName}{" "}
          </p>
          <p className="details">Email: {user.email}</p>
          <p className="details">Phone Number: {user.phoneNumber}</p>
        </>
      )}
      {orders && (
        <>
          <h1 className="title">Orders Placed</h1>
          {orders.map((order) => (
            <p key={order._id} className="details">
              <Link to={`/completetransaction/${order._id}`}>
                View: {order._id}
              </Link>
              {" / Cart Total: "}
              {order.cartDetails.cartTotal}
              {" / Order Placed: "}
              {order.createdAt.substring(0, 10)}
            </p>
          ))}
        </>
      )}
    </>
  );
};

export default UserProfile;