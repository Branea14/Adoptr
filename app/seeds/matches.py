from app.models import db, environment, SCHEMA, Match
from sqlalchemy.sql import text
from datetime import datetime, timezone


def seed_matches():
    match_data = [
        (1, 2, 6, "APPROVED"),
        (1, 4, 15, "REJECTED"),
        (1, 3, 10, "APPROVED"),
        (1, 5, 18, "REQUESTED"),

        (2, 3, 11, "APPROVED"),
        (2, 1, 4, "REQUESTED"),
        (2, 5, 19, "REJECTED"),
        (2, 4, 14, "APPROVED"),

        (3, 4, 13, "APPROVED"),
        (3, 2, 6, "REQUESTED"),
        (3, 5, 17, "APPROVED"),
        (3, 1, 1, "REQUESTED"),
        (3, 1, 2, "REJECTED"),

        (4, 5, 16, "APPROVED"),
        (4, 3, 9, "REQUESTED"),
        (4, 2, 8, "REQUESTED"),
        (4, 3, 11, "REJECTED"),

        (5, 1, 3, "APPROVED"),
        (5, 4, 13, "REQUESTED"),

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
