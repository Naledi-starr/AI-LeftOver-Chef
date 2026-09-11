/**
 * Recipe detail page.
 */

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, ShoppingCart, Star, Trash2, Users } from "lucide-react";

import AppHeader from "../components/layout/AppHeader";
import { useAuth } from "../hooks/useAuth";
import {
  addMissingIngredientsFromRecipe,
  deleteSavedRecipe,
  getSavedRecipe,
  updateSavedRecipe,
} from "../services/api";
import type { SavedRecipe } from "../types/savedRecipe";

function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<SavedRecipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isAddingToList, setIsAddingToList] = useState(false);

  useEffect(() => {
    if (!token || !id) return;

    getSavedRecipe(token, Number(id))
      .then((data) => {
        setRecipe(data);
        setFeedback(data.feedback ?? "");
      })
      .catch(() => setError("We couldn't find that recipe."))
      .finally(() => setIsLoading(false));
  }, [token, id]);

  async function handleToggleFavorite() {
    if (!token || !recipe) return;
    const updated = await updateSavedRecipe(token, recipe.id, {
      is_favorite: !recipe.is_favorite,
    });
    setRecipe(updated);
  }

  async function handleRate(rating: number) {
    if (!token || !recipe) return;
    const updated = await updateSavedRecipe(token, recipe.id, { rating });
    setRecipe(updated);
  }

  async function handleSaveFeedback() {
    if (!token || !recipe) return;
    const updated = await updateSavedRecipe(token, recipe.id, { feedback });
    setRecipe(updated);
    setNotice("Feedback saved.");
  }

  async function handleDelete() {
    if (!token || !recipe) return;
    await deleteSavedRecipe(token, recipe.id);
    navigate("/recipes", { replace: true });
  }

  async function handleAddMissingToShoppingList() {
    if (!token || !recipe) return;
    setIsAddingToList(true);
    try {
      const added = await addMissingIngredientsFromRecipe(token, recipe.id);
      setNotice(
        added.length > 0
          ? `Added ${added.length} ingredient${added.length === 1 ? "" : "s"} to your shopping list.`
          : "Everything's already in your pantry or on your list.",
      );
    } catch {
      setError("We couldn't update your shopping list.");
    } finally {
      setIsAddingToList(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-cream px-6 py-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-4xl">
          <AppHeader />
          <p className="mt-14 text-sm text-gray-500">Loading recipe…</p>
        </div>
      </main>
    );
  }

  if (error || !recipe) {
    return (
      <main className="min-h-screen bg-cream px-6 py-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-4xl">
          <AppHeader />
          <p className="mt-14 rounded-xl bg-tomato/10 px-4 py-3 text-sm font-medium text-tomato">
            {error ?? "Recipe not found."}
          </p>
          <Link
            to="/recipes"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-forest underline"
          >
            <ArrowLeft size={15} /> Back to saved recipes
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream px-6 py-12 md:px-12 lg:px-20">
      <div className="mx-auto max-w-4xl">
        <AppHeader />

        <Link
          to="/recipes"
          className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-forest/70 hover:text-forest"
        >
          <ArrowLeft size={15} /> Back to saved recipes
        </Link>

        <div className="mt-6 rounded-[2rem] border border-forest/10 bg-white p-6 shadow-xl shadow-forest/5 sm:p-8 md:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl leading-tight text-forest sm:text-4xl">
                {recipe.title}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-600">
                {recipe.description}
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleFavorite}
              aria-label={
                recipe.is_favorite ? "Remove from favourites" : "Add to favourites"
              }
              className="shrink-0 rounded-full p-2 text-gold transition hover:bg-gold/20"
            >
              <Star size={26} fill={recipe.is_favorite ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6 border-y border-forest/10 py-5 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <Clock size={16} className="text-forest" />
              {recipe.cooking_time_minutes} min
            </span>
            <span className="flex items-center gap-2">
              <Users size={16} className="text-forest" />
              {recipe.servings} servings
            </span>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRate(value)}
                  aria-label={`Rate ${value} star${value === 1 ? "" : "s"}`}
                  className="text-gold"
                >
                  <Star
                    size={16}
                    fill={
                      recipe.rating && value <= recipe.rating
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddMissingToShoppingList}
              disabled={isAddingToList}
              className="ml-auto flex items-center gap-2 rounded-full bg-forest/10 px-4 py-2 text-sm font-semibold text-forest transition hover:bg-forest hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShoppingCart size={15} />
              {isAddingToList ? "Adding…" : "Add missing ingredients to list"}
            </button>
          </div>

          {notice && (
            <p className="mt-4 rounded-xl bg-leaf/10 px-4 py-3 text-sm font-medium text-leaf">
              {notice}
            </p>
          )}

          <div className="mt-8 grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="mb-4 font-display text-xl text-forest">
                Ingredients
              </h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-gray-700"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tomato" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-4 font-display text-xl text-forest">Method</h2>
              <ol className="space-y-5">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <p className="pt-0.5 text-sm leading-relaxed text-gray-700">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-10 border-t border-forest/10 pt-6">
            <label className="mb-2 block text-sm font-semibold text-forest">
              Your notes
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              placeholder="What worked, what you'd change next time…"
              className="w-full rounded-xl border border-forest/15 px-4 py-3 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
            />
            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={handleSaveFeedback}
                className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Save notes
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-sm font-semibold text-tomato/80 hover:text-tomato"
              >
                <Trash2 size={15} /> Delete recipe
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RecipeDetailPage;