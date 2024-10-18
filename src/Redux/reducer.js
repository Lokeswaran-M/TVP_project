import { SET_USER, LOGOUT_USER } from './action';

const initialState = {
  userId: null,
  rollId: null,
  Address: null,
  BusinessName: null,
  CategoryId: null,
  Description: null,
  Id: null,
  LocationID: null,
  Mobileno: null,
  chapterType: null,
  profession: null,
  username: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        ...action.payload, // Spread the user payload to set the state
      };
    case LOGOUT_USER: // Handle logout
      return initialState; // Reset to initial state
    default:
      return state;
  }
};

export default userReducer;