import "./Navigation.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { approvedMatches } from "../../redux/matches";
import { Link, useNavigate } from "react-router-dom"
import { FaUserCircle } from 'react-icons/fa';
import { thunkAuthenticate, thunkLogout } from "../../redux/session";


function Navigation() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [shifted, setShifted] = useState(false)

  const currentUser = useSelector((state) => state.session.user)
  const approvedMatch = useSelector((state) => state.matches?.approvedMatches)

  const filteredApprovedMatches = Object.values(approvedMatch || {}).filter(match => match.sellerId !== currentUser.id);

  useEffect(() => {
    setLoading(true)
    Promise.all([
      dispatch(thunkAuthenticate()),
      dispatch(approvedMatches())
    ]).finally(() => setLoading(false))
  }, [dispatch])

  const handleProfileIconClick = () => {
    setShifted((prev) => !prev)
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
        <img src="/logo.png" alt="Adoptr Logo" className='nav-logo'/>
        <h1 className='platform-name'>Adoptr</h1>
      </div>
      <div className={`navbar ${shifted ? "shifted" : ""}`}>
        <ul>
          {/* <li>
            <NavLink to="/">Home</NavLink>
            </li> */}
          <li className='profile-button-container' onClick={handleProfileIconClick}>
            <div className={`profile-button ${shifted ? "move-profile" : ""}`}>
              <button className="toggle-button">
                {shifted ? "🔙" : ""}
              </button>
              {/* <ProfileButton /> */}
              <FaUserCircle />
              {currentUser?.firstName}
            </div>
          </li>
        </ul>
        <div>
          <Link to='/matches/approved'>
            <h2>Approved Matches</h2>
          </Link>
        </div>
            <div className="approved-match">
              {loading ? null : filteredApprovedMatches.length > 0 ? (
                filteredApprovedMatches.map((match) => (
                  <Link to={`/pets/${match.petId}`} key={match.id} className='pet-details-link'>
                    <div key={match.id}>
                        <img className='approved-match-image' src={match.petImage} alt={`${match.petName}`}/>
                        <h3>{match.petName}</h3>
                    </div>
                  </Link>
                ))
              ) : (<p>No approved matches yet</p>)}
            </div>
          {shifted && (
            <div className="additional-menu">
              <ul>
                <li>
                  <Link to="/pets/current">Manage Pet Listings</Link>
                </li>

                <li>
                  <Link>Matches</Link>
                </li>

                <li>
                  <Link>Edit Profile</Link>
                </li>

                <li onClick={logout}>Logout</li>

              </ul>
            </div>
          )}

      </div>

    </div>
  );
}

export default Navigation;
