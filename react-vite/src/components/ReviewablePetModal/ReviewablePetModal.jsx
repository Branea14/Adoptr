import { useDispatch, useSelector } from 'react-redux'
import './ReviewablePetModal.css'
import { useModal } from '../../context/Modal'
import { useEffect, useState } from 'react'
import { addReview, leaveReviewThunk, removeReviewablePets } from '../../redux/reviews'

const ReviewablePetModal = ({triggerRefresh}) => {
    const dispatch = useDispatch()
    const { closeModal } = useModal()
    const [ reviewText, setReviewText ] = useState('')
    const [selectedPet, setSelectedPet ] = useState(null)
    const [ showReviewModal, setShowReviewModal ] = useState(false)
    const [ starRating, setStarRating ] = useState({})
    const [ hoverRating, setHoverRating ] = useState({})

    const reviewablePets = useSelector((state) => state.reviews.reviewablePets)

    useEffect(() => {
        dispatch(leaveReviewThunk())
    }, [dispatch])

    const handleStarClick = (rating, review = selectedPet) => {
        setStarRating((prev) => ({...prev, [review.id]: rating}));
        if (review) {
            setSelectedPet(review)
            setShowReviewModal(true)
        }
    }

    const disableButton = () => reviewText.length < 10 || !starRating[selectedPet?.id];

    const handleSubmitReview = async () => {
        if (disableButton()) return;

        const newReview = {
            sellerId: selectedPet.sellerId,
            petId: selectedPet.id,
            review: reviewText,
            stars: starRating[selectedPet.id],
        }

        const response = await dispatch(addReview(newReview))
        if (response) {
            dispatch(removeReviewablePets(selectedPet.id))

            setShowReviewModal(false)
            setSelectedPet(null);
            setReviewText('')
            setStarRating(prev => ({...prev, [selectedPet.id]: 0}))

            closeModal()
            triggerRefresh()
        }
    }

    return (
        <div className='signup-modal'>
            {!showReviewModal && (
                <>
                    <h2 className="review-your-purchases">Review the adoption process!</h2>
                    <div className="reviewable-products-description">How was your adoption process? Please share!</div>
                    {reviewablePets?.map((review, index) => {
                        const adoptedAt = new Date(review.adoption.adoptedAt).toLocaleDateString("en-US", {
                            month: 'short',
                            year: 'numeric'
                        });

                        return (
                            <div key={index}>
                                <div className="reviewable-products-header">
                                    {review.images?.filter(image => image.preview === true)
                                        .map(image => (
                                            <img className='profile-image' src={image.url} alt={review.name} />
                                        ))}

                                    <div>
                                        <div className="reviewable-products-product-name">{review.name}</div>
                                        <div className="review-date">Adopted {adoptedAt} from {review.SellerInfo.firstName} {review.SellerInfo.lastName}</div>
                                        <div>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    key={star}
                                                    className={`review-star ${
                                                        (hoverRating[review.id] !== undefined ? hoverRating[review.id] : starRating[review.id]) >= star ? 'highlighted' : ''
                                                    }`}
                                                    onClick={() => handleStarClick(star, review)}
                                                    onMouseOver={() => setHoverRating((prev) => ({ ...prev, [review.id]: star }))}
                                                    onMouseOut={() => setHoverRating((prev) => ({ ...prev, [review.id]: undefined }))}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </>
            )}

            {showReviewModal && selectedPet && (() => {
                const adoptedAt = new Date(selectedPet.adoption.adoptedAt).toLocaleDateString("en-US", {
                    month: 'short',
                    year: 'numeric'
                });

                return (
                    <div>
                        <h2 className="review-your-purchases-2">Write a Review</h2>
                        <div className="review-header">
                            {selectedPet.images?.filter(image => image.preview === true)
                                .map(image => (
                                    <img className='profile-image' src={image.url} alt={selectedPet.name} />
                                ))}
                            <div>
                                <div className="reviewable-products-product-name-2">{selectedPet.name}</div>
                                <div className="review-date-2">Adopted on {adoptedAt}</div>
                            </div>
                        </div>
                        <div className="reviewable-product-last-modal">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`review-star ${
                                        (hoverRating[selectedPet.id] !== undefined ? hoverRating[selectedPet.id] : starRating[selectedPet.id]) >= star ? 'highlighted' : ''
                                    }`}
                                    onClick={() => setStarRating((prev) => ({ ...prev, [selectedPet.id]: star }))}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <textarea
                            placeholder="Write your review here"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        />
                        <div className="delete-reviews-buttons">
                            <button className='confirm-button' disabled={disableButton()} onClick={handleSubmitReview}>Submit</button>
                            <button className='cancel-button' onClick={() => setShowReviewModal(false)}>Cancel</button>
                        </div>
                    </div>
                );
            })()}
        </div>
    );

}

export default ReviewablePetModal
