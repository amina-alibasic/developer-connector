import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

const initialState = [];
// Reducers take the previous state and action, and return the new state.
// Reducers specify how the state changes when an action is dispatched.

export default function alert(state = initialState, action) {
  switch (action.type) {
    case SET_ALERT:
      return [...state, action.payload]; // state is immutable, we have to include any other alert that's there and add another alert
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== action.payload);
    default:
      return state;
  }
}
