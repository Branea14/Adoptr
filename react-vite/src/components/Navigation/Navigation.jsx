import "./Navigation.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { approvedMatches } from "../../redux/matches";
import { Link, useNavigate } from "react-router-dom"
// import { FaUserCircle } from 'react-icons/fa';
import { FaArrowLeft } from "react-icons/fa";
import { thunkAuthenticate, thunkLogout } from "../../redux/session";
import UpdateUserForm from "../UpdateUser/UpdateUserForm";
import { useModal } from "../../context/Modal";


function Navigation() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {setModalContent} = useModal()
  const [loading, setLoading] = useState(true)
  const [shifted, setShifted] = useState(false)

  const currentUser = useSelector((state) => state.session.user)
  const approvedMatch = useSelector((state) => state.matches?.approvedMatches)

  console.log('approvedMatch', approvedMatch)
  const filteredApprovedMatches = Object.values(approvedMatch || {}).filter(match => match?.sellerId !== currentUser?.id);

  useEffect(() => {
    setLoading(true)
    Promise.all([
      dispatch(thunkAuthenticate()),
      dispatch(approvedMatches())
    ]).finally(() => setLoading(false))
  }, [dispatch])

  useEffect(() => {
    dispatch(approvedMatches())
  }, [dispatch,])

  const handleProfileIconClick = () => {
    setShifted((prev) => !prev)
  }

  const handleEditProfileButton = async (e) => {
    e.preventDefault()
    setModalContent(<UpdateUserForm user={currentUser}/>)
  }

  const swipingPage = async (e) => {
    e.preventDefault()
    navigate('/pets/swipe')
  }

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    // closeMenu();
    navigate('/')
  };

  return (
    <div className={"container-of-headers"}>
      <div className='navbar2'>
        <div className='nav-items' onClick={swipingPage}>
          <img src="/logo.png" alt="Adoptr Logo" className='nav-logo'/>
          <h1 className='platform-name'>Adoptr</h1>
        </div>
      </div>
      <div className={`navbar ${shifted ? "shifted" : ""}`}>
        <ul>
          {/* <li>
            <NavLink to="/">Home</NavLink>
            </li> */}
          <li className='profile-button-container' onClick={handleProfileIconClick}>
            <div className={`profile-button ${shifted ? "move-profile" : ""}`}>
              <button className="toggle-button">
                {shifted ? <FaArrowLeft /> : ""}
              </button>
              {/* <ProfileButton /> */}
              {/* <FaUserCircle /> */}
              <img src={currentUser?.avatar} alt="Profile-Picture" className="nav-profile-pic"/>
              <span className="profile-name">{currentUser?.firstName}</span>
            </div>
          </li>
        </ul>
        <div className="approved-matches-container-nav">
          <div className="approved-matches-header">
            <Link to='/matches/approved'>
              <h2>Approved Matches</h2>
            </Link>
          </div>
              <div className="approved-match">
                {loading ? null : filteredApprovedMatches.length > 0 ? (
                  filteredApprovedMatches.map((match) => (
                    <Link to={`/pets/${match.petId}`} key={match?.id} className='pet-details-link'>
                      <div key={match?.id}>
                          <img className='approved-match-image' src={match?.petImage} alt={`${match?.petName}`}/>
                          {/* <h3>{match.petName}</h3> */}
                      </div>
                    </Link>
                  ))
                ) : (<p>No approved matches yet</p>)}
              </div>
            {shifted && (
              <div className="additional-menu">
                <ul>
                  <li className="additional-menu-links">
                    <Link to="/pets/current">Manage Pet Listings</Link>
                  </li>

                  <li className="additional-menu-links">
                    <Link to='/user/reviews'>Manage Reviews</Link>
                  </li>

                  <li className="additional-menu-links">
                    <Link to="/matches/manage">My Matches</Link>
                  </li>

                  <li className="additional-menu-links" onClick={handleEditProfileButton}>Edit Profile</li>

                  <li className="additional-menu-links" onClick={logout}>Logout</li>

                </ul>
              </div>
            )}

        </div>

      </div>

    </div>
  );
}

export default Navigation;
