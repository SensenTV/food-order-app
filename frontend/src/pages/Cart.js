import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../redux/slices/cartSlice';
import { createOrder } from '../api/api';
import '../styles/main.css';
import { useState } from 'react';

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState('');

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
      // Group items by restaurant
      const itemsByRestaurant = {};
      cartItems.forEach((item) => {
        const restaurantId = item.restaurantId;
        if (!itemsByRestaurant[restaurantId]) {
          itemsByRestaurant[restaurantId] = [];
        }
        itemsByRestaurant[restaurantId].push({
          menuItemId: item.id,
          quantity: item.quantity,
        });
      });

      // Create order for each restaurant
      for (const [restaurantId, items] of Object.entries(itemsByRestaurant)) {
        await createOrder(token, restaurantId, items);
      }

      alert('Order(s) placed successfully!');
      dispatch(clearCart());
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="cart-page-header">
        <Link to="/" className="back-link">← Back to Restaurants</Link>
        <h1>Shopping Cart</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="cart-page-container">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link to="/" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-page-item">
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="qty-btn"
                      >
                        −
                      </button>
                      <span className="qty-display">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>

                    <p className="item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary-section">
              <div className="summary-details">
                <p className="summary-item">
                  <span>Subtotal:</span>
                  <strong>${totalPrice.toFixed(2)}</strong>
                </p>
                <p className="summary-item">
                  <span>Shipping:</span>
                  <strong>Free</strong>
                </p>
                <div className="summary-divider"></div>
                <p className="summary-total">
                  <span>Total:</span>
                  <strong>${totalPrice.toFixed(2)}</strong>
                </p>
              </div>

              {!token ? (
                <p className="login-required">
                  Please <Link to="/login">login</Link> to place an order
                </p>
              ) : (
                <>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={orderLoading || cartItems.length === 0}
                    className="place-order-btn"
                  >
                    {orderLoading ? 'Placing Order...' : 'Place Order'}
                  </button>
                  <Link to="/" className="continue-shopping-btn">
                    Continue Shopping
                  </Link>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
