
class Guide(db.Model):
    __tablename__ = 'guides'
    guide_id = db.Column(db.Integer, primary_key=True)
    destination_id = db.Column(db.Integer, db.ForeignKey('destinations.destination_id'), nullable=False)
    guide_name = db.Column(db.String(100), nullable=False)
    contact_info = db.Column(db.String(100), nullable=False)
