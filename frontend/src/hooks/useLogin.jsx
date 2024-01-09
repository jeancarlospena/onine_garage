import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    // const response = await fetch(
    //   `${import.meta.env.VITE_BACKEND_API_URL}/api/user/login`,
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email, password }),
    //     // credentials: "same-origin",
    //   }
    // );

    const response = await axios({
      method: "post",
      url: `${import.meta.env.VITE_BACKEND_API_URL}/api/user/login`,
      withCredentials: true,
      data: { email, password },
    });

    // const json = await response.json();
    if (!response.status) {
      setIsLoading(false);
      setError(response.error);
    }
    if (response.status) {
      // save user to local storage
      // localStorage.setItem("user", JSON.stringify(json));

      // update auth context
      dispatch({ type: "LOGIN", payload: response.data });

      setIsLoading(false);
      return true;
    }
  };
  return { login, isLoading, error };
};
