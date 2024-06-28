import React, { useEffect, useRef } from "react";

const VideoParticipant = ({ stream, user }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = !stream.getAudioTracks()[0].enabled;
    }
  }, [stream]);

  return (
    <div className="video-participant">
      <div className="participant-action">
        <button
          className={`${
            stream.getAudioTracks()[0].enabled ? "btn-unmute" : "btn-mute"
          }`}
        ></button>
        <button
          className={`${
            stream.getVideoTracks()[0].enabled
              ? "btn-camera-on"
              : "btn-camera-off"
          }`}
        ></button>
      </div>
      <p className="name-tag">{user.name}</p>
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
