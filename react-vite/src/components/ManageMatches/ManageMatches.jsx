import { useDispatch, useSelector } from "react-redux"
import "./ManageMatches.css"
import { useEffect, useState } from "react"
import { thunkAuthenticate } from "../../redux/session"
import { approvedMatches, rejectedMatches, requestedMatches, updatedMatch } from "../../redux/matches"
// import { FaUserCircle } from 'react-icons/fa';
import OpenModalButton from "../OpenModalButton"
import UnmatchModal from "../UnmatchModal/UnmatchModal"
import { Link } from "react-router-dom"


const ManageMatches = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const currentUser = useSelector((state) => state.session.user)
    const approvedMatch = useSelector((state) => state.matches?.approvedMatches)
    const requestedMatch = useSelector((state) => state.matches?.requestedMatches)
    const rejectedMatch = useSelector((state) => state.matches?.rejectedMatches)

    console.log('approved matches', approvedMatch)
    console.log('requested matches', requestedMatch)
    console.log('rejected matches', rejectedMatch)

    const incomingMatch = Object.values(requestedMatch || {}).filter(match => match.sellerId === currentUser.id)
    console.log('incomingMatch', incomingMatch)
    const outgoingMatch = Object.values(requestedMatch || {}).filter(match => match.sellerId !== currentUser.id)
    console.log('outgoingMatch', outgoingMatch)
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

    const handleApproveMatch = async (matchId) => {
        const matchToUpdate = requestedMatch[matchId]
        console.log('you want to see this', matchId)
        if (matchToUpdate) {
            const updatedMatchData = {
                ...matchToUpdate,
                status: 'APPROVED'
            }

            // console.log('Dispatching updated match:', updatedMatchData);
            await dispatch(updatedMatch(updatedMatchData))
            dispatch(approvedMatches())
            triggerRefresh()
        }
    }

    const handleRejectMatch = async (matchId) => {
        const matchToUpdate = requestedMatch[matchId]

        if (matchToUpdate) {
            const updatedMatchData = {
                ...matchToUpdate,
                status: "REJECTED"
            }
            await dispatch(updatedMatch(updatedMatchData))
            dispatch(rejectedMatches())
            triggerRefresh()
        }
    }

    if (loading) return null

    return (
        <div className="manage-matches-container">
            <div className="matches-section">
                {/* Incoming Matches Section */}
                <div className="matches-container">
                    <h1 className="approved-matches-title">New Matches</h1>
                    <div className="approved-match-on-page">
                        {loading ? null : incomingMatch.length > 0 ? (
                            incomingMatch.map((match) => (
                                <div className="approved-match-tile" key={match.id}>
                                    <div className="manage-match-image-on-page">
                                        {currentUser.id === match.senderUserId1 ? (
                                            <img className="approved-match-image-on-page" src={match.user2Avatar} alt="User Avatar"/>
                                        ) : (
                                            <img className="approved-match-image-on-page" src={match.user1Avatar} alt="User Avatar"/>
                                        )}
                                        {/* <h3>{match.petName}</h3> */}
                                        <span className="tooltiptext">Interested in {match.petName}</span>
                                    </div>
                                    <div className="pet-actions-matches">
                                        <button className='update-pet-button' onClick={() => handleApproveMatch(match.petId)}>APPROVE</button>
                                        <button className="delete-modal-button" onClick={() => handleRejectMatch(match.petId)}>PASS</button>
                                    </div>
                                </div>
                            ))
                        ) : (<p>No matches waiting.</p>)}
                    </div>
                </div>

                {/* Separator Line */}
                <hr className="matches-separator"/>

                {/* Outgoing Matches Section */}
                <div className="matches-container">
                    <h1 className="approved-matches-title">Pending Matches</h1>
                    <div className="approved-match-on-page">
                        {loading ? null : outgoingMatch.length > 0 ? (
                            outgoingMatch.map((match) => (
                                <div className="approved-match-tile" key={match.id}>
                                    <Link to={`/pets/${match.petId}`} className="pet-details-link">
                                        <img className="approved-match-image-on-page" src={match.petImage} alt={`${match.petName}`}/>
                                        <h3>{match.petName}</h3>
                                    </Link>
                                    <div className="pet-actions">
                                        <OpenModalButton className="delete-modal-button" buttonText="UNMATCH" modalComponent={<UnmatchModal match={match} triggerRefresh={triggerRefresh}/>}/>
                                    </div>
                                </div>
                            ))
                        ) : (<p>No matches waiting.</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageMatches
