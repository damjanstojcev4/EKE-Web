import heroImage from '../assets/hero-background.jpg';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { Eye, Zap } from 'lucide-react';

const Home = () => {
  const aims = [
    'Personal and professional development',
    'Promoting mobility within the country and abroad',
    'Promote entrepreneurship',
    'Digital literacy, digital skills and digital transformation',
    'Sustainable development and the "green agenda"',
    'Promote a healthy lifestyle through sports and sports activities',
    'Advocate for human rights and empowerment of vulnerable and marginalized groups',
    'Stand for democratic values and standards'
  ];

  const projects = [
    {
      title: 'Youth Cultural Exchange 2025',
      summary: 'A cultural exchange program uniting young creatives across Europe.',
      date: 'June 12, 2025',
      location: 'Skopje, North Macedonia',
      image: 'src/assets/youth-cul-exchange-2025-1.jpg'
    },
    {
      title: 'Green Living Workshop',
      summary: 'Workshops on sustainability and eco-activism for young people.',
      date: 'May 20, 2025',
      location: 'Bitola, North Macedonia',
      image: 'src/assets/green-living-wh-2.jpg'
    },
    {
      title: 'Digital Skills Bootcamp',
      summary: 'Digital literacy bootcamp focused on coding, design and online safety.',
      date: 'April 10, 2025',
      location: 'Ohrid, North Macedonia',
      image: 'src/assets/digital-skills-bootcamp.jpg'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section
        className="h-screen w-full bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          className="relative z-10 text-center px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Celebrating Europe&apos;s Rich{' '}
            <span className="text-yellow-400">Cultural Heritage</span>
          </h1>
        </motion.div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-12">Vision & Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="bg-gray-200 p-4 rounded-full mb-4">
                <Eye className="w-8 h-8 text-gray-800" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Vision</h3>
              <p className="text-gray-600 max-w-md">
                High quality education that offers equal educational opportunities for all.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-gray-200 p-4 rounded-full mb-4">
                <Zap className="w-8 h-8 text-gray-800" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Mission</h3>
              <p className="text-gray-600 max-w-md">
                The main aim of the association is to provide high quality non-formal educational
                programs to promote personal and professional development for the citizens from the
                local community and abroad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Aims */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-4">Our Aims</h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            We are committed to achieving these key objectives through our programs and initiatives.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {aims.map((aim, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-4 flex items-center gap-3"
              >
                <FaCheckCircle className="text-green-500 text-xl shrink-0" />
                <p className="text-left text-gray-700">{aim}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-4">Recent Projects</h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            Explore some of our most recent initiatives and events.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-xl overflow-hidden shadow-md text-left"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-700 mb-3">{project.summary}</p>
                  <div className="text-sm text-gray-500">
                    <p>{project.date}</p>
                    <p>{project.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;