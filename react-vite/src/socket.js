import { io } from "socket.io-client"

const socket = io(
    import.meta.env.MODE === 'production'
        ? import.meta.env.VITE_SOCKET_URL
        : "http://localhost:8000", {
    withCredentials: true,
    transports: ["websocket"],
    autoConnect: false //user will connect when logging in
})

export default socket;
