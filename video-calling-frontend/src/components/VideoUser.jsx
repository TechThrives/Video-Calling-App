import React, { useEffect, useRef } from "react";

const VideoUser = ({ stream, userData }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
    }
  }, [stream]);

  return (
    <div className="user-div">
      <div className="user-video">
        <video ref={videoRef} autoPlay />
        <img
          src={`data:image/png;base64,${userData && userData.profileImg}`}
          className={`${
            stream && stream.getVideoTracks()[0].enabled ? "" : "show"
          }`}
        />
      </div>
    </div>
  );
};

export default VideoUser;
