import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = () => {
  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserLogin({ ...userLogin, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    try {
      fetch(`${process.env.REACT_APP_SERVER}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userLogin),
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          console.log(Cookies.get("userId"));
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div class="app-main">
        <div class="sign-in">
          <h2>Login</h2>
          <div class="input-group">
            <input
              type="text"
              onChange={handleChange}
              name="email"
              value={userLogin.email}
              required
            />
            <label for="">Email</label>
          </div>
          <div class="input-group">
            <input
              type="password"
              onChange={handleChange}
              name="password"
              value={userLogin.password}
              required
            />
            <label for="">Password</label>
          </div>
          <div class="forgot-pass">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" onClick={handleLogin} class="btn">
            Login
          </button>

          <div class="sign-link">
            <p>
              Don't have an account?{" "}
              <a href="/register" class="signUp-link">
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
