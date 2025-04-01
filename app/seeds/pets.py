from app.models import db, environment, SCHEMA, Pet
from sqlalchemy.sql import text
from datetime import datetime, timezone


def seed_pets():
    pet_data = [
        # Pets listed by Seller ID 1 (Alice) 1-7
        (1, "Buddy", "A playful Golden Retriever who loves the outdoors.", "Golden Retriever", True, False, "puppy", "male", "large", "adopted", "play", "veryActive", True, True, False, "dogsOnly"),
        (1, "Shadow", "A shy but affectionate mixed breed pup.", "Mixed Breed", False, True, "puppy", "male", "medium", "available", "physicalTouch", "laidback", False, True, False, "none"),
        (1, "Hazel", "A calm and loving senior dog.", "Cocker Spaniel", True, False, "senior", "female", "small", "available", "physicalTouch", "laidback", False, False, True, "both"),
        (1, "Rex", "A highly intelligent and obedient German Shepherd.", "German Shepherd", True, False, "adult", "male", "large", "available", "training", "active", True, False, True, "none"),
        (1, "Tillman", "A very active Bulldog that loves to skateboard.", "Bulldog", True, False, "adult", "male", "large", "available", "training", "active", True, True, False, "both"),
        (1, "Milo", "A small but mighty Chihuahua with a big personality.", "Chihuahua", False, True, "senior", "male", "small", "available", "physicalTouch", "lapPet", False, True, False, "both"),
        (1, "Sadie", "A dignified and elegant Greyhound who loves to sprint.", "Greyhound", True, False, "senior", "female", "large", "available", "training", "veryActive", True, True, False, "both"),

        # Pets listed by Seller ID 2 (Bob) 8-14
        (2, "Max", "A gentle giant who loves belly rubs.", "Great Dane", True, False, "adult", "male", "xl", "adopted", "treats", "laidback", True, True, True, "both"),
        (2, "Ginger", "A sweet and loving Golden Retriever.", "Golden Retriever", True, False, "young", "female", "large", "available", "play", "veryActive", True, False, True, "dogsOnly"),
        (2, "Duke", "A strong and protective Rottweiler.", "Rottweiler", True, False, "adult", "male", "large", "available", "training", "veryActive", False, False, False, "none"),
        (2, "Maggie", "A small but brave Yorkshire Terrier.", "Yorkshire Terrier", True, False, "young", "female", "small", "available", "independent", "lapPet", True, True, False, "none"),
        (2, "Max", "A loyal and intelligent Doberman who loves to guard and protect.", "Doberman Pinscher", True, False, "adult", "male", "large", "available", "physicalTouch", "veryActive", False, True, False, "none"),
        (2, "Bailey", "A gentle and loving Saint Bernard who enjoys snuggles.", "Saint Bernard", True, False, "senior", "male", "xl", "available", "treats", "laidback", True, True, True, "dogsOnly"),
        (2, "Duke", "A muscular and energetic Boxer who loves to run.", "Boxer", True, False, "adult", "male", "large", "available", "physicalTouch", "active", True, True, True, "dogsOnly"),

        # Pets listed by Seller ID 3 (Charlie) 15-21
        (3, "Rocky", "An energetic Labrador Retriever who needs space to run.", "Labrador Retriever", True, False, "young", "male", "large", "adopted", "play", "active", True, False, False, "dogsOnly"),
        (3, "Milo", "A small dog with a big personality!", "Jack Russell Terrier", True, False, "adult", "male", "small", "available", "training", "veryActive", False, True, False, "dogsOnly"),
        (3, "Thor", "A strong and protective Husky.", "Siberian Husky", False, False, "adult", "male", "large", "available", "training", "veryActive", True, False, False, "none"),
        (3, "Rusty", "A playful and energetic mixed breed.", "Mixed Breed", False, True, "puppy", "male", "medium", "available", "training", "veryActive", True, True, False, "none"),
        (3, "Maggie", "A sweet and social Shih Tzu who loves being around people.", "Shih Tzu", False, True, "senior", "female", "small", "available", "independent", "laidback", True, True, True, "none"),
        (3, "Gizmo", "A small, intelligent, and lively Pomeranian with a big personality.", "Pomeranian", True, False, "young", "male", "small", "available", "play", "active", True, False, True, "both"),
        (3, "Chloe", "A rare and beautiful Afghan Hound with a regal personality.", "Afghan Hound", True, False, "adult", "female", "large", "available", "independent", "laidback", False, True, True, "both"),

        # Pets listed by Seller ID 4 (Diana) 22-28
        (4, "Bella", "A loyal and protective German Shepherd.", "German Shepherd", True, False, "adult", "female", "large", "adopted", "physicalTouch", "active", True, False, True, "both"),
        (4, "Charlie", "A laidback and friendly Basset Hound.", "Basset Hound", True, False, "senior", "male", "medium", "available", "independent", "laidback", False, True, False, "both"),
        (4, "Sasha", "A playful and social Poodle.", "Poodle", True, False, "young", "female", "small", "available", "play", "active", True, True, False, "both"),
        (4, "Finn", "A cheerful and loyal Nova Scotia Duck Tolling Retriever.", "Nova Scotia Duck Tolling Retriever", True, False, "young", "male", "medium", "available", "training", "veryActive", True, True, True, "both"),
        (4, "Loki", "An intelligent and alert Belgian Malinois with a strong work ethic.", "Belgian Malinois", True, False, "adult", "male", "large", "available", "training", "veryActive", False, True, False, "none"),
        (4, "Stella", "A loving and gentle Samoyed who enjoys cuddles and snowy adventures.", "Samoyed", True, False, "young", "female", "large", "available", "play", "active", True, True, True, "none"),
        (4, "Ruby", "A rare and strikingly beautiful Saluki with a graceful stride.", "Saluki", True, False, "adult", "female", "large", "available", "independent", "laidback", True, True, True, "catsOnly"),

        # Pets listed by Seller ID 5 (Ethan) 29-36
        (5, "Daisy", "A playful pup with lots of love to give.", "Beagle", False, False, "puppy", "female", "medium", "adopted", "play", "active", True, True, False, "dogsOnly"),
        (5, "Buster", "A fun-loving dog who loves the outdoors.", "Border Collie", True, False, "young", "male", "medium", "available", "play", "veryActive", True, False, False, "none"),
        (5, "Tank", "A protective but loving Bullmastiff.", "Bullmastiff", True, False, "adult", "male", "xl", "available", "training", "laidback", True, True, False, "none"),
        (5, "Cooper", "A cheerful and smart Australian Shepherd.", "Australian Shepherd", True, False, "young", "male", "medium", "available", "play", "veryActive", True, False, True, "catsOnly"),
        (5, "Hazel", "A happy and curious Schipperke who loves exploring.", "Schipperke", True, False, "young", "female", "small", "available", "play", "active", True, True, True, "none"),
        (5, "Benny", "A loyal and intelligent Akita with a calm demeanor.", "Akita", True, False, "adult", "male", "large", "available", "training", "veryActive", False, True, False, "none"),
        (5, "Lily", "A sweet and well-behaved Cavapoo who loves snuggling on the couch.", "Cavapoo", True, True, "young", "female", "small", "available", "physicalTouch", "lapPet", True, True, True, "catsOnly"),
        (5, "Shadow", "A smart and trainable Black Mouth Cur with a protective instinct.", "Black Mouth Cur", True, False, "adult", "male", "medium", "available", "training", "veryActive", False, True, True, "none"),

        # adopted pets
        (1, "Aries", "Loves to eat cheeseburgers and cuddle", "Labrador Retriever", True, True, "senior", "male", "large", "adopted", "physicalTouch", "laidback", True, True, False, "none"),
        (1, "Truffles", "Three-legged pup who loves to play fetch and swim", "Labrador Retriever", True, False, "adult", "female", "large", "adopted", "play", "active", True, True, True, "none"),
        (2, "Luna", "Curious explorer with a nose for treats.", "Beagle", True, False, "young", "female", "large", "adopted", "play", "veryActive", True, True, False, "dogsOnly"),
        (2, "Rico", "Small dog with a big personality.", "Chihuahua", True, False, "young", "male", "small", "adopted", "physicalTouch", "active", False, False, False, "none"),
        (3, "Hazel", "Affectionate and always ready to cuddle.", "Golden Retriever", True, False, "puppy", "male", "large", "adopted", "treats", "veryActive", True, False, False, "catsOnly"),
        (3, "Zeke", "Energetic and goofy with a big heart.", "Boxer", True, True, "puppy", "male", "large", "adopted", "treats", "veryActive", False, False, False, "none"),
        (4, "Poppy", "Loves belly rubs and long naps.", "Cocker Spaniel", True, True, "adult", "female", "medium", "adopted", "physicalTouch", "lapPet", True, False, False, "none"),
        (4, "Theo", "Smart and active with lots of tricks up his paw.", "Australian Shepherd", True, False, "adult", "male", "medium", "adopted", "treats", "active", True, True, False, "none"),
        (5, "Cleo", "Calm lapdog who loves attention.", "Shih Tzu", True, False, "adult", "male", "small", "adopted", "physicalTouch", "lapPet", True, True, False, "none"),
        (5, "Lucy", "Lots of energy! Loves to run!", "Bichon Frisé", True, False, "puppy", "female", "small", "adopted", "treats", "veryActive", True, False, False, "none"),

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
