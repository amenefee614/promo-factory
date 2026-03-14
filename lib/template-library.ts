/**
 * Template Library
 * 
 * Pre-made templates organized by industry and season
 */

export type TemplateCategory = 
  | "restaurant"
  | "fitness"
  | "real_estate"
  | "retail"
  | "services"
  | "seasonal";

export type TemplateSeason = 
  | "holiday"
  | "summer"
  | "winter"
  | "spring"
  | "fall"
  | "sale"
  | "event";

export interface PromoTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  season?: TemplateSeason;
  description: string;
  preview: string; // Emoji or icon
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  style: "modern" | "classic" | "bold" | "minimal" | "playful";
  defaultPrompt: string;
  tags: string[];
}

export const TEMPLATE_LIBRARY: PromoTemplate[] = [
  // Restaurant Templates
  {
    id: "restaurant_special",
    name: "Daily Special",
    category: "restaurant",
    description: "Promote today's special dish with mouth-watering visuals",
    preview: "🍽️",
    colors: { primary: "#FF6B6B", secondary: "#FFE66D", accent: "#4ECDC4" },
    style: "bold",
    defaultPrompt: "Create a vibrant food promo featuring [dish name] with fresh ingredients, warm lighting, and appetizing presentation",
    tags: ["food", "restaurant", "special", "daily"],
  },
  {
    id: "restaurant_happy_hour",
    name: "Happy Hour",
    category: "restaurant",
    description: "Drive evening traffic with drink specials",
    preview: "🍹",
    colors: { primary: "#9B59B6", secondary: "#3498DB", accent: "#F39C12" },
    style: "playful",
    defaultPrompt: "Design a fun happy hour promo with colorful cocktails, festive atmosphere, and special pricing",
    tags: ["drinks", "bar", "happy hour", "evening"],
  },
  {
    id: "restaurant_grand_opening",
    name: "Grand Opening",
    category: "restaurant",
    description: "Announce your restaurant's grand opening",
    preview: "🎉",
    colors: { primary: "#E74C3C", secondary: "#F1C40F", accent: "#2ECC71" },
    style: "bold",
    defaultPrompt: "Create an exciting grand opening announcement with celebratory elements, restaurant exterior, and opening details",
    tags: ["opening", "new", "celebration", "event"],
  },

  // Fitness Templates
  {
    id: "fitness_transformation",
    name: "Transformation Story",
    category: "fitness",
    description: "Showcase client success stories",
    preview: "💪",
    colors: { primary: "#FF6348", secondary: "#2C3E50", accent: "#FFC312" },
    style: "modern",
    defaultPrompt: "Design an inspiring transformation promo with before/after concept, motivational energy, and achievement focus",
    tags: ["fitness", "transformation", "success", "motivation"],
  },
  {
    id: "fitness_class",
    name: "Class Schedule",
    category: "fitness",
    description: "Promote upcoming fitness classes",
    preview: "🏋️",
    colors: { primary: "#00D2FF", secondary: "#3A7BD5", accent: "#00F260" },
    style: "bold",
    defaultPrompt: "Create an energetic class promo with dynamic movement, instructor highlight, and schedule details",
    tags: ["class", "workout", "schedule", "training"],
  },
  {
    id: "fitness_challenge",
    name: "30-Day Challenge",
    category: "fitness",
    description: "Launch fitness challenges to engage members",
    preview: "🎯",
    colors: { primary: "#F953C6", secondary: "#B91D73", accent: "#FFC837" },
    style: "bold",
    defaultPrompt: "Design a motivating challenge promo with goal-oriented visuals, timeline, and participation details",
    tags: ["challenge", "goal", "motivation", "community"],
  },

  // Real Estate Templates
  {
    id: "realestate_listing",
    name: "Property Listing",
    category: "real_estate",
    description: "Showcase properties with key details",
    preview: "🏡",
    colors: { primary: "#2C3E50", secondary: "#3498DB", accent: "#E67E22" },
    style: "classic",
    defaultPrompt: "Create a professional property listing with exterior shot, key features, price, and contact information",
    tags: ["listing", "property", "sale", "house"],
  },
  {
    id: "realestate_open_house",
    name: "Open House",
    category: "real_estate",
    description: "Announce open house events",
    preview: "🚪",
    colors: { primary: "#16A085", secondary: "#2980B9", accent: "#F39C12" },
    style: "modern",
    defaultPrompt: "Design an inviting open house announcement with property highlight, date/time, and welcoming atmosphere",
    tags: ["open house", "event", "viewing", "property"],
  },
  {
    id: "realestate_sold",
    name: "Just Sold",
    category: "real_estate",
    description: "Celebrate successful sales",
    preview: "✅",
    colors: { primary: "#27AE60", secondary: "#2C3E50", accent: "#F1C40F" },
    style: "bold",
    defaultPrompt: "Create a celebratory sold announcement with property photo, SOLD banner, and agent branding",
    tags: ["sold", "success", "achievement", "closed"],
  },

  // Retail Templates
  {
    id: "retail_sale",
    name: "Flash Sale",
    category: "retail",
    description: "Drive urgency with limited-time offers",
    preview: "⚡",
    colors: { primary: "#E74C3C", secondary: "#F39C12", accent: "#FFFFFF" },
    style: "bold",
    defaultPrompt: "Design an urgent flash sale promo with bold discount, countdown timer concept, and eye-catching colors",
    tags: ["sale", "discount", "urgent", "limited"],
  },
  {
    id: "retail_new_arrival",
    name: "New Arrival",
    category: "retail",
    description: "Introduce new products",
    preview: "✨",
    colors: { primary: "#9B59B6", secondary: "#3498DB", accent: "#F1C40F" },
    style: "modern",
    defaultPrompt: "Create an exciting new arrival announcement with product showcase, fresh aesthetic, and availability details",
    tags: ["new", "product", "arrival", "launch"],
  },
  {
    id: "retail_clearance",
    name: "Clearance Event",
    category: "retail",
    description: "Move inventory with clearance sales",
    preview: "🏷️",
    colors: { primary: "#E67E22", secondary: "#C0392B", accent: "#F39C12" },
    style: "bold",
    defaultPrompt: "Design a clearance sale promo with massive discount emphasis, urgency, and savings highlight",
    tags: ["clearance", "sale", "discount", "savings"],
  },

  // Services Templates
  {
    id: "services_consultation",
    name: "Free Consultation",
    category: "services",
    description: "Offer free consultations to attract clients",
    preview: "💼",
    colors: { primary: "#3498DB", secondary: "#2C3E50", accent: "#1ABC9C" },
    style: "classic",
    defaultPrompt: "Create a professional consultation offer with expert positioning, value proposition, and booking details",
    tags: ["consultation", "free", "professional", "service"],
  },
  {
    id: "services_testimonial",
    name: "Client Testimonial",
    category: "services",
    description: "Build trust with client reviews",
    preview: "⭐",
    colors: { primary: "#F39C12", secondary: "#2C3E50", accent: "#3498DB" },
    style: "modern",
    defaultPrompt: "Design a testimonial promo with client quote, star rating, and trustworthy aesthetic",
    tags: ["testimonial", "review", "trust", "client"],
  },
  {
    id: "services_special_offer",
    name: "Limited Time Offer",
    category: "services",
    description: "Promote special service packages",
    preview: "🎁",
    colors: { primary: "#E74C3C", secondary: "#9B59B6", accent: "#F1C40F" },
    style: "bold",
    defaultPrompt: "Create a special offer promo with package details, savings emphasis, and call-to-action",
    tags: ["offer", "special", "package", "deal"],
  },

  // Seasonal Templates
  {
    id: "seasonal_holiday",
    name: "Holiday Special",
    category: "seasonal",
    season: "holiday",
    description: "Celebrate holidays with themed promos",
    preview: "🎄",
    colors: { primary: "#C0392B", secondary: "#27AE60", accent: "#F1C40F" },
    style: "playful",
    defaultPrompt: "Design a festive holiday promo with seasonal decorations, warm atmosphere, and special offer",
    tags: ["holiday", "christmas", "celebration", "seasonal"],
  },
  {
    id: "seasonal_summer",
    name: "Summer Sale",
    category: "seasonal",
    season: "summer",
    description: "Capitalize on summer shopping season",
    preview: "☀️",
    colors: { primary: "#F39C12", secondary: "#3498DB", accent: "#E74C3C" },
    style: "playful",
    defaultPrompt: "Create a vibrant summer sale promo with bright colors, sunny vibes, and hot deals",
    tags: ["summer", "sale", "seasonal", "hot"],
  },
  {
    id: "seasonal_back_to_school",
    name: "Back to School",
    category: "seasonal",
    season: "fall",
    description: "Target back-to-school shoppers",
    preview: "📚",
    colors: { primary: "#E67E22", secondary: "#2C3E50", accent: "#3498DB" },
    style: "modern",
    defaultPrompt: "Design a back-to-school promo with educational theme, fresh start energy, and student appeal",
    tags: ["school", "education", "fall", "students"],
  },
];

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: TemplateCategory): PromoTemplate[] {
  return TEMPLATE_LIBRARY.filter((t) => t.category === category);
}

