from app.models import db, environment, SCHEMA, Adoption
from sqlalchemy.sql import text

def seed_adoptions():
    adoption_data = [
        # (user_id, pet_id)
        (2, 37),
        (3, 38),

        (1, 39),
        (4, 40),

        (1, 41),
        (2, 42),

        (2, 43),
        (3, 44),

        (1, 45),
        (3, 46),

        (1, 29),  # adopted but no review
        (1, 22),
        (3, 1),
        (4, 8),
        (5, 15)
    ]

    adoptions = [
        Adoption(petId=pet_id, adopterId=user_id)
        for user_id, pet_id in adoption_data
    ]

    db.session.add_all(adoptions)
    db.session.commit()


def undo_adoptions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.adoptions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM adoptions"))

    db.session.commit()
