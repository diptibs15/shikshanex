import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Public Pages
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import CoursesPage from "./pages/CoursesPage";
import PlacementPage from "./pages/PlacementPage";
import ContactPage from "./pages/ContactPage";
import CareersPage from "./pages/CareersPage";
import ApplyPage from "./pages/ApplyPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import HRTrainingPage from "./pages/HRTrainingPage";
import JobsPage from "./pages/jobs"; // Fixed import capitalization
import InternshipPage from "./pages/Internship";





// Dashboard Layout & Pages
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardCourses from "./pages/dashboard/DashboardCourses";
import DashboardInterview from "./pages/dashboard/DashboardInterview";
import DashboardProfile from "./pages/dashboard/DashboardProfile";
import InterviewRoundPage from "./pages/dashboard/InterviewRoundPage";
import DashboardPayments from "./pages/dashboard/DashboardPayments";
import DashboardCertificates from "./pages/dashboard/DashboardCertificates";
import DashboardInternship from "./pages/dashboard/DashboardInternship";
import DashboardResume from "./pages/dashboard/DashboardResume";
import DashboardPortfolio from "./pages/dashboard/DashboardPortfolio";
import DashboardProjects from "./pages/dashboard/DashboardProjects";
import DashboardPlacement from "./pages/dashboard/DashboardPlacement";
import CourseLearning from "./pages/dashboard/CourseLearning";
import DashboardProgress from "./pages/dashboard/DashboardProgress";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminInterviews from "./pages/admin/AdminInterviews";
import AdminEmployers from "./pages/admin/AdminEmployers";
import AdminCertificates from "./pages/admin/AdminCertificates";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSettings from "./pages/admin/AdminSettings";

// Employer Pages
import EmployerLayout from "./layouts/EmployerLayout";
import EmployerAuth from "./pages/employer/EmployerAuth";
import EmployerRegister from "./pages/employer/EmployerRegister";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import EmployerJobs from "./pages/employer/EmployerJobs";
import EmployerCandidates from "./pages/employer/EmployerCandidates";
import EmployerCompany from "./pages/employer/EmployerCompany";
import EmployerDocuments from "./pages/employer/EmployerDocuments";
import EmployerSettings from "./pages/employer/EmployerSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:category" element={<CoursesPage />} />
            <Route path="/placement" element={<PlacementPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/internships" element={<InternshipPage />} />
            <Route path="/hr-training" element={<HRTrainingPage />} />
            <Route path="/apply" element={<ApplyPage />} />
            <Route path="/auth" element={<AuthPage />} />

           

            {/* Employer Auth Routes */}
            <Route path="/employer/auth" element={<EmployerAuth />} />
            <Route path="/employer/register" element={<EmployerRegister />} />

            {/* Employer Dashboard Routes */}
            <Route path="/employer" element={<EmployerLayout />}>
              <Route index element={<EmployerDashboard />} />
              <Route path="jobs" element={<EmployerJobs />} />
              <Route path="candidates" element={<EmployerCandidates />} />
              <Route path="company" element={<EmployerCompany />} />
              <Route path="documents" element={<EmployerDocuments />} />
              <Route path="settings" element={<EmployerSettings />} />
            </Route>

            {/* Student Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="courses" element={<DashboardCourses />} />
              <Route path="courses/:courseId/learn" element={<CourseLearning />} />
              <Route path="interview" element={<DashboardInterview />} />
              <Route path="interview/:categoryId/:round" element={<InterviewRoundPage />} />
              <Route path="payments" element={<DashboardPayments />} />
              <Route path="certificates" element={<DashboardCertificates />} />
              <Route path="internship" element={<DashboardInternship />} />
              <Route path="resume" element={<DashboardResume />} />
              <Route path="portfolio" element={<DashboardPortfolio />} />
              <Route path="projects" element={<DashboardProjects />} />
              <Route path="placement" element={<DashboardPlacement />} />
              <Route path="progress" element={<DashboardProgress />} />
              <Route path="profile" element={<DashboardProfile />} />
            </Route>

            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={<DashboardLayout isAdmin />}>
              <Route index element={<AdminDashboard />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="interviews" element={<AdminInterviews />} />
              <Route path="employers" element={<AdminEmployers />} />
              <Route path="certificates" element={<AdminCertificates />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
