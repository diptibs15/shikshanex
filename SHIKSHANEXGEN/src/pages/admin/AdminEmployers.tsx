import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  ExternalLink, 
  Eye,
  FileText,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';

interface Employer {
  id: string;
  company_name: string;
  company_email: string;
  company_phone: string | null;
  company_website: string | null;
  company_logo: string | null;
  industry: string | null;
  company_size: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  description: string | null;
  documents_url: string | null;
  is_verified: boolean;
  created_at: string;
  user_id: string;
}

const AdminEmployers = () => {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployers();
  }, []);

  const fetchEmployers = async () => {
    try {
      const { data, error } = await supabase
        .from('employers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployers(data || []);
    } catch (error) {
      console.error('Error fetching employers:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch employers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (employer: Employer) => {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('employers')
        .update({ is_verified: true })
        .eq('id', employer.id);

      if (error) throw error;

      toast({
        title: 'Employer Approved',
        description: `${employer.company_name} has been verified successfully.`,
      });

      fetchEmployers();
      setReviewDialogOpen(false);
      setSelectedEmployer(null);
    } catch (error) {
      console.error('Error approving employer:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve employer',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (employer: Employer) => {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('employers')
        .update({ is_verified: false })
        .eq('id', employer.id);

      if (error) throw error;

      toast({
        title: 'Employer Rejected',
        description: `${employer.company_name} has been rejected.`,
      });

      fetchEmployers();
      setReviewDialogOpen(false);
      setSelectedEmployer(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting employer:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject employer',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (employer: Employer) => {
    if (employer.is_verified) {
      return (
        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    }
    if (employer.documents_url) {
      return (
        <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
          <Clock className="h-3 w-3 mr-1" />
          Pending Review
        </Badge>
      );
    }
    return (
      <Badge className="bg-muted text-muted-foreground">
        <XCircle className="h-3 w-3 mr-1" />
        No Documents
      </Badge>
    );
  };

  const filteredEmployers = employers.filter((employer) => {
    const matchesSearch =
      employer.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.company_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.industry?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === 'verified') {
      matchesStatus = employer.is_verified === true;
    } else if (statusFilter === 'pending') {
      matchesStatus = !employer.is_verified && !!employer.documents_url;
    } else if (statusFilter === 'rejected') {
      matchesStatus = !employer.is_verified && !employer.documents_url;
    }

    return matchesSearch && matchesStatus;
  });

  const pendingCount = employers.filter(e => !e.is_verified && e.documents_url).length;
  const verifiedCount = employers.filter(e => e.is_verified).length;
  const totalCount = employers.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Employer Verification</h2>
        <p className="text-muted-foreground">Review and verify company registrations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Employers
            </CardTitle>
            <Building2 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
            <Clock className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Verified Companies
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{verifiedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by company name, email, or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value: 'all' | 'pending' | 'verified' | 'rejected') =>
                setStatusFilter(value)
              }
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employers</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">No Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employers Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Employer List</CardTitle>
          <CardDescription>
            {filteredEmployers.length} employer(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredEmployers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No employers found matching your criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployers.map((employer) => (
                    <TableRow key={employer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            {employer.company_logo ? (
                              <img
                                src={employer.company_logo}
                                alt={employer.company_name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <Building2 className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{employer.company_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {employer.company_email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employer.industry || '-'}</TableCell>
                      <TableCell>
                        {employer.city && employer.state
                          ? `${employer.city}, ${employer.state}`
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {employer.documents_url ? (
                          <a
                            href={employer.documents_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <FileText className="h-4 w-4" />
                            View
                          </a>
                        ) : (
                          <span className="text-muted-foreground">Not uploaded</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(employer)}</TableCell>
                      <TableCell>
                        {format(new Date(employer.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedEmployer(employer);
                            setReviewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Review
            </DialogTitle>
            <DialogDescription>
              Review company details and documents before verification
            </DialogDescription>
          </DialogHeader>

          {selectedEmployer && (
            <div className="space-y-6">
              {/* Company Header */}
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {selectedEmployer.company_logo ? (
                    <img
                      src={selectedEmployer.company_logo}
                      alt={selectedEmployer.company_name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <Building2 className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold">{selectedEmployer.company_name}</h3>
                  <p className="text-muted-foreground">
                    {selectedEmployer.industry || 'Industry not specified'}
                  </p>
                  <div className="mt-2">{getStatusBadge(selectedEmployer)}</div>
                </div>
              </div>

              {/* Company Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEmployer.company_email}</span>
                  </div>
                  {selectedEmployer.company_phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedEmployer.company_phone}</span>
                    </div>
                  )}
                  {selectedEmployer.company_website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={selectedEmployer.company_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        {selectedEmployer.company_website}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {(selectedEmployer.city || selectedEmployer.state) && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {[selectedEmployer.address, selectedEmployer.city, selectedEmployer.state]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </div>
                  )}
                  {selectedEmployer.company_size && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedEmployer.company_size} employees</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {selectedEmployer.description && (
                <div>
                  <Label className="text-sm font-medium">Company Description</Label>
                  <p className="mt-1 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {selectedEmployer.description}
                  </p>
                </div>
              )}

              {/* Documents */}
              <div>
                <Label className="text-sm font-medium">Verification Documents</Label>
                {selectedEmployer.documents_url ? (
                  <div className="mt-2 p-4 border rounded-lg">
                    <a
                      href={selectedEmployer.documents_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <FileText className="h-5 w-5" />
                      View Uploaded Documents
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    No documents have been uploaded yet.
                  </p>
                )}
              </div>

              {/* Rejection Reason (if rejecting) */}
              {!selectedEmployer.is_verified && (
                <div>
                  <Label htmlFor="rejection-reason" className="text-sm font-medium">
                    Rejection Reason (optional)
                  </Label>
                  <Textarea
                    id="rejection-reason"
                    placeholder="Enter reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                </div>
              )}

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setReviewDialogOpen(false);
                    setSelectedEmployer(null);
                    setRejectionReason('');
                  }}
                >
                  Cancel
                </Button>
                {selectedEmployer.is_verified ? (
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(selectedEmployer)}
                    disabled={processing}
                  >
                    {processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    <XCircle className="h-4 w-4 mr-2" />
                    Revoke Verification
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(selectedEmployer)}
                      disabled={processing}
                    >
                      {processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedEmployer)}
                      disabled={processing || !selectedEmployer.documents_url}
                    >
                      {processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEmployers;
