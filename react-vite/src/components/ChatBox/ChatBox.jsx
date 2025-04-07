import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addToChat, deleteMessage, getAllChatThunk, getChatHistoryThunk, markAsRead } from "../../redux/chatbox"
import { useNavigate, useParams } from "react-router-dom"
import './ChatBox.css'
import { getViewedPetDetailsThunk } from "../../redux/pets"
import { FaArrowLeft } from "react-icons/fa";
import socket from "../../socket"
import { FaTrash } from "react-icons/fa"


const ChatBox = () => {
    const {petId, receiverId} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const messages = useSelector((state) => state.chatbox.chatHistory?.Chat_History)
    const displayedPet = useSelector((state) => state.pet.viewedPetDetails)
    const currentUser = useSelector((state) => state.session.user)

    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const messagesEndRef = useRef(null)

    const triggerRefresh = () => {
        console.log("🌀 Triggering refresh");

        setRefreshTrigger(prev => prev + 1)
    }

    useEffect(() => {
        console.log("🔄 Refresh trigger changed:", refreshTrigger)
    }, [refreshTrigger])

    useEffect(() => {
        setLoading(true)
        const chatHistoryData = {petId, receiverId}
        Promise.all([
            dispatch(getChatHistoryThunk(chatHistoryData)),
            dispatch(getViewedPetDetailsThunk(petId)),
        ]).finally(() => setLoading(false))
    }, [dispatch, petId, receiverId, refreshTrigger])

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
        socket.emit("delete_message", {
            id: id
        })

        dispatch(getAllChatThunk())
    }

    useEffect(() => {
        const unread = messages?.some(
            (msg) =>
                msg.senderId === receiverId &&
                msg.receiverId === currentUser.id &&
                msg.status === 'DELIVERED'
        )

        if (unread) {
            socket.emit("mark_messages_read", {
                senderId: receiverId,
                petId
            })
        }
    }, [receiverId, petId, messages, currentUser.id])

    useEffect(() => {
        socket.emit("join_chat_room", { petId, receiverId })

        return () => {
            socket.emit("leave_chat_room", { petId, receiverId })
        }
    }, [petId, receiverId])

    useEffect(() => {
        socket.on("receive_message", (newMessage) => {
            // console.log('📥 receveid new message via socket', newMessage)
            dispatch(addToChat(newMessage))
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

    if (loading) return null;

    return (
        <div className="manage-chat-container">
            <div className="chat-header">
                {/* <FaArrowLeft className="back-arrow-pet-details1" onClick={() => navigate(`/pets/${petId}`)}/> */}

                <div className="chat-header-left">
                    {displayedPet.PetImages?.filter(image => image.preview ===true)
                        .map(image => (
                            <div key={image.id}>
                                <img className='pet-avatar' src={image.url} alt={displayedPet.name}/>
                            </div>
                        ))
                    }
                    <div className="chat-header-text">
                        <h2>{displayedPet.name}</h2>
                        <span className="chat-subtext">Chat with {displayedPet.sellerName}</span>
                    </div>
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
