import { useState, useEffect } from 'react';

export default function RestaurantsDebug() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('🔄 Fetching restaurants...');
    const fetchRestaurants = async () => {
      try {
        console.log('Calling API at http://localhost:5000/api/restaurants');
        const response = await fetch('http://localhost:5000/api/restaurants');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP Status ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Restaurants received:', data);
        setRestaurants(data);
      } catch (err) {
        console.error('❌ Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1>🍕 Food Order App - Debug Mode</h1>
      
      {loading && <p style={{ color: '#666' }}>⏳ Loading restaurants...</p>}
      {error && <div style={{ color: 'red', padding: '10px', backgroundColor: '#ffcccc', borderRadius: '4px' }}>❌ Error: {error}</div>}

      {!loading && !error && restaurants.length === 0 && (
        <p style={{ color: '#666' }}>No restaurants found</p>
      )}

      {!loading && restaurants.length > 0 && (
        <div>
          <p style={{ color: 'green' }}>✅ Successfully loaded {restaurants.length} restaurants!</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                style={{
                  padding: '15px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  cursor: 'pointer'
                }}
              >
                <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{restaurant.name}</h3>
                <p style={{ margin: '0', color: '#7f8c8d' }}>{restaurant.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <hr style={{ margin: '40px 0', color: '#ddd' }} />
      <p style={{ fontSize: '12px', color: '#999' }}>
        💡 Open browser console (F12) to see detailed logs
      </p>
    </div>
  );
}
