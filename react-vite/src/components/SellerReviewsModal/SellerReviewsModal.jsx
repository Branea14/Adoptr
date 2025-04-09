import { useEffect, useState } from "react";
import "./SellerReviewsModal.css"
import { loadReviewsThunk } from "../../redux/reviews";
import { useSelector, useDispatch } from "react-redux";
import { FaStar } from "react-icons/fa";


const SellerReviewsModal = ({sellerId}) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const reviews = useSelector((state) => state.reviews.reviews)
    const reviewsArray = Object.values(reviews)

    useEffect(() => {
        setLoading(true)
        dispatch(loadReviewsThunk(sellerId))
        setLoading(false)
    }, [dispatch, sellerId])

    const numReviews = reviewsArray ? reviewsArray.length : 0;
    const allRatingsSum = reviewsArray ? reviewsArray.reduce((sum, review) => sum + review.stars, 0) : 0
    const avgRating = numReviews ? (allRatingsSum / numReviews).toFixed(1) : 0

    const getStarRating = (avgRating) => {
        const maxStars = 5;
        const filledStars = Math.round(avgRating);
        const emptyStars = maxStars - filledStars;

        return '★'.repeat(filledStars) + '☆'.repeat(emptyStars);
      }

    if (loading) return null;

    return (
        <div className="seller-reviews-modal">
            <h2>
                Seller Reviews <FaStar color="gold"/> ({avgRating == 5 ? '5' : avgRating}/5)
            </h2>

            {reviewsArray?.map((review, index) => (
                <div key={index} className="review-block">
                    <p className="review-stars">{getStarRating(review.stars)}</p>
                    <p className="review-text">"{review.review}"</p>
                    <p className="reviewer-name">- {review.ReviewerInfo.firstName} {review.ReviewerInfo.lastName.split("")[0]}.</p>
                </div>

            ))}
        </div>
    )
}

export default SellerReviewsModal;
