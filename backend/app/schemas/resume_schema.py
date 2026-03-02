from pydantic import BaseModel

class ResumeData(BaseModel):
    name: str = ""
    phone: str = ""
    email: str = ""
    address: str = ""
    languages: str = ""
    linkedin: str = ""
    github: str = ""
    instagram: str = ""
    website: str = ""
    summary: str = ""
    education: str = ""
    experience: str = ""
    projects: str = ""
    skills: str = ""
    photo: str = ""

class PDFRequest(BaseModel):
    resumeData: ResumeData
    template: str = "corporate"