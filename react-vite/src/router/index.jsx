import { createBrowserRouter } from 'react-router-dom';
// import LoginFormPage from '../components/LoginFormPage';
// import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import LandingPage from '../components/LandingPage'
import SwipingPage from '../components/SwipingPage';
import CreatePets from '../components/CreatePets';
import PetDetails from '../components/PetDetails'
import ManagePets from '../components/ManagePets';
import { UpdatePetListing, UpdatePetListingForm } from '../components/UpdatePetListing';
import ApprovedMatches from '../components/ApprovedMatches';
import ManageMatches from '../components/ManageMatches';
import UpdateUser from '../components/UpdateUser/UpdateUser';
import UpdateUserForm from '../components/UpdateUser/UpdateUserForm';
import ProfileModal from '../components/ProfileModal/ProfileModal';
import ManageReviews from '../components/ManageReviews/ManageReviews';
import ChatBox from '../components/ChatBox/ChatBox';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/user/edit",
        element: <UpdateUser />,
        children: [
          {
            path: '',
            element: <UpdateUserForm />
          }
        ]
      },
      {
        path: "/pets/swipe",
        element: <SwipingPage />
      },
      {
        path: "/matches/approved",
        element: <ApprovedMatches />
      },
      {
        path: "/matches/manage",
        element: <ManageMatches />
      },
      {
        path: '/pets/new',
        element: <CreatePets />
      },
      {
        path: "/pets/:petId",
        element: <PetDetails />
      },
      {
        path: "/pets/current",
        element: <ManagePets />
      },
      {
        path: "/user/reviews",
        element: <ManageReviews />
      },
      {
        path: "/user/:userId",
        element: <ProfileModal />
      },
      {
        path: "/chat/:receiverId/:petId",
        element: <ChatBox />
      },
      {
        path: '/pets/:petId/edit',
        element: <UpdatePetListing />,
        children: [
          {
            path: '',
            element: <UpdatePetListingForm />
          }
        ]
      }
    ],
  },
]);
