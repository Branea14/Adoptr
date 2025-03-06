import { csrfFetch } from "./csrf";

// actions
const CREATING_MATCHES = 'match/CREATING_MATCHES'

// ACTION CREATOR
const creatingMatches = (match) => ({
    type: CREATING_MATCHES,
    payload: match
})


//Thunk
export const createMatch = (pet) => async dispatch => {
    const {petId, sellerId} = pet
    const response = await csrfFetch('/api/matches/', {
        method: 'POST',
        body: JSON.stringify({petId, sellerId})
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(creatingMatches(data))
        return data;
    }
}

const initialState = {
    approvedMatches: {},
    pendingMatches: {},
    rejectedMatches: {}
};

const matchReducer = (state= initialState, action) => {
    switch(action.type) {
        case CREATING_MATCHES: {
            const newMatch = action.payload;
            if (newMatch.status === 'APPROVED') {
                return {
                    ...state,
                    approvedMatches: {...state.approvedMatches, [newMatch.id]: newMatch},
                    pendingMatches: Object.fromEntries(
                        Object.entries(state.pendingMatches).filter((id) => id !== String(newMatch.id))
                    )
                }
            } else if (newMatch.status === 'REQUESTED') {
                return {
                    ...state,
                    pendingMatches: {...state.pendingMatches, [newMatch.id]: newMatch}
                }
            } else if (newMatch.status === 'REJECTED') {
                return {
                    ...state,
                    rejectedMatches: {...state.rejectedMatches, [newMatch.id]: newMatch},
                    pendingMatches: Object.fromEntries(
                        Object.entries(state.pendingMatches).filter((id) => id !== String(newMatch.id))
                    )
                }
            }
            return state;
        }
        default:
            return state;
    }
}

export default matchReducer;
