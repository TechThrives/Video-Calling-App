import React, { useEffect, useRef } from "react";

const VideoParticipant = ({ stream }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div class="video-participant">
      <div class="participant-action">
        <button class="btn-mute"></button>
        <button class="btn-camera"></button>
      </div>
      <p class="name-tag">Andy Will</p>
      <video ref={videoRef} muted={true} autoPlay />
      {/* <img
        ref={videoRef}
        src="https://images.unsplash.com/photo-1566821582776-92b13ab46bb4?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
        alt="participant"
      /> */}
    </div>
  );
};

export default VideoParticipant;
