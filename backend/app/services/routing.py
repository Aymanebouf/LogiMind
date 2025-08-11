import httpx
import logging
from ..config import settings

log = logging.getLogger("services.routing")

ORS_BASE = "https://api.openrouteservice.org/v2/directions/driving-car"


async def get_travel_time_minutes(lat1: float, lon1: float, lat2: float, lon2: float) -> float | None:
    """
    Appelle OpenRouteService pour estimer la durée de trajet en minutes.
    Retourne None en cas d'erreur.
    """
    headers = {"Authorization": settings.ORS_API_KEY, "Content-Type": "application/json"}
    body = {"coordinates": [[lon1, lat1], [lon2, lat2]]}
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            r = await client.post(ORS_BASE, headers=headers, json=body)
            r.raise_for_status()
            data = r.json()
            seconds = data["features"][0]["properties"]["summary"]["duration"]
            minutes = round(seconds / 60, 1)
            log.debug("ORS minutes: %s", minutes)
            return minutes
    except Exception as e:
        log.warning("ORS failure: %s", e)
        return None
