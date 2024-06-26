import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [meeting, setMeeting] = useState("");

  return (
    <>
      <h1>Login</h1>
      <p>John - 667ad717c58ae5fbe2ab30ba</p>
      <br></br>
      <p>Nick - 667ad736d405c93a46252b42</p>
      <input
        type="text"
        placeholder="Enter UsernameId"
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={() => localStorage.setItem("username", username)}>
        Login
      </button>

      <br />
      <button onClick={() => navigate(`/chat/create-meeting`)}>
        Create Meeting
      </button>

      <br />
      <input
        type="text"
        placeholder="Enter meetingId"
        onChange={(e) => setMeeting(e.target.value)}
      />
      <button onClick={() => navigate(`/chat/chatroom/${meeting}`)}>
        Join Meeting
      </button>
    </>
  );
};

export default Login;
