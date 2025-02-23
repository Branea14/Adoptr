from app.models import db, environment, SCHEMA, Pet
from sqlalchemy.sql import text
from datetime import datetime, timezone


def seed_pets():
    pet_data = [
        # Pets listed by Seller ID 1 (Alice)
        (1, "Buddy", "A playful Golden Retriever who loves the outdoors.", "Golden Retriever", True, "Golden", False, "puppy", "male", "large", "available", "play", "veryActive", {"kidsFriendly": True, "otherPets": "dogsOnly"}, ["houseTrained"]),
        (1, "Shadow", "A shy but affectionate mixed breed pup.", "Mixed Breed", False, "Black & White", True, "puppy", "male", "medium", "available", "physicalTouch", "laidback", {"kidsFriendly": False}, ["basic"]),
        (1, "Hazel", "A calm and loving senior dog.", "Cocker Spaniel", True, "Brown", False, "senior", "female", "small", "pendingAdoption", "physicalTouch", "laidback", {"kidsFriendly": False, "otherPets": "both"}, ["advanced"]),
        (1, "Rex", "A highly intelligent and obedient German Shepherd.", "German Shepherd", True, "Black & Tan", False, "adult", "male", "large", "available", "training", "active", {"kidsFriendly": True}, ["advanced"]),

        # Pets listed by Seller ID 2 (Bob)
        (2, "Max", "A gentle giant who loves belly rubs.", "Great Dane", True, "Blue", False, "adult", "male", "xl", "pendingAdoption", "treats", "laidback", {"kidsFriendly": True, "otherPets": "none"}, ["houseTrained", "specialNeeds"]),
        (2, "Ginger", "A sweet and loving Golden Retriever.", "Golden Retriever", True, "Golden", False, "young", "female", "large", "pendingAdoption", "play", "veryActive", {"kidsFriendly": True, "otherPets": "dogsOnly"}, ["advanced"]),
        (2, "Duke", "A strong and protective Rottweiler.", "Rottweiler", True, "Black & Mahogany", False, "adult", "male", "large", "available", "training", "veryActive", {"kidsFriendly": False}, ["moderate"]),
        (2, "Maggie", "A small but brave Yorkshire Terrier.", "Yorkshire Terrier", True, "Tan & Black", False, "young", "female", "small", "available", "independent", "lapPet", {"kidsFriendly": True, "otherPets": "none"}, ["houseTrained"]),

        # Pets listed by Seller ID 3 (Charlie)
        (3, "Rocky", "An energetic Labrador Retriever who needs space to run.", "Labrador Retriever", True, "Chocolate", False, "young", "male", "large", "adopted", "play", "active", {"kidsFriendly": True}, ["moderate"]),
        (3, "Milo", "A small dog with a big personality!", "Jack Russell Terrier", True, "White & Brown", False, "adult", "male", "small", "available", "training", "veryActive", {"kidsFriendly": False, "otherPets": "dogsOnly"}, ["houseTrained"]),
        (3, "Thor", "A strong and protective Husky.", "Siberian Husky", False, "Gray & White", False, "adult", "male", "large", "available", "training", "veryActive", {"kidsFriendly": True, "otherPets": "none"}, ["moderate"]),
        (3, "Rusty", "A playful and energetic mixed breed.", "Mixed Breed", False, "Red", True, "puppy", "male", "medium", "available", "training", "veryActive", {"kidsFriendly": True}, ["basic"]),

        # Pets listed by Seller ID 4 (Diana)
        (4, "Bella", "A loyal and protective German Shepherd.", "German Shepherd", True, "Black & Tan", False, "adult", "female", "large", "available", "physicalTouch", "active", {"kidsFriendly": True}, ["advanced"]),
        (4, "Charlie", "A laidback and friendly Basset Hound.", "Basset Hound", True, "White & Brown", False, "senior", "male", "medium", "pendingAdoption", "independent", "laidback", {"kidsFriendly": False, "otherPets": "none"}, ["houseTrained"]),
        (4, "Sasha", "A playful and social Poodle.", "Poodle", True, "White", False, "young", "female", "small", "available", "play", "active", {"kidsFriendly": True}, ["houseTrained"]),

        # Pets listed by Seller ID 5 (Ethan)
        (5, "Daisy", "A playful pup with lots of love to give.", "Beagle", False, "Tricolor", False, "puppy", "female", "medium", "available", "play", "active", {"kidsFriendly": True, "otherPets": "dogsOnly"}, ["basic"]),
        (5, "Buster", "A fun-loving dog who loves the outdoors.", "Border Collie", True, "Black & White", False, "young", "male", "medium", "available", "play", "veryActive", {"kidsFriendly": True}, ["moderate"]),
        (5, "Tank", "A protective but loving Bullmastiff.", "Bullmastiff", True, "Fawn", False, "adult", "male", "xl", "available", "training", "laidback", {"kidsFriendly": True, "otherPets": "none"}, ["houseTrained"]),
        (5, "Cooper", "A cheerful and smart Australian Shepherd.", "Australian Shepherd", True, "Merle", False, "young", "male", "medium", "available", "play", "veryActive", {"kidsFriendly": True, "otherPets": "dogsOnly"}, ["advanced"]),
    ]

    pet_objects = []
    for seller_id, name, description, breed, vaccinated, color, owner_surrender, age, sex, size, adoption_status, love_language, lifestyle, household, care_and_behavior in pet_data:
        pet = Pet(
            sellerId=seller_id,
            name=name,
            description=description,
            breed=breed,
            vaccinated=vaccinated,
            color=color,
            ownerSurrender=owner_surrender,
            age=age,
            sex=sex,
            size=size,
            adoptionStatus=adoption_status,
            loveLanguage=love_language,
            lifestyle=lifestyle,
            household=household,
            careAndBehavior=care_and_behavior,
            createdAt=datetime.now(timezone.utc),
            updatedAt=datetime.now(timezone.utc),
        )
        pet_objects.append(pet)

    db.session.add_all(pet_objects)
    db.session.commit()




# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_pets():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
