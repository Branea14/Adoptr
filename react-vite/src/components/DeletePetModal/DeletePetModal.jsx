import "./DeletePetModal.css"
import { useModal } from "../../context/Modal";
import { deletePet } from "../../redux/pets";
import { useDispatch } from "react-redux";

const DeletePetModal = ({pet}) => {
    const {closeModal} = useModal()
    const dispatch = useDispatch()

    const handleDelete = async () => {
        await dispatch(deletePet(pet.id))
        closeModal();
    }

    const handleCancelButton = async () => {
        closeModal();
    }

    return (
        <div className="modal-container">
            <h1 className="delete-pet-header">Confirm Delete</h1>
            <div className="confirmation-question">Are you sure you want to remove this pet listing?</div>
            <div className="action-buttons">
                <button onClick={handleDelete} className="yes">Yes (Delete Pet Listing)</button>
                <button onClick={handleCancelButton} className="no">No (Keep Pet Listing)</button>
            </div>
        </div>
    )

}

export default DeletePetModal;
