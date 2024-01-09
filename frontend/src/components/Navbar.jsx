import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCartContext } from "../hooks/useCartContext.jsx";
import { useState } from "react";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const { cart } = useCartContext();
  const [expandedHeader, setExpandedHeader] = useState(false);
  const handleClick = () => {
    logout();
  };

  const expandToggle = () => {
    setExpandedHeader(!expandedHeader);
  };
  return (
    <header>
      <div className="left">
        <Link to="/">Online Garage Sales</Link>
      </div>
      <div onClick={expandToggle} className="expander">
        menu &#x21b4;
      </div>
      <div className={expandedHeader ? "hidden-800 right" : "right"}>
        {user && <Link to={`/user/${user._id}`}>Hello, {user.firstName}</Link>}
        {user && (
          <>
            {user.isAdmin && (
              <>
                <Link to="/admin">Admin Page</Link>
                <Link to="/admin/create">Add Stock</Link>
              </>
            )}
            <a onClick={handleClick}>Log out</a>
          </>
        )}

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Register</Link>
          </>
        )}
        <Link to="/cart">Cart ({cart && cart.cartDetails.cartItemsQty})</Link>
      </div>
    </header>
  );
};

export default Navbar;
