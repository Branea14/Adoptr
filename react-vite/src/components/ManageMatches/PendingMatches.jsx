import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { approvedMatches } from "../../redux/matches"
import { thunkAuthenticate } from "../../redux/session"
import { Link } from "react-router-dom"
import OpenModalButton from "../OpenModalButton"
import UnmatchModal from "../UnmatchModal/UnmatchModal"
import { rejectedMatches, requestedMatches, updatedMatch } from "../../redux/matches"
import "./ManageMatches.css"

const PendingMatches = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const currentUser = useSelector((state) => state.session.user)
    const requestedMatch = useSelector((state) => state.matches?.requestedMatches)

    const outgoingMatch = Object.values(requestedMatch || {}).filter(match => match.sellerId !== currentUser.id)

    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1)
    }

    useEffect(() => {
        dispatch(approvedMatches())
    }, [dispatch])

    useEffect(() => {
        setLoading(true)
        Promise.all([
            dispatch(thunkAuthenticate()),
            dispatch(requestedMatches())
        ]).finally(() => setLoading(false))
    }, [dispatch, refreshTrigger])

    if (loading) return null

    return (
        // <div className="manage-matches-container">
            <div className="matches-section">
                <div className="matches-container">
                    <div className="approved-match-on-page">
                        {loading ? null : outgoingMatch.length > 0 ? (
                            outgoingMatch.map((match) => (
                                <div className="approved-match-tile" key={match.id}>
                                    <Link to={`/pets/${match.petId}`} className='pet-details-link'>
                                        <img className="approved-match-image-on-page" src={match.petImage} alt={`${match.petName}`}/>
                                        <h3>{match.petName}</h3>
                                    </Link>
                                    <div className="pet-actions">
                                        <OpenModalButton className='delete-modal-button' buttonText="UNMATCH" modalComponent={<UnmatchModal match={match} triggerRefresh={triggerRefresh} />} />
                                    </div>
                                </div>
                            ))
                        ) : (<p>No matches waiting.</p>)}
                    </div>

                </div>
            </div>
        // </div>
    )
}

export default PendingMatches
