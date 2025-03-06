from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Review, User, db, IdealDogPreferences
from sqlalchemy.orm import joinedload

dog_preferences_routes = Blueprint('dog-preferences', __name__)

####################### FETCH DOG PREFERENCES ###############################
@dog_preferences_routes.route('/<int:userId>')
@login_required
def fetch_dog_preferences(userId):
    if userId != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    preferences = IdealDogPreferences.query.filter_by(userId=current_user.id).first()
    if not preferences:
        return jsonify({'error': "User does not have any dog preferences yet"}), 404

    preference_list = {
        "id": preferences.id,
        "userId": preferences.userId,
        "houseTrained": preferences.houseTrained,
        "specialNeeds": preferences.specialNeeds,
        "idealAge": preferences.idealAge,
        "idealSex": preferences.idealSex,
        "idealSize": preferences.idealSize,
        "lifestyle": preferences.lifestyle,
        "createdAt": preferences.createdAt.isoformat(),
        "updatedAt": preferences.updatedAt.isoformat(),
    }

    return jsonify({"dogPreferences": preference_list}), 200


####################### ADD DOG PREFERENCES ###############################
@dog_preferences_routes.route('/', methods=['POST'])
@login_required
def create_dog_preferences():
    existing_preferences = IdealDogPreferences.query.filter_by(userId=current_user.id).first()
    if existing_preferences:
        return jsonify({'error': "User already has dog preference. Use PUT to update"}), 400

    data = request.get_json()

    new_preferences = IdealDogPreferences(
        userId=current_user.id,
        houseTrained=data.get('houseTrained'),
        specialNeeds=data.get('specialNeeds'),
        idealAge=data.get('idealAge'),
        idealSex=data.get('idealSex'),
        idealSize=data.get('idealSize'),
        lifestyle=data.get('lifestyle')
    )
    db.session.add(new_preferences)
    db.session.commit()

    return jsonify(new_preferences.to_dict()), 201


####################### EDIT DOG PREFERENCES ###############################
@dog_preferences_routes.route('/', methods=['PUT'])
@login_required
def update_dog_preferences():
    preferences = IdealDogPreferences.query.filter_by(userId=current_user.id).first()

    if not preferences:
        return jsonify({'error': "User has not completed dog preferences. Use POST to create"}), 404

    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    preferences.houseTrained = data.get('houseTrained', preferences.houseTrained)
    preferences.specialNeeds = data.get('specialNeeds', preferences.specialNeeds)
    preferences.idealAge = data.get('idealAge', preferences.idealAge)
    preferences.idealSex = data.get('idealSex', preferences.idealSex)
    preferences.idealSize = data.get('idealSize', preferences.idealSize)
    preferences.lifestyle = data.get('lifestyle', preferences.lifestyle)

    db.session.commit()

    return jsonify(preferences.to_dict()), 200

####################### DELETE DOG PREFERENCES ###############################
@dog_preferences_routes.route('/', methods=['DELETE'])
@login_required
def delete_dog_preferences():
    preferences = IdealDogPreferences.query.filter_by(userId=current_user.id).first()

    if not preferences:
        return jsonify({'error': "User has not completed dog preferences"}), 404

    db.session.delete(preferences)
    db.session.commit()

    return jsonify({"message": "Successfully deleted"}), 200
