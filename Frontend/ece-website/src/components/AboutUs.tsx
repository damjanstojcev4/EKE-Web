import BecomePartner from "./BecomePartner";
import Contact from "./Contact";
import OurTeam from "./OurTeam";

const AboutUs = () => {
  return (
    <div className="flex flex-col min-h-screen pt-20">

      <div className="relative w-full flex-1 p-4 sm:p-8 pt-[80px] overflow-hidden font-sans">
        {/* Background Image with gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/about-us-bg.jpg"
            alt="Group of people taking a selfie"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start py-16 px-4">
          {/* Left Column */}
          <div className="p-8 rounded-2xl shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-yellow-500/20 
                          bg-white/15 backdrop-blur-2xl border border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none rounded-2xl"></div>

            <div className="flex flex-col justify-center h-full text-white relative z-10">
              <h2 className="text-5xl sm:text-5xl font-extrabold tracking-tight text-orange-400 drop-shadow-lg">
                Our Story
              </h2>
              <p className="mt-4 text-xl sm:text-2xl font-light text-gray-200 leading-snug">
                European Cultural Epicenter (EKE) is more than just a name; it's
                a mission to foster positive values and empower young minds
                through non-formal education.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-8">
            {[
              {
                title: "Our Foundation",
                text: `EKE was established in 2012 by former participants in the Erasmus+ Plus program. Our purpose is to share the personal experiences gained from the program and create non-formal education opportunities like courses, trainings, workshops, and volunteering projects. We aim to build a society that fosters positive values and behaviors among young people and adults from both our country and abroad.`,
              },
              {
                title: "Our Team and Hub",
                text: `Our team consists of four regular staff members and four to six dedicated volunteers, with additional experts hired as needed. Located in the heart of Bitola, our 200m² office is a vibrant hub where we implement our activities and provide a valuable space for civic initiatives from the local community.`,
              },
            ].map((block, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-blue-500/20 
                           bg-white/15 backdrop-blur-2xl border border-white/20 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none rounded-2xl"></div>

                <h3 className="text-xl font-bold text-blue-400 mb-2 relative z-10">
                  {block.title}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-gray-200 relative z-10">
                  {block.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BecomePartner/>
      <OurTeam/>
      <Contact/>
    </div>

  );
};

export default AboutUs;
