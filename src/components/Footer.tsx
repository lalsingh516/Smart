import React, { useState, useEffect } from "react";
import { Leaf, Mail, Shield } from "lucide-react";
import { getSettings, addSubscriber } from "../data/store";
import { SiteSettings } from "../types";

interface FooterProps {
  onNavigate: (route: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [settings, setSettings] = useState<SiteSettings>(getSettings());
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: ""
  });

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(getSettings());
    };
    window.addEventListener("svp_data_updated", handleUpdate);
    return () => window.removeEventListener("svp_data_updated", handleUpdate);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const result = addSubscriber(email);
    if (result.success) {
      setStatus({ type: "success", message: result.message });
      setEmail("");
    } else {
      setStatus({ type: "error", message: result.message });
    }
  };

  return (
    <footer className="bg-zinc-50 border-t border-zinc-100 text-zinc-600 text-sm mt-auto" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Logo & Info */}
          <div className="flex flex-col gap-3">
            <div 
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 cursor-pointer select-none text-zinc-900"
            >
              <Leaf className="h-5 w-5 text-emerald-700" />
              <span className="font-sans font-bold tracking-tight text-lg">
                {settings.siteName}
              </span>
            </div>
            <p className="text-zinc-500 leading-relaxed text-xs">
              {settings.tagline} Empowering your healthy plant-based lifestyle with structured meal preparations and expert guidance.
            </p>
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs mt-3">
              <Mail className="h-3.5 w-3.5 text-zinc-400" />
              <span>{settings.contactEmail}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans font-semibold text-zinc-900 mb-4 text-xs tracking-wider uppercase">
              Explore Recipes
            </h4>
            <ul className="space-y-2.5 text-xs flex flex-col items-start">
              <li>
                <button onClick={() => onNavigate("recipes")} className="hover:text-zinc-900 transition-colors">
                  All Plant-Based Recipes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("high-protein")} className="hover:text-zinc-900 transition-colors">
                  ⚡ High Protein Selection
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("budget")} className="hover:text-zinc-900 transition-colors">
                  💰 Budget Meals ($4/Day)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("meal-plans")} className="hover:text-zinc-900 transition-colors">
                  Weekly Meal Schedules
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-sans font-semibold text-zinc-900 mb-4 text-xs tracking-wider uppercase">
              Platform Info
            </h4>
            <ul className="space-y-2.5 text-xs flex flex-col items-start">
              <li>
                <button onClick={() => onNavigate("about")} className="hover:text-zinc-900 transition-colors">
                  Our Mission & About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("blog")} className="hover:text-zinc-900 transition-colors">
                  Expert Vegan Blog Articles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("contact")} className="hover:text-zinc-900 transition-colors">
                  Contact Support Help
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("privacy")} className="hover:text-zinc-900 transition-colors flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("terms")} className="hover:text-zinc-900 transition-colors">
                  Terms of Use agreement
                </button>
              </li>
            </ul>
          </div>

          {/* Mini Newsletter Subscribe */}
          <div>
            <h4 className="font-sans font-semibold text-zinc-900 mb-4 text-xs tracking-wider uppercase">
              Weekly Newsletter
            </h4>
            <p className="text-zinc-500 text-xs mb-3 leading-relaxed">
              Join active subscribers receiving structured meal guides every Sunday morning. No spam.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2" id="footer-newsletter-form">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Your primary email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border border-zinc-200 text-xs px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 w-full"
                />
                <button
                  type="submit"
                  className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs px-3 py-2 font-medium transition-colors"
                >
                  Join
                </button>
              </div>
              {status.type !== "idle" && (
                <p className={`text-xs ${status.type === "success" ? "text-emerald-700" : "text-amber-700"}`}>
                  {status.message}
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-zinc-200 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-zinc-400 text-xs">
          <span>&copy; {new Date().getFullYear()} SmartVeganPrep Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <button onClick={() => onNavigate("privacy")} className="hover:text-zinc-600 transition-colors">
              Privacy Settings
            </button>
            <span>&middot;</span>
            <button onClick={() => onNavigate("terms")} className="hover:text-zinc-600 transition-colors">
              User Agreement
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
