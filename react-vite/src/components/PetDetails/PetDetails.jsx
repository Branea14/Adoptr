import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getViewedPetDetailsThunk } from "../../redux/pets"
import {  useNavigate, useParams } from "react-router-dom"
import "./PetDetails.css"
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const PetDetails = () => {
    const dispatch = useDispatch()
    const { petId } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [currentImgIndex, setCurrentImgIndex] = useState(0)

    const pet = useSelector((state) => state.pet.viewedPetDetails)
    const currentUser = useSelector((state) => state.session.user)

    const images = pet?.PetImages || [];
    const currentImage = images.length > 0 ? images[currentImgIndex]?.url : ""

    const LIFESTYLE_DISPLAY = {
        "veryActive": "Very Active",
        "active": "Active",
        "laidback": "Laidback",
        "lapPet": "Lap Pet"
    }

    const LOVE_LANGUAGE_DISPLAY = {
        "physicalTouch": "Physical Touch",
        "treats": "Treats",
        "play": "Play",
        "training": "Training",
        "independent": "Independent"
    }

    const SIZE_DISPLAY = {
        "small": "Small",
        "medium": "Medium",
        "large": "Large",
        "xl": "X-Large"
    }

    const handleNextImage = () => {
        if (images.length > 0) {
            setCurrentImgIndex((prevIndex) => (prevIndex + 1) % images.length)
        }
    }

    const handlePrevImage = () => {
        if (images.length > 0) {
          setCurrentImgIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        }
      };

    useEffect(() => {
        setLoading(true)
        Promise.all([
            dispatch(getViewedPetDetailsThunk(petId))
        ]).finally(() => setLoading(false))
    }, [dispatch, petId])

    if (loading) return <p>Loading...</p>;

    return (
        <div className="swiping-page-container">
            {/* <FaArrowLeft className="back-arrow-pet-details" onClick={() => navigate('/matches/approved')}/> */}
            <div className="swipe-card">

                {images && images.length > 1 ? (
                    <div className="swipe-image-container">
                        <FaChevronLeft className='arrow-icon-left-swipe' onClick={handlePrevImage}/>
                        <img src={currentImage} alt={pet.name} className="swipe-pet-images" />
                        <FaChevronRight className='arrow-icon-right-swipe' onClick={handleNextImage}/>
                    </div>
                ) :
                    (pet?.PetImages?.map((image, index) => (
                        <div key={index}><img className='swipe-pet-image' src={image.url}/></div>
                    )))
                }
                {/* {pet?.PetImages?.map((image, index) => (
                    <div key={index} className="pet-images">
                        <img
                            src={image.url}
                            alt={`${pet.name}'s images`}
                        />
                    </div>
                ))} */}
                <div className="swipe-details-container">
                    {currentUser.id !== pet.sellerId ? (
                        <button className="adopt-button" onClick={() => navigate(`/chat/${pet.sellerId}/${pet.id}`)}>Want to Adopt?</button>
                    ) : null}

                    <p className="pet-adoption-status"><strong>Adoption Status:</strong> {pet?.adoptionStatus}</p>
                    <h1 className="details-pet-name">{pet.name} &middot; {pet.breed}</h1>
                    <p className="details-description">{pet.description}</p>
                    <p className="details-age-sex-size">
                        <strong>{pet.age} &middot; {pet.sex} &middot; {SIZE_DISPLAY[pet.size]}</strong>
                    </p>
                    <p className="details-lifestyle">
                        <strong>Lifestyle:</strong> {LIFESTYLE_DISPLAY[pet.lifestyle]} &middot; <strong>Love Language:</strong> {LOVE_LANGUAGE_DISPLAY[pet.loveLanguage]}
                    </p>

                    <hr className="details-divider" />

                    <div className="details-attributes">
                        <p><span>House Trained:</span> <strong className={pet.houseTrained ? "yes" : "no"}>{pet.houseTrained ? "Yes" : "No"}</strong></p>
                        <p><span>Good with Kids:</span> <strong className={pet.kids ? "yes" : "no"}>{pet.kids ? "Yes" : "No"}</strong></p>
                        <p><span>Good with Other Pets:</span> <strong className={pet.otherPet ? "yes" : "no"}>{pet.otherPet ? "Yes" : "No"}</strong></p>
                        <p><span>Owner Surrender:</span> <strong className={pet.ownerSurrender ? "yes" : "no"}>{pet.ownerSurrender ? "Yes" : "No"}</strong></p>
                        <p><span>Vaccinated:</span> <strong className={pet.vaccinated ? "yes" : "no"}>{pet.vaccinated ? "Yes" : "No"}</strong></p>
                        <p><span>Special Needs:</span> <strong className={pet.specialNeeds ? "yes" : "no"}>{pet.specialNeeds ? "Yes" : "No"}</strong></p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PetDetails;
