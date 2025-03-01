from flask import Blueprint, jsonify, request, session
from flask_login import login_required, current_user
from app.models import db, ChatHistory
from sqlalchemy import func

chat_history_routes = Blueprint('chat', __name__)

####################### DISPLAYS ALL CONVERSATIONS ###############################
@chat_history_routes.route('/conversations')
@login_required
def all_conversations():
    messages = ChatHistory.query.filter(
        (ChatHistory.senderId == current_user.id) | (ChatHistory.receiverId == current_user.id)
    ).all()

    # print('###############################################')

    conversation = {}
    for msg in messages:
        user1, user2 = sorted([msg.senderId, msg.receiverId])
        # print(msg)
        # print(user2)
        keys = (user1, user2)

        # latest message in conversation
        if keys not in conversation or msg.createdAt > conversation[keys].createdAt:
            conversation[keys] = msg

    chat_data = [{
        "id": chat.id,
        "senderId": chat.senderId,
        "receiverId": chat.receiverId,
        "petId": chat.petId,
        "content": chat.content,
        "status": chat.status,
        "createdAt": chat.createdAt.isoformat(),
        "updatedAt": chat.updatedAt.isoformat()
    } for chat in conversation.values()]

    return jsonify({"Chat_History": chat_data})

####################### CONVERSATION HISTORY BETWEEN 2 USERS ###############################
# filtering by the petId
@chat_history_routes.route('/<int:receiverId>')
@login_required
def selected_conversation_history(receiverId):
    # if user is interested in multiple pets from same seller, there's a pet filter option
    # grabs petId from query params
    pet_id = request.args.get('petId', type=int)

    chat = ChatHistory.query.filter(
        ((ChatHistory.senderId == current_user.id) & (ChatHistory.receiverId == receiverId)) |
        ((ChatHistory.receiverId == current_user.id) & (ChatHistory.senderId == receiverId))
    )
    # print('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
    # print(chat)

    if pet_id:
        chat = chat.filter(ChatHistory.petId == pet_id)

    messages = chat.order_by(ChatHistory.createdAt.asc()).all()

    # websocket is going to handle status updates
    # unread_messages = [
    #     msg for msg in messages
    #     if msg.receiverId == current_user.id and msg.status == 'READ'
    # ]

    # if unread_messages:
    #     for msg in unread_messages:
    #         msg.status = "READ"
    #     db.session.commit()

    chat_data = [{
        "id": chat.id,
        "senderId": chat.senderId,
        "receiverId": chat.receiverId,
        "petId": chat.petId,
        "content": chat.content,
        "status": chat.status,
        "createdAt": chat.createdAt.isoformat(),
        "updatedAt": chat.updatedAt.isoformat()
    } for chat in messages]

    return jsonify({"Chat_History": chat_data})

####################### DELETING CONVERSATIONS ###############################
@chat_history_routes.route('/<int:receiverId>', methods=['DELETE'])
@login_required
def delete_conversation(receiverId):

    pet_id = request.args.get('petId', type=int)

    conversation = ChatHistory.query.filter(
        ((ChatHistory.senderId == current_user.id) & (ChatHistory.receiverId == receiverId)) |
        ((ChatHistory.receiverId == current_user.id) & (ChatHistory.senderId == receiverId))
    )

    if pet_id:
        conversation = conversation.filter(ChatHistory.petId == pet_id)

    deleting_chat = conversation.delete(synchronize_session=False)

    if deleting_chat == 0:
        return jsonify({"message": "No conversation found"}), 404

    db.session.commit()

    return jsonify({"message": "Successfully deleted"}), 200
