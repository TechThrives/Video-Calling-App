import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchService from "../services/fetchService";

const Welcome = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
  })

  const [imageSrc, setImageSrc] = useState(
    "https://images.unsplash.com/photo-1620163280053-68782bd98475"
  );
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const handleJoin = async () => {
    const url = `/api/room/${meetingCode}`;
    const options = {
      credentials: "include",
    };
    if (await fetchService(url, options)) {
      navigate(`/meeting/${meetingCode}`);
    }
  };
  const handleCreate = () => {
    navigate("/meeting");
  };

  const fetchProfile = async () => {
    const url = "/api/user";
    const options = {
      method: "GET",
      credentials: "include",
    };
    const response = await fetchService(url, options);

    if (response.profileImg) {
      setImageSrc(`data:image/png;base64,${response.profileImg}`);
    }

    setUser({
      name: response.name,
      email: response.email,
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <div class="profile-button" onClick={() => navigate("/profile")}>
        <img
          src={imageSrc}
          alt="avatar"
        />
      </div>
      <div class="meeting-page">
        <div class="meeting-left">
          <div class="meeting-content">
            <h2>Video meetings. Now free for everyone.</h2>
            <p>
              Join or start a video meeting with just a few clicks. No credit
              card required.
            </p>
            <div class="meeting-btn">
              <button class="btn" onClick={handleCreate}>
                New Meeting
              </button>
              <div className="join-div">
                <div class="join-meeting">
                  <div className="input-group">
                    <input
                      type="text"
                      name="code"
                      value={meetingCode}
                      onChange={(e) => setMeetingCode(e.target.value)}
                      required
                    />
                    <label htmlFor="">Join Code</label>
                  </div>
                </div>
                <button className="btn" onClick={handleJoin}>
                  Join Meeting
                </button>
              </div>
            </div>
          </div>
          <div class="help-text">
            <a href="#">Learn more</a> about Meet
          </div>
        </div>
        <div class="meeting-right">
          <div class="meeting-content">
            <img src="https://www.gstatic.com/meet/google_meet_marketing_ongoing_meeting_grid_427cbb32d746b1d0133b898b50115e96.jpg" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
