from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Pet, PetImage, db
from sqlalchemy import func
import random
from app.forms import PetListingForm

pet_routes = Blueprint('pets', __name__)

####################### GET ALL PETS BY CURRENT USER ###############################
@pet_routes.route('/current')
@login_required
def current_pets():
    current_user_id = current_user.id

    pets = Pet.query.filter_by(sellerId=current_user_id).all()

    pet_list = [{
        "id": pet.id,
        "name": pet.name,
        "sellerId": pet.sellerId,
        "description": pet.description,
        "breed": pet.breed,
        "vaccinated": pet.vaccinated,
        "color": pet.color,
        "ownerSurrender": pet.ownSurrender,
        "age": pet.age,
        "sex": pet.sex,
        "size": pet.size,
        "adoptionStatus": pet.adoptionStatus,
        "loveLanguage": pet.loveLanguage,
        "lifestyle": pet.lifestyle,
        "household": pet.household,
        "careAndBehavior": pet.careAndBehavior
    } for pet in pets]

    return jsonify({"Pets": pet_list})

####################### GET PET DETAILS ###############################
@pet_routes.route('/')
@login_required
def pet_details():
    # grabs 'nearby' query param in url
    # nearby = request.args.get('nearby') == 'true'

    # user-defined radius, default to .1
    try:
        radius = float(request.args.get('radius', 0.1))
    except ValueError:
        return jsonify({"error": "Invalid Radius Value"}), 400

    if current_user.latitude is None or current_user.longitude is None:
        return jsonify({"error": "User location is not available"}), 400

    user_lat, user_long = current_user.latitude, current_user.longitude

    nearby_pets_query = Pet.query.filter(
        func.abs(Pet.latitude - user_lat) <= radius,
        func.abs(Pet.longitude - user_long) <= radius
    ).all()

    if not nearby_pets_query:
        return jsonify({"error": "No nearby pets found"}), 404

    pet = random.choice(nearby_pets_query)

    pet_images = PetImage.query.filter_by(petId=pet.id).all()
    pet_images_list = [{
        "petId": image.id,
        "url": image.url,
        "preview": image.preview
    } for image in pet_images]

    pet_data = {
        "id": pet.id,
        "name": pet.name,
        "sellerId": pet.sellerId,
        "description": pet.description,
        "breed": pet.breed,
        "vaccinated": pet.vaccinated,
        "color": pet.color,
        "ownerSurrender": pet.ownSurrender,
        "age": pet.age,
        "sex": pet.sex,
        "size": pet.size,
        "adoptionStatus": pet.adoptionStatus,
        "loveLanguage": pet.loveLanguage,
        "lifestyle": pet.lifestyle,
        "household": pet.household,
        "careAndBehavior": pet.careAndBehavior,
        "PetImages": pet_images_list,
    }


    return jsonify(pet_data)


####################### CREATE PET LISTING ###############################
@pet_routes.route('/', methods=['POST'])
@login_required
def create_pet_listing():
    current_user_id = current_user.id
    data = request.get_json()

    # validate
    if not data.get('name') or len(data['name']) >= 50:
        return jsonify({"message": "Name is required and must be less than 50 characters"}), 400
    if not data.get('description'):
        return jsonify({"message": "Description is required"}), 400
    if not data.get('breed') or len(data['breed']) >= 50:
        return jsonify({"message": "Breed is required and must be less than 50 characters"}), 400
    if data.get('vaccinated') is None:
        return jsonify({"message": "Vaccination status must be selected"}), 400
    if not data.get('color') or len(data['color']) >= 50:
        return jsonify({"message": "Color is required and must be less than 50 characters"}), 400
    if data.get('ownerSurrender') is None:
        return jsonify({"message": "Owner Surrender status must be selected"}), 400

    if data.get('age') not in ['puppy', 'young', 'adult', 'senior']:
        return jsonify({"message": "Invalid age selection"}), 400
    if data.get('sex') not in ['male', 'female']:
        return jsonify({"message": "Invalid sex selection"}), 400
    if data.get('size') not in ['small', 'medium', 'large', 'xl']:
        return jsonify({"message": "Invalid size selection"}), 400
    if data.get('adoptionStatus') not in ['available', 'pendingAdoption', 'adopted']:
        return jsonify({"message": "Invalid adoption status selection"}), 400
    if data.get('loveLanguage') not in ['physicalTouch', 'treats', 'play', 'training', 'independent']:
        return jsonify({"message": "Invalid love language selection"}), 400
    if data.get('lifestyle') not in ['veryActive', 'active', 'laidback', 'lapPet']:
        return jsonify({"message": "Invalid lifestyle selection"}), 400

    if not isinstance(data.get('household'), dict):
        return jsonify({"message": "Household inform must be JSON"}), 400

    household = data['household']
    if 'otherPets' not in household:
        household['otherPets'] = None

    care_and_behavior = data.get('careAndBehavior', None)
    if care_and_behavior == []:
        care_and_behavior = None

    form = PetListingForm(data=data)

    if form.validate_on_submit():
        new_pet = Pet(
            sellerId=current_user_id,
            name=form.data['name'],
            description=form.data['description'],
            breed=form.data['breed'],
            vaccinated=form.data['vaccinated'],
            color=form.data['color'],
            ownerSurrender=form.data['ownerSurrender'],
            age=form.data['age'],
            sex=form.data['sex'],
            adoptionStatus=form.data['adoptionStatus'],
            loveLanguage=form.data['loveLanguage'],
            lifestyle=form.data['lifestyle'],
            household=form.data['household'],
            careAndBehavior=form.data['careAndBehavior']
        )

        db.session.add(new_pet)
        db.session.commit()

    return jsonify({"pet": new_pet.to_dict()}), 201

