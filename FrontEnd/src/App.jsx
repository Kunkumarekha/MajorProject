import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, DollarSign, User, Lock, LogOut, Plus, Edit, Trash2, Star, Phone, Hotel, Bus, PartyPopper, Utensils } from 'lucide-react';
import axios from 'axios';
import './App.css';
import travelImage from './assets/imagetravel.jpeg';
import citiesImg from './assets/cities.jpeg';
import stateImg from './assets/states.jpeg';
import seasonImg from './assets/season.jpeg';
import bannerImage from './assets/bannerimage.jpeg';
import dashboardBg from './assets/background.jpeg';
import userBg from './assets/userbackground.jpeg';

// or wherever you saved it
const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Admin Login Component
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      onLogin(response.data.token);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
     <div
    className="login-container login-bg"
    style={{ backgroundImage: `url(${dashboardBg})` }}
  >
      <div className="login-card">
        <div className="login-header">
          <Lock className="login-icon" />
          <h2 className="login-title">Admin Login</h2>
          <p className="login-subtitle">Access the admin dashboard</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

// User Login Component
const UserLogin = ({ onLogin, onSwitchToRegister, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/user/login', { email, password });
      onLogin(response.data.token, response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
  className="login-container login-bg"
  style={{ backgroundImage: `url(${userBg})` }}
>

      <div className="login-card">
        <button onClick={onBack} className="back-btn">← Back to Home</button>
        
        <div className="login-header">
          <User className="login-icon" />
          <h2 className="login-title">User Login</h2>
          <p className="login-subtitle">Track your trip bookings</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// User Registration Component
const UserRegister = ({ onRegister, onSwitchToLogin, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/user/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      onRegister(response.data.token, response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
     <div
  className="login-container login-bg"
  style={{ backgroundImage: `url(${userBg})` }}
>
      <div className="login-card">
        <button onClick={onBack} className="back-btn">← Back to Home</button>
        
        <div className="login-header">
          <User className="login-icon" />
          <h2 className="login-title">Create Account</h2>
          <p className="login-subtitle">Register to track your bookings</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// User Dashboard Component for Tracking Bookings
const UserDashboard = ({ user, token, onLogout }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const response = await api.get('/user/trips', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrips(response.data);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };
return (
  <div
    className="user-dashboard-wrapper"
    style={{
      minHeight: '100vh',
      backgroundImage: `url(${userBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}
  >
    <nav className="navbar">


      <div className="navbar-content">
        <h1 className="navbar-title">My Bookings</h1>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>
    </nav>

    <div className="user-dashboard-content">
      <div className="card">
        <div className="card-content">
          Dashboard Content
        </div>
      </div>
    </div>
  </div>
);
};
// Admin Dashboard Component
const AdminDashboard = ({ onLogout, token }) => {
  const [activeTab, setActiveTab] = useState('states');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [trips, setTrips] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);



   useEffect(() => {
    if (showAddModal || showEditModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showAddModal, showEditModal]);


  const loadData = async () => {
    try {
      switch (activeTab) {
        case 'states':
          const statesRes = await api.get('/states');
          setStates(statesRes.data);
          break;
        case 'cities':
          const citiesRes = await api.get('/cities');
          setCities(citiesRes.data);
          const statesForCities = await api.get('/states');
          setStates(statesForCities.data);
          break;
        case 'hotels':
          const hotelsRes = await api.get('/hotels');
          setHotels(hotelsRes.data);
          const citiesForHotels = await api.get('/cities');
          setCities(citiesForHotels.data);
          break;
        case 'seasons':
          const seasonsRes = await api.get('/seasons');
          setSeasons(seasonsRes.data);
          break;
        case 'trips':
          const tripsRes = await api.get('/trips', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setTrips(tripsRes.data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAdd = async () => {
    try {
      const endpoint = `/${activeTab}`;
      await api.post(endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddModal(false);
      setFormData({});
      loadData();
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Please check all required fields.');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData(item);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      const endpoint = `/${activeTab}/${editingId}`;
      await api.put(endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowEditModal(false);
      setFormData({});
      setEditingId(null);
      loadData();
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/${activeTab}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        loadData();
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item. It may be referenced by other data.');
      }
    }
  };

  const handleUpdateTripStatus = async (tripId, status) => {
    try {
      await api.put(`/trips/${tripId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadData();
    } catch (error) {
      console.error('Error updating trip status:', error);
    }
  };

  const renderTable = () => {
    switch (activeTab) {
      case 'states':
        return (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {states.map(state => (
                <tr key={state.id}>
                  <td>{state.id}</td>
                  <td>{state.name}</td>
                  <td>{state.description?.substring(0, 50)}...</td>
                  <td>
                    <button 
                      className="btn-icon"
                      onClick={() => handleEdit(state)}
                    >
                      <Edit className="icon-sm" />
                    </button>
                    {/* <button
                      onClick={() => handleDelete(state.id)}
                      className="btn-icon delete"
                    >
                      <Trash2 className="icon-sm" />
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      
      case 'cities':
        return (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>State</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cities.map(city => (
                <tr key={city.id}>
                  <td>{city.id}</td>
                  <td>{city.name}</td>
                  <td>{city.state_name}</td>
                  <td>{city.description?.substring(0, 40)}...</td>
                  <td>
                    <button 
                      className="btn-icon"
                      onClick={() => handleEdit(city)}
                    >
                      <Edit className="icon-sm" />
                    </button>
                    {/* <button
                      onClick={() => handleDelete(city.id)}
                      className="btn-icon delete"
                    >
                      <Trash2 className="icon-sm" />
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      
      case 'hotels':
        return (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>City</th>
                <th>Rating</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map(hotel => (
                <tr key={hotel.id}>
                  <td>{hotel.id}</td>
                  <td>{hotel.name}</td>
                  <td>{hotel.city_name}</td>
                  <td>{hotel.rating} ⭐</td>
                  <td>{hotel.contact_number}</td>
                  <td>
                    <button 
                      className="btn-icon"
                      onClick={() => handleEdit(hotel)}
                    >
                      <Edit className="icon-sm" />
                    </button>
                    {/* <button
                      onClick={() => handleDelete(hotel.id)}
                      className="btn-icon delete"
                    >
                      <Trash2 className="icon-sm" />
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      
      case 'seasons':
        return (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {seasons.map(season => (
                <tr key={season.id}>
                  <td>{season.id}</td>
                  <td>{season.name}</td>
                  <td>{season.description}</td>
                  <td>
                    <button 
                      className="btn-icon"
                      onClick={() => handleEdit(season)}
                    >
                      <Edit className="icon-sm" />
                    </button>
                    {/* <button
                      onClick={() => handleDelete(season.id)}
                      className="btn-icon delete"
                    >
                      <Trash2 className="icon-sm" />
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      
      case 'trips':
        return (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Destination</th>
                <th>People</th>
                <th>Cost</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map(trip => (
                <tr key={trip.id}>
                  <td>{trip.id}</td>
                  <td>{trip.user_name}</td>
                  <td>{trip.email}</td>
                  <td>{trip.phone}</td>
                  <td>{trip.city_name}, {trip.state_name}</td>
                  <td>{trip.num_people}</td>
                  <td>₹{trip.total_cost?.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${trip.status}`}>
                      {trip.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={trip.status}
                      onChange={(e) => handleUpdateTripStatus(trip.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      
      default:
        return null;
    }
  };

  const renderFormFields = (isEdit = false) => {
    switch (activeTab) {
      case 'states':
        return (
          <>
            <input
              type="text"
              placeholder="State Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
            />
            <textarea
              placeholder="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input"
              rows="3"
            />
          </>
        );

      case 'cities':
        return (
          <>
            <input
              type="text"
              placeholder="City Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
            />
            <select
              value={formData.state_id || ''}
              onChange={(e) => setFormData({ ...formData, state_id: e.target.value })}
              className="form-input"
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>
            <textarea
              placeholder="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input"
              rows="3"
            />
          </>
        );

      case 'hotels':
        return (
          <>
            <input
              type="text"
              placeholder="Hotel Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
            />
            <select
              value={formData.city_id || ''}
              onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
              className="form-input"
            >
              <option value="">Select City</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Address"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="form-input"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Rating (0-5)"
              value={formData.rating || ''}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={formData.contact_number || ''}
              onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
              className="form-input"
            />
          </>
        );

      case 'seasons':
        return (
          <>
            <input
              type="text"
              placeholder="Season Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
            />
            <textarea
              placeholder="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input"
              rows="3"
            />
          </>
        );

      

      default:
        return null;
    }
  };

  const renderAddModal = () => {
    if (!showAddModal) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3 className="modal-title">Add New {activeTab.slice(0, -1)}</h3>
          {renderFormFields(false)}
          <div className="modal-actions">
            <button onClick={handleAdd} className="btn btn-primary">
              Add
            </button>
            <button onClick={() => {
              setShowAddModal(false);
              setFormData({});
            }} className="btn btn-cancel">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEditModal = () => {
    if (!showEditModal) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3 className="modal-title">Edit {activeTab.slice(0, -1)}</h3>
          {renderFormFields(true)}
          <div className="modal-actions">
            <button onClick={handleUpdate} className="btn btn-primary">
              Update
            </button>
            <button onClick={() => {
              setShowEditModal(false);
              setFormData({});
              setEditingId(null);
            }} className="btn btn-cancel">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
      <div
  className="dashboard-content dashboard-bg"
  style={{
    backgroundImage: `url(${dashboardBg})`
  }}
>
      <nav
  className="navbar navbar-bg"
  style={{
    backgroundImage: `url(${dashboardBg})`
  }}
>
        <div className="navbar-content">
       
          <h1 className="navbar-title">Admin Dashboard</h1>
          <button onClick={onLogout} className="logout-btn">
            <LogOut className="icon-sm" />
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="card">
          <div className="tabs">
            {['states', 'cities', 'hotels', 'seasons', 'trips','feedbacks'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="card-header">
              <h2 className="card-title">Manage {activeTab}</h2>
              {activeTab !== 'trips' && activeTab !== 'feedbacks' &&(
                <button onClick={() => setShowAddModal(true)} className="btn-add">
                  <Plus className="icon-sm" />
                  Add New
                </button>
              )}
            </div>

           <div className="table-container">
            {activeTab === 'feedbacks' ? (
              <AdminFeedbacksTab token={token} />
            ) : (
              renderTable()
              )}
              </div>

          </div>
        </div>
      </div>

      {renderAddModal()}
      {renderEditModal()}
    </div>
  );
};

     
const UserSearch = ({ onShowThankYou }) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [budget, setBudget] = useState(50000);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  
  // Booking selections
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [selectedFoodItems, setSelectedFoodItems] = useState([]);
  const [numDays, setNumDays] = useState(3);
  const [numPeople, setNumPeople] = useState(2);
  const [showBookingModal, setShowBookingModal] = useState(false);



  
  // User info for booking
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedState) {
      loadCities(selectedState);
    }
  }, [selectedState]);

  const loadInitialData = async () => {
    try {
      const [statesRes, seasonsRes] = await Promise.all([
        api.get('/states'),
        api.get('/seasons')
      ]);
      setStates(statesRes.data);
      setSeasons(seasonsRes.data);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const loadCities = async (stateId) => {
    try {
      const response = await api.get(`/cities?state_id=${stateId}`);
      setCities(response.data);
      setSelectedCity('');
    } catch (error) {
      console.error('Error loading cities:', error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedState) params.append('state', selectedState);
      if (selectedCity) params.append('city', selectedCity);
      if (selectedSeason) params.append('season', selectedSeason);
      if (budget) params.append('budget', budget);
      
      const response = await api.get(`/destinations/search?${params}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching destinations:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const resetBookingSelections = () => {
    setSelectedAccommodation(null);
    setSelectedTransport(null);
    setSelectedGuide(null);
    setSelectedFoodItems([]);
    setNumDays(3);
    setNumPeople(2);
  };

  const calculateTotalCost = () => {
    let total = 0;
    
    if (selectedAccommodation) {
      total += selectedAccommodation.price * numDays * Math.ceil(numPeople / selectedAccommodation.capacity);
    }
    
    if (selectedTransport) {
      total += selectedTransport.price * numDays;
    }
    
    if (selectedGuide) {
      total += selectedGuide.price * numDays;
    }
    
    selectedFoodItems.forEach(food => {
      total += food.price * numPeople * numDays;
    });
    
    return total;
  };

  const handleFoodToggle = (food) => {
    setSelectedFoodItems(prev => {
      const exists = prev.find(f => f.id === food.id);
      if (exists) {
        return prev.filter(f => f.id !== food.id);
      } else {
        return [...prev, food];
      }
    });
  };

  const handleBookTrip = async () => {
  try {
    const bookingData = {
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      state_id: selectedDestination.state_id,
      city_id: selectedDestination.city_id,
      season_id: selectedSeason || 1,
      hotel_id: selectedDestination.hotel_id,
      accommodation_id: selectedAccommodation.id,
      guide_id: selectedGuide?.id,
      budget: calculateTotalCost(),
      num_people: numPeople,
      total_cost: calculateTotalCost()
    };

    await api.post('/trips', bookingData);
    
    // Close modals first
    setShowBookingModal(false);
    setSelectedDestination(null);
    resetBookingSelections();
    setUserInfo({ name: '', email: '', phone: '' });
    
    // Show thank you page
    if (onShowThankYou) {
      onShowThankYou();
    }
  } catch (error) {
    console.error('Error booking trip:', error);
    alert('Failed to book trip. Please try again.');
  }
};
    

  const openDestinationModal = (destination) => {
    setSelectedDestination(destination);
    resetBookingSelections();
  };

  return (
   
  <div
    className="search-container search-bg"
    style={{
      backgroundImage: `url(${bannerImage})`
    }}
  >


    <div className="search-content">
        <div className="search-card">
          <h2 className="search-card-title">Search Destinations</h2>
          
          <div className="search-grid">
         
            <div className="search-field">
                 <img src={stateImg} alt="state" />
              <label className="search-label">
                <MapPin className="icon-sm" />
                State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="search-select"
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="search-field">
                <img src={citiesImg} alt="Cities" />
              <label className="search-label">
                <MapPin className="icon-sm" />
                City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="search-select"
                disabled={!selectedState}
              >
                <option value="">Select City</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="search-field">
                <img src={seasonImg} alt="season" />
              <label className="search-label">
                <Calendar className="icon-sm" />
                Season
              </label>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="search-select"
              >
                <option value="">Select Season</option>
                {seasons.map(season => (
                  <option key={season.id} value={season.id}>
                    {season.name}
                  </option>
                ))}
              </select>
            </div>

          
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="btn-search"
          >
            <Search className="icon-md" />
            {loading ? 'Searching...' : 'Search Destinations'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="results-grid">
            {results.map((destination, index) => (
              <div
                key={index}
                className="result-card"
                onClick={() => openDestinationModal(destination)}
              >
                <div className="result-header">
                  <h3 className="result-place-name">{destination.city_name}</h3>
                  <p className="result-location">{destination.state_name}</p>
                </div>
                
                <div className="result-content">
                  <p className="result-description">
                    {destination.description || 'Explore this amazing destination'}
                  </p>
                  
                  <div className="hotel-info">
                    <Hotel className="icon-sm" />
                    <span>{destination.hotel_name}</span>
                    <span className="hotel-rating">⭐ {destination.hotel_rating}</span>
                  </div>

                  <div className="result-cost">
                    <span className="result-cost-label">Estimated Cost (3 days)</span>
                    <span className="result-cost-amount">₹{destination.cost_estimate?.toLocaleString()}</span>
                  </div>

                  <div className="result-stats">
                    <div className="result-stat">
                      <Bus className="icon-sm" />
                      {destination.transportation?.length || 0} Transport Options
                    </div>
                    <div className="result-stat">
                      <Hotel className="icon-sm" />
                      {destination.accommodations?.length || 0} Room Types
                    </div>
                    <div className="result-stat">
                      <Utensils className="icon-sm" />
                      {destination.food_items?.length || 0} Food Options
                    </div>
                    <div className="result-stat">
                      <User className="icon-sm" />
                      {destination.guides?.length || 0} Guides Available
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedDestination && (
          <div className="modal-overlay" onClick={() => {
            setSelectedDestination(null);
            resetBookingSelections();
          }}>
            <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="detail-header">
                <div>
                  <h2 className="detail-title">{selectedDestination.city_name}</h2>
                  <p className="detail-location">{selectedDestination.state_name}</p>
                  <p className="hotel-name-detail">
                    <Hotel className="icon-sm" /> {selectedDestination.hotel_name} 
                    <span className="hotel-rating">⭐ {selectedDestination.hotel_rating}</span>
                  </p>
                </div>
                <button onClick={() => {
                  setSelectedDestination(null);
                  resetBookingSelections();
                }} className="btn-close">
                  ✕
                </button>
              </div>

              <div className="detail-content">
                {/* Trip Configuration */}
                <div className="detail-section trip-config">
                  <h3 className="detail-section-title">Trip Configuration</h3>
                  <div className="config-inputs">
                    <div className="config-item">
                      <label>Number of Days</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={numDays}
                        onChange={(e) => setNumDays(Number(e.target.value))}
                        className="config-input"
                      />
                    </div>
                    <div className="config-item">
                      <label>Number of People</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={numPeople}
                        onChange={(e) => setNumPeople(Number(e.target.value))}
                        className="config-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Accommodation Selection */}
                <div className="detail-section">
                  <h3 className="detail-section-title">
                    <Hotel className="icon-md" />
                    Select Accommodation
                  </h3>
                  <div className="detail-items">
                    {selectedDestination.accommodations?.map(acc => {
                      const roomsNeeded = Math.ceil(numPeople / acc.capacity);
                      const totalCost = acc.price * numDays * roomsNeeded;
                      return (
                        <div 
                          key={acc.id} 
                          className={`detail-item accommodation selectable ${selectedAccommodation?.id === acc.id ? 'selected' : ''}`}
                          onClick={() => setSelectedAccommodation(acc)}
                        >
                          <div>
                            <span className="detail-item-name">{acc.type_name}</span>
                            <span className="detail-item-info">Capacity: {acc.capacity} people</span>
                            <span className="detail-item-info">
                              Rooms needed: {roomsNeeded} × {numDays} days
                            </span>
                          </div>
                          <div className="price-info">
                            <span className="detail-item-cost purple">₹{acc.price?.toLocaleString()}/night</span>
                            <span className="detail-item-total">
                              Total: ₹{totalCost.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Transportation Selection */}
                <div className="detail-section">
                  <h3 className="detail-section-title">
                    <Bus className="icon-md" />
                    Select Transportation
                  </h3>
                  <div className="detail-items">
                    {selectedDestination.transportation?.map(transport => {
                      const totalCost = transport.price * numDays;
                      return (
                        <div 
                          key={transport.id} 
                          className={`detail-item transport selectable ${selectedTransport?.id === transport.id ? 'selected' : ''}`}
                          onClick={() => setSelectedTransport(transport)}
                        >
                          <div>
                            <span className="detail-item-name">{transport.vehicle_type}</span>
                            <span className="detail-item-info">Capacity: {transport.capacity}</span>
                            <span className="detail-item-info">Available: {transport.available_units}</span>
                            <span className="detail-item-info">Duration: {numDays} days</span>
                          </div>
                          <div className="price-info">
                            <span className="detail-item-cost blue">₹{transport.price?.toLocaleString()}/day</span>
                            <span className="detail-item-total">
                              Total: ₹{totalCost.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Food Selection */}
                <div className="detail-section">
                  <h3 className="detail-section-title">
                    <Utensils className="icon-md" />
                    Select Food Items (Multiple Selection)
                  </h3>
                  <div className="detail-items">
                    {selectedDestination.food_items?.map(food => {
                      const totalCost = food.price * numPeople * numDays;
                      return (
                        <div 
                          key={food.id} 
                          className={`detail-item food selectable ${selectedFoodItems.find(f => f.id === food.id) ? 'selected' : ''}`}
                          onClick={() => handleFoodToggle(food)}
                        >
                          <div>
                            <span className="detail-item-name">{food.item_name}</span>
                            <span className="detail-item-info">
                              {food.cuisine_type} • {food.is_vegetarian ? '🥬 Veg' : '🍖 Non-Veg'}
                            </span>
                            <span className="detail-item-info">
                              {numPeople} people × {numDays} days
                            </span>
                          </div>
                          <div className="price-info">
                            <span className="detail-item-cost green">₹{food.price?.toLocaleString()}/person/meal</span>
                            <span className="detail-item-total">
                              Total: ₹{totalCost.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Guide Selection */}
                <div className="detail-section">
                  <h3 className="detail-section-title">
                    <User className="icon-md" />
                    Select Guide (Optional)
                  </h3>
                  <div className="detail-items">
                    {selectedDestination.guides?.map(guide => {
                      const totalCost = guide.price * numDays;
                      return (
                        <div 
                          key={guide.id} 
                          className={`detail-item guide selectable ${selectedGuide?.id === guide.id ? 'selected' : ''}`}
                          onClick={() => setSelectedGuide(selectedGuide?.id === guide.id ? null : guide)}
                        >
                          <div>
                            <span className="detail-item-name">{guide.name}</span>
                            <span className="detail-item-info">
                              Languages: {guide.languages}
                            </span>
                            <span className="detail-item-info">
                              Experience: {guide.experience_years} years • ⭐ {guide.rating}
                            </span>
                            <span className="detail-item-info">Duration: {numDays} days</span>
                            <span className="detail-item-contact">
                              <Phone className="icon-sm" />
                              {guide.contact_number}
                            </span>
                          </div>
                          <div className="price-info">
                            <span className="detail-item-cost orange">₹{guide.price?.toLocaleString()}/day</span>
                            <span className="detail-item-total">
                              Total: ₹{totalCost.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Total Cost Summary */}
                <div className="detail-section cost-summary">
                  <h3 className="detail-section-title">Cost Summary</h3>
                  <div className="cost-breakdown">
                    {selectedAccommodation && (
                      <div className="cost-row">
                        <span>Accommodation ({selectedAccommodation.type_name})</span>
                        <span>₹{(selectedAccommodation.price * numDays * Math.ceil(numPeople / selectedAccommodation.capacity)).toLocaleString()}</span>
                      </div>
                    )}
                    {selectedTransport && (
                      <div className="cost-row">
                        <span>Transportation ({selectedTransport.vehicle_type})</span>
                        <span>₹{(selectedTransport.price * numDays).toLocaleString()}</span>
                      </div>
                    )}
                    {selectedGuide && (
                      <div className="cost-row">
                        <span>Guide ({selectedGuide.name})</span>
                        <span>₹{(selectedGuide.price * numDays).toLocaleString()}</span>
                      </div>
                    )}
                    {selectedFoodItems.length > 0 && (
                      <div className="cost-row">
                        <span>Food ({selectedFoodItems.length} items)</span>
                        <span>₹{selectedFoodItems.reduce((sum, food) => sum + (food.price * numPeople * numDays), 0).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="cost-row total">
                      <span>Total Cost</span>
                      <span>₹{calculateTotalCost().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Book Button */}
                <div className="booking-actions">
                  <button
                    className="btn-book"
                    disabled={!selectedAccommodation || !selectedTransport}
                    onClick={() => setShowBookingModal(true)}
                  >
                    Book This Trip
                  </button>
                  {(!selectedAccommodation || !selectedTransport) && (
                    <p className="booking-note">Please select accommodation and transportation to proceed</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Confirmation Modal */}
        {showBookingModal && (
          <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
            <div className="modal-content booking-modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">Confirm Your Booking</h3>
              
              <div className="booking-summary">
                <h4>Trip Summary</h4>
                <p><strong>Destination:</strong> {selectedDestination.city_name}, {selectedDestination.state_name}</p>
                <p><strong>Duration:</strong> {numDays} days</p>
                <p><strong>People:</strong> {numPeople}</p>
                <p><strong>Total Cost:</strong> ₹{calculateTotalCost().toLocaleString()}</p>
              </div>

              <div className="user-info-form">
                <h4>Your Information</h4>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  className="form-input"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                  className="form-input"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button
                  onClick={handleBookTrip}
                  disabled={!userInfo.name || !userInfo.email || !userInfo.phone}
                  className="btn btn-primary"
                >
                  Confirm Booking
                </button>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="btn btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
// Home Page Component
const HomePage = ({ onGetStarted, onLearnMore }) => {
  return (
    <div className="home-page">
      <nav className="home-navbar">
        <div className="home-navbar-content">
          <div className="logo-section">
            <img 
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='80' fill='%230ea5e9'/%3E%3Cpath d='M60 120 Q100 80 140 120' stroke='white' stroke-width='8' fill='none'/%3E%3Ccircle cx='80' cy='90' r='5' fill='white'/%3E%3Ccircle cx='120' cy='90' r='5' fill='white'/%3E%3Cpath d='M50 130 L80 140 L50 150 Z' fill='%2322c55e'/%3E%3C/svg%3E"
              className="logo-image"
            />
            <div className="logo-text">
              <span className="logo-travel">Travel</span>
              <span className="logo-sphere">Sphere</span>
            </div>
          </div>
          <div className="home-nav-buttons">
           
          </div>
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Explore the World with
              <br />
              <span className="hero-title-highlight">Travel Sphere</span>
            </h1>
            <p className="hero-description">
              Travel Sphere is a smart travel planning platform that
              helps users discover destinations, plan trips, and
              manage travel experiences efficiently.
            </p>
            <div className="hero-buttons">
              <button onClick={onGetStarted} className="btn-hero-primary">
                Get Started
              </button>
              <button onClick={onLearnMore} className="btn-hero-secondary">
                About
              </button>
            </div>
          </div>
         <div className="hero-image">
  <div className="floating-globe">
    <img 
      src={travelImage} 
      alt="Travel Sphere Globe" 
      className="globe-image"
    />
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

          
   
// About Page Component (placeholder)
const AboutPage = ({ onBack }) => {
  return (
    <div className="about-page">
      <nav className="home-navbar">
        <div className="home-navbar-content">
          <div className="logo-section">
            <img 
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='80' fill='%230ea5e9'/%3E%3Cpath d='M60 120 Q100 80 140 120' stroke='white' stroke-width='8' fill='none'/%3E%3Ccircle cx='80' cy='90' r='5' fill='white'/%3E%3Ccircle cx='120' cy='90' r='5' fill='white'/%3E%3Cpath d='M50 130 L80 140 L50 150 Z' fill='%2322c55e'/%3E%3C/svg%3E" 
              alt="Travel Sphere Logo" 
              className="logo-image"
            />
            <div className="logo-text">
              <span className="logo-travel">Travel</span>
              <span className="logo-sphere">Sphere</span>
            </div>
          </div>
          <button onClick={onBack} className="btn-header-outline">
            ← Back to Home
          </button>
        </div>
      </nav>

      <div className="about-content">
        <div className="about-container">
  <h1> 🌍 About Travel Sphere</h1>

  <p>
    <strong>Travel Sphere</strong> is a smart and user-friendly travel planning
    web application designed to simplify the way people explore destinations,
    organize trips, and manage their travel experiences. The platform brings
    together destination discovery, trip planning, and personalized travel
    management into one seamless system.
  </p>

  <h3> 💡 Our Vision</h3>
  <p>
    Our vision is to create a centralized travel ecosystem where users can easily
    discover new destinations, plan trips with confidence, and manage all travel
    information in one secure platform. Travel Sphere aims to make travel planning
    stress-free, organized, and accessible for everyone.
  </p>

  <h3> 🧭 What We Offer</h3>
  <p>
  🌎 <strong>Destination Discovery</strong><br />
  Explore global travel destinations with engaging visuals and curated information.
  <br /><br />

  🧳 <strong>Smart Trip Planning</strong><br />
  Create, organize, and manage travel itineraries with ease.
  <br /><br />

  🎨 <strong>User-Centric Design</strong><br />
  Clean, modern, and responsive interface for smooth navigation across devices.
  <br /><br />

  🔐 <strong>Secure Access</strong><br />
  Safe user authentication and personalized travel data management.
  <br /><br />

  🚀 <strong>Scalable Platform</strong><br />
  Built to support future enhancements such as bookings and intelligent recommendations.
</p>

  <h3> ⭐ Why Choose Travel Sphere?</h3>
  <p>
    Travel Sphere is designed for travelers who value simplicity, efficiency,
    and personalization. Whether planning a short getaway or a long vacation,
    the platform helps users stay organized and focused on enjoying their
    journey.
  </p>

  <h3> 🤝 Our Commitment</h3>
  <p>
    We are committed to delivering a reliable, scalable, and visually engaging
    travel planning solution using modern web technologies to continuously
    enhance user experience.
  </p>
<p className="ending-quote">
  “🤝 <strong>Plan Smart. Travel Better. Explore the World with Travel Sphere.</strong>”
</p>

</div>

      </div>
    </div>
  );
};



// Thank You Page Component
const ThankYouPage = ({ onBackToHome, onBrowseMore }) => {
  return (
    <div className="thankyou-page">
      <div className="thankyou-content">
        <div className="thankyou-logo">
          <div className="thankyou-logo-icon">🌍</div>
          <h2 className="thankyou-logo-text">TRAVEL SPHERE</h2>
        </div>
        
        <h1 className="thankyou-title">Thank You!</h1>
        <p className="thankyou-message">Thank you for visiting Travel Sphere</p>
        
        <div className="thankyou-buttons">
          <button onClick={onBackToHome} className="btn-thankyou-home">
            Back to Home
          </button>
          <button onClick={onBrowseMore} className="btn-thankyou-browse">
            Browse More Trips
          </button>
        </div>
      </div>
    </div>
  );
};
// Main App Component
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [token, setToken] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);
  // User-specific state
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showUserRegister, setShowUserRegister] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [showAbout, setShowAbout] = useState(false);


  const handleGetStarted = () => {
    setShowHome(false);
  };

  const handleLearnMore = () => {
    setShowHome(false);
    setShowAbout(true);
  };

  const handleBackToHome = () => {
    setShowHome(true);
    setShowAbout(false);
  };

  const handleAdminLogin = (authToken) => {
    setToken(authToken);
    setIsAuthenticated(true);
  };

  const handleAdminLogout = () => {
    setToken(null);
    setIsAuthenticated(false);
    setShowAdmin(false);
  };

  const handleUserLogin = (authToken, user) => {
    setUserToken(authToken);
    setCurrentUser(user);
    setIsUserAuthenticated(true);
    setShowUserLogin(false);
    setShowUserRegister(false);
  };

  const handleUserRegister = (authToken, user) => {
    setUserToken(authToken);
    setCurrentUser(user);
    setIsUserAuthenticated(true);
    setShowUserLogin(false);
    setShowUserRegister(false);
  };

  const handleUserLogout = () => {
    setUserToken(null);
    setCurrentUser(null);
    setIsUserAuthenticated(false);
  };


  const handleShowThankYou = () => {
  setShowThankYou(true);
  setShowHome(false);
};

const handleBackToHomeFromThankYou = () => {
  setShowThankYou(false);
  setShowHome(true);
};

const handleBrowseMoreFromThankYou = () => {
  setShowThankYou(false);
  setShowHome(false);
};

  // Admin Login Flow
  if (showAdmin && !isAuthenticated) {
    return <Login onLogin={handleAdminLogin} />;
  }

  if (showAdmin && isAuthenticated) {
    return <AdminDashboard onLogout={handleAdminLogout} token={token} />;
  }

  // User Login Flow
  if (showUserLogin) {
    return (
      <UserLogin
        onLogin={handleUserLogin}
        onSwitchToRegister={() => {
          setShowUserLogin(false);
          setShowUserRegister(true);
        }}
        onBack={() => setShowUserLogin(false)}
      />
    );
  }

  // User Register Flow
  if (showUserRegister) {
    return (
      <UserRegister
        onRegister={handleUserRegister}
        onSwitchToLogin={() => {
          setShowUserRegister(false);
          setShowUserLogin(true);
        }}
        onBack={() => setShowUserRegister(false)}
      />
    );
  }

  // User Dashboard Flow
  if (isUserAuthenticated && currentUser) {
    return (
       <UserDashboardWithFeedback
        user={currentUser}
        token={userToken}
        onLogout={handleUserLogout}
      />
    );
  }


  if (showHome) {
    return <HomePage onGetStarted={handleGetStarted} onLearnMore={handleLearnMore} />;
  }


  if (showAbout) {
    return <AboutPage onBack={handleBackToHome} />;
  }

  // Show thank you page
if (showThankYou) {
  return (
    <ThankYouPage 
      onBackToHome={handleBackToHomeFromThankYou}
      onBrowseMore={handleBrowseMoreFromThankYou}
    />
  );
}

  // Main Search Page with Login/Register buttons
  return (
    <div>
      <div className="search-navbar">
        <div className="search-navbar-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="search-title">Travel Discovery Platform</h1>
            <p className="search-subtitle">Find your perfect destination</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setShowUserLogin(true)} className="btn-header-login">
              <User className="icon-sm" style={{ display: 'inline', marginRight: '0.5rem' }} />
              User Login
            </button>
            <button onClick={() => setShowUserRegister(true)} className="btn-header-signup">
              Sign Up
            </button>
          </div>
        </div>
      </div>
      
      <UserSearch onShowThankYou={handleShowThankYou} />
      
      <button onClick={() => setShowAdmin(true)} className="admin-btn">
        <Lock className="icon-sm" style={{ display: 'inline', marginRight: '0.5rem' }} />
        Admin Login
      </button>
    </div>
  );
};

export default App;

// ADD THESE COMPONENTS TO YOUR App.jsx

// General Feedback Modal Component
const FeedbackModal = ({ onClose, onSubmit, feedbackType, relatedId, relatedName }) => {
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getFeedbackTitle = () => {
    switch(feedbackType) {
      case 'accommodation': return `Feedback for ${relatedName || 'Accommodation'}`;
      case 'transport': return `Feedback for ${relatedName || 'Transportation'}`;
      case 'guide': return `Feedback for ${relatedName || 'Guide'}`;
      case 'hotel': return `Feedback for ${relatedName || 'Hotel'}`;
      case 'city': return `Feedback for ${relatedName || 'City'}`;
      case 'overall': return 'Overall Travel Sphere Feedback';
      default: return 'Submit Feedback';
    }
  };

  const handleSubmit = async () => {
    if (!feedbackText.trim()) {
      alert('Please write your feedback');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        feedback_type: feedbackType,
        related_id: relatedId,
        rating,
        feedback_text: feedbackText
      });
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content review-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{getFeedbackTitle()}</h3>
        
        <div className="rating-section">
          <label>Your Rating:</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`star-icon ${star <= rating ? 'filled' : ''}`}
                onClick={() => setRating(star)}
                fill={star <= rating ? '#fbbf24' : 'none'}
                stroke={star <= rating ? '#fbbf24' : '#d1d5db'}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form">Your Feedback</label>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="form-input"
            rows="5"
            placeholder="Share your experience and suggestions..."
            disabled={submitting}
          />
        </div>

        <div className="modal-actions">
          <button
            onClick={handleSubmit}
            disabled={submitting || !feedbackText.trim()}
            className="btn btn-primary"
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
          <button onClick={onClose} className="btn btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Feedback List Component
const FeedbackList = ({ feedbacks, averageRating, totalFeedbacks }) => {
  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="empty-state">
        <p>No feedback yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="reviews-container">
      <div className="reviews-summary">
        <div className="average-rating">
          <span className="rating-number">{averageRating}</span>
          <div className="stars-display">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className="star-small"
                fill={star <= Math.round(averageRating) ? '#fbbf24' : 'none'}
                stroke={star <= Math.round(averageRating) ? '#fbbf24' : '#d1d5db'}
              />
            ))}
          </div>
          <span className="total-reviews">{totalFeedbacks} feedbacks</span>
        </div>
      </div>

      <div className="reviews-list">
        {feedbacks.map(feedback => (
          <div key={feedback.id} className="review-card">
            <div className="review-header">
              <div>
                <span className="reviewer-name">{feedback.user_name}</span>
                <span className="review-date">{new Date(feedback.created_at).toLocaleDateString()}</span>
              </div>
              <div className="review-rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className="star-small"
                    fill={star <= feedback.rating ? '#fbbf24' : 'none'}
                    stroke={star <= feedback.rating ? '#fbbf24' : '#d1d5db'}
                  />
                ))}
              </div>
            </div>
            <p className="review-text">{feedback.feedback_text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// UPDATED User Dashboard with Feedback Tab
const UserDashboardWithFeedback = ({ user, token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('trips');
  const [trips, setTrips] = useState([]);
 
  const [reviewableTrips, setReviewableTrips] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [feedbackType, setFeedbackType] = useState('overall');

  useEffect(() => {
    loadData();
  }, [activeTab]);


  const handleDeleteTrip = async (tripId) => {
  if (window.confirm('Are you sure you want to cancel this booking?')) {
    try {
      // Use the user-specific endpoint
      await api.put(`/user/trips/${tripId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Booking cancelled successfully!');
      loadData();
    } catch (error) {
      console.error('Error cancelling trip:', error);
      
      if (error.response?.status === 404) {
        alert('Trip not found or does not belong to you.');
      } else if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Failed to cancel booking. Please try again.');
      }
    }
  }
};

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'trips') {
        const response = await api.get('/user/trips', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrips(response.data);
      } else if (activeTab === 'reviews') {
        const [reviewsRes, reviewableRes] = await Promise.all([
          api.get('/user/reviews', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          api.get('/user/trips/reviewable', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setReviews(reviewsRes.data);
        setReviewableTrips(reviewableRes.data);
      } else if (activeTab === 'feedback') {
        const response = await api.get('/user/feedbacks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFeedbacks(response.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };
  

 

  const handleSubmitFeedback = async (feedbackData) => {
    try {
      await api.post('/feedback', feedbackData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Feedback submitted successfully!');
      setShowFeedbackModal(false);
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit feedback');
    }
  };

  const getFeedbackTypeLabel = (type) => {
    const labels = {
      'accommodation': 'Accommodation',
      'transport': 'Transportation',
      'guide': 'Tour Guide',
      'hotel': 'Hotel',
      'city': 'City/Destination',
      'overall': 'Overall Platform'
    };
    return labels[type] || type;
  };

  return (
     <div
  className="dashboard-content dashboard-bg"
  style={{ backgroundImage: `url(${userBg})` }}
>

     <nav className="navbar">


        <div className="navbar-content">
          <div>
            <h1 className="navbar-title">My Dashboard</h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Welcome, {user.name}
            </p>
          </div>
          <button onClick={onLogout} className="logout-btn">
            <LogOut className="icon-sm" />
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="card">
          <div className="tabs">
            <button
              onClick={() => setActiveTab('trips')}
              className={`tab-button ${activeTab === 'trips' ? 'active' : ''}`}
            >
              My Trips
            </button>
           
            <button
              onClick={() => setActiveTab('feedback')}
              className={`tab-button ${activeTab === 'feedback' ? 'active' : ''}`}
            >
              Give Feedback
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            {activeTab === 'trips' && (
              <>
                <h2 className="card-title">Your Trip Applications</h2>
                {loading ? (
                  <div className="loading">Loading your bookings...</div>
                ) : trips.length === 0 ? (
                  <div className="empty-state">
                    <p>You haven't made any bookings yet.</p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Destination</th>
                          <th>Hotel</th>
                          <th>Season</th>
                          <th>People</th>
                          <th>Total Cost</th>
                          <th>Status</th>
                          
                        </tr>
                      </thead>
                    <tbody>
                        {trips.map(trip => (
                          <tr key={trip.id}>
                            <td>
                              <strong>{trip.city_name}</strong>
                              <br />
                              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                {trip.state_name}
                              </span>
                            </td>
                            <td>{trip.hotel_name}</td>
                            <td>{trip.season_name}</td>
                            <td>{trip.num_people}</td>
                            <td>₹{trip.total_cost?.toLocaleString()}</td>
                            <td>
                              <span className={`status-badge ${trip.status}`}>
                                {trip.status}
                              </span>
                              {trip.admin_notes && (
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                  Note: {trip.admin_notes}
                                </div>
                              )}
                            </td>

                    
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

           
                     

            {activeTab === 'feedback' && (
              <>
                <h2 className="card-title">Give Feedback</h2>
                
                <div className="feedback-options-section">
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#374151' }}>
                    What would you like to give feedback about?
                  </h3>
                  <div className="feedback-options-grid">
                    <button
                      onClick={() => {
                        setFeedbackType('accommodation');
                        setShowFeedbackModal(true);
                      }}
                      className="feedback-option-card"
                    >
                      <Hotel className="feedback-icon" />
                      <h4>Accommodation</h4>
                      <p>Room quality, cleanliness, amenities</p>
                    </button>

                    <button
                      onClick={() => {
                        setFeedbackType('transport');
                        setShowFeedbackModal(true);
                      }}
                      className="feedback-option-card"
                    >
                      <Bus className="feedback-icon" />
                      <h4>Transportation</h4>
                      <p>Vehicle quality, driver, comfort</p>
                    </button>

                    <button
                      onClick={() => {
                        setFeedbackType('guide');
                        setShowFeedbackModal(true);
                      }}
                      className="feedback-option-card"
                    >
                      <User className="feedback-icon" />
                      <h4>Tour Guide</h4>
                      <p>Knowledge, communication, helpfulness</p>
                    </button>

                    <button
                      onClick={() => {
                        setFeedbackType('hotel');
                        setShowFeedbackModal(true);
                      }}
                      className="feedback-option-card"
                    >
                      <Hotel className="feedback-icon" />
                      <h4>Hotel Service</h4>
                      <p>Staff, service quality, facilities</p>
                    </button>

                    <button
                      onClick={() => {
                        setFeedbackType('city');
                        setShowFeedbackModal(true);
                      }}
                      className="feedback-option-card"
                    >
                      <MapPin className="feedback-icon" />
                      <h4>City/Destination</h4>
                      <p>Attractions, cleanliness, safety</p>
                    </button>

                    <button
                      onClick={() => {
                        setFeedbackType('overall');
                        setShowFeedbackModal(true);
                      }}
                      className="feedback-option-card overall"
                    >
                      <Star className="feedback-icon" />
                      <h4>Overall Platform</h4>
                      <p>Website, booking process, support</p>
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="loading">Loading your feedbacks...</div>
                ) : (
                  <>
                    <h3 style={{ fontSize: '1.125rem', margin: '2rem 0 1rem', color: '#374151' }}>
                      Your Feedbacks ({feedbacks.length})
                    </h3>
                    {feedbacks.length === 0 ? (
                      <div className="empty-state">
                        <p>You haven't submitted any feedback yet.</p>
                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                          Share your experience to help us improve!
                        </p>
                      </div>
                    ) : (
                      <div className="reviews-list">
                        {feedbacks.map(feedback => (
                          <div key={feedback.id} className="review-card user-review">
                            <div className="review-header">
                              <div>
                                <span className="review-destination">
                                  {getFeedbackTypeLabel(feedback.feedback_type)}
                                </span>
                                <span className="review-date">
                                  {new Date(feedback.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="review-rating">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star
                                    key={star}
                                    className="star-small"
                                    fill={star <= feedback.rating ? '#fbbf24' : 'none'}
                                    stroke={star <= feedback.rating ? '#fbbf24' : '#d1d5db'}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="review-text">{feedback.feedback_text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      
      {showFeedbackModal && (
        <FeedbackModal
          onClose={() => setShowFeedbackModal(false)}
          onSubmit={handleSubmitFeedback}
          feedbackType={feedbackType}
          relatedId={null}
          relatedName={null}
        />
      )}
    </div>
  );
};
// ADD THIS COMPONENT TO YOUR App.jsx

// Admin Feedbacks Tab Component
const AdminFeedbacksTab = ({ token }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadFeedbacks();
  }, [filterType]);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const params = filterType !== 'all' ? `?type=${filterType}` : '';
      const response = await api.get(`/admin/feedbacks${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await api.delete(`/admin/feedbacks/${feedbackId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        loadFeedbacks();
      } catch (error) {
        console.error('Error deleting feedback:', error);
        alert('Failed to delete feedback');
      }
    }
  };

  const getFeedbackTypeLabel = (type) => {
    const labels = {
      'accommodation': 'Accommodation',
      'transport': 'Transportation',
      'guide': 'Tour Guide',
      'hotel': 'Hotel',
      'city': 'City/Destination',
      'overall': 'Overall Platform'
    };
    return labels[type] || type;
  };

  const getFeedbackTypeBadge = (type) => {
    const colors = {
      'accommodation': '#9333ea',
      'transport': '#3b82f6',
      'guide': '#16a34a',
      'hotel': '#ea580c',
      'city': '#0891b2',
      'overall': '#dc2626'
    };
    return (
      <span style={{
        padding: '0.25rem 0.75rem',
        borderRadius: '0.375rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        backgroundColor: colors[type] + '20',
        color: colors[type]
      }}>
        {getFeedbackTypeLabel(type)}
      </span>
    );
  };

  if (loading) {
    return <div className="loading">Loading feedbacks...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilterType('all')}
          className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
        >
          All ({feedbacks.length})
        </button>
        <button
          onClick={() => setFilterType('accommodation')}
          className={`filter-btn ${filterType === 'accommodation' ? 'active' : ''}`}
        >
          Accommodation
        </button>
        <button
          onClick={() => setFilterType('transport')}
          className={`filter-btn ${filterType === 'transport' ? 'active' : ''}`}
        >
          Transportation
        </button>
        <button
          onClick={() => setFilterType('guide')}
          className={`filter-btn ${filterType === 'guide' ? 'active' : ''}`}
        >
          Tour Guide
        </button>
        <button
          onClick={() => setFilterType('hotel')}
          className={`filter-btn ${filterType === 'hotel' ? 'active' : ''}`}
        >
          Hotel
        </button>
        <button
          onClick={() => setFilterType('city')}
          className={`filter-btn ${filterType === 'city' ? 'active' : ''}`}
        >
          City
        </button>
        <button
          onClick={() => setFilterType('overall')}
          className={`filter-btn ${filterType === 'overall' ? 'active' : ''}`}
        >
          Overall Platform
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Type</th>
              <th>Rating</th>
              <th>Feedback</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map(feedback => (
              <tr key={feedback.id}>
                <td>{feedback.id}</td>
                <td>
                  <strong>{feedback.user_name}</strong>
                  <br />
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {feedback.user_email}
                  </span>
                </td>
                <td>{getFeedbackTypeBadge(feedback.feedback_type)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className="star-small"
                        fill={star <= feedback.rating ? '#fbbf24' : 'none'}
                        stroke={star <= feedback.rating ? '#fbbf24' : '#d1d5db'}
                      />
                    ))}
                  </div>
                </td>
                <td>
                  <div style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {feedback.feedback_text.substring(0, 150)}
                    {feedback.feedback_text.length > 150 && '...'}
                  </div>
                </td>
                <td>{new Date(feedback.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleDelete(feedback.id)}
                    className="btn-icon delete"
                  >
                    <Trash2 className="icon-sm" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {feedbacks.length === 0 && (
          <div className="empty-state">
            <p>No feedbacks found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};


