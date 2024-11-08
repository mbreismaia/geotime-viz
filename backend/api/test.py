from fastapi import APIRouter

router = APIRouter()

@router.get("/test-connection")
async def test_connection():
    return {"message": "Conexão realizada com sucesso!"}
