import { 
  BarChart3, 
  TrendingUp, 
  Map, 
  FileText, 
  LogIn, 
  LogOut,
  Settings,
  User
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext"; // ✅ ajout auth

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isCollapsed = state === "collapsed";

  const { user, logout } = useAuth(); // ✅ récup auth

  const navigationItems = [
    { title: t('dashboard'), url: "/", icon: BarChart3 },
    { title: t('previsions'), url: "/previsions", icon: TrendingUp },
    { title: t('carteLogistique'), url: "/carte", icon: Map },
    { title: t('rapportIA'), url: "/rapport", icon: FileText },
  ];

  const userItems = [
    { title: t('profil'), url: "/profil", icon: User },
    { title: t('parametres'), url: "/parametres", icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    return isActive(path) 
      ? "bg-sidebar-accent text-sidebar-primary font-medium border-r-2 border-sidebar-primary" 
      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary";
  };

  const handleAuthClick = async () => {
    if (user) {
      await logout();
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        {/* Navigation principale */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-semibold uppercase tracking-wider px-4 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${getNavClassName(item.url)}`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="text-sm font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Section utilisateur */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-semibold uppercase tracking-wider px-4 py-2">
            Compte
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${getNavClassName(item.url)}`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="text-sm font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Bouton dynamique Connexion / Déconnexion */}
              <SidebarMenuItem key="auth-action">
                <SidebarMenuButton
                  className={`h-11 w-full text-left px-4 py-3 transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                    user ? "text-red-500 hover:bg-red-100/10" : getNavClassName("/login")
                  }`}
                  onClick={handleAuthClick}
                >
                  {user ? (
                    <>
                      <LogOut className="h-5 w-5" />
                      {!isCollapsed && <span className="text-sm font-medium">{t("deconnexion")}</span>}
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5" />
                      {!isCollapsed && <span className="text-sm font-medium">{t("connexion")}</span>}
                    </>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
