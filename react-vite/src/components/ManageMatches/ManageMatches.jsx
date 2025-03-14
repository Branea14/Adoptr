import { useDispatch, useSelector } from "react-redux"
import "./ManageMatches.css"
import { useEffect, useState } from "react"
import { thunkAuthenticate } from "../../redux/session"
import { approvedMatches, createMatch, rejectedMatches, requestedMatches, updatedMatch } from "../../redux/matches"
import { FaUserCircle } from 'react-icons/fa';
import OpenModalButton from "../OpenModalButton"
import UnmatchModal from "../UnmatchModal/UnmatchModal"


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

    const incomingMatch = Object.values(requestedMatch || {}).filter(match => match.sellerId !== currentUser.id)
    // console.log('incomingMatch', incomingMatch)
    const outcomingMatch = Object.values(requestedMatch || {}).filter(match => match.sellerId === currentUser.id)

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
            <div className="incoming-matches">
                <h1>Matches Waiting...</h1>
                {loading ? null : incomingMatch.length > 0 ? (
                    incomingMatch.map((match) => (
                        <div className="manage-match-tile" key={match.id}>
                                <div className='manage-match-image-on-page'>
                                    {/* {match.user1Avatar ? (
                                        <img src={match.user1Avatar} alt="User Avatar"/>
                                    ) : (
                                        <FaUserCircle className="manage-matches-user-avatar"/>
                                    )} */}
                                                                    <h3>{match.petName}</h3>
                                                                    <img className='approved-match-image-on-page' src={match.petImage} alt={`${match.petName}`}/>

                                </div>
                        <div className='pet-actions'>
                            <button onClick={() => handleApproveMatch(match.petId)}>Approve MATCH</button>
                            <button onClick={() => handleRejectMatch(match.petId)}>PASS</button>
                        </div>
                        </div>
                    ))
                ) : (<p>No matches waiting.</p>)}
            </div>
            <>---------------------------------------------------------</>
            <div className="outcoming-matches">
                <h1>Awaiting Approval</h1>
                {loading ? null : outcomingMatch.length > 0 ? (
                    outcomingMatch.map((match) => (
                        <div className="manage-match-tile" key={match.id}>
                                <div className='manage-match-image-on-page'>
                                    {/* {match.user1Avatar ? (
                                        <img src={match.user1Avatar} alt="User Avatar"/>
                                    ) : (
                                        <FaUserCircle className="manage-matches-user-avatar"/>
                                    )} */}
                                                                    <h3>{match.petName}</h3>
                                                                    <img className='approved-match-image-on-page' src={match.petImage} alt={`${match.petName}`}/>

                                </div>
                        <div className='pet-actions'>
                            <OpenModalButton className="delete-modal" buttonText="UNMATCH" modalComponent={<UnmatchModal match={match} triggerRefresh={triggerRefresh}/>}/>
                        </div>
                        </div>
                    ))
                ) : (<p>No matches waiting.</p>)}
            </div>
        </div>
    )
}

export default ManageMatches
