import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Briefcase, GraduationCap, Handshake } from "lucide-react";

export default function CareerActions() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Explore Jobs",
      description: "Discover high-paying opportunities across top companies",
      icon: Briefcase,
      action: () => navigate("/jobs"),
    },
    {
      title: "Explore Internships",
      description: "Gain real-world experience & build your career foundation",
      icon: GraduationCap,
      action: () => navigate("/internships"),
    },
    {
      title: "Shiksha Tech Partner",
      description: "Partner with us to hire skilled and certified professionals",
      icon: Handshake,
      action: () => navigate("/partners"),
    },
  ];

  return (
   <section className="py-40 bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]">


      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A]">
  Choose Your <span className="text-blue-600">Career Path</span>
</h2>

          <p className="text-gray-600 mt-4 text-lg">
            Everything you need to start, grow and scale your career
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-4xl border border-blue-100 p-8 text-center transition-all duration-300"
              >
                {/* Icon Circle */}
                <div className="mx-auto mb-6 w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-600 transition">
                  <Icon className="w-10 h-10 text-blue-600 group-hover:text-white transition" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-8">
                  {card.description}
                </p>

                {/* Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={card.action}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Get Started
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
