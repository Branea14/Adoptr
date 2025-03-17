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
        (5, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4e3HAD3U3FE2NManqdJ1yAdbVdlxDDZAxYQ&s', True),
        (5, 'https://images.pexels.com/photos/1503537/pexels-photo-1503537.jpeg?auto=compress&cs=tinysrgb&w=600', False),

        # Pet6
        (6, 'https://images.pexels.com/photos/1933464/pexels-photo-1933464.jpeg?auto=compress&cs=tinysrgb&w=600', True),
        (6, 'https://images.pexels.com/photos/191353/pexels-photo-191353.jpeg?auto=compress&cs=tinysrgb&w=600', False),

        # Pet7
        (7, 'https://images.pexels.com/photos/14653224/pexels-photo-14653224.jpeg?auto=compress&cs=tinysrgb&w=600', True),

        # Pet8
        (8, "https://images.pexels.com/photos/28479799/pexels-photo-28479799/free-photo-of-majestic-great-dane-standing-on-lawn.jpeg?auto=compress&cs=tinysrgb&w=400", True),

        # Pet9
        (9, "https://images.pexels.com/photos/13678433/pexels-photo-13678433.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (9, "https://images.pexels.com/photos/18618490/pexels-photo-18618490/free-photo-of-puppy-with-blue-collar.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (9, "https://images.pexels.com/photos/15940443/pexels-photo-15940443/free-photo-of-a-golden-retriever-is-walking-on-a-leash.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (9, "https://images.pexels.com/photos/27908924/pexels-photo-27908924/free-photo-of-a-golden-retriever-sitting-on-the-ground-with-its-mouth-open.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet10
        (10, "https://images.pexels.com/photos/2685231/pexels-photo-2685231.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (10, "https://images.pexels.com/photos/1655990/pexels-photo-1655990.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet11
        (11, "https://images.pexels.com/photos/1420405/pexels-photo-1420405.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (11, "https://images.pexels.com/photos/163602/dog-puppy-yorkshire-terrier-yorkshire-terrier-puppy-163602.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (11, "https://images.pexels.com/photos/3512/garden-dog-pet.jpg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet12
        (12, 'https://images.pexels.com/photos/1242419/pexels-photo-1242419.jpeg?auto=compress&cs=tinysrgb&w=600', True),
        (12, 'https://images.pexels.com/photos/975413/pexels-photo-975413.jpeg?auto=compress&cs=tinysrgb&w=600', False),

        # Pet13
        (13, 'https://images.pexels.com/photos/10253852/pexels-photo-10253852.jpeg?auto=compress&cs=tinysrgb&w=600', True),
        (13, 'https://images.pexels.com/photos/5225527/pexels-photo-5225527.jpeg?auto=compress&cs=tinysrgb&w=600', False),

        # Pet14
        (14, 'https://images.pexels.com/photos/605496/pexels-photo-605496.jpeg?auto=compress&cs=tinysrgb&w=600', True),
        (14, 'https://images.pexels.com/photos/1294062/pexels-photo-1294062.jpeg?auto=compress&cs=tinysrgb&w=600', False),

        # Pet15
        (15, "https://images.pexels.com/photos/247968/pexels-photo-247968.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (15, "https://images.pexels.com/photos/1739095/pexels-photo-1739095.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (15, "https://images.pexels.com/photos/1790444/pexels-photo-1790444.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (15, "https://images.pexels.com/photos/1739093/pexels-photo-1739093.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet16
        (16, "https://images.pexels.com/photos/1009405/pexels-photo-1009405.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (16, "https://images.pexels.com/photos/29472456/pexels-photo-29472456/free-photo-of-jack-russell-terrier-standing-on-grass-outdoors.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (16, "https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (16, "https://images.pexels.com/photos/28377643/pexels-photo-28377643/free-photo-of-a-white-and-brown-dog-sitting-on-a-white-floor.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (16, "https://images.pexels.com/photos/1471102/pexels-photo-1471102.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet17
        (17, "https://images.pexels.com/photos/3196887/pexels-photo-3196887.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (17, "https://images.pexels.com/photos/3715587/pexels-photo-3715587.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet12
        (18, "https://images.pexels.com/photos/515873/pexels-photo-515873.jpeg?auto=compress&cs=tinysrgb&w=400", True),

        # Pet19
        (19, 'https://images.pexels.com/photos/31190676/pexels-photo-31190676/free-photo-of-adorable-shih-tzu-with-pink-hair-tie-relaxing.jpeg?auto=compress&cs=tinysrgb&w=600', True),

        # Pet20
        (20, 'https://images.pexels.com/photos/732456/pexels-photo-732456.jpeg?auto=compress&cs=tinysrgb&w=600', True),
        (20, 'https://images.pexels.com/photos/3687770/pexels-photo-3687770.jpeg?auto=compress&cs=tinysrgb&w=600', False),

        # Pet21
        (21, 'https://images.pexels.com/photos/5029639/pexels-photo-5029639.jpeg?auto=compress&cs=tinysrgb&w=600', True),

        # Pet22
        (22, "https://images.pexels.com/photos/2873382/pexels-photo-2873382.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (22, "https://images.pexels.com/photos/38066/pexels-photo-38066.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet23
        (23, "https://images.pexels.com/photos/786773/pexels-photo-786773.jpeg?auto=compress&cs=tinysrgb&w=400", True),

        # Pet24
        (24, "https://images.pexels.com/photos/1407167/pexels-photo-1407167.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (24, "https://images.pexels.com/photos/7516428/pexels-photo-7516428.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # 25
        (25, 'https://images.pexels.com/photos/7516482/pexels-photo-7516482.jpeg?auto=compress&cs=tinysrgb&w=600', True),
        (25, 'https://images.pexels.com/photos/7516523/pexels-photo-7516523.jpeg?auto=compress&cs=tinysrgb&w=600', False),

        # 26
        (26, 'https://images.pexels.com/photos/19165098/pexels-photo-19165098/free-photo-of-belgian-shepherd-dog-sitting-near-the-forest.jpeg?auto=compress&cs=tinysrgb&w=600', True),
        (26, 'https://images.pexels.com/photos/55806/malinois-dog-animal-animal-portrait-55806.jpeg?auto=compress&cs=tinysrgb&w=600', False),

        # 27
        (27, 'https://images.pexels.com/photos/31137577/pexels-photo-31137577/free-photo-of-happy-white-dog-in-pink-harness-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600', True),
        (27, 'https://images.pexels.com/photos/1445709/pexels-photo-1445709.jpeg?auto=compress&cs=tinysrgb&w=600', False),

        # 28
        (28, 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcStR7YzNz7p-SvEjZ9l9P9_l3bxFItkDCwEBggFuUVFlUPAX1MuJqoQXNr2n853_p2Ge3_Jg4m2NKLsFmpuEYBWnw', True),

        # Pet29
        (29, "https://images.pexels.com/photos/11060014/pexels-photo-11060014.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (29, "https://images.pexels.com/photos/8180501/pexels-photo-8180501.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (29, "https://images.pexels.com/photos/4203281/pexels-photo-4203281.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet30
        (30, "https://images.pexels.com/photos/3523317/pexels-photo-3523317.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (30, "https://images.pexels.com/photos/1562983/pexels-photo-1562983.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (30, "https://images.pexels.com/photos/1938125/pexels-photo-1938125.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet31
        (31, "https://images.pexels.com/photos/15096083/pexels-photo-15096083/free-photo-of-a-dog-with-its-tongue-out.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (31, "https://images.pexels.com/photos/12756410/pexels-photo-12756410.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (31, "https://images.pexels.com/photos/8368969/pexels-photo-8368969.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (31, "https://images.pexels.com/photos/8368958/pexels-photo-8368958.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # Pet32
        (32, "https://images.pexels.com/photos/1870643/pexels-photo-1870643.jpeg?auto=compress&cs=tinysrgb&w=400", True),
        (32, "https://images.pexels.com/photos/1766601/pexels-photo-1766601.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (32, "https://images.pexels.com/photos/1322182/pexels-photo-1322182.jpeg?auto=compress&cs=tinysrgb&w=400", False),
        (32, "https://images.pexels.com/photos/20292579/pexels-photo-20292579/free-photo-of-an-australian-shepherd-standing-on-a-field-with-purple-heather.jpeg?auto=compress&cs=tinysrgb&w=400", False),

        # 33
        (33, 'https://images.pexels.com/photos/8310427/pexels-photo-8310427.jpeg?auto=compress&cs=tinysrgb&w=600', True),

        # 34
        (34, 'https://images.pexels.com/photos/9956249/pexels-photo-9956249.jpeg?auto=compress&cs=tinysrgb&w=600', True),

        # 35
        (35, "https://images.pexels.com/photos/29932044/pexels-photo-29932044/free-photo-of-adorable-cavapoo-dog-in-cozy-warm-jacket.jpeg?auto=compress&cs=tinysrgb&w=600", True),

        # 36
        (36, "https://images.pexels.com/photos/12572488/pexels-photo-12572488.jpeg?auto=compress&cs=tinysrgb&w=600", True),

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
