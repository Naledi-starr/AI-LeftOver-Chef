export interface SavedRecipe {
  id: number;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cooking_time_minutes: number;
  servings: number;
  is_favorite: boolean;
  rating: number | null;
  feedback: string | null;
  created_at: string;
}

export interface SavedRecipeInput {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cooking_time_minutes: number;
  servings: number;
}

export interface SavedRecipeUpdateInput {
  is_favorite?: boolean;
  rating?: number | null;
  feedback?: string | null;
}