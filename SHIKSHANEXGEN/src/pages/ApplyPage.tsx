import { useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle2, ChevronRight, FileText, CreditCard, LayoutDashboard, Shield, AlertTriangle, Lock, MessageSquare, ChevronDown, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const courses = [
  { value: "java-fullstack", label: "Java Full Stack", category: "IT", price: 19999 },
  { value: "python-fullstack", label: "Python Full Stack", category: "IT", price: 19999 },
  { value: "ai-ml", label: "AI / Machine Learning", category: "IT", price: 19999 },
  { value: "data-analytics", label: "Data Analytics", category: "IT", price: 19999 },
  { value: "data-science", label: "Data Science", category: "IT", price: 19999 },
  { value: "aws-cloud", label: "AWS & Cloud Computing", category: "IT", price: 19999 },
  { value: "cyber-security", label: "Cyber Security", category: "IT", price: 19999 },
  { value: "hr-generalist", label: "HR Generalist", category: "HR", price: 5999 },
  { value: "hr-recruiter", label: "HR Recruiter", category: "HR", price: 5999 },
  { value: "payroll-compliance", label: "Payroll & Compliance", category: "HR", price: 5999 },
  { value: "talent-acquisition", label: "Talent Acquisition", category: "HR", price: 5999 },
  { value: "digital-marketing", label: "Complete Digital Marketing", category: "Marketing", price: 19999 },
  { value: "seo", label: "SEO Mastery", category: "Marketing", price: 19999 },
  { value: "smm", label: "Social Media Marketing", category: "Marketing", price: 19999 },
  { value: "google-ads", label: "Google Ads (PPC)", category: "Marketing", price: 19999 },
  { value: "photoshop", label: "Adobe Photoshop", category: "Design", price: 19999 },
  { value: "illustrator", label: "Adobe Illustrator", category: "Design", price: 19999 },
  { value: "ui-ux", label: "UI/UX Design", category: "Design", price: 19999 },
  { value: "branding", label: "Branding & Visual Design", category: "Design", price: 19999 },
  { value: "clinical-training", label: "Advanced Clinical Training", category: "Nursing", price: 20999 },
  { value: "icu-emergency", label: "ICU & Emergency Care", category: "Nursing", price: 20999 },
  { value: "patient-care", label: "Patient Care & Documentation", category: "Nursing", price: 20999 },
];

const steps = [
  { id: 1, title: "Registration", icon: FileText },
  { id: 2, title: "Policy Agreement", icon: Shield },
  { id: 3, title: "Payment", icon: CreditCard },
  { id: 4, title: "Dashboard", icon: LayoutDashboard },
];

const ApplyPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    course: "",
  });
  
  // Policy agreements
  const [agreements, setAgreements] = useState({
    feesPolicy: false,
    ndaPolicy: false,
    socialPolicy: false,
    finalConsent: false,
  });
  
  const [hasScrolledPolicies, setHasScrolledPolicies] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allPoliciesAgreed = Object.values(agreements).every(Boolean);
  const selectedCourse = courses.find(c => c.value === formData.course);
  
  const progress = (currentStep / steps.length) * 100;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.mobile || !formData.email || !formData.course) {
      toast({
        title: "Required Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentStep(2);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setHasScrolledPolicies(true);
      }
    }
  };

  const handleStep2Submit = () => {
    if (!allPoliciesAgreed) {
      toast({
        title: "Agreement Required",
        description: "You must agree to all policies to proceed.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(3);
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Payment Successful!",
      description: "Your enrollment is confirmed. Invoice sent to your email.",
    });
    
    setIsProcessingPayment(false);
    setCurrentStep(4);
  };

  const handleGoToDashboard = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gradient-hero text-primary-foreground py-12 lg:py-16">
          <div className="container">
            <div className="max-w-2xl">
              <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                Apply Now
              </h1>
              <p className="text-lg text-white/80">
                Complete your enrollment in 4 simple steps
              </p>
            </div>
          </div>
        </section>

        {/* Progress Steps */}
        <section className="py-8 border-b bg-card">
          <div className="container">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCompleted ? "bg-green-500 text-white" :
                        isCurrent ? "bg-primary text-primary-foreground" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-5 w-5" />}
                      </div>
                      <span className={`text-xs mt-2 font-medium ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 md:w-24 h-1 mx-2 rounded ${
                        currentStep > step.id ? "bg-green-500" : "bg-muted"
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            <Progress value={progress} className="mt-6 max-w-3xl mx-auto h-2" />
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12 lg:py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              
              {/* Step 1: Registration */}
              {currentStep === 1 && (
                <div className="bg-card rounded-2xl border shadow-card p-8">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    Step 1: User Registration
                  </h2>
                  
                  <form onSubmit={handleStep1Submit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number *</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Course / Service Selected *</Label>
                      <Select value={formData.course} onValueChange={(value) => setFormData({ ...formData, course: value })} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.value} value={course.value}>
                              {course.label} ({course.category}) - ₹{course.price.toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button type="submit" variant="hero" size="lg" className="w-full">
                      Next: Policy Agreement <ChevronRight className="h-5 w-5 ml-2" />
                    </Button>
                  </form>
                </div>
              )}

              {/* Step 2: Policy Agreement */}
              {currentStep === 2 && (
                <div className="bg-card rounded-2xl border shadow-card p-8">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
                    <Shield className="h-6 w-6 text-primary" />
                    Step 2: Policy Agreements
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Please review and agree to our policies before proceeding.
                  </p>

                  {/* Mandatory Checkboxes */}
                  <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 mb-6 space-y-4">
                    <p className="text-sm font-semibold text-foreground">
                      ⚠️ Mandatory: You must agree to all policies to proceed
                    </p>

                    <div className="space-y-4">
                      {/* Checkbox 1 */}
                      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-primary/10 transition-colors">
                        <Checkbox
                          id="feesPolicy"
                          checked={agreements.feesPolicy}
                          onCheckedChange={(checked) => setAgreements({ ...agreements, feesPolicy: checked as boolean })}
                          className="mt-1"
                        />
                        <label htmlFor="feesPolicy" className="text-sm font-medium cursor-pointer leading-relaxed">
                          I have read and agree to the Fees & Refund Policy
                        </label>
                      </div>

                      {/* Checkbox 2 */}
                      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-primary/10 transition-colors">
                        <Checkbox
                          id="ndaPolicy"
                          checked={agreements.ndaPolicy}
                          onCheckedChange={(checked) => setAgreements({ ...agreements, ndaPolicy: checked as boolean })}
                          className="mt-1"
                        />
                        <label htmlFor="ndaPolicy" className="text-sm font-medium cursor-pointer leading-relaxed">
                          I agree to the NDA & Confidentiality Agreement
                        </label>
                      </div>

                      {/* Checkbox 3 */}
                      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-primary/10 transition-colors">
                        <Checkbox
                          id="socialPolicy"
                          checked={agreements.socialPolicy}
                          onCheckedChange={(checked) => setAgreements({ ...agreements, socialPolicy: checked as boolean })}
                          className="mt-1"
                        />
                        <label htmlFor="socialPolicy" className="text-sm font-medium cursor-pointer leading-relaxed">
                          I agree to the Communication & Review Policy
                        </label>
                      </div>

                      {/* Checkbox 4 */}
                      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-green-500/10 transition-colors">
                        <Checkbox
                          id="finalConsent"
                          checked={agreements.finalConsent}
                          onCheckedChange={(checked) => setAgreements({ ...agreements, finalConsent: checked as boolean })}
                          className="mt-1"
                        />
                        <label htmlFor="finalConsent" className="text-sm font-semibold cursor-pointer leading-relaxed text-green-700">
                          I voluntarily agree to all terms and accept them as a legally valid digital agreement
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions Dropdown - Below Checkboxes */}
                  <Collapsible open={termsOpen} onOpenChange={setTermsOpen} className="mb-6">
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between h-auto py-4 px-6"
                      >
                        <span className="text-base font-semibold">📋 Read Terms & Conditions</span>
                        <ChevronDown className={`h-5 w-5 transition-transform ${termsOpen ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <ScrollArea
                        className="h-[500px] rounded-lg border bg-muted/30 p-6 mt-4"
                        ref={scrollRef}
                        onScrollCapture={handleScroll}
                      >
                        <div className="space-y-8 pr-4">
                          {/* Section 1: Fees & Refund Policy */}
                          <div className="bg-card rounded-xl border p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <AlertTriangle className="h-6 w-6 text-amber-500" />
                              <h3 className="font-heading text-lg font-bold text-foreground">
                                SECTION 1: FEES & REFUND POLICY
                              </h3>
                            </div>

                            <div className="prose prose-sm text-muted-foreground space-y-4">
                              <p className="font-semibold text-foreground">
                                Fees & Service Policy – Mandatory Agreement
                              </p>

                              <p>
                                Shiksha Nex Technologies OPC Pvt Ltd does not sell jobs or guarantee employment.
                              </p>

                              <p className="font-medium text-foreground">All fees collected are strictly for:</p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Registration & Profile Evaluation</li>
                                <li>Career Counseling</li>
                                <li>Training & Skill Development</li>
                                <li>Internship & Placement Support</li>
                              </ul>

                              <p className="font-medium text-foreground">I clearly understand and agree that:</p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Evaluation, training, and registration fees are <strong>NON-REFUNDABLE</strong> under any circumstances</li>
                                <li>Fees are considered utilized once the service is initiated</li>
                                <li>Discontinuation or non-participation from my side does not make the company responsible</li>
                                <li>Final selection depends on my performance and employer requirements</li>
                              </ul>
                            </div>
                          </div>

                          {/* Section 2: NDA & Confidentiality */}
                          <div className="bg-card rounded-xl border p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <Lock className="h-6 w-6 text-blue-500" />
                              <h3 className="font-heading text-lg font-bold text-foreground">
                                SECTION 2: NDA & CONFIDENTIALITY AGREEMENT
                              </h3>
                            </div>

                            <div className="prose prose-sm text-muted-foreground space-y-4">
                              <p className="font-semibold text-foreground">
                                Confidentiality & NDA Agreement – Mandatory
                              </p>

                              <p>I agree that all information related to:</p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Shiksha Nex internal processes</li>
                                <li>Training methods</li>
                                <li>Placement partners</li>
                                <li>HR practices</li>
                                <li>Company documents</li>
                              </ul>
                              <p>is strictly confidential.</p>

                              <p className="font-medium text-foreground">I agree:</p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Not to share any company-related information with third parties</li>
                                <li>Not to post, publish, or discuss Shiksha Nex information on social media, forums, or public platforms</li>
                                <li>Not to misuse company name, logo, or internal communication</li>
                              </ul>
                            </div>
                          </div>

                          {/* Section 3: Social Media & Review Policy */}
                          <div className="bg-card rounded-xl border p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <MessageSquare className="h-6 w-6 text-purple-500" />
                              <h3 className="font-heading text-lg font-bold text-foreground">
                                SECTION 3: SOCIAL MEDIA & REVIEW POLICY
                              </h3>
                            </div>

                            <div className="prose prose-sm text-muted-foreground space-y-4">
                              <p className="font-semibold text-foreground">
                                Public Communication & Review Policy
                              </p>

                              <p>I understand that:</p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>I do not have the right to post misleading, false, or defamatory content about Shiksha Nex</li>
                                <li>Any concerns must be raised directly with the Shiksha Nex support team</li>
                                <li>Posting negative or false reviews without completing the process is considered unethical</li>
                              </ul>

                              <p className="font-medium text-foreground">
                                Shiksha Nex reserves the right to take appropriate action in case of policy violation.
                              </p>
                            </div>
                          </div>

                          {/* Section 4: Final Consent */}
                          <div className="bg-card rounded-xl border p-6 border-primary/30">
                            <div className="flex items-center gap-3 mb-4">
                              <CheckCircle2 className="h-6 w-6 text-green-500" />
                              <h3 className="font-heading text-lg font-bold text-foreground">
                                SECTION 4: FINAL CONSENT DECLARATION
                              </h3>
                            </div>

                            <div className="prose prose-sm text-muted-foreground space-y-4">
                              <p className="font-medium text-foreground">I confirm that:</p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>I am joining Shiksha Nex voluntarily</li>
                                <li>I have understood all policies clearly</li>
                                <li>I agree to proceed without coercion</li>
                                <li>I accept all terms digitally as a legally valid agreement</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    </CollapsibleContent>
                  </Collapsible>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button
                      variant="hero"
                      size="lg"
                      className="flex-1"
                      onClick={handleStep2Submit}
                      disabled={!allPoliciesAgreed}
                    >
                      Proceed to Payment <ChevronRight className="h-5 w-5 ml-2" />
                    </Button>
                  </div>

                  {!allPoliciesAgreed && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800 font-medium">
                        ⚠️ All 4 policy agreements are required to enable the payment button
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="bg-card rounded-2xl border shadow-card p-8">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-primary" />
                    Step 3: Payment
                  </h2>
                  
                  <div className="bg-muted/30 rounded-xl p-6 mb-6">
                    <h3 className="font-semibold text-lg text-foreground mb-4">Order Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Course</span>
                        <span className="font-medium">{selectedCourse?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category</span>
                        <span>{selectedCourse?.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name</span>
                        <span>{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <span>{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mobile</span>
                        <span>{formData.mobile}</span>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total Amount</span>
                          <span className="text-primary">₹{selectedCourse?.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-amber-800">
                      <strong>Note:</strong> This payment is for evaluation/training/placement support services. 
                      Fees are non-refundable under any circumstances. Payment does not guarantee job placement.
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      Back
                    </Button>
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="flex-1"
                      onClick={handlePayment}
                      disabled={isProcessingPayment}
                    >
                      {isProcessingPayment ? (
                        <>Processing...</>
                      ) : (
                        <>Pay ₹{selectedCourse?.price.toLocaleString()} <ChevronRight className="h-5 w-5 ml-2" /></>
                      )}
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Secured by Razorpay • 256-bit SSL Encryption
                  </p>
                </div>
              )}

              {/* Step 4: Success / Dashboard */}
              {currentStep === 4 && (
                <div className="bg-card rounded-2xl border shadow-card p-8 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                    Enrollment Successful! 🎉
                  </h2>
                  
                  <p className="text-muted-foreground mb-6">
                    Your payment has been processed and your enrollment is confirmed. 
                    An invoice has been sent to <strong>{formData.email}</strong>.
                  </p>
                  
                  <div className="bg-muted/30 rounded-xl p-6 mb-6 text-left">
                    <h3 className="font-semibold text-lg text-foreground mb-4">Invoice Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Invoice No.</span>
                        <span className="font-mono">SNX-{Date.now().toString().slice(-8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Course</span>
                        <span>{selectedCourse?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount Paid</span>
                        <span className="font-semibold text-green-600">₹{selectedCourse?.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                      <p><strong>Note:</strong> This payment is for evaluation/training/placement support services. 
                      Fees are non-refundable under any circumstances. Payment does not guarantee job placement.
                      Subject to Shiksha Nex Technologies OPC Pvt Ltd policies agreed digitally.</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" className="flex-1">
                      Download Invoice (PDF)
                    </Button>
                    <Button variant="hero" size="lg" className="flex-1" onClick={handleGoToDashboard}>
                      <LayoutDashboard className="h-5 w-5 mr-2" />
                      Go to Dashboard
                    </Button>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ApplyPage;
