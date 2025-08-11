from pydantic import BaseModel


class IngestResult(BaseModel):
    warehouses_count: int
    alerts_created: int
    demand_points_added: int
    kpis_updated: int
