import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir votre email et mot de passe",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const { error } = await login(email, password);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Échec de connexion",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Connexion réussie",
        description: `Bienvenue sur LogiMind !`,
      });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Logo et titre */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold text-2xl">L</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">LogiMind</h1>
            <p className="text-muted-foreground">Plateforme de gestion logistique intelligente</p>
          </div>
        </div>

        {/* Formulaire de connexion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-primary" />
              Connexion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Adresse e-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>© 2024 LogiMind. Tous droits réservés.</p>
          <p>Version 2.1.0 - Intelligence artificielle logistique</p>
        </div>
      </div>
    </div>
  );
}
