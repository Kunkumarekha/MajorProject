class Destination(db.Model):
    __tablename__ = 'destinations'
    destination_id = db.Column(db.Integer, primary_key=True)
    place_id = db.Column(db.Integer, db.ForeignKey('places.place_id'), nullable=False)
    season_id = db.Column(db.Integer, db.ForeignKey('seasons.season_id'), nullable=False)
    budget_id = db.Column(db.Integer, db.ForeignKey('budgets.budget_id'), nullable=False)
    description = db.Column(db.Text)
    cost_estimate = db.Column(db.Integer, nullable=False)
    transportation = db.relationship('Transportation', backref='destination', lazy=True)
    accommodations = db.relationship('Accommodation', backref='destination', lazy=True)
    festivals = db.relationship('Festival', backref='destination', lazy=True)
    guides = db.relationship('Guide', backref='destination', lazy=True)
    reviews = db.relationship('Review', backref='destination', lazy=True)