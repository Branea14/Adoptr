from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Pet

pet_routes = Blueprint('pets', __name__)


@pet_routes.route('/')
@login_required
def pets():
    pass
