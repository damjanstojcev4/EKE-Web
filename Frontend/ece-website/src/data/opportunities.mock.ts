export type Opportunity = {
  id: string;
  title: string;
  days: string;
  deadline: string;
  category: string;
  age: string;
  location: string;
  dates: string;
  status: "open" | "closed";
};

// Reference snapshot: counts, dates and status are deliberately not time-derived.
// Project Details destinations will be mapped during backend integration.
export const opportunities: Opportunity[] = [
  {
    id: "hungary-october",
    title: "Call for European Solidarity\nCorps Volunteers In Hungary",
    days: "61 DAYS",
    deadline: "closes 10 Oct",
    category: "SHORT-TERM\nVOLUNTEERING",
    age: "Ages 18-30",
    location: "Nagyvázsony, Hungary",
    dates: "15 Oct - 15 Dec 2026",
    status: "open",
  },
  {
    id: "bitola-volunteers",
    title: "Call For European Solidarity Corps\nVolunteers In N. Macedonia",
    days: "0-DAYS",
    deadline: "closed",
    category: "LONG-TERM\nVOLUNTEERING",
    age: "Ages 18-30",
    location: "Bitola, N. Macedonia",
    dates: "Nov - Jan 2026",
    status: "closed",
  },
  {
    id: "lugo-volunteers",
    title: "Call For For European Solidarity\nCorps Volunteers In Spain",
    days: "150 DAYS",
    deadline: "closes 10 Oct",
    category: "LONG-TERM\nVOLUNTEERING",
    age: "Ages 18-30",
    location: "Lugo, Galicia, Spain",
    dates: "Nov - Mar 2027",
    status: "open",
  },
  {
    id: "romania-volunteers",
    title: "Call For European Solidarity\nCorps Volunteers In Romania",
    days: "0-DAYS",
    deadline: "closed",
    category: "SHORT-TERM\nVOLUNTEERING",
    age: "Ages 18-29",
    location: "Cogealac, Romania",
    dates: "3 to 5 months",
    status: "closed",
  },
  {
    id: "granada-volunteers",
    title: "Call For European Solidarity\nCorps Volunteers In Spain",
    days: "0-DAYS",
    deadline: "closed",
    category: "LONG-TERM\nVOLUNTEERING",
    age: "Ages 18-30",
    location: "Maracena, Granada, Spain",
    dates: "Sep - Jun 2027",
    status: "closed",
  },
  {
    id: "bitola-exchange",
    title: "Call For Project Participants\nFrom N. Macedonia",
    days: "0-DAYS",
    deadline: "closed",
    category: "YOUTH\nEXCHANGE",
    age: "Ages 18-24",
    location: "Bitola, N. Macedonia",
    dates: "23–28 Jul 2025",
    status: "closed",
  },
  {
    id: "hungary-august",
    title: "Call For European Solidarity\nCorps Volunteers In Hungary",
    days: "0-DAYS",
    deadline: "closed",
    category: "SHORT-TERM\nVOLUNTEERING",
    age: "Ages 18-30",
    location: "Nagyvázsony, Hungary",
    dates: "21 Aug - 12 Sep 2026",
    status: "closed",
  },
  {
    id: "antalya-exchange",
    title: "Call For Project Participants\nFrom N. Macedonia",
    days: "0-DAYS",
    deadline: "closed",
    category: "YOUTH\nEXCHANGE",
    age: "Ages 18–30",
    location: "Antalya, Turkey",
    dates: "8 - 12 Sep 2025",
    status: "closed",
  },
];

export const opportunityPaths = [
  {
    id: "volunteering",
    title: "Volunteering",
    image: "Rectangle 10.png",
    alt: "Woman carrying a folder outside an office building",
    text: "The fastest way to make a visible difference. Joining our volunteer network connects people across borders and backgrounds, focusing purely on shared experiences, mutual learning, and everyday community development.",
  },
  {
    id: "internships",
    title: "Internships",
    image: "Rectangle 10.png",
    alt: "Woman carrying a folder outside an office building",
    text: "The ideal setting to bridge the gap between academic theory and practical work. Working alongside our core team in Bitola gives interns hands-on exposure to project design and local analysis, offering a transparent look at how a value-driven organization runs on a daily basis.",
  },
  {
    id: "jobs",
    title: "Jobs",
    image: "Rectangle 11.png",
    alt: "Team collaborating around a meeting table",
    text: "A professional path rooted in structural accountability and long-term community growth. Our team coordinates cross-border partnerships and builds innovative educational tools, managing complex international projects to ensure inclusive learning opportunities exist across generations.",
  },
  {
    id: "mobility",
    title: "Mobility",
    image: "Rectangle 12.png",
    alt: "People and a scooter on a city street",
    text: "An immersive way to expand your perspective through fast-paced international exchanges. Through Erasmus+ tracks, we connect local educators, youth workers, and adult learners with the latest methodologies across Europe, covering everything from artificial intelligence in the classroom to media literacy.",
  },
] as const;
