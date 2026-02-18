import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, Award, CheckCircle2, ArrowRight, PlayCircle, BookOpen } from "lucide-react";
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
                Industry-oriented courses designed to make you job-ready. Choose from IT, HR, Digital Marketing, Graphic Design, and Nursing programs.
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
                    <div className="mb-8">
                      <h2 className={`font-heading text-2xl md:text-3xl font-bold text-${category.color} mb-2`}>
                        {category.title}
                      </h2>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>

                    {/* Database Courses with Video Duration */}
                    {filteredDBCourses.length > 0 && (
                      <div className="mb-12">
                        <div className="flex items-center gap-2 mb-6">
                          <PlayCircle className="h-5 w-5 text-primary" />
                          <h3 className="font-heading text-xl font-semibold text-foreground">Available Now with Video Classes</h3>
                          <Badge variant="secondary">Live LMS</Badge>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredDBCourses.map((course) => (
                            <div
                              key={course.id}
                              className="bg-card rounded-xl border-2 border-primary/20 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
                            >
                              <div className="p-6">
                                <div className="flex items-start justify-between mb-3 gap-4">
                                  <h3 className="font-heading text-lg font-semibold text-foreground">
                                    {course.title}
                                  </h3>
                                  <div className="flex-shrink-0">
                                    <Badge className="bg-primary/10 text-primary text-xs">
                                      ₹{course.price?.toLocaleString()}
                                    </Badge>
                                  </div>
                                </div>

                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                  {course.description || "Comprehensive course designed to enhance your skills"}
                                </p>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    <span>{course.duration || "Flexible"}</span>
                                  </div>
                                  {course.modules.length > 0 && (
                                    <div className="flex items-center gap-1.5">
                                      <PlayCircle className="h-4 w-4 text-primary" />
                                      <span className="text-primary font-medium">
                                        {course.modules.length} modules • {getTotalDuration(course.modules)}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {course.tools_covered && course.tools_covered.length > 0 && (
                                  <div className="mb-4">
                                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Tools Covered</div>
                                    <div className="flex flex-wrap gap-2">
                                      {course.tools_covered.slice(0, 4).map((tool) => (
                                        <span key={tool} className={`px-2 py-1 text-xs rounded-md bg-${category.color}/10 text-${category.color}`}>
                                          {tool}
                                        </span>
                                      ))}
                                      {course.tools_covered.length > 4 && (
                                        <span className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground">
                                          +{course.tools_covered.length - 4} more
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  {course.has_internship && (
                                    <div className="flex items-center gap-2 text-sm text-foreground">
                                      <CheckCircle2 className={`h-4 w-4 text-${category.color}`} />
                                      <span>Internship Included</span>
                                    </div>
                                  )}
                                  {course.has_placement && (
                                    <div className="flex items-center gap-2 text-sm text-foreground">
                                      <CheckCircle2 className={`h-4 w-4 text-${category.color}`} />
                                      <span>Placement Support</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="px-6 py-4 bg-primary/5 border-t border-primary/20 flex items-center justify-between">
                                <button
                                  onClick={() => navigateToCourseDetail(course.title)}
                                  className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline cursor-pointer"
                                  aria-label={`View description for ${course.title}`}
                                >
                                  <BookOpen className="h-4 w-4" />
                                  <span>View Description</span>
                                </button>
                                <Link to="/apply" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                                  Enroll Now <ArrowRight className="h-3 w-3" />
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Static Course Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.courses.map((course) => (
                        <div
                          key={course.title}
                          className="bg-card rounded-xl border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
                        >
                          <div className="p-6">
                            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                              {course.title}
                            </h3>

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

                            <div className="mb-4">
                              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Tools Covered</div>
                              <div className="flex flex-wrap gap-2">
                                {course.tools.map((tool) => (
                                  <span key={tool} className={`px-2 py-1 text-xs rounded-md bg-${category.color}/10 text-${category.color}`}>
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              {course.features.map((feature) => (
                                <div key={feature} className="flex items-center gap-2 text-sm text-foreground">
                                  <CheckCircle2 className={`h-4 w-4 text-${category.color}`} />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="px-6 py-4 bg-muted/30 border-t flex items-center justify-between">
                            <button
                              onClick={() => navigateToCourseDetail(course.title)}
                              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline cursor-pointer"
                              aria-label={`View description for ${course.title}`}
                            >
                              <BookOpen className="h-4 w-4" />
                              <span>View Description</span>
                            </button>
                            <Link to="/apply" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                              Enroll Now <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
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
                  Not Sure Which Course to Choose?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Let our AI-powered career advisor recommend the perfect courses based on your interests, qualifications, and career goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="tel:+919876543210">
                    <Button variant="outline" size="lg">Call Counselor</Button>
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
