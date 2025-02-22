from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone


class PetImage(db.Model):
    __tablename__ = 'pet_images'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    petId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("pets.id")), nullable=False)
    url = db.Column(db.Text, nullable=False)
    preview = db.Column(db.Boolean, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False, onupdate=datetime.now(timezone.utc))

    # relationship below
    pets = db.relationship("Pet", back_populates="images")

    def __repr__(self):
        return f"<PetImage id={self.id}, petId={self.petId}, url='{self.url}', preview={self.preview}, createdAt={self.createdAt}, updatedAt={self.updatedAt}>"
