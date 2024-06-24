import React from "react";

export const ADD_PEER = "ADD_PEER";
export const REMOVE_PEER = "REMOVE_PEER";

// Initial state
const initialState = {};

export const addPeerAction = (peerId, stream) => ({
  type: ADD_PEER,
  payload: { peerId, stream },
});

export const removePeerAction = (peerId) => ({
  type: REMOVE_PEER,
  payload: { peerId },
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
    default:
      return state;
  }
};
