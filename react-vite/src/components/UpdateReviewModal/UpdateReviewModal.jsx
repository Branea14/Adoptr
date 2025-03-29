import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './UpdateReviewModal.css'
import { useEffect, useState } from 'react';
import { getUserReviewsThunk, loadReviewsThunk, updateReviewThunk } from '../../redux/reviews';

const UpdateReviewModal = ({ sellerId, reviewId, currentReview, currentStars, triggerRefresh }) => {
    const { closeModal } = useModal();
    const dispatch = useDispatch()

    const [ review, setReview ] = useState(currentReview || '')
    const [ starRating, setStarRating ] = useState(currentStars || 0)
    const [ hoverRating, setHoverRating ] = useState(0)
    const [ errors, setErrors ] = useState({})

    const handleValidation = () => {
        const validationErrors = {}

        if (review.length < 10) validationErrors.review = "Review must be at least 10 characters long."
        return validationErrors
    }

    useEffect(() => {
        setErrors(handleValidation())
    }, [review])

    const handleUpdateButton = async () => {
        const validationErrors = handleValidation();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        const reviewData = {
            id: reviewId,
            review,
            stars: starRating
        }
        await dispatch(updateReviewThunk(reviewData))
        await dispatch(loadReviewsThunk(sellerId))
        await dispatch(getUserReviewsThunk())
        closeModal()
        triggerRefresh()
    }

    const disableButton = () => review.length < 10 || !starRating;
    const handleStarClick = (rating) => setStarRating(rating)
    const handleStarHover = (rating) => setHoverRating(rating)
    const handleStarMouseOut = () => setHoverRating(0)

    return (
        <div className="update-review-modal">
            <h2>Update Review</h2>
                <label>
                    <span className="your-review-rating">Your review rating</span>
                    <div>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`review-star ${
                                    (hoverRating || starRating) >= star ? 'highlighted' : ''
                                }`}
                                onClick={() =>  handleStarClick(star)}
                                onMouseOver={() => handleStarHover(star)}
                                onMouseOut={handleStarMouseOut}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </label>
            <label>
                {errors.review && <p className="error-message">{errors.review}</p>}
                Review:
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />
            </label>

            <div>
                <button className='confirm-button' disabled={disableButton()} onClick={handleUpdateButton}>Submit Changes</button>
                <button className='cancel-button' onClick={closeModal}>Cancel</button>
            </div>
        </div>
    )

}

export default UpdateReviewModal;
