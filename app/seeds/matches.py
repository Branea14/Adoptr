from app.models import db, environment, SCHEMA, Match
from sqlalchemy.sql import text
from datetime import datetime, timezone


def seed_matches():
    match_data = [
        (1, 2, 9, "APPROVED"), #adopted
        (1, 4, 23, "REJECTED"), #adopted
        (1, 3, 16, "APPROVED"), #adopted
        (1, 5, 30, "REQUESTED"), #adopted
        (1, 3, 18, 'APPROVED')

        (2, 3, 17, "APPROVED"),
        (2, 1, 2, "REQUESTED"),
        (2, 5, 31, "REJECTED"),
        (2, 4, 24, "APPROVED"),

        (3, 4, 25, "APPROVED"),
        (3, 2, 10, "REQUESTED"),
        (3, 5, 32, "APPROVED"),
        (3, 1, 4, "REQUESTED"),
        (3, 1, 3, "REJECTED"),

        (4, 5, 33, "APPROVED"),
        (4, 3, 18, "REQUESTED"),
        (4, 2, 11, "REQUESTED"),
        (4, 3, 18, "REJECTED"),

        (5, 1, 5, "APPROVED"),
        (5, 4, 26, "REQUESTED"),

    ]

    match_objects = []
    for user1_id, user2_id, pet_id, status in match_data:
        match = Match(
            userId1=user1_id,
            userId2=user2_id,
            petId=pet_id,
            status=status,
            createdAt=datetime.now(timezone.utc),
            updatedAt=datetime.now(timezone.utc),
        )
        match_objects.append(match)

    db.session.add_all(match_objects)
    db.session.commit()


def undo_matches():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
