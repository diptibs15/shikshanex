import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, MapPin, Briefcase, Clock, Code, Heart, Users, Megaphone, Palette } from "lucide-react";
import professionalWoman from "@/assets/image.png";

/* -------------------- TYPES -------------------- */
type Internship = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  stipend: string;
  skills: string[];
  category: string;
};

type CategoryData = {
  name: string;
  icon: React.ReactNode;
  color: string;
  quote: string;
  bgGradient: string;
};

/* -------------------- CATEGORIES DATA -------------------- */
const categoriesData: Record<string, CategoryData> = {
  IT: {
    name: "IT",
    icon: <Code className="w-8 h-8" />,
    color: "blue",
    quote: "Innovate, code, and grow with Shikshanix IT Internships!",
    bgGradient: "from-blue-600 to-cyan-600",
  },
  Nursing: {
    name: "Nursing",
    icon: <Heart className="w-8 h-8" />,
    color: "red",
    quote: "Care, compassion, and growth – Nursing internships at Shikshanix!",
    bgGradient: "from-red-500 to-pink-600",
  },
  HR: {
    name: "HR",
    icon: <Users className="w-8 h-8" />,
    color: "green",
    quote: "Shape workplaces and people – HR internships at Shikshanix!",
    bgGradient: "from-green-600 to-emerald-600",
  },
  Marketing: {
    name: "Marketing",
    icon: <Megaphone className="w-8 h-8" />,
    color: "orange",
    quote: "Creativity meets strategy – Marketing internships at Shikshanix!",
    bgGradient: "from-orange-500 to-pink-500",
  },
  Design: {
    name: "Design",
    icon: <Palette className="w-8 h-8" />,
    color: "purple",
    quote: "Design the future – Join Shikshanix design internship programs!",
    bgGradient: "from-purple-600 to-violet-600",
  },
};

