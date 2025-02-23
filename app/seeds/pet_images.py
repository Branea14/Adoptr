from app.models import db, environment, SCHEMA, PetImage
from sqlalchemy.sql import text
from datetime import datetime, timezone


def seed_pet_images():
    pet_image_data = [
        # (1, "", False),

        # Pet1
        (1, "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (1, "https://images.pexels.com/photos/10361796/pexels-photo-10361796.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (1, "https://images.pexels.com/photos/29352255/pexels-photo-29352255/free-photo-of-adorable-golden-retriever-puppy-in-autumn-leaves.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (1, "https://images.pexels.com/photos/17188060/pexels-photo-17188060/free-photo-of-five-puppies-in-cage.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (1, "https://images.pexels.com/photos/7643256/pexels-photo-7643256.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet2
        (2, "https://images.pexels.com/photos/29372904/pexels-photo-29372904/free-photo-of-cute-puppy-laying-in-grass-outdoors.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (2, "https://images.pexels.com/photos/29372963/pexels-photo-29372963/free-photo-of-adorable-puppy-exploring-outdoors-in-nature.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet3
        (3, "https://images.pexels.com/photos/194505/pexels-photo-194505.png?auto=compress&cs=tinysrgb&w=400", True),
        (3, "https://images.pexels.com/photos/7516136/pexels-photo-7516136.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (3, "https://images.pexels.com/photos/7516159/pexels-photo-7516159.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet4
        (4, "https://images.pexels.com/photos/333083/pexels-photo-333083.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (4, "https://images.pexels.com/photos/342214/pexels-photo-342214.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (4, "https://images.pexels.com/photos/1633522/pexels-photo-1633522.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet5
        (5, "https://images.pexels.com/photos/28479799/pexels-photo-28479799/free-photo-of-majestic-great-dane-standing-on-lawn.jpeg?auto=compress&cs=tinysrgb&w=400", True),

        # Pet6
        (6, "https://images.pexels.com/photos/13678433/pexels-photo-13678433.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (6, "https://images.pexels.com/photos/18618490/pexels-photo-18618490/free-photo-of-puppy-with-blue-collar.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (6, "https://images.pexels.com/photos/15940443/pexels-photo-15940443/free-photo-of-a-golden-retriever-is-walking-on-a-leash.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (6, "https://images.pexels.com/photos/27908924/pexels-photo-27908924/free-photo-of-a-golden-retriever-sitting-on-the-ground-with-its-mouth-open.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet7
        (7, "https://images.pexels.com/photos/163602/dog-puppy-yorkshire-terrier-yorkshire-terrier-puppy-163602.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (7, "https://images.pexels.com/photos/2685231/pexels-photo-2685231.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (7, "https://images.pexels.com/photos/1655990/pexels-photo-1655990.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet8
        (8, "https://images.pexels.com/photos/1420405/pexels-photo-1420405.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (8, "https://images.pexels.com/photos/163602/dog-puppy-yorkshire-terrier-yorkshire-terrier-puppy-163602.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (8, "https://images.pexels.com/photos/3512/garden-dog-pet.jpg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet9
        (9, "https://images.pexels.com/photos/247968/pexels-photo-247968.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (9, "https://images.pexels.com/photos/1739095/pexels-photo-1739095.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (9, "https://images.pexels.com/photos/1790444/pexels-photo-1790444.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (9, "https://images.pexels.com/photos/1739093/pexels-photo-1739093.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet10
        (10, "https://images.pexels.com/photos/1009405/pexels-photo-1009405.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (10, "https://images.pexels.com/photos/29472456/pexels-photo-29472456/free-photo-of-jack-russell-terrier-standing-on-grass-outdoors.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (10, "https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (10, "https://images.pexels.com/photos/28377643/pexels-photo-28377643/free-photo-of-a-white-and-brown-dog-sitting-on-a-white-floor.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (10, "https://images.pexels.com/photos/1471102/pexels-photo-1471102.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet11
        (11, "https://images.pexels.com/photos/3196887/pexels-photo-3196887.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (11, "https://images.pexels.com/photos/3715587/pexels-photo-3715587.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet12
        (12, "https://images.pexels.com/photos/515873/pexels-photo-515873.jpeg?auto=compress&cs=tinysrgb&w=400", True),

        # Pet13
        (13, "https://images.pexels.com/photos/2873382/pexels-photo-2873382.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (13, "https://images.pexels.com/photos/38066/pexels-photo-38066.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet14
        (14, "https://images.pexels.com/photos/786773/pexels-photo-786773.jpeg?auto=compress&cs=tinysrgb&w=400", True),

        # Pet15
        (15, "https://images.pexels.com/photos/1407167/pexels-photo-1407167.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (15, "https://images.pexels.com/photos/7516428/pexels-photo-7516428.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet16
        (16, "https://images.pexels.com/photos/11060014/pexels-photo-11060014.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (16, "https://images.pexels.com/photos/8180501/pexels-photo-8180501.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (16, "https://images.pexels.com/photos/4203281/pexels-photo-4203281.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet17
        (17, "https://images.pexels.com/photos/3523317/pexels-photo-3523317.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (17, "https://images.pexels.com/photos/1562983/pexels-photo-1562983.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (17, "https://images.pexels.com/photos/1938125/pexels-photo-1938125.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet18
        (18, "https://images.pexels.com/photos/15096083/pexels-photo-15096083/free-photo-of-a-dog-with-its-tongue-out.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (18, "https://images.pexels.com/photos/12756410/pexels-photo-12756410.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (18, "https://images.pexels.com/photos/8368969/pexels-photo-8368969.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (18, "https://images.pexels.com/photos/8368958/pexels-photo-8368958.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet19
        (19, "https://images.pexels.com/photos/1870643/pexels-photo-1870643.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (19, "https://images.pexels.com/photos/1766601/pexels-photo-1766601.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (19, "https://images.pexels.com/photos/1322182/pexels-photo-1322182.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (19, "https://images.pexels.com/photos/20292579/pexels-photo-20292579/free-photo-of-an-australian-shepherd-standing-on-a-field-with-purple-heather.jpeg?auto=compress&cs=tinysrgb&w=400", False),
    ]

    pet_objects = []
    for pet_id, url, preview in pet_image_data:
        pet_image = PetImage(
            petId=pet_id,
            url=url,
            preview=preview,
            createdAt=datetime.now(timezone.utc),
            updatedAt=datetime.now(timezone.utc),
        )
        pet_objects.append(pet_image)

    db.session.add_all(pet_objects)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_pet_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
