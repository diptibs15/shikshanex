import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">SN</span>
              </div>
              <div>
                <span className="text-lg font-heading font-bold">Shiksha Nex</span>
                <span className="block text-xs text-muted-foreground">Technologies</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Empowering careers through industry-oriented training in IT, HR, Digital Marketing, Graphic Design & Nursing.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/courses" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Courses</Link></li>
              <li><Link to="/placement" className="text-sm text-muted-foreground hover:text-primary transition-colors">Placement Services</Link></li>
              <li><Link to="/careers" className="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Training Programs */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Training Programs</h3>
            <ul className="space-y-3">
              <li><Link to="/courses/it" className="text-sm text-muted-foreground hover:text-tech transition-colors">IT Training</Link></li>
              <li><Link to="/courses/hr" className="text-sm text-muted-foreground hover:text-hr transition-colors">HR Training</Link></li>
              <li><Link to="/courses/digital-marketing" className="text-sm text-muted-foreground hover:text-marketing transition-colors">Digital Marketing</Link></li>
              <li><Link to="/courses/graphic-design" className="text-sm text-muted-foreground hover:text-design transition-colors">Graphic Design</Link></li>
              <li><Link to="/courses/nursing" className="text-sm text-muted-foreground hover:text-healthcare transition-colors">Nursing Training</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  123 Tech Park, Electronic City<br />
                  Bangalore, Karnataka 560001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="tel:+919876543210" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="mailto:info@shikshanex.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  info@shikshanex.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t border-background/10">
        <div className="container py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Shiksha Nex Technologies. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
