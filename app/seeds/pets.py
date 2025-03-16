from app.models import db, environment, SCHEMA, Pet
from sqlalchemy.sql import text
from datetime import datetime, timezone


def seed_pets():
    pet_data = [
        # Pets listed by Seller ID 1 (Alice)
        (1, "Buddy", "A playful Golden Retriever who loves the outdoors.", "Golden Retriever", True, False, "puppy", "male", "large", "available", "play", "veryActive", True, True, False, "dogsOnly"),
        (1, "Shadow", "A shy but affectionate mixed breed pup.", "Mixed Breed", False, True, "puppy", "male", "medium", "available", "physicalTouch", "laidback", False, True, False, "none"),
        (1, "Hazel", "A calm and loving senior dog.", "Cocker Spaniel", True, False, "senior", "female", "small", "pendingAdoption", "physicalTouch", "laidback", False, False, True, "both"),
        (1, "Rex", "A highly intelligent and obedient German Shepherd.", "German Shepherd", True, False, "adult", "male", "large", "available", "training", "active", True, False, True, "none"),

        # Pets listed by Seller ID 2 (Bob)
        (2, "Max", "A gentle giant who loves belly rubs.", "Great Dane", True, False, "adult", "male", "xl", "pendingAdoption", "treats", "laidback", True, True, True, "none"),
        (2, "Ginger", "A sweet and loving Golden Retriever.", "Golden Retriever", True, False, "young", "female", "large", "pendingAdoption", "play", "veryActive", True, False, True, "dogsOnly"),
        (2, "Duke", "A strong and protective Rottweiler.", "Rottweiler", True, False, "adult", "male", "large", "available", "training", "veryActive", False, False, False, "none"),
        (2, "Maggie", "A small but brave Yorkshire Terrier.", "Yorkshire Terrier", True, False, "young", "female", "small", "available", "independent", "lapPet", True, True, False, "none"),

        # Pets listed by Seller ID 3 (Charlie)
        (3, "Rocky", "An energetic Labrador Retriever who needs space to run.", "Labrador Retriever", True, False, "young", "male", "large", "adopted", "play", "active", True, False, False, "none"),
        (3, "Milo", "A small dog with a big personality!", "Jack Russell Terrier", True, False, "adult", "male", "small", "available", "training", "veryActive", False, True, False, "dogsOnly"),
        (3, "Thor", "A strong and protective Husky.", "Siberian Husky", False, False, "adult", "male", "large", "available", "training", "veryActive", True, False, False, "none"),
        (3, "Rusty", "A playful and energetic mixed breed.", "Mixed Breed", False, True, "puppy", "male", "medium", "available", "training", "veryActive", True, True, False, "none"),

        # Pets listed by Seller ID 4 (Diana)
        (4, "Bella", "A loyal and protective German Shepherd.", "German Shepherd", True, False, "adult", "female", "large", "available", "physicalTouch", "active", True, False, True, "none"),
        (4, "Charlie", "A laidback and friendly Basset Hound.", "Basset Hound", True, False, "senior", "male", "medium", "pendingAdoption", "independent", "laidback", False, True, False, "none"),
        (4, "Sasha", "A playful and social Poodle.", "Poodle", True, False, "young", "female", "small", "available", "play", "active", True, True, False, "none"),

        # Pets listed by Seller ID 5 (Ethan)
        (5, "Daisy", "A playful pup with lots of love to give.", "Beagle", False, False, "puppy", "female", "medium", "available", "play", "active", True, True, False, "dogsOnly"),
        (5, "Buster", "A fun-loving dog who loves the outdoors.", "Border Collie", True, False, "young", "male", "medium", "available", "play", "veryActive", True, False, False, "none"),
        (5, "Tank", "A protective but loving Bullmastiff.", "Bullmastiff", True, False, "adult", "male", "xl", "available", "training", "laidback", True, True, False, "none"),
        (5, "Cooper", "A cheerful and smart Australian Shepherd.", "Australian Shepherd", True, False, "young", "male", "medium", "available", "play", "veryActive", True, False, True, "catsOnly")
    ]

    pet_objects = []
    for seller_id, name, description, breed, vaccinated, owner_surrender, age, sex, size, adoption_status, love_language, lifestyle, kids, house_trained, special_needs, other_pets  in pet_data:
        # care_and_behavior = None if not care_and_behavior else care_and_behavior

        # household= household or {}
        # if 'otherPets' not in household:
        #     household['otherPets'] = 'none'

        pet = Pet(
            sellerId=seller_id,
            name=name,
            description=description,
            breed=breed,
            vaccinated=vaccinated,
            # color=color,
            ownerSurrender=owner_surrender,
            age=age,
            sex=sex,
            size=size,
            adoptionStatus=adoption_status,
            loveLanguage=love_language,
            lifestyle=lifestyle,
            kids=kids,
            houseTrained=house_trained,
            specialNeeds=special_needs,
            otherPets=other_pets,
            # household=household,
            # careAndBehavior=care_and_behavior,
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
        db.session.execute(f"TRUNCATE table {SCHEMA}.pets RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM pets"))

    db.session.commit()
