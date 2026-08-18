import { Recipe, RecipeStats } from '../types';
import { Award, Timer, Layers, Flame } from 'lucide-react';

interface StatsGridProps {
  recipes: Recipe[];
}

export function StatsGrid({ recipes }: StatsGridProps) {
  // Compute numbers dynamically
  const total = recipes.length;
  const categories = new Set(recipes.map(r => r.category)).size;
  const averageTime = total
    ? Math.round(recipes.reduce((sum, r) => sum + (r.prepTime + r.cookTime), 0) / total)
    : 0;
  const difficultCount = recipes.filter(r => r.difficulty === 'Складно').length;

  const statsList = [
    {
      label: 'Рецептів у базі',
      value: total,
      sub: 'Вишукані шедеври',
      icon: Award,
      color: 'text-gold-600 bg-gold-50 border-gold-100',
    },
    {
      label: 'Унікальні категорії',
      value: categories,
      sub: 'Смакова різноманітність',
      icon: Layers,
      color: 'text-stone-700 bg-stone-100 border-stone-200',
    },
    {
      label: 'Сер. час готування',
      value: `${averageTime} хв`,
      sub: 'Ретельна підготовка',
      icon: Timer,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      label: 'Шедеври високої складності',
      value: difficultCount,
      sub: 'Справжній виклик шефу',
      icon: Flame,
      color: 'text-red-600 bg-red-50 border-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statsList.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-stone-200 rounded-2xl p-5 luxury-shadow flex items-start justify-between relative overflow-hidden group transition-all duration-300 hover:border-gold-300"
          >
            <div className="space-y-1">
              <span className="text-xs text-stone-500 uppercase tracking-widest font-medium font-sans">
                {stat.label}
              </span>
              <h3 className="text-2xl font-serif font-bold text-luxury-black">
                {stat.value}
              </h3>
              <p className="text-xs text-stone-400 font-serif italic">{stat.sub}</p>
            </div>
            <div
              className={`p-3 rounded-xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${stat.color}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            {/* Subtle decorative bottom border accent */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </div>
        );
      })}
    </div>
  );
}
