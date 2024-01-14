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
    <form onSubmit={handleSubmit}>
      <input
        className="input-box"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="email"
      />
      <input
        className="input-box"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        autoComplete="on"
        placeholder="password"
      />
      <button className="form-button" disabled={isLoading}>
        Login
      </button>
      {error && <div>{error}</div>}
    </form>
  );
};

export default Login;
