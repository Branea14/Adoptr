import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getDetails } from "../../redux/pets";
import { useDrag } from "@use-gesture/react";
import { createMatch, rejectedMatches, requestedMatches } from "../../redux/matches";
import { approvedMatches } from "../../redux/matches";
import "./SwipingPage.css"
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const SwipingPage = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [swipeAction, setSwipeAction] = useState(false)
    const [position, setPosition] = useState(0)
    const [hidePets, setHidePets] = useState({})
    const [currentImgIndex, setCurrentImgIndex] = useState(0)

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

    const images = pet?.PetImages || [];
    const currentImage = images.length > 0 ? images[currentImgIndex]?.url : "";

    const handleNextImage = () => {
        if (images.length > 0) {
            setCurrentImgIndex((prevIndex) => (prevIndex + 1) % images.length)
        }
    }

    const handlePrevImage = () => {
        if (images.length > 0) {
          setCurrentImgIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        }
      };

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
                    setPosition(0);
                    setCurrentImgIndex(0)
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
                <div className="swipe-card"{...bind()} style={{transform: `translate(${position}px)`}}>
                    {images && images.length > 1 ? (
                        <div className="swipe-image-container">
                        <FaChevronLeft className='arrow-icon-left-swipe' onClick={handlePrevImage}/>
                        <img src={currentImage} alt={pet.name} className="swipe-pet-images" />
                        <FaChevronRight className='arrow-icon-right-swipe' onClick={handleNextImage}/>
                        </div>
                    ) :
                    (pet?.PetImages.map((image, index) => (
                        <div key={index}>
                            <img className='swipe-pet-image' src={image.url}/>
                        </div>
                    )))
                    }

                        <div className="swipe-details-container">
                            <h1 className="swipe-pet-name">{pet.name} &middot; {pet.breed}</h1>
                            <p className="swipe-description">{pet.description}</p>
                            <p className="swipe-age-sex-size"><strong>{pet.age} &middot; {pet.sex} &middot; {pet.size}</strong></p>
                            {/* <p>Color: {pet.color}</p> */}
                            <p className="swipe-lifestyle"><strong>Lifestyle:</strong> {pet.lifestyle} &middot; <strong>Love Language:</strong> {pet.loveLanguage}</p>

                            <hr className="swipe-divider" />

                                <div className="swipe-attributes">
                                    <p><span>House Trained:</span> <strong className={pet.houseTrained ? "yes" : "no"}>{pet.houseTrained ? "Yes" : "No"}</strong></p>
                                    <p><span>Good with Kids:</span> <strong className={pet.kids ? "yes" : "no"}>{pet.kids ? "Yes" : "No"}</strong></p>
                                    <p><span>Good with Other Pets:</span> <strong className={pet.otherPet ? "yes" : "no"}>{pet.otherPet ? "Yes" : "No"}</strong></p>
                                    <p><span>Owner Surrender:</span> <strong className={pet.ownerSurrender ? "yes" : "no"}>{pet.ownerSurrender ? "Yes" : "No"}</strong></p>
                                    <p><span>Vaccinated:</span> <strong className={pet.vaccinated ? "yes" : "no"}>{pet.vaccinated ? "Yes" : "No"}</strong></p>
                                    <p><span>Special Needs:</span> <strong className={pet.specialNeeds ? "yes" : "no"}>{pet.specialNeeds ? "Yes" : "No"}</strong></p>
                                    </div>
                            {/* <p className="swipe-housetrained">HouseTrained? {pet.houseTrained ? "Yes" : "No"}</p>
                            <p className="swipe-kids">Good with kids? {pet.kids ? "Yes" : "No"}</p>
                            <p className="swipe-otherpets">Good with other pets? {pet.otherPet ? "Yes" : "No"}</p>
                            <p className="swipe-owner-surrender">Owner Surrender? {pet.ownerSurrender ? "Yes" : "No"}</p>
                            <p className="swipe-vaccinated">Vaccinated? {pet.vaccinated ? "Yes" : "No"}</p>
                            <p className="swipe-special-needs">Special Needs? {pet.specialNeeds ? "Yes" : "No"}</p> */}
                        </div>
                    </div>
            ) : <p>No more pets nearby</p>}
        </div>
    )
}

export default SwipingPage;
