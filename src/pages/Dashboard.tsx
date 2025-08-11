import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/contexts/SettingsContext";
import { MetricCard } from "@/components/MetricCard";
import { ChartWrapper } from "@/components/ChartWrapper";
import { AlertItem, Alert } from "@/components/AlertItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, Bell, Building, Clock } from "lucide-react";
import { Api, KpisOverview } from "@/lib/api";

// ⚠️ Temporaire: on garde un petit jeu de données statique pour le graphique.
// Étape suivante: on le rendra dynamique depuis le backend (read/demand/series).
const demandDataStatic = [
  { name: "Jan", demande: 120 },
  { name: "Fév", demande: 132 },
  { name: "Mar", demande: 101 },
  { name: "Avr", demande: 134 },
  { name: "Mai", demande: 90 },
  { name: "Jun", demande: 145 },
  { name: "Jul", demande: 160 },
];

export default function Dashboard() {
  const { t } = useTranslation();
  const { formatDate } = useSettings();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [overview, setOverview] = useState<KpisOverview | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [ovRes, alRes] = await Promise.all([
          Api.getKpisOverview(),
          Api.getAlerts(),
        ]);

        if (!mounted) return;

        // 1) KPIs overview
        setOverview(ovRes.overview);

        // 2) Map alerts du backend -> type Alert du composant
        const mappedAlerts: Alert[] = (alRes.items || []).map((a: any) => {
          const sev = (a.severity || "").toString().toLowerCase();
          const priority: "high" | "medium" | "low" =
            sev === "critical" || sev === "high"
              ? "high"
              : sev === "medium"
              ? "medium"
              : "low";

          const at = a.created_at ? new Date(a.created_at) : new Date();
          const title =
            a.title ||
            (a.type ? a.type.toString() : "Alerte") +
              (a.warehouse_name ? ` · ${a.warehouse_name}` : "");

          return {
            id: String(a.id ?? crypto.randomUUID()),
            type: (a.type as any) || "warning",
            title,
            description: a.message || a.description || "",
            priority,
            timestamp: formatDate(at),
          };
        });

        setAlerts(mappedAlerts);
        setErr(null);
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [formatDate]);

  // Helpers d'affichage
  const fmtPercent = (p?: number) => {
    if (p === null || p === undefined) return "—";
    // si la valeur est 0..1 -> convertir en %
    const val = p <= 1 ? p * 100 : p;
    return `${val.toFixed(1)}%`;
  };
  const fmtEuro = (n?: number) => {
    if (n === null || n === undefined) return "—";
    try {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
      }).format(n);
    } catch {
      return `${n}`;
    }
  };

  const metricCards = useMemo(
    () => [
      {
        title: "Entrepôts actifs",
        value: overview?.active_warehouses?.toString() ?? "0",
        change: "",
        trend: "up" as const,
        icon: Building,
      },
      {
        title: "Alertes (24h)",
        value: overview?.alerts_last_24h?.toString() ?? "0",
        change: "",
        trend: "down" as const, // moins, c'est mieux
        icon: Bell,
      },
      {
        title: "Livraisons à l'heure",
        value: fmtPercent(overview?.on_time_delivery_rate),
        change: "",
        trend: "up" as const,
        icon: Clock,
      },
      // Si tu préfères ce KPI à la place de "Livraisons à l'heure", remplace la carte ci-dessus par celle-ci :
      // {
      //   title: "Coût log. / commande",
      //   value: fmtEuro(overview?.logistics_cost_per_order),
      //   change: "",
      //   trend: "down" as const,
      //   icon: DollarSign,
      // },
    ],
    [overview]
  );

  return (
    <div className="space-y-6 p-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("dashboardTitle")}
        </h1>
        <p className="text-muted-foreground mt-2">{t("dashboardSubtitle")}</p>
      </div>

      {/* États de chargement / erreur */}
      {loading && (
        <div className="text-muted-foreground">Chargement des données…</div>
      )}
      {err && <div className="text-red-500">Erreur: {err}</div>}

      {/* Métriques principales (dynamiques) */}
      {!loading && !err && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metricCards.map((m, idx) => (
            <MetricCard
              key={idx}
              title={m.title}
              value={m.value}
              change={m.change}
              trend={m.trend}
              icon={m.icon}
            />
          ))}
        </div>
      )}

      {/* Graphiques et alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique évolution demande (temporairement statique) */}
        <ChartWrapper title={t("evolutionDemande")} data={demandDataStatic} type="demand" />

        {/* Alertes récentes (dynamiques) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              {t("alertesRecentes")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-muted-foreground">Chargement…</div>
            ) : (
              <div className="space-y-4">
                {alerts.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Aucune alerte récente.
                  </div>
                ) : (
                  alerts.map((alert) => <AlertItem key={alert.id} alert={alert} />)
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Résumé performance (statique pour l'instant) */}
      <Card>
        <CardHeader>
          <CardTitle>{t("resumePerformances")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-success">98.2%</h3>
              <p className="text-sm text-muted-foreground">{t("tauxLivraison")}</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary">24.5h</h3>
              <p className="text-sm text-muted-foreground">{t("delaiMoyen")}</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-accent">4.2M€</h3>
              <p className="text-sm text-muted-foreground">{t("caMensuel")}</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-warning">
                {overview?.active_warehouses ?? 0}
              </h3>
              <p className="text-sm text-muted-foreground">{t("entrepotsActifs")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
