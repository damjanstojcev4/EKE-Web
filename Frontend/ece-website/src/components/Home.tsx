import { type FC } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  Zap,
  BookOpen,
  Plane,
  Briefcase,
  Laptop,
  Leaf,
  Dumbbell,
  Users,
  Scale,
} from "lucide-react";

import heroImage from "../assets/hero-background.jpg";
import Partners from "./Partners";
import RecentProjects from "./RecentProjects";
import about from "../assets/about-us-bg.jpg";

const Home: FC = () => {
  const aims = [
    {
      text: "Personal and professional development",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      text: "Promoting mobility within the country and abroad",
      icon: Plane,
      color: "text-purple-600",
    },
    {
      text: "Promote entrepreneurship",
      icon: Briefcase,
      color: "text-yellow-600",
    },
    {
      text: "Digital literacy, digital skills and digital transformation",
      icon: Laptop,
      color: "text-indigo-600",
    },
    {
      text: 'Sustainable development and the "green agenda"',
      icon: Leaf,
      color: "text-green-600",
    },
    {
      text: "Promote a healthy lifestyle through sports and sports activities",
      icon: Dumbbell,
      color: "text-red-600",
    },
    {
      text: "Advocate for human rights and empowerment of vulnerable and marginalized groups",
      icon: Users,
      color: "text-pink-600",
    },
    {
      text: "Stand for democratic values and standards",
      icon: Scale,
      color: "text-gray-700",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section
        className="h-screen w-full bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          className="relative z-10 text-center px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
            Celebrating Europe&apos;s Rich{" "}
            <span className="text-yellow-400">Cultural Heritage</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Connecting people, ideas, and communities for a brighter tomorrow.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/projects"
              className="px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow hover:bg-yellow-300 transition"
            >
              Explore Projects
            </Link>
            <Link
              to="/about-us"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-500 transition"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-400 text-center whitespace-nowrap">
            Vision & Mission
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              className="flex flex-col items-center text-center"
              whileHover={{ scale: 1.05 }}
            >
              <Eye className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Vision</h3>
              <p className="text-gray-600 max-w-md">
                High quality education that offers equal educational
                opportunities for all.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center text-center"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Mission</h3>
              <p className="text-gray-600 max-w-md">
                The main aim of the association is to provide high quality
                non-formal educational programs to promote personal and
                professional development for the citizens from the local
                community and abroad.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="relative py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-blue-500">
              About Us
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Since 2012, European Cultural Epicenter (EKE) has been fostering
              positive values and empowering youth through non-formal education,
              workshops, trainings, and international projects. Our mission is
              to connect communities and inspire sustainable change.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mt-4">
              <Link
                to="/about-us"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-500 transition text-center"
              >
                Discover More
              </Link>

              <a
                href="src/assets/PIF EKE Bitola 2025.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-800 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition text-center"
              >
                Become Partner
              </a>
            </div>
          </div>

          {/* Image / Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden shadow-lg"
          >
            <img
              src={about}
              alt="About Us"
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-yellow-500/30" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section>
        <div className="mt-20 mb-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-orange-500 mb-2">
              12+
            </div>
            <div className="text-gray-600 text-sm font-medium">
              Years of Experience
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">
              500+
            </div>
            <div className="text-gray-600 text-sm font-medium">
              Participants Trained
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-pink-700 mb-2">
              50+
            </div>
            <div className="text-gray-600 text-sm font-medium">
              Successful Projects
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-blue-700 mb-2">
              15+
            </div>
            <div className="text-gray-600 text-sm font-medium">
              Partner Organizations
            </div>
          </div>
        </div>
      </section>

      {/* Our Aims */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-green-500">
            Our Aims
          </h1>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            We are committed to achieving these key objectives through our
            programs and initiatives.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {aims.map((aim, index) => {
              const Icon = aim.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition"
                  whileHover={{ scale: 1.02 }}
                >
                  <Icon className={`w-7 h-7 shrink-0 ${aim.color}`} />
                  <p className="text-left text-gray-700">{aim.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <RecentProjects />
      </div>

      {/* Partners */}
      <Partners />
    </>
  );
};

export default Home;
