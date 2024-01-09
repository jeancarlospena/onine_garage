import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login(email, password);

    if (response) {
      navigate("/");
    }
  };

  return (
    <form className="account-form" onSubmit={handleSubmit}>
      <h3>Login</h3>
      <label>Email:</label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        autoComplete="on"
      />
      <button className="submit-button" disabled={isLoading}>
        Login
      </button>
      {error && <div>{error}</div>}
    </form>
  );
};

export default Login;
