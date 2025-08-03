import { useState } from "react";
import { ChartWrapper } from "@/components/ChartWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Play, Calendar, Package, Building } from "lucide-react";

const forecastData = [
  { name: "Sem 1", reel: 120, predit: 118 },
  { name: "Sem 2", reel: 132, predit: 135 },
  { name: "Sem 3", reel: 101, predit: 98 },
  { name: "Sem 4", reel: 134, predit: 140 },
  { name: "Sem 5", reel: null, predit: 145 },
  { name: "Sem 6", reel: null, predit: 152 },
  { name: "Sem 7", reel: null, predit: 139 },
];

const predictionData = [
  { periode: "Semaine 5", produit: "SKU-001", entrepot: "Paris", predit: 145, confiance: 92 },
  { periode: "Semaine 5", produit: "SKU-002", entrepot: "Lyon", predit: 89, confiance: 87 },
  { periode: "Semaine 6", produit: "SKU-001", entrepot: "Paris", predit: 152, confiance: 89 },
  { periode: "Semaine 6", produit: "SKU-003", entrepot: "Marseille", predit: 76, confiance: 94 },
  { periode: "Semaine 7", produit: "SKU-002", entrepot: "Lyon", predit: 139, confiance: 85 },
];

export default function Previsions() {
  const [selectedProduct, setSelectedProduct] = useState("SKU-001");
  const [selectedWarehouse, setSelectedWarehouse] = useState("Paris");
  const [selectedPeriod, setSelectedPeriod] = useState("4-semaines");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateForecast = () => {
    setIsLoading(true);
    // Simulation d'un appel API
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) return <Badge className="bg-success text-success-foreground">Haute</Badge>;
    if (confidence >= 80) return <Badge className="bg-warning text-warning-foreground">Moyenne</Badge>;
    return <Badge variant="destructive">Faible</Badge>;
  };

  return (
    <div className="space-y-6 p-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Prévisions de demande</h1>
        <p className="text-muted-foreground mt-2">
          Analysez et prédisez la demande future grâce à l'intelligence artificielle
        </p>
      </div>

      {/* Sélecteurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Paramètres de prévision
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Package className="h-4 w-4" />
                Produit
              </label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un produit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SKU-001">SKU-001 - Laptop Pro</SelectItem>
                  <SelectItem value="SKU-002">SKU-002 - Smartphone X</SelectItem>
                  <SelectItem value="SKU-003">SKU-003 - Tablet Ultra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Building className="h-4 w-4" />
                Entrepôt
              </label>
              <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un entrepôt" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paris">Entrepôt Paris</SelectItem>
                  <SelectItem value="Lyon">Entrepôt Lyon</SelectItem>
                  <SelectItem value="Marseille">Entrepôt Marseille</SelectItem>
                  <SelectItem value="Lille">Entrepôt Lille</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Période
              </label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-semaines">2 semaines</SelectItem>
                  <SelectItem value="4-semaines">4 semaines</SelectItem>
                  <SelectItem value="8-semaines">8 semaines</SelectItem>
                  <SelectItem value="12-semaines">12 semaines</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground opacity-0">Action</label>
              <Button 
                onClick={handleGenerateForecast} 
                disabled={isLoading}
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                {isLoading ? "Génération..." : "Lancer la prévision"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Graphique prévisions */}
      <ChartWrapper
        title={`Prévisions vs Réel - ${selectedProduct} (${selectedWarehouse})`}
        data={forecastData}
        type="forecast"
      />

      {/* Tableau des prédictions */}
      <Card>
        <CardHeader>
          <CardTitle>Données prédites détaillées</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Période</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Entrepôt</TableHead>
                <TableHead>Demande prédite</TableHead>
                <TableHead>Confiance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictionData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.periode}</TableCell>
                  <TableCell>{row.produit}</TableCell>
                  <TableCell>{row.entrepot}</TableCell>
                  <TableCell>{row.predit} unités</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{row.confiance}%</span>
                      {getConfidenceBadge(row.confiance)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Métriques de précision */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-success">94.2%</h3>
              <p className="text-sm text-muted-foreground">Précision moyenne</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary">±8.5</h3>
              <p className="text-sm text-muted-foreground">Erreur moyenne</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-accent">7 jours</h3>
              <p className="text-sm text-muted-foreground">Horizon prédiction</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}