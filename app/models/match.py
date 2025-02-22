from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone
from sqlalchemy import Enum


class Match(db.Model):
    __tablename__ = 'matches'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    userId1 = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    userId2 = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    petId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("pets.id")), nullable=False)
    status = db.Column(Enum('REQUESTED', 'APPROVED', 'REJECTED', name='status'), nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False, onupdate=datetime.now(timezone.utc))

    # relationships here
    user1 = db.relationship('User', foreign_keys=[userId1], back_populates='sent_matches')
    user2 = db.relationship('User', foreign_keys=[userId2], back_populates='received_matches')
    pets = db.relationship('Pet', back_populates='matches')

    def __repr__(self):
        return f"<Match id={self.id}, userId1={self.userId1}, userId2={self.userId2}, petId={self.petId}, status={self.status}, createdAt={self.createdAt}, updatedAt={self.updatedAt}>"
