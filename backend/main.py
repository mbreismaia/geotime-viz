from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.plots import router as plots_router 

app = FastAPI()

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui o router de plots com o prefixo /api
app.include_router(plots_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Hello from FastAPI"}
