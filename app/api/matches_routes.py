from flask import Blueprint, jsonify, request, session
from flask_login import login_required, current_user
from app.models import db, Match

matches_routes = Blueprint('matches', __name__)

####################### GET ALL PETS BY CURRENT USER ###############################
@matches_routes.route('/approved')
@login_required
def all_approved_matches():

    matches = Match.query.filter_by(userId1=current_user.id).all()

    return jsonify({"message": "look in terminal"})
