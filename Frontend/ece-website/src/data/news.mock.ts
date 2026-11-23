import type { NewsArticle, NewsMedia } from "@/types/news";

// Transcribed from the local News.png export. Dates deliberately differ from
// the homepage snapshot. Only Hungary has verified body copy, from News Details.png.
export const featuredNews: NewsArticle = {
  id: "esc-hungary", slug: "european-solidarity-corps-hungary",
  title: "European Solidarity Corps Opportunity in Hungary",
  summary: "Spend 2 months volunteering in Nagyvázsony, Hungary, through the European Solidarity Corps. Available for young people aged 18–30, this opportunity involves backing youth centers and museum heritage work with living costs completely covered. Starting October 2026.",
  emphasis: "Review the full guide to secure your place.",
  image: "/assets/news-page/hungary.png", imageAlt: "Hungarian Parliament beneath a blue sky",
  category: "Open Call", publishedAt: "2026-10-05", displayDate: "Oct 5, 2026",
  details: {
    heroImage: "/assets/news-details/hungary.webp",
    introduction: [
      { text: "Looking for a fully funded international experience to kickstart your career? If you are between 18 and 30 years old, this is your official invitation to pack your bags for a " },
      { text: "fully funded, two-month volunteering experience in the heart of Europe.", strong: true },
    ],
    content: [
      { type: "paragraph", text: [{ text: "From October 15 to December 15, 2026, the European Solidarity Corps is offering an individual volunteering placement in the charming historic village of Nagyvázsony, Hungary." }] },
      { type: "paragraph", text: [{ text: "This EU-funded program completely eliminates the financial barriers of traveling abroad by fully covering your housing, utility bills, travel expenses, and providing a combined €15.00 daily allowance for food and pocket money. It is designed as a structured volunteer placement where you can build international work experience, master practical skills, and contribute to a local community without any personal financial burden. The application window closes on October 10, 2026." }] },
      { type: "heading", text: "The Destination" },
      { type: "paragraph", text: [{ text: "Nagyvázsony is a picturesque, vibrant village of 1,800 residents nestled in the rolling hills of Western Hungary, famous for its medieval castle and close proximity to Lake Balaton. While offering a cozy, scenic setting, it features full amenities: three supermarkets, local cafés, hotels, a bank, a post office, and a gym." }] },
      { type: "heading", text: "Funding and Perks" },
      { type: "paragraph", text: [{ text: "The ESC framework fully finances the placement to ensure it is accessible to everyone:" }] },
      { type: "list", items: [
        { title: "Cozy Accommodation", text: "Stay in a fully furnished volunteer apartment in Nagyvázsony featuring shared bedrooms, two bathrooms, a washing machine, free Wi-Fi, and an outdoor courtyard." },
        { title: "Food & Pocket Money", text: "Receive €8.00 per day for food (for self-catering in the communal kitchen) and €7.00 per day in pocket money." },
        { title: "Travel Reimbursement", text: "Travel expenses are refunded via bank transfer upon submitting your final project report and boarding passes." },
        { title: "Time Off", text: "Enjoy your weekends plus 2 fully free vacation days per month to travel." },
      ] },
      { type: "heading", text: "The Ideal Volunteer" },
      { type: "paragraph", text: [{ text: "Organizers are looking for motivated, open-minded young adults who enjoy teamwork and community building. No specialized degree or massive resume is required—all you need is a basic knowledge of English and a willingness to participate." }] },
      { type: "heading", text: "How to Secure Your Spot" },
      { type: "paragraph", text: [
        { text: "With the October 10th deadline quickly approaching, time is of the essence. Apply now by reviewing " },
        { text: "the project details", strong: true, pendingLink: true },
        { text: " and submitting your application immediately via email to: " },
        { text: "sofija.eke.bitola@gmail.com", strong: true, href: "mailto:sofija.eke.bitola@gmail.com" },
      ] },
    ],
    sidebarIds: ["beyond-screens", "accessible-chess", "erasmus-info", "summer-mobility"],
    otherItems: [
      { kind: "media", id: "chess-podcast", displayTitle: "A Podcast on Chess, Built for Accessibility..." },
      { kind: "article", id: "esc-spain", displayTitle: "European Solidarity Corps Opportunity in Spain..." },
      { kind: "article", id: "ai-educators", displayTitle: "Teaching With Intelligence: AI Training for Educators..." },
    ],
  },
};

