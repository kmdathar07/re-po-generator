import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { pathname }          = useLocation()
  const navigate              = useNavigate()
  const { user, signOut }     = useAuth()

  if (pathname === '/print') return null

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-md">
            RP
          </div>
          <div>
            <span className="font-black text-gray-900 text-base tracking-tight leading-none block">Re-Po Generator</span>
            <span className="text-gray-400 text-xs leading-none">Resume + Portfolio</span>
          </div>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-black">
                  {user.email[0].toUpperCase()}
                </div>
                <span className="text-indigo-700 text-xs font-semibold max-w-[160px] truncate">{user.email}</span>
              </div>
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-xl hover:bg-red-50">
                <span>🚪</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login"  className="text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors">Login</Link>
              <Link to="/signup" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}