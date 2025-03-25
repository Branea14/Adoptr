import { csrfFetch } from "./csrf";

//actions
const GET_PET_DETAILS = 'pet/GET_PET_DETAILS'
const GET_VIEWED_PET_DETAILS = 'pet/GET_VIEWED_PET_DETAILS'
const GET_ALL_PETS = 'pets/GET_ALL_PETS'
const CREATE_PET = 'pets/CREATE_PET'
const UPDATE_PET = 'pets/UPDATE_PET'
const DELETE_PET = 'pets/DELETE_PET'

// action creators
const getPetDetails = (pet) => ({
    type: GET_PET_DETAILS,
    payload: pet
})
const getViewedPetDetails = (pet) => ({
    type: GET_VIEWED_PET_DETAILS,
    payload: pet
})
const getAllPets = (pets) => ({
    type: GET_ALL_PETS,
    payload: pets
})
const createPetAction = (pet) => ({
    type: CREATE_PET,
    payload: pet
})
const updatePetAction = (updatedPet) => ({
    type: UPDATE_PET,
    payload: updatedPet
})
const deletePetAction = (petId) => ({
    type: DELETE_PET,
    payload: petId
})

// thunk
export const getDetails = () => async (dispatch) => {
    const response = await csrfFetch('/api/pets/swipe')

    if (response.ok) {
        const data = await response.json()
        dispatch(getPetDetails(data))
        localStorage.setItem('currentPet', JSON.stringify(data)) // caches currentPet
        return data
    }
}
export const getViewedPetDetailsThunk = (petId) => async (dispatch) => {
    const response = await csrfFetch(`/api/pets/${petId}`)

    if (response.ok) {
        const data = await response.json()
        dispatch(getViewedPetDetails(data))
        return data
    }
}
export const getPets = () => async (dispatch) => {
    const response = await csrfFetch('/api/pets/by-current-user')

    if (response.ok) {
        const data = await response.json()
        const normalizedPets = data.Pets.reduce((acc, pet) => {
            acc[pet.id] = pet;
            return acc
        }, {})
        // console.log('look here', normalizedPets)
        dispatch(getAllPets(normalizedPets))
    }
}
export const createPet = (newPetData) => async (dispatch) => {
    const formattedImages = newPetData.images.map((img, index) => ({
        url: img.url,
        preview: index === 0
    }))

    const responseData = {...newPetData, images: formattedImages }
    try {
        const response = await csrfFetch('/api/pets/', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            // credentials: "include",
            body: JSON.stringify(responseData)
        })

        if (response.ok) {
            const data = await response.json()
            // console.log('look here', data)
            dispatch(createPetAction(data.pet))
            return data.pet
        } else {
            const errorData = await response.json()
            console.error('error resposne', errorData)
        }

    } catch (error) {
        console.error('fetch error', error)
    }
}
export const updatePet = (updatedPetData) => async (dispatch) => {
    console.log('updatedPetData', updatedPetData)
    // console.log(petId)
    const formattedImages = updatedPetData.images.map((img, index) => ({
        url: img.url,
        preview: index === 0
    }))

    const responseData = {
        ...updatedPetData,
        images: formattedImages,
        // otherPets: Array.isArray(updatedPetData.otherPets)
        //     ? updatedPetData.otherPets
        //     : updatedPetData.otherPets ? [updatedPetData.otherPets] : []
    }

    console.log('responseData', responseData)
    try {
        const response = await csrfFetch(`/api/pets/${updatedPetData.id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify(responseData)
        })

        if (response.ok) {
            const data = await response.json()
            console.log('look here', data)
            dispatch(updatePetAction(data))
            return data
        }
    } catch (error) {
        console.error('fetch error', error)
    }
}
export const deletePet = (petId) => async (dispatch) => {
    const response = await csrfFetch(`/api/pets/${petId}`, {
        method: 'DELETE'
    })

    if (response.ok) {
        dispatch(deletePetAction(petId))
    }
}


const initialState = {
    petDetails: {},
    viewedPetDetails: {},
    pets: {}
};

const petReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_ALL_PETS: {
            return { ...state, pets: {...action.payload} }
        }
        case GET_PET_DETAILS: {
            return { ...state, petDetails: action.payload }
        }
        case GET_VIEWED_PET_DETAILS: {
            return { ...state, viewedPetDetails: action.payload }
        }
        case CREATE_PET: {
            const newPet = { ...state.pets, [action.payload.id]: action.payload}
            return {
                ...state,
                pets: newPet,
                petDetails: action.payload
            }
        }
        case UPDATE_PET: {
            return {
                ...state,
                pets: {
                    ...state.pets,
                    [action.payload.id]: action.payload
                },
                petDetails: action.payload
            }
        }
        case DELETE_PET: {
            const remainingPets = {...state.pets};
            delete remainingPets[action.payload];
            return {
                ...state,
                pets: remainingPets,
                petDetails: state.petDetails.id === action.payload ? {} : state.petDetails
            }
        }
    default:
        return state;
    }
}

export default petReducer;
