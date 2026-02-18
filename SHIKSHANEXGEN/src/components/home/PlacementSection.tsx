import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Stethoscope, Briefcase, Megaphone, PenTool, CheckCircle2 } from "lucide-react";

const placementAreas = [
  { icon: Building2, title: "IT Companies", description: "Top tech companies & startups" },
  { icon: Briefcase, title: "HR & Corporate Offices", description: "MNCs & Corporate firms" },
  { icon: Megaphone, title: "Digital Marketing Agencies", description: "Creative & performance agencies" },
  { icon: PenTool, title: "Design Studios", description: "Branding & design agencies" },
  { icon: Stethoscope, title: "Hospitals & Clinics", description: "Healthcare institutions" },
];

const features = [
  "Resume Building & Portfolio Support",
  "Mock Interviews & Preparation",
  "Direct Job Referrals",
  "500+ Partner Companies",
  "50+ Hospital Partners",
  "95% Placement Success Rate",
];

const PlacementSection = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Career Support</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
              Placement Assistance That Works
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              We provide comprehensive placement support across IT companies, hospitals, clinics, home care centers, and corporate offices. Our dedicated placement team ensures you land your dream job.
            </p>
            
            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-healthcare flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
            
            <Link to="/placement">
              <Button variant="hero" size="lg">
                Learn More About Placements
              </Button>
            </Link>
          </div>
          
          {/* Right - Placement Areas */}
          <div className="grid gap-4">
            {placementAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <div
                  key={area.title}
                  className="flex items-center gap-5 p-5 rounded-xl bg-card border shadow-card hover:shadow-card-hover transition-all hover:-translate-x-1"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <Icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">{area.title}</h3>
                    <p className="text-sm text-muted-foreground">{area.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlacementSection;
