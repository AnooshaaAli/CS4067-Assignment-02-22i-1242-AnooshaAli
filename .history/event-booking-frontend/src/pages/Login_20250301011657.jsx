import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/token", {
        username: email,
        password,
      }, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      localStorage.setItem("token", response.data.access_token);
      navigate("/events");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between">
            <div className="py-4">
              <a href="/" className="text-xl font-bold">Event Booking</a>
            </div>
            <div className="flex space-x-4">
              <a href="/login" className="py-4 px-2 font-medium text-white border-b-2 border-blue-500">Login</a>
              <a href="/register" className="py-4 px-2 font-medium text-gray-300 hover:text-white">Register</a>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="/forgot-password" className="text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
              >
                Sign in
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p>
              Don't have an account?{" "}
              <a href="/register" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;