import partner1 from "../assets/NA logo EN.png";
import partner2 from "../assets/ESC Quality Label.png";
import partner3 from "../assets/ESC logo EN.png";
import partner4 from "../assets/eu_flag-erasmus_vect_pos.jpg";
import partner5 from "../assets/btgrb.png";


const Partners = () => {
const partners = [
  { name: "NA", logo: partner1 },
  { name: "ESC", logo: partner2 },
  { name: "CORPS", logo: partner3 },
  { name: "bitola", logo: partner4 },
  { name: "FarmaCon", logo: partner5 }
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
          lg:grid-cols-5
          items-center
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