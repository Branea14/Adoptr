from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone
from sqlalchemy import Enum
from sqlalchemy.dialects.postgresql import JSON

class Pet(db.Model):
    __tablename__ = 'pets'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    sellerId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    description = db.Column(db.Text, nullable=False)
    breed = db.Column(db.String(50), nullable=False)
    vaccinated = db.Column(db.Boolean, nullable=False)
    color = db.Column(db.String(50), nullable=False)
    ownerSurrender = db.Column(db.Boolean, nullable=False)

    age = db.Column(Enum('puppy', 'young', 'adult', 'senior', name='age'), nullable=False)
    sex = db.Column(Enum('male', 'female', name='sex'), nullable=False)
    size = db.Column(Enum('small', 'medium', 'large', 'xl', name='size'), nullable=False)
    adoptionStatus = db.Column(Enum('available', 'pendingAdoption', 'adopted', name='adoption_status'), nullable=False)
    loveLanguage = db.Column(Enum('physicalTouch', 'treats', 'play', 'training', 'independent', name='love_language'), nullable=False)
    lifestyle = db.Column(Enum('veryActive', 'active', 'laidback', 'lapPet', name='lifestyle'), nullable=False)

    household = db.Column(JSON, nullable=False, default=dict)
    careAndBehavior = db.Column(JSON, nullable=True, default=None, server_default=None)

    # geohash = db.Column(db.String(12), nullable=False)
    # latitude = db.Column(db.Numeric(10, 7), nullable=False)
    # longitude = db.Column(db.Numeric(10, 7), nullable=False)

    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False, onupdate=datetime.now(timezone.utc))

    # relationships here
    images = db.relationship("PetImage", back_populates="pets", cascade="all, delete-orphan")
    sellers = db.relationship("User", back_populates='pets')
    matches = db.relationship('Match', back_populates='pets', cascade="all, delete-orphan")
    chats = db.relationship("ChatHistory", back_populates='pets', cascade="all, delete-orphan")

    @property
    def days_on_adoptr(self):
        return (datetime.now(timezone.utc) - self.createdAt).days

    @property
    def geohash(self):
        return self.sellers.geohash if self.sellers else None

    @property
    def latitude(self):
        return self.sellers.latitude if self.sellers else None

    @property
    def longitude(self):
        return self.sellers.longitude if self.sellers else None

    def __repr__(self):
        return (f"<Pet id={self.id}, name='{self.name}', breed='{self.breed}', "
                f"age='{self.age.value}', sex='{self.sex.value}', size='{self.size.value}', "
                f"color='{self.color}', vaccinated={self.vaccinated}, ownerSurrender={self.ownerSurrender}, "
                f"adoptionStatus='{self.adoptionStatus.value}', loveLanguage='{self.loveLanguage.value}', "
                f"lifestyle='{self.lifestyle.value}', household={self.household}, "
                f"careAndBehavior={self.careAndBehavior}, geohash='{self.geohash}', "
                f"latitude={float(self.latitude)}, longitude={float(self.longitude)}, "
                f"daysOnAdoptr={self.days_on_adoptr}, createdAt={self.createdAt}, updatedAt={self.updatedAt}>")
