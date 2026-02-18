import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  TrendingUp,
  BookOpen,
  Star,
  ArrowLeft,
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

  // Find course from all categories
  let selectedCourse: CourseData | null = null;
  let category: any = null;
  let categoryKey = "";

  for (const [key, catData] of Object.entries(courseCategories)) {
    const found = (catData as any).courses.find(
      (c: CourseData) => c.title.toLowerCase().replace(/\s+/g, "-") === courseTitle?.toLowerCase()
    );
    if (found) {
      selectedCourse = found;
      category = catData;
      categoryKey = key;
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
            <p className="text-muted-foreground mb-8">
              The course you're looking for doesn't exist.
            </p>
            <Link to="/courses/it">
              <Button variant="hero">Back to Courses</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="gradient-hero text-primary-foreground py-12 lg:py-16">
          <div className="container">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="max-w-4xl">
              <div className="flex items-start justify-between mb-4 gap-4">
                <div>
                  <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                    {selectedCourse.title}
                  </h1>
                  <p className="text-lg text-white/80 max-w-2xl">
                    {selectedCourse.shortDesc}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Clock className="h-5 w-5 mb-2" />
                  <p className="text-sm text-white/70">Duration</p>
                  <p className="font-semibold text-white">{selectedCourse.duration}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Users className="h-5 w-5 mb-2" />
                  <p className="text-sm text-white/70">Students</p>
                  <p className="font-semibold text-white">{selectedCourse.students}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Award className="h-5 w-5 mb-2" />
                  <p className="text-sm text-white/70">Certification</p>
                  <p className="font-semibold text-white">Included</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Star className="h-5 w-5 mb-2" />
                  <p className="text-sm text-white/70">Industry Ready</p>
                  <p className="font-semibold text-white">Job Ready</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 lg:py-20">
          <div className="container max-w-4xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* About Course */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-primary rounded-full"></div>
                    <h2 className="text-3xl font-bold text-foreground">Course Overview</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {selectedCourse.aboutCourse}
                  </p>
                </div>

                {/* Key Benefits */}
                {selectedCourse?.benefits && selectedCourse.benefits.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1 h-8 bg-primary rounded-full"></div>
                      <h2 className="text-3xl font-bold text-foreground">Key Benefits</h2>
                    </div>
                    <div className="grid gap-3">
                      {selectedCourse.benefits.map((benefit: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/30 transition-all"
                        >
                          <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tools Covered */}
                {selectedCourse?.tools && selectedCourse.tools.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1 h-8 bg-primary rounded-full"></div>
                      <h2 className="text-3xl font-bold text-foreground">Tools & Technologies</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {selectedCourse.tools.map((tool: string) => (
                        <Badge
                          key={tool}
                          className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary border border-primary/30"
                        >
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Career Opportunities */}
                {selectedCourse?.careerOpportunities &&
                  selectedCourse.careerOpportunities.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-primary rounded-full"></div>
                        <h2 className="text-3xl font-bold text-foreground">
                          Career Opportunities
                        </h2>
                      </div>
                      <div className="grid gap-3">
                        {selectedCourse.careerOpportunities.map(
                          (opportunity: string, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-start gap-4 p-4 rounded-lg bg-secondary/5 border border-secondary/10 hover:border-secondary/30 transition-all"
                            >
                              <Briefcase className="h-6 w-6 text-secondary flex-shrink-0 mt-0.5" />
                              <span className="text-foreground font-medium">{opportunity}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Sidebar Cards */}
              {selectedCourse && (
                <div className="sticky top-24 space-y-6">
                    {/* Salary Card */}
                    {selectedCourse.salaryPotential && (
                      <div className="bg-gradient-to-br from-success/10 to-success/5 border-2 border-success/30 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="h-6 w-6 text-success" />
                          <h3 className="text-lg font-bold text-foreground">Salary Potential</h3>
                        </div>
                        <p className="text-3xl font-bold text-success mb-2">
                          {selectedCourse.salaryPotential}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Entry level salaries after course completion
                        </p>
                      </div>
                    )}

                    {/* Course Features */}
                    <div className="bg-card rounded-2xl border shadow-card p-6 space-y-4">
                      <h3 className="text-lg font-bold text-foreground">Course Features</h3>
                      <div className="space-y-3">
                        {selectedCourse.features.map((feature: string) => (
                          <div key={feature} className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                            <span className="text-sm text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                      <Link to="/apply" className="block">
                        <Button variant="hero" size="lg" className="w-full">
                          Enroll Now <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                      <a href="tel:+919876543210">
                        <Button variant="outline" size="lg" className="w-full">
                          Call Counselor
                        </Button>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related Courses Section */}
        {category && (
          <section className="py-16 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl font-bold text-foreground mb-8">Other {(category as any).title}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(category as any).courses
                  .filter((c: CourseData) => c.title !== selectedCourse?.title)
                  .slice(0, 3)
                  .map((course: CourseData) => (
                    <div
                      key={course.title}
                      className="bg-card rounded-xl border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer"
                      onClick={() => {
                        const courseSlug = course.title.toLowerCase().replace(/\s+/g, "-");
                        navigate(`/course/${courseSlug}`);
                      }}
                    >
                      <div className="p-6">
                        <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {course.shortDesc}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4" />
                            <span>{course.students}</span>
                          </div>
                        </div>
                      </div>
                      <div className="px-6 py-4 bg-muted/30 border-t">
                        <button className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                          Learn More <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetailPage;
