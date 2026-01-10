# Places Routes
@app.route('/api/places', methods=['GET'])
def get_places():
    state_id = request.args.get('state_id')
    if state_id:
        places = Place.query.filter_by(state_id=state_id).all()
    else:
        places = Place.query.all()
    return jsonify([{'place_id': p.place_id, 'place_name': p.place_name, 'state_id': p.state_id} for p in places])

@app.route('/api/places', methods=['POST'])
@jwt_required()
def create_place():
    data = request.get_json()
    new_place = Place(place_name=data['place_name'], state_id=data['state_id'])
    db.session.add(new_place)
    db.session.commit()
    return jsonify({'place_id': new_place.place_id, 'place_name': new_place.place_name}), 201
