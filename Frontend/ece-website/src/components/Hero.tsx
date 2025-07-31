import heroImage from '../assets/hero-background.jpg'; // Make sure the image exists at this path

const Hero = () => {
  return (
    <div
      className="w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* You can add content inside here later if needed */}
    </div>
  );
};

export default Hero;