from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from service.impl.plots_service import PlotService
from schemas.parameters import Parameters
from typing import List, Dict, Any

router = APIRouter()

class PlotResponse(BaseModel):
    data: List[Dict[str, Any]]

@router.post("/{plot_type}_plot", status_code=200, tags=["plots"], response_model=PlotResponse)
async def get_plot(plot_type: str, parameters: Parameters):
    print('ENTROU NA FUNCAO DATA')
    print('Parâmetros recebidos:', parameters)
    data = PlotService.get_plot_data(parameters)

    if data is None:
        raise HTTPException(status_code=404, detail="Data not found")

    return data
