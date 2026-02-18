import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Loader2, Building2, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  mobile: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
import logo from '@/assets/shiksha-nex-logo.png';

const EmployerAuth = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup form
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      loginSchema.parse({ email: loginEmail, password: loginPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      // Check if user has employer role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('role', 'employer')
        .maybeSingle();

      if (!roleData) {
        // Not an employer, check if they have an employer profile
        const { data: employerData } = await supabase
          .from('employers')
          .select('id')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (!employerData) {
          navigate('/employer/register');
          return;
        }
      }

      toast({ title: 'Welcome back!', description: 'Successfully signed in.' });
      navigate('/employer');
    } catch (error: any) {
      toast({
        title: 'Sign in failed',
        description: error.message === 'Invalid login credentials'
          ? 'Invalid email or password. Please try again.'
          : error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      signupSchema.parse({
        fullName: signupName,
        email: signupEmail,
        mobile: signupMobile,
        password: signupPassword,
        confirmPassword: signupConfirmPassword,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/employer/register`;

      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: signupName,
            mobile: signupMobile,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        await supabase.from('profiles').insert({
          user_id: data.user.id,
          full_name: signupName,
          mobile: signupMobile || null,
          email_verified: false,
        });

        // Add employer role
        await supabase.from('user_roles').insert({
          user_id: data.user.id,
          role: 'employer',
        });

        toast({
          title: 'Account created!',
          description: 'Please complete your company registration.',
        });
        navigate('/employer/register');
      }
    } catch (error: any) {
      toast({
        title: 'Sign up failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3 xs:p-4 overflow-x-hidden">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 xs:mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 xs:h-12 w-10 xs:w-12 items-center justify-center rounded-lg gradient-primary flex-shrink-0">
              <Building2 className="h-6 xs:h-7 w-6 xs:w-7 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg xs:text-xl font-heading font-bold text-foreground">Employer Portal</span>
              <span className="block text-xs text-muted-foreground">ShikshaNex</span>
            </div>
          </Link>
        </div>

        <Card className="shadow-card">
          <CardHeader className="text-center p-4 xs:p-6">
            <CardTitle className="text-xl xs:text-2xl font-heading">Welcome</CardTitle>
            <CardDescription className="text-xs xs:text-sm">
              Sign in to post jobs or create a new employer account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 xs:p-6">
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin" className="text-xs xs:text-sm">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="text-xs xs:text-sm">Sign Up</TabsTrigger>
              </TabsList>

              {/* SIGNIN TAB */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-1.5 xs:space-y-2">
                    <Label htmlFor="login-email" className="text-xs xs:text-sm">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="employer@company.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10 text-sm"
                        required
                      />
                    </div>
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>

                  {/* Password Field with Visibility Toggle */}
                  <div className="space-y-1.5 xs:space-y-2">
                    <Label htmlFor="login-password" className="text-xs xs:text-sm">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 pr-10 text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                        aria-label={showLoginPassword ? "Hide password" : "Show password"}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                  </div>

                  {/* Forgot Password Link */}
                  <div className="flex justify-end">
                    <Link
                      to="/forgot-password?role=employer"
                      className="text-xs xs:text-sm text-primary hover:underline transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Sign In Button */}
                  <Button type="submit" className="w-full text-sm xs:text-base touch-target" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              {/* SIGNUP TAB */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-3 xs:space-y-4">
                  {/* Full Name Field */}
                  <div className="space-y-1.5 xs:space-y-2">
                    <Label htmlFor="signup-name" className="text-xs xs:text-sm">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="pl-10 text-sm"
                        required
                      />
                    </div>
                    {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1.5 xs:space-y-2">
                    <Label htmlFor="signup-email" className="text-xs xs:text-sm">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="employer@company.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="pl-10 text-sm"
                        required
                      />
                    </div>
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>

                  {/* Mobile Field (Optional) */}
                  <div className="space-y-1.5 xs:space-y-2">
                    <Label htmlFor="signup-mobile" className="text-xs xs:text-sm">Mobile (Optional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="signup-mobile"
                        type="tel"
                        placeholder="+91 9876543210"
                        value={signupMobile}
                        onChange={(e) => setSignupMobile(e.target.value)}
                        className="pl-10 text-sm"
                      />
                    </div>
                  </div>

                  {/* Password Field with Visibility Toggle */}
                  <div className="space-y-1.5 xs:space-y-2">
                    <Label htmlFor="signup-password" className="text-xs xs:text-sm">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="signup-password"
                        type={showSignupPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="pl-10 pr-10 text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                        aria-label={showSignupPassword ? "Hide password" : "Show password"}
                      >
                        {showSignupPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                  </div>

                  {/* Confirm Password Field with Visibility Toggle */}
                  <div className="space-y-1.5 xs:space-y-2">
                    <Label htmlFor="signup-confirm" className="text-xs xs:text-sm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="signup-confirm"
                        type={showSignupConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                        aria-label={showSignupConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showSignupConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                  </div>

                  {/* Create Account Button */}
                  <Button type="submit" className="w-full text-sm xs:text-base touch-target" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Back to Home Link */}
            <div className="mt-6 text-center">
              <Link to="/" className="text-xs xs:text-sm text-muted-foreground hover:text-primary transition-colors">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployerAuth;
