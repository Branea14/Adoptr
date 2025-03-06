import { csrfFetch } from "./csrf"

// action types
const GET_PREFERENCES = 'preferences/getPreferences'
const UPDATE_PREFERENCES = 'preferences/updatePreferences'
const CLEAR_PREFERENCES = 'preferences/clearPreferences'



// action creator
const loadPreferences = (dogPreferences) => ({
    type: GET_PREFERENCES,
    dogPreferences
})

const updatePreferences = (dogPreferences) => ({
    type: UPDATE_PREFERENCES,
    dogPreferences
})

const clearPreferences = (dogPreferences) => ({
    type: CLEAR_PREFERENCES,
    dogPreferences
})



// thunk
export const getDogPreferences = (userId) => async (dispatch) => {
    const response = await csrfFetch(`/api/dog-preferences/${userId}`)

    if (response.ok) {
        const data = await response.json()
        dispatch(loadPreferences(data))
        return data;
    }
}

export const updateDogPreferences = (userId) => async (dispatch) => {
    const response = await csrfFetch('/api/dog-preferences', {
        method: 'PUT',
        body: JSON.stringify(updatePreferences)
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(updateDogPreferences(data))
        return data
    }
}

// initial state
const initialState = {
    dogPreferences: null,
}

const dogPreferencesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PREFERENCES:
            return {...state, dogPreferences: action.dogPreferences}
        case UPDATE_PREFERENCES:
            return {...state, dogPreferences: action.dogPreferences}
        case CLEAR_PREFERENCES:
            return {...state, dogPreferences: null}
        default:
            return state;
    }
}

export default dogPreferencesReducer;
