import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Eye, Heart, Award, Users, Building2, GraduationCap, Briefcase, Quote } from "lucide-react";
import shikshaLogo from "@/assets/shiksha-nex-logo.png";

const stats = [
  { icon: GraduationCap, value: "5000+", label: "Students Trained" },
  { icon: Building2, value: "500+", label: "Partner Companies" },
  { icon: Award, value: "95%", label: "Placement Rate" },
  { icon: Briefcase, value: "50+", label: "Hospital Partners" },
];

const values = [
  {
    icon: Target,
    title: "Mission",
    description: "To bridge the gap between education and industry by providing practical, job-ready training programs that transform careers and empower individuals.",
  },
  {
    icon: Eye,
    title: "Vision",
    description: "To become India's leading multi-domain training and placement platform, creating skilled professionals across IT, Healthcare, HR, and Creative industries.",
  },
  {
    icon: Heart,
    title: "Values",
    description: "Excellence in training, integrity in placement support, and commitment to every student's success. We believe in nurturing talent and building futures.",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gradient-hero text-primary-foreground py-16 lg:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <img src={shikshaLogo} alt="Shiksha Nex Technologies" className="h-24 w-auto mx-auto mb-6" />
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                About Shiksha Nex Technologies
              </h1>
              <p className="text-lg text-white/80">
                Empowering careers through industry-oriented training in IT, HR, Digital Marketing, Graphic Design & Nursing.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 -mt-12 relative z-10">
          <div className="container">
            <div className="bg-card rounded-2xl border shadow-xl p-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="font-heading text-3xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Founder's Message */}
        <section className="py-16 lg:py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">Founder's Message</span>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-3">
                  SHIKSHA NEX TECHNOLOGIES OPC PVT LTD
                </h2>
              </div>
              
              <div className="bg-card rounded-3xl border shadow-xl p-8 md:p-12 relative">
                <Quote className="absolute top-6 left-6 h-12 w-12 text-primary/20" />
                
                <div className="space-y-6 text-muted-foreground leading-relaxed relative z-10">
                  <p className="text-lg font-medium text-foreground">
                    I founded Shiksha Nex Technologies OPC Pvt Ltd with one clear purpose — to transform education into real employment and dignity into every individual's life.
                  </p>
                  
                  <p>
                    Across our country, especially in rural and middle-class families, I have seen the same struggle repeated again and again: talented students with big dreams but no proper guidance, no industry exposure, and no clear path to a stable career.
                  </p>
                  
                  <p>
                    Parents dream that their children become Engineers, Doctors, Nurses, or skilled professionals — not just for status, but for security, respect, and a better future. Sadly, many of these dreams remain unfulfilled due to the gap between education and employability.
                  </p>
                  
                  <p className="font-semibold text-foreground text-lg">
                    Shiksha Nex was created to bridge this gap.
                  </p>
                  
                  <p>
                    We believe that unemployment is not caused by a lack of talent, but by a lack of the right guidance, practical training, and opportunity. That is why Shiksha Nex is built as a complete ecosystem — combining education, skill development, internships, interview preparation, and job placement under one roof.
                  </p>
                  
                  <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                    <p className="text-foreground font-medium mb-2">To us:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        <span><strong>Nursing</strong> is not just a job — it is a service.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        <span><strong>Technology</strong> is not just learning — it is empowerment.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        <span><strong>Training</strong> is not just theory — it is career readiness.</span>
                      </li>
                    </ul>
                  </div>
                  
                  <p>
                    We also understand the challenges faced by companies in hiring the right talent. Through AI-driven HR solutions and skill-based training models, we aim to connect the right people to the right opportunities — ethically, efficiently, and transparently.
                  </p>
                  
                  <p>
                    My dream is not limited to building a successful company. My dream is to help millions of people find direction, confidence, and sustainable careers, so that education truly becomes the foundation of a settled life.
                  </p>
                  
                  <p className="font-semibold text-foreground">
                    Shiksha Nex is not just an organization — it carries the dreams of parents, the ambitions of students, and the responsibility of shaping futures.
                  </p>
                  
                  <div className="bg-accent/10 rounded-xl p-6 border border-accent/20 text-center">
                    <p className="text-lg font-semibold text-accent">
                      To every learner who walks with us — If you are committed to learning, we are committed to your success.
                    </p>
                  </div>
                  
                  <p className="text-lg font-semibold text-primary text-center">
                    Together, we don't just create jobs — we create lives with purpose.
                  </p>
                </div>
                
                <div className="mt-8 pt-6 border-t text-center">
                  <p className="text-muted-foreground">Warm regards,</p>
                  <p className="text-primary font-medium">Founder & Director</p>
                  <p className="text-sm text-muted-foreground">Shiksha Nex Technologies OPC Pvt Ltd</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Story</span>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
                  Building Careers, Transforming Lives
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Shiksha Nex Technologies was founded with a simple yet powerful vision: to make quality professional training accessible to everyone and ensure every graduate finds their dream career.
                  </p>
                  <p>
                    Starting with IT training, we quickly expanded to address the growing demands across multiple industries. Today, we offer comprehensive training programs in IT, HR, Digital Marketing, Graphic Design, and Nursing - making us a one-stop platform for career development.
                  </p>
                  <p>
                    Our success lies in our industry-aligned curriculum, experienced trainers, hands-on internships, and dedicated placement support. We've partnered with over 500 companies and 50+ healthcare institutions to ensure our students get the best career opportunities.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl bg-tech/10 p-6 border border-tech/20">
                    <div className="text-tech font-heading text-4xl font-bold">6+</div>
                    <div className="text-sm text-foreground mt-1">Years of Excellence</div>
                  </div>
                  <div className="rounded-2xl bg-healthcare/10 p-6 border border-healthcare/20">
                    <div className="text-healthcare font-heading text-4xl font-bold">50+</div>
                    <div className="text-sm text-foreground mt-1">Hospital Partners</div>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="rounded-2xl bg-marketing/10 p-6 border border-marketing/20">
                    <div className="text-marketing font-heading text-4xl font-bold">30+</div>
                    <div className="text-sm text-foreground mt-1">Training Programs</div>
                  </div>
                  <div className="rounded-2xl bg-hr/10 p-6 border border-hr/20">
                    <div className="text-hr font-heading text-4xl font-bold">100+</div>
                    <div className="text-sm text-foreground mt-1">Expert Trainers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                What Drives Us
              </h2>
              <p className="text-muted-foreground">
                Our commitment to excellence and student success guides everything we do.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-card rounded-2xl border shadow-card p-8 text-center">
                    <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-6">
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-4">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
