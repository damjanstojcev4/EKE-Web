import copy from "@/data/copy.json";

const emphasis = [
  "Time to Act!",
  "Artificial Intelligence in Youth Work",
  "Disinformation of Seniors in Rural Areas",
  "DigiWomen",
  "BeachGolf",
  "Erasmus+ Pathways for Change",
  "EPEA Training Conference",
  "Ireland, Italy, Spain, Romania, Turkey, and beyond",
  "projects, events, funding opportunities and open calls",
  "educators, coordinators, and change-makers",
  "Get in touch and discover how we can work together!",
  "Invisible Move",
  "Get in touch to receive the full info pack.",
  "training course for teachers from Italy on using artificial intelligence responsibly in the classroom",
];

/** Preserve the emphasis present in the Figma text nodes, without injecting HTML. */
export default function DesignCopy({ id }: { id: keyof typeof copy }) {
  const text = copy[id];
  const escaped = emphasis.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return text
    .split(new RegExp(`(${escaped.join("|")})`, "g"))
    .map((part, index) =>
      emphasis.includes(part) ? <strong key={index}>{part}</strong> : part,
    );
}
