import { useDispatch } from "react-redux"
import "./DeleteReviewModal.css"
import { deleteReviewThunk } from "../../redux/reviews"
import { useModal } from "../../context/Modal"

const DeleteReviewModal = ({id, triggerRefresh}) => {
    const {closeModal} = useModal()
    const dispatch = useDispatch()

    const handleDelete = async () => {
        await dispatch(deleteReviewThunk(id))
        closeModal()
        triggerRefresh()
    }

    const handleCancelButton = async () => {
        closeModal()
    }

    return (
        <div className="modal-container delete-modal">
            <h1 className="delete-pet-header">Confirm Delete</h1>
            <div className="confirmation-question">Are you sure you want to remove this review?</div>
            <div className="action-buttons">
                <button onClick={handleDelete} className="yes">Yes (Delete Review)</button>
                <button onClick={handleCancelButton} className="no">No (Keep Review)</button>
            </div>
        </div>
    )

}

export default DeleteReviewModal;
