import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden gradient-hero text-primary-foreground">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container relative py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-healthcare animate-pulse" />
            <span className="text-sm font-medium">Now Offering 5 Major Training Verticals</span>
          </div>
          
          {/* Headline */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            One Unified Platform for{" "}
            <span className="text-tech">IT</span>,{" "}
            <span className="text-hr">HR</span>,{" "}
            <span className="text-marketing">Digital Marketing</span>,{" "}
            <span className="text-design">Graphic Design</span> &{" "}
            <span className="text-healthcare">Nursing</span> Careers
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Industry-Oriented Training | Internship | Placement Assistance
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/apply">
              <Button variant="accent" size="xl" className="group">
                Apply Now
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="heroOutline" size="xl">
                Explore Courses
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-white/10 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div>
              <div className="text-3xl md:text-4xl font-heading font-bold">5000+</div>
              <div className="text-sm text-white/70 mt-1">Students Trained</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-heading font-bold">500+</div>
              <div className="text-sm text-white/70 mt-1">Partner Companies</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-heading font-bold">95%</div>
              <div className="text-sm text-white/70 mt-1">Placement Rate</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-heading font-bold">50+</div>
              <div className="text-sm text-white/70 mt-1">Hospital Partners</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
