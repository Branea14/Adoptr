import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getViewedPetDetailsThunk } from "../../redux/pets"
import { useParams } from "react-router-dom"
import "./PetDetails.css"

const PetDetails = () => {
    const dispatch = useDispatch()
    const { petId } = useParams()
    const [loading, setLoading] = useState(true)

    const pet = useSelector((state) => state.pet.viewedPetDetails)

    useEffect(() => {
        setLoading(true)
        Promise.all([
            dispatch(getViewedPetDetailsThunk(petId))
        ]).finally(() => setLoading(false))
    }, [dispatch, petId])

    return (
        <div className="pet-details-container">
            {pet?.PetImages.map((image, index) => (
                <div key={index} className="pet-images">
                    <img
                        src={image.url}
                        alt={`${pet.name}'s images`}
                    />
                </div>
            ))}
            <button>Want to Adopt?</button>
            <div className="pet-name">{pet.name}</div>
            <div className="pet-description">{pet.description}</div>
            <div className="pet-breed">{pet.breed}</div>
            <div className="pet-color">Color: {pet.color}</div>
            <div className="pet-otherPets">Good with other pets? {pet.otherPets}</div>
            <div className="pet-age">Age: {pet.age}</div>
            <div className="pet-sex">{pet.sex}</div>
            <div className="pet-size">Size: {pet.size}</div>
            <div className="pet-adoptionStatus">Adoption Status: {pet.adoptionStatus}</div>
            <div className="pet-loveLanguage">Love Language: {pet.loveLanguage}</div>
            <div className="pet-lifestyle">Lifestyle: {pet.lifestyle}</div>
            <div className="pet-vaccinated">Vaccinated? {pet.vaccinated.toString()}</div>
            <div className="pet-ownerSurrender">Owner Surrender? {pet.ownerSurrender.toString()}</div>
            <div className="pet-kids">Good with Kids? {pet.kids.toString()}</div>
            <div className="pet-houseTrained">House-Trained?{pet.houseTrained.toString()}</div>
            <div className="pet-specialNeeds">Special Needs? {pet.specialNeeds.toString()}</div>

        </div>
    )
}

export default PetDetails;
