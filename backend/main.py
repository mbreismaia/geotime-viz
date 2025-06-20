from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from service.pre_process_data import pre_process_data_func

# Routers existentes
from api.plots import router as plots_router 
from api.map import router as map_router

# Banco de dados
from api.database import Base, engine
from api.models import CurveModel

# Importando os modelos do frontend
from api.database_frontend import BaseFrontend, engine_frontend
from api.models_frontend import CurveFrontendModel

# Importando os modelos do mapa
from api.database_map import BaseMap, engine_map
from api.models_map import MapModel

# Cria as tabelas no banco (se ainda não existirem)
Base.metadata.create_all(bind=engine)
BaseMap.metadata.create_all(bind=engine_map)
BaseFrontend.metadata.create_all(bind=engine_frontend)

app = FastAPI()

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas da aplicação
app.include_router(plots_router, prefix="/api")
app.include_router(map_router, prefix="/map")

@app.get("/")
async def root():
    return {"message": "Hello from FastAPI"}

@app.on_event("startup")
async def startup_event():
    print("Running pre-processing at startup...")
    Base.metadata.create_all(bind=engine)
    BaseMap.metadata.create_all(bind=engine_map)
    BaseFrontend.metadata.create_all(bind=engine_frontend)
    
    pre_process_data_func()
