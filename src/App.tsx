import { useState, useEffect } from 'react';
import { Recipe, BlogPost } from './types';
import { INITIAL_RECIPES } from './data';
import { INITIAL_BLOG_POSTS } from './blogData';
import { Navbar } from './components/Navbar';
import { Catalog } from './components/Catalog';
import { Blog } from './components/Blog';
import { AdminPanel } from './components/AdminPanel';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { ChefHat, Star, Heart, Utensils, ArrowRight, Lock, KeyRound, ShieldAlert } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'blog' | 'admin'>('catalog');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedBlogPostId, setSelectedBlogPostId] = useState<string | null>(null);

  // Storage key
  const LOCAL_STORAGE_KEY = 'gourmet_recipes_database_v1';

  // State with lazy initialization from localStorage
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (err) {
        console.error('Failed to parse local recipes database:', err);
      }
    }
    return INITIAL_RECIPES;
  });

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recipes));
  }, [recipes]);

  // Administrative path tracker (triggered by #admin hash or ?admin=true search query)
  const [isAdminUrlActive, setIsAdminUrlActive] = useState<boolean>(() => {
    return window.location.hash === '#admin' || window.location.hash === '#/admin' || window.location.search.includes('admin=true');
  });

  // Session-persisted authorization state for professional masters
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    return sessionStorage.getItem('gourmet_admin_authorized') === 'true';
  });

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // State for premium blog posts with local storage persistence
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const stored = localStorage.getItem('gourmet_blog_posts_v1');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (err) {
        console.error('Failed to parse local blog posts database:', err);
      }
    }
    return INITIAL_BLOG_POSTS;
  });

  // Sync blog posts changes to localStorage
  useEffect(() => {
    localStorage.setItem('gourmet_blog_posts_v1', JSON.stringify(blogPosts));
  }, [blogPosts]);

  // Handle URL hash changes & popstate triggers for admin authentication url and dynamic routing
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash || '#/';
      const isParamActive = hash === '#admin' || hash === '#/admin' || window.location.search.includes('admin=true');
      setIsAdminUrlActive(isParamActive);

      if (isParamActive) {
        setActiveTab('admin');
        setSelectedRecipe(null);
        setSelectedBlogPostId(null);
      } else if (hash.startsWith('#/recipe/')) {
        const recipeId = hash.replace('#/recipe/', '');
        const found = recipes.find(r => r.id === recipeId);
        if (found) {
          setSelectedRecipe(found);
        } else {
          setSelectedRecipe(null);
        }
        setActiveTab('catalog');
        setSelectedBlogPostId(null);
      } else if (hash.startsWith('#/blog/')) {
        const postId = hash.replace('#/blog/', '');
        setSelectedBlogPostId(postId);
        setActiveTab('blog');
        setSelectedRecipe(null);
      } else if (hash === '#/blog') {
        setSelectedBlogPostId(null);
        setActiveTab('blog');
        setSelectedRecipe(null);
      } else {
        setActiveTab('catalog');
        setSelectedRecipe(null);
        setSelectedBlogPostId(null);
      }
    };

    handleLocationChange();

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [recipes]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === 'admin' && loginPassword === 'chef2026') {
      setIsAuthorized(true);
      sessionStorage.setItem('gourmet_admin_authorized', 'true');
      setAuthError('');
      setActiveTab('admin');
    } else {
      setAuthError('Неправильний логін або пароль. Спробуйте ще раз.');
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    sessionStorage.removeItem('gourmet_admin_authorized');
    setLoginUsername('');
    setLoginPassword('');
    window.location.hash = '#/';
    setActiveTab('catalog');
  };

  // Safe navigation functions mapping URLs directly
  const handleViewRecipe = (recipe: Recipe | null) => {
    if (recipe) {
      window.location.hash = `#/recipe/${recipe.id}`;
    } else {
      window.location.hash = '#/';
    }
  };

  const handleSelectBlogPost = (postId: string | null) => {
    if (postId) {
      window.location.hash = `#/blog/${postId}`;
    } else {
      window.location.hash = '#/blog';
    }
  };
  


  // Handle recipe addition
  const handleAddRecipe = (newRecipeData: Omit<Recipe, 'id' | 'createdAt'>) => {
    const newRecipe: Recipe = {
      ...newRecipeData,
      id: `recipe_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setRecipes((prev) => [newRecipe, ...prev]);
  };

  // Handle recipe update
  const handleUpdateRecipe = (updatedRecipe: Recipe) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r))
    );
  };

  // Handle recipe deletion
  const handleDeleteRecipe = (id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  // Find a premium featured recipe to highlight as standard
  const featuredRecipe = recipes.find(r => r.isFeatured) || recipes[0];

  return (
    <div className="min-h-screen bg-luxury-cream text-luxury-black font-sans selection:bg-gold-100 selection:text-gold-700">
      
      {/* Dynamic Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAdminUrlActive={isAdminUrlActive}
        isAuthorized={isAuthorized}
        onLogout={handleLogout}
        userEmail="nikalaev9966@gmail.com"
      />

      {/* Main layout frame */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'catalog' ? (
          <div className="space-y-12">
            
            {/* LUXURY HERO WELCOME PANEL */}
            <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white min-h-[350px] md:min-h-[400px] flex flex-col justify-end luxury-shadow p-6 sm:p-10 border border-stone-800">
              {/* Blurred atmospheric image overlay */}
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1600"
                  alt="Premium Kitchen Context"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
              </div>

              {/* Promo Typography content */}
              <div className="relative z-10 space-y-4 max-w-2xl">
                <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold uppercase tracking-widest text-gold-500 bg-gold-500/10 border border-gold-500/20 px-3 py-1 rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                  Вибір Шефа
                </span>

                <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight leading-none text-white">
                  Мистецтво смаку у вашому домі
                </h2>

                <p className="text-stone-300 text-sm sm:text-base font-sans leading-relaxed tracking-tight font-light">
                  Відкрийте таємниці високої гастрономії. Наші покрокові інструкції, пропорційні калькулятори та секретні поради шеф-кухарів допоможуть вам створити страви рівня Michelin на власній кухні.
                </p>

                {/* Main Action buttons */}
                {featuredRecipe && (
                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      id="hero-featured-view-btn"
                      onClick={() => handleViewRecipe(featuredRecipe)}
                      className="px-6 py-3.5 bg-gold-600 hover:bg-gold-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-600/15"
                    >
                      <span>Рекомендація: {featuredRecipe.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* CATALOG SECTION GRID */}
            <div>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div className="space-y-1">
                  <h2 className="text-3xl font-serif font-bold text-luxury-black">
                    Кулінарний Каталог
                  </h2>
                  <p className="text-xs text-stone-500 font-sans">
                    Оберіть страву до душі та регулюйте інгредієнти відповідно до кількості запрошених гостей
                  </p>
                </div>
                
                <div className="flex gap-4 text-xs font-sans text-stone-500 border-t md:border-t-0 border-stone-100 pt-3 md:pt-0">
                  <span className="flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-gold-600" />
                    <span>Шеф-рецепти</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-gold-600 fill-current" />
                    <span>Обрані смаки</span>
                  </span>
                </div>
              </div>

              {/* Catalog Component */}
              <Catalog 
                recipes={recipes} 
                onViewRecipe={handleViewRecipe} 
              />
            </div>

          </div>
        ) : activeTab === 'blog' ? (
          <Blog 
            blogPosts={blogPosts}
            onUpdateBlogPosts={setBlogPosts}
            selectedPostId={selectedBlogPostId}
            onSelectPost={handleSelectBlogPost}
          />
        ) : (
          /* ADMIN WORKSPACE OR LOGIN SECURE GATE */
          <div className="space-y-6">
            {isAuthorized ? (
              <AdminPanel
                recipes={recipes}
                onAddRecipe={handleAddRecipe}
                onUpdateRecipe={handleUpdateRecipe}
                onDeleteRecipe={handleDeleteRecipe}
              />
            ) : (
              /* LUXURIOUS LOGIN WINDOW */
              <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-stone-200 p-8 shadow-xl animate-fade-in">
                <div className="text-center space-y-3 mb-8">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-600">
                    <Lock className="w-6 h-6 animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-black">
                    Вхід до кабінету шефа
                  </h2>
                  <p className="text-xs text-stone-500 font-sans max-w-sm mx-auto">
                    Цей розділ призначено виключно для авторизованих шеф-кухарів та адміністраторів GOURMET Studio.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase font-semibold tracking-wider text-stone-600 block">
                      Ім'я користувача
                    </label>
                    <input
                      id="login-username-input"
                      type="text"
                      required
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all text-sm text-stone-800"
                      placeholder="Введіть логін"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs uppercase font-semibold tracking-wider text-stone-600 block">
                      Пароль
                    </label>
                    <input
                      id="login-password-input"
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all text-sm text-stone-800"
                      placeholder="Введіть пароль"
                    />
                  </div>

                  {authError && (
                    <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-sans animate-shake">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    id="login-submit-btn"
                    type="submit"
                    className="w-full py-3 px-4 bg-gold-600 hover:bg-gold-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer"
                  >
                    Авторизуватись
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-stone-100 text-center space-y-1 bg-stone-50 py-3 rounded-xl">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-stone-400">Демонстраційні облікові дані</p>
                  <p className="text-xs font-serif font-medium text-stone-600">
                    Логін: <span className="font-mono bg-stone-200/60 px-1.5 py-0.5 rounded text-stone-900">admin</span>
                  </p>
                  <p className="text-xs font-serif font-medium text-stone-600">
                    Пароль: <span className="font-mono bg-stone-200/60 px-1.5 py-0.5 rounded text-stone-900">chef2026</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER BRANDS ACCENT */}
      <footer className="border-t border-stone-200 mt-16 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-extrabold tracking-wider text-luxury-black flex items-center justify-center md:justify-start gap-1.5">
              <ChefHat className="w-5 h-5 text-gold-600" />
              GOURMET STUDIO
            </h3>
            <p className="text-xs text-stone-500 font-sans">
              Платформа вишуканих рецептів від кращих кухарів світу © 2026.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-xs font-medium text-stone-500">
            <a href="#" className="hover:text-gold-600 transition-colors">Кулінарний каталог</a>
            <a href="#admin" className="hover:text-gold-600 transition-colors font-medium">Шеф-кабінет (Адміністрування)</a>
            <span className="font-mono text-stone-400">Порт: 3000 (Локальний запуск)</span>
          </div>
        </div>
      </footer>

      {/* IMMERSIVE RECIPE DETAIL MODAL COMPONENT */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => handleViewRecipe(null)}
        />
      )}
    </div>
  );
}
