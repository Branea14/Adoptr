import { useDispatch, useSelector } from 'react-redux';
import './ManageReviews.css'
import { useEffect, useState } from 'react';
import { getUserReviewsThunk } from '../../redux/reviews';
import OpenModalButton from "../OpenModalButton"
import DeleteReviewModal from '../DeleteReviewModal';


const ManageReviews = () => {
    const dispatch = useDispatch()
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const reviews = useSelector((state) => state.reviews.currentUserReviews)
    const reviewsArray = Object.values(reviews)
    console.log('review', reviews)


    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1)
    }

    useEffect(() => {
        dispatch(getUserReviewsThunk())
    }, [dispatch, refreshTrigger])

    return (
        <div className='manage-reviews-container'>
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
                                <h2>{review.petName}</h2>
                                <p>Sold by {review.SellerInfo.firstName} {review.SellerInfo.lastName}</p>
                                <p>Reviewed on {createdAt}</p>
                                <p>"{review.review}"</p>
                                <p>Rating: {review.stars}</p>
                            </div>

                            <div className='pet-actions'>
                                {/* <button className='update-pet-button' onClick={() => navigate(`/pets/${pet.id}/edit`)}>Update</button> */}
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
