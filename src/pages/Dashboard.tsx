import { useTranslation } from "react-i18next";
import { useSettings } from "@/contexts/SettingsContext";
import { MetricCard } from "@/components/MetricCard";
import { ChartWrapper } from "@/components/ChartWrapper";
import { AlertItem, Alert } from "@/components/AlertItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingDown, DollarSign, Bell } from "lucide-react";

const demandData = [
  { name: "Jan", demande: 120 },
  { name: "Fév", demande: 132 },
  { name: "Mar", demande: 101 },
  { name: "Avr", demande: 134 },
  { name: "Mai", demande: 90 },
  { name: "Jun", demande: 145 },
  { name: "Jul", demande: 160 },
];

const alerts: Alert[] = [
  {
    id: "1",
    type: "delay",
    title: "Retard livraison Paris",
    description: "Livraison prévue avec 2h de retard sur la zone Nord",
    priority: "high",
    timestamp: "Il y a 5 minutes"
  },
  {
    id: "2",
    type: "stockout",
    title: "Rupture stock Lyon",
    description: "Produit SKU-001 en rupture, réapprovisionnement urgent",
    priority: "high",
    timestamp: "Il y a 15 minutes"
  },
  {
    id: "3",
    type: "warning",
    title: "Seuil critique Marseille",
    description: "Stock produit SKU-045 sous le seuil de sécurité",
    priority: "medium",
    timestamp: "Il y a 1 heure"
  },
];

export default function Dashboard() {
  const { t } = useTranslation();
  const { formatDate } = useSettings();

  return (
    <div className="space-y-6 p-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('dashboardTitle')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('dashboardSubtitle')}
        </p>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title={t('commandesEnCours')}
          value="1,247"
          change="+12%"
          trend="up"
          icon={Package}
        />
        <MetricCard
          title={t('tauxRupture')}
          value="2.4%"
          change="-0.8%"
          trend="down"
          icon={TrendingDown}
        />
        <MetricCard
          title={t('coutLogistique')}
          value="€34.50"
          change="+€2.10"
          trend="up"
          icon={DollarSign}
        />
      </div>

      {/* Graphiques et alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique évolution demande */}
        <ChartWrapper
          title={t('evolutionDemande')}
          data={demandData}
          type="demand"
        />

        {/* Alertes récentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              {t('alertesRecentes')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Résumé performance */}
      <Card>
        <CardHeader>
          <CardTitle>{t('resumePerformances')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-success">98.2%</h3>
              <p className="text-sm text-muted-foreground">{t('tauxLivraison')}</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary">24.5h</h3>
              <p className="text-sm text-muted-foreground">{t('delaiMoyen')}</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-accent">4.2M€</h3>
              <p className="text-sm text-muted-foreground">{t('caMensuel')}</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-warning">127</h3>
              <p className="text-sm text-muted-foreground">{t('entrepotsActifs')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}