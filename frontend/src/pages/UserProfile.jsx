import axios from "axios";
import { useEffect, useState } from "react";
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
          url: `/api/orders/user/${user._id}`,
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
    <div className="container">
      <div className="global-padding">
        <div className="profile-board">
          <div className="profile-section">
            <h1>Profile</h1>
            <p>Name: Carlos Pena</p>
            <p>Email: email@email.com</p>
            <p>Phone: 999-999-9999</p>
          </div>
          <div className="orders-section">
            <h1>Orders</h1>
            {orders &&
              orders.map((order) => {
                return (
                  <Link
                    key={order._id}
                    to={`/completetransaction/${order._id}`}
                    className="order-link"
                  >
                    <div className="order">
                      <p className="order-p">
                        <span className="bold">Order #:</span>
                        {order._id}
                      </p>
                      <p className="order-p">
                        <span className="bold">Total:</span> $
                        {order.cartDetails.cartTotal}
                      </p>
                      <p className="order-p">
                        <span className="bold">Placed:</span>{" "}
                        {order.createdAt.substring(0, 10)}
                      </p>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

// {user && (
//   <div className="x-motion">
//     <h1 className="title">User Profile</h1>
//     <p className="details">
//       Name: {user.firstName} {user.lastName}{" "}
//     </p>
//     <p className="details">Email: {user.email}</p>
//     <p className="details">Phone Number: {user.phoneNumber}</p>
//   </div>
// )}
// {orders && (
//   <div className="x-motion">
//     <h1 className="title">Orders Placed</h1>
//     {orders.map((order) => (
//       <p key={order._id} className="details">
//         <Link to={`/completetransaction/${order._id}`}>
//           View: {order._id}
//         </Link>
//         {" / Cart Total: "}
//         {order.cartDetails.cartTotal}
//         {" / Order Placed: "}
//         {order.createdAt.substring(0, 10)}
//       </p>
//     ))}
//   </div>
// )}

export default UserProfile;
