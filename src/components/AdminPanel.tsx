import { useState } from 'react';
import { Recipe } from '../types';
import { StatsGrid } from './StatsGrid';
import { RecipeForm } from './RecipeForm';
import { RecipeCard } from './RecipeCard';
import { PlusCircle, Sliders, ListFilter } from 'lucide-react';

interface AdminPanelProps {
  recipes: Recipe[];
  onAddRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt'>) => void;
  onUpdateRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
}

export function AdminPanel({ recipes, onAddRecipe, onUpdateRecipe, onDeleteRecipe }: AdminPanelProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string>('Всі');

  const CATEGORIES = ['Всі', 'Основні страви', 'Супи та Борщі', 'Закуски', 'Десерти', 'Напої'];

  const handleEditInit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  };

  const handleCreateInit = () => {
    setEditingRecipe(undefined);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: Omit<Recipe, 'id' | 'createdAt'> & { id?: string }) => {
    if (data.id) {
      // Editing
      onUpdateRecipe({
        ...data,
        id: data.id,
        createdAt: editingRecipe?.createdAt || new Date().toISOString(),
      } as Recipe);
    } else {
      // Adding new
      onAddRecipe(data);
    }
    // Close & cleanup
    setIsFormOpen(false);
    setEditingRecipe(undefined);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingRecipe(undefined);
  };

  const filteredRecipes = recipes.filter(
    (r) => categoryFilter === 'Всі' || r.category === categoryFilter
  );

  return (
    <div className="space-y-6">
      {isFormOpen ? (
        /* Render creation/editing form workspace */
        <div>
          <RecipeForm
            recipe={editingRecipe}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
          />
        </div>
      ) : (
        /* Show Stats, Filters, and Management items grid */
        <div className="space-y-6 animate-fade-in">
          
          {/* Main workspace section with visual actions */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 luxury-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-2xl font-serif font-black tracking-wide text-luxury-black flex items-center justify-center sm:justify-start gap-2">
                <Sliders className="w-5 h-5 text-gold-600" />
                ШЕФ-КАБІНЕТ (ADMIN STUDIO)
              </h2>
              <p className="text-xs text-stone-500 font-sans">
                Додавайте авторські страви, редагуйте деталі та контролюйте наповнення вашого ресторану
              </p>
            </div>

            <button
              id="initiate-create-recipe-btn"
              onClick={handleCreateInit}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-luxury-black hover:bg-gold-600 text-white hover:shadow-lg hover:shadow-gold-600/10 px-5  py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
            >
              <PlusCircle className="w-4.5 h-4.5" />
              Додати авторський рецепт
            </button>
          </div>

          {/* Quick interactive dynamic metrics dashboard */}
          <StatsGrid recipes={recipes} />

          {/* Categories select filter for quick administration */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-stone-150 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-stone-600">
              <ListFilter className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-semibold uppercase tracking-wider font-sans">Швидке сортування кабінету:</span>
            </div>
            
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto py-1 sm:py-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  id={`admin-filter-${cat.replace(/\s+/g, '-')}`}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-luxury-black text-white'
                      : 'hover:bg-stone-100 text-stone-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table/Cards management list */}
          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onView={() => {}} // Optional if we render click separately
                  onEdit={handleEditInit}
                  onDelete={onDeleteRecipe}
                  isAdmin={true}
                />
              ))}
            </div>
          ) : (
            <div className="bg-stone-50 border border-dashed border-stone-300 rounded-2xl py-12 text-center max-w-sm mx-auto">
              <p className="text-stone-500 text-sm">Не знайдено жодних рецептів в обраній категорії.</p>
              <button
                id="reset-admin-filter-btn"
                onClick={() => setCategoryFilter('Всі')}
                className="mt-3 text-xs font-bold uppercase tracking-wider text-gold-600 hover:underline"
              >
                Показати всі рецепти
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
