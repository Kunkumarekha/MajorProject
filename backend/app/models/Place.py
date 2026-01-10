class Place(db.Model):
    __tablename__ = 'places'
    place_id = db.Column(db.Integer, primary_key=True)
    place_name = db.Column(db.String(100), nullable=False)
    state_id = db.Column(db.Integer, db.ForeignKey('states.state_id'), nullable=False)
    destinations = db.relationship('Destination', backref='place', lazy=True)
