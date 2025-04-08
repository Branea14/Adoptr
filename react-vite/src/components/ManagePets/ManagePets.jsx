import { useNavigate, Link } from 'react-router-dom'
import './ManagePets.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getPets } from '../../redux/pets'
import OpenModalButton from "../OpenModalButton"
import DeletePetModal from '../DeletePetModal'

const ManagePets = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(true)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    // const currentUser = useSelector((state) => state.session.user)
    const pets = useSelector((state) => state.pet.pets)
    const petsArray = Object.values(pets).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
    console.log(petsArray)

    const petsWithPreview = petsArray.map((pet) => {
        const previewImage = pet.images.find((image) => image.preview) || pet.images[0]; // falls back on first photo
        return {
          ...pet,
          previewImageUrl: previewImage?.url || "", // exits
        };
      });

    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1)
    }

    useEffect(() => {
        setLoading(true)
        Promise.all([
            dispatch(getPets())
        ]).finally(() => setLoading(false))
    }, [dispatch, refreshTrigger])

    if (loading) return null

    return (
        <div className='manage-pets-container'>
            {/* <h1 className="approved-matches-title">Manage Pets</h1> */}
            <div className='create-pet-listing-link'>
                <Link to='/pets/new'>
                    Create a New Pet Listing
                </Link>
            </div>

            {petsArray.length === 0 ? (
                <div className='no-pets'>You have no pet listing to manage.</div>
            ) : (
            <div className='pets-container'>
                {petsWithPreview.map((pet) => (
                    <div key={pet.id} className='pet-tile-container'>
                        <Link to={`/pets/${pet.id}`}>
                            <div className='pet-tile'>
                                <div className='pet-img-container'>
                                    <img src={pet.previewImageUrl} alt={pet.name} className='pet-img'/>
                                </div>
                                <div className='pet-info'>
                                    <div className='pet-info-inside-container'>
                                        <div className='pet-tile-name'>{pet.name}</div>
                                        <div className='pet-tile-adoptionStatus'>{pet.adoptionStatus}</div>
                                    </div>
                                    <div className='pet-info-outside-container'>
                                        <div className='pet-tile-brief-info'>{pet.age} • {pet.breed}</div>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <div className='pet-actions'>
                            <button className='update-pet-button' onClick={() => navigate(`/pets/${pet.id}/edit`)}>Update</button>
                            <OpenModalButton className="delete-modal-button" buttonText="Delete" modalComponent={<DeletePetModal pet={pet} triggerRefresh={triggerRefresh}/>}/>
                        </div>
                    </div>
                ))}
            </div>
            )}
        </div>
    )
}

export default ManagePets
