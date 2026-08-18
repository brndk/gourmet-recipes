import { useState, useEffect, FormEvent } from 'react';
import { Recipe, Ingredient, Difficulty } from '../types';
import { Plus, Trash2, Camera, HelpCircle, Save, X, Sparkles } from 'lucide-react';

interface RecipeFormProps {
  recipe?: Recipe; // Exists if we are editing
  onSubmit: (recipe: Omit<Recipe, 'id' | 'createdAt'> & { id?: string }) => void;
  onCancel: () => void;
}

const CATEGORIES = ['Основні страви', 'Супи та Борщі', 'Закуски', 'Десерти', 'Напої'];

const IMAGE_PRESETS = [
  { name: 'М’ясо / Качка', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200' },
  { name: 'Зелений салат', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1200' },
  { name: 'Десерти / Кондитерська', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200' },
  { name: 'Італійська паста', url: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&q=80&w=1200' },
  { name: 'Супи / Страви в казанку', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=1200' },
];

export function RecipeForm({ recipe, onSubmit, onCancel }: RecipeFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Основні страви');
  const [prepTime, setPrepTime] = useState(20);
  const [cookTime, setCookTime] = useState(15);
  const [difficulty, setDifficulty] = useState<Difficulty>('Середньо');
  const [calories, setCalories] = useState(350);
  const [servings, setServings] = useState(2);
  const [imageUrl, setImageUrl] = useState('');
  const [chefTip, setChefTip] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Dynamic Array States
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '' }
  ]);
  const [steps, setSteps] = useState<string[]>(['']);

  // Pre-populate if editing a recipe
  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title);
      setDescription(recipe.description);
      setCategory(recipe.category);
      setPrepTime(recipe.prepTime);
      setCookTime(recipe.cookTime);
      setDifficulty(recipe.difficulty);
      setCalories(recipe.calories);
      setServings(recipe.servings);
      setImageUrl(recipe.imageUrl);
      setChefTip(recipe.chefTip || '');
      setIngredients(recipe.ingredients.length > 0 ? [...recipe.ingredients] : [{ name: '', amount: '' }]);
      setSteps(recipe.steps.length > 0 ? [...recipe.steps] : ['']);
      setIsFeatured(recipe.isFeatured || false);
    }
  }, [recipe]);

  // Handle dynamic additions
  const addIngredientField = () => {
    setIngredients([...ingredients, { name: '', amount: '' }]);
  };

  const removeIngredientField = (index: number) => {
    const updated = ingredients.filter((_, idx) => idx !== index);
    setIngredients(updated.length > 0 ? updated : [{ name: '', amount: '' }]);
  };

  const updateIngredientField = (index: number, key: keyof Ingredient, value: string) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [key]: value };
    setIngredients(updated);
  };

  const addStepField = () => {
    setSteps([...steps, '']);
  };

  const removeStepField = (index: number) => {
    const updated = steps.filter((_, idx) => idx !== index);
    setSteps(updated.length > 0 ? updated : ['']);
  };

  const updateStepField = (index: number, value: string) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  // Form submit trigger
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Check mandatory details
    if (!title.trim()) {
      alert('Будь ласка, вкажіть назву рецепту');
      return;
    }

    const filteredIngredients = ingredients.filter((ing) => ing.name.trim() !== '');
    if (filteredIngredients.length === 0) {
      alert('Додайте хоча б один дійсний інгредієнт');
      return;
    }

    const filteredSteps = steps.filter((step) => step.trim() !== '');
    if (filteredSteps.length === 0) {
      alert('Додайте хоча б один крок приготування');
      return;
    }

    onSubmit({
      ...(recipe && { id: recipe.id }), // Include ID if editing
      title: title.trim(),
      description: description.trim(),
      category,
      prepTime: Number(prepTime) || 10,
      cookTime: Number(cookTime) || 10,
      difficulty,
      calories: Number(calories) || 100,
      servings: Number(servings) || 2,
      imageUrl: imageUrl.trim() || IMAGE_PRESETS[0].url,
      chefTip: chefTip.trim() || undefined,
      ingredients: filteredIngredients,
      steps: filteredSteps,
      isFeatured,
    });
  };

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 luxury-shadow animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-stone-150 pb-4 mb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-luxury-black flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-600" />
            {recipe ? 'Редагування шедевру' : 'Створення нового шедевру'}
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Заповніть усі поля з точністю, щоб ваші читачі могли ідеально відтворити страву
          </p>
        </div>
        <button
          id="form-close-x-btn"
          onClick={onCancel}
          className="p-1.5 hover:bg-stone-100 text-stone-400 hover:text-luxury-black rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Row 1: Title & Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
              Назва вишуканої страви *
            </label>
            <input
              type="text"
              id="recipe-title-input"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Наприклад: Філе лосося sous-vide з цитрусовим пюре"
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none transition-all text-sm text-luxury-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
              Категорія страви *
            </label>
            <select
              id="recipe-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none transition-all text-sm text-luxury-black"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Short gourmet description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
            Вишуканий вступний опис *
          </label>
          <textarea
            id="recipe-description-input"
            required
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Опишіть смакову палітру страви, її шарм, консистенцію та ресторанну легенду..."
            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none transition-all text-sm text-luxury-black leading-relaxed"
          />
        </div>

        {/* Row 3: Durations & Portions & Calories */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Підготовка (хв)
            </label>
            <input
              type="number"
              id="recipe-preptime-input"
              min="0"
              required
              value={prepTime}
              onChange={(e) => setPrepTime(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none transition-all text-sm text-luxury-black font-mono text-center"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Готування (хв)
            </label>
            <input
              type="number"
              id="recipe-cooktime-input"
              min="0"
              required
              value={cookTime}
              onChange={(e) => setCookTime(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none transition-all text-sm text-luxury-black font-mono text-center"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Обсяг порцій
            </label>
            <input
              type="number"
              id="recipe-servings-input"
              min="1"
              required
              value={servings}
              onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 2))}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none transition-all text-sm text-luxury-black font-mono text-center"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Калорії (ккал)
            </label>
            <input
              type="number"
              id="recipe-calories-input"
              min="0"
              required
              value={calories}
              onChange={(e) => setCalories(Math.max(0, parseInt(e.target.value) || 100))}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none transition-all text-sm text-luxury-black font-mono text-center"
            />
          </div>

          <div className="col-span-2 lg:col-span-1 space-y-1.5">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Складність
            </label>
            <select
              id="recipe-difficulty-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none transition-all text-sm text-luxury-black"
            >
              <option value="Легко">Легко</option>
              <option value="Середньо">Середньо</option>
              <option value="Складно">Складно</option>
            </select>
          </div>
        </div>

        {/* Row 4: Image Picker Presets & Custom Input */}
        <div className="space-y-3 bg-stone-50 p-4 border border-stone-150 rounded-2xl">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-stone-500" />
              Головне зображення (Посилання на зображення) *
            </label>
            <input
              type="url"
              id="recipe-imageUrl-input"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Введіть пряме URL-посилання або скористайтеся розкішним заготовленим пресетом нижче..."
              className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:border-gold-500 focus:outline-none transition-all text-xs font-mono text-stone-700"
            />
          </div>

          {/* Preset Buttons */}
          <div className="space-y-1">
            <span className="text-[10px] text-stone-400 font-sans block">Пресети фотографій високого ресторану (в 1 клік):</span>
            <div className="flex flex-wrap gap-2">
              {IMAGE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  id={`preset-img-${preset.name.replace(/\s+/g, '-')}`}
                  onClick={() => setImageUrl(preset.url)}
                  className={`px-3 py-1.5 text-[10px] font-medium rounded-lg border transition-all ${
                    imageUrl === preset.url
                      ? 'bg-gold-600 text-white border-gold-600 shadow-sm'
                      : 'bg-white hover:bg-stone-100 text-stone-600 border-stone-200'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 5: Ingredients lists (Dynamic array) */}
        <div className="space-y-3 border border-stone-200 rounded-2xl p-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-luxury-black">
              Необхідні інгредієнти *
            </h3>
            <button
              id="add-ingredient-btn"
              type="button"
              onClick={addIngredientField}
              className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gold-600 hover:text-gold-700 font-sans transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Додати рядок
            </button>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex gap-2 items-center animate-fade-in">
                <span className="text-xs font-mono text-stone-400 w-5">{(idx + 1).toString().padStart(2, '0')}</span>
                <input
                  type="text"
                  id={`ing-name-input-${idx}`}
                  required
                  value={ing.name}
                  onChange={(e) => updateIngredientField(idx, 'name', e.target.value)}
                  placeholder="Назва (наприклад, Філе яловичини)"
                  className="flex-grow px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:bg-white focus:border-gold-500 focus:outline-none"
                />
                <input
                  type="text"
                  id={`ing-amount-input-${idx}`}
                  required
                  value={ing.amount}
                  onChange={(e) => updateIngredientField(idx, 'amount', e.target.value)}
                  placeholder="Вага / к-ть (наприклад, 400 г)"
                  className="w-1/3 px-3 py-2 bg-stone-50 border border-stone-200 text-center rounded-lg text-xs text-stone-800 focus:bg-white focus:border-gold-500 focus:outline-none"
                />
                <button
                  id={`remove-ing-btn-${idx}`}
                  type="button"
                  onClick={() => removeIngredientField(idx)}
                  className="p-2 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Вилучити"
                  disabled={ingredients.length === 1 && ing.name === ''}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Row 6: Preparation Steps list (Dynamic Paragraphs) */}
        <div className="space-y-3 border border-stone-200 rounded-2xl p-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-luxury-black">
              Етапи приготування (Покроково) *
            </h3>
            <button
              id="add-step-btn"
              type="button"
              onClick={addStepField}
              className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gold-600 hover:text-gold-700 font-sans transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Додати крок
            </button>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-2 items-start animate-fade-in">
                <span className="text-xs font-mono font-bold text-gold-600 w-12 mt-2 bg-gold-50 border border-gold-100 px-1 py-0.5 rounded text-center">
                  Крок {idx + 1}
                </span>
                <textarea
                  id={`step-text-input-${idx}`}
                  required
                  rows={2}
                  value={step}
                  onChange={(e) => updateStepField(idx, e.target.value)}
                  placeholder="Опишіть операції, температурний контроль та маніпуляції інгредієнтами..."
                  className="flex-grow px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:bg-white focus:border-gold-500 focus:outline-none leading-relaxed"
                />
                <button
                  id={`remove-step-btn-${idx}`}
                  type="button"
                  onClick={() => removeStepField(idx)}
                  className="p-2 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors mt-1.5 cursor-pointer"
                  title="Вилучити крок"
                  disabled={steps.length === 1 && step === ''}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Row 7: Chef professional tip */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-stone-500" />
            Професійний секрет шефа (Необов’язково)
          </label>
          <input
            type="text"
            id="recipe-cheftip-input"
            value={chefTip}
            onChange={(e) => setChefTip(e.target.value)}
            placeholder="Наприклад: Перед обсмажуванням дайте филе дозріти до кімнатної температури."
            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none transition-all text-sm text-luxury-black font-serif italic"
          />
        </div>

        {/* Featured Switch Row */}
        <div className="flex items-center justify-between p-4 bg-gold-50 border border-gold-100/50 rounded-xl">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-gold-800 block">Позначити як ресторанний «Шедевр»</span>
            <span className="text-[11px] text-stone-500">Цей статус ставить рецепт на вершину з особливими декоративними відзнаками</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="featured-toggle"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-600" />
          </label>
        </div>

        {/* Submit action buttons */}
        <div className="border-t border-stone-150 pt-5 flex items-center justify-end gap-3">
          <button
            id="form-cancel-btn"
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-luxury-clay hover:bg-stone-200 text-stone-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
          >
            Скасувати
          </button>
          <button
            id="form-submit-btn"
            type="submit"
            className="px-6 py-3 bg-luxury-black hover:bg-gold-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg shadow-black/10 hover:shadow-gold-600/15"
          >
            <Save className="w-4 h-4" />
            Зберегти рецепт
          </button>
        </div>
      </form>
    </div>
  );
}
