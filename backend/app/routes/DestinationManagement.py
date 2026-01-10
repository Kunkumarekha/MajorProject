# Destination Management Routes
@app.route('/api/destinations', methods=['POST'])
@jwt_required()
def create_destination():
    data = request.get_json()
    new_destination = Destination(
        place_id=data['place_id'],
        season_id=data['season_id'],
        budget_id=data['budget_id'],
        description=data['description'],
        cost_estimate=data['cost_estimate']
    )
    db.session.add(new_destination)
    db.session.commit()
    return jsonify({'destination_id': new_destination.destination_id}), 201