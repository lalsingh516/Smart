import React, { useState, useEffect } from "react";
import { Menu, X, Leaf, ShieldAlert, Mail } from "lucide-react";
import { getSettings } from "../data/store";
import { SiteSettings } from "../types";

interface NavigationProps {
  currentRoute: string; // e.g. "home", "recipes", "meal-plans", "blog", "about", "contact", "admin"
  onNavigate: (route: string) => void;
}

export default function Navigation({ currentRoute, onNavigate }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(getSettings());

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(getSettings());
    };
    window.addEventListener("svp_data_updated", handleUpdate);
    return () => window.removeEventListener("svp_data_updated", handleUpdate);
  }, []);

  const navItems = [
    { label: "Home", route: "home" },
    { label: "Recipes", route: "recipes" },
    { label: "High Protein", route: "high-protein" },
    { label: "Budget Meals", route: "budget" },
    { label: "Meal Plans", route: "meal-plans" },
    { label: "Blog", route: "blog" },
    { label: "About", route: "about" },
    { label: "Contact", route: "contact" },
  ];

  const handleItemClick = (route: string) => {
    onNavigate(route);
    setMobileOpen(false);
  };

  const activeClass = "text-emerald-700 font-medium border-b-2 border-emerald-700 py-1";
  const inactiveClass = "text-zinc-600 hover:text-zinc-900 py-1 transition-colors";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            onClick={() => handleItemClick("home")}
            className="flex items-center gap-2 cursor-pointer select-none"
            id="nav-logo"
          >
            <Leaf className="h-6 w-6 text-emerald-700" />
            <span className="font-sans font-bold tracking-tight text-xl text-zinc-900">
              {settings.siteName}
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm" id="desktop-nav">
            {navItems.map((item) => (
              <button
                key={item.route}
                onClick={() => handleItemClick(item.route)}
                id={`nav-item-${item.route}`}
                className={currentRoute === item.route ? activeClass : inactiveClass}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Button & Admin */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleItemClick("newsletter")}
              id="nav-newsletter"
              className="px-3 py-1.5 border border-zinc-200 text-xs text-zinc-700 font-medium hover:bg-zinc-50 transition-colors"
            >
              Newsletter
            </button>
            <button
              onClick={() => handleItemClick("admin")}
              id="nav-admin"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-xs text-white hover:bg-zinc-800 transition-colors"
            >
              <ShieldAlert className="h-3 w-3" />
              Admin Portal
            </button>
          </div>

          {/* Mobile Hamburguer */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => handleItemClick("admin")}
              className="p-1 text-zinc-600 hover:text-zinc-900"
              title="Admin Portal"
            >
              <ShieldAlert className="h-5 w-5" />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              id="mobile-menu-toggle"
              className="p-1 text-zinc-600 hover:text-zinc-900"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white" id="mobile-nav-panel">
          <div className="px-4 pt-2 pb-6 space-y-3 flex flex-col text-sm">
            {navItems.map((item) => (
              <button
                key={item.route}
                onClick={() => handleItemClick(item.route)}
                className={`text-left py-2 font-medium ${
                  currentRoute === item.route ? "text-emerald-700" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 border-t border-zinc-100 flex flex-col gap-2">
              <button
                onClick={() => handleItemClick("newsletter")}
                className="w-full text-center px-4 py-2 border border-zinc-200 text-xs text-zinc-700 font-medium hover:bg-zinc-50 transition-colors"
              >
                Newsletter
              </button>
              <button
                onClick={() => handleItemClick("admin")}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-zinc-900 text-xs text-white hover:bg-zinc-800 transition-colors"
              >
                <ShieldAlert className="h-3 w-3" />
                Admin Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
