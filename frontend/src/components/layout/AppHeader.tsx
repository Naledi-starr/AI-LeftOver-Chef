/**
 * Shared top navigation for authenticated pages (dashboard, pantry,
 * shopping list, saved recipes).
 */

import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/pantry", label: "Pantry" },
  { to: "/shopping-list", label: "Shopping list" },
  { to: "/recipes", label: "Saved recipes" },
];

function AppHeader() {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <Link
        to="/"
        className="flex items-center gap-3 text-lg font-bold text-forest"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-sm font-black text-forest">
          AL
        </span>
        <span>leftover chef</span>
      </Link>

      <nav
        className="flex flex-wrap items-center gap-1 rounded-full border border-forest/10 bg-white/70 p-1"
        aria-label="Account navigation"
      >
        {NAV_LINKS.map((link) => {
          const isActive = location.pathname.startsWith(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-forest text-white"
                  : "text-forest/70 hover:bg-forest/10"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="rounded-full border border-forest/20 bg-white px-5 py-2.5 text-sm font-semibold text-forest transition hover:border-forest hover:bg-forest hover:text-white"
      >
        Log out
      </button>
    </header>
  );
}

export default AppHeader;