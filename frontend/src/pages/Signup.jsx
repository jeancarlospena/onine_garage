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

  const phoneNumberHandler = (inputValue) => {
    if (
      (inputValue.length === 3 || inputValue.length === 7) &&
      inputValue.length > phoneNumber.length
    ) {
      setPhoneNumber(inputValue + "-");
    } else {
      setPhoneNumber(inputValue);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="title">Create Account</h1>
      <label>Email</label>
      <input
        className="input-box"
        maxLength="50"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <label>Password</label>
      <input
        className="input-box"
        maxLength="30"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        autoComplete="on"
      />

      <label>First Name</label>
      <input
        className="input-box"
        maxLength="30"
        type="text"
        onChange={(e) => setFirstName(e.target.value)}
        value={firstName}
      />

      <label>Last Name</label>
      <input
        className="input-box"
        maxLength="30"
        type="text"
        onChange={(e) => setLastName(e.target.value)}
        value={lastName}
      />

      <label>Phone</label>
      <input
        className="input-box"
        type="tel"
        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
        maxLength="12"
        onChange={(e) => phoneNumberHandler(e.target.value)}
        value={phoneNumber}
      ></input>

      <button className="form-button" disabled={isLoading}>
        Register
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Signup;
