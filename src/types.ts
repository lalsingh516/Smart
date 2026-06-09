export interface IDIngredient {
  amount: string;
  name: string;
}

export interface IDFAQ {
  question: string;
  answer: string;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  category: string;
  prepTime: number; // in mins
  cookTime: number; // in mins
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  calories: number;
  protein: number; // in g
  carbs: number; // in g
  fat: number; // in g
  ingredients: string[]; // e.g. ["1 cup quinoa", "2 cups water"]
  instructions: string[];
  tags: string[];
  rating: number;
  featured: boolean;
  highProtein: boolean;
  budget: boolean;
  faq: IDFAQ[];
}

export interface DaySchedule {
  breakfast: string; // Recipe ID or text
  lunch: string;     // Recipe ID or text
  dinner: string;    // Recipe ID or text
  snack: string;     // Recipe ID or text
}

export interface MealPlan {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  durationWeeks: number;
  schedule: {
    [day: string]: DaySchedule; // e.g., "Monday", "Tuesday", etc.
  };
  shoppingList: string[];
  featured: boolean;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown or rich HTML contents
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

export interface Subscriber {
  id: string;
  email: string;
  enrolledAt: string;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: "recipe" | "blog";
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  newsletterHeadline: string;
  newsletterDescription: string;
  seoTitle: string;
  seoDescription: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}