export const latestNews: NewsArticle[] = [
  {
    id: "accessible-chess", slug: "chess-toolkit-built-for-accessibility",
    title: "A Chess Toolkit Built for Accessibility",
    summary: "Break down barriers with the Invisible Move initiative. EKE is happy to share an open-source toolkit featuring a practical chess guide for coaches, alongside an audio podcast series streaming in five languages, all designed to make the game fully accessible to players with visual impairments.",
    emphasis: "Check out the collection to help bring more voices to the board.",
    image: "/assets/news-page/chess.png", imageAlt: "A hand moving a chess piece on a board",
    category: "Latest News", publishedAt: "2026-10-01", displayDate: "Oct 1, 2026",
  },
  {
    id: "esc-spain", slug: "european-solidarity-corps-spain",
    title: "European Solidarity Corps Opportunity in Spain",
    summary: "Spend 5 months volunteering near Granada in Lugo, Spain, through the European Solidarity Corps. Open to young people aged 18–30, the placement covers accommodation, travel, insurance, language support and a monthly allowance. Starting November 2026.",
    emphasis: "Dive into the full brief to apply.",
    image: "/assets/news-page/spain.png", imageAlt: "Plaza de España in Spain",
    category: "Open Call", publishedAt: "2026-09-25", displayDate: "Sep 25, 2026",
  },
  {
    id: "ai-educators", slug: "ai-training-educators-thessaloniki",
    title: "Teaching With Intelligence: AI Training for Educators in Thessaloniki",
    summary: "Bringing artificial intelligence into education comes with a massive question mark: where does it genuinely help, and where does it fall short? In late May, EKE hosted a training course for Italian educators to map out the realities, ethics, and challenges of classroom tech.",
    emphasis: "Dig into the insights from our interactive workshops to discover more.",
    image: "/assets/news-page/ai-training.png", imageAlt: "Participants wearing AI shirts at a training session",
    category: "Latest News", publishedAt: "2026-08-13", displayDate: "Aug 13, 2026",
  },
];

export const newsMedia: NewsMedia[] = [
  {
    id: "chess-podcast", title: "A Podcast on Chess, Built for Accessibility",
    summary: "Tune into the game from a brand-new perspective. Our specialized chess podcast is now streaming in five languages, featuring the newly released Macedonian version.",
    image: "/assets/news-accessible-chess.png", imagePlaceholder: true,
    kind: "audio", duration: "26:54",
  },
  {
    id: "epea-recap", title: "EPEA Training Conference Recap",
    summary: "See what happens when 130 prison educators from across Europe unite to trade real-world field strategies. A quick look at how international teams resolve shared institutional hurdles.",
    image: "/assets/news-page/conference-video.png", kind: "video",
  },
];

export const bigStory: NewsArticle = {
  id: "epea-conference", slug: "epea-training-conference-second-chances",
  title: "Five days, 100+ experts, and one vital conversation on second chances",
  summary: "As part of our ongoing prison education initiatives, EKE welcomed educators, researchers, and practitioners from all across Europe to Skopje for the EPEA Training Conference 2025. Explore the highlights, insights, and shared practices generated during this",
  emphasis: "intensive dialogue on prison education and resocialization.",
  image: "/assets/news-page/conference.png", imageAlt: "A speaker presenting to educators at the EPEA conference",
  category: "EPEA Training Conference", publishedAt: "2025-11-11", displayDate: "Nov 11 - 15, 2025",
};

export const communityNews: NewsArticle[] = [
  {
    id: "beyond-screens", slug: "beyond-screens-building-healthy-habits",
    title: "Beyond Screens: Building Healthy Habits Together",
    summary: "Our latest curriculum framework targets digital over-reliance among young people. By integrating lifestyle adjustments with critical technology literacy, the project equips youth with the tools needed to build long-term physical and digital well-being.",
    image: "/assets/news-page/beyond-screens.png", imageAlt: "A facilitator speaking with a group of young people",
  },
  {
    id: "summer-mobility", slug: "summer-youth-mobility-launch",
    title: "Summer Youth Mobility Launch",
    summary: "Building directly on our successful spring planning milestones, EKE has finalized preparations to welcome youth cohorts to Bitola. Participants will step completely outside the digital environment to engage in peer-led learning, shared experiences, and structured physical wellbeing initiatives.",
    image: "/assets/projects-page/Rectangle%2098.png", imageAlt: "Placeholder: young people taking part in an outdoor activity", imagePlaceholder: true,
  },
  {
    id: "erasmus-info", slug: "erasmus-info-day-bitola",
    title: "Erasmus+ Info Day Presentation In Bitola",
    summary: "Invited by the National Agency for European Educational Programs and Mobility, EKE presented the Pathways for Change initiative, introducing the new KA240 school education framework to regional schools and local authorities to inspire future cross-border collaborations.",
    image: "/assets/menu-news.png", imageAlt: "Participants seated in a circle at an EKE event",
  },
  {
    id: "digital-wellbeing-apv", slug: "apv-digital-well-being-exchange",
    title: "APV for Digital Well-Being Exchange",
    summary: "EKE hosted international partners from Spain, Türkiye, and Cyprus in Bitola for an Advance Planning Visit. This critical preparatory meeting finalized the administrative and pedagogical frameworks for our upcoming project Beyond Screens: Building Healthy Habits Together.",
    image: "/assets/youth-education.webp", imageAlt: "Placeholder: participants at a collaborative meeting", imagePlaceholder: true,
  },
];

export const newsArticles: NewsArticle[] = [featuredNews, ...latestNews, bigStory, ...communityNews];
export const newsArticleHref = (article: NewsArticle) => `/news/${article.slug}`;
export const newsArticleLinkLabel = (article: NewsArticle) => `${article.title}${article.details ? "" : " (full article pending)"}`;
