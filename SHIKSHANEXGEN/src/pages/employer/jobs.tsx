import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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

/* -------------------- DATA -------------------- */
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
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "IT", "HR", "Marketing", "Design", "Nursing"];

  const filteredJobs =
    activeCategory === "All"
      ? jobs
      : jobs.filter((job) => job.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-white-300 text-white">
      <Navbar />

      {/* ================= HEADER ================= */}
<header className="relative overflow-hidden">
<div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-900 via-orange-500 to-blue-1500">
  {/* Lightning Overlay */}
  <motion.div
    animate={{ x: [500, 1500, 400, 0] }}
    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    className="absolute top-0 left-0 w-full h-full bg-white opacity-10 max-blend-screen"
  />
</div>


  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 py-20">
    {/* Left: Animated Heading + Quote */}
    <div className="flex-1 space-y-6">
      <motion.h1
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-extrabold text-white"
      >
        Shiksha Job Portal
      </motion.h1>

      {/* IT Quote */}
      <AnimatePresence>
        {activeCategory === "IT" && (
          <motion.div
            initial={{ x: -500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, type: "spring", stiffness: 50 }}
            className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg shadow-lg inline-block"
          >
            <motion.p
              animate={{ x: [0, 10, -10, 0], opacity: [0.8, 1, 0.8, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="text-blue-700 font-medium text-lg"
            >
              💻 "Technology is best when it brings people together — Build the future with code!"
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* Right: Professional Image */}
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex-1 mt-10 md:mt-0 md:ml-12"
    >
      <img
        src="https://images.unsplash.com/photo-1603415526960-f2f9c38fbb9b?auto=format&fit=crop&w=600&q=80"
        alt="Professional IT girl"
        className="w-full h-full object-cover rounded-lg shadow-2xl"
      />
    </motion.div>
  </div>
</header>


      {/* ================= CATEGORY TABS ================= */}
      <div className="flex flex-wrap justify-center gap-4 mt-12 mb-8 px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              activeCategory === cat
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-900 shadow hover:bg-blue-100"
            }`}
          >
            {cat} Jobs
          </button>
        ))}
      </div>

      {/* ================= JOB LIST ================= */}
      <main className="flex-1 px-4 md:px-8 pb-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center transition"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {job.title}
                    </h3>
                    <p className="text-gray-700">{job.company}</p>
                    <div className="flex flex-wrap gap-4 text-sm mt-2 text-gray-600">
                      <span>📍 {job.location}</span>
                      <span>{job.type}</span>
                      <span>Exp: {job.exp}</span>
                    </div>
                    <p className="text-green-600 font-semibold mt-3">{job.salary}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="mt-6 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition">
                    Apply Now →
                  </button>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-400">
                No jobs available in this category.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
