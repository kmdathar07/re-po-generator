import { createContext, useContext, useState } from 'react'

const ResumeContext = createContext(null)

export const EMPTY_RESUME = {
  name: '', phone: '', email: '', address: '', languages: '',
  linkedin: '', github: '', instagram: '', website: '',
  summary: '', education: '', experience: '', projects: '',
  skills: '', photo: '',
}

export function ResumeProvider({ children }) {
  const [resumeData, setResumeData] = useState(EMPTY_RESUME)
  const [template, setTemplate] = useState('corporate')

  const updateField = (field, value) =>
    setResumeData(prev => ({ ...prev, [field]: value }))

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData, template, setTemplate, updateField }}>
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResume must be inside ResumeProvider')
  return ctx
}