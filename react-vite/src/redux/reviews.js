import { csrfFetch } from "./csrf";

//actions
const LOAD_USER_REVIEWS = 'reviews/LOAD_USER_REVIEWS'
const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS'
const ADD_REVIEW = 'reviews/ADD_REVIEW'

//action creators
const getUserReviews = (userReviews) => ({
    type: LOAD_USER_REVIEWS,
    payload: userReviews
})
const loadReviews = (allReviews) => ({
    type: LOAD_REVIEWS,
    payload: allReviews
})
const addOneReview = (review) => ({
    type: ADD_REVIEW,
    payload: review
})

//thunk
export const getUserReviewsThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/reviews/users/current')
    console.log('response from thunk', response)

    if (response.ok) {
        const data = await response.json()
        dispatch(getUserReviews(data.Reviews))
        return data
    }
}
export const loadReviewsThunk = (userId) => async (dispatch) => {
    console.log('userId from thunk', userId)
    const response = await csrfFetch(`/api/reviews/users/${userId}`)

    if (response.ok) {
        const data = await response.json()

        dispatch(loadReviews(data.Reviews))
        return data
    }
}
export const addReview = (newReview) => async (dispatch) => {
    console.log('newReview from thunk', newReview)
    const {sellerId, review, stars} = newReview

    const response = await csrfFetch(`/api/reviews/users/${sellerId}`, {
        method: 'POST',
        body: JSON.stringify({review, stars})
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(addOneReview(data))
        dispatch(loadReviews(sellerId))
        return data
    }
}



const initialState = {
    currentUserReviews: {},
    reviews: {}
}

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_USER_REVIEWS:
            return {
                ...state,
                currentUserReviews: action.payload
            }
        case LOAD_REVIEWS:
            return {
                ...state,
                reviews: action.payload
            }
        default:
            return state
    }
}

export default reviewReducer
