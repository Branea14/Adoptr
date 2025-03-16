from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, BooleanField, Field, SelectField, SelectMultipleField
from wtforms.validators import DataRequired, ValidationError, InputRequired


def validate_name(form, field):
    if field.data.strip() == "":
        raise ValidationError("Pet name cannot be empty or just spaces.")


class PetListingForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), validate_name])
    description = TextAreaField('Description', validators=[DataRequired()])
    breed = StringField('Breed', validators=[DataRequired()])
    vaccinated = BooleanField('Vaccinated', validators=[InputRequired()])
    # color = StringField('Color', validators=[DataRequired()])
    ownerSurrender = BooleanField('Owner Surrender', validators=[InputRequired()])

    kids = BooleanField('Kids', validators=[InputRequired()])
    houseTrained = BooleanField('House Trained', validators=[InputRequired()])
    specialNeeds = BooleanField('Special Needs', validators=[InputRequired()])

    otherPets = SelectField('Other Pets', choices=[
        ('none', 'None'),
        ('dogsOnly', 'Dogs Only'),
        ('catsOnly', 'Cats Only'),
        ('both', 'Both'),
        ('other', 'Other'),
    ], validators=[InputRequired()])

    age = SelectField('Age', choices=[
        ('puppy', 'Puppy'),
        ('young', 'Young'),
        ('adult', 'Adult'),
        ('senior', 'Senior'),
    ], validators=[InputRequired()])

    sex = SelectField('Sex', choices=[
        ('male', 'Male'),
        ('female', 'Female'),
    ], validators=[InputRequired()])

    size = SelectField('Size', choices=[
        ('small', 'Small'),
        ('medium', 'Medium'),
        ('large', 'Large'),
        ('xl', 'X-Large'),
    ], validators=[InputRequired()])

    adoptionStatus = SelectField('Adoption Status', choices=[
        ('available', 'Available'),
        ('pendingAdoption', 'Pending'),
        ('adopted', 'Adopted'),
    ], validators=[InputRequired()])

    loveLanguage = SelectField('Love Language', choices=[
        ('physicalTouch', 'Physical Touch'),
        ('treats', 'Treats'),
        ('play', 'Play'),
        ('training', 'Training'),
        ('independent', 'Independent'),
    ], validators=[InputRequired()])

    lifestyle = SelectField('Lifestyle', choices=[
        ('veryActive', 'Very Active'),
        ('active', 'Active'),
        ('laidback', 'Laidback'),
        ('lapPet', 'Lap Pet'),
    ], validators=[InputRequired()])
