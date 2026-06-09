import React from "react";
import { Clock, Dumbbell, DollarSign, Star, ArrowRight } from "lucide-react";
import { Recipe } from "../types";

interface RecipeCardProps {
  key?: string | number;
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

export default function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  return (
    <div 
      className="group bg-white border border-zinc-100 flex flex-col justify-between overflow-hidden cursor-pointer hover:border-zinc-300 transition-all duration-200"
      onClick={() => onSelect(recipe)}
      id={`recipe-card-${recipe.id}`}
    >
      <div>
        {/* Aspect ratio container */}
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
          <img
            src={recipe.image}
            alt={recipe.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Category overlay */}
          <div className="absolute top-3 left-3 bg-white px-2 py-0.5 text-[10px] uppercase tracking-wide font-semibold text-zinc-900 border border-zinc-105">
            {recipe.category}
          </div>

          {/* Featured tags */}
          <div className="absolute bottom-3 right-3 flex gap-1.5 flex-wrap justify-end">
            {recipe.highProtein && (
              <span className="bg-emerald-900 text-white text-[9px] px-2 py-0.5 font-medium flex items-center gap-0.5 tracking-wider uppercase">
                <Dumbbell className="h-2.5 w-2.5" /> Protein
              </span>
            )}
            {recipe.budget && (
              <span className="bg-zinc-900 text-white text-[9px] px-2 py-0.5 font-medium flex items-center gap-0.5 tracking-wider uppercase">
                <DollarSign className="h-2.5 w-2.5" /> Budget
              </span>
            )}
          </div>
        </div>

        {/* Details and metrics */}
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {recipe.prepTime + recipe.cookTime} mins
            </span>
            <span>&middot;</span>
            <span className="font-sans font-medium text-emerald-800">
              {recipe.calories} kcal
            </span>
            <span>&middot;</span>
            <span className="flex items-center gap-0.5 text-amber-500 font-medium">
              <Star className="h-3 w-3 fill-amber-500" />
              {recipe.rating.toFixed(1)}
            </span>
          </div>

          <h3 className="font-sans font-bold text-zinc-900 tracking-tight text-lg mb-2 group-hover:text-emerald-800 transition-colors line-clamp-1">
            {recipe.title}
          </h3>

          <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">
            {recipe.description}
          </p>
        </div>
      </div>

      {/* Footer Info / Macros */}
      <div className="px-5 pb-5 pt-2 border-t border-zinc-50 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
        <div className="flex gap-2.5">
          <span>P: <strong className="text-zinc-700 font-sans">{recipe.protein}g</strong></span>
          <span>C: <strong className="text-zinc-700 font-sans">{recipe.carbs}g</strong></span>
          <span>F: <strong className="text-zinc-700 font-sans">{recipe.fat}g</strong></span>
        </div>
        <div className="text-emerald-700 font-semibold group-hover:translate-x-1.5 transition-transform flex items-center gap-0.5">
          View Prep <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}
