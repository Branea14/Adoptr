import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { approvedMatches } from "../../redux/matches";
import { Link } from "react-router-dom"

function Navigation() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  const currentUser = useSelector((state) => state.session.user)
  const approvedMatch = useSelector((state) => state.matches?.approvedMatches)

  const filteredApprovedMatches = Object.values(approvedMatch || {}).filter(match => match.sellerId !== currentUser.id);

  useEffect(() => {
    setLoading(true)
    Promise.all([
      dispatch(approvedMatches())
    ]).finally(() => setLoading(false))
  }, [dispatch])

  return (
    <div className='navbar'>
      <ul>
        {/* <li>
          <NavLink to="/">Home</NavLink>
        </li> */}
        <li>
          <ProfileButton />
          {currentUser?.firstName}
        </li>
      </ul>
      <h2>Approved Matches</h2>
          <div className="approved-match">
            {filteredApprovedMatches.length > 0 ? (
              filteredApprovedMatches.map((match) => (
                <Link to={`/pets/${match.petId}`} key={match.id} className='pet-details-link'>
                  <div key={match.id}>
                      <img className='approved-match-image' src={match.petImage} alt={`${match.petName}`}/>
                      <h3>{match.petName}</h3>
                  </div>
                </Link>
              ))
            ) : null}
          </div>


    </div>
  );
}

export default Navigation;
