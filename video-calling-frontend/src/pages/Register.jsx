import React, { useState } from "react";
import fetchService from "../services/fetchService";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const Register = () => {
  const { isAuthenticated } = useAuth();
  const [userRegister, setUserRegister] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserRegister({ ...userRegister, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    const url = "/api/auth/register";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userRegister),
    };

    if (await fetchService(url, options)) {
      navigate("/login");
    }
  };

  return isAuthenticated ? (
    <Navigate to="/meeting" />
  ) : (
    <>
      <div className="app-main">
        <div className="sign-up">
          <h2>Sign Up</h2>
          <div className="input-group">
            <input
              type="text"
              onChange={handleChange}
              name="name"
              value={userRegister.name}
              required
            />
            <label htmlFor="">Name</label>
          </div>
          <div className="input-group">
            <input
              type="text"
              onChange={handleChange}
              name="email"
              value={userRegister.email}
              required
            />
            <label htmlFor="">Email</label>
          </div>
          <div className="input-group">
            <input
              type="password"
              onChange={handleChange}
              name="password"
              value={userRegister.password}
              required
            />
            <label htmlFor="">Password</label>
          </div>
          <button type="submit" onClick={handleRegister} className="btn">
            Sign Up
          </button>
          <div className="sign-link">
            <p>
              Already have an account?{" "}
              <a href="/login" className="signIn-link">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
