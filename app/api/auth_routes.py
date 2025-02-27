from flask import Blueprint, request, jsonify
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
import geohash

auth_routes = Blueprint('auth', __name__)


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': {'message': 'Unauthorized'}}, 401


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)
        return user.to_dict()
    return form.errors, 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    data = request.get_json()
    form = SignUpForm(data=data)
    # form['csrf_token'].data = request.cookies['csrf_token']

    if not form.validate():
        return jsonify({"errors": form.errors}), 400

        # household_data = {
        #     "kids": form.data['kids'],
        #     "hasBackyard": form.data['hasBackyard'],
        #     "otherPets": form.data['otherPets']
        # }
        # household_data = form.data["household"]
    try:
        latitude = float(form.data['latitude'])
        longitude = float(form.data['longitude'])
    except (ValueError, TypeError):
        return jsonify({"message": "Invalid lat or long"}), 400

    geo_hash = geohash.encode(latitude, longitude, precision=12)

    # care_and_behavior = form.data.get('careAndBehavior', None)
    # if care_and_behavior == []:
    #     care_and_behavior = None

    user = User(
        firstName=form.data['firstName'],
        lastName=form.data['lastName'],
        username=form.data['username'],
        email=form.data['email'],
        password=form.data['password'],
        avatar=form.data['avatar'],
        kids=form.data['kids'],
        hasBackyard=form.data['hasBackyard'],
        otherPets=form.data['otherPets'],
        petExperience=form.data['petExperience'],
        geohash=geo_hash,
        latitude=latitude,
        longitude=longitude,
        radius=form.data['radius']
        # houseTrained=form.data['houseTrained'],
        # specialNeeds=form.data['specialNeeds'],
        # idealAge=form.data['idealAge'],
        # idealSex=form.data['idealSex'],
        # idealSize=form.data['idealSize'],
        # lifestyle=form.data['lifestyle'],
    )
    db.session.add(user)
    db.session.commit()
    login_user(user)
    return user.to_dict(), 201


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': {'message': 'Unauthorized'}}, 401
