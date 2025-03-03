from flask_socketio import SocketIO, send, emit, join_room, leave_room
from flask_login import current_user
from app.models import db, ChatHistory
from flask import request

# enable websockets
socketio = SocketIO(cors_allowed_origins="*")

# tracks online users
connected_users = {}

# # websocket connection
@socketio.on('connect')
def handle_connect():
    if current_user.is_authenticated:
        connected_users[current_user.id] = request.sid
        print(f"User {current_user.id} is connected")


# websocket disconnection
@socketio.on('disconnect')
def handle_disconnect():
    if current_user.id in connected_users:
        del connected_users[current_user.id]
        print(f"User {current_user.id} disconnected")


# handling messages
@socketio.on('send_messages')
def handle_send_message(data):
    sender_id = current_user.id
    receiver_id = data['receiverId']
    pet_id = data['petId']
    content = data['content']

    message = ChatHistory(senderId=sender_id, receiverId=receiver_id, petId=pet_id, content=content, status='SENT')
    db.session.add(message)
    db.session.commit()

    if receiver_id in connected_users:
        message.status = 'DELIVERED'
        db.session.commit()
        emit('receive message', {
            "id": message.id,
            "senderId": sender_id,
            "receiverId": receiver_id,
            "petId": pet_id,
            "content": content,
            "status": 'DELIVERED'
        }, room=connected_users[receiver_id])


@socketio.on("mark_messages_read")
def handle_mark_messages_read(data):
    sender_id = data['senderId']
    receiver_id = current_user.id

    messages = ChatHistory.query.filter_by(senderId=sender_id, receiverId=receiver_id, status='DELIVERED').all()

    for message in messages:
        message.status = 'READ'

    db.session.commit()

    if sender_id in connected_users:
        broadcast.emit('messages_read', { #
            "senderId": sender_id,
            "receiverId": receiver_id
        }, room=connected_users[sender_id])
