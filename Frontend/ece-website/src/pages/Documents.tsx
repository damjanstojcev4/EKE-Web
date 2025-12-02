import { useState } from "react";
import { ArrowLeft, FileText, Calendar, Download } from "lucide-react";

const categories = [
  "All",
  "Annual Reports",
  "Strategic Documents",
  "Financial Reports",
  "Research & Evaluation",
  "Policies & Guidelines",
];

const Documents = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const documents = [
    {
      title: "Become Partner",
      category: "Policies & Guidelines",
      description:
        "Comprehensive overview of becoming a partner with our organization.",
      date: "January 2025",
      size: "1.2 MB",
      link: "/public/PIF EKE Bitola 2025.pdf",
    }
  ];

  const filteredDocs =
    activeCategory === "All"
      ? documents
      : documents.filter((doc) => doc.category === activeCategory);

  return (
    <div className="px-6 sm:px-16 py-12 text-slate-800 bg-gradient-to-br from-teal-50 via-white to-teal-100 min-h-screen pt-40">
      {/* Back to home */}
      <a
        href="/"
        className="flex items-center text-teal-600 hover:text-teal-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
      </a>

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-2">Documents</h1>
      <p className="text-slate-600 mb-8 max-w-3xl">
        Access our reports, publications, and official documents. We believe in
        transparency and accountability.
      </p>

      <p className="text-slate-500 mb-6">
        All our documents are available for download. We are committed to
        providing clear and accessible information about our operations.
      </p>

      {/* Categories */}
      <div className="flex flex-wrap gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full border transition
              ${
                activeCategory === cat
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDocs.map((doc, index) => (
          <div
            key={index}
            className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition"
          >
            {/* Header */}
            <div className="flex items-start space-x-4 mb-4">
              <FileText className="w-10 h-10 text-teal-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">{doc.title}</h3>
                <p className="text-sm text-teal-700">{doc.category}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm mb-4">{doc.description}</p>

            {/* Footer */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-2 text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>{doc.date}</span>
                <span className="mx-1">•</span>
                <span>{doc.size}</span>
              </div>

              <a
                href={doc.link}
                download
                className="flex items-center text-teal-600 hover:text-teal-700"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="mt-16 p-8 bg-slate-100 rounded-xl text-slate-700">
        <h3 className="font-semibold text-lg mb-2">Need More Information?</h3>
        <p className="text-sm mb-4">
          If you're looking for a specific document that isn’t listed here or
          need additional information, feel free to contact us anytime.
        </p>

        <a
          href="/#get-in-touch"
          className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default Documents;
