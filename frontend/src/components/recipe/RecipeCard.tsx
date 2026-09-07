import type { Recipe } from "../../types/recipe";

interface RecipeCardProps { recipe: Recipe; }

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return <article className="recipe-card"><div className="recipe-card-top"><span className="eyebrow">Your new favourite</span><span className="recipe-meta">{recipe.cooking_time_minutes} min / {recipe.servings} servings</span></div><h2>{recipe.title}</h2><p className="recipe-description">{recipe.description}</p><div className="recipe-columns"><section><h3>Gather</h3><ul>{recipe.ingredients.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h3>Make it</h3><ol>{recipe.instructions.map((step, index) => <li key={`${step}-${index}`}>{step}</li>)}</ol></section></div></article>;
}