from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import io, traceback

from app.schemas.resume_schema import PDFRequest
from app.services.pdf_service import generate_pdf_from_data

router = APIRouter(prefix="/resume", tags=["resume"])

@router.post("/pdf")
async def generate_pdf(data: PDFRequest):
    try:
        rd = data.resumeData.model_dump()
        print(f"[PDF] template={data.template}, name={rd.get('name')!r}")
        
        pdf_bytes = await generate_pdf_from_data(rd, data.template)
        
        print(f"[PDF] Generated {len(pdf_bytes):,} bytes")
        if len(pdf_bytes) < 2000:
            raise ValueError(f"PDF too small ({len(pdf_bytes)} bytes) — likely blank")
        
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="resume-{data.template}.pdf"',
                "Content-Length": str(len(pdf_bytes)),
                "Access-Control-Expose-Headers": "Content-Disposition",
            }
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))