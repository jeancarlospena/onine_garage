import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import axios from "axios";

// axios.defaults.withCredentials = true;

// import { ItemsContext } from "./context/ItemContext.jsx";
import { ItemsContextProvider } from "./context/ItemsContext.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { CartContextProvider } from "./context/CartContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <ItemsContextProvider>
        <CartContextProvider>
          <App />
        </CartContextProvider>
      </ItemsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
