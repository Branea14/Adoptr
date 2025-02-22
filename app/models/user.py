from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy import Enum
from flask_login import UserMixin
from datetime import datetime, timezone


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

    household = db.Column(JSON, nullable=False, default=dict)
    careAndBehavior = db.Column(JSON, nullable=False, default=dict)

    petExperience = db.Column(Enum('firstTime', 'previous', 'current', name='pet_experience'), nullable=False)
    idealAge = db.Column(Enum('noPreference', 'puppy', 'young', 'adult', 'senior', name='ideal_age'), nullable=False)
    idealSex = db.Column(Enum('noPreference', 'male', 'female', name='ideal_sex'), nullable=False)
    idealSize = db.Column(Enum('noPreference', 'small', 'medium', 'large', 'xl', name='ideal_size'), nullable=False)
    lifestyle = db.Column(Enum('noPreference', 'veryActive', 'active', 'laidback', 'lapPet', name='lifestyle'), nullable=False)

    geohash = db.Column(db.String(12), nullable=False)
    latitude = db.Column(db.Numeric(10, 7), nullable=False)
    longitude = db.Column(db.Numeric(10, 7), nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False, onupdate=datetime.now(timezone.utc))

    # relationships here
    reviews = db.relationship("Review", back_populates="users", cascade="all, delete-orphan")
    pets = db.relationship("Pet", back_populates="sellers", cascade='all, delete-orphan')
    sent_matches = db.relationship('Match', foreign_key="[Match.userId1]", back_populates='user1')
    received_matches = db.relationship('Match', foreign_key="[Match.userId2]", back_populates='user2')
    sender_chat = db.relationship('ChatHistory', foreign_key="[ChatHistory.senderId]", back_populates='senderId')
    receiver_chat = db.relationship('ChatHistory', foreign_key="[ChatHistory.receiverId]", back_populates='receiverId')

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
            'household': self.household,  # JSON field remains as a dict
            'careAndBehavior': self.careAndBehavior,
            'petExperience': self.petExperience.value,  # Enum -> string
            'idealAge': self.idealAge.value,
            'idealSex': self.idealSex.value,
            'idealSize': self.idealSize.value,
            'lifestyle': self.lifestyle.value,
            'geohash': self.geohash,
            'latitude': float(self.latitude),
            'longitude': float(self.longitude),
            'createdAt': self.createdAt.isoformat(),  # Converts datetime to string
            'updatedAt': self.updatedAt.isoformat()
        }

    def __repr__(self):
        return (f"<User id={self.id}, firstName='{self.firstName}', lastName='{self.lastName}', "
                f"username='{self.username}', email='{self.email}', "
                f"household={self.household}, careAndBehavior={self.careAndBehavior}, "
                f"petExperience='{self.petExperience.value}', idealAge='{self.idealAge.value}', "
                f"idealSex='{self.idealSex.value}', idealSize='{self.idealSize.value}', "
                f"lifestyle='{self.lifestyle.value}', geohash='{self.geohash}', "
                f"latitude={float(self.latitude)}, longitude={float(self.longitude)}, "
                f"createdAt={self.createdAt}, updatedAt={self.updatedAt}>")
