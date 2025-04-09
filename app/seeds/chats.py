from app.models import db, environment, SCHEMA, ChatHistory
from sqlalchemy.sql import text
from datetime import datetime, timezone


def seed_chats():
    chat_data = [
        # Conversations about Pet ID 9
        (1, 2, 9, "Hey! Is Ginger still available?", "SENT"),
        (2, 1, 9, "Yes! Would you like to set up a meeting?", "DELIVERED"),
        (1, 2, 9, "Yes, that would be great! When are you available?", "READ"),

        # Conversations about Pet ID 17
        (2, 3, 17, "I’m interested in Thor. Is he good with kids?", "SENT"),
        (3, 2, 17, "Yes! Thor is very gentle and loves playing with children.", "DELIVERED"),
        (2, 3, 17, "Awesome! I’ll talk with my family and get back to you.", "READ"),

        # Conversations about Pet ID 25
        (3, 4, 25, "Is Finn still looking for a home?", "SENT"),
        (4, 3, 25, "Yes, he is! He’s very energetic, do you have a yard?", "DELIVERED"),

        # Conversations about Pet ID 33
        (4, 5, 33, "I saw Hazel on the site. How is she with cats?", "SENT"),
        (5, 4, 33, "Hazel prefers to be in a home without any other pets.", "DELIVERED"),
        (4, 5, 33, "Okay, I’ll think about it. Thanks!", "READ"),

        # Conversations about Pet ID 5
        (5, 1, 5, "Hi! I’m interested in Tillman. Is he vaccinated?", "SENT"),
        (1, 5, 5, "Yes! He is up to date on all vaccinations.", "DELIVERED"),
        (5, 1, 5, "Great! Can I come meet him this weekend?", "READ"),

        # Conversations about Pet ID 16
        (1, 3, 16, "How is Milo with new people?", "SENT"),
        (3, 1, 16, "He takes some time to warm up, but he’s very loyal.", "DELIVERED"),
        (1, 3, 16, "Good to know! I’d love to come meet him.", "READ"),

        # Conversations about Pet ID 24
        (2, 4, 24, "What’s Sasha’s daily routine like?", "SENT"),
        (4, 2, 24, "She loves long walks/runs in the morning and cuddling at night.", "DELIVERED"),
        (2, 4, 24, "That sounds perfect! Let me check with my family.", "READ"),

        # Conversations about Pet ID 32
        (3, 5, 32, "Is Cooper still available for adoption?", "SENT"),
        (5, 3, 32, "Yes! He’s an energetic pup and loves to play!", "DELIVERED"),
        (3, 5, 32, "I’ll fill out an adoption application today!", "READ"),
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
