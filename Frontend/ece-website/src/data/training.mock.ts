import type { TrainingSession, TrainingTheme } from "@/types/training";

// Missing photographs/illustrations reuse the supplied originals with user approval.
export const trainingThemes: TrainingTheme[] = [
  {
    id: "inclusion",
    label: "Inclusion & Diversity",
    title: "Dismantling the invisible friction points that leave people behind",
    description:
      "EKE designs adaptive learning opportunities tailored to the realities of geographically isolated, economically marginalized, and institutionalized populations. Relying on a decade of practice across rural communities, disadvantaged urban neighborhoods, and correctional settings, we equip field specialists with the exact methods needed to give those who face the steepest challenges a genuine space to move forward.",
    illustration: "Group 96.png",
  },
  {
    id: "sport",
    label: "Sport & Wellbeing",
    title:
      "Applying sport and physical activity as tools for learning and teamwork",
    description:
      "Through long-term Street Workout activities, youth exchanges and sport-based learning, we use movement to explore teamwork, self-discipline, communication, leadership and active citizenship. Our experience includes supporting youth workers and local leaders in designing inclusive activities, adapting them to different abilities and using public spaces as accessible places for learning and community participation.",
    illustration: "Group 97.png",
  },
  {
    id: "technology",
    label: "AI & New Technologies",
    title:
      "Embedding digital tools and Artificial Intelligence into youth work",
    description:
      "Technology creates new possibilities for education, alongside questions that require careful consideration. EKE delivers capacity-building activities exploring artificial intelligence in youth work and education, digital skills, media literacy and the responsible use of online tools. Our work also addresses disinformation, helping young people, educators and adult learners evaluate information, question what they encounter online and make more informed decisions.",
    illustration: "Group 96.png",
  },
  {
    id: "environment",
    label: "Environmental & Outdoor Education",
    title: "Grounding sustainability in experiential learning",
    description:
      "Sustainability becomes more tangible when people can connect it to their surroundings and everyday choices. Drawing on experience in environmental education, youth exchanges and community initiatives, EKE uses practical activities and outdoor learning to explore sustainable living, environmental responsibility and local action. Our programs encourage participants to work together, understand the challenges affecting their communities and consider what they can do about them.",
    illustration: "Group 96.png",
  },
  {
    id: "correctional",
    label: "Correctional Education",
    title: "Structuring learning for resocialization and growth",
    description:
      "EKE works with correctional institutions and professionals in prison education, bringing together educational practice, research and international cooperation. Through projects such as Pathways for Change and our work with the European Prison Education Association, we contribute to discussions on inclusive learning, resocialization and the role of European educational programs in correctional institutions. Our experience includes cooperation with prison educators and other professionals, research into educational needs, and the exchange of approaches that can inform practice.",
    illustration: "Group 96.png",
  },
  {
    id: "specialized",
    label: "Specialized Learning",
    title: "Adapting educational methodologies to diverse abilities",
    description:
      "Making learning accessible means considering how people encounter, understand and use information. EKE’s work includes initiatives that make activities more accessible to people with visual impairments and groups who may face barriers to participation. Through projects such as Invisible Move, which promotes accessible chess learning, we explore how educational content and tools can be adapted to reach more people and support participation in activities that might otherwise be out of reach.",
    illustration: "Group 96.png",
  },
];

