import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { getDetails } from "../../redux/pets";
import { useDrag } from "@use-gesture/react";
import { createMatch, rejectedMatches, requestedMatches } from "../../redux/matches";
import { approvedMatches } from "../../redux/matches";
import "./SwipingPage.css"
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { thunkUpdateUserLocation } from "../../redux/session";

const SwipingPage = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [swipeAction, setSwipeAction] = useState(false)
    const [position, setPosition] = useState(0)
    // const [hidePets, setHidePets] = useState({})
    const [currentImgIndex, setCurrentImgIndex] = useState(0)
    const [location, setLocation] = useState({ latitude: null, longitude: null })
    const [loadingLocation, setLoadingLocation] = useState(false)
    const [errors, setErrors] = useState({})
    const [locationBanner, setLocationBanner] = useState(null)

    const currentUser = useSelector((state) => state.session.user)
    const approvedMatch = useSelector((state) => state.matches?.approvedMatches)
    const requestedMatch = useSelector((state) => state.matches?.requestedMatches)
    const rejectedMatch = useSelector((state) => state.matches?.rejectedMatches)

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

    useEffect(() => {
        if (!currentUser || !navigator.geolocation) return

        if (!navigator.geolocation) {
            setErrors((prev) => ({ ...prev, location: "Geolocation is not supported by your browser" }))
            return
        }

        setLoadingLocation(true)
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords
                console.log('location fetched', latitude, longitude)

                const hasLocationChanged = currentUser.latitude !== latitude || currentUser.longitude !== longitude;
                if (hasLocationChanged) {
                    setLocation({ latitude, longitude })

                    const userData = {
                        userId: currentUser.id,
                        latitude,
                        longitude
                    }

                    await dispatch(thunkUpdateUserLocation(userData))
                    setLocationBanner("Location updated")
                    setTimeout(() => setLocationBanner(null), 3000)
                }
                setLoadingLocation(false)
            },
            (error) => {
                setErrors((prev) => ({ ...prev, location: error.message }))
                setLoadingLocation(false)
                alert("We need access to your location to show pets nearby")
            }
        )
    }, [])


    const filteredApprovedMatches = useMemo(() => {
        return Object.values(approvedMatch || {})
            .filter(match => match.sellerId !== currentUser.id)
            .reduce((acc, match) => {
                acc[match.petId] = match
                return acc;
            }, {})
    }, [approvedMatch, currentUser.id])

    const filteredRequestedMatches = useMemo(() => {
        return Object.values(requestedMatch || {})
            .filter(match => match.sellerId !== currentUser.id)
            .reduce((acc, match) => {
                acc[match.petId] = match
                return acc;
            }, {})
    }, [requestedMatch, currentUser.id])

    const filteredRejectedMatches = useMemo(() => {
        return Object.values(rejectedMatch || {})
            .filter(match => match.sellerId !== currentUser.id)
            .reduce((acc, match) => {
                acc[match.petId] = match
                return acc
            }, {})
    }, [rejectedMatch, currentUser.id])


    const petDetails = useSelector((state) => state.pet.petDetails)

    const isApproved = useMemo(() => {
        return Object.values(filteredApprovedMatches || {}).some(match => match.petId === petDetails.id);
    }, [filteredApprovedMatches, petDetails?.id])
    const isRejected = useMemo(() => {
        return Object.values(filteredRejectedMatches || {}).some(match => match.petId === petDetails.id);
    }, [filteredRejectedMatches, petDetails?.id])
    const isRequested = useMemo(() => {
        return Object.values(filteredRequestedMatches || {}).some(match => match.petId === petDetails.id);
    }, [filteredRequestedMatches, petDetails?.id])

    const pet = useMemo(() => {
        if (!petDetails) return null;
        // if (!petDetails || hidePets[petDetails.id]) return null;
        console.log("Currently Displayed Pet:", petDetails);

        console.log("Is Approved:", isApproved, "Is Requested:", isRequested, "Is Rejected:", isRejected);
        if (isApproved || isRejected || isRequested) return null;
        return petDetails;
    }, [petDetails, isApproved, isRejected, isRequested])

    // console.log('loooook here', pet)
    // console.log('approved matches', approvedMatch)
    console.log('filteredApproved', filteredApprovedMatches)
    // console.log('requested matches', requestedMatch)
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

        const cachedPet = localStorage.getItem('currentPet')

        const fetchEverything = async () => {
            await Promise.all([
                // dispatch(getDetails()),
                dispatch(requestedMatches()),
                dispatch(approvedMatches()),
                dispatch(rejectedMatches()),
            ])

            if (cachedPet) {
                const parsed = JSON.parse(cachedPet)
                dispatch({ type: 'pet/GET_PET_DETAILS', payload: parsed })
                console.log('loaded pet from cache', parsed)
            } else {
                const newPet = await dispatch(getDetails());
                if (newPet) {
                    localStorage.getItem('currentPet', JSON.stringify(newPet))
                }
            }

            setLoading(false)
        }
        fetchEverything()
    }, [dispatch]);

    const handleSwipe = async () => {
        setLoading(true)
        localStorage.removeItem("currentPet") //after swipe is completed and match is handled

        setTimeout(async () => {
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

                localStorage.setItem('currentPet', JSON.stringify(newPet))
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


    const bind = useDrag(({ movement: [x], down, direction: [xDir], velocity }) => {
        console.log('swipe detected', { x, down, xDir, velocity })
        if (!pet) return;
        // const requiredDistance = 10;
        const requiredDistance = 40;
        // const minVelocity = 0.01;
        const minVelocity = 0.15;

        // if (!down && velocity[0] > minVelocity && Math.abs(x) > requiredDistance) {
        if (!down && (velocity[0] > minVelocity || Math.abs(x) > requiredDistance)) {
            let matchStatus = xDir > 0 ? "REQUESTED" : "REJECTED"
            const offscreen = xDir > 0 ? window.innerWidth : -window.innerWidth
            setPosition(offscreen)

            dispatch(createMatch(pet, matchStatus))
                .then(() => {
                    if (matchStatus === "REQUESTED") return dispatch(requestedMatches())
                    if (matchStatus === 'REJECTED') return dispatch(rejectedMatches())
                })
                .then(() => handleSwipe(pet.id))
                .finally(() => {
                    setTimeout(() => {
                        setSwipeAction(true)
                        setPosition(0)
                    }, 300)
                })
        } else {
            setPosition(down ? x : 0);
        }
    });


    if (!pet && loading) return <p>Loading pet details...</p>
    if (!pet) return <p>No more pets nearby!</p>

    return (
        <>
            {locationBanner && (
                <div className="location-banner">
                    {locationBanner}
                </div>
            )}
            <div className="swiping-page-container" {...bind()} style={{ transform: `translate(${position}px)` }}>
                {pet && Object.keys(pet).length > 0 ? (
                    <div className="swipe-card">
                        {images && images.length > 1 ? (
                            <div className="swipe-image-container">
                                <FaChevronLeft className='arrow-icon-left-swipe' onClick={(e) => { e.stopPropagation(); handlePrevImage() }} />
                                <img src={currentImage} alt={pet.name} className="swipe-pet-images" />
                                <FaChevronRight className='arrow-icon-right-swipe' onClick={(e) => { e.stopPropagation(); handleNextImage() }} />
                            </div>
                        ) :
                            (pet?.PetImages?.map((image, index) => (
                                <div key={index}>
                                    <img draggable='false' className='swipe-pet-image' src={image.url} />
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

        </>
    )
}

export default SwipingPage;
