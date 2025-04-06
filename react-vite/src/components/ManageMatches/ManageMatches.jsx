import { useDispatch, useSelector } from "react-redux"
import "./ManageMatches.css"
import { useEffect, useState } from "react"
import { thunkAuthenticate } from "../../redux/session"
import { approvedMatches, rejectedMatches, requestedMatches, updatedMatch } from "../../redux/matches"
import NewMatches from "./NewMatches"
import PendingMatches from "./PendingMatches"
import Conversations from "./Conversations"



const ManageMatches = () => {
    const dispatch = useDispatch()
    const [activeTab, setActiveTab] = useState('new')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        dispatch(approvedMatches())
    }, [dispatch])

    useEffect(() => {
        setLoading(true)
        Promise.all([
            dispatch(thunkAuthenticate()),
            dispatch(requestedMatches())
        ]).finally(() => setLoading(false))
    }, [dispatch])



    if (loading) return null

    return (
        <div className="manage-matches-container">
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'new' ? 'active' : ''}`}
                    onClick={() => setActiveTab('new')}
                >
                    New Matches
                </button>
                <button
                    className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending Matches
                </button>
                <button
                    className={`tab-button ${activeTab === 'conversations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('conversations')}
                >
                    Conversations
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'new' && <NewMatches />}
                {activeTab === 'pending' && <PendingMatches /> }
                {activeTab === 'conversations' && <Conversations />}
            </div>
        </div>
    );
}

export default ManageMatches
