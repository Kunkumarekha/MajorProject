class Budget(db.Model):
    __tablename__ = 'budgets'
    budget_id = db.Column(db.Integer, primary_key=True)
    budget_range_min = db.Column(db.Integer, nullable=False)
    budget_range_max = db.Column(db.Integer, nullable=False)