from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.plots import router as plots_router 
from api.map import router as map_router

app = FastAPI()

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Permite que o front-end (Next.js) na porta 3000 acesse a API
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos os cabeçalhos
)

# Inclui as requisições da pasta /api/plots
app.include_router(plots_router, prefix="/api")

# Inclui as requisições do mapa
app.include_router(map_router, prefix="/map")

# app.include_router(test_router, prefix="/test")

@app.get("/")
async def root():
    return {"message": "Hello from FastAPI"}
