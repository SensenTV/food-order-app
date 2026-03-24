import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '../redux/slices/cartSlice';
import { getMenuByRestaurant, getRestaurantById, createOrder } from '../api/api';
import '../styles/main.css';

export default function Menu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
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

  const handleAddToCart = (item) => {
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      restaurantId: id,
    }));
  };

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleUpdateQuantity = (itemId, quantity) => {
    dispatch(updateQuantity({ itemId, quantity }));
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
      dispatch(clearCart());
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
                  <button onClick={() => handleAddToCart(item)} className="add-btn">
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
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <p className="total">${(item.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <p className="total-price">
                  Total: <strong>${totalPrice.toFixed(2)}</strong>
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
