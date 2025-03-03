from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy import Enum
from flask_login import UserMixin
from datetime import datetime, timezone
from .review import Review
from .match import Match
from .chat_history import ChatHistory
from .ideal_dog_preference import IdealDogPreferences


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(255), nullable=False)
    lastName = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    avatar = db.Column(db.Text, nullable=True)

    # household and preferences
    kids = db.Column(db.Boolean, nullable=False)
    hasBackyard = db.Column(db.Boolean, nullable=False)

    otherPets = db.Column(Enum('none', 'dogsOnly', 'catsOnly', 'both', 'other', name='user_other_pets'), nullable=False)
    petExperience = db.Column(Enum('firstTime', 'previous', 'current', name='pet_experience'), nullable=False)
    # household = db.Column(JSON, nullable=False, default=dict)
    # careAndBehavior = db.Column(JSON, nullable=False, default=list)

    # location data
    geohash = db.Column(db.String(12), nullable=False)
    latitude = db.Column(db.Numeric(10, 7), nullable=False)
    longitude = db.Column(db.Numeric(10, 7), nullable=False)
    radius = db.Column(db.Numeric(5, 3), default=0.1, nullable=False)

    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False, onupdate=datetime.now(timezone.utc))

    # relationships here
    received_reviews = db.relationship('Review', foreign_keys=[Review.sellerId], back_populates='sellers', cascade='all, delete-orphan')
    written_reviews = db.relationship("Review", foreign_keys=[Review.reviewerId], back_populates="reviewers", cascade="all, delete-orphan")
    pets = db.relationship("Pet", back_populates="sellers", cascade='all, delete-orphan')
    sent_matches = db.relationship('Match', foreign_keys=[Match.userId1], back_populates='user1', cascade="all, delete-orphan")
    received_matches = db.relationship('Match', foreign_keys=[Match.userId2], back_populates='user2', cascade="all, delete-orphan")
    sender_chats = db.relationship('ChatHistory', foreign_keys=[ChatHistory.senderId], back_populates='sender', cascade="all, delete-orphan")
    receiver_chats = db.relationship('ChatHistory', foreign_keys=[ChatHistory.receiverId], back_populates='receiver', cascade="all, delete-orphan")
    preferences = db.relationship('IdealDogPreferences', foreign_keys=[IdealDogPreferences.userId], back_populates='user', uselist=False, cascade='all, delete-orphan')

    # moved to different table
    # houseTrained = db.Column(db.Boolean, nullable=False)
    # specialNeeds = db.Column(db.Boolean, nullable=False)
    # idealAge = db.Column(Enum('noPreference', 'puppy', 'young', 'adult', 'senior', name='ideal_age'), nullable=False)
    # idealSex = db.Column(Enum('noPreference', 'male', 'female', name='ideal_sex'), nullable=False)
    # idealSize = db.Column(Enum('noPreference', 'small', 'medium', 'large', 'xl', name='ideal_size'), nullable=False)
    # lifestyle = db.Column(Enum('noPreference', 'veryActive', 'active', 'laidback', 'lapPet', name='lifestyle'), nullable=False)


    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'username': self.username,
            'email': self.email,
            'avatar': self.avatar,
            'kids': self.kids,
            'hasBackyard': self.hasBackyard,
            'otherPets': self.otherPets,
            'petExperience': self.petExperience,
            'geohash': self.geohash,
            'latitude': float(self.latitude),
            'longitude': float(self.longitude),
            'radius': float(self.radius),
            'idealDogPreferences': self.preferences.to_dict() if self.preferences else None,
            'createdAt': self.createdAt.isoformat(),  # Converts datetime to string
            'updatedAt': self.updatedAt.isoformat()
            # 'houseTrained': self.houseTrained,
            # 'specialNeeds': self.specialNeeds,
            # 'idealAge': self.idealAge,
            # 'idealSex': self.idealSex,
            # 'idealSize': self.idealSize,
            # 'lifestyle': self.lifestyle,
        }

    def __repr__(self):
        return (f"<User id={self.id}, firstName='{self.firstName}', lastName='{self.lastName}', "
                f"username='{self.username}', email='{self.email}', "
                f"kids={self.kids}, hasBackyard={self.hasBackyard}, "
                f"petExperience='{self.petExperience}', otherPets='{self.otherPets}', "
                f"radius='{self.radius}', geohash='{self.geohash}', "
                f"latitude={float(self.latitude)}, longitude={float(self.longitude)}, "
                f"createdAt={self.createdAt}, updatedAt={self.updatedAt}>")
