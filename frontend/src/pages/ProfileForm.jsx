import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { downloadResumePDF } from '../lib/api'
import TemplateSelector from '../components/TemplateSelector'
import ResumePreview from '../components/ResumePreview'

const EMPTY = {
  name:'', phone:'', email:'', address:'', languages:'',
  linkedin:'', github:'', instagram:'', website:'',
  summary:'', education:'', experience:'', projects:'',
  skills:'', photo:''
}

const inp = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all text-gray-800 placeholder-gray-400 text-sm'
const ta  = inp + ' resize-none'
const lbl = 'block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5'

function CardHeader({ emoji, title, subtitle, gradient='from-indigo-600 to-purple-600' }) {
  return (
    <div className={`px-8 py-5 bg-gradient-to-r ${gradient}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <h2 className="text-white font-bold text-base">{title}</h2>
          {subtitle && <p className="text-white/70 text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}

export default function ProfileForm() {
  const navigate      = useNavigate()
  const { user }      = useAuth()
  const [resumeData, setResumeData] = useState(EMPTY)
  const [template,   setTemplate]   = useState('corporate')
  const [loading,    setLoading]    = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)
  const [preview,    setPreview]    = useState(null)
  const [fetching,   setFetching]   = useState(true)

  useEffect(() => {
    if (!user) { setFetching(false); return }
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setResumeData({
            name:       data.name       || '',
            phone:      data.phone      || '',
            email:      data.email      || '',
            address:    data.address    || '',
            languages:  data.languages  || '',
            linkedin:   data.linkedin   || '',
            github:     data.github     || '',
            instagram:  data.instagram  || '',
            website:    data.website    || '',
            summary:    data.summary    || '',
            education:  data.education  || '',
            experience: data.experience || '',
            projects:   data.projects   || '',
            skills:     data.skills     || '',
            photo:      data.photo      || '',
          })
          if (data.selected_template) setTemplate(data.selected_template)
          if (data.photo) setPreview(data.photo)
        }
        setFetching(false)
      })
  }, [user])

  const set = field => e => { setSaved(false); setResumeData(prev => ({ ...prev, [field]: e.target.value })) }

  const handlePhoto = e => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setResumeData(prev => ({ ...prev, photo: reader.result }))
      setPreview(reader.result); setSaved(false)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    const { error } = await supabase.from('profiles').upsert({
      id: user.id, ...resumeData,
      selected_template: template,
      updated_at: new Date().toISOString(),
    })
    if (!error) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    else alert('Save failed: ' + error.message)
    setSaving(false)
  }

  const handleDownload = async () => {
    if (!resumeData.name && !resumeData.summary && !resumeData.skills) {
      alert('Please fill in at least your name, summary, or skills first!')
      return
    }
    setLoading(true)
    try { await downloadResumePDF(resumeData, template) }
    catch (err) {
      console.error('PDF error:', err)
      alert('PDF failed: ' + (err?.response?.data?.detail || err.message || 'Unknown') + '\n\nMake sure:\n1. Backend is running on port 8000\n2. Run: uvicorn app.main:app --reload --port 8000')
    }
    setLoading(false)
  }

  const handlePortfolio = () => {
    navigate('/portfolio', { state: { resumeData, template } })
  }

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-lg mx-auto mb-3 animate-pulse">RP</div>
        <p className="text-gray-400 text-sm">Loading your profile...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            ✦ Re-Po Generator — Resume + Portfolio
          </span>
          <h1 className="text-4xl font-black text-gray-900 mb-2" style={{ fontFamily:'DM Serif Display, serif' }}>Build Your Resume</h1>
          <p className="text-gray-400 text-sm">Fill details · Choose template · Save · Download PDF or generate portfolio</p>
          {user && <p className="text-indigo-500 text-xs mt-2 font-medium">Signed in as {user.email}</p>}
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 overflow-hidden">

          <CardHeader emoji="👤" title="Personal Information" subtitle="Your basic contact details" />
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 flex items-center gap-5 p-5 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0 border-2 border-dashed border-indigo-300">
                {preview ? <img src={preview} alt="preview" className="w-full h-full object-cover" /> : <span className="text-3xl">📷</span>}
              </div>
              <div className="flex-1">
                <label className={lbl}>Profile Photo</label>
                <input type="file" accept="image/*" onChange={handlePhoto}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-bold hover:file:bg-indigo-100 cursor-pointer" />
                <p className="text-xs text-gray-400 mt-1">JPG or PNG · max 5 MB</p>
              </div>
            </div>
            <div><label className={lbl}>Full Name *</label>   <input value={resumeData.name}      onChange={set('name')}      placeholder="Jane Smith"                className={inp} /></div>
            <div><label className={lbl}>Phone</label>          <input value={resumeData.phone}     onChange={set('phone')}     placeholder="+91 98765 43210"           className={inp} /></div>
            <div><label className={lbl}>Email</label>          <input value={resumeData.email}     onChange={set('email')}     placeholder="jane@example.com"          className={inp} /></div>
            <div><label className={lbl}>Address</label>        <input value={resumeData.address}   onChange={set('address')}   placeholder="Chennai, Tamil Nadu, India" className={inp} /></div>
            <div><label className={lbl}>Languages</label>      <input value={resumeData.languages} onChange={set('languages')} placeholder="English, Tamil, Hindi"     className={inp} /></div>
            <div><label className={lbl}>Skills</label>         <input value={resumeData.skills}    onChange={set('skills')}    placeholder="React, Python, Figma"      className={inp} /></div>
          </div>

          <CardHeader emoji="🔗" title="Social & Online Presence" subtitle="Your professional links" gradient="from-violet-600 to-indigo-600" />
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className={lbl}>LinkedIn</label>         <input value={resumeData.linkedin}  onChange={set('linkedin')}  placeholder="linkedin.com/in/jane" className={inp} /></div>
            <div><label className={lbl}>GitHub</label>           <input value={resumeData.github}    onChange={set('github')}    placeholder="github.com/jane"      className={inp} /></div>
            <div><label className={lbl}>Instagram</label>        <input value={resumeData.instagram} onChange={set('instagram')} placeholder="instagram.com/jane"   className={inp} /></div>
            <div><label className={lbl}>Personal Website</label> <input value={resumeData.website}   onChange={set('website')}   placeholder="jane.dev"             className={inp} /></div>
          </div>

          <CardHeader emoji="💼" title="Professional Details" subtitle="Your career story" gradient="from-purple-600 to-pink-600" />
          <div className="p-8 space-y-5">
            <div>
              <label className={lbl}>Professional Summary</label>
              <textarea rows={3} value={resumeData.summary} onChange={set('summary')} className={ta}
                placeholder="A passionate developer with 3+ years of experience building scalable web apps..." />
            </div>
            <div>
              <label className={lbl}>Education</label>
              <p className="text-xs text-gray-400 mb-2">Separate multiple entries with a blank line</p>
              <textarea rows={4} value={resumeData.education} onChange={set('education')} className={ta}
                placeholder={"B.Tech Computer Science — XYZ University, 2020–2024\nGPA: 9.0 / 10\n\nClass 12 — ABC School, 2020\n95%"} />
            </div>
            <div>
              <label className={lbl}>Work Experience</label>
              <p className="text-xs text-gray-400 mb-2">Separate roles with blank line · use - for bullets</p>
              <textarea rows={5} value={resumeData.experience} onChange={set('experience')} className={ta}
                placeholder={"Software Engineer @ Google, Jan 2023 – Present\n- Built APIs serving 1M+ users\n- Led team of 4 engineers\n\nIntern @ Startup, Jun–Dec 2022\n- Built React dashboard"} />
            </div>
            <div>
              <label className={lbl}>Projects</label>
              <p className="text-xs text-gray-400 mb-2">Separate projects with a blank line</p>
              <textarea rows={5} value={resumeData.projects} onChange={set('projects')} className={ta}
                placeholder={"Re-Po Generator — FastAPI, React, Playwright\n- PDF export, 7 templates\n- Supabase auth\n\nE-Commerce App — Node, MongoDB, Stripe\n- 1000+ users"} />
            </div>
          </div>

          <CardHeader emoji="🎨" title="Choose Resume Template" subtitle="Affects PDF style and portfolio theme" gradient="from-orange-500 to-pink-500" />
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <TemplateSelector selected={template} onChange={t => { setTemplate(t); setSaved(false) }} />
              </div>
              <div>
                <p className={lbl + ' mb-3'}>Live Preview</p>
                <ResumePreview resumeData={resumeData} template={template} />
              </div>
            </div>
          </div>

          <div className="px-8 pb-8 space-y-3">
            <button onClick={handleSave} disabled={saving}
              className="w-full border-2 border-indigo-500 text-indigo-600 py-3.5 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              {saving ? <><span className="animate-spin">⏳</span> Saving...</>
               : saved ? <><span>✅</span> Saved to Cloud!</>
               : <><span>💾</span> Save Progress</>}
            </button>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleDownload} disabled={loading}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><span className="animate-spin">⏳</span> Generating PDF...</> : <><span>📄</span> Download {template.replace('_',' ')} PDF</>}
              </button>
              <button onClick={handlePortfolio}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-bold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg flex items-center justify-center gap-2">
                <span>🌐</span> Generate Portfolio
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}