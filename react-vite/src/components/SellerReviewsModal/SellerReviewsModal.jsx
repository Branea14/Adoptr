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
    console.log('sellerId', sellerId)
    console.log('reviews', reviews)

    useEffect(() => {
        dispatch(loadReviewsThunk(sellerId))
    }, [dispatch, sellerId])

    const isArray = Array.isArray(reviews)
    const reviewCount = isArray ? reviews.length : 0
    const allRatingsSum = isArray ? reviews.reduce((sum, review) => sum + review.stars, 0) : 0
    const avgRating = reviewCount ? (allRatingsSum / reviewCount).toFixed(1) : 0

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

            {isArray && reviews?.map((review, index) => (
                <>
                    <p>{getStarRating(review.stars)}</p>
                    <p>"{review.review}"</p>
                    <p>- {review.ReviewerInfo.firstName} {review.ReviewerInfo.lastName.split("")[0]}.</p>
                </>

            ))}
        </>
    )
}

export default SellerReviewsModal;
