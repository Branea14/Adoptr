from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone
from sqlalchemy import Enum


class ChatHistory(db.Model):
    __tablename__ = 'chat_history'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    senderId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    receiverId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    petId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("pets.id")), nullable=False)
    content = db.Column(db.Text, nullable=False)
    status = db.Column(Enum('SENT', 'DELIVERED', 'READ', name='status'), nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False, onupdate=datetime.now(timezone.utc))

    # relationships here
    senderId = db.relationship('User', foreign_keys=[senderId], back_populates='sender_chat')
    receiverId = db.relationship('User', foreign_keys=[receiverId], back_populates='receiver_chat')
    pets = db.relationship('Pet', back_populates='chat')

    def __repr__(self):
        return f"<Match id={self.id}, userId1={self.userId1}, userId2={self.userId2}, petId={self.petId}, status={self.status}, createdAt={self.createdAt}, updatedAt={self.updatedAt}>"
