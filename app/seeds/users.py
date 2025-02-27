from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime, timezone
import geohash



# Adds a demo user, you can add other users here if you want
users_data = [
    {
        "firstName": "Alice",
        "lastName": "Smith",
        "username": "alice_smith",
        "email": "alice@io.com",
        "password": "password",
        "kids": True,
        "hasBackyard": True,
        # "household": {"kids": True, "hasBackyard": True, "otherPets": "dogsOnly"},
        # "houseTrained": True,
        # "specialNeeds": False,
        # "careAndBehavior": ["houseTrained"],
        "otherPets": "dogsOnly",
        "petExperience": "current",
        # "idealAge": "young",
        # "idealSex": "noPreference",
        # "idealSize": "medium",
        # "lifestyle": "active",
        "latitude": 38.8977,
        "longitude": -77.0365
    },
    {
        "firstName": "Bob",
        "lastName": "Johnson",
        "username": "bob_johnson",
        "email": "bob@io.com",
        "password": "password",
        "kids": False,
        "hasBackyard": True,
        # "household": {"kids": False, "hasBackyard": True, "otherPets": "both"},
        # "houseTrained": True,
        # "specialNeeds": True,
        # "careAndBehavior": ["houseTrained", "specialNeeds"],
        "otherPets": "both",
        "petExperience": "current",
        # "idealAge": "adult",
        # "idealSex": "male",
        # "idealSize": "large",
        # "lifestyle": "veryActive",
        "latitude": 40.7128,
        "longitude": -74.0060
    },
    {
        "firstName": "Charlie",
        "lastName": "Davis",
        "username": "charlie_davis",
        "email": "charlie@io.com",
        "password": "password",
        "kids": True,
        "hasBackyard": False,
        # "household": {"kids": True, "hasBackyard": False, "otherPets": "catsOnly"},
        # "houseTrained": False,
        # "specialNeeds": True,
        # "careAndBehavior": ["specialNeeds"],
        "otherPets": "catsOnly",
        "petExperience": "firstTime",
        # "idealAge": "puppy",
        # "idealSex": "female",
        # "idealSize": "small",
        # "lifestyle": "lapPet",
        "latitude": 37.7749,
        "longitude": -122.4194,
    },
    {
        "firstName": "Diana",
        "lastName": "Williams",
        "username": "diana_williams",
        "email": "diana@io.com",
        "password": "password",
        "kids": False,
        "hasBackyard": False,
        # "household": {"kids": False, "hasBackyard": False, "otherPets": "none"},
        # "houseTrained": True,
        # "specialNeeds": False,
        # "careAndBehavior": ["houseTrained"],
        "otherPets": "none",
        "petExperience": "previous",
        # "idealAge": "senior",
        # "idealSex": "noPreference",
        # "idealSize": "noPreference",
        # "lifestyle": "laidback",
        "latitude": 34.0522,
        "longitude": -118.2437,
    },
    {
        "firstName": "Ethan",
        "lastName": "Martinez",
        "username": "ethan_martinez",
        "email": "ethan@io.com",
        "password": "password",
        "kids": False,
        "hasBackyard": True,
        # "household": {"kids": False, "hasBackyard": True, "otherPets": "other"},
        # "houseTrained": False,
        # "specialNeeds": True,
        # "careAndBehavior": ["specialNeeds"],
        "otherPets": "other",
        "petExperience": "current",
        # "idealAge": "noPreference",
        # "idealSex": "noPreference",
        # "idealSize": "medium",
        # "lifestyle": "active",
        "latitude": 41.8781,
        "longitude": -87.6298,
    }
]

def seed_users():
    users = []

    for user_data in users_data:
        user = User(
            firstName=user_data["firstName"],
            lastName=user_data["lastName"],
            username=user_data["username"],
            email=user_data["email"],
            password=user_data["password"],
            kids=user_data["kids"],
            hasBackyard=user_data["hasBackyard"],
            # houseTrained=user_data['houseTrained'],
            # specialNeeds=user_data['specialNeeds'],
            otherPets=user_data['otherPets'],
            petExperience=user_data["petExperience"],
            # idealAge=user_data["idealAge"],
            # idealSex=user_data["idealSex"],
            # idealSize=user_data["idealSize"],
            # lifestyle=user_data["lifestyle"],
            latitude=user_data["latitude"],
            longitude=user_data["longitude"],
            geohash=geohash.encode(user_data['latitude'], user_data['longitude'], precision=12),
            createdAt=datetime.now(timezone.utc),
            updatedAt=datetime.now(timezone.utc)
        )

        users.append(user)

    db.session.bulk_save_objects(users)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
