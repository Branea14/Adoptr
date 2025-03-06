import { csrfFetch } from "./csrf";

//actions
const GET_PET_DETAILS = 'pet/GET_PET_DETAILS'

// action creators
const getPetDetails = (pet) => ({
    type: GET_PET_DETAILS,
    payload: pet
})

// thunk
export const getDetails = () => async (dispatch) => {
    const response = await csrfFetch('/api/pets/swipe')

    if (response.ok) {
        const data = await response.json()
        dispatch(getPetDetails(data))
        return data
    }
}


const initialState = {
    petDetails: {},
};

const petReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_PET_DETAILS: {
            return {
                ...state,
                petDetails: action.payload
            }
        }
    default:
        return state;
    }
}

export default petReducer;
