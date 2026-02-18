import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, Award, CheckCircle2, ArrowRight, PlayCircle, ChevronDown, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AICourseAdvisor from "@/components/courses/AICourseAdvisor";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const courseCategories = {
  it: {
    title: "IT Training Courses",
    description: "Master the latest technologies and frameworks",
    color: "tech",
    courses: [
      {
        title: "Java Full Stack with AI",
        duration: "6 Months",
        students: "500+",
        tools: ["Java", "Spring Boot", "React", "MySQL"],
        features: ["Live Projects", "Internship", "Placement"],
        shortDesc: "End-to-end training in Java-based full stack application development.",
        aboutCourse: "This course covers core Java, Spring Boot, REST APIs, databases, and modern frontend technologies. Learners will build full stack web applications, understand backend architecture, API integration, and deployment practices used in enterprise environments.",
        benefits: [
          "Master enterprise-level Java development with Spring Boot framework",
          "Build complete web applications from backend to frontend",
          "Hands-on experience with REST APIs and database design",
          "Work on live projects similar to industry standards",
          "100% internship and placement assistance guaranteed"
        ]
      },
      {
        title: "Python Full Stack with AI",
        duration: "6 Months",
        students: "450+",
        tools: ["Python", "Django", "React", "PostgreSQL"],
        features: ["Live Projects", "Internship", "Placement"],
        shortDesc: "Full stack development using Python and modern frameworks.",
        aboutCourse: "This program includes Python fundamentals, Django/Flask, REST APIs, databases, and frontend integration. Learners will work on real-world projects and gain experience in building scalable web applications.",
        benefits: [
          "Learn Python from basics to advanced web development",
          "Master Django and Flask frameworks for rapid development",
          "Build scalable and maintainable web applications",
          "Integrate frontend and backend with modern tools",
          "Job-ready skills with career support and placement"
        ]
      },
      {
        title: "AI / Machine Learning with AI",
        duration: "4 Months",
        students: "300+",
        tools: ["Python", "TensorFlow", "Scikit-learn", "Pandas"],
        features: ["Research Projects", "Internship", "Placement"],
        shortDesc: "Introduction to artificial intelligence and machine learning.",
        aboutCourse: "This course covers ML algorithms, model building, data preprocessing, and AI use cases. Learners will work on predictive models and real-world AI applications.",
        benefits: [
          "Understand core machine learning algorithms and their applications",
          "Build predictive models using TensorFlow and Scikit-learn",
          "Work with real datasets and perform data preprocessing",
          "Develop AI solutions for real-world problems",
          "Certification and placement support in AI/ML roles"
        ]
      },
      {
        title: "Data Analytics with AI",
        duration: "3 Months",
        students: "400+",
        tools: ["Python", "SQL", "Tableau", "Power BI"],
        features: ["Case Studies", "Internship", "Placement"],
        shortDesc: "Practical data analysis and visualization program.",
        aboutCourse: "Covers data cleaning, analysis, visualization, and reporting using tools like Excel, SQL, Python, and BI dashboards. Learners will analyze datasets and derive actionable insights for business decision-making.",
        benefits: [
          "Master data analysis and visualization tools (Tableau, Power BI)",
          "Learn SQL for database querying and manipulation",
          "Create compelling data dashboards for business insights",
          "Analyze real-world datasets and derive actionable insights",
          "Fast-track your career in data analytics with placement support"
        ]
      },
      {
        title: "Data Science with AI",
        duration: "5 Months",
        students: "350+",
        tools: ["Python", "R", "ML", "Deep Learning"],
        features: ["Live Projects", "Internship", "Placement"],
        shortDesc: "Advanced data-driven problem-solving program.",
        aboutCourse: "Includes statistics, Python, machine learning, data modeling, and analytics workflows. Learners will build end-to-end data science solutions for real-world scenarios.",
        benefits: [
          "Comprehensive training in statistics and data science fundamentals",
          "Master Python, R, and ML techniques for data science",
          "Build end-to-end data science solutions from scratch",
          "Work on research projects with real datasets",
          "Access to industry mentors and 100% placement support"
        ]
      },
      {
        title: "AWS & Cloud Computing with AI",
        duration: "3 Months",
        students: "350+",
        tools: ["AWS", "Azure", "Docker", "Kubernetes"],
        features: ["Certification Prep", "Internship", "Placement"],
        shortDesc: "Cloud computing concepts with hands-on AWS training.",
        aboutCourse: "Covers cloud fundamentals, AWS services, deployment models, and cost optimization. Learners will gain practical experience in hosting applications and managing cloud infrastructure.",
        benefits: [
          "Get certified in AWS and other cloud platforms",
          "Deploy and manage applications in cloud environments",
          "Learn containerization with Docker and Kubernetes",
          "Cost optimization and security best practices in cloud",
          "High-demand skills with excellent job opportunities"
        ]
      },
      {
        title: "Cyber Security with AI",
        duration: "4 Months",
        students: "250+",
        tools: ["Kali Linux", "Wireshark", "Metasploit"],
        features: ["Lab Practice", "Internship", "Placement"],
        shortDesc: "Fundamentals of information security and cyber defense.",
        aboutCourse: "This course introduces network security, ethical hacking basics, risk management, and security best practices. Learners will understand threats, vulnerabilities, and protection mechanisms used in modern IT systems.",
        benefits: [
          "Learn ethical hacking and penetration testing techniques",
          "Understand network security and defense mechanisms",
          "Get hands-on experience with security tools and platforms",
          "Prepare for industry security certifications",
          "Secure your career with in-demand cybersecurity skills"
        ]
      },
    ],
  },
  hr: {
    title: "HR Training Programs",
    description: "Build expertise in human resource management",
    color: "hr",
    courses: [
      {
        title: "HR Generalist",
        duration: "3 Months",
        students: "300+",
        tools: ["SAP HR", "Zoho People", "Excel"],
        features: ["Practical Training", "Internship", "Placement"],
        shortDesc: "Core HR operations and people management.",
        aboutCourse: "Covers recruitment, onboarding, employee relations, performance management, and HR policies. Ideal for building a strong HR foundation.",
        benefits: [
          "Master end-to-end HR functions and processes",
          "Learn using industry-standard HRMS platforms",
          "Handle recruitment, onboarding, and employee relations",
          "Understand labor laws and HR policies",
          "Build a strong foundation for HR career growth"
        ]
      },
      {
        title: "HR Recruiter (IT & Non-IT)",
        duration: "2 Months",
        students: "400+",
        tools: ["LinkedIn Recruiter", "ATS Systems", "Job Portals"],
        features: ["Mock Sessions", "Internship", "Placement"],
        shortDesc: "Recruitment strategies for IT and non-IT roles.",
        aboutCourse: "Focuses on job analysis, sourcing, screening, interviewing, and offer management across technical and non-technical domains.",
        benefits: [
          "Specialize in both IT and non-IT recruitment",
          "Master modern sourcing and ATS systems",
          "Develop expert interviewing and negotiation skills",
          "Build talent networks and employer branding strategies",
          "Quick placement in recruitment roles"
        ]
      },
      {
        title: "Payroll & Statutory Compliance",
        duration: "2 Months",
        students: "200+",
        tools: ["Tally", "Payroll Software", "Excel"],
        features: ["Real Cases", "Internship", "Placement"],
        shortDesc: "Payroll processing and statutory compliance training.",
        aboutCourse: "Covers salary structures, payroll systems, PF, ESI, labor laws, and compliance management used in organizations.",
        benefits: [
          "Master payroll processing and management",
          "Understand statutory compliance and labor laws",
          "Handle tax calculations and deductions accurately",
          "Work with real payroll software and systems",
          "Gain expertise in high-demand payroll administration"
        ]
      },
      {
        title: "Talent Acquisition",
        duration: "2 Months",
        students: "250+",
        tools: ["Sourcing Tools", "Interview Techniques", "ATS"],
        features: ["Live Hiring", "Internship", "Placement"],
        shortDesc: "Specialized recruitment and hiring program.",
        aboutCourse: "Focuses on sourcing strategies, interview techniques, employer branding, and recruitment analytics for effective talent acquisition.",
        benefits: [
          "Develop advanced sourcing and candidate assessment skills",
          "Master recruitment analytics and metrics",
          "Build employer branding and talent pool strategies",
          "Conduct effective interviews and candidate evaluations",
          "Fast-track to talent acquisition specialist roles"
        ]
      },
      {
        title: "HR Operations",
        duration: "2 Months",
        students: "180+",
        tools: ["HRMS", "Documentation", "Policies"],
        features: ["Practical Training", "Internship", "Placement"],
        shortDesc: "Operational HR processes and administration.",
        aboutCourse: "Covers HR documentation, employee lifecycle management, HRMS usage, and internal coordination processes.",
        benefits: [
          "Master HR operations and process management",
          "Streamline employee lifecycle management",
          "Learn HRMS implementation and usage",
          "Handle HR documentation and compliance",
          "Become an HR operations specialist"
        ]
      },
    ],
  },
  marketing: {
    title: "Digital Marketing Courses",
    description: "Master online marketing and growth strategies",
    color: "marketing",
    courses: [
      {
        title: "Complete Digital Marketing",
        duration: "4 Months",
        students: "500+",
        tools: ["Google Ads", "Meta Ads", "SEO Tools", "Analytics"],
        features: ["Live Campaigns", "Internship", "Placement"],
        shortDesc: "End-to-end digital marketing program.",
        aboutCourse: "Covers SEO, social media, paid ads, content marketing, analytics, and campaign planning with hands-on projects.",
        benefits: [
          "Master all digital marketing channels from SEO to paid ads",
          "Run live campaigns and measure ROI using analytics",
          "Develop marketing strategies for real clients",
          "Get certified in Google Ads and Marketing platforms",
          "Launch your career as a Digital Marketing Specialist"
        ]
      },
      {
        title: "SEO Mastery",
        duration: "2 Months",
        students: "350+",
        tools: ["Ahrefs", "SEMrush", "Google Search Console"],
        features: ["Website Projects", "Internship", "Placement"],
        shortDesc: "Search engine optimization specialization.",
        aboutCourse: "Focuses on keyword research, on-page and off-page SEO, technical SEO, and ranking strategies.",
        benefits: [
          "Master keyword research and SEO strategy",
          "Implement on-page and technical SEO optimizations",
          "Build authoritative backlinks and domain authority",
          "Rank websites on first page of Google",
          "Become an SEO expert with proven track record"
        ]
      },
      {
        title: "Social Media Marketing",
        duration: "2 Months",
        students: "400+",
        tools: ["Meta Business", "Buffer", "Canva"],
        features: ["Brand Projects", "Internship", "Placement"],
        shortDesc: "Social media branding and engagement strategies.",
        aboutCourse: "Covers content creation, platform algorithms, analytics, and paid promotions across major social platforms.",
        benefits: [
          "Create engaging content for all social platforms",
          "Build and grow engaged online communities",
          "Master social media advertising and promotions",
          "Analyze metrics and optimize campaigns for better ROI",
          "Become a Social Media Marketing Manager"
        ]
      },
      {
        title: "Google Ads (PPC)",
        duration: "1 Month",
        students: "300+",
        tools: ["Google Ads", "Analytics", "Tag Manager"],
        features: ["Live Campaigns", "Certification", "Placement"],
        shortDesc: "Paid advertising and PPC campaign management.",
        aboutCourse: "Covers search ads, display ads, keyword bidding, ad optimization, and performance tracking.",
        benefits: [
          "Master Google Ads and PPC campaign management",
          "Learn bid strategies and optimization techniques",
          "Track conversions and measure campaign ROI",
          "Get Google Ads certification",
          "Become a PPC specialist with high earning potential"
        ]
      },
      {
        title: "Content Marketing",
        duration: "2 Months",
        students: "200+",
        tools: ["WordPress", "Copywriting", "Email Tools"],
        features: ["Portfolio Building", "Internship", "Placement"],
        shortDesc: "Content strategy and storytelling program.",
        aboutCourse: "Focuses on content planning, copywriting, blogging, email marketing, and brand storytelling.",
        benefits: [
          "Master content strategy and brand storytelling",
          "Create compelling copy that converts readers to customers",
          "Build and manage successful blogs and websites",
          "Execute email marketing campaigns effectively",
          "Build a strong content marketing portfolio"
        ]
      },
    ],
  },
  design: {
    title: "Graphic Design Courses",
    description: "Unleash your creative potential",
    color: "design",
    courses: [
      {
        title: "Adobe Photoshop",
        duration: "2 Months",
        students: "400+",
        tools: ["Photoshop", "Lightroom"],
        features: ["Project Work", "Portfolio", "Placement"],
        shortDesc: "Image editing and creative design.",
        aboutCourse: "Focuses on photo editing, retouching, compositions, and digital artwork creation.",
        benefits: [
          "Master professional photo editing and retouching",
          "Create stunning digital artwork and compositions",
          "Work with professional photographers and creatives",
          "Build a strong portfolio of design work",
          "Launch a career as a Photo Editor or Digital Artist"
        ]
      },
      {
        title: "Adobe Illustrator",
        duration: "2 Months",
        students: "350+",
        tools: ["Illustrator", "InDesign"],
        features: ["Vector Projects", "Portfolio", "Placement"],
        shortDesc: "Vector graphics and illustration design.",
        aboutCourse: "Covers logo design, illustrations, typography, and branding assets creation.",
        benefits: [
          "Master vector graphics design and illustration",
          "Create professional logos and branding assets",
          "Work with typography and design principles",
          "Design scalable graphics for all media",
          "Become a sought-after Illustrator or Designer"
        ]
      },
      {
        title: "UI/UX Design",
        duration: "3 Months",
        students: "250+",
        tools: ["Figma", "Adobe XD", "Sketch"],
        features: ["App Design", "Internship", "Placement"],
        shortDesc: "User interface and user experience design.",
        aboutCourse: "Covers wireframing, prototyping, usability testing, and design thinking for digital products.",
        benefits: [
          "Design user-friendly digital products and applications",
          "Master wireframing, prototyping, and usability testing",
          "Understand user research and design thinking",
          "Work on real app and website design projects",
          "High-demand UI/UX Designer with competitive salaries"
        ]
      },
      {
        title: "Branding & Visual Design",
        duration: "2 Months",
        students: "200+",
        tools: ["Full Adobe Suite", "Brand Guidelines"],
        features: ["Brand Projects", "Portfolio", "Placement"],
        shortDesc: "Brand identity and visual communication.",
        aboutCourse: "Focuses on brand strategy, visual systems, color theory, and consistent brand experiences.",
        benefits: [
          "Develop comprehensive brand identities from scratch",
          "Master color theory and visual design principles",
          "Create brand guidelines and style systems",
          "Design for multiple brand touchpoints",
          "Become a specialist in brand and visual design"
        ]
      },
      {
        title: "CorelDRAW",
        duration: "1 Month",
        students: "150+",
        tools: ["CorelDRAW", "Print Design"],
        features: ["Print Projects", "Portfolio", "Placement"],
        shortDesc: "Graphic design using CorelDRAW tools.",
        aboutCourse: "Covers layout design, vector illustration, and print-ready designs.",
        benefits: [
          "Master CorelDRAW for professional design work",
          "Create print-ready designs and layouts",
          "Design for both digital and print media",
          "Work on diverse design projects",
          "Quick skill acquisition with immediate employment"
        ]
      },
    ],
  },
  nursing: {
    title: "Nursing Training Programs",
    description: "Advanced healthcare training for nursing professionals",
    color: "healthcare",
    courses: [
      {
        title: "Advanced Clinical Training",
        duration: "6 Months",
        students: "300+",
        tools: ["Clinical Equipment", "Patient Care", "Documentation"],
        features: ["Hospital Training", "Internship", "Placement"],
        shortDesc: "Advanced hands-on clinical nursing training.",
        aboutCourse: "Focuses on advanced nursing procedures, patient care protocols, and clinical best practices."
      },
      {
        title: "ICU & Emergency Care",
        duration: "3 Months",
        students: "250+",
        tools: ["ICU Equipment", "Emergency Protocols", "Life Support"],
        features: ["Hands-on Training", "Internship", "Placement"],
        shortDesc: "Critical care and emergency response training.",
        aboutCourse: "Covers ICU protocols, emergency handling, life-support systems, and patient monitoring."
      },
      {
        title: "Patient Care & Documentation",
        duration: "2 Months",
        students: "400+",
        tools: ["EHR Systems", "Care Protocols", "Communication"],
        features: ["Practical Sessions", "Internship", "Placement"],
        shortDesc: "Patient handling and medical documentation.",
        aboutCourse: "Focuses on patient interaction, record keeping, and healthcare documentation standards."
      },
      {
        title: "Medical Equipment Handling",
        duration: "1 Month",
        students: "200+",
        tools: ["Medical Devices", "Safety Protocols", "Maintenance"],
        features: ["Lab Practice", "Certification", "Placement"],
        shortDesc: "Operation and safety of medical equipment.",
        aboutCourse: "Covers usage, maintenance, and safety handling of common hospital medical devices."
      },
    ],
  },
};

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

