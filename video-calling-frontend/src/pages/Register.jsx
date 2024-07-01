import React, { useState } from "react";

const Register = () => {
  const [userRegister, setUserRegister] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserRegister({ ...userRegister, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    try {
      fetch(`${process.env.REACT_APP_SERVER}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userRegister),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div class="app-main">
        <div class="sign-up">
          <h2>Sign Up</h2>
          <div class="input-group">
            <input
              type="text"
              onChange={handleChange}
              name="name"
              value={userRegister.name}
              required
            />
            <label for="">Name</label>
          </div>
          <div class="input-group">
            <input
              type="text"
              onChange={handleChange}
              name="email"
              value={userRegister.email}
              required
            />
            <label for="">Email</label>
          </div>
          <div class="input-group">
            <input
              type="password"
              onChange={handleChange}
              name="password"
              value={userRegister.password}
              required
            />
            <label for="">Password</label>
          </div>
          <button type="submit" onClick={handleRegister} class="btn">
            Sign Up
          </button>
          <div class="sign-link">
            <p>
              Already have an account?{" "}
              <a href="/login" class="signIn-link">
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
