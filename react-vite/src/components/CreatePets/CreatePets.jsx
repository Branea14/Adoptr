import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPet, getViewedPetDetailsThunk } from "../../redux/pets";
import "./CreatePets.css"
import { useNavigate, useParams } from "react-router-dom";

const CreatePets = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {petId} = useParams()

    const currentUser = useSelector((state) => state.session.user)
    const existingPet = useSelector((state) => state.pet.petDetails)
    const allPets = useSelector((state) => state.pet.pets)

    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(true)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [breed, setBreed] = useState('')
    const [vaccinated, setVaccinated] = useState('')
    const [color, setColor] = useState('')
    const [ownerSurrender, setOwnerSurrender] = useState('')
    const [kids, setKids] = useState('')
    const [houseTrained, setHouseTrained] = useState('')
    const [specialNeeds, setSpecialNeeds] = useState('')
    const [otherPets, setOtherPets] = useState('')
    const [age, setAge] = useState('')
    const [sex, setSex] = useState('')
    const [size, setSize] = useState('')
    const [adoptionStatus, setAdoptionStatus] = useState('')
    const [loveLanguage, setLoveLanguage] = useState('')
    const [lifestyle, setLifestyle] = useState('')
    const [images, setImages] = useState('')

    const isUpdate = !!petId

    useEffect(() => {
        setErrors({})
        if (isUpdate && petId) {
            console.log("fetching details for productId", petId)
            dispatch(getViewedPetDetailsThunk(petId)).finally(() => {
                setLoading(false)
            })
        } else {
            setLoading(false)
        }
    }, [dispatch, petId, isUpdate])

    useEffect(() => {
        if (isUpdate && existingPet) {
            console.log("existing pet", existingPet)
            setName(existingPet.name || '');
            setDescription(existingPet.description || '');
            setBreed(existingPet.breed || '');
            setColor(existingPet.color || '');
            setVaccinated(existingPet.vaccinated ?? false);
            setOwnerSurrender(existingPet.ownerSurrender ?? false);
            setKids(existingPet.kids ?? false)
            setHouseTrained(existingPet.houseTrained ?? false)
            setSpecialNeeds(existingPet.specialNeeds ?? false)
            setOtherPets(existingPet.otherPets ?? 'none')
            setAge(existingPet.age ?? 'young')
            setSex(existingPet.sex ?? 'male')
            setSize(existingPet.size ?? 'medium')
            setAdoptionStatus(existingPet.adoptionStatus ?? 'available')
            setLoveLanguage(existingPet.loveLanguage ?? 'physicalTouch')
            setLifestyle(existingPet.lifestyle ?? 'active')
            setImages(existingPet.images?.map(img => ({url: img.url})) || [])
        }
    }, [isUpdate, existingPet])

    useEffect(() => {
        dispatch(createPet())
    }, [dispatch])

}

export default CreatePets;
