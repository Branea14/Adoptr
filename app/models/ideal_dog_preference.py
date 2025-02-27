from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Enum
from datetime import datetime, timezone

class IdealDogPreferences(db.Model):
    __tablename__ = 'ideal_dog_preferences'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    houseTrained = db.Column(db.Boolean, nullable=False)
    specialNeeds = db.Column(db.Boolean, nullable=False)
    idealAge = db.Column(Enum('noPreference', 'puppy', 'young', 'adult', 'senior', name='ideal_age'), nullable=False)
    idealSex = db.Column(Enum('noPreference', 'male', 'female', name='ideal_sex'), nullable=False)
    idealSize = db.Column(Enum('noPreference', 'small', 'medium', 'large', 'xl', name='ideal_size'), nullable=False)
    lifestyle = db.Column(Enum('noPreference', 'veryActive', 'active', 'laidback', 'lapPet', name='lifestyle'), nullable=False)

    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False, onupdate=datetime.now(timezone.utc))


    # relationship
    user = db.relationship('User', foreign_keys=[userId], back_populates='preferences')

    def __repr__(self):
        return f"id={self.id}, userId={self.userId}, houseTrained={self.houseTrained}, specialNeeds={self.specialNeeds}, idealAge={self.idealAge}, idealSex={self.idealSex}, idealAge={self.idealSize}, lifestyle={self.lifestyle}, createdAt={self.createdAt}, updatedAt={self.updatedAt}>"
