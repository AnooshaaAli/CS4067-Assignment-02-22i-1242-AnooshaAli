import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"; // Import custom CSS

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Get the access token
      const response = await axios.post("http://127.0.0.1:8000/token", 
        new URLSearchParams({
          username: email, // FastAPI uses "username" instead of "email"
          password,
        }), 
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
  
      const token = response.data.access_token;
      localStorage.setItem("token", token);
  
      // Step 2: Fetch user details to get user_id
      const userResponse = await axios.get("http://127.0.0.1:8000/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const userId = userResponse.data.id; // Adjust based on API response
      localStorage.setItem("user_id", userId);
  
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };  

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <p className="mt-3">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );  
  }

export default LoginPage;
