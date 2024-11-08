from fastapi import APIRouter, HTTPException
from service.impl.plots_service import PlotService
from schemas.parameters import Parameters

router = APIRouter()

@router.get("/{plot_type}_plot", status_code=200, tags=["plots"])
async def get_plot(plot_type: str, parameters: Parameters):
    print('ENTROU NA FUNCAO DATA')
    data = PlotService.get_plot_data(parameters)

    if data is None:
        raise HTTPException(status_code=404, detail="Data not found")

    return data
