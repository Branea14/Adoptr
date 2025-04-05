import { csrfFetch } from "./csrf";

//actions
const GET_ALL_CHAT = 'chat/GET_ALL_CHAT'
const GET_CHAT_HISTORY = 'chat/GET_CHAT_HISTORY'
const DELETE_CHAT = 'chat/DELETE_CHAT'
const MARK_AS_READ = 'chat/MARK_AS_READ'

// action creators
const getAllChat = (chats) => ({
    type: GET_ALL_CHAT,
    payload: chats
})
const getChatHistory = (chat) => ({
    type: GET_CHAT_HISTORY,
    payload: chat
})
const deleteChat = (chatId) => ({
    type: DELETE_CHAT,
    payload: chatId
})
const markAsRead = (message) => ({
    type: MARK_AS_READ,
    payload: message
})

// thunk
export const getAllChatThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/chat/conversations')

    if (response.ok) {
        const data = await response.json()
        dispatch(getAllChat(data))
        return data
    }
}
export const getChatHistoryThunk = (chatHistory) => async (dispatch) => {
    const { receiverId, petId} = chatHistory

    const response = await csrfFetch(`/api/chat/${receiverId}?petId=${petId}`)

    if (response.ok) {
        const data = await response.json()
        dispatch(getChatHistory(data))
        return data
    }
}
export const deleteChatThunk = (receiverId, petId = null) => async (dispatch) => {
    const url = petId
        ? `/api/chat/${receiverId}?petId=${petId}`
        : `/api/chat/${receiverId}`

    const response = await csrfFetch(url, {
        method: 'DELETE'
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(deleteChat(data))
    }
}
export const markAsReadThunk = (messageData) => async (dispatch) => {
    const { senderId } = messageData
    const response = await csrfFetch(`/api/chat/${senderId}`, {method: "PATCH"})

    if (response.ok) {
        const data = await response.json()
        dispatch(markAsRead(data))
        return data
    }
}


const initialState = {
    allConversations: {},
    chatHistory: {}
}

const chatHistoryReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_ALL_CHAT: {
            return { ...state, allConversations: {...action.payload} }
        }
        case GET_CHAT_HISTORY: {
            return { ...state, chatHistory: {...action.payload} }
        }
        default:
            return state;
    }
}

export default chatHistoryReducer;
