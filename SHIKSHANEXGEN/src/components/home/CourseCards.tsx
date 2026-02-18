import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Users, Award, ArrowRight } from "lucide-react";

interface Course {
  title: string;
  duration: string;
  students: string;
  category: string;
  categoryColor: string;
}

interface CourseSection {
  title: string;
  titleColor: string;
  courses: Course[];
  href: string;
}

const courseSections: CourseSection[] = [
  {
    title: "IT Courses",
    titleColor: "text-tech",
    href: "/courses/it",
    courses: [
      { title: "Java Full Stack with AI", duration: "6 Months", students: "500+", category: "Development", categoryColor: "bg-tech/10 text-tech" },
      { title: "Python Full Stack with AI", duration: "6 Months", students: "450+", category: "Development", categoryColor: "bg-tech/10 text-tech" },
      { title: "AI / Machine Learning with AI", duration: "4 Months", students: "300+", category: "AI/ML", categoryColor: "bg-tech/10 text-tech" },
      { title: "Data Analytics with AI", duration: "3 Months", students: "400+", category: "Data", categoryColor: "bg-tech/10 text-tech" },
      { title: "AWS & Cloud Computing with AI", duration: "3 Months", students: "350+", category: "Cloud", categoryColor: "bg-tech/10 text-tech" },
      { title: "Cyber Security with AI", duration: "4 Months", students: "250+", category: "Security", categoryColor: "bg-tech/10 text-tech" },
    ],
  },
  {
    title: "HR Training Programs",
    titleColor: "text-hr",
    href: "/courses/hr",
    courses: [
      { title: "HR Generalist", duration: "3 Months", students: "300+", category: "Core HR", categoryColor: "bg-hr/10 text-hr" },
      { title: "HR Recruiter (IT & Non-IT)", duration: "2 Months", students: "400+", category: "Recruitment", categoryColor: "bg-hr/10 text-hr" },
      { title: "Payroll & Compliance", duration: "2 Months", students: "200+", category: "Payroll", categoryColor: "bg-hr/10 text-hr" },
      { title: "Talent Acquisition", duration: "2 Months", students: "250+", category: "Hiring", categoryColor: "bg-hr/10 text-hr" },
    ],
  },
  {
    title: "Digital Marketing Courses",
    titleColor: "text-marketing",
    href: "/courses/digital-marketing",
    courses: [
      { title: "Complete Digital Marketing", duration: "4 Months", students: "500+", category: "Full Course", categoryColor: "bg-marketing/10 text-marketing" },
      { title: "SEO Mastery", duration: "2 Months", students: "350+", category: "SEO", categoryColor: "bg-marketing/10 text-marketing" },
      { title: "Social Media Marketing", duration: "2 Months", students: "400+", category: "SMM", categoryColor: "bg-marketing/10 text-marketing" },
      { title: "Google Ads (PPC)", duration: "1 Month", students: "300+", category: "Ads", categoryColor: "bg-marketing/10 text-marketing" },
    ],
  },
  {
    title: "Graphic Design Courses",
    titleColor: "text-design",
    href: "/courses/graphic-design",
    courses: [
      { title: "Adobe Photoshop", duration: "2 Months", students: "400+", category: "Design", categoryColor: "bg-design/10 text-design" },
      { title: "Adobe Illustrator", duration: "2 Months", students: "350+", category: "Vector", categoryColor: "bg-design/10 text-design" },
      { title: "UI/UX Design", duration: "3 Months", students: "250+", category: "UI/UX", categoryColor: "bg-design/10 text-design" },
      { title: "Branding & Visual Design", duration: "2 Months", students: "200+", category: "Branding", categoryColor: "bg-design/10 text-design" },
    ],
  },
  {
    title: "Nursing Training Programs",
    titleColor: "text-healthcare",
    href: "/courses/nursing",
    courses: [
      { title: "Advanced Clinical Training", duration: "6 Months", students: "300+", category: "Clinical", categoryColor: "bg-healthcare/10 text-healthcare" },
      { title: "ICU & Emergency Care", duration: "3 Months", students: "250+", category: "Critical Care", categoryColor: "bg-healthcare/10 text-healthcare" },
      { title: "Patient Care & Documentation", duration: "2 Months", students: "400+", category: "Care", categoryColor: "bg-healthcare/10 text-healthcare" },
      { title: "Medical Equipment Handling", duration: "1 Month", students: "200+", category: "Equipment", categoryColor: "bg-healthcare/10 text-healthcare" },
    ],
  },
];

const CourseCards = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container">
        {courseSections.map((section, sectionIndex) => (
          <div key={section.title} className={sectionIndex > 0 ? "mt-20" : ""}>
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className={`font-heading text-2xl md:text-3xl font-bold ${section.titleColor}`}>
                {section.title}
              </h2>
              <Link to={section.href}>
                <Button variant="outline" size="sm" className="group">
                  View All
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Course Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {section.courses.map((course) => (
                <div
                  key={course.title}
                  className="group bg-card rounded-xl border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="p-5">
                    {/* Category Badge */}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${course.categoryColor} mb-4`}>
                      {course.category}
                    </span>
                    
                    {/* Course Title */}
                    <h3 className="font-heading font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    
                    {/* Course Meta */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                  
                  {/* Footer */}
                  <div className="px-5 py-3 bg-muted/30 border-t flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Award className="h-4 w-4" />
                      <span>Certificate</span>
                    </div>
                    <Link to="/apply" className="text-sm font-medium text-primary hover:underline">
                      Enroll Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CourseCards;
