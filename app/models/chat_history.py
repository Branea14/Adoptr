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
    sender = db.relationship('User', foreign_keys=[senderId], back_populates='sender_chats')
    receiver = db.relationship('User', foreign_keys=[receiverId], back_populates='receiver_chats')
    pets = db.relationship('Pet', back_populates='chats')

    def __repr__(self):
        return f"<ChatHistory id={self.id}, senderId={self.senderId}, receiverId={self.receiverId}, petId={self.petId}, status={self.status}, content={self.content}, createdAt={self.createdAt}, updatedAt={self.updatedAt}>"
