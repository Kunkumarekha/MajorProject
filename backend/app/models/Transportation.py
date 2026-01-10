class Transportation(db.Model):
    __tablename__ = 'transportation'
    transportation_id = db.Column(db.Integer, primary_key=True)
    destination_id = db.Column(db.Integer, db.ForeignKey('destinations.destination_id'), nullable=False)
    transport_type = db.Column(db.String(50), nullable=False)
    cost = db.Column(db.Integer, nullable=False)