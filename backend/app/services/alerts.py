import logging
from ..supabase_client import get_supabase

log = logging.getLogger("services.alerts")


async def insert_alerts(alerts: list[dict]) -> None:
    """Insère plusieurs alertes dans la table alerts."""
    if not alerts:
        return
    sb = get_supabase()
    res = sb.table("alerts").insert(alerts).execute()
    log.debug("alerts insert → %s", res.data)
