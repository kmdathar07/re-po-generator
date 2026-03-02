import { useLocation, useNavigate, Routes, Route, Link, useParams } from 'react-router-dom'
import { useEffect, useRef, useState, useCallback } from 'react'
import { downloadResumePDF } from '../lib/api'

// ─── Scroll reveal hook ───────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold })
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  return [ref, vis]
}

function Reveal({ children, delay = 0, dir = 'up', className = '' }) {
  const [ref, vis] = useInView()
  const transforms = { up: 'translateY(50px)', left: 'translateX(-50px)', right: 'translateX(50px)', zoom: 'scale(0.9)' }
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : transforms[dir] || transforms.up,
      transition: `opacity .75s cubic-bezier(.4,0,.2,1) ${delay}ms, transform .75s cubic-bezier(.4,0,.2,1) ${delay}ms`
    }}>{children}</div>
  )
}

// ─── Theme map ────────────────────────────────────────────────
const THEMES = {
  corporate:   { p: '#1e3a5f', a: '#e8eef8', g1: '#1e3a5f', g2: '#2d5a8e', text: 'white' },
  modern:      { p: '#6366f1', a: '#f5f3ff', g1: '#6366f1', g2: '#8b5cf6', text: 'white' },
  tech:        { p: '#38bdf8', a: '#0f172a', g1: '#0f172a', g2: '#1e293b', text: '#38bdf8' },
  startup:     { p: '#f97316', a: '#fff7ed', g1: '#f97316', g2: '#ef4444', text: 'white' },
  creative:    { p: '#f59e0b', a: '#fffbeb', g1: '#18181b', g2: '#27272a', text: '#f59e0b' },
  academic:    { p: '#2d3748', a: '#f7f8fa', g1: '#2d3748', g2: '#1a202c', text: 'white' },
  minimal_ats: { p: '#374151', a: '#f5f5f5', g1: '#374151', g2: '#111827', text: 'white' },
}

