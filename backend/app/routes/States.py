# States Routes
@app.route('/api/states', methods=['GET'])
def get_states():
    states = State.query.all()
    return jsonify([{'state_id': s.state_id, 'state_name': s.state_name} for s in states])

@app.route('/api/states', methods=['POST'])
@jwt_required()
def create_state():
    data = request.get_json()
    new_state = State(state_name=data['state_name'])
    db.session.add(new_state)
    db.session.commit()
    return jsonify({'state_id': new_state.state_id, 'state_name': new_state.state_name}), 201

@app.route('/api/states/<int:state_id>', methods=['PUT'])
@jwt_required()
def update_state(state_id):
    state = State.query.get_or_404(state_id)
    data = request.get_json()
    state.state_name = data['state_name']
    db.session.commit()
    return jsonify({'state_id': state.state_id, 'state_name': state.state_name})

@app.route('/api/states/<int:state_id>', methods=['DELETE'])
@jwt_required()
def delete_state(state_id):
    state = State.query.get_or_404(state_id)
    db.session.delete(state)
    db.session.commit()
    return jsonify({'message': 'State deleted successfully'})
