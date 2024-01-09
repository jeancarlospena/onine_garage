import { createContext, useReducer, useEffect, useState } from "react";
import axios from "axios";
export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });
  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem("user"));
    // if (user) {
    //   dispatch({ type: "LOGIN", payload: user });
    // }

    const initialUser = async () => {
      await axios({
        method: "post",
        url: `${import.meta.env.VITE_BACKEND_API_URL}/api/user/verify`,
        withCredentials: true,
      }).then(
        (response) => {
          dispatch({ type: "LOGIN", payload: response.data });
        },
        (error) => {}
      );

      // if (response.status) {
      //   dispatch({ type: "LOGIN", payload: response.data });
      // }
    };
    initialUser();
  }, []);
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// const useLogin = () => {
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const login = async (email, password) => {
//     const response = await fetch(
//       `${import.meta.env.VITE_BACKEND_API_URL}/api/user/login`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       }
//     );
//     const json = await response.json();

//     if (!response.ok) {
//       setIsLoading(false);
//       setError(json.error);
//     }
//     if (response.ok) {
//       // save user to local storage
//       localStorage.setItem("user", JSON.stringify(json));

//       // update auth context
//       dispatch({ type: "LOGIN", payload: json });

//       setIsLoading(false);
//       return true;
//     }
//   };
//   return { login, isLoading, error };
// };
