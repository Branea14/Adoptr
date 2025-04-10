from app.models import db, environment, SCHEMA, Review
from sqlalchemy.sql import text
from datetime import datetime, timezone


def seed_reviews():
    review_data = [
        # Reviews for User 1 (Alice - ID: 1)
        (2, 1, 37, "Alice was amazing! Highly professional and kind.", 5),
        (3, 1, 38, "Great experience. Alice answered all my questions.", 5),

        # Reviews for User 2 (Bob - ID: 2)
        (1, 2, 39, "Bob was very knowledgeable. Would adopt again!", 5),
        (4, 2, 40, "Bob helped me find the perfect match!", 5),

        # Reviews for User 3 (Charlie - ID: 3)
        (1, 3, 41, "Charlie was fantastic! Great experience.", 5),
        (2, 3, 42, "Smooth transaction, I love my pet!", 5),

        # Reviews for User 4 (Diana - ID: 4)
        (2, 4, 43, "Diana was wonderful to work with!", 5),
        (3, 4, 44, "Great experience, but I had to wait longer than expected.", 4),

        # Reviews for User 5 (Ethan - ID: 5)
        (1, 5, 45, "Ethan was amazing! Very helpful throughout.", 5),
        (3, 5, 46, "The process was smooth, and Ethan was great!", 5),

    ]

    review_objects = []
    for reviewer_id, seller_id, pet_id, review_text, stars in review_data:
        review = Review(
            sellerId=seller_id,
            reviewerId=reviewer_id,
            petId=pet_id,
            review=review_text,
            stars=stars,
            createdAt=datetime.now(timezone.utc),
            updatedAt=datetime.now(timezone.utc),
        )
        review_objects.append(review)

    db.session.add_all(review_objects)
    db.session.commit()



# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_reviews():
    if environment == "production":
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;"))
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
