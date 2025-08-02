import heroImage from '../assets/hero-background.jpg';
import { motion } from 'framer-motion';

const Home = () => {
  return (
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
  );
};

export default Home;
