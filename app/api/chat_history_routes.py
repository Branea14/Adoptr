from flask import Blueprint, jsonify, request, session
from flask_login import login_required, current_user
from app.models import db, ChatHistory, Pet, User
from sqlalchemy import func, and_, desc
from sqlalchemy.orm import joinedload

chat_history_routes = Blueprint('chat', __name__)

####################### DISPLAYS ALL CONVERSATIONS ###############################
@chat_history_routes.route('/conversations')
@login_required
def all_conversations():
    subquery = db.session.query(
    ChatHistory.petId,
    ChatHistory.senderId,
    ChatHistory.receiverId,
    db.func.max(ChatHistory.createdAt).label("latest")
    ).filter(
        (ChatHistory.senderId == current_user.id) | (ChatHistory.receiverId == current_user.id)
    ).group_by(
        ChatHistory.petId,
        ChatHistory.senderId,
        ChatHistory.receiverId
    ).subquery()

# Join back to get the full message info
    messages = db.session.query(ChatHistory).join(
        subquery,
        and_(
            ChatHistory.petId == subquery.c.petId,
            ChatHistory.senderId == subquery.c.senderId,
            ChatHistory.receiverId == subquery.c.receiverId,
            ChatHistory.createdAt == subquery.c.latest
        )
    ).options(
        joinedload(ChatHistory.pets).joinedload(Pet.images),
        joinedload(ChatHistory.pets).joinedload(Pet.sellers),
        joinedload(ChatHistory.receiver),
        joinedload(ChatHistory.sender)
    ).order_by(desc(ChatHistory.createdAt)).all()
    # messages = ChatHistory.query.options(
    #     joinedload(ChatHistory.pets).joinedload(Pet.images)
    #     ).filter(
    #     (ChatHistory.senderId == current_user.id) | (ChatHistory.receiverId == current_user.id)
    # ).all()

    # print('###############################################')

    conversation = {}
    for msg in messages:

        user1, user2 = sorted([msg.senderId, msg.receiverId])
        # print(msg)
        # print(user1)
        # print(user2)

        keys = (user1, user2, msg.petId)
        print('keeys', keys)

        # latest message in conversation
        if keys not in conversation or msg.createdAt > conversation[keys].createdAt:
            conversation[keys] = msg

    chat_data = []

    for chat in conversation.values():
        pet = chat.pets
        pet_image = next((image for image in pet.images if image.preview), None)

        chat_data.append({
            "id": chat.id,
            "senderId": chat.senderId,
            "senderName": chat.sender.firstName,
            "senderAvatar": chat.sender.avatar,
            "receiverId": chat.receiverId,
            "receiverName": chat.receiver.firstName,
            "receiverAvatar": chat.receiver.avatar,
            "petId": chat.petId,
            "sellerName": pet.sellers.firstName,
            "sellerId": pet.sellers.id,
            "petName": pet.name if pet else None,
            "petImage": pet_image.url if pet_image else None,
            "content": chat.content,
            "status": chat.status,
            "createdAt": chat.createdAt.isoformat(),
            "updatedAt": chat.updatedAt.isoformat()
        })

    return jsonify({"Chat_History": chat_data})

####################### CONVERSATION HISTORY BETWEEN 2 USERS ###############################
# filtering by the petId
@chat_history_routes.route('/<int:receiverId>')
@login_required
def selected_conversation_history(receiverId):
    # if user is interested in multiple pets from same seller, there's a pet filter option
    # grabs petId from query params
    pet_id = request.args.get('petId', type=int)

    chat = ChatHistory.query.options(
            joinedload(ChatHistory.sender),
            joinedload(ChatHistory.receiver)
        ).filter(
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
        "senderName": chat.sender.firstName,
        "senderAvatar": chat.sender.avatar,
        "receiverId": chat.receiverId,
        "receiverName": chat.receiver.firstName,
        "receiverAvatar": chat.receiver.avatar,
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

    ####################### MARKING AS READ ###############################
@chat_history_routes.route('/<int:senderId>/<int:petId>', methods=['PATCH'])
@login_required
def mark_as_read(senderId, petId):
    # pet_id = request.args.get('petId', type=int)

    # if pet_id is None:
    #     return {"error": "Missing petId query parameter"}, 400

    message = ChatHistory.query.filter(
        and_(
            ChatHistory.senderId == senderId,
            ChatHistory.receiverId == current_user.id,
            ChatHistory.petId == petId,
            ChatHistory.status == 'DELIVERED'
        )
    ).order_by(ChatHistory.createdAt.desc()).first()

    if not message:
        return {"message": "No unread messages found"}, 404

    message.status = 'READ'
    db.session.commit()

    print('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^', message.status)
    # print([msg.status for msg in message])

    return jsonify({
        "id": message.id,
        "senderId": message.senderId,
        "receiverId": message.receiverId,
        "petId": message.petId,
        "content": message.content,
        "status": message.status,
        "createdAt": message.createdAt.isoformat() if message.createdAt else None,
        "updatedAt": message.updatedAt.isoformat() if message.updatedAt else None
    })


#     ####################### ADD TO CHAT ###############################
# @chat_history_routes.route('/<int:receiverId>', methods=['POST'])
# @login_required
# def add_to_chat(receiverId):
#     pet_id = request.args.get('petId', type=int)
#     senderId = current_user.id

#     data = request.get_json()
#     message_content = data.get('content')

#     new_message = ChatHistory(
#         senderId=senderId,
#         receiverId=receiverId,
#         petId=pet_id,
#         content=message_content,
#         status='SENT'
#     )

#     db.session.add(new_message)
#     db.session.commit()

#     return jsonify({
#         "id": new_message.id,
#         "senderId": new_message.senderId,
#         "receiverId": new_message.receiverId,
#         "petId": new_message.petId,
#         "content": new_message.content,
#         "status": new_message.status
#     }), 201
