from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Review, User, Pet, Adoption, db
from sqlalchemy.orm import joinedload

reviews_routes = Blueprint('reviews', __name__)

# ***********************GET All Reviews of Current User ***********************
@reviews_routes.route('/users/current')
@login_required
def get_current_user_reviews():
    reviews = Review.query.options(
        joinedload(Review.sellers),
        joinedload(Review.pets).joinedload(Pet.images)
    ).filter(Review.reviewerId == current_user.id).all()

    if not reviews:
        return jsonify({"message": "No reviews found"}), 404

    review_data = []
    for review in reviews:
        pet = review.pets
        pet_image = next((image for image in pet.images if image.preview), None)

        review_data.append({
            "id": review.id,
            "sellerId": review.sellerId,
            "reviewerId": review.reviewerId,
            "petId": review.petId,
            "petName": pet.name,
            "petImage": pet_image.url if pet_image else None,
            "review": review.review,
            "stars": review.stars,
            "createdAt": review.createdAt.isoformat(),
            "updatedAt": review.updatedAt.isoformat(),
            "CurrUser": {
                "id": current_user.id,
                "firstName": current_user.firstName,
                "lastName": current_user.lastName,
            },
            "SellerInfo": {
                "id": review.sellers.id if review.sellers else None,
                "firstName": review.sellers.firstName if review.sellers else None,
                "lastName": review.sellers.lastName if review.sellers else None
            }
        })

    return jsonify({"Reviews": review_data})


# ***********************GET All Reviews of Pet Owner ***********************
@reviews_routes.route('/users/<int:id>')
@login_required
def get_pet_owner_reviews(id):
    pet_owner = User.query.get_or_404(id, description="Pet Owner does not exist")

    page = request.args.get('page', 1, type=int)
    size = request.args.get('size', 5, type=int)

    reviews_query = Review.query.options(
        joinedload(Review.reviewers)
    ).filter(Review.sellerId == pet_owner.id)

    paginated_reviews = reviews_query.paginate(page=page, per_page=size, error_out=False)

    if not paginated_reviews.items:
        return jsonify({"message": "No reviews found"}), 404

    review_data = []
    for review in paginated_reviews:

        review_data.append({
            "id": review.id,
            "sellerId": review.sellerId,
            "reviewerId": review.reviewerId,
            "review": review.review,
            "stars": review.stars,
            "createdAt": review.createdAt.isoformat(),
            "updatedAt": review.updatedAt.isoformat(),
            "ReviewerInfo": {
                "id": review.reviewers.id if review.reviewers else None,
                "firstName": review.reviewers.firstName if review.reviewers else None,
                "lastName": review.reviewers.lastName if review.reviewers else None
            }
        })

    return jsonify({"Reviews": review_data, "page": page, "size": size, "totalPages": paginated_reviews.pages, "totalReviews": paginated_reviews.total})



# ***********************Create Review ***********************
@reviews_routes.route('/users/<int:id>', methods=['POST'])
@login_required
def create_review(id):
    pet_owner = User.query.get_or_404(id, description="Pet Owner does not exist")
    reviewerId = current_user.id

    data = request.get_json()
    review_text = data.get('review')
    stars = data.get('stars')
    pet_id = data.get('petId')

    errors = {}
    if not review_text:
        errors['review'] = "Review text is required"
    if stars is None or not isinstance(stars, int) or stars not in range(1,6):
        errors['stars'] = "Stars must be an integer from 1 to 5"

    if errors:
        return jsonify({"message": "Bad Request", "errors": errors}), 400

    new_review = Review(
        sellerId=pet_owner.id,
        reviewerId=reviewerId,
        petId=pet_id,
        review=review_text,
        stars=stars
    )

    db.session.add(new_review)
    db.session.commit()

    return jsonify({
        "message": "Review created",
        "review": {
            "id": new_review.id,
           "sellerId": new_review.sellerId,
            "reviewerId": new_review.reviewerId,
            "petId": new_review.petId,
            "review": new_review.review,
            "stars": new_review.stars,
            "createdAt": new_review.createdAt.isoformat(),
            "updatedAt": new_review.updatedAt.isoformat(),
        }
    }), 201


# ***********************EDIT REVIEWS ***********************
@reviews_routes.route('/<int:id>', methods=['PUT'])
@login_required
def edit_review(id):
    review = Review.query.get_or_404(id, description="Review couldn't be found")

    if review.reviewerId != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    review_text = data.get('review')
    stars = data.get('stars')

    errors = {}
    if not review_text:
        errors['review'] = "Review text is required"
    if stars is None or not isinstance(stars, int) or stars not in range(1,6):
        errors['stars'] = "Stars must be an integer from 1 to 5"

    if errors:
        return jsonify({"message": "Bad Request", "errors": errors}), 400

    review.review = review_text
    review.stars = stars

    db.session.commit()

    return jsonify({
        "review": {
            "id": review.id,
           "sellerId": review.sellerId,
            "reviewerId": review.reviewerId,
            "review": review.review,
            "stars": review.stars,
            "createdAt": review.createdAt.isoformat(),
            "updatedAt": review.updatedAt.isoformat(),
        }
    }), 200


# ***********************DELETE REVIEWS ***********************
@reviews_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_review(id):
    review = Review.query.get_or_404(id, description="Review couldn't be found")

    if review.reviewerId != current_user.id:
        return jsonify({"message": "Forbidden: You can only delete your own review"}), 403

    db.session.delete(review)
    db.session.commit()

    return jsonify({"message": "Successfully deleted"}), 200


# ***********************GET REVIEWABLE PETS***********************
@reviews_routes.route('/pets')
@login_required
def get_reviewable_pets():
    reviewable_pet = Pet.query.join(Adoption).options(
        joinedload(Pet.adoptions),
        joinedload(Pet.sellers)
    ).filter(
        Adoption.adopterId == current_user.id,
        Pet.adoptionStatus == 'adopted',
        ~Pet.reviews.any(Review.reviewerId == current_user.id)
    ).all()

    result = []
    for pet in reviewable_pet:
        pet_data = pet.to_dict()


        if pet.adoptions:
            pet_data['adoption'] = {
                # 'id': pet.adoptions.id,
                "adopterId": pet.adoptions.adopterId,
                "adoptedAt": pet.adoptions.adoptedAt.isoformat() if pet.adoptions.adoptedAt else None
            }

        pet_data['SellerInfo'] = {
            "id": pet.sellers.id if pet.sellers else None,
            "firstName": pet.sellers.firstName if pet.sellers else None,
            "lastName": pet.sellers.lastName if pet.sellers else None
        }

        result.append(pet_data)

    return jsonify(result)
