import React, { useEffect, useRef } from "react";

const VideoParticipant = ({ data }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current && data.peerStream) {
      videoRef.current.srcObject = data.peerStream;
      // videoRef.current.muted = !data.peerStream.getAudioTracks()[0].enabled;
    }
  }, [data.peerStream]);

  return (
    <div className="video-participant">
      <div className="participant-action">
        <button
          className={`${
            data.peerStream.getAudioTracks()[0].enabled
              ? "btn-unmute"
              : "btn-mute"
          }`}
        ></button>
        <button
          className={`${
            data.peerStream.getVideoTracks()[0].enabled
              ? "btn-camera-on"
              : "btn-camera-off"
          }`}
        ></button>
      </div>
      <p className="name-tag">{data.user.name}</p>
      <video ref={videoRef} autoPlay />
      <img
        src={`data:image/png;base64,${data.user.profileImg}`}
        className={`${
          data.peerStream.getVideoTracks()[0].enabled ? "" : "show"
        }`}
      />
    </div>
  );
};

export default VideoParticipant;
