import { csrfFetch } from "./csrf";

//actions
const GET_ALL_CHAT = 'chat/GET_ALL_CHAT'
const GET_CHAT_HISTORY = 'chat/GET_CHAT_HISTORY'
// const DELETE_CHAT = 'chat/DELETE_CHAT'
const MARK_AS_READ = 'chat/MARK_AS_READ'
const ADD_TO_CHAT = 'chat/ADD_TO_CHAT'
const DELETE_MESSAGE = 'chat/DELETE_MESSAGE'

// action creators
const getAllChat = (chats) => ({
    type: GET_ALL_CHAT,
    payload: chats
})
const getChatHistory = (chat) => ({
    type: GET_CHAT_HISTORY,
    payload: chat
})
// const deleteChat = (chatId) => ({
//     type: DELETE_CHAT,
//     payload: chatId
// })
export const markAsRead = (senderId, receiverId, petId) => ({
    type: MARK_AS_READ,
    payload: { senderId, receiverId, petId }
})
export const addToChat = (message) => ({
    type: ADD_TO_CHAT,
    payload: message
})
export const deleteMessage = (message) => ({
    type: DELETE_MESSAGE,
    payload: message
})

// thunk
export const getAllChatThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/chat/conversations')

    if (response.ok) {
        const data = await response.json()

        const normalizedChats = data.Chat_History.reduce((acc, conversation) => {
            acc[conversation.id] = conversation;
            return acc;
        }, {})
        console.log('look at data here', data)
        dispatch(getAllChat(normalizedChats))
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
// export const deleteChatThunk = (receiverId, petId = null) => async (dispatch) => {
//     const url = petId
//         ? `/api/chat/${receiverId}?petId=${petId}`
//         : `/api/chat/${receiverId}`

//     const response = await csrfFetch(url, {
//         method: 'DELETE'
//     })

//     if (response.ok) {
//         const data = await response.json()
//         dispatch(deleteChat(data))
//     }
// }
export const markAsReadThunk = (messageData) => async (dispatch) => {
    const { senderId } = messageData
    const response = await csrfFetch(`/api/chat/${senderId}`, {method: "PATCH"})

    if (response.ok) {
        const data = await response.json()
        dispatch(markAsRead(data))
        return data
    }
}
// export const addToChatThunk = (messageData) => async (dispatch) => {
//     const { receiverId, content } = messageData

//     const response = await csrfFetch(`/api/chat/${receiverId}`, {
//         method: 'POST',
//         body: JSON.stringify({ content })
//     })

//     if (response.ok) {
//         const data = await response.json()
//         dispatch(addToChat(data))
//         dispatch(getAllChatThunk())
//         return data
//     }
// }


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
        case ADD_TO_CHAT: {
            return {
                ...state,
                chatHistory: {
                    ...state.chatHistory,
                    Chat_History: [
                        ...(state.chatHistory.Chat_History || []),
                        action.payload
                    ]
                }
            }
        }
        case MARK_AS_READ: {
            const { senderId, receiverId, petId } = action.payload

            return {
                ...state,
                chatHistory: {
                    ...state.chatHistory,
                    Chat_History: state.chatHistory.Chat_History.map((msg) => {
                        if (
                            msg.senderId === senderId &&
                            msg.receiverId === receiverId &&
                            msg.petId === petId &&
                            msg.status === "DELIVERED"
                        ) {
                            return { ...msg, status: "READ"}
                        }
                        return msg
                    })
                }
            }
        }
        case DELETE_MESSAGE:
            return {
                ...state,
                chatHistory: {
                    ...state.chatHistory,
                    Chat_History: state.chatHistory.Chat_History.filter(
                        (msg) => msg.id !== action.payload
                    )
                }
            }
        default:
            return state;
    }
}

export default chatHistoryReducer;
