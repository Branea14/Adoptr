import { useDispatch, useSelector } from "react-redux"
import "./ApprovedMatches.css"
import { useEffect, useState } from "react"
import { thunkAuthenticate } from "../../redux/session"
import { approvedMatches } from "../../redux/matches"
import { Link } from "react-router-dom"
import OpenModalButton from "../OpenModalButton"
import UnmatchModal from "../UnmatchModal/UnmatchModal"


const ApprovedMatches = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const currentUser = useSelector((state) => state.session.user)
    const approvedMatch = useSelector((state) => state.matches?.approvedMatches)

    const filteredApprovedMatches = Object.values(approvedMatch || {}).filter(match => match.sellerId !== currentUser.id)
    // console.log(filteredApprovedMatches)

    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1)
    }

    useEffect(() => {
        setLoading(true)
        Promise.all([
            dispatch(thunkAuthenticate()),
            dispatch(approvedMatches())
        ]).finally(() => setLoading(false))
    }, [dispatch, refreshTrigger])

    if (loading) return null

    return (
        <div className="approved-matches-container">
            <h1 className="approved-matches-title">Approved Matches</h1>
            <div className="approved-match-on-page">
                {loading ? null : filteredApprovedMatches.length > 0 ? (
                    filteredApprovedMatches.map((match) => (
                        <div key={match.id} className="approved-match-tile">
                        <Link to={`/pets/${match.petId}`} key={match.id} className='pet-details-link'>
                                <img className='approved-match-image-on-page' src={match.petImage} alt={`${match.petName}`}/>
                                <h3>{match.petName}</h3>
                        </Link>
                        <div className='pet-actions'>
                            <OpenModalButton className="delete-modal-button" buttonText="UNMATCH" modalComponent={<UnmatchModal match={match} triggerRefresh={triggerRefresh}/>}/>
                        </div>
                    </div>
                    ))
                ) : (<p>No approved matches yet</p>)}
            </div>
        </div>
    )
}

export default ApprovedMatches
