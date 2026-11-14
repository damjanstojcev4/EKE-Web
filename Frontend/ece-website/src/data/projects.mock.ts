import type { Project } from "@/types/project";

/** Deterministic transcription of Projects.png, in its original display order. */
export const projects: Project[] = [
  {
    id: "cre-active",
    slug: "cre-active",
    title: "CRE-ACTIVE",
    image: "Rectangle 95.png",
    imageAlt: "Participants planning creative activities with sticky notes",
    status: "completed",
    dates: "10/FEB/2026",
    detailHref: "/projects/cre-active",
    emphasis: "CRE-ACTIVE",
    description:
      "CRE-ACTIVE is an training course dedicated to helping NEET participants find their creative voice and step confidently into local leadership. Through hands-on workshops in storytelling, writing, and digital media, our participants design imaginative community-focused campaigns, leaving behind a beautifully inspiring blueprint for youth engagement everywhere.",
  },
  {
    id: "pathways-for-change",
    slug: "pathways-for-change",
    title: "Pathways\nfor Change",
    image: "Rectangle 96.png",
    imageAlt: "A person in a correctional setting",
    status: "completed",
    dates: "01/APR/2024-21/OCT/2025",
    detailHref: "/projects/pathways-for-change",
    emphasis:
      "Pathways for Change: Recognizing Erasmus+ as a Tool for Resocialization in European Correctional Institutions",
    description:
      "For young people aged 15–21 inside correctional settings, non-formal learning provides the foundation to find their footing. By blending research, study visits, and specialized training, Pathways for Change: Recognizing Erasmus+ as a Tool for Resocialization in European Correctional Institutions prepares residents for life after detention, leaving a practical framework for educators to foster community reconnection.",
  },
  {
    id: "the-missing-peace",
    slug: "the-missing-peace",
    title: "The Missing\nPeace",
    image: "Rectangle 97.png",
    imageAlt: "Young woman standing in front of a colourful mural",
    status: "completed",
    dates: "01/JAN/2023-31/JUL/2025",
    detailHref: "/projects/the-missing-peace",
    emphasis: "The Missing Peace: Youth, Peace  and Reconciliation",
    description:
      "With a special focus on the leadership of young women, this initiative places youth at the center of community reconciliation. Through targeted training, exchanges, and study visits, The Missing Peace: Youth, Peace  and Reconciliation delivers an adaptable program that leaves a practical framework and mapping resources for youth workers to address conflict locally.",
  },
  {
    id: "disera",
    slug: "disera",
    title: "DISERA",
    image: "Rectangle 98.png",
    imageAlt: "Volunteers working together at an outdoor community event",
    status: "completed",
    dates: "01/SEP/2022-31/AUG/2024",
    detailHref: "/projects/disera",
    details: {
      title: "DISERA – Disinformation of Seniors in Rural Areas",
      programme: "Erasmus+",
      startDate: "01-09-2022",
      endDate: "31-08-2024",
      grant: "60.000,00 €",
      countries: 4,
      keyAction:
        "Key Action 2: Cooperation\namong organizations and institutions",
      actionType: "Small-scale partnerships\nin adult education",
      website: "disera.eu",
      topics: [
        "Media & Digital Literacy",
        "Critical Thinking",
        "Rural Senior Inclusion",
      ],
      logo: "/assets/project-details/logo 1.png",
      summary:
        "The DISERA project was launched to help rural older adults stand strong against misinformation and digital exclusion.  While technology moves fast, elderly citizens in rural areas often lack specialized learning tools tailored to their realities. To bridge this divide, this project builds basic digital skills, raises awareness about online disinformation, and fosters critical thinking. Ultimately, this approach helps seniors use modern media platforms with confidence and safety.",
      sections: [
        {
          title: "Background",
          paragraphs: [
            "As digital and social media platforms bombard individuals with vast amounts of daily information, the ability to distinguish credible sources from misleading loops has become an essential civic skill. However, structural data reveals a growing vulnerability to misinformation among older adult populations, particularly those living in geographically isolated rural areas.",
            "These senior communities face distinct educational disadvantages, digital exclusion, and a lack of tailored guidance because traditional training formats rarely address their specific learning paces and everyday needs. This project emerged directly from the field to ensure that an increasingly digitalized world does not leave older generations invisible or disconnected.",
          ],
        },
        {
          title: "Objectives",
          paragraphs: [
            "The primary ambition of this initiative was to promote genuine equality and social inclusion by making critical thinking effortlessly practical for older adults. The project set out to strengthen the capacity of adult educators and local facilitators by equipping them with accessible, field-tested methodologies designed for senior education.",
            "By dismantling cultural and digital barriers, the project aimed to help rural seniors comfortably master basic technology skills, understand how online disinformation operates, and develop a stronger sense of active citizenship and European belonging. By fostering these critical digital competences, the training directly protected a vulnerable demographic from the growing threat of modern media manipulation and online isolation.",
          ],
        },
        {
          title: "Implementation",
          paragraphs: [
            "To turn these goals into real-world tools, the transnational partnership reviewed, adapted, and localized existing European Union training materials to match the distinct realities of rural communities. The specialized curriculum was then delivered through highly accessible, low-barrier channels, including local radio broadcasts, recorded podcast series, and municipal websites, alongside hands-on digital workshops.",
            "This collaborative, cross-border approach enabled partner organizations from Italy, Ireland, Slovakia, and N. Macedonia to directly swap field lessons, establishing a lasting framework for senior media literacy across Europe. All course contents and recorded studio discussions were permanently uploaded to municipal platforms and the EPALE network to remain entirely open-source and available for adult education practitioners.",
          ],
        },
      ],
      partnerArtwork: "/assets/project-details/partners-8-logos.svg",
      partnerNote: "Ke ima 7-8 logoa max.",
      downloadDescription:
        "International cooperation gave this initiative its core strength. By collaborating across borders, our partners gathered the best European practices to fight digital isolation in our rural towns.",
    },
    emphasis: "DISERA – Disinformation of Seniors in Rural Areas",
    description:
      "Dedicated to rural senior communities, DISERA – Disinformation of Seniors in Rural Areas makes media literacy and critical thinking effortlessly practical. By tailoring learning tools directly to the needs of older adults, it delivers engaging radio programs, podcasts, and workshops that build digital confidence and offer lasting ways to recognize disinformation.",
  },
  {
    id: "stay-human",
    slug: "stay-human",
    title: "Stay Human!",
    image: "Rectangle 99.png",
    imageAlt: "Globe sculpture at a green public park",
    status: "completed",
    dates: "01/DEC/2022-31/MAY/2024",
    detailHref: "/projects/stay-human",
    emphasis: "Stay Human!",
    description:
      "Stay Human! connects human rights with daily choices, bringing youth together to navigate global challenges. Through interactive workshops and field visits, participants explore environmental responsibility, resource access, and the power of empathy, creating a welcoming space for youth from diverse backgrounds to learn from one another and collaborate to build thoughtful, active communities.",
  },
];
