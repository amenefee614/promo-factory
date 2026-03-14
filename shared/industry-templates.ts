export interface IndustryTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultStyle: "hype" | "insta" | "video" | "info";
  promptTemplate: string;
  exampleCampaigns: string[];
  keywords: string[];
}

export const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
  {
    id: "restaurant",
    name: "Restaurant",
    icon: "🍽️",
    description: "Promote menu items, specials, and dining experiences",
    defaultStyle: "hype",
    promptTemplate: "Create a promotional campaign for {businessName}, a {industry} business. Highlight: {focus}. Target audience: food lovers and local diners. Emphasize fresh ingredients, delicious flavors, and inviting atmosphere.",
    exampleCampaigns: [
      "Weekend brunch special - $15 bottomless mimosas",
      "New seasonal menu launch with farm-to-table ingredients",
      "Happy hour deals - 50% off appetizers 4-6pm",
    ],
    keywords: ["delicious", "fresh", "authentic", "flavorful", "homemade", "chef-crafted"],
  },
  {
    id: "salon",
    name: "Salon & Beauty",
    icon: "💇",
    description: "Showcase services, transformations, and special offers",
    defaultStyle: "insta",
    promptTemplate: "Create a promotional campaign for {businessName}, a {industry} business. Highlight: {focus}. Target audience: beauty-conscious individuals seeking professional styling and self-care. Emphasize expertise, transformations, and confidence.",
    exampleCampaigns: [
      "Summer glow package - haircut, color, and blowout $99",
      "Bridal beauty services - book your wedding day look",
      "New client special - 20% off first visit",
    ],
    keywords: ["gorgeous", "stunning", "transform", "pamper", "expert", "luxurious"],
  },
  {
    id: "fitness",
    name: "Fitness & Wellness",
    icon: "💪",
    description: "Motivate with classes, programs, and health goals",
    defaultStyle: "hype",
    promptTemplate: "Create a promotional campaign for {businessName}, a {industry} business. Highlight: {focus}. Target audience: health-conscious individuals seeking fitness and wellness. Emphasize results, energy, and community.",
    exampleCampaigns: [
      "30-day transformation challenge - lose weight, gain strength",
      "New yoga and meditation classes starting Monday",
      "Personal training packages - 10 sessions for $500",
    ],
    keywords: ["strong", "energized", "transform", "achieve", "powerful", "motivated"],
  },
  {
    id: "retail",
    name: "Retail & E-commerce",
    icon: "🛍️",
    description: "Drive sales with product launches and promotions",
    defaultStyle: "insta",
    promptTemplate: "Create a promotional campaign for {businessName}, a {industry} business. Highlight: {focus}. Target audience: shoppers looking for quality products and great deals. Emphasize value, style, and limited-time offers.",
    exampleCampaigns: [
      "Flash sale - 40% off entire store this weekend only",
      "New collection drop - spring styles now available",
      "Buy 2 get 1 free on all accessories",
    ],
    keywords: ["stylish", "trending", "exclusive", "limited", "must-have", "bestselling"],
  },
  {
    id: "realestate",
    name: "Real Estate",
    icon: "🏡",
    description: "Showcase properties and market listings",
    defaultStyle: "info",
    promptTemplate: "Create a promotional campaign for {businessName}, a {industry} business. Highlight: {focus}. Target audience: homebuyers, sellers, and investors. Emphasize location, features, and investment opportunity.",
    exampleCampaigns: [
      "Open house this Sunday - stunning 4BR home in prime location",
      "Just listed - modern condo with city views $450K",
      "Seller's market - get top dollar for your home",
    ],
    keywords: ["stunning", "prime", "spacious", "modern", "investment", "dream home"],
  },
  {
    id: "events",
    name: "Events & Entertainment",
    icon: "🎉",
    description: "Promote events, tickets, and experiences",
    defaultStyle: "hype",
    promptTemplate: "Create a promotional campaign for {businessName}, a {industry} business. Highlight: {focus}. Target audience: event-goers and entertainment seekers. Emphasize excitement, exclusivity, and unforgettable experiences.",
    exampleCampaigns: [
      "Live music night - featuring local bands this Friday",
      "VIP tickets on sale now - exclusive backstage access",
      "Annual festival returns - 3 days of food, music, and fun",
    ],
    keywords: ["exciting", "unforgettable", "exclusive", "epic", "live", "spectacular"],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: "🏥",
    description: "Inform about services, wellness, and patient care",
    defaultStyle: "info",
    promptTemplate: "Create a promotional campaign for {businessName}, a {industry} business. Highlight: {focus}. Target audience: patients seeking quality healthcare and wellness services. Emphasize expertise, care, and health outcomes.",
    exampleCampaigns: [
      "Free health screenings this month - schedule your appointment",
      "New telehealth services - consult from home",
      "Flu shots available - walk-ins welcome",
    ],
    keywords: ["trusted", "expert", "caring", "professional", "comprehensive", "quality"],
  },
  {
    id: "education",
    name: "Education",
    icon: "📚",
    description: "Promote courses, programs, and learning opportunities",
    defaultStyle: "info",
    promptTemplate: "Create a promotional campaign for {businessName}, a {industry} business. Highlight: {focus}. Target audience: students and lifelong learners seeking knowledge and skills. Emphasize growth, opportunity, and success.",
    exampleCampaigns: [
      "Fall enrollment open - register for classes today",
      "New coding bootcamp - career-ready in 12 weeks",
      "Scholarship opportunities - apply by March 31",
    ],
    keywords: ["learn", "grow", "achieve", "succeed", "expert-led", "certified"],
  },
  {
    id: "tech",
    name: "Tech & SaaS",
    icon: "💻",
    description: "Launch products, features, and software solutions",
    defaultStyle: "video",
    promptTemplate: "Create a promotional campaign for {businessName}, a {industry} business. Highlight: {focus}. Target audience: tech-savvy professionals and businesses seeking innovative solutions. Emphasize efficiency, innovation, and ROI.",
    exampleCampaigns: [
      "New feature release - AI-powered analytics now available",
      "Free trial - try our platform risk-free for 30 days",
      "Case study - how we helped Company X save 40% on costs",
    ],
    keywords: ["innovative", "powerful", "efficient", "cutting-edge", "scalable", "intelligent"],
  },
  {
    id: "professional",
    name: "Professional Services",
    icon: "💼",
    description: "Market expertise, consultations, and business services",
    defaultStyle: "info",
    promptTemplate: "Create a promotional campaign for {businessName}, a {industry} business. Highlight: {focus}. Target audience: businesses and professionals seeking expert services. Emphasize expertise, results, and trust.",
    exampleCampaigns: [
      "Free consultation - discuss your business goals with our experts",
      "Tax season prep - book your appointment before April",
      "New clients receive 15% off first project",
    ],
    keywords: ["expert", "trusted", "professional", "proven", "strategic", "results-driven"],
  },
];

export function getTemplateById(id: string): IndustryTemplate | undefined {
  return INDUSTRY_TEMPLATES.find((t) => t.id === id);
}

export function getTemplateByIndustry(industry: string): IndustryTemplate | undefined {
  const normalized = industry.toLowerCase().replace(/\s+/g, "");
  return INDUSTRY_TEMPLATES.find((t) => 
    t.name.toLowerCase().replace(/\s+/g, "").includes(normalized) ||
    normalized.includes(t.name.toLowerCase().replace(/\s+/g, ""))
  );
}
