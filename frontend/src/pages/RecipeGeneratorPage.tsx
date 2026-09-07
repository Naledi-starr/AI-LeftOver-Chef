import { useState } from "react";
import { generateRecipe } from "../services/api";
import IngredientInput from "../components/recipe/IngredientInput";
import PreferenceSelector from "../components/recipe/PreferenceSelector";
import RecipeCard from "../components/recipe/RecipeCard";
import Button from "../components/ui/Button";
import type { Recipe } from "../types/recipe";

interface RecipeGeneratorPageProps { onBack: () => void; }

export default function RecipeGeneratorPage({ onBack }: RecipeGeneratorPageProps) {
  const [ingredients, setIngredients] = useState([""]); const [preference, setPreference] = useState(""); const [servings, setServings] = useState(2); const [recipe, setRecipe] = useState<Recipe | null>(null); const [isLoading, setIsLoading] = useState(false); const [error, setError] = useState("");
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); const usableIngredients = ingredients.map((item) => item.trim()).filter(Boolean); if (!usableIngredients.length) { setError("Add at least one ingredient to get started."); return; } setError(""); setIsLoading(true); setRecipe(null); try { setRecipe(await generateRecipe({ ingredients: usableIngredients, dietary_preferences: preference.trim() || undefined, servings })); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Something went wrong."); } finally { setIsLoading(false); } }
  return <main className="generator-page"><button className="back-link" type="button" onClick={onBack}>&lt;- Back home</button><div className="generator-layout"><section className="generator-intro"><span className="eyebrow">Recipe generator</span><h1>What is<br /><em>waiting</em> to be used?</h1><p>Give us the loose ends. We will find the delicious thread.</p></section><form className="generator-form" onSubmit={handleSubmit}><IngredientInput ingredients={ingredients} onChange={setIngredients} /><PreferenceSelector preference={preference} servings={servings} onPreferenceChange={setPreference} onServingsChange={setServings} />{error && <p className="form-error" role="alert">{error}</p>}<Button type="submit" disabled={isLoading}>{isLoading ? "Thinking..." : "Create my recipe ->"}</Button></form></div>{recipe && <RecipeCard recipe={recipe} />}</main>;
}