import React from "react";

export const ADD_PEER = "ADD_PEER";
export const REMOVE_PEER = "REMOVE_PEER";
export const VIDEO_TOGGLE = "VIDEO_TOGGLE";
export const AUDIO_TOGGLE = "AUDIO_TOGGLE";

// Initial state
export const initialState = {};

export const addPeerAction = (peer, peerStream, audio, video) => ({
  type: ADD_PEER,
  payload: { peer, peerStream, audio, video },
});

export const removePeerAction = (peer) => ({
  type: REMOVE_PEER,
  payload: { peer },
});

export const videoToggleAction = (peerId, video) => ({
  type: VIDEO_TOGGLE,
  payload: { peerId, video },
});

export const audioToggleAction = (peerId, audio) => ({
  type: AUDIO_TOGGLE,
  payload: { peerId, audio },
});

export const peerReducer = (state, action) => {
  switch (action.type) {
    case ADD_PEER:
      // Add the new peer to the state
      const videoT = action.payload.peerStream.getVideoTracks();
      const audioT = action.payload.peerStream.getAudioTracks();

      if (videoT.length > 0) {
        videoT[0].enabled = action.payload.video;
      }

      if (audioT.length > 0) {
        audioT[0].enabled = action.payload.audio;
      }
      return {
        ...state,
        [action.payload.peer._id]: {
          peerStream: action.payload.peerStream,
          user: action.payload.peer,
        },
      };
    case REMOVE_PEER:
      // Create a new state object without the peer to be removed
      const { [action.payload.peer._id]: _, ...newState } = state;
      return newState;
    case "VIDEO_TOGGLE":
      const videoPeerState = { ...state[action.payload.peerId] };
      const videoTracks = videoPeerState.peerStream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = action.payload.video;
      }
      return {
        ...state,
        [action.payload.peerId]: {
          ...videoPeerState,
          peerStream: videoPeerState.peerStream, // Ensure the stream is updated
        },
      };

    case "AUDIO_TOGGLE":
      const audioPeerState = { ...state[action.payload.peerId] };
      const audioTracks = audioPeerState.peerStream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = action.payload.audio;
      }
      return {
        ...state,
        [action.payload.peerId]: {
          ...audioPeerState,
          peerStream: audioPeerState.peerStream, // Ensure the stream is updated
        },
      };
    default:
      return state;
  }
};
