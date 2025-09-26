import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { getDetails } from "../../redux/pets";
import { useDrag } from "@use-gesture/react";
import { createMatch, rejectedMatches, requestedMatches } from "../../redux/matches";
import { approvedMatches } from "../../redux/matches";
import "./SwipingPage.css"
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { thunkUpdateUserLocation } from "../../redux/session";
import OpenModalButton from "../OpenModalButton";
import SellerReviewsModal from "../SellerReviewsModal/SellerReviewsModal";

const SwipingPage = () => {
    const dispatch = useDispatch()

    const [currentPet, setCurrentPet] = useState(null)
    const [loading, setLoading] = useState(true)
    const [validatingPet, setValidatingPet] = useState(true)
    const [matchesAreLoaded, setMatchesAreLoaded] = useState(false)
    const [matchesFilteredReady, setMatchesFilteredReady] = useState(false)

    const [position, setPosition] = useState(0)
    const [currentImgIndex, setCurrentImgIndex] = useState(0)
    const [locationBanner, setLocationBanner] = useState(null)
    const [swipeAction, setSwipeAction] = useState(false)
    const [location, setLocation] = useState({ latitude: null, longitude: null })
    const [loadingLocation, setLoadingLocation] = useState(false)
    const [errors, setErrors] = useState({})

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
    const reviews = useSelector((state) => state.reviews.reviews)
    const reviewsArray = Object.values(reviews)


    alert("Swipe left and right and find your next furry friend")
    // useEffect(() => {
    //     if (currentUser) {
    //         socket.connect()

    //         socket.on("connect", () => {
    //             console.log("connected to server") //fires when connection is established
    //         })

    //         socket.on("connected", (data) => {
    //             console.log("connected", data) //fires when backend emits custom event, which immediate after it receives handshake
    //         })

    //         return () => {
    //             socket.disconnect()
    //             socket.off('connect')
    //             socket.off('connected')
    //             console.log('now disconnected')
    //         }
    //     }
    // }, [currentUser])

    const filterMatches = (matches) => Object.values(matches || {}).filter((match) => match.sellerId !== currentUser.id)

    const filteredApprovedMatches = useMemo(() => {
        return filterMatches(approvedMatch || {}).reduce((acc, match) => {
                acc[match.petId] = match
                return acc;
            }, {})
    }, [approvedMatch, currentUser.id])

    const filteredRequestedMatches = useMemo(() => {
        return filterMatches(requestedMatch || {}).reduce((acc, match) => {
                acc[match.petId] = match
                return acc;
            }, {})
    }, [requestedMatch, currentUser.id])

    const filteredRejectedMatches = useMemo(() => {
        return filterMatches(rejectedMatch || {}).reduce((acc, match) => {
                acc[match.petId] = match
                return acc
            }, {})
    }, [rejectedMatch, currentUser.id])


    const validateAndSetPet = async (petCandidate) => {
        const allMatchIds = new Set([
            ...Object.values(requestedMatch || {}).map(m => m.petId),
            ...Object.values(approvedMatch || {}).map(m => m.petId),
            ...Object.values(rejectedMatch || {}).map(m => m.petId)
        ])

        const isValid = petCandidate?.sellerId !== currentUser.id && !allMatchIds.has(petCandidate.id)

        if (isValid) {
            localStorage.setItem('currentPet', JSON.stringify(petCandidate))
            setCurrentPet(petCandidate)
            return true
        }
        return false
    }

    const pet = useMemo(() => {
        if (!currentPet) return null;
        if (filteredApprovedMatches[currentPet.id] || filteredRequestedMatches[currentPet.id] || filteredRejectedMatches[currentPet.id]) return null;
        if (currentPet.sellerId === currentUser.id) return null;

        return currentPet;
    }, [currentPet, currentUser.id, filteredApprovedMatches, filteredRequestedMatches, filteredRejectedMatches])


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

    // console.log('filteredApproved', filteredApprovedMatches)
    // console.log('filteredRequested', filteredRequestedMatches)
    // console.log('filteredRejected', filteredRejectedMatches)

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
        if (!currentUser) return;

        // const cachedPet = localStorage.getItem('currentPet')

        const fetchEverything = async () => {
            console.log("🔄 Starting fetchEverything");

            setLoading(true);
            setValidatingPet(true)
            // setMatchesAreLoaded(false);
            // setMatchesFilteredReady(false)
            setCurrentPet(null)
            localStorage.removeItem('currentPet')

            await Promise.all([
                dispatch(requestedMatches()),
                dispatch(approvedMatches()),
                dispatch(rejectedMatches()),
            ])

            setMatchesAreLoaded(true)
            setMatchesFilteredReady(true)

            // console.log('geting pet....')
            const newPet = await dispatch(getDetails())
            // console.log('pet fetched', newPet)
            const accepted = await validateAndSetPet(newPet)

            if (!accepted) {
                console.log(" First pet invalid — trying again...");
                const another = await dispatch(getDetails());
                await validateAndSetPet(another);
            }

            setValidatingPet(false)
            setLoading(false)

        }
        fetchEverything()
    }, [dispatch, currentUser?.id]);

    const handleSwipe = async () => {
        if (!currentPet) return

        setLoading(true)
        // setCurrentPet(null)
        localStorage.removeItem("currentPet") //after swipe is completed and match is handled

        try {
            await Promise.all([
                dispatch(requestedMatches()),
                dispatch(approvedMatches()),
                dispatch(rejectedMatches())
            ]);

            // console.log("fetching a new pet after swipe...");

            const newPet = await dispatch(getDetails());

            const allMatchIds = new Set([
                ...Object.values(requestedMatch || {}).map(m => m.petId),
                ...Object.values(approvedMatch || {}).map(m => m.petId),
                ...Object.values(rejectedMatch || {}).map(m => m.petId)
            ]);

            const isValid = newPet?.sellerId !== currentUser.id && !allMatchIds.has(newPet?.id);

            if (isValid) {
                localStorage.setItem('currentPet', JSON.stringify(newPet));
                setCurrentPet(newPet);
            } else {
                setCurrentPet(null); // Explicitly fallback to null if no valid pet
            }

            setCurrentImgIndex(0);
            setPosition(0);
        } catch (error) {
            console.error("Error fetching new pet", error);
            if (error.response?.status === 400) {
                console.log("No more pets to swipe");
            }
        } finally {
            setLoading(false);
        }
    }


    const bind = useDrag(({ movement: [x], down, direction: [xDir], velocity }) => {
        // console.log('swipe detected', { x, down, xDir, velocity })
        if (!pet) return;
        const requiredDistance = 50;
        const minVelocity = 0.15;

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


    if (validatingPet || loading || !matchesAreLoaded || !matchesFilteredReady || currentPet === null) return <p>Loading pet details...</p>
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
                                <img src={currentImage} alt={pet.name} className="swipe-pet-images" draggable={false}/>
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
                            <div className="swipe-details-scroll">
                                <h1 className="swipe-pet-name">{pet.name} &middot; {pet.breed}</h1>
                                <p className="swipe-description">{pet.description}</p>
                                <p className="swipe-age-sex-size"><strong>{pet.age} &middot; {pet.sex} &middot; {SIZE_DISPLAY[pet.size]}</strong></p>
                                <p className="swipe-lifestyle"><strong>Lifestyle:</strong> {LIFESTYLE_DISPLAY[pet.lifestyle]} &middot; <strong>Love Language:</strong> {LOVE_LANGUAGE_DISPLAY[pet.loveLanguage]}</p>

                                <hr className="swipe-divider" />

                                <div className="swipe-attributes">
                                    {reviewsArray?.length > 0 ? <OpenModalButton className='see-reviews-button' buttonText='See Seller Reviews' modalComponent={<SellerReviewsModal sellerId={pet.sellerId}/>}/> : null}
                                    <p><span>House Trained:</span> <strong className={pet.houseTrained ? "yes" : "no"}>{pet.houseTrained ? "Yes" : "No"}</strong></p>
                                    <p><span>Good with Kids:</span> <strong className={pet.kids ? "yes" : "no"}>{pet.kids ? "Yes" : "No"}</strong></p>
                                    <p><span>Good with Other Pets:</span> <strong className={pet.otherPet ? "yes" : "no"}>{pet.otherPet ? "Yes" : "No"}</strong></p>
                                    <p><span>Owner Surrender:</span> <strong className={pet.ownerSurrender ? "yes" : "no"}>{pet.ownerSurrender ? "Yes" : "No"}</strong></p>
                                    <p><span>Vaccinated:</span> <strong className={pet.vaccinated ? "yes" : "no"}>{pet.vaccinated ? "Yes" : "No"}</strong></p>
                                    <p><span>Special Needs:</span> <strong className={pet.specialNeeds ? "yes" : "no"}>{pet.specialNeeds ? "Yes" : "No"}</strong></p>
                                </div>

                            </div>

                        </div>
                    </div>
                ) : <p>No more pets nearby</p>}
            </div>

        </>
    )
}

export default SwipingPage;
