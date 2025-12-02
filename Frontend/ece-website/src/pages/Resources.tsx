import { ArrowLeft, FileText, Video, BookOpen, ExternalLink } from "lucide-react";

const Resources = () => {
  const internalResources = [
    {
      type: "Guide",
      title: "Community Development Toolkit",
      description:
        "A comprehensive guide to planning and implementing community-based projects.",
      link: "#",
    }
  ];

  const externalLinks = [
    {
      title: "UN Sustainable Development Goals",
      description:
        "Learn about the global goals we align our work with.",
      link: "#",
    },
  ];

  return (
    <div className="px-6 sm:px-16 py-12 text-slate-800 bg-gradient-to-b from-teal-50 via-white to-white min-h-screen pt-40">

      {/* Back to Home */}
      <a
        href="/"
        className="flex items-center text-teal-600 hover:text-teal-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
      </a>

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-2">Resources</h1>
      <p className="text-slate-600 mb-4 max-w-3xl">
        Tools, guides, and educational materials to support community development and empowerment.
      </p>

      <p className="text-slate-500 mb-10 max-w-3xl">
        We believe in sharing knowledge and resources to empower communities and support other organizations
        working toward similar goals. All our resources are freely available for educational and non-commercial use.
      </p>

      {/* Our Resources */}
      <h2 className="text-xl font-semibold mb-4">Our Resources</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {internalResources.map((res, i) => (
          <div
            key={i}
            className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition"
          >
            {/* Icon */}
            <div className="flex items-start space-x-3 mb-3">
              {res.type === "Video" ? (
                <Video className="w-8 h-8 text-teal-600" />
              ) : res.type === "Guide" ? (
                <BookOpen className="w-8 h-8 text-teal-600" />
              ) : (
                <FileText className="w-8 h-8 text-teal-600" />
              )}

              <div>
                <p className="text-sm text-slate-500">{res.type}</p>
                <h3 className="font-semibold text-lg">{res.title}</h3>
              </div>
            </div>

            <p className="text-slate-600 text-sm mb-4">{res.description}</p>

            <a
              href={res.link}
              className="text-teal-600 text-sm flex items-center hover:text-teal-700"
            >
              Access Resource <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        ))}
      </div>

      {/* Helpful External Links */}
      <h2 className="text-xl font-semibold mb-4">Helpful External Links</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {externalLinks.map((ext, i) => (
          <div
            key={i}
            className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition"
          >
            <h3 className="font-semibold text-lg mb-1">{ext.title}</h3>
            <p className="text-slate-600 text-sm mb-3">{ext.description}</p>

            <a
              href={ext.link}
              className="text-teal-600 text-sm flex items-center hover:text-teal-700"
            >
              Visit Website <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        ))}
      </div>

      {/* Contribute Section */}
      <div className="p-8 bg-teal-50 rounded-xl text-slate-700">
        <h3 className="font-semibold text-lg mb-2">Contribute a Resource</h3>
        <p className="text-sm mb-4 max-w-2xl">
          Have a resource that could benefit our community? We welcome contributions of guides, case studies,
          and educational materials that align with our mission. Share your knowledge and help us build a
          comprehensive resource library.
        </p>

        <a
          href="/#get-in-touch"
          className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition"
        >
          Submit a Resource
        </a>
      </div>
    </div>
  );
};

export default Resources;
