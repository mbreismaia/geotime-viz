from pydantic import BaseModel

class QueryED(BaseModel):
    r: list[float]
    depth_type: str
    variables: list[str]
    hour_interval: tuple[int, int]