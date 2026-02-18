import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 lg:py-28 gradient-hero text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
            Join thousands of successful professionals who kickstarted their careers with Shiksha Nex Technologies.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/apply">
              <Button variant="accent" size="xl" className="group w-full sm:w-auto">
                Apply Now - Start Learning
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="tel:+919876543210">
              <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                <Phone className="h-5 w-5" />
                Talk to Counselor
              </Button>
            </a>
          </div>
          
          <p className="mt-8 text-sm text-white/60">
            No registration fee • Flexible payment options • Job guarantee*
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
