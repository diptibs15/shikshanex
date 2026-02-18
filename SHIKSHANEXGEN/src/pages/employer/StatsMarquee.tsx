import React from "react";

/* -------------------- DATA -------------------- */

type Item =
  | { type: "stat"; value: string; label: string }
  | { type: "logo"; src: string; alt: string };

const items: Item[] = [
  { type: "stat", value: "₹12L", label: "Average Salary" },
  { type: "stat", value: "500+", label: "Hiring Partners" },

  { type: "logo", src: "/logos/tcs.png", alt: "TCS" },
  { type: "logo", src: "/logos/infosys.png", alt: "Infosys" },

  { type: "stat", value: "50K+", label: "Students Transformed" },

  { type: "logo", src: "/logos/wipro.png", alt: "Wipro" },
  { type: "logo", src: "/logos/accenture.png", alt: "Accenture" },

  { type: "stat", value: "100%", label: "Placement Rate" },

  { type: "logo", src: "/logos/amazon.png", alt: "Amazon" },
  { type: "logo", src: "/logos/hcl.png", alt: "HCL" },
];

/* -------------------- STAT CARD -------------------- */

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="relative min-w-[220px] h-[110px] rounded-2xl p-[2px] group">

    {/* Animated Border */}
    <div className="
      absolute inset-0 rounded-2xl
      bg-[conic-gradient(from_0deg,theme(colors.indigo.500),theme(colors.pink.500),theme(colors.orange.400),theme(colors.indigo.500))]
      animate-spin-slow opacity-70 group-hover:opacity-100 blur-[1px]
    " />

    <div className="
      relative h-full w-full rounded-2xl bg-white
      flex flex-col items-center justify-center text-center
      transition-all duration-300
      group-hover:-translate-y-2
      group-hover:shadow-[0_15px_40px_rgba(99,102,241,0.35)]
    ">
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  </div>
);

/* -------------------- LOGO CARD -------------------- */

const LogoCard = ({ src, alt }: { src: string; alt: string }) => (
  <div className="min-w-[180px] h-[110px] bg-white rounded-2xl shadow-md flex items-center justify-center p-6 hover:scale-105 transition">
    <img
      src={src}
      alt={alt}
      className="max-h-12 object-contain grayscale hover:grayscale-0 transition duration-300"
    />
  </div>
);

/* -------------------- MAIN -------------------- */

export default function StatsMarquee() {

  const renderItem = (item: Item, i: number) => {
    if (item.type === "stat") return <StatCard key={i} {...item} />;
    return <LogoCard key={i} {...item} />;
  };

  return (
    <section className="w-full py-14 bg-gray-50 overflow-hidden">
      <h2 className="text-center text-2xl font-semibold text-gray-700 mb-10">
        Trusted by Top Companies
      </h2>

      {/* Row 1 — Right → Left */}
      <div className="relative overflow-hidden mb-6">
        <div className="flex w-max animate-marquee-left gap-6 hover:[animation-play-state:paused]">
          {[...items, ...items].map(renderItem)}
        </div>
      </div>

      {/* Row 2 — Left → Right */}
      <div className="relative overflow-hidden">
        <div className="flex w-max animate-marquee-right gap-6 hover:[animation-play-state:paused]">
          {[...items.slice().reverse(), ...items.slice().reverse()].map(renderItem)}
        </div>
      </div>

    </section>
  );
}


