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
    // const [hidePets, setHidePets] = useState({})
    const [currentImgIndex, setCurrentImgIndex] = useState(0)

    const LIFESTYLE_DISPLAY = {
        "veryActive": "Very Active",
        "active": "Active",
        "laidback": "Laidback",
        "lapPet": "Lap Pet"
    }

    const LOVE_LANGUAGE_DISPLAY = {
        "physicalTouch": "Physical Touch",
        "treats": "Treats",
        "play": "Play",
        "training": "Training",
        "independent": "Independent"
    }

    const SIZE_DISPLAY = {
        "small": "Small",
        "medium": "Medium",
        "large": "Large",
        "xl": "X-Large"
    }

    const currentUser = useSelector((state) => state.session.user)
    const approvedMatch = useSelector((state) => state.matches?.approvedMatches)
    const requestedMatch = useSelector((state) => state.matches?.requestedMatches)
    const rejectedMatch = useSelector((state) => state.matches?.rejectedMatches)

    const filteredApprovedMatches = Object.values(approvedMatch || {})
        .filter(match => match.sellerId !== currentUser.id)
        .reduce((acc, match) => {
            acc[match.petId] = match
            return acc;
        }, {})
    const filteredRequestedMatches = Object.values(requestedMatch || {})
        .filter(match => match.sellerId !== currentUser.id)
        .reduce((acc, match) => {
            acc[match.petId] = match
            return acc;
        }, {})
    const filteredRejectedMatches = Object.values(rejectedMatch || {})
        .filter(match => match.sellerId !== currentUser.id)
        .reduce((acc, match) => {
            acc[match.petId] = match
            return acc
        }, {})


    const pet = useSelector((state) => {
        const petDetails = state.pet.petDetails;
        if (!petDetails) return null;
        // if (!petDetails || hidePets[petDetails.id]) return null;

        console.log("Currently Displayed Pet:", petDetails);

        const isApproved = Object.values(filteredApprovedMatches || {}).some(match => match.petId === petDetails.id);
        const isRejected = Object.values(filteredRejectedMatches || {}).some(match => match.petId === petDetails.id);
        const isRequested = Object.values(filteredRequestedMatches || {}).some(match => match.petId === petDetails.id);

        console.log("Is Approved:", isApproved, "Is Requested:", isRequested, "Is Rejected:", isRejected);

        if (isApproved || isRejected || isRequested) return null;

        return petDetails;
    })

    console.log('loooook here', pet)
    // console.log('approved matches', approvedMatch)
    console.log('filteredApproved', filteredApprovedMatches)
    console.log('requested matches', requestedMatch)
    console.log('filteredRequested', filteredRequestedMatches)
    // console.log('rejected matches', rejectedMatch)
    console.log('filteredRejected', filteredRejectedMatches)

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

    const handleSwipe = async () => {
        setLoading(true)

        setTimeout( async () => {
            await Promise.all([
                dispatch(requestedMatches()),
                dispatch(approvedMatches()),
                dispatch(rejectedMatches())
            ])

            console.log("fetching a new pet after swipe......")

            dispatch(getDetails()).then((newPet) => {
                if (!newPet) {
                    console.log("No more pets available")
                    setLoading(false)
                    return
                }
                setPosition(0);
                setCurrentImgIndex(0)
                setLoading(false)
            }).catch((error) => {
                console.error("Error fetching new pet", error)
                if (error.response?.status === 400) {
                    console.log("no more pets to swipe")
                }
                setLoading(false)
            })
        }, 300)
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
                let matchStatus = xDir > 0 ? "REQUESTED" : "REJECTED"
                dispatch(createMatch(pet, matchStatus))
                    .then(() => {
                        if (matchStatus === "REQUESTED") return dispatch(requestedMatches())
                        if (matchStatus === 'REJECTED') return dispatch(rejectedMatches())
                    })
                    .then(() => handleSwipe(pet.id))

            setTimeout(() => {
                setSwipeAction(true)
                setPosition(0)
            }, 200)
        }
        setPosition(down ? x : swipeAction ? 500 : 0);
    });


    if (!pet && loading) return <p>Loading pet details...</p>
    if (!pet) return <p>No more pets nearby!</p>

    return (
        <div className="swiping-page-container" {...bind()} style={{transform: `translate(${position}px)`}}>
            {pet && Object.keys(pet).length > 0 ? (
                <div className="swipe-card">
                    {images && images.length > 1 ? (
                        <div className="swipe-image-container">
                        <FaChevronLeft className='arrow-icon-left-swipe' onClick={(e) => {e.stopPropagation(); handlePrevImage()}}/>
                        <img draggable='false' src={currentImage} alt={pet.name} className="swipe-pet-images" />
                        <FaChevronRight className='arrow-icon-right-swipe' onClick={(e) => {e.stopPropagation(); handleNextImage()}}/>
                        </div>
                    ) :
                    (pet?.PetImages?.map((image, index) => (
                        <div key={index}>
                            <img draggable='false' className='swipe-pet-image' src={image.url}/>
                        </div>
                    )))
                    }

                        <div className="swipe-details-container">
                            <h1 className="swipe-pet-name">{pet.name} &middot; {pet.breed}</h1>
                            {/* <p>{pet.id}</p> */}
                            <p className="swipe-description">{pet.description}</p>
                            <p className="swipe-age-sex-size"><strong>{pet.age} &middot; {pet.sex} &middot; {SIZE_DISPLAY[pet.size]}</strong></p>
                            {/* <p>Color: {pet.color}</p> */}
                            <p className="swipe-lifestyle"><strong>Lifestyle:</strong> {LIFESTYLE_DISPLAY[pet.lifestyle]} &middot; <strong>Love Language:</strong> {LOVE_LANGUAGE_DISPLAY[pet.loveLanguage]}</p>

                            <hr className="swipe-divider" />

                                <div className="swipe-attributes">
                                    <p><span>House Trained:</span> <strong className={pet.houseTrained ? "yes" : "no"}>{pet.houseTrained ? "Yes" : "No"}</strong></p>
                                    <p><span>Good with Kids:</span> <strong className={pet.kids ? "yes" : "no"}>{pet.kids ? "Yes" : "No"}</strong></p>
                                    <p><span>Good with Other Pets:</span> <strong className={pet.otherPet ? "yes" : "no"}>{pet.otherPet ? "Yes" : "No"}</strong></p>
                                    <p><span>Owner Surrender:</span> <strong className={pet.ownerSurrender ? "yes" : "no"}>{pet.ownerSurrender ? "Yes" : "No"}</strong></p>
                                    <p><span>Vaccinated:</span> <strong className={pet.vaccinated ? "yes" : "no"}>{pet.vaccinated ? "Yes" : "No"}</strong></p>
                                    <p><span>Special Needs:</span> <strong className={pet.specialNeeds ? "yes" : "no"}>{pet.specialNeeds ? "Yes" : "No"}</strong></p>
                                    </div>

                        </div>
                    </div>
            ) : <p>No more pets nearby</p>}
        </div>
    )
}

export default SwipingPage;
