'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Building, Calendar, Edit, Shield, User as UserIcon, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type ProfileShape = {
  full_name: string;
  phone: string;
  department: string;
};

export default function Profil() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const { toast } = useToast();

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");

  // UX states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Pour le dirty-check (valeurs de référence)
  const initialRef = useRef<ProfileShape>({ full_name: "", phone: "", department: "" });

  // Charge (et initialise si besoin) le profil depuis la table `profiles`
  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);

      // 1) Lecture éventuelle
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone, department")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Erreur chargement profil (select):", error);
      }

      if (!cancelled) {
        if (data) {
          const next: ProfileShape = {
            full_name: data.full_name ?? "",
            phone: data.phone ?? "",
            department: data.department ?? "",
          };
          setFullName(next.full_name);
          setPhone(next.phone);
          setDepartment(next.department);
          initialRef.current = next; // baseline pour dirty-check
          setLoading(false);
        } else {
          // 2) Si pas de ligne → on crée la ligne et on relit tout de suite
          const { data: created, error: upsertError } = await supabase
            .from("profiles")
            .upsert(
              {
                id: user.id,
                full_name: "",
                phone: "",
                department: "",
                updated_at: new Date().toISOString(),
              },
              { onConflict: "id" }
            )
            .select("full_name, phone, department")
            .single();

          if (upsertError) {
            console.error("Erreur init profil (upsert):", upsertError);
            toast({
              title: "Erreur",
              description: upsertError.message || "Impossible d'initialiser le profil.",
              variant: "destructive",
            });
          } else if (created) {
            const next: ProfileShape = {
              full_name: created.full_name ?? "",
              phone: created.phone ?? "",
              department: created.department ?? "",
            };
            setFullName(next.full_name);
            setPhone(next.phone);
            setDepartment(next.department);
            initialRef.current = next; // baseline
          }
          setLoading(false);
        }
      }
    };

    fetchProfile();
    return () => { cancelled = true; };
  }, [user, supabase, toast]);

  // Dirty-check
  const dirty = useMemo(() => {
    const baseline = initialRef.current;
    return (
      (fullName ?? "") !== (baseline.full_name ?? "") ||
      (phone ?? "") !== (baseline.phone ?? "") ||
      (department ?? "") !== (baseline.department ?? "")
    );
  }, [fullName, phone, department]);

  const handleUpdate = async () => {
    if (!user || !dirty) return;
    setSaving(true);

    const payload = {
      id: user.id,
      full_name: fullName,
      phone,
      department,
      updated_at: new Date().toISOString(),
    };

    // .select().single() => force le retour et capte une éventuelle erreur RLS
    const { data, error, status } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "id" })
      .select("full_name, phone, department")
      .single();

    setSaving(false);

    if (error) {
      console.error("Erreur update profil (upsert):", { status, error });
      toast({
        title: "Échec de la mise à jour",
        description: error.message || "Vérifie les policies RLS et la configuration Supabase.",
        variant: "destructive",
      });
      return;
    }

    // Source de vérité retournée par Supabase
    if (data) {
      setFullName(data.full_name ?? "");
      setPhone(data.phone ?? "");
      setDepartment(data.department ?? "");
      initialRef.current = {
        full_name: data.full_name ?? "",
        phone: data.phone ?? "",
        department: data.department ?? "",
      };
    }

    // Feedback succès
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);

    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été enregistrées.",
    });
  };

  const initials = useMemo(() => {
    const base = (fullName?.trim() || user?.email || "?")
      .split(/[\s.@_]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(p => p[0]?.toUpperCase() || "");
    const joined = base.join("");
    return joined || "U";
  }, [fullName, user?.email]);

  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : "-";

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Profil utilisateur</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos informations personnelles et préférences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bloc Infos utilisateur */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                // Skeleton loader
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-10 bg-muted/50 rounded animate-pulse" />
                    <div className="h-10 bg-muted/50 rounded animate-pulse" />
                    <div className="h-10 bg-muted/50 rounded animate-pulse" />
                    <div className="h-10 bg-muted/50 rounded animate-pulse" />
                  </div>
                  <Separator />
                  <div className="flex justify-end">
                    <div className="h-10 w-36 bg-muted/50 rounded animate-pulse" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={saving}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Adresse e-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={saving}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Département</Label>
                      <Input
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        disabled={saving}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end">
                    <Button
                      onClick={handleUpdate}
                      disabled={!dirty || saving}
                      className={
                        justSaved && !saving
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : undefined
                      }
                    >
                      {saving ? (
                        "Enregistrement..."
                      ) : justSaved ? (
                        <span className="flex items-center gap-2">
                          <Check className="h-4 w-4" /> Enregistré
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Edit className="h-4 w-4" /> Mettre à jour
                        </span>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Carte profil */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="text-xl font-semibold">
                    {fullName || "Utilisateur"}
                  </h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>

                <Badge className="bg-primary text-primary-foreground">
                  <Shield className="h-3 w-3 mr-1" />
                  Utilisateur
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
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Téléphone</p>
                  <p className="text-xs text-muted-foreground">{phone || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Département</p>
                  <p className="text-xs text-muted-foreground">{department || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Créé le</p>
                  <p className="text-xs text-muted-foreground">{createdAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
