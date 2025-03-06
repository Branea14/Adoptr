import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>

      <ModalProvider>
        <useLocation>
          {({useLocation}) => {
            useLocation.pathname !== '/' ? <Navigation /> : null
          }}
        </useLocation>
        {/* <Navigation /> */}
        {isLoaded && <Outlet />}
        <Modal />
      </ModalProvider>
    </>
  );
}
