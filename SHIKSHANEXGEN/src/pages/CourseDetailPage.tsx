import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Award,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  TrendingUp,
  BookOpen,
  Star,
  ArrowLeft,
  Users,
  BarChart3,
  Zap,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { courseCategories } from "@/data/courseData";

type CourseData = {
  title: string;
  duration: string;
  students: string;
  tools: string[];
  features: string[];
  shortDesc: string;
  aboutCourse: string;
  benefits?: string[];
  careerOpportunities?: string[];
  salaryPotential?: string;
};

const CourseDetailPage = () => {
  const { courseTitle } = useParams();
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [showAllTools, setShowAllTools] = useState(false);

  let selectedCourse: CourseData | null = null;
  let category: any = null;

  for (const [key, catData] of Object.entries(courseCategories)) {
    const found = (catData as any).courses.find(
      (c: CourseData) => c.title.toLowerCase().replace(/\s+/g, "-") === courseTitle?.toLowerCase()
    );
    if (found) {
      selectedCourse = found;
      category = catData;
      break;
    }
  }

  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="py-16">
          <div className="container text-center">
            <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
            <Link to="/courses/it">
              <Button variant="hero">Back to Courses</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const syllabus = [
    { title: "Module 1: Java Fundamentals", duration: "2 weeks" },
    { title: "Module 2: Spring Boot Essentials", duration: "3 weeks" },
    { title: "Module 3: Frontend with React", duration: "3 weeks" },
    { title: "Module 4: Database & APIs", duration: "2 weeks" },
    { title: "Module 5: AI Integration", duration: "2 weeks" },
    { title: "Module 6: Live Projects", duration: "4 weeks" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Gradient Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
          <div className="container relative py-12 lg:py-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left: Course Info */}
              <div>
                <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  {selectedCourse.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {selectedCourse.shortDesc}
                </p>

                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <div>
                      <p className="text-sm font-medium text-foreground">4.8 Rating</p>
                      <p className="text-xs text-muted-foreground">300+ Students</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">120 Hours</p>
                      <p className="text-xs text-muted-foreground">Self-paced</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">60 Lessons</p>
                      <p className="text-xs text-muted-foreground">Video + Materials</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Beginner to Advanced</p>
                      <p className="text-xs text-muted-foreground">Progressive Learning</p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <Link to="/apply">
                  <Button size="lg" className="w-full gap-2">
                    Enroll Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Right: Price Card */}
              <div className="bg-card rounded-2xl border shadow-lg p-8 h-fit sticky top-24">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-foreground">₹14,999</span>
                    <span className="text-lg text-muted-foreground line-through">₹29,999</span>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/20">
                    50% OFF
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">Lifetime Access</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">24/7 Doubt Support</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">Certificate of Completion</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">Job Placement Support</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <p className="text-xs text-muted-foreground mb-3">Salary Range:</p>
                  <p className="text-2xl font-bold text-success">₹4–8 LPA</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Overview */}
        <section className="py-12">
          <div className="container max-w-4xl">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Course Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              {selectedCourse.aboutCourse}
            </p>
          </div>
        </section>

        {/* Key Highlights - Icon Grid (4 items) */}
        <section className="py-12 bg-muted/30">
          <div className="container max-w-4xl">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8">What You'll Get</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border p-6">
                <Zap className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Live Industry Projects</h3>
                <p className="text-sm text-muted-foreground">
                  Work on real-world projects similar to industry standards
                </p>
              </div>
              <div className="bg-card rounded-xl border p-6">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Internship Support</h3>
                <p className="text-sm text-muted-foreground">
                  Guided internship opportunities with mentorship programs
                </p>
              </div>
              <div className="bg-card rounded-xl border p-6">
                <Target className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">AI Integration Modules</h3>
                <p className="text-sm text-muted-foreground">
                  Learn to integrate AI features into web applications
                </p>
              </div>
              <div className="bg-card rounded-xl border p-6">
                <Award className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">100% Placement Assistance</h3>
                <p className="text-sm text-muted-foreground">
                  Resume building, interview prep, and job placement support
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Covered */}
        <section className="py-12">
          <div className="container max-w-4xl">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-6">Tools & Technologies</h2>
            <div className="flex flex-wrap gap-3">
              {(showAllTools ? selectedCourse.tools : selectedCourse.tools.slice(0, 5)).map((tool) => (
                <Badge key={tool} variant="secondary" className="px-4 py-2 text-sm font-medium">
                  {tool}
                </Badge>
              ))}
              {selectedCourse.tools.length > 5 && !showAllTools && (
                <button
                  onClick={() => setShowAllTools(true)}
                  className="px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
                >
                  +{selectedCourse.tools.length - 5} more
                </button>
              )}
              {showAllTools && selectedCourse.tools.length > 5 && (
                <button
                  onClick={() => setShowAllTools(false)}
                  className="px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
                >
                  Show Less
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Career Outcomes */}
        <section className="py-12 bg-muted/30">
          <div className="container max-w-4xl">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-6">Career Opportunities</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {selectedCourse.careerOpportunities?.map((opportunity) => (
                <div key={opportunity} className="bg-card rounded-xl border p-6">
                  <Briefcase className="h-6 w-6 text-primary mb-3" />
                  <p className="font-semibold text-foreground text-sm">{opportunity}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Accordion Syllabus */}
        <section className="py-12">
          <div className="container max-w-4xl">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-6">Course Syllabus</h2>
            <div className="space-y-3">
              {syllabus.map((item, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl border overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.duration}</p>
                      </div>
                    </div>
                    {expandedIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  {expandedIndex === index && (
                    <div className="px-6 pb-6 border-t bg-muted/20">
                      <p className="text-sm text-muted-foreground">
                        In-depth training on {item.title.split(":")[1]} with hands-on exercises and practical projects.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Strong CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <div className="container max-w-4xl text-center">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Ready to Master Full Stack Development with AI?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join 300+ students and transform your career with industry-ready skills
            </p>
            <Link to="/apply">
              <Button size="lg" className="gap-2 text-base px-8">
                Enroll Now - ₹14,999 <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-6">
              Limited Time: 50% OFF on all enrollments
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetailPage;
