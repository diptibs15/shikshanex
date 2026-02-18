import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, MapPin, Briefcase, Clock, Code, Heart, Users, Megaphone, Palette } from "lucide-react";
import professionalWoman from "@/assets/image.png";

/* -------------------- TYPES -------------------- */
type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  exp: string;
  salary: string;
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
    quote: "Innovate, code, and grow with Shikshanix IT Careers!",
    bgGradient: "from-blue-600 to-cyan-600",
  },
  Nursing: {
    name: "Nursing",
    icon: <Heart className="w-8 h-8" />,
    color: "red",
    quote: "Care, compassion, and growth – Nursing careers at Shikshanix!",
    bgGradient: "from-red-500 to-pink-600",
  },
  HR: {
    name: "HR",
    icon: <Users className="w-8 h-8" />,
    color: "green",
    quote: "Shape workplaces and people – HR careers at Shikshanix!",
    bgGradient: "from-green-600 to-emerald-600",
  },
  Marketing: {
    name: "Marketing",
    icon: <Megaphone className="w-8 h-8" />,
    color: "orange",
    quote: "Creativity meets strategy – Marketing careers at Shikshanix!",
    bgGradient: "from-orange-500 to-pink-500",
  },
  Design: {
    name: "Design",
    icon: <Palette className="w-8 h-8" />,
    color: "purple",
    quote: "Design the future – Join Shikshanix design teams!",
    bgGradient: "from-purple-600 to-violet-600",
  },
};

