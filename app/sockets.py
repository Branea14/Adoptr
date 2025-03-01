from flask_socketio import SocketIO, send, emit, join_room, leave_room

# enable websockets
socketio = SocketIO(app, cors_allowed_origins="*")

# tracks online users
connected_users = {}

# # websocket connection
@socketio.on('connect')
def handle_connect():
    # if curr
    print('you are connected')


# # websocket disconnection
# @socketio.on('disconnect')
# def handle_disconnect():
#     print('you are disconnected')


# # handling messages
# @socketio.on('send_messages')
# def handle_send_message(data):
#     print('Message' + data)
#     send(data, broadcast=True)
