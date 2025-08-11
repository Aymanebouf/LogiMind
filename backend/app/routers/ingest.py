import logging
from fastapi import APIRouter
from app.supabase_client import get_supabase
from app.services.weather import get_current_weather, derive_weather_alerts
from app.services.routing import get_travel_time_minutes
from app.services.kpis import upsert_kpi, add_demand_point
from app.services.alerts import insert_alerts
from app.schemas.ingest import IngestResult

router = APIRouter(prefix="/integrations", tags=["integrations"])
log = logging.getLogger("routers.ingest")


@router.post("/ingest", response_model=IngestResult)
async def ingest():
    """
    1) Lit les entrepôts (warehouses) dans Supabase
    2) Pour chaque entrepôt : météo OWM -> alertes météo
    3) Calcule un temps de trajet entre 2 hubs (si au moins 2) -> met à jour un KPI
    4) Ajoute un point de demande (ex: moyenne des températures * facteur) -> simple démo
    """
    sb = get_supabase()

    # 1) Warehouses
    wh = sb.table("warehouses").select("id,name,lat,lon").execute()
    warehouses = wh.data or []
    alerts_to_add: list[dict] = []
    demand_points_added = 0
    kpis_updated = 0

    # 2) Weather per warehouse
    for w in warehouses:
        weather = await get_current_weather(w["lat"], w["lon"])
        alerts = derive_weather_alerts(w["name"], weather)
        for a in alerts:
            a["type"] = a.get("type", "weather")
        alerts_to_add.extend(alerts)

        # Démo: génère un point de demande à partir de la température (si disponible)
        temp = weather.get("main", {}).get("temp")
        if temp is not None:
            # valeur de demande arbitraire: 100 + temp * 1.2 (juste pour voir bouger)
            val = round(100 + float(temp) * 1.2, 2)
            await add_demand_point(val)
            demand_points_added += 1

    # 3) ORS routing entre les 2 premiers hubs (si présents)
    if len(warehouses) >= 2:
        w1, w2 = warehouses[0], warehouses[1]
        minutes = await get_travel_time_minutes(w1["lat"], w1["lon"], w2["lat"], w2["lon"])
        if minutes is not None:
            # on utilise le KPI "avg_logistics_cost" comme "ETA (min)" dans la démo
            await upsert_kpi("avg_logistics_cost", float(minutes), change=0.0, trend="flat")
            kpis_updated += 1

    # 4) Insert alerts
    await insert_alerts(alerts_to_add)

    # 5) KPI "orders_in_progress": pour la démo, on l'augmente légèrement
    await upsert_kpi("orders_in_progress", 1247, change=+0.5, trend="up")
    kpis_updated += 1

    # KPI "stockout_rate": démo légère
    await upsert_kpi("stockout_rate", 2.4, change=-0.1, trend="down")
    kpis_updated += 1

    return IngestResult(
        warehouses_count=len(warehouses),
        alerts_created=len(alerts_to_add),
        demand_points_added=demand_points_added,
        kpis_updated=kpis_updated,
    )
