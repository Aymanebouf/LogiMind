import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

// Définition des types du contexte
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook pour l'utiliser facilement
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupération de la session active au démarrage
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
      setLoading(false);
    };
    getSession();

    // Écoute des changements (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Méthodes
  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  };

  const signup = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message || null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value: AuthContextType = { user, session, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
