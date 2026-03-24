import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import '../styles/main.css';

export default function CartBadge() {
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <Link to="/cart" className="cart-badge">
      🛒 Cart
      {cartCount > 0 && <span className="badge">{cartCount}</span>}
    </Link>
  );
}
