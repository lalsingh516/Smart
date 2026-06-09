import React, { useState, useEffect, useMemo } from "react";
import {
  Clock,
  Star,
  Search,
  ArrowRight,
  ArrowLeft,
  Mail,
  Check,
  Calendar,
  Dumbbell,
  DollarSign,
  ChevronRight,
  Leaf,
  Users,
  Utensils,
  BookOpen,
  CheckSquare,
  Square,
  Shield,
  FileText
} from "lucide-react";

import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import RecipeCard from "./components/RecipeCard";
import BlogCard from "./components/BlogCard";
import AdminPanel from "./components/AdminPanel";

import {
  getRecipes,
  getArticles,
  getMealPlans,
  getSettings,
  addSubscriber,
  addContactMessage
} from "./data/store";
import { Recipe, Article, MealPlan, SiteSettings } from "./types";

export default function App() {
  // Routing States
  const [routeInfo, setRouteInfo] = useState<{ route: string; param: string }>({ route: "home", param: "" });

  const currentRoute = routeInfo.route;
  const urlParam = routeInfo.param;

  // Active Data Store States (dynamically sync with changes)
  const [allRecipes, setAllRecipes] = useState<Recipe[]>(getRecipes());
  const [allArticles, setAllArticles] = useState<Article[]>(getArticles());
  const [allPlans, setAllPlans] = useState<MealPlan[]>(getMealPlans());
  const [settings, setSettings] = useState<SiteSettings>(getSettings());

  // Listen for data updates (e.g. from Admin Panel saves)
  useEffect(() => {
    const handleSync = () => {
      setAllRecipes(getRecipes());
      setAllArticles(getArticles());
      setAllPlans(getMealPlans());
      setSettings(getSettings());
    };
    window.addEventListener("svp_data_updated", handleSync);
    return () => window.removeEventListener("svp_data_updated", handleSync);
  }, []);

  // Sync state with browser location hash
  useEffect(() => {
    const parseLocation = () => {
      const hash = window.location.hash || "#/";
      
      if (hash.startsWith("#/recipe/")) {
        setRouteInfo({ route: "recipe-details", param: hash.replace("#/recipe/", "") });
      } else if (hash.startsWith("#/blog/")) {
        setRouteInfo({ route: "blog-article", param: hash.replace("#/blog/", "") });
      } else if (hash.startsWith("#/meal-plans/")) {
        setRouteInfo({ route: "meal-plans", param: hash.replace("#/meal-plans/", "") });
      } else {
        switch (hash) {
          case "#/recipes":
            setRouteInfo({ route: "recipes", param: "" });
            break;
          case "#/recipes/high-protein":
            setRouteInfo({ route: "high-protein", param: "" });
            break;
          case "#/recipes/budget":
            setRouteInfo({ route: "budget", param: "" });
            break;
          case "#/meal-plans":
            setRouteInfo({ route: "meal-plans", param: "" });
            break;
          case "#/blog":
            setRouteInfo({ route: "blog", param: "" });
            break;
          case "#/about":
            setRouteInfo({ route: "about", param: "" });
            break;
          case "#/contact":
            setRouteInfo({ route: "contact", param: "" });
            break;
          case "#/newsletter":
            setRouteInfo({ route: "newsletter", param: "" });
            break;
          case "#/privacy":
            setRouteInfo({ route: "privacy", param: "" });
            break;
          case "#/terms":
            setRouteInfo({ route: "terms", param: "" });
            break;
          case "#/admin":
            setRouteInfo({ route: "admin", param: "" });
            break;
          default:
            setRouteInfo({ route: "home", param: "" });
        }
      }
      window.scrollTo(0, 0);
    };

    parseLocation();
    window.addEventListener("hashchange", parseLocation);
    return () => window.removeEventListener("hashchange", parseLocation);
  }, []);

  // Router dispatcher / anchor handler
  const navigateTo = (route: string, param: string = "") => {
    if (route === "home") window.location.hash = "#/";
    else if (route === "recipe-details") window.location.hash = `#/recipe/${param}`;
    else if (route === "blog-article") window.location.hash = `#/blog/${param}`;
    else if (route === "meal-plans" && param) window.location.hash = `#/meal-plans/${param}`;
    else if (route === "high-protein") window.location.hash = `#/recipes/high-protein`;
    else if (route === "budget") window.location.hash = `#/recipes/budget`;
    else window.location.hash = `#/${route}`;
  };

  // Recipe Filter/Search States
  const [recipeSearch, setRecipeSearch] = useState("");
  const [recipeCategory, setRecipeCategory] = useState("All");
  const [recipeSort, setRecipeSort] = useState("default"); // rating | prepTime | name
  const [proteinFilter, setProteinFilter] = useState(false);
  const [budgetFilter, setBudgetFilter] = useState(false);

  // Initialize specific routes
  useEffect(() => {
    if (currentRoute === "high-protein") {
      setProteinFilter(true);
      setBudgetFilter(false);
      setRecipeCategory("All");
    } else if (currentRoute === "budget") {
      setBudgetFilter(true);
      setProteinFilter(false);
      setRecipeCategory("All");
    } else if (currentRoute === "recipes") {
      setProteinFilter(false);
      setBudgetFilter(false);
    }
  }, [currentRoute]);

  // Selected details targets
  const currentRecipe = useMemo(() => {
    if (currentRoute === "recipe-details" && urlParam) {
      return allRecipes.find(r => r.slug === urlParam) || null;
    }
    return null;
  }, [currentRoute, urlParam, allRecipes]);

  const currentArticle = useMemo(() => {
    if (currentRoute === "blog-article" && urlParam) {
      return allArticles.find(a => a.slug === urlParam) || null;
    }
    return null;
  }, [currentRoute, urlParam, allArticles]);

  const [activePlanSlug, setActivePlanSlug] = useState<string>("");
  
  useEffect(() => {
    if (currentRoute === "meal-plans") {
      if (urlParam) {
        setActivePlanSlug(urlParam);
      } else if (allPlans.length > 0 && !activePlanSlug) {
        setActivePlanSlug(allPlans[0].slug);
      }
    }
  }, [currentRoute, urlParam, allPlans]);

  const currentPlan = useMemo(() => {
    return allPlans.find(p => p.slug === activePlanSlug) || allPlans[0] || null;
  }, [activePlanSlug, allPlans]);

  // Blog Search and filtering states
  const [blogSearch, setBlogSearch] = useState("");
  const [blogCategory, setBlogCategory] = useState("All");

  // Client Interactivity lists
  const [tickedIngredients, setTickedIngredients] = useState<Record<string, boolean>>({});
  const [tickedShoppingItems, setTickedShoppingItems] = useState<Record<string, boolean>>({});

  // Reset checkboxes when recipe/plan changes
  useEffect(() => {
    setTickedIngredients({});
  }, [urlParam]);

  useEffect(() => {
    setTickedShoppingItems({});
  }, [activePlanSlug]);

  // Newsletter Form state backends
  const [newsEmail, setNewsEmail] = useState("");
  const [newsStatus, setNewsStatus] = useState({ success: false, message: "" });

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addSubscriber(newsEmail);
    setNewsStatus({ success: res.success, message: res.message });
    if (res.success) setNewsEmail("");
  };

  // Contact Form States
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactStatus, setContactStatus] = useState({ success: false, message: "" });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.includes("@") || !contactMsg.trim()) {
      setContactStatus({ success: false, message: "Please fill in all mandatory fields with a valid email." });
      return;
    }
    addContactMessage(contactName, contactEmail, contactSubject || "General Prep Inquiry", contactMsg);
    setContactStatus({ success: true, message: "Your message has been logged in our support queue. We'll reply within 24 hours!" });
    setContactName("");
    setContactEmail("");
    setContactSubject("");
    setContactMsg("");
  };

  // FILTER LOGIC: Recipes filtered lists
  const filteredRecipes = useMemo(() => {
    let result = [...allRecipes];

    // Search query match
    if (recipeSearch.trim()) {
      const q = recipeSearch.toLowerCase().trim();
      result = result.filter(
        r => r.title.toLowerCase().includes(q) ||
             r.description.toLowerCase().includes(q) ||
             r.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Category match
    if (recipeCategory !== "All") {
      result = result.filter(r => r.category.toLowerCase() === recipeCategory.toLowerCase());
    }

    // High Protein constraint
    if (proteinFilter) {
      result = result.filter(r => r.highProtein);
    }

    // Budget constraint
    if (budgetFilter) {
      result = result.filter(r => r.budget);
    }

    // Sorter logic
    if (recipeSort === "prepTime") {
      result.sort((a, b) => (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime));
    } else if (recipeSort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (recipeSort === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [allRecipes, recipeSearch, recipeCategory, recipeSort, proteinFilter, budgetFilter]);

  // FILTER LOGIC: Blog columns
  const filteredArticles = useMemo(() => {
    let result = [...allArticles];

    if (blogSearch.trim()) {
      const q = blogSearch.toLowerCase().trim();
      result = result.filter(
        a => a.title.toLowerCase().includes(q) ||
             a.excerpt.toLowerCase().includes(q) ||
             a.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (blogCategory !== "All") {
      result = result.filter(a => a.category.toLowerCase() === blogCategory.toLowerCase());
    }

    return result;
  }, [allArticles, blogSearch, blogCategory]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Dynamic SEO Structure (Updates document title dynamically according to route matching) */}
      <title>
        {currentRoute === "home" ? settings.seoTitle :
         currentRoute === "recipes" ? `Nutrient Recipes - ${settings.siteName}` :
         currentRoute === "high-protein" ? `High Protein Muscle Prep - ${settings.siteName}` :
         currentRoute === "budget" ? `Budget Friendly Eats - ${settings.siteName}` :
         currentRoute === "recipe-details" && currentRecipe ? `${currentRecipe.title} Recipe Prep - ${settings.siteName}` :
         currentRoute === "meal-plans" && currentPlan ? `Weekly meal Schedule: ${currentPlan.title}` :
         currentRoute === "blog" ? `Science-backed Vegan Insights Blog` :
         currentRoute === "blog-article" && currentArticle ? `${currentArticle.title} - ${settings.siteName}` :
         `${currentRoute.toUpperCase()} - ${settings.siteName}`}
      </title>

      {/* Global Navigation header */}
      <Navigation currentRoute={currentRoute} onNavigate={(r) => navigateTo(r)} />

      {/* RENDER SPACE: ROUTED RENDERS */}
      <main className="flex-grow">
        
        {/* VIEW 1: HOMEPAGE */}
        {currentRoute === "home" && (
          <div className="space-y-16 md:space-y-24">
            
            {/* HERO HERO COLUMN */}
            <section className="border-b border-zinc-100 bg-zinc-50/50 py-16 md:py-24" id="home-hero">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                    Smart meal planning
                  </span>
                  <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-zinc-900 leading-[1.1]">
                    Healthy vegan meal preps, made <span className="text-emerald-700">simple</span> and affordable.
                  </h1>
                  <p className="text-zinc-650 text-sm sm:text-base leading-relaxed max-w-lg">
                    Discover professional plant-based recipes, structured weekly plans, and actionable grocery manifests curated by sports nutrition experts to power your performance.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={() => navigateTo("recipes")}
                      className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                    >
                      Explore Recipes <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => navigateTo("meal-plans")}
                      className="px-6 py-3 border border-zinc-300 hover:bg-zinc-100 text-zinc-850 text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      View Weekly Schedules
                    </button>
                  </div>
                </div>

                <div className="relative aspect-video lg:aspect-square overflow-hidden border border-zinc-100 bg-zinc-100">
                  <img
                    src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1200"
                    alt="Premium plant-based recipe"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-white/95 border border-zinc-150 p-4 max-w-xs">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-800">Featured Pick</p>
                    <h4 className="font-sans font-bold text-sm text-zinc-900 mt-1">Stir-Fried Sesame Broccoli & Tempeh</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">Packed with 28g whole plant protein.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* THREE CORE BENCHMARKS FEATURE CARDS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="home-benchmarks">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                <div className="space-y-3">
                  <div className="h-10 w-10 bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">1</div>
                  <h3 className="font-sans font-bold text-lg text-zinc-900">Custom Cook Times</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    Every dish is carefully organized around efficient prepping cycles. Spend less than 2 hours total cooking for your entire week.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="h-10 w-10 bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">2</div>
                  <h3 className="font-sans font-bold text-lg text-zinc-900">Transparent Macro Stats</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    Detailed analysis of clean proteins, fats, and carbohydrates so you never query whether you are hitting your daily goals.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="h-10 w-10 bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">3</div>
                  <h3 className="font-sans font-bold text-lg text-zinc-900">Automated Groceries</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    Integrated tick-able shopping modules map bulk pantry staples efficiently to prevent redundant food wastage.
                  </p>
                </div>
              </div>
            </section>

            {/* HIGHLIGHTED FEATURED RECIPES */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" id="home-featured">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 pb-4 border-b border-zinc-100">
                <div>
                  <h2 className="font-sans font-bold text-2xl sm:text-3xl text-zinc-900">Weekly Prepping Staples</h2>
                  <p className="text-zinc-500 text-xs mt-1">Nourishing vegan meal components prepared regularly by our active community.</p>
                </div>
                <button
                  onClick={() => navigateTo("recipes")}
                  className="group inline-flex items-center gap-1.5 text-xs text-emerald-800 font-bold uppercase tracking-wider hover:text-emerald-900"
                >
                  View All {allRecipes.length} Recipes <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {allRecipes.filter(r => r.featured).slice(0, 3).map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} onSelect={(r) => navigateTo("recipe-details", r.slug)} />
                ))}
              </div>
            </section>

            {/* MEAL PLANS PEAK */}
            <section className="bg-zinc-50 py-16 md:py-20" id="home-meal-plans">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                <div className="lg:col-span-2 space-y-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#065f46]">High fidelity regimens</span>
                  <h2 className="font-sans font-bold text-3xl sm:text-4xl text-zinc-900 tracking-tight">
                    Structured Weekly Food Meal Plans
                  </h2>
                  <p className="text-zinc-650 text-xs sm:text-sm leading-relaxed">
                    Stop querying \"what's for dinner.\" Our curated itineraries take care of breakfast, lunch, dinner, snack prep metrics, and provide interactive lists to consolidate shopping.
                  </p>
                  <button
                    onClick={() => navigateTo("meal-plans")}
                    className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider transition-colors inline-block"
                  >
                    Explore Meal Schedules
                  </button>
                </div>

                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {allPlans.slice(0, 2).map((plan) => (
                    <div 
                      key={plan.id}
                      onClick={() => navigateTo("meal-plans", plan.slug)}
                      className="bg-white border border-zinc-150 p-6 flex flex-col justify-between hover:border-zinc-350 cursor-pointer transition-all"
                    >
                      <div className="space-y-2">
                        <div className="h-10 w-10 text-emerald-700 bg-emerald-50 rounded-full flex items-center justify-center font-mono font-bold text-xs">
                          {plan.id.includes("protein") ? "HP" : "BF"}
                        </div>
                        <h4 className="font-sans font-semibold text-zinc-900 text-capitalize text-md">{plan.title}</h4>
                        <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed">{plan.description}</p>
                      </div>
                      <span className="text-emerald-800 font-semibold text-xs mt-4 inline-flex items-center gap-0.5">
                        Expand Schedule <ChevronRight className="h-4 w-4" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* EXPERT BLOG SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" id="home-blog">
              <div className="flex justify-between items-end pb-4 border-b border-zinc-100">
                <div>
                  <h2 className="font-sans font-bold text-2xl sm:text-3xl text-zinc-900">Plant-Based Columns</h2>
                  <p className="text-zinc-500 text-xs mt-1">Science-supported advice regarding micro-nutrition, kitchen skills, and meal storage.</p>
                </div>
                <button
                  onClick={() => navigateTo("blog")}
                  className="text-xs text-emerald-800 font-bold uppercase tracking-wider hover:text-emerald-900"
                >
                  Read Columns
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {allArticles.slice(0, 2).map((article) => (
                  <BlogCard key={article.id} article={article} onSelect={(a) => navigateTo("blog-article", a.slug)} />
                ))}
              </div>
            </section>

            {/* HOME NEWSLETTER FORM ELEMENT */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
              <div className="border border-zinc-200 p-8 sm:p-12 text-center bg-white space-y-6">
                <Leaf className="h-8 w-8 text-emerald-700 mx-auto" />
                <h3 className="font-sans font-bold text-2xl sm:text-3xl text-zinc-900 tracking-tight">
                  {settings.newsletterHeadline}
                </h3>
                <p className="text-zinc-550 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
                  {settings.newsletterDescription}
                </p>

                <form onSubmit={handleNewsSubmit} className="max-w-md mx-auto space-y-3" id="home-newsletter-form">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Your professional email address"
                      value={newsEmail}
                      onChange={(e) => setNewsEmail(e.target.value)}
                      className="flex-1 bg-white border border-zinc-200 px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                    <button
                      type="submit"
                      className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 transition-colors shrink-0"
                    >
                      Subscribe Now
                    </button>
                  </div>
                  {newsStatus.message && (
                    <p className={`text-xs mt-2 font-medium ${newsStatus.success ? "text-emerald-800" : "text-amber-800"}`}>
                      {newsStatus.message}
                    </p>
                  )}
                </form>
              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: RECIPES ARCHIVE / SEA / CATS */}
        {(currentRoute === "recipes" || currentRoute === "high-protein" || currentRoute === "budget") && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12" id="recipes-catalog">
            
            {/* Header Content */}
            <div className="pb-6 border-b border-zinc-150">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {currentRoute === "high-protein" ? "High Protein selection" :
                 currentRoute === "budget" ? "Budget selection ($4/day)" : "Plant Nutrition"}
              </span>
              <h1 className="font-sans font-bold text-3xl sm:text-4xl text-zinc-900 tracking-tight mt-2">
                {currentRoute === "high-protein" ? "High-Protein Strength Building Preps" :
                 currentRoute === "budget" ? "Aesthetic Budget-Friendly Vegan Preps" :
                 "The Plant-Based Recipe Curation"}
              </h1>
              <p className="text-zinc-500 text-xs sm:text-sm mt-1 max-w-2xl">
                {currentRoute === "high-protein" ? "Every recipe in this custom view yields at least 20g-30g of pure plant protein to accelerate amino acid uptake." :
                 currentRoute === "budget" ? "Low-cost whole foods designed to keep your weekly grocer bill beneath $25 without compromising flavor." :
                 "Search, sort, and isolate nutritional preps according to active filters. Click any card to load detailed prep metrics."}
              </p>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* Sidebar Filters Widget */}
              <div className="lg:col-span-1 space-y-5 border border-zinc-150 p-5 bg-zinc-50/20">
                <h4 className="font-sans font-bold text-zinc-950 text-xs tracking-wider uppercase pb-2 border-b border-zinc-150">
                  Target Filter Criteria
                </h4>

                {/* Sorter */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-700 uppercase">Sort Order</label>
                  <select
                    value={recipeSort}
                    onChange={(e) => setRecipeSort(e.target.value)}
                    className="w-full bg-white border border-zinc-200 text-xs px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="default">Default recommendation</option>
                    <option value="rating">Highest Star Rating</option>
                    <option value="prepTime">Fastest prep/cook times</option>
                    <option value="name">Alphabetical (A-Z)</option>
                  </select>
                </div>

                {/* Category selectors */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-700 uppercase">Meals Categories</label>
                  <div className="flex flex-col gap-1 text-xs">
                    {["All", "Breakfast", "Lunch", "Dinner", "Snacks"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setRecipeCategory(cat)}
                        className={`text-left px-2.5 py-1.5 transition-colors font-medium ${
                          recipeCategory === cat ? "bg-zinc-900 text-white" : "text-zinc-650 hover:bg-zinc-50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Multi-toggle flags */}
                <div className="space-y-3 pt-3 border-t border-zinc-150 text-xs">
                  <label className="block text-xs font-bold text-zinc-700 uppercase">Quick parameters</label>
                  
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-zinc-650 select-none">
                    <input
                      type="checkbox"
                      checked={proteinFilter}
                      onChange={(e) => setProteinFilter(e.target.checked)}
                      className="rounded text-emerald-800 border-zinc-350 focus:ring-emerald-800 focus:ring-offset-0"
                    />
                    High Protein only (&gt;20g)
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-zinc-650 select-none">
                    <input
                      type="checkbox"
                      checked={budgetFilter}
                      onChange={(e) => setBudgetFilter(e.target.checked)}
                      className="rounded text-emerald-800 border-zinc-350 focus:ring-emerald-800 focus:ring-offset-0"
                    />
                    Strictly Budget-Friendly
                  </label>
                </div>

                {/* Reset filters */}
                <button
                  onClick={() => {
                    setRecipeSearch("");
                    setRecipeCategory("All");
                    setRecipeSort("default");
                    setProteinFilter(false);
                    setBudgetFilter(false);
                  }}
                  className="w-full text-center text-[10px] uppercase font-bold tracking-wider py-1.5 border border-zinc-250 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                >
                  Clear all parameters
                </button>
              </div>

              {/* Main Content Pane */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Search Bar HUD */}
                <div className="flex items-center gap-2 border border-zinc-150 bg-white p-2 w-full">
                  <Search className="h-4 w-4 text-zinc-400 ml-1 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search plant ingredient titles (e.g. tofu, lentils, quinoa, curry, peanut)..."
                    value={recipeSearch}
                    onChange={(e) => setRecipeSearch(e.target.value)}
                    className="flex-1 bg-transparent border-none text-xs focus:outline-none text-zinc-900"
                  />
                  {recipeSearch && (
                    <button onClick={() => setRecipeSearch("")} className="text-zinc-400 hover:text-zinc-900 mr-1 text-xs uppercase font-mono">
                      Clear
                    </button>
                  )}
                </div>

                {/* Recipe Results Counter */}
                <div className="text-xs text-zinc-400">
                  Showing <strong className="text-zinc-850 font-sans">{filteredRecipes.length}</strong> optimal plant-based recipes based on active constraints.
                </div>

                {/* Recipes Grid */}
                {filteredRecipes.length === 0 ? (
                  <div className="text-center py-20 border border-dashed border-zinc-200">
                    <p className="text-zinc-450 italic text-xs">No recipes met your search and filter parameters.</p>
                    <button
                      onClick={() => {
                        setRecipeSearch("");
                        setRecipeCategory("All");
                        setProteinFilter(false);
                        setBudgetFilter(false);
                      }}
                      className="text-emerald-800 text-xs font-semibold underline mt-2"
                    >
                      Reset active parameters to view everything
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {filteredRecipes.map((recipe) => (
                      <RecipeCard key={recipe.id} recipe={recipe} onSelect={(r) => navigateTo("recipe-details", r.slug)} />
                    ))}
                  </div>
                )}

              </div>

            </div>

          </section>
        )}

        {/* VIEW 3: RECIPE DETAILS */}
        {currentRoute === "recipe-details" && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12" id="recipe-focus-screen">
            
            {/* Back indicator link */}
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900"
            >
              <ArrowLeft className="h-4 w-4" /> Return to Catalog
            </button>

            {currentRecipe === null ? (
              <div className="text-center p-16">
                <h3 className="text-zinc-700 italic">This plant recipe could not be resolved or was recently deleted from Admin.</h3>
                <button onClick={() => navigateTo("recipes")} className="text-emerald-700 font-semibold underline mt-3">
                  Return to catalog
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* Title and Excerpt Header */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-emerald-50 text-emerald-800 font-sans font-medium text-[10px] tracking-wider uppercase px-2 py-0.5 border border-emerald-100">
                      {currentRecipe.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-amber-500 font-medium">
                      <Star className="h-3 w-3 fill-amber-500" />
                      {currentRecipe.rating.toFixed(1)} Stars
                    </span>
                    {currentRecipe.highProtein && (
                      <span className="bg-zinc-100 text-zinc-800 text-[9px] uppercase font-bold tracking-widest px-2 py-0.5">
                        <Dumbbell className="h-2.5 w-2.5 inline-block mr-1 align-middle" /> High-Protein Staple
                      </span>
                    )}
                  </div>

                  <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-zinc-950 tracking-tight leading-tight">
                    {currentRecipe.title}
                  </h1>

                  <p className="text-zinc-650 text-xs sm:text-sm leading-relaxed">
                    {currentRecipe.description}
                  </p>
                </div>

                {/* Large high-res Hero photography */}
                <div className="relative aspect-video w-full overflow-hidden border border-zinc-100 bg-zinc-50">
                  <img
                    src={currentRecipe.image}
                    alt={currentRecipe.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Prep and cooking stats column */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 border border-zinc-150 p-5 bg-zinc-50/30 text-xs">
                  <div>
                    <h5 className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Prep duration</h5>
                    <p className="text-zinc-900 font-semibold mt-1">{currentRecipe.prepTime} Mins</p>
                  </div>
                  <div>
                    <h5 className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Cook duration</h5>
                    <p className="text-zinc-900 font-semibold mt-1">{currentRecipe.cookTime} Mins</p>
                  </div>
                  <div>
                    <h5 className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Serving output</h5>
                    <p className="text-zinc-900 font-semibold mt-1">{currentRecipe.servings} Servings</p>
                  </div>
                  <div>
                    <h5 className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Difficulty rank</h5>
                    <p className="text-zinc-900 font-semibold mt-1">{currentRecipe.difficulty}</p>
                  </div>
                  <div>
                    <h5 className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Total calories</h5>
                    <p className="text-[#034f3a] font-bold mt-1">{currentRecipe.calories} Kcal</p>
                  </div>
                </div>

                {/* Macro percentages block */}
                <div className="space-y-4">
                  <h3 className="font-sans font-bold text-lg text-zinc-900 uppercase tracking-wide text-xs">
                    Target Macronutrient Split
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Protein bar */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-zinc-700">Protein (Aesthetic Muscle Build)</span>
                        <span className="font-mono font-bold text-emerald-800">{currentRecipe.protein}g</span>
                      </div>
                      <div className="h-2 bg-zinc-100 overflow-hidden">
                        <div 
                          className="h-full bg-emerald-700" 
                          style={{ width: `${Math.min(100, (currentRecipe.protein / 50) * 100)}%` }} 
                        />
                      </div>
                      <p className="text-[10px] text-zinc-400">Contributes to muscle recovery and tissue repair.</p>
                    </div>

                    {/* Carbs */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-zinc-700">Carbohydrates (Glycogen replenishment)</span>
                        <span className="font-mono font-bold text-zinc-700">{currentRecipe.carbs}g</span>
                      </div>
                      <div className="h-2 bg-zinc-100 overflow-hidden">
                        <div 
                          className="h-full bg-zinc-800" 
                          style={{ width: `${Math.min(100, (currentRecipe.carbs / 120) * 100)}%` }} 
                        />
                      </div>
                      <p className="text-[10px] text-zinc-400">Sustained high glycogen fuel for cardio stability.</p>
                    </div>

                    {/* Fat */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-zinc-700">Healthy Fats (Hormone support)</span>
                        <span className="font-mono font-bold text-zinc-700">{currentRecipe.fat}g</span>
                      </div>
                      <div className="h-2 bg-zinc-100 overflow-hidden">
                        <div 
                          className="h-full bg-zinc-400" 
                          style={{ width: `${Math.min(100, (currentRecipe.fat / 40) * 100)}%` }} 
                        />
                      </div>
                      <p className="text-[10px] text-zinc-400">Essential lipids for optimal hormone synchronization.</p>
                    </div>
                  </div>
                </div>

                {/* Ingredients and Instructions double panel */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 border-t border-zinc-200 pt-8" id="ingredients-instructions-splits">
                  
                  {/* Left Column Ingredients checkbox triggers */}
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-zinc-900 pb-2 border-b border-zinc-100">
                      Mandatory Ingredients ({currentRecipe.ingredients.length})
                    </h3>
                    <p className="text-[10px] text-zinc-450 italic leading-snug">
                      Check items off as you purchase or extract them from bulk pantry storage:
                    </p>

                    <div className="space-y-2 text-xs">
                      {currentRecipe.ingredients.map((ingredient, i) => {
                        const isTicked = tickedIngredients[ingredient] || false;
                        return (
                          <div
                            key={i}
                            onClick={() => setTickedIngredients({ ...tickedIngredients, [ingredient]: !isTicked })}
                            className={`flex items-start gap-2.5 p-2 border cursor-pointer select-none transition-colors ${
                              isTicked ? "bg-zinc-50 border-zinc-200 text-zinc-400 line-through" : "bg-white border-zinc-100 hover:border-zinc-200 text-zinc-700"
                            }`}
                          >
                            <span className="mt-0.5 shrink-0">
                              {isTicked ? (
                                <CheckSquare className="h-4 w-4 text-emerald-800" />
                              ) : (
                                <Square className="h-4 w-4 text-zinc-300" />
                              )}
                            </span>
                            <span className="leading-snug">{ingredient}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column Instructions sequential */}
                  <div className="md:col-span-3 space-y-4">
                    <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-zinc-900 pb-2 border-b border-zinc-100">
                      Step-by-Step Meal Preparation Guide
                    </h3>

                    <div className="space-y-6 text-xs text-zinc-700">
                      {currentRecipe.instructions.map((step, idx) => (
                        <div key={idx} className="flex gap-4">
                          <span className="h-6 w-6 font-mono font-bold text-xs bg-zinc-900 text-white rounded-full flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <p className="leading-relaxed pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Custom FAQ block for this recipe */}
                {currentRecipe.faq && currentRecipe.faq.length > 0 && (
                  <div className="border-t border-zinc-200 pt-8 space-y-4">
                    <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-zinc-900">
                      Prep & Cooking FAQ
                    </h3>
                    <div className="space-y-3">
                      {currentRecipe.faq.map((item, index) => (
                        <div key={index} className="bg-zinc-50 p-4 border border-zinc-100 text-xs">
                          <h4 className="font-bold text-zinc-900 flex items-center gap-1.5">
                            <span className="text-emerald-800 font-sans font-semibold">Q.</span> {item.question}
                          </h4>
                          <p className="text-zinc-650 mt-1.5 leading-relaxed pl-4">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Plant-Based staple cards */}
                <div className="border-t border-zinc-200 pt-8 space-y-6" id="related-catalog-pane">
                  <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-zinc-900">
                    Explore similar {currentRecipe.category} Prepping Staples
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {allRecipes
                      .filter(r => r.category === currentRecipe.category && r.id !== currentRecipe.id)
                      .slice(0, 2)
                      .map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} onSelect={(r) => navigateTo("recipe-details", r.slug)} />
                      ))}
                  </div>
                </div>

              </div>
            )}

          </section>
        )}

        {/* VIEW 4: MEAL PLANS & SHOPPING LISTS */}
        {currentRoute === "meal-plans" && currentPlan && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12" id="meal-plans-workbench">
            
            {/* Header Content */}
            <div className="pb-6 border-b border-zinc-150 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Structured routines
                </span>
                <h1 className="font-sans font-bold text-3xl sm:text-4xl text-zinc-900 mt-2">
                  Weekly Planner & Shopping Manifests
                </h1>
                <p className="text-zinc-500 text-xs sm:text-sm mt-1 max-w-xl">
                  Batch-cook once, eat nourishing customized food all week. Check off integrated groceries to prevent redundant food wastage.
                </p>
              </div>

              {/* Selector buttons for active plans */}
              <div className="flex gap-2 self-start md:self-center">
                {allPlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setActivePlanSlug(plan.slug)}
                    className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all border ${
                      activePlanSlug === plan.slug
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : "bg-white text-zinc-500 hover:text-zinc-900 border-zinc-200"
                    }`}
                  >
                    {plan.title.split(" ")[0]} ...
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column: Weekly Schedule board */}
              <div className="lg:col-span-2 space-y-6">
                <div className="border border-zinc-200 p-6 bg-white space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-100">
                    <h3 className="font-sans font-bold text-lg text-zinc-950">{currentPlan.title}</h3>
                    <span className="text-xs text-zinc-450 font-mono">CYCLE TIMELINE: {currentPlan.durationWeeks} WEEK</span>
                  </div>
                  <p className="text-xs text-zinc-550 leading-relaxed">{currentPlan.description}</p>

                  {/* Matrix representation of Monday through Sunday */}
                  <div className="space-y-4 pt-3">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                      const dayMeals = currentPlan.schedule?.[day] || { breakfast: "", lunch: "", dinner: "", snack: "" };
                      return (
                        <div key={day} className="border border-zinc-150 overflow-hidden">
                          <div className="bg-zinc-50 p-2.5 px-4 font-sans font-bold text-xs text-zinc-900 border-b border-zinc-150">
                            {day} Menu
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 text-xs font-sans">
                            <div>
                              <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block mb-1">Breakfast</span>
                              <strong className="text-zinc-800 font-sans leading-tight block">{dayMeals.breakfast}</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block mb-1">Lunch</span>
                              <strong className="text-zinc-800 font-sans leading-tight block">{dayMeals.lunch}</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block mb-1">Dinner</span>
                              <strong className="text-zinc-800 font-sans leading-tight block">{dayMeals.dinner}</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block mb-1">Snack Fuel</span>
                              <strong className="text-zinc-800 font-sans leading-tight block">{dayMeals.snack}</strong>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Groceries Checkout module */}
              <div className="lg:col-span-1 space-y-6">
                <div className="border border-zinc-200 p-6 bg-white space-y-4">
                  <div className="pb-3 border-b border-zinc-100">
                    <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-zinc-950">
                      Consolidated Shopping Manifest ({currentPlan.shoppingList.length} items)
                    </h3>
                    <p className="text-[10px] text-zinc-400 mt-1 italic">
                      Bring this list to your store or organic grocery market:
                    </p>
                  </div>

                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {currentPlan.shoppingList.map((item, index) => {
                      const isTicked = tickedShoppingItems[item] || false;
                      return (
                        <div
                          key={index}
                          onClick={() => setTickedShoppingItems({ ...tickedShoppingItems, [item]: !isTicked })}
                          className={`flex items-start gap-2 p-2.5 border cursor-pointer select-none transition-colors text-xs ${
                            isTicked 
                              ? "bg-zinc-50 border-zinc-200 text-zinc-400 line-through" 
                              : "bg-white border-zinc-100 hover:border-zinc-200 text-zinc-750 font-medium"
                          }`}
                        >
                          <span className="mt-0.5 shrink-0">
                            {isTicked ? (
                              <CheckSquare className="h-4 w-4 text-emerald-800" />
                            ) : (
                              <Square className="h-4 w-4 text-zinc-300" />
                            )}
                          </span>
                          <span className="leading-snug">{item}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reset Checkout button */}
                  <button
                    onClick={() => setTickedShoppingItems({})}
                    className="w-full text-center text-[10px] uppercase font-bold tracking-wider py-2 border border-zinc-250 text-zinc-650 hover:bg-zinc-55 hover:text-zinc-900 transition-all"
                  >
                    Clear crossed selections
                  </button>
                </div>
              </div>

            </div>

          </section>
        )}

        {/* VIEW 5: BLOG DIRECTORY */}
        {currentRoute === "blog" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12" id="blog-catalog">
            
            {/* Header Content */}
            <div className="pb-6 border-b border-zinc-150">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Evidence-Based Plant Nutrition
              </span>
              <h1 className="font-sans font-bold text-3xl sm:text-4xl text-zinc-900 mt-2">
                The Plant-Based Nutrition Chronicle
              </h1>
              <p className="text-zinc-500 text-xs sm:text-sm mt-1 max-w-xl">
                Read actionable reports from clinical nutritionists and chefs detailing how to maintain macros, store meals, and balance whole plant ecosystems.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
              
              {/* Left sidebar: Filter categories */}
              <div className="lg:col-span-1 space-y-5 border border-zinc-150 p-5 bg-zinc-50/10">
                <h4 className="font-sans font-bold text-zinc-900 text-xs tracking-wider uppercase pb-2 border-b border-zinc-150">
                  Article Categories
                </h4>

                <div className="flex flex-col gap-1 text-xs">
                  {["All", "Nutrition", "Meal Prep Advice", "Ingredient Spotlights"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setBlogCategory(cat)}
                      className={`text-left px-2.5 py-2 transition-colors font-medium ${
                        blogCategory === cat ? "bg-zinc-900 text-white font-semibold" : "text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="pt-3 border-t border-zinc-150 text-[11px] text-zinc-400 space-y-2">
                  <p>Check back weekly for scientific explorations of vitamins, protein quality and batch-cooking hacks.</p>
                </div>
              </div>

              {/* Right column: Results */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Search query box */}
                <div className="flex items-center gap-2 border border-zinc-150 bg-white p-2">
                  <Search className="h-4 w-4 text-zinc-400 ml-1 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search articles key terms (e.g. B12, lentils, protein, soy, tofu)..."
                    value={blogSearch}
                    onChange={(e) => setBlogSearch(e.target.value)}
                    className="flex-1 bg-transparent border-none text-xs focus:outline-none"
                  />
                  {blogSearch && (
                    <button onClick={() => setBlogSearch("")} className="text-zinc-400 text-xs font-mono uppercase">
                      Clear
                    </button>
                  )}
                </div>

                {/* Listing */}
                {filteredArticles.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-zinc-200 text-zinc-400 italic text-xs">
                     No columns matched your query. Try resetting filters.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredArticles.map((article) => (
                      <BlogCard key={article.id} article={article} onSelect={(a) => navigateTo("blog-article", a.slug)} />
                    ))}
                  </div>
                )}

              </div>

            </div>

          </section>
        )}

        {/* VIEW 6: BLOG ARTICLE DETAIL */}
        {currentRoute === "blog-article" && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8" id="blog-focus-screen">
            
            <button
              onClick={() => navigateTo("blog")}
              className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900"
            >
              <ArrowLeft className="h-4 w-4" /> Return to Columns
            </button>

            {currentArticle === null ? (
              <div className="text-center py-16 italic text-zinc-500">
                This blog article could not be loaded. Please return to list.
              </div>
            ) : (
              <article className="space-y-8 font-sans">
                
                {/* Meta */}
                <div className="space-y-3">
                  <span className="bg-emerald-50 text-emerald-800 font-sans font-medium text-[10px] tracking-wider uppercase px-2 py-0.5 border border-emerald-100">
                    {currentArticle.category}
                  </span>
                  <h1 className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight text-zinc-950 leading-tight">
                    {currentArticle.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
                    <span className="font-semibold text-zinc-650">By {currentArticle.author}</span>
                    <span>&middot;</span>
                    <span>{currentArticle.date}</span>
                    <span>&middot;</span>
                    <span>{currentArticle.readTime}</span>
                  </div>
                </div>

                {/* Main Illustration */}
                <div className="aspect-video w-full overflow-hidden bg-zinc-50 border border-zinc-150">
                  <img
                    src={currentArticle.image}
                    alt={currentArticle.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Structured text content */}
                <div className="text-zinc-800 text-sm leading-relaxed space-y-6 font-sans">
                  {currentArticle.content.split("\n\n").map((para, i) => {
                    if (para.startsWith("### ")) {
                      return (
                        <h3 key={i} className="font-sans font-extrabold text-lg text-zinc-900 mt-8 mb-3 uppercase text-xs tracking-wider">
                          {para.replace("### ", "")}
                        </h3>
                      );
                    }
                    if (para.startsWith("1. ") || para.startsWith("2. ") || para.startsWith("3. ")) {
                      return (
                        <div key={i} className="pl-4 border-l-2 border-emerald-700 py-1 font-sans text-xs sm:text-sm text-zinc-700 my-4 leading-normal">
                          {para}
                        </div>
                      );
                    }
                    return <p key={i}>{para}</p>;
                  })}
                </div>

                {/* Tags block */}
                <div className="flex flex-wrap gap-2 pt-6 border-t border-zinc-200">
                  {currentArticle.tags.map((tag) => (
                    <span key={tag} className="bg-zinc-50 border border-zinc-150 text-[10px] font-medium font-mono text-zinc-650 px-2 py-0.5">
                      #{tag}
                    </span>
                  ))}
                </div>

              </article>
            )}

          </section>
        )}

        {/* VIEW 7: ABOUT MISSION PAGE */}
        {currentRoute === "about" && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12" id="about-us-screen">
            <div className="text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#065f46]">Our Philosophy</span>
              <h1 className="font-sans font-extrabold text-4xl text-zinc-950 tracking-tight">
                Empowering Plant-Based Healthy Lifestyles
              </h1>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
                Discovering our background, our team dedication, and our commitment to clean macros and transparent plant nutrition.
              </p>
            </div>

            <div className="aspect-video w-full overflow-hidden bg-zinc-100 border border-zinc-200">
              <img
                src="https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&q=80&w=1200"
                alt="Vegan cooking class"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-zinc-650 leading-relaxed font-sans">
              <div className="space-y-4">
                <h3 className="font-sans font-bold text-lg text-zinc-900 uppercase text-xs tracking-wider">
                  The Meal Prep Challenge
                </h3>
                <p>
                  Transitioning to a vegan lifestyle or increasing plant-based food intake is structurally rewarding, but often collapses around menu monotony or disorganized kitchens. For active professionals, meal prep is the single non-negotiable step to stay dedicated.
                </p>
                <p>
                  That's why we engineered <strong>SmartVeganPrep</strong>. We don't sell expensive pre-cooked delivery packages that generate thermal shipping pollution. Instead, we offer beautiful recipes, responsive shopping lists, and custom programs to help you cook real food in your own house.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-sans font-bold text-lg text-zinc-900 uppercase text-xs tracking-wider">
                  Science Over Buzzwords
                </h3>
                <p>
                  We are vehemently against "clean-eating" dogmas or untested superfood products. Our macro ratios are driven purely by physiological standards.
                </p>
                <p>
                  Every recipe is thoroughly tested to guarantee nutritional parameters are locked in: complete proteins, bioavailable iron, fiber and vitamins count. Our blog is backed by registered dietitians to ensure we serve objective guidance.
                </p>
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-zinc-50 p-8 border border-zinc-150 rounded-none text-center space-y-4">
              <p className="font-mono text-zinc-400 italic text-sm">
                "SmartVeganPrep completely restructured how I tackle workout weeks. The high protein meal schedule fits my calories and shopping has never been faster."
              </p>
              <h5 className="font-sans font-bold text-xs text-zinc-900 uppercase tracking-widest">- Ethan Brooks, Powerlifter</h5>
            </div>

          </section>
        )}

        {/* VIEW 8: SUPPORT CONTACT HELP SCREEN */}
        {currentRoute === "contact" && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12" id="contact-screen">
            <div className="text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#065f46]">Contact Desk</span>
              <h1 className="font-sans font-extrabold text-4xl text-zinc-950 tracking-tight">
                Submit Support Requests
              </h1>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
                Have questions regarding custom macro counts, wholesale ingredients, or looking to partner with us? Reach out directly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
              
              {/* Address details */}
              <div className="md:col-span-2 space-y-6 text-xs text-zinc-600 font-sans">
                <div className="space-y-1">
                  <h4 className="font-sans font-bold text-zinc-900 uppercase text-[10px] tracking-wider">Mailing Address</h4>
                  <p>SmartVeganPrep HQ</p>
                  <p>448 Plant-Base Avenue</p>
                  <p>San Francisco, CA 94107</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-sans font-bold text-zinc-900 uppercase text-[10px] tracking-wider">Active Channels</h4>
                  <p>Support: <span className="text-zinc-900 font-medium">{settings.contactEmail}</span></p>
                  <p>Collaborations: <span className="text-zinc-900 font-medium">partners@smartveganprep.com</span></p>
                </div>
                <p className="text-[10px] text-zinc-400 leading-normal border-t border-zinc-100 pt-4">
                  Note: If you submit this contact form, your message is parsed and written directly into our real-time interactive admin messages list!
                </p>
              </div>

              {/* Form panel */}
              <div className="md:col-span-3 border border-zinc-200 p-6 sm:p-8 bg-white">
                <form onSubmit={handleContactSubmit} className="space-y-4" id="client-contact-form">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Liam Vance"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-white border border-zinc-200 text-xs px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="username@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-white border border-zinc-200 text-xs px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="Optional: custom macro request, bug report..."
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full bg-white border border-zinc-200 text-xs px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                      Detailed Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Write your query..."
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      className="w-full bg-white border border-zinc-200 p-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700 font-sans"
                    />
                  </div>

                  {contactStatus.message && (
                    <div className={`p-3 text-xs font-semibold ${contactStatus.success ? "bg-emerald-50 text-emerald-800" : "bg-zinc-100 text-zinc-650"}`}>
                      {contactStatus.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wide py-2.5 transition-colors"
                  >
                    Submit Support Ticket
                  </button>
                </form>
              </div>

            </div>

          </section>
        )}

        {/* VIEW 9: PRIVACY POLICY */}
        {currentRoute === "privacy" && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-6 text-xs sm:text-sm text-zinc-600 leading-relaxed font-sans" id="privacy-policy-screen">
            <div className="border-b border-zinc-200 pb-4 mb-4">
              <h1 className="font-sans font-extrabold text-3xl text-zinc-950 tracking-tight">Privacy Policy</h1>
              <p className="text-zinc-400 text-xs mt-1">Last revised: June 9, 2026</p>
            </div>

            <p>
              SmartVeganPrep is deeply committed to protecting our customers' personal credentials. This disclosure details what metrics we gather, how they are stored in regional clients, and your rights to revoke active files.
            </p>

            <h3 className="font-sans font-bold text-md text-zinc-900 uppercase text-xs tracking-wider mt-6">
              1. Information We Store
            </h3>
            <p>
              When subscribing to our Sunday Morning Newsletter or submitting support tickets in the contact desk, your parameters (e.g., email address, name) are processed immediately. We leverage HTML5 localStorage mechanisms directly inside your secure sandbox environments to maintain custom checklists and ticking variables safely.
            </p>

            <h3 className="font-sans font-bold text-md text-zinc-900 uppercase text-xs tracking-wider mt-6">
              2. Cookie Usage Disclaimer
            </h3>
            <p>
              We prioritize zero ad-tracking cookies. We do not transfer telemetry cookies or sell customer lists to third-party ad networks. Your details are accessed explicitly to serve recipe meal preparation details.
            </p>
          </section>
        )}

        {/* VIEW 10: TERMS OF USE */}
        {currentRoute === "terms" && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-6 text-xs sm:text-sm text-zinc-600 leading-relaxed font-sans" id="terms-of-use-screen">
            <div className="border-b border-zinc-200 pb-4 mb-4">
              <h1 className="font-sans font-extrabold text-3xl text-zinc-950 tracking-tight">Terms of Use</h1>
              <p className="text-zinc-400 text-xs mt-1">Effective Date: June 9, 2026</p>
            </div>

            <p>
              By accessing this vegan meal-prep program platform, you agree to respect our terms, guidelines, layout attributes, and copyrights.
            </p>

            <h3 className="font-sans font-bold text-md text-zinc-900 uppercase text-xs tracking-wider mt-6">
              1. Nutritional Accuracy Disclaimer
            </h3>
            <p>
              The materials served in SmartVeganPrep are curated for educational and meal preparation indexing. We are not a medical board, and our guidelines do not substitute for custom clinical diagnostic plans or allergen alerts. Check ingredients safely with registered general practitioners before implementing heavy calorie restrictions or macro changes.
            </p>

            <h3 className="font-sans font-bold text-md text-zinc-900 uppercase text-xs tracking-wider mt-6">
              2. Intellectual Copyrights
            </h3>
            <p>
              All vegan recipes, blogs, schedules, templates, images copy, and checklist databases are owned by SmartVeganPrep Inc. You are authorized to copy material exclusively for personal kitchen preparations. Re-selling lists commercially is strictly prohibited.
            </p>
          </section>
        )}

        {/* VIEW 11: NEWSLETTER STANDALONE PAGE */}
        {currentRoute === "newsletter" && (
          <section className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24" id="newsletter-hub">
            <div className="border border-zinc-200 p-8 sm:p-12 text-center bg-white space-y-6">
              <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <Mail className="h-6 w-6" />
              </div>
              <h1 className="font-sans font-extrabold text-3xl text-zinc-950 tracking-tight">
                {settings.newsletterHeadline}
              </h1>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                {settings.newsletterDescription}
              </p>

              <form onSubmit={handleNewsSubmit} className="space-y-3" id="newsletter-page-form">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  className="w-full bg-white border border-zinc-200 px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-700 text-center"
                />
                <button
                  type="submit"
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider py-3 transition-colors"
                >
                  Join Newsletter Queue
                </button>
                {newsStatus.message && (
                  <p className={`text-xs mt-3 font-semibold ${newsStatus.success ? "text-emerald-800" : "text-amber-800"}`}>
                    {newsStatus.message}
                  </p>
                )}
              </form>

              {/* Perks list */}
              <div className="border-t border-zinc-100 pt-6 text-left space-y-3 text-xs text-zinc-500 font-sans">
                <div className="flex gap-2 items-start">
                  <Check className="h-4 w-4 text-emerald-700 mt-0.5" />
                  <span><strong>Zero spam guaranteed</strong>. Highly prioritized, non-sponsored plant nutrition analyses.</span>
                </div>
                <div className="flex gap-2 items-start">
                  <Check className="h-4 w-4 text-emerald-700 mt-0.5" />
                  <span><strong>Portion control details</strong>. Standardizing food quantities to make bulk scale easy.</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 12: ADMIN PANEL PLATFORM */}
        {currentRoute === "admin" && (
          <section id="admin-main">
            <AdminPanel />
          </section>
        )}

      </main>

      {/* Global persistent footer */}
      <Footer onNavigate={(r) => navigateTo(r)} />

    </div>
  );
}