/**
 * Get templates by season
 */
export function getTemplatesBySeason(season: TemplateSeason): PromoTemplate[] {
  return TEMPLATE_LIBRARY.filter((t) => t.season === season);
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): PromoTemplate | undefined {
  return TEMPLATE_LIBRARY.find((t) => t.id === id);
}

/**
 * Search templates by keyword
 */
export function searchTemplates(keyword: string): PromoTemplate[] {
  const lowerKeyword = keyword.toLowerCase();
  return TEMPLATE_LIBRARY.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerKeyword) ||
      t.description.toLowerCase().includes(lowerKeyword) ||
      t.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword))
  );
}

export const CATEGORY_INFO: Record<TemplateCategory, { name: string; icon: string; description: string }> = {
  restaurant: {
    name: "Restaurant & Food",
    icon: "🍽️",
    description: "Menus, specials, and dining experiences",
  },
  fitness: {
    name: "Fitness & Wellness",
    icon: "💪",
    description: "Classes, transformations, and challenges",
  },
  real_estate: {
    name: "Real Estate",
    icon: "🏡",
    description: "Listings, open houses, and sales",
  },
  retail: {
    name: "Retail & Shopping",
    icon: "🛍️",
    description: "Sales, products, and promotions",
  },
  services: {
    name: "Professional Services",
    icon: "💼",
    description: "Consultations, testimonials, and offers",
  },
  seasonal: {
    name: "Seasonal & Events",
    icon: "🎉",
    description: "Holidays, seasons, and special occasions",
  },
};
