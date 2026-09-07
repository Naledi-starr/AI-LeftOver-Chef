/**
 * Recipe Results section.
 * Displays the AI-generated recipe after the user submits ingredients.
 */

import { motion } from "framer-motion";
import { Clock, Flame, Users, ChefHat } from "lucide-react";
import type { Recipe } from "../../types/recipe";

interface RecipeResultsProps {
  recipe?: Recipe | null;
  isVisible: boolean;
}

function RecipeResults({ recipe, isVisible }: RecipeResultsProps) {
  if (!isVisible || !recipe) return null;

  return (
    <section
      id="recipe-results"
      className="relative overflow-hidden bg-cream px-6 pb-24 pt-8 md:px-12 lg:px-20 lg:pb-32"
    >
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="rounded-[2rem] border border-forest/10 bg-white p-6 shadow-xl shadow-forest/5 sm:p-8 md:p-10"
        >
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-leaf">
                Your recipe
              </p>
              <h3 className="font-display text-3xl leading-tight text-forest sm:text-4xl">
                {recipe.title}
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
                {recipe.description}
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold/20 text-forest">
              <ChefHat size={26} />
            </div>
          </div>

          {/* Meta row */}
          <div className="mb-10 flex flex-wrap gap-6 border-y border-forest/10 py-5 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-forest" />
              <span>{recipe.cooking_time_minutes} min</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-forest" />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-forest" />
              <span>AI generated</span>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
            {/* Ingredients */}
            <div>
              <h4 className="mb-4 font-display text-xl text-forest">
                Ingredients
              </h4>
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

            {/* Steps */}
            <div>
              <h4 className="mb-4 font-display text-xl text-forest">
                Method
              </h4>
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

        </motion.div>
      </div>
    </section>
  );
}

export default RecipeResults;