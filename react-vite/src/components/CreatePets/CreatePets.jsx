import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createPet } from "../../redux/pets";
import "./CreatePets.css"
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";


const CreatePets = () => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
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
    const [imageUrl, setImageUrl] = useState("")
    const [errors, setErrors] = useState({})
    const [validationErrors, setValidationErrors] = useState({})

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // client-side validation
    useEffect(() => {
        const newErrors = {}

        if (!name.trim()) newErrors.name = "Name is required"
        if (!description) newErrors.description = "Description is required"
        if (!breed || breed?.length > 50) newErrors.breed = "Breed is required"
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

        setValidationErrors(newErrors)
    }, [name, description, breed, vaccinated, ownerSurrender, kids, houseTrained, specialNeeds, otherPets, age, sex, size, adoptionStatus, loveLanguage, lifestyle])


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

        if (Object.keys(newErrors).length > 0) {
            return setErrors((prev) => ({ ...prev, ...newErrors}))
        }

        setErrors({})
        setValidationErrors({})

        const serverResponse = await dispatch(
            createPet({
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

        console.log('LOOOOOOOOK HERE /pets/', serverResponse.id)
        if (serverResponse) {
            if(serverResponse.errors) setErrors(serverResponse.errors)
            else if (typeof serverResponse === 'object') setErrors(serverResponse)
            else setErrors({ general: serverResponse })

            if (!serverResponse.errors && serverResponse.id) {
                setErrors({})
                setValidationErrors({})
                navigate(`/pets/${serverResponse.id}`)
            }
        }
        else {
            setErrors({})
            setValidationErrors({})
        }
    }

    const handleAddImage = () => {
        if (!imageUrl.trim()) return

        setImages((prevImages) => [
            ...prevImages,
            { url : imageUrl.trim(), preview: false}
        ])

        setImageUrl("")
    }

    const setPreviewImage = (index) => {
        setImages((prevImages) =>
            prevImages.map((img, i) => ({
                ...img,
                preview: i === index
            }))
        )
    }

    const removeImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index))
    }

    // handling files instead of urls
    // const handleImageUpload = (e) => {
    //     const files = Array.from(e.target.files)

    //     const newImages = files.map((file) => ({
    //         url: URL.createObjectURL(file),
    //         preview: false
    //     }))

    //     setImages((prevImages) => [ ...prevImages, newImages])
    // }

    // const setPreviewImage = (index) => {
    //     setImages((prevImages) =>
    //         prevImages.map((img, i) => ({
    //             ...img,
    //             preview: i === index
    //         }))
    //     )
    // }


    return (
        <div className="create-pet-container">
            <FaArrowLeft className="back-arrow-pet-details" onClick={() => navigate('/pets/current')}/>
            <form className="create-pet-form" onSubmit={handleSubmit}>
                <div className="create-pet-header">
                    <h1>Create a Pet Listing</h1>
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className={errors.name ? 'error' : ''}
                        required
                    />
                    {errors.name && <p className="create-pet-error-message">{errors.name}</p>}
                </label>

                <label>
                    Description
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={errors.description ? 'error textarea-input' : 'textarea-input'}
                        rows='4'
                        required
                    />
                    {errors.description && <p className="create-pet-error-message">{errors.description}</p>}
                </label>

                <label>
                    Breed
                    <input
                        type="text"
                        value={breed}
                        onChange={(e) => setBreed(e.target.value)}
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
                                    onChange={(e) => setAge(e.target.value)}
                                    required
                                    />Puppy
                                </label>

                                <label className="radio-group-label">
                                    <input
                                    type="radio"
                                    name='age'
                                    value='young'
                                    checked={age === "young"}
                                    onChange={(e) => setAge(e.target.value)}
                                    required
                                    />Young
                                </label>

                                <label className="radio-group-label">
                                    <input
                                    type="radio"
                                    name='age'
                                    value='adult'
                                    checked={age === "adult"}
                                    onChange={(e) => setAge(e.target.value)}
                                    required
                                    />Adult
                                </label>

                                <label className="radio-group-label">
                                    <input
                                    type="radio"
                                    name='age'
                                    value='senior'
                                    checked={age === "senior"}
                                    onChange={(e) => setAge(e.target.value)}
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
                                    onChange={(e) => setSex(e.target.value)}
                                    required
                                    />Male
                                </label>

                                <label className="radio-group-label">
                                    <input
                                    type="radio"
                                    name='sex'
                                    value='female'
                                    checked={sex === "female"}
                                    onChange={(e) => setSex(e.target.value)}
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
                                    onChange={(e) => setSize(e.target.value)}
                                    required
                                    />Small
                                </label>

                                <label className="radio-group-label">
                                    <input
                                    type="radio"
                                    name='size'
                                    value='medium'
                                    checked={size === "medium"}
                                    onChange={(e) => setSize(e.target.value)}
                                    required
                                    />Medium
                                </label>

                                <label className="radio-group-label">
                                    <input
                                    type="radio"
                                    name='size'
                                    value='large'
                                    checked={size === "large"}
                                    onChange={(e) => setSize(e.target.value)}
                                    required
                                    />Large
                                </label>

                                <label className="radio-group-label">
                                    <input
                                    type="radio"
                                    name='size'
                                    value='xl'
                                    checked={size === "xl"}
                                    onChange={(e) => setSize(e.target.value)}
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
                                        onChange={() => setHouseTrained(true)}
                                        required
                                    /> Yes
                                </label>

                                <label className="radio-group-label">
                                    <input
                                        type="radio"
                                        name="houseTrained"
                                        value="false"
                                        checked={houseTrained === false}
                                        onChange={() => setHouseTrained(false)}
                                        required
                                    /> No
                                </label >
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
                                        onChange={() => setSpecialNeeds(true)}
                                        required
                                    /> Yes
                                </label>

                                <label className="radio-group-label">
                                    <input
                                        type="radio"
                                        name="specialNeeds"
                                        value="false"
                                        checked={specialNeeds === false}
                                        onChange={() => setSpecialNeeds(false)}
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
                                        onChange={() => setVaccinated(true)}
                                        required
                                    /> Yes
                                </label>

                                <label className="radio-group-label">
                                    <input
                                        type="radio"
                                        name="vaccinated"
                                        value="false"
                                        checked={vaccinated === false}
                                        onChange={() => setVaccinated(false)}
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
                                        onChange={() => setOwnerSurrender(true)}
                                        required
                                    /> Yes
                                </label>

                                <label className="radio-group-label">
                                    <input
                                        type="radio"
                                        name="ownerSurrender"
                                        value="false"
                                        checked={ownerSurrender === false}
                                        onChange={() => setOwnerSurrender(false)}
                                        required
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
                                        onChange={() => setKids(true)}
                                        required
                                    /> Yes
                                </label>

                                <label className="radio-group-label">
                                    <input
                                        type="radio"
                                        name="kids"
                                        value="false"
                                        checked={kids === false}
                                        onChange={() => setKids(false)}
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
                                    onChange={(e) => setOtherPets(e.target.value)}
                                    required
                                    />None
                                </label>

                                <label className="radio-group-label">
                                    <input
                                    type="radio"
                                    name='otherPets'
                                    value='dogsOnly'
                                    checked={otherPets === "dogsOnly"}
                                    onChange={(e) => setOtherPets(e.target.value)}
                                    required
                                    />Dogs Only
                                </label>

                                <label className="radio-group-label">
                                    <input
                                    type="radio"
                                    name='otherPets'
                                    value='catsOnly'
                                    checked={otherPets === "catsOnly"}
                                    onChange={(e) => setOtherPets(e.target.value)}
                                    required
                                    />Cats Only
                                </label>

                                <label className="radio-group-label">
                                    <input
                                    type="radio"
                                    name='otherPets'
                                    value='both'
                                    checked={otherPets === "both"}
                                    onChange={(e) => setOtherPets(e.target.value)}
                                    required
                                    />Both
                                </label>

                                <label className="radio-group-label">
                                    <input
                                    type="radio"
                                    name='otherPets'
                                    value='other'
                                    checked={otherPets === "other"}
                                    onChange={(e) => setOtherPets(e.target.value)}
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
                                    onChange={(e) => setLoveLanguage(e.target.value)}
                                    required
                                    />Physical Touch
                                </label>

                                <label className="radio-group-label">
                                    <input
                                    type="radio"
                                    name='loveLanguage'
                                    value='treats'
                                    checked={loveLanguage === "treats"}
                                    onChange={(e) => setLoveLanguage(e.target.value)}
                                    required
                                    />Treats
                                </label>

                                <label className="radio-group-label">
                                    <input
                                    type="radio"
                                    name='loveLanguage'
                                    value='play'
                                    checked={loveLanguage === "play"}
                                    onChange={(e) => setLoveLanguage(e.target.value)}
                                    required
                                    />Play
                                </label>

                                <label className="radio-group-label">
                                    <input
                                    type="radio"
                                    name='loveLanguage'
                                    value='training'
                                    checked={loveLanguage === "training"}
                                    onChange={(e) => setLoveLanguage(e.target.value)}
                                    required
                                    />Training
                                </label>

                                <label className="radio-group-label">
                                    <input
                                    type="radio"
                                    name='loveLanguage'
                                    value='independent'
                                    checked={loveLanguage === "independent"}
                                    onChange={(e) => setLoveLanguage(e.target.value)}
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
                                    onChange={(e) => setLifestyle(e.target.value)}
                                    required
                                    />Very Active
                                </label>

                                <label className="radio-group-label">
                                    <input
                                    type="radio"
                                    name='lifestyle'
                                    value='active'
                                    checked={lifestyle === "active"}
                                    onChange={(e) => setLifestyle(e.target.value)}
                                    required
                                    />Active
                                </label>

                                <label className="radio-group-label">
                                    <input
                                    type="radio"
                                    name='lifestyle'
                                    value='laidback'
                                    checked={lifestyle === "laidback"}
                                    onChange={(e) => setLifestyle(e.target.value)}
                                    required
                                    />Laid-back
                                </label>

                                <label className="radio-group-label">
                                    <input
                                    type="radio"
                                    name='lifestyle'
                                    value='lapPet'
                                    checked={lifestyle === "lapPet"}
                                    onChange={(e) => setLifestyle(e.target.value)}
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
                                    onChange={(e) => setAdoptionStatus(e.target.value)}
                                    required
                                    />Available
                                </label>

                                <label className="radio-group-label">
                                    <input
                                    type="radio"
                                    name='adoptionStatus'
                                    value='pendingAdoption'
                                    checked={adoptionStatus === "pendingAdoption"}
                                    onChange={(e) => setAdoptionStatus(e.target.value)}
                                    required
                                    />Pending Adoption
                                </label>

                                <label className="radio-group-label">
                                    <input
                                    type="radio"
                                    name='adoptionStatus'
                                    value='adopted'
                                    checked={adoptionStatus === "adopted"}
                                    onChange={(e) => setAdoptionStatus(e.target.value)}
                                    required
                                    />Adopted
                                </label>
                            </div>
                            {errors.adoptionStatus && <p className={`create-pet-error-message ${errors.adoptionStatus ? "active" : ''}`}>{errors.adoptionStatus}</p>}
                            {validationErrors.adoptionStatus && <p className="create-pet-error-message">{validationErrors.adoptionStatus}</p>}
                        </div>

                    </div>
                </div>

                <label>Image URL</label>
                <input
                    type='text'
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Enter Image URL"
                />
                <button type="button" onClick={handleAddImage}>Add Image</button>
                <div className="image-preview-container">
                    {images.map((img, index) => (
                        <div key={index} className="image-preview">
                            <img src={img.url} alt={`Uploaded ${index}`} width="100"/>
                            <button type="button" onClick={() => setPreviewImage(index)}>
                                {img.preview ? "Preview ✅" : "Set as Preview"}
                            </button>
                            <button type="button" onClick={() => removeImage(index)}>Remove</button>
                        </div>
                    ))}
                </div>
                <button type="submit" onClick={() => navigate(``)}>Create Pet Listing</button>
            </form>

        </div>
    )
}

export default CreatePets;
