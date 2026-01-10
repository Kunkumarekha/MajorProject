# Authentication Routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    admin = Admin.query.filter_by(username=username).first()
    
    if admin and check_password_hash(admin.password_hash, password):
        access_token = create_access_token(identity=username)
        return jsonify({'token': access_token, 'user': {'username': username}}), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401