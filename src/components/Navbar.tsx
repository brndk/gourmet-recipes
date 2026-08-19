import { ChefHat, BookOpen, Settings, FileText } from 'lucide-react';

interface NavbarProps {
  activeTab: 'catalog' | 'blog' | 'admin';
  setActiveTab: (tab: 'catalog' | 'blog' | 'admin') => void;
  isAdminUrlActive: boolean;
  isAuthorized: boolean;
  onLogout: () => void;
  userEmail?: string;
}

export function Navbar({ activeTab, setActiveTab, isAdminUrlActive, isAuthorized, onLogout, userEmail }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-luxury-cream/90 backdrop-blur-md border-b border-luxury-clay px-6 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3">
          <div className="bg-gold-600 text-white p-2.5 rounded-full shadow-md shadow-gold-500/10 flex items-center justify-center">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-semibold tracking-wide text-luxury-black flex items-center gap-2">
              MERRY
              <span className="text-xs font-sans tracking-widest font-bold uppercase text-gold-600 bg-gold-50 px-2 py-0.5 border border-gold-100 rounded">
                Studio
              </span>
            </h1>
            <p className="text-xs text-stone-500 font-sans tracking-tight">Преміальний кулінарний простір</p>
          </div>
        </div>

        {/* Navigation Selector - Always visible for Catalog and Blog */}
        <div className="flex items-center gap-1.5 bg-luxury-clay p-1 rounded-full border border-stone-200 shadow-inner">
          <button
            id="nav-catalog-btn"
            onClick={() => {
              window.location.hash = '#/';
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-luxury-black text-white shadow-md'
                : 'text-stone-600 hover:text-luxury-black hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Каталог
          </button>
          
          <button
            id="nav-blog-btn"
            onClick={() => {
              window.location.hash = '#/blog';
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'blog'
                ? 'bg-luxury-black text-white shadow-md'
                : 'text-stone-600 hover:text-luxury-black hover:bg-stone-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Блог
          </button>
          
          {isAdminUrlActive && isAuthorized && (
            <button
              id="nav-admin-btn"
              onClick={() => {
                window.location.hash = '#/admin';
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-luxury-black text-white shadow-md'
                  : 'text-stone-600 hover:text-luxury-black hover:bg-stone-100'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Адмінка
            </button>
          )}
        </div>

        {/* Chef session details or Login Status */}
        {isAuthorized ? (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-right">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-mono text-stone-500">
                Шеф: <span className="font-medium text-stone-700">{userEmail}</span>
              </span>
            </div>
            <button
              id="chef-logout-btn"
              onClick={onLogout}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 hover:text-rose-600 text-stone-600 text-xs font-semibold uppercase tracking-wider rounded-lg border border-stone-200 transition-all cursor-pointer"
            >
              Вийти
            </button>
          </div>
        ) : (
          isAdminUrlActive && (
            <button
              id="chef-to-catalog-direct-btn"
              onClick={() => {
                window.location.hash = '';
                window.location.search = '';
                window.location.reload();
              }}
              className="text-xs text-stone-500 hover:text-luxury-black font-semibold transition-colors uppercase tracking-wider"
            >
              Повернутись до сайту
            </button>
          )
        )}
      </div>
    </header>
  );
}
