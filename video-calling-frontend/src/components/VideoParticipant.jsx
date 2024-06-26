import React, { useEffect, useRef } from "react";

const VideoParticipant = ({ stream, name }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = stream.getAudioTracks()[0].enabled;
    }
  }, [stream]);

  return (
    <div className="video-participant">
      <div className="participant-action">
        <button className="btn-mute"></button>
        <button className="btn-camera"></button>
      </div>
      <p className="name-tag">{name}</p>
      <video ref={videoRef} autoPlay />
      {/* <img
        ref={videoRef}
        src="https://images.unsplash.com/photo-1566821582776-92b13ab46bb4?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
        alt="participant"
      /> */}
    </div>
  );
};

export default VideoParticipant;
