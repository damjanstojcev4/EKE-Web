import { type FC } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import team from "../assets/o-bg.jpg";
import heroImage from "../assets/hero-background.jpg";
import about from "../assets/about-us-bg.jpg";
import vma from "../assets/vma-vele.jpg";
import projects from "../assets/our-projects.jpg";
import docs from "../assets/documents-vele.jpg";
import resources from "../assets/resources-vele.jpg";
import gitv from "../assets/get-in-touch-vele.jpg";

const Home: FC = () => {
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-teal-600 leading-tight drop-shadow-lg">
            Making a Difference Together
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            We are a non-governmental organization dedicated to creating
            positive change in our communities through collaborative efforts,
            sustainable projects, and unwavering commitment to our mission.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/projects"
              className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow hover:bg-teal-800 transition"
            >
              Discover Our Work
            </Link>
          </div>
        </motion.div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-1 md:order-1">
            <img
              src={about}
              alt="About Us"
              className="
          w-full h-80 object-cover rounded-xl shadow-lg
          transition-all duration-700
          md:grayscale md:hover:grayscale-0
        "
            />
          </div>

          {/* Text */}
          <div className="order-2 md:order-2 space-y-4 text-left">
            <h3 className="text-teal-500 text-lg font-semibold">About Us</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Learn about our journey, values, and the impact we’ve made in
              communities around the world. We believe in transparency,
              collaboration, and sustainable development that empowers
              individuals and transforms societies.
            </p>

            <div className="flex justify-start">
              <Link
                to="/about-us"
                className="inline-flex items-center text-teal-600 font-semibold hover:underline"
              >
                Learn More
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="order-2 md:order-1 space-y-4 text-left">
            <h3 className="text-teal-500 text-lg font-semibold">Our Team</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Meet the passionate individuals behind EKE Bitola — a team of
              dedicated professionals and volunteers working together to inspire
              and empower communities. Our members bring expertise, creativity,
              and heart to every project, making meaningful change a reality.
            </p>

            <div className="flex justify-start">
              <Link
                to="/about-us#team"
                className="inline-flex items-center text-teal-600 font-semibold hover:underline"
              >
                Learn More
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 md:order-2">
            <img
              src={team}
              alt="Our Team"
              className="
          w-full h-80 object-cover rounded-xl shadow-lg
          transition-all duration-700
          md:grayscale md:hover:grayscale-0
        "
            />
          </div>
        </div>
      </section>

      {/* Vision, Mission & Aims*/}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-1 md:order-1">
            <img
              src={vma}
              alt="About Us"
              className="
          w-full h-80 object-cover rounded-xl shadow-lg
          transition-all duration-700
          md:grayscale md:hover:grayscale-0
        "
            />
          </div>

          {/* Text */}
          <div className="order-2 md:order-2 space-y-4 text-left">
            <h3 className="text-teal-500 text-lg font-semibold">Vision, Mission & Aims</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our vision is a world where every individual has the opportunity to thrive. 
              Through our mission and aims, we work towards sustainable development, education, and 
              empowerment for all.
            </p>

            <div className="flex justify-start">
              <Link
                to="/about-us"
                className="inline-flex items-center text-teal-600 font-semibold hover:underline"
              >
                Learn More
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Projects Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="order-2 md:order-1 space-y-4 text-left">
            <h3 className="text-teal-500 text-lg font-semibold">Our Projects</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Discover the initiatives and programs we've launched to address critical social issues. 
              From education to healthcare, 
              our projects are designed to create lasting positive change.
            </p>

            <div className="flex justify-start">
              <Link
                to="/about-us#team"
                className="inline-flex items-center text-teal-600 font-semibold hover:underline"
              >
                Learn More
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 md:order-2">
            <img
              src={projects}
              alt="Our Team"
              className="
          w-full h-80 object-cover rounded-xl shadow-lg
          transition-all duration-700
          md:grayscale md:hover:grayscale-0
        "
            />
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-1 md:order-1">
            <img
              src={docs}
              alt="About Us"
              className="
          w-full h-80 object-cover rounded-xl shadow-lg
          transition-all duration-700
          md:grayscale md:hover:grayscale-0
        "
            />
          </div>

          {/* Text */}
          <div className="order-2 md:order-2 space-y-4 text-left">
            <h3 className="text-teal-500 text-lg font-semibold">Documents</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Access our reports, publications, and official documents. 
              We believe in transparency and accountability, 
              making our work and progress available to all stakeholders.
            </p>

            <div className="flex justify-start">
              <Link
                to="/about-us"
                className="inline-flex items-center text-teal-600 font-semibold hover:underline"
              >
                Learn More
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="order-2 md:order-1 space-y-4 text-left">
            <h3 className="text-teal-500 text-lg font-semibold">Resources</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Explore our collection of tools, guides, and educational materials. 
              These resources are designed to support community development and empower individuals with knowledge.
            </p>

            <div className="flex justify-start">
              <Link
                to="/about-us#team"
                className="inline-flex items-center text-teal-600 font-semibold hover:underline"
              >
                Learn More
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 md:order-2">
            <img
              src={resources}
              alt="Our Team"
              className="
          w-full h-80 object-cover rounded-xl shadow-lg
          transition-all duration-700
          md:grayscale md:hover:grayscale-0
        "
            />
          </div>
        </div>
      </section>

      {/* Get In Touch Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-1 md:order-1">
            <img
              src={gitv}
              alt="About Us"
              className="
          w-full h-80 object-cover rounded-xl shadow-lg
          transition-all duration-700
          md:grayscale md:hover:grayscale-0
        "
            />
          </div>

          {/* Text */}
          <div className="order-2 md:order-2 space-y-4 text-left">
            <h3 className="text-teal-500 text-lg font-semibold">Get In Touch</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Have questions or want to get involved? We'd love to hear from you. 
              Reach out to learn more about our work, 
              volunteer opportunities, or partnership possibilities.
            </p>

            <div className="flex justify-start">
              <Link
                to="/about-us"
                className="inline-flex items-center text-teal-600 font-semibold hover:underline"
              >
                Learn More
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
