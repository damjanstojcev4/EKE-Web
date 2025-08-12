
const teamMembers = [
  {
    name: "John Doe",
    position: "CEO",
    image: "/src/assets/EKE_logo PNG.png",
  },
  {
    name: "Jane Smith",
    position: "Project Manager",
    image: "/src/assets/logo-black-white.png",
  },
  {
    name: "Mike Johnson",
    position: "Lead Developer",
    image: "/src/assets/EKE_logo PNG.png",
  },
  {
    name: "Emily Brown",
    position: "UI/UX Designer",
    image: "/src/assets/logo-black-white.png",
  },
];

const OurTeam = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">Our Team</h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
