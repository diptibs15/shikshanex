import { Link } from "react-router-dom";
import { Monitor, Users, TrendingUp, Palette, Heart, Briefcase, Calendar, Award } from "lucide-react";

const domains = [
  {
    icon: Monitor,
    title: "IT Training",
    description: "Java, Python, AI/ML, Data Science, AWS & Cyber Security",
    href: "/courses/it",
    color: "tech",
    bgColor: "bg-tech/10",
    borderColor: "border-tech/20",
    iconColor: "text-tech",
    duration: "3-12 Months",
    hasInternship: true,
  },
  {
    icon: Users,
    title: "HR Training",
    description: "HR Generalist, Recruiter, Payroll & Compliance. Earn ₹10K-20K/month!",
    href: "/hr-training",
    color: "hr",
    bgColor: "bg-hr/10",
    borderColor: "border-hr/20",
    iconColor: "text-hr",
    duration: "3-6 Months",
    hasInternship: true,
    highlight: "Earn While Learning",
  },
  {
    icon: TrendingUp,
    title: "Digital Marketing",
    description: "SEO, Social Media, Google Ads, Content & Email Marketing",
    href: "/courses/digital-marketing",
    color: "marketing",
    bgColor: "bg-marketing/10",
    borderColor: "border-marketing/20",
    iconColor: "text-marketing",
    duration: "3-6 Months",
    hasInternship: true,
  },
  {
    icon: Palette,
    title: "Graphic Design",
    description: "Photoshop, Illustrator, UI/UX, Branding & Portfolio Development",
    href: "/courses/graphic-design",
    color: "design",
    bgColor: "bg-design/10",
    borderColor: "border-design/20",
    iconColor: "text-design",
    duration: "3-6 Months",
    hasInternship: true,
  },
  {
    icon: Heart,
    title: "Nursing Training",
    description: "ICU, Emergency Care, Patient Documentation. For GNM/ANM/B.Sc/M.Sc",
    href: "/courses/nursing",
    color: "healthcare",
    bgColor: "bg-healthcare/10",
    borderColor: "border-healthcare/20",
    iconColor: "text-healthcare",
    duration: "3-6 Months",
    hasInternship: true,
  },
];

const TrainingDomains = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Verticals</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Training Domains We Offer
          </h2>
          <p className="text-muted-foreground">
            Choose from our diverse range of industry-oriented training programs designed to launch and accelerate your career.
          </p>
        </div>

        {/* Domains Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {domains.map((domain, index) => {
            const Icon = domain.icon;
            return (
              <Link
                key={domain.title}
                to={domain.href}
                className="group relative p-6 rounded-2xl border bg-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Highlight Badge */}
                {domain.highlight && (
                  <div className="absolute top-0 right-0 bg-healthcare text-white text-xs px-2 py-1 rounded-bl-lg font-medium">
                    {domain.highlight}
                  </div>
                )}
                
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${domain.bgColor} ${domain.borderColor} border flex items-center justify-center mb-5 transition-transform group-hover:scale-110`}>
                  <Icon className={`h-7 w-7 ${domain.iconColor}`} />
                </div>
                
                {/* Content */}
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {domain.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {domain.description}
                </p>
                
                {/* Duration & Internship Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
                    <Calendar className="h-3 w-3" />
                    {domain.duration}
                  </span>
                  {domain.hasInternship && (
                    <span className="inline-flex items-center gap-1 text-xs bg-healthcare/10 text-healthcare px-2 py-1 rounded-full">
                      <Briefcase className="h-3 w-3" />
                      Internship
                    </span>
                  )}
                </div>
                
                {/* Hover Accent */}
                <div className={`absolute inset-x-0 bottom-0 h-1 rounded-b-2xl bg-${domain.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </Link>
            );
          })}
        </div>
        
        {/* Unified Info Banner */}
        <div className="mt-12 bg-muted/50 rounded-2xl p-6 lg:p-8">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground">Course Duration</h4>
              <p className="text-sm text-muted-foreground">3 / 6 / 12 Months</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-healthcare/10 flex items-center justify-center mb-3">
                <Briefcase className="h-6 w-6 text-healthcare" />
              </div>
              <h4 className="font-semibold text-foreground">Internship Duration</h4>
              <p className="text-sm text-muted-foreground">1-6 Months (Mandatory)</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-hr/10 flex items-center justify-center mb-3">
                <Award className="h-6 w-6 text-hr" />
              </div>
              <h4 className="font-semibold text-foreground">Placement Support</h4>
              <p className="text-sm text-muted-foreground">100% Assistance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainingDomains;
