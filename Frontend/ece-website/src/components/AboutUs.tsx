import BecomePartner from "./BecomePartner";
import Contact from "./Contact";
import OurTeam from "./OurTeam";
import { motion } from "framer-motion";
import aboutus from "../assets/about-us-bg.jpg";

const AboutUs = () => {
  const blocks = [
    {
      title: "Our Foundation",
      text: `EKE was established in 2012 by former participants in the Erasmus+ Plus program. Our purpose is to share the personal experiences gained from the program and create non-formal education opportunities like courses, trainings, workshops, and volunteering projects. We aim to build a society that fosters positive values and behaviors among young people and adults from both our country and abroad.`,
    },
    {
      title: "Our Team and Hub",
      text: `Our team consists of four regular staff members and four to six dedicated volunteers, with additional experts hired as needed. Located in the heart of Bitola, our 200m² office is a vibrant hub where we implement our activities and provide a valuable space for civic initiatives from the local community.`,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans text-white bg-gray-900">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[700px]">
        <img
          src={aboutus}
          alt="Group of people taking a selfie"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-5xl mx-auto h-full flex flex-col justify-center px-6 md:px-0"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-orange-400 drop-shadow-lg mb-6">
            Our Story
          </h1>
          <p className="text-lg md:text-2xl font-light leading-relaxed text-gray-200 max-w-3xl">
            European Cultural Epicenter (EKE) is more than just a name; it's a
            mission to foster positive values and empower young minds through
            non-formal education.
          </p>
        </motion.div>
      </section>

      {/* Info Blocks */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 grid gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl relative overflow-hidden"
        >
          <h2 className="text-4xl font-bold text-orange-400 mb-4">Our Story</h2>
          <p className="text-gray-200 leading-relaxed">
            European Cultural Epicenter (EKE) is committed to fostering positive
            values and empowering young people through non-formal education. Our
            mission spans workshops, trainings, and volunteering opportunities.
          </p>
        </motion.div>

        <div className="flex flex-col gap-8">
          {blocks.map((block, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className="p-6 md:p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-blue-500/30 transition transform hover:-translate-y-1"
            >
              <h3 className="text-2xl font-semibold text-blue-400 mb-2">{block.title}</h3>
              <p className="text-gray-200 leading-relaxed text-sm md:text-base">{block.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Become Partner Section */}
      <BecomePartner />

      {/* Our Team Section */}
      <OurTeam />

      {/* Contact Section */}
      <Contact />
    </div>
  );
};

export default AboutUs;
