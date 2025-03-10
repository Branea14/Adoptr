import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getDetails } from "../../redux/pets";
import { useDrag } from "@use-gesture/react";
import { createMatch, deleteMatch, rejectedMatches, requestedMatches, updatedMatch } from "../../redux/matches";
import { approvedMatches } from "../../redux/matches";

const SwipingPage = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [swipeAction, setSwipeAction] = useState(false)
    const [position, setPosition] = useState(0)
    const [hidePets, setHidePets] = useState({})

    // const currentUser = useSelector((state) => state.session.user)
    const approvedMatch = useSelector((state) => state.matches?.approvedMatches)
    const requestedMatch = useSelector((state) => state.matches?.requestedMatches)
    const rejectedMatch = useSelector((state) => state.matches?.rejectedMatches)
    const pet = useSelector((state) => {
        const petDetails = state.pet.petDetails

        if (petDetails && !hidePets[petDetails.id]) {
            if (approvedMatch && approvedMatch[petDetails.id]) return null;
            if (rejectedMatch && rejectedMatch[petDetails.id]) return null
            // if (requestedMatch && requestedMatch[petDetails.id]?.receiverUserId2 === currentUser.id) return null

            return petDetails
        }
        return null;
    })

    console.log('loooook here', pet)
    console.log('approved matches', approvedMatch)
    console.log('requested matches', requestedMatch)
    console.log('rejected matches', rejectedMatch)

    useEffect(() => {
        setLoading(true)
        Promise.all([
            dispatch(getDetails()),
            dispatch(requestedMatches()),
            dispatch(approvedMatches()),
            dispatch(rejectedMatches())
        ]).finally(() => setLoading(false))
    }, [dispatch, swipeAction])


    const handleSwipe = async (id) => {
        setLoading(true)

        await Promise.all([
            // dispatch(requestedMatches()),
            dispatch(approvedMatches()),
            disapatch(rejectedMatches())
        ])

        // const newPet = await dispatch(getDetails())
        dispatch(getDetails()).then((newPet) => {
            if (newPet) {
                setTimeout(() => {
                    setHidePets((prev) => ({...prev, [id]: true}))
                    setPosition(0)
                }, 300)
            }
            setLoading(false)
        })
    }
    //if swipe right xDir > 0
    //creates match (POST)
    //sets status to REQUESTED
    const bind = useDrag(({ movement: [x], down, direction: [xDir], velocity }) => {
        console.log('swipe detected', {x, down, xDir, velocity})
        if (!pet) return;
        const requiredDistance = 10;
        const minVelocity = 0.01;

        if (!down && velocity[0] > minVelocity && Math.abs(x) > requiredDistance) {
            // const existingMatch = requestedMatch ? requestedMatch[pet.id] : null
            // let matchStatus = xDir > 0 ? "APPROVED" : "REJECTED"

            // if (existingMatch) {
            //     dispatch(updatedMatch({id: existingMatch.id, status: matchStatus}))
            //         .then(() => {
            //             if (matchStatus === 'APPROVED') return dispatch(approvedMatches())
            //             if (matchStatus === 'REJECTED') return dispatch(rejectedMatches())
            //         })
            //         .then(() => handleSwipe(pet.id))
            // } else {
                let matchStatus = xDir > 0 ? "REQUESTED" : "REJECTED"
                dispatch(createMatch(pet, matchStatus))
                    .then(() => {
                        if (matchStatus === "REQUESTED") return dispatch(requestedMatches())
                        if (matchStatus === 'REJECTED') return dispatch(rejectedMatches())
                    })
                    .then(() => handleSwipe(pet.id))
            // }

            setTimeout(() => {
                setSwipeAction(true)
                setPosition(0)
            }, 200)
        }
        setPosition(down ? x : swipeAction ? 500 : 0);
    });


    if (loading) return <p>Loading pet details...</p>
    if (!pet) return <p>No more pets nearby!</p>

    return (
        <>
            <div {...bind()} style={{
                border: "2px solid red",
                padding: "16px",
                borderRadius: "8px",
                maxWidth: "400px",
                margin: "20px auto",
                transform: `translate(${position}px)`
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