/* -------------------- JOBS DATA -------------------- */
const jobs: Job[] = [
  /* ================= IT JOBS ================= */
  {
    id: 1,
    title: "Java Full Stack Developer",
    company: "TechCorp Solutions",
    location: "Bangalore",
    type: "Full-time",
    exp: "2 - 5 years",
    salary: "₹8.0 LPA - ₹15.0 LPA",
    skills: ["Java", "Spring Boot", "React", "MySQL"],
    category: "IT",
  },
  {
    id: 2,
    title: "Python Data Engineer",
    company: "DataFlow Analytics",
    location: "Hyderabad",
    type: "Full-time",
    exp: "3 - 7 years",
    salary: "₹10.0 LPA - ₹20.0 LPA",
    skills: ["Python", "ETL", "AWS", "SQL"],
    category: "IT",
  },
  {
    id: 3,
    title: "Frontend Developer",
    company: "PixelCraft",
    location: "Pune",
    type: "Full-time",
    exp: "1 - 3 years",
    salary: "₹6.0 LPA - ₹12.0 LPA",
    skills: ["React", "Tailwind", "JavaScript"],
    category: "IT",
  },
  {
    id: 4,
    title: "Backend Node.js Developer",
    company: "CloudBridge",
    location: "Chennai",
    type: "Full-time",
    exp: "2 - 4 years",
    salary: "₹7.0 LPA - ₹14.0 LPA",
    skills: ["Node.js", "MongoDB", "Express"],
    category: "IT",
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "InfraTech",
    location: "Noida",
    type: "Full-time",
    exp: "4 - 8 years",
    salary: "₹12.0 LPA - ₹25.0 LPA",
    skills: ["Docker", "Kubernetes", "AWS"],
    category: "IT",
  },

  /* ================= HR JOBS ================= */
  {
    id: 6,
    title: "HR Recruiter",
    company: "PeopleFirst HR",
    location: "Chennai",
    type: "Full-time",
    exp: "1 - 3 years",
    salary: "₹3.5 LPA - ₹6.0 LPA",
    skills: ["Hiring", "Screening", "Onboarding"],
    category: "HR",
  },
  {
    id: 7,
    title: "HR Generalist",
    company: "WorkCulture Pvt Ltd",
    location: "Bangalore",
    type: "Full-time",
    exp: "2 - 5 years",
    salary: "₹4.5 LPA - ₹8.0 LPA",
    skills: ["Payroll", "Policies", "Compliance"],
    category: "HR",
  },
  {
    id: 8,
    title: "Talent Acquisition Specialist",
    company: "HireSmart",
    location: "Hyderabad",
    type: "Full-time",
    exp: "3 - 6 years",
    salary: "₹5.0 LPA - ₹9.5 LPA",
    skills: ["Sourcing", "LinkedIn Hiring"],
    category: "HR",
  },
  {
    id: 9,
    title: "HR Coordinator",
    company: "NextGen Corp",
    location: "Pune",
    type: "Full-time",
    exp: "0 - 2 years",
    salary: "₹2.5 LPA - ₹4.0 LPA",
    skills: ["Documentation", "Employee Support"],
    category: "HR",
  },
  {
    id: 10,
    title: "HR Manager",
    company: "Elite Enterprises",
    location: "Delhi",
    type: "Full-time",
    exp: "6 - 10 years",
    salary: "₹10.0 LPA - ₹18.0 LPA",
    skills: ["Leadership", "Strategy", "Compliance"],
    category: "HR",
  },

  /* ================= MARKETING ================= */
  {
    id: 11,
    title: "Digital Marketing Executive",
    company: "BrandBoost",
    location: "Mumbai",
    type: "Full-time",
    exp: "1 - 3 years",
    salary: "₹4.0 LPA - ₹7.0 LPA",
    skills: ["SEO", "Google Ads", "Analytics"],
    category: "Marketing",
  },
  {
    id: 12,
    title: "Social Media Manager",
    company: "TrendHive",
    location: "Remote",
    type: "Full-time",
    exp: "2 - 4 years",
    salary: "₹5.0 LPA - ₹9.0 LPA",
    skills: ["Instagram", "Content Strategy"],
    category: "Marketing",
  },
  {
    id: 13,
    title: "Content Marketing Specialist",
    company: "Contentify",
    location: "Bangalore",
    type: "Full-time",
    exp: "2 - 5 years",
    salary: "₹6.0 LPA - ₹10.0 LPA",
    skills: ["Blogging", "Copywriting"],
    category: "Marketing",
  },
  {
    id: 14,
    title: "Performance Marketer",
    company: "AdSprint",
    location: "Hyderabad",
    type: "Full-time",
    exp: "3 - 6 years",
    salary: "₹8.0 LPA - ₹14.0 LPA",
    skills: ["Meta Ads", "Google Ads"],
    category: "Marketing",
  },
  {
    id: 15,
    title: "Email Marketing Executive",
    company: "MailerPro",
    location: "Pune",
    type: "Full-time",
    exp: "1 - 3 years",
    salary: "₹3.5 LPA - ₹6.5 LPA",
    skills: ["Mailchimp", "Campaigns"],
    category: "Marketing",
  },

  /* ================= DESIGN ================= */
  {
    id: 16,
    title: "UI/UX Designer",
    company: "DesignStudio",
    location: "Bangalore",
    type: "Full-time",
    exp: "2 - 5 years",
    salary: "₹6.0 LPA - ₹12.0 LPA",
    skills: ["Figma", "Wireframes"],
    category: "Design",
  },
  {
    id: 17,
    title: "Graphic Designer",
    company: "CreativeEdge",
    location: "Mumbai",
    type: "Full-time",
    exp: "1 - 4 years",
    salary: "₹4.0 LPA - ₹8.0 LPA",
    skills: ["Photoshop", "Illustrator"],
    category: "Design",
  },
  {
    id: 18,
    title: "Product Designer",
    company: "InnovateTech",
    location: "Remote",
    type: "Full-time",
    exp: "3 - 6 years",
    salary: "₹10.0 LPA - ₹18.0 LPA",
    skills: ["UX Research", "Prototyping"],
    category: "Design",
  },
  {
    id: 19,
    title: "Motion Designer",
    company: "MotionWorks",
    location: "Pune",
    type: "Full-time",
    exp: "2 - 5 years",
    salary: "₹5.0 LPA - ₹9.0 LPA",
    skills: ["After Effects", "Animation"],
    category: "Design",
  },
  {
    id: 20,
    title: "Web Designer",
    company: "PixelPerfect",
    location: "Chennai",
    type: "Full-time",
    exp: "1 - 3 years",
    salary: "₹4.5 LPA - ₹7.5 LPA",
    skills: ["HTML", "CSS", "Figma"],
    category: "Design",
  },

  /* ================= NURSING ================= */
  {
    id: 21,
    title: "Staff Nurse",
    company: "Apollo Hospital",
    location: "Hyderabad",
    type: "Full-time",
    exp: "1 - 4 years",
    salary: "₹3.0 LPA - ₹5.5 LPA",
    skills: ["Patient Care", "Ward Management"],
    category: "Nursing",
  },
  {
    id: 22,
    title: "ICU Nurse",
    company: "Fortis Healthcare",
    location: "Delhi",
    type: "Full-time",
    exp: "2 - 6 years",
    salary: "₹4.5 LPA - ₹8.0 LPA",
    skills: ["Critical Care", "Ventilator Handling"],
    category: "Nursing",
  },
  {
    id: 23,
    title: "Home Care Nurse",
    company: "CarePlus",
    location: "Chennai",
    type: "Full-time",
    exp: "0 - 2 years",
    salary: "₹2.5 LPA - ₹4.0 LPA",
    skills: ["Patient Assistance"],
    category: "Nursing",
  },
  {
    id: 24,
    title: "Pediatric Nurse",
    company: "Rainbow Children Hospital",
    location: "Bangalore",
    type: "Full-time",
    exp: "2 - 5 years",
    salary: "₹4.0 LPA - ₹7.0 LPA",
    skills: ["Child Care", "Vaccination"],
    category: "Nursing",
  },
  {
    id: 25,
    title: "Operation Theatre Nurse",
    company: "MedLife",
    location: "Mumbai",
    type: "Full-time",
    exp: "3 - 7 years",
    salary: "₹5.0 LPA - ₹9.0 LPA",
    skills: ["Surgery Assistance"],
    category: "Nursing",
  },
];

/* -------------------- PAGE -------------------- */
export default function JobsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const categoryNames = Object.keys(categoriesData);

  const filteredJobs = jobs.filter((job) => {
    const matchesCategory = activeCategory === null || job.category === activeCategory;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

     
      {/* ===== JOB CATEGORIES SECTION ===== */}
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
              Explore Career At <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Shiksha Nex Jobs</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select a category to view available opportunities and start your journey
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
                    {jobs.filter((j) => j.category === catName).length} Jobs
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
                    Browse all {activeCategory} opportunities and find your perfect role
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
                placeholder="Search jobs by title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-gray-700 placeholder-gray-400 transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== JOB LIST ===== */}
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
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(37, 99, 235, 0.15)" }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl border-l-4 border-blue-600 p-6 md:p-8 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      {/* Job Details */}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {job.title}
                        </h3>
                        <p className="text-lg text-blue-600 font-semibold mb-4">
                          {job.company}
                        </p>

                        {/* Job Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Briefcase className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{job.type}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{job.exp}</span>
                          </div>
                          <div className="text-green-600 font-bold text-sm">
                            {job.salary}
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill) => (
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
                    {activeCategory ? `No ${activeCategory} jobs found matching your search.` : "Select a category to view available jobs."}
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
