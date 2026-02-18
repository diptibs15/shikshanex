import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Download, 
  QrCode, 
  Loader2,
  CheckCircle,
  Clock,
  ExternalLink,
  GraduationCap,
  Briefcase
} from 'lucide-react';

interface Certificate {
  id: string;
  certificate_id: string;
  certificate_type: string;
  issue_date: string;
  verified: boolean;
  certificate_url: string | null;
  qr_code_url: string | null;
  course_id: string;
}

const DashboardCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCertificates();
    }
  }, [user]);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user?.id)
        .order('issue_date', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCertificateIcon = (type: string) => {
    switch (type) {
      case 'completion':
        return <GraduationCap className="h-6 w-6" />;
      case 'internship':
        return <Briefcase className="h-6 w-6" />;
      default:
        return <Award className="h-6 w-6" />;
    }
  };

  const getCertificateTypeName = (type: string) => {
    switch (type) {
      case 'completion':
        return 'Course Completion';
      case 'internship':
        return 'Internship Completion';
      default:
        return 'Certificate';
    }
  };

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
        <h2 className="text-2xl font-heading font-bold">My Certificates</h2>
        <p className="text-muted-foreground">Download and verify your earned certificates</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Certificates</p>
                <p className="text-2xl font-bold">{certificates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold">
                  {certificates.filter(c => c.verified).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Verification</p>
                <p className="text-2xl font-bold">
                  {certificates.filter(c => !c.verified).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates List */}
      {certificates.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="py-16 text-center">
            <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
            <p className="text-muted-foreground mb-4">
              Complete your courses and internships to earn certificates
            </p>
            <Button asChild>
              <a href="/dashboard/courses">View My Courses</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {certificates.map(certificate => (
            <Card key={certificate.id} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      {getCertificateIcon(certificate.certificate_type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {getCertificateTypeName(certificate.certificate_type)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        ID: {certificate.certificate_id}
                      </p>
                    </div>
                  </div>
                  {certificate.verified ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-yellow-600">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Issue Date</span>
                    <span className="font-medium">
                      {new Date(certificate.issue_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {certificate.certificate_url && (
                      <Button className="flex-1" asChild>
                        <a href={certificate.certificate_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </a>
                      </Button>
                    )}
                    {certificate.qr_code_url && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={certificate.qr_code_url} target="_blank" rel="noopener noreferrer">
                          <QrCode className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Verification Link */}
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      Verify at: shikshanex.com/verify/{certificate.certificate_id}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <QrCode className="h-8 w-8 text-primary flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Certificate Verification</h4>
              <p className="text-sm text-muted-foreground">
                All certificates include a unique QR code and Certificate ID for verification. 
                Employers can verify the authenticity of your certificates by scanning the QR code 
                or visiting our verification portal.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCertificates;
