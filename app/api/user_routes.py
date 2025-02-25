from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, db

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()


####################### EDIT USER PROFILE ###############################
@user_routes.route('/<int:id>', methods=['PUT'])
@login_required
def edit_user(id):
    current_user_id = current_user.id
    user = User.query.get(id)

    if not user:
        return jsonify({"error": "User could not be found"}), 404

    if user.id != current_user_id:
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json()

    #validate
    if not data.get('firstName') or len(data['firstName']) >= 255:
        return jsonify({"message": "First name is required and must be less than 255 characters"}), 400
    if not data.get('lastName') or len(data['lastName']) >= 255:
        return jsonify({"message": "Last name is required and must be less than 255 characters"}), 400
    if not data.get('username') or len(data['username']) >= 40:
        return jsonify({"message": "Username is required and must be less than 40 characters"}), 400
    if not data.get('email') or len(data['email']) >= 255:
        return jsonify({"message": "Email is required and must be less than 255 characters"}), 400
    if not data.get('password') or len(data['password']) >= 255:
        return jsonify({"message": "Password is required and must be less than 255 characters"}), 400

    if not isinstance(data.get('household'), dict):
        return jsonify({"message": "Household inform must be JSON"}), 400

    household = data['household']
    if 'otherPets' not in household:
        household['otherPets'] = None

    care_and_behavior = data.get('careAndBehavior', None)
    if care_and_behavior == []:
        care_and_behavior = None

    if data.get('petExperience') not in ['firstTime', 'previous', 'current']:
        return jsonify({"message": "Invalid pet experience selection"}), 400
    if data.get('idealAge') not in ['noPreference','puppy', 'young', 'adult', 'senior']:
        return jsonify({"message": "Invalid age selection"}), 400
    if data.get('idealSex') not in ['noPreference', 'male', 'female']:
        return jsonify({"message": "Invalid sex selection"}), 400
    if data.get('idealSize') not in ['noPreference', 'small', 'medium', 'large', 'xl']:
        return jsonify({"message": "Invalid size selection"}), 400
    if data.get('lifestyle') not in ['noPreference', 'veryActive', 'active', 'laidback', 'lapPet']:
        return jsonify({"message": "Invalid lifestyle selection"}), 400

    if not data.get('latitude'):
        return jsonify({"message": "User must share their location"}), 400
    if not data.get('longitude'):
        return jsonify({"message": "User must share their location"}), 400

    user['firstName'] = data['firstName']
    user['lastName'] = data['lastName']
    user['username'] = data['username']
    user['email'] = data['email']
    user['password'] = data['password']
    user['avator'] = data['avator']
    user['petExperience'] = data['petExperience']
    user['idealAge'] = data['idealAge']
    user['idealSex'] = data['idealSex']
    user['idealSize'] = data['idealSize']
    user['latitude'] = data['latitude']
    user['longitude'] = data['longitude']
    user['radius'] = data['radius']
    user['lifestyle'] = data['lifestyle']
    user['household'] = data['household']
    user['careAndBehavior'] = data['careAndBehavior']

    db.session.commit()

    return jsonify({
        'id': user.id,
        'firstName': user.firstName,
        'lastName': user.lastName,
        'username': user.username,
        'email': user.email,
        'avator': user.avator,
        'petExperience': user.petExperience,
        'idealAge': user.idealAge,
        'idealSex': user.idealSex,
        'idealSize': user.idealSize,
        'lifestyle': user.lifestyle,
        'geohash': user.geohash,
        'latitude': float(user.latitude),
        'longitude': float(user.longitude),
        'radius': float(user.radius),
        'household': user.household,
        'careAndBehavior': user.careAndBehavior,
        'createdAt': user.createdAt.isoformat(),  # Converts datetime to string
        'updatedAt': user.updatedAt.isoformat()
    })
