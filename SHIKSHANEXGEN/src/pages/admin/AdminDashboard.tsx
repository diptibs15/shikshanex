import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, BookOpen, CreditCard, Award, ClipboardCheck, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalPayments: number;
  totalCertificates: number;
  totalInterviews: number;
  passedInterviews: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalCourses: 0,
    totalPayments: 0,
    totalCertificates: 0,
    totalInterviews: 0,
    passedInterviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        studentsRes,
        coursesRes,
        paymentsRes,
        certificatesRes,
        interviewsRes,
        passedRes,
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('course_payments').select('amount').eq('status', 'completed'),
        supabase.from('certificates').select('id', { count: 'exact', head: true }),
        supabase.from('interview_attempts').select('id', { count: 'exact', head: true }),
        supabase.from('interview_attempts').select('id', { count: 'exact', head: true }).eq('passed', true),
      ]);

      const totalPaymentAmount = paymentsRes.data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      setStats({
        totalStudents: studentsRes.count || 0,
        totalCourses: coursesRes.count || 0,
        totalPayments: totalPaymentAmount,
        totalCertificates: certificatesRes.count || 0,
        totalInterviews: interviewsRes.count || 0,
        passedInterviews: passedRes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Active Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalPayments.toLocaleString()}`,
      icon: CreditCard,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Certificates Issued',
      value: stats.totalCertificates,
      icon: Award,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Total Interviews',
      value: stats.totalInterviews,
      icon: ClipboardCheck,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Pass Rate',
      value: stats.totalInterviews > 0 
        ? `${Math.round((stats.passedInterviews / stats.totalInterviews) * 100)}%`
        : '0%',
      icon: TrendingUp,
      color: 'text-teal-500',
      bgColor: 'bg-teal-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Admin Dashboard</h2>
        <p className="text-muted-foreground">Overview of your platform performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Activity feed will be displayed here showing recent enrollments, payments, and interview completions.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground text-sm">
              Use the sidebar to navigate to different management sections:
            </p>
            <ul className="text-sm space-y-1 mt-2">
              <li>• <strong>Students</strong> - View all registered students</li>
              <li>• <strong>Courses</strong> - Add and manage courses</li>
              <li>• <strong>Interviews</strong> - Review interview recordings</li>
              <li>• <strong>Payments</strong> - Track all transactions</li>
              <li>• <strong>Certificates</strong> - Issue and verify certificates</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
