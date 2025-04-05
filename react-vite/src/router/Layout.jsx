import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import socket from "../socket";

export default function Layout() {
  const dispatch = useDispatch();
  const location = useLocation()
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    socket.connect()
    console.log('socket connecting from Layout')

    socket.on("connect", () => {
      // fires when connection is established
      console.log('connected to server')
    })

    socket.on("connected", (data) => {
      // fires when backend emits custom event, which immediate after it receives handshake
      console.log("connected", data)
    })

    return () => {
      socket.disconnect()
      socket.off("connect")
      socket.off("connected")
      console.log("now disconnected")
    }

  }, [])

  return (
    <>

      <ModalProvider>
        {location.pathname !== '/' && <Navigation />}
        {/* <Navigation /> */}
        {isLoaded && <Outlet />}
        <Modal />
      </ModalProvider>
    </>
  );
}
