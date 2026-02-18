import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Search, Loader2, CreditCard, TrendingUp, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  razorpay_payment_id: string | null;
  razorpay_order_id: string | null;
  created_at: string;
  type: 'course' | 'interview';
  profile?: {
    full_name: string;
    mobile: string | null;
  };
  course?: {
    title: string;
  };
}

const AdminPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      // Fetch profiles for joining
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, mobile');

      // Fetch courses for joining
      const { data: courses } = await supabase
        .from('courses')
        .select('id, title');

      // Fetch course payments
      const { data: coursePayments, error: courseError } = await supabase
        .from('course_payments')
        .select('id, user_id, amount, status, razorpay_payment_id, razorpay_order_id, created_at')
        .order('created_at', { ascending: false });

      // Fetch interview fee payments
      const { data: interviewPayments, error: interviewError } = await supabase
        .from('interview_fee_payments')
        .select('id, user_id, course_id, amount, status, razorpay_payment_id, razorpay_order_id, created_at')
        .order('created_at', { ascending: false });

      if (courseError) throw courseError;
      if (interviewError) throw interviewError;

      const formattedCoursePayments: Payment[] = (coursePayments || []).map((p) => ({
        ...p,
        type: 'course' as const,
        profile: profiles?.find((pr) => pr.user_id === p.user_id) || undefined,
      }));

      const formattedInterviewPayments: Payment[] = (interviewPayments || []).map((p) => ({
        ...p,
        type: 'interview' as const,
        profile: profiles?.find((pr) => pr.user_id === p.user_id) || undefined,
        course: courses?.find((c) => c.id === p.course_id) || undefined,
      }));

      const allPayments = [...formattedCoursePayments, ...formattedInterviewPayments].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setPayments(allPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.razorpay_payment_id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || payment.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const courseRevenue = payments
    .filter((p) => p.status === 'completed' && p.type === 'course')
    .reduce((sum, p) => sum + p.amount, 0);

  const interviewRevenue = payments
    .filter((p) => p.status === 'completed' && p.type === 'interview')
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Payment Management</h2>
        <p className="text-muted-foreground">Track all platform transactions</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10">
              <IndianRupee className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From all completed payments</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Course Fees
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10">
              <CreditCard className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{courseRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From course enrollments</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Interview Fees
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/10">
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{interviewRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From ₹499 interview fees</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              All Transactions ({filteredPayments.length})
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-48"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="course">Course Fees</SelectItem>
                  <SelectItem value="interview">Interview Fees</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No payments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={`${payment.type}-${payment.id}`}>
                        <TableCell className="font-medium">
                          {payment.profile?.full_name || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {payment.type === 'course' ? 'Course Fee' : 'Interview Fee'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          ₹{payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs font-mono">
                          {payment.razorpay_payment_id || '-'}
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          {format(new Date(payment.created_at), 'MMM d, yyyy h:mm a')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayments;
