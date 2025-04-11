import { csrfFetch } from "./csrf";

//actions
const LOAD_USER_REVIEWS = 'reviews/LOAD_USER_REVIEWS'
const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS'
const ADD_REVIEW = 'reviews/ADD_REVIEW'
const DELETE_REVIEW = 'reviews/DELETE_REVIEW'
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW'
const LEAVE_REVIEW = 'reviews/LEAVE_REVIEW'
const REMOVE_REVIEWABLE_PETS = 'reviews/removeReviewablePets'

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
const deleteReview = (reviewId) => ({
    type: DELETE_REVIEW,
    payload: reviewId
})
const updateReview = (review) => ({
    type: UPDATE_REVIEW,
    payload: review
})
const leaveReview = (reviews) => ({
    type: LEAVE_REVIEW,
    payload: reviews
})
export const removeReviewablePets = (petId) => ({
    type: REMOVE_REVIEWABLE_PETS,
    payload: petId
})

//thunk
export const getUserReviewsThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/reviews/users/current')
    // console.log('response from thunk', response)

    if (response.ok) {
        const data = await response.json()

        const normalizedReviews = data.Reviews?.reduce((acc, review) => {
            acc[review.id] = review;
            return acc;
        }, {})
        dispatch(getUserReviews(normalizedReviews))
        return data
    }
}
export const loadReviewsThunk = (userId) => async (dispatch) => {
    // console.log('userId from thunk', userId)
    const response = await csrfFetch(`/api/reviews/users/${userId}`)

    if (response.ok) {
        const data = await response.json()

        const normalizedReviews = data.Reviews?.reduce((acc, review) => {
            acc[review.id] = review;
            return acc;
        }, {})
        dispatch(loadReviews(normalizedReviews))
        return data
    }
}
export const addReview = (newReview) => async (dispatch) => {
    // console.log('newReview from thunk', newReview)
    const {sellerId, review, stars, petId} = newReview

    const response = await csrfFetch(`/api/reviews/users/${sellerId}`, {
        method: 'POST',
        body: JSON.stringify({review, stars, petId})
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(addOneReview(data))
        dispatch(loadReviews(sellerId))
        return data
    }
}
export const deleteReviewThunk = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })

    if (response.ok) {
        dispatch(deleteReview(reviewId))
    } else {
        const errorResponse = await response.json()
        console.error('failed to create match', errorResponse)
        return errorResponse
    }
}
export const updateReviewThunk = (reviewData) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewData.id}`, {
        method: "PUT",
        body: JSON.stringify({
            "review": reviewData.review,
            "stars": reviewData.stars
        })
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(updateReview(data))
        return data
    }
}
export const leaveReviewThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/reviews/pets')

    if (response.ok) {
        const data = await response.json()
        dispatch(leaveReview(data))
        return data
    }
}


const initialState = {
    currentUserReviews: {},
    reviews: {},
    reviewablePets: {},
    userReview: null
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
        case LEAVE_REVIEW:
            return {
                ...state,
                reviewablePets: action.payload
            }
        case DELETE_REVIEW: {
            const {reviewId} = action

            const updatedReviews = { ...state.reviews }
            const updatedCurrentUserReviews = { ...state.currentUserReviews }

            delete updatedReviews[reviewId]
            delete updatedCurrentUserReviews[reviewId]
            return {
                ...state,
                reviews: updatedReviews,
                currentUserReviews: updatedCurrentUserReviews
            }}
        case UPDATE_REVIEW: {
            const updatedReview = action.payload.review || action.payload
            if (!updatedReview?.id) return state;

            return {
                ...state,
                reviews: {
                    ...state.reviews,
                    [updatedReview.id]: updatedReview
                },
                currentUserReviews: {
                    ...state.currentUserReviews,
                    [updatedReview.id]: updatedReview
                }
            }
        }
        case REMOVE_REVIEWABLE_PETS:
            const updatedPets = state.reviewablePets.reviewlessPets?.filter(
                (pet) => pet.id !== action.payload
            ) || [];

            return {
                ...state,
                reviewablePets: {
                    ...state.reviewablePets,
                    reviewlessPets: updatedPets
                }
            }
        default:
            return state
    }
}

export default reviewReducer
