import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Target, Lightbulb} from "lucide-react";
import vma from "../assets/vma-vele.jpg";

const VisionMissionAims: React.FC = () => {
  const [isColored, setIsColored] = useState(false);

  const toggleColor = () => {
    setIsColored(!isColored);
  };

  const aims = [
    {
      title: "1. Expand Educational Access",
      description:
        "Build capacity within local educators for underserved communities, with a focus on literacy and digital literacy programs that prepare individuals for the new economy.",
    },
    {
      title: "2. Strengthen Community Resilience",
      description:
        "Equip and develop vulnerable communities to respond to challenges, adapt to change, and develop sustainable solutions that build local resilience through skills training and inclusive collaboration.",
    },
    {
      title: "3. Promote Health & Well-being",
      description:
        "Support initiatives that improve physical and mental health outcomes, with emphasis on preventive care, health education, and access to essential services.",
    },
    {
      title: "4. Foster Economic Opportunity",
      description:
        "Create pathways to income generation through skills development, entrepreneurship support, and access to microfinance and resources.",
    },
    {
      title: "5. Advance Environmental Sustainability",
      description:
        "Implement programs that protect natural resources, promote sustainable practices, and advance climate change mitigation in vulnerable communities.",
    },
    {
      title: "6. Advocate for Social Justice",
      description:
        "Champion the rights of marginalized groups, promote equality, and work to eliminate barriers that hinder inclusion from reaching their full potential.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-teal-50 to-white min-h-screen py-16 px-6 pt-40">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Back Button */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-teal-500 text-lg font-semibold">
            Vision, Mission & Aims
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Guiding principles that drive our work and shape our commitment to positive change.
          </p>
        </div>

        {/* Image + Vision / Mission */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div
            onClick={toggleColor}
            className="cursor-pointer w-full h-80 overflow-hidden rounded-xl shadow-lg"
          >
            <img
              src={vma}
              alt="Vision and Mission"
              className={`w-full h-full object-cover transition-all duration-700 rounded-xl ${
                isColored
                  ? "grayscale-0"
                  : "grayscale md:grayscale md:hover:grayscale-0"
              }`}
            />
          </div>

          {/* Text */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Lightbulb className="text-teal-500 w-6 h-6 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Our Vision
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  A world where every individual, regardless of their background or circumstance, has the opportunity to thrive. We envision communities that are inclusive, fair, and resilient — where collaboration and innovation lead to the foundations of education, empowerment, and social justice.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Target className="text-teal-500 w-6 h-6 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Our Mission
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  To empower communities through sustainable development initiatives, knowledge sharing, and inclusive partnerships. Our mission focuses on promoting education, innovation, and equitable growth by creating evidence-based interventions and culturally sensitive approaches.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Aims */}
        <div>
          <h3 className="text-teal-500 text-lg font-semibold mb-6">
            Our Strategic Aims
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {aims.map((aim, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <h4 className="font-semibold text-gray-800 mb-2">
                  {aim.title}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {aim.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Approach */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h3 className="text-teal-500 text-lg font-semibold mb-4">
            Our Approach
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We believe that sustainable change requires a holistic, community-centered approach. Our work is guided by principles of:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Participation:</strong> Engaging communities as active partners in all stages of program design and implementation.
            </li>
            <li>
              <strong>Evidence-Based Practices:</strong> Utilizing data-driven insights to ensure our initiatives are effective and impactful.
            </li>
            <li>
              <strong>Collaboration:</strong> Working closely with stakeholders to build trust and long-term partnerships.
            </li>
            <li>
              <strong>Sustainability:</strong> Creating programs that continue to benefit communities long after our direct involvement ends.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VisionMissionAims;
