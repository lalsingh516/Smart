import { Recipe, MealPlan, Article, Subscriber, Category, SiteSettings, ContactMessage } from "../types";
import {
  INITIAL_CATEGORIES,
  INITIAL_RECIPES,
  INITIAL_MEAL_PLANS,
  INITIAL_ARTICLES,
  INITIAL_SUBSCRIBERS,
  INITIAL_SETTINGS
} from "./initialData";

const STORAGE_KEYS = {
  CATEGORIES: "svp_categories",
  RECIPES: "svp_recipes",
  MEAL_PLANS: "svp_meal_plans",
  ARTICLES: "svp_articles",
  SUBSCRIBERS: "svp_subscribers",
  SETTINGS: "svp_settings",
  MESSAGES: "svp_contact_messages",
};

// Initialize localStorage with initial data if not present
export function initializeStorage() {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RECIPES)) {
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(INITIAL_RECIPES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MEAL_PLANS)) {
    localStorage.setItem(STORAGE_KEYS.MEAL_PLANS, JSON.stringify(INITIAL_MEAL_PLANS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ARTICLES)) {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS)) {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(INITIAL_SUBSCRIBERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([]));
  }
}

// Ensure storage is seeded initially
initializeStorage();

// Raw Getters
export function getCategories(): Category[] {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return data ? JSON.parse(data) : INITIAL_CATEGORIES;
}

export function getRecipes(): Recipe[] {
  const data = localStorage.getItem(STORAGE_KEYS.RECIPES);
  return data ? JSON.parse(data) : INITIAL_RECIPES;
}

export function getMealPlans(): MealPlan[] {
  const data = localStorage.getItem(STORAGE_KEYS.MEAL_PLANS);
  return data ? JSON.parse(data) : INITIAL_MEAL_PLANS;
}

export function getArticles(): Article[] {
  const data = localStorage.getItem(STORAGE_KEYS.ARTICLES);
  return data ? JSON.parse(data) : INITIAL_ARTICLES;
}

export function getSubscribers(): Subscriber[] {
  const data = localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS);
  return data ? JSON.parse(data) : INITIAL_SUBSCRIBERS;
}

export function getSettings(): SiteSettings {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : INITIAL_SETTINGS;
}

export function getContactMessages(): ContactMessage[] {
  const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  return data ? JSON.parse(data) : [];
}

// Writers and Mutators
export function updateCategories(categories: Category[]) {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  window.dispatchEvent(new Event("svp_data_updated"));
}

export function updateRecipes(recipes: Recipe[]) {
  localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
  window.dispatchEvent(new Event("svp_data_updated"));
}

export function updateMealPlans(mealPlans: MealPlan[]) {
  localStorage.setItem(STORAGE_KEYS.MEAL_PLANS, JSON.stringify(mealPlans));
  window.dispatchEvent(new Event("svp_data_updated"));
}

export function updateArticles(articles: Article[]) {
  localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  window.dispatchEvent(new Event("svp_data_updated"));
}

export function updateSubscribers(subscribers: Subscriber[]) {
  localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subscribers));
  window.dispatchEvent(new Event("svp_data_updated"));
}

export function updateSettings(settings: SiteSettings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  window.dispatchEvent(new Event("svp_data_updated"));
}

export function updateContactMessages(messages: ContactMessage[]) {
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  window.dispatchEvent(new Event("svp_data_updated"));
}

// Functional single operations
export function addSubscriber(email: string): { success: boolean; message: string } {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !trimmed.includes("@")) {
    return { success: false, message: "Please provide a valid email address." };
  }

  const current = getSubscribers();
  if (current.some(s => s.email === trimmed)) {
    return { success: true, message: "You are already subscribed to our newsletter!" };
  }

  const newSub: Subscriber = {
    id: "sub-" + Date.now(),
    email: trimmed,
    enrolledAt: new Date().toISOString(),
    active: true
  };

  updateSubscribers([...current, newSub]);
  return { success: true, message: "Thank you for subscribing! Your weekly prep begins this Sunday morning." };
}

export function addContactMessage(name: string, email: string, subject: string, message: string): { success: boolean } {
  const current = getContactMessages();
  const next: ContactMessage = {
    id: "msg-" + Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: subject.trim(),
    message: message.trim(),
    submittedAt: new Date().toISOString()
  };

  updateContactMessages([...current, next]);
  return { success: true };
}
