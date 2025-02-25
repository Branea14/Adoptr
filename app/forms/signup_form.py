from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, SelectField, SelectMultipleField, DecimalField, Field
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

class JSONField(Field):
    def process_form(self, valuelist):
         if valuelist:
            try:
                self.data = json.loads(valuelist[0])
            except ValueError:
                self.data = {}


class SignUpForm(FlaskForm):
    firstName = StringField('firstName', validators=[DataRequired()])
    lastName = StringField('lastName', validators=[DataRequired()])
    username = StringField(
        'username', validators=[DataRequired(), username_exists])
    email = StringField('email', validators=[DataRequired(), user_exists])
    password = StringField('password', validators=[DataRequired()])

    # household options
    household = JSONField('Household', validators=[DataRequired()])
    # kids = BooleanField('Has Kids')
    # hasBackyard = BooleanField("Has Backyard")
    # otherPets = SelectField('Other Pets', choices=[
    #     ('none', 'None'),
    #     ('dogsOnly', 'Dogs Only'),
    #     ('catsOnly', 'Cats Only'),
    #     ('both', 'Both Cats & Dogs'),
    #     ('other', 'Other Pets'),
    # ], validators=[DataRequired()])

    careAndBehavior = SelectMultipleField('Care & Behavior Needs', choices=[
        ('houseTrained', 'House Trained'),
        ('specialNeeds', 'Special Needs'),
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
    longitude = DecimalField('Latitude', places=7, rounding=None, validators=[DataRequired()])

    def process(self, formdata = None, obj = None, data = None, **kwargs):
        if data and "household" in data:
            household_data = data["household"]

            data['kids'] = household_data.get('kids', False)
            data['hasBackyard'] = household_data.get('hasBackyard', False)
            data['otherPets'] = household_data.get('otherPets', "none")

        return super().process(formdata, obj, data, **kwargs)

    def validate_otherPets(form, field):
        if 'otherPets' not in form.household.data:
            raise ValidationError('This field is required')
