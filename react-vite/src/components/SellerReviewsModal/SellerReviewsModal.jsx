import { useEffect } from "react";
import { useModal } from "../../context/Modal";
import "./SellerReviewsModal.css"
import { loadReviewsThunk } from "../../redux/reviews";
import { useSelector, useDispatch } from "react-redux";
import { FaStar } from "react-icons/fa";


const SellerReviewsModal = ({sellerId}) => {
    const {closeModal} = useModal()
    const dispatch = useDispatch()
    const reviews = useSelector((state) => state.reviews.reviews)
    const reviewsArray = Object.values(reviews)
    console.log('array', reviewsArray)
    console.log('reviews', reviews)


    useEffect(() => {
        dispatch(loadReviewsThunk(sellerId))
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

    return (
        <>
            <h2>
                Seller Reviews <FaStar color="gold"/> ({avgRating == 5 ? '5' : avgRating}/5)
            </h2>

            {reviewsArray && reviewsArray?.map((review, index) => (
                <div key={index}>
                    <p>{getStarRating(review.stars)}</p>
                    <p>"{review.review}"</p>
                    <p>- {review.ReviewerInfo.firstName} {review.ReviewerInfo.lastName.split("")[0]}.</p>
                </div>

            ))}
        </>
    )
}

export default SellerReviewsModal;
