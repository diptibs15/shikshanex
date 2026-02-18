import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Award,
  CreditCard,
  ClipboardCheck,
  TrendingUp,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface DashboardStats {
  enrolledCourses: number;
  completedCourses: number;
  certificates: number;
  pendingPayments: number;
  overallProgress: number;
}

const DashboardHome = () => {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    enrolledCourses: 0,
    completedCourses: 0,
    certificates: 0,
    pendingPayments: 0,
    overallProgress: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Fetch enrollments
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('status, progress')
          .eq('user_id', user.id);

        // Fetch certificates
        const { data: certificates } = await supabase
          .from('certificates')
          .select('id')
          .eq('user_id', user.id);

        // Fetch pending payments
        const { data: payments } = await supabase
          .from('course_payments')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'pending');

        const enrolled = enrollments?.filter(e => e.status === 'active').length || 0;
        const completed = enrollments?.filter(e => e.status === 'completed').length || 0;
        const avgProgress = enrollments?.length 
          ? enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / enrollments.length 
          : 0;

        setStats({
          enrolledCourses: enrolled,
          completedCourses: completed,
          certificates: certificates?.length || 0,
          pendingPayments: payments?.length || 0,
          overallProgress: Math.round(avgProgress),
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-tech rounded-xl p-6 text-primary-foreground">
        <h2 className="text-2xl font-heading font-bold mb-2">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'Student'}! 👋
        </h2>
        <p className="text-primary-foreground/80">
          Ready to continue your learning journey? Here's your progress overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Enrolled Courses
            </CardTitle>
            <BookOpen className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.enrolledCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">Active courses</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <Award className="h-5 w-5 text-healthcare" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completedCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">Courses finished</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Certificates
            </CardTitle>
            <ClipboardCheck className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.certificates}</div>
            <p className="text-xs text-muted-foreground mt-1">Earned certificates</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Progress
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-design" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.overallProgress}%</div>
            <Progress value={stats.overallProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-heading">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/dashboard/interview">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  Take Entrance Test
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/dashboard/courses">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Browse Courses
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/dashboard/resume">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Build Your Resume
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-heading">Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Select Your Course</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose from IT, HR, Digital Marketing, Design, or Nursing
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Pay Evaluation Fee (₹499)</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete the entrance test to unlock course enrollment
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Start Learning</h4>
                  <p className="text-sm text-muted-foreground">
                    Access video lessons, complete assignments & earn certificates
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
