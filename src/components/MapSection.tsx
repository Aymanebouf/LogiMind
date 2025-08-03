import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Truck, Package, AlertTriangle } from "lucide-react";

// Placeholder pour la carte Leaflet
export function MapSection() {
  const warehouses = [
    { id: 1, name: "Entrepôt Paris", lat: 48.8566, lng: 2.3522, status: "normal", orders: 45 },
    { id: 2, name: "Entrepôt Lyon", lat: 45.7640, lng: 4.8357, status: "delay", orders: 32 },
    { id: 3, name: "Entrepôt Marseille", lat: 43.2965, lng: 5.3698, status: "stockout", orders: 28 },
    { id: 4, name: "Entrepôt Lille", lat: 50.6292, lng: 3.0573, status: "normal", orders: 18 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-success";
      case "delay":
        return "bg-warning";
      case "stockout":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return <Badge className="bg-success text-success-foreground">Normal</Badge>;
      case "delay":
        return <Badge className="bg-warning text-warning-foreground">Retard</Badge>;
      case "stockout":
        return <Badge variant="destructive">Rupture</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <Package className="h-4 w-4 text-success" />;
      case "delay":
        return <Truck className="h-4 w-4 text-warning" />;
      case "stockout":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <MapPin className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Carte placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Carte des entrepôts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="text-center space-y-2">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Carte interactive Leaflet</p>
              <p className="text-xs text-muted-foreground">Intégration en cours...</p>
            </div>
            
            {/* Points simulés sur la carte */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-success rounded-full animate-pulse" />
              <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-warning rounded-full animate-pulse" />
              <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-destructive rounded-full animate-pulse" />
              <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-success rounded-full animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des entrepôts */}
      <Card>
        <CardHeader>
          <CardTitle>État des entrepôts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {warehouses.map((warehouse) => (
              <div key={warehouse.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(warehouse.status)}`} />
                  <div>
                    <h4 className="font-medium text-foreground">{warehouse.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {warehouse.orders} commandes en cours
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusIcon(warehouse.status)}
                  {getStatusBadge(warehouse.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Légende */}
      <Card>
        <CardHeader>
          <CardTitle>Légende</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full" />
              <span className="text-sm">Fonctionnement normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-warning rounded-full" />
              <span className="text-sm">Retards détectés</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-destructive rounded-full" />
              <span className="text-sm">Rupture de stock</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}