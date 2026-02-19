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
  BarChart3,
  Zap,
  Target,
  ChevronDown,
  ChevronUp,
  Code2,
  Laptop,
  Database,
  GitBranch,
  Cpu,
  Package,
  ArrowLeft,
  Users,
  Star,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { courseCategories } from "@/data/courseData";

type CourseData = {
  title: string;
  duration: string;
  students: string;
  rating?: number;
  hours?: number;
  lessons?: number;
  level?: string;
  price?: number;
  originalPrice?: number;
  badge?: string;
  tools: string[];
  features: string[];
  shortDesc: string;
  aboutCourse: string;
  keyHighlights?: string[];
  careerOpportunities?: string[];
  salaryPotential?: string;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
};

const toolIcons: Record<string, React.ReactNode> = {
  "Java": <Code2 className="h-4 w-4" />,
  "Spring Boot": <Zap className="h-4 w-4" />,
  "React": <Package className="h-4 w-4" />,
  "MySQL": <Database className="h-4 w-4" />,
  "REST API": <Laptop className="h-4 w-4" />,
  "Git": <GitBranch className="h-4 w-4" />,
  "Python": <Code2 className="h-4 w-4" />,
  "Django": <Zap className="h-4 w-4" />,
  "PostgreSQL": <Database className="h-4 w-4" />,
  "Pandas": <Package className="h-4 w-4" />,
  "NumPy": <Package className="h-4 w-4" />,
  "Scikit-learn": <Cpu className="h-4 w-4" />,
  "TensorFlow": <Cpu className="h-4 w-4" />,
  "SQL": <Database className="h-4 w-4" />,
  "Power BI": <BarChart3 className="h-4 w-4" />,
  "Tableau": <BarChart3 className="h-4 w-4" />,
  "Excel": <Package className="h-4 w-4" />,
  "Figma": <Package className="h-4 w-4" />,
  "AWS EC2": <Laptop className="h-4 w-4" />,
  "S3": <Package className="h-4 w-4" />,
  "Lambda": <Zap className="h-4 w-4" />,
  "Docker": <Package className="h-4 w-4" />,
  "Kubernetes": <Package className="h-4 w-4" />,
  "Kali Linux": <Code2 className="h-4 w-4" />,
  "Wireshark": <Package className="h-4 w-4" />,
  "Metasploit": <Code2 className="h-4 w-4" />,
};

const toolColors: Record<number, string> = {
  0: "bg-purple-100 text-purple-700 border-purple-200",
  1: "bg-blue-100 text-blue-700 border-blue-200",
  2: "bg-green-100 text-green-700 border-green-200",
  3: "bg-pink-100 text-pink-700 border-pink-200",
  4: "bg-indigo-100 text-indigo-700 border-indigo-200",
  5: "bg-cyan-100 text-cyan-700 border-cyan-200",
  6: "bg-orange-100 text-orange-700 border-orange-200",
};

const highlightIcons = [
  <Zap className="h-8 w-8 text-blue-600" />,
  <Users className="h-8 w-8 text-purple-600" />,
  <Target className="h-8 w-8 text-green-600" />,
  <Award className="h-8 w-8 text-orange-600" />,
];

const highlightBgGradients = [
  "from-blue-500/10 to-blue-500/5 border-blue-200/30",
  "from-purple-500/10 to-purple-500/5 border-purple-200/30",
  "from-green-500/10 to-green-500/5 border-green-200/30",
  "from-orange-500/10 to-orange-500/5 border-orange-200/30",
];

