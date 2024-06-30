import React from "react";

const Participants = () => {
  return (
    <>
      <div className="participants">
        <div className="participant profile-picture">
          <img
            src="https://images.unsplash.com/photo-1576110397661-64a019d88a98?ixlib=rb-1.2.1&auto=format&fit=crop&w=1234&q=80"
            alt=""
          />
        </div>

        <div className="participant profile-picture">
          <img
            src="https://images.unsplash.com/photo-1566821582776-92b13ab46bb4?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
            alt=""
          />
        </div>

        <div className="participant profile-picture">
          <img
            src="https://images.unsplash.com/photo-1600207438283-a5de6d9df13e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1234&q=80"
            alt=""
          />
        </div>

        <div className="participant profile-picture">
          <img
            src="https://images.unsplash.com/photo-1581824283135-0666cf353f35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1276&q=80"
            alt=""
          />
        </div>
        <div className="participant-more">2+</div>
      </div>
    </>
  );
};

export default Participants;
