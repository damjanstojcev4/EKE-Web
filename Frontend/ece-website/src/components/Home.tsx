import heroImage from '../assets/hero-background.jpg';

const Home = () => {
  return (
<section
      className="h-screen w-full bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-8xl font-medium text-white leading-tight">
          Celebrating Europe&apos;s Rich{' '}
          <span className="text-yellow-400">Cultural Heritage</span>
        </h1>
      </div>
    </section>
  );
};

export default Home;