/* -------------------- INTERNSHIPS DATA -------------------- */
const internships: Internship[] = [
  /* ================= IT INTERNSHIPS ================= */
  {
    id: 1,
    title: "Full Stack Development Intern",
    company: "TechStart Labs",
    location: "Bangalore",
    type: "Full-time",
    duration: "3 months",
    stipend: "₹15,000 - ₹25,000",
    skills: ["React", "Node.js", "MongoDB", "REST APIs"],
    category: "IT",
  },
  {
    id: 2,
    title: "Data Science Intern",
    company: "DataInsights AI",
    location: "Hyderabad",
    type: "Full-time",
    duration: "3 months",
    stipend: "₹18,000 - ₹28,000",
    skills: ["Python", "ML", "Data Analysis", "SQL"],
    category: "IT",
  },
  {
    id: 3,
    title: "Frontend Development Intern",
    company: "WebCreators",
    location: "Pune",
    type: "Full-time",
    duration: "2 months",
    stipend: "₹12,000 - ₹20,000",
    skills: ["React", "JavaScript", "CSS", "UI Design"],
    category: "IT",
  },
  {
    id: 4,
    title: "Backend Development Intern",
    company: "CloudSoft Systems",
    location: "Chennai",
    type: "Full-time",
    duration: "3 months",
    stipend: "₹14,000 - ₹24,000",
    skills: ["Node.js", "Express", "PostgreSQL", "APIs"],
    category: "IT",
  },
  {
    id: 5,
    title: "DevOps & Cloud Intern",
    company: "InfraCloud",
    location: "Noida",
    type: "Full-time",
    duration: "3 months",
    stipend: "₹16,000 - ₹26,000",
    skills: ["Docker", "AWS", "Linux", "CI/CD"],
    category: "IT",
  },

  /* ================= HR INTERNSHIPS ================= */
  {
    id: 6,
    title: "HR Operations Intern",
    company: "TalentHub India",
    location: "Chennai",
    type: "Full-time",
    duration: "2 months",
    stipend: "₹10,000 - ₹15,000",
    skills: ["Recruitment", "Employee Relations", "Documentation"],
    category: "HR",
  },
  {
    id: 7,
    title: "Recruitment Intern",
    company: "PeopleConnect",
    location: "Bangalore",
    type: "Full-time",
    duration: "3 months",
    stipend: "₹11,000 - ₹18,000",
    skills: ["Sourcing", "LinkedIn Recruiting", "Screening"],
    category: "HR",
  },
  {
    id: 8,
    title: "Learning & Development Intern",
    company: "GrowthPath HR",
    location: "Hyderabad",
    type: "Full-time",
    duration: "2 months",
    stipend: "₹9,000 - ₹14,000",
    skills: ["Training Programs", "Content Creation", "Analytics"],
    category: "HR",
  },
  {
    id: 9,
    title: "Payroll & Compliance Intern",
    company: "ComplyHR",
    location: "Pune",
    type: "Full-time",
    duration: "2 months",
    stipend: "₹10,000 - ₹16,000",
    skills: ["Payroll", "Compliance", "Excel", "SAP"],
    category: "HR",
  },
  {
    id: 10,
    title: "Employee Engagement Intern",
    company: "CultureWorks",
    location: "Delhi",
    type: "Full-time",
    duration: "3 months",
    stipend: "₹10,000 - ₹17,000",
    skills: ["Event Management", "Communication", "Engagement Programs"],
    category: "HR",
  },

  /* ================= MARKETING INTERNSHIPS ================= */
  {
    id: 11,
    title: "Digital Marketing Intern",
    company: "BrandBuild Agency",
    location: "Mumbai",
    type: "Full-time",
    duration: "3 months",
    stipend: "₹12,000 - ₹20,000",
    skills: ["SEO", "Google Ads", "Analytics", "Content"],
    category: "Marketing",
  },
  {
    id: 12,
    title: "Social Media Intern",
    company: "ViralContent Co",
    location: "Remote",
    type: "Full-time",
    duration: "2 months",
    stipend: "₹10,000 - ₹18,000",
    skills: ["Instagram", "TikTok", "Content Strategy", "Analytics"],
    category: "Marketing",
  },
  {
    id: 13,
    title: "Content Marketing Intern",
    company: "ContentFactory",
    location: "Bangalore",
    type: "Full-time",
    duration: "3 months",
    stipend: "₹11,000 - ₹19,000",
    skills: ["Blog Writing", "Copywriting", "SEO", "Editing"],
    category: "Marketing",
  },
  {
    id: 14,
    title: "Email Marketing Intern",
    company: "CampaignSmith",
    location: "Hyderabad",
    type: "Full-time",
    duration: "2 months",
    stipend: "₹9,000 - ₹15,000",
    skills: ["Email Campaigns", "Automation", "Analytics"],
    category: "Marketing",
  },
  {
    id: 15,
    title: "Marketing Analytics Intern",
    company: "DataDriven Marketing",
    location: "Pune",
    type: "Full-time",
    duration: "3 months",
    stipend: "₹13,000 - ₹21,000",
    skills: ["Google Analytics", "Tableau", "Excel", "SQL"],
    category: "Marketing",
  },

  /* ================= DESIGN INTERNSHIPS ================= */
  {
    id: 16,
    title: "UI/UX Design Intern",
    company: "DesignHub Studio",
    location: "Bangalore",
    type: "Full-time",
    duration: "3 months",
    stipend: "₹14,000 - ₹22,000",
    skills: ["Figma", "Wireframing", "User Research", "Prototyping"],
    category: "Design",
  },
  {
    id: 17,
    title: "Graphic Design Intern",
    company: "Creative Studios",
    location: "Mumbai",
    type: "Full-time",
    duration: "2 months",
    stipend: "₹11,000 - ₹18,000",
    skills: ["Photoshop", "Illustrator", "Adobe XD", "Branding"],
    category: "Design",
  },
  {
    id: 18,
    title: "Product Design Intern",
    company: "InnovateLabs",
    location: "Remote",
    type: "Full-time",
    duration: "3 months",
    stipend: "₹15,000 - ₹25,000",
    skills: ["Product Design", "User Testing", "Design Thinking"],
    category: "Design",
  },
  {
    id: 19,
    title: "Motion Graphics Intern",
    company: "AnimateStudio",
    location: "Pune",
    type: "Full-time",
    duration: "2 months",
    stipend: "₹12,000 - ₹20,000",
    skills: ["After Effects", "Animation", "Cinema 4D", "Video Editing"],
    category: "Design",
  },
  {
    id: 20,
    title: "Web Design Intern",
    company: "WebArtistry",
    location: "Chennai",
    type: "Full-time",
    duration: "3 months",
    stipend: "₹11,000 - ₹19,000",
    skills: ["HTML/CSS", "JavaScript", "Figma", "Responsive Design"],
    category: "Design",
  },

  /* ================= NURSING INTERNSHIPS ================= */
  {
    id: 21,
    title: "Clinical Nursing Intern",
    company: "Apollo Hospital",
    location: "Hyderabad",
    type: "Full-time",
    duration: "2 months",
    stipend: "₹8,000 - ₹13,000",
    skills: ["Patient Care", "Clinical Skills", "Medical Procedures"],
    category: "Nursing",
  },
  {
    id: 22,
    title: "ICU Support Intern",
    company: "Fortis Health",
    location: "Delhi",
    type: "Full-time",
    duration: "2 months",
    stipend: "₹9,000 - ₹14,000",
    skills: ["Critical Care", "Monitoring", "Patient Support"],
    category: "Nursing",
  },
  {
    id: 23,
    title: "Community Health Intern",
    company: "HealthFirst NGO",
    location: "Chennai",
    type: "Full-time",
    duration: "3 months",
    stipend: "₹7,000 - ₹12,000",
    skills: ["Health Education", "Community Outreach", "Care Delivery"],
    category: "Nursing",
  },
  {
    id: 24,
    title: "Pediatric Nursing Intern",
    company: "Rainbow Children Hospital",
    location: "Bangalore",
    type: "Full-time",
    duration: "2 months",
    stipend: "₹8,000 - ₹13,000",
    skills: ["Child Care", "Pediatric Nursing", "Patient Communication"],
    category: "Nursing",
  },
  {
    id: 25,
    title: "Operation Theatre Intern",
    company: "MediCare Hospital",
    location: "Mumbai",
    type: "Full-time",
    duration: "3 months",
    stipend: "₹9,000 - ₹15,000",
    skills: ["Surgical Support", "Sterilization", "OR Protocols"],
    category: "Nursing",
  },
];

