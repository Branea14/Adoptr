import { useDispatch, useSelector } from 'react-redux';
import './ManageReviews.css'
import { useEffect, useState } from 'react';
import { getUserReviewsThunk, leaveReviewThunk } from '../../redux/reviews';
import OpenModalButton from "../OpenModalButton"
import DeleteReviewModal from '../DeleteReviewModal';
import UpdateReviewModal from '../UpdateReviewModal/UpdateReviewModal';
import { useModal } from '../../context/Modal';
import ReviewablePetModal from '../ReviewablePetModal/ReviewablePetModal';


const ManageReviews = () => {
    const dispatch = useDispatch()
    const { setModalContent } = useModal()
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [loading, setLoading] = useState(true)
    const reviews = useSelector((state) => state.reviews.currentUserReviews)
    const reviewsArray = Object.values(reviews)
    const reviewablePets = useSelector((state) => state.reviews.reviewablePets)
    console.log('review', reviews)
    console.log(reviewablePets)


    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1)
    }

    useEffect(() => {
        setLoading(true)
        Promise.all([
            dispatch(getUserReviewsThunk()),
            dispatch(leaveReviewThunk())
        ]).finally(() => setLoading(false))
    }, [dispatch, refreshTrigger])

    const handleReviewablePets = async (e) => {
        e.preventDefault()
        setModalContent(<ReviewablePetModal triggerRefresh={triggerRefresh}/>)
    }

    return (
        <div className='manage-reviews-container'>
            {reviewablePets && reviewablePets?.length > 0 && (
                <div className='create-pet-listing-link'>
                    <button className='create-review-button' onClick={handleReviewablePets}>Leave a Review!</button>
                </div>
            )}
            {reviewsArray && reviewsArray.length > 0 ? (
                reviewsArray?.map((review, index) => {
                    const createdAt = new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: 'short',
                        // day: 'numeric',
                        year: 'numeric',
                    })

                    return (
                        <div className='profile-info-container' key={index}>
                            <div className='profile-image-section'>
                                <img className='profile-image' src={review?.petImage} alt={`Photo of ${review.petName}`}/>
                            </div>

                            <div className='profile-info'>
                                <h2>{review?.petName}</h2>
                                <p>Sold by {review?.SellerInfo?.firstName} {review?.SellerInfo?.lastName}</p>
                                <p>Reviewed on {createdAt}</p>
                                <p>"{review?.review}"</p>
                                <p>Rating: {review?.stars}</p>
                            </div>

                            <div className='pet-actions'>
                                {/* <button className='update-pet-button' onClick={() => navigate(`/pets/${pet.id}/edit`)}>Update</button> */}
                                <button className='update-button' onClick={() => setModalContent(<UpdateReviewModal sellerId={review.sellerId} reviewId={review.id} currentReview={review.review} currentStars={review.stars} triggerRefresh={triggerRefresh}/>)}>Update</button>
                                <OpenModalButton className="delete-modal-button" buttonText="Delete" modalComponent={<DeleteReviewModal id={review.id} triggerRefresh={triggerRefresh}/>}/>
                            </div>

                        </div>
                    )
                })

            ) : (
                <p>No reviews available</p>
            )}

        </div>
    )
}

export default ManageReviews;
