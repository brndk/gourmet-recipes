import { Recipe } from '../types';
import { Timer, Star, Flame, Edit3, Trash2, ArrowUpRight } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onView: (recipe: Recipe) => void;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

export function RecipeCard({ recipe, onView, onEdit, onDelete, isAdmin = false }: RecipeCardProps) {
  // Color styling based on cooking complexity
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Легко':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200/50';
      case 'Середньо':
        return 'text-amber-700 bg-amber-50 border-amber-200/50';
      case 'Складно':
        return 'text-rose-700 bg-rose-50 border-rose-200/50';
      default:
        return 'text-stone-700 bg-stone-50 border-stone-200';
    }
  };

  // Safe image placeholder if provided URL has issues
  const sanitizedImage = recipe.imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=600';

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden luxury-shadow luxury-shadow-hover transition-all duration-300 flex flex-col h-full animate-fade-in">
      {/* Recipe image banner */}
      <div className="relative aspect-video w-full overflow-hidden bg-stone-100 flex-shrink-0">
        <img
          src={sanitizedImage}
          alt={recipe.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Category sticker */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap z-10">
          <span className="px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-wider text-white bg-luxury-black/85 backdrop-blur-md rounded-full border border-white/10">
            {recipe.category}
          </span>
          {recipe.isFeatured && (
            <span className="px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-wider text-white bg-gold-600 rounded-full flex items-center gap-1 shadow-md shadow-gold-600/20">
              <Star className="w-2.5 h-2.5 fill-current" />
              Шедевр
            </span>
          )}
        </div>

        {/* Total Time Badge */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg border border-stone-100/30 text-xs font-medium text-stone-800 flex items-center gap-1.5 shadow-sm">
          <Timer className="w-3.5 h-3.5 text-gold-600" />
          <span>{recipe.prepTime + recipe.cookTime} хв</span>
        </div>
      </div>

      {/* Card Content body */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div className="space-y-2">
          {/* Metadata badges */}
          <div className="flex items-center gap-3 text-xs text-stone-500 font-sans">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-stone-400" />
              {recipe.calories} ккал
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-serif font-semibold text-luxury-black line-clamp-1 leading-snug group-hover:text-gold-600 transition-colors duration-200">
            {recipe.title}
          </h3>

          {/* Description summary */}
          <p className="text-sm text-stone-500 font-sans line-clamp-2 leading-relaxed h-10">
            {recipe.description}
          </p>

          {/* Teaser of key ingredients */}
          <div className="border-t border-stone-100 pt-3 flex flex-wrap gap-1.5 h-12 overflow-hidden items-start">
            {recipe.ingredients.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-luxury-clay px-2 py-0.5 text-stone-600 rounded border border-stone-200/50"
              >
                {item.name}
              </span>
            ))}
            {recipe.ingredients.length > 3 && (
              <span className="text-[10px] text-stone-400 font-bold self-center px-1">
                +{recipe.ingredients.length - 3} інгр.
              </span>
            )}
          </div>
        </div>

        {/* Card action controls */}
        <div className="border-t border-stone-100 pt-4 mt-4 flex items-center justify-between gap-2 flex-shrink-0">
          {isAdmin ? (
            <div className="flex items-center gap-1.5 w-full">
              <button
                id={`edit-recipe-btn-${recipe.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEdit) onEdit(recipe);
                }}
                className="flex-grow flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-luxury-clay hover:bg-stone-200 text-stone-700 rounded-xl transition-all border border-stone-200"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Редагувати
              </button>
              <button
                id={`delete-recipe-btn-${recipe.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDelete && confirm(`Ви справді бажаєте видалити рецепт "${recipe.title}"?`)) {
                    onDelete(recipe.id);
                  }
                }}
                className="px-3 py-2 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-xl transition-all border border-transparent hover:border-rose-100"
                title="Видалити рецепт"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <button
                id={`view-recipe-btn-${recipe.id}`}
                onClick={() => onView(recipe)}
                className="w-full flex items-center justify-center gap-1.5 bg-luxury-black text-white hover:bg-gold-600 hover:shadow-lg hover:shadow-gold-600/10 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300"
              >
                <span>Переглянути рецепт</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
