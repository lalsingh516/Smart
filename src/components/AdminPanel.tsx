import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Lock,
  Plus,
  Trash2,
  Edit,
  Mail,
  Settings,
  Image as ImageIcon,
  Check,
  X,
  FileSpreadsheet,
  LogOut,
  Save,
  Globe
} from "lucide-react";
import {
  getRecipes,
  updateRecipes,
  getArticles,
  updateArticles,
  getMealPlans,
  updateMealPlans,
  getSubscribers,
  updateSubscribers,
  getSettings,
  updateSettings,
  getContactMessages,
  updateContactMessages
} from "../data/store";
import { Recipe, Article, MealPlan, Subscriber, SiteSettings, ContactMessage } from "../types";

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"dash" | "recipes" | "blogs" | "plans" | "subs" | "messages" | "settings">("dash");

  // Data States
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Form Editing States
  const [editingRecipe, setEditingRecipe] = useState<Partial<Recipe> | null>(null);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [editingPlan, setEditingPlan] = useState<Partial<MealPlan> | null>(null);
  const [editorMode, setEditorMode] = useState<"list" | "create" | "edit">("list");

  // Media presets
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [mediaList, setMediaList] = useState<string[]>([
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?auto=format&fit=crop&q=80&w=1200",
  ]);

  // Load all data
  useEffect(() => {
    setRecipes(getRecipes());
    setArticles(getArticles());
    setPlans(getMealPlans());
    setSubs(getSubscribers());
    setMessages(getContactMessages());
    setSettings(getSettings());
  }, [editorMode, activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === "admin" && password === "admin") {
      setIsAuthenticated(true);
      setAuthError("");
    } else if (username.trim() === "admin@smartveganprep.com" && password === "admin") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect admin credentials. Try username: admin | password: admin");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  // Recipe CRUD operations
  const saveRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecipe?.title || !editingRecipe.category) return;

    const allRecipes = getRecipes();
    const cleanSlug = (editingRecipe.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const fullRecipe: Recipe = {
      id: editingRecipe.id || "rec-" + Date.now(),
      title: editingRecipe.title,
      slug: editingRecipe.slug || cleanSlug,
      description: editingRecipe.description || "",
      image: editingRecipe.image || mediaList[0],
      category: editingRecipe.category,
      prepTime: Number(editingRecipe.prepTime) || 10,
      cookTime: Number(editingRecipe.cookTime) || 10,
      servings: Number(editingRecipe.servings) || 4,
      difficulty: editingRecipe.difficulty || "Easy",
      calories: Number(editingRecipe.calories) || 300,
      protein: Number(editingRecipe.protein) || 15,
      carbs: Number(editingRecipe.carbs) || 40,
      fat: Number(editingRecipe.fat) || 10,
      ingredients: Array.isArray(editingRecipe.ingredients)
        ? editingRecipe.ingredients
        : typeof editingRecipe.ingredients === "string"
        ? (editingRecipe.ingredients as string).split("\n").filter(Boolean)
        : [],
      instructions: Array.isArray(editingRecipe.instructions)
        ? editingRecipe.instructions
        : typeof editingRecipe.instructions === "string"
        ? (editingRecipe.instructions as string).split("\n").filter(Boolean)
        : [],
      tags: Array.isArray(editingRecipe.tags)
        ? editingRecipe.tags
        : typeof editingRecipe.tags === "string"
        ? (editingRecipe.tags as string).split(",").map(t => t.trim()).filter(Boolean)
        : [],
      rating: editingRecipe.rating || 4.5,
      featured: editingRecipe.featured ?? false,
      highProtein: editingRecipe.highProtein ?? (Number(editingRecipe.protein) >= 20),
      budget: editingRecipe.budget ?? false,
      faq: editingRecipe.faq || [
        { question: "Is this gluten-free?", answer: "Yes, provided certified ingredients are used." }
      ]
    };

    let nextRecipes: Recipe[];
    if (editorMode === "create") {
      nextRecipes = [...allRecipes, fullRecipe];
    } else {
      nextRecipes = allRecipes.map(r => r.id === fullRecipe.id ? fullRecipe : r);
    }

    updateRecipes(nextRecipes);
    setRecipes(nextRecipes);
    setEditorMode("list");
    setEditingRecipe(null);
  };

  const deleteRecipeItem = (id: string) => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      const remaining = recipes.filter(r => r.id !== id);
      updateRecipes(remaining);
      setRecipes(remaining);
    }
  };

  const startCreateRecipe = () => {
    setEditingRecipe({
      title: "",
      category: "Lunch",
      difficulty: "Easy",
      prepTime: 15,
      cookTime: 15,
      servings: 4,
      calories: 400,
      protein: 20,
      carbs: 45,
      fat: 12,
      ingredients: ["1 block extra firm tofu", "1 cup brown rice", "2 cups sliced broccoli"],
      instructions: ["Prepare the rice details", "Steam the raw broccoli", "Pan sear the firm tofu"],
      tags: ["High Protein", "Rice", "Tofu"],
      image: mediaList[0],
      featured: false,
      highProtein: true,
      budget: true,
      faq: [{ question: "Can I freeze this?", answer: "Yes, freezes for up to 1 month." }]
    });
    setEditorMode("create");
  };

  const startEditRecipe = (r: Recipe) => {
    setEditingRecipe({ ...r });
    setEditorMode("edit");
  };

  // Blog CRUD operations
  const saveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle?.title || !editingArticle.category) return;

    const allArticles = getArticles();
    const cleanSlug = (editingArticle.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const fullArticle: Article = {
      id: editingArticle.id || "art-" + Date.now(),
      title: editingArticle.title,
      slug: editingArticle.slug || cleanSlug,
      excerpt: editingArticle.excerpt || "",
      content: editingArticle.content || "",
      image: editingArticle.image || mediaList[0],
      category: editingArticle.category,
      author: editingArticle.author || "SmartVeganPrep Kitchen Team",
      date: editingArticle.date || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      readTime: editingArticle.readTime || "5 min read",
      tags: Array.isArray(editingArticle.tags)
        ? editingArticle.tags
        : typeof editingArticle.tags === "string"
        ? (editingArticle.tags as string).split(",").map(t => t.trim()).filter(Boolean)
        : []
    };

    let nextArticles: Article[];
    if (editorMode === "create") {
      nextArticles = [...allArticles, fullArticle];
    } else {
      nextArticles = allArticles.map(a => a.id === fullArticle.id ? fullArticle : a);
    }

    updateArticles(nextArticles);
    setArticles(nextArticles);
    setEditorMode("list");
    setEditingArticle(null);
  };

  const deleteArticleItem = (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      const remaining = articles.filter(a => a.id !== id);
      updateArticles(remaining);
      setArticles(remaining);
    }
  };

  const startCreateArticle = () => {
    setEditingArticle({
      title: "",
      category: "Nutrition",
      excerpt: "A brief summary of this amazing informative plant-based article.",
      content: "Complete structured text paragraph discussing the nutritional facts and advantages of vegan whole foods.",
      author: "SmartVeganPrep Nutrition",
      tags: ["Vegan-Tips", "Health", "Prep"],
      image: mediaList[1]
    });
    setEditorMode("create");
  };

  const startEditArticle = (a: Article) => {
    setEditingArticle({ ...a });
    setEditorMode("edit");
  };

  // Meal Plan CRUD operations
  const saveMealPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan?.title) return;

    const allPlans = getMealPlans();
    const cleanSlug = (editingPlan.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const fullPlan: MealPlan = {
      id: editingPlan.id || "plan-" + Date.now(),
      title: editingPlan.title,
      slug: editingPlan.slug || cleanSlug,
      description: editingPlan.description || "",
      image: editingPlan.image || mediaList[0],
      durationWeeks: Number(editingPlan.durationWeeks) || 1,
      schedule: editingPlan.schedule || {
        Monday: { breakfast: "Oats", lunch: "Tofu wrap", dinner: "Lentil dal", snack: "Banana" },
        Tuesday: { breakfast: "Oats", lunch: "Tofu wrap", dinner: "Lentil dal", snack: "Banana" },
        Wednesday: { breakfast: "Oats", lunch: "Tofu wrap", dinner: "Lentil dal", snack: "Banana" },
        Thursday: { breakfast: "Oats", lunch: "Tofu wrap", dinner: "Lentil dal", snack: "Banana" },
        Friday: { breakfast: "Oats", lunch: "Tofu wrap", dinner: "Lentil dal", snack: "Banana" },
        Saturday: { breakfast: "Pancakes", lunch: "Salad wrap", dinner: "Chili", snack: "Apple" },
        Sunday: { breakfast: "Pancakes", lunch: "Salad wrap", dinner: "Chili", snack: "Apple" },
      },
      shoppingList: Array.isArray(editingPlan.shoppingList)
        ? editingPlan.shoppingList
        : typeof editingPlan.shoppingList === "string"
        ? (editingPlan.shoppingList as string).split("\n").filter(Boolean)
        : [],
      featured: editingPlan.featured ?? false
    };

    let nextPlans: MealPlan[];
    if (editorMode === "create") {
      nextPlans = [...allPlans, fullPlan];
    } else {
      nextPlans = allPlans.map(p => p.id === fullPlan.id ? fullPlan : p);
    }

    updateMealPlans(nextPlans);
    setPlans(nextPlans);
    setEditorMode("list");
    setEditingPlan(null);
  };

  const deleteMealPlanItem = (id: string) => {
    if (confirm("Are you sure you want to delete this meal plan?")) {
      const remaining = plans.filter(p => p.id !== id);
      updateMealPlans(remaining);
      setPlans(remaining);
    }
  };

  const startCreatePlan = () => {
    setEditingPlan({
      title: "",
      description: "A wonderful high energy meal plan curation.",
      durationWeeks: 1,
      schedule: {
        Monday: { breakfast: "Berry Chia Oats", lunch: "Tofu Quinoa Bowl", dinner: "Lentil Dal", snack: "Salted nuts" },
        Tuesday: { breakfast: "Berry Chia Oats", lunch: "Tofu Quinoa Bowl", dinner: "Lentil Dal", snack: "Salted nuts" },
        Wednesday: { breakfast: "Berry Chia Oats", lunch: "Tofu Quinoa Bowl", dinner: "Lentil Dal", snack: "Salted nuts" },
        Thursday: { breakfast: "Berry Chia Oats", lunch: "Tofu Quinoa Bowl", dinner: "Lentil Dal", snack: "Salted nuts" },
        Friday: { breakfast: "Berry Chia Oats", lunch: "Tofu Quinoa Bowl", dinner: "Lentil Dal", snack: "Salted nuts" },
        Saturday: { breakfast: "Tofu Scramble Map", lunch: "Peanut tempeh skillet", dinner: "Chickpea Curry", snack: "Fruit bowl" },
        Sunday: { breakfast: "Tofu Scramble Map", lunch: "Peanut tempeh skillet", dinner: "Chickpea Curry", snack: "Fruit bowl" },
      },
      shoppingList: ["Gluten-free oats", "Red lentils", "Chia seeds", "Fresh greens", "Soy Tempeh"],
      image: mediaList[2],
      featured: true
    });
    setEditorMode("create");
  };

  const startEditPlan = (p: MealPlan) => {
    setEditingPlan({ ...p });
    setEditorMode("edit");
  };

  // Safe helper for nested schedule modification
  const setMondayBreakfast = (day: string, type: "breakfast" | "lunch" | "dinner" | "snack", val: string) => {
    if (!editingPlan) return;
    const currentSchedule = { ...editingPlan.schedule };
    if (!currentSchedule[day]) {
      currentSchedule[day] = { breakfast: "", lunch: "", dinner: "", snack: "" };
    }
    currentSchedule[day][type] = val;
    setEditingPlan({
      ...editingPlan,
      schedule: currentSchedule
    });
  };

  // Subscribers Management
  const revokeSubscriber = (id: string) => {
    const updated = subs.map(s => s.id === id ? { ...s, active: !s.active } : s);
    updateSubscribers(updated);
    setSubs(updated);
  };

  const deleteSubscriber = (id: string) => {
    if (confirm("Delete subscriber?")) {
      const remaining = subs.filter(s => s.id !== id);
      updateSubscribers(remaining);
      setSubs(remaining);
    }
  };

  const exportSubscribersAsCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Email", "EnrolledAt", "Status"].join(",") + "\n"
      + subs.map(s => `"${s.email}","${s.enrolledAt}","${s.active ? 'Active' : 'Unsubscribed'}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smartveganprep_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Settings modification
  const saveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    updateSettings(settings);
    alert("Site & SEO settings synchronized successfully!");
  };

  // Custom media presets trigger
  const addImageToLibrary = () => {
    if (customImageUrl.trim() && customImageUrl.includes("http")) {
      setMediaList([customImageUrl.trim(), ...mediaList]);
      setCustomImageUrl("");
    } else {
      alert("Please provide a valid image HTTP url");
    }
  };

  // Render Login state first
  if (!isAuthenticated) {
    return (
      <main className="max-w-md mx-auto my-24 p-8 border border-zinc-200 bg-white" id="admin-login-screen">
        <div className="flex flex-col items-center gap-3 mb-8 text-center">
          <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="font-sans font-bold text-2xl tracking-tight text-zinc-900">Partner Console Login</h1>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
            Authenticate to update weekly meal preps, schedule blog columns, or view client subscribers list.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 tracking-wider uppercase mb-1.5">
              Username or Registered Email
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full px-3 py-2.5 bg-white border border-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-700 font-medium text-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 tracking-wider uppercase mb-1.5">
              Authorized Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-white border border-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-700 font-medium text-zinc-900"
            />
          </div>

          {authError && (
            <p className="text-xs font-semibold text-amber-700 bg-amber-50 p-3" id="login-error">
              {authError}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold font-sans tracking-wide uppercase transition-colors"
          >
            Access Dashboard
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
          <p className="text-[10px] text-zinc-400 font-mono">
            Demo Credentials &middot; User: <span className="text-zinc-600">admin</span> / Pass: <span className="text-zinc-600">admin</span>
          </p>
        </div>
      </main>
    );
  }

  // Authentic Admin Dashboard Screen
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" id="admin-workbench">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-8 border-b border-zinc-200 gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            Authorized Agent Control
          </span>
          <h1 className="font-sans font-bold text-3xl tracking-tight text-zinc-900 mt-1">
            SmartVeganPrep Hub
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 border border-zinc-200 px-3 py-1.5 hover:bg-zinc-50 transition-colors font-medium self-start sm:self-center"
        >
          <LogOut className="h-4.5 w-4.5 text-zinc-400" />
          Disconnect
        </button>
      </div>

      {/* Main Grid Wrapper split into tabs sidebar + sub-tab panel workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* Navigation panel */}
        <aside className="lg:col-span-1 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 border-b lg:border-b-0 lg:border-r border-zinc-150 pr-0 lg:pr-5">
          <button
            onClick={() => { setActiveTab("dash"); setEditorMode("list"); }}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
              activeTab === "dash" ? "text-emerald-800 bg-emerald-50/50" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <LayoutDashboard className="h-4.5 w-4.5 shrink-0" />
            Overview
          </button>

          <button
            onClick={() => { setActiveTab("recipes"); setEditorMode("list"); }}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
              activeTab === "recipes" ? "text-emerald-800 bg-emerald-50/50" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <BookOpen className="h-4.5 w-4.5 shrink-0" />
            Recipes ({recipes.length})
          </button>

          <button
            onClick={() => { setActiveTab("plans"); setEditorMode("list"); }}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
              activeTab === "plans" ? "text-emerald-800 bg-emerald-50/50" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Calendar className="h-4.5 w-4.5 shrink-0" />
            Meal Plans ({plans.length})
          </button>

          <button
            onClick={() => { setActiveTab("blogs"); setEditorMode("list"); }}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
              activeTab === "blogs" ? "text-emerald-800 bg-emerald-50/50" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <BookOpen className="h-4.5 w-4.5 shrink-0" />
            Blogs ({articles.length})
          </button>

          <button
            onClick={() => { setActiveTab("subs"); setEditorMode("list"); }}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
              activeTab === "subs" ? "text-emerald-800 bg-emerald-50/50" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Mail className="h-4.5 w-4.5 shrink-0" />
            Subscribers ({subs.length})
          </button>

          <button
            onClick={() => { setActiveTab("messages"); setEditorMode("list"); }}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
              activeTab === "messages" ? "text-emerald-800 bg-emerald-50/50" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Mail className="h-4.5 w-4.5 shrink-0" />
            Contact Log ({messages.length})
          </button>

          <button
            onClick={() => { setActiveTab("settings"); setEditorMode("list"); }}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
              activeTab === "settings" ? "text-emerald-800 bg-emerald-50/50" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Settings className="h-4.5 w-4.5 shrink-0" />
            Site Settings
          </button>
        </aside>

        {/* Workspace panel */}
        <section className="lg:col-span-4" id="admin-workspace-pane">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === "dash" && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="border border-zinc-200 p-6 bg-white shrink">
                  <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                    Total Prep Recipes
                  </h3>
                  <p className="font-sans font-bold text-4xl text-zinc-900 mt-2">
                    {recipes.length}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-medium mt-1">
                    {recipes.filter(r => r.highProtein).length} labeled High-Protein
                  </p>
                </div>

                <div className="border border-zinc-200 p-6 bg-white shrink">
                  <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                    Newsletter Subscribers
                  </h3>
                  <div className="flex justify-between items-baseline">
                    <p className="font-sans font-bold text-4xl text-zinc-900 mt-2">
                      {subs.filter(s => s.active).length}
                    </p>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-55 px-1.5 py-0.5 uppercase tracking-wide">
                      Live Reach
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-medium mt-1">
                    Active verification rates: 100%
                  </p>
                </div>

                <div className="border border-zinc-200 p-6 bg-white shrink">
                  <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                    Active Meal Plans
                  </h3>
                  <p className="font-sans font-bold text-4xl text-zinc-900 mt-2">
                    {plans.length}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-medium mt-1">
                     Comprehensive schedules
                  </p>
                </div>
              </div>

              {/* Activity / Presets Library */}
              <div className="border border-zinc-200 p-6 bg-white">
                <div className="flex justify-between items-center pb-4 border-b border-zinc-150 mb-4">
                  <h3 className="font-sans font-bold text-lg text-zinc-900 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-emerald-700" />
                    Interactive Media Asset Library
                  </h3>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                  Copy any of these optimized Unsplash CDN URLs into recipe or meal-plan images to update their main photography:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  {mediaList.map((url, index) => (
                    <div key={index} className="relative group border border-zinc-100 aspect-video">
                      <img src={url} alt="preset" className="h-full w-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-zinc-950/80 p-1 text-[8px] text-white flex justify-between items-center">
                        <span className="truncate max-w-[120px] font-mono">{url}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(url);
                            alert("Copied to clipboard!\n" + url);
                          }}
                          className="bg-zinc-800 hover:bg-zinc-700 px-1.5 py-0.5 uppercase tracking-wider font-semibold text-[8px]"
                        >
                          Copy URL
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Provide online Unsplash or Pexels JPG/PNG image url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="flex-1 bg-white border border-zinc-200 text-xs px-3 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                  <button
                    onClick={addImageToLibrary}
                    className="p-2 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
                  >
                    Add Image
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RECIPES CRUD */}
          {activeTab === "recipes" && (
            <div>
              {editorMode === "list" ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-zinc-150">
                    <h2 className="font-sans font-bold text-xl text-zinc-900">Manage Meal Recipes</h2>
                    <button
                      onClick={startCreateRecipe}
                      className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 uppercase tracking-wider transition-colors"
                    >
                      <Plus className="h-4 w-4" /> New Recipe
                    </button>
                  </div>

                  {recipes.length === 0 ? (
                    <p className="text-zinc-400 text-xs py-8 text-center italic border border-dashed border-zinc-200">
                      No recipes found. Click New Recipe above to add one.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-200 font-semibold text-zinc-700 uppercase tracking-wider bg-zinc-50">
                            <th className="py-2.5 px-3">Recipe Title</th>
                            <th className="py-2.5 px-3">Category</th>
                            <th className="py-2.5 px-3 text-center">Calories</th>
                            <th className="py-2.5 px-3 text-center">Protein</th>
                            <th className="py-2.5 px-3 text-center">Difficulty</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recipes.map((r) => (
                            <tr key={r.id} className="border-b border-zinc-150 hover:bg-zinc-50/50 font-medium">
                              <td className="py-3 px-3 text-zinc-900 font-semibold">{r.title}</td>
                              <td className="py-3 px-3 text-zinc-500">{r.category}</td>
                              <td className="py-3 px-3 text-center text-zinc-600">{r.calories} kcal</td>
                              <td className="py-3 px-3 text-center text-emerald-800">{r.protein}g</td>
                              <td className="py-3 px-3 text-center"><span className="px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[10px]">{r.difficulty}</span></td>
                              <td className="py-3 px-3 text-right space-x-2 shrink-0">
                                <button
                                  onClick={() => startEditRecipe(r)}
                                  className="text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-0.5"
                                >
                                  <Edit className="h-3 w-3" /> Edit
                                </button>
                                <button
                                  onClick={() => deleteRecipeItem(r.id)}
                                  className="text-amber-800 hover:text-amber-900 inline-flex items-center gap-0.5"
                                >
                                  <Trash2 className="h-3 w-3" /> Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                /* Recipe Edit/Create Form */
                <form onSubmit={saveRecipe} className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-zinc-150">
                    <h2 className="font-sans font-bold text-xl text-zinc-900 text-capitalize">
                      {editorMode === "create" ? "Create Plant-Based Recipe" : `Edit: ${editingRecipe?.title}`}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setEditorMode("list")}
                      className="text-xs text-zinc-500 hover:text-zinc-900 border border-zinc-200 px-2.5 py-1"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Recipe Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editingRecipe?.title || ""}
                        onChange={(e) => setEditingRecipe({ ...editingRecipe, title: e.target.value })}
                        placeholder="e.g. Creamy Tofu Skillet"
                        className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Category Block
                      </label>
                      <select
                        value={editingRecipe?.category || "Lunch"}
                        onChange={(e) => setEditingRecipe({ ...editingRecipe, category: e.target.value })}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-700"
                      >
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Snacks">Snacks & Sides</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Prep Time (minutes)
                      </label>
                      <input
                        type="number"
                        required
                        value={editingRecipe?.prepTime || ""}
                        onChange={(e) => setEditingRecipe({ ...editingRecipe, prepTime: Number(e.target.value) })}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Cook Time (minutes)
                      </label>
                      <input
                        type="number"
                        required
                        value={editingRecipe?.cookTime || ""}
                        onChange={(e) => setEditingRecipe({ ...editingRecipe, cookTime: Number(e.target.value) })}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Difficulty Metric
                      </label>
                      <select
                        value={editingRecipe?.difficulty || "Easy"}
                        onChange={(e) => setEditingRecipe({ ...editingRecipe, difficulty: e.target.value as any })}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-700"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Servings Yield
                      </label>
                      <input
                        type="number"
                        required
                        value={editingRecipe?.servings || ""}
                        onChange={(e) => setEditingRecipe({ ...editingRecipe, servings: Number(e.target.value) })}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Calories (kcal)
                      </label>
                      <input
                        type="number"
                        required
                        value={editingRecipe?.calories || ""}
                        onChange={(e) => setEditingRecipe({ ...editingRecipe, calories: Number(e.target.value) })}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Protein (grams)
                      </label>
                      <input
                        type="number"
                        required
                        value={editingRecipe?.protein || ""}
                        onChange={(e) => setEditingRecipe({ ...editingRecipe, protein: Number(e.target.value) })}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Carbohydrates (grams)
                      </label>
                      <input
                        type="number"
                        required
                        value={editingRecipe?.carbs || ""}
                        onChange={(e) => setEditingRecipe({ ...editingRecipe, carbs: Number(e.target.value) })}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Fat (grams)
                      </label>
                      <input
                        type="number"
                        required
                        value={editingRecipe?.fat || ""}
                        onChange={(e) => setEditingRecipe({ ...editingRecipe, fat: Number(e.target.value) })}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Card Image CDN URL
                      </label>
                      <input
                        type="url"
                        value={editingRecipe?.image || ""}
                        onChange={(e) => setEditingRecipe({ ...editingRecipe, image: e.target.value })}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                        placeholder="Provide URL (Check our presets in Overview tab!)"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Explanatory Short Description
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={editingRecipe?.description || ""}
                        onChange={(e) => setEditingRecipe({ ...editingRecipe, description: e.target.value })}
                        className="w-full bg-white border border-zinc-200 p-3 text-xs focus:ring-1 focus:ring-emerald-700"
                        placeholder="Write recipe summary..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Ingredients list (One per line)
                      </label>
                      <textarea
                        rows={6}
                        required
                        value={Array.isArray(editingRecipe?.ingredients) ? editingRecipe.ingredients.join("\n") : ""}
                        onChange={(e) => setEditingRecipe({ ...editingRecipe, ingredients: e.target.value.split("\n") })}
                        className="w-full bg-white border border-zinc-200 p-3 text-xs font-mono"
                        placeholder="1 cup of rinsed quinoa&#10;2 cups boiling water&#10;1 tbsp raw soy sauce"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Instructions Steps (One per line)
                      </label>
                      <textarea
                        rows={6}
                        required
                        value={Array.isArray(editingRecipe?.instructions) ? editingRecipe.instructions.join("\n") : ""}
                        onChange={(e) => setEditingRecipe({ ...editingRecipe, instructions: e.target.value.split("\n") })}
                        className="w-full bg-white border border-zinc-200 p-3 text-xs font-mono"
                        placeholder="Rinse the grains thoroughly&#10;Add to pan and boil for 15 minutes&#10;Let sit flat before serving"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Tags (separated by comma)
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(editingRecipe?.tags) ? editingRecipe.tags.join(", ") : ""}
                        onChange={(e) => setEditingRecipe({ ...editingRecipe, tags: e.target.value.split(",") })}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                        placeholder="High Protein, Budget-Friendly, Quick prep"
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center gap-6 py-2">
                      <label className="flex items-center gap-2 text-xs font-bold uppercase cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingRecipe?.featured || false}
                          onChange={(e) => setEditingRecipe({ ...editingRecipe, featured: e.target.checked })}
                          className="rounded border-zinc-300 text-emerald-700"
                        />
                        Featured Recipe on Home
                      </label>

                      <label className="flex items-center gap-2 text-xs font-bold uppercase cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingRecipe?.budget || false}
                          onChange={(e) => setEditingRecipe({ ...editingRecipe, budget: e.target.checked })}
                          className="rounded border-zinc-300 text-emerald-700"
                        />
                        Budget classification
                      </label>
                    </div>

                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" /> Save Vegan Recipe
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: MEAL PLANS CRUD */}
          {activeTab === "plans" && (
            <div>
              {editorMode === "list" ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-zinc-150">
                    <h2 className="font-sans font-bold text-xl text-zinc-900">Manage Meal Schedules</h2>
                    <button
                      onClick={startCreatePlan}
                      className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 uppercase tracking-wider transition-colors"
                    >
                      <Plus className="h-4 w-4" /> Create Meal Plan
                    </button>
                  </div>

                  {plans.length === 0 ? (
                    <p className="text-zinc-400 text-xs py-8 text-center italic border border-dashed border-zinc-200">
                      No Plans available. Click positive icon to draft one!
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {plans.map((p) => (
                        <div key={p.id} className="border border-zinc-200 p-5 bg-white space-y-3">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3 className="font-sans font-bold text-zinc-900 text-lg leading-tight">{p.title}</h3>
                              <p className="text-[10px] text-zinc-400 mt-1 uppercase font-mono tracking-wider">
                                Duration: {p.durationWeeks} Weeks &middot; {p.featured ? "Featured" : "Regular"}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditPlan(p)}
                                className="text-zinc-500 hover:text-emerald-800 p-1 border border-zinc-200"
                                title="Edit Schedule"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteMealPlanItem(p.id)}
                                className="text-zinc-500 hover:text-amber-800 p-1 border border-zinc-200"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-zinc-500 leading-normal line-clamp-2">{p.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Meal Plan Edit/Create Form (Monday-Sunday schedules) */
                <form onSubmit={saveMealPlan} className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-zinc-150">
                    <h2 className="font-sans font-bold text-xl text-zinc-900">
                      {editorMode === "create" ? "Draft New Curation Plan" : `Edit: ${editingPlan?.title}`}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setEditorMode("list")}
                      className="text-xs text-zinc-500 hover:text-zinc-900 border border-zinc-200 px-2.5 py-1"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Meal Plan Title Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editingPlan?.title || ""}
                        onChange={(e) => setEditingPlan({ ...editingPlan, title: e.target.value })}
                        placeholder="e.g. Budget Friendly Kickstart Plan"
                        className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Timeline (Weeks)
                      </label>
                      <input
                        type="number"
                        required
                        value={editingPlan?.durationWeeks || ""}
                        onChange={(e) => setEditingPlan({ ...editingPlan, durationWeeks: Number(e.target.value) })}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Plan Image Header
                      </label>
                      <input
                        type="text"
                        value={editingPlan?.image || ""}
                        onChange={(e) => setEditingPlan({ ...editingPlan, image: e.target.value })}
                        placeholder="e.g. https://images.unsplash.com/..."
                        className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        General Description
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={editingPlan?.description || ""}
                        onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                        className="w-full bg-white border border-zinc-200 p-3 text-xs"
                      />
                    </div>

                    {/* DYNAMIC EVERYDAY EDIT MODULE */}
                    <div className="md:col-span-2 border-t border-zinc-200 pt-5">
                      <h3 className="font-sans font-bold text-md text-zinc-900 mb-3 uppercase tracking-wider text-xs">
                        Step-by-Step Weekly Meal Board
                      </h3>
                      <p className="text-[11px] text-zinc-400 mb-4">
                        Please indicate the daily menu titles for each specific meal:
                      </p>

                      <div className="space-y-4">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                          const dayMeals = editingPlan?.schedule?.[day] || { breakfast: "", lunch: "", dinner: "", snack: "" };
                          return (
                            <div key={day} className="p-4 bg-zinc-50 border border-zinc-150 grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
                              <span className="font-sans font-bold text-xs text-zinc-900">{day}</span>
                              <input
                                type="text"
                                value={dayMeals.breakfast}
                                onChange={(e) => setMondayBreakfast(day, "breakfast", e.target.value)}
                                placeholder="Breakfast"
                                className="bg-white border border-zinc-250 text-[11px] p-1 px-2 focus:ring-1 focus:ring-emerald-700 font-sans"
                              />
                              <input
                                type="text"
                                value={dayMeals.lunch}
                                onChange={(e) => setMondayBreakfast(day, "lunch", e.target.value)}
                                placeholder="Lunch"
                                className="bg-white border border-zinc-250 text-[11px] p-1 px-2 focus:ring-1 focus:ring-emerald-700 font-sans"
                              />
                              <input
                                type="text"
                                value={dayMeals.dinner}
                                onChange={(e) => setMondayBreakfast(day, "dinner", e.target.value)}
                                placeholder="Dinner"
                                className="bg-white border border-zinc-250 text-[11px] p-1 px-2 focus:ring-1 focus:ring-emerald-700 font-sans"
                              />
                              <input
                                type="text"
                                value={dayMeals.snack}
                                onChange={(e) => setMondayBreakfast(day, "snack", e.target.value)}
                                placeholder="Snack"
                                className="bg-white border border-zinc-250 text-[11px] p-1 px-2 focus:ring-1 focus:ring-emerald-700 font-sans"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Consolidated Grocery List (one item per line)
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={Array.isArray(editingPlan?.shoppingList) ? editingPlan.shoppingList.join("\n") : ""}
                        onChange={(e) => setEditingPlan({ ...editingPlan, shoppingList: e.target.value.split("\n") })}
                        className="w-full bg-white border border-zinc-200 p-3 text-xs font-mono"
                        placeholder="Gluten Free Oats&#10;Sweet Potatoes&#10;Soy milk"
                      />
                    </div>

                    <div className="md:col-span-2 py-1">
                      <label className="flex items-center gap-2 text-xs font-bold uppercase cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingPlan?.featured || false}
                          onChange={(e) => setEditingPlan({ ...editingPlan, featured: e.target.checked })}
                          className="rounded border-zinc-300 text-emerald-700"
                        />
                        Featured Meal Plan Highlight
                      </label>
                    </div>

                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" /> Synchronize Meal Plan
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: BLOG ACTIONS */}
          {activeTab === "blogs" && (
            <div>
              {editorMode === "list" ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-zinc-150">
                    <h2 className="font-sans font-bold text-xl text-zinc-900">Manage Blog Columns</h2>
                    <button
                      onClick={startCreateArticle}
                      className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 uppercase tracking-wider transition-colors"
                    >
                      <Plus className="h-4 w-4" /> Draft Column
                    </button>
                  </div>

                  {articles.length === 0 ? (
                    <p className="text-zinc-400 text-xs py-8 text-center italic border border-dashed border-zinc-200">
                      Empty blog queue.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {articles.map((a) => (
                        <div key={a.id} className="border border-zinc-200 p-4 bg-white flex justify-between items-center text-xs">
                          <div>
                            <h3 className="font-sans font-bold text-zinc-950 text-sm leading-tight">{a.title}</h3>
                            <p className="text-[10px] text-zinc-400 mt-0.5">
                              {a.category} &middot; By {a.author} &middot; {a.date}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditArticle(a)}
                              className="text-emerald-700 hover:text-emerald-900 p-1 border border-zinc-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteArticleItem(a.id)}
                              className="text-amber-800 hover:text-amber-900 p-1 border border-zinc-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Edit Blog Form */
                <form onSubmit={saveArticle} className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-zinc-150">
                    <h2 className="font-sans font-bold text-xl text-zinc-900">
                      {editorMode === "create" ? "Create Article Column" : `Edit Article`}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setEditorMode("list")}
                      className="text-xs text-zinc-500"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Article Title
                      </label>
                      <input
                        type="text"
                        required
                        value={editingArticle?.title || ""}
                        onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Category Option
                      </label>
                      <select
                        value={editingArticle?.category || "Nutrition"}
                        onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                      >
                        <option value="Nutrition">Nutrition</option>
                        <option value="Meal Prep Advice">Meal Prep Advice</option>
                        <option value="Ingredient Spotlights">Ingredient Spotlights</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Author Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editingArticle?.author || ""}
                        onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Read Time Estimate (e.g. 5 min read)
                      </label>
                      <input
                        type="text"
                        required
                        value={editingArticle?.readTime || ""}
                        onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Main Image CDN URL
                      </label>
                      <input
                        type="text"
                        value={editingArticle?.image || ""}
                        onChange={(e) => setEditingArticle({ ...editingArticle, image: e.target.value })}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Short Excerpt / Preview Summary
                      </label>
                      <input
                        type="text"
                        required
                        value={editingArticle?.excerpt || ""}
                        onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                        Article Body Content Paragraphs
                      </label>
                      <textarea
                        rows={10}
                        required
                        value={editingArticle?.content || ""}
                        onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                        className="w-full bg-white border border-zinc-200 p-3 text-xs leading-relaxed font-sans"
                        placeholder="Write article details here..."
                      />
                    </div>

                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                  >
                    <Save className="h-4 w-4" /> Save Article
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 5: SUBSCRIBERS */}
          {activeTab === "subs" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-4 border-b border-zinc-150 gap-2">
                <div>
                  <h2 className="font-sans font-bold text-xl text-zinc-900">Newsletter subscribers ({subs.length})</h2>
                  <p className="text-[10px] text-zinc-400 mt-1">Management and export logs for system administrators.</p>
                </div>
                <button
                  onClick={exportSubscribersAsCSV}
                  className="flex items-center gap-1.5 self-start sm:self-center bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-3 py-1.5 uppercase tracking-wider transition-colors"
                >
                  <FileSpreadsheet className="h-4 w-4" /> Export CSV List
                </button>
              </div>

              {subs.length === 0 ? (
                <p className="text-zinc-400 text-xs py-8 text-center italic border border-dashed border-zinc-200">
                  Empty Subscriber list.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-200 font-semibold text-zinc-700 bg-zinc-50 uppercase tracking-widest text-[9px]">
                        <th className="py-2 px-3">Subscriber Email</th>
                        <th className="py-2 px-3">Registration Date</th>
                        <th className="py-2 px-3 text-center">Status Badge</th>
                        <th className="py-2 px-3 text-right">Settings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subs.map((s) => (
                        <tr key={s.id} className="border-b border-zinc-150 hover:bg-zinc-55">
                          <td className="py-3 px-3 text-zinc-900 font-semibold">{s.email}</td>
                          <td className="py-3 px-3 text-zinc-500 font-mono text-[10px]">{new Date(s.enrolledAt).toLocaleString()}</td>
                          <td className="py-3 px-3 text-center">
                            <span className={`px-2 py-0.5 font-bold rounded-full text-[9px] uppercase tracking-wider ${
                              s.active ? "bg-emerald-50 text-emerald-800" : "bg-zinc-100 text-zinc-400"
                            }`}>
                              {s.active ? "Enrolled" : "Opted Out"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right space-x-2">
                            <button
                              onClick={() => revokeSubscriber(s.id)}
                              className="text-xs text-zinc-500 hover:text-zinc-950 font-medium"
                            >
                              Toggle Opt-State
                            </button>
                            <button
                              onClick={() => deleteSubscriber(s.id)}
                              className="text-xs text-amber-800 hover:text-amber-950 font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: CONTACT INBOX MESSAGES */}
          {activeTab === "messages" && (
            <div className="space-y-4">
              <div className="pb-4 border-b border-zinc-150">
                <h2 className="font-sans font-bold text-xl text-zinc-900">Interactive Support logs ({messages.length})</h2>
                <p className="text-[10px] text-zinc-400 mt-1">Direct feedback queries from prospective clients.</p>
              </div>

              {messages.length === 0 ? (
                <div className="text-center p-8 border border-dashed border-zinc-200 text-zinc-400 italic">
                  No contact messages received yet. Submit a query via Client Help contact form to see it display instantly!
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((m) => (
                    <div key={m.id} className="border border-zinc-200 bg-white p-5 space-y-2">
                      <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                        <div>
                          <h4 className="font-sans font-bold text-sm text-zinc-900 uppercase tracking-wide">{m.subject || "No Subject"}</h4>
                          <p className="text-[10px] text-zinc-450 mt-1">
                            From: <strong className="text-zinc-700">{m.name}</strong> ({m.email}) &middot; Received {new Date(m.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm("Delete feedback message?")) {
                              const remaining = messages.filter(item => item.id !== m.id);
                              updateContactMessages(remaining);
                              setMessages(remaining);
                            }
                          }}
                          className="text-[10px] text-amber-800 hover:text-amber-950 px-2 py-1 border border-zinc-200"
                        >
                          Delete Message
                        </button>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed font-sans">{m.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SITE SETTINGS */}
          {activeTab === "settings" && settings && (
            <form onSubmit={saveSiteSettings} className="space-y-6">
              <div className="pb-4 border-b border-zinc-150">
                <h2 className="font-sans font-bold text-xl text-zinc-900">Synchronize Core Platform Configuration</h2>
                <p className="text-[10px] text-zinc-400 mt-1">Configure site headlines, emails, SEO meta tags, and headers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                    Platform Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                    Official Support Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                    Catchy Brand Tagline Banner
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                  />
                </div>

                <div className="md:col-span-2 border-t border-zinc-200 pt-4">
                  <h3 className="font-sans font-bold text-sm text-zinc-900 mb-3 flex items-center gap-1.5 uppercase text-xs">
                    <Globe className="h-4 w-4" /> SEO Settings (Meta Search Optimization)
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                    SEO Headline Title Tag
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.seoTitle}
                    onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                    className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                    SEO Meta Description Text
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.seoDescription}
                    onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                    className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                  />
                </div>

                <div className="md:col-span-2 border-t border-zinc-200 pt-4">
                  <h3 className="font-sans font-bold text-sm text-zinc-900 mb-3 uppercase text-xs">
                    Sunday Weekly Newsletter Callout Settings
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                    Newsletter Prompt header
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.newsletterHeadline}
                    onChange={(e) => setSettings({ ...settings, newsletterHeadline: e.target.value })}
                    className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-zinc-650 mb-1">
                    Newsletter Description / Offer Block
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.newsletterDescription}
                    onChange={(e) => setSettings({ ...settings, newsletterDescription: e.target.value })}
                    className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs"
                  />
                </div>

              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" /> Save Configuration Settings
              </button>
            </form>
          )}

        </section>

      </div>

    </div>
  );
}
