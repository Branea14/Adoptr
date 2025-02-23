from app.models import db, environment, SCHEMA, ChatHistory
from sqlalchemy.sql import text
from datetime import datetime, timezone


def seed_chats():
    chat_data = [
        # Conversations about Pet ID 3
        (1, 2, 3, "Hey! Is Buddy still available?", "SENT"),
        (2, 1, 3, "Yes! Would you like to set up a meeting?", "DELIVERED"),
        (1, 2, 3, "Yes, that would be great! When are you available?", "READ"),

        # Conversations about Pet ID 5
        (2, 3, 5, "I’m interested in Max. Is he good with kids?", "SENT"),
        (3, 2, 5, "Yes! Max is very gentle and loves playing with children.", "DELIVERED"),
        (2, 3, 5, "Awesome! I’ll talk with my family and get back to you.", "READ"),

        # Conversations about Pet ID 7
        (3, 4, 7, "Is Rocky still looking for a home?", "SENT"),
        (4, 3, 7, "Yes, he is! He’s very energetic, do you have a yard?", "DELIVERED"),
        (3, 4, 7, "Yes, we have a big yard and love active dogs!", "READ"),

        # Conversations about Pet ID 10
        (4, 5, 10, "I saw Bella on the site. How is she with other dogs?", "SENT"),
        (5, 4, 10, "Bella prefers to be the only dog in the home.", "DELIVERED"),
        (4, 5, 10, "Okay, I’ll think about it. Thanks!", "READ"),

        # Conversations about Pet ID 12
        (5, 1, 12, "Hi! I’m interested in Daisy. Is she vaccinated?", "SENT"),
        (1, 5, 12, "Yes! She is up to date on all vaccinations.", "DELIVERED"),
        (5, 1, 12, "Great! Can I come meet her this weekend?", "READ"),

        # Conversations about Pet ID 15
        (1, 3, 15, "How is Thor with new people?", "SENT"),
        (3, 1, 15, "He takes some time to warm up, but he’s very loyal.", "DELIVERED"),
        (1, 3, 15, "Good to know! I’d love to come meet him.", "READ"),

        # Conversations about Pet ID 17
        (2, 4, 17, "What’s Ginger’s daily routine like?", "SENT"),
        (4, 2, 17, "She loves long walks in the morning and cuddling at night.", "DELIVERED"),
        (2, 4, 17, "That sounds perfect! Let me check with my family.", "READ"),

        # Conversations about Pet ID 19
        (3, 5, 19, "Is Buster still available for adoption?", "SENT"),
        (5, 3, 19, "Yes! He’s an energetic pup and loves to play!", "DELIVERED"),
        (3, 5, 19, "I’ll fill out an adoption application today!", "READ"),

        # Extra random conversations
        (4, 1, 2, "Hazel is adorable! What’s her temperament like?", "SENT"),
        (1, 4, 2, "She’s very calm and loves relaxing on the couch.", "DELIVERED"),
        (5, 2, 9, "Can you tell me more about Shadow’s behavior?", "SENT"),
        (2, 5, 9, "Sure! He’s shy at first but warms up quickly.", "DELIVERED"),
        (1, 3, 14, "Does Rusty require any special care?", "SENT"),
        (3, 1, 14, "Nope! Just lots of love and attention.", "READ"),
    ]

    chat_objects = []
    for sender_id, receiver_id, pet_id, content, status in chat_data:
        chat = ChatHistory(
            senderId=sender_id,
            receiverId=receiver_id,
            petId=pet_id,
            content=content,
            status=status,
            createdAt=datetime.now(timezone.utc),
            updatedAt=datetime.now(timezone.utc),
        )
        chat_objects.append(chat)

    db.session.add_all(chat_objects)
    db.session.commit()


def undo_chats():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
