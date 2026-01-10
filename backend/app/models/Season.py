class Season(db.Model):
    __tablename__ = 'seasons'
    season_id = db.Column(db.Integer, primary_key=True)
    season_name = db.Column(db.String(50), nullable=False)