import { useState } from "react";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  ClipboardCheck, 
  BarChart3, 
  Settings, 
  User,
  Menu,
  X,
  Flame,
  ChefHat,
  LogOut,
  FileSpreadsheet,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Team", href: "/team", icon: Users },
  { name: "Shifts", href: "/shifts", icon: Calendar },
  { name: "Checklists", href: "/checklists", icon: ClipboardCheck },
  { name: "Setup Sheets", href: "/setup-sheets", icon: FileSpreadsheet },
  { name: "Training", href: "/training", icon: GraduationCap },
  { name: "Q-Cash", href: "/qcash", icon: Flame },
  { name: "Profiles", href: "/profiles", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, profile, store, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-smoke">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // If no user session, redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If user exists but no profile, show message to contact admin
  if (user && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-smoke">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mx-auto">
            <Users className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold">Profile Setup Required</h2>
          <p className="text-muted-foreground">
            Your account needs to be associated with a restaurant profile. Please contact your manager or sign up to create a new restaurant.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={signOut} variant="outline">
              Sign Out
            </Button>
            <Button onClick={() => window.location.href = '/auth'}>
              Switch Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check if user needs onboarding - check for incomplete store setup
  if (user && profile && store && (store.name === 'My Restaurant' || !store.address)) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-smoke">
      {/* Mobile sidebar */}
      <div className={`lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 flex z-40">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-card border-r border-border">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="text-foreground/60"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <SidebarContent />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-card border-r border-border">
          <SidebarContent />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-1 flex-col">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-primary" />
              <span className="font-bbq font-semibold text-lg">{store?.name || "Qdaddy's Crew"}</span>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent() {
  const location = useLocation();
  const { profile, store, signOut } = useAuth();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-fire rounded-lg">
            <ChefHat className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bbq font-bold text-lg text-foreground">Qdaddy's Crew</h1>
            <p className="text-xs text-muted-foreground">{store?.name || "BBQ Team Management"}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-bbq' 
                  : 'text-foreground hover:bg-muted hover:text-foreground'
                }
              `}
            >
              <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-secondary rounded-full">
              <span className="text-sm font-medium text-secondary-foreground">
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-foreground">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {profile?.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}