import { csrfFetch } from "./csrf";

// actions
const CREATING_MATCH = 'matches/CREATING_MATCH'
const GET_APPROVED_MATCH = 'matches/GET_APPROVED_MATCH'
const GET_REQUESTED_MATCH = 'matches/GET_REQUESTED_MATCH'
const GET_REJECTED_MATCH = 'matches/GET_REJECTED_MATCH'
const UPDATE_MATCH = 'matches/UPDATE_MATCH'
const DELETE_MATCH = 'matches/DELETE_MATCH'
const RESET_MATCH = 'matches/RESET_MATCH'

// ACTION CREATOR
const creatingMatches = (match) => ({
    type: CREATING_MATCH,
    payload: match
})
const approvedMatchAction = (matches) => ({
    type: GET_APPROVED_MATCH,
    payload: matches
})
const requestedMatchAction = (matches) => ({
    type: GET_REQUESTED_MATCH,
    payload: matches
})
const updatedMatchAction = (match) => ({
    type: UPDATE_MATCH,
    payload: match
})
const deleteMatchAction = (matchId) => ({
    type: DELETE_MATCH,
    payload: {id: matchId}
})
const rejectedMatchAction = (matches) => ({
    type: GET_REJECTED_MATCH,
    payload: matches
})
export const resetMatches = () => ({
    type: RESET_MATCH
})


//Thunk
export const createMatch = (pet, status = "REQUESTED") => async (dispatch) => {
    if (!status) status = 'REQUESTED'


    console.log('looooooooooooooooooooook', pet)
    // const {id, sellerId, status} = pet
    const response = await csrfFetch('/api/matches/', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({status, userId2: pet.sellerId, petId: pet.id})
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(creatingMatches(data.Match))
        return data;
    } else {
        const errorResponse = await response.json()
        console.error("failed to create match", errorResponse)
        return errorResponse
    }
}
export const approvedMatches = () => async (dispatch) => {
    const response = await csrfFetch('/api/matches/approved')

    if (response.ok) {
        const data = await response.json()
        // console.log('look here', data)
        const normalizedMatches = data.Matches?.reduce((acc, match) => {
            acc[match.petId] = match;
            return acc;
        }, {})
        console.log('Normalized approved matches:', normalizedMatches); // Verify the data structure

        dispatch(approvedMatchAction(normalizedMatches))
        return data
    }
}
export const requestedMatches = () => async (dispatch) => {
    const response = await csrfFetch('/api/matches/requested')

    if (response.ok) {
        const data = await response.json()
        const normalizedMatches = data.Matches?.reduce((acc, match) => {
            acc[match.petId] = match;
            return acc;
        }, {})
        dispatch(requestedMatchAction(normalizedMatches))
        return data
    }
}
export const updatedMatch = (matchData) => async (dispatch) => {
    const response = await csrfFetch(`/api/matches/${matchData.id}`, {
        method: "PATCH",
        body: JSON.stringify({status: matchData.status})
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(updatedMatchAction(data))
        return data
    }
}
export const deleteMatch = (matchId) => async (dispatch) => {
    const response = await csrfFetch(`/api/matches/${matchId}`, {
        method: 'DELETE'
    })

    if (response.ok) {
        dispatch(deleteMatchAction(matchId))
        return true
    }
    return false
}
export const rejectedMatches = () => async (dispatch) => {
    const response = await csrfFetch('/api/matches/rejected')

    if (response.ok) {
        const data = await response.json()
        const normalizedMatches = data.Matches?.reduce((acc, match) => {
            acc[match.petId] = match
            return acc
        }, {})
        dispatch(rejectedMatchAction(normalizedMatches))
        return data
    }
}

const initialState = {
    approvedMatches: {},
    requestedMatches: {},
    rejectedMatches: {}
};

const matchReducer = (state= initialState, action) => {
    switch(action.type) {
        case RESET_MATCH: {
            return {
                approvedMatches: {},
                requestedMatches: {},
                rejectedMatches: {}
            }
        }
        case GET_APPROVED_MATCH: {
            return { ...state, approvedMatches: {...action.payload}}
        }

        case GET_REQUESTED_MATCH: {
            return { ...state, requestedMatches: {...action.payload}}
        }

        case GET_REJECTED_MATCH: {
            return { ...state, rejectedMatches: {...action.payload}}
        }

        case CREATING_MATCH: {
            const newMatch = action.payload;
            if (newMatch.status === 'APPROVED') {
                return {
                    ...state,
                    approvedMatches: {...state.approvedMatches, [newMatch.id]: newMatch},
                    requestedMatches: Object.fromEntries(
                        Object.entries(state.requestedMatches).filter(([id]) => id !== String(newMatch.id))
                    )
                }
            } else if (newMatch.status === 'REQUESTED') {
                return {
                    ...state,
                    requestedMatches: {...state.requestedMatches, [newMatch.id]: newMatch}
                }
            } else if (newMatch.status === 'REJECTED') {
                return {
                    ...state,
                    rejectedMatches: {...state.rejectedMatches, [newMatch.id]: newMatch},
                    // requestedMatches: Object.fromEntries(
                    //     Object.entries(state.requestedMatches).filter((id) => id !== String(newMatch.id))
                    // )
                }
            }
            return state;
        }

        case UPDATE_MATCH: {
            console.log('Received UPDATE_MATCH action:', action.payload); // Log the payload to verify

            const updatedMatch = action.payload
            const {id, status} = updatedMatch

            const newState = {...state}
            if (state.requestedMatches[id]) delete newState.requestedMatches[id]
            if (state.approvedMatches[id]) delete newState.approvedMatches[id]
            if (state.rejectedMatches[id]) delete newState.rejectedMatches[id]

            if (status === 'APPROVED') {
                newState.approvedMatches[id] = updatedMatch
            } else if (status === 'REJECTED') {
                newState.rejectedMatches[id] = updatedMatch
            }
            console.log('Updated state after applying UPDATE_MATCH:', newState); // Log updated state

            return newState
        }

        case DELETE_MATCH: {
            const { id } = action.payload

            const newState = {...state}
            if (state.requestedMatches[id]) delete newState.requestedMatches[id]
            if (state.approvedMatches[id]) delete newState.approvedMatches[id]
            if (state.rejectedMatches[id]) delete newState.rejectedMatches[id]

            return newState
        }
        default:
            return state;
    }
}

export default matchReducer;
