import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getDetails } from "../../redux/pets";
import { useDrag } from "@use-gesture/react";
import { createMatch, deleteMatch, rejectedMatches, requestedMatches, updatedMatch } from "../../redux/matches";
import { approvedMatches } from "../../redux/matches";
import "./SwipingPage.css"

const SwipingPage = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [swipeAction, setSwipeAction] = useState(false)
    const [position, setPosition] = useState(0)
    const [hidePets, setHidePets] = useState({})

    const currentUser = useSelector((state) => state.session.user)
    const approvedMatch = useSelector((state) => state.matches?.approvedMatches)
    const requestedMatch = useSelector((state) => state.matches?.requestedMatches)
    const rejectedMatch = useSelector((state) => state.matches?.rejectedMatches)
    const pet = useSelector((state) => {
        // const petDetails = state.pet.petDetails

        // if (petDetails && !hidePets[petDetails.id]) {
        //     if (approvedMatch && approvedMatch[petDetails.id]) return null;
        //     if (rejectedMatch && rejectedMatch[petDetails.id]) return null
        //     // if (requestedMatch && requestedMatch[petDetails.id]?.receiverUserId2 === currentUser.id) return null

        //     return petDetails
        // }
        // return null;
        const petDetails = state.pet.petDetails;
        if (!petDetails || hidePets[petDetails.id]) return null;

        console.log("Currently Displayed Pet:", petDetails);

        const isApproved = Object.values(approvedMatch || {}).some(match => match.petId === petDetails.id);
        const isRejected = Object.values(rejectedMatch || {}).some(match => match.petId === petDetails.id);
        const isRequested = Object.values(requestedMatch || {}).some(match => match.petId === petDetails.id);

        console.log("Is Approved:", isApproved, "Is Requested:", isRequested, "Is Rejected:", isRejected);

        if (isApproved || isRejected || isRequested) return null;

        return petDetails;
    })

    console.log('loooook here', pet)
    console.log('approved matches', approvedMatch)
    console.log('requested matches', requestedMatch)
    console.log('rejected matches', rejectedMatch)

    //moved to navigation
    // const filteredApprovedMatches = Object.values(approvedMatch || {}).filter(match => match.sellerId !== currentUser.id);


    useEffect(() => {
        setLoading(true);
        Promise.all([
            dispatch(getDetails()),
            dispatch(requestedMatches()),
            dispatch(approvedMatches()),
            dispatch(rejectedMatches()),
        ]).finally(() => setLoading(false));
    }, [dispatch, swipeAction]);

    // useEffect(() => {
    //     console.log("Approved Matches:", approvedMatch);
    //     console.log("Requested Matches:", requestedMatch);
    //     console.log("Rejected Matches:", rejectedMatch);
    // }, [approvedMatch, requestedMatch, rejectedMatch]);



    const handleSwipe = async (id) => {
        setLoading(true)

        await Promise.all([
            dispatch(requestedMatches()),
            dispatch(approvedMatches()),
            dispatch(rejectedMatches())
        ])

        console.log("fetching a new pet after swipe......")

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


    if (!pet && loading) return <p>Loading pet details...</p>
    if (!pet && !loading) return <p>No more pets nearby!</p>

    return (
        <div className="swiping-page-container">
        {/* moved to navigation */}
            {/* <h2>Approved Matches</h2>
            <div>
                {filteredApprovedMatches.length > 0 ? (
                    filteredApprovedMatches.map((match) => (
                        <div key={match.id}>
                            <h3>{match.petName}</h3>
                            <img src={match.petImage} alt={`${match.petName}`}/>
                        </div>
                    ))
                ) : null}
            </div> */}
            {pet && Object.keys(pet).length > 0 ? (
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
                <p>Good with other pet? {pet.otherPet}</p>
                <p>Owner Surrender? {pet.ownerSurrender}</p>
                <p>Vaccinated? {pet.vaccinated}</p>
                <p>Special Needs? {pet.specialNeeds}</p>
                {/* {pet?.PetImages.map((image, index) => (
                    <div key={index}>
                        <img src={image.url}/>
                    </div>
                ))} */}
                </div>
            ) : <p>No more pets nearby</p>}
        </div>
    )
}

export default SwipingPage;
