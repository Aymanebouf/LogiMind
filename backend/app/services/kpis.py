import logging
from ..supabase_client import get_supabase

log = logging.getLogger("services.kpis")


async def upsert_kpi(name: str, value: float, change: float = 0.0, trend: str = "flat") -> None:
    """
    Upsert dans table kpis(name unique) avec colonnes: value, change, trend, updated_at.
    """
    sb = get_supabase()
    # upsert avec on_conflict sur 'name'
    res = sb.table("kpis").upsert(
        {"name": name, "value": value, "change": change, "trend": trend},
        on_conflict="name",
        ignore_duplicates=False,
    ).execute()
    log.debug("KPI upsert %s → %s", name, res.data)


async def add_demand_point(value: float) -> None:
    """Insère un point de demande dans demand_points (ts=now par défaut)."""
    sb = get_supabase()
    res = sb.table("demand_points").insert({"value": value}).execute()
    log.debug("demand point insert → %s", res.data)
