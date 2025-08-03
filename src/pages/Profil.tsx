import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Building, Calendar, Edit, Shield } from "lucide-react";

export default function Profil() {
  const userInfo = {
    name: "Jean Dupont",
    email: "jean.dupont@logimind.com",
    phone: "+33 1 23 45 67 89",
    role: "Administrateur",
    department: "Logistique",
    joinDate: "15 Mars 2023",
    lastLogin: "Aujourd'hui à 14:30"
  };

  return (
    <div className="space-y-6 p-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profil utilisateur</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos informations personnelles et préférences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input id="name" defaultValue={userInfo.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse e-mail</Label>
                  <Input id="email" type="email" defaultValue={userInfo.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" defaultValue={userInfo.phone} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Département</Label>
                  <Input id="department" defaultValue={userInfo.department} />
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Mettre à jour
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques d'activité */}
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-primary">247</h3>
                  <p className="text-sm text-muted-foreground">Rapports consultés</p>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-success">18</h3>
                  <p className="text-sm text-muted-foreground">Prévisions lancées</p>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-accent">92%</h3>
                  <p className="text-sm text-muted-foreground">Taux de connexion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profil sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{userInfo.name}</h3>
                  <p className="text-muted-foreground">{userInfo.email}</p>
                </div>
                <Badge className="bg-primary text-primary-foreground">
                  <Shield className="h-3 w-3 mr-1" />
                  {userInfo.role}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">E-mail</p>
                  <p className="text-xs text-muted-foreground">{userInfo.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Téléphone</p>
                  <p className="text-xs text-muted-foreground">{userInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Département</p>
                  <p className="text-xs text-muted-foreground">{userInfo.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Membre depuis</p>
                  <p className="text-xs text-muted-foreground">{userInfo.joinDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}