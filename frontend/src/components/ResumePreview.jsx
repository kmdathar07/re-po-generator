const COLORS = {
  corporate:   { bg: '#1e3a5f', light: '#e8eef8' },
  modern:      { bg: '#6366f1', light: '#f5f3ff' },
  tech:        { bg: '#0f172a', light: '#1e293b', text: '#38bdf8' },
  startup:     { bg: '#f97316', light: '#fff7ed' },
  creative:    { bg: '#f59e0b', light: '#18181b', text: '#f59e0b' },
  academic:    { bg: '#2d3748', light: '#f9f9f9' },
  minimal_ats: { bg: '#111',    light: '#f5f5f5' },
}

export default function ResumePreview({ resumeData, template }) {
  const c = COLORS[template] || COLORS.corporate
  const { name, email, summary } = resumeData

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow h-44 flex flex-col select-none">
      <div className="flex-1 p-4 flex flex-col justify-between" style={{ background: c.bg }}>
        <div>
          <div className="font-bold text-sm truncate text-white">{name || 'Your Name'}</div>
          <div className="text-xs truncate mt-0.5 text-white/60">{email || 'your@email.com'}</div>
        </div>
        {summary && <p className="text-xs mt-2 line-clamp-2 leading-relaxed text-white/50">{summary}</p>}
      </div>
      <div className="px-4 py-2" style={{ background: c.light }}>
        <span className="text-xs font-black tracking-widest" style={{ color: c.bg === '#f59e0b' ? '#18181b' : c.bg }}>
          {template.replace('_', ' ').toUpperCase()}
        </span>
      </div>
    </div>
  )
}