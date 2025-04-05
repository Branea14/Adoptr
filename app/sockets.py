# Flask-SocketIO server is the backend handling real-time websocket communication
from flask import Flask
from flask_socketio import SocketIO, send, emit, join_room, leave_room
from flask_login import current_user
from app.models import db, ChatHistory
from flask import request

# enable websockets
socketio = SocketIO(cors_allowed_origins="*")


# tracks online users
connected_users = {}

# # establishes a websocket connection
@socketio.on('connect') #listens for custom events sent from frontend
def handle_connect():
    if current_user.is_authenticated:
        connected_users[current_user.id] = request.sid
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
