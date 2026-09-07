/**
 * Ingredient Input + AI Recipe Generator section.
 * This is the core interactive part of the product.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles, X } from "lucide-react";

import { generateRecipe } from "../../services/api";
import type { Recipe } from "../../types/recipe";

const dietaryOptions = ["None", "Vegetarian", "Vegan", "High Protein"] as const;
const timeOptions = ["≤15 min", "≤30 min", "≤45 min", "Any"] as const;

type Dietary = (typeof dietaryOptions)[number];
type Time = (typeof timeOptions)[number];

interface IngredientGeneratorProps {
  onGenerate: (recipe: Recipe) => void;
}

function IngredientGenerator({ onGenerate }: IngredientGeneratorProps) {
  const [ingredients, setIngredients] = useState<string[]>([
    "carrots",
    "tomatoes",
    "eggs",
  ]);
  const [inputValue, setInputValue] = useState("");
  const [dietary, setDietary] = useState<Dietary>("None");
  const [time, setTime] = useState<Time>("≤30 min");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addIngredient() {
    const trimmed = inputValue.trim().toLowerCase();
    if (!trimmed) return;
    if (ingredients.includes(trimmed)) {
      setInputValue("");
      return;
    }
    setIngredients((prev) => [...prev, trimmed]);
    setInputValue("");
  }

  function removeIngredient(item: string) {
    setIngredients((prev) => prev.filter((i) => i !== item));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient();
    }
  }

  async function handleGenerate() {
    if (ingredients.length === 0) return;

    setIsGenerating(true);
    setError(null);

    try {
      const recipe = await generateRecipe({
        ingredients,
        dietary_preferences: dietary === "None" ? undefined : dietary,
        servings: 2,
      });

      onGenerate(recipe);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We could not create a recipe right now.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section
      id="generator"
      className="relative overflow-hidden bg-cream px-6 py-24 md:px-12 lg:px-20 lg:py-32"
    >
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-leaf">
            Recipe Generator
          </p>

          <h2 className="font-display text-5xl leading-[0.95] tracking-tight text-forest sm:text-6xl md:text-7xl">
            WHAT'S IN YOUR
            <br />
            <span className="italic text-tomato">KITCHEN?</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Tell us what ingredients you already have. We’ll turn them into a
            recipe worth cooking.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-14 rounded-[2rem] border border-forest/10 bg-white p-6 shadow-xl shadow-forest/5 sm:p-8 md:p-10"
        >
          {/* Ingredients */}
          <div>
            <label className="mb-3 block text-sm font-semibold text-forest">
              Ingredients
            </label>

            <div className="mb-4 flex flex-wrap gap-2">
              {ingredients.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full bg-forest/5 px-4 py-2 text-sm font-medium text-forest"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeIngredient(item)}
                    className="rounded-full p-0.5 transition hover:bg-forest/10"
                    aria-label={`Remove ${item}`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add an ingredient..."
                className="flex-1 rounded-full border border-forest/15 bg-cream/50 px-5 py-3.5 text-sm outline-none transition focus:border-forest/40 focus:bg-white"
              />
              <button
                type="button"
                onClick={addIngredient}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-white transition hover:bg-forest/90"
                aria-label="Add ingredient"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="mt-8">
            <label className="mb-3 block text-sm font-semibold text-forest">
              Dietary preferences
            </label>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDietary(option)}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                    dietary === option
                      ? "bg-forest text-white"
                      : "bg-forest/5 text-forest hover:bg-forest/10"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Cooking Time */}
          <div className="mt-8">
            <label className="mb-3 block text-sm font-semibold text-forest">
              Cooking time
            </label>
            <div className="flex flex-wrap gap-2">
              {timeOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTime(option)}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                    time === option
                      ? "bg-tomato text-white"
                      : "bg-tomato/5 text-tomato hover:bg-tomato/10"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          {error && (
            <p className="mt-6 text-center text-sm text-tomato" role="alert">
              {error}
            </p>
          )}

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={ingredients.length === 0 || isGenerating}
              className="group flex items-center gap-3 rounded-full bg-forest px-10 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
            >
              {isGenerating ? (
                <>
                  <Sparkles size={18} className="animate-spin" />
                  Creating your recipe...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Create my recipe
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default IngredientGenerator;