import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getViewedPetDetailsThunk } from "../../redux/pets";
import UpdatePetListingForm from "./UpdatePetListingForm";


const UpdatePetListing = () => {
    const {petId} = useParams()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)

    const pet = useSelector((state) => state.pet.viewedPetDetails)

    useEffect(() => {
        const fetchingPet = async () => {
            if (petId) {
                await dispatch(getViewedPetDetailsThunk(petId))
                setLoading(false)
            }
        }

        fetchingPet()
    }, [dispatch, petId])

    if (loading || !pet) return

    return (
        <>
            <UpdatePetListingForm pet={pet}/>
        </>
    )
}

export default UpdatePetListing;
