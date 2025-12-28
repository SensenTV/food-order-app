import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Restaurants from '../pages/Restaurants'
import Menu from '../pages/Menu'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Restaurants />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/menu/:id" element={<Menu />} />
    </Routes>
  )
}

export default AppRoutes
