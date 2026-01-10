# Seasons Routes
@app.route('/api/seasons', methods=['GET'])
def get_seasons():
    seasons = Season.query.all()
    return jsonify([{'season_id': s.season_id, 'season_name': s.season_name} for s in seasons])

@app.route('/api/seasons', methods=['POST'])
@jwt_required()
def create_season():
    data = request.get_json()
    new_season = Season(season_name=data['season_name'])
    db.session.add(new_season)
    db.session.commit()
    return jsonify({'season_id': new_season.season_id, 'season_name': new_season.season_name}), 201