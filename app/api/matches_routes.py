from flask import Blueprint, jsonify, request, session
from flask_login import login_required, current_user
from app.models import db, Match, Pet, PetImage
from sqlalchemy.orm import joinedload
from sqlalchemy import desc

matches_routes = Blueprint('matches', __name__)


@matches_routes.route('/all')
@login_required
def all_matches():
    matches = Match.query.options(
        joinedload(Match.user1)
    ).all()

    return jsonify([
        {
            "id": match.id,
            "petId": match.petId,
            "receiveUser": match.userId2,
            "senderUser": match.user1.to_dict() if match.user1 else None
        }
        for match in matches
    ])

####################### GET ALL APPROVED MATCHES ###############################
@matches_routes.route('/approved')
@login_required
def all_approved_matches():
    matches = Match.query.options(
        joinedload(Match.pets).joinedload(Pet.images)
    ).filter(
        ((Match.userId1 == current_user.id) | (Match.userId2 == current_user.id)) &
        (Match.status == 'APPROVED')
    ).order_by(desc(Match.createdAt)).all()

    if not matches:
        return jsonify({"approved_matches": []}), 200

    match_data = []
    for match in matches:
        pet = match.pets
        pet_image = next((image for image in pet.images if image.preview), None)
        # pet_image = PetImage.query.filter_by(petId=pet.id, preview=True).first()

        match_data.append({
        "id": match.id,
        "senderUserId1": match.userId1,
        "receiverUserId2": match.userId2,
        "petId": match.petId,
        "status": match.status,
        "createdAt": match.createdAt.isoformat(),
        "updatedAt": match.updatedAt.isoformat(),
        "petName": pet.name if pet else None,
        "sellerId": pet.sellerId,
        "petImage": pet_image.url if pet_image else None
        })

    return jsonify({"Matches": match_data}), 201


####################### GET ALL REQUESTED MATCHES ###############################
@matches_routes.route('/requested')
@login_required
def all_requested_matches():
    matches = Match.query.options(
        joinedload(Match.pets).joinedload(Pet.images),
        joinedload(Match.user1),
        joinedload(Match.user2)
    ).filter(
        ((Match.userId1 == current_user.id) | (Match.userId2 == current_user.id)) &
        (Match.status == 'REQUESTED')
    ).order_by(desc(Match.createdAt)).all()

    if not matches:
        return jsonify({"requested_matches": []}), 200

    match_data = []
    for match in matches:
        pet = match.pets
        pet_image = next((image for image in pet.images if image.preview), None)

        user1_avatar = match.user1.avatar if match.user1 else None
        user2_avatar = match.user2.avatar if match.user2 else None

        print('looooooooooooooooooooooook', user1_avatar)
        print('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', user2_avatar)

        match_data.append({
            "id": match.id,
            "senderUserId1": match.userId1,
            "receiverUserId2": match.userId2,
            "petId": match.petId,
            "status": match.status,
            "createdAt": match.createdAt.isoformat(),
            "updatedAt": match.updatedAt.isoformat(),
            "petName": pet.name if pet else None,
            "sellerId": pet.sellerId,
            "petImage": pet_image.url if pet_image else None,
            "user1Avatar": user1_avatar,
            "user2Avatar": user2_avatar
        })


    return jsonify({"Matches": match_data}), 200


####################### GET ALL REJECTED MATCHES ###############################
@matches_routes.route('/rejected')
@login_required
def all_rejected_matches():
    matches = Match.query.options(
        joinedload(Match.pets)
    ).filter(
        ((Match.userId1 == current_user.id) | (Match.userId2 == current_user.id)) &
        (Match.status == 'REJECTED')
    ).all()

    if not matches:
        return jsonify({"rejected_matches": []}), 200


    match_data = []
    for match in matches:
        pet = match.pets

        match_data.append({
            "id": match.id,
            "senderUserId1": match.userId1,
            "receiverUserId2": match.userId2,
            "petId": match.petId,
            "status": match.status,
            "createdAt": match.createdAt.isoformat(),
            "updatedAt": match.updatedAt.isoformat(),
            "sellerId": pet.sellerId
        })

    return jsonify({"Matches": match_data}), 200


