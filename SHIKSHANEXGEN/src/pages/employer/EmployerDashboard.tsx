import { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Users, 
  Eye, 
  Clock, 
  Plus,
  AlertCircle,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
}

interface RecentApplication {
  id: string;
  applied_at: string;
  status: string;
  job: {
    title: string;
  };
  profile: {
    full_name: string;
  } | null;
}

const EmployerDashboard = () => {
  const { employer } = useOutletContext<{ employer: { id: string; company_name: string; is_verified: boolean } }>();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!employer?.id) return;

      try {
        // Fetch jobs count
        const { data: jobs, error: jobsError } = await supabase
          .from('jobs')
          .select('id, is_active')
          .eq('employer_id', employer.id);

        if (jobsError) throw jobsError;

        const totalJobs = jobs?.length || 0;
        const activeJobs = jobs?.filter(j => j.is_active).length || 0;

        // Fetch applications for this employer's jobs
        const jobIds = jobs?.map(j => j.id) || [];
        
        let totalApplications = 0;
        let pendingApplications = 0;
        let applications: any[] = [];

        if (jobIds.length > 0) {
          const { data: appData, error: appError } = await supabase
            .from('job_applications')
            .select(`
              id,
              applied_at,
              status,
              user_id,
              job:jobs!inner(title)
            `)
            .in('job_id', jobIds)
            .order('applied_at', { ascending: false })
            .limit(5);

          if (appError) throw appError;

          applications = appData || [];
          totalApplications = applications.length;
          pendingApplications = applications.filter(a => a.status === 'applied').length;

          // Fetch profile names for applications
          const userIds = applications.map(a => a.user_id);
          if (userIds.length > 0) {
            const { data: profiles } = await supabase
              .from('profiles')
              .select('user_id, full_name')
              .in('user_id', userIds);

            applications = applications.map(app => ({
              ...app,
              profile: profiles?.find(p => p.user_id === app.user_id) || null
            }));
          }
        }

        setStats({
          totalJobs,
          activeJobs,
          totalApplications,
          pendingApplications,
        });
        setRecentApplications(applications);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [employer?.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Verification Banner */}
      {!employer?.is_verified && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-center gap-4 py-4">
            <AlertCircle className="h-10 w-10 text-amber-600 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-amber-800">Verification Pending</p>
              <p className="text-sm text-amber-700">
                Your company profile is under review. Once verified, your job postings will be visible to students.
                Please upload verification documents to speed up the process.
              </p>
            </div>
            <Button variant="outline" className="shrink-0" asChild>
              <Link to="/employer/documents">Upload Documents</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {employer?.is_verified && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center gap-4 py-4">
            <CheckCircle2 className="h-10 w-10 text-green-600 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-green-800">Verified Employer</p>
              <p className="text-sm text-green-700">
                Your company is verified. Your job postings are now visible to all students on the platform.
              </p>
            </div>
            <Button asChild>
              <Link to="/employer/jobs">
                <Plus className="h-4 w-4 mr-2" />
                Post a Job
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalJobs || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeJobs || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeJobs || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently accepting applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalApplications || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingApplications || 0}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your action
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Applications */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your hiring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link to="/employer/jobs">
                <Plus className="h-4 w-4 mr-2" />
                Post a New Job
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/employer/candidates">
                <Users className="h-4 w-4 mr-2" />
                Review Applications
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/employer/company">
                <TrendingUp className="h-4 w-4 mr-2" />
                Update Company Profile
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest candidates who applied</CardDescription>
          </CardHeader>
          <CardContent>
            {recentApplications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No applications yet</p>
                <p className="text-sm">Post a job to start receiving applications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{app.profile?.full_name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">{app.job?.title}</p>
                    </div>
                    <Badge variant={
                      app.status === 'applied' ? 'secondary' :
                      app.status === 'shortlisted' ? 'default' :
                      app.status === 'rejected' ? 'destructive' : 'outline'
                    }>
                      {app.status}
                    </Badge>
                  </div>
                ))}
                <Button variant="link" className="w-full" asChild>
                  <Link to="/employer/candidates">View all applications →</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployerDashboard;
