from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone


class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    sellerId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    reviewerId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    review = db.Column(db.Text, nullable=False)
    stars = db.Column(db.Integer, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False, onupdate=datetime.now(timezone.utc))

    # relationships below
    sellers = db.relationship("User", foreign_keys=[sellerId], back_populates="received_reviews")
    reviewers = db.relationship("User", foreign_keys=[reviewerId], back_populates="written_reviews")

    def __repr__(self):
        return f"<Review id={self.id}, sellerId={self.sellerId}, reviewerId={self.reviewerId}, stars={self.stars}, createdAt={self.createdAt}, updatedAt={self.updatedAt}>"
