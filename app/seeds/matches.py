from app.models import db, environment, SCHEMA, Match
from sqlalchemy.sql import text
from datetime import datetime, timezone


def seed_matches():
    match_data = [
        # Approved Matches
        (1, 2, 3, "APPROVED"),
        (2, 3, 5, "APPROVED"),
        (3, 4, 7, "APPROVED"),
        (4, 5, 10, "APPROVED"),
        (5, 1, 12, "APPROVED"),
        (1, 3, 15, "APPROVED"),
        (2, 4, 17, "APPROVED"),
        (3, 5, 19, "APPROVED"),

        # Requested Matches
        (2, 1, 4, "REQUESTED"),
        (3, 2, 6, "REQUESTED"),
        (4, 3, 8, "REQUESTED"),
        (5, 4, 11, "REQUESTED"),
        (1, 5, 13, "REQUESTED"),
        (3, 1, 16, "REQUESTED"),
        (4, 2, 18, "REQUESTED"),

        # Rejected Matches
        (1, 4, 2, "REJECTED"),
        (2, 5, 9, "REJECTED"),
        (3, 1, 14, "REJECTED"),
        (4, 3, 1, "REJECTED"),
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
