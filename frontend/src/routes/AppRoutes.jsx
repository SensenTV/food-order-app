import { Routes, Route } from 'react-router-dom'
import Login from '../pages/login.jsx'
import Register from '../pages/Register.jsx'
import Restaurants from '../pages/Restaurants.jsx'
import Menu from '../pages/Menu.jsx'
import Cart from '../pages/Cart.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Restaurants />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/menu/:id" element={<Menu />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  )
}

export default AppRoutes
