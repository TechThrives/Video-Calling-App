import React from "react";

export const ADD_PEER = "ADD_PEER";
export const REMOVE_PEER = "REMOVE_PEER";
export const VIDEO_TOGGLE = "VIDEO_TOGGLE";
export const AUDIO_TOGGLE = "AUDIO_TOGGLE";

// Initial state
export const initialState = {};

export const addPeerAction = (peerId, stream) => ({
  type: ADD_PEER,
  payload: { peerId, stream },
});

export const removePeerAction = (peerId) => ({
  type: REMOVE_PEER,
  payload: { peerId },
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
      return {
        ...state,
        [action.payload.peerId]: {
          stream: action.payload.stream,
        },
      };
    case REMOVE_PEER:
      // Create a new state object without the peer to be removed
      const { [action.payload.peerId]: _, ...newState } = state;
      return newState;
    case "VIDEO_TOGGLE":
      const videoPeerState = { ...state[action.payload.peerId] };
      const videoTracks = videoPeerState.stream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = action.payload.video;
      }
      return {
        ...state,
        [action.payload.peerId]: {
          ...videoPeerState,
          stream: videoPeerState.stream, // Ensure the stream is updated
        },
      };

    case "AUDIO_TOGGLE":
      const audioPeerState = { ...state[action.payload.peerId] };
      const audioTracks = audioPeerState.stream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = action.payload.audio;
      }
      return {
        ...state,
        [action.payload.peerId]: {
          ...audioPeerState,
          stream: audioPeerState.stream, // Ensure the stream is updated
        },
      };
    default:
      return state;
  }
};
