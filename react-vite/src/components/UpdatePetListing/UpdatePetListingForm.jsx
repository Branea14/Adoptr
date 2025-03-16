import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updatePet } from "../../redux/pets";
import "../CreatePets/CreatePets.css"
import { FaArrowLeft } from "react-icons/fa";

const UpdatePetListingForm = ({pet}) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('') //text field
    const [breed, setBreed] = useState('')
    // boolean /radio
    const [vaccinated, setVaccinated] = useState(null)
    const [ownerSurrender, setOwnerSurrender] = useState(null)
    const [kids, setKids] = useState(null)
    const [houseTrained, setHouseTrained] = useState(null)
    const [specialNeeds, setSpecialNeeds] = useState(null)
    //radio
    const [otherPets, setOtherPets] = useState(null)
    const [age, setAge] = useState(null)
    const [sex, setSex] = useState(null)
    const [size, setSize] = useState(null)
    const [adoptionStatus, setAdoptionStatus] = useState(null)
    const [loveLanguage, setLoveLanguage] = useState(null)
    const [lifestyle, setLifestyle] = useState(null)
    const [images, setImages] = useState([])
    const [imageUrl, setImageUrl] = useState("") //input fields
    const [editingIndex, setEditingIndex] = useState(null) //tracks image being edited
    const [errors, setErrors] = useState({})
    const [validationErrors, setValidationErrors] = useState({})

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {petId} = useParams()

    useEffect(() => {
        if (pet) {
            console.log('pet data', pet)

            setName(pet.name || "")
            setDescription(pet.description || "")
            setBreed(pet.breed || "")
            setVaccinated(pet.vaccinated !== undefined ? pet.vaccinated : null)
            setOwnerSurrender(pet.ownerSurrender !== undefined ? pet.ownerSurrender : null)
            setKids(pet.kids !== undefined ? pet.kids : null)
            setHouseTrained(pet.houseTrained !== undefined ? pet.houseTrained : null)
            setSpecialNeeds(pet.specialNeeds !== undefined ? pet.specialNeeds : null)
            setOtherPets(pet.otherPets || null)
            setAge(pet.age || null)
            setSex(pet.sex || null)
            setSize(pet.size || null)
            setAdoptionStatus(pet.adoptionStatus || null)
            setLoveLanguage(pet.loveLanguage || null)
            setLifestyle(pet.lifestyle || null)
            setImages(pet.PetImages || [])
            // setImageUrl(pet.imageUrl || "")
        }
    }, [pet])

    const updateName = (e) => setName(e.target.value)
    const updateDescription = (e) => setDescription(e.target.value)
    const updateBreed = (e) => setBreed(e.target.value)
    const updateVaccinated = (e) => setVaccinated(e.target.value === 'true' ? true : false)
    const updateOwnerSurrender = (e) => setOwnerSurrender(e.target.value === 'true' ? true : false)
    const updateKids = (e) => setKids(e.target.value === 'true' ? true : false)
    const updateHouseTrained = (e) => setHouseTrained(e.target.value === 'true' ? true : false)
    const updateSpecialNeeds = (e) => setSpecialNeeds(e.target.value === 'true' ? true : false)
    const updateOtherPets = (e) => setOtherPets(e.target.value)
    const updateAge = (e) => setAge(e.target.value)
    const updateSex = (e) => setSex(e.target.value)
    const updateSize = (e) => setSize(e.target.value)
    const updateAdoptionStatus = (e) => setAdoptionStatus(e.target.value)
    const updateLoveLanguage = (e) => setLoveLanguage(e.target.value)
    const updateLifestyle = (e) => setLifestyle(e.target.value)
    const handleAddorEditImage = () => {
        if (editingIndex !== null) {
            setImages(prevImages =>
                prevImages.map((img, index) =>
                    index === editingIndex ? { ...img, url: imageUrl} : img
                )
            )
            setEditingIndex(null)
        } else {
            setImages(prevImages => [...prevImages, {url: imageUrl, preview: false}])
        }
        setImageUrl("")
    }
    const setPreviewImage = (index) => {
        setImages(prevImages =>
            prevImages.map((img, i) =>
                i === index ? { ...img, preview: true} : { ...img, preview: false}
            )
        )
    }
    const removeImage = (index) => {
        setImages(prevImages => prevImages.filter((img, i) => i !== index))
    }
    const handleEditImage = (index) => {
        setImageUrl(images[index].url)
        setEditingIndex(index)
    }

    useEffect(() => {
        const newErrors = {}

        if (!name.trim()) newErrors.name = "Name is required"
        if (!description) newErrors.description = "Description is required"
        if (!breed || breed?.length <= 50) newErrors.breed = "Breed is required"
        if (vaccinated === null) newErrors.vaccinated = "Please answer question."
        if (ownerSurrender === null) newErrors.ownerSurrender = "Please answer question."
        if (kids === null) newErrors.kids = "Please answer question."
        if (houseTrained === null) newErrors.houseTrained = "Please answer question."
        if (specialNeeds === null) newErrors.specialNeeds = "Please answer question."
        if (otherPets === null) newErrors.otherPets = "Please answer question."
        if (age === null) newErrors.age = "Please answer question."
        if (sex === null) newErrors.sex = "Please answer question."
        if (size === null) newErrors.size = "Please answer question."
        if (adoptionStatus === null) newErrors.adoptionStatus = "Please answer question."
        if (loveLanguage === null) newErrors.loveLanguage = "Please answer question."
        if (lifestyle === null) newErrors.lifestyle = "Please answer question."
        if (images.length === 0) newErrors.images = "A pet listing must have at least one photo"

        setValidationErrors(newErrors)
    }, [name, images, description, breed, vaccinated, ownerSurrender, kids, houseTrained, specialNeeds, otherPets, age, sex, size, adoptionStatus, loveLanguage, lifestyle])



    const handleSubmit = async (e) => {
        e.preventDefault()

        const newErrors = {}
        if (!name.trim()) newErrors.name = "Name is required"
        if (!description) newErrors.description = "Description is required"
        if (!breed && breed?.length <= 50) newErrors.breed = "Breed is required"
        if (vaccinated === null) newErrors.vaccinated = "Please answer question."
        if (ownerSurrender === null) newErrors.ownerSurrender = "Please answer question."
        if (kids === null) newErrors.kids = "Please answer question."
        if (houseTrained === null) newErrors.houseTrained = "Please answer question."
        if (specialNeeds === null) newErrors.specialNeeds = "Please answer question."
        if (otherPets === null) newErrors.otherPets = "Please answer question."
        if (age === null) newErrors.age = "Please answer question."
        if (sex === null) newErrors.sex = "Please answer question."
        if (size === null) newErrors.size = "Please answer question."
        if (adoptionStatus === null) newErrors.adoptionStatus = "Please answer question."
        if (loveLanguage === null) newErrors.loveLanguage = "Please answer question."
        if (lifestyle === null) newErrors.lifestyle = "Please answer question."
        if (images.length === 0) newErrors.images = "A pet listing must have at least one photo"

        if (Object.keys(newErrors).length > 0) {
            return setErrors((prev) => ({ ...prev, ...newErrors}))
        }

        setErrors({})
        setValidationErrors({})

        const serverResponse = await dispatch(
            updatePet({
                id: parseInt(petId),
                name,
                description,
                breed,
                vaccinated: Boolean(vaccinated),
                ownerSurrender: Boolean(ownerSurrender),
                kids: Boolean(kids),
                houseTrained: Boolean(houseTrained),
                specialNeeds: Boolean(specialNeeds),
                otherPets,
                age,
                sex,
                size,
                adoptionStatus,
                loveLanguage,
                lifestyle,
                images
            })
        )

        console.log('LOOOOOOOOK HERE /pets/', serverResponse)
        if (serverResponse) {
            if(serverResponse.errors) setErrors(serverResponse.errors)
            else if (typeof serverResponse === 'object') setErrors(serverResponse)
            else setErrors({ general: serverResponse })

            if (!serverResponse.errors) {
                setErrors({})
                setValidationErrors({})
                navigate(`/pets/${petId}`)
            }
        } else {
            setErrors({})
            setValidationErrors({})
        }
    }


    return (
<div className="create-pet-container">
    <FaArrowLeft className="back-arrow-pet-details" onClick={() => navigate('/pets/current')}/>
    <form className="create-pet-form" onSubmit={handleSubmit}>
        <div className="create-pet-header">
            <h1>Update Pet Listing</h1>
        </div>
        {errors.general && (
            <div className="error-banner">
                {errors.general}
            </div>
        )}

        <label>
            Name
            <input
                type="text"
                value={name || ""}
                onChange={updateName}
                placeholder="Name"
                className={errors.name ? 'error' : ''}
                required
            />
            {errors.name && <p className="create-pet-error-message">{errors.name}</p>}
        </label>

        <label>
            Description
            <textarea
                value={description || ""}
                onChange={updateDescription}
                className={errors.description ? 'error textarea-input' : 'textarea-input'}
                required
                rows='4'
            />
            {errors.description && <p className="create-pet-error-message">{errors.description}</p>}
        </label>

        <label>
            Breed
            <input
                type="text"
                value={breed || ""}
                onChange={updateBreed}
                placeholder="Breed"
                className={errors.breed ? 'error' : ''}
                required
            />
            {errors.breed && <p className="create-pet-error-message">{errors.breed}</p>}
        </label>

        <div className="split-columns">
            <div className="column">

                <div className="form-section">
                    <label className="form-section-label">Age</label>
                    <div className="radio-group">
                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='age'
                            value='puppy'
                            checked={age === "puppy"}
                            onChange={updateAge}
                            required
                            />Puppy
                        </label>

                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='age'
                            value='young'
                            checked={age === "young"}
                            onChange={updateAge}
                            required
                            />Young
                        </label >

                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='age'
                            value='adult'
                            checked={age === "adult"}
                            onChange={updateAge}
                            required
                            />Adult
                        </label>

                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='age'
                            value='senior'
                            checked={age === "senior"}
                            onChange={updateAge}
                            required
                            />Senior
                        </label>
                    </div>
                    {errors.age && <p className="create-pet-error-message">{errors.age}</p>}
                    {validationErrors.age && <p className="create-pet-error-message">{validationErrors.age}</p>}
                </div>

                <div className="form-section">
                    <label className="form-section-label">Sex</label>
                    <div className="radio-group">
                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='sex'
                            value='male'
                            checked={sex === "male"}
                            onChange={updateSex}
                            required
                            />Male
                        </label>

                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='sex'
                            value='female'
                            checked={sex === "female"}
                            onChange={updateSex}
                            required
                            />Female
                        </label>
                    </div>
                    {errors.sex && <p className="create-pet-error-message">{errors.sex}</p>}
                    {validationErrors.sex && <p className="create-pet-error-message">{validationErrors.sex}</p>}
                </div>

                <div className="form-section">
                    <label className="form-section-label">Size</label>
                    <div className="radio-group">
                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='size'
                            value='small'
                            checked={size === "small"}
                            onChange={updateSize}
                            required
                            />Small
                        </label>

                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='size'
                            value='medium'
                            checked={size === "medium"}
                            onChange={updateSize}
                            required
                            />Medium
                        </label>

                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='size'
                            value='large'
                            checked={size === "large"}
                            onChange={updateSize}
                            required
                            />Large
                        </label>

                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='size'
                            value='xl'
                            checked={size === "xl"}
                            onChange={updateSize}
                            required
                            />XLarge
                        </label>
                    </div>
                    {errors.size && <p className="create-pet-error-message">{errors.size}</p>}
                    {validationErrors.size && <p className="create-pet-error-message">{validationErrors.size}</p>}
                </div>

                <div className="form-section">
                    <label className="form-section-label">House-Trained?</label>
                    <div className="radio-group">
                        <label className="radio-group-label">
                            <input
                                type="radio"
                                name="houseTrained"
                                value="true"
                                checked={houseTrained === true}
                                onChange={updateHouseTrained}
                                required
                            /> Yes
                        </label>

                        <label className="radio-group-label">
                            <input
                                type="radio"
                                name="houseTrained"
                                value="false"
                                checked={houseTrained === false}
                                onChange={updateHouseTrained}
                                required
                            /> No
                        </label>
                    </div>
                    {errors.houseTrained && <p className="create-pet-error-message">{errors.houseTrained}</p>}
                    {validationErrors.houseTrained && <p className="create-pet-error-message">{validationErrors.houseTrained}</p>}
                </div>

                <div className="form-section">
                    <label className="form-section-label">Special Needs?</label>
                    <div className="radio-group">
                        <label className="radio-group-label">
                            <input
                                type="radio"
                                name="specialNeeds"
                                value="true"
                                checked={specialNeeds === true}
                                onChange={updateSpecialNeeds}
                                required
                            /> Yes
                        </label>

                        <label className="radio-group-label">
                            <input
                                type="radio"
                                name="specialNeeds"
                                value="false"
                                checked={specialNeeds === false}
                                onChange={updateSpecialNeeds}
                                required
                            /> No
                        </label>
                    </div>
                    {errors.specialNeeds && <p className="create-pet-error-message">{errors.specialNeeds}</p>}
                    {validationErrors.specialNeeds && <p className="create-pet-error-message">{validationErrors.specialNeeds}</p>}
                </div>

                <div className="form-section">
                    <label className="form-section-label">Vaccinated?</label>
                    <div className="radio-group">
                        <label className="radio-group-label">
                            <input
                                type="radio"
                                name="vaccinated"
                                value="true"
                                checked={vaccinated === true}
                                onChange={updateVaccinated}
                                required
                            /> Yes
                        </label>

                        <label className="radio-group-label">
                            <input
                                type="radio"
                                name="vaccinated"
                                value="false"
                                checked={vaccinated === false}
                                onChange={updateVaccinated}
                                required
                            /> No
                        </label>
                    </div>
                    {errors.vaccinated && <p className="create-pet-error-message">{errors.vaccinated}</p>}
                    {validationErrors.vaccinated && <p className="create-pet-error-message">{validationErrors.vaccinated}</p>}
                </div>

                <div className="form-section">
                    <label className="form-section-label">Need to be rehomed?</label>
                    <div className="radio-group">
                        <label className="radio-group-label">
                            <input
                                type="radio"
                                name="ownerSurrender"
                                value="true"
                                checked={ownerSurrender === true}
                                onChange={updateOwnerSurrender}
                            /> Yes
                        </label>

                        <label className="radio-group-label">
                            <input
                                type="radio"
                                name="ownerSurrender"
                                value="false"
                                checked={ownerSurrender === false}
                                onChange={updateOwnerSurrender}

                            /> No
                        </label>
                    </div>
                    {errors.ownerSurrender && <p className="create-pet-error-message">{errors.ownerSurrender}</p>}
                    {validationErrors.ownerSurrender && <p className="create-pet-error-message">{validationErrors.ownerSurrender}</p>}
                </div>
            </div>


            <div className="column">
                <div className="form-section">
                    <label className="form-section-label">Good with kids?</label>
                    <div className="radio-group">
                        <label className="radio-group-label">
                            <input
                                type="radio"
                                name="kids"
                                value="true"
                                checked={kids === true}
                                onChange={updateKids}
                                required
                            /> Yes
                        </label>

                        <label className="radio-group-label">
                            <input
                                type="radio"
                                name="kids"
                                value="false"
                                checked={kids === false}
                                onChange={updateKids}
                                required
                            /> No
                        </label>
                    </div>
                    {errors.kids && <p className="create-pet-error-message">{errors.kids}</p>}
                    {validationErrors.kids && <p className="create-pet-error-message">{validationErrors.kids}</p>}
                </div>

                <div className="form-section">
                    <label className="form-section-label">Good with other pets?</label>
                    <div className="radio-group">
                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='otherPets'
                            value='none'
                            checked={otherPets === "none"}
                            onChange={updateOtherPets}
                            required
                            />None
                        </label>

                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='otherPets'
                            value='dogsOnly'
                            checked={otherPets === "dogsOnly"}
                            onChange={updateOtherPets}
                            required
                            />Dogs Only
                        </label>

                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='otherPets'
                            value='catsOnly'
                            checked={otherPets === "catsOnly"}
                            onChange={updateOtherPets}
                            required
                            />Cats Only
                        </label>

                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='otherPets'
                            value='both'
                            checked={otherPets === "both"}
                            onChange={updateOtherPets}
                            required
                            />Both
                        </label>

                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='otherPets'
                            value='other'
                            checked={otherPets === "other"}
                            onChange={updateOtherPets}
                            required
                            />Other
                        </label>
                    </div>
                    {errors.otherPets && <p className="create-pet-error-message">{errors.otherPets}</p>}
                    {validationErrors.otherPets && <p className="create-pet-error-message">{validationErrors.otherPets}</p>}
                </div>

                <div className="form-section">
                    <label className="form-section-label">Love Language</label>
                    <div className="radio-group">
                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='loveLanguage'
                            value='physicalTouch'
                            checked={loveLanguage === "physicalTouch"}
                            onChange={updateLoveLanguage}
                            required
                            />Physical Touch
                        </label>

                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='loveLanguage'
                            value='treats'
                            checked={loveLanguage === "treats"}
                            onChange={updateLoveLanguage}
                            required
                            />Treats
                        </label>

                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='loveLanguage'
                            value='play'
                            checked={loveLanguage === "play"}
                            onChange={updateLoveLanguage}
                            required
                            />Play
                        </label>

                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='loveLanguage'
                            value='training'
                            checked={loveLanguage === "training"}
                            onChange={updateLoveLanguage}
                            required
                            />Training
                        </label>

                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='loveLanguage'
                            value='independent'
                            checked={loveLanguage === "independent"}
                            onChange={updateLoveLanguage}
                            required
                            />Independent
                        </label>
                    </div>
                    {errors.loveLanguage && <p className="create-pet-error-message">{errors.loveLanguage}</p>}
                    {validationErrors.loveLanguage && <p className="create-pet-error-message">{validationErrors.loveLanguage}</p>}
                </div>

                <div className="form-section">
                    <label className="form-section-label">Lifestyle</label>
                    <div className="radio-group">
                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='lifestyle'
                            value='veryActive'
                            checked={lifestyle === "veryActive"}
                            onChange={updateLifestyle}
                            required
                            />Very Active
                        </label>

                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='lifestyle'
                            value='active'
                            checked={lifestyle === "active"}
                            onChange={updateLifestyle}
                            required
                            />Active
                        </label>

                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='lifestyle'
                            value='laidback'
                            checked={lifestyle === "laidback"}
                            onChange={updateLifestyle}
                            required
                            />Laid-back
                        </label>

                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='lifestyle'
                            value='lapPet'
                            checked={lifestyle === "lapPet"}
                            onChange={updateLifestyle}
                            required
                            />Lap Pet
                        </label>
                    </div>
                    {errors.lifestyle && <p className="create-pet-error-message">{errors.lifestyle}</p>}
                    {validationErrors.lifestyle && <p className="create-pet-error-message">{validationErrors.lifestyle}</p>}
                </div>

                <div className="form-section">
                    <label className="form-section-label">Adoption Status</label>
                    <div className="radio-group">
                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='adoptionStatus'
                            value='available'
                            checked={adoptionStatus === "available"}
                            onChange={updateAdoptionStatus}
                            required
                            />Available
                        </label>

                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='adoptionStatus'
                            value='pendingAdoption'
                            checked={adoptionStatus === "pendingAdoption"}
                            onChange={updateAdoptionStatus}
                            required
                            />Pending Adoption
                        </label>

                        <label className="radio-group-label">
                            <input
                            type="radio"
                            name='adoptionStatus'
                            value='adopted'
                            checked={adoptionStatus === "adopted"}
                            onChange={updateAdoptionStatus}
                            required
                            />Adopted
                        </label>
                    </div>
                    {errors.adoptionStatus && <p className="create-pet-error-message">{errors.adoptionStatus}</p>}
                    {validationErrors.adoptionStatus && <p className="create-pet-error-message">{validationErrors.adoptionStatus}</p>}
                </div>

            </div>
            </div>

                    <label>Image URL</label>
                    {errors.images && <p className="create-pet-error-message">{errors.images}</p>}
                    {validationErrors.images && <p className="create-pet-error-message">{validationErrors.images}</p>}
                    <input
                        type='text'
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Enter Image URL"
                    />
                    <button type="button" onClick={handleAddorEditImage}>Add Image</button>
                    <div className="image-preview-container">
                        {images.map((img, index) => (
                            <div key={index} className="image-preview">
                                <img src={img.url} alt={`Uploaded ${index}`} width="100"/>
                                <button type="button" onClick={() => setPreviewImage(index)}>
                                    {img.preview ? "Preview ✅" : "Set as Preview"}
                                </button>
                                <button type="button" onClick={() => handleEditImage(index)}>Edit</button>
                                <button type="button" onClick={() => removeImage(index)}>Remove</button>
                            </div>
                        ))}
                    </div>
                    <button type="submit" onClick={() => navigate(``)}>Edit Pet Listing</button>
                </form>

            </div>
    )
}

export default UpdatePetListingForm;
