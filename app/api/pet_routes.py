from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Pet, PetImage
from sqlalchemy import func
import random

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
    if not data.get('vaccinated'):
        return jsonify({"message": "No checkbox is selected"}), 400
    if not data.get('color') or len(data['color']) >= 50:
        return jsonify({"message": "Color is required and must be less than 50 characters"}), 400
    if not data.get('ownerSurrender'):
        return jsonify({"message": "No checkbox is selected"}), 400
