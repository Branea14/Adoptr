# from flask import Blueprint, jsonify, request, session
# from flask_login import login_required, current_user
# from app.models import Pet, PetImage, db, User
# from sqlalchemy import and_
# import random
# from app.forms import PetListingForm
# from decimal import Decimal

# pet_image_routes = Blueprint('pet-images', __name__)

####################### ADD PET IMAGE ###############################
# @pet_image_routes.route('/pets/<int:petId>', methods=['POST'])
# @login_required
# def create_pet_image(petId):
#     pet = Pet.query.get_or_404(petId, description="Pet couldn't be found")

#     if pet.sellerId != current_user.id:
#         return jsonify({"message": "Forbidden"}), 403

#     data = request.get_json()
#     image_url = data.get('url')
#     preview = data.get('preview')

#     if not image_url:
#         return jsonify({"message": "Image URL is required"}), 400

#     # Check if there are already 10 images attached to the product (limit)
#     if len(pet.images) >= 10:
#         return jsonify({"message": "Maximum number of images for this product reached"}), 403

#     new_image = PetImage(url=image_url, preview=preview, petId=pet.id)
#     db.session.add(new_image)
#     db.session.commit()

#     return jsonify({
#         'id': new_image.id,
#         'url': new_image.url,
#         'preview': new_image.preview,
#         "createdAt": new_image.createdAt.isoformat(),
#         "updatedAt": new_image.updatedAt.isoformat(),
#     }), 201


# ####################### EDIT PET IMAGE ###############################
# @pet_image_routes.route('/pets/<int:petId>', methods=['PUT'])
# @login_required
# def edit_pet_image(petId):
#     pet = Pet.query.get_or_404(petId, description="Pet couldn't be found")

#     if pet.sellerId != current_user.id:
#         return jsonify({"message": "Unauthorized"}), 403

#     data = request.get_json()
#     imageUrls = data.get('imageUrls', [])
#     previewUrl = data.get('previewUrl', None)

#     # print(pet.images)

#     pet.images.clear()

#     for image_url in imageUrls:
#         preview = (image_url == previewUrl) if previewUrl else (imageUrls[0] == image_url)
#         new_image = PetImage(url=image_url, preview=preview, petId=pet.id)
#         db.session.add(new_image)

#     db.session.commit()

#     updated_images = [{"id": img.id, "url": img.url, "preview": img.preview} for img in pet.images]

#     return jsonify({
#         'petId': pet.id,
#         'images': updated_images
#     }), 200


# ####################### DELETE PET IMAGE ###############################
# @pet_image_routes.route('/<int:imageId>', methods=['DELETE'])
# @login_required
# def delete_pet_image(imageId):

#     pet_image = PetImage.query.join(Pet).filter(
#         PetImage.id == imageId,
#         Pet.sellerId == current_user.id
#     ).first()

#     if not pet_image:
#         return jsonify({"message": "Pet Image couldn't be found"}), 404

#     db.session.delete(pet_image)
#     db.session.commit()

#     return jsonify({"message": "Successfully deleted"}), 200
