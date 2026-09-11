/**
 * Saved recipes page.
 *
 * Lists the current user's saved recipes, with a toggle to filter down
 * to favourites only. Doubles as the checklist's "favourites page" —
 * favouriting is just a filtered view of the same list.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Star, Trash2, Users } from "lucide-react";

import AppHeader from "../components/layout/AppHeader";
import { useAuth } from "../hooks/useAuth";
import {
  deleteSavedRecipe,
  listSavedRecipes,
  updateSavedRecipe,
} from "../services/api";
import type { SavedRecipe } from "../types/savedRecipe";

function SavedRecipesPage() {
  const { token } = useAuth();

  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    if (!token) return;

    setIsLoading(true);
    listSavedRecipes(token, favoritesOnly)
      .then(setRecipes)
      .catch(() => setError("We couldn't load your recipes."))
      .finally(() => setIsLoading(false));
  }, [token, favoritesOnly]);

  async function toggleFavorite(recipe: SavedRecipe) {
    if (!token) return;

    try {
      const updated = await updateSavedRecipe(token, recipe.id, {
        is_favorite: !recipe.is_favorite,
      });
      setRecipes((prev) =>
        favoritesOnly && !updated.is_favorite
          ? prev.filter((r) => r.id !== recipe.id)
          : prev.map((r) => (r.id === recipe.id ? updated : r)),
      );
    } catch {
      setError("We couldn't update that recipe.");
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;

    try {
      await deleteSavedRecipe(token, id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError("We couldn't remove that recipe.");
    }
  }

  return (
    <main className="min-h-screen bg-cream px-6 py-12 md:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <AppHeader />

        <section className="mt-14 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-leaf">
              Saved recipes
            </p>
            <h1 className="mt-2 font-display text-4xl leading-tight text-forest sm:text-5xl">
              Your recipe box.
            </h1>
          </div>

          <div className="flex rounded-full border border-forest/10 bg-white p-1">
            <button
              type="button"
              onClick={() => setFavoritesOnly(false)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                !favoritesOnly ? "bg-forest text-white" : "text-forest/70"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFavoritesOnly(true)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                favoritesOnly ? "bg-forest text-white" : "text-forest/70"
              }`}
            >
              Favourites
            </button>
          </div>
        </section>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl bg-tomato/10 px-4 py-3 text-sm font-medium text-tomato"
          >
            {error}
          </p>
        )}

        <section className="mt-8">
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading your recipes…</p>
          ) : recipes.length === 0 ? (
            <p className="text-sm text-gray-500">
              {favoritesOnly
                ? "No favourites yet — star a recipe to see it here."
                : "You haven't saved any recipes yet. Generate one from the home page and save it."}
            </p>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2">
              {recipes.map((recipe) => (
                <li
                  key={recipe.id}
                  className="rounded-3xl border border-forest/10 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      to={`/recipes/${recipe.id}`}
                      className="font-display text-xl leading-tight text-forest hover:underline"
                    >
                      {recipe.title}
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(recipe)}
                      aria-label={
                        recipe.is_favorite
                          ? "Remove from favourites"
                          : "Add to favourites"
                      }
                      className="shrink-0 rounded-full p-1.5 text-gold transition hover:bg-gold/20"
                    >
                      <Star
                        size={20}
                        fill={recipe.is_favorite ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
                    {recipe.description}
                  </p>

                  <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} /> {recipe.cooking_time_minutes} min
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users size={14} /> {recipe.servings} servings
                    </span>
                    {recipe.rating && (
                      <span className="flex items-center gap-1.5 text-gold">
                        {"★".repeat(recipe.rating)}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <Link
                      to={`/recipes/${recipe.id}`}
                      className="text-sm font-semibold text-forest underline"
                    >
                      View recipe
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(recipe.id)}
                      aria-label={`Delete ${recipe.title}`}
                      className="rounded-full p-2 text-tomato/60 transition hover:bg-tomato/10 hover:text-tomato"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default SavedRecipesPage;