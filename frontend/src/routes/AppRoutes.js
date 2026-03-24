import { Routes, Route } from 'react-router-dom'
import Login from '../pages/login'
import Register from '../pages/register'
import Restaurants from '../pages/Restaurants'
import Menu from '../pages/Menu'
import Cart from '../pages/Cart'

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
