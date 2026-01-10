class Accommodation(db.Model):
    __tablename__ = 'accommodations'
    accommodation_id = db.Column(db.Integer, primary_key=True)
    destination_id = db.Column(db.Integer, db.ForeignKey('destinations.destination_id'), nullable=False)
    accommodation_type = db.Column(db.String(100), nullable=False)
    cost = db.Column(db.Integer, nullable=False)