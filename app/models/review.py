from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone


class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    petId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("pets.id")), nullable=False)
    reviewerId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    review = db.Column(db.Text, nullable=False)
    stars = db.Column(db.Integer, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False, onupdate=datetime.now(timezone.utc))

    # relationships below
    users = db.relationship("User", back_populates="reviews")
    pets = db.relationship("Pet", back_populates="reviews")

    def __repr__(self):
        return f"<Review id={self.id}, petId={self.petId}, reviewerId={self.reviewerId}, stars={self.stars}, createdAt={self.createdAt}, updatedAt={self.updatedAt}>"
