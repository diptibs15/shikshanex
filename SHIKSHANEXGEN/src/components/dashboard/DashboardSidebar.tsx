import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  BookOpen,
  GraduationCap,
  CreditCard,
  Award,
  Briefcase,
  FileText,
  FolderOpen,
  BarChart3,
  User,
  LogOut,
  Home,
  ClipboardCheck,
  Code,
  Settings,
  Users,
  Layers,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const studentMenuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: BookOpen, label: 'My Courses', href: '/dashboard/courses' },
  { icon: ClipboardCheck, label: 'Interview / Exam', href: '/dashboard/interview' },
  { icon: Building2, label: 'Placement Portal', href: '/dashboard/placement' },
  { icon: CreditCard, label: 'Payments', href: '/dashboard/payments' },
  { icon: Award, label: 'Certificates', href: '/dashboard/certificates' },
  { icon: Briefcase, label: 'Internship', href: '/dashboard/internship' },
  { icon: FileText, label: 'Resume Builder', href: '/dashboard/resume' },
  { icon: FolderOpen, label: 'Portfolio', href: '/dashboard/portfolio' },
  { icon: Code, label: 'Live Projects', href: '/dashboard/projects' },
  { icon: BarChart3, label: 'Progress Report', href: '/dashboard/progress' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
];

const adminMenuItems = [
  { icon: Home, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Students', href: '/admin/students' },
  { icon: Layers, label: 'Courses', href: '/admin/courses' },
  { icon: Code, label: 'Projects', href: '/admin/projects' },
  { icon: ClipboardCheck, label: 'Interviews', href: '/admin/interviews' },
  { icon: Briefcase, label: 'Employers', href: '/admin/employers' },
  { icon: Award, label: 'Certificates', href: '/admin/certificates' },
  { icon: CreditCard, label: 'Payments', href: '/admin/payments' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

interface DashboardSidebarProps {
  isAdmin?: boolean;
}

const DashboardSidebar = ({ isAdmin = false }: DashboardSidebarProps) => {
  const location = useLocation();
  const { signOut, profile } = useAuth();
  
  const menuItems = isAdmin ? adminMenuItems : studentMenuItems;

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-heading font-bold text-foreground">ShikshaNex</span>
            <span className="block text-xs text-muted-foreground">
              {isAdmin ? 'Admin Panel' : 'Student Portal'}
            </span>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">
              {profile?.full_name || 'Student'}
            </p>
            <p className="text-xs text-muted-foreground">
              {isAdmin ? 'Administrator' : 'Student'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={signOut}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
