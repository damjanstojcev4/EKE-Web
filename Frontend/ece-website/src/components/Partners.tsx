import partner1 from "../assets/logo-black-white.png";
import partner2 from "../assets/logo-black-white.png";
import partner3 from "../assets/logo-black-white.png";
import partner4 from "../assets/logo-black-white.png";
import partner5 from "../assets/logo-black-white.png";
import partner6 from "../assets/logo-black-white.png";


const Partners = () => {
const partners = [
  { name: "EduCompass", logo: partner1 },
  { name: "Essenia", logo: partner2 },
  { name: "Libertania", logo: partner3 },
  { name: "Street Warriors", logo: partner4 },
  { name: "FarmaCon", logo: partner5 },
  { name: "FarmaCon", logo: partner6 }
];

  return (
    <section className="bg-gray-50 py-12">
      <h2 className="text-5xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-cyan-400">Donors</h2>
      <div
        className="
          grid gap-8
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-6
          place-items-center
        "
      >
        {partners.map((partner, index) => (
          <img
            key={index}
            src={partner.logo}
            alt={partner.name}
            className="max-h-64 object-contain w-full px-4"
          />
        ))}
      </div>
    </section>
  );
};

export default Partners;