class State(db.Model):
    __tablename__ = 'states'
    state_id = db.Column(db.Integer, primary_key=True)
    state_name = db.Column(db.String(100), nullable=False)
    places = db.relationship('Place', backref='state', lazy=True, cascade='all, delete-orphan')