export const trainingSessions: TrainingSession[] = [
  {
    id: "epea",
    title: "European Prison Education Association (EPEA)\nTraining Conference",
    audience: "Prison Educators, Teachers, Sociologists, Psychologists",
    format: "Intensive Training Conference",
    language: "Macedonian/English",
    cost: "Funded by\nErasmus+/EPEA",
    days: "0-DAYS",
    countdownLabel: "closed",
    category: "Correctional\nEducation",
    learning:
      "Exchanging the latest European academic research, policy frameworks, and prison rehabilitation methodologies. Assessing real educational needs behind prison walls to design successful resocialization environments.",
    method:
      "Blending university professor insights with grassroots practitioner reflection, peer dialogue, and structured policy evaluation sessions.",
    location: "Skopje, N. Macedonia",
    dates: "11–15 Nov 2025",
    spots: 0,
    status: "closed",
  },
  {
    id: "sport-street",
    title: "Sport@Street: Capacity Building for\nInclusive Physical Activity",
    audience: "Youth Workers, Trainers,\nLocal Leaders",
    format: "Field Methodology\nTraining",
    language: "Macedonian/English",
    cost: "Free Entrance",
    days: "03 DAYS",
    countdownLabel: "remaining",
    category: "Sport &\nWellbeing",
    learning:
      "Turning everyday urban public spaces into active, low-cost learning environments. Learning how to design inclusive sport activities that easily adapt to different physical ability levels.",
    method:
      "Horizontal peer learning, structured outdoor movement sessions, teamwork exercises, and hands-on safety coaching in public spaces.",
    location: "Bitola, N. Macedonia",
    dates: "28–30 Oct 2022",
    spots: 0,
    status: "open",
  },
  {
    id: "disera",
    title: "DISERA: Combating Senior\nDisinformation in Rural Communities",
    audience: "Educators, Teachers,\nCivil Society Workers",
    format: "Digital Competence\nSeminar",
    language: "Macedonian/English",
    cost: "Funded via Erasmus+",
    days: "05 DAYS",
    countdownLabel: "closed",
    category: "AI & New\nTechnologies",
    learning:
      "Building educational tools to protect older adult groups from modern digital isolation and misleading online media loops. Shifting training formats to help seniors build deep critical thinking skills.",
    method:
      "Testing flexible learning labs, sharing real-world case studies of disinformation, and practice sessions for adapting tech concepts into plain language.",
    location: "Bitola, N. Macedonia",
    dates: "10–14 Oct 2022",
    spots: 0,
    status: "closed",
  },
  {
    id: "be-the-change",
    title: "Be the Change - Make Your Life\nSustainable",
    audience: "Youth Workers, Local\nLeaders, Environmental\nEducators",
    format: "Experiential Outdoor\nTraining",
    language: "Macedonian/English",
    cost: "Funded by Erasmus+",
    days: "06 DAYS",
    countdownLabel: "closed",
    category: "Environmental\n& Outdoor\nEducation",
    learning:
      "Designing hands-on sustainability lessons, practical eco-literacy frameworks, and zero-waste community initiatives. Learning how to use outdoor settings to teach active climate responsibility.",
    method:
      "Experiential learning labs, outdoor team challenges, and peer-to-peer methodology design sessions.",
    location: "Bitola, N. Macedonia",
    dates: "12–17 Sep 2021",
    spots: 0,
    status: "closed",
  },
  {
    id: "invisible-move",
    title: "Invisible Move: Accessible\nChess Learning",
    audience: "Youth Workers, Sports\nCoaches, Chess Trainers",
    format: "Inclusive Pedagogy\nSeminar",
    language: "Macedonian/English",
    cost: "Funded by Erasmus+",
    days: "05 DAYS",
    countdownLabel: "closed",
    category: "Specialized\nLearning",
    learning:
      "Specialist training to adapt cognitive learning tools for visually impaired youth. Tailoring communication, safe interaction, and spatial tracking models to remove learning barriers.",
    method:
      "Simulation exercises, adaptive methodology design, and tactile training drills.",
    location: "Darica, Turkey",
    dates: "15–19 May 2025",
    spots: 0,
    status: "closed",
  },
  {
    id: "digiwomen",
    title: "Digiwomen: Economic Empowerment\nfor Rural Communities",
    audience: "Rural Educators,\nCommunity Organizers,\nTrainers",
    format: "Capacity-Building\nModule",
    language: "Macedonian/English",
    cost: "Funded by Erasmus+",
    days: "05 DAYS",
    countdownLabel: "closed",
    category: "Inclusion &\nDiversity",
    learning:
      "Developing tailored training tools to overcome geographic isolation and economic barriers. Structuring inclusive education formats that help marginalized adult learners build entrepreneurship readiness.",
    method:
      "Case study analysis, collaborative curriculum drafting, and peer dialogue on gender equity.",
    location: "Novo Mesto, Slovenia",
    dates: "07–11 Jun 2021",
    spots: 0,
    status: "closed",
  },
];
