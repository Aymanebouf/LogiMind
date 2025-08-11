const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }
  return res.json() as Promise<T>;
}

export type KpisOverview = {
  active_warehouses: number;
  alerts_last_24h: number;
  on_time_delivery_rate?: number;     // ex: 0.93 ou 93.0
  avg_lead_time_hours?: number;
  logistics_cost_per_order?: number;
  monthly_revenue?: number;
};

export const Api = {
  health: () => http<{ status: string; service: string }>("/"),
  getAlerts: () => http<{ count: number; items: any[] }>("/read/alerts"),
  getKpisOverview: () => http<{ overview: KpisOverview }>("/read/kpis/overview"),
};
