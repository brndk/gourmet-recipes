export type Difficulty = 'Легко' | 'Середньо' | 'Складно';

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  difficulty: Difficulty;
  ingredients: Ingredient[];
  steps: string[];
  imageUrl: string;
  calories: number;
  servings: number;
  chefTip?: string;
  isFeatured?: boolean;
  createdAt: string;
}

export type CategoryType = 'Всі' | 'Основні страви' | 'Супи та Борщі' | 'Закуски' | 'Десерти' | 'Напої';

export interface BlogComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string[];
  category: 'Секрети Шефа' | 'Техніки' | 'Інгредієнти' | 'Продукти';
  author: string;
  authorRole: string;
  readTime: number; // in minutes
  imageUrl: string;
  likes: number;
  comments: BlogComment[];
  createdAt: string;
}

export interface RecipeStats {
  totalRecipes: number;
  categoriesCount: number;
  averagePrepTime: number;
  hardRecipesCount: number;
}
