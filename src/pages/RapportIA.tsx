import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles, CheckCircle, AlertCircle, Calendar } from "lucide-react";

export default function RapportIA() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(true); // Simulation d'un rapport déjà généré

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulation d'un appel API
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 3000);
  };

  const sampleReport = `RAPPORT MENSUEL LOGISTIQUE - DÉCEMBRE 2024

SYNTHÈSE EXÉCUTIVE
Le mois de décembre a montré une performance globale positive avec une augmentation de 12% du volume traité par rapport au mois précédent. Les pics de demande liés aux fêtes de fin d'année ont été bien anticipés grâce aux modèles prédictifs.

POINTS CLÉS
• Volume total traité : 156,720 commandes (+12% vs Nov)
• Taux de livraison dans les délais : 98.2% (+1.4% vs Nov)
• Coût moyen par livraison : €34.50 (+6.1% vs Nov)
• Taux de rupture stock : 2.4% (-0.8% vs Nov)

ANALYSE DÉTAILLÉE
Les entrepôts de Paris et Lyon ont affiché les meilleures performances avec des taux de livraison supérieurs à 99%. L'entrepôt de Marseille a connu quelques difficultés dues à des grèves temporaires mais a maintenu un niveau acceptable.

RECOMMANDATIONS STRATÉGIQUES
1. Renforcer les stocks tampons sur les SKU critiques
2. Optimiser les routes de livraison zone Sud
3. Investir dans l'automatisation entrepôt Lille
4. Réviser les partenariats transporteurs régionaux

PRÉVISIONS JANVIER 2025
Diminution attendue de 15% du volume post-fêtes. Opportunité d'optimiser les coûts et préparer la montée en charge du T1.`;

  const recommendations = [
    {
      id: 1,
      title: "Optimisation des stocks",
      description: "Réduire les stocks dormants de 15% tout en maintenant le service client",
      priority: "high",
      impact: "€2.3M économisé"
    },
    {
      id: 2,
      title: "Routes de livraison",
      description: "Revoir le routage zone Sud pour améliorer les délais de 8%",
      priority: "medium",
      impact: "Satisfaction +12%"
    },
    {
      id: 3,
      title: "Automatisation entrepôt",
      description: "Investir dans des solutions robotiques pour l'entrepôt de Lille",
      priority: "low",
      impact: "Productivité +25%"
    }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Haute</Badge>;
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">Moyenne</Badge>;
      case "low":
        return <Badge variant="secondary">Faible</Badge>;
      default:
        return <Badge variant="secondary">Inconnue</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Rapport IA</h1>
        <p className="text-muted-foreground mt-2">
          Rapport mensuel automatisé généré par l'intelligence artificielle
        </p>
      </div>

      {/* Génération du rapport */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Génération automatique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-foreground">
                Dernier rapport généré : <span className="font-medium">15 Décembre 2024</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Le prochain rapport sera automatiquement généré le 15 Janvier 2025
              </p>
            </div>
            <Button 
              onClick={handleGenerateReport} 
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              {isGenerating ? "Génération en cours..." : "Générer le rapport"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résumé IA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Résumé IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <h4 className="font-semibold text-success mb-2">Points positifs</h4>
                <ul className="text-sm space-y-1 text-foreground">
                  <li>• Performance en hausse de 12%</li>
                  <li>• Taux de livraison excellent (98.2%)</li>
                  <li>• Prédictions précises sur les pics</li>
                </ul>
              </div>
              <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                <h4 className="font-semibold text-warning mb-2">Points d'attention</h4>
                <ul className="text-sm space-y-1 text-foreground">
                  <li>• Augmentation coûts (+6.1%)</li>
                  <li>• Difficultés temporaires Marseille</li>
                  <li>• Optimisation routes Sud nécessaire</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Recommandations IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-3 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-foreground">{rec.title}</h4>
                    {getPriorityBadge(rec.priority)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                  <p className="text-xs font-medium text-primary">{rec.impact}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rapport complet */}
      {reportGenerated && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Rapport mensuel complet
              <Badge variant="secondary" className="ml-2">
                <Calendar className="h-3 w-3 mr-1" />
                Décembre 2024
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={sampleReport}
              readOnly
              className="min-h-[400px] font-mono text-sm resize-none"
              placeholder="Le rapport apparaîtra ici une fois généré..."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}