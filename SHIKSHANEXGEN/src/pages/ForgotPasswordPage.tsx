import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Mail, Phone, Lock, Loader2, ArrowLeft, Eye, EyeOff, Check, Building2, Shield } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const mobileSchema = z.object({
  mobile: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid mobile number (10-15 digits)')
    .min(10, 'Mobile number must be at least 10 digits'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type Step = 'method' | 'contact' | 'otp' | 'newPassword' | 'success';
type ContactMethod = 'email' | 'mobile';

const ForgotPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'student';

  const getLoginLink = () => {
    switch (role) {
      case 'employer': return '/employer/auth';
      case 'admin': return '/admin/auth';
      default: return '/auth';
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'employer': return <Building2 className="h-6 xs:h-7 w-6 xs:w-7 text-primary-foreground" />;
      case 'admin': return <Shield className="h-6 xs:h-7 w-6 xs:w-7 text-primary-foreground" />;
      default: return <GraduationCap className="h-6 xs:h-7 w-6 xs:w-7 text-primary-foreground" />;
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'employer': return 'Employer Portal';
      case 'admin': return 'Admin Portal';
      default: return 'Student Portal';
    }
  };

  const [currentStep, setCurrentStep] = useState<Step>('method');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('email');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpTimer, setOtpTimer] = useState(0);
  const { toast } = useToast();

  // Handle Step 1: Select Method
  const handleSelectMethod = (method: ContactMethod) => {
    setContactMethod(method);
    setCurrentStep('contact');
    setErrors({});
  };

  // Handle Step 2: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    let contactValue = '';
    let validationData: any = {};

    if (contactMethod === 'email') {
      validationData = { email };
      try {
        emailSchema.parse(validationData);
        contactValue = email;
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors({ email: error.errors[0].message });
          return;
        }
      }
    } else {
      validationData = { mobile };
      try {
        mobileSchema.parse(validationData);
        contactValue = mobile;
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors({ mobile: error.errors[0].message });
          return;
        }
      }
    }

    setLoading(true);
    try {
      // Call your send OTP API endpoint
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [contactMethod]: contactValue,
          method: contactMethod,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }

      setOtpTimer(60);

      // Start countdown timer
      const interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: 'OTP Sent!',
        description: `A 6-digit OTP has been sent to your ${contactMethod}. Valid for 10 minutes.`,
      });

      setCurrentStep('otp');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to send OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 3: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      otpSchema.parse({ otp });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors({ otp: error.errors[0].message });
        return;
      }
    }

    setLoading(true);
    try {
      // Call your verify OTP API endpoint
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [contactMethod]: contactMethod === 'email' ? email : mobile,
          otp,
          method: contactMethod,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid OTP');
      }

      toast({
        title: 'OTP Verified!',
        description: 'Please enter your new password.',
      });

      setCurrentStep('newPassword');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Invalid or expired OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 4: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      resetPasswordSchema.parse({ password: newPassword, confirmPassword });
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
      // Call your reset password API endpoint
      const response = await fetch('/api/auth/reset-password-with-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [contactMethod]: contactMethod === 'email' ? email : mobile,
          otp,
          newPassword,
          method: contactMethod,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      toast({
        title: 'Success!',
        description: 'Your password has been reset successfully.',
      });

      setCurrentStep('success');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to reset password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [contactMethod]: contactMethod === 'email' ? email : mobile,
          method: contactMethod,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to resend OTP');
      }

      setOtp('');
      setOtpTimer(60);

      // Start countdown timer
      const interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: 'OTP Resent!',
        description: 'A new OTP has been sent to your ' + contactMethod,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to resend OTP. Please try again.',
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
              {getRoleIcon()}
            </div>
            <div>
              <span className="text-lg xs:text-xl font-heading font-bold text-foreground">ShikshaNex</span>
              <span className="block text-xs text-muted-foreground">{getRoleTitle()}</span>
            </div>
          </Link>
        </div>

        <Card className="shadow-card">
          <CardHeader className="text-center p-4 xs:p-6">
            <CardTitle className="text-xl xs:text-2xl font-heading">Reset Password</CardTitle>
            <CardDescription className="text-xs xs:text-sm">
              {currentStep === 'method' && 'Choose how to receive your OTP'}
              {currentStep === 'contact' && `Enter your ${contactMethod === 'email' ? 'email' : 'mobile number'}`}
              {currentStep === 'otp' && 'Enter the 6-digit OTP sent to your ' + contactMethod}
              {currentStep === 'newPassword' && 'Create your new password'}
              {currentStep === 'success' && 'Your password has been reset successfully'}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 xs:p-6">
            {/* STEP 1: Choose Method */}
            {currentStep === 'method' && (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  How would you like to receive your OTP?
                </div>

                <button
                  onClick={() => handleSelectMethod('email')}
                  className="w-full p-4 xs:p-5 rounded-lg border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all text-left touch-target"
                  disabled={loading}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm xs:text-base">Via Email</div>
                      <div className="text-xs text-muted-foreground">Receive OTP on your email</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectMethod('mobile')}
                  className="w-full p-4 xs:p-5 rounded-lg border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all text-left touch-target"
                  disabled={loading}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm xs:text-base">Via SMS</div>
                      <div className="text-xs text-muted-foreground">Receive OTP on your mobile</div>
                    </div>
                  </div>
                </button>

                <div className="border-t pt-4 mt-4 flex flex-col gap-2">
                  <div className="flex justify-center">
                    <Link
                      to={getLoginLink()}
                      className="text-xs xs:text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Back to Login
                    </Link>
                  </div>
                  <div className="flex justify-center">
                    <Link to="/" className="text-xs xs:text-sm text-muted-foreground hover:text-primary transition-colors">
                      ← Back to Home
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Email or Mobile Input */}
            {currentStep === 'contact' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                {contactMethod === 'email' ? (
                  <div className="space-y-1.5 xs:space-y-2">
                    <Label htmlFor="email" className="text-xs xs:text-sm">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrors({});
                        }}
                        className="pl-10 text-sm"
                        required
                        disabled={loading}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>
                ) : (
                  <div className="space-y-1.5 xs:space-y-2">
                    <Label htmlFor="mobile" className="text-xs xs:text-sm">Mobile Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="+91 9876543210"
                        value={mobile}
                        onChange={(e) => {
                          setMobile(e.target.value);
                          setErrors({});
                        }}
                        className="pl-10 text-sm"
                        required
                        disabled={loading}
                      />
                    </div>
                    {errors.mobile && <p className="text-xs text-destructive">{errors.mobile}</p>}
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  We'll send a 6-digit OTP to your {contactMethod}. OTP will be valid for 10 minutes.
                </p>

                <Button type="submit" className="w-full text-sm xs:text-base touch-target" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send OTP
                </Button>

                <div className="border-t pt-4 mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep('method');
                      setEmail('');
                      setMobile('');
                      setErrors({});
                    }}
                    className="w-full text-xs xs:text-sm text-muted-foreground hover:text-primary transition-colors py-2"
                  >
                    ← Choose different method
                  </button>

                  <div className="flex justify-center">
                    <Link
                      to="/auth"
                      className="text-xs xs:text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Back to Login
                    </Link>
                  </div>
                  <div className="flex justify-center">
                    <Link to="/" className="text-xs xs:text-sm text-muted-foreground hover:text-primary transition-colors">
                      ← Back to Home
                    </Link>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 3: OTP Input */}
            {currentStep === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1.5 xs:space-y-2">
                  <Label htmlFor="otp" className="text-xs xs:text-sm">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtp(value);
                      setErrors({});
                    }}
                    className="text-center text-lg tracking-widest text-sm"
                    maxLength={6}
                    required
                    disabled={loading}
                  />
                  {errors.otp && <p className="text-xs text-destructive">{errors.otp}</p>}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    OTP sent to <strong>{contactMethod === 'email' ? email : mobile}</strong>
                  </span>
                  {otpTimer > 0 && (
                    <span className="text-amber-600 font-medium">
                      {otpTimer}s
                    </span>
                  )}
                </div>

                <Button type="submit" className="w-full text-sm xs:text-base touch-target" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify OTP
                </Button>

                <div className="border-t pt-4 mt-4 flex flex-col gap-2 xs:gap-3 text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={otpTimer > 0 || loading}
                    className="text-xs xs:text-sm text-primary hover:underline transition-colors disabled:text-muted-foreground disabled:cursor-not-allowed"
                  >
                    {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : 'Resend OTP'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep('method');
                      setEmail('');
                      setMobile('');
                      setOtp('');
                      setErrors({});
                      setOtpTimer(0);
                    }}
                    className="text-xs xs:text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    ← Try different method
                  </button>

                  <Link
                    to={getLoginLink()}
                    className="text-xs xs:text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 justify-center"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Back to Login
                  </Link>
                  <Link to="/" className="text-xs xs:text-sm text-muted-foreground hover:text-primary transition-colors">
                    ← Back to Home
                  </Link>
                </div>
              </form>
            )}

            {/* STEP 4: New Password Input */}
            {currentStep === 'newPassword' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1.5 xs:space-y-2">
                  <Label htmlFor="new-password" className="text-xs xs:text-sm">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setErrors({});
                      }}
                      className="pl-10 pr-10 text-sm"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>

                <div className="space-y-1.5 xs:space-y-2">
                  <Label htmlFor="confirm-password" className="text-xs xs:text-sm">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrors({});
                      }}
                      className="pl-10 pr-10 text-sm"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                </div>

                <Button type="submit" className="w-full text-sm xs:text-base touch-target" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Reset Password
                </Button>

                <div className="border-t pt-4 mt-4 flex flex-col gap-2">
                  <div className="flex justify-center">
                    <Link
                      to={getLoginLink()}
                      className="text-xs xs:text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Back to Login
                    </Link>
                  </div>
                  <div className="flex justify-center">
                    <Link to="/" className="text-xs xs:text-sm text-muted-foreground hover:text-primary transition-colors">
                      ← Back to Home
                    </Link>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 5: Success Message */}
            {currentStep === 'success' && (
              <div className="space-y-4 text-center">
                <div className="w-16 xs:w-18 sm:w-20 h-16 xs:h-18 sm:h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-8 xs:h-9 sm:h-10 w-8 xs:w-9 sm:w-10 text-green-600" />
                </div>

                <div className="rounded-lg bg-green-50 border border-green-200 p-4 xs:p-6">
                  <h3 className="font-semibold text-green-900 text-sm xs:text-base mb-1 xs:mb-2">
                    Password Reset Successfully
                  </h3>
                  <p className="text-xs xs:text-sm text-green-800">
                    Your password has been updated. You can now log in with your new password.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    to={getLoginLink()}
                    className="block"
                  >
                    <Button className="w-full text-sm xs:text-base touch-target">
                      Back to Login
                    </Button>
                  </Link>
                  <Link to="/" className="text-xs xs:text-sm text-muted-foreground hover:text-primary transition-colors text-center py-2">
                    ← Back to Home
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
