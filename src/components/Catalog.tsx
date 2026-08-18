import { useState, useMemo } from 'react';
import { Recipe, Difficulty, CategoryType } from '../types';
import { RecipeCard } from './RecipeCard';
import { Search, SlidersHorizontal, RefreshCcw, CookingPot, Flame, Calendar, ArrowUpDown } from 'lucide-react';

interface CatalogProps {
  recipes: Recipe[];
  onViewRecipe: (recipe: Recipe) => void;
}

const CATEGORIES: CategoryType[] = ['Всі', 'Основні страви', 'Супи та Борщі', 'Закуски', 'Десерти', 'Напої'];

export function Catalog({ recipes, onViewRecipe }: CatalogProps) {
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Всі');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Всі' | Difficulty>('Всі');
  const [maxTime, setMaxTime] = useState<number>(150); // minutes
  const [sortBy, setSortBy] = useState<'newest' | 'fastest' | 'alphabetical'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Dynamic values based on current database
  const maxPossibleTime = useMemo(() => {
    if (recipes.length === 0) return 120;
    return Math.max(...recipes.map(r => r.prepTime + r.cookTime));
  }, [recipes]);

  // Handle resetting filters safely
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Всі');
    setSelectedDifficulty('Всі');
    setMaxTime(maxPossibleTime);
    setSortBy('newest');
  };

  // Filter & Sort calculation
  const filteredRecipes = useMemo(() => {
    return recipes
      .filter((recipe) => {
        // Search query string matching (title, description, ingredients)
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          query === '' ||
          recipe.title.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query) ||
          recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(query));

        // Category matching
        const matchesCategory = selectedCategory === 'Всі' || recipe.category === selectedCategory;

        // Difficulty matching
        const matchesDifficulty = selectedDifficulty === 'Всі' || recipe.difficulty === selectedDifficulty;

        // Cumulative cooking minutes constraint
        const totalTime = recipe.prepTime + recipe.cookTime;
        const matchesTime = totalTime <= maxTime;

        return matchesQuery && matchesCategory && matchesDifficulty && matchesTime;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'fastest') {
          const timeA = a.prepTime + a.cookTime;
          const timeB = b.prepTime + b.cookTime;
          return timeA - timeB;
        }
        if (sortBy === 'alphabetical') {
          return a.title.localeCompare(b.title, 'uk');
        }
        return 0;
      });
  }, [recipes, searchQuery, selectedCategory, selectedDifficulty, maxTime, sortBy]);

  return (
    <div className="space-y-6">
      
      {/* Dynamic search and navigation utility panel */}
      <div className="bg-white border border-stone-200 rounded-3xl p-5 luxury-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Real-time search element */}
        <div className="relative flex-grow max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-400" />
          <input
            type="text"
            id="catalog-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Шукати рецепти за назвою або інгредієнтом..."
            className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 text-sm focus:bg-white focus:border-gold-500 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              id="clear-search-btn"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-luxury-black transition-colors"
            >
              Очистити
            </button>
          )}
        </div>

        {/* Action switch filters */}
        <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
          <button
            id="toggle-filters-btn"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              showFilters || selectedDifficulty !== 'Всі' || maxTime < maxPossibleTime
                ? 'bg-gold-50 border-gold-300 text-gold-700 font-bold'
                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-luxury-black'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Параметри фільтрів</span>
          </button>

          {/* Clean dropdown sorters */}
          <div className="flex items-center gap-1.5 bg-luxury-clay px-3 py-1.5 rounded-xl border border-stone-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <select
              id="catalog-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-stone-700 hover:text-luxury-black focus:outline-none cursor-pointer"
            >
              <option value="newest">Найновіші спочатку</option>
              <option value="fastest">Швидкі спочатку</option>
              <option value="alphabetical">За алфавітом (А-Я)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expandable Luxury Filter Tray */}
      {showFilters && (
        <div className="bg-white border border-stone-200 rounded-3xl p-5 luxury-shadow animate-fade-in grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Difficulty selector */}
          <div className="space-y-2">
            <span className="block text-[10px] uppercase tracking-widest font-semibold text-stone-500 font-sans">
              Складність страви
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['Всі', 'Легко', 'Середньо', 'Складно'].map((diff) => (
                <button
                  key={diff}
                  id={`filter-diff-${diff}`}
                  onClick={() => setSelectedDifficulty(diff as any)}
                  className={`px-3.5 py-1.5 text-xs rounded-lg border transition-all cursor-pointer ${
                    selectedDifficulty === diff
                      ? 'bg-luxury-black text-white border-luxury-black shadow-sm'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Time limiter slider dial */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-stone-500 font-sans">
                Максимальний час готування
              </span>
              <span className="text-xs font-mono font-bold text-gold-600">
                до {maxTime} хв
              </span>
            </div>
            <input
              type="range"
              id="filter-time-slider"
              min="10"
              max={maxPossibleTime < 10 ? 120 : maxPossibleTime}
              value={maxTime}
              onChange={(e) => setMaxTime(Number(e.target.value))}
              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-gold-600"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>10 хв</span>
              <span>{maxPossibleTime} хв</span>
            </div>
          </div>

          {/* Active Reset trigger */}
          <div className="flex items-end justify-start md:justify-end">
            <button
              id="reset-all-filters-btn"
              onClick={handleResetFilters}
              className="flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-gold-600 border border-transparent hover:border-gold-100 px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              Скинути критерії фільтрації
            </button>
          </div>
        </div>
      )}

      {/* Horizontal categories list navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`category-tag-${cat.replace(/\s+/g, '-')}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap border transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gold-600 text-white border-gold-600 shadow-md shadow-gold-600/10'
                : 'bg-white hover:bg-stone-50 text-stone-600 hover:text-luxury-black border-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cumulative Count indicators */}
      <div className="flex items-center justify-between text-xs text-stone-500 font-sans px-1">
        <span>Знайдено рецептів: <span className="font-bold text-luxury-black font-mono">{filteredRecipes.length}</span></span>
        {filteredRecipes.length !== recipes.length && (
          <span className="italic">Фільтровано з {recipes.length} оригіналів</span>
        )}
      </div>

      {/* Recipe Cards grids layout */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onView={onViewRecipe}
            />
          ))}
        </div>
      ) : (
        /* Empty results panel styling */
        <div className="bg-white border border-stone-250/50 rounded-3xl p-12 text-center luxury-shadow max-w-xl mx-auto space-y-4 animate-fade-in">
          <div className="mx-auto w-16 h-16 bg-gold-50 border border-gold-100 rounded-full flex items-center justify-center text-gold-600">
            <CookingPot className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-serif font-semibold text-luxury-black">Інгредієнти або страва не знайдені</h3>
            <p className="text-sm text-stone-500 font-sans max-w-sm mx-auto">
              Ми не знайшли рецептів, які б точно відповідали вашим критеріям пошуку. Спробуйте змінити фільтри чи запит.
            </p>
          </div>
          <button
            id="empty-state-reset-btn"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 bg-luxury-black hover:bg-gold-600 text-white hover:shadow-lg px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Повернути всі рецепти
          </button>
        </div>
      )}
    </div>
  );
}