####################### CREATING MATCHES/sending a friend request ###############################
@matches_routes.route('/', methods=['POST'])
@login_required
def create_match():
    data = request.get_json()
    print("🟢 Received Data:", data)  # ✅ Debugging: Print incoming request

    userId2 = data.get('userId2')
    petId = data.get('petId')
    new_status = data.get('status', 'REQUESTED')
    print(f"🟡 userId2: {userId2}, petId: {petId}, new_status: {new_status}")  # ✅ Debugging

    errors = {}
    if not userId2:
        errors['userId2'] = 'userId2 is required'
    if not petId:
        errors['petId'] = 'petId is required'

    if errors:
        print("🔴 Bad Request Errors:", errors)
        return jsonify({"message": "Bad Request", "errors": errors}), 400

    if new_status not in ['REQUESTED', 'APPROVED', 'REJECTED']:
        return jsonify({"error": "Invalid status. Must be REQUESTED, APPROVED, or REJECTED"}), 400

    existing_match = Match.query.filter_by(userId1=current_user.id, userId2=userId2, petId=petId).first()
    if existing_match:
        existing_match.status = new_status
        db.session.commit()
        return jsonify({
            "Match": {
                "id": existing_match.id,
                "userId1": existing_match.userId1,
                "userId2": existing_match.userId2,
                "petId": existing_match.petId,
                "status": existing_match.status,
                "createdAt": existing_match.createdAt.isoformat(),
                "updatedAt": existing_match.updatedAt.isoformat()
            }
        }), 200

    pet = Pet.query.get(petId)
    if not pet:
        return jsonify({"error": "Pet not found"}), 404
    if pet.sellerId != userId2:
        return jsonify({"error": "Unauthorized. Must be Pet Owner"}), 403

    if userId2 == current_user.id:
        return jsonify({"error": "Cannot request a match for your own pet"}), 400

    new_match = Match(
        userId1=current_user.id,
        userId2=userId2,
        petId=petId,
        status=new_status
    )

    db.session.add(new_match)
    db.session.commit()

    return jsonify({
        "Match": {
            "id": new_match.id,
            "userId1": new_match.userId1,
            "userId2": new_match.userId2,
            "petId": new_match.petId,
            "status": new_match.status,
            "createdAt": new_match.createdAt.isoformat(),
            "updatedAt": new_match.updatedAt.isoformat()
        }
    }), 201


####################### UPDATE MATCHES ###############################
@matches_routes.route('/<int:id>', methods=['PATCH'])
@login_required
def update_match(id):
    selected_match = Match.query.get_or_404(id, description="Match could not be found")
    pet = Pet.query.get_or_404(selected_match.petId)

    print('coming live', selected_match)
    print('from NY', pet)

    if pet.sellerId != current_user.id:
        return jsonify({"message": "Unauthorized. You cannot update this match"}), 403

    data = request.get_json()
    new_status = data.get('status')

    errors = {}
    if new_status not in ['APPROVED', 'REJECTED']:
        errors['status'] = 'Invalid status. Status must be APPROVED or REJECTED'
    if selected_match.status == 'APPROVED':
        errors['status'] = 'Cannot update an approved match'
    # if selected_match.status != 'REQUESTED':
    #     errors['status'] = 'Cannot update a match that is already approved or rejected'

    if errors:
        return jsonify({"message": "Bad Request", "errors": errors}), 400

    selected_match.status = new_status
    db.session.commit()

    return jsonify({
        "Updated Match": {
            "id": selected_match.id,
            "userId1": selected_match.userId1,
            "userId2": selected_match.userId2,
            "petId": selected_match.petId,
            "status": selected_match.status,
            "createdAt": selected_match.createdAt.isoformat(),
            "updatedAt": selected_match.updatedAt.isoformat()
    }}), 200

####################### DELETE MATCHES ###############################
@matches_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_match(id):
    selected_match = Match.query.get_or_404(id, description="Match could not be found")

    if selected_match.userId1 != current_user.id and selected_match.userId2 != current_user.id:
        return jsonify({"message": "Forbidden. You can only delete your own route"}), 403

    db.session.delete(selected_match)
    db.session.commit()

    return jsonify({"message": "Successfully deleted"}), 200
