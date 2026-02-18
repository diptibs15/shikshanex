import { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Loader2, 
  Building2, 
  Briefcase, 
  Users, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  Menu,
  X,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import logo from '@/assets/shiksha-nex-logo.png';

interface EmployerData {
  id: string;
  company_name: string;
  is_verified: boolean;
}

const EmployerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employer, setEmployer] = useState<EmployerData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkEmployerStatus = async () => {
      if (!user) {
        navigate('/employer/auth');
        return;
      }

      const { data, error } = await supabase
        .from('employers')
        .select('id, company_name, is_verified')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching employer:', error);
      }

      if (!data) {
        // No employer profile, redirect to registration
        navigate('/employer/register');
        return;
      }

      setEmployer(data);
      setLoading(false);
    };

    checkEmployerStatus();
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/employer/auth');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/employer' },
    { icon: Briefcase, label: 'Job Postings', path: '/employer/jobs' },
    { icon: Users, label: 'Candidates', path: '/employer/candidates' },
    { icon: Building2, label: 'Company Profile', path: '/employer/company' },
    { icon: FileText, label: 'Documents', path: '/employer/documents' },
    { icon: Settings, label: 'Settings', path: '/employer/settings' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Shiksha Nex" className="h-10 w-auto" />
          </Link>
        </div>

        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{employer?.company_name}</p>
              <p className={cn(
                "text-xs",
                employer?.is_verified ? "text-green-600" : "text-amber-600"
              )}>
                {employer?.is_verified ? '✓ Verified' : '⏳ Pending Verification'}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-muted-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card transform transition-transform duration-300 lg:hidden",
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Shiksha Nex" className="h-8 w-auto" />
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{employer?.company_name}</p>
              <p className={cn(
                "text-xs",
                employer?.is_verified ? "text-green-600" : "text-amber-600"
              )}>
                {employer?.is_verified ? '✓ Verified' : '⏳ Pending'}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-muted-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center px-4 gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Employer Portal</h1>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet context={{ employer }} />
        </main>
      </div>
    </div>
  );
};

export default EmployerLayout;
