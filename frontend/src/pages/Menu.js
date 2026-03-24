import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMenuByRestaurant, getRestaurantById, createOrder } from '../api/api';
import '../styles/main.css';

export default function Menu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantData = await getRestaurantById(id);
        setRestaurant(restaurantData);

        const menuData = await getMenuByRestaurant(id);
        setMenuItems(menuData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const addToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
    
    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handlePlaceOrder = async () => {
    if (!token || !user) {
      navigate('/login');
      return;
    }

    setOrderLoading(true);
    setError('');

    try {
      const items = cartItems.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity,
      }));

      await createOrder(token, id, items);
      alert('Order placed successfully!');
      setCartItems([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) return <div className="page"><p>Loading menu...</p></div>;
  if (error) return <div className="page"><div className="error-message">{error}</div></div>;

  return (
    <div className="page">
      <div className="menu-header">
        <Link to="/" className="back-link">← Back to Restaurants</Link>
        {restaurant && <h1>{restaurant.name}</h1>}
        {restaurant && <p>{restaurant.description}</p>}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="menu-container">
        <div className="menu-items">
          <h2>Menu Items</h2>
          {menuItems.length === 0 ? (
            <p>No menu items available</p>
          ) : (
            <div className="items-list">
              {menuItems.map((item) => (
                <div key={item.id} className="menu-item">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p className="price">${item.price.toFixed(2)}</p>
                  </div>
                  <button onClick={() => addToCart(item)} className="add-btn">
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cart">
          <h2>Shopping Cart</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p className="price">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <p className="total">${(item.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <p className="total-price">
                  Total: <strong>${calculateTotal()}</strong>
                </p>
                {!token ? (
                  <p className="login-prompt">Please <Link to="/login">login</Link> to place an order</p>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={orderLoading || cartItems.length === 0}
                    className="order-btn"
                  >
                    {orderLoading ? 'Placing Order...' : 'Place Order'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
