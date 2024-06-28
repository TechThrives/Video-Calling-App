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
        {/* <img
        ref={videoRef}
        src="https://images.unsplash.com/photo-1566821582776-92b13ab46bb4?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
        alt="participant"
      /> */}
      </div>
    </div>
  );
};

export default VideoUser;
