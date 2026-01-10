from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
import re

app = Flask(__name__)
CORS(app)

# Configuration for MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Rekha%40123@localhost/travel_sphere'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-this-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

db = SQLAlchemy(app)
jwt = JWTManager(app)

# DATABASE MODELS 
class Admin(db.Model):
    __tablename__ = 'admins'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)

class State(db.Model):
    __tablename__ = 'states'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)

class City(db.Model):
    __tablename__ = 'cities'
    id = db.Column(db.Integer, primary_key=True)
    state_id = db.Column(db.Integer, db.ForeignKey('states.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    state = db.relationship('State', backref='cities')
    
class Hotel(db.Model):
    __tablename__ = 'hotels'
    id = db.Column(db.Integer, primary_key=True)
    city_id = db.Column(db.Integer, db.ForeignKey('cities.id'), nullable=False)
    name = db.Column(db.String(150), nullable=False)
    address = db.Column(db.Text)
    rating = db.Column(db.Numeric(2, 1))
    contact_number = db.Column(db.String(20))
    city = db.relationship('City', backref='hotels')

class AccommodationType(db.Model):
    __tablename__ = 'accommodation_types'
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False)
    type_name = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    price_per_night = db.Column(db.Numeric(10, 2), nullable=False)
    available_rooms = db.Column(db.Integer, default=10)

class FoodItem(db.Model):
    __tablename__ = 'food_items'
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False)
    item_name = db.Column(db.String(150), nullable=False)
    cuisine_type = db.Column(db.String(50))
    price = db.Column(db.Numeric(10, 2), nullable=False)
    is_vegetarian = db.Column(db.Boolean, default=True)

