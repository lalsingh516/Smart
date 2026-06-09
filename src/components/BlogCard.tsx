import React from "react";
import { User, Calendar, Clock, ArrowRight } from "lucide-react";
import { Article } from "../types";

interface BlogCardProps {
  key?: string | number;
  article: Article;
  onSelect: (article: Article) => void;
}

export default function BlogCard({ article, onSelect }: BlogCardProps) {
  return (
    <article 
      className="group bg-white border border-zinc-100 flex flex-col md:flex-row gap-6 p-5 cursor-pointer hover:border-zinc-300 transition-all duration-200"
      onClick={() => onSelect(article)}
      id={`blog-card-${article.id}`}
    >
      {/* Article Image */}
      <div className="w-full md:w-1/3 aspect-video md:aspect-square overflow-hidden bg-zinc-50 shrink-0">
        <img
          src={article.image}
          alt={article.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
        />
      </div>

      {/* Content wrapper */}
      <div className="flex flex-col justify-between flex-1 py-1">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-zinc-400 mb-2">
            <span className="bg-emerald-50 text-emerald-800 font-sans font-medium px-2 py-0.5 text-[10px] uppercase tracking-wide">
              {article.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {article.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readTime}
            </span>
          </div>

          <h3 className="font-sans font-bold text-zinc-900 tracking-tight text-xl mb-3 group-hover:text-emerald-800 transition-colors">
            {article.title}
          </h3>

          <p className="text-zinc-650 text-xs leading-relaxed line-clamp-3 mb-4">
            {article.excerpt}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-auto pt-3 border-t border-zinc-50">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <div className="h-6 w-6 rounded-full bg-zinc-150 flex items-center justify-center text-[10px] font-bold text-zinc-700 font-mono">
              {article.author.split(" ").slice(-1)[0][0]}
            </div>
            <span>By {article.author}</span>
          </div>

          <span className="text-emerald-700 text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
            Read Article <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
