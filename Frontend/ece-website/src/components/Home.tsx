import { type FC, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import NewsCarousel from "./NewsCarousel";
import team from "../assets/o-bg.jpg";
import about from "../assets/about-us-bg.jpg";
import vma from "../assets/vma-vele.jpg";
import projects from "../assets/our-projects.jpg";
import docs from "../assets/documents-vele.jpg";
import resources from "../assets/resources-vele.jpg";
import gitv from "../assets/get-in-touch-vele.jpg";

const InteractiveImage: FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isColored, setIsColored] = useState(false);

  const handleTap = () => {
    if (window.innerWidth < 768) {
      setIsColored((prev) => !prev);
    }
  };

  return (
    <img
      src={src}
      alt={alt}
      onClick={handleTap}
      className={`
        w-full h-80 object-cover rounded-xl shadow-lg transition-all duration-700
        ${isColored ? "grayscale-0" : "grayscale"}
        md:grayscale md:hover:grayscale-0
        cursor-pointer
      `}
    />
  );
};

const Home: FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle hash-based navigation
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  return (
    <>
      {/* Hero Section */}
      <NewsCarousel />

      {/* About Us Section */}
      <section id="about-us" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-1 md:order-1">
            <InteractiveImage src={about} alt="About Us" />
          </div>

          <div className="order-2 md:order-2 space-y-4 text-left">
            <h3 className="text-teal-500 text-3xl font-semibold">EKE Bitola</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Learn about our journey, values, and the impact we've made in
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
      <section id="about-team" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 space-y-4 text-left">
            <h3 className="text-teal-500 text-3xl font-semibold">Our Team</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Meet the passionate individuals behind EKE Bitola — a team of
              dedicated professionals and volunteers working together to inspire
              and empower communities. Our members bring expertise, creativity,
              and heart to every project, making meaningful change a reality.
            </p>
            <div className="flex justify-start">
              <Link
                to="/our-team"
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

          <div className="order-1 md:order-2">
            <InteractiveImage src={team} alt="Our Team" />
          </div>
        </div>
      </section>

      {/* Vision, Mission & Aims */}
      <section id="about-mission" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-1 md:order-1">
            <InteractiveImage src={vma} alt="Vision Mission Aims" />
          </div>

          <div className="order-2 md:order-2 space-y-4 text-left">
            <h3 className="text-teal-500 text-3xl font-semibold">
              Vision & Mission
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our vision is a world where every individual has the opportunity
              to thrive. Through our mission and aims, we work towards
              sustainable development, education, and empowerment for all.
            </p>
            <div className="flex justify-start">
              <Link
                to="/vma"
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
      <section id="about-projects" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 space-y-4 text-left">
            <h3 className="text-teal-500 text-3xl font-semibold">Projects & Initiatives</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Discover the initiatives and programs we've launched to address
              critical social issues. From education to healthcare, our projects
              are designed to create lasting positive change.
            </p>
            <div className="flex justify-start">
              <Link
                to="/projects"
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

          <div className="order-1 md:order-2">
            <InteractiveImage src={projects} alt="Our Projects" />
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section id="documents" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-1 md:order-1">
            <InteractiveImage src={docs} alt="Documents" />
          </div>

          <div className="order-2 md:order-2 space-y-4 text-left">
            <h3 className="text-teal-500 text-3xl font-semibold">Documents</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Access our reports, publications, and official documents. We
              believe in transparency and accountability, making our work and
              progress available to all stakeholders.
            </p>
            <div className="flex justify-start">
              <Link
                to="/documents"
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
      <section id="about-resources" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 space-y-4 text-left">
            <h3 className="text-teal-500 text-3xl font-semibold">Resources</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Explore our collection of tools, guides, and educational materials
              designed to support community development and empower individuals
              with knowledge.
            </p>
            <div className="flex justify-start">
              <Link
                to="/resources"
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

          <div className="order-1 md:order-2">
            <InteractiveImage src={resources} alt="Resources" />
          </div>
        </div>
      </section>

      {/* Get In Touch Section */}
      <section id="get-in-touch" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-1 md:order-1">
            <InteractiveImage src={gitv} alt="Get In Touch" />
          </div>

          <div className="order-2 md:order-2 space-y-4 text-left">
            <h3 className="text-teal-500 text-3xl font-semibold">
              Get In Touch
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Have questions or want to get involved? We'd love to hear from
              you. Reach out to learn more about our work, volunteer
              opportunities, or partnership possibilities.
            </p>
            <div className="flex justify-start">
              <Link
                to="/contact"
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