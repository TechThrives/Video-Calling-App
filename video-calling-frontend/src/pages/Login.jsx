import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchService from "../services/fetchService";

const Login = () => {
  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserLogin({ ...userLogin, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    const url = "/api/auth/login";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userLogin),
      credentials: "include",
    };
    if (await fetchService(url, options)) {
      navigate("/meeting/:roomId");
    }
  };

  return (
    <>
      <div className="app-main">
        <div className="sign-in">
          <h2>Login</h2>
          <div className="input-group">
            <input
              type="text"
              onChange={handleChange}
              name="email"
              value={userLogin.email}
              required
            />
            <label htmlFor="">Email</label>
          </div>
          <div className="input-group">
            <input
              type="password"
              onChange={handleChange}
              name="password"
              value={userLogin.password}
              required
            />
            <label htmlFor="">Password</label>
          </div>
          <div className="forgot-pass">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" onClick={handleLogin} className="btn">
            Login
          </button>
          <div className="sign-link">
            <p>
              Don't have an account?{" "}
              <a href="/register" className="signUp-link">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
