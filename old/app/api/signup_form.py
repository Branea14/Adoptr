from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, SelectField, SelectMultipleField, DecimalField, Field, TextAreaField, PasswordField
from wtforms.validators import DataRequired, Email, ValidationError, InputRequired
from app.models import User
import json


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


class SignUpForm(FlaskForm):
    firstName = StringField('firstName', validators=[DataRequired()])
    lastName = StringField('lastName', validators=[DataRequired()])
    username = StringField(
        'username', validators=[DataRequired(), username_exists])
    email = StringField('email', validators=[DataRequired(), Email(), user_exists])
    password = PasswordField('password', validators=[DataRequired()])
    avatar = TextAreaField('avatar', validators=[DataRequired()])

    # household options
    # household = JSONField('Household', validators=[DataRequired()])
    # kids = BooleanField('Has Kids')
    # hasBackyard = BooleanField("Has Backyard")
    # otherPets = SelectField('Other Pets', choices=[
    #     ('none', 'None'),
    #     ('dogsOnly', 'Dogs Only'),
    #     ('catsOnly', 'Cats Only'),
    #     ('both', 'Both Cats & Dogs'),
    #     ('other', 'Other Pets'),
    # ], validators=[DataRequired()])

    kids = BooleanField('Kids', validators=[InputRequired()])
    hasBackyard = BooleanField('Has Backyard', validators=[InputRequired()])

    # careAndBehavior = SelectMultipleField('Care & Behavior Needs', choices=[
    #     ('houseTrained', 'House Trained'),
    #     ('specialNeeds', 'Special Needs'),
    # ], validators=[DataRequired()])

    otherPets = SelectField('Other Pets', choices=[
        ('none', 'None'),
        ('dogsOnly', 'Dogs Only'),
        ('catsOnly', 'Cats Only'),
        ('both', 'Both'),
        ('other', 'Other'),
    ], validators=[DataRequired()])

    petExperience = SelectField('Pet Experience', choices=[
        ('firstTime', 'First Time'),
        ('previous', 'Previous'),
        ('current', 'Current'),
    ], validators=[DataRequired()])

    # geohash = StringField('Geohash', validators=[DataRequired()])
    latitude = DecimalField('Latitude', places=7, rounding=None, validators=[InputRequired()])
    longitude = DecimalField('Longitude', places=7, rounding=None, validators=[InputRequired()])
    radius = DecimalField('Radius', places=3, rounding=None, default=5.0, validators=[InputRequired()])


    # moved to other table
    # houseTrained = BooleanField('House Trained', validators=[DataRequired()])
    # specialNeeds = BooleanField('Special Needs', validators=[DataRequired()])
    # idealAge = SelectField('Ideal Age', choices=[
    #     ('noPreference', 'No Preference'),
    #     ('puppy', 'Puppy'),
    #     ('young', 'Young'),
    #     ('adult', 'Adult'),
    #     ('senior', 'Senior'),
    # ], validators=[DataRequired()])

    # idealSex = SelectField('Ideal Sex', choices=[
    #     ('noPreference', 'No Preference'),
    #     ('male', 'Male'),
    #     ('female', 'Female'),
    # ], validators=[DataRequired()])

    # idealSize = SelectField('Ideal Size', choices=[
    #     ('noPreference', 'No Preference'),
    #     ('small', 'Small'),
    #     ('medium', 'Medium'),
    #     ('large', 'Large'),
    #     ('xl', 'X-Large'),
    # ], validators=[DataRequired()])

    # lifestyle = SelectField('Lifestyle', choices=[
    #     ('noPreference', 'No Preference'),
    #     ('veryActive', 'Very Active'),
    #     ('active', 'Active'),
    #     ('laidback', 'Laidback'),
    #     ('lapPet', 'Lap Pet'),
    # ], validators=[DataRequired()])