const split = t => (t || '').split(/\n\n+/).filter(Boolean)
const lines = t => (t || '').split('\n').filter(Boolean)
const init  = n => (n || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
const cleanUrl = u => u.replace(/^https?:\/\//, '')

// ─── Shared Portfolio Shell (navbar + route outlet) ───────────
function PortfolioShell({ data, template, children }) {
  const { username } = useParams()
  const th = THEMES[template] || THEMES.corporate
  const [scroll, setScroll] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const h = () => setScroll(window.scrollY)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  const base = username ? `/portfolio/${username}` : '/portfolio'
  const navLinks = [
    { label: 'Home',     to: base },
    { label: 'About',    to: `${base}/about` },
    { label: 'Projects', to: `${base}/projects` },
    { label: 'Resume',   to: `${base}/resume` },
  ]

  const navBg = scroll > 60
    ? 'bg-black/80 backdrop-blur-xl shadow-2xl'
    : 'bg-transparent'

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f', fontFamily: 'Outfit, Inter, sans-serif', color: 'white' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;600;700;900&display=swap');
        @keyframes heroShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes float     { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(3deg)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes drift { from{transform:translateY(100vh) scale(0);opacity:0} 50%{opacity:.6} to{transform:translateY(-20px) scale(1);opacity:0} }
        @keyframes glow  { 0%,100%{box-shadow:0 0 20px ${th.p}44} 50%{box-shadow:0 0 50px ${th.p}88,0 0 100px ${th.p}22} }
        @keyframes text-shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes bar   { from{width:0} to{width:var(--w)} }
        @keyframes cursor-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .float-anim { animation: float 6s ease-in-out infinite; }
        .particle   { position:absolute; border-radius:50%; animation: drift linear infinite; pointer-events:none; }
        .glow-ring  { animation: glow 3s ease-in-out infinite; }
        .shimmer    { background:linear-gradient(90deg,${th.p},#fff,${th.p},${th.g2});background-size:200% auto;animation:text-shimmer 3s linear infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
        .nav-link   { position:relative; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:2px; background:${th.p}; transition:width .3s; border-radius:2px; }
        .nav-link:hover::after { width:100%; }
        .card-hover { transition:transform .35s cubic-bezier(.4,0,.2,1),box-shadow .35s; }
        .card-hover:hover { transform:translateY(-8px); box-shadow:0 24px 60px ${th.p}30; }
        h1,h2,h3 { font-family:'DM Serif Display',serif; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#0a0a0f; }
        ::-webkit-scrollbar-thumb { background:${th.p}; border-radius:10px; }
      `}</style>

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={base} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-xl"
              style={{ background: `linear-gradient(135deg,${th.g1},${th.g2})` }}>
              {init(data.name)}
            </div>
            <span className="font-black text-white text-base tracking-tight">{data.name?.split(' ')[0] || 'Portfolio'}</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className="nav-link text-sm font-semibold text-white/70 hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu */}
          <button onClick={() => setMenuOpen(o => !o)} className="md:hidden text-white p-2 rounded-xl hover:bg-white/10">
            <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 px-6 py-4 space-y-3">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                className="block text-white/80 hover:text-white font-semibold py-2 border-b border-white/5">
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Page content */}
      <div>{children}</div>

      {/* Footer */}
      <footer className="text-center py-8 text-white/30 text-sm border-t border-white/5">
        Built with <span style={{ color: th.p }}>♥</span> using <span className="font-semibold text-white/50">Re-Po Generator</span>
      </footer>
    </div>
  )
}

// ─── HOME PAGE ────────────────────────────────────────────────
function HomePage({ data, template }) {
  const th = THEMES[template] || THEMES.corporate
  const { username } = useParams()
  const base = username ? `/portfolio/${username}` : '/portfolio'

  const [typed, setTyped] = useState('')
  useEffect(() => {
    if (!data.name) return
    let i = 0
    const iv = setInterval(() => { setTyped(data.name.slice(0, i + 1)); i++; if (i >= data.name.length) clearInterval(iv) }, 80)
    return () => clearInterval(iv)
  }, [data.name])

  const skills = (data.skills || '').split(',').map(s => s.trim()).filter(Boolean).slice(0, 6)

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 pb-10 px-6">
      {/* Animated background */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 80% at 50% -20%, ${th.p}22, transparent)` }} />
      {[...Array(15)].map((_, i) => (
        <div key={i} className="particle"
          style={{ width: `${4 + (i % 4) * 3}px`, height: `${4 + (i % 4) * 3}px`, background: `${th.p}${30 + i * 4}`, left: `${5 + i * 6.5}%`, bottom: '-20px', animationDuration: `${8 + i * 1.2}s`, animationDelay: `${i * 0.5}s` }} />
      ))}
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `linear-gradient(${th.p}40 1px,transparent 1px),linear-gradient(90deg,${th.p}40 1px,transparent 1px)`, backgroundSize: '60px 60px' }} />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Avatar */}
        <div className="float-anim mb-10 flex justify-center">
          <div className="relative">
            <div className="w-36 h-36 rounded-3xl overflow-hidden shadow-2xl glow-ring border-2"
              style={{ borderColor: `${th.p}60` }}>
              {data.photo
                ? <img src={data.photo} alt={data.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-5xl font-black"
                    style={{ background: `linear-gradient(135deg,${th.g1},${th.g2})`, color: th.text }}>
                    {init(data.name)}
                  </div>}
            </div>
            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-emerald-400 border-3 border-black shadow-lg flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-200 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border"
          style={{ background: `${th.p}15`, borderColor: `${th.p}40`, color: th.p }}>
          ✦ Available for opportunities
        </div>

        {/* Name */}
        <h1 className="text-6xl md:text-8xl font-black mb-4 leading-none tracking-tight">
          <span className="shimmer">{typed}</span>
          <span className="animate-pulse" style={{ color: th.p, opacity: 0.7 }}>|</span>
        </h1>

        {/* Summary */}
        {data.summary && (
          <p className="text-white/65 text-xl max-w-2xl mx-auto mb-8 leading-relaxed font-light">{data.summary}</p>
        )}

        {/* Skills preview */}
        {skills.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {skills.map((s, i) => (
              <span key={i} className="px-4 py-1.5 rounded-full text-sm font-semibold border"
                style={{ background: `${th.p}15`, borderColor: `${th.p}35`, color: 'white' }}>
                {s}
              </span>
            ))}
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link to={`${base}/about`}
            className="px-8 py-4 rounded-2xl font-bold text-base text-white transition-all hover:scale-105 shadow-xl"
            style={{ background: `linear-gradient(135deg,${th.g1},${th.g2})` }}>
            🧠 About Me
          </Link>
          <Link to={`${base}/projects`}
            className="px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105 border"
            style={{ borderColor: `${th.p}50`, color: 'white', background: `${th.p}15` }}>
            🚀 My Projects
          </Link>
          <Link to={`${base}/resume`}
            className="px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105 border border-white/20"
            style={{ color: 'white', background: 'rgba(255,255,255,0.05)' }}>
            📄 Resume / CV
          </Link>
        </div>

        {/* Social links */}
        <div className="flex flex-wrap justify-center gap-3">
          {data.linkedin  && <a href={`https://${cleanUrl(data.linkedin)}`}  target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-white/15 bg-white/5 hover:bg-white/15 transition-all">🔗 LinkedIn</a>}
          {data.github    && <a href={`https://${cleanUrl(data.github)}`}    target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-white/15 bg-white/5 hover:bg-white/15 transition-all">💻 GitHub</a>}
          {data.website   && <a href={`https://${cleanUrl(data.website)}`}   target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-white/15 bg-white/5 hover:bg-white/15 transition-all">🌐 Website</a>}
          {data.email     && <a href={`mailto:${data.email}`}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-white/15 bg-white/5 hover:bg-white/15 transition-all">✉️ Email</a>}
          {data.instagram && <a href={`https://instagram.com/${data.instagram.replace(/.*instagram\.com\//,'')}`} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-white/15 bg-white/5 hover:bg-white/15 transition-all">📸 Instagram</a>}
        </div>
      </div>
    </section>
  )
}

// ─── ABOUT PAGE ───────────────────────────────────────────────
function AboutPage({ data, template }) {
  const th = THEMES[template] || THEMES.corporate
  const skillList = (data.skills || '').split(',').map(s => s.trim()).filter(Boolean)
  const langList  = (data.languages || '').split(',').map(s => s.trim()).filter(Boolean)
  const eduList   = split(data.education)

  const tools = [
    { icon: '⚡', cat: 'Frontend',  items: skillList.filter(s => /react|vue|angular|html|css|js|typescript|tailwind|next|svelte/i.test(s)) },
    { icon: '🔧', cat: 'Backend',   items: skillList.filter(s => /node|python|django|fastapi|flask|java|go|rust|php|ruby|express/i.test(s)) },
    { icon: '🗄️', cat: 'Database',  items: skillList.filter(s => /sql|mongo|postgres|redis|mysql|firebase|supabase/i.test(s)) },
    { icon: '🛠️', cat: 'Tools',     items: skillList.filter(s => /git|docker|aws|figma|linux|nginx|vercel|ci|cd|playwright/i.test(s)) },
  ].filter(g => g.items.length > 0)

  // leftover skills not categorized
  const categorized = tools.flatMap(g => g.items)
  const other = skillList.filter(s => !categorized.includes(s))
  if (other.length) tools.push({ icon: '🌟', cat: 'Other', items: other })

  return (
    <div className="pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border mb-4 inline-block"
              style={{ color: th.p, borderColor: `${th.p}40`, background: `${th.p}10` }}>About Me</span>
            <h1 className="text-5xl md:text-6xl text-white mb-4">Who I Am</h1>
          </div>
        </Reveal>

        {/* Who I Am — bio + photo */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <Reveal dir="left">
            <div className="relative">
              <div className="w-80 h-80 rounded-3xl overflow-hidden mx-auto shadow-2xl"
                style={{ boxShadow: `0 30px 80px ${th.p}30` }}>
                {data.photo
                  ? <img src={data.photo} alt={data.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-8xl font-black"
                      style={{ background: `linear-gradient(135deg,${th.g1},${th.g2})`, color: th.text }}>
                      {init(data.name)}
                    </div>}
              </div>
              {/* floating badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-2xl font-bold text-sm text-white shadow-xl whitespace-nowrap"
                style={{ background: `linear-gradient(135deg,${th.g1},${th.g2})` }}>
                ✨ Open to opportunities
              </div>
            </div>
          </Reveal>
          <Reveal dir="right" delay={150}>
            <div className="space-y-5">
              {data.summary && <p className="text-white/75 text-lg leading-relaxed">{data.summary}</p>}
              <div className="grid grid-cols-2 gap-3">
                {data.email    && <div className="rounded-2xl p-4" style={{ background: `${th.p}10`, border: `1px solid ${th.p}25` }}><p className="text-xs text-white/40 font-bold uppercase tracking-wide mb-1">Email</p><p className="text-white text-sm font-medium truncate">{data.email}</p></div>}
                {data.phone    && <div className="rounded-2xl p-4" style={{ background: `${th.p}10`, border: `1px solid ${th.p}25` }}><p className="text-xs text-white/40 font-bold uppercase tracking-wide mb-1">Phone</p><p className="text-white text-sm font-medium">{data.phone}</p></div>}
                {data.address  && <div className="rounded-2xl p-4 col-span-2" style={{ background: `${th.p}10`, border: `1px solid ${th.p}25` }}><p className="text-xs text-white/40 font-bold uppercase tracking-wide mb-1">Location</p><p className="text-white text-sm font-medium">📍 {data.address}</p></div>}
                {langList.length > 0 && <div className="rounded-2xl p-4 col-span-2" style={{ background: `${th.p}10`, border: `1px solid ${th.p}25` }}><p className="text-xs text-white/40 font-bold uppercase tracking-wide mb-1">Languages</p><p className="text-white text-sm font-medium">{langList.join(' · ')}</p></div>}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Skills */}
        {skillList.length > 0 && (
          <Reveal>
            <div className="mb-20">
              <div className="text-center mb-10">
                <span className="text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border mb-3 inline-block"
                  style={{ color: th.p, borderColor: `${th.p}40`, background: `${th.p}10` }}>Skills</span>
                <h2 className="text-4xl text-white">What I Know</h2>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                {skillList.map((s, i) => (
                  <Reveal key={i} delay={i * 40}>
                    <span className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-110 cursor-default hover:shadow-xl"
                      style={{ background: `linear-gradient(135deg,${th.p}${Math.round(60+i%3*20).toString(16)},${th.p}80)`, border: `1px solid ${th.p}50` }}>
                      {s}
                    </span>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Tools by category */}
        {tools.length > 0 && (
          <Reveal>
            <div className="mb-20">
              <div className="text-center mb-10">
                <span className="text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border mb-3 inline-block"
                  style={{ color: th.p, borderColor: `${th.p}40`, background: `${th.p}10` }}>Toolbox</span>
                <h2 className="text-4xl text-white">Tools I Use</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {tools.map((g, i) => (
                  <Reveal key={i} delay={i * 80}>
                    <div className="card-hover rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: `${th.p}20` }}>
                      <div className="text-2xl mb-3">{g.icon}</div>
                      <h3 className="text-white font-bold text-base mb-3">{g.cat}</h3>
                      <div className="flex flex-wrap gap-2">
                        {g.items.map((item, j) => (
                          <span key={j} className="text-xs px-3 py-1 rounded-full font-semibold"
                            style={{ background: `${th.p}20`, color: th.p }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Education */}
        {eduList.length > 0 && (
          <Reveal>
            <div>
              <div className="text-center mb-10">
                <span className="text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border mb-3 inline-block"
                  style={{ color: th.p, borderColor: `${th.p}40`, background: `${th.p}10` }}>Background</span>
                <h2 className="text-4xl text-white">Education</h2>
              </div>
              <div className="max-w-2xl mx-auto space-y-4">
                {eduList.map((edu, i) => (
                  <Reveal key={i} delay={i * 80}>
                    <div className="card-hover rounded-2xl p-6 border flex gap-4 items-start"
                      style={{ background: 'rgba(255,255,255,0.03)', borderColor: `${th.p}25` }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background: `linear-gradient(135deg,${th.g1},${th.g2})` }}>🎓</div>
                      <div>
                        {lines(edu).map((l, j) => (
                          <p key={j} className={j === 0 ? 'font-bold text-white text-base' : 'text-white/55 text-sm mt-0.5'}>{l}</p>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        )}

      </div>
    </div>
  )
}

// ─── PROJECTS PAGE ────────────────────────────────────────────
function ProjectsPage({ data, template }) {
  const th = THEMES[template] || THEMES.corporate
  const projList = split(data.projects)
  const expList  = split(data.experience)
  const EMOJIS   = ['🚀', '💡', '⚡', '🎯', '🔥', '🌟', '🛠️', '🎨', '🔮', '🧬']

  return (
    <div className="pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border mb-4 inline-block"
              style={{ color: th.p, borderColor: `${th.p}40`, background: `${th.p}10` }}>Portfolio</span>
            <h1 className="text-5xl md:text-6xl text-white mb-4">My Projects</h1>
            <p className="text-white/50 max-w-xl mx-auto">Things I've built, shipped, and broken (then fixed).</p>
          </div>
        </Reveal>

        {/* Projects grid */}
        {projList.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 mb-20">
            {projList.map((p, i) => {
              const ls = lines(p)
              return (
                <Reveal key={i} delay={i * 80} dir={i % 2 === 0 ? 'left' : 'right'}>
                  <div className="card-hover rounded-3xl p-7 border relative overflow-hidden h-full"
                    style={{ background: 'rgba(255,255,255,0.03)', borderColor: `${th.p}20` }}>
                    {/* top bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                      style={{ background: `linear-gradient(90deg,${th.g1},${th.g2})` }} />
                    {/* glow */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-2xl"
                      style={{ background: th.p }} />
                    <div className="flex gap-4 items-start relative z-10">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                        style={{ background: `linear-gradient(135deg,${th.g1}88,${th.g2}88)`, border: `1px solid ${th.p}30` }}>
                        {EMOJIS[i % EMOJIS.length]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg mb-2 leading-tight">{ls[0]}</h3>
                        <div className="space-y-1">
                          {ls.slice(1).map((l, j) => (
                            <p key={j} className="text-white/55 text-sm leading-relaxed flex gap-2">
                              <span style={{ color: th.p }}>▸</span>
                              <span>{l.replace(/^[-•▸]\s*/, '')}</span>
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        ) : (
          <Reveal><p className="text-center text-white/40 py-16">No projects added yet. Fill in the Projects field in the builder.</p></Reveal>
        )}

        {/* Experience timeline */}
        {expList.length > 0 && (
          <>
            <Reveal>
              <div className="text-center mb-10">
                <span className="text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border mb-3 inline-block"
                  style={{ color: th.p, borderColor: `${th.p}40`, background: `${th.p}10` }}>Career</span>
                <h2 className="text-4xl text-white">Work Experience</h2>
              </div>
            </Reveal>
            <div className="max-w-2xl mx-auto">
              {expList.map((exp, i) => {
                const ls = lines(exp)
                return (
                  <Reveal key={i} delay={i * 100}>
                    <div className="relative pl-10 pb-10">
                      <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full shadow-lg flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg,${th.g1},${th.g2})`, boxShadow: `0 0 20px ${th.p}60` }}>
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      {i < expList.length - 1 && (
                        <div className="absolute left-2.5 top-6 w-0.5 h-full"
                          style={{ background: `linear-gradient(${th.p}50,transparent)` }} />
                      )}
                      <div className="rounded-2xl p-5 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: `${th.p}20` }}>
                        <p className="font-bold text-white text-base mb-2">{ls[0]}</p>
                        <div className="space-y-1">
                          {ls.slice(1).map((l, j) => (
                            <p key={j} className="text-white/55 text-sm flex gap-2">
                              <span style={{ color: th.p }}>▸</span>
                              <span>{l.replace(/^[-•]\s*/, '')}</span>
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── RESUME PAGE ──────────────────────────────────────────────
function ResumePage({ data, template }) {
  const th = THEMES[template] || THEMES.corporate
  const [dlLoading, setDlLoading] = useState(false)
  const [dlDone, setDlDone]       = useState(false)

  const handleDownload = async () => {
    setDlLoading(true)
    try {
      await downloadResumePDF(data, template)
      setDlDone(true); setTimeout(() => setDlDone(false), 3000)
    } catch (e) {
      alert('PDF failed: ' + (e.message || 'Unknown error') + '\n\nMake sure the backend is running on port 8000.')
    }
    setDlLoading(false)
  }

  const [copied, setCopied] = useState(false)
  const sharePortfolio = () => {
    navigator.clipboard.writeText(window.location.origin + window.location.pathname.replace('/resume', ''))
    setCopied(true); setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="pt-28 pb-16 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border mb-4 inline-block"
              style={{ color: th.p, borderColor: `${th.p}40`, background: `${th.p}10` }}>Download</span>
            <h1 className="text-5xl md:text-6xl text-white mb-4">Resume & CV</h1>
            <p className="text-white/50 max-w-lg mx-auto">Download a professionally styled PDF resume, or share your portfolio link.</p>
          </div>
        </Reveal>

        {/* Download cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {/* PDF Download */}
          <Reveal dir="left" delay={100}>
            <div className="card-hover rounded-3xl p-8 border text-center"
              style={{ background: `linear-gradient(135deg,${th.g1}22,${th.g2}11)`, borderColor: `${th.p}30` }}>
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-white font-bold text-xl mb-2">Resume PDF</h3>
              <p className="text-white/50 text-sm mb-6 leading-relaxed">
                Download a styled <strong className="text-white">{template.replace('_', ' ')}</strong> template PDF — ready to send to employers.
              </p>
              <button onClick={handleDownload} disabled={dlLoading}
                className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all hover:scale-105 shadow-xl disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg,${th.g1},${th.g2})`, boxShadow: `0 8px 30px ${th.p}40` }}>
                {dlLoading ? <><span className="animate-spin">⏳</span> Generating...</>
                 : dlDone   ? <><span>✅</span> Downloaded!</>
                 : <><span>⬇️</span> Download PDF</>}
              </button>
            </div>
          </Reveal>

          {/* Share Portfolio */}
          <Reveal dir="right" delay={200}>
            <div className="card-hover rounded-3xl p-8 border text-center"
              style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}>
              <div className="text-6xl mb-4">🔗</div>
              <h3 className="text-white font-bold text-xl mb-2">Share Portfolio</h3>
              <p className="text-white/50 text-sm mb-6 leading-relaxed">
                Copy your portfolio link and share it on LinkedIn, job applications, or anywhere.
              </p>
              <button onClick={sharePortfolio}
                className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all hover:scale-105 border border-white/20 hover:bg-white/10 flex items-center justify-center gap-2">
                {copied ? <><span>✅</span> Copied to clipboard!</> : <><span>📋</span> Copy Portfolio Link</>}
              </button>
            </div>
          </Reveal>
        </div>

        {/* Resume preview / info table */}
        <Reveal delay={300}>
          <div className="rounded-3xl p-8 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: `${th.p}20` }}>
            <h3 className="text-white font-bold text-lg mb-6">Resume Preview</h3>
            <div className="space-y-3">
              {[
                ['Name',      data.name],
                ['Email',     data.email],
                ['Phone',     data.phone],
                ['Address',   data.address],
                ['LinkedIn',  data.linkedin],
                ['GitHub',    data.github],
                ['Website',   data.website],
                ['Skills',    data.skills],
                ['Languages', data.languages],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} className="flex gap-4 py-2.5 border-b border-white/5">
                  <span className="text-xs font-bold text-white/30 uppercase tracking-wide w-24 flex-shrink-0 pt-0.5">{label}</span>
                  <span className="text-white/70 text-sm flex-1 break-all">{value}</span>
                </div>
              ))}
            </div>

            {/* Template info */}
            <div className="mt-6 p-4 rounded-2xl flex items-center gap-3"
              style={{ background: `${th.p}15`, border: `1px solid ${th.p}30` }}>
              <span className="text-2xl">🎨</span>
              <div>
                <p className="text-white font-semibold text-sm">Template: <span style={{ color: th.p }}>{template.replace('_', ' ').toUpperCase()}</span></p>
                <p className="text-white/40 text-xs mt-0.5">Change template in the Re-Po Generator builder</p>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  )
}

// ─── MAIN PORTFOLIO COMPONENT ─────────────────────────────────
export default function Portfolio() {
  const location   = useLocation()
  const state      = location.state

  // If accessed via direct URL (/portfolio/username), try to load from localStorage cache
  // If accessed from builder (state present), use state data
  const [data, setData]         = useState(null)
  const [template, setTemplate] = useState('corporate')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (state?.resumeData) {
      setData(state.resumeData)
      setTemplate(state.template || 'corporate')
      // Cache to localStorage for shareable URL access
      try {
        localStorage.setItem('portfolio_data',     JSON.stringify(state.resumeData))
        localStorage.setItem('portfolio_template', state.template || 'corporate')
      } catch {}
      setLoading(false)
    } else {
      // No state — try localStorage (user came via shared link)
      try {
        const cached = localStorage.getItem('portfolio_data')
        const tmpl   = localStorage.getItem('portfolio_template')
        if (cached) {
          setData(JSON.parse(cached))
          setTemplate(tmpl || 'corporate')
        }
      } catch {}
      setLoading(false)
    }
  }, [state])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-5xl mb-4 animate-spin">⏳</div>
          <p>Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-6">😕</div>
          <h2 className="text-3xl font-bold text-white mb-3">Portfolio not found</h2>
          <p className="text-white/50 mb-8">This portfolio hasn't been set up yet, or the link has expired.</p>
          <a href="/" className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all">← Build Your Portfolio</a>
        </div>
      </div>
    )
  }

  const th   = THEMES[template] || THEMES.corporate
  const base = '/portfolio'

  return (
    <PortfolioShell data={data} template={template}>
      <Routes>
        <Route path="/"        element={<HomePage     data={data} template={template} />} />
        <Route path="/about"   element={<AboutPage    data={data} template={template} />} />
        <Route path="/projects"element={<ProjectsPage data={data} template={template} />} />
        <Route path="/resume"  element={<ResumePage   data={data} template={template} />} />
      </Routes>
    </PortfolioShell>
  )
}