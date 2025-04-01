from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class Adoption(db.Model):
    __tablename__ = 'adoptions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    adopterId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    petId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("pets.id")), nullable=False)
    adoptedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)

    user = db.relationship("User", back_populates='adoptions')
    pet = db.relationship("Pet", back_populates='adoptions')
