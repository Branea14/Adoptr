import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllChatThunk } from "../../redux/chatbox";
import { Outlet, useNavigate } from "react-router-dom";

const Conversations = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const currentUser = useSelector((state) => state.session.user)
    const allChats = useSelector((state) => state.chatbox.allConversations)

    const allChatsArray = Object.values(allChats).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
    console.log("look here", allChatsArray)


    useEffect(() => {
        dispatch(getAllChatThunk())
    }, [dispatch])

    return (
        <div className="matches-conversation-container">
          <div className="chat-list">
            {allChatsArray && allChatsArray.length > 0 ? (
              allChatsArray.map((chat, index) => {
                const otherUserId = chat.senderId === currentUser.id ? chat.receiverId : chat.senderId
                  return (
                    <div
                        className="chat-card"
                        key={index}
                        onClick={() => navigate(`/matches/manage/conversations/${otherUserId}/${chat.petId}`)}
                    >
                        <div className="chat-image">
                        <img className="chat-pet-image" src={chat.petImage} alt={chat.petName} />
                        </div>
                        <div className="chat-details">
                        <h2 className="chat-name">{chat.petName}</h2>
                        <p className="chat-preview">
                            {chat.senderId === currentUser.id ? (
                            <>
                                <span className="chat-you-prefix">You: </span>
                                {chat.content}
                            </>
                            ) : (
                            chat.content
                            )}
                        </p>
                        </div>
                    </div>
                )
            })
            ) : (
              <p className="no-chats">No conversations available.</p>
            )}
          </div>

          <div className="chat-panel">
            <Outlet />
          </div>
        </div>
      );
}

export default Conversations;
