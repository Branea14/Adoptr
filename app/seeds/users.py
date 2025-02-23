from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime, timezone


# Adds a demo user, you can add other users here if you want
def seed_users():
    user1 = User(
        firstName="Alice",
        lastName="Smith",
        username="alice_smith",
        email="alice@io.com",
        password="password",
        household={"kids": True, "hasBackyard": True, "otherPets": "dogsOnly"},
        careAndBehavior=["houseTrained"],
        petExperience="current",
        idealAge="young",
        idealSex="noPreference",
        idealSize="medium",
        lifestyle="active",
        geohash="dpz83u1x",
        latitude=38.8977,
        longitude=-77.0365,
        createdAt=datetime.now(timezone.utc),
        updatedAt=datetime.now(timezone.utc),
    )

    user2 = User(
        firstName="Bob",
        lastName="Johnson",
        username="bob_johnson",
        email="bob@io.com",
        password="password",
        household={"kids": False, "hasBackyard": True, "otherPets": "both"},
        careAndBehavior=["houseTrained", "specialNeeds"],
        petExperience="current",
        idealAge="adult",
        idealSex="male",
        idealSize="large",
        lifestyle="veryActive",
        geohash="dr5r7p8k",
        latitude=40.7128,
        longitude=-74.0060,
        createdAt=datetime.now(timezone.utc),
        updatedAt=datetime.now(timezone.utc),
    )

    user3 = User(
        firstName="Charlie",
        lastName="Davis",
        username="charlie_davis",
        email="charlie@io.com",
        password="password",
        household={"kids": True, "hasBackyard": False, "otherPets": "catsOnly"},
        careAndBehavior=["specialNeeds"],
        petExperience="firstTime",
        idealAge="puppy",
        idealSex="female",
        idealSize="small",
        lifestyle="lapPet",
        geohash="c23n7g2m",
        latitude=37.7749,
        longitude=-122.4194,
        createdAt=datetime.now(timezone.utc),
        updatedAt=datetime.now(timezone.utc),
    )

    user4 = User(
        firstName="Diana",
        lastName="Williams",
        username="diana_williams",
        email="diana@io.com",
        password="password",
        household={"kids": False, "hasBackyard": False, "otherPets": "none"},
        careAndBehavior=["houseTrained"],
        petExperience="previous",
        idealAge="senior",
        idealSex="noPreference",
        idealSize="noPreference",
        lifestyle="laidback",
        geohash="9q8yyv8r",
        latitude=34.0522,
        longitude=-118.2437,
        createdAt=datetime.now(timezone.utc),
        updatedAt=datetime.now(timezone.utc),
    )

    user5 = User(
        firstName="Ethan",
        lastName="Martinez",
        username="ethan_martinez",
        email="ethan@io.com",
        password="password",
        household={"kids": False, "hasBackyard": True, "otherPets": "other"},
        careAndBehavior=["specialNeeds"],
        petExperience="current",
        idealAge="noPreference",
        idealSex="noPreference",
        idealSize="medium",
        lifestyle="active",
        geohash="dn5kpq1w",
        latitude=41.8781,
        longitude=-87.6298,
        createdAt=datetime.now(timezone.utc),
        updatedAt=datetime.now(timezone.utc),
    )
    db.session.add_all([user1, user2, user3, user4, user5])
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
