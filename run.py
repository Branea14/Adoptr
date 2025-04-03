print(f"__name__ = {__name__}")

import eventlet
eventlet.monkey_patch()

print("👋 run.py starting")

from app import app, socketio

print("🚀 Preparing to launch Socket.IO server...")

if __name__ == "__main__":
    print("🔥 Inside __main__, about to run server...")
    socketio.run(app, host='localhost', port=8000, debug=True)
