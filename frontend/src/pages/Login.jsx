import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate        = useNavigate()
  const { signIn }      = useAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) { setError(error.message); setLoading(false) }
    else navigate('/')
  }

  const field = 'w-full px-4 py-3.5 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-white placeholder-white/40 text-sm backdrop-blur'

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize:'40px 40px' }} />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-black text-lg shadow-xl">RP</div>
            <div className="text-left">
              <p className="text-white font-black text-xl leading-none">Re-Po Generator</p>
              <p className="text-indigo-300 text-xs">Resume + Portfolio</p>
            </div>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">Welcome back</h1>
          <p className="text-indigo-300 text-sm">Sign in to continue building</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/20 border border-red-400/30 rounded-2xl">
              <p className="text-red-300 text-sm font-medium">⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wide mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required className={field} />
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Your password" required className={field + ' pr-12'} />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-sm">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-2xl font-bold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {loading ? <><span className="animate-spin">⏳</span> Signing in...</> : '🚀 Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-white/50 text-sm">
            No account?{' '}
            <Link to="/signup" className="text-indigo-400 font-bold hover:text-indigo-300">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}