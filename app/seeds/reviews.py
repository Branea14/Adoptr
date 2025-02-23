from app.models import db, environment, SCHEMA, Review
from sqlalchemy.sql import text
from datetime import datetime, timezone


def seed_reviews():
    review_data = [
        # Reviews for User 1 (Alice - ID: 1)
        (2, 1, "Alice was amazing! Highly professional and kind.", 5),
        (3, 1, "Great experience. Alice answered all my questions.", 5),
        (4, 1, "Smooth adoption, but some details were unclear.", 4),
        (5, 1, "Alice was patient and very supportive.", 5),
        (4, 1, "Process was longer than expected but worth it.", 4),
        (3, 1, "Pet was exactly as described. Thank you, Alice!", 5),
        (2, 1, "Had a small issue but Alice resolved it quickly.", 4),
        (5, 1, "Excellent experience, very friendly!", 5),

        # Reviews for User 2 (Bob - ID: 2)
        (1, 2, "Bob was very knowledgeable. Would adopt again!", 5),
        (4, 2, "Bob helped me find the perfect match!", 5),
        (5, 2, "The process was a bit slow, but Bob was helpful.", 4),
        (3, 2, "Bob was great! Everything went smoothly.", 5),
        (4, 2, "Adoption took longer than expected, but overall good.", 4),
        (1, 2, "Fast responses and very professional.", 5),

        # Reviews for User 3 (Charlie - ID: 3)
        (1, 3, "Charlie was fantastic! Great experience.", 5),
        (2, 3, "Smooth transaction, I love my pet!", 5),
        (5, 3, "Charlie was very patient and helpful.", 5),
        (4, 3, "There were a few miscommunications but still okay.", 3),
        (2, 3, "The pet needed more training than described.", 3),
        (1, 3, "Highly recommend Charlie! Super friendly.", 5),

        # Reviews for User 4 (Diana - ID: 4)
        (2, 4, "Diana was wonderful to work with!", 5),
        (3, 4, "Great experience, but I had to wait longer than expected.", 4),
        (1, 4, "Very professional, made everything smooth.", 5),
        (5, 4, "Adoption was easy and stress-free.", 5),
        (2, 4, "Pet had more needs than I was told, but still happy.", 3),
        (3, 4, "Would adopt from Diana again!", 5),

        # Reviews for User 5 (Ethan - ID: 5)
        (1, 5, "Ethan was amazing! Very helpful throughout.", 5),
        (3, 5, "The process was smooth, and Ethan was great!", 5),
        (4, 5, "I had a great experience! Thank you, Ethan!", 5),
        (2, 5, "Everything was perfect. Highly recommend Ethan!", 5),
        (1, 5, "Took a bit longer, but Ethan was very supportive.", 4),
        (3, 5, "Wish I had more details beforehand, but still happy.", 4),
        (4, 5, "Ethan was very responsive. Would work with him again!", 5),
        (2, 5, "Amazing experience, no issues at all!", 5),

        # Extra reviews to ensure variety
        (3, 2, "Bob was great, but response times were slow.", 3),
        (5, 1, "Alice really cares about the pets she adopts out!", 5),
    ]

    review_objects = []
    for reviewer_id, seller_id, review_text, stars in review_data:
        review = Review(
            sellerId=seller_id,
            reviewerId=reviewer_id,
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
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
