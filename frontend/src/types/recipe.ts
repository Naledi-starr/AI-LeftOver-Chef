export interface RecipeRequest {
	ingredients: string[];
	dietary_preferences?: string;
	servings: number;
}

export interface Recipe {
	title: string;
	description: string;
	ingredients: string[];
	instructions: string[];
	cooking_time_minutes: number;
	servings: number;
}
