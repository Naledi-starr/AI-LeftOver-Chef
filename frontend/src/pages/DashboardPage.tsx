/**
 * Dashboard page — the landing page for logged-in users.
 *
 * Intentionally minimal for now. Pantry, saved recipes, and shopping
 * list summaries will be added here as those pages are built.
 */

import { Link } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-cream px-6 py-12 md:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 text-lg font-bold text-forest"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-sm font-black text-forest">
              AL
            </span>
            <span>leftover chef</span>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-forest/20 bg-white px-5 py-2.5 text-sm font-semibold text-forest transition hover:border-forest hover:bg-forest hover:text-white"
          >
            Log out
          </button>
        </header>

        <section className="mt-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-leaf">
            Dashboard
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-forest sm:text-5xl">
            Welcome back{user ? `, ${user.email.split("@")[0]}` : ""}.
          </h1>
        </section>
      </div>
    </main>
  );
}

export default DashboardPage;