import { useState } from 'react';
import { Recipe } from '../types';
import { X, Timer, Flame, Award, Users, BookOpen, Check, RefreshCw } from 'lucide-react';

interface RecipeDetailModalProps {
  recipe: Recipe;
  onClose: () => void;
}

// Helper to scale portion quantities dynamically
function scaleQuantity(amountStr: string, current: number, original: number): string {
  if (!amountStr || amountStr.toLowerCase() === 'за смаком') return amountStr;

  // Handles decimals and simple integers (e.g., "1.5", "200", "0.5")
  const match = amountStr.match(/^([0-9.,]+)(\s*\w*.*)$/);
  if (!match) return amountStr;

  const numPart = match[1].replace(',', '.');
  const suffix = match[2];
  const value = parseFloat(numPart);

  if (isNaN(value)) return amountStr;

  const scaled = (value * current) / original;
  // Format beautifully: if it's integer don't show decimals, if floating show up to 1 decimal place
  const formattedScaled = Number.isInteger(scaled) ? scaled.toString() : scaled.toFixed(1);

  return `${formattedScaled}${suffix}`;
}

export function RecipeDetailModal({ recipe, onClose }: RecipeDetailModalProps) {
  const [servings, setServings] = useState<number>(recipe.servings);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const handleToggleStep = (index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleResetProgress = () => {
    setCompletedSteps({});
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Dark premium backdrop filter */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="relative transform rounded-3xl bg-white text-left shadow-2xl transition-all duration-300 w-full max-w-5xl border border-stone-200 flex flex-col md:flex-row h-auto max-h-[90vh] overflow-y-auto md:h-[85vh] md:max-h-[85vh] md:overflow-hidden animate-fade-in">
          
          {/* Close trigger button */}
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-luxury-black/75 hover:bg-gold-600 text-white transition-all shadow-md"
            aria-label="Зачинити"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT: Aesthetic Photo Column & Chef Tip */}
          <div className="w-full md:w-5/12 relative bg-stone-950 flex flex-col justify-end min-h-[320px] md:h-full md:overflow-y-auto text-white border-b md:border-b-0 md:border-r border-stone-200">
            {/* Background Image wrapper */}
            <div className="absolute inset-0">
              <img
                src={recipe.imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=700'}
                alt={recipe.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-black/30" />
            </div>

            {/* Quick specifications overlaid metrics */}
            <div className="relative p-6 z-10 space-y-4">
              <span className="inline-block px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest text-white bg-gold-600 rounded">
                {recipe.category}
              </span>

              <h2 className="text-3xl font-serif font-semibold tracking-tight text-white leading-tight">
                {recipe.title}
              </h2>

              <p className="text-sm font-sans text-stone-300 leading-relaxed font-light">
                {recipe.description}
              </p>

              <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-center">
                <div className="bg-white/5 border border-white/5 p-2 rounded-xl">
                  <span className="block text-[10px] uppercase font-sans tracking-wider text-stone-400">Час підготовки</span>
                  <span className="text-sm font-serif font-bold text-gold-100 flex items-center justify-center gap-1 mt-0.5">
                    <Timer className="w-3.5 h-3.5 text-gold-500" />
                    {recipe.prepTime} хв
                  </span>
                </div>
                <div className="bg-white/5 border border-white/5 p-2 rounded-xl">
                  <span className="block text-[10px] uppercase font-sans tracking-wider text-stone-400">Власне готування</span>
                  <span className="text-sm font-serif font-bold text-gold-100 flex items-center justify-center gap-1 mt-0.5">
                    <BookOpen className="w-3.5 h-3.5 text-gold-500" />
                    {recipe.cookTime}  хв
                  </span>
                </div>
                <div className="bg-white/5 border border-white/5 p-2 rounded-xl">
                  <span className="block text-[10px] uppercase font-sans tracking-wider text-stone-400">Калорійність</span>
                  <span className="text-sm font-serif font-bold text-gold-100 flex items-center justify-center gap-1 mt-0.5">
                    <Flame className="w-3.5 h-3.5 text-gold-500" />
                    {recipe.calories} ккал
                  </span>
                </div>
              </div>

              {/* Chef professional tips container */}
              {recipe.chefTip && (
                <div className="bg-gold-500/10 border border-gold-500/30 p-4 rounded-2xl space-y-1.5 backdrop-blur-sm">
                  <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-gold-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    Порада шефа
                  </h4>
                  <p className="text-xs text-stone-200 font-serif italic leading-relaxed">
                    « {recipe.chefTip} »
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Detailed recipe instructions & Dynamic portional scales */}
          <div className="w-full md:w-7/12 flex flex-col h-auto md:h-full bg-slate-50 md:overflow-y-auto p-6 md:p-8 space-y-6">
            
            {/* INGREDIENTS segment */}
            <div className="bg-white border border-stone-200/60 rounded-2xl p-5 luxury-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gold-600" />
                  <h3 className="text-lg font-serif font-semibold text-luxury-black">Інгредієнти</h3>
                </div>

                {/* Serving interactive scaler controls */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500">Порції:</span>
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                    <button
                      id="serving-decrease-btn"
                      onClick={() => setServings((prev) => Math.max(1, prev - 1))}
                      className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 hover:text-luxury-black font-semibold text-sm transition-colors"
                      disabled={servings <= 1}
                    >
                      －
                    </button>
                    <span className="px-3.5 py-1 text-xs font-bold font-mono text-luxury-black border-x border-stone-200 bg-white">
                      {servings}
                    </span>
                    <button
                      id="serving-increase-btn"
                      onClick={() => setServings((prev) => Math.min(20, prev + 1))}
                      className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 hover:text-luxury-black font-semibold text-sm transition-colors"
                    >
                      ＋
                    </button>
                  </div>
                  {servings !== recipe.servings && (
                    <button
                      id="serving-reset-btn"
                      onClick={() => setServings(recipe.servings)}
                      className="p-1 hover:bg-stone-100 text-stone-400 hover:text-gold-600 rounded transition-colors"
                      title="Відновити оригінал"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Dynamic ingredients scales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {recipe.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm py-1 border-b border-light border-stone-100 pb-1.5 last:border-b-0">
                    <span className="text-stone-700">{ing.name}</span>
                    <span className="font-medium text-luxury-black font-mono text-xs whitespace-nowrap ml-2 bg-stone-50 border border-stone-150 rounded px-1.5 py-0.5">
                      {scaleQuantity(ing.amount, servings, recipe.servings)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* PREPARATION STEPS list */}
            <div className="bg-white border border-stone-200/60 rounded-2xl p-5 luxury-shadow flex-grow">
              <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gold-600" />
                  <h3 className="text-lg font-serif font-semibold text-luxury-black">Етапи приготування</h3>
                </div>

                {Object.keys(completedSteps).length > 0 && (
                  <button
                    id="reset-steps-progress-btn"
                    onClick={handleResetProgress}
                    className="text-xs text-stone-400 hover:text-gold-600 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Скинути прогрес
                  </button>
                )}
              </div>

              {/* Dynamic Steps Lists */}
              <div className="space-y-4">
                {recipe.steps.map((step, idx) => {
                  const isDone = completedSteps[idx] || false;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggleStep(idx)}
                      className={`flex gap-4 p-3 rounded-xl border transition-all cursor-pointer ${
                        isDone
                          ? 'bg-stone-50 border-stone-200/70 opacity-60'
                          : 'bg-white border-stone-200/50 hover:border-gold-300'
                      }`}
                    >
                      {/* Circle check list item */}
                      <div className="flex-shrink-0 mt-0.5">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            isDone
                              ? 'bg-gold-600 border-gold-600 text-white'
                              : 'border-stone-400 text-transparent'
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      </div>

                      {/* Content step description */}
                      <div className="space-y-1">
                        <span className="block text-[10px] uppercase font-sans tracking-wider font-bold text-gold-600">
                          Крок {idx + 1}
                        </span>
                        <p className={`text-sm text-stone-800 leading-relaxed ${isDone ? 'line-through text-stone-500' : ''}`}>
                          {step}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
