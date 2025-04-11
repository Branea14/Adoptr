# Flask-SocketIO server is the backend handling real-time websocket communication
from flask import Flask
from flask_socketio import SocketIO, send, emit, join_room, leave_room
from flask_login import current_user
from app.models import db, ChatHistory
from flask import request
from sqlalchemy import Enum
# import eventlet
# eventlet.monkey_patch()

# enable websockets
socketio = SocketIO(cors_allowed_origins="*")


# tracks online users
connected_users = {}

# # establishes a websocket connection
@socketio.on('connect') #listens for custom events sent from frontend
def handle_connect():
    if current_user.is_authenticated:
        connected_users[current_user.id] = request.sid

        print('who is connected right now', connected_users)
        join_room(str(current_user.id))
        print(f"User {current_user.id} is connected")
        # emit sends 'event name (connected)' and data to the frontend
        emit("connected", {
            "userId": current_user.id,
        })


# websocket disconnection
@socketio.on('disconnect')
def handle_disconnect():
    socket_id = request.sid

    if connected_users.get(current_user.id) == socket_id:
    # if current_user.id in connected_users:
        print(f"Socket {socket_id} disconnecting")
        print(f"Stored SID for user {current_user.id}: {connected_users.get(current_user.id)}")
        del connected_users[current_user.id]
        print(f"User {current_user.id} disconnected and removed from connected_users")

    leave_room(str(current_user.id))



# joining room
@socketio.on('join_chat_room')
def handle_join_chat_room(data):
    pet_id = data['petId']
    receiver_id = data['receiverId']
    sender_id = current_user.id

    user_ids = sorted(map(str,[sender_id, receiver_id]))
    user_part = "_".join(map(str, user_ids))
    room_name = f"chat_{pet_id}_{user_part}"

    join_room(room_name)
    print(f"user {sender_id} joined {room_name}")



# handling messages
@socketio.on('send_messages')
def handle_send_message(data):
    print('🚀 recevied message in handle', data)

    sender_id = current_user.id
    receiver_id = data['receiverId']
    pet_id = data['petId']
    content = data['content']
    status = "DELIVERED" if receiver_id in connected_users else "SENT"

    message = ChatHistory(senderId=sender_id, receiverId=receiver_id, petId=pet_id, content=content, status=status)
    print("💬 message saved", message.content)
    db.session.add(message)
    db.session.commit()

    user_ids = sorted(map(str,[sender_id, receiver_id]))
    user_part = "_".join(map(str, user_ids))
    room_name = f"chat_{pet_id}_{user_part}"
    print("📡 emitting to room", room_name)

    emit('receive_message', {
        "id": message.id,
        "senderId": sender_id,
        "receiverId": receiver_id,
        "petId": pet_id,
        "content": content,
        "status": message.status
    }, room=room_name)


@socketio.on("mark_messages_read")
def handle_mark_messages_read(data):
    print('printing for erika', data)
    # extracts data from frontend
    sender_id = data['senderId']
    receiver_id = current_user.id
    pet_id = data['petId']

    print('🔥 Received mark_messages_read:', sender_id, receiver_id, pet_id)
    # querys/search for messages that are DELIVERED using the data from above
    messages = ChatHistory.query.filter_by(senderId=sender_id, receiverId=receiver_id, petId=pet_id, status='SENT').all()

    print('^^^^^^^^', messages)
    # sets the status to READ
    for message in messages:
        message.status = 'READ'
    # saves in db
    db.session.commit()

    updated_ids = [msg.id for msg in messages]
    user_ids = sorted(map(str,[sender_id, receiver_id]))
    user_part = "_".join(map(str, user_ids))
    room_name = f"chat_{pet_id}_{user_part}"

    if sender_id in connected_users:
        print("emitting messages for", updated_ids)
        emit('messages_read', {
            "senderId": sender_id,
            "receiverId": receiver_id,
            "petId": pet_id,
            "messageIds": updated_ids
        }, room=connected_users[sender_id])


@socketio.on("delete_message")
def handle_delete_message(data):
    message_id = data['id']

    message = ChatHistory.query.get(message_id)

    if not message or message.senderId != current_user.id:
        return

    pet_id = message.petId
    user_ids = sorted([message.senderId, message.receiverId])
    user_part = "_".join(map(str, user_ids))
    room_name = f"chat_{pet_id}_{user_part}"

    db.session.delete(message)
    db.session.commit()

    emit("message_deleted", { "id": message_id}, room=room_name)
