from app.models import db, environment, SCHEMA, ChatHistory
from sqlalchemy.sql import text
from datetime import datetime, timezone


def seed_chats():
    chat_data = [
        # Conversations about Pet ID 3
        (1, 2, 13, "Hey! Is Bailey still available?", "SENT"),
        (2, 1, 13, "Yes! Would you like to set up a meeting?", "DELIVERED"),
        (1, 2, 13, "Yes, that would be great! When are you available?", "READ"),

        # Conversations about Pet ID 5
        (2, 3, 15, "I’m interested in Rocky. Is he good with kids?", "SENT"),
        (3, 2, 15, "Yes! Rocky is very gentle and loves playing with children.", "DELIVERED"),
        (2, 3, 15, "Awesome! I’ll talk with my family and get back to you.", "READ"),

        # Conversations about Pet ID 7
        (3, 4, 22, "Is Bella still looking for a home?", "SENT"),
        (4, 3, 22, "Yes, she is! She’s very energetic, do you have a yard?", "DELIVERED"),

        # Conversations about Pet ID 10
        (4, 5, 29, "I saw Daisy on the site. How is she with cats?", "SENT"),
        (5, 4, 29, "Daisy prefers to be in a dog-only home.", "DELIVERED"),
        (4, 5, 29, "Okay, I’ll think about it. Thanks!", "READ"),

        # Conversations about Pet ID 12
        (5, 1, 29, "Hi! I’m interested in Daisy. Is she vaccinated?", "SENT"),
        (1, 5, 29, "Yes! She is up to date on all vaccinations.", "DELIVERED"),
        (5, 1, 29, "Great! Can I come meet her this weekend?", "READ"),

        # Conversations about Pet ID 15
        (1, 3, 6, "How is Milo with new people?", "SENT"),
        (3, 1, 6, "He takes some time to warm up, but he’s very loyal.", "DELIVERED"),
        (1, 3, 6, "Good to know! I’d love to come meet him.", "READ"),

        # Conversations about Pet ID 17
        (2, 4, 22, "What’s Bella’s daily routine like?", "SENT"),
        (4, 2, 22, "She loves long walks in the morning and cuddling at night.", "DELIVERED"),
        (2, 4, 22, "That sounds perfect! Let me check with my family.", "READ"),

        # Conversations about Pet ID 19
        (3, 5, 32, "Is Cooper still available for adoption?", "SENT"),
        (5, 3, 32, "Yes! He’s an energetic pup and loves to play!", "DELIVERED"),
        (3, 5, 32, "I’ll fill out an adoption application today!", "READ"),

        # Extra random conversations
        (4, 1, 3, "Hazel is adorable! What’s her temperament like?", "SENT"),
        (1, 4, 3, "She’s very calm and loves relaxing on the couch.", "DELIVERED"),

        (5, 2, 14, "Can you tell me more about Duke’s behavior?", "SENT"),
        (2, 5, 14, "Sure! He’s shy at first but warms up quickly.", "DELIVERED"),

        (1, 3, 18, "Does Rusty require any special care?", "SENT"),
        (3, 1, 18, "Nope! Just lots of love and attention.", "READ"),
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
