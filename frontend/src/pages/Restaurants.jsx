import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRestaurants } from '../api/api';
import CartBadge from '../components/CartBadge.jsx';
import '../styles/main.css';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="page">
      <div className="header">
        <h1>Food Order App</h1>
        <div className="header-right">
          <CartBadge />
          {user && (
            <>
              <div className="user-info">
                <span>Welcome, {user.name}!</span>
              </div>
              <div className="user-logout">
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            </>
          )}
          {!user && (
            <div className="auth-links">
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>
      </div>

      <div className="restaurants-container">
        <h2>Restaurants</h2>
        
        {loading && <p>Loading restaurants...</p>}
        {error && <div className="error-message">{error}</div>}

        {!loading && restaurants.length === 0 && (
          <p>No restaurants available</p>
        )}

        {!loading && restaurants.length > 0 && (
          <div className="restaurants-grid">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/menu/${restaurant.id}`}
                className="restaurant-card"
              >
                <h3>{restaurant.name}</h3>
                <p>{restaurant.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
