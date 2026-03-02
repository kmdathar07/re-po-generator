export function encodeResumeData(resumeData, template) {
  return btoa(unescape(encodeURIComponent(JSON.stringify({ resumeData, template }))))
}