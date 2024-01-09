import { useState } from "react";
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await signup(
      email,
      password,
      firstName,
      lastName,
      phoneNumber
    );
    if (response) {
      navigate("/");
    }
  };

  return (
    <form className="account-form" onSubmit={handleSubmit}>
      <h3>Create Account</h3>
      <label>Email: </label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <label>Password: </label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        autoComplete="on"
      />

      <label>First Name: </label>
      <input
        type="text"
        onChange={(e) => setFirstName(e.target.value)}
        value={firstName}
      />

      <label>Last Name: </label>
      <input
        type="text"
        onChange={(e) => setLastName(e.target.value)}
        value={lastName}
      />

      <label>Phone: </label>
      <label>Format: 999-999-9999 </label>
      <input
        type="tel"
        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
        onChange={(e) => setPhoneNumber(e.target.value)}
        value={phoneNumber}
      ></input>

      <button className="dropdown" disabled={isLoading}>
        Register
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Signup;
