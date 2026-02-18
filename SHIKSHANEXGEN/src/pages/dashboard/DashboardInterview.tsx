import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Step {
  id: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  { id: 1, title: "Pay Evaluation Fee", description: "₹499 for Freshers, ₹999 for Experienced" },
  { id: 2, title: "MCQ Test", description: "30 questions • 30 mins • AI Proctored" },
  { id: 3, title: "Coding Test", description: "2 problems • 60 mins • Live Compiler & Webcam" },
  { id: 4, title: "AI HR Interview", description: "Video interview • AI Evaluation • 15 mins" },
];

const DashboardInterview = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // 🔹 Frontend-only mock payment
  const handlePaymentAndNext = async () => {
    setLoading(true);
    try {
      // Simulate payment delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Payment Successful!",
        description: "You can now start your MCQ Test.",
        variant: "success",      // ✅ Green color for success
        duration: 4000,          // Duration in ms
        position: "top",         // ✅ Show at the top
      });

      setCurrentStep(1); // mark step 1 done
      navigate("/src/components/interview/MCQTest");
    } catch (err) {
      console.error("Payment Error:", err);
      toast({
        title: "Payment Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",  // ✅ Red color for error
        duration: 4000,
        position: "top",         // ✅ Show at the top
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) navigate("/dashboard/interview/coding");
    else if (currentStep === 2) navigate("/dashboard/interview/aihr");
    else if (currentStep === 3) navigate("/dashboard/interview/congrats");

    setCurrentStep((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-12 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-center"
      >
        Shikshanix Hiring Process
      </motion.h1>

      <div className="w-full max-w-3xl space-y-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ x: 4 }}
            className={`p-6 border-2 rounded-2xl flex justify-between items-center transition-all duration-300 ${
              currentStep === index
                ? "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-500 shadow-lg"
                : currentStep > index
                ? "bg-green-50 border-green-300 shadow-md"
                : "bg-white border-gray-200 hover:border-blue-300"
            }`}
          >
            <div>
              <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{step.description}</p>
            </div>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.15 + 0.1 }}
            >
              <Badge
                className={`px-4 py-2 text-base font-semibold whitespace-nowrap ml-4 ${
                  currentStep > index
                    ? "bg-green-600 text-white"
                    : currentStep === index
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {currentStep > index ? "✓ Done" : index + 1}
              </Badge>
            </motion.div>
          </motion.div>
        ))}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={currentStep === 0 ? handlePaymentAndNext : handleNextStep}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold w-full py-3 text-lg rounded-xl transition-all duration-300 hover:shadow-lg"
            disabled={loading}
          >
            {loading ? "Processing Payment..." : currentStep === 0 ? "Pay & Start MCQ" : "Next Step"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardInterview;
