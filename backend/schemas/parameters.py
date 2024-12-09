from pydantic import BaseModel

class Parameters(BaseModel):
    plot: str = "line"
    runED: bool = True
    zones: list[str] = []
    variables: list[str] = ["values", "prices", "distances", "total_time"]
    hour_interval: tuple[int, int]
    date_interval: tuple[str, str]
    coloring_method: str = "Month"
    depth_type: str = "L2"
    dim_reduction_technique: str = "UMAP"
    reference_point: str = "origin"
    days_of_week: list[str] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


