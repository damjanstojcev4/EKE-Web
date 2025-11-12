import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ekeLogo from "../assets/EKE_logo PNG.png";
import logoBlackWhite from "../assets/logo-black-white.png";

const teamMembers = [
  {
    name: "Vele Georgiev",
    position: "President",
    image: ekeLogo,
  },
  {
    name: "Ivana Baltovska",
    position: "Project Manager",
    image: logoBlackWhite,
  },
  {
    name: "Sofija Mickoska",
    position: "Project Assistant",
    image: ekeLogo,
  },
  {
    name: "Dimitar Gogu",
    position: "Accountant",
    image: logoBlackWhite,
  },
  {
    name: "Hristina Gogu",
    position: "Designer",
    image: logoBlackWhite,
  },
];

const OurTeam: React.FC = () => {
  const [coloredIndex, setColoredIndex] = useState<number | null>(null);

  const toggleColor = (index: number) => {
    setColoredIndex(coloredIndex === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-b from-teal-50 to-white min-h-screen py-16 px-6 pt-40">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Back Button */}
        <div className="mb-4">
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
          <h2 className="text-teal-500 text-lg font-semibold">Our Team</h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Meet the passionate individuals who make up our organization. Each member brings unique skills, creativity, and commitment to driving meaningful change in our communities.
          </p>
        </div>

        {/* Team Members */}
        <section className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center hover:shadow-xl transition"
            >
              <div className="w-48 h-48 mb-4 overflow-hidden shadow-md cursor-pointer rounded-xl">
                <img
                  src={member.image}
                  alt={member.name}
                  onClick={() => toggleColor(index)}
                  className={`w-full h-full object-cover transition-all duration-700 rounded-xl
                    ${
                      coloredIndex === index
                        ? "grayscale-0"
                        : "grayscale md:grayscale md:hover:grayscale-0"
                    }`}
                />
              </div>
              <h1 className="text-xl font-semibold text-gray-800">{member.name}</h1>
              <h3 className="text-teal-600 font-medium">{member.position}</h3>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default OurTeam;