/* -------------------- PAGE -------------------- */
export default function InternshipPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const categoryNames = Object.keys(categoriesData);

  const filteredInternships = internships.filter((internship) => {
    const matchesCategory = activeCategory === null || internship.category === activeCategory;
    const matchesSearch =
      internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Animated background blobs */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-10 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-10 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
        />

        <div className="relative z-10 container max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 max-w-2xl"
            >
              <h1 className="text-5xl md:text-6xl font-bold font-heading text-white mb-6">
                Shikshanix{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Internship Portal
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-4">
                Gain hands-on experience across IT, HR, Marketing, Design, and Healthcare sectors.
              </p>
              <p className="text-lg text-blue-100/80">
                Launch your career with real-world learning from top companies at Shikshanix.
              </p>
            </motion.div>

            {/* Right Image - Oval shape with shadow */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 flex justify-center"
            >
              <div className="relative">
                {/* Outer glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-300 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-2xl scale-105" />

                {/* Oval container with shadow and border */}
                <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-blue-400 shadow-2xl">
                  {/* Inner shadow effect */}
                  <div className="absolute inset-0 shadow-inner rounded-full" />

                  {/* Image */}
                  <img
                    src={professionalWoman}
                    alt="Professional woman"
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay gradient for subtle effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-full" />
                </div>

                {/* Subtle outer shadow circle */}
                <div className="absolute inset-0 w-72 h-72 md:w-96 md:h-96 rounded-full border-2 border-blue-300/50 shadow-lg -z-10 scale-110" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== INTERNSHIP CATEGORIES SECTION ===== */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-4">
              Explore Internship <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Categories</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select a category to view available internships and start learning
            </p>
          </motion.div>

          {/* Category Cards Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {categoryNames.map((catName, index) => {
              const catData = categoriesData[catName];
              const isActive = activeCategory === catName;

              return (
                <motion.button
                  key={catName}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(isActive ? null : catName)}
                  className={`relative rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-br ${catData.bgGradient} text-white shadow-xl`
                      : "bg-white border-2 border-gray-200 text-gray-900 hover:border-blue-400 hover:shadow-lg"
                  }`}
                >
                  <motion.div
                    animate={isActive ? { scale: 1.2 } : { scale: 1 }}
                    className={`mb-4 ${isActive ? "text-white" : "text-blue-600"}`}
                  >
                    {catData.icon}
                  </motion.div>
                  <h3 className="text-lg font-bold mb-1">{catData.name}</h3>
                  <p className={`text-sm ${isActive ? "text-white/90" : "text-gray-500"}`}>
                    {internships.filter((i) => i.category === catName).length} Internships
                  </p>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== MOTIVATIONAL QUOTE SECTION ===== */}
      <AnimatePresence>
        {activeCategory && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className={`bg-gradient-to-r ${categoriesData[activeCategory].bgGradient} py-12 px-6`}>
              <div className="container max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 font-heading">
                    {categoriesData[activeCategory].quote}
                  </h3>
                  <p className="text-white/90 text-lg">
                    Browse all {activeCategory} internships and launch your learning journey
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ===== SEARCH SECTION ===== */}
      <section className="relative z-20 px-6 md:px-0 py-8">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search internships by title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-gray-700 placeholder-gray-400 transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== INTERNSHIP LIST ===== */}
      <main className="flex-1 px-6 pb-16">
        <div className="container max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${searchQuery}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {filteredInternships.length > 0 ? (
                filteredInternships.map((internship, index) => (
                  <motion.div
                    key={internship.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(37, 99, 235, 0.15)" }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl border-l-4 border-blue-600 p-6 md:p-8 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      {/* Internship Details */}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {internship.title}
                        </h3>
                        <p className="text-lg text-blue-600 font-semibold mb-4">
                          {internship.company}
                        </p>

                        {/* Internship Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{internship.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Briefcase className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{internship.type}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{internship.duration}</span>
                          </div>
                          <div className="text-green-600 font-bold text-sm">
                            {internship.stipend}
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2">
                          {internship.skills.map((skill) => (
                            <motion.span
                              key={skill}
                              whileHover={{ scale: 1.05 }}
                              className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      {/* Apply Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/dashboard/interview")}
                        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 whitespace-nowrap"
                      >
                        Apply Now
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-2xl text-gray-500 font-semibold">
                    {activeCategory ? `No ${activeCategory} internships found matching your search.` : "Select a category to view available internships."}
                  </p>
                  <p className="text-gray-400 mt-2">
                    {activeCategory ? "Try adjusting your search query." : "Click on a category card above to get started."}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
