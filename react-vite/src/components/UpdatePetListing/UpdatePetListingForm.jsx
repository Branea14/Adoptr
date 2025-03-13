import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const UpdatePetListingForm = ({pet}) => {
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
    const [otherPets, setOtherPets] = useState([])
    //radio
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

    useEffect(() => {
        if (pet) {
            setName(pet.name || "")
            setDescription(pet.description || "")
            setBreed(pet.breed || "")
            setColor(pet.color || "")
            setVaccinated(pet.vaccinated || null)
            setOwnerSurrender(pet.ownerSurrender || null)
            setKids(pet.kids || null)
            setHouseTrained(pet.houseTrained || null)
            setSpecialNeeds(pet.specialNeeds || null)
            setOtherPets(pet.otherPets || [])
            setAge(pet.age || null)
            setSex(pet.sex || null)
            setSize(pet.size || null)
            setAdoptionStatus(pet.adoptionStatus || null)
            setLoveLanguage(pet.loveLanguage || null)
            setLifestyle(pet.lifestyle || null)
            setImages(pet.images || [])
            setImageUrl(pet.imageUrl || "")
        }
    }, [pet])

    const updateName = (e) => setName(e.target.value)
    const updateDescription = (e) => setDescription(e.target.value)
    const updateBreed = (e) => setBreed(e.target.value)
    const updateColor = (e) => setColor(e.target.value)
    const updateVaccinated = (e) => setVaccinated(!!e.target.value)
    const updateOwnerSurrender = (e) => setOwnerSurrender(!!e.target.value)
    const updateKids = (e) => setKids(!!e.target.value)
    const updateHouseTrained = (e) => setHouseTrained(!!e.target.value)
    const updateSpecialNeeds = (e) => setSpecialNeeds(!!e.target.value)
    const updateOtherPets = (e) => {
        const value = e.target.value
        setOtherPets(prevState => {
            if (e.target.checked) {
                return [...prevState, value] //add value to array
            } else {
                return prevState.filter(item => item !== value) //remove value from the array
            }
        })
    }
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
        if (!color || color?.length <= 50) newErrors.color = "Color is required"

        if (vaccinated === null) newErrors.vaccinated = "Please answer question."
        if (ownerSurrender === null) newErrors.ownerSurrender = "Please answer question."
        if (kids === null) newErrors.kids = "Please answer question."
        if (houseTrained === null) newErrors.houseTrained = "Please answer question."
        if (specialNeeds === null) newErrors.specialNeeds = "Please answer question."

        if (otherPets.length === 0) newErrors.otherPets = "Please make selection(s)"

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

        if (otherPets.length === 0) newErrors.otherPets = "Please make selection(s)"

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


    return (
<div className="edit-pet-container">
    <div className="edit-pet-title">Update Pet Listing</div>
            <form className="edit-pet-form" onSubmit={handleSubmit}>
                {/* <div className="edit-pet-header">
                    <h1>edit a Pet Listing</h1>
                </div> */}
                {/* {errors.general && (
                    <div className="error-banner">
                        {errors.general}
                    </div>
                )} */}

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
                    {errors.name && <p className="edit-pet-error-message">{errors.name}</p>}
                </label>

                <label>
                    Description
                    <input
                        type="text"
                        value={description || ""}
                        onChange={updateDescription}
                        placeholder="Description"
                        className={errors.description ? 'error' : ''}
                        required
                    />
                    {errors.description && <p className="edit-pet-error-message">{errors.description}</p>}
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
                    {errors.breed && <p className="edit-pet-error-message">{errors.breed}</p>}
                </label>


                <label>
                    Color
                    <input
                        type="text"
                        value={color || ""}
                        onChange={updateColor}
                        placeholder="Color"
                        className={errors.color ? 'error' : ''}
                        required
                    />
                    {errors.color && <p className="edit-pet-error-message">{errors.color}</p>}
                </label>

                <label>Vaccinated?</label>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="vaccinated"
                            value="true"
                            checked={vaccinated === true}
                            onChange={updateVaccinated}
                            required
                        /> Yes
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="vaccinated"
                            value="false"
                            checked={vaccinated === false}
                            onChange={updateVaccinated}
                            required
                        /> No
                    </label>
                        {errors.vaccinated && <p className="edit-pet-error-message">{errors.vaccinated}</p>}
                        {validationErrors.vaccinated && <p className="edit-pet-error-message">{validationErrors.vaccinated}</p>}
                </div>

                <label>Need to be rehomed? (Owner Surrender)</label>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="ownerSurrender"
                            value="true"
                            checked={ownerSurrender === true}
                            onChange={updateOwnerSurrender}
                            required
                        /> Yes
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="ownerSurrender"
                            value="false"
                            checked={ownerSurrender === false}
                            onChange={updateOwnerSurrender}
                            required
                        /> No
                    </label>
                        {errors.ownerSurrender && <p className="edit-pet-error-message">{errors.ownerSurrender}</p>}
                        {validationErrors.ownerSurrender && <p className="edit-pet-error-message">{validationErrors.ownerSurrender}</p>}
                </div>

                <label>Good with kids?</label>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="kids"
                            value="true"
                            checked={kids === true}
                            onChange={updateKids}
                            required
                        /> Yes
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="kids"
                            value="false"
                            checked={kids === false}
                            onChange={updateKids}
                            required
                        /> No
                    </label>
                        {errors.kids && <p className="edit-pet-error-message">{errors.kids}</p>}
                        {validationErrors.kids && <p className="edit-pet-error-message">{validationErrors.kids}</p>}
                </div>

                <label>House-Trained?</label>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="houseTrained"
                            value="true"
                            checked={houseTrained === true}
                            onChange={updateHouseTrained}
                            required
                        /> Yes
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="houseTrained"
                            value="false"
                            checked={houseTrained === false}
                            onChange={updateHouseTrained}
                            required
                        /> No
                    </label>
                        {errors.houseTrained && <p className="edit-pet-error-message">{errors.houseTrained}</p>}
                        {validationErrors.houseTrained && <p className="edit-pet-error-message">{validationErrors.houseTrained}</p>}
                </div>

                <label>Special Needs?</label>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="specialNeeds"
                            value="true"
                            checked={specialNeeds === true}
                            onChange={updateSpecialNeeds}
                            required
                        /> Yes
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="specialNeeds"
                            value="false"
                            checked={specialNeeds === false}
                            onChange={updateSpecialNeeds}
                            required
                        /> No
                    </label>
                        {errors.specialNeeds && <p className="edit-pet-error-message">{errors.specialNeeds}</p>}
                        {validationErrors.specialNeeds && <p className="edit-pet-error-message">{validationErrors.specialNeeds}</p>}
                </div>

                <label>Good with other pets?</label>
                <div>
                    <input
                    type="checkbox"
                    id='none'
                    value='none'
                    checked={otherPets.includes("none")}
                    onChange={updateOtherPets}
                    />
                    <label htmlFor='none'>None</label>

                    <input
                    type="checkbox"
                    id='dogs'
                    value='dogsOnly'
                    checked={otherPets.includes("dogsOnly")}
                    onChange={updateOtherPets}
                    />
                    <label htmlFor='dogs'>Dogs Only</label>

                    <input
                    type="checkbox"
                    id='cats'
                    value='catsOnly'
                    checked={otherPets.includes("catsOnly")}
                    onChange={updateOtherPets}
                    />
                    <label htmlFor='cats'>Cats Only</label>

                    <input
                    type="checkbox"
                    id='both'
                    value='both'
                    checked={otherPets.includes("both")}
                    onChange={updateOtherPets}
                    />
                    <label htmlFor='both'>Both</label>

                    <input
                    type="checkbox"
                    id='other'
                    value='other'
                    checked={otherPets.includes("other")}
                    onChange={updateOtherPets}
                    />
                    <label htmlFor='other'>Other</label>
                    {errors.otherPets && <p className="edit-pet-error-message">{errors.otherPets}</p>}
                    {validationErrors.otherPets && <p className="edit-pet-error-message">{validationErrors.otherPets}</p>}
                </div>

                <label>Age</label>
                <div>
                <label>
                    <input
                    type="radio"
                    name='age'
                    value='puppy'
                    checked={age === "puppy"}
                    onChange={updateAge}
                    required
                    />Puppy
                </label>

                <label>
                    <input
                    type="radio"
                    name='age'
                    value='young'
                    checked={age === "young"}
                    onChange={updateAge}
                    required
                    />Young
                </label>

                <label>
                    <input
                    type="radio"
                    name='age'
                    value='adult'
                    checked={age === "adult"}
                    onChange={updateAge}
                    required
                    />Adult
                </label>

                <label>
                    <input
                    type="radio"
                    name='age'
                    value='senior'
                    checked={age === "senior"}
                    onChange={updateAge}
                    required
                    />Senior
                </label>
                    {errors.age && <p className="edit-pet-error-message">{errors.age}</p>}
                    {validationErrors.age && <p className="edit-pet-error-message">{validationErrors.age}</p>}
                </div>


                <label>Sex</label>
                <div>
                <label>
                    <input
                    type="radio"
                    name='sex'
                    value='male'
                    checked={sex === "male"}
                    onChange={updateSex}
                    required
                    />Male
                </label>

                <label>
                    <input
                    type="radio"
                    name='sex'
                    value='female'
                    checked={sex === "female"}
                    onChange={updateSex}
                    required
                    />Female
                </label>
                    {errors.sex && <p className="edit-pet-error-message">{errors.sex}</p>}
                    {validationErrors.sex && <p className="edit-pet-error-message">{validationErrors.sex}</p>}
                </div>

                <label>Size</label>
                <div>
                <label>
                    <input
                    type="radio"
                    name='size'
                    value='small'
                    checked={size === "small"}
                    onChange={updateSize}
                    required
                    />Small
                </label>

                <label>
                    <input
                    type="radio"
                    name='size'
                    value='medium'
                    checked={size === "medium"}
                    onChange={updateSize}
                    required
                    />Medium
                </label>

                <label>
                    <input
                    type="radio"
                    name='size'
                    value='large'
                    checked={size === "large"}
                    onChange={updateSize}
                    required
                    />Large
                </label>

                <label>
                    <input
                    type="radio"
                    name='size'
                    value='xl'
                    checked={size === "xl"}
                    onChange={updateSize}
                    required
                    />XLarge
                </label>
                    {errors.size && <p className="edit-pet-error-message">{errors.size}</p>}
                    {validationErrors.size && <p className="edit-pet-error-message">{validationErrors.size}</p>}
                </div>

                <label>Adoption Status</label>
                <div>
                <label>
                    <input
                    type="radio"
                    name='adoptionStatus'
                    value='available'
                    checked={adoptionStatus === "available"}
                    onChange={updateAdoptionStatus}
                    required
                    />Available
                </label>

                <label>
                    <input
                    type="radio"
                    name='adoptionStatus'
                    value='pendingAdoption'
                    checked={adoptionStatus === "pendingAdoption"}
                    onChange={updateAdoptionStatus}
                    required
                    />Pending Adoption
                </label>

                <label>
                    <input
                    type="radio"
                    name='adoptionStatus'
                    value='adopted'
                    checked={adoptionStatus === "adopted"}
                    onChange={updateAdoptionStatus}
                    required
                    />Adopted
                </label>
                    {errors.adoptionStatus && <p className="edit-pet-error-message">{errors.adoptionStatus}</p>}
                    {validationErrors.adoptionStatus && <p className="edit-pet-error-message">{validationErrors.adoptionStatus}</p>}
                </div>

                <label>Love Language</label>
                <div>
                <label>
                    <input
                    type="radio"
                    name='loveLanguage'
                    value='physicalTouch'
                    checked={loveLanguage === "physicalTouch"}
                    onChange={updateLoveLanguage}
                    required
                    />Physical Touch
                </label>

                <label>
                    <input
                    type="radio"
                    name='loveLanguage'
                    value='treats'
                    checked={loveLanguage === "treats"}
                    onChange={updateLoveLanguage}
                    required
                    />Treats
                </label>

                <label>
                    <input
                    type="radio"
                    name='loveLanguage'
                    value='play'
                    checked={loveLanguage === "play"}
                    onChange={updateLoveLanguage}
                    required
                    />Play
                </label>

                <label>
                    <input
                    type="radio"
                    name='loveLanguage'
                    value='training'
                    checked={loveLanguage === "training"}
                    onChange={updateLoveLanguage}
                    required
                    />Training
                </label>

                <label>
                    <input
                    type="radio"
                    name='loveLanguage'
                    value='independent'
                    checked={loveLanguage === "independent"}
                    onChange={updateLoveLanguage}
                    required
                    />Independent
                </label>
                    {errors.loveLanguage && <p className="edit-pet-error-message">{errors.loveLanguage}</p>}
                    {validationErrors.loveLanguage && <p className="edit-pet-error-message">{validationErrors.loveLanguage}</p>}
                </div>

                <label>Lifestyle</label>
                <div>
                <label>
                    <input
                    type="radio"
                    name='lifestyle'
                    value='veryActive'
                    checked={lifestyle === "veryActive"}
                    onChange={updateLifestyle}
                    required
                    />Very Active
                </label>

                <label>
                    <input
                    type="radio"
                    name='lifestyle'
                    value='active'
                    checked={lifestyle === "active"}
                    onChange={updateLifestyle}
                    required
                    />Active
                </label>

                <label>
                    <input
                    type="radio"
                    name='lifestyle'
                    value='laidback'
                    checked={lifestyle === "laidback"}
                    onChange={updateLifestyle}
                    required
                    />Laid-back
                </label>

                <label>
                    <input
                    type="radio"
                    name='lifestyle'
                    value='lapPet'
                    checked={lifestyle === "lapPet"}
                    onChange={updateLifestyle}
                    required
                    />Lap Pet
                </label>
                    {errors.lifestyle && <p className="edit-pet-error-message">{errors.lifestyle}</p>}
                    {validationErrors.lifestyle && <p className="edit-pet-error-message">{validationErrors.lifestyle}</p>}
                </div>

                <label>Image URL</label>
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
                            <button type="button" onClick={() => removeImage(index)}>Remove</button>
                        </div>
                    ))}
                </div>
                <button type="submit" onClick={() => navigate(``)}>edit Pet Listing</button>
            </form>

        </div>
    )
}

export default UpdatePetListingForm;
