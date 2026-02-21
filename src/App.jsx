import { Routes, Route, Navigate } from 'react-router-dom'
import CheckIn from './pages/CheckIn'
import CheckOut from './pages/CheckOut'
import Admin from './pages/Admin'

function App() {
  return (
    <Routes>
      <Route path="/checkin" element={<CheckIn />} />
      <Route path="/checkout" element={<CheckOut />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/" element={<Navigate to="/checkin" replace />} />
    </Routes>
  )
}

export default App
