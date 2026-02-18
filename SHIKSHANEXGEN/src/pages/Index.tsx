import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import TrainingDomains from "@/components/home/TrainingDomains";
import CourseCards from "@/components/home/CourseCards";
import PlacementSection from "@/components/home/PlacementSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <TrainingDomains />
        <CourseCards />
        <PlacementSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
