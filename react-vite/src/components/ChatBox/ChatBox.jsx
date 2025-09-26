import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addToChat, deleteMessage, getAllChatThunk, getChatHistoryThunk, markAsRead } from "../../redux/chatbox"
import { useNavigate, useParams } from "react-router-dom"
import './ChatBox.css'
import { getViewedPetDetailsThunk } from "../../redux/pets"
import socket from "../../socket"
import { FaTrash } from "react-icons/fa"


const ChatBox = () => {
    const {petId, receiverId} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const messages = useSelector((state) => state.chatbox.chatHistory?.Chat_History)
    const displayedPet = useSelector((state) => state.pet.viewedPetDetails)
    const currentUser = useSelector((state) => state.session.user)
    const allChats = useSelector((state) => state.chatbox.allConversations)

    const allChatsArray = Object.values(allChats).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )

    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const messagesEndRef = useRef(null)

    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1)
    }

    useEffect(() => {
        if (!currentUser || !petId || !receiverId) return
        setLoading(true)
        const chatHistoryData = {petId, receiverId}
        Promise.all([
            dispatch(getChatHistoryThunk(chatHistoryData)),
            dispatch(getViewedPetDetailsThunk(petId)),
            dispatch(getAllChatThunk())
        ]).finally(() => setLoading(false))
    }, [dispatch, petId, receiverId, refreshTrigger, currentUser])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
    }, [messages])

    const handleSend = () => {
        socket.emit("send_messages", {
            senderId: currentUser.id,
            receiverId,
            petId,
            content: message
        })

        dispatch(getAllChatThunk())
        setMessage('')
    }

    const handleDelete = (id) => {
        dispatch(deleteMessage(id))
        socket.emit("delete_message", {
            id: id
        })

        dispatch(getAllChatThunk())
    }

    useEffect(() => {
        if (!messages || messages.length === 0 ) return
        // console.log("messages in useEffect:", messages);

        const unread = messages?.some(
            (msg) =>
                msg.senderId === Number(receiverId) &&
                msg.receiverId === currentUser.id &&
                msg.status === 'SENT'
        )

        // console.log("Checking unread for", {
        //     receiverId,
        //     petId,
        //     currentUserId: currentUser?.id
        //   });

        // console.log('unread', unread)

        if (unread) {
            console.log('emitting mark_messages_read')
            socket.emit("mark_messages_read", {
                senderId: receiverId,
                petId
            })
        }
    }, [receiverId, petId, messages, currentUser.id])

    useEffect(() => {
        if (!currentUser) return null;
        socket.emit("join_chat_room", { petId, receiverId })

        return () => {
            socket.emit("leave_chat_room", { petId, receiverId })
        }
    }, [currentUser, petId, receiverId])

    useEffect(() => {
        socket.on("receive_message", (newMessage) => {
            // console.log('📥 receveid new message via socket', newMessage)
            dispatch(addToChat(newMessage))
            dispatch(getAllChatThunk())
        })

        return () => socket.off("receive_message")
    }, [refreshTrigger])

    useEffect(() => {
        socket.on("message_deleted", ({ id }) => {
            console.log("🗑 Message deleted received:", id)

            dispatch(deleteMessage(id))
            triggerRefresh()
        })

        return () => socket.off("message_deleted")
    }, [dispatch, refreshTrigger])

    useEffect(() => {
        const handleRead = ({ senderId, receiverId, petId}) => {
            dispatch(markAsRead(senderId, receiverId, petId))
        }

        socket.on("messages_read", handleRead)

        return () => {
            socket.off("messages_read", handleRead)
        }
    }, [dispatch])

    const currentChat = allChatsArray?.find(chat =>
        chat.petId === Number(petId) &&
        (chat.senderId === currentUser.id || chat.receiverId === currentUser.id)
    )

    // console.log('plllllllllllllleaaaaaaase, lok here', currentChat)
    // console.log('did you eat', displayedPet)
    if (loading || !currentUser || !currentUser.id) return null;

    return (
        <div className="manage-chat-container">
            <div className="chat-header">
                <div className="chat-header-left">
                    {currentChat && (
                        <div>
                            <div>
                                {currentChat.sellerId === currentUser.id ? (
                                <img
                                    className="pet-avatar"
                                    src={
                                        currentChat.senderId === currentUser.id
                                        ? currentChat.receiverAvatar
                                        : currentChat.senderAvatar
                                    }
                                    alt={
                                        currentChat.senderId === currentUser.id
                                        ? currentChat.receiverName
                                        : currentChat.senderName
                                    }
                                    onClick={() => navigate(`/user/${
                                        currentChat.senderId === currentUser.id
                                        ? currentChat.receiverId
                                        : currentChat.senderId
                                    }`)}
                                />
                                ) :
                                    <img
                                    key={currentChat.id}
                                    className="pet-avatar"
                                    src={currentChat.petImage}
                                    alt={currentChat.petName}
                                    onClick={() => navigate(`/pets/${currentChat.petId}`)}
                                    />
                                }
                            </div>
                        </div>
                    )}

                    {currentChat && (
                        <div className="chat-header-text">
                            {currentChat.sellerId === currentUser.id ? (
                                <h2>{
                                    currentChat.senderId === currentUser.id
                                    ? currentChat.receiverName
                                    : currentChat.senderName
                                }</h2>
                            ) : <h2>{currentChat.petName}</h2>}

                            {currentChat.sellerId === currentUser.id ? (
                                <span className="chat-subtext">Interested in {currentChat.petName}</span>
                            ):
                                <span className="chat-subtext">
                                    Chat with {messages[0]?.senderId === currentUser.id ? messages[0]?.receiverName : messages[0]?.senderName}
                                </span>
                            }
                        </div>
                    )}

                </div>
            </div>
            <div className="chat-box">
                {messages && messages.length > 0 ? (
                    messages.map((msg, index) => {
                        const isCurrentUser = msg.senderId === currentUser.id
                        const lastMessage = index === messages.length - 1
                        return (
                            <div key={msg.id} className="message-wrapper">
                                <div key={msg.id} className={`message-bubble ${isCurrentUser ? 'sent' : 'received'}`}>
                                    <div className="message-content">
                                        {msg.content}
                                    </div>
                                </div>
                                {lastMessage && isCurrentUser && <div className="message-status">{msg.status === "READ" ? "✓✓ Read" : "✓ Delivered"}</div>}
                                {msg.senderId === currentUser.id && (
                                    <div style={{ textAlign: 'right' }}>
                                        <FaTrash className="trash" onClick={() => handleDelete(msg.id)}/>
                                    </div>
                                )}
                                {/* {lastMessage && msg.senderId !== currentUser?.id && (
                                    <button onClick={() => socket.emit("mark_messages_read", {
                                        senderId: receiverId,
                                        petId
                                      })}>
                                        Mark as Read (Test)
                                      </button>
                                )} */}
                            </div>
                        )
                    })
                ) : (
                    <p className="no-messages-placeholder">No messages yet. Start a conversation!</p>
                )}
                <div ref={messagesEndRef}/>
            </div>

            <div className="chat-input-container">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && message.trim()) handleSend()
                    }}
                />
                <button onClick={handleSend} disabled={!message.trim()}>Send</button>
            </div>
        </div>
    )
}

export default ChatBox;
