import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, Award, CheckCircle2, ArrowRight, PlayCircle, BookOpen, Briefcase, TrendingUp, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AICourseAdvisor from "@/components/courses/AICourseAdvisor";
import { Badge } from "@/components/ui/badge";
import { courseCategories } from "@/data/courseData";

interface DBCourse {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  duration: string | null;
  price: number;
  tools_covered: string[] | null;
  has_internship: boolean | null;
  has_placement: boolean | null;
  course_categories: { name: string; slug: string } | null;
  modules: { id: string; duration_minutes: number | null }[];
}

const CoursesPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("it");
  const [dbCourses, setDbCourses] = useState<DBCourse[]>([]);
  const [loading, setLoading] = useState(true);

  const getTabKeyFromSlug = (slug: string) => {
    const map: Record<string, string> = {
      'it': 'it',
      'hr': 'hr',
      'digital-marketing': 'marketing',
      'graphic-design': 'design',
      'nursing': 'nursing'
    };
    return map[slug] || 'it';
  };

  useEffect(() => {
    if (category) {
      setActiveTab(getTabKeyFromSlug(category));
    } else {
      setActiveTab("it");
    }
  }, [category]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const slug = getCategorySlug(value);
    navigate(`/courses/${slug}`);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          id, title, slug, description, duration, price, tools_covered,
          has_internship, has_placement,
          course_categories(name, slug),
          course_modules(id, duration_minutes)
        `)
        .eq('is_active', true);
      
      if (!error && data) {
        setDbCourses(data.map(c => ({
          ...c,
          course_categories: c.course_categories as unknown as { name: string; slug: string } | null,
          modules: (c.course_modules || []) as { id: string; duration_minutes: number | null }[]
        })));
      }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const getTotalDuration = (modules: { duration_minutes: number | null }[]) => {
    const totalMins = modules.reduce((acc, m) => acc + (m.duration_minutes || 0), 0);
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const getCategorySlug = (tabKey: string) => {
    const map: Record<string, string> = {
      it: 'it',
      hr: 'hr',
      marketing: 'digital-marketing',
      design: 'graphic-design',
      nursing: 'nursing'
    };
    return map[tabKey] || tabKey;
  };

  const getFilteredDBCourses = (tabKey: string) => {
    const slug = getCategorySlug(tabKey);
    return dbCourses.filter(c => c.course_categories?.slug === slug);
  };

  const navigateToCourseDetail = (courseTitle: string) => {
    const courseSlug = courseTitle.toLowerCase().replace(/\s+/g, "-");
    navigate(`/course/${courseSlug}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gradient-hero text-primary-foreground py-16 lg:py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Our Training Programs
              </h1>
              <p className="text-lg text-white/80">
                Industry-oriented courses designed to make you job-ready.
              </p>
            </div>
          </div>
        </section>

        {/* Courses Tabs */}
        <section className="py-16 lg:py-20">
          <div className="container">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="w-full flex-wrap h-auto gap-2 bg-muted/50 p-2 rounded-xl mb-12">
                <TabsTrigger value="it" className="flex-1 min-w-[120px] data-[state=active]:bg-tech data-[state=active]:text-tech-foreground">
                  IT Courses
                </TabsTrigger>
                <TabsTrigger value="hr" className="flex-1 min-w-[120px] data-[state=active]:bg-hr data-[state=active]:text-hr-foreground">
                  HR Courses
                </TabsTrigger>
                <TabsTrigger value="marketing" className="flex-1 min-w-[120px] data-[state=active]:bg-marketing data-[state=active]:text-marketing-foreground">
                  Digital Marketing
                </TabsTrigger>
                <TabsTrigger value="design" className="flex-1 min-w-[120px] data-[state=active]:bg-design data-[state=active]:text-design-foreground">
                  Graphic Design
                </TabsTrigger>
                <TabsTrigger value="nursing" className="flex-1 min-w-[120px] data-[state=active]:bg-healthcare data-[state=active]:text-healthcare-foreground">
                  Nursing
                </TabsTrigger>
              </TabsList>

              {Object.entries(courseCategories).map(([key, category]) => {
                const filteredDBCourses = getFilteredDBCourses(key);
                
                return (
                  <TabsContent key={key} value={key} className="mt-0">
                    <div className="mb-12">
                      <h2 className={`font-heading text-2xl md:text-3xl font-bold text-${category.color} mb-2`}>
                        {category.title}
                      </h2>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>

                    {/* Database Courses with Video Duration */}
                    {filteredDBCourses.length > 0 && (
                      <div className="mb-16">
                        <div className="flex items-center gap-2 mb-8">
                          <PlayCircle className="h-5 w-5 text-primary" />
                          <h3 className="font-heading text-xl font-semibold text-foreground">Available Now with Video Classes</h3>
                          <Badge variant="secondary">Live LMS</Badge>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredDBCourses.map((course) => (
                            <div
                              key={course.id}
                              className="group bg-card rounded-2xl border shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 overflow-hidden"
                            >
                              <div className="p-6 flex flex-col h-full">
                                {/* Title and Price */}
                                <div className="mb-4">
                                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2 line-clamp-2">
                                    {course.title}
                                  </h3>
                                  <Badge className="bg-primary/10 text-primary text-xs font-medium">
                                    ₹{course.price?.toLocaleString()}
                                  </Badge>
                                </div>

                                {/* Short Description */}
                                <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                                  {course.description || "Comprehensive training program"}
                                </p>

                                {/* Key Highlights with Icons */}
                                <div className="space-y-3 mb-6 flex-grow">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                                    <span className="text-foreground font-medium">{course.duration || "Flexible"}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Users className="h-4 w-4 text-primary flex-shrink-0" />
                                    <span className="text-foreground font-medium">{course.modules.length > 0 ? `${course.modules.length} modules • ${getTotalDuration(course.modules)}` : "Self-paced"}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Award className="h-4 w-4 text-primary flex-shrink-0" />
                                    <span className="text-foreground font-medium">Industry Certification</span>
                                  </div>
                                </div>

                                {/* Tools as Tags */}
                                {course.tools_covered && course.tools_covered.length > 0 && (
                                  <div className="mb-6">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                      {course.tools_covered.slice(0, 3).map((tool) => (
                                        <Badge key={tool} variant="outline" className="text-xs">
                                          {tool}
                                        </Badge>
                                      ))}
                                      {course.tools_covered.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{course.tools_covered.length - 3}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* CTA Buttons */}
                                <div className="flex gap-3">
                                  <button
                                    onClick={() => navigateToCourseDetail(course.title)}
                                    className="flex-1 border border-primary text-primary py-2.5 rounded-lg font-medium text-sm hover:bg-primary/5 transition-colors"
                                  >
                                    View Details
                                  </button>
                                  <Link to="/apply" className="flex-1">
                                    <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors">
                                      Enroll Now
                                    </button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Static Course Cards - Premium Design */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.courses.map((course) => {
                        const badgeStyle = {
                          background: `linear-gradient(135deg, ${course.gradientFrom}, ${course.gradientTo})`,
                          boxShadow: `0 4px 15px ${course.gradientFrom}30`
                        };
                        const iconStyle = { color: course.gradientFrom };
                        const buttonStyle = {
                          background: `linear-gradient(135deg, ${course.gradientFrom}, ${course.gradientTo})`,
                          boxShadow: `0 4px 15px ${course.gradientFrom}40`
                        };

                        return (
                          <div
                            key={course.title}
                            className="group relative rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl bg-white border border-gray-100"
                          >
                            {/* Content */}
                            <div className="p-8 flex flex-col h-full">
                              {/* Badge and Price */}
                              <div className="flex items-start justify-between gap-4 mb-4">
                                <div>
                                  <h3 className="font-heading text-xl font-bold text-foreground line-clamp-2 mb-2">
                                    {course.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {course.shortDesc}
                                  </p>
                                </div>
                                {course.badge && (
                                  <div
                                    className="px-3 py-1.5 rounded-full text-white text-xs font-bold whitespace-nowrap flex-shrink-0"
                                    style={badgeStyle}
                                  >
                                    {course.badge}
                                  </div>
                                )}
                              </div>

                              {/* Price Display */}
                              <div className="mb-6">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-3xl font-bold" style={{ color: course.gradientFrom }}>
                                    ₹{course.price?.toLocaleString()}
                                  </span>
                                  {course.originalPrice && (
                                    <span className="text-lg text-gray-400 line-through">
                                      ₹{course.originalPrice?.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Key Metrics with Icons */}
                              <div className="space-y-3 mb-6 flex-grow">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: `${course.gradientFrom}20` }}
                                  >
                                    <Clock className="h-5 w-5" style={iconStyle} />
                                  </div>
                                  <span className="text-sm font-medium text-foreground">{course.duration}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: `${course.gradientFrom}20` }}
                                  >
                                    <Users className="h-5 w-5" style={iconStyle} />
                                  </div>
                                  <span className="text-sm font-medium text-foreground">{course.students} Students</span>
                                </div>

                                {course.hours && (
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                      style={{ background: `${course.gradientFrom}20` }}
                                    >
                                      <BookOpen className="h-5 w-5" style={iconStyle} />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">{course.hours} Hours • {course.lessons} Lessons</span>
                                  </div>
                                )}

                                {course.salaryPotential && (
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                      style={{ background: `${course.gradientFrom}20` }}
                                    >
                                      <TrendingUp className="h-5 w-5" style={iconStyle} />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">{course.salaryPotential}</span>
                                  </div>
                                )}
                              </div>

                              {/* Features */}
                              <div className="space-y-2 mb-6">
                                {course.features.slice(0, 2).map((feature) => (
                                  <div key={feature} className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={iconStyle} />
                                    <span className="text-sm font-medium text-foreground">{feature}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Tools as Tags */}
                              <div className="mb-6">
                                <div className="flex flex-wrap gap-2">
                                  {course.tools.slice(0, 4).map((tool) => (
                                    <span
                                      key={tool}
                                      className="px-3 py-1.5 text-xs font-semibold rounded-full text-white"
                                      style={{
                                        background: `linear-gradient(135deg, ${course.gradientFrom}, ${course.gradientTo})`,
                                        opacity: 0.9
                                      }}
                                    >
                                      {tool}
                                    </span>
                                  ))}
                                  {course.tools.length > 4 && (
                                    <span className="px-3 py-1.5 text-xs font-semibold rounded-full border-2" style={{ borderColor: course.gradientFrom, color: course.gradientFrom }}>
                                      +{course.tools.length - 4}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* CTA Buttons */}
                              <div className="flex gap-3">
                                <button
                                  onClick={() => navigateToCourseDetail(course.title)}
                                  className="flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:opacity-80"
                                  style={{
                                    color: course.gradientFrom,
                                    borderColor: course.gradientFrom,
                                    border: '2px solid'
                                  }}
                                >
                                  View Details
                                </button>
                                <Link to="/apply" className="flex-1">
                                  <button
                                    className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:shadow-xl"
                                    style={buttonStyle}
                                  >
                                    Enroll Now
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        </section>

        {/* AI Course Advisor */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Need Course Guidance?
                </h2>
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  Get personalized recommendations based on your interests, skills, and career goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="tel:+919876543210">
                    <Button variant="outline" size="lg" className="gap-2">
                      <Briefcase className="h-4 w-4" />
                      Call Counselor
                    </Button>
                  </a>
                </div>
              </div>
              <AICourseAdvisor />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CoursesPage;