interface CourseDetail {
  title: string;
  shortDesc: string;
  aboutCourse: string;
}

const CoursesPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("it");
  const [dbCourses, setDbCourses] = useState<DBCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<CourseDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openCourseModal = (course: CourseDetail) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
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
                                  onClick={() => openCourseModal({
                                    title: course.title,
                                    shortDesc: course.description || "Comprehensive course designed to enhance your skills",
                                    aboutCourse: course.description || "This course provides hands-on training with video lessons, projects, and industry-recognized certification."
                                  })}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      openCourseModal({
                                        title: course.title,
                                        shortDesc: course.description || "Comprehensive course designed to enhance your skills",
                                        aboutCourse: course.description || "This course provides hands-on training with video lessons, projects, and industry-recognized certification."
                                      });
                                    }
                                  }}
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
                              onClick={() => openCourseModal({ title: course.title, shortDesc: course.shortDesc, aboutCourse: course.aboutCourse })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  openCourseModal({ title: course.title, shortDesc: course.shortDesc, aboutCourse: course.aboutCourse });
                                }
                              }}
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

      {/* Course Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {selectedCourse?.title}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground pt-2">
              {selectedCourse?.shortDesc}
            </DialogDescription>
          </DialogHeader>

          {selectedCourse && (
            <div className="space-y-6 py-4">
              {/* About Course Section */}
              <div className="space-y-3">
                <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  About This Course
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedCourse.aboutCourse}
                </p>
              </div>

              {/* Key Features */}
              <div className="space-y-3">
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  What You'll Learn
                </h3>
                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Expert-led live training sessions with industry professionals</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Real-world projects and hands-on practice</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Industry-recognized certification upon completion</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Internship and placement assistance</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 border-t">
                <Link to="/apply" onClick={() => setIsModalOpen(false)}>
                  <Button variant="hero" size="lg" className="w-full">
                    Enroll in {selectedCourse.title} <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default CoursesPage;
