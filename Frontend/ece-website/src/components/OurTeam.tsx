
import ekeLogo from "../assets/EKE_logo PNG.png";
import logoBlackWhite from "../assets/logo-black-white.png";

const teamMembers = [
  {
    name: "Vele Georgiev",
    position: "President",
    image: ekeLogo,
  },
  {
    name: "Ivana Baltovska",
    position: "Project Manager",
    image: logoBlackWhite,
  },
  {
    name: "Sofija Mickoska",
    position: "Project Assistant",
    image: ekeLogo,
  },
  {
    name: "Dimitar Gogu",
    position: "Accountant",
    image: logoBlackWhite,
  },
  {
    name: "Hristina Gogu",
    position: "Designer",
    image: logoBlackWhite,
  }
];

const OurTeam = () => {
  return (
    <section className="py-12 bg-gray-200 pt-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-5xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-yellow-300">Meet Our Team</h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center hover:shadow-xl transition"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-40 h-40 object-cover mb-4"
              />
              <h1 className="text-xl font-semibold text-gray-800">
                {member.name}
              </h1>
              <h3 className="text-yellow-600 font-medium">{member.position}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
