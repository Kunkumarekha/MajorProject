# Search Destinations
@app.route('/api/destinations/search', methods=['GET'])
def search_destinations():
    state_id = request.args.get('state')
    place_id = request.args.get('place')
    season_id = request.args.get('season')
    budget = request.args.get('budget', type=int)
    
    query = db.session.query(Destination).join(Place).join(State).join(Season)
    
    if state_id:
        query = query.filter(Place.state_id == state_id)
    if place_id:
        query = query.filter(Destination.place_id == place_id)
    if season_id:
        query = query.filter(Destination.season_id == season_id)
    if budget:
        query = query.filter(Destination.cost_estimate <= budget)
    
    destinations = query.all()
    
    results = []
    for dest in destinations:
        results.append({
            'destination_id': dest.destination_id,
            'place_name': dest.place.place_name,
            'state_name': dest.place.state.state_name,
            'season_name': dest.season.season_name,
            'description': dest.description,
            'cost_estimate': dest.cost_estimate,
            'transportation': [{'transport_id': t.transportation_id, 'transport_type': t.transport_type, 'cost': t.cost} for t in dest.transportation],
            'accommodations': [{'accommodation_id': a.accommodation_id, 'accommodation_type': a.accommodation_type, 'cost': a.cost} for a in dest.accommodations],
            'festivals': [{'festival_id': f.festival_id, 'festival_name': f.festival_name, 'dates': f.dates} for f in dest.festivals],
            'guides': [{'guide_id': g.guide_id, 'guide_name': g.guide_name, 'contact_info': g.contact_info} for g in dest.guides],
            'reviews': [{'review_id': r.review_id, 'review_text': r.review_text, 'rating': r.rating} for r in dest.reviews]
        })
    
    return jsonify(results)