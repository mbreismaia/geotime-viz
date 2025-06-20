from pydantic import BaseModel

class Parameters(BaseModel):
    plot: str = "line"
    runED: bool = True
    zones: list[str] = []
    resolution: int = 24
    variables: list[str] = []
    hour_interval: tuple[int, int]
    date_interval: tuple[str, str]
    coloring_method: str = "Month"
    depth_type: str = "L2"
    dim_reduction_technique: str = "UMAP"
    reference_point: str = "origin"
    days_of_week: list[str] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


