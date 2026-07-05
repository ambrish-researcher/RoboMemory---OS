from fastapi import APIRouter, UploadFile, File
from models import IngestTextRequest
import cognee_service
import fitz

router = APIRouter()


@router.post("/ingest/text")
async def ingest_text(request: IngestTextRequest):
    try:
        await cognee_service.remember(request.text)
        return {
            "status": "success",
            "message": "ROBO saved this to memory"
        }
    except Exception as e:
        return {"error": str(e)}, 500


@router.post("/ingest/file")
async def ingest_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        extracted = ""

        if file.filename.endswith(".pdf"):
            doc = fitz.open(
                stream=content,
                filetype="pdf"
            )
            for page in doc:
                extracted += page.get_text()
            doc.close()

        elif file.filename.endswith(".txt"):
            extracted = content.decode("utf-8")

        else:
            return {
                "error": "Only .txt and .pdf supported"
            }, 400

        if not extracted.strip():
            return {"error": "No text found in file"}, 400

        await cognee_service.remember(extracted)

        return {
            "status": "success",
            "characters": len(extracted),
            "message": "ROBO learned from your file"
        }

    except Exception as e:
        return {"error": str(e)}, 500
