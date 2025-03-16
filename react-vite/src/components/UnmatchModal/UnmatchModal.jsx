import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import "./UnmatchModal.css"
import { deleteMatch } from "../../redux/matches"

const UnmatchModal = ({match, triggerRefresh}) => {
    const {closeModal} = useModal()
    const dispatch = useDispatch()

    const handleUnmatch = async () => {
        await dispatch(deleteMatch(match.id))
        closeModal()
        triggerRefresh()
    }

    const handleCancelButton = async () => {
        closeModal()
    }

    return (
        <div className="modal-container delete-modal">
            <h1 className="delete-pet-header">Confirm Unmatch</h1>
            <div className="confirmation-question">Are you sure you want to unmatch?</div>
            <div className="action-buttons">
                <button onClick={handleUnmatch} className="yes">Yes (Unmatch)</button>
                <button onClick={handleCancelButton} className="no">No (Keep Match)</button>
            </div>
        </div>
    )
}

export default UnmatchModal
