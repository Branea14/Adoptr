from flask import Blueprint, jsonify, request, session
from flask_login import login_required, current_user
from app.models import db, Match, Pet

matches_routes = Blueprint('matches', __name__)

####################### GET ALL APPROVED MATCHES ###############################
@matches_routes.route('/approved')
@login_required
def all_approved_matches():
    matches = Match.query.filter(
        ((Match.userId1 == current_user.id) | (Match.userId2 == current_user.id)) &
        (Match.status == 'APPROVED')
    ).all()

    match_data = [{
        "id": match.id,
        "senderUserId1": match.userId1,
        "receiverUserId2": match.userId2,
        "petId": match.petId,
        "status": match.status,
        "createdAt": match.createdAt.isoformat(),
        "updatedAt": match.updatedAt.isoformat()
    } for match in matches]

    return jsonify({"Matches": match_data}), 201


####################### CREATING MATCHES ###############################
@matches_routes.route('/', methods=['POST'])
@login_required
def create_match():
    data = request.get_json()
    userId2 = data.get('userId2')
    petId = data.get('petId')

    errors = {}
    if not userId2:
        errors['userId2'] = 'userId2 is required'
    if not petId:
        errors['petId'] = 'petId is required'

    if errors:
        return jsonify({"message": "Bad Request", "errors": errors}), 400

    existing_match = Match.query.filter_by(userId1=current_user.id, userId2=userId2, petId=petId).first()
    if existing_match:
        return jsonify({"error": "Match already exists"}), 409

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
        status='REQUESTED',
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
@matches_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_match(id):
    selected_match = Match.query.get_or_404(id, description="Match could not be found")

    if selected_match.userId2 != current_user.id:
        return jsonify({"message": "Unauthorized. You cannot update this match"}), 403

    data = request.get_json()
    new_status = data.get('status')

    errors = {}
    if new_status not in ['APPROVED', 'REJECTED']:
        errors['status'] = 'Invalid status. Status must be APPROVED or REJECTED'
    if selected_match.status != 'REQUESTED':
        errors['status'] = 'Cannot update a match that is already approved or rejected'

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
