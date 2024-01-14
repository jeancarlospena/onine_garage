import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCartContext } from "../hooks/useCartContext.jsx";
import { useState } from "react";
import FlashSale from "./FlashSale.jsx";

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
      <div className="container">
        <div className="global-padding">
          <div className="header">
            <Link className="nav-link" to="/">
              ONLINESHOP
            </Link>
            {/* {user && <Link to={`/user/${user._id}`}>Hello, {user.firstName}</Link>} */}

            <div className="navigate">
              {user && (
                <>
                  {user.isAdmin ? (
                    <>
                      <Link className="nav-link" to="/admin">
                        Admin Page
                      </Link>
                      <Link className="nav-link" to="/admin/create">
                        Add Stock
                      </Link>
                    </>
                  ) : (
                    <Link className="nav-link" to={`/user/${user._id}`}>
                      profile
                    </Link>
                  )}
                  <Link className="nav-link" onClick={handleClick}>
                    Log out
                  </Link>
                </>
              )}
              {!user && (
                <>
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>

                  <Link className="nav-link" to="/signup">
                    Register
                  </Link>
                </>
              )}

              <Link className="nav-link" to="/cart">
                Cart{" "}
                {cart.cartDetails.cartItemsQty
                  ? ` (${cart.cartDetails.cartItemsQty})`
                  : ""}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
