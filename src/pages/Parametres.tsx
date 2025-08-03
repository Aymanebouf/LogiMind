import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/contexts/SettingsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Bell, 
  Globe, 
  Shield, 
  Palette, 
  Monitor,
  Mail,
  Smartphone,
  Save,
  RotateCcw,
  Sun,
  Moon,
  Laptop
} from "lucide-react";

export default function Parametres() {
  const { t } = useTranslation();
  const { settings, updateSetting } = useSettings();
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences ont été mises à jour avec succès.",
    });
    setHasChanges(false);
  };

  const handleReset = () => {
    // Réinitialiser aux valeurs par défaut
    updateSetting('theme', 'system');
    updateSetting('language', 'fr');
    updateSetting('dateFormat', 'dd/mm/yyyy');
    updateSetting('notifications', {
      realTime: true,
      reports: true,
      email: false,
      mobile: true,
    });
    updateSetting('defaultWarehouse', 'paris');
    updateSetting('defaultPeriod', '4-semaines');
    updateSetting('expertMode', false);
    
    toast({
      title: "Paramètres réinitialisés",
      description: "Tous les paramètres ont été remis aux valeurs par défaut.",
    });
    setHasChanges(false);
  };

  const updateNotification = (key: keyof typeof settings.notifications, value: boolean) => {
    updateSetting('notifications', { ...settings.notifications, [key]: value });
    setHasChanges(true);
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'light': return <Sun className="w-4 h-4" />;
      case 'dark': return <Moon className="w-4 h-4" />;
      case 'system': return <Laptop className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('parametresTitle')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('parametresSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              {t('notifications')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Alertes en temps réel</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir les alertes de rupture et retards
                  </p>
                </div>
                <Switch 
                  checked={settings.notifications.realTime}
                  onCheckedChange={(value) => updateNotification('realTime', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Rapports automatiques</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications pour nouveaux rapports IA
                  </p>
                </div>
                <Switch 
                  checked={settings.notifications.reports}
                  onCheckedChange={(value) => updateNotification('reports', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notifications e-mail</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir un résumé quotidien par e-mail
                  </p>
                </div>
                <Switch 
                  checked={settings.notifications.email}
                  onCheckedChange={(value) => updateNotification('email', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notifications mobiles</Label>
                  <p className="text-sm text-muted-foreground">
                    Push notifications sur mobile
                  </p>
                </div>
                <Switch 
                  checked={settings.notifications.mobile}
                  onCheckedChange={(value) => updateNotification('mobile', value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Apparence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              {t('apparence')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('theme')}</Label>
                <Select 
                  value={settings.theme} 
                  onValueChange={(value) => {
                    updateSetting('theme', value as any);
                    setHasChanges(true);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Clair
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        Sombre
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Laptop className="w-4 h-4" />
                        Système
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('langue')}</Label>
                <Select 
                  value={settings.language} 
                  onValueChange={(value) => {
                    updateSetting('language', value as any);
                    setHasChanges(true);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">🇫🇷 Français</SelectItem>
                    <SelectItem value="en">🇬🇧 English</SelectItem>
                    <SelectItem value="es">🇪🇸 Español</SelectItem>
                    <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('formatDate')}</Label>
                <Select 
                  value={settings.dateFormat} 
                  onValueChange={(value) => {
                    updateSetting('dateFormat', value as any);
                    setHasChanges(true);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {t('securite')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Authentification à deux facteurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Sécurité renforcée pour votre compte
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Historique des connexions</Label>
                  <p className="text-sm text-muted-foreground">
                    Enregistrer l'historique des sessions
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Changer le mot de passe
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Télécharger mes données
                </Button>
                <Button variant="destructive" className="w-full justify-start">
                  Supprimer mon compte
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Préférences métier */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              {t('preferencesMetier')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Entrepôt par défaut</Label>
                <Select 
                  value={settings.defaultWarehouse} 
                  onValueChange={(value) => {
                    updateSetting('defaultWarehouse', value);
                    setHasChanges(true);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paris">Entrepôt Paris</SelectItem>
                    <SelectItem value="lyon">Entrepôt Lyon</SelectItem>
                    <SelectItem value="marseille">Entrepôt Marseille</SelectItem>
                    <SelectItem value="lille">Entrepôt Lille</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Période d'analyse par défaut</Label>
                <Select 
                  value={settings.defaultPeriod} 
                  onValueChange={(value) => {
                    updateSetting('defaultPeriod', value);
                    setHasChanges(true);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-semaine">1 semaine</SelectItem>
                    <SelectItem value="4-semaines">4 semaines</SelectItem>
                    <SelectItem value="3-mois">3 mois</SelectItem>
                    <SelectItem value="12-mois">12 mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Mode expert</Label>
                  <p className="text-sm text-muted-foreground">
                    Afficher les métriques avancées
                  </p>
                </div>
                <Switch 
                  checked={settings.expertMode}
                  onCheckedChange={(value) => {
                    updateSetting('expertMode', value);
                    setHasChanges(true);
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Enregistrer les modifications</h3>
              <p className="text-sm text-muted-foreground">
                {hasChanges ? "Vous avez des modifications non sauvegardées" : "Tous les paramètres sont sauvegardés"}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                {t('reinitialiser')}
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!hasChanges}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {t('sauvegarder')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aperçu des paramètres appliqués */}
      <Card>
        <CardHeader>
          <CardTitle>Aperçu des paramètres appliqués</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <h4 className="font-semibold text-foreground flex items-center justify-center gap-2">
                {getThemeIcon(settings.theme)}
                Thème
              </h4>
              <Badge variant="secondary">{settings.theme}</Badge>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-foreground">Langue</h4>
              <Badge variant="secondary">{settings.language.toUpperCase()}</Badge>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-foreground">Format date</h4>
              <Badge variant="secondary">{settings.dateFormat}</Badge>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-foreground">Mode expert</h4>
              <Badge className={settings.expertMode ? "bg-success text-success-foreground" : ""}>
                {settings.expertMode ? "Activé" : "Désactivé"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}