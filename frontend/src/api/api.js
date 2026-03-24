const API_BASE_URL = 'http://localhost:5000/api';

// Auth API calls
export const register = async (email, password, name) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }
  
  return response.json();
};

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  
  return response.json();
};

export const getProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  
  return response.json();
};

// Restaurant API calls
export const getRestaurants = async () => {
  const response = await fetch(`${API_BASE_URL}/restaurants`, {
    method: 'GET',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch restaurants');
  }
  
  return response.json();
};

export const getRestaurantById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
    method: 'GET',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch restaurant');
  }
  
  return response.json();
};

// Menu API calls
export const getMenuByRestaurant = async (restaurantId) => {
  const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/menu`, {
    method: 'GET',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch menu');
  }
  
  return response.json();
};

// Order API calls
export const createOrder = async (token, restaurantId, items) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ restaurantId, items }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create order');
  }
  
  return response.json();
};

export const getMyOrders = async (token) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  
  return response.json();
};

export const getOrderById = async (token, orderId) => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch order');
  }
  
  return response.json();
};
