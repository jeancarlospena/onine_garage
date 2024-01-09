import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

import { useNavigate } from "react-router-dom";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const navigate = useNavigate();

  const signup = async (email, password, firstName, lastName, phoneNumber) => {
    setIsLoading(true);
    setError(null);
    const response = await fetch(`/api/user/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
      }),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      // save user to local storage
      localStorage.setItem("user", JSON.stringify(json));

      // update auth context
      dispatch({ type: "LOGIN", payload: json });

      setIsLoading(false);

      navigate("/");
    }
  };
  return { signup, isLoading, error };
};
