import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Shield
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface EmployerData {
  id: string;
  documents_url: string | null;
  is_verified: boolean;
}

const EmployerDocuments = () => {
  const { employer: contextEmployer } = useOutletContext<{ employer: { id: string; is_verified: boolean } }>();
  const { user } = useAuth();
  const [employer, setEmployer] = useState<EmployerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [documentUrl, setDocumentUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployer = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('employers')
          .select('id, documents_url, is_verified')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setEmployer(data);
        setDocumentUrl(data.documents_url || '');
      } catch (error) {
        console.error('Error fetching employer:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployer();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employer) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from('employers')
        .update({ documents_url: documentUrl })
        .eq('id', employer.id);

      if (error) throw error;

      setEmployer({ ...employer, documents_url: documentUrl });
      toast({ 
        title: 'Documents submitted', 
        description: 'Your documents have been submitted for verification. This usually takes 24-48 hours.' 
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Verification Documents</h1>
        <p className="text-muted-foreground">Submit documents to verify your company</p>
      </div>

      {/* Status Card */}
      <Card className={employer?.is_verified ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}>
        <CardContent className="flex items-start gap-4 py-4">
          {employer?.is_verified ? (
            <>
              <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0" />
              <div>
                <p className="font-medium text-green-800">Verification Complete</p>
                <p className="text-sm text-green-700 mt-1">
                  Your company has been verified. You can now post jobs and they will be visible to all students.
                </p>
              </div>
            </>
          ) : employer?.documents_url ? (
            <>
              <Clock className="h-8 w-8 text-amber-600 shrink-0" />
              <div>
                <p className="font-medium text-amber-800">Documents Under Review</p>
                <p className="text-sm text-amber-700 mt-1">
                  We have received your documents and are reviewing them. This usually takes 24-48 hours.
                  We'll notify you once the verification is complete.
                </p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="h-8 w-8 text-amber-600 shrink-0" />
              <div>
                <p className="font-medium text-amber-800">Documents Required</p>
                <p className="text-sm text-amber-700 mt-1">
                  Please submit your company verification documents to complete the verification process.
                  Your job postings will be visible to students once verified.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Required Documents Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Required Documents
          </CardTitle>
          <CardDescription>
            Submit any of the following documents to verify your company
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Certificate of Incorporation</p>
                <p className="text-sm text-muted-foreground">Official registration document from ROC</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">GST Registration Certificate</p>
                <p className="text-sm text-muted-foreground">Valid GST registration document</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Company PAN Card</p>
                <p className="text-sm text-muted-foreground">PAN card registered under company name</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Authorization Letter</p>
                <p className="text-sm text-muted-foreground">Letter authorizing you to represent the company</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Submit Documents
          </CardTitle>
          <CardDescription>
            Upload your documents to Google Drive, Dropbox, or any cloud storage and paste the sharing link below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="documents_url">Document Link</Label>
              <Input
                id="documents_url"
                type="url"
                placeholder="https://drive.google.com/folder/..."
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Make sure the link is publicly accessible or shared with admin@shikshanex.com
              </p>
            </div>

            {employer?.documents_url && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">Documents already submitted</span>
                <a 
                  href={employer.documents_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-auto text-primary text-sm flex items-center gap-1 hover:underline"
                >
                  View <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            <Button type="submit" disabled={saving || employer?.is_verified}>
              {saving ? 'Submitting...' : employer?.documents_url ? 'Update Documents' : 'Submit for Verification'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Help Text */}
      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">
            <strong>Need help?</strong> Contact our support team at{' '}
            <a href="mailto:support@shikshanex.com" className="text-primary hover:underline">
              support@shikshanex.com
            </a>{' '}
            for assistance with the verification process.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerDocuments;
