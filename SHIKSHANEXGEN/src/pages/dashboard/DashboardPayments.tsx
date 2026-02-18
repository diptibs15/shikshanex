import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Download, 
  FileText, 
  Loader2,
  Receipt,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface Payment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  razorpay_payment_id: string | null;
  invoice_url: string | null;
  type: 'course' | 'interview';
  course_title?: string;
}

const DashboardPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user]);

  const fetchPayments = async () => {
    try {
      // Fetch course payments
      const { data: coursePayments } = await supabase
        .from('course_payments')
        .select(`
          id,
          amount,
          status,
          created_at,
          razorpay_payment_id,
          invoice_url,
          enrollment_id
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      // Fetch interview fee payments
      const { data: interviewPayments } = await supabase
        .from('interview_fee_payments')
        .select(`
          id,
          amount,
          status,
          created_at,
          razorpay_payment_id,
          course_id
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      // Combine and format payments
      const allPayments: Payment[] = [
        ...(coursePayments || []).map(p => ({
          ...p,
          type: 'course' as const,
          course_title: 'Course Enrollment'
        })),
        ...(interviewPayments || []).map(p => ({
          ...p,
          type: 'interview' as const,
          invoice_url: null,
          course_title: 'Interview Evaluation Fee'
        }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setPayments(allPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Paid</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalPaid = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Payment History</h2>
        <p className="text-muted-foreground">View your transactions and download invoices</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Payments</p>
                <p className="text-2xl font-bold">{payments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <Receipt className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold">₹{totalPaid.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Invoices</p>
                <p className="text-2xl font-bold">
                  {payments.filter(p => p.invoice_url).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="course">Course Fees</TabsTrigger>
              <TabsTrigger value="interview">Interview Fees</TabsTrigger>
            </TabsList>

            {['all', 'course', 'interview'].map(tab => (
              <TabsContent key={tab} value={tab}>
                {payments.filter(p => tab === 'all' || p.type === tab).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No payments found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payments
                      .filter(p => tab === 'all' || p.type === tab)
                      .map(payment => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-muted">
                              {payment.type === 'course' ? (
                                <CreditCard className="h-5 w-5 text-primary" />
                              ) : (
                                <FileText className="h-5 w-5 text-accent" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{payment.course_title}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(payment.created_at).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              {payment.razorpay_payment_id && (
                                <p className="text-xs text-muted-foreground">
                                  ID: {payment.razorpay_payment_id}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-semibold">₹{payment.amount.toLocaleString()}</p>
                              {getStatusBadge(payment.status)}
                            </div>
                            {payment.invoice_url && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={payment.invoice_url} target="_blank" rel="noopener noreferrer">
                                  <Download className="h-4 w-4 mr-1" />
                                  Invoice
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Invoice Footer Note */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Note:</strong> All fees are for evaluation and training support purposes only. 
            Fees are non-refundable and do not guarantee placement. GST applicable as per government norms.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPayments;
