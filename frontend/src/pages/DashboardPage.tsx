/**
 * Dashboard page — the landing page for logged-in users.
 */

import { Link } from "react-router-dom";
import { ClipboardList, ShoppingBasket, BookHeart } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import AppHeader from "../components/layout/AppHeader";

const SECTIONS = [
  {
    to: "/pantry",
    icon: ClipboardList,
    title: "Pantry",
    description: "Track what you have on hand and catch things before they expire.",
  },
  {
    to: "/shopping-list",
    icon: ShoppingBasket,
    title: "Shopping list",
    description: "Build a list, mark items purchased, and move them into your pantry.",
  },
  {
    to: "/recipes",
    icon: BookHeart,
    title: "Saved recipes",
    description: "Revisit recipes you've saved, rate them, and mark favourites.",
  },
];

function DashboardPage() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-cream px-6 py-12 md:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <AppHeader />

        <section className="mt-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-leaf">
            Dashboard
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-forest sm:text-5xl">
            Welcome back{user ? `, ${user.email.split("@")[0]}` : ""}.
          </h1>
        </section>

        <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map(({ to, icon: Icon, title, description }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-3xl border border-forest/10 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/20 text-forest transition group-hover:bg-forest group-hover:text-white">
                <Icon size={22} />
              </div>
              <h2 className="font-display text-xl text-forest">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {description}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}

export default DashboardPage;