/**
 * Home page for AI Leftover Chef.
 *
 * This page introduces the product through a premium editorial-style
 * hero section and guides users toward recipe generation.
 */

import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import Navbar from "../components/layout/Navbar";
import heroFood from "../assets/images/hero-food.jpg";
import HowItWorks from "../components/home/HowItWorks";
import { useState } from "react";
import IngredientGenerator from "../components/home/IngredientGenerator";
import RecipeResults from "../components/home/RecipeResults";
import type { Recipe } from "../types/recipe";

function HomePage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  /**
   * Scrolls the user to the recipe generator section.
   */
  function scrollToGenerator() {
    document
      .getElementById("generator")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }


  /**
   * Scrolls the user to the "How It Works" section.
   */
  function scrollToHowItWorks() {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }


  return (
    <main className="min-h-screen overflow-hidden bg-cream">

      {/* Hero Section */}
      <section className="relative px-6 pb-20 pt-6 md:px-12 lg:px-20 lg:pb-28">

        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-leaf/20 blur-3xl" />


        <div className="relative mx-auto max-w-7xl">

          <Navbar onStart={scrollToGenerator} />


          {/* Hero Content */}
          <div className="grid min-h-[780px] items-center gap-14 py-16 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:py-20">


            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >

              {/* AI Label */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-leaf/20 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-leaf backdrop-blur-sm">
                <Sparkles size={15} />
                AI-powered cooking
              </div>


              {/* Main Heading */}
              <h1 className="max-w-3xl font-display text-6xl leading-[0.92] tracking-tight text-forest sm:text-7xl md:text-8xl lg:text-[5.5rem]">

                TURN WHAT
                <br />

                YOU HAVE INTO
                <br />

                <span className="italic text-tomato">
                  SOMETHING
                </span>

                <br />

                DELICIOUS.

              </h1>


              {/* Description */}
              <p className="mt-8 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">

                Your kitchen is full of possibilities. Tell AI Leftover
                Chef what ingredients you already have, and we'll help you
                transform them into something worth sitting down for.

              </p>


              {/* Buttons */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">

                <button
                  type="button"
                  onClick={scrollToGenerator}
                  className="group flex items-center justify-center gap-3 rounded-full bg-forest px-8 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  Create a recipe

                  <ArrowRight
                    size={19}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />

                </button>


                <button
                  type="button"
                  onClick={scrollToHowItWorks}
                  className="rounded-full border border-forest/20 bg-white/50 px-8 py-4 font-semibold text-forest transition duration-300 hover:border-forest hover:bg-forest hover:text-white"
                >
                  Discover how it works
                </button>

              </div>


              {/* Small Feature Details */}
              <div className="mt-14 flex flex-wrap gap-x-8 gap-y-4 border-t border-forest/10 pt-7 text-sm text-gray-500">

                <span>
                  <strong className="text-forest">01.</strong>
                  {" "}Use what you have
                </span>

                <span>
                  <strong className="text-forest">02.</strong>
                  {" "}Reduce food waste
                </span>

                <span>
                  <strong className="text-forest">03.</strong>
                  {" "}Discover new meals
                </span>

              </div>

            </motion.div>


            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 0.2,
              }}
              className="relative mx-auto w-full max-w-xl"
            >

              {/* Main Image Frame */}
              <div className="relative overflow-hidden rounded-[2.5rem]">

                <img
                  src={heroFood}
                  alt="Fresh ingredients prepared for cooking"
                  className="h-[580px] w-full object-cover"
                />


                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest/40 via-transparent to-transparent" />

              </div>


              {/* Floating AI Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.8,
                }}
                className="absolute -bottom-7 -left-5 max-w-[240px] rounded-2xl border border-white/50 bg-white/90 p-5 shadow-xl backdrop-blur-md sm:-left-10"
              >

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-leaf">
                  Smart cooking
                </p>

                <p className="mt-2 font-display text-xl leading-tight text-forest">
                  Ingredients in.
                  <br />
                  Inspiration out.
                </p>

              </motion.div>


              {/* Small Vertical Label */}
              <div className="absolute -right-3 top-10 hidden -rotate-90 rounded-full bg-gold px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-forest lg:block">
                Made with what you have
              </div>

            </motion.div>

          </div>

        </div>

      </section>
      {/* How It Works */}
      <HowItWorks />

      {/* Ingredient Generator */}
      <IngredientGenerator onGenerate={setRecipe} />

      {/* Recipe Results */}
      <RecipeResults recipe={recipe} isVisible={recipe !== null} />

    </main>
  );
}


export default HomePage;