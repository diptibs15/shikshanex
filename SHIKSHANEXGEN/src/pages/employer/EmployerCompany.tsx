import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Building2, Globe, Phone, Mail, MapPin, Loader2, CheckCircle2, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const industries = [
  'Information Technology',
  'Healthcare',
  'Finance & Banking',
  'Manufacturing',
  'Education',
  'E-commerce',
  'Consulting',
  'Telecommunications',
  'Real Estate',
  'Other',
];

const companySizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees',
];

interface EmployerData {
  id: string;
  company_name: string;
  company_email: string;
  company_phone: string | null;
  company_website: string | null;
  company_logo: string | null;
  industry: string | null;
  company_size: string | null;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  is_verified: boolean;
}

const EmployerCompany = () => {
  const { employer: contextEmployer } = useOutletContext<{ employer: { id: string; is_verified: boolean } }>();
  const { user } = useAuth();
  const [employer, setEmployer] = useState<EmployerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployer = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('employers')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setEmployer(data);
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
        .update({
          company_name: employer.company_name,
          company_email: employer.company_email,
          company_phone: employer.company_phone,
          company_website: employer.company_website,
          industry: employer.industry,
          company_size: employer.company_size,
          description: employer.description,
          address: employer.address,
          city: employer.city,
          state: employer.state,
        })
        .eq('id', employer.id);

      if (error) throw error;

      toast({ title: 'Company profile updated successfully' });
    } catch (error: any) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof EmployerData, value: string) => {
    if (employer) {
      setEmployer({ ...employer, [field]: value });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!employer) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Company profile not found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Company Profile</h1>
        <p className="text-muted-foreground">Manage your company information</p>
      </div>

      {/* Verification Status */}
      <Card className={employer.is_verified ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}>
        <CardContent className="flex items-center gap-4 py-4">
          {employer.is_verified ? (
            <>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Verified Company</p>
                <p className="text-sm text-green-700">Your company has been verified and your job postings are visible to students.</p>
              </div>
            </>
          ) : (
            <>
              <Clock className="h-8 w-8 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800">Pending Verification</p>
                <p className="text-sm text-amber-700">Your company is under review. Upload verification documents to speed up the process.</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Update your company details that will be shown to job seekers</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={employer.company_name}
                  onChange={(e) => updateField('company_name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_email">Company Email</Label>
                <Input
                  id="company_email"
                  type="email"
                  value={employer.company_email}
                  onChange={(e) => updateField('company_email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company_phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="company_phone"
                    className="pl-9"
                    value={employer.company_phone || ''}
                    onChange={(e) => updateField('company_phone', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="company_website"
                    className="pl-9"
                    placeholder="https://"
                    value={employer.company_website || ''}
                    onChange={(e) => updateField('company_website', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={employer.industry || ''}
                  onValueChange={(value) => updateField('industry', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_size">Company Size</Label>
                <Select
                  value={employer.company_size || ''}
                  onValueChange={(value) => updateField('company_size', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                placeholder="Tell candidates about your company, culture, and what makes it a great place to work..."
                value={employer.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
              />
            </div>

            {/* Address */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Office Address
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={employer.address || ''}
                  onChange={(e) => updateField('address', e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={employer.city || ''}
                    onChange={(e) => updateField('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={employer.state || ''}
                    onChange={(e) => updateField('state', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerCompany;
