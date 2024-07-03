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
      <div className="video-user">
        <video ref={videoRef} autoPlay />
      </div>
    </div>
  );
};

export default VideoUser;
