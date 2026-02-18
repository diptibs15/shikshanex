import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Mail, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { z } from 'zod';

const verificationCodeSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { verifyEmail, resendVerificationEmail } = useAuth();

  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const tokenFromUrl = searchParams.get('token');
  const emailFromUrl = searchParams.get('email');

  // Auto-verify if token is in URL
  useEffect(() => {
    if (tokenFromUrl && !success) {
      handleAutoVerify(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  // Handle cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleAutoVerify = async (token: string) => {
    setVerifying(true);
    const { error: verifyError } = await verifyEmail(token);
    setVerifying(false);

    if (verifyError) {
      setError('This verification link has expired or is invalid');
      toast({
        title: 'Verification Failed',
        description: 'The verification link has expired. Please request a new one.',
        variant: 'destructive',
      });
    } else {
      setSuccess(true);
      toast({
        title: 'Email Verified!',
        description: 'Your email has been successfully verified.',
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      verificationCodeSchema.parse({ code: verificationCode });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || 'Invalid verification code');
      }
      return;
    }

    setLoading(true);
    const { error: verifyError } = await verifyEmail(verificationCode);
    setLoading(false);

    if (verifyError) {
      setError(verifyError.message);
      toast({
        title: 'Verification Failed',
        description: verifyError.message,
        variant: 'destructive',
      });
    } else {
      setSuccess(true);
      toast({
        title: 'Email Verified!',
        description: 'Your email has been successfully verified.',
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  };

  const handleResendEmail = async () => {
    if (!emailFromUrl) {
      setError('Email address not found. Please sign up again.');
      return;
    }

    setResendLoading(true);
    const { error: resendError } = await resendVerificationEmail(
      emailFromUrl,
      'User' // You could enhance this by storing the name
    );
    setResendLoading(false);

    if (resendError) {
      toast({
        title: 'Resend Failed',
        description: resendError.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Email Sent!',
        description: 'Verification email has been sent to your inbox.',
      });
      setResendCooldown(60);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-x-hidden">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg gradient-primary flex-shrink-0">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-heading font-bold text-foreground">ShikshaNex</span>
              <span className="block text-xs text-muted-foreground">Student Portal</span>
            </div>
          </Link>
        </div>

        <Card className="shadow-card">
          <CardHeader className="text-center">
            {success ? (
              <>
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-2xl font-heading">Email Verified!</CardTitle>
                <CardDescription>
                  Your email has been successfully verified. Redirecting to dashboard...
                </CardDescription>
              </>
            ) : verifying ? (
              <>
                <div className="flex justify-center mb-4">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                </div>
                <CardTitle className="text-2xl font-heading">Verifying Email</CardTitle>
                <CardDescription>
                  Please wait while we verify your email...
                </CardDescription>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <Mail className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl font-heading">Verify Your Email</CardTitle>
                <CardDescription>
                  {emailFromUrl 
                    ? `Enter the 6-digit code sent to ${emailFromUrl}`
                    : 'Enter the 6-digit verification code'}
                </CardDescription>
              </>
            )}
          </CardHeader>

          {!success && !verifying && (
            <CardContent className="space-y-6">
              <form onSubmit={handleVerifyCode} className="space-y-4">
                {/* Verification Code Input */}
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm">
                    Verification Code
                  </Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                      setVerificationCode(value);
                    }}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest font-mono text-sm"
                    required
                    autoFocus
                  />
                  {error && <p className="text-xs text-destructive">{error}</p>}
                </div>

                {/* Verify Button */}
                <Button
                  type="submit"
                  className="w-full text-base touch-target"
                  disabled={loading || verificationCode.length !== 6}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify Email
                </Button>
              </form>

              {/* Resend Email */}
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?
                </p>
                <Button
                  variant="outline"
                  onClick={handleResendEmail}
                  disabled={resendLoading || resendCooldown > 0}
                  className="w-full text-sm"
                >
                  {resendLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : 'Resend Code'}
                </Button>
              </div>

              {/* Back to Login */}
              <div className="text-center">
                <Link
                  to="/auth"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  ← Back to Login
                </Link>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
