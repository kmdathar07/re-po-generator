export const TEMPLATES = [
  { id: 'corporate',   label: 'Corporate',   icon: '🏢', desc: 'Classic navy blue' },
  { id: 'modern',      label: 'Modern',      icon: '✨', desc: 'Purple sidebar' },
  { id: 'tech',        label: 'Tech',        icon: '💻', desc: 'Dark terminal' },
  { id: 'startup',     label: 'Startup',     icon: '🚀', desc: 'Bold orange' },
  { id: 'creative',    label: 'Creative',    icon: '🎨', desc: 'Yellow on dark' },
  { id: 'academic',    label: 'Academic',    icon: '🎓', desc: 'Traditional serif' },
  { id: 'minimal_ats', label: 'Minimal ATS', icon: '📄', desc: 'Clean & ATS-safe' },
]

export default function TemplateSelector({ selected, onChange }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {TEMPLATES.map((t) => (
        <button key={t.id} type="button" onClick={() => onChange(t.id)}
          className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
            selected === t.id
              ? 'border-indigo-500 bg-indigo-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50'
          }`}>
          <div className="text-2xl mb-1.5">{t.icon}</div>
          <div className={`font-bold text-sm ${selected === t.id ? 'text-indigo-700' : 'text-gray-700'}`}>{t.label}</div>
          <div className="text-xs text-gray-400 mt-0.5">{t.desc}</div>
          {selected === t.id && <div className="mt-1.5 text-xs font-bold text-indigo-600">✓ Selected</div>}
        </button>
      ))}
    </div>
  )
}