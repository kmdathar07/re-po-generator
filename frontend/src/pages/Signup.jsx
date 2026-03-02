import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const navigate       = useNavigate()
  const { signUp }     = useAuth()
  const [fullName, setFullName] = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) return setError('Passwords do not match')
    if (password.length < 6)  return setError('Password must be at least 6 characters')
    setLoading(true)
    const { error } = await signUp(email, password, fullName)
    if (error) { setError(error.message); setLoading(false) }
    else { setSuccess(true); setLoading(false) }
  }

  if (success) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl text-center max-w-md w-full">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-black text-white mb-2">Account Created!</h2>
        <p className="text-indigo-300 text-sm mb-6">
          Check <span className="text-white font-semibold">{email}</span> and click the confirmation link.
        </p>
        <Link to="/login" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-2xl font-bold hover:from-indigo-600 hover:to-purple-600 transition-all">
          Go to Login →
        </Link>
      </div>
    </div>
  )

  const field = 'w-full px-4 py-3.5 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-white placeholder-white/40 text-sm backdrop-blur'

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize:'40px 40px' }} />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-black text-lg shadow-xl">RP</div>
            <div className="text-left">
              <p className="text-white font-black text-xl leading-none">Re-Po Generator</p>
              <p className="text-indigo-300 text-xs">Resume + Portfolio</p>
            </div>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">Create account</h1>
          <p className="text-indigo-300 text-sm">Start building your resume & portfolio</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/20 border border-red-400/30 rounded-2xl">
              <p className="text-red-300 text-sm font-medium">⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wide mb-1.5">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="Jane Smith" required className={field} />
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wide mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required className={field} />
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min 6 characters" required className={field + ' pr-12'} />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-sm">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wide mb-1.5">Confirm Password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat password" required className={field} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-2xl font-bold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {loading ? <><span className="animate-spin">⏳</span> Creating...</> : '✨ Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-white/50 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}