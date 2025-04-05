import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getChatHistoryThunk } from "../../redux/chatbox"
import { useNavigate, useParams } from "react-router-dom"
import './ChatBox.css'
import { getViewedPetDetailsThunk } from "../../redux/pets"
import { FaArrowLeft } from "react-icons/fa";


const ChatBox = () => {
    const {petId, receiverId} = useParams()
    const navigate = useNavigate()
    const messages = useSelector((state) => state.chatbox.chatHistory.Chat_History)
    const displayedPet = useSelector((state) => state.pet.viewedPetDetails)
    const currentUser = useSelector((state) => state.session.user)
    const dispatch = useDispatch()

    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)

    const messagesEndRef = useRef(null)

    // console.log('looker', displayedPet)

    useEffect(() => {
        setLoading(true)
        const chatHistoryData = {petId, receiverId}
        Promise.all([
            dispatch(getChatHistoryThunk(chatHistoryData)),
            dispatch(getViewedPetDetailsThunk(petId))
        ]).finally(() => setLoading(false))
    }, [dispatch, petId, receiverId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
    }, [messages])

    if (loading) return null;

    return (
        <div className="manage-chat-container">
            <div className="chat-header">
                <FaArrowLeft className="back-arrow-pet-details1" onClick={() => navigate(`/pets/${petId}`)}/>

                <div className="chat-header-left">
                    {displayedPet.PetImages?.filter(image => image.preview ===true)
                        .map(image => (
                            <img key={image.id} className='pet-avatar' src={image.url} alt={displayedPet.name}/>
                        ))
                    }
                    <div className="chat-header-text">
                        <h2>{displayedPet.name}</h2>
                        <span className="chat-subtext">Chat with {displayedPet.sellerName}</span>
                    </div>
                </div>
            </div>
            <div className="chat-box">
                {messages && messages?.length > 0 ? (
                    messages.map((msg, index) => {
                        const isCurrentUser = msg.senderId === currentUser.id
                        const lastMessage = index === messages.length - 1
                        return (
                            <>
                                <div key={msg.id} className={`message-bubble ${isCurrentUser ? 'sent' : 'received'}`}>
                                    <div className="message-content">
                                        {msg.content}
                                    </div>
                                </div>
                                {lastMessage && <div className="message-status">{msg.status}</div>}
                            </>
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
                />
                <button disabled>Send</button>
            </div>
        </div>
    )
}

export default ChatBox;
