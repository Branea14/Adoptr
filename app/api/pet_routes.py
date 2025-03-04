from flask import Blueprint, jsonify, request, session
from flask_login import login_required, current_user
from app.models import Pet, PetImage, db, User
from sqlalchemy import and_
import random
from app.forms import PetListingForm
from decimal import Decimal
from geopy.distance import geodesic

pet_routes = Blueprint('pets', __name__)

##################################### DEBUGGING ROUTE ####################################
@pet_routes.route('/nearby')
@login_required
def get_nearby_pets():
    user = current_user  # Alice (or the logged-in user)

    print(f"User {user.username} Location: ({user.latitude}, {user.longitude}), Radius: {user.radius}")

    pets = Pet.query.all()  # Fetch all pets

    visible_pets = []

    for pet in pets:
        pet_location = (pet.latitude, pet.longitude)
        user_location = (user.latitude, user.longitude)
        distance_km = geodesic(user_location, pet_location).km

        if distance_km <= (user.radius * 111):  # Convert degrees to km
            print(f"✅ Pet {pet.id} is within Alice's radius!")
            visible_pets.append(pet.to_dict())
        else:
            print(f"❌ Pet {pet.id} is too far ({distance_km:.2f} km)")

    return jsonify({"nearbyPets": visible_pets})



####################### GET ALL PETS BY CURRENT USER ###############################
@pet_routes.route('/by-current-user')
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
        "ownerSurrender": pet.ownerSurrender,

        "kids": pet.kids,
        "houseTrained": pet.houseTrained,
        "specialNeeds": pet.specialNeeds,
        "otherPets": pet.otherPets,

        "age": pet.age,
        "sex": pet.sex,
        "size": pet.size,
        "adoptionStatus": pet.adoptionStatus,
        "loveLanguage": pet.loveLanguage,
        "lifestyle": pet.lifestyle,

    } for pet in pets]

    return jsonify({"Pets": pet_list})

