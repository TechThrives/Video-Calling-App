import React, { useState, useEffect } from "react";
import fetchService from "../services/fetchService";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userUpdate, setUserUpdate] = useState({
    name: "",
    email: "",
    profileImg: null,
  });

  const [imageSrc, setImageSrc] = useState(
    "https://images.unsplash.com/photo-1620163280053-68782bd98475"
  );

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserUpdate({ ...userUpdate, [e.target.name]: e.target.value });
  };

  const handleImgChange = (e) => {
    if (e.target.files.length) {
      setUserUpdate({ ...userUpdate, profileImg: e.target.files[0] });
      const src = URL.createObjectURL(e.target.files[0]);
      setImageSrc(src);
    }
  };

  const fetchProfile = async () => {
    const url = "/api/user";
    const options = {
      method: "GET",
      credentials: "include",
    };
    const response = await fetchService(url, options);

    if (response != null) {
      setImageSrc(`data:image/png;base64,${response.profileImg}`);

      setUserUpdate({
        name: response.name,
        email: response.email,
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const url = "/api/user/update";
    const formData = new FormData();
    formData.append("name", userUpdate.name);
    if (userUpdate.profileImg) {
      formData.append("profileImg", userUpdate.profileImg);
    }

    const options = {
      method: "POST",
      body: formData,
      credentials: "include",
    };

    await fetchService(url, options);
  };

  return (
    <>
      <div className="app-main">
        <div className="sign-up">
          <h2>Profile</h2>

          <label className="img-label" htmlFor="img-input">
            <input
              className="img-input"
              id="img-input"
              name="profileImg"
              type="file"
              accept="image/*"
              onChange={handleImgChange}
            />
            <img className="img-preview" src={imageSrc} alt="Profile Preview" />
          </label>
          <div className="input-group">
            <input
              type="text"
              onChange={handleChange}
              name="name"
              value={userUpdate.name}
              required
            />
            <label htmlFor="">Name</label>
          </div>
          <div className="input-group">
            <input type="text" name="email" value={userUpdate.email} disabled />
            <label htmlFor="">Email</label>
          </div>

          <button type="submit" onClick={handleUpdate} className="btn">
            Update Profile
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
