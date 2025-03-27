import { useDispatch, useSelector } from 'react-redux';
import './ManageReviews.css'
import { useEffect } from 'react';
import { getUserReviewsThunk } from '../../redux/reviews';

const ManageReviews = () => {
    const dispatch = useDispatch()
    const reviews = useSelector((state) => state.reviews.currentUserReviews)
    console.log('review', reviews)

    useEffect(() => {
        dispatch(getUserReviewsThunk())
    }, [dispatch])

    return (
        <div className='manage-reviews-container'>
            {reviews && reviews.length > 0 ? (
                reviews?.map((review, index) => {
                    const createdAt = new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: 'short',
                        day: 'numeric',
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
