import { createBrowserRouter } from 'react-router-dom';
// import LoginFormPage from '../components/LoginFormPage';
// import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import LandingPage from '../components/LandingPage'
import SwipingPage from '../components/SwipingPage';
import CreatePets from '../components/CreatePets';
import PetDetails from '../components/PetDetails'
import ManagePets from '../components/ManagePets';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      // {
      //   path: "login",
      //   element: <LoginFormPage />,
      // },
      // {
      //   path: "signup",
      //   element: <SignupFormPage />,
      // },
      {
        path: "/pets/swipe",
        element: <SwipingPage />
      },
      {
        path: '/pets/',
        element: <CreatePets />
      },
      {
        path: "/pets/:petId",
        element: <PetDetails />
      },
      {
        path: "/pets/current",
        element: <ManagePets />
      }
    ],
  },
]);