class Transportation(db.Model):
    __tablename__ = 'transportation'
    id = db.Column(db.Integer, primary_key=True)
    city_id = db.Column(db.Integer, db.ForeignKey('cities.id'), nullable=False)
    vehicle_type = db.Column(db.String(50), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    price_per_day = db.Column(db.Numeric(10, 2), nullable=False)
    available_units = db.Column(db.Integer, default=5)

class Guide(db.Model):
    __tablename__ = 'guides'
    id = db.Column(db.Integer, primary_key=True)
    city_id = db.Column(db.Integer, db.ForeignKey('cities.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    languages = db.Column(db.String(255), nullable=False)
    experience_years = db.Column(db.Integer)
    price_per_day = db.Column(db.Numeric(10, 2), nullable=False)
    rating = db.Column(db.Numeric(2, 1))
    contact_number = db.Column(db.String(20))

class Season(db.Model):
    __tablename__ = 'seasons'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    password = db.Column(db.String(255), nullable=False)

class TripApplication(db.Model):
    __tablename__ = 'trip_applications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    state_id = db.Column(db.Integer, db.ForeignKey('states.id'), nullable=False)
    city_id = db.Column(db.Integer, db.ForeignKey('cities.id'), nullable=False)
    season_id = db.Column(db.Integer, db.ForeignKey('seasons.id'), nullable=False)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False)
    accommodation_id = db.Column(db.Integer, db.ForeignKey('accommodation_types.id'), nullable=False)
    guide_id = db.Column(db.Integer, db.ForeignKey('guides.id'))
    budget = db.Column(db.Numeric(10, 2), nullable=False)
    num_people = db.Column(db.Integer, nullable=False)
    total_cost = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(20), default='pending')
    admin_notes = db.Column(db.Text)
    user = db.relationship('User', backref='trips')
    state = db.relationship('State')
    city = db.relationship('City')
    season = db.relationship('Season')
    hotel = db.relationship('Hotel')

class Feedback(db.Model):
    __tablename__ = 'feedback'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    feedback_type = db.Column(db.String(50), nullable=False)
    related_id = db.Column(db.Integer)
    rating = db.Column(db.Integer, nullable=False)
    feedback_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    user = db.relationship('User', backref='feedbacks')


#  VALIDATION FUNCTIONS 
# These functions check if user input is valid before saving to database

def validate_email(email):
    """
    Validate email format
    - Must have @ symbol
    - Must have domain with dot (e.g., gmail.com)
    - Example: user@example.com ✓, userexample.com ✗
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """
    Validate password strength
    Requirements:
    - Minimum 8 characters
    - At least 1 uppercase letter (A-Z)
    - At least 1 lowercase letter (a-z)
    - At least 1 digit (0-9)
    - At least 1 special character (!@#$%^&*)
    
    Returns: (True/False, "Error message or Valid")
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'\d', password):
        return False, "Password must contain at least one digit"
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Password must contain at least one special character"
    return True, "Valid"

def validate_phone(phone):
    """
    Validate phone number
    - Must be exactly 10 digits
    - No spaces, dashes, or letters allowed
    - Example: 9876543210 ✓, 987-654-3210 ✗, 98765 ✗
    """
    pattern = r'^\d{10}$'
    return re.match(pattern, phone) is not None


# ==================== ADMIN AUTHENTICATION ====================
@app.route('/api/auth/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    admin = Admin.query.filter_by(username=username).first()
    
    if admin and admin.password_hash == password:
        access_token = create_access_token(identity=username)
        return jsonify({'token': access_token, 'user': {'username': username}}), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401


# ==================== USER AUTHENTICATION WITH VALIDATION ====================

# **UPDATED** User Registration with Email, Password, and Phone Validation
@app.route('/api/user/register', methods=['POST'])
def user_register():
    try:
        data = request.get_json()
        
        # ===== STEP 1: Check if all required fields are present =====
        required_fields = ['name', 'email', 'password', 'phone']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # ===== STEP 2: Validate Name (minimum 2 characters) =====
        name = data['name'].strip()
        if len(name) < 2:
            return jsonify({'error': 'Name must be at least 2 characters long'}), 400
        
        # ===== STEP 3: Validate Email Format =====
        email = data['email'].lower().strip()
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format. Email must contain @ and a valid domain (e.g., user@example.com)'}), 400
        
        # ===== STEP 4: Check if email already exists in database =====
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'Email already registered. Please login or use a different email'}), 400
        
        # ===== STEP 5: Validate Password Strength =====
        password = data['password']
        is_valid, message = validate_password(password)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # ===== STEP 6: Validate Phone Number (must be 10 digits) =====
        phone = data['phone'].strip()
        if not validate_phone(phone):
            return jsonify({'error': 'Invalid phone number. Phone must be exactly 10 digits (no spaces or special characters)'}), 400
        
        # ===== STEP 7: Check if phone number already exists (optional) =====
        existing_phone = User.query.filter_by(phone=phone).first()
        if existing_phone:
            return jsonify({'error': 'Phone number already registered'}), 400
        
        # ===== STEP 8: Hash the password for security =====
        # Never store plain text passwords!
        hashed_password = generate_password_hash(password)
        
        # ===== STEP 9: Create new user in database =====
        new_user = User(
            name=name,
            email=email,
            phone=phone,
            password=hashed_password  # Store hashed password
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # ===== STEP 10: Create JWT token for automatic login =====
        access_token = create_access_token(identity=email)
        
        return jsonify({
            'message': 'Registration successful!',
            'token': access_token,
            'user': {
                'id': new_user.id,
                'name': new_user.name,
                'email': new_user.email,
                'phone': new_user.phone
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {str(e)}")
        return jsonify({'error': 'Registration failed. Please try again'}), 500


# **UPDATED** User Login with Email Validation and Hashed Password Check
@app.route('/api/user/login', methods=['POST'])
def user_login():
    try:
        data = request.get_json()
        
        # ===== STEP 1: Check if email and password are provided =====
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        
        # ===== STEP 2: Validate email format =====
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # ===== STEP 3: Find user in database =====
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # ===== STEP 4: Check if password matches =====
        # Use check_password_hash to compare hashed passwords
        if not check_password_hash(user.password, password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # ===== STEP 5: Create JWT token for authentication =====
        access_token = create_access_token(identity=email)
        
        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'phone': user.phone
            }
        }), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed. Please try again'}), 500


# ==================== USER TRIPS ====================
@app.route('/api/user/trips', methods=['GET'])
@jwt_required()
def get_user_trips():
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        trips = TripApplication.query.filter_by(user_id=user.id).all()
        result = []
        
        for t in trips:
            result.append({
                'id': t.id,
                'city_name': t.city.name,
                'state_name': t.state.name,
                'season_name': t.season.name,
                'hotel_name': t.hotel.name,
                'num_people': t.num_people,
                'budget': float(t.budget),
                'total_cost': float(t.total_cost),
                'status': t.status,
                'admin_notes': t.admin_notes
            })
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error getting user trips: {str(e)}")
        return jsonify({'error': 'Failed to load trips'}), 500


# ==================== STATES ROUTES ====================
@app.route('/api/states', methods=['GET'])
def get_states():
    states = State.query.all()
    return jsonify([{'id': s.id, 'name': s.name, 'description': s.description} for s in states])

@app.route('/api/states', methods=['POST'])
@jwt_required()
def create_state():
    data = request.get_json()
    new_state = State(name=data['name'], description=data.get('description'))
    db.session.add(new_state)
    db.session.commit()
    return jsonify({'id': new_state.id, 'name': new_state.name}), 201

@app.route('/api/states/<int:state_id>', methods=['PUT'])
@jwt_required()
def update_state(state_id):
    state = State.query.get_or_404(state_id)
    data = request.get_json()
    state.name = data.get('name', state.name)
    state.description = data.get('description', state.description)
    db.session.commit()
    return jsonify({'id': state.id, 'name': state.name, 'message': 'State updated successfully'})


# ==================== CITIES ROUTES ====================
@app.route('/api/cities', methods=['GET'])
def get_cities():
    state_id = request.args.get('state_id')
    if state_id:
        cities = City.query.filter_by(state_id=state_id).all()
    else:
        cities = City.query.all()
    
    result = []
    for c in cities:
        result.append({
            'id': c.id,
            'name': c.name,
            'state_id': c.state_id,
            'state_name': c.state.name if c.state else None,
            'description': c.description,
            'image_url': c.image_url
        })
    return jsonify(result)

@app.route('/api/cities', methods=['POST'])
@jwt_required()
def create_city():
    data = request.get_json()
    new_city = City(
        name=data['name'],
        state_id=data['state_id'],
        description=data.get('description'),
        image_url=data.get('image_url')
    )
    db.session.add(new_city)
    db.session.commit()
    return jsonify({'id': new_city.id, 'name': new_city.name}), 201

@app.route('/api/cities/<int:city_id>', methods=['PUT'])
@jwt_required()
def update_city(city_id):
    city = City.query.get_or_404(city_id)
    data = request.get_json()
    city.name = data.get('name', city.name)
    city.state_id = data.get('state_id', city.state_id)
    city.description = data.get('description', city.description)
    city.image_url = data.get('image_url', city.image_url)
    db.session.commit()
    return jsonify({'id': city.id, 'name': city.name, 'message': 'City updated successfully'})


# ==================== HOTELS ROUTES ====================
@app.route('/api/hotels', methods=['GET'])
def get_hotels():
    city_id = request.args.get('city_id')
    if city_id:
        hotels = Hotel.query.filter_by(city_id=city_id).all()
    else:
        hotels = Hotel.query.all()
    
    result = []
    for h in hotels:
        result.append({
            'id': h.id,
            'name': h.name,
            'city_id': h.city_id,
            'city_name': h.city.name if h.city else None,
            'address': h.address,
            'rating': float(h.rating) if h.rating else None,
            'contact_number': h.contact_number
        })
    return jsonify(result)

@app.route('/api/hotels', methods=['POST'])
@jwt_required()
def create_hotel():
    data = request.get_json()
    new_hotel = Hotel(
        name=data['name'],
        city_id=data['city_id'],
        address=data.get('address'),
        rating=data.get('rating'),
        contact_number=data.get('contact_number')
    )
    db.session.add(new_hotel)
    db.session.commit()
    return jsonify({'id': new_hotel.id, 'name': new_hotel.name}), 201

@app.route('/api/hotels/<int:hotel_id>', methods=['PUT'])
@jwt_required()
def update_hotel(hotel_id):
    hotel = Hotel.query.get_or_404(hotel_id)
    data = request.get_json()
    hotel.name = data.get('name', hotel.name)
    hotel.city_id = data.get('city_id', hotel.city_id)
    hotel.address = data.get('address', hotel.address)
    hotel.rating = data.get('rating', hotel.rating)
    hotel.contact_number = data.get('contact_number', hotel.contact_number)
    db.session.commit()
    return jsonify({'id': hotel.id, 'name': hotel.name, 'message': 'Hotel updated successfully'})


# ==================== SEASONS ROUTES ====================
@app.route('/api/seasons', methods=['GET'])
def get_seasons():
    seasons = Season.query.all()
    return jsonify([{'id': s.id, 'name': s.name, 'description': s.description} for s in seasons])

@app.route('/api/seasons', methods=['POST'])
@jwt_required()
def create_season():
    data = request.get_json()
    new_season = Season(name=data['name'], description=data.get('description'))
    db.session.add(new_season)
    db.session.commit()
    return jsonify({'id': new_season.id, 'name': new_season.name}), 201

@app.route('/api/seasons/<int:season_id>', methods=['PUT'])
@jwt_required()
def update_season(season_id):
    season = Season.query.get_or_404(season_id)
    data = request.get_json()
    season.name = data.get('name', season.name)
    season.description = data.get('description', season.description)
    db.session.commit()
    return jsonify({'id': season.id, 'name': season.name, 'message': 'Season updated successfully'})


# ==================== DESTINATIONS SEARCH ====================
@app.route('/api/destinations/search', methods=['GET'])
def search_destinations():
    try:
        state_id = request.args.get('state')
        city_id = request.args.get('city')
        season_id = request.args.get('season')
        budget = request.args.get('budget', type=float)
        
        query = City.query.join(State)
        
        if state_id and state_id != '':
            query = query.filter(City.state_id == int(state_id))
        if city_id and city_id != '':
            query = query.filter(City.id == int(city_id))
        
        cities = query.all()
        results = []
        
        for city in cities:
            hotels = Hotel.query.filter_by(city_id=city.id).all()
            
            for hotel in hotels:
                all_accommodations = AccommodationType.query.filter_by(hotel_id=hotel.id).all()
                
                if budget and budget > 0:
                    accommodations = [acc for acc in all_accommodations 
                                    if float(acc.price_per_night) <= budget]
                else:
                    accommodations = all_accommodations
                
                if len(all_accommodations) > 0:
                    transportation = Transportation.query.filter_by(city_id=city.id).all()
                    guides = Guide.query.filter_by(city_id=city.id).all()
                    food_items = FoodItem.query.filter_by(hotel_id=hotel.id).all()
                    
                    display_accommodations = accommodations if accommodations else all_accommodations
                    
                    if display_accommodations:
                        min_accommodation = min([float(acc.price_per_night) for acc in display_accommodations])
                    else:
                        min_accommodation = 0
                    
                    min_transport = min([float(t.price_per_day) for t in transportation]) if transportation else 500
                    avg_food = sum([float(f.price) for f in food_items]) / len(food_items) if food_items else 500
                    
                    estimated_cost = (min_accommodation * 3) + (min_transport * 3) + (avg_food * 2 * 3)
                    
                    result = {
                        'state_id': city.state_id,
                        'city_id': city.id,
                        'city_name': city.name,
                        'state_name': city.state.name,
                        'description': city.description,
                        'image_url': city.image_url,
                        'hotel_id': hotel.id,
                        'hotel_name': hotel.name,
                        'hotel_rating': float(hotel.rating) if hotel.rating else 0,
                        'cost_estimate': round(estimated_cost, 2),
                        'accommodations': [{
                            'id': a.id,
                            'type_name': a.type_name,
                            'capacity': a.capacity,
                            'price': float(a.price_per_night),
                            'available_rooms': a.available_rooms
                        } for a in display_accommodations],
                        'transportation': [{
                            'id': t.id,
                            'vehicle_type': t.vehicle_type,
                            'capacity': t.capacity,
                            'price': float(t.price_per_day),
                            'available_units': t.available_units
                        } for t in transportation],
                        'guides': [{
                            'id': g.id,
                            'name': g.name,
                            'languages': g.languages,
                            'experience_years': g.experience_years,
                            'price': float(g.price_per_day),
                            'rating': float(g.rating) if g.rating else 0,
                            'contact_number': g.contact_number
                        } for g in guides],
                        'food_items': [{
                            'id': f.id,
                            'item_name': f.item_name,
                            'cuisine_type': f.cuisine_type,
                            'price': float(f.price),
                            'is_vegetarian': f.is_vegetarian
                        } for f in food_items]
                    }
                    results.append(result)
        
        return jsonify(results)
        
    except Exception as e:
        print(f"Error in search_destinations: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ==================== TRIP APPLICATIONS WITH VALIDATION ====================

@app.route('/api/trips', methods=['GET'])
@jwt_required()
def get_trips():
    trips = TripApplication.query.all()
    result = []
    for t in trips:
        result.append({
            'id': t.id,
            'user_name': t.user.name,
            'email': t.user.email,
            'phone': t.user.phone,
            'city_name': t.city.name,
            'state_name': t.state.name,
            'season_name': t.season.name,
            'hotel_name': t.hotel.name,
            'num_people': t.num_people,
            'total_cost': float(t.total_cost),
            'status': t.status
        })
    return jsonify(result)

# **UPDATED** Create Trip with Email and Phone Validation
@app.route('/api/trips', methods=['POST'])
def create_trip():
    try:
        data = request.get_json()
        
        # ===== STEP 1: Validate email format =====
        if not validate_email(data.get('email', '')):
            return jsonify({'error': 'Invalid email format. Email must contain @ and a valid domain (e.g., user@example.com)'}), 400
        
        # ===== STEP 2: Validate phone number (10 digits) =====
        phone = data.get('phone', '').strip()
        if phone and not validate_phone(phone):
            return jsonify({'error': 'Invalid phone number. Phone must be exactly 10 digits'}), 400
        
        # ===== STEP 3: Create or get user =====
        user = User.query.filter_by(email=data['email']).first()
        if not user:
            # For new users, validate name
            if not data.get('name') or len(data['name'].strip()) < 2:
                return jsonify({'error': 'Name must be at least 2 characters long'}), 400
            
            user = User(
                name=data['name'].strip(),
                email=data['email'].lower().strip(),
                phone=phone,
                password=generate_password_hash('default123')  # Hash default password
            )
            db.session.add(user)
            db.session.flush()
        
        # ===== STEP 4: Validate required fields =====
        required_fields = ['state_id', 'city_id', 'season_id', 'hotel_id', 
                          'accommodation_id', 'budget', 'num_people', 'total_cost']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # ===== STEP 5: Validate numeric fields =====
        if data['num_people'] < 1:
            return jsonify({'error': 'Number of people must be at least 1'}), 400
        
        if data['budget'] < 0 or data['total_cost'] < 0:
            return jsonify({'error': 'Budget and total cost must be positive numbers'}), 400
        
        # ===== STEP 6: Create new trip =====
        new_trip = TripApplication(
            user_id=user.id,
            state_id=data['state_id'],
            city_id=data['city_id'],
            season_id=data['season_id'],
            hotel_id=data['hotel_id'],
            accommodation_id=data['accommodation_id'],
            guide_id=data.get('guide_id'),
            budget=data['budget'],
            num_people=data['num_people'],
            total_cost=data['total_cost']
        )
        db.session.add(new_trip)
        db.session.commit()
        
        return jsonify({'id': new_trip.id, 'message': 'Trip booked successfully!'}), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creating trip: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips/<int:trip_id>/status', methods=['PUT'])
@jwt_required()
def update_trip_status(trip_id):
    trip = TripApplication.query.get_or_404(trip_id)
    data = request.get_json()
    
    # Validate status
    valid_statuses = ['pending', 'approved', 'rejected', 'cancelled']
    if data.get('status') not in valid_statuses:
        return jsonify({'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}), 400
    
    trip.status = data['status']
    trip.admin_notes = data.get('admin_notes')
    db.session.commit()
    return jsonify({'message': 'Trip status updated successfully'})


# ==================== DIAGNOSTIC ENDPOINT ====================
@app.route('/api/diagnostic', methods=['GET'])
def diagnostic():
    try:
        stats = {
            'states': State.query.count(),
            'cities': City.query.count(),
            'hotels': Hotel.query.count(),
            'accommodations': AccommodationType.query.count(),
            'transportation': Transportation.query.count(),
            'guides': Guide.query.count(),
            'food_items': FoodItem.query.count(),
            'seasons': Season.query.count(),
            'users': User.query.count()
        }
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ==================== FEEDBACK ROUTES ====================

# Submit Feedback (User must be logged in)
@app.route('/api/feedback', methods=['POST'])
@jwt_required()
def submit_feedback():
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        if not data.get('feedback_type'):
            return jsonify({'error': 'Feedback type is required'}), 400
        if not data.get('rating'):
            return jsonify({'error': 'Rating is required'}), 400
        if not data.get('feedback_text'):
            return jsonify({'error': 'Feedback text is required'}), 400
        
        # Create feedback
        new_feedback = Feedback(
            user_id=user.id,
            feedback_type=data['feedback_type'],
            related_id=data.get('related_id'),
            rating=data['rating'],
            feedback_text=data['feedback_text']
        )
        
        db.session.add(new_feedback)
        db.session.commit()
        
        return jsonify({
            'message': 'Feedback submitted successfully!',
            'feedback_id': new_feedback.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error submitting feedback: {str(e)}")
        return jsonify({'error': f'Failed to submit feedback: {str(e)}'}), 500


# Get feedback by type
@app.route('/api/feedback/<feedback_type>', methods=['GET'])
def get_feedback_by_type(feedback_type):
    try:
        related_id = request.args.get('related_id', type=int)
        
        query = Feedback.query.filter_by(feedback_type=feedback_type)
        if related_id:
            query = query.filter_by(related_id=related_id)
        
        feedbacks = query.order_by(Feedback.created_at.desc()).all()
        
        result = []
        for f in feedbacks:
            result.append({
                'id': f.id,
                'user_name': f.user.name,
                'rating': f.rating,
                'feedback_text': f.feedback_text,
                'created_at': f.created_at.strftime('%Y-%m-%d %H:%M:%S')
            })
        
        avg_rating = sum([f['rating'] for f in result]) / len(result) if result else 0
        
        return jsonify({
            'feedbacks': result,
            'average_rating': round(avg_rating, 1),
            'total_feedbacks': len(result)
        })
        
    except Exception as e:
        print(f"Error getting feedback: {str(e)}")
        return jsonify({'error': str(e)}), 500


# Get user's own feedbacks
@app.route('/api/user/feedbacks', methods=['GET'])
@jwt_required()
def get_user_feedbacks():
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        feedbacks = Feedback.query.filter_by(user_id=user.id).order_by(Feedback.created_at.desc()).all()
        
        result = []
        for f in feedbacks:
            result.append({
                'id': f.id,
                'feedback_type': f.feedback_type,
                'related_id': f.related_id,
                'rating': f.rating,
                'feedback_text': f.feedback_text,
                'created_at': f.created_at.strftime('%Y-%m-%d %H:%M:%S')
            })
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error getting user feedbacks: {str(e)}")
        return jsonify({'error': str(e)}), 500


# Admin: Get all feedbacks
@app.route('/api/admin/feedbacks', methods=['GET'])
@jwt_required()
def get_all_feedbacks():
    try:
        feedback_type = request.args.get('type')
        
        query = Feedback.query
        if feedback_type:
            query = query.filter_by(feedback_type=feedback_type)
        
        feedbacks = query.order_by(Feedback.created_at.desc()).all()
        
        result = []
        for f in feedbacks:
            result.append({
                'id': f.id,
                'user_name': f.user.name,
                'user_email': f.user.email,
                'feedback_type': f.feedback_type,
                'related_id': f.related_id,
                'rating': f.rating,
                'feedback_text': f.feedback_text,
                'created_at': f.created_at.strftime('%Y-%m-%d %H:%M:%S')
            })
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error getting all feedbacks: {str(e)}")
        return jsonify({'error': str(e)}), 500


# Admin: Delete feedback
@app.route('/api/admin/feedbacks/<int:feedback_id>', methods=['DELETE'])
@jwt_required()
def delete_feedback(feedback_id):
    try:
        feedback = Feedback.query.get_or_404(feedback_id)
        db.session.delete(feedback)
        db.session.commit()
        return jsonify({'message': 'Feedback deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Get feedback statistics
@app.route('/api/feedback/statistics', methods=['GET'])
def get_feedback_statistics():
    try:
        stats = {}
        
        feedback_types = ['accommodation', 'transport', 'guide', 'hotel', 'city', 'overall']
        
        for ftype in feedback_types:
            feedbacks = Feedback.query.filter_by(feedback_type=ftype).all()
            if feedbacks:
                avg_rating = sum([f.rating for f in feedbacks]) / len(feedbacks)
                stats[ftype] = {
                    'count': len(feedbacks),
                    'average_rating': round(avg_rating, 1)
                }
            else:
                stats[ftype] = {
                    'count': 0,
                    'average_rating': 0
                }
        
        return jsonify(stats)
        
    except Exception as e:
        print(f"Error getting feedback statistics: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ==================== DATABASE INITIALIZATION ====================
def init_db():
    with app.app_context():
        print('Initializing database...')
        db.create_all()
        
        # Check if admin exists
        admin = Admin.query.filter_by(username='admin').first()
        if not admin:
            admin = Admin(
                username='admin',
                password_hash='admin123',
                email='admin@travelsphere.com'
            )
            db.session.add(admin)
            db.session.commit()
            print('✓ Default admin created: username=admin, password=admin123')
        else:
            print('✓ Admin already exists')
        
        print('✓ Database initialized successfully!')


# ==================== RUN APPLICATION ====================
if __name__ == '__main__':
    init_db() 
    app.run(debug=True, port=5000)