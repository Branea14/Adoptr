from app.models import db, IdealDogPreferences, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime, timezone



# Adds a demo user, you can add other users here if you want
preferences_data = [
    {
        "userId": 1,
        "houseTrained": True,
        "specialNeeds": False,
        "idealAge": "young",
        "idealSex": "noPreference",
        "idealSize": "medium",
        "lifestyle": "active",
    },
    {
        "userId": 2,
        "houseTrained": True,
        "specialNeeds": True,
        "idealAge": "adult",
        "idealSex": "male",
        "idealSize": "large",
        "lifestyle": "veryActive",
    },
    {
        "userId": 3,
        "houseTrained": False,
        "specialNeeds": True,
        "idealAge": "puppy",
        "idealSex": "female",
        "idealSize": "small",
        "lifestyle": "lapPet",
    },
    {
        "userId": 4,
        "houseTrained": True,
        "specialNeeds": False,
        "idealAge": "senior",
        "idealSex": "noPreference",
        "idealSize": "noPreference",
        "lifestyle": "laidback",
    },
    {
        "userId": 5,
        "houseTrained": False,
        "specialNeeds": True,
        "idealAge": "noPreference",
        "idealSex": "noPreference",
        "idealSize": "medium",
        "lifestyle": "active",
    }
]

def seed_ideal_dog_preferences():
    preferences = []

    for preference_data in preferences_data:
        preference = IdealDogPreferences(
            userId=preference_data["userId"],
            houseTrained=preference_data['houseTrained'],
            specialNeeds=preference_data['specialNeeds'],
            idealAge=preference_data["idealAge"],
            idealSex=preference_data["idealSex"],
            idealSize=preference_data["idealSize"],
            lifestyle=preference_data["lifestyle"],
            createdAt=datetime.now(timezone.utc),
            updatedAt=datetime.now(timezone.utc)
        )

        preferences.append(preference)

    db.session.bulk_save_objects(preferences)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_ideal_dog_preferences():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.ideal_dog_preferences RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM preferences"))

    db.session.commit()