####################### GET PET DETAILS ###############################
@pet_routes.route('/swipe')
@login_required
def pet_details():
    # grabs 'nearby' query param in url
    # nearby = request.args.get('nearby') == 'true'

    # user-defined radius, default to .1

    try:
        radius = float(request.args.get('radius', current_user.radius or 0.1))
    except ValueError:
        return jsonify({"error": "Invalid Radius Value"}), 400

    if current_user.latitude is None or current_user.longitude is None:
        return jsonify({"error": "User location is not available"}), 400

    user_lat, user_long = current_user.latitude, current_user.longitude

    new_user_lat = Decimal(str(user_lat))
    new_user_long = Decimal(str(user_long))
    new_radius = Decimal(str(radius))

    if 'swiped_pets' not in session:
        session['swiped_pets'] = []

    swiped_pets = session['swiped_pets']
    # swiped_pets = session.get('swiped_pets', [])

    nearby_pets_query = Pet.query.join(User).filter(
        # does not support arithmethic operations involving column attributes
        # func.abs(Pet.latitude - user_lat) <= radius,
        # func.abs(Pet.longitude - user_long) <= radius
        and_(
            User.latitude.between(new_user_lat - new_radius, new_user_lat + new_radius),
            User.longitude.between(new_user_long - new_radius, new_user_long + new_radius),
        ),
        # Pet.id.notin_(swiped_pets), #exclude swiped pets
        Pet.sellerId != current_user.id
    ).all()

    if not nearby_pets_query:
        return jsonify({"error": "No nearby pets found"}), 404

    pet = random.choice(nearby_pets_query)

    # swiped_pets.append(pet.id) does not persist in session
    session['swiped_pets'] = list(set(session['swiped_pets'] + [pet.id])) # updates session, flask needs explicit reassignment

    pet_images = PetImage.query.filter_by(petId=pet.id).all()
    pet_images_list = [{
        "petId": pet.id,
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
        "ownerSurrender": pet.ownerSurrender,

        "kids": pet.kids,
        "houseTrained": pet.houseTrained,
        "specialNeeds": pet.specialNeeds,
        "otherPets": pet.otherPets,

        "age": pet.age,
        "sex": pet.sex,
        "size": pet.size,
        "adoptionStatus": pet.adoptionStatus,
        "loveLanguage": pet.loveLanguage,
        "lifestyle": pet.lifestyle,
        "PetImages": pet_images_list,
    }


    return jsonify(pet_data)


####################### CREATE PET LISTING ###############################
@pet_routes.route('/', methods=['POST'])
@login_required
def create_pet_listing():
    current_user_id = current_user.id
    data = request.get_json()

    images = data.get('images', [])

    # validations
    errors = {}
    if not data.get('name') or len(data['name']) >= 50:
        errors['name'] = "Name is required and must be less than 50 characters"
    if not data.get('description'):
        errors['description'] = "Description is required"
    if not data.get('breed') or len(data['breed']) >= 50:
        errors['breed'] = "Breed is required and must be less than 50 characters"
    if data.get('vaccinated') is None or not isinstance(data.get('vaccinated'), bool):
        errors['vaccinated'] = "Must have Boolean value"
    if not data.get('color') or len(data['color']) >= 50:
        errors['color'] = "Color is required and must be less than 50 characters"
    if data.get('ownerSurrender') is None or not isinstance(data.get('ownerSurrender'), bool):
        errors['ownerSurrender'] = "Must have Boolean value"

    if data.get('kids') is None or not isinstance(data.get('kids'), bool):
        errors['kids'] = "Must have Boolean value"
    if data.get('houseTrained') is None or not isinstance(data.get('houseTrained'), bool):
        errors['houseTrained'] = "Must have Boolean value"
    if data.get('specialNeeds') is None or not isinstance(data.get('specialNeeds'), bool):
        errors['specialNeeds'] = "Must have Boolean value"

    if data.get('otherPets') not in ['none', 'dogsOnly', 'catsOnly', 'both', 'other']:
        errors['otherPets'] = "Invalid other pet selection"
    if data.get('age') not in ['puppy', 'young', 'adult', 'senior']:
        errors['age'] = "Invalid age selection"
    if data.get('sex') not in ['male', 'female']:
        errors['sex'] = "Invalid sex selection"
    if data.get('size') not in ['small', 'medium', 'large', 'xl']:
        errors['size'] = "Invalid size selection"
    if data.get('adoptionStatus') not in ['available', 'pendingAdoption', 'adopted']:
        errors['adoptionStatus'] = "Invalid adoption status selection"
    if data.get('loveLanguage') not in ['physicalTouch', 'treats', 'play', 'training', 'independent']:
        errors['loveLanguage'] = "Invalid loveLanguage selection"
    if data.get('lifestyle') not in ['veryActive', 'active', 'laidback', 'lapPet']:
        errors['lifestyle'] = "Invalid lifestyle selection"
    if not isinstance(images, list) or any(not isinstance(img, dict)  or 'url' not in img for img in images):
        errors['images'] = "Image URLs must a list of objects with 'url' key"

    if errors:
        return jsonify({"message": "Bad Request", "errors": errors}), 400
    # if not isinstance(data.get('household'), dict):
    #     return jsonify({"message": "Household inform must be JSON"}), 400

    # household = data['household']
    # if 'otherPets' not in household:
    #     household['otherPets'] = None

    # care_and_behavior = data.get('careAndBehavior', None)
    # if care_and_behavior == []:
    #     care_and_behavior = None

    form = PetListingForm(data=data)
    form['csrf_token'].data = request.cookies['csrf_token']

    # if not form.validate():
    #     return jsonify({"message": "Bad Request", "errors": form.errors}), 400

    new_pet = Pet(
        sellerId=current_user_id,
        name=form.data['name'],
        description=form.data['description'],
        breed=form.data['breed'],
        vaccinated=form.data['vaccinated'],
        color=form.data['color'],
        ownerSurrender=form.data['ownerSurrender'],

        kids=form.data['kids'],
        houseTrained=form.data['houseTrained'],
        specialNeeds=form.data['specialNeeds'],
        otherPets=form.data['otherPets'],

        age=form.data['age'],
        sex=form.data['sex'],
        size=form.data['size'],
        adoptionStatus=form.data['adoptionStatus'],
        loveLanguage=form.data['loveLanguage'],
        lifestyle=form.data['lifestyle']
    )

    db.session.add(new_pet)
    db.session.commit()

    new_pet_images = []
    has_preview = False

    for img in images:
        url = img.get('url')
        preview = img.get('preview', False)

        if has_preview:
            preview = False
        elif preview:
            has_preview = True

        new_pet_images.append(PetImage(petId=new_pet.id, url=url, preview=preview))

    if new_pet_images:
        db.session.bulk_save_objects(new_pet_images)
        db.session.commit()

    return jsonify({"pet": new_pet.to_dict()}), 201

####################### EDIT PET LISTING ###############################
@pet_routes.route('/<int:petId>', methods=['PUT'])
@login_required
def edit_pet_listing(petId):
    current_user_id = current_user.id
    pet = Pet.query.get(petId)

    if not pet:
        return jsonify({"error": "No pet could be found"}), 404

    if pet.sellerId != current_user_id:
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json()
    images = data.get('images', [])

    # validate
    errors = {}
    if not data.get('name') or len(data['name']) >= 50:
        errors['name'] = "Name is required and must be less than 50 characters"
    if not data.get('description'):
        errors['description'] = "Description is required"
    if not data.get('breed') or len(data['breed']) >= 50:
        errors['breed'] = "Breed is required and must be less than 50 characters"
    if data.get('vaccinated') is None or not isinstance(data.get('vaccinated'), bool):
        errors['vaccinated'] = "Must have Boolean value"
    if not data.get('color') or len(data['color']) >= 50:
        errors['color'] = "Color is required and must be less than 50 characters"
    if data.get('ownerSurrender') is None or not isinstance(data.get('ownerSurrender'), bool):
        errors['ownerSurrender'] = "Must have Boolean value"

    if data.get('kids') is None or not isinstance(data.get('kids'), bool):
        errors['kids'] = "Must have Boolean value"
    if data.get('houseTrained') is None or not isinstance(data.get('houseTrained'), bool):
        errors['houseTrained'] = "Must have Boolean value"
    if data.get('specialNeeds') is None or not isinstance(data.get('specialNeeds'), bool):
        errors['specialNeeds'] = "Must have Boolean value"

    if data.get('otherPets') not in ['none', 'dogsOnly', 'catsOnly', 'both', 'other']:
        errors['otherPets'] = "Invalid other pet selection"
    if data.get('age') not in ['puppy', 'young', 'adult', 'senior']:
        errors['age'] = "Invalid age selection"
    if data.get('sex') not in ['male', 'female']:
        errors['sex'] = "Invalid sex selection"
    if data.get('size') not in ['small', 'medium', 'large', 'xl']:
        errors['size'] = "Invalid size selection"
    if data.get('adoptionStatus') not in ['available', 'pendingAdoption', 'adopted']:
        errors['adoptionStatus'] = "Invalid adoption status selection"
    if data.get('loveLanguage') not in ['physicalTouch', 'treats', 'play', 'training', 'independent']:
        errors['loveLanguage'] = "Invalid loveLanguage selection"
    if data.get('lifestyle') not in ['veryActive', 'active', 'laidback', 'lapPet']:
        errors['lifestyle'] = "Invalid lifestyle selection"
    if not isinstance(images, list) or any(not isinstance(img, dict) or 'url' not in img for img in images):
        errors['images'] = "Image URLs must be a list of objects with 'url' key"

    if errors:
        return jsonify({"message": "Bad Request", "errors": errors}), 400

    pet.name = data['name']
    pet.description = data['description']
    pet.breed = data['breed']
    pet.vaccinated = data['vaccinated']
    pet.color = data['color']
    pet.ownerSurrender = data['ownerSurrender']
    pet.kids = data['kids']
    pet.houseTrained = data['houseTrained']
    pet.specialNeeds = data['specialNeeds']
    pet.otherPets = data['otherPets']
    pet.age = data['age']
    pet.sex = data['sex']
    pet.size = data['size']
    pet.adoptionStatus = data['adoptionStatus']
    pet.loveLanguage = data['loveLanguage']
    pet.lifestyle = data['lifestyle']

    db.session.commit()


    existing_images = {img.id: img for img in pet.images}
    new_image_objects = []
    has_preview = any(img.preview for img in pet.images)
    incoming_image_ids = set()

    for img in images:
        img_id = img.get('id')
        url = img.get('url')
        preview = img.get('preview', False)
        if img_id is not None and img_id in existing_images:
            existing_image = existing_images[img_id]
            existing_image.url = url
            existing_image.preview = preview
            incoming_image_ids.add(img_id)
        else:
            # add image
            if preview and not has_preview:
                for existing_img in pet.images:
                    existing_img.preview = False
                has_preview = True

            new_image_objects.append(PetImage(petId=petId, url=url, preview=preview))

    # if incoming_image_ids:
    images_to_delete = [img for img_id, img in existing_images.items() if img_id not in incoming_image_ids]
    for img in images_to_delete:
       db.session.delete(img)

    if new_image_objects:
        db.session.bulk_save_objects(new_image_objects)

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
        "kids": pet.kids,
        "houseTrained": pet.houseTrained,
        "specialNeeds": pet.specialNeeds,
        "otherPets": pet.otherPets,
        "age": pet.age,
        "sex": pet.sex,
        "adoptionStatus": pet.adoptionStatus,
        "loveLanguage": pet.loveLanguage,
        "lifestyle": pet.lifestyle,
        "images": [
            {"id": img.id, "url": img.url, "preview": img.preview}
            for img in pet.images
        ],
        'createdAt': pet.createdAt,
        'updatedAt': pet.updatedAt
    })

@pet_routes.route('/<int:petId>', methods=['DELETE'])
@login_required
def delete_pet(petId):
    current_user_id = current_user.id
    pet = Pet.query.get(petId)

    if not pet:
        return jsonify({"error": "Pet not found"}), 404

    if pet.sellerId != current_user_id:
        return jsonify({"error": "Forbidden"}), 403

    db.session.delete(pet)
    db.session.commit()

    return jsonify({"message": "Successfully deleted"})
