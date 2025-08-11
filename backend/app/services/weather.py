import httpx
import logging
from ..config import settings

log = logging.getLogger("services.weather")

OWM_BASE = "https://api.openweathermap.org/data/2.5/weather"


async def get_current_weather(lat: float, lon: float) -> dict:
    """Retourne la météo actuelle (JSON brut OWM)."""
    params = {
        "lat": lat,
        "lon": lon,
        "appid": settings.OWM_API_KEY,
        "units": "metric",
        "lang": "fr",
    }
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.get(OWM_BASE, params=params)
        r.raise_for_status()
        data = r.json()
        log.debug("OWM data: %s", data)
        return data


def derive_weather_alerts(name: str, weather: dict) -> list[dict]:
    """
    Traduit des conditions météo en alertes "métier".
    Retourne une liste d'alertes à insérer dans la table alerts.
    """
    alerts: list[dict] = []
    main = weather.get("weather", [{}])[0].get("main", "")
    desc = weather.get("weather", [{}])[0].get("description", "")
    wind = weather.get("wind", {}).get("speed", 0.0)
    rain_1h = weather.get("rain", {}).get("1h", 0.0)
    temp = weather.get("main", {}).get("temp", None)

    if rain_1h and rain_1h >= 2:  # forte pluie
        alerts.append({
            "type": "weather",
            "title": f"Pluie forte près de {name}",
            "description": f"Précipitations {rain_1h} mm/h — risque de retard.",
            "priority": "high",
        })
    elif main.lower() in {"rain", "drizzle"}:
        alerts.append({
            "type": "weather",
            "title": f"Pluie à {name}",
            "description": f"{desc.capitalize()} — ralentissements possibles.",
            "priority": "medium",
        })

    if wind and wind >= 12:  # ~43 km/h
        alerts.append({
            "type": "weather",
            "title": f"Vent fort à {name}",
            "description": f"Rafales {wind} m/s — prudence sur les trajets.",
            "priority": "high",
        })

    if temp is not None and (temp <= 0 or temp >= 40):
        alerts.append({
            "type": "weather",
            "title": f"Température extrême à {name}",
            "description": f"{temp}°C — impact possible sur la chaîne du froid.",
            "priority": "medium",
        })

    return alerts
