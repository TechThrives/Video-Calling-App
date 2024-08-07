import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
      <div className="hero">
        <section className="hero-container">
          <h1 className="hero-title-primary">Video Fusion</h1>
          <h6 className="hero-title-sub">
            A Fully Functional Video Meeting App Built with ReactJS and WebRTC
          </h6>

          <button className="btn" onClick={() => navigate("/login")}>Try For Free</button>
        </section>
        
          <img
            src="https://niceillustrations.com/wp-content/uploads/2020/09/Video-call.png"
            alt="hero"
            className="hero-image"
          />
      </div>
  );
};

export default Home;
