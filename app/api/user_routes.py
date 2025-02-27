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

    print('********************************************')
    print(user)

    if not user:
        return jsonify({"error": "User could not be found"}), 404

    if user.id != current_user_id:
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json()

    #validations and error handling
    errors = {}
    if not data.get('firstName') or len(data['firstName']) >= 255:
        errors['firstName'] = "First name is required and must be less than 255 characters"
    if not data.get('lastName') or len(data['lastName']) >= 255:
        errors['lastName'] = "Last name is required and must be less than 255 characters"
    if not data.get('username') or len(data['username']) >= 40:
        errors['username'] = "Username is required and must be less than 40 characters"
    if not data.get('email') or len(data['email']) >= 255:
        errors['email'] = "Email is required and must be less than 255 characters"
    if not data.get('password') or len(data['password']) >= 255:
        errors['password'] = "Password is required and must be less than 255 characters"

    # if not isinstance(data.get('household'), dict):
    #     errors['household'] = "Household inform must be JSON"
    # else:
    #     household = data['household']
    #     if 'kids' not in household or not isinstance(household['kids'], bool):
    #         errors['household_kids'] = 'Kids must be a boolean value (true/false)'
    #     if 'hasBackyard' not in household or not isinstance(household['hasBackyard'], bool):
    #         errors['household_hasBackyard'] = 'Has Backyard must be a boolean value (true/false)'
    #     if 'otherPets' not in household or household['otherPets'] not in ['none', 'dogsOnly', 'catsOnly', 'both', 'other']:
    #         errors['household_otherPets'] = "Invalid value for otherPets. Must be none, dogsOnly, catsOnly, both, or other."

    # care_and_behavior = data.get('careAndBehavior', None)
    # if care_and_behavior == []:
    #     care_and_behavior = None

    if data.get('kids') is None or not isinstance(data.get('kids'), bool):
        errors['kids'] = "Must have Boolean value"
    if data.get('hasBackyard') is None or not isinstance(data.get('hasBackyard'), bool):
        errors['hasBackyard'] = "Must have Boolean value"

    if data.get('otherPets') not in ['none', 'dogsOnly', 'catsOnly', 'both', 'other']:
        errors['otherPets'] = "Invalid other pet selection"
    if data.get('petExperience') not in ['firstTime', 'previous', 'current']:
        errors['petExperience'] = "Invalid pet experience selection"
    if not data.get('latitude'):
        errors['latitude'] = "User must share their location"
    if not data.get('longitude'):
        errors['longitude'] = "User must share their location"

    # moved to other table
    # if not data.get('houseTrained') or not isinstance(data.get('houseTrained'), bool):
    #     errors['houseTrained'] = "Must have Boolean value"
    # if not data.get('specialNeeds') or not isinstance(data.get('specialNeeds'), bool):
    #     errors['specialNeeds'] = "Must have Boolean value"
    # if data.get('idealAge') not in ['noPreference','puppy', 'young', 'adult', 'senior']:
    #     errors['idealAge'] = "Invalid age selection"
    # if data.get('idealSex') not in ['noPreference', 'male', 'female']:
    #     errors['idealSex'] = "Invalid sex selection"
    # if data.get('idealSize') not in ['noPreference', 'small', 'medium', 'large', 'xl']:
    #     errors['idealSize'] = "Invalid size selection"
    # if data.get('lifestyle') not in ['noPreference', 'veryActive', 'active', 'laidback', 'lapPet']:
    #     errors['lifestyle'] = "Invalid lifestyle selection"

    if errors:
        return jsonify({'message': "Bad Request", "errors": errors}), 400


    user.firstName = data['firstName']
    user.lastName = data['lastName']
    user.username = data['username']
    user.email = data['email']
    user.password = data['password']
    user.avatar = data['avatar']
    user.kids = data['kids']
    user.hasBackyard = data['hasBackyard']
    user.otherPets = data['otherPets']
    user.petExperience = data['petExperience']
    user.latitude = data['latitude']
    user.longitude = data['longitude']
    user.radius = data['radius']

    # user.household = data['household']
    # user.careAndBehavior = data['careAndBehavior']

    # moved to other table
    # user.houseTrained = data['houseTrained']
    # user.specialNeeds = data['specialNeeds']
    # user.idealAge = data['idealAge']
    # user.idealSex = data['idealSex']
    # user.idealSize = data['idealSize']
    # user.lifestyle = data['lifestyle']

    db.session.commit()

    return jsonify({
        'id': user.id,
        'firstName': user.firstName,
        'lastName': user.lastName,
        'username': user.username,
        'email': user.email,
        'avatar': user.avatar,
        'kids': user.kids,
        'hasBackyard': user.hasBackyard,
        # 'houseTrained': user.houseTrained,
        # 'specialNeeds': user.specialNeeds,
        'otherPets': user.otherPets,
        'petExperience': user.petExperience,
        # 'idealAge': user.idealAge,
        # 'idealSex': user.idealSex,
        # 'idealSize': user.idealSize,
        # 'lifestyle': user.lifestyle,
        'geohash': user.geohash,
        'latitude': float(user.latitude),
        'longitude': float(user.longitude),
        'radius': float(user.radius),
        # 'household': user.household,
        # 'careAndBehavior': user.careAndBehavior,
        'createdAt': user.createdAt.isoformat(),  # Converts datetime to string
        'updatedAt': user.updatedAt.isoformat()
    })