####################### EDIT PET LISTING ###############################
@pet_routes.route('/current/<int:petId>', methods=['PUT'])
@login_required
def edit_pet_listing(petId):
    current_user_id = current_user.id
    pet = Pet.query.get(petId)

    if not pet:
        return jsonify({"error": "No pet could be found"}), 404

    if pet.sellerId != current_user_id:
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json()

    # validate
    if not data.get('name') or len(data['name']) >= 50:
        return jsonify({"message": "Name is required and must be less than 50 characters"}), 400
    if not data.get('description'):
        return jsonify({"message": "Description is required"}), 400
    if not data.get('breed') or len(data['breed']) >= 50:
        return jsonify({"message": "Breed is required and must be less than 50 characters"}), 400
    if data.get('vaccinated') is None:
        return jsonify({"message": "Vaccination status must be selected"}), 400
    if not data.get('color') or len(data['color']) >= 50:
        return jsonify({"message": "Color is required and must be less than 50 characters"}), 400
    if data.get('ownerSurrender') is None:
        return jsonify({"message": "Owner Surrender status must be selected"}), 400

    if data.get('age') not in ['puppy', 'young', 'adult', 'senior']:
        return jsonify({"message": "Invalid age selection"}), 400
    if data.get('sex') not in ['male', 'female']:
        return jsonify({"message": "Invalid sex selection"}), 400
    if data.get('size') not in ['small', 'medium', 'large', 'xl']:
        return jsonify({"message": "Invalid size selection"}), 400
    if data.get('adoptionStatus') not in ['available', 'pendingAdoption', 'adopted']:
        return jsonify({"message": "Invalid adoption status selection"}), 400
    if data.get('loveLanguage') not in ['physicalTouch', 'treats', 'play', 'training', 'independent']:
        return jsonify({"message": "Invalid love language selection"}), 400
    if data.get('lifestyle') not in ['veryActive', 'active', 'laidback', 'lapPet']:
        return jsonify({"message": "Invalid lifestyle selection"}), 400

    if not isinstance(data.get('household'), dict):
        return jsonify({"message": "Household inform must be JSON"}), 400

    household = data['household']
    if 'otherPets' not in household:
        household['otherPets'] = None

    care_and_behavior = data.get('careAndBehavior', None)
    if care_and_behavior == []:
        care_and_behavior = None

    pet['name'] = data['name']
    pet['description'] = data['description']
    pet['breed'] = data['breed']
    pet['vaccinated'] = data['vaccinated']
    pet['color'] = data['color']
    pet['ownerSurrender'] = data['ownerSurrender']
    pet['age'] = data['age']
    pet['sex'] = data['sex']
    pet['adoptionStatus'] = data['adoptionStatus']
    pet['loveLanguage'] = data['loveLanguage']
    pet['lifestyle'] = data['lifestyle']
    pet['household'] = data['household']
    pet['careAndBehavior'] = data['careAndBehavior']

    db.session.commit()

    return jsonify({
        "id": pet.id,
        "sellerId": pet.sellerId,
        "name": pet.name,
        "description": pet.description,
        "breed": pet.breed,
        "vaccinated": pet.vaccinated,
        "color": pet.color,
        "ownerSurrender": pet.ownerSurrender,
        "age": pet.age,
        "sex": pet.sex,
        "adoptionStatus": pet.adoptionStatus,
        "loveLanguage": pet.loveLanguage,
        "lifestyle": pet.lifestyle,
        "household": pet.household,
        "careAndBehavior": pet.careAndBehavior,
        'createdAt': pet.createdAt,
        'updatedAt': pet.updatedAt
    })
