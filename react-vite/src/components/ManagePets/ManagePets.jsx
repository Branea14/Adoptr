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

    // const currentUser = useSelector((state) => state.session.user)
    const pets = useSelector((state) => state.pet.pets)
    const petsArray = Object.values(pets)
    // console.log(petsArray)

    const petsWithPreview = petsArray.map((pet) => {
        const previewImage = pet.images.find((image) => image.preview) || pet.images[0]; // falls back on first photo
        return {
          ...pet,
          previewImageUrl: previewImage?.url || "", // exits
        };
      });


    useEffect(() => {
        setLoading(true)
        Promise.all([
            dispatch(getPets())
        ]).finally(() => setLoading(false))
    }, [dispatch])

    if (loading) return null
    if (!pets || petsArray.length === 0) return <div>You have no pet listing to manage.</div>

    return (
        <div className='manage-pets-container'>
            <h1>Manage Pets</h1>
            <div className='create-pet-listing-link'>
                {/* needs link below!!!!!! */}
                <Link to=''>
                    Create a New Pet Listing
                </Link>
            </div>

            <div className='pets-container'></div>
            {petsWithPreview.map((pet) => (
                <div key={pet.id} className='pet-tile-container'>
                    <Link to={`/pets/${pet.id}`}>
                        <div className='pet-tile'>
                            <div className='pet-img-container'>
                                <img src={pet.previewImageUrl} alt={pet.name} className='pet-img'/>
                            </div>
                            <div className='pet-info'>
                                <div className='pet-tile-name'>{pet.name}</div>
                                <div className='pet-tile-brief-info'>{pet.age} • {pet.breed}</div>
                                <div className='pet-tile-adoptionStatus'>{pet.adoptionStatus}</div>
                            </div>
                        </div>
                    </Link>

                    <div className='pet-actions'>
                        <button className='update-pet-button' onClick={() => navigate(`/pets/${pet.id}/edit`)}>Update</button>
                        <OpenModalButton className="delete-modal" buttonText="Delete" modalComponent={<DeletePetModal pet={pet}/>}/>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ManagePets
