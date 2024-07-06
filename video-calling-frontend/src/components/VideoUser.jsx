import React, { useEffect, useRef } from "react";

const VideoUser = ({ stream, name }) => {
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
          src="https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg"
          className={`${
            stream && stream.getVideoTracks()[0].enabled ? "" : "show"
          }`}
        />
      </div>
    </div>
  );
};

export default VideoUser;
