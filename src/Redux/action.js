export const SET_USER = 'SET_USER';
export const LOGOUT_USER = 'LOGOUT_USER'; // New action type

export const setUser = (user) => {
  console.log('Setting user:------------------', user); // Log the user object
  return {
    type: SET_USER,
    payload: user, // Pass the entire user object
  };
};

export const logoutUser = () => {
  return {
    type: LOGOUT_USER, // Dispatch the logout action
  };
};



