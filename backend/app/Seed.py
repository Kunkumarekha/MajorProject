# Initialize Database
def init_db():
    with app.app_context():
        db.create_all()
        
        # Create default admin if not exists
        if not Admin.query.filter_by(username='admin').first():
            admin = Admin(
                username='admin',
                password_hash=generate_password_hash('admin123')
            )
            db.session.add(admin)
            db.session.commit()
            print('Default admin created: username=admin, password=admin123')

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)