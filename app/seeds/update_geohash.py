from app.models import User, db
import geohash

print('hellllooooooo')

def update_existing_geohashes():
    print('script started')
    users = User.query.all()
    updated_count = 0

    for user in users:
        if user.geohash and len(user.geohash) > 5:
            user.geohash = geohash.encode(user.latitude, user.longitude, precision=5)
            updated_count += 1

    if updated_count > 0:
        db.session.commit()
        print('updated geohashes!!!!!!!')
    else:
        print('nothing updated')



update_existing_geohashes()
