import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { Search, Loader2, Award, Check, X, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Certificate {
  id: string;
  certificate_id: string;
  user_id: string;
  course_id: string;
  certificate_type: string;
  verified: boolean | null;
  issue_date: string;
  certificate_url: string | null;
  qr_code_url: string | null;
  created_at: string;
  profile?: {
    full_name: string;
  };
  course?: {
    title: string;
  };
}

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      // Fetch certificates
      const { data: certs, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles and courses for joining
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name');

      const { data: courses } = await supabase
        .from('courses')
        .select('id, title');

      // Join data manually
      const certificatesWithData = (certs || []).map((cert) => ({
        ...cert,
        profile: profiles?.find((p) => p.user_id === cert.user_id) || undefined,
        course: courses?.find((c) => c.id === cert.course_id) || undefined,
      })) as Certificate[];

      setCertificates(certificatesWithData);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.certificate_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || cert.certificate_type === typeFilter;
    const matchesVerified =
      verifiedFilter === 'all' ||
      (verifiedFilter === 'verified' && cert.verified) ||
      (verifiedFilter === 'pending' && !cert.verified);
    return matchesSearch && matchesType && matchesVerified;
  });

  const updateVerification = async (certificateId: string, verified: boolean) => {
    try {
      const { error } = await supabase
        .from('certificates')
        .update({ verified })
        .eq('id', certificateId);

      if (error) throw error;

      setCertificates(
        certificates.map((c) =>
          c.id === certificateId ? { ...c, verified } : c
        )
      );

      toast({
        title: verified ? 'Certificate verified' : 'Certificate unverified',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Certificate Management</h2>
        <p className="text-muted-foreground">Issue and verify student certificates</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Certificates
            </CardTitle>
            <Award className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.length}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Verified
            </CardTitle>
            <Check className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {certificates.filter((c) => c.verified).length}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Verification
            </CardTitle>
            <X className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {certificates.filter((c) => !c.verified).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              All Certificates ({filteredCertificates.length})
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
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="course_completion">Course Completion</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
              <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
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
                    <TableHead>Certificate ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCertificates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No certificates found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCertificates.map((cert) => (
                      <TableRow key={cert.id}>
                        <TableCell className="font-mono text-xs">
                          {cert.certificate_id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {cert.profile?.full_name || 'Unknown'}
                        </TableCell>
                        <TableCell>{cert.course?.title || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {cert.certificate_type.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(cert.issue_date), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          {cert.verified ? (
                            <Badge className="bg-green-500">Verified</Badge>
                          ) : (
                            <Badge variant="outline">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          {cert.verified ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateVerification(cert.id, false)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Revoke
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateVerification(cert.id, true)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Verify
                            </Button>
                          )}
                          {cert.certificate_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(cert.certificate_url!, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
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

export default AdminCertificates;
