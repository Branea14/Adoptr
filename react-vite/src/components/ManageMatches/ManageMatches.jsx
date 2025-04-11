import { useDispatch } from "react-redux"
import "./ManageMatches.css"
import { useEffect, useState } from "react"
import { thunkAuthenticate } from "../../redux/session"
import { approvedMatches, requestedMatches } from "../../redux/matches"
import { Outlet, useLocation, useNavigate } from "react-router-dom"

const ManageMatches = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setLoading] = useState(true)

    const activeTab = location.pathname.split('/')[3] || 'new'

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

    const handleTabClick = (tab) => {
        navigate(`/matches/manage/${tab}`)
    }

    if (loading) return null

    return (
        <div className="manage-matches-container">
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'new' ? 'active' : ''}`}
                    onClick={() => handleTabClick('new')}
                >
                    New Matches
                </button>
                <button
                    className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => handleTabClick('pending')}
                >
                    Pending Matches
                </button>
                <button
                    className={`tab-button ${activeTab === 'conversations' ? 'active' : ''}`}
                    onClick={() => handleTabClick('conversations')}
                >
                    Conversations
                </button>
            </div>

            <div className="tab-content">
                <Outlet />
            </div>
        </div>
    );
}

export default ManageMatches
