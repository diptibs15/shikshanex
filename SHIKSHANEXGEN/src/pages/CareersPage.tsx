import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import professionalWoman from "@/assets/professional-woman.jpg";


import JonInternShikshaTechPartner from "@/components/careers/JonInternShikshaTechPartner";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

     

        {/* ===== HERO SECTION ===== */}
        <section className="gradient-hero text-primary-foreground py-20 overflow-hidden">
          <div className="container flex flex-col lg:flex-row items-center justify-between gap-12">


            <div className="max-w-2xl text-center lg:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="font-heading text-5xl md:text-4xl lg:text-5xl font-bold mb-8"
              >
                SuperChange{" "}
                <span className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                    className="inline-block whitespace-nowrap border-r-4 border-white pr-2"
                  >
                    Your TechFuture with Shiksha Nex
                  </motion.span>
                </span>
              </motion.h1>

              <motion.p
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 0.4 }}
  className="text-xl md:text-2xl font-semibold mb-8"
>

<span className="text-[#2DD4BF]">
  Explore opportunities across IT, HR, Digital Marketing, Graphic Design & Nursing.
  Salary range: ₹4 to ₹35 LPA.
</span>



</motion.p>


        <div className="relative max-w-xl mx-auto lg:mx-0">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
 <div className="relative max-w-xl mx-auto lg:mx-0">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
  <Input
    placeholder="Search careers..."
    className="pl-12 h-14 text-lg bg-[#F9FAFB] 
               border-2 border-black
               text-gray-900
               placeholder:text-gray-400
               focus:border-black
               focus:ring-0
               outline-none"
  />
</div>

</div>


            </div>


            <motion.div
              initial={{ opacity: 0, x: 120 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/30 blur-3xl"></div>
                <img
                  src={professionalWoman}
                  alt="Professional"
                  className="relative w-[420px] aspect-square object-cover rounded-full shadow-2xl border-4 border-white"
                />
              </div>
            </motion.div>
          </div>
        </section>

 <main>
       {/* ===== INTERNSHIPS SECTION ===== */}
       <JonInternShikshaTechPartner/>

      </main>

      <Footer />
    </div>
  );
}
