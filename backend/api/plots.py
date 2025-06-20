from fastapi import APIRouter, HTTPException
from service.plots_service import PlotService
from schemas.parameters import Parameters
from pydantic import BaseModel
from typing import List, Dict, Any
import json

from api.database_frontend import SessionLocalFrontend
from api.database import SessionLocal

router = APIRouter()

class PlotResponse(BaseModel):
    data: List[Dict[str, Any]]

@router.post("/compute_ed", status_code=200, tags=["plots"])
async def compute_ed(parameters: Parameters):
    print('Parâmetros recebidos:', parameters)
    try:
        PlotService.get_plot_data(parameters)
        print('Dados do gráfico processados e salvos com sucesso')
        return {"status": "success", "message": "Plot data processed and saved to database."}
    except Exception as e:
        print(f"Erro ao processar gráfico: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/plot_data", status_code=200, tags=["plots"], response_model=PlotResponse)
async def fetch_plot_data(
    parameters: Parameters,
):
    """
    Retorna os dados já processados e salvos no banco de dados.
    """
    print('Parâmetros recebidos para busca de dados do gráfico:', parameters)
    try:
        with SessionLocalFrontend() as db:
            C = PlotService.read_data_from_frontend_db(db, parameters)

        data = []
        for curve in C:
            data.append(curve.to_dict())

        return {"status": "success", "data": data}
    except Exception as e:
        print(f"Erro ao buscar dados do gráfico: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/available_variables", tags=["files"])
def get_available_variables():
    try:
        with open('./db/files.json', 'r') as f:
            files_data = json.load(f)
        return {"status": "success", "variables": files_data.get("variables", [])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading variables: {e}")
    
@router.get("/date-interval", status_code=200, tags = ["files"])
def get_date_interval():
    print("Fetching date interval from the database")
    with SessionLocal() as db:
        return PlotService.get_min_max_dates(db)