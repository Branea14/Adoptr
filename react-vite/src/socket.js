import { io } from "socket.io-client"

const socket = io("http://localhost:8000", {
    withCredentials: true,
    transports: ["websocket"],
    autoConnect: false //user will connect when logging in
})

export default socket;
