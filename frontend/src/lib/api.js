import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export const api = axios.create({ baseURL: API_BASE, timeout: 60000 })

export async function downloadResumePDF(resumeData, template) {
  const response = await api.post(
    '/resume/pdf',
    { resumeData, template },
    { responseType: 'blob' }
  )
  const blob = new Blob([response.data], { type: 'application/pdf' })
  const url  = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href     = url
  link.download = `resume-${template}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}