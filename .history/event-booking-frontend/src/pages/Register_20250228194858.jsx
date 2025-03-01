import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");  // Add name state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/register",
        { name, email, password },  // Include name
        { headers: { "Content-Type": "application/json" } }
      );
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Registration failed. Try another email.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      {message && <p className="text-success">{message}</p>}
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label>Name</label>
          <input 
            type="text" 
            className="form-control" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input 
            type="email" 
            className="form-control" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input 
            type="password" 
            className="form-control" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-success">Register</button>
      </form>
      <p className="mt-3">Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default RegisterPage;
