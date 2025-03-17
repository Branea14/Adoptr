from app.models import db, environment, SCHEMA, Match
from sqlalchemy.sql import text
from datetime import datetime, timezone


def seed_matches():
    match_data = [
        (1, 2, 8, "APPROVED"),
        (1, 4, 22, "REJECTED"),
        (1, 3, 15, "APPROVED"),
        (1, 5, 29, "REQUESTED"),

        (2, 3, 16, "APPROVED"),
        (2, 1, 1, "REQUESTED"),
        (2, 5, 30, "REJECTED"),
        (2, 4, 23, "APPROVED"),

        (3, 4, 25, "APPROVED"),
        (3, 2, 9, "REQUESTED"),
        (3, 5, 31, "APPROVED"),
        (3, 1, 2, "REQUESTED"),
        (3, 1, 3, "REJECTED"),

        (4, 5, 32, "APPROVED"),
        (4, 3, 17, "REQUESTED"),
        (4, 2, 10, "REQUESTED"),
        (4, 3, 18, "REJECTED"),

        (5, 1, 4, "APPROVED"),
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
