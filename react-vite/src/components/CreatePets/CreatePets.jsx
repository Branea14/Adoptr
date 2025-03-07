import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createPet } from "../../redux/pets";

const CreatePets = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(createPet())
    }, [dispatch])

}

export default CreatePets;
