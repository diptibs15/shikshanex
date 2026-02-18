import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Building2, ArrowLeft, Upload } from 'lucide-react';
import logo from '@/assets/shiksha-nex-logo.png';

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

const EmployerRegister = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    company_email: '',
    company_phone: '',
    company_website: '',
    industry: '',
    company_size: '',
    description: '',
    address: '',
    city: '',
    state: '',
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/employer/auth');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      // Check if employer already exists
      const { data: existing } = await supabase
        .from('employers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        navigate('/employer');
        return;
      }

      // Create employer profile
      const { error } = await supabase.from('employers').insert({
        user_id: user.id,
        ...formData,
      });

      if (error) throw error;

      // Add employer role if not exists
      await supabase.from('user_roles').upsert({
        user_id: user.id,
        role: 'employer',
      }, { onConflict: 'user_id,role' });

      toast({
        title: 'Registration successful!',
        description: 'Your company profile has been created. It will be verified within 24-48 hours.',
      });

      navigate('/employer');
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Link to="/employer/auth" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <Link to="/">
          <img src={logo} alt="Shiksha Nex" className="h-10 w-auto" />
        </Link>
      </header>

      <div className="max-w-2xl mx-auto p-4 pb-12">
        <Card>
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Register Your Company</CardTitle>
              <CardDescription>
                Complete your company profile to start posting jobs and hiring talent
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Basic Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Company Information</h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name *</Label>
                    <Input
                      id="company_name"
                      placeholder="ABC Technologies Pvt. Ltd."
                      value={formData.company_name}
                      onChange={(e) => updateField('company_name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_email">Company Email *</Label>
                    <Input
                      id="company_email"
                      type="email"
                      placeholder="hr@company.com"
                      value={formData.company_email}
                      onChange={(e) => updateField('company_email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company_phone">Phone Number</Label>
                    <Input
                      id="company_phone"
                      placeholder="+91 98765 43210"
                      value={formData.company_phone}
                      onChange={(e) => updateField('company_phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_website">Website</Label>
                    <Input
                      id="company_website"
                      placeholder="https://www.company.com"
                      value={formData.company_website}
                      onChange={(e) => updateField('company_website', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => updateField('industry', value)}
                      required
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
                    <Label htmlFor="company_size">Company Size *</Label>
                    <Select
                      value={formData.company_size}
                      onValueChange={(value) => updateField('company_size', value)}
                      required
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
                    placeholder="Tell us about your company, culture, and what makes it a great place to work..."
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Address</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Business Park, Tech Hub"
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Chennai"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="Tamil Nadu"
                      value={formData.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Info Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
                <p className="font-medium text-amber-800">Verification Required</p>
                <p className="text-amber-700 mt-1">
                  Your company profile will be verified within 24-48 hours. You can upload verification 
                  documents after registration. Once verified, your job postings will be visible to students.
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Complete Registration
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployerRegister;
