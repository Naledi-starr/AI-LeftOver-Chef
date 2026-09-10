/**
 * Fallback page shown for any route that doesn't match.
 */

import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-leaf">
        404
      </p>

      <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-forest sm:text-6xl">
        NOTHING
        <br />
        <span className="italic text-tomato">COOKING</span> HERE.
      </h1>

      <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-gray-600">
        The page you're looking for doesn't exist. Let's get you back to the
        kitchen.
      </p>

      <Link
        to="/"
        className="mt-10 rounded-full bg-forest px-8 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
      >
        Back to home
      </Link>
    </main>
  );
}

export default NotFoundPage;
