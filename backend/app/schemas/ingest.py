from pydantic import BaseModel, Field


class IngestResult(BaseModel):
    """Réponse renvoyée par /integrations/ingest."""

    warehouses_count: int = Field(
        ...,
        description="Nombre d'entrepôts lus depuis Supabase",
        ge=0,
    )
    alerts_created: int = Field(
        ...,
        description="Nombre d'alertes insérées",
        ge=0,
    )
    demand_points_added: int = Field(
        ...,
        description="Nombre de points de demande ajoutés",
        ge=0,
    )
    kpis_updated: int = Field(
        ...,
        description="Nombre de KPI mis à jour",
        ge=0,
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "warehouses_count": 3,
                "alerts_created": 2,
                "demand_points_added": 3,
                "kpis_updated": 2,
            }
        }
    }
