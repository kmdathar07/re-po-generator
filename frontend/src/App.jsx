import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider }   from './context/Authcontext'
import Navbar             from './components/Navbar'
import ProtectedRoute     from './components/ProtectedRoute'
import Login              from './pages/Login'
import Signup             from './pages/Signup'
import ProfileForm        from './pages/ProfileForm'
import Portfolio          from './pages/Portfolio'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Navbar hidden inside portfolio pages */}
        <Routes>
          <Route path="/login"  element={<><Navbar /><Login /></>} />
          <Route path="/signup" element={<><Navbar /><Signup /></>} />
          <Route path="/"       element={<><Navbar /><ProtectedRoute><ProfileForm /></ProtectedRoute></>} />
          {/* Portfolio with sub-routes — has its own nav */}
          <Route path="/portfolio/*" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
