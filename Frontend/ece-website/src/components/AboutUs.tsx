import Footer from "./Footer";
import Navbar from "./Navbar";
import OurTeam from "./OurTeam";

const AboutUs = () => {
     return (
    <div className="flex flex-col min-h-screen pt-20">
      <Navbar />  {/* Navbar placed here */}

      <div className="relative w-full flex-1 p-4 sm:p-8 pt-[80px] overflow-hidden font-sans">
        
        {/* Background Image with a stronger gradient overlay for better contrast */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/about-us-bg.jpg"
            alt="Group of people taking a selfie"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        </div>
        
        {/* Main Content Container with a dynamic grid layout */}
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start py-16 px-4">
          
          {/* Left Column: Title and a brief, impactful introduction */}
          <div className="flex flex-col justify-center h-full text-white">
            <h2 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-orange-400 drop-shadow-lg">
              Our Story
            </h2>
            <p className="mt-4 text-xl sm:text-2xl font-light text-gray-200 leading-snug">
              European Cultural Epicenter (EKE) is more than just a name; it's a mission to foster positive values and empower young minds through non-formal education.
            </p>
          </div>
          
          {/* Right Column: Detailed content with a clean, frosted-glass effect */}
          <div className="flex flex-col space-y-8">
            
            {/* First Text Block */}
            <div className="p-8 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/5 backdrop-blur-xl border border-gray-600/50">
              <h3 className="text-xl font-bold text-orange-400 mb-2">Our Foundation</h3>
              <p className="text-sm sm:text-base leading-relaxed text-gray-200">
                EKE was established in 2012 by former participants in the Erasmus+ Plus program. Our purpose is to share the personal experiences gained from the program and create non-formal education opportunities like courses, trainings, workshops, and volunteering projects. We aim to build a society that fosters positive values and behaviors among young people and adults from both our country and abroad.
              </p>
            </div>
            
            {/* Second Text Block */}
            <div className="p-8 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/5 backdrop-blur-xl border border-gray-600/50">
              <h3 className="text-xl font-bold text-orange-400 mb-2">Our Team and Hub</h3>
              <p className="text-sm sm:text-base leading-relaxed text-gray-200">
                Our team consists of four regular staff members and four to six dedicated volunteers, with additional experts hired as needed. Located in the heart of Bitola, our 200m<sup>2</sup> office is a vibrant hub where we implement our activities and provide a valuable space for civic initiatives from the local community.
              </p>
            </div>
          </div>
        </div>
      </div>
      <OurTeam/>
      <Footer />
    </div>
  );
}

export default AboutUs;