import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Building2, Stethoscope, Briefcase, Megaphone, PenTool, FileText, Users, Target, CheckCircle2, GraduationCap, Award, Handshake, Video, FileCheck } from "lucide-react";

const candidateServices = [
  { icon: FileText, title: "Resume Building", description: "AI-powered professional resume crafted by HR experts" },
  { icon: PenTool, title: "Portfolio Support", description: "For designers & marketers with live project showcase" },
  { icon: Video, title: "Mock Interviews", description: "AI-based interview practice with instant feedback" },
  { icon: Target, title: "Job Referrals", description: "Direct referrals to 500+ partner companies" },
  { icon: GraduationCap, title: "Skill Matching", description: "Auto-match your profile with job requirements" },
  { icon: Award, title: "Certification", description: "Industry-recognized certificates boost your profile" },
];

const companyServices = [
  { title: "IT Hiring", description: "Java, Python, AI/ML, DevOps, Cloud Engineers", icon: Building2, salary: "8-35 LPA" },
  { title: "HR Staffing", description: "HR Generalists, Recruiters, Payroll Specialists", icon: Briefcase, salary: "4-12 LPA" },
  { title: "Digital Marketing Resources", description: "SEO, PPC, Social Media, Content Specialists", icon: Megaphone, salary: "4-12 LPA" },
  { title: "Graphic Designers", description: "UI/UX, Brand Design, Motion Graphics", icon: PenTool, salary: "5-14 LPA" },
  { title: "Healthcare Staff", description: "ICU, ER, Staff Nurses, Clinical Specialists", icon: Stethoscope, salary: "3.5-8 LPA" },
];

const placementAreas = [
  { icon: Building2, title: "IT Companies", count: "200+", description: "Tech startups to MNCs" },
  { icon: Briefcase, title: "Corporate Offices", count: "150+", description: "HR & Operations roles" },
  { icon: Megaphone, title: "Marketing Agencies", count: "100+", description: "Digital marketing roles" },
  { icon: PenTool, title: "Design Studios", count: "75+", description: "Creative design positions" },
  { icon: Stethoscope, title: "Hospitals & Clinics", count: "50+", description: "Healthcare institutions" },
];

const PlacementPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gradient-hero text-primary-foreground py-16 lg:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Placement Services
              </h1>
              <p className="text-lg text-white/80 mb-8">
                We provide comprehensive placement support across IT companies, hospitals, clinics, home care centers, and corporate offices. Our dedicated team ensures you land your dream job.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-heading font-bold">95%</div>
                  <div className="text-sm text-white/70">Placement Rate</div>
                </div>
                <div className="w-px bg-white/20" />
                <div className="text-center">
                  <div className="text-4xl font-heading font-bold">500+</div>
                  <div className="text-sm text-white/70">Partner Companies</div>
                </div>
                <div className="w-px bg-white/20" />
                <div className="text-center">
                  <div className="text-4xl font-heading font-bold">5000+</div>
                  <div className="text-sm text-white/70">Successful Placements</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Placement Areas */}
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                Where We Place Our Students
              </h2>
              <p className="text-muted-foreground">
                Our extensive network spans multiple industries and sectors.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {placementAreas.map((area) => {
                const Icon = area.icon;
                return (
                  <div key={area.title} className="bg-card rounded-xl border shadow-card p-6 text-center hover:shadow-card-hover transition-all">
                    <div className="w-14 h-14 mx-auto rounded-xl gradient-primary flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div className="font-heading text-2xl font-bold text-primary mb-1">{area.count}</div>
                    <h3 className="font-semibold text-foreground mb-1">{area.title}</h3>
                    <p className="text-sm text-muted-foreground">{area.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* For Candidates */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">For Candidates</span>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
                  Complete Career Support
                </h2>
                <p className="text-muted-foreground mb-8">
                  From resume building to interview preparation, we provide end-to-end support to ensure your career success.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  {candidateServices.map((service) => {
                    const Icon = service.icon;
                    return (
                      <div key={service.title} className="flex gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{service.title}</h3>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-card rounded-2xl border shadow-card p-8">
                <h3 className="font-heading text-xl font-bold text-foreground mb-6">Apna-Style Hiring Process</h3>
                <div className="space-y-6">
                  {[
                    { step: "1", title: "Select Department", desc: "Choose IT, HR, Marketing, Design, or Nursing" },
                    { step: "2", title: "Pay Evaluation Fee (₹499)", desc: "Unlock access to entrance tests" },
                    { step: "3", title: "MCQ Round", desc: "Domain-specific multiple choice questions" },
                    { step: "4", title: "Technical Round", desc: "Coding test (IT) or case study (Non-IT)" },
                    { step: "5", title: "AI-HR Interview", desc: "Video interview evaluated by AI" },
                    { step: "6", title: "Profile Creation", desc: "Auto-created Apna-style candidate profile" },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* For Companies */}
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">For Companies & Hospitals</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
                Hire Trained Professionals
              </h2>
              <p className="text-muted-foreground">
                Partner with us to access a pool of skilled, job-ready candidates across multiple domains.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {companyServices.map((service) => {
                const Icon = service.icon;
                return (
                  <div key={service.title} className="bg-card rounded-xl border shadow-card p-6 hover:shadow-card-hover transition-all">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                    <p className="text-sm font-semibold text-healthcare mt-2">Salary: {service.salary}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="bg-primary/5 rounded-2xl border border-primary/20 p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
                    Partner With Us
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Looking for skilled IT professionals, HR specialists, marketers, designers, or nursing staff? Our trained candidates are ready to contribute from day one.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-foreground">
                      <CheckCircle2 className="h-5 w-5 text-healthcare" />
                      Pre-screened, job-ready candidates
                    </li>
                    <li className="flex items-center gap-3 text-foreground">
                      <CheckCircle2 className="h-5 w-5 text-healthcare" />
                      No placement fees for initial period
                    </li>
                    <li className="flex items-center gap-3 text-foreground">
                      <CheckCircle2 className="h-5 w-5 text-healthcare" />
                      Replacement guarantee
                    </li>
                  </ul>
                </div>
                <div className="text-center lg:text-right">
                  <Link to="/contact">
                    <Button variant="hero" size="xl">Contact for Hiring</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PlacementPage;
