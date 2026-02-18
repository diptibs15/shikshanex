import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, LogIn } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import shikshaLogo from "@/assets/shiksha-nex-logo.png";

const courses = [
  { title: "IT Training", href: "/courses/it", description: "Java, Python, AI/ML, Cloud & more" },
  { title: "HR Training", href: "/courses/hr", description: "HR Generalist, Recruiter, Payroll" },
  { title: "Digital Marketing", href: "/courses/digital-marketing", description: "SEO, SMM, Google Ads, Analytics" },
  { title: "Graphic Design", href: "/courses/graphic-design", description: "Photoshop, Illustrator, UI/UX" },
  { title: "Nursing Training", href: "/courses/nursing", description: "Clinical Training, ICU, Emergency Care" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={shikshaLogo} alt="Shiksha Nex Technologies" className="h-12 w-auto" />
          <div className="hidden sm:block">
            <span className="text-lg font-heading font-bold text-foreground">Shiksha Nex</span>
            <span className="block text-xs text-muted-foreground">Technologies OPC Pvt Ltd</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link 
            to="/" 
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive("/") ? "text-primary bg-primary/5" : "text-foreground/80 hover:text-primary hover:bg-primary/5"
            )}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive("/about") ? "text-primary bg-primary/5" : "text-foreground/80 hover:text-primary hover:bg-primary/5"
            )}
          >
            About Us
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium bg-transparent">
                  Courses
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {courses.map((course) => (
                      <li key={course.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={course.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-accent focus:bg-accent/10 focus:text-accent"
                          >
                            <div className="text-sm font-medium leading-none">{course.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {course.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                    <li className="col-span-2 border-t pt-3">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/courses"
                          className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                        >
                          View All Courses <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link 
            to="/placement" 
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive("/placement") ? "text-primary bg-primary/5" : "text-foreground/80 hover:text-primary hover:bg-primary/5"
            )}
          >
            Placement Services
          </Link>
          <Link 
            to="/careers" 
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive("/careers") ? "text-primary bg-primary/5" : "text-foreground/80 hover:text-primary hover:bg-primary/5"
            )}
          >
            Careers
          </Link>
          <Link 
            to="/contact" 
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive("/contact") ? "text-primary bg-primary/5" : "text-foreground/80 hover:text-primary hover:bg-primary/5"
            )}
          >
            Contact
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden sm:block">
              <Button variant="outline">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <Link to="/auth" onClick={(e) => e.currentTarget.blur()}>
                <DropdownMenuItem className="cursor-pointer">
                  <span>Student Login</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/employer/auth" onClick={(e) => e.currentTarget.blur()}>
                <DropdownMenuItem className="cursor-pointer">
                  <span>Employer Login</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link to="/admin/auth" onClick={(e) => e.currentTarget.blur()}>
                <DropdownMenuItem className="cursor-pointer text-amber-600">
                  <span>Admin Login</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-card animate-fade-in">
          <nav className="container py-4 flex flex-col gap-2">
            <Link 
              to="/" 
              className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <div className="px-4 py-2">
              <span className="text-sm font-semibold text-muted-foreground">Courses</span>
              <div className="mt-2 ml-2 flex flex-col gap-1">
                {courses.map((course) => (
                  <Link
                    key={course.title}
                    to={course.href}
                    className="px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {course.title}
                  </Link>
                ))}
              </div>
            </div>
            <Link 
              to="/placement" 
              className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Placement Services
            </Link>
            <Link 
              to="/careers" 
              className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Careers
            </Link>
            <Link
              to="/contact"
              className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>

            <div className="border-t pt-3 mt-3">
              <div className="text-sm font-semibold text-muted-foreground px-4 mb-2">Login</div>
              <Link
                to="/auth"
                className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium block"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Student Login
              </Link>
              <Link
                to="/employer/auth"
                className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium block"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Employer Login
              </Link>
              <Link
                to="/admin/auth"
                className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium block text-amber-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Login
              </Link>
            </div>

            <Link
              to="/apply"
              className="mt-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Button variant="accent" className="w-full" size="lg">
                Apply Now
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
