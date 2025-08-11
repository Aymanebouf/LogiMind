from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta, timezone
from app.supabase_client import supabase

router = APIRouter()

@router.get("/alerts")
def get_alerts(limit: int = 50):
    """
    Dernières alertes (par défaut 50), triées par date décroissante.
    Tables attendues: alerts(id, type, severity, title?, message, warehouse_id?, created_at)
    """
    try:
        res = supabase.table("alerts") \
            .select("*") \
            .order("created_at", desc=True) \
            .limit(limit) \
            .execute()
        return {"count": len(res.data), "items": res.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/kpis/overview")
def get_kpis_overview():
    """
    KPIs rapides pour le dashboard.
    - active_warehouses: count(warehouses)
    - alerts_last_24h: count(alerts created_at >= now-24h)
    - on_time_delivery_rate / avg_lead_time_hours / logistics_cost_per_order / monthly_revenue : si présents dans 'kpis' (dernier enregistrement)
    """
    try:
        # 1) Entrepôts actifs
        try:
            w = supabase.table("warehouses").select("id").execute()
            active_warehouses = len(w.data)
        except Exception:
            active_warehouses = 0

        # 2) Alertes dernières 24h
        try:
            since = (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat()
            a = supabase.table("alerts").select("id").gte("created_at", since).execute()
            alerts_last_24h = len(a.data)
        except Exception:
            alerts_last_24h = 0

        overview = {
            "active_warehouses": active_warehouses,
            "alerts_last_24h": alerts_last_24h,
        }

        # 3) Dernier enregistrement 'kpis' (si la table existe)
        try:
            k = supabase.table("kpis").select("*").order("date", desc=True).limit(1).execute()
            if k.data:
                last = k.data[0]
                overview["on_time_delivery_rate"] = last.get("on_time_delivery_rate")  # ex: 0.932 ou 93.2
                overview["avg_lead_time_hours"] = last.get("avg_lead_time_hours") or last.get("avg_eta_hours")
                overview["logistics_cost_per_order"] = last.get("logistics_cost_per_order") or last.get("avg_cost_per_order")
                overview["monthly_revenue"] = last.get("monthly_revenue")
        except Exception:
            pass

        return {"overview": overview}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
