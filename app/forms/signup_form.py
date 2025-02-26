from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, SelectField, SelectMultipleField, DecimalField, Field, TextAreaField
from wtforms.validators import DataRequired, Email, ValidationError
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

# class JSONField(Field):
#     def process_formdata(self, valuelist):
#          if valuelist:
#             try:
#                 self.data = json.loads(valuelist[0])
#             except ValueError:
#                 self.data = {}


class SignUpForm(FlaskForm):
    firstName = StringField('firstName', validators=[DataRequired()])
    lastName = StringField('lastName', validators=[DataRequired()])
    username = StringField(
        'username', validators=[DataRequired(), username_exists])
    email = StringField('email', validators=[DataRequired(), user_exists])
    password = StringField('password', validators=[DataRequired()])
    avator = TextAreaField('avator')

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

    kids = BooleanField('Kids', validators=[DataRequired()])
    hasBackyard = BooleanField('Has Backyard', validators=[DataRequired()])
    houseTrained = BooleanField('House Trained', validators=[DataRequired()])
    specialNeeds = BooleanField('Special Needs', validators=[DataRequired()])

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

    idealAge = SelectField('Ideal Age', choices=[
        ('noPreference', 'No Preference'),
        ('puppy', 'Puppy'),
        ('young', 'Young'),
        ('adult', 'Adult'),
        ('senior', 'Senior'),
    ], validators=[DataRequired()])

    idealSex = SelectField('Ideal Sex', choices=[
        ('noPreference', 'No Preference'),
        ('male', 'Male'),
        ('female', 'Female'),
    ], validators=[DataRequired()])

    idealSize = SelectField('Ideal Size', choices=[
        ('noPreference', 'No Preference'),
        ('small', 'Small'),
        ('medium', 'Medium'),
        ('large', 'Large'),
        ('xl', 'X-Large'),
    ], validators=[DataRequired()])

    lifestyle = SelectField('Lifestyle', choices=[
        ('noPreference', 'No Preference'),
        ('veryActive', 'Very Active'),
        ('active', 'Active'),
        ('laidback', 'Laidback'),
        ('lapPet', 'Lap Pet'),
    ], validators=[DataRequired()])

    # geohash = StringField('Geohash', validators=[DataRequired()])
    latitude = DecimalField('Latitude', places=7, rounding=None, validators=[DataRequired()])
    longitude = DecimalField('Longitude', places=7, rounding=None, validators=[DataRequired()])
    radius = DecimalField('Radius', places=3, rounding=None, default=0.1)

    # def process(self, formdata = None, obj = None, data = None, **kwargs):
    #     super().process(formdata, obj, data, **kwargs)

    #     if self.data and "household" in self.data:
    #         household_data = self.data["household"]

    #         self.data['kids'] = household_data.get('kids', False)
    #         self.data['hasBackyard'] = household_data.get('hasBackyard', False)
    #         self.data['otherPets'] = household_data.get('otherPets', "none")


    # def validate_otherPets(form, field):
    #     if 'otherPets' not in form.household.data:
    #         raise ValidationError('This field is required')

    # def validate_household(form, field):
    #     if not isinstance(field.data, dict):
    #         raise ValidationError("Household must be a JSON object")

    #     required_keys = ["kids", "hasBackyard", "otherPets"]

    #     for key in required_keys:
    #         if key not in field.data:
    #             raise ValidationError(f"Missing key '{key}' in household data")

    #     if not isinstance(field.data["kids"], bool):
    #         raise ValidationError("Kids must be a boolean value (true/false)")

    #     if not isinstance(field.data["hasBackyard"], bool):
    #         raise ValidationError("Has Backyard must be a boolean value (true/false)")

    #     valid_pets = ["none", "dogsOnly", "catsOnly", "both", "other"]
    #     if field.data["otherPets"] not in valid_pets:
    #         raise ValidationError(f"Invalid value for otherPets. Must be one of {valid_pets}")
