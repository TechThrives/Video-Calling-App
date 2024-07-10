import React from "react";

const Participants = ({ participants }) => {
  if (participants.length == 0) {
    return (
      <>
        <div className="participants">No Participants</div>
      </>
    );
  } else if (participants.length > 4) {
    return (
      <>
        <div className="participants">
          {participants.slice(0, 4).map((participant) => (
            <div className="participant">
              <img
                src={`data:image/png;base64,${participant.profileImg}`}
                alt="avatar"
              />
            </div>
          ))}
          <div className="participant-more">+{participants.length - 4}</div>
        </div>
        <div className="participant-names">
          {participants.slice(0, 4).map((participant, index) => (
            <>
              {participant.name}
              {index === participants.length - 1 ? "" : ", "}
            </>
          ))}{" "}
          in the meeting
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="participants">
          {participants.map((participant) => (
            <div className="participant">
              <img
                src={`data:image/png;base64,${participant.profileImg}`}
                alt="avatar"
              />
            </div>
          ))}
        </div>
        <div className="participant-names">
          {participants.map((participant, index) => (
            <>
              {participant.name}
              {index === participants.length - 1 ? "" : ", "}
            </>
          ))}{" "}
          in the meeting
        </div>
      </>
    );
  }
};

export default Participants;