const CourseDetailPage = () => {
  const { courseTitle } = useParams();
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [showAllTools, setShowAllTools] = useState(false);

  let selectedCourse: CourseData | null = null;

  for (const [key, catData] of Object.entries(courseCategories)) {
    const found = (catData as any).courses.find(
      (c: CourseData) => c.title.toLowerCase().replace(/\s+/g, "-") === courseTitle?.toLowerCase()
    );
    if (found) {
      selectedCourse = found;
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

  // Generate dynamic syllabus based on course title
  const generateSyllabus = () => {
    const syllabusMap: Record<string, any[]> = {
      "Java Full Stack with AI": [
        { title: "Module 1: Java Fundamentals", duration: "2 weeks" },
        { title: "Module 2: Spring Boot Essentials", duration: "3 weeks" },
        { title: "Module 3: Frontend with React", duration: "3 weeks" },
        { title: "Module 4: Database & APIs", duration: "2 weeks" },
        { title: "Module 5: AI Integration", duration: "2 weeks" },
        { title: "Module 6: Live Projects", duration: "4 weeks" },
      ],
      "Python Full Stack with AI": [
        { title: "Module 1: Python Fundamentals", duration: "2 weeks" },
        { title: "Module 2: Django Framework", duration: "3 weeks" },
        { title: "Module 3: React for Web", duration: "3 weeks" },
        { title: "Module 4: Database with PostgreSQL", duration: "2 weeks" },
        { title: "Module 5: AI & Automation", duration: "2 weeks" },
        { title: "Module 6: Real-World Projects", duration: "3 weeks" },
      ],
      "AI & Machine Learning with AI": [
        { title: "Module 1: Python for ML", duration: "2 weeks" },
        { title: "Module 2: Data Preprocessing", duration: "2 weeks" },
        { title: "Module 3: ML Algorithms", duration: "3 weeks" },
        { title: "Module 4: Deep Learning Basics", duration: "3 weeks" },
        { title: "Module 5: Model Deployment", duration: "2 weeks" },
        { title: "Module 6: Capstone Project", duration: "4 weeks" },
      ],
      "Data Analyst with AI": [
        { title: "Module 1: Excel Mastery", duration: "1 week" },
        { title: "Module 2: SQL for Analytics", duration: "2 weeks" },
        { title: "Module 3: Python for Data Analysis", duration: "2 weeks" },
        { title: "Module 4: Dashboard with Power BI", duration: "2 weeks" },
        { title: "Module 5: Tableau Visualization", duration: "2 weeks" },
        { title: "Module 6: Real Business Projects", duration: "2 weeks" },
      ],
      "Data Science with AI": [
        { title: "Module 1: Statistics Fundamentals", duration: "2 weeks" },
        { title: "Module 2: Data Exploration & Wrangling", duration: "2 weeks" },
        { title: "Module 3: Supervised Learning", duration: "3 weeks" },
        { title: "Module 4: Unsupervised Learning", duration: "2 weeks" },
        { title: "Module 5: Deep Learning & Neural Networks", duration: "3 weeks" },
        { title: "Module 6: Capstone Project", duration: "3 weeks" },
      ],
      "AWS & Cloud Computing with AI": [
        { title: "Module 1: Cloud Fundamentals", duration: "2 weeks" },
        { title: "Module 2: AWS Essentials", duration: "2 weeks" },
        { title: "Module 3: Compute & Storage Services", duration: "2 weeks" },
        { title: "Module 4: Networking & Security", duration: "2 weeks" },
        { title: "Module 5: DevOps & Containerization", duration: "2 weeks" },
        { title: "Module 6: Deployment Projects", duration: "3 weeks" },
      ],
      "Cyber Security with AI": [
        { title: "Module 1: Cybersecurity Basics", duration: "2 weeks" },
        { title: "Module 2: Network Security", duration: "2 weeks" },
        { title: "Module 3: Ethical Hacking Fundamentals", duration: "3 weeks" },
        { title: "Module 4: Penetration Testing", duration: "3 weeks" },
        { title: "Module 5: AI-Driven Security Tools", duration: "2 weeks" },
        { title: "Module 6: Lab Simulations & Projects", duration: "2 weeks" },
      ],
      "Adobe Photoshop": [
        { title: "Module 1: Photoshop Basics", duration: "1 week" },
        { title: "Module 2: Photo Editing Techniques", duration: "2 weeks" },
        { title: "Module 3: Advanced Retouching", duration: "2 weeks" },
        { title: "Module 4: Digital Art Creation", duration: "2 weeks" },
        { title: "Module 5: Portfolio Building", duration: "2 weeks" },
      ],
      "UI/UX Design": [
        { title: "Module 1: Design Fundamentals", duration: "2 weeks" },
        { title: "Module 2: User Research & Wireframing", duration: "2 weeks" },
        { title: "Module 3: Prototyping & Interaction Design", duration: "3 weeks" },
        { title: "Module 4: Usability Testing", duration: "2 weeks" },
        { title: "Module 5: Real App Design Project", duration: "3 weeks" },
      ],
    };
    
    return syllabusMap[selectedCourse?.title || ""] || [
      { title: "Module 1: Fundamentals", duration: "2 weeks" },
      { title: "Module 2: Core Concepts", duration: "2 weeks" },
      { title: "Module 3: Practical Application", duration: "3 weeks" },
      { title: "Module 4: Advanced Topics", duration: "2 weeks" },
      { title: "Module 5: Project Work", duration: "3 weeks" },
    ];
  };

  const syllabusData = generateSyllabus();
  const toolsToDisplay = showAllTools ? selectedCourse.tools : selectedCourse.tools.slice(0, 5);

  const gradientClass = `from-[${selectedCourse.gradientFrom}] via-[${selectedCourse.gradientVia}] to-[${selectedCourse.gradientTo}]`;
  const gradientStyle = {
    background: `linear-gradient(to right, ${selectedCourse.gradientFrom}, ${selectedCourse.gradientVia}, ${selectedCourse.gradientTo})`
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section with Dynamic Gradient Background */}
        <section className="relative overflow-hidden py-16 lg:py-24">
          {/* Gradient Background */}
          <div className="absolute inset-0" style={gradientStyle} />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          
          <div className="container relative">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Course Info */}
              <div className="text-white">
                <h1 className="font-heading text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  {selectedCourse.title}
                </h1>
                <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-lg">
                  {selectedCourse.shortDesc}
                </p>

                {/* Course Stats */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">
                      {selectedCourse.rating} Rating • {selectedCourse.students} Students
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6" />
                    <span className="text-lg font-semibold">
                      {selectedCourse.hours} Hours • {selectedCourse.lessons} Lessons
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-lg font-semibold">{selectedCourse.level}</span>
                  </div>
                </div>
              </div>

              {/* Right: Price Card */}
              <div className="relative h-full min-h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-white/90 rounded-3xl shadow-2xl backdrop-blur-sm border border-white/20 p-8 flex flex-col justify-center">
                  {/* Price Section */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-5xl font-bold" style={{ color: selectedCourse.gradientFrom }}>
                        ₹{selectedCourse.price?.toLocaleString()}
                      </span>
                      <span className="text-2xl text-gray-400 line-through">
                        ₹{selectedCourse.originalPrice?.toLocaleString()}
                      </span>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-base px-4 py-2">
                      {selectedCourse.badge}
                    </Badge>
                  </div>

                  {/* Benefits List */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: selectedCourse.gradientFrom }} />
                      <span className="text-sm font-medium">Lifetime Access</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: selectedCourse.gradientFrom }} />
                      <span className="text-sm font-medium">24/7 Doubt Support</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: selectedCourse.gradientFrom }} />
                      <span className="text-sm font-medium">Certificate + Placement</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link to="/apply">
                    <Button 
                      size="lg" 
                      className="w-full text-white text-base font-bold gap-2 shadow-lg hover:opacity-90 transition-opacity"
                      style={{
                        background: `linear-gradient(135deg, ${selectedCourse.gradientFrom}, ${selectedCourse.gradientTo})`
                      }}
                    >
                      Enroll Now <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>

                  {/* Salary */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Expected Salary Range</p>
                    <p className="text-2xl font-bold text-green-600">{selectedCourse.salaryPotential}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Course Section */}
        <section className="py-16 bg-gradient-to-b from-purple-50/30 to-transparent">
          <div className="container max-w-5xl">
            <h2 className="font-heading text-4xl font-bold text-foreground mb-6">About This Course</h2>
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
              {selectedCourse.aboutCourse}
            </p>

            {/* 4 Highlight Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedCourse.keyHighlights?.map((highlight, idx) => (
                <div 
                  key={idx}
                  className={`bg-gradient-to-br ${highlightBgGradients[idx % 4]} border rounded-2xl p-6 backdrop-blur-sm hover:border-opacity-100 transition-all`}
                >
                  {highlightIcons[idx % 4]}
                  <h3 className="font-semibold text-foreground mb-2 mt-3">{highlight}</h3>
                  <p className="text-sm text-muted-foreground">Industry-focused training modules</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Covered Section */}
        <section className="py-16">
          <div className="container max-w-5xl">
            <h2 className="font-heading text-4xl font-bold text-foreground mb-8">Tools & Technologies</h2>
            <div className="flex flex-wrap gap-3 mb-6">
              {toolsToDisplay.map((tool, index) => (
                <div
                  key={tool}
                  className={`${toolColors[index % 7]} border rounded-full px-6 py-3 font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center gap-2`}
                >
                  {toolIcons[tool] || <Package className="h-4 w-4" />}
                  {tool}
                </div>
              ))}
            </div>

            {/* Show More / Show Less Button */}
            {selectedCourse.tools.length > 5 && (
              <button
                onClick={() => setShowAllTools(!showAllTools)}
                className="px-6 py-3 border-2 rounded-full font-semibold transition-all duration-300 flex items-center gap-2"
                style={{
                  borderColor: selectedCourse.gradientFrom,
                  color: selectedCourse.gradientFrom,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = selectedCourse.gradientFrom || '';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = selectedCourse.gradientFrom || '';
                }}
              >
                {showAllTools ? (
                  <>
                    Show Less <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    +{selectedCourse.tools.length - 5} More <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </section>

        {/* Career Opportunities Section */}
        <section className="py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <div className="container max-w-5xl">
            <h2 className="font-heading text-4xl font-bold text-white mb-8">Career Opportunities</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {selectedCourse.careerOpportunities?.map((opportunity) => (
                <div
                  key={opportunity}
                  className="group bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:translate-y-[-4px] cursor-pointer"
                >
                  <Briefcase className="h-10 w-10 mb-4 group-hover:scale-110 transition-transform" style={{ color: selectedCourse.gradientFrom }} />
                  <h3 className="font-semibold text-white text-lg mb-2">{opportunity}</h3>
                  <p className="text-white/70 text-sm">Salary: {selectedCourse.salaryPotential}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Syllabus - Modern Accordion */}
        <section className="py-16">
          <div className="container max-w-5xl">
            <h2 className="font-heading text-4xl font-bold text-foreground mb-8">Course Syllabus</h2>
            <div className="space-y-3">
              {syllabusData.map((item, index) => (
                <div
                  key={index}
                  className="group bg-card rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    className="w-full flex items-center gap-4 p-6 hover:bg-muted/30 transition-colors"
                  >
                    {/* Gradient Circle Badge */}
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${selectedCourse.gradientFrom}, ${selectedCourse.gradientTo})`
                      }}
                    >
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>

                    <div className="text-left flex-grow">
                      <h3 className="font-semibold text-foreground text-lg">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.duration}</p>
                    </div>

                    {expandedIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                  </button>

                  {/* Expandable Content */}
                  {expandedIndex === index && (
                    <div className="px-6 pb-6 border-t bg-muted/10 animate-in fade-in slide-in-from-top-2 duration-300">
                      <p className="text-muted-foreground">
                        In-depth training on {item.title.split(":")[1]} with hands-on exercises, real-world projects, and industry best practices.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Strong CTA Section */}
        <section className="py-16" style={{
          background: `linear-gradient(135deg, ${selectedCourse.gradientFrom}15, ${selectedCourse.gradientVia}10, ${selectedCourse.gradientTo}15)`
        }}>
          <div className="container max-w-4xl text-center">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join {selectedCourse.students} successful students who are now working at top tech companies. Limited time {selectedCourse.badge} offer!
            </p>
            <Link to="/apply">
              <Button 
                size="lg" 
                className="text-white text-lg font-bold px-10 py-7 gap-2 hover:opacity-90 transition-opacity"
                style={{
                  background: `linear-gradient(135deg, ${selectedCourse.gradientFrom}, ${selectedCourse.gradientTo})`
                }}
              >
                Enroll Now - ₹{selectedCourse.price?.toLocaleString()} <ArrowRight className="h-6 w-6" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-8 font-medium">
              ✓ Lifetime Access • ✓ Certificate • ✓ Job Placement • ✓ 24/7 Support
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetailPage;
