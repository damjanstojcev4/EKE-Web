import React from "react";

const BecomePartner: React.FC = () => {
  return (
    <section className="py-20 bg-gray-200 text-center">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-[clamp(2rem,6vw,3rem)] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-900 to-blue-300 mb-8 text-center">
          Become Our Partner
        </h2>
        <p className="text-lg text-gray-700 mb-12">
          We are always looking for passionate organizations and individuals to
          join our mission. Learn how you can collaborate with us by viewing our
          partnership program.
        </p>
        <a
          href="src/assets/PIF EKE Bitola 2025.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-600 focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105"
        >
          View Partners PDF
        </a>
      </div>
    </section>
  );
};

export default BecomePartner;
