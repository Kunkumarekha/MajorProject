
class Festival(db.Model):
    __tablename__ = 'festivals'
    festival_id = db.Column(db.Integer, primary_key=True)
    destination_id = db.Column(db.Integer, db.ForeignKey('destinations.destination_id'), nullable=False)
    festival_name = db.Column(db.String(200), nullable=False)
    dates = db.Column(db.String(100))
