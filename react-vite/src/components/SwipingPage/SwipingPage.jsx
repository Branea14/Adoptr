import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createPet, getDetails, getPets } from "../../redux/pets";
import { useDrag } from "@use-gesture/react";
import { createMatch } from "../../redux/matches";

const SwipingPage = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [swipeAction, setSwipeAction] = useState(false)
    const [position, setPosition] = useState(0)

    const currentUser = useSelector((state) => state.session.user)
    const pet = useSelector((state) => state.pet.petDetails)
    const existingMatch = useSelector((state) =>
        state.matches?.pendingMatches[pet?.id]
    )

    //if swipe right xDir > 0
    //creates match (POST)
    //sets status to REQUESTED
    // const bind = useDrag(({ movement: [x], down, direction: [xDir], velocity }) => {
    //     const requiredDistance = 25;
    //     const minVelocity = 0.2;

    //     if (!down && x > requiredDistance && velocity[0] > minVelocity) {
    //         if (xDir > 0) {
    //             swipeAction
    //         }
    //     }
    //         setSwiped(true)
    //     setPosition(down ? x : swiped ? 500 : 0);
    // });

    // if (rightBind) {
    //     dispatch(createMatch(pet))
    // }


    useEffect(() => {
        setLoading(true)
        Promise.all([
            dispatch(getDetails()),
            // dispatch(getPets())
            dispatch(createPet())
        ]).finally(() => setLoading(false))
    }, [dispatch])


    if (loading) return <p>Loading pet details...</p>

    return (
        <>
            <div style={{
                border: "2px solid red",
                padding: "16px",
                borderRadius: "8px",
                maxWidth: "400px",
                margin: "20px auto"
            }}>
            <h1>{pet.name}, {pet.breed}</h1>
            <p>{pet.description}</p>
            <p>Age: {pet.age}</p>
            <p>Color: {pet.color}</p>
            <p>Lifestyle: {pet.lifestyle}</p>
            <p>Size: {pet.size}</p>
            <p>Sex: {pet.sex}</p>
            <p>Love Language: {pet.loveLanguage}</p>
            <p>HouseTrained? {pet.houseTrained}</p>
            <p>Good with kids? {pet.kids}</p>
            <p>Good with other pets? {pet.otherPets}</p>
            <p>Owner Surrender? {pet.ownerSurrender}</p>
            <p>Vaccinated? {pet.vaccinated}</p>
            <p>Special Needs? {pet.specialNeeds}</p>
            {/* {pet?.PetImages.map((image, index) => (
                <div key={index}>
                    <img src={image.url}/>
                </div>
            ))} */}
            </div>
        </>
    )
}

export default SwipingPage;
