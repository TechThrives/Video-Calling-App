import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [meeting, setMeeting] = useState("");

  return (
    <>
      <h1>Login</h1>
      <p>John - 667d56f341d20994ab75ca59</p>
      <br></br>
      <p>Nick - 667d56ca41d20994ab75ca58</p>
      <input
        type="text"
        placeholder="Enter UsernameId"
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={() => localStorage.setItem("username", username)}>
        Login
      </button>

      <br />
      <button onClick={() => navigate(`/meetingroom/:dfdfdfdf`)}>
        Create Meeting
      </button>

      <br />
      <input
        type="text"
        placeholder="Enter meetingId"
        onChange={(e) => setMeeting(e.target.value)}
      />
      <button onClick={() => navigate(`/meetingroom/${meeting}`)}>
        Join Meeting
      </button>
    </>
  );
};

export default Login;
