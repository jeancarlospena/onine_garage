import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// pages && components
import Home from "./pages/Home";
import Edit from "./pages/Edit";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminCreateItem from "./pages/AdminCreateItem";
// import Cart from "./pages/Cart";
import ItemDetail from "./pages/ItemDetail.jsx";
import CartRedone from "./pages/CartRedone.jsx";
import CompletedPayment from "./pages/CompletedPayment.jsx";
import UserProfile from "./pages/UserProfile.jsx";

import { useAuthContext } from "./hooks/useAuthContext";

function App() {
  const user = useAuthContext().user;

  return (
    <>
      <div className="spaced-display">
        <div className="App main-container">
          <BrowserRouter>
            <Navbar />
            <div className="pages">
              <Routes>
                <Route path="/" element={<Home />} />

                <Route
                  path="/admin"
                  element={
                    user && user.isAdmin ? <Admin /> : <Navigate to="/" />
                  }
                />

                <Route
                  path="/user/:id"
                  element={user ? <UserProfile /> : <Navigate to="/" />}
                ></Route>
                <Route
                  path="/completetransaction/:orderId"
                  element={<CompletedPayment></CompletedPayment>}
                ></Route>
                <Route
                  path="/admin/create"
                  element={
                    user && user.isAdmin ? (
                      <AdminCreateItem />
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                />
                <Route
                  path="/edit/:id"
                  element={
                    user && user.isAdmin ? <Edit /> : <Navigate to="/" />
                  }
                />
                <Route
                  path="/signup"
                  element={user ? <Navigate to="/" /> : <Signup />}
                />
                <Route
                  path="/login"
                  element={user ? <Navigate to="/" /> : <Login />}
                />
                <Route path="/cart" element={<CartRedone />} />
                <Route path="item/:id" element={<ItemDetail></ItemDetail>} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </BrowserRouter>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
