import { csrfFetch } from "./csrf";

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const EDIT_USER = 'session/editUser'
const UPDATE_USER_DOG_PREFERENCES = 'session/updateDogPreferences'

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});
const removeUser = () => ({
  type: REMOVE_USER
});
const editUser = (user) => ({
  type: EDIT_USER,
  payload: user
})
const updateDogPreferences = (dogPreferences) => ({
  type: UPDATE_USER_DOG_PREFERENCES,
  payload: dogPreferences
})

export const thunkAuthenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/");
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};
export const thunkLogin = (credentials) => async dispatch => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkSignup = (user) => async (dispatch) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
    credentials: "include"
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));

    if (user.dogPreferences) {
      dispatch(thunkSaveDogPreferences(data.id, user.dogPreferences))
    }
    return null;
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/logout");
  dispatch(removeUser());
  dispatch(updateDogPreferences(null))
};
export const editUserThunk = (user) => async (dispatch) => {
  const response = await csrfFetch(`/api/users/${user.id}`, {
    method: "PUT",
    body: JSON.stringify(user)
  })

  if (response.ok) {
    const data = await response.json()
    dispatch(editUser(data))

    if (user.dogPreferences) {
      dispatch(thunkUpdateDogPreferences(data.id, user.dogPreferences))
    }
    return null
  } else if (response.status < 500) {
    const errorMessages = await response.json()
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again."}
  }
}

export const thunkUpdateDogPreferences = (dogPreferences) => async (dispatch) => {
  const response = await fetch('/api/dog-preferences', {
    method: 'PUT',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(dogPreferences)
  })

  if (response.ok) {
    const data = await response.json()
    dispatch(updateDogPreferences(data))
    return data
  } else if (response.status < 500) {
    return await response.json()
  } else {
    return { server: "Something went wrong. Please try again"}
  }
}

export const thunkSaveDogPreferences = (userId, dogPreferences) => async (dispatch) => {
  try {
    const response = await fetch(`/api/dog-preferences/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...dogPreferences }),
      credentials: "include"
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Dog preferences saved:", data);

      // Dispatch action to update Redux state
      dispatch(updateDogPreferences(data));
    } else {
        const errorMessages = await response.json()
        return errorMessages    }
  } catch (error) {
    console.error("Error saving dog preferences:", error);
    return { server: "Something went wrong. Please try again"}
  }
};


const initialState = { user: null };

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    case EDIT_USER:
      return { ...state, user: {...state.user, ...action.payload}}
    case UPDATE_USER_DOG_PREFERENCES:
      return {
        ...state,
        user: state.user
          ? {...state.user, dogPreferences: action.payload }
          : null,

      }
    default:
      return state;
  }
}

export default sessionReducer;
