import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Lightbulb, Leaf } from "lucide-react";
import about from "../assets/about-us-bg.jpg";

const AboutUs: React.FC = () => {
  const [colorVisible, setColorVisible] = useState(false);

  const toggleColor = () => setColorVisible(!colorVisible);

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
          <h2 className="text-teal-500 text-lg font-semibold">About Us</h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Discover our story, values, and the impact we’ve made in communities
            around the world.
          </p>
        </div>

        {/* Our Story Section */}
        <section className="grid md:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <div className="order-1 md:order-1">
            <img
              src={about}
              alt="About Us"
              onClick={toggleColor}
              className={`w-full h-96 object-cover rounded-xl shadow-lg transition-all duration-700 
                ${colorVisible
                  ? "grayscale-0"
                  : "grayscale md:grayscale md:hover:grayscale-0"
                }`}
            />
          </div>

          {/* Text */}
          <div className="order-2 md:order-2 space-y-4 text-left">
            <h3 className="text-teal-500 text-lg font-semibold">Our Story</h3>
            <p className="text-gray-700 leading-relaxed">
              EKE Bitola is a non-profit organisation based in Bitola, North Macedoni, with
              main aim to provide high-quality non-formal educational programs for citizens personal and professional development.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Through our educational programs, we aim to develop citizens' competencies and cultivate core value that foster life long learning.
            </p>
            <p className="text-gray-700 leading-relaxed">
              In our programs we empower participants to recognise and develop their full potential, be able to create vision for their future and remain resilient in the face of evolving societal and professional challenges.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="bg-teal-50 rounded-2xl shadow-inner p-10 text-center">
          <h3 className="text-teal-500 text-lg font-semibold mb-8">
            Our Core Values
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex justify-center">
                <Users className="w-8 h-8 text-teal-500" />
              </div>
              <h4 className="font-semibold text-gray-800">Collaboration</h4>
              <p className="text-gray-600 text-sm max-w-xs mx-auto">
                Working together with communities, partners, and stakeholders to
                achieve common goals.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-center">
                <Lightbulb className="w-8 h-8 text-teal-500" />
              </div>
              <h4 className="font-semibold text-gray-800">Innovation</h4>
              <p className="text-gray-600 text-sm max-w-xs mx-auto">
                Embracing creative solutions and adapting to the evolving needs
                of our communities.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-center">
                <Leaf className="w-8 h-8 text-teal-500" />
              </div>
              <h4 className="font-semibold text-gray-800">Sustainability</h4>
              <p className="text-gray-600 text-sm max-w-xs mx-auto">
                Creating lasting change that continues to benefit communities for
                generations to come.
              </p>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="grid md:grid-cols-4 gap-6 text-center mt-10">
          {[
            { number: "1000+", label: "People Served" },
            { number: "50+", label: "Active Projects" },
            { number: "25", label: "Partner Organizations" },
            { number: "15", label: "Countries Reached" },
          ].map((item, index) => (
            <div
              key={index}
              className="border border-teal-100 rounded-xl p-6 hover:shadow-md transition"
            >
              <h4 className="text-2xl font-bold text-teal-600">
                {item.number}
              </h4>
              <p className="text-gray-600">{item.label}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
