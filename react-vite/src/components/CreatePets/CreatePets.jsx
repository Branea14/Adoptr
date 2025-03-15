import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createPet } from "../../redux/pets";
import "./CreatePets.css"
import { useNavigate } from "react-router-dom";

const CreatePets = () => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('') //text field
    const [breed, setBreed] = useState('')
    const [color, setColor] = useState('')
    // boolean /radio
    const [vaccinated, setVaccinated] = useState(null)
    const [ownerSurrender, setOwnerSurrender] = useState(null)
    const [kids, setKids] = useState(null)
    const [houseTrained, setHouseTrained] = useState(null)
    const [specialNeeds, setSpecialNeeds] = useState(null)
    //checkbox
    const [otherPets, setOtherPets] = useState(null)
    //radio
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
        if (!color || color?.length > 50) newErrors.color = "Color is required"

        if (vaccinated === null) newErrors.vaccinated = "Please answer question."
        if (ownerSurrender === null) newErrors.ownerSurrender = "Please answer question."
        if (kids === null) newErrors.kids = "Please answer question."
        if (houseTrained === null) newErrors.houseTrained = "Please answer question."
        if (specialNeeds === null) newErrors.specialNeeds = "Please answer question."

        // if (otherPets.length === 0) newErrors.otherPets = "Please make selection(s)"
        if (otherPets === null) newErrors.otherPets = "Please answer question."


        if (age === null) newErrors.age = "Please answer question."
        if (sex === null) newErrors.sex = "Please answer question."
        if (size === null) newErrors.size = "Please answer question."
        if (adoptionStatus === null) newErrors.adoptionStatus = "Please answer question."
        if (loveLanguage === null) newErrors.loveLanguage = "Please answer question."
        if (lifestyle === null) newErrors.lifestyle = "Please answer question."

        setValidationErrors(newErrors)
    }, [name, description, breed, color, vaccinated, ownerSurrender, kids, houseTrained, specialNeeds, otherPets, age, sex, size, adoptionStatus, loveLanguage, lifestyle])


    const handleSubmit = async (e) => {
        e.preventDefault()

        const newErrors = {}
        if (!name.trim()) newErrors.name = "Name is required"
        if (!description) newErrors.description = "Description is required"
        if (!breed && breed?.length <= 50) newErrors.breed = "Breed is required"
        if (!color && color?.length <= 50) newErrors.color = "Color is required"

        if (vaccinated === null) newErrors.vaccinated = "Please answer question."
        if (ownerSurrender === null) newErrors.ownerSurrender = "Please answer question."
        if (kids === null) newErrors.kids = "Please answer question."
        if (houseTrained === null) newErrors.houseTrained = "Please answer question."
        if (specialNeeds === null) newErrors.specialNeeds = "Please answer question."

        if (otherPets === null) newErrors.otherPets = "Please answer question."

        // if (otherPets.length === 0) newErrors.otherPets = "Please make selection(s)"

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
                color,
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

    // const handleOtherPetsChange = (e) => {
    //     const {value, checked} = e.target
    //     setOtherPets((prev) =>
    //         checked ? [ ...prev, value ] : prev.filter((pet) => pet !== value)
    //     )
    // }

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
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        className={errors.description ? 'error' : ''}
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


                <label>
                    Color
                    <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="Color"
                        className={errors.color ? 'error' : ''}
                        required
                    />
                    {errors.color && <p className="create-pet-error-message">{errors.color}</p>}
                </label>

                <label>Vaccinated?</label>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="vaccinated"
                            value="true"
                            checked={vaccinated === true}
                            onChange={() => setVaccinated(true)}
                            required
                        /> Yes
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="vaccinated"
                            value="false"
                            checked={vaccinated === false}
                            onChange={() => setVaccinated(false)}
                            required
                        /> No
                    </label>
                        {errors.vaccinated && <p className="create-pet-error-message">{errors.vaccinated}</p>}
                        {validationErrors.vaccinated && <p className="create-pet-error-message">{validationErrors.vaccinated}</p>}
                </div>

                <label>Need to be rehomed? (Owner Surrender)</label>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="ownerSurrender"
                            value="true"
                            checked={ownerSurrender === true}
                            onChange={() => setOwnerSurrender(true)}
                            required
                        /> Yes
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="ownerSurrender"
                            value="false"
                            checked={ownerSurrender === false}
                            onChange={() => setOwnerSurrender(false)}
                            required
                        /> No
                    </label>
                        {errors.ownerSurrender && <p className="create-pet-error-message">{errors.ownerSurrender}</p>}
                        {validationErrors.ownerSurrender && <p className="create-pet-error-message">{validationErrors.ownerSurrender}</p>}
                </div>

                <label>Good with kids?</label>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="kids"
                            value="true"
                            checked={kids === true}
                            onChange={() => setKids(true)}
                            required
                        /> Yes
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="kids"
                            value="false"
                            checked={kids === false}
                            onChange={() => setKids(false)}
                            required
                        /> No
                    </label>
                        {errors.kids && <p className="create-pet-error-message">{errors.kids}</p>}
                        {validationErrors.kids && <p className="create-pet-error-message">{validationErrors.kids}</p>}
                </div>

                <label>House-Trained?</label>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="houseTrained"
                            value="true"
                            checked={houseTrained === true}
                            onChange={() => setHouseTrained(true)}
                            required
                        /> Yes
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="houseTrained"
                            value="false"
                            checked={houseTrained === false}
                            onChange={() => setHouseTrained(false)}
                            required
                        /> No
                    </label>
                        {errors.houseTrained && <p className="create-pet-error-message">{errors.houseTrained}</p>}
                        {validationErrors.houseTrained && <p className="create-pet-error-message">{validationErrors.houseTrained}</p>}
                </div>

                <label>Special Needs?</label>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="specialNeeds"
                            value="true"
                            checked={specialNeeds === true}
                            onChange={() => setSpecialNeeds(true)}
                            required
                        /> Yes
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="specialNeeds"
                            value="false"
                            checked={specialNeeds === false}
                            onChange={() => setSpecialNeeds(false)}
                            required
                        /> No
                    </label>
                        {errors.specialNeeds && <p className="create-pet-error-message">{errors.specialNeeds}</p>}
                        {validationErrors.specialNeeds && <p className="create-pet-error-message">{validationErrors.specialNeeds}</p>}
                </div>

                {/* <label>Good with other pets?</label>
                <div>
                    <input
                    type="checkbox"
                    id='none'
                    value='none'
                    checked={otherPets.includes("none")}
                    onChange={handleOtherPetsChange}
                    />
                    <label htmlFor='none'>None</label>

                    <input
                    type="checkbox"
                    id='dogs'
                    value='dogsOnly'
                    checked={otherPets.includes("dogsOnly")}
                    onChange={handleOtherPetsChange}
                    />
                    <label htmlFor='dogs'>Dogs Only</label>

                    <input
                    type="checkbox"
                    id='cats'
                    value='catsOnly'
                    checked={otherPets.includes("catsOnly")}
                    onChange={handleOtherPetsChange}
                    />
                    <label htmlFor='cats'>Cats Only</label>

                    <input
                    type="checkbox"
                    id='both'
                    value='both'
                    checked={otherPets.includes("both")}
                    onChange={handleOtherPetsChange}
                    />
                    <label htmlFor='both'>Both</label>

                    <input
                    type="checkbox"
                    id='other'
                    value='other'
                    checked={otherPets.includes("other")}
                    onChange={handleOtherPetsChange}
                    />
                    <label htmlFor='other'>Other</label>
                </div> */}
<label>Good with other pets?</label>
                <div>
                <label>
                    <input
                    type="radio"
                    name='otherPets'
                    value='none'
                    checked={otherPets === "none"}
                    onChange={(e) => setOtherPets(e.target.value)}
                    required
                    />None
                </label>

                <label>
                    <input
                    type="radio"
                    name='otherPets'
                    value='dogsOnly'
                    checked={otherPets === "dogsOnly"}
                    onChange={(e) => setOtherPets(e.target.value)}
                    required
                    />Dogs Only
                </label>

                <label>
                    <input
                    type="radio"
                    name='otherPets'
                    value='catsOnly'
                    checked={otherPets === "catsOnly"}
                    onChange={(e) => setOtherPets(e.target.value)}
                    required
                    />Cats Only
                </label>

                <label>
                    <input
                    type="radio"
                    name='otherPets'
                    value='both'
                    checked={otherPets === "both"}
                    onChange={(e) => setOtherPets(e.target.value)}
                    required
                    />Both
                </label>

                <label>
                    <input
                    type="radio"
                    name='otherPets'
                    value='other'
                    checked={otherPets === "other"}
                    onChange={(e) => setOtherPets(e.target.value)}
                    required
                    />Other
                </label>
                    {errors.otherPets && <p className="create-pet-error-message">{errors.otherPets}</p>}
                    {validationErrors.otherPets && <p className="create-pet-error-message">{validationErrors.otherPets}</p>}
                </div>

                <label>Age</label>
                <div>
                <label>
                    <input
                    type="radio"
                    name='age'
                    value='puppy'
                    checked={age === "puppy"}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    />Puppy
                </label>

                <label>
                    <input
                    type="radio"
                    name='age'
                    value='young'
                    checked={age === "young"}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    />Young
                </label>

                <label>
                    <input
                    type="radio"
                    name='age'
                    value='adult'
                    checked={age === "adult"}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    />Adult
                </label>

                <label>
                    <input
                    type="radio"
                    name='age'
                    value='senior'
                    checked={age === "senior"}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    />Senior
                </label>
                    {errors.age && <p className="create-pet-error-message">{errors.age}</p>}
                    {validationErrors.age && <p className="create-pet-error-message">{validationErrors.age}</p>}
                </div>


                <label>Sex</label>
                <div>
                <label>
                    <input
                    type="radio"
                    name='sex'
                    value='male'
                    checked={sex === "male"}
                    onChange={(e) => setSex(e.target.value)}
                    required
                    />Male
                </label>

                <label>
                    <input
                    type="radio"
                    name='sex'
                    value='female'
                    checked={sex === "female"}
                    onChange={(e) => setSex(e.target.value)}
                    required
                    />Female
                </label>
                    {errors.sex && <p className="create-pet-error-message">{errors.sex}</p>}
                    {validationErrors.sex && <p className="create-pet-error-message">{validationErrors.sex}</p>}
                </div>

                <label>Size</label>
                <div>
                <label>
                    <input
                    type="radio"
                    name='size'
                    value='small'
                    checked={size === "small"}
                    onChange={(e) => setSize(e.target.value)}
                    required
                    />Small
                </label>

                <label>
                    <input
                    type="radio"
                    name='size'
                    value='medium'
                    checked={size === "medium"}
                    onChange={(e) => setSize(e.target.value)}
                    required
                    />Medium
                </label>

                <label>
                    <input
                    type="radio"
                    name='size'
                    value='large'
                    checked={size === "large"}
                    onChange={(e) => setSize(e.target.value)}
                    required
                    />Large
                </label>

                <label>
                    <input
                    type="radio"
                    name='size'
                    value='xl'
                    checked={size === "xl"}
                    onChange={(e) => setSize(e.target.value)}
                    required
                    />XLarge
                </label>
                    {errors.size && <p className="create-pet-error-message">{errors.size}</p>}
                    {validationErrors.size && <p className="create-pet-error-message">{validationErrors.size}</p>}
                </div>

                <label>Adoption Status</label>
                <div>
                <label>
                    <input
                    type="radio"
                    name='adoptionStatus'
                    value='available'
                    checked={adoptionStatus === "available"}
                    onChange={(e) => setAdoptionStatus(e.target.value)}
                    required
                    />Available
                </label>

                <label>
                    <input
                    type="radio"
                    name='adoptionStatus'
                    value='pendingAdoption'
                    checked={adoptionStatus === "pendingAdoption"}
                    onChange={(e) => setAdoptionStatus(e.target.value)}
                    required
                    />Pending Adoption
                </label>

                <label>
                    <input
                    type="radio"
                    name='adoptionStatus'
                    value='adopted'
                    checked={adoptionStatus === "adopted"}
                    onChange={(e) => setAdoptionStatus(e.target.value)}
                    required
                    />Adopted
                </label>
                    {errors.adoptionStatus && <p className="create-pet-error-message">{errors.adoptionStatus}</p>}
                    {validationErrors.adoptionStatus && <p className="create-pet-error-message">{validationErrors.adoptionStatus}</p>}
                </div>

                <label>Love Language</label>
                <div>
                <label>
                    <input
                    type="radio"
                    name='loveLanguage'
                    value='physicalTouch'
                    checked={loveLanguage === "physicalTouch"}
                    onChange={(e) => setLoveLanguage(e.target.value)}
                    required
                    />Physical Touch
                </label>

                <label>
                    <input
                    type="radio"
                    name='loveLanguage'
                    value='treats'
                    checked={loveLanguage === "treats"}
                    onChange={(e) => setLoveLanguage(e.target.value)}
                    required
                    />Treats
                </label>

                <label>
                    <input
                    type="radio"
                    name='loveLanguage'
                    value='play'
                    checked={loveLanguage === "play"}
                    onChange={(e) => setLoveLanguage(e.target.value)}
                    required
                    />Play
                </label>

                <label>
                    <input
                    type="radio"
                    name='loveLanguage'
                    value='training'
                    checked={loveLanguage === "training"}
                    onChange={(e) => setLoveLanguage(e.target.value)}
                    required
                    />Training
                </label>

                <label>
                    <input
                    type="radio"
                    name='loveLanguage'
                    value='independent'
                    checked={loveLanguage === "independent"}
                    onChange={(e) => setLoveLanguage(e.target.value)}
                    required
                    />Independent
                </label>
                    {errors.loveLanguage && <p className="create-pet-error-message">{errors.loveLanguage}</p>}
                    {validationErrors.loveLanguage && <p className="create-pet-error-message">{validationErrors.loveLanguage}</p>}
                </div>

                <label>Lifestyle</label>
                <div>
                <label>
                    <input
                    type="radio"
                    name='lifestyle'
                    value='veryActive'
                    checked={lifestyle === "veryActive"}
                    onChange={(e) => setLifestyle(e.target.value)}
                    required
                    />Very Active
                </label>

                <label>
                    <input
                    type="radio"
                    name='lifestyle'
                    value='active'
                    checked={lifestyle === "active"}
                    onChange={(e) => setLifestyle(e.target.value)}
                    required
                    />Active
                </label>

                <label>
                    <input
                    type="radio"
                    name='lifestyle'
                    value='laidback'
                    checked={lifestyle === "laidback"}
                    onChange={(e) => setLifestyle(e.target.value)}
                    required
                    />Laid-back
                </label>

                <label>
                    <input
                    type="radio"
                    name='lifestyle'
                    value='lapPet'
                    checked={lifestyle === "lapPet"}
                    onChange={(e) => setLifestyle(e.target.value)}
                    required
                    />Lap Pet
                </label>
                    {errors.lifestyle && <p className="create-pet-error-message">{errors.lifestyle}</p>}
                    {validationErrors.lifestyle && <p className="create-pet-error-message">{validationErrors.lifestyle}</p>}
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